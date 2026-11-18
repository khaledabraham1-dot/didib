import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useVelocity } from "motion/react";
import { useRef } from "react";
import { tickerWords } from "@/data";
import { cn } from "@/lib/utils";
import { Mark } from "./Mark";

/*
 * Deux bandeaux croisés en diagonale, en sens inverse.
 * Ils accélèrent avec la vitesse de défilement, puis retrouvent leur allure de croisière.
 */
function Band({ dir, className, children }: { dir: 1 | -1; className?: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });

  useAnimationFrame((_, dt) => {
    if (reduce || !track.current) return;
    const w = track.current.scrollWidth / 2 || 1;
    const boost = 1 + Math.min(5, Math.abs(velocity.get()) / 350);
    const next = x.get() + dir * 48 * boost * (dt / 1000);
    x.set((((next % w) + w) % w) - w); // boucle sans couture dans [-w, 0]
  });

  return (
    <div className={cn("relative w-[110%] -translate-x-[5%] overflow-hidden", className)}>
      <motion.div ref={track} style={{ x }} className="flex w-max items-center">
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export function Ticker() {
  const words = (outline: boolean) => (
    <div className="flex items-center">
      {tickerWords.map((w, i) => (
        <span key={i} className="flex items-center gap-8 pr-8">
          <span
            className={cn(
              i % 2 ? "font-display text-3xl italic" : "font-sans font-wide text-2xl font-black uppercase tracking-[.06em]",
              outline && "text-transparent [-webkit-text-stroke:1px_rgba(239,232,218,.55)]",
            )}
          >
            {w}
          </span>
          <Mark size={18} className={outline ? "opacity-60" : "[&_rect]:fill-obsidian"} />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative z-[2] -my-6 overflow-x-clip py-14" aria-hidden>
      {/* bandeau de fond : contour ivoire, vers la droite */}
      <Band dir={1} className="absolute inset-x-0 top-1/2 -translate-y-1/2 rotate-[2.2deg] border-y hairline bg-ink py-4">
        {words(true)}
      </Band>
      {/* bandeau principal : laiton, vers la gauche */}
      <Band dir={-1} className="relative -rotate-[2.6deg] bg-brass py-4 text-obsidian shadow-[0_20px_60px_-20px_rgba(0,0,0,.9)]">
        {words(false)}
      </Band>
    </div>
  );
}
