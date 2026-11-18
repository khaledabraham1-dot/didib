import { cn } from "@/lib/utils";
import { photoLicense } from "@/data";

type Credit = { alt: string; author: string; source: string };

/** Photo de la DA : zoom lent au survol, légende et crédit CC BY-SA toujours visibles. */
export function Photo({ src, srcSet, sizes = "100vw", photo, caption, className, imgClassName }: {
  src: string;
  srcSet?: string;
  sizes?: string;
  photo: Credit;
  caption?: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <figure className={cn("group relative overflow-hidden bg-coal", className)}>
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        className={cn("size-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-throne)] group-hover:scale-[1.04]", imgClassName)}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian/80 to-transparent" />
      <figcaption className="absolute inset-x-3 bottom-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 md:inset-x-5 md:bottom-4">
        {caption && <span className="label text-ivory">{caption}</span>}
        <span className="font-mono text-[11px] tracking-wide text-ivory/70">
          Photo{" "}
          <a href={photo.source} target="_blank" rel="noreferrer" className="underline decoration-ivory/30 underline-offset-2 hover:text-brass">{photo.author}</a>
          {" · "}
          <a href={photoLicense.href} target="_blank" rel="noreferrer" className="underline decoration-ivory/30 underline-offset-2 hover:text-brass">{photoLicense.name}</a>
        </span>
      </figcaption>
    </figure>
  );
}
