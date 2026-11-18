import { tickerWords } from "@/data";
import { Mark } from "./Mark";

export function Ticker() {
  const row = [...tickerWords, ...tickerWords];
  return (
    <div className="relative overflow-hidden border-y hairline bg-brass text-obsidian" aria-hidden>
      <div className="flex w-max animate-[ticker_38s_linear_infinite] items-center gap-8 py-4">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className={i % 2 ? "font-display text-3xl italic" : "font-sans font-wide text-2xl font-black uppercase tracking-[.06em]"}>{w}</span>
            <Mark size={20} className="[&_rect]:fill-obsidian" />
          </span>
        ))}
      </div>
    </div>
  );
}
