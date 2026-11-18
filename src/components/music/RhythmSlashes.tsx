// src/components/music/RhythmSlashes.tsx
import { cn } from "../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../lib/strings";

export type Stroke = "down" | "up" | "rest" | "hit" | null;

export type RhythmMeasure = {
  /** Cifra sobre o compasso. Repetir a mesma cifra é permitido. */
  chord?: string;
  /** Tempos do compasso. Padrão: `beatsPerMeasure`. */
  beats?: number;
  /**
   * Batidas por subdivisão (2 por tempo = colcheias). Ex. em 4/4:
   * ["down", null, "down", "up", null, "up", "down", "up"].
   */
  strokes?: Stroke[];
};

export type RhythmSlashesProps = {
  measures: RhythmMeasure[];
  beatsPerMeasure?: number;
  /** Compasso que está tocando (base 0). */
  currentMeasure?: number;
  /** Tempo que está tocando dentro do compasso (base 0). */
  currentBeat?: number;
  /** Compassos por linha a partir de 640px (no celular são 2). */
  perRow?: 2 | 4;
  "aria-label"?: string;
  strings?: Partial<Strings["rhythm"]>;
  className?: string;
};

const ARROW: Record<Exclude<Stroke, null>, string> = { down: "↓", up: "↑", rest: "·", hit: "✕" };

export function RhythmSlashes({
  measures,
  beatsPerMeasure = 4,
  currentMeasure,
  currentBeat,
  perRow = 4,
  "aria-label": ariaLabel,
  strings: stringsOverride,
  className,
}: RhythmSlashesProps) {
  const s = { ...defaultStrings.rhythm, ...stringsOverride };
  const strokeName = (st: Exclude<Stroke, null>) => ({ down: s.down, up: s.up, rest: s.rest, hit: s.hit })[st];
  return (
    <ol
      data-slot="rhythm-slashes"
      aria-label={ariaLabel ?? s.label}
      className={cn("grid grid-cols-2 border-l-2 border-fg", perRow === 4 ? "sm:grid-cols-4" : "sm:grid-cols-2", className)}
    >
      {measures.map((m, mi) => {
        const beats = m.beats ?? beatsPerMeasure;
        const isCurrent = currentMeasure === mi;
        const sub = m.strokes ? Math.max(1, Math.round(m.strokes.length / beats)) : 1;
        const repeatChord = mi > 0 && measures[mi - 1].chord === m.chord;
        return (
          <li
            key={mi}
            aria-current={isCurrent ? "step" : undefined}
            aria-label={`${s.measure(mi + 1)}${m.chord ? `, ${m.chord}` : ""}`}
            className={cn(
              "relative border-r-2 border-fg px-2 pb-2 pt-1 transition-colors duration-[var(--dur-fast)]",
              isCurrent && "bg-accent-soft",
            )}
          >
            <div className="flex h-7 items-baseline justify-between gap-2">
              <span className={cn("font-mono text-lg font-bold", repeatChord ? "text-muted" : "text-fg")}>
                {m.chord ?? ""}
              </span>
              <span className="font-mono text-xs text-muted">{mi + 1}</span>
            </div>
            <div className="flex h-12 items-center justify-around border-y border-line" aria-hidden>
              {Array.from({ length: beats }, (_, b) => {
                const active = isCurrent && currentBeat === b;
                return (
                  <span key={b} className="relative flex h-full w-full items-center justify-center">
                    <svg width="18" height="30" viewBox="0 0 18 30" className={cn(active && "animate-beat")}>
                      <line x1="3" y1="27" x2="15" y2="3" stroke={active ? "var(--accent)" : "var(--fg)"} strokeWidth={active ? 5 : 4} strokeLinecap="round" />
                    </svg>
                    {active && <span className="absolute inset-x-1 -bottom-px h-[3px] rounded-t-[2px] bg-accent" />}
                  </span>
                );
              })}
            </div>
            {m.strokes && (
              <div className="mt-1 grid font-mono text-sm" style={{ gridTemplateColumns: `repeat(${beats * sub}, minmax(0, 1fr))` }}>
                {m.strokes.map((st, i) => (
                  <span
                    key={i}
                    className={cn(
                      "text-center",
                      st === null || st === "rest" ? "text-muted" : "font-bold text-fg",
                      isCurrent && currentBeat === Math.floor(i / sub) && st && st !== "rest" && "text-accent",
                    )}
                  >
                    {st ? (
                      <>
                        <span aria-hidden>{ARROW[st]}</span>
                        <span className="sr-only">{strokeName(st)}</span>
                      </>
                    ) : (
                      <span aria-hidden className="opacity-50">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
