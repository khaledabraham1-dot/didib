// Discographie, incontournables et palmarès.
// Discographie et titres : métadonnées des labels via l'API Deezer (artiste 6412878), relevées le 18.11.2026.
// Palmarès : uniquement les distinctions recoupées par au moins deux sources (liste en bas de fichier).

export const cover = (md5: string, size = 500) => `https://cdn-images.dzcdn.net/images/cover/${md5}/${size}x${size}-000000-80-0-0.jpg`;

export type Project = { id: number; type: "Album" | "EP"; date: string; title: string; md5: string; note?: string };
export const discography: Project[] = [
  { id: 1128211201, type: "Album", date: "06.11.2026", title: "Shogun in Lagos", md5: "ecd43553e330f8709dd0d98790dd0219", note: "Nouveau" },
  { id: 1005131281, type: "EP", date: "19.06.2026", title: "KIN", md5: "a6f8dfdb36525bc115a20870c5e24981" },
  { id: 917482701, type: "Album", date: "18.02.2026", title: "Juventus Nueva Era", md5: "7970600070b5f6b6346d2d7aab316824", note: "Deluxe" },
  { id: 855212562, type: "Album", date: "14.11.2025", title: "Juventus Nueva Era", md5: "a879d555931212d02ca9d0c307f4e815" },
  { id: 761565621, type: "Album", date: "05.04.2025", title: "Diyilem & Bazarhoff : Genius", md5: "9f217fbedd2a5f415834082886314bf1" },
  { id: 546386412, type: "EP", date: "12.02.2024", title: "Before Olympia", md5: "8ca0dea1ce52ad26dd1a4a3732e93018" },
  { id: 322538237, type: "Album", date: "31.05.2022", title: "History (Mojotrône II)", md5: "58ed24b25daaa953e3124147650d634f" },
  { id: 166399092, type: "Album", date: "13.04.2013", title: "Mojo Trône, vol. 1", md5: "9d83f29c845a412361b50a3fb7dc09f0" },
];

export type Track = { id: number; title: string; artists: string; album: string; md5: string };
// Classement de secours : le composant recharge le classement Deezer en direct au chargement.
export const topTracks: Track[] = [
  { id: 4365137841, title: "PARTY", artists: "Didi B, Davido", album: "Shogun in Lagos", md5: "ecd43553e330f8709dd0d98790dd0219" },
  { id: 4365137821, title: "JURU", artists: "Didi B, Tayc", album: "Shogun in Lagos", md5: "ecd43553e330f8709dd0d98790dd0219" },
  { id: 4194425512, title: "Salo", artists: "Tayc, Didi B", album: "Salo", md5: "8e93ca2517745e091ecbba23c2998276" },
  { id: 4365137851, title: "ADIOS", artists: "Didi B, Qing Madi", album: "Shogun in Lagos", md5: "ecd43553e330f8709dd0d98790dd0219" },
  { id: 2690098572, title: "Fimbu", artists: "Team Paiya, Didi B, Ste Milano, Tam Sir, 3xdavs", album: "Fimbu", md5: "2e357386a8f0ac4cca15109791fa4590" },
  { id: 4365137731, title: "FREE", artists: "Didi B", album: "Shogun in Lagos", md5: "ecd43553e330f8709dd0d98790dd0219" },
  { id: 3140372191, title: "DX3 (Dégâts X3)", artists: "Didi B, MHD", album: "DX3 (Dégâts X3)", md5: "c8b51e22fc201c581fceb1620bacb427" },
  { id: 3866823311, title: "Cherie Coco", artists: "Didi B, Fally Ipupa", album: "Cherie Coco", md5: "6f05bc48d857647b5155bb6b072d8cb0" },
  { id: 4365137751, title: "MALADE", artists: "Didi B, Khaid", album: "Shogun in Lagos", md5: "ecd43553e330f8709dd0d98790dd0219" },
  { id: 3060531881, title: "Y'a Dieu dedans", artists: "Paulo Chakal, Didi B", album: "Y'a Dieu dedans", md5: "f559519fde414ca6153a116a1fc9632f" },
];

export type Award = { year: string; ceremony: string; title: string; detail: string };
export const awards: Award[] = [
  { year: "2025", ceremony: "Trace Awards", title: "Meilleur artiste hip-hop", detail: "27.02.2025" },
  { year: "2023", ceremony: "Primud d'Or", title: "Primud d'Or", detail: "Abidjan · 19.11.2023" },
  { year: "2023", ceremony: "Trace Awards", title: "Meilleur artiste francophone", detail: "2023" },
  { year: "2023", ceremony: "Kundé d'Or", title: "Meilleur artiste d'Afrique de l'Ouest", detail: "Ouagadougou · 12.05.2023" },
  { year: "2023", ceremony: "AFRIMA", title: "Chanson de l'année, « Tala »", detail: "Dakar · 15.01.2023" },
  { year: "2022", ceremony: "Primud d'Or", title: "Album de l'année · Artiste rap ivoire · Hit de l'année", detail: "Trois prix · 07.11.2022" },
];
/** Nombre de distinctions (le Primud d'Or 2022 en compte trois). */
export const awardCount = awards.length - 1 + 3;

export type Record = { value: string; unit: string; text: string };
export const records: Record[] = [
  { value: String(awardCount), unit: "distinctions", text: "Primud d'Or, AFRIMA, Kundé d'Or, Trace Awards, de 2022 à 2025." },
  { value: "Diamant", unit: "History", text: "Disque d'or en 2023, puis platine et diamant annoncés en 2025 pour Mojotrône II." },
  { value: "Platine", unit: "Genius", text: "Diyilem & Bazarhoff : Genius, certifié platine en 2025." },
  { value: "5e", unit: "en France", text: "Artiste ivoirien le plus streamé en France en 2025, selon Billboard France (données Luminate)." },
];

export const palmaresSources = [
  { name: "Music in Africa", href: "https://www.musicinafrica.net/fr/magazine/primud-dor-2023-didi-b-au-firmament-des-musiques-ivoiriennes" },
  { name: "Trace Awards 2025", href: "https://www.afrique-sur7.fr/trace-awards-2025-josey-didi-b-et-tamsir-sacres-decouvrez-le-palmares-complet" },
  { name: "Abidjan.net", href: "https://news.abidjan.net/articles/741426/musique-didi-b-fait-vibrer-le-stade-felix-houphouet-boigny-a-guichets-fermes" },
  { name: "Billboard France", href: "https://fr.billboard.com/les-8-artistes-ivoiriens-les-plus-streames-en-france-en-2025/" },
  { name: "Wikipédia", href: "https://en.wikipedia.org/wiki/Didi_B" },
];
