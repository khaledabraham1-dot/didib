import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { brands, BrandIcon, type Brand } from "@/brands";

/*
 * Suivre la Conspiration : tous les comptes officiels, réseaux sociaux et plateformes musicales.
 * Au survol (ou au centre de l'écran sur tactile), la couleur de la marque monte dans la tuile
 * comme un pilier du trône qui se dresse.
 */

function Tile({ b, i }: { b: Brand; i: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ delay: (i % 5) * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <a
        href={b.href}
        target="_blank"
        rel="noreferrer"
        className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden border hairline bg-coal/40 p-5 transition-colors duration-500 hover:border-transparent md:p-6"
        style={{ ["--brand" as string]: b.color }}
        aria-label={`${b.name} : ${b.handle} (nouvel onglet)`}
      >
        {/* le pilier de couleur qui se dresse */}
        <span className="absolute inset-0 origin-bottom scale-y-0 bg-[var(--brand)] transition-transform duration-[700ms] ease-[var(--ease-throne)] group-hover:scale-y-100" aria-hidden />
        <span className="relative flex items-start justify-between">
          <BrandIcon brand={b} className="size-8 text-ivory transition-colors duration-500 md:size-9" />
          <ArrowUpRight className="size-4 text-ash transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ivory" aria-hidden />
        </span>
        <span className="relative">
          <span className="block font-display text-2xl italic leading-none md:text-3xl">{b.name}</span>
          <span className="mt-2 block truncate font-mono text-[11px] text-ash transition-colors duration-500 group-hover:text-ivory/90 md:text-xs">{b.handle}</span>
        </span>
      </a>
    </motion.li>
  );
}

export function Reseaux() {
  const social = brands.filter((b) => b.kind === "social");
  const music = brands.filter((b) => b.kind === "music");
  return (
    <section id="reseaux" className="relative bg-obsidian px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label text-brass">Comptes officiels</p>
            <h2 className="mt-3 font-display text-subtitle">
              Suivre la <em className="text-brass">Conspiration</em>
            </h2>
          </div>
          <p className="max-w-sm text-ivory/60">Les seuls comptes officiels de Didi B. Méfiez-vous des faux profils.</p>
        </div>

        <h3 className="label mt-14 border-b hairline pb-4 text-ash md:mt-20">Réseaux sociaux</h3>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {social.map((b, i) => <Tile key={b.id} b={b} i={i} />)}
        </ul>

        <h3 className="label mt-14 border-b hairline pb-4 text-ash">Écouter</h3>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {music.map((b, i) => <Tile key={b.id} b={b} i={i} />)}
        </ul>
      </div>
    </section>
  );
}
