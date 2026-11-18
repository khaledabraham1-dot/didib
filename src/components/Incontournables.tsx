import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { toast } from "sonner";
import { cover, topTracks, type Track } from "@/sons";
import { jsonp } from "@/lib/jsonp";
import { toggle, usePlayer } from "@/lib/player";
import { cn } from "@/lib/utils";

type DeezerTop = { data?: { id: number; title: string; album: { title: string; md5_image?: string }; md5_image?: string; contributors?: { name: string }[]; artist: { name: string } }[] };

/** Top 10 Deezer, rechargé en direct ; la liste de secours s'affiche tout de suite. */
function useTop() {
  const [tracks, setTracks] = useState<Track[]>(topTracks);
  const [live, setLive] = useState<string | null>(null);
  useEffect(() => {
    jsonp<DeezerTop>("https://api.deezer.com/artist/6412878/top?limit=10")
      .then((r) => {
        if (!r.data?.length) return;
        setTracks(
          r.data.map((t) => ({
            id: t.id,
            title: t.title,
            artists: (t.contributors?.map((c) => c.name) ?? [t.artist.name]).join(", "),
            album: t.album.title,
            md5: t.album.md5_image ?? t.md5_image ?? "",
          })),
        );
        setLive(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
      })
      .catch(() => { /* on garde le classement de secours */ });
  }, []);
  return { tracks, live };
}

/** Égaliseur : quatre barres pilotées par --beat (le rythme réel du morceau). */
function Bars({ on }: { on: boolean }) {
  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden>
      {[0.55, 1, 0.75, 0.4].map((k, i) => (
        <span
          key={i}
          className="w-[3px] origin-bottom bg-brass transition-transform duration-100"
          style={{ height: "100%", transform: on ? `scaleY(calc(.18 + var(--beat, 0) * ${k}))` : "scaleY(.18)" }}
        />
      ))}
    </span>
  );
}

function Row({ t, i }: { t: Track; i: number }) {
  const p = usePlayer();
  const id = `top-${t.id}`;
  const mine = p.id === id;
  const playing = mine && p.status === "playing";
  const onClick = () => toggle(id, t.id).catch(() => toast.error("Extrait indisponible pour le moment."));
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ delay: (i % 5) * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-pressed={playing}
        aria-label={`${playing ? "Pause" : "Écouter l'extrait"} : ${t.title}, ${t.artists}`}
        className={cn(
          "group relative grid w-full cursor-pointer grid-cols-[34px_52px_1fr_auto] items-center gap-4 border-b hairline py-3 pr-2 text-left transition-colors md:grid-cols-[56px_64px_1.3fr_1fr_auto] md:gap-6 md:py-4",
          playing ? "bg-coal" : "hover:bg-coal/60",
        )}
      >
        <span className={cn("font-display text-2xl italic tabular-nums transition-colors md:text-3xl", playing ? "text-brass" : "text-ash group-hover:text-brass")}>
          {String(i + 1).padStart(2, "0")}
        </span>
        <span className="relative size-[52px] overflow-hidden bg-coal md:size-16">
          <img src={cover(t.md5, 120)} alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-700 ease-[var(--ease-throne)] group-hover:scale-110" />
          <span className={cn("absolute inset-0 grid place-items-center bg-obsidian/55 transition-opacity", playing ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
            {playing ? <Pause className="size-4 fill-ivory text-ivory" /> : <Play className="size-4 fill-ivory text-ivory" />}
          </span>
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-xl italic leading-tight md:text-2xl">{t.title}</span>
          <span className="label mt-1 block truncate text-ash">{t.artists}</span>
        </span>
        <span className="label hidden truncate text-ivory/50 md:block">{t.album}</span>
        <span className="flex items-center gap-3">
          <Bars on={playing} />
        </span>
        {/* progression de l'extrait */}
        <span className="absolute inset-x-0 -bottom-px h-px origin-left bg-brass transition-transform duration-300 ease-linear" style={{ transform: `scaleX(${mine ? p.progress : 0})` }} aria-hidden />
      </button>
    </motion.li>
  );
}

export function Incontournables() {
  const { tracks, live } = useTop();
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b hairline pb-6">
        <h3 className="font-display text-heading">
          Les <em className="text-brass">incontournables</em>
        </h3>
        <p className="label text-ash">
          {live ? <>Top 10 Deezer · en direct · {live}</> : "Top 10 Deezer"} · extraits 30 s
        </p>
      </div>
      <ol>
        {tracks.map((t, i) => <Row key={t.id} t={t} i={i} />)}
      </ol>
    </div>
  );
}
