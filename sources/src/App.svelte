<script>
  import { onMount } from 'svelte';
  import { geoNaturalEarth1, geoMercator, geoPath, geoArea } from 'd3-geo';
  import { feature, mesh } from 'topojson-client';
  import polylabel from 'polylabel';
  import MONDE from '../donnees/monde.json';
  import CARAIBES from '../donnees/caraibes.json';
  import EUROPE from '../donnees/europe.json';
  import { T, PROJETS, IDX, annees } from './textes.js';

  /* ------------------------------------------------------------------
     Fonds de carte : terres, frontières, pays (une fois pour toutes)
     ------------------------------------------------------------------ */
  // mapshaper peut inverser le sens de certains anneaux (pays à cheval sur l'antiméridien) : on les remet à l'endroit
  function redresser(fc) {
    const polys = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);
    for (const f of fc.features || [fc]) {
      const g = f.geometry || f;
      for (const poly of polys(g)) {
        if (geoArea({ type: 'Polygon', coordinates: poly }) > 2 * Math.PI) poly.forEach((r) => r.reverse());
      }
    }
    return fc;
  }
  const prep = (topo) => ({
    terre: redresser(feature(topo, topo.objects.land)),
    frontieres: mesh(topo, topo.objects.countries, (a, b) => a !== b),
    pays: feature(topo, topo.objects.countries).features
  });
  const FONDS = { m: prep(MONDE), c: prep(CARAIBES), e: prep(EUROPE) };
  // emprises des agrandissements (lon ouest, lon est, lat sud, lat nord)
  const EMPRISES = { c: [-92, -68, 7.6, 27.4], e: [-3, 22.5, 42.3, 60.2] };
  const EMPRISES_ETROIT = { c: [-90.6, -68.6, 7.6, 27.4], e: [-3, 22.5, 42.3, 60.2] };
  const GAP = 10;

  let cw = 0;
  let polices = false;
  let L = null;
  let sel = null; // projet survolé ou touché

  $: etroit = cw > 0 && cw < 600;
  $: if (cw > 0 && polices) L = calculer(cw);

  /* mesure du texte (polices du Grand Continent chargées) */
  let ctx;
  function largeur(t, fs, poids = 500, espace = 0, italique = false) {
    ctx = ctx || document.createElement('canvas').getContext('2d');
    ctx.font = `${italique ? 'italic ' : ''}${poids} ${fs}px National, "Libre Franklin", Arial, sans-serif`;
    return ctx.measureText(t).width + espace * t.length;
  }

  /* ------------------------------------------------------------------
     Géométrie utilitaire
     ------------------------------------------------------------------ */
  const recouvre = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  function decoupe(anneau, x0, y0, x1, y1) {
    // Sutherland-Hodgman sur un rectangle
    const bords = [(p) => p[0] >= x0, (p) => p[0] <= x1, (p) => p[1] >= y0, (p) => p[1] <= y1];
    const inter = (a, b, k) => {
      const v = [x0, x1, y0, y1][k], i = k < 2 ? 0 : 1, t = (v - a[i]) / (b[i] - a[i]);
      return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
    };
    let out = anneau;
    bords.forEach((dedans, k) => {
      const src = out; out = [];
      for (let j = 0; j < src.length; j++) {
        const a = src[j], b = src[(j + 1) % src.length];
        if (dedans(b)) { if (!dedans(a)) out.push(inter(a, b, k)); out.push(b); }
        else if (dedans(a)) out.push(inter(a, b, k));
      }
    });
    return out;
  }
  const aire = (r) => { let s = 0; for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s / 2); };

  /* ------------------------------------------------------------------
     Mise en page : trois panneaux, étiquettes placées sans chevauchement
     ------------------------------------------------------------------ */
  function calculer(W) {
    const e = W < 600;
    const fs = e ? 11.5 : 12.5;
    // monde : Natural Earth, recadré entre 76° N et 50° S
    const pm = geoNaturalEarth1().rotate([-10, 0]).fitWidth(W, { type: 'Sphere' });
    const yN = pm([10, 76])[1], yS = pm([10, -50])[1];
    const [tx, ty] = pm.translate();
    pm.translate([tx, ty - yN]);
    const Hm = Math.round(yS - yN);
    let pan;
    if (e) {
      const Hc = Math.round(W * 0.84), He = Math.round(W * 0.8);
      pan = { m: { x: 0, y: 0, w: W, h: Hm }, c: { x: 0, y: Hm + GAP, w: W, h: Hc }, e: { x: 0, y: Hm + GAP + Hc + GAP, w: W, h: He } };
    } else {
      const Hi = Math.max(260, Math.round(W / 1.4) - Hm - GAP), Wi = (W - GAP) / 2;
      pan = { m: { x: 0, y: 0, w: W, h: Hm }, c: { x: 0, y: Hm + GAP, w: Wi, h: Hi }, e: { x: Wi + GAP, y: Hm + GAP, w: Wi, h: Hi } };
    }
    const H = Math.max(...Object.values(pan).map((p) => p.y + p.h));
    pan.m.proj = pm;
    for (const k of ['c', 'e']) {
      const [o, est, s, n] = (e ? EMPRISES_ETROIT : EMPRISES)[k], P = pan[k];
      P.proj = geoMercator().fitExtent([[18, 30], [P.w - 18, P.h - 22]], { type: 'MultiPoint', coordinates: [[o, s], [est, n]] });
    }

    const sortie = {};
    for (const k of ['m', 'c', 'e']) {
      const P = pan[k], proj = P.proj, path = geoPath(proj), F = FONDS[k];
      const obst = [];
      // titre de l'agrandissement
      let titre = null;
      if (k !== 'm') {
        const t = T.panneaux[k].toUpperCase();
        titre = { t, x: 12, y: 19 };
        obst.push({ x: 8, y: 6, w: largeur(t, 10.5, 600, 1.6) + 8, h: 18 });
      }
      // échelle
      let echelle = null;
      if (k !== 'm') {
        const c = proj.invert([P.w / 2, P.h / 2]);
        const pxkm = proj.scale() / (6371 * Math.cos((c[1] * Math.PI) / 180));
        echelle = { km: 500, l: 500 * pxkm };
        obst.push({ x: 6, y: P.h - 26, w: Math.max(echelle.l, 44) + 10, h: 24 });
      }
      // mers
      const mers = (k === 'm' && e ? [] : T.mers[k] || []).map(([lon, lat, l]) => {
        const [x, y] = proj([lon, lat]);
        const w = Math.max(...l.map((s) => largeur(s, 12, 400, 0, true)));
        return { x, y, l, r: { x: x - w / 2, y: y - 11, w, h: 30 } };
      }).filter((m) => m.r.x > 4 && m.r.x + m.r.w < P.w - 4 && m.r.y > 4 && m.r.y + m.r.h < P.h - 4);
      mers.forEach((m) => obst.push(m.r));
      // projets du panneau
      const pts = PROJETS.filter((p) => p.p === k).map((p) => {
        const [x, y] = proj([p.lon, p.lat]);
        return { p, x, y, nom: p.nom[IDX], etiq: e && p.court ? p.court : p.nom[IDX] };
      });
      pts.forEach((q) => obst.push({ x: q.x - 6.5, y: q.y - 6.5, w: 13, h: 13 }));
      // sur la carte du monde, les projets des agrandissements figurent aussi, sans étiquette
      const pts2 = k !== 'm' ? [] : PROJETS.filter((p) => p.p !== 'm').map((p) => {
        const [x, y] = proj([p.lon, p.lat]);
        return { p, x, y, nom: p.nom[IDX], mini: true };
      });
      pts2.forEach((q) => obst.push({ x: q.x - 4.5, y: q.y - 4.5, w: 9, h: 9 }));
      // pays : point le plus éloigné des bords dans l'intersection pays × cadre
      const pays = [];
      const noms = (T.pays[k]) || {};
      for (const f of F.pays) {
        const nom = noms[+f.id];
        if (!nom) continue;
        const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
        let best = null;
        for (const poly of polys) {
          const r = decoupe(poly[0].map((c) => proj(c)), 12, 30, P.w - 12, P.h - 12);
          if (r.length < 3) continue;
          const a = aire(r);
          if (!best || a > best.a) best = { a, r };
        }
        if (!best) continue;
        const pl = polylabel([best.r], 1);
        const t = nom.toUpperCase();
        const w = largeur(t, 10.5, 500, 2.2);
        const rect = { x: pl[0] - w / 2, y: pl[1] - 8, w, h: 12 };
        if (pl.distance < 9 || w > best.a / 12) continue; // pays trop petit dans le cadre
        if (rect.x < 6 || rect.x + rect.w > P.w - 6) continue;
        if (pts.some((q) => recouvre(rect, { x: q.x - 9, y: q.y - 9, w: 18, h: 18 }) > 0)) continue;
        if (obst.some((o) => recouvre(rect, o) > 0)) continue;
        pays.push({ t, x: pl[0], y: pl[1] + 3.7, rect });
        obst.push(rect);
      }
      // étiquettes des projets : on essaie huit positions et on garde la meilleure
      const h = fs * 1.15;
      const places = [];
      const ordre = pts.slice().sort((a, b) => voisins(b, pts) - voisins(a, pts));
      for (const q of ordre) {
        const w = largeur(q.etiq, fs, 500);
        const cand = [
          ['start', q.x + 9, q.y - h / 2], ['end', q.x - 9 - w, q.y - h / 2],
          ['start', q.x + 5, q.y - 6 - h], ['start', q.x + 5, q.y + 6],
          ['end', q.x - 5 - w, q.y - 6 - h], ['end', q.x - 5 - w, q.y + 6],
          ['middle', q.x - w / 2, q.y - 9 - h], ['middle', q.x - w / 2, q.y + 9]
        ];
        let meilleur = null;
        cand.forEach(([ancre, x, y], i) => {
          const r = { x, y, w, h };
          const dehors = Math.max(0, 6 - x) + Math.max(0, x + w - (P.w - 6)) + Math.max(0, 6 - y) + Math.max(0, y + h - (P.h - 6));
          let cout = dehors * 1000 + i * 2;
          for (const o of obst) cout += recouvre(r, o) * 4;
          for (const o of places) cout += recouvre(r, o.r) * 20;
          // une étiquette doit être plus proche de son point que de tout autre
          const dr = (o) => Math.hypot(Math.max(r.x - o.x, 0, o.x - r.x - w), Math.max(r.y - o.y, 0, o.y - r.y - h));
          const dq = dr(q);
          for (const o of pts) if (o !== q && dr(o) < dq + 4) cout += 60;
          // sa propre marque n'est pas un obstacle
          cout -= recouvre(r, { x: q.x - 6.5, y: q.y - 6.5, w: 13, h: 13 }) * 4;
          if (!meilleur || cout < meilleur.cout) meilleur = { cout, r, ancre };
        });
        places.push({ q, r: meilleur.r, t: q.etiq });
      }
      // un nom de pays qui gêne une étiquette de projet s'efface
      const paysOk = pays.filter((c) => !places.some((o) => recouvre({ x: c.rect.x - 4, y: c.rect.y - 3, w: c.rect.w + 8, h: c.rect.h + 6 }, o.r) > 0));
      pays.length = 0; pays.push(...paysOk);
      const cadres = [];
      sortie[k] = { ...P, pts2, path, terre: path(F.terre), frontieres: path(F.frontieres), mers, pays, pts, places, titre, echelle, cadres, fs };
    }
    for (const k of ['c', 'e']) {
      const P = pan[k], inv = (x, y) => P.proj.invert([x, y]);
      const a = inv(0, 0), b = inv(P.w, P.h);
      const ring = [];
      for (let i = 0; i <= 10; i++) ring.push([a[0] + ((b[0] - a[0]) * i) / 10, a[1]]);
      for (let i = 0; i <= 10; i++) ring.push([b[0], a[1] + ((b[1] - a[1]) * i) / 10]);
      for (let i = 0; i <= 10; i++) ring.push([b[0] - ((b[0] - a[0]) * i) / 10, b[1]]);
      for (let i = 0; i <= 10; i++) ring.push([a[0], b[1] - ((b[1] - a[1]) * i) / 10]);
      sortie.m.cadres.push('M' + ring.map((c) => pan.m.proj(c).map((v) => v.toFixed(1)).join(',')).join('L') + 'Z');
    }
    return { W, H, P: sortie };
  }
  function voisins(q, pts) { return pts.filter((o) => o !== q && Math.hypot(o.x - q.x, o.y - q.y) < 70).length; }

  /* infobulle */
  let scene;
  function montrer(q, k, ev) {
    const P = L.P[k];
    sel = { q, x: P.x + q.x, y: P.y + q.y };
    if (ev) ev.stopPropagation();
  }
  $: bulle = sel && L ? placerBulle(sel) : null;
  function placerBulle(s) {
    const w = Math.min(250, L.W - 16);
    let x = s.x + 14, y = s.y - 12;
    if (x + w > L.W - 4) x = s.x - 14 - w;
    if (x < 4) x = Math.max(4, Math.min(L.W - w - 4, s.x - w / 2));
    if (y + 80 > L.H) y = s.y - 84;
    if (y < 2) y = 2;
    return { x, y, w };
  }

  onMount(() => {
    document.fonts.ready.then(() => (polices = true));
    setTimeout(() => (polices = true), 1500);
    const fermer = () => (sel = null);
    document.addEventListener('click', fermer);
    return () => document.removeEventListener('click', fermer);
  });
