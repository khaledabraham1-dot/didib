import { socials, SHOW_CONCEPT_NOTICE } from "@/data";
import { Mark } from "./Mark";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-obsidian px-5 pt-20 pb-8 md:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <Mark size={56} />
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {socials.map((s) => (
              <li key={s.name}><a href={s.href} className="label text-ivory/70 transition-colors hover:text-brass">{s.name}</a></li>
            ))}
          </ul>
        </div>
        <p className="mt-16 select-none font-display text-[27vw] italic leading-[.75] tracking-[-.05em] text-transparent [-webkit-text-stroke:1px_rgba(201,162,75,.45)]" aria-hidden>Didi B</p>
        <div className="mt-10 flex flex-col gap-3 border-t hairline pt-6 md:flex-row md:justify-between">
          <p className="label text-ash">© {new Date().getFullYear()} Didi B · Babi Style</p>
          {SHOW_CONCEPT_NOTICE && <p className="label text-ash">Concept de site non officiel · conçu par SK DIGITAL</p>}
        </div>
      </div>
    </footer>
  );
}
