import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Défilement fluide. Désactivé quand le visiteur demande moins d'animations,
// et sur écrans tactiles (le défilement natif y est déjà inertiel et plus fiable).
let lenis: Lenis | null = null;

export function initScroll() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(pointer: coarse)").matches;
  if (reduce || touch || lenis) return;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, anchors: { offset: 0 } });
  const raf = (t: number) => {
    lenis?.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

/** Défile jusqu'à une position, avec Lenis si actif. */
export function scrollToY(top: number) {
  if (lenis) return lenis.scrollTo(top, { duration: 1.4 });
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

/** Bloque ou relance le défilement (intro, menus). */
export function lockScroll(locked: boolean) {
  if (lenis) (locked ? lenis.stop() : lenis.start());
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
