import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { photos, photoUrl, stages } from "@/data";
import { Photo } from "./Photo";

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) return setV(to);
    const c = animate(0, to, { duration: 2.4, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref} className="tabular-nums">{v.toLocaleString("fr-FR")}</span>;
}

const gallery = [
  { key: "femua", file: "scene-femua.webp", caption: "FEMUA · Abidjan", className: "md:col-span-7 aspect-[3/2]" },
  { key: "regard", file: "scene-regard.webp", caption: "Hors scène", className: "md:col-span-5 aspect-[3/4] md:aspect-[15/14]" },
  { key: "cotonou", file: "scene-cotonou.webp", caption: "WeLoveEya 2025 · Cotonou", className: "md:col-span-12 aspect-[16/9] md:aspect-[21/8]" },
] as const;

export function Sacre() {
  return (
    <section id="sacre" className="grain relative overflow-hidden bg-obsidian py-32 md:py-48">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="label text-brass">III — Sur scène</p>
        <div className="mt-6 grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-end">
          <h2 className="font-display text-stat italic tracking-[-.04em]">
            <span className="sr-only">Plus de 30 000</span>
            <span aria-hidden><Count to={30000} /><span className="text-brass">+</span></span>
          </h2>
          <p className="max-w-sm text-lg leading-snug text-ivory/80 md:pb-6">
            places au <span className="text-ivory">Stade Félix Houphouët-Boigny</span>, le 3 mai 2025. Le Félicia, rempli par un seul nom.
          </p>
        </div>
      </div>

      {/* plan large : la scène, révélée comme un rideau qui se lève */}
      <motion.div
        className="mt-20 md:mt-28"
        initial={{ clipPath: "inset(18% 0 18% 0)" }}
        whileInView={{ clipPath: "inset(0% 0 0% 0)" }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.4, ease: [0.7, 0, 0.2, 1] }}
      >
        <Photo
          srcSet={`${photoUrl("stage-1080.webp")} 1080w, ${photoUrl("stage-1920.webp")} 1920w`}
          src={photoUrl("stage-1080.webp")}
          photo={photos.stage}
          caption="FEMUA, 15e édition · Abidjan"
          className="aspect-[4/3] md:aspect-[21/9]"
        />
      </motion.div>

      <div className="mx-auto mt-24 max-w-[1440px] px-5 md:mt-32 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b hairline pb-6">
          <h3 className="font-display text-heading">Chronique</h3>
          <p className="label text-ash">2022 — aujourd'hui</p>
        </div>
        <ol>
          {stages.map((s, i) => (
            <motion.li
              key={s.place}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.06, duration: 0.7 }}
              className="group grid grid-cols-[92px_1fr] items-baseline gap-x-4 border-b hairline py-6 md:grid-cols-[180px_1fr_1fr_auto] md:gap-x-10"
            >
              <span className="label text-ash">{s.date}</span>
              <span className="font-display text-heading transition-colors group-hover:text-brass">{s.place}</span>
              <span className="col-start-2 mt-1 text-ivory/65 md:col-start-auto md:mt-0">{s.note}</span>
              <span className="label col-start-2 mt-2 text-brass md:col-start-auto md:mt-0">{s.city}</span>
            </motion.li>
          ))}
          <li className="grid grid-cols-[92px_1fr] items-baseline gap-x-4 py-8 md:grid-cols-[180px_1fr_auto] md:gap-x-10">
            <span className="label text-brass">À venir</span>
            <span className="font-display text-heading italic text-ivory/60">Les prochaines dates arrivent.</span>
            <a href="#cour" className="label col-start-2 mt-3 inline-flex items-center gap-2 text-ivory transition-colors hover:text-brass md:col-start-auto md:mt-0">
              Être prévenu <ArrowRight className="size-4" aria-hidden />
            </a>
          </li>
        </ol>

        <div className="mt-24 grid grid-cols-1 gap-3 md:mt-32 md:grid-cols-12 md:gap-5">
          {gallery.map((g, i) => (
            <motion.div
              key={g.key}
              className={g.className}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: (i % 2) * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <Photo src={photoUrl(g.file)} photo={photos[g.key]} caption={g.caption} className="size-full" sizes="(min-width: 768px) 60vw, 100vw" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
