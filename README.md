# DIDI B · « Le Trône »

Concept de site officiel pour Didi B, conçu par SK DIGITAL.

## Direction artistique
- **Le Trône** : le logo est fait de cinq piliers, un par ère. Le cinquième, Nueva Era, est rouge.
- **Les ères** : la discographie sert de fil narratif (I à V), en défilement horizontal sur ordinateur et en carrousel sur mobile.
- **Palette** : obsidienne, laiton, ivoire et rouge sang (réservé à la Nueva Era et à « La cour »).
- **Typographies** : Bodoni Moda en italique (titres), Archivo large (labels), JetBrains Mono (métadonnées).
- **Signature visuelle** : des projecteurs de stade animés en canvas, qui suivent le pointeur.

## Stack
Vite, React, TypeScript, Tailwind v4, et des composants shadcn/ui (Radix) personnalisés : Button, Sheet, Tabs, Input. Les animations utilisent Motion, les notifications Sonner.

```bash
npm install
npm run dev     # développement
npm run build   # production dans dist/
```

## À compléter par l'équipe de l'artiste
- Photos officielles : le site utilise pour l'instant des photos libres de Wikimedia Commons (voir plus bas). Les remplacer par les photos de l'équipe dans `public/photos/` (mêmes noms de fichiers).
- `VITE_SITE_URL` dans `.env` : domaine final, pour l'image de partage (Open Graph).
- Liens officiels des réseaux sociaux et des plateformes (`src/data.ts`).
- Branchement de la newsletter (`src/components/Cour.tsx`).
- `SHOW_CONCEPT_NOTICE` dans `src/data.ts` : passer à `false` une fois le site validé par l'équipe.

## Sources des informations
- Wikipédia, « Didi B » : nom, naissance, Kiff No Beat, concerts.
- Albums (titres, dates, labels) : métadonnées fournies par les labels aux plateformes (API Apple Music et Deezer). Elles font foi sur Wikipédia.
- Réseaux et identifiants officiels : Wikidata Q115791127.
- Fraternité Matin et Abidjan.net : concert du 3 mai 2025 au Stade Félix Houphouët-Boigny.

## Photos et crédits
Photos de Wikimedia Commons, licence CC BY-SA 4.0 : BorisAhonon (FEMUA, 15e édition), Gildas Lissassi (WeLoveEya 2025, Cotonou), Aristidek5maya (portraits).
Elles sont recadrées et étalonnées en duotone laiton ; les versions modifiées restent sous CC BY-SA 4.0.
Le crédit est affiché sous chaque photo et dans le pied de page : **ne pas le retirer** tant que ces photos sont utilisées.
Les détails (auteur, lien source) sont dans `photos` de `src/data.ts`.
