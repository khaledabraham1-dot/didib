import { motion } from "motion/react";
import { photoUrl } from "@/data";

/*
 * Le signe de la Conspiration, en photo : Didi B croise les bras, chaque main forme un C.
 * La photo arrive en deux moitiés (une main de chaque côté) qui se rejoignent ; éclair à la jonction.
 *
 * DROITS : photo fournie par le client, auteur inconnu (miniature web). À faire valider par l'équipe
 * de l'artiste, ou remplacer par une photo officielle HD (même nom : public/photos/signe.webp), avant diffusion.
 */

const ease = [0.16, 1, 0.3, 1] as const;
const src = photoUrl("signe.webp");

function Half({ side, delay }: { side: "l" | "r"; delay: number }) {
  const l = side === "l";
  return (
    <motion.div
      className="absolute inset-0"
      style={{ clipPath: l ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)" }}
      initial={{ x: l ? "-70%" : "70%", rotate: l ? -16 : 16, opacity: 0 }}
      animate={{ x: "0%", rotate: 0, opacity: 1 }}
      transition={{ delay, duration: 1.15, ease }}
    >
      <img src={src} alt="" className="size-full object-cover" draggable={false} />
    </motion.div>
  );
}

export function SignePhoto({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative grid place-items-center">
      {/* lueur derrière le signe */}
      <motion.div
        className="absolute size-[min(96vw,560px,70vh)] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,.32),transparent_62%)]"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 1.3, ease }}
        aria-hidden
      />
      <motion.div
        className="relative size-[min(72vw,380px,46vh)] [mask-image:radial-gradient(circle_at_50%_48%,#000_52%,transparent_71%)]"
        animate={{ scale: [1, 1, 1.06, 1] }}
        transition={{ delay, duration: 1.6, times: [0, 0.68, 0.78, 1] }}
      >
        <Half side="l" delay={delay} />
        <Half side="r" delay={delay} />
      </motion.div>
      {/* éclair à la jonction des deux mains */}
      <motion.div
        className="pointer-events-none absolute size-40 rounded-full bg-[radial-gradient(circle,rgba(239,232,218,.95),rgba(201,162,75,.45)_40%,transparent_70%)] mix-blend-screen"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 1.6, 2.8], opacity: [0, 0.9, 0] }}
        transition={{ delay: delay + 1.0, duration: 0.9, times: [0, 0.3, 1], ease: "easeOut" }}
        aria-hidden
      />
    </div>
  );
}
