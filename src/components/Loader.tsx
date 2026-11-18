import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mark } from "./Mark";

export function Loader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-obsidian"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
        >
          <div className="flex flex-col items-center gap-5">
            <Mark animate size={72} />
            <motion.p className="label text-brass" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              Le trône s'éveille
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
