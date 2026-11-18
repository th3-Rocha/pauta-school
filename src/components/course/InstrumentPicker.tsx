// src/components/course/InstrumentPicker.tsx
import { AudioLines, Check, Drum, Guitar, Lock, MicVocal, Piano, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";
import type { Instrument, InstrumentId } from "../../data/instruments";

const ICONS: Record<InstrumentId, LucideIcon> = {
  guitarra: Guitar,
  violao: Guitar,
  baixo: Guitar,
  ukulele: Guitar,
  teclado: Piano,
  gaita: AudioLines,
  bateria: Drum,
  canto: MicVocal,
};

export type InstrumentPickerProps = {
  instruments: Instrument[];
  selected: InstrumentId;
  onSelect: (id: InstrumentId) => void;
  className?: string;
};

/** Grade de instrumentos. Os que ainda não têm curso aparecem bloqueados. */
export function InstrumentPicker({ instruments, selected, onSelect, className }: InstrumentPickerProps) {
  return (
    <div role="radiogroup" aria-label="Instrumento" className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      {instruments.map((ins) => {
        const Icon = ICONS[ins.id];
        const isSel = ins.id === selected;
        return (
          <button
            key={ins.id}
            type="button"
            role="radio"
            aria-checked={isSel}
            aria-disabled={!ins.available}
            disabled={!ins.available}
            onClick={() => ins.available && onSelect(ins.id)}
            title={ins.available ? undefined : "Em breve"}
            className={cn(
              "relative flex flex-col items-start gap-2 rounded-md border p-4 text-left transition-colors focus-ring",
              isSel
                ? "border-accent bg-accent-soft"
                : ins.available
                  ? "border-line bg-surface hover:border-line-strong"
                  : "cursor-not-allowed border-dashed border-line bg-transparent opacity-55",
            )}
          >
            <span className="flex w-full items-center justify-between">
              <Icon className={cn("size-6", isSel ? "text-accent" : "text-muted")} aria-hidden />
              {isSel ? (
                <Check className="size-4 text-accent" aria-hidden />
              ) : !ins.available ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-muted">
                  <Lock className="size-3.5" aria-hidden />
                  Em breve
                </span>
              ) : null}
            </span>
            <span className="font-display text-lg font-bold leading-tight text-fg">{ins.name}</span>
            <span className="text-sm leading-snug text-muted">{ins.tagline}</span>
          </button>
        );
      })}
    </div>
  );
}
