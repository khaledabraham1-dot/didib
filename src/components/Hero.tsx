import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDownRight, Play } from "lucide-react";
import { Beams } from "./Beams";
import { Button } from "./ui/button";
import { stream } from "@/data";

const ease = [0.7, 0, 0.2, 1] as const;
const Letter = ({ c, i }: { c: string; i: number }) => (
  <span className="inline-block overflow-hidden pb-[.08em] align-bottom">
    <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 1.55 + i * 0.07, duration: 1, ease }}>
      {c === " " ? " " : c}
    </motion.span>
  </span>
);

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const listen = stream("Juventus Nueva Era")[0].href;

  return (
    <section id="top" ref={ref} className="grain relative h-[100svh] min-h-[640px] overflow-hidden bg-[radial-gradient(120%_80%_at_50%_110%,#2a2113_0%,#0b0a08_60%)]">
      <Beams />
      {/* méridien : coordonnées d'Abidjan */}
      <div className="absolute left-5 top-24 md:left-10 label text-ash">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>5°19′N · 4°01′W</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }} className="mt-1 text-brass">Babi · Côte d'Ivoire</motion.p>
      </div>
      <motion.p className="absolute right-5 top-24 md:right-10 label text-right text-ash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
        Ère <span className="text-blood">V</span><br />Juventus Nueva Era
      </motion.p>

      <motion.div style={{ y, opacity: fade }} className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 md:px-10 md:pb-14">
        <motion.p className="label mb-4 text-brass" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }}>
          Mojotrône — le règne continue
        </motion.p>
        <h1 className="font-display italic leading-[.78] tracking-[-.04em] text-ivory text-[clamp(96px,27vw,400px)]" aria-label="Didi B">
          {"Didi B".split("").map((c, i) => <Letter key={i} c={c} i={i} />)}
        </h1>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.p className="max-w-md font-sans text-[15px] leading-relaxed text-ivory/75" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3, duration: 1 }}>
            Abidjan l'a couronné. Les stades l'ont confirmé. Cinq ères, un seul trône — et une nouvelle génération qui se lève.
          </motion.p>
          <motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.45, duration: 0.8 }}>
            <Button asChild variant="crown" size="lg">
              <a href={listen} target="_blank" rel="noreferrer"><span className="relative z-10 inline-flex items-center gap-3"><Play className="fill-current" />Écouter Nueva Era</span></a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#eres"><span className="relative z-10 inline-flex items-center gap-3">Les cinq ères<ArrowDownRight /></span></a>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
