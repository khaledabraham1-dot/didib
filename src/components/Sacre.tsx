import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { stages } from "@/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.4, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v.toLocaleString("fr-FR")}</span>;
}

export function Sacre() {
  return (
    <section id="sacre" className="grain relative overflow-hidden bg-obsidian px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <p className="label text-brass">II — Sur scène</p>
        <div className="mt-6 grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-end">
          <h2 className="font-display text-[clamp(84px,17vw,260px)] italic leading-[.8] tracking-[-.04em]">
            <Count to={30000} />
            <span className="text-brass">+</span>
          </h2>
          <p className="max-w-sm text-lg leading-snug text-ivory/80 md:pb-6">
            places au <span className="text-ivory">Stade Félix Houphouët-Boigny</span>, le 3 mai 2025. Le Félicia, rempli par un seul nom.
          </p>
        </div>

        <Tabs defaultValue="chronique" className="mt-20">
          <TabsList className="border-b hairline">
            <TabsTrigger value="chronique">Chronique</TabsTrigger>
            <TabsTrigger value="avenir">Prochaines dates</TabsTrigger>
          </TabsList>
          <TabsContent value="chronique" className="outline-none">
            <ol>
              {stages.map((s, i) => (
                <motion.li
                  key={s.place}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: i * 0.06, duration: 0.7 }}
                  className="group grid grid-cols-[84px_1fr] items-baseline gap-x-4 border-b hairline py-6 md:grid-cols-[160px_1fr_1fr_auto] md:gap-x-10"
                >
                  <span className="label text-ash">{s.date}</span>
                  <span className="font-display text-3xl italic leading-tight transition-colors group-hover:text-brass md:text-5xl">{s.place}</span>
                  <span className="col-start-2 mt-1 text-ivory/60 md:col-start-auto md:mt-0">{s.note}</span>
                  <span className="label col-start-2 mt-2 text-brass md:col-start-auto md:mt-0">{s.city}</span>
                </motion.li>
              ))}
            </ol>
          </TabsContent>
          <TabsContent value="avenir" className="outline-none">
            <div className="flex flex-col items-start gap-6 border-b hairline py-14">
              <p className="font-display text-4xl italic md:text-6xl">Les prochaines dates arrivent.</p>
              <p className="max-w-md text-ivory/70">Rejoignez la cour pour être prévenu avant tout le monde de l'ouverture de la billetterie.</p>
              <Button asChild variant="outline"><a href="#cour"><span className="relative z-10">Être prévenu</span></a></Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
