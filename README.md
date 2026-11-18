# DIDI B — « Le Trône »

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
- Photos officielles (emplacement « Portrait officiel » dans `src/components/Story.tsx`).
- Liens officiels des réseaux sociaux et des plateformes (`src/data.ts`).
- Branchement de la newsletter (`src/components/Cour.tsx`).
- `SHOW_CONCEPT_NOTICE` dans `src/data.ts` : passer à `false` une fois le site validé par l'équipe.

## Sources des informations
- Wikipédia, « Didi B » : nom, naissance, Kiff No Beat, albums, labels, concerts.
- Fraternité Matin et Abidjan.net : concert du 3 mai 2025 au Stade Félix Houphouët-Boigny.
