import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef } from "react";

/** Aimant : l'élément glisse vers le curseur quand on l'approche, puis revient en place avec un ressort. */
export function Magnetic({ children, strength = 0.32, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16, mass: 0.6 });
  const y = useSpring(my, { stiffness: 220, damping: 16, mass: 0.6 });
  const move = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { mx.set(0); my.set(0); };
  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={move} onPointerLeave={leave} className={className ?? "inline-block"}>
      {children}
    </motion.div>
  );
}
