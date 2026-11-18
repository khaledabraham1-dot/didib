import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { toast } from "sonner";
import { playerState, toggle, usePlayer } from "@/lib/player";
import { coverUrl, eras, stream, type Era } from "@/data";
import { cn, roman } from "@/lib/utils";
import { scrollToY } from "@/lib/scroll";
import { webglAvailable } from "@/three/support";

// Mode 3D : chaque disque enregistre son bouton ; un seul canvas WebGL dessine les cinq vinyles.
type Register = (n: number, el: HTMLElement | null, spin?: MotionValue<number>) => void;
const Vinyl3D = createContext<Register | null>(null);

function Tonearm({ on }: { on: boolean }) {
  // bras de lecture : repos hors du disque, se pose sur les sillons pendant la lecture
  return (
    <svg
      viewBox="0 0 40 200"
      className="pointer-events-none absolute -right-[9%] -top-[6%] h-[82%] w-[16%] transition-transform duration-[900ms] ease-[var(--ease-throne)]"
      style={{ transformOrigin: "50% 7%", transform: `rotate(${on ? 24 : 2}deg)` }}
      aria-hidden
    >
      <circle cx="20" cy="14" r="11" fill="#1d1a14" stroke="#c9a24b" strokeWidth="1.2" />
      <circle cx="20" cy="14" r="4" fill="#c9a24b" />
      <line x1="20" y1="14" x2="20" y2="168" stroke="#c9a24b" strokeWidth="2.6" strokeLinecap="square" />
      <rect x="13" y="166" width="14" height="24" fill="#c9a24b" />
      <rect x="17" y="190" width="6" height="6" fill="#efe8da" />
    </svg>
  );
}

