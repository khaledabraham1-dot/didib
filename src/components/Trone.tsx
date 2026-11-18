import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { eras } from "@/data";
import { roman } from "@/lib/utils";
import { webglAvailable } from "@/three/support";

/*
 * Prologue, le Trône. Le logo bâti en 3D (voir src/three/throne.ts) : une ère par pilier.
 * Sans WebGL, la section n'est pas affichée (le reste du site raconte la même histoire).
 */
export function Trone() {
  const [gl] = useState(webglAvailable);
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const api = useRef<{ setProgress(v: number): void; dispose(): void } | null>(null);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => api.current?.setProgress(v));
  const intro = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const title = useTransform(scrollYProgress, [0.68, 0.86], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.68, 0.86], [40, 0]);

  useEffect(() => {
    if (!gl || !canvas.current) return;
    const cv = canvas.current;
    let dead = false;
    import("@/three/throne").then(({ mountThrone }) => {
      if (dead) return;
      api.current = mountThrone(cv, labels.current);
      api.current.setProgress(scrollYProgress.get());
    });
    return () => { dead = true; api.current?.dispose(); api.current = null; };
  }, [gl, scrollYProgress]);

  if (!gl) return null;
  return (
    <section ref={wrap} aria-labelledby="trone-titre" className={reduce ? "relative bg-obsidian" : "relative h-[260vh] bg-obsidian"}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 size-full" aria-hidden />
        {/* voile bas : enchaînement avec la section suivante */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian to-transparent" />

        <div className="pointer-events-none absolute inset-x-5 top-24 flex justify-between gap-6 md:inset-x-10">
          <p className="label text-brass">Prologue · Le trône</p>
          <p className="label text-right text-ash">Cinq piliers · cinq ères</p>
        </div>

        {!reduce && (
          <motion.p style={{ opacity: intro }} className="pointer-events-none absolute inset-x-5 bottom-[14vh] text-center font-display text-heading italic text-ivory/85">
            Un trône ne se reçoit pas.<br />Il se bâtit, une ère après l'autre.
          </motion.p>
        )}

        {/* une étiquette au pied de chaque pilier, placée par la scène 3D */}
        <ol className="pointer-events-none absolute inset-0" aria-label="Les cinq ères">
          {eras.map((e, i) => (
            <li
              key={e.n}
              ref={(el) => { labels.current[i] = el; }}
              className="absolute left-0 top-0 hidden w-28 text-center opacity-0 will-change-transform sm:block"
            >
              <span className={`block font-display text-xl italic ${i === 4 ? "text-blood" : "text-brass"}`}>{roman(e.n)}</span>
              <span className="label mt-1 block text-[10px] text-ivory/70">{e.year}</span>
              <span className="mt-0.5 block text-xs leading-tight text-ivory/85">{e.title}</span>
            </li>
          ))}
        </ol>

        <motion.div style={reduce ? undefined : { opacity: title, y: titleY }} className="pointer-events-none absolute inset-x-5 top-[16vh] text-center md:top-[14vh]">
          <h2 id="trone-titre" className="font-display text-title italic tracking-[-.03em]">
            Cinq ères. <span className="text-brass">Un seul trône.</span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
