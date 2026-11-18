import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mark } from "./Mark";

// L'intro ne se joue qu'une fois par visite : au retour, le contenu arrive tout de suite.
const firstVisit = (() => {
  try {
    if (sessionStorage.getItem("didib-intro")) return false;
    sessionStorage.setItem("didib-intro", "1");
  } catch { /* stockage indisponible : on joue l'intro */ }
  return true;
})();

/** Délai (s) avant les animations d'entrée du héros. */
export const INTRO = firstVisit ? 0.95 : 0.1;

export function Loader() {
  const [show, setShow] = useState(firstVisit);
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 800);
    return () => clearTimeout(t);
  }, [show]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-obsidian"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
          aria-hidden
        >
          <div className="flex flex-col items-center gap-5">
            <Mark animate size={72} />
            <motion.p className="label text-brass" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              Le trône s'éveille
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
