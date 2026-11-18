import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';
const L = process.env.VITE_LANGUE || 'fr';
const TITRES = {
  fr: 'Projets visant à créer des territoires hors de l’autorité des États',
  es: 'Proyectos para crear territorios fuera de la autoridad de los Estados',
  it: 'Progetti per creare territori al di fuori dell’autorità degli Stati'
};
export default defineConfig({
  plugins: [svelte(), viteSingleFile(), { name: 'langue', transformIndexHtml: (h) => h.replace('<html lang="fr">', `<html lang="${L}">`).replace('%TITRE%', TITRES[L]) }],
  build: { outDir: 'dist-' + L, target: 'es2019', cssCodeSplit: false, assetsInlineLimit: 100000000 }
});
