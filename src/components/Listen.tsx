import { useState } from "react";
import { brands, BrandIcon } from "@/brands";
import { Incontournables } from "./Incontournables";
import { Discographie } from "./Discographie";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { clips, latest, type Clip } from "@/data";
import { cn } from "@/lib/utils";

/*
 * Lecteurs « à la demande » : rien n'est chargé depuis YouTube ou Spotify tant que le visiteur
 * n'a pas cliqué. Résultat : page légère, aucun cookie tiers sans action explicite.
 * Les affiches YouTube sont de simples images (i.ytimg.com, sans cookie).
 */

const NOTICE = "Le lecteur se charge au clic et peut déposer des cookies.";

function ClipPlayer({ clip, featured = false, index }: { clip: Clip; featured?: boolean; index: number }) {
  const [on, setOn] = useState(false);
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${clip.id}/maxresdefault.jpg`);
  const label = `${clip.title}${clip.feat ? ` ft. ${clip.feat}` : ""}`;
  return (
    <motion.figure
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay: (index % 3) * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(featured && "md:col-span-3")}
    >
      <div className="group relative aspect-video overflow-hidden bg-coal">
        {on ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${clip.id}?autoplay=1&rel=0&modestbranding=1`}
            title={`Didi B, ${label} (clip officiel)`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setOn(true)} className="absolute inset-0 size-full cursor-pointer text-left" aria-label={`Lire le clip ${label}`}>
            <img
              src={poster}
              onLoad={(e) => e.currentTarget.naturalWidth <= 120 && setPoster(`https://i.ytimg.com/vi/${clip.id}/hqdefault.jpg`)}
              onError={() => setPoster(`https://i.ytimg.com/vi/${clip.id}/hqdefault.jpg`)}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover [filter:grayscale(1)_sepia(.45)_brightness(.8)_contrast(1.1)] transition-[filter,transform] duration-[1.2s] ease-[var(--ease-throne)] group-hover:scale-[1.03] group-hover:[filter:none] group-focus-visible:[filter:none]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent" />
            <span className={cn("absolute grid place-items-center bg-brass text-obsidian transition-transform duration-500 ease-[var(--ease-throne)] group-hover:scale-110", featured ? "left-5 top-5 size-16 md:left-8 md:top-8 md:size-20" : "left-4 top-4 size-12")}>
              <Play className={cn("fill-current", featured ? "size-6 md:size-7" : "size-5")} aria-hidden />
            </span>
            <span className={cn("absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-5", featured && "md:inset-x-8 md:bottom-8")}>
              <span className="label block text-brass">Clip officiel{clip.album ? ` · ${clip.album}` : ""}</span>
              <span className={cn("mt-1 block font-display italic leading-none text-ivory", featured ? "text-title" : "text-heading")}>{clip.title}</span>
              {clip.feat && <span className="label mt-2 block text-ivory/70">ft. {clip.feat}</span>}
            </span>
          </button>
        )}
      </div>
    </motion.figure>
  );
}

function SpotifyPlayer() {
  const [on, setOn] = useState(false);
  return (
    <div className="relative h-[352px] overflow-hidden border hairline bg-coal">
      {on ? (
        <iframe
          className="size-full"
          src={`https://open.spotify.com/embed/album/${latest.spotifyAlbum}?theme=0`}
          title={`Didi B, ${latest.title} sur Spotify`}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      ) : (
        <button type="button" onClick={() => setOn(true)} className="group grain flex size-full cursor-pointer flex-col justify-between p-6 text-left md:p-8">
          <span className="flex items-start justify-between gap-4"><span className="label text-brass">Nouvel album · {latest.tracks} titres</span><span className="label text-ash">{latest.date}</span></span>
          <span>
            <span className="flex items-center gap-4">
              <span className="grid size-14 place-items-center bg-brass text-obsidian transition-transform duration-500 ease-[var(--ease-throne)] group-hover:scale-110">
                <Play className="size-5 fill-current" aria-hidden />
              </span>
              <span><span className="label block text-ash">Écouter sur Spotify</span><span className="mt-1 block font-display text-heading italic">{latest.title}</span></span>
            </span>
            <span className="label mt-5 block text-ash">℗ {latest.label}</span>
            <span className="mt-4 block text-sm text-ivory/55">{NOTICE}</span>
          </span>
        </button>
      )}
    </div>
  );
}

export function Listen() {
  const [first, ...rest] = clips;
  return (
    <section id="ecouter" className="relative bg-obsidian px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 md:grid-cols-[1fr_minmax(0,460px)] md:items-end md:gap-20">
          <div>
            <p className="label text-brass">II · Les sons</p>
            <h2 className="mt-3 font-display text-subtitle">Le son du trône</h2>
            <p className="mt-6 max-w-md text-lg leading-snug text-ivory/75">
              Le nouvel album {latest.title}, les incontournables, toute la discographie et les clips officiels. Un clic, et la Conspiration s'allume.
            </p>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {brands.filter((b) => b.kind === "music" || b.id === "youtube").map((b) => (
                <li key={b.id}>
                  <a href={b.href} target="_blank" rel="noreferrer" className="label inline-flex items-center gap-2 border-b border-transparent pb-1 text-ivory/80 transition-colors hover:border-brass hover:text-brass">
                    <BrandIcon brand={b} className="size-4" />
                    {b.name}
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <SpotifyPlayer />
        </div>

        <div className="mt-24 md:mt-32"><Incontournables /></div>
        <div className="mt-24 md:mt-32"><Discographie /></div>

        <div className="mt-24 flex items-end justify-between gap-6 border-b hairline pb-6 md:mt-32">
          <h3 className="font-display text-heading">Clips</h3>
          <p className="label hidden text-ash md:block">{NOTICE}</p>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3 md:gap-5">
          <ClipPlayer clip={first} featured index={0} />
          {rest.map((c, i) => <ClipPlayer key={c.id} clip={c} index={i} />)}
        </div>
        <p className="label mt-4 text-ash md:hidden">{NOTICE}</p>
      </div>
    </section>
  );
}
