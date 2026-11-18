import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { latest } from "@/data";

// Uniquement des faits vérifiés (voir data.ts et la mémoire projet).
const stats = [
  { from: 0, to: 30000, suffix: "+", label: "places au Félicia, Abidjan, le 03.05.2025", tone: "text-brass" },
  { from: 0, to: latest.tracks, suffix: "", label: `titres sur ${latest.title}, sorti le ${latest.date}`, tone: "text-ivory" },
  { from: 0, to: 5, suffix: "", label: "ères, de Mojo Trône à Juventus Nueva Era", tone: "text-ivory" },
  { from: 1992, to: 2009, suffix: "", label: "Kiff No Beat naît avec ses cousins, à Abidjan", tone: "text-blood" },
];

const fmt = (n: number, year: boolean) => (year ? String(n) : n.toLocaleString("fr-FR"));

function Count({ from, to, suffix }: { from: number; to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const year = from > 1000;
  const [v, setV] = useState(reduce ? to : from);
  useEffect(() => {
    if (!seen || reduce) return;
    const dur = year ? 1400 : 2000;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      setV(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 4))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduce, from, to, year]);
  return (
    <span ref={ref} className="tabular-nums">
      {fmt(v, year)}
      {suffix}
    </span>
  );
}

export function Chiffres() {
  return (
    <section aria-label="Chiffres clés" className="bg-obsidian px-5 pb-8 pt-20 md:px-10 md:pt-28">
      <ul className="mx-auto grid max-w-[1440px] grid-cols-2 border-t hairline md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.li
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: i * 0.09, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="border-b hairline py-8 pr-4 odd:border-r even:pl-4 md:border-b-0 md:border-r md:px-6 md:py-10 md:first:pl-0 md:last:border-r-0"
          >
            <p className={`font-display text-heading italic md:text-[clamp(44px,5vw,80px)] md:leading-none ${s.tone}`}>
              <Count from={s.from} to={s.to} suffix={s.suffix} />
            </p>
            <p className="mt-3 max-w-[22ch] text-sm leading-snug text-ivory/65">{s.label}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
