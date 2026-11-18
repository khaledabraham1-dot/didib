import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { awards, palmaresSources, records, type Award } from "@/sons";

/*
 * La vitrine : les trophées comme des plaques de laiton gravées, éclairées par un projecteur.
 * Au survol, la plaque s'incline vers le curseur et un reflet de lumière la traverse.
 */

const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = typeof matchMedia !== "undefined" && matchMedia("(pointer: fine)").matches;

function Plaque({ a, i }: { a: Award; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || reduce || !fine) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 14}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ delay: (i % 3) * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="[perspective:900px]"
    >
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        className="group relative h-full overflow-hidden border border-brass/35 bg-[linear-gradient(160deg,#241e14_0%,#14120e_55%,#1b160d_100%)] p-6 transition-transform duration-300 ease-out [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d] md:p-8"
      >
        {/* reflet qui suit le curseur */}
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(420px circle at var(--gx,50%) var(--gy,0%), rgba(239,222,170,.16), transparent 45%)" }}
          aria-hidden
        />
        {/* vis de fixation, comme une plaque gravée */}
        {["left-3 top-3", "right-3 top-3", "left-3 bottom-3", "right-3 bottom-3"].map((p) => (
          <span key={p} className={`absolute ${p} size-1.5 rounded-full bg-brass/50`} aria-hidden />
        ))}
        <div className="relative flex items-start justify-between gap-4">
          <p className="label text-brass">{a.ceremony}</p>
          <p className="font-display text-5xl italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,162,75,.6)] md:text-6xl">{a.year}</p>
        </div>
        <p className="relative mt-10 font-display text-2xl italic leading-tight md:text-3xl">{a.title}</p>
        <p className="label relative mt-4 text-ash">{a.detail}</p>
      </div>
    </motion.li>
  );
}

export function Palmares() {
  return (
    <section id="palmares" className="relative overflow-hidden bg-ink px-5 py-28 md:px-10 md:py-40">
      {/* projecteur de vitrine */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(201,162,75,.16),transparent_70%)]" aria-hidden />
      <div className="relative mx-auto max-w-[1440px]">
        <p className="label text-brass">IV · Palmarès</p>
        <h2 className="mt-3 font-display text-subtitle">
          La <em className="text-brass">vitrine</em>
        </h2>

        {/* records */}
        <ul className="mt-14 grid grid-cols-2 border-t hairline md:mt-20 md:grid-cols-4">
          {records.map((r, i) => (
            <motion.li
              key={r.unit}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border-b hairline py-8 pr-4 odd:border-r even:pl-4 md:border-b-0 md:border-r md:px-6 md:py-10 md:first:pl-0 md:last:border-r-0"
            >
              <p className="font-display text-[clamp(40px,5vw,72px)] italic leading-none text-brass">{r.value}</p>
              <p className="label mt-3 text-ivory">{r.unit}</p>
              <p className="mt-3 max-w-[30ch] text-sm leading-snug text-ivory/60">{r.text}</p>
            </motion.li>
          ))}
        </ul>

        {/* trophées */}
        <ul className="mt-16 grid gap-4 md:mt-24 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {awards.map((a, i) => <Plaque key={a.ceremony + a.year + a.title} a={a} i={i} />)}
        </ul>

        <p className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ivory/45">
          <span className="label text-ash">Sources</span>
          {palmaresSources.map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-ivory/20 underline-offset-2 hover:text-brass">
              {s.name}
              <ArrowUpRight className="size-3" aria-hidden />
            </a>
          ))}
        </p>
      </div>
    </section>
  );
}
