import { useEffect, useRef } from "react";

// Projecteurs de stade : faisceaux laiton qui balaient lentement, suivent le pointeur,
// poussière dorée en suspension. Canvas léger, en pause hors écran.
export function Beams() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let px = 0.5, tx = 0.5;
    const dust = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.3, v: Math.random() * 0.00025 + 0.00008 }));
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e: PointerEvent) => { tx = e.clientX / window.innerWidth; };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) loop(performance.now()); });
    const beams = [0.12, 0.3, 0.5, 0.7, 0.88];
    const draw = (t: number) => {
      px += (tx - px) * 0.04;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      beams.forEach((b, i) => {
        const sway = Math.sin(t * 0.00035 + i * 1.7) * 0.09 + (px - 0.5) * 0.18;
        const bx = b * w, ex = (b + sway) * w;
        const g = ctx.createLinearGradient(bx, h, ex, 0);
        const red = i === 4;
        g.addColorStop(0, red ? "rgba(179,38,30,.28)" : "rgba(201,162,75,.30)");
        g.addColorStop(0.6, red ? "rgba(179,38,30,.05)" : "rgba(201,162,75,.06)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(bx - 6, h);
        ctx.lineTo(ex - w * 0.11, -20);
        ctx.lineTo(ex + w * 0.11, -20);
        ctx.lineTo(bx + 6, h);
        ctx.fill();
      });
      dust.forEach((d) => {
        d.y -= d.v * 16; if (d.y < -0.02) d.y = 1.02;
        ctx.fillStyle = `rgba(239,232,218,${0.25 + 0.35 * Math.sin(t * 0.002 + d.x * 40) ** 2})`;
        ctx.beginPath(); ctx.arc(d.x * w, d.y * h, d.r, 0, 7); ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";
    };
    const loop = (t: number) => { draw(t); if (visible && !reduce) raf = requestAnimationFrame(loop); };
    resize(); draw(0);
    addEventListener("resize", resize); addEventListener("pointermove", onMove, { passive: true });
    io.observe(c);
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener("resize", resize); removeEventListener("pointermove", onMove); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 size-full" aria-hidden />;
}
