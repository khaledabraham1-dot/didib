import { merch } from "@/data";
import { ArrowRight } from "lucide-react";
import { Mark } from "./Mark";
import { Button } from "./ui/button";

const Art = ({ i }: { i: number }) => {
  if (i === 0) return <div className="font-display text-[110px] italic leading-none text-ivory">05</div>;
  if (i === 1) return <Mark size={120} />;
  if (i === 2) return <div className="text-center font-sans font-wide text-2xl font-black uppercase leading-none tracking-[.1em] text-brass">Babi<br />Style</div>;
  return <div className="size-36 rounded-full bg-[radial-gradient(circle,#a8873f_0_17%,#0b0a08_18%_19%,transparent_19.5%),repeating-radial-gradient(circle,#12100c_0_1.6px,#1d1a14_1.6px_3.2px)]" />;
};

export function Shop() {
  return (
    <section id="boutique" className="bg-ink px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label text-brass">VI · Boutique</p>
            <h2 className="mt-3 font-display text-subtitle">Porter la couronne</h2>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="label text-ash">Drop Nueva Era · en préparation</p>
            <Button asChild variant="outline" className="max-w-full px-5 sm:px-8"><a href="#cour"><span className="relative z-10 inline-flex items-center gap-3">Être prévenu du drop<ArrowRight /></span></a></Button>
          </div>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {merch.map((m, i) => (
            <li key={m.name} className="group">
              <div className="grain relative grid aspect-[4/5] place-items-center overflow-hidden bg-coal transition-transform duration-700 ease-[var(--ease-throne)] group-hover:-translate-y-2">
                <div className="transition-transform duration-700 ease-[var(--ease-throne)] group-hover:scale-110"><Art i={i} /></div>
              </div>
              <p className="mt-3 font-sans font-wide text-sm font-bold uppercase tracking-[.08em]">{m.name}</p>
              <p className="label mt-1 text-ash">{m.tag}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
