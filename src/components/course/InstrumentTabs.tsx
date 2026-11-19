// Fileira de instrumentos no topo da página inicial: ícones grandes, um por instrumento.
// O atual fica aceso na cor dele; os que ainda não têm curso aparecem com cadeado.
import { Lock } from "lucide-react";
import { cn } from "../../lib/cn";
import type { Instrument, InstrumentId } from "../../data/instruments";
import { L } from "../../i18n";
import { InstrumentIcon } from "./InstrumentIcon";

export function InstrumentTabs({ instruments, selected, onSelect }: { instruments: Instrument[]; selected: InstrumentId; onSelect: (id: InstrumentId) => void }) {
  return (
    <div role="radiogroup" aria-label={L("Instrumento", "Instrument")} className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {instruments.map((ins) => {
        const sel = ins.id === selected;
        return (
          <button
            key={ins.id}
            type="button"
            role="radio"
            aria-checked={sel}
            disabled={!ins.available}
            onClick={() => ins.available && !sel && onSelect(ins.id)}
            aria-label={ins.available ? ins.name : `${ins.name}, ${L("em breve", "coming soon")}`}
            title={ins.available ? ins.tagline : L("Em breve", "Coming soon")}
            className={cn(
              "group relative flex w-24 shrink-0 flex-col items-center gap-2 rounded-md border px-2 pb-3 pt-4 transition-colors focus-ring",
              sel ? "border-[var(--ins)] bg-[color-mix(in_srgb,var(--ins)_12%,transparent)]" : "border-transparent",
              ins.available && !sel && "hover:bg-surface",
              !ins.available && "opacity-45",
            )}
            style={{ ["--ins" as string]: `var(--accent-${ins.id})` }}
          >
            {!ins.available && <Lock className="absolute right-2 top-2 size-3.5 text-muted" aria-hidden />}
            <InstrumentIcon
              id={ins.id}
              className={cn(
                "size-14 transition-[color,transform] duration-[var(--dur-fast)]",
                sel ? "text-[var(--ins)]" : ins.available ? "text-muted group-hover:scale-105 group-hover:text-[var(--ins)]" : "text-muted",
              )}
            />
            <span className={cn("text-sm font-semibold", sel ? "text-fg" : "text-muted")}>{ins.name}</span>
          </button>
        );
      })}
    </div>
  );
}
