import { motion, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Mark } from "./Mark";
import { roman } from "@/lib/utils";

export const links = [
  { id: "eres", label: "Les ères" },
  { id: "sacre", label: "Le sacre" },
  { id: "diyilem", label: "Diyilem" },
  { id: "boutique", label: "Boutique" },
  { id: "cour", label: "La cour" },
];

export function Nav() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-obsidian/80 backdrop-blur-md">
      <motion.div className="h-[2px] origin-left bg-brass" style={{ scaleX: x }} />
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10">
        <a href="#top" className="flex items-center gap-3" aria-label="Accueil">
          <Mark size={26} />
          <span className="font-sans font-wide text-[15px] font-extrabold tracking-[.18em]">DIDI B</span>
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l, i) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className="group label flex items-baseline gap-2 text-ivory/80 transition-colors hover:text-ivory">
                <span className="font-display text-[11px] normal-case tracking-normal text-brass">{roman(i + 1)}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu">
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
                      <span className="font-display text-5xl italic leading-none">{l.label}</span>
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