function Disc({ era, spin }: { era: Era; spin?: MotionValue<number> }) {
  const player = usePlayer();
  const id = `era-${era.n}`;
  const mine = player.id === id;
  const playing = mine && player.status === "playing";
  const loading = mine && player.status === "loading";
  const onClick = () =>
    toggle(id, era.track.id).catch(() => toast.error("Extrait indisponible pour le moment. Écoutez l'album sur les plateformes."));

  const register = useContext(Vinyl3D);
  if (register) {
    return (
      <div className="relative w-[min(58vw,30svh)] shrink-0 [@media(max-height:620px)]:w-[min(50vw,25svh)] lg:w-[min(32vw,440px)]">
        <button
          ref={(el) => register(era.n, el, spin)}
          type="button"
          onClick={onClick}
          className="group relative block aspect-square w-full cursor-pointer rounded-full"
          aria-label={`${playing ? "Mettre en pause" : "Écouter"} l'extrait de ${era.track.title}, album ${era.title}`}
          aria-pressed={playing}
        >
          <span className={cn("absolute inset-0 grid place-items-center transition-opacity duration-500", playing || loading ? "opacity-0" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100")}>
            <span className="grid size-14 place-items-center bg-brass text-obsidian"><Play className="size-5 fill-current" aria-hidden /></span>
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-[min(58vw,30svh)] shrink-0 [@media(max-height:620px)]:w-[min(50vw,25svh)] lg:w-[min(32vw,440px)]">
      {/* halo qui bat au rythme réel du morceau (--beat, 0 à 1) */}
      <div
        className={cn("pointer-events-none absolute -inset-[14%] rounded-full transition-opacity duration-700", playing ? "opacity-100" : "opacity-0")}
        style={{
          background: `radial-gradient(circle, ${era.hue}cc 0%, transparent 62%)`,
          transform: "scale(calc(.92 + var(--beat, 0) * .22))",
          opacity: playing ? "calc(.35 + var(--beat, 0) * .65)" : undefined,
        }}
        aria-hidden
      />
      <button
        type="button"
        onClick={onClick}
        className="group relative block aspect-square w-full cursor-pointer rounded-full"
        aria-label={`${playing ? "Mettre en pause" : "Écouter"} l'extrait de ${era.track.title}, album ${era.title}`}
        aria-pressed={playing}
      >
        <motion.span className="absolute inset-0 block rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,.8)]" style={{ rotate: spin }}>
          <span
            className="absolute inset-0 block animate-[spin_1.8s_linear_infinite] rounded-full"
            style={{
              animationPlayState: playing ? "running" : "paused",
              background: `radial-gradient(circle at 50% 50%, #0b0a08 0 17.6%, transparent 18.2%), repeating-radial-gradient(circle at 50% 50%, #12100c 0 1.6px, #1b1812 1.6px 3.2px)`,
            }}
          >
            {/* pochette officielle en étiquette centrale */}
            <img
              src={coverUrl(era.cover, 250)}
              alt=""
              loading="lazy"
              decoding="async"
              className={cn(
                "absolute inset-[33%] size-[34%] rounded-full object-cover transition-[filter] duration-700",
                playing ? "[filter:none]" : "[filter:grayscale(1)_sepia(.5)_brightness(.8)] group-hover:[filter:none]",
              )}
            />
            <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-obsidian" />
          </span>
          <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_40deg,transparent_0_20%,rgba(239,232,218,.10)_25%,transparent_32%_70%,rgba(239,232,218,.07)_75%,transparent_80%)]" />
        </motion.span>
        <span className={cn("absolute inset-0 grid place-items-center transition-opacity duration-500", playing || loading ? "opacity-0" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100")}>
          <span className="grid size-14 place-items-center bg-brass text-obsidian"><Play className="size-5 fill-current" aria-hidden /></span>
        </span>
      </button>
      <Tonearm on={playing || loading} />
    </div>
  );
}

function Card({ era, spin }: { era: Era; spin?: MotionValue<number> }) {
  const player = usePlayer();
  const id = `era-${era.n}`;
  const mine = player.id === id;
  const playing = mine && player.status === "playing";
  const onClick = () =>
    toggle(id, era.track.id).catch(() => toast.error("Extrait indisponible pour le moment. Écoutez l'album sur les plateformes."));
  return (
    <article className="relative flex h-full w-full flex-col justify-center gap-6 px-5 lg:w-[78vw] lg:flex-row lg:items-center lg:gap-20 lg:px-10">
      <span className="pointer-events-none absolute -top-6 right-0 select-none font-display text-[38vw] italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,162,75,.18)] lg:-top-10 lg:text-[24vw]" aria-hidden>
        {roman(era.n)}
      </span>
      <Disc era={era} spin={spin} />
      <div className="relative max-w-xl">
        <p className="label text-brass">
          Ère {roman(era.n)} · {era.year}
        </p>
        <h3 className="mt-2 font-display text-[clamp(28px,9vw,48px)] italic leading-[.95] tracking-[-.03em] lg:mt-3 lg:text-title">{era.title}</h3>
        <p className="mt-2 font-sans font-wide text-sm uppercase tracking-[.2em] text-ash">{era.kicker}</p>
        <p className="mt-3 max-w-sm leading-snug text-ivory/80 max-lg:[@media(max-height:700px)]:hidden lg:mt-6 lg:text-lg">{era.line}</p>

        {/* extrait officiel */}
        <button type="button" onClick={onClick} className="group mt-4 flex w-full max-w-sm cursor-pointer items-center gap-4 border hairline px-4 py-3 text-left transition-colors hover:border-brass" aria-pressed={playing}>
          <span className="grid size-10 shrink-0 place-items-center bg-brass text-obsidian">
            {playing ? <Pause className="size-4 fill-current" aria-hidden /> : <Play className="size-4 fill-current" aria-hidden />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="label block text-ash">{mine && player.status === "loading" ? "Chargement…" : "Extrait · 30 s"}</span>
            <span className="mt-0.5 block truncate font-display text-xl italic">{era.track.title}</span>
            <span className="mt-2 block h-px w-full bg-ivory/15">
              <span className="block h-full origin-left bg-brass transition-transform duration-300 ease-linear" style={{ transform: `scaleX(${mine ? player.progress : 0})` }} />
            </span>
          </span>
        </button>

        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 max-lg:[@media(max-height:620px)]:hidden lg:mt-6">
          {stream(era.title).map((s) => (
            <li key={s.name}>
              <a href={s.href} target="_blank" rel="noreferrer" className="label inline-flex items-center gap-1 py-1.5 text-ivory/70 transition-colors hover:text-brass">
                {s.name}
                <ArrowUpRight className="size-3.5" aria-hidden />
                <span className="sr-only"> : {era.title} (nouvel onglet)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Eras() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${((eras.length - 1) / eras.length) * 100}%`]);
  // la rotation passe par une MotionValue : aucun re-rendu React pendant le défilement
  const spin = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(eras.length - 1, Math.round(v * (eras.length - 1)))));
  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop + (i / (eras.length - 1)) * (el.offsetHeight - innerHeight);
    scrollToY(top);
  };

  // --- vinyles 3D ---
  const [gl] = useState(webglAvailable);
  const canvas = useRef<HTMLCanvasElement>(null);
  const discs = useRef(new Map<number, { el: HTMLElement; spin?: MotionValue<number> }>());
  const register = useCallback<Register>((n, el, sp) => {
    if (el) discs.current.set(n, { el, spin: sp });
    else discs.current.delete(n);
  }, []);
  useEffect(() => {
    if (!gl || !canvas.current) return;
    const cv = canvas.current;
    let dead = false;
    let api: { dispose(): void } | null = null;
    import("@/three/vinyl").then(({ mountVinyls }) => {
      if (dead) return;
      api = mountVinyls(cv, () =>
        eras.flatMap((e) => {
          const d = discs.current.get(e.n);
          if (!d) return [];
          return [{
            el: d.el,
            cover: coverUrl(e.cover, 500),
            hue: e.hue,
            spin: () => d.spin?.get() ?? 0,
            state: () => {
              const p = playerState();
              const mine = p.id === `era-${e.n}`;
              return { playing: mine && p.status === "playing", loading: mine && p.status === "loading" };
            },
          }];
        }),
      );
    });
    return () => { dead = true; api?.dispose(); };
  }, [gl]);

  return (
    <Vinyl3D.Provider value={gl ? register : null}>
    <section id="eres" ref={ref} className="relative h-[340vh] bg-ink lg:h-[300vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {gl && <canvas ref={canvas} className="pointer-events-none absolute inset-0 z-0 size-full" aria-hidden />}
        <header className="relative z-[1] flex items-end justify-between px-5 pb-2 pt-20 lg:px-10 lg:pb-8 lg:pt-24">
          <div>
            <p className="label text-brass">I · Discographie</p>
            <h2 className="mt-2 font-display text-[clamp(32px,8vw,40px)] leading-none lg:mt-3 lg:text-subtitle">Les cinq ères</h2>
          </div>
          {/* les piliers du trône : indicateur et navigation */}
          <nav className="flex items-end gap-0.5 lg:gap-1" aria-label="Choisir une ère">
            {eras.map((e, i) => (
              <button
                key={e.n}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ère ${roman(e.n)} : ${e.title}`}
                aria-current={i === active ? "step" : undefined}
                className="group flex min-w-6 cursor-pointer flex-col items-center gap-2 px-2 pt-2"
              >
                <span className={cn("block w-2 origin-bottom transition-all duration-700 ease-[var(--ease-throne)]", i === 4 ? "bg-blood" : "bg-brass", i === active ? "h-9 lg:h-14" : "h-4 opacity-40 group-hover:h-6 group-hover:opacity-80 lg:h-6 lg:group-hover:h-9")} />
                <span className={cn("font-display text-xs transition-colors", i === active ? "text-ivory" : "text-ash group-hover:text-ivory")}>{roman(e.n)}</span>
              </button>
            ))}
          </nav>
        </header>
        <motion.div style={{ x, width: `${eras.length * 100}%` }} className="relative z-[1] flex min-h-0 flex-1 items-center">
          {eras.map((e) => (
            <div key={e.n} className="flex h-full w-full items-center justify-center">
              <Card era={e} spin={spin} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
    </Vinyl3D.Provider>
  );
}
