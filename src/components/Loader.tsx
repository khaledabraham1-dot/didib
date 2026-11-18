import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Mark } from "./Mark";
import { lockScroll } from "@/lib/scroll";

/*
 * Le sacre d'ouverture.
 * 1. Les cinq piliers du trône se dressent.
 * 2. Le rideau noir se perce à la forme exacte du logo : la scène apparaît à travers les piliers.
 * 3. La découpe grandit jusqu'à ce que le pilier central avale l'écran.
 * Joué une fois par visite. Un clic ou une touche passe directement à l'ouverture.
 */

const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const firstVisit = (() => {
  try {
    if (sessionStorage.getItem("didib-intro")) return false;
    sessionStorage.setItem("didib-intro", "1");
  } catch { /* stockage indisponible : on joue l'intro */ }
  return true;
})();
const play = firstVisit && !reduce;

/** Délai (s) avant les animations d'entrée du héros. */
export const INTRO = play ? 2.45 : 0.1;

const MARK = 72; // taille du logo à l'écran, en px
// Même géométrie que <Mark /> : la découpe épouse exactement le logo.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${[12, 18, 24, 18, 12]
  .map((h, i) => `<rect x="${4 + i * 5.2}" y="${28 - h}" width="3" height="${h}"/>`)
  .join("")}<rect x="2" y="29" width="28" height="1.6"/></svg>`;
const MASK = `url("data:image/svg+xml,${encodeURIComponent(svg)}"), linear-gradient(#000 0 0)`;

export function Loader() {
  const [stage, setStage] = useState<"rise" | "open" | "done">(play ? "rise" : "done");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!play) return;
    lockScroll(true);
    const t = setTimeout(() => setStage("open"), 1250);
    const skip = () => setStage((s) => (s === "rise" ? "open" : s));
    addEventListener("pointerdown", skip, { once: true });
    addEventListener("keydown", skip, { once: true });
    return () => { clearTimeout(t); removeEventListener("pointerdown", skip); removeEventListener("keydown", skip); };
  }, []);

  useEffect(() => {
    if (stage !== "open" || !ref.current) return;
    // taille finale : le pilier central (3/32 du logo) couvre tout l'écran
    const end = Math.max((innerWidth * 32) / 3, (innerHeight * 32) / 24) * 1.2;
    const k = (s: number) => `${s}px ${s}px, 100% 100%`;
    const a = ref.current.animate(
      [
        { maskSize: k(MARK), offset: 0 },
        { maskSize: k(MARK * 1.35), offset: 0.22 },
        { maskSize: k(end * 0.08), offset: 0.62 },
        { maskSize: k(end), offset: 1 },
      ],
      { duration: 1300, delay: 180, easing: "cubic-bezier(.6,0,.35,1)", fill: "forwards" },
    );
    a.onfinish = () => { setStage("done"); lockScroll(false); };
    return () => a.cancel();
  }, [stage]);

  if (stage === "done") return null;
  const open = stage === "open";
  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[100] grid place-items-center bg-obsidian"
      style={
        open
          ? { maskImage: MASK, WebkitMaskImage: MASK, maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center", maskSize: `${MARK}px ${MARK}px, 100% 100%`, WebkitMaskSize: `${MARK}px ${MARK}px, 100% 100%`, maskComposite: "exclude", WebkitMaskComposite: "xor" }
          : undefined
      }
      aria-hidden
    >
      <div className={open ? "opacity-0" : ""}>
        <Mark animate size={MARK} />
      </div>
      <motion.p
        className="label absolute left-1/2 top-[calc(50%+64px)] -translate-x-1/2 whitespace-nowrap text-brass"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ delay: open ? 0 : 0.5, duration: open ? 0.2 : 0.6 }}
      >
        Le trône s'éveille
      </motion.p>
    </div>
  );
}
