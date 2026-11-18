import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

/*
 * 30 000 points = 30 000 personnes.
 * Au défilement : poussière d'étoiles → le chiffre « 30 000 » → l'ovale du Félicia, fosse pleine, scène en rouge.
 * Canvas 2D, positions en Float32Array, rendu uniquement quand le défilement change.
 */

const PEOPLE = 30000;
const STAGE = 420; // points de la scène, en plus des spectateurs
const N = PEOPLE + STAGE;
const FONT = '"Bodoni Moda Variable", "Didot", serif';

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Field = { sx: Float32Array; sy: Float32Array; tx: Float32Array; ty: Float32Array; dx: Float32Array; dy: Float32Array; d1: Float32Array; d2: Float32Array };

function build(W: number, H: number): Field {
  const f: Field = {
    sx: new Float32Array(N), sy: new Float32Array(N), tx: new Float32Array(N), ty: new Float32Array(N),
    dx: new Float32Array(N), dy: new Float32Array(N), d1: new Float32Array(N), d2: new Float32Array(N),
  };
  // 1. le chiffre, échantillonné depuis un rendu typographique
  const c = document.createElement("canvas");
  c.width = Math.ceil(W); c.height = Math.ceil(H);
  const x = c.getContext("2d", { willReadFrequently: true })!;
  const fs = Math.min(W * 0.26, H * 0.52);
  x.font = `italic 400 ${fs}px ${FONT}`;
  x.textAlign = "center"; x.textBaseline = "middle";
  x.fillText("30 000", W / 2, H * 0.47);
  const px = x.getImageData(0, 0, c.width, c.height).data;
  const cand: number[] = [];
  for (let i = 3, k = 0; i < px.length; i += 4, k++) if (px[i] > 140) cand.push(k);
  const cw = c.width;

  // 2. le stade : fosse, gradins en anneaux, scène
  const cx = W / 2, cy = H * 0.54;
  const rx = Math.min(W * 0.44, H * 1.05), ry = rx * 0.36;

  for (let i = 0; i < N; i++) {
    f.sx[i] = Math.random() * W;
    f.sy[i] = Math.random() * H;
    const k = cand.length ? cand[(Math.random() * cand.length) | 0] : 0;
    f.tx[i] = (k % cw) + Math.random() - 0.5;
    f.ty[i] = ((k / cw) | 0) + Math.random() - 0.5;
    f.d1[i] = Math.random() * 0.35;
    f.d2[i] = Math.random() * 0.4;
    const th = Math.random() * Math.PI * 2;
    if (i >= PEOPLE) {
      // scène, au fond de la pelouse
      f.dx[i] = cx + (Math.random() - 0.5) * rx * 0.26;
      f.dy[i] = cy - ry * 0.4 + (Math.random() - 0.5) * ry * 0.1;
    } else if (i < PEOPLE * 0.3) {
      // fosse : dense près de la scène
      const r = Math.sqrt(Math.random()) * 0.5;
      const pull = 1 - r * 0.5;
      f.dx[i] = cx + Math.cos(th) * rx * r;
      f.dy[i] = cy + Math.sin(th) * ry * r - ry * 0.12 * pull;
    } else {
      // gradins : 14 rangées qui montent vers l'extérieur
      const tier = (Math.random() * 14) | 0;
      const r = 0.6 + tier * (0.4 / 14) + Math.random() * 0.014;
      f.dx[i] = cx + Math.cos(th) * rx * r;
      f.dy[i] = cy + Math.sin(th) * ry * r - (r - 0.6) * ry * 0.45;
    }
  }
  return f;
}

