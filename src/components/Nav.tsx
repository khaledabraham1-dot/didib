import { motion, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Mark } from "./Mark";
import { cn, roman } from "@/lib/utils";
import { useEffect, useState } from "react";

// section visible au centre de l'écran
function useActive(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export const links = [
  { id: "eres", label: "Les ères" },
  { id: "ecouter", label: "Écouter" },
  { id: "sacre", label: "Le sacre" },
  { id: "diyilem", label: "Diyilem" },
  { id: "boutique", label: "Boutique" },
  { id: "cour", label: "La cour" },
];
const ids = links.map((l) => l.id);

export function Nav() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const active = useActive(ids);
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-obsidian/80 backdrop-blur-md">
      <motion.div className="h-[2px] origin-left bg-brass" style={{ scaleX: x }} />
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10">
        <a href="#top" className="flex items-center gap-3" aria-label="Accueil">
          <Mark size={26} />
          <span className="font-sans font-wide text-[15px] font-extrabold tracking-[.18em]">DIDI B</span>
        </a>
        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l, i) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                aria-current={active === l.id ? "location" : undefined}
                className={cn("group label relative flex items-baseline gap-2 py-2 transition-colors hover:text-ivory", active === l.id ? "text-ivory" : "text-ivory/65")}
              >
                <span className="font-display text-[12px] normal-case tracking-normal text-brass">{roman(i + 1)}</span>
                {l.label}
                <span className={cn("absolute inset-x-0 -bottom-px h-px origin-left bg-brass transition-transform duration-500 ease-[var(--ease-throne)]", active === l.id ? "scale-x-100" : "scale-x-0")} />
              </a>
            </li>
          ))}
        </ul>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir le menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex h-16 items-center justify-between px-5">
              <Mark size={26} />
              <SheetClose asChild>
                <Button variant="ghost" size="icon" aria-label="Fermer le menu"><X /></Button>
              </SheetClose>
            </div>
            <ol className="flex flex-1 flex-col justify-center gap-2 px-6">
              {links.map((l, i) => (
                <li key={l.id} className="border-b hairline py-3">
                  <SheetClose asChild>
                    <a href={`#${l.id}`} className="flex items-baseline gap-4">
                      <span className="w-10 font-display text-xl text-brass">{roman(i + 1)}</span>
                      <span className="font-display text-[clamp(36px,11vw,48px)] italic leading-none">{l.label}</span>
                    </a>
                  </SheetClose>
                </li>
              ))}
            </ol>
            <p className="label px-6 pb-8 text-ash">Babi Style · Abidjan</p>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
