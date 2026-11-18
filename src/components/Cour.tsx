import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Magnetic } from "./Magnetic";

export function Cour() {
  const [v, setV] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (v.trim().length < 6) return toast.error("Entrez un e-mail ou un numéro valide.");
    // TODO : brancher sur l'outil de newsletter de l'équipe (Mailchimp, Brevo, WhatsApp Business…)
    toast.success("Bienvenue à la cour. Vous serez prévenu en premier.");
    setV("");
  };
  return (
    <section id="cour" className="grain relative overflow-hidden bg-blood px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-2 md:items-end">
        <div>
          <p className="label text-obsidian/80">VI · La cour</p>
          <h2 className="mt-4 font-display text-title italic tracking-[-.03em]">Entrer<br />dans la cour.</h2>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-6">
          <p className="max-w-md text-lg text-ivory/85">Sorties, billetterie, éditions limitées : la cour l'apprend avant tout le monde.</p>
          <label className="sr-only" htmlFor="contact">E-mail ou WhatsApp</label>
          <Input id="contact" value={v} onChange={(e) => setV(e.target.value)} placeholder="E-mail ou WhatsApp" className="border-ivory/50 focus:border-ivory placeholder:text-ivory/60" />
          <Magnetic className="self-start">
            <Button type="submit" variant="crown" size="lg" className="bg-obsidian text-ivory before:bg-ivory hover:text-obsidian">
              Rejoindre <ArrowRight />
            </Button>
          </Magnetic>
        </form>
      </div>
    </section>
  );
}
