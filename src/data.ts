// Contenu du site. Toutes les informations factuelles viennent de sources publiques
// (voir README). Les éléments marqués TODO sont à fournir par l'équipe de l'artiste.

const q = (s: string) => encodeURIComponent(`Didi B ${s}`);
export const stream = (title: string) => [
  { name: "Spotify", href: `https://open.spotify.com/search/${q(title)}` },
  { name: "Apple Music", href: `https://music.apple.com/search?term=${q(title)}` },
  { name: "YouTube", href: `https://www.youtube.com/results?search_query=${q(title)}` },
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
  { n: 4, year: "2025", title: "Genius", kicker: "Diyilem & Bazarhoff", line: "Deux faces, un seul génie.", hue: "#3b4a3a" },
  { n: 5, year: "2026", title: "Juventus Nueva Era", kicker: "Nouvelle ère", line: "Le règne continue. Une nouvelle génération.", hue: "#b3261e" },
];

// Chronique scénique (source : Wikipédia ; Fraternité Matin ; Abidjan.net)
export const stages = [
  { date: "27.05.2022", place: "Palais de la Culture", city: "Abidjan", note: "Le palais, pour commencer." },
  { date: "04.02.2023", place: "Élysée Montmartre", city: "Paris", note: "Babi Style traverse la mer." },
  { date: "—", place: "Stade Général Lansana Conté", city: "Conakry", note: "La Guinée au rendez-vous." },
  { date: "03.05.2025", place: "Stade Félix Houphouët-Boigny", city: "Abidjan", note: "Plus de 30 000 places. Le Félicia rempli." },
  { date: "2025", place: "Stade de Bouaké", city: "Bouaké", note: "Le sacre continue au centre du pays." },
];

export const tickerWords = ["Babi Style", "Mojo Trône", "Diyilem", "Bazarhoff", "Kiff No Beat", "Abidjan", "Nueva Era"];

export const merch = [
  { name: "Maillot Nueva Era", tag: "Édition 05" },
  { name: "Hoodie Trône", tag: "Noir / Laiton" },
  { name: "Casquette Babi Style", tag: "Brodée" },
  { name: "Vinyle History", tag: "Mojotrône II" },
];

// TODO : remplacer par les vrais liens officiels de l'artiste
export const socials = [
  { name: "Instagram", href: "#" },
  { name: "TikTok", href: "#" },
  { name: "YouTube", href: "#" },
  { name: "Facebook", href: "#" },
];

// Afficher la mention « concept » tant que le site n'est pas validé par l'équipe de l'artiste.
export const SHOW_CONCEPT_NOTICE = true;
