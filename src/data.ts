// Contenu du site. Toutes les informations factuelles viennent de sources publiques
// (voir README). Les éléments marqués TODO sont à fournir par l'équipe de l'artiste.

// Identifiants officiels, vérifiés le 18.11.2026 : Wikidata (Q115791127), recoupé avec la presse,
// l'oEmbed Spotify et le flux de la chaîne YouTube. Ne pas remplacer par des comptes de fans.
export const official = {
  spotifyArtist: "2FwWGogJ04HZdALWeMxZA4",
  appleMusicArtist: "549549219",
  deezerArtist: "6412878",
  youtubeChannel: "UClzKdPhr7GrMtFFVcgpMiLg", // @DidiBVEVO
} as const;

export const platforms = [
  { name: "Spotify", href: `https://open.spotify.com/artist/${official.spotifyArtist}` },
  { name: "Apple Music", href: `https://music.apple.com/artist/${official.appleMusicArtist}` },
  { name: "Deezer", href: `https://www.deezer.com/artist/${official.deezerArtist}` },
  { name: "YouTube", href: `https://www.youtube.com/channel/${official.youtubeChannel}` },
];

// Liens par album : recherche ciblée sur chaque plateforme (pas d'identifiant d'album vérifié).
const q = (s: string) => encodeURIComponent(`Didi B ${s}`);
export const stream = (title: string) => [
  { name: "Spotify", href: `https://open.spotify.com/search/${q(title)}` },
  { name: "Apple Music", href: `https://music.apple.com/search?term=${q(title)}` },
  { name: "YouTube", href: `https://www.youtube.com/results?search_query=${q(title)}` },
];

// Clips : uniquement ceux publiés par les chaînes officielles (@DidiBVEVO, @DidiBKiffnobeatTV).
// Dernier album, vérifié sur Spotify (23 titres) le 18.11.2026.
export const latest = { title: "Shogun in Lagos", year: "2026", tracks: 23, spotifyAlbum: "0Uq4u4UvnkLtofhMy4TOwe" } as const;

export type Clip = { id: string; title: string; feat?: string; album?: string };
export const clips: Clip[] = [
  { id: "v2p1IwUcYp0", title: "Malade", feat: "Khaid", album: "Shogun in Lagos" },
  { id: "oJpfbw2uQAc", title: "Juru", feat: "Tayc", album: "Shogun in Lagos" },
  { id: "Ses4nRv7IQI", title: "Igbo", album: "Shogun in Lagos" },
  { id: "HsRileLIU1g", title: "IPRC" },
];

export type Era = {
  n: number;
  year: string;
  title: string;
  kicker: string;
  line: string;
  hue: string; // couleur de l'ère, utilisée pour le disque
};

// Discographie (source : Wikipédia, page « Didi B »)
export const eras: Era[] = [
  { n: 1, year: "2013", title: "Mojo Trône", kicker: "Vol. 1", line: "Le premier trône. Kiff No Beat pose les fondations.", hue: "#7a5a2a" },
  { n: 2, year: "2022", title: "History", kicker: "Mojotrône II", line: "Le chapitre qui écrit l'histoire en lettres capitales.", hue: "#a8873f" },
  { n: 3, year: "2023", title: "Before Olympia", kicker: "Avant la scène", line: "Le souffle avant Paris.", hue: "#6b3a2a" },
  { n: 4, year: "2025", title: "Genius", kicker: "Diyilem & Bazarhoff", line: "Deux faces, un seul génie.", hue: "#5a4128" },
  { n: 5, year: "2026", title: "Juventus Nueva Era", kicker: "Nouvelle ère", line: "Le règne continue. Une nouvelle génération.", hue: "#b3261e" },
];