</script>

<main class="bloc">
  <header class="tete">
    <h1>{T.titre}</h1>
    <p class="chapo">{T.chapo}</p>
  </header>

  <ul class="cle" aria-label="Clé de lecture">
    <li><svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><circle cx="9" cy="7" r="5" fill="#dd203c" stroke="#fff" stroke-width="1.2"/></svg>{T.cle[0]}</li>
    <li><svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><circle cx="9" cy="7" r="4.6" fill="#fff" stroke="#6e6e73" stroke-width="1.4"/></svg>{T.cle[1]}</li>
    <li><svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><path d="M9 1.3 L14.7 7 L9 12.7 L3.3 7 Z" fill="#dd203c" stroke="#fff" stroke-width="1.2"/></svg>{T.cle[2]}</li>
    <li><svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><path d="M9 1.8 L14.2 7 L9 12.2 L3.8 7 Z" fill="#fff" stroke="#6e6e73" stroke-width="1.4"/></svg>{T.cle[3]}</li>
  </ul>

  <div class="scene" bind:this={scene} bind:clientWidth={cw} style="height:{L ? L.H : cw / 1.4}px" role="img" aria-label={T.carte}>
    {#if L}
      {#each ['m', 'c', 'e'] as k}
        {@const P = L.P[k]}
        <div class="panneau" style="left:{P.x}px;top:{P.y}px;width:{P.w}px;height:{P.h}px">
          <svg class="couche" width={P.w} height={P.h} viewBox="0 0 {P.w} {P.h}" aria-hidden="true">
            <defs><filter id="rivage{k}" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={k === 'm' ? 3 : 5.5} /></filter></defs>
            <path d={P.terre} class="rivage" stroke-width={k === 'm' ? 5 : 11} filter="url(#rivage{k})" />
            <path d={P.terre} class="terre" />
            <path d={P.frontieres} class="frontiere-halo" stroke-width={k === 'm' ? 2.5 : 4} />
            <path d={P.frontieres} class="frontiere" stroke-width={k === 'm' ? 0.5 : 0.8} />
            {#each P.cadres as d}<path {d} class="cadre" />{/each}
          </svg>
          <div class="voile"></div>
          <svg class="couche textes" width={P.w} height={P.h} viewBox="0 0 {P.w} {P.h}">
            {#each P.mers as m}
              <text class="mer" text-anchor="middle" font-size="12">{#each m.l as l, j}<tspan x={m.x.toFixed(1)} y={(m.y + j * 14).toFixed(1)}>{l}</tspan>{/each}</text>
            {/each}
            {#each P.pays as p}
              <text class="pays" x={p.x.toFixed(1)} y={p.y.toFixed(1)} text-anchor="middle" font-size="10.5" letter-spacing="2.2">{p.t}</text>
            {/each}
            {#if P.titre}<text class="titre-panneau" x={P.titre.x} y={P.titre.y} font-size="10.5" letter-spacing="1.6">{P.titre.t}</text>{/if}
            {#each P.places as e}
              <text class="nom" class:actif={sel && sel.q === e.q} x={e.r.x.toFixed(1)} y={(e.r.y + e.r.h * 0.8).toFixed(1)} font-size={P.fs}>{e.t}</text>
            {/each}
            {#each [...P.pts2, ...P.pts] as q}
              <g class="projet" class:vif={q.p.vif} class:mini={q.mini} transform="translate({q.x.toFixed(1)} {q.y.toFixed(1)})"
                 role="button" tabindex="0" aria-label="{q.nom}, {q.p.lieu[IDX]}, {annees(q.p)}"
                 on:pointerenter={(ev) => montrer(q, k)} on:click={(ev) => montrer(q, k, ev)}
                 on:focus={() => montrer(q, k)} on:keydown={(ev) => ev.key === 'Enter' && montrer(q, k, ev)}>
                <circle r={q.mini ? 7 : 13} class="cible" />
                {#if q.p.mer}<circle r={q.mini ? (q.p.vif ? 3.8 : 3.4) : q.p.vif ? 5 : 4.6} class="marque" />{:else}<path d={q.mini ? (q.p.vif ? 'M0 -4.6 L4.6 0 L0 4.6 L-4.6 0 Z' : 'M0 -4.1 L4.1 0 L0 4.1 L-4.1 0 Z') : q.p.vif ? 'M0 -6 L6 0 L0 6 L-6 0 Z' : 'M0 -5.4 L5.4 0 L0 5.4 L-5.4 0 Z'} class="marque" />{/if}
              </g>
            {/each}
          </svg>
          {#if P.echelle}
            <div class="echelle" aria-hidden="true"><span>{P.echelle.km} km</span><i style="width:{P.echelle.l.toFixed(1)}px"></i></div>
          {/if}
        </div>
      {/each}
      {#if bulle}
        <div class="bulle" style="left:{bulle.x}px;top:{bulle.y}px;max-width:{bulle.w}px" aria-live="polite">
          <p class="b-nom">{sel.q.nom}</p>
          <p class="b-lieu">{sel.q.p.lieu[IDX]} · {annees(sel.q.p)}</p>
          <p class="b-statut" class:vif={sel.q.p.vif}>{T.statuts[sel.q.p.s]}</p>
        </div>
      {/if}
    {/if}
  </div>

  <p class="source">{T.source}</p>
</main>

<style>
  .bloc{max-width:1040px;margin:0 auto;padding:6px var(--marge) 10px;display:flex;flex-direction:column;gap:14px}
  .tete{display:flex;flex-direction:column;gap:6px}
  h1{font-family:var(--titre);font-weight:700;font-size:clamp(21px,3.3vw,28px);line-height:1.16;text-wrap:balance}
  .chapo{font-size:15px;line-height:1.4;color:var(--gris);max-width:70ch}

  .cle{list-style:none;display:flex;flex-wrap:wrap;gap:6px 18px;font-size:12.5px;line-height:1.3;color:#3b3b40}
  .cle li{display:flex;align-items:center;gap:6px;white-space:nowrap}
  .cle svg{flex:none;display:block}

  .scene{position:relative;line-height:0}
  .panneau{position:absolute;overflow:hidden;background:#e7f1f0}
  .voile{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 18px 10px #fff}
  .couche{position:absolute;inset:0;display:block}
  .rivage{fill:none;stroke:#b9d6d3}
  .terre{fill:#fff}
  .frontiere-halo{fill:none;stroke:#7b7b80;stroke-opacity:.12;stroke-linejoin:round}
  .frontiere{fill:none;stroke:#7b7b80;stroke-linejoin:round}
  .cadre{fill:none;stroke:#6e6e73;stroke-width:1;stroke-dasharray:3 2}

  .textes text{font-family:var(--texte);fill:var(--encre)}
  text.mer{font-style:italic;fill:#86aeab}
  text.pays{font-weight:500;fill:#2a2a2d}
  text.titre-panneau{font-weight:600;fill:var(--gris)}
  text.nom{font-weight:500;paint-order:stroke;stroke:#fff;stroke-width:3.2;stroke-opacity:.9;stroke-linejoin:round;pointer-events:none}
  text.nom.actif{font-weight:600}
  .projet{cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent}
  .cible{fill:transparent}
  .marque{fill:#fff;stroke:#6e6e73;stroke-width:1.4}
  .projet.vif .marque{fill:var(--rouge);stroke:#fff;stroke-width:1.2}
  .projet.mini .marque{stroke-width:1.1}
  .projet.mini.vif .marque{stroke-width:.9}
  .projet:hover .marque,.projet:focus-visible .marque{stroke:#141414;stroke-width:1.6}

  .echelle{position:absolute;left:12px;bottom:10px;display:flex;flex-direction:column;gap:3px;font-size:11.5px;line-height:1;color:#5a5a5e}
  .echelle i{display:block;height:1px;background:#5a5a5e}

  .bulle{position:absolute;z-index:3;width:max-content;background:#fff;border:1px solid var(--filet);border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.12);
         padding:8px 10px 9px;line-height:1.35;pointer-events:none}
  .b-nom{font-family:var(--titre);font-weight:700;font-size:15px;margin-bottom:2px}
  .b-lieu{font-size:13px;color:#3b3b40}
  .b-statut{font-size:12.5px;color:var(--gris);margin-top:2px}
  .b-statut.vif{color:var(--rouge);font-weight:500}

  .source{font-size:12px;line-height:1.45;color:var(--gris);border-top:1px solid var(--filet);padding-top:10px}

  @media (max-width:600px){
    .bloc{gap:12px}
    .chapo{font-size:14px}
    .cle{gap:5px 14px;font-size:12px}
  }
</style>
