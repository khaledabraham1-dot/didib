import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { eras, stream, type Era } from "@/data";
import { cn, roman } from "@/lib/utils";

function useDesktop() {
  const [d, setD] = useState(() => typeof window !== "undefined" && matchMedia("(min-width: 768px)").matches);
  useEffect(() => {
    const m = matchMedia("(min-width: 768px)");
    const f = () => setD(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return d;
}

function Disc({ era, spin }: { era: Era; spin: number }) {
  return (
    <div
      className="relative aspect-square w-[min(68vw,340px)] rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,.8)] md:w-[min(34vw,460px)]"
      style={{
        transform: `rotate(${spin}deg)`,
        background: `radial-gradient(circle at 50% 50%, ${era.hue} 0 17%, #0b0a08 17.4% 18%, transparent 18.2%), repeating-radial-gradient(circle at 50% 50%, #12100c 0 1.6px, #1b1812 1.6px 3.2px)`,
      }}
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_40deg,transparent_0_20%,rgba(239,232,218,.10)_25%,transparent_32%_70%,rgba(239,232,218,.07)_75%,transparent_80%)]" />
      <div className="absolute inset-[34%] grid place-items-center rounded-full text-center">
        <span className="font-display text-[clamp(18px,3vw,34px)] italic leading-none text-ivory/90">{roman(era.n)}</span>
      </div>
      <div className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-obsidian" />
    </div>
  );
}

function Card({ era, spin }: { era: Era; spin: number }) {
  return (
    <article className="relative flex w-[86vw] shrink-0 snap-center flex-col gap-8 md:h-full md:w-[78vw] md:flex-row md:items-center md:gap-16 md:px-10">
      <span className="pointer-events-none absolute -top-6 right-0 select-none font-display text-[38vw] italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,162,75,.18)] md:-top-10 md:text-[24vw]" aria-hidden>
        {roman(era.n)}
      </span>
      <Disc era={era} spin={spin} />
      <div className="relative max-w-xl">
        <p className="label text-brass">
          Ère {roman(era.n)} · {era.year}
        </p>
        <h3 className="mt-3 font-display text-[clamp(44px,7vw,112px)] italic leading-[.9] tracking-[-.03em]">{era.title}</h3>
        <p className="mt-2 font-sans font-wide text-sm uppercase tracking-[.2em] text-ash">{era.kicker}</p>
        <p className="mt-6 max-w-sm text-lg leading-snug text-ivory/80">{era.line}</p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {stream(era.title).map((s) => (
            <li key={s.name}>
              <a href={s.href} target="_blank" rel="noreferrer" className="label inline-flex items-center gap-1 text-ivory/70 transition-colors hover:text-brass">
                {s.name}
                <ArrowUpRight className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Eras() {
  const desktop = useDesktop();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${((eras.length - 1) / eras.length) * 100}%`]);
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setP);
  const active = Math.min(eras.length - 1, Math.round(p * (eras.length - 1)));

  return (
    <section id="eres" ref={ref} className="relative bg-ink md:h-[520vh]">
      <div className="md:sticky md:top-0 md:flex md:h-screen md:flex-col md:overflow-hidden">
        <header className="flex items-end justify-between px-5 pb-8 pt-24 md:px-10 md:pt-24">
          <div>
            <p className="label text-brass">I — Discographie</p>
            <h2 className="mt-3 font-display text-[clamp(40px,6vw,88px)] italic leading-none">Les cinq ères</h2>
          </div>
          {/* les piliers du trône servent d'indicateur */}
          <div className="hidden items-end gap-2 md:flex" aria-hidden>
            {eras.map((e, i) => (
              <div key={e.n} className="flex flex-col items-center gap-2">
                <div className={cn("w-2 origin-bottom transition-all duration-700", i === 4 ? "bg-blood" : "bg-brass", i === active ? "h-14" : "h-6 opacity-40")} />
                <span className={cn("font-display text-xs", i === active ? "text-ivory" : "text-ash")}>{roman(e.n)}</span>
              </div>
            ))}
          </div>
        </header>
        {desktop ? (
          <motion.div style={{ x, width: `${eras.length * 100}%` }} className="flex flex-1 items-center">
            {eras.map((e) => (
              <div key={e.n} className="flex h-full w-full items-center justify-center">
                <Card era={e} spin={p * 720} />
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-20 [scrollbar-width:none]">
            {eras.map((e) => <Card key={e.n} era={e} spin={0} />)}
          </div>
        )}
      </div>
    </section>
  );
}
