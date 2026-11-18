import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SignePhoto } from "./SignePhoto";
import { Mark } from "./Mark";
import { lockScroll } from "@/lib/scroll";

/*
 * Le sacre d'ouverture.
 * 0. Le signe de la Conspiration (photo) : les deux mains en C se rejoignent, éclair, « Bienvenue dans la Conspiration ».
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
export const INTRO = play ? 4.0 : 0.1;
const SIGN_MS = 1700, RISE_MS = 2800; // fin du signe, puis ouverture

const MARK = 72; // taille du logo à l'écran, en px
// Même géométrie que <Mark /> : la découpe épouse exactement le logo.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${[12, 18, 24, 18, 12]
  .map((h, i) => `<rect x="${4 + i * 5.2}" y="${28 - h}" width="3" height="${h}"/>`)
  .join("")}<rect x="2" y="29" width="28" height="1.6"/></svg>`;
const MASK = `url("data:image/svg+xml,${encodeURIComponent(svg)}"), linear-gradient(#000 0 0)`;

export function Loader() {
  const [stage, setStage] = useState<"sign" | "rise" | "open" | "done">(play ? "sign" : "done");
  const ref = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!play) return;
    lockScroll(true);
    const t1 = setTimeout(() => setStage((s) => (s === "sign" ? "rise" : s)), SIGN_MS);
    const t = setTimeout(() => setStage((s) => (s === "sign" || s === "rise" ? "open" : s)), RISE_MS);
    // compteur 0 → 100 % calé sur la montée des piliers (écrit dans le DOM, sans re-rendu)
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / (RISE_MS - 100));
      const e = 1 - Math.pow(1 - k, 2.4);
      if (pct.current) pct.current.textContent = String(Math.round(e * 100)).padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${e})`;
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
            exit={{ scale: 1.18, opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.84, 0] }}
          >
            {/* le C en filigrane, immense */}
            <motion.span
              className="pointer-events-none absolute select-none font-display text-[min(150vw,130vh)] italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,162,75,.22)]"
              initial={{ scale: 0.55, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.75, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            >
              C
            </motion.span>
            <div className="relative flex flex-col items-center gap-6">
              <SignePhoto delay={0.05} />
              <p className="text-center font-display leading-[.95]">
                <Split text="Bienvenue" delay={1.15} className="block text-[clamp(30px,5vw,56px)] text-ivory" />
                <Split text="dans la Conspiration" delay={1.3} className="block text-[clamp(30px,5vw,56px)] italic text-brass" />
              </p>
            </div>
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
      <motion.div className="absolute inset-x-5 bottom-6 md:inset-x-10" animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.2 }}>
        <div className="label flex items-end justify-between text-ash">
          <span>La Conspiration · Abidjan</span>
          <span className="font-display text-heading not-italic tabular-nums tracking-normal text-ivory"><span ref={pct}>000</span><span className="text-brass">%</span></span>
        </div>
        <span className="mt-3 block h-px w-full bg-ivory/10"><span ref={bar} className="block h-full origin-left scale-x-0 bg-brass" /></span>
      </motion.div>
      {/* clavier : n'importe quelle touche passe déjà l'intro, d'où tabIndex -1 */}
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setStage((s) => (s === "sign" || s === "rise" ? "open" : s))}
        className={`label absolute right-5 top-5 cursor-pointer border hairline px-4 py-2 text-ivory/70 transition-colors hover:border-brass hover:text-ivory md:right-10 ${open ? "opacity-0" : ""}`}
      >
        Passer
      </button>
    </div>
  );
}

/** Titre découpé en lettres qui montent une à une. */
function Split({ text, delay, className }: { text: string; delay: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((c, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[.12em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            transition={{ delay: delay + i * 0.022, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {c === " " ? " " : c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
