// Textes de la carte en trois langues. La langue est choisie à la compilation (VITE_LANGUE = fr, es ou it).
export const LANGUES = {
  fr: {
    titre: 'Projets visant à créer des territoires hors de l’autorité des États',
    chapo: 'De 1962 à 2026.',
    source: 'Source : Groupe d’études géopolitiques · Carte : Le Grand Continent',
    cle: ['En mer, toujours là', 'En mer, disparu', 'Sur terre, actif ou en projet', 'Sur terre, fermé'],
    carte: 'Carte du monde situant 17 projets de seasteading et de network states depuis 1962, avec deux agrandissements sur les Caraïbes et l’Europe.',
    depuis: (a) => `depuis ${a}`,
    panneaux: { c: 'Caraïbes et Amérique centrale', e: 'Europe' },
    statuts: {
      abandonne: 'Abandonné', detruit: 'Détruit', occupe: 'Toujours occupé', annexe: 'Annexé par les Tonga',
      jamais_construit: 'Jamais construit', jamais_lance: 'Jamais lancé', saisi: 'Saisi par la marine thaïlandaise',
      actif: 'En activité', conteste: 'En activité, contesté', aboli: 'En activité, régime des ZEDE aboli', revendique: 'Revendiqué', projet: 'En projet', ferme: 'Fermé'
    },
    mers: {
      m: [[-138, 12, ['Océan', 'Pacifique']], [-38, 27, ['Océan', 'Atlantique']], [76, -22, ['Océan', 'Indien']]],
      c: [[-76.5, 14.6, ['Mer des', 'Caraïbes']], [-88.6, 24.9, ['Golfe du', 'Mexique']], [-72.5, 26.2, ['Océan', 'Atlantique']], [-88.3, 10.4, ['Océan', 'Pacifique']]],
      e: [[3.4, 56.3, ['Mer', 'du Nord']], [-8.6, 48.4, ['Océan', 'Atlantique']], [18.6, 55.9, ['Mer', 'Baltique']]]
    },
    pays: {
      c: { 840: 'États-Unis', 484: 'Mexique', 192: 'Cuba', 340: 'Honduras', 558: 'Nicaragua', 170: 'Colombie', 862: 'Venezuela', 320: 'Guatemala', 332: 'Haïti', 591: 'Panama' },
      e: { 826: 'Royaume-Uni', 250: 'France', 276: 'Allemagne', 578: 'Norvège', 752: 'Suède', 380: 'Italie', 724: 'Espagne', 616: 'Pologne', 191: 'Croatie', 688: 'Serbie' }
    }
  },
  es: {
    titre: 'Proyectos para crear territorios fuera de la autoridad de los Estados',
    chapo: 'De 1962 a 2026.',
    source: 'Fuente: Groupe d’études géopolitiques · Mapa: El Grand Continent',
    cle: ['En el mar, aún existe', 'En el mar, desaparecido', 'En tierra, activo o en proyecto', 'En tierra, cerrado'],
    carte: 'Mapa del mundo con 17 proyectos de seasteading y de network states desde 1962, con dos ampliaciones sobre el Caribe y Europa.',
    depuis: (a) => `desde ${a}`,
    panneaux: { c: 'Caribe y Centroamérica', e: 'Europa' },
    statuts: {
      abandonne: 'Abandonado', detruit: 'Destruido', occupe: 'Todavía ocupado', annexe: 'Anexionado por Tonga',
      jamais_construit: 'Nunca construido', jamais_lance: 'Nunca botado', saisi: 'Incautado por la Marina tailandesa',
      actif: 'En funcionamiento', conteste: 'En funcionamiento, impugnado', aboli: 'En funcionamiento, régimen de las ZEDE abolido', revendique: 'Reivindicado', projet: 'En proyecto', ferme: 'Cerrado'
    },
    mers: {
      m: [[-138, 12, ['Océano', 'Pacífico']], [-38, 27, ['Océano', 'Atlántico']], [76, -22, ['Océano', 'Índico']]],
      c: [[-76.5, 14.6, ['Mar', 'Caribe']], [-88.6, 24.9, ['Golfo de', 'México']], [-72.5, 26.2, ['Océano', 'Atlántico']], [-88.3, 10.4, ['Océano', 'Pacífico']]],
      e: [[3.4, 56.3, ['Mar', 'del Norte']], [-8.6, 48.4, ['Océano', 'Atlántico']], [18.6, 55.9, ['Mar', 'Báltico']]]
    },
    pays: {
      c: { 840: 'Estados Unidos', 484: 'México', 192: 'Cuba', 340: 'Honduras', 558: 'Nicaragua', 170: 'Colombia', 862: 'Venezuela', 320: 'Guatemala', 332: 'Haití', 591: 'Panamá' },
      e: { 826: 'Reino Unido', 250: 'Francia', 276: 'Alemania', 578: 'Noruega', 752: 'Suecia', 380: 'Italia', 724: 'España', 616: 'Polonia', 191: 'Croacia', 688: 'Serbia' }
    }
  },
  it: {
    titre: 'Progetti per creare territori al di fuori dell’autorità degli Stati',
    chapo: 'Dal 1962 al 2026.',
    source: 'Fonte: Groupe d’études géopolitiques · Mappa: Il Grand Continent',
    cle: ['In mare, ancora esistente', 'In mare, scomparso', 'Sulla terraferma, attivo o in progetto', 'Sulla terraferma, chiuso'],
    carte: 'Mappa del mondo con 17 progetti di seasteading e di network states dal 1962, con due ingrandimenti sui Caraibi e sull’Europa.',
    depuis: (a) => `dal ${a}`,
    panneaux: { c: 'Caraibi e America centrale', e: 'Europa' },
    statuts: {
      abandonne: 'Abbandonato', detruit: 'Distrutto', occupe: 'Ancora occupato', annexe: 'Annesso da Tonga',
      jamais_construit: 'Mai costruito', jamais_lance: 'Mai varato', saisi: 'Sequestrato dalla Marina thailandese',
      actif: 'In attività', conteste: 'In attività, contestato', aboli: 'In attività, regime delle ZEDE abolito', revendique: 'Rivendicato', projet: 'In progetto', ferme: 'Chiuso'
    },
    mers: {
      m: [[-138, 12, ['Oceano', 'Pacifico']], [-38, 27, ['Oceano', 'Atlantico']], [76, -22, ['Oceano', 'Indiano']]],
      c: [[-76.5, 14.6, ['Mar dei', 'Caraibi']], [-88.6, 24.9, ['Golfo del', 'Messico']], [-72.5, 26.2, ['Oceano', 'Atlantico']], [-88.3, 10.4, ['Oceano', 'Pacifico']]],
      e: [[3.4, 56.3, ['Mare', 'del Nord']], [-8.6, 48.4, ['Oceano', 'Atlantico']], [18.6, 55.9, ['Mar', 'Baltico']]]
    },
    pays: {
      c: { 840: 'Stati Uniti', 484: 'Messico', 192: 'Cuba', 340: 'Honduras', 558: 'Nicaragua', 170: 'Colombia', 862: 'Venezuela', 320: 'Guatemala', 332: 'Haiti', 591: 'Panama' },
      e: { 826: 'Regno Unito', 250: 'Francia', 276: 'Germania', 578: 'Norvegia', 752: 'Svezia', 380: 'Italia', 724: 'Spagna', 616: 'Polonia', 191: 'Croazia', 688: 'Serbia' }
    }
  }
};

