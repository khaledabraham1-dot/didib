import { motion } from "motion/react";

/*
 * Le signe de la Conspiration : la main forme un C.
 * Dessin au trait (laiton), tracé à l'écran comme une gravure : doigts repliés en haut,
 * pouce en bas, l'ouverture du C tournée vers la droite.
 */

const ease = [0.65, 0, 0.35, 1] as const;
// Silhouette du C : doigts repliés (bras du haut), creux de la paume, pouce (bras du bas), poignet.
const OUTLINE =
  "M58 196 L62 150 C40 120 44 70 80 46 C108 28 150 32 166 54 C176 68 170 84 156 84 C150 85 146 82 144 78 C140 82 134 80 132 74 C124 62 100 62 90 76 C80 90 80 112 92 124 C104 136 134 136 152 128 C164 122 174 130 170 142 C166 156 142 166 118 164 C106 163 98 168 96 178 L94 196";
// détails : phalanges, ongle du pouce, dos de la main
const DETAILS = ["M150 52 C156 60 156 70 150 76", "M118 40 C124 46 126 56 122 62", "M156 132 C160 136 160 144 156 148", "M76 60 C70 66 66 76 66 86"];

export function SigneC({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative grid place-items-center">
      {/* lueur */}
      <motion.div
        className="absolute size-[min(70vw,420px)] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,.35),transparent_62%)]"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.2, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
      />
      <motion.svg
        viewBox="30 24 160 180"
        className="relative w-[min(52vw,260px)] overflow-visible"
        fill="none"
        stroke="var(--color-brass)"
                strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ rotate: -14, scale: 0.86 }}
        animate={{ rotate: 0, scale: [0.86, 1, 1.07, 1] }}
        transition={{ delay, duration: 1.5, times: [0, 0.7, 0.82, 1], ease: "easeOut" }}
        aria-hidden
      >
        <defs>
          <linearGradient id="signe-c-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a2c16" />
            <stop offset="1" stopColor="#14120e" />
          </linearGradient>
        </defs>
        {/* le remplissage arrive une fois le contour tracé */}
        <motion.path
          d={OUTLINE}
          fill="url(#signe-c-fill)"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.75, duration: 0.6 }}
        />
        <motion.path
          d={OUTLINE}
          strokeWidth={3.4}
          pathLength={1}
          strokeDasharray="1 1"
          initial={{ strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ delay: delay + 0.05, duration: 1.05, ease }}
        />
        {DETAILS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            strokeWidth={2.2}
            strokeOpacity={0.55}
            pathLength={1}
            strokeDasharray="1 1"
            initial={{ strokeDashoffset: 1 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ delay: delay + 0.8 + i * 0.07, duration: 0.5, ease }}
          />
        ))}
      </motion.svg>
      {/* éclair au moment où le signe se ferme */}
      <motion.div
        className="pointer-events-none absolute size-40 rounded-full bg-[radial-gradient(circle,rgba(239,232,218,.95),rgba(201,162,75,.4)_40%,transparent_70%)]"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 1.5, 2.6], opacity: [0, 0.9, 0] }}
        transition={{ delay: delay + 1.05, duration: 0.9, times: [0, 0.3, 1], ease: "easeOut" }}
        aria-hidden
      />
    </div>
  );
}
