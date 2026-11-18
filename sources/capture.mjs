import puppeteer from 'puppeteer-core';
const [,, fichier, sortie, largeur, embarque, survol] = process.argv;
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: +largeur, height: 900, deviceScaleFactor: 2 });
const erreurs = [];
p.on('pageerror', (e) => erreurs.push(e.message));
await p.goto('file://' + process.cwd() + '/' + fichier, { waitUntil: 'load' });
if (embarque === '1') await p.evaluate(() => document.documentElement.classList.add('embarque'));
await new Promise((r) => setTimeout(r, 1800));
if (survol) {
  const g = await p.$$('g.projet');
  const box = await g[+survol].boundingBox();
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await new Promise((r) => setTimeout(r, 300));
}
// étiquettes coupées ou superposées
const bilan = await p.evaluate(() => {
  const res = [];
  document.querySelectorAll('.panneau').forEach((pan, i) => {
    const R = pan.getBoundingClientRect();
    const t = [...pan.querySelectorAll('text')].map((e) => ({ s: e.textContent, r: e.getBoundingClientRect() }));
    for (const a of t) if (a.r.left < R.left + 2 || a.r.right > R.right - 2 || a.r.top < R.top + 1 || a.r.bottom > R.bottom - 1) res.push('coupé ' + i + ' ' + a.s);
    for (let x = 0; x < t.length; x++) for (let y = x + 1; y < t.length; y++) {
      const a = t[x].r, c = t[y].r, o = Math.max(0, Math.min(a.right, c.right) - Math.max(a.left, c.left)) * Math.max(0, Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top));
      if (o > 4) res.push('superposé ' + i + ' ' + t[x].s + ' / ' + t[y].s);
    }
  });
  return res;
});
console.log(largeur, JSON.stringify(bilan), erreurs.join(' | '));
await p.screenshot({ path: sortie, fullPage: true });
await b.close();
