import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cover, discography, type Project } from "@/sons";
import { cn } from "@/lib/utils";

/*
 * Le rayon : chaque projet est une pochette. Au survol (ou au focus clavier),
 * le vinyle glisse hors de la pochette et se met à tourner, l'étiquette reprend la pochette.
 */

const FILTERS = ["Tout", "Album", "EP"] as const;
type Filter = (typeof FILTERS)[number];
const q = (s: string) => encodeURIComponent(`Didi B ${s}`);

function Sleeve({ p, i }: { p: Project; i: number }) {
  const year = p.date.slice(-4);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: (i % 4) * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative hover:z-10 focus-within:z-10"
    >
      <a
        href={`https://www.deezer.com/album/${p.id}`}
        target="_blank"
        rel="noreferrer"
        className="relative block aspect-square"
        aria-label={`${p.title}, ${p.type.toLowerCase()} ${year}, écouter sur Deezer (nouvel onglet)`}
      >
        {/* le vinyle, caché derrière la pochette */}
        <span
          className="absolute inset-[3%] rounded-full shadow-[0_20px_40px_-12px_rgba(0,0,0,.9)] transition-transform duration-[900ms] ease-[var(--ease-throne)] group-hover:translate-x-[34%] group-focus-visible:translate-x-[34%]"
          aria-hidden
        >
          <span
            className="absolute inset-0 animate-[spin_2.4s_linear_infinite] rounded-full [animation-play-state:paused] group-hover:[animation-play-state:running]"
            style={{ background: "radial-gradient(circle, #0b0a08 0 17.5%, transparent 18%), repeating-radial-gradient(circle, #12100c 0 1.4px, #1d1a14 1.4px 2.8px)" }}
          >
            <img src={cover(p.md5, 120)} alt="" loading="lazy" decoding="async" className="absolute inset-[33%] size-[34%] rounded-full object-cover" />
            <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0_18%,rgba(239,232,218,.12)_24%,transparent_30%_68%,rgba(239,232,218,.08)_74%,transparent_80%)]" />
          </span>
        </span>
        {/* la pochette */}
        <span className="absolute inset-0 overflow-hidden bg-coal shadow-[0_24px_50px_-20px_rgba(0,0,0,.9)] transition-transform duration-[900ms] ease-[var(--ease-throne)] group-hover:-translate-x-[6%] group-focus-visible:-translate-x-[6%]">
          <img
            src={cover(p.md5, 500)}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover [filter:grayscale(.85)_sepia(.35)_brightness(.85)] transition-[filter] duration-700 group-hover:[filter:none] group-focus-visible:[filter:none]"
          />
          <span className="absolute inset-0 bg-[linear-gradient(115deg,rgba(239,232,218,.14)_0%,transparent_35%)]" />
          {p.note && <span className="label absolute left-2 top-2 bg-blood px-2 py-1 text-ivory">{p.note}</span>}
        </span>
      </a>
      <div className="mt-4 pr-2">
        <p className="label text-ash">
          {p.type} · {p.date}
        </p>
        <p className="mt-1 font-display text-xl italic leading-tight md:text-2xl">{p.title}</p>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {[
            ["Deezer", `https://www.deezer.com/album/${p.id}`],
            ["Spotify", `https://open.spotify.com/search/${q(p.title)}`],
            ["Apple Music", `https://music.apple.com/search?term=${q(p.title)}`],
          ].map(([n, h]) => (
            <a key={n} href={h} target="_blank" rel="noreferrer" className="label inline-flex items-center gap-1 text-ivory/60 transition-colors hover:text-brass">
              {n}
              <ArrowUpRight className="size-3" aria-hidden />
              <span className="sr-only"> : {p.title} (nouvel onglet)</span>
            </a>
          ))}
        </p>
      </div>
    </motion.li>
  );
}

export function Discographie() {
  const [f, setF] = useState<Filter>("Tout");
  const list = discography.filter((p) => f === "Tout" || p.type === f);
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b hairline pb-6">
        <h3 className="font-display text-heading">
          La <em className="text-brass">discographie</em>
        </h3>
        <div className="flex gap-1" role="group" aria-label="Filtrer les projets">
          {FILTERS.map((x) => (
            <button
              key={x}
              type="button"
              onClick={() => setF(x)}
              aria-pressed={f === x}
              className={cn("label cursor-pointer border px-3 py-2 transition-colors", f === x ? "border-brass bg-brass text-obsidian" : "hairline text-ivory/70 hover:text-ivory")}
            >
              {x === "Tout" ? `Tout · ${discography.length}` : x === "Album" ? "Albums" : "EP"}
            </button>
          ))}
        </div>
      </div>
      <motion.ul layout className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-10 md:gap-y-16">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => <Sleeve key={p.id} p={p} i={i} />)}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