export function Crowd() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const progress = useRef(reduce ? 0.4 : 0);
  const draw = useRef<() => void>(() => {});

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    progress.current = v;
    draw.current();
  });
  const capA = useTransform(scrollYProgress, [0.12, 0.26, 0.44, 0.52], [0, 1, 1, 0]);
  const capB = useTransform(scrollYProgress, [0.72, 0.84], [0, 1]);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    let f: Field | null = null;
    let W = 0, H = 0, raf = 0, visible = false;

    // Rendu CPU dans un tampon de pixels, affiché en une seule opération :
    // coût constant, indépendant de la carte graphique (30 000 fillRect saturent les GPU modestes).
    let img: ImageData | null = null, u32: Uint32Array | null = null, dpr = 1;
    const rgba = (r: number, g: number, b: number, a: number) => ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
    const SHADES = [rgba(239, 232, 218, 242), rgba(201, 162, 75, 230), rgba(201, 162, 75, 130)];

    const render = () => {
      raf = 0;
      if (!f || !img || !u32) return;
      const p = progress.current;
      const m1 = clamp(p / 0.28), m2 = clamp((p - 0.45) / 0.35);
      const cw = img.width, ch = img.height;
      u32.fill(0);
      const size = Math.max(1, Math.round((W < 700 ? 1.1 : 1.4) * dpr));
      const red = rgba(179, 38, 30, Math.round(255 * (0.15 + 0.85 * m2)));
      for (let i = 0; i < N; i++) {
        let x: number, y: number;
        if (m2 <= 0) {
          const t = ease(clamp((m1 - f.d1[i]) / 0.65));
          x = f.sx[i] + (f.tx[i] - f.sx[i]) * t; y = f.sy[i] + (f.ty[i] - f.sy[i]) * t;
        } else {
          const t = ease(clamp((m2 - f.d2[i]) / 0.6));
          x = f.tx[i] + (f.dx[i] - f.tx[i]) * t; y = f.ty[i] + (f.dy[i] - f.ty[i]) * t;
        }
        const px = (x * dpr) | 0, py = (y * dpr) | 0;
        if (px < 0 || py < 0 || px + size > cw || py + size > ch) continue;
        const col = i >= PEOPLE ? red : SHADES[i % 3];
        for (let yy = 0; yy < size; yy++) {
          const row = (py + yy) * cw + px;
          for (let xx = 0; xx < size; xx++) u32[row + xx] = col;
        }
      }
      ctx.putImageData(img, 0, 0);
    };
    draw.current = () => { if (visible && !raf) raf = requestAnimationFrame(render); };

    const resize = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      img = ctx.createImageData(cv.width, cv.height);
      u32 = new Uint32Array(img.data.buffer);
      f = build(W, H);
      draw.current();
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; draw.current(); });
    io.observe(cv);
    let timer = 0;
    const onResize = () => { clearTimeout(timer); timer = window.setTimeout(resize, 150); };
    // la police doit être chargée avant d'échantillonner le chiffre
    document.fonts.load(`italic 400 100px ${FONT}`).finally(resize);
    addEventListener("resize", onResize);
    return () => { io.disconnect(); removeEventListener("resize", onResize); cancelAnimationFrame(raf); clearTimeout(timer); };
  }, []);

  return (
    <div ref={wrap} className={reduce ? "relative" : "relative h-[280vh]"}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 size-full" aria-hidden />
        <div className="pointer-events-none absolute inset-x-5 top-24 flex justify-between gap-6 md:inset-x-10">
          <p className="label text-brass">Stade Félix Houphouët-Boigny</p>
          <p className="label text-right text-ash">Abidjan · 03.05.2025</p>
        </div>
        <motion.p style={{ opacity: reduce ? 1 : capA }} className="pointer-events-none absolute inset-x-5 bottom-[12vh] text-center text-lg text-ivory/85 md:text-xl">
          Plus de <span className="text-brass">30 000 places</span>. Le Félicia, rempli par un seul nom.
        </motion.p>
        {!reduce && (
          <motion.div style={{ opacity: capB }} className="pointer-events-none absolute inset-x-5 bottom-[9vh] text-center">
            <p className="font-display text-heading italic">Un point, une personne.</p>
            <p className="label mt-3 text-ash">30 000 points sur cet écran · la scène en rouge</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
