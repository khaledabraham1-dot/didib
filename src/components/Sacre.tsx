import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Crowd } from "./Crowd";
import { ArrowRight } from "lucide-react";
import { photos, photoUrl, stages } from "@/data";
import { Photo } from "./Photo";

const gallery = [
  { key: "femua", file: "scene-femua.webp", caption: "FEMUA · Abidjan", className: "md:col-span-7 aspect-[3/2]" },
  { key: "regard", file: "scene-regard.webp", caption: "Hors scène", className: "md:col-span-5 aspect-[3/4] md:aspect-[15/14]" },
  { key: "cotonou", file: "scene-cotonou.webp", caption: "WeLoveEya 2025 · Cotonou", className: "md:col-span-12 aspect-[16/9] md:aspect-[21/8]" },
] as const;

export function Sacre() {
  // la ligne de la chronique se trace au fil du défilement
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 70%", "end 55%"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  return (
    <section id="sacre" className="grain relative bg-obsidian pt-28 pb-32 md:pt-40 md:pb-48">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="label text-brass">III · Sur scène</p>
        <h2 className="sr-only">Plus de 30 000 places au Stade Félix Houphouët-Boigny, le 3 mai 2025 : le Félicia, rempli par un seul nom.</h2>
      </div>

      <Crowd />

      {/* plan large : la scène, révélée comme un rideau qui se lève */}
      <motion.div
        className="mt-8 md:mt-12"
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
          <p className="label text-ash">2022 à aujourd'hui</p>
        </div>
        <ol ref={list} className="relative">
          <span className="absolute bottom-0 left-[5px] top-0 w-px bg-ivory/10" aria-hidden />
          <motion.span style={{ scaleY: line }} className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-brass" aria-hidden />
          {stages.map((s, i) => (
            <motion.li
              key={s.place}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.06, duration: 0.7 }}
              className="group relative grid grid-cols-[92px_1fr] items-baseline gap-x-4 border-b hairline py-6 pl-8 md:grid-cols-[180px_1fr_1fr_auto] md:gap-x-10 md:pl-12"
            >
              {/* repère : s'allume quand la ligne l'atteint */}
              <motion.span
                aria-hidden
                className="absolute left-0 top-[34px] size-[11px] rounded-full border border-brass bg-obsidian"
                initial={{ scale: 0.6 }}
                whileInView={{ scale: 1, backgroundColor: "#c9a24b", boxShadow: "0 0 18px rgba(201,162,75,.7)" }}
                viewport={{ margin: "0px 0px -45% 0px" }}
                transition={{ duration: 0.5 }}
              />
              <span className="label text-ash">{s.date}</span>
              <span className="font-display text-heading transition-colors group-hover:text-brass">{s.place}</span>
              <span className="col-start-2 mt-1 text-ivory/65 md:col-start-auto md:mt-0">{s.note}</span>
              <span className="label col-start-2 mt-2 text-brass md:col-start-auto md:mt-0">{s.city}</span>
            </motion.li>
          ))}
          <li className="relative grid grid-cols-[92px_1fr] items-baseline gap-x-4 py-8 pl-8 md:grid-cols-[180px_1fr_auto] md:gap-x-10 md:pl-12">
            <span aria-hidden className="absolute left-0 top-[42px] size-[11px] animate-pulse rounded-full bg-blood shadow-[0_0_18px_rgba(179,38,30,.8)]" />
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
