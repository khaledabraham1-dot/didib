import { motion } from "motion/react";
import { Photo } from "./Photo";
import { photos, photoUrl } from "@/data";

const facts = [
  ["Nom", "Bassa Zéréhoué Diyilem"],
  ["Né le", "3 avril 1992, Abidjan"],
  ["Origine", "Kiff No Beat, fondé en 2009"],
  ["Surnom", "Babi Style"],
  ["Maisons", "Africa Mindset · Universal · 92i Africa · Repat Agency"],
];

export function Story() {
  return (
    <section id="diyilem" className="relative bg-ivory px-5 py-24 text-obsidian md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-16 md:grid-cols-[5fr_7fr]">
        <div className="md:sticky md:top-24 md:self-start">
          <Photo
            src={photoUrl("portrait.webp")}
            photo={photos.portrait}
            caption="Diyilem"
            className="aspect-[3/4]"
            imgClassName="object-[50%_20%]"
            sizes="(min-width: 768px) 40vw, 100vw"
          />
        </div>
        <div>
          <p className="label text-brass-soft">IV · Diyilem</p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mt-4 font-display text-subtitle tracking-[-.03em]"
          >
            Avant le trône, il y avait <em className="text-brass-soft">un quartier</em>, des cousins et un micro.
          </motion.h2>
          <div className="mt-12 grid gap-8 text-lg leading-relaxed text-obsidian/85 md:grid-cols-2">
            <p>
              Né à Abidjan en 1992, Diyilem fonde Kiff No Beat en 2009 avec ses cousins. Le groupe devient l'une des voix majeures du rap ivoirien.
            </p>
            <p>
              En solo, il écrit son propre récit, ère après ère : de Mojo Trône à History, jusqu'aux stades d'Abidjan et de Bouaké, puis Juventus Nueva Era en 2025 et Shogun in Lagos en 2026.
            </p>
          </div>
          <dl className="mt-16 border-t border-obsidian/15">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-4 border-b border-obsidian/15 py-4 md:grid-cols-[180px_1fr]">
                <dt className="label text-obsidian/70">{k}</dt>
                <dd className="font-sans font-wide font-semibold uppercase tracking-[.06em]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
