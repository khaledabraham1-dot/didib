import { motion } from "motion/react";

const facts = [
  ["Nom", "Bassa Zéréhoué Diyilem"],
  ["Né le", "3 avril 1992, Abidjan"],
  ["Origine", "Kiff No Beat, fondé en 2009"],
  ["Surnom", "Babi Style"],
  ["Maisons", "Universal · 92i Africa · Africa Mindset"],
];

export function Story() {
  return (
    <section id="diyilem" className="relative bg-ivory px-5 py-28 text-obsidian md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-16 md:grid-cols-[5fr_7fr]">
        {/* Emplacement portrait : à remplacer par une photo officielle fournie par l'équipe */}
        <figure className="relative aspect-[3/4] overflow-hidden bg-obsidian md:sticky md:top-24 md:self-start">
          <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_38%,#3a2c16,transparent_70%)]" />
          <svg viewBox="0 0 200 260" className="absolute bottom-0 left-1/2 w-[78%] -translate-x-1/2" aria-hidden>
            <path d="M100 30c26 0 42 20 42 46 0 22-10 38-24 45v10c40 8 70 32 78 74v55H4v-55c8-42 38-66 78-74v-10c-14-7-24-23-24-45 0-26 16-46 42-46z" fill="#000" />
          </svg>
          <figcaption className="label absolute left-4 top-4 text-brass">Portrait officiel</figcaption>
          <span className="absolute bottom-4 right-4 font-display text-7xl italic text-brass/90">D.</span>
        </figure>
        <div>
          <p className="label text-brass-soft">III — Diyilem</p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mt-4 font-display text-[clamp(48px,7.5vw,120px)] italic leading-[.88] tracking-[-.03em]"
          >
            Avant le trône, il y avait <span className="text-blood">un quartier</span>, des cousins et un micro.
          </motion.h2>
          <div className="mt-12 grid gap-8 text-lg leading-relaxed text-obsidian/80 md:grid-cols-2">
            <p>
              Né à Abidjan en 1992, Diyilem fonde Kiff No Beat en 2009 avec ses cousins. Le groupe devient l'une des voix majeures du rap ivoirien.
            </p>
            <p>
              En solo, il écrit son propre récit, ère après ère : de Mojo Trône à History, jusqu'aux stades d'Abidjan et de Bouaké, puis une nouvelle ère en 2026.
            </p>
          </div>
          <dl className="mt-16 border-t border-obsidian/15">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-4 border-b border-obsidian/15 py-4 md:grid-cols-[180px_1fr]">
                <dt className="label text-obsidian/50">{k}</dt>
                <dd className="font-sans font-wide font-semibold uppercase tracking-[.06em]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