// Les 17 projets retenus (onglet « retenus » du recensement). p : panneau (m monde, c Caraïbes, e Europe).
// mer : en mer (rond) ou sur terre (losange) ; vif : rouge (toujours là / actif / en projet).
export const PROJETS = [
  { lat: 25.491, lon: -80.111, p: 'c', mer: 1, vif: 0, d: 1962, f: 1970, s: 'abandonne',
    nom: ['Atlantis / Grand Capri', 'Atlantis / Grand Capri', 'Atlantis / Grand Capri'],
    lieu: ['Récifs au large de Miami', 'Arrecifes frente a Miami', 'Barriere coralline al largo di Miami'] },
  { lat: 18.017, lon: -78.067, p: 'c', mer: 1, vif: 0, d: 1964, f: 1966, s: 'detruit',
    nom: ['New Atlantis', 'New Atlantis', 'New Atlantis'],
    lieu: ['Au large de la Jamaïque', 'Frente a Jamaica', 'Al largo della Giamaica'] },
  { lat: 51.8944, lon: 1.4806, p: 'e', mer: 1, vif: 1, d: 1967, f: null, s: 'occupe',
    nom: ['Sealand', 'Sealand', 'Sealand'],
    lieu: ['Ancien fort en mer du Nord', 'Antiguo fuerte en el mar del Norte', 'Ex forte nel Mare del Nord'] },
  { lat: 44.18, lon: 12.62, p: 'e', mer: 1, vif: 0, d: 1968, f: 1969, s: 'detruit',
    nom: ['Île des Roses', 'Isla de las Rosas', 'Isola delle Rose'],
    lieu: ['Adriatique, au large de Rimini', 'Adriático, frente a Rímini', 'Adriatico, al largo di Rimini'] },
  { lat: 20.5417, lon: -69.7, p: 'c', mer: 1, vif: 0, d: 1968, f: null, s: 'abandonne',
    nom: ['Operation Atlantis', 'Operation Atlantis', 'Operation Atlantis'],
    lieu: ['Banc d’Argent, au nord d’Hispaniola', 'Banco de la Plata, al norte de La Española', 'Silver Bank, a nord di Hispaniola'] },
  { lat: -23.65, lon: -178.9, p: 'm', mer: 1, vif: 0, d: 1972, f: 1972, s: 'annexe',
    nom: ['Minerva', 'Minerva', 'Minerva'],
    lieu: ['Récifs de Minerva, Pacifique Sud', 'Arrecifes de Minerva, Pacífico Sur', 'Scogliere di Minerva, Pacifico meridionale'] },
  { lat: 18.85, lon: -83.87, p: 'c', mer: 1, vif: 0, d: 1999, f: null, s: 'jamais_construit',
    nom: ['New Utopia', 'New Utopia', 'New Utopia'],
    lieu: ['Banc Misteriosa, mer des Caraïbes', 'Banco Misteriosa, mar Caribe', 'Banco Misteriosa, Mar dei Caraibi'] },
  { lat: 37.46, lon: -122.68, p: 'm', mer: 1, vif: 0, d: 2011, f: null, s: 'jamais_lance',
    nom: ['Blueseed', 'Blueseed', 'Blueseed'],
    lieu: ['Au large de San Francisco', 'Frente a San Francisco', 'Al largo di San Francisco'] },
  { lat: -17.77, lon: -149.47, p: 'm', mer: 1, vif: 0, d: 2017, f: 2018, s: 'abandonne',
    nom: ['Floating Island Project', 'Floating Island Project', 'Floating Island Project'],
    lieu: ['Lagon d’Atimaono, Tahiti', 'Laguna de Atimaono, Tahití', 'Laguna di Atimaono, Tahiti'] },
  { lat: 7.38, lon: 98.33, p: 'm', mer: 1, vif: 0, d: 2019, f: 2019, s: 'saisi',
    nom: ['Ocean Builders', 'Ocean Builders', 'Ocean Builders'],
    lieu: ['Au large de Phuket, Thaïlande', 'Frente a Phuket, Tailandia', 'Al largo di Phuket, Thailandia'] },
  { lat: 8.75, lon: -79.45, p: 'c', mer: 1, vif: 0, d: 2020, f: 2020, s: 'abandonne',
    nom: ['MS Satoshi', 'MS Satoshi', 'MS Satoshi'],
    lieu: ['Mouillage prévu dans le golfe de Panama', 'Fondeo previsto en el golfo de Panamá', 'Ancoraggio previsto nel golfo di Panama'] },
  { lat: 16.3725, lon: -86.4625, p: 'c', mer: 0, vif: 1, d: 2017, f: null, s: 'aboli',
    nom: ['Próspera', 'Próspera', 'Próspera'],
    lieu: ['Roatán, Honduras', 'Roatán, Honduras', 'Roatán, Honduras'] },
  { lat: 15.65, lon: -87.95, p: 'c', mer: 0, vif: 1, d: 2020, f: null, s: 'aboli',
    nom: ['Ciudad Morazán', 'Ciudad Morazán', 'Ciudad Morazán'], court: 'Morazán',
    lieu: ['Choloma, Honduras', 'Choloma, Honduras', 'Choloma, Honduras'] },
  { lat: 45.7667, lon: 18.875, p: 'e', mer: 0, vif: 1, d: 2015, f: null, s: 'revendique',
    nom: ['Liberland', 'Liberland', 'Liberland'],
    lieu: ['Rive du Danube, entre Croatie et Serbie', 'Orilla del Danubio, entre Croacia y Serbia', 'Riva del Danubio, tra Croazia e Serbia'] },
  { lat: 58.42, lon: 7.52, p: 'e', mer: 0, vif: 1, d: 2017, f: null, s: 'projet',
    nom: ['Liberstad', 'Liberstad', 'Liberstad'],
    lieu: ['Lindesnes, Norvège', 'Lindesnes, Noruega', 'Lindesnes, Norvegia'] },
  { lat: 6.48, lon: 3.93, p: 'm', mer: 0, vif: 1, d: 2020, f: null, s: 'projet',
    nom: ['Itana', 'Itana', 'Itana'],
    lieu: ['Zone franche de Lekki, Nigeria', 'Zona franca de Lekki, Nigeria', 'Zona franca di Lekki, Nigeria'] },
  { lat: 1.355, lon: 103.59, p: 'm', mer: 0, vif: 0, d: 2024, f: 2026, s: 'ferme',
    nom: ['Network School', 'Network School', 'Network School'],
    lieu: ['Forest City, Malaisie', 'Forest City, Malasia', 'Forest City, Malesia'] }
];

export const LANGUE = (import.meta.env.VITE_LANGUE || 'fr');
export const IDX = { fr: 0, es: 1, it: 2 }[LANGUE];
export const T = LANGUES[LANGUE];
export const annees = (p) => (p.f == null ? (p.vif ? T.depuis(p.d) : String(p.d)) : p.f === p.d ? String(p.d) : `${p.d}–${p.f}`);
