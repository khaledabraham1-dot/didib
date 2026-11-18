import { useSyncExternalStore } from "react";

/*
 * Lecteur d'extraits officiels (30 s) fournis par Deezer.
 * Les liens d'extrait expirent : on les demande à l'API au moment du clic (JSONP, l'API n'expose pas CORS).
 * Les MP3 sont servis avec « Access-Control-Allow-Origin: * » : on peut les analyser (Web Audio) pour
 * faire battre l'interface au rythme réel du morceau, via la variable CSS --beat (0 à 1) sur <html>.
 */

export type PlayerState = { id: string | null; status: "idle" | "loading" | "playing" | "paused"; progress: number };

let state: PlayerState = { id: null, status: "idle", progress: 0 };
const listeners = new Set<() => void>();
const set = (s: Partial<PlayerState>) => { state = { ...state, ...s }; listeners.forEach((l) => l()); };

let audio: HTMLAudioElement | null = null;
let analyser: AnalyserNode | null = null;
let bins: Uint8Array<ArrayBuffer> | null = null;
let raf = 0;
let slow = 0; // moyenne glissante des graves
const root = () => document.documentElement.style;

function jsonp<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const cb = `dz_${Math.random().toString(36).slice(2)}`;
    const s = document.createElement("script");
    const w = window as unknown as Record<string, unknown>;
    const done = () => { delete w[cb]; s.remove(); clearTimeout(t); };
    const t = setTimeout(() => { done(); reject(new Error("timeout")); }, 8000);
    w[cb] = (d: T) => { done(); resolve(d); };
    s.onerror = () => { done(); reject(new Error("network")); };
    s.src = `${url}${url.includes("?") ? "&" : "?"}output=jsonp&callback=${cb}`;
    document.head.appendChild(s);
  });
}

function ensureAudio() {
  if (audio) return audio;
  audio = new Audio();
  audio.crossOrigin = "anonymous";
  audio.preload = "auto";
  audio.addEventListener("timeupdate", () => audio && audio.duration && set({ progress: audio.currentTime / audio.duration }));
  audio.addEventListener("ended", () => { stopMeter(); set({ status: "idle", progress: 0, id: null }); });
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const src = ctx.createMediaElementSource(audio);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.72;
    bins = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    src.connect(analyser);
    analyser.connect(ctx.destination);
    audio.addEventListener("play", () => ctx.state === "suspended" && ctx.resume());
  } catch { analyser = null; /* sans Web Audio : lecture simple, sans pulsation */ }
  return audio;
}

function meter() {
  if (analyser && bins) {
    analyser.getByteFrequencyData(bins);
    let sum = 0;
    for (let i = 1; i < 12; i++) sum += bins[i]; // graves : la grosse caisse
    const avg = sum / 11;
    // détection relative : un coup = un pic au-dessus de la moyenne récente (s'adapte au mixage de chaque titre)
    slow = slow * 0.93 + avg * 0.07;
    const c = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const lvl = c(0.3 * c((avg - 35) / 70) + c((avg - slow) / 16));
    root().setProperty("--beat", lvl.toFixed(3));
  }
  raf = requestAnimationFrame(meter);
}
function stopMeter() { cancelAnimationFrame(raf); raf = 0; root().setProperty("--beat", "0"); }

/** Lance, met en pause ou reprend l'extrait d'une piste Deezer. */
export async function toggle(id: string, trackId: number) {
  const a = ensureAudio();
  if (state.id === id && state.status === "playing") { a.pause(); stopMeter(); return set({ status: "paused" }); }
  if (state.id === id && state.status === "paused") { await a.play(); meter(); return set({ status: "playing" }); }
  a.pause(); stopMeter();
  set({ id, status: "loading", progress: 0 });
  try {
    const t = await jsonp<{ preview?: string }>(`https://api.deezer.com/track/${trackId}`);
    if (!t.preview || state.id !== id) throw new Error("no preview");
    a.src = t.preview;
    await a.play();
    meter();
    set({ status: "playing" });
  } catch (e) {
    if (state.id === id) set({ id: null, status: "idle", progress: 0 });
    throw e;
  }
}

/** Lecture hors React (boucles de rendu 3D). */
export const playerState = () => state;

export function usePlayer() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
  );
}
