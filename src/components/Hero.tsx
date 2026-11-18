import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDownRight, Play } from "lucide-react";
import { Beams } from "./Beams";
import { Button } from "./ui/button";
import { INTRO } from "./Loader";
import { photos, photoUrl } from "@/data";

const ease = [0.7, 0, 0.2, 1] as const;
const Letter = ({ c, i }: { c: string; i: number }) => (
  <span className="inline-block overflow-hidden pb-[.08em] align-bottom" aria-hidden>
    <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: INTRO + i * 0.05, duration: 0.9, ease }}>
      {c === " " ? " " : c}
    </motion.span>
  </span>
);

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const d = INTRO + 0.5;

  return (
    <section id="top" ref={ref} className="grain relative h-[100svh] min-h-[640px] overflow-hidden bg-obsidian">
      {/* photo de scène, étalonnée en duotone laiton */}
      <motion.div style={{ y: photoY }} className="absolute inset-0">
        <motion.picture
          className="block size-full"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: INTRO - 0.1, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <source media="(min-width: 768px)" srcSet={`${photoUrl("hero-1080.webp")} 1080w, ${photoUrl("hero-1920.webp")} 1920w`} sizes="100vw" />
          <img
            src={photoUrl("hero-mobile.webp")}
            alt={photos.hero.alt}
            fetchPriority="high"
            className="size-full object-cover object-[40%_20%] md:object-[50%_22%]"
          />
        </motion.picture>
      </motion.div>
      {/* voiles : lisibilité du titre, vignettage */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#0b0a08_6%,rgba(11,10,8,.72)_38%,rgba(11,10,8,.2)_70%,rgba(11,10,8,.55)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_40%,rgba(11,10,8,.7)_100%)]" />
      <div className="absolute inset-0 opacity-70 mix-blend-screen"><Beams /></div>

      <div className="absolute left-5 top-24 md:left-10 label text-ivory/70">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>5°19′N · 4°01′W</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d + 0.1 }} className="mt-1 text-brass">Babi · Côte d'Ivoire</motion.p>
      </div>
      <motion.p className="absolute right-5 top-24 md:right-10 label text-right text-ivory/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d + 0.2 }}>
        Nouvel album · 06.11.2026<br /><span className="text-ivory">Shogun in Lagos</span>
      </motion.p>

      <motion.div style={{ y, opacity: fade }} className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 md:px-10 md:pb-14">
        <motion.p className="label mb-4 text-brass" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: INTRO, duration: 0.8 }}>
          Mojotrône — le règne continue
        </motion.p>
        <h1 className="font-display text-hero italic tracking-[-.04em] text-ivory">
          <span className="sr-only">Didi B</span>
          {"Didi B".split("").map((c, i) => <Letter key={i} c={c} i={i} />)}
        </h1>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.p className="max-w-md font-sans text-[15px] leading-relaxed text-ivory/85" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d, duration: 1 }}>
            Abidjan l'a couronné. Les stades l'ont confirmé. Cinq ères, un seul trône — et une nouvelle génération qui se lève.
          </motion.p>
          <motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d + 0.15, duration: 0.8 }}>
            <Button asChild variant="crown" size="lg">
              <a href="#ecouter"><span className="relative z-10 inline-flex items-center gap-3"><Play className="fill-current" />Écouter Shogun in Lagos</span></a>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-obsidian/40 backdrop-blur-sm">
              <a href="#eres"><span className="relative z-10 inline-flex items-center gap-3">Les cinq ères<ArrowDownRight /></span></a>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
