import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Transmission } from "./Transmission";
import { Mark } from "./Mark";
import { lockScroll } from "@/lib/scroll";

/*
 * Le sacre d'ouverture.
 * 0. « La transmission » : texte chiffré qui se décode, photo du signe sous une lampe torche, sceau de cire « C ».
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
export const INTRO = play ? 4.5 : 0.1;
const SIGN_MS = 2400, RISE_MS = 3300; // fin du signe, puis ouverture

const MARK = 72; // taille du logo à l'écran, en px
// Même géométrie que <Mark /> : la découpe épouse exactement le logo.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${[12, 18, 24, 18, 12]
  .map((h, i) => `<rect x="${4 + i * 5.2}" y="${28 - h}" width="3" height="${h}"/>`)
  .join("")}<rect x="2" y="29" width="28" height="1.6"/></svg>`;
const MASK = `url("data:image/svg+xml,${encodeURIComponent(svg)}"), linear-gradient(#000 0 0)`;

export function Loader() {
  const [stage, setStage] = useState<"sign" | "rise" | "open" | "done">(play ? "sign" : "done");
  const ref = useRef<HTMLDivElement>(null);
  const pillars = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!play) return;
    lockScroll(true);
    const t1 = setTimeout(() => setStage((s) => (s === "sign" ? "rise" : s)), SIGN_MS);
    const t = setTimeout(() => setStage((s) => (s === "sign" || s === "rise" ? "open" : s)), RISE_MS);
    // progression : cinq piliers qui se remplissent un à un (écrit dans le DOM, sans re-rendu)
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / (RISE_MS - 100));
      const e = 1 - Math.pow(1 - k, 2.4);
      pillars.current.forEach((el, i) => el && (el.style.transform = `scaleY(${Math.min(1, Math.max(0, e * 5 - i))})`));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const skip = () => setStage((s) => (s === "sign" || s === "rise" ? "open" : s));
    addEventListener("pointerdown", skip, { once: true });
    addEventListener("keydown", skip, { once: true });
    return () => { clearTimeout(t); clearTimeout(t1); cancelAnimationFrame(raf); removeEventListener("pointerdown", skip); removeEventListener("keydown", skip); };
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
      {/* 0. le signe du C */}
      <AnimatePresence>
        {stage === "sign" && (
          <motion.div
            key="sign"
            className="absolute inset-0 grid place-items-center"
            exit={{ scale: 0.92, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.84, 0] }}
          >
            <Transmission delay={0.1} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* 1. le trône se dresse */}
      {stage !== "sign" && (
        <div className={open ? "opacity-0" : ""}>
          <Mark animate size={MARK} />
        </div>
      )}
      {stage === "rise" && (
        <motion.p
          className="label absolute left-1/2 top-[calc(50%+64px)] -translate-x-1/2 whitespace-nowrap text-ash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Le trône s'éveille
        </motion.p>
      )}
      {/* lignes de balayage, comme un vieil écran de surveillance */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(239,232,218,.035)_0_1px,transparent_1px_3px)]" aria-hidden />
      <motion.div className="absolute inset-x-5 bottom-6 flex items-end justify-between md:inset-x-10" animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.2 }}>
        <span className="label text-ash">5°19′N · 4°01′W · Abidjan</span>
        {/* progression : les cinq piliers du trône */}
        <span className="flex items-end gap-1.5" aria-hidden>
          {[12, 18, 24, 18, 12].map((h, i) => (
            <span key={i} className="relative w-1.5 bg-ivory/10" style={{ height: h }}>
              <span ref={(el) => { pillars.current[i] = el; }} className={`absolute inset-0 origin-bottom scale-y-0 ${i === 4 ? "bg-blood" : "bg-brass"}`} />
            </span>
          ))}
        </span>
      </motion.div>
      {/* clavier : n'importe quelle touche passe déjà l'intro, d'où tabIndex -1 */}
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setStage((s) => (s === "sign" || s === "rise" ? "open" : s))}
        className={`label absolute right-5 top-5 cursor-pointer border hairline px-4 py-2 text-ivory/70 transition-colors hover:border-brass hover:text-ivory md:right-10 ${open ? "opacity-0" : ""}`}
      >
        Entrer
      </button>
    </div>
  );
}
