import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Le Trône : cinq piliers = cinq ères. Le cinquième, Nueva Era, en rouge.
const H = [12, 18, 24, 18, 12];
export function Mark({ className, animate = false, size = 28 }: { className?: string; animate?: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={cn("shrink-0", className)} aria-hidden>
      {H.map((h, i) => (
        <motion.rect
          key={i}
          x={4 + i * 5.2}
          width={3}
          y={28 - h}
          height={h}
          fill={i === 4 ? "var(--color-blood)" : "var(--color-brass)"}
          initial={animate ? { scaleY: 0 } : false}
          animate={animate ? { scaleY: 1 } : undefined}
          transition={{ delay: 0.15 + i * 0.09, duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
          style={{ transformOrigin: "50% 100%", transformBox: "fill-box" }}
        />
      ))}
      <rect x={2} y={29} width={28} height={1.6} fill="var(--color-brass)" />
    </svg>
  );
}
