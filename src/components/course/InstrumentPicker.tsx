// src/components/course/InstrumentPicker.tsx
import { AudioLines, Check, Drum, Guitar, Lock, MicVocal, Piano, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";
import type { Instrument, InstrumentId } from "../../data/instruments";
import { L } from "../../i18n";

const ICONS: Record<InstrumentId, LucideIcon> = {
  guitar: Guitar,
  "acoustic-guitar": Guitar,
  bass: Guitar,
  ukulele: Guitar,
  keyboard: Piano,
  harmonica: AudioLines,
  drums: Drum,
  voice: MicVocal,
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
    <div role="radiogroup" aria-label={L("Instrumento", "Instrument")} className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
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
            aria-label={ins.available ? (ins.preview ? `${ins.name}, ${L("prévia", "preview")}` : ins.name) : `${ins.name}, ${L("em breve", "coming soon")}`}
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
                <span className="flex items-center gap-1.5">
                  {ins.preview && <span className="text-xs font-semibold text-accent">{L("Prévia", "Preview")}</span>}
                  <Check className="size-4 text-accent" aria-hidden />
                </span>
              ) : ins.preview ? (
                <span className="text-xs font-semibold text-muted">{L("Prévia", "Preview")}</span>
              ) : !ins.available ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-muted">
                  <Lock className="size-3.5" aria-hidden />
                  {L("Em breve", "Coming soon")}
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
