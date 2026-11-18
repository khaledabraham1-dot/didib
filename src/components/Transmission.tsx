import { useEffect, useRef } from "react";
import { animate, motion } from "motion/react";
import { photoUrl } from "@/data";

/*
 * « La transmission » : l'entrée dans la Conspiration se vit comme un message clandestin.
 * 1. Un texte chiffré se décode lettre par lettre.
 * 2. La photo du signe (les deux mains en C) sort de l'ombre sous un faisceau de lampe torche.
 * 3. Un sceau de cire « C » en laiton tamponne le document.
 *
 * DROITS : photo du signe fournie par le client, auteur inconnu. À faire valider par l'équipe
 * de l'artiste ou remplacer par une photo officielle HD (même nom : public/photos/signe.webp).
 */

const GLYPHS = "ΔΣΞ#%&/\\<>[]{}=+*01ΛΦΨ§¤";

/** Texte chiffré qui se déchiffre de gauche à droite (écrit dans le DOM, sans re-rendu React). */
export function Decode({ text, delay, duration = 1100, className }: { text: string; delay: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0, t0 = 0;
    const scramble = (k: number) =>
      text
        .split("")
        .map((c, i) => {
          if (c === " ") return " ";
          const lock = i / text.length; // chaque lettre se fige à son tour
          return k >= lock ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        })
        .join("");
    el.textContent = scramble(-1);
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const k = (now - t0) / duration;
      el.textContent = scramble(k);
      if (k < 1.05) raf = requestAnimationFrame(tick);
      else el.textContent = text;
    };
    const t = setTimeout(() => (raf = requestAnimationFrame(tick)), delay * 1000);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [text, delay, duration]);
  return <span ref={ref} className={className} aria-label={text} />;
}

/** La photo, révélée par un faisceau qui balaie l'image puis s'arrête sur les mains. */
function Torchlight({ delay }: { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = (x: number, y: number, r: number) =>
      el.style.setProperty("mask-image", `radial-gradient(circle at ${x}% ${y}%, #000 ${r}%, transparent ${r + 16}%)`);
    set(12, 28, 0);
    // trajet du faisceau : bord gauche → visage → les deux mains, puis il s'ouvre
    const path = [
      [12, 28, 0], [22, 30, 14], [52, 36, 16], [72, 52, 16], [50, 56, 22], [50, 50, 70],
    ];
    const c = animate(0, path.length - 1, {
      delay,
      duration: 1.7,
      ease: [0.45, 0, 0.2, 1],
      onUpdate: (v) => {
        const i = Math.min(path.length - 2, Math.floor(v)), f = v - i;
        const [x0, y0, r0] = path[i], [x1, y1, r1] = path[i + 1];
        set(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, r0 + (r1 - r0) * f);
      },
    });
    return () => c.stop();
  }, [delay]);
  return (
    <div ref={ref} className="absolute inset-0">
      <img src={photoUrl("signe.webp")} alt="" className="size-full object-cover" draggable={false} />
    </div>
  );
}

export function Transmission({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="relative flex flex-col items-center"
      // léger choc au moment où le sceau frappe
      animate={{ x: [0, 0, -5, 4, -2, 0] }}
      transition={{ delay: delay + 1.85, duration: 0.35, times: [0, 0.01, 0.25, 0.5, 0.75, 1] }}
    >
      <p className="label mb-5 flex items-center gap-3 text-ash">
        <motion.span
          className="inline-block size-1.5 bg-blood"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
        <Decode text="Transmission · niveau confidentiel" delay={delay} duration={700} />
      </p>

      {/* le document : la photo sous la lampe torche */}
      <div className="relative size-[min(70vw,360px,44vh)] border hairline bg-[#070605]">
        <Torchlight delay={delay + 0.2} />
        {/* repères de cadrage, comme un tirage d'archive */}
        {["left-2 top-2 border-l border-t", "right-2 top-2 border-r border-t", "left-2 bottom-2 border-l border-b", "right-2 bottom-2 border-r border-b"].map((p) => (
          <span key={p} className={`absolute size-4 border-brass/70 ${p}`} aria-hidden />
        ))}
        <span className="label absolute left-3 top-3 text-[10px] text-brass/80">Pièce n° C-01</span>

        {/* le sceau de cire « C » */}
        <motion.div
          className="absolute -bottom-7 -right-7 grid size-24 place-items-center rounded-full shadow-[0_10px_30px_rgba(0,0,0,.7)] md:size-28"
          style={{ background: "radial-gradient(circle at 35% 30%, #e6c47a 0%, #c9a24b 35%, #7d5f22 75%, #4a3812 100%)" }}
          initial={{ scale: 2.6, opacity: 0, rotate: -28 }}
          animate={{ scale: 1, opacity: 1, rotate: -10 }}
          transition={{ delay: delay + 1.6, type: "spring", stiffness: 420, damping: 18 }}
        >
          <span className="absolute inset-[9%] rounded-full border border-obsidian/35" />
          <span className="font-display text-6xl italic leading-none text-obsidian/85 md:text-7xl">C</span>
        </motion.div>
      </div>

      <p className="mt-10 text-center font-display text-[clamp(26px,4.4vw,52px)] leading-[1.02]">
        <Decode text="Bienvenue" delay={delay + 0.55} duration={800} className="block text-ivory" />
        <Decode text="dans la Conspiration" delay={delay + 0.8} duration={1000} className="block italic text-brass" />
      </p>
    </motion.div>
  );
}