// Chronique scénique (source : Wikipédia ; Fraternité Matin ; Abidjan.net)
export const stages = [
  { date: "27.05.2022", place: "Palais de la Culture", city: "Abidjan", note: "Le palais, pour commencer." },
  { date: "04.02.2023", place: "Élysée Montmartre", city: "Paris", note: "Babi Style traverse la mer." },
  { date: "Date à préciser", place: "Stade Général Lansana Conté", city: "Conakry", note: "La Guinée au rendez-vous." },
  { date: "03.05.2025", place: "Stade Félix Houphouët-Boigny", city: "Abidjan", note: "Plus de 30 000 places. Le Félicia rempli." },
  { date: "2025", place: "Stade de Bouaké", city: "Bouaké", note: "Le sacre continue au centre du pays." },
];

export const tickerWords = ["Babi Style", "Mojo Trône", "Diyilem", "Bazarhoff", "Kiff No Beat", "Abidjan", "Nueva Era", "Shogun in Lagos"];

export const merch = [
  { name: "Maillot Nueva Era", tag: "Édition 05" },
  { name: "Hoodie Trône", tag: "Noir / Laiton" },
  { name: "Casquette Babi Style", tag: "Brodée" },
  { name: "Vinyle History", tag: "Mojotrône II" },
];

// Réseaux officiels (source : Wikidata Q115791127, recoupé avec la presse ivoirienne)
export const socials = [
  { name: "Instagram", href: "https://www.instagram.com/didibofficial/" },
  { name: "TikTok", href: "https://www.tiktok.com/@didib.mojaveli" },
  { name: "YouTube", href: `https://www.youtube.com/channel/${official.youtubeChannel}` },
  { name: "Facebook", href: "https://www.facebook.com/DidiBkiffnobeat" },
  { name: "X", href: "https://x.com/Didibofficial" },
];

// Photos : Wikimedia Commons, licence CC BY-SA 4.0. Étalonnées en duotone laiton par SK DIGITAL
// (les versions modifiées restent sous CC BY-SA 4.0). Le crédit est obligatoire : ne pas le retirer.
const LICENSE = { name: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/deed.fr" };
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;
export const photos = {
  hero: { alt: "Didi B sur scène au FEMUA, micro en main, bras levé sous les projecteurs", author: "BorisAhonon", source: commons("Image_de_DIDI_B_15%C3%A8me_%C3%A9dition_du_FEMUA_-_09.jpg") },
  heroMobile: { alt: "Didi B chante sur scène au FEMUA, la tête levée vers les projecteurs", author: "BorisAhonon", source: commons("Image_de_DIDI_B_15%C3%A8me_%C3%A9dition_du_FEMUA_-_02.jpg") },
  stage: { alt: "Didi B et ses danseurs sur la scène du FEMUA", author: "BorisAhonon", source: commons("Image_de_DIDI_B_15%C3%A8me_%C3%A9dition_du_FEMUA_-_23.jpg") },
  femua: { alt: "Didi B en concert au FEMUA, faisceaux lumineux en arrière-plan", author: "BorisAhonon", source: commons("Image_de_DIDI_B_15%C3%A8me_%C3%A9dition_du_FEMUA_-_19.jpg") },
  cotonou: { alt: "Didi B au micro au festival WeLoveEya 2025 à Cotonou", author: "Gildas Lissassi", source: commons("Didi_B_%C3%A0_WeLoveEya_2025_%C3%A0_Cotonou.jpg") },
  regard: { alt: "Didi B assis, lunettes de soleil, regard tourné vers la droite", author: "Aristidek5maya", source: commons("Didi_B_02.jpg") },
  portrait: { alt: "Portrait de Didi B, regard face à l'objectif", author: "Aristidek5maya", source: commons("Didi_B_01.jpg") },
} as const;
export const photoLicense = LICENSE;
export const photoUrl = (name: string) => `${import.meta.env.BASE_URL}photos/${name}`;

// Afficher la mention « concept » tant que le site n'est pas validé par l'équipe de l'artiste.
export const SHOW_CONCEPT_NOTICE = true;
