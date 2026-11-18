// src/components/music/keyboard/KeyFixPuzzle.tsx
// "Ache a nota errada": uma frase curta em fichas (nota + dedo + mão). O aluno
// escolhe a ficha e sobe/desce meio tom até soar certo. Equivale ao NoteFixPuzzle.
import * as React from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { noteName, noteSpoken, type Accidentals, type Finger, type Hand, type NoteNames } from "../../../lib/piano";
import { Button } from "../../ui/Button";
import { Panel, PlayButton } from "../controls";

export type KeyFixToken = { midi: number; finger?: Finger; hand?: Hand };

export type KeyFixPuzzleProps = {
  tokens: KeyFixToken[];
  selected: number | null;
  onSelect: (index: number) => void;
  /** -1 = meio tom abaixo, +1 = meio tom acima. */
  onShift: (index: number, delta: -1 | 1) => void;
  solved?: boolean;
  hint?: string;
  showHint?: boolean;
  onShowHint?: () => void;
  playing?: boolean;
  onPlay?: () => void;
  noteNames?: NoteNames;
  naming?: Accidentals;
  strings?: Partial<Strings["keyFix"]>;
  keyboardStrings?: Partial<Strings["keyboard"]>;
  className?: string;
};

export function KeyFixPuzzle({
  tokens,
  selected,
  onSelect,
  onShift,
  solved = false,
  hint,
  showHint = false,
  onShowHint,
  playing = false,
  onPlay,
  noteNames = "solfege",
  naming = "sharp",
  strings: stringsOverride,
  keyboardStrings,
  className,
}: KeyFixPuzzleProps) {
  const s = { ...defaultStrings.keyFix, ...stringsOverride };
  const ks = { ...defaultStrings.keyboard, ...keyboardStrings };
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const focus = (i: number) => {
    const j = Math.max(0, Math.min(tokens.length - 1, i));
    onSelect(j);
    refs.current[j]?.focus();
  };

  return (
    <Panel
      label={s.label}
      className={cn("max-w-2xl", className)}
      aside={onPlay && <PlayButton playing={playing} onClick={onPlay} playLabel={s.play} pauseLabel={s.play} size="md" />}
    >
      <div className="flex flex-col gap-4">
        <p className="text-base text-fg">{s.instructions}</p>

        <div role="toolbar" aria-label={s.label} className="flex flex-wrap gap-2">
          {tokens.map((t, i) => {
            const isSel = selected === i;
            return (
              <button
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                tabIndex={selected === null ? (i === 0 ? 0 : -1) : isSel ? 0 : -1}
                aria-pressed={isSel}
                aria-label={`${s.token(i + 1, noteSpoken(t.midi, naming), t.finger, t.hand ? ks.hand[t.hand] : undefined)}${isSel ? `, ${s.selected}` : ""}`}
                disabled={solved}
                onClick={() => onSelect(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") { e.preventDefault(); focus(i + 1); }
                  else if (e.key === "ArrowLeft") { e.preventDefault(); focus(i - 1); }
                  else if (e.key === "ArrowUp") { e.preventDefault(); onSelect(i); onShift(i, 1); }
                  else if (e.key === "ArrowDown") { e.preventDefault(); onSelect(i); onShift(i, -1); }
                }}
                className={cn(
                  "relative flex min-h-16 min-w-14 flex-col items-center justify-center gap-0.5 rounded-xs border px-2 py-1.5 focus-ring",
                  "transition-[transform,border-color,background-color] duration-[var(--dur-fast)] disabled:opacity-100",
                  isSel ? "-translate-y-0.5 border-accent bg-accent-soft shadow-md" : "border-line-strong bg-surface-2 hover:border-fg",
                  solved && "border-good bg-good-soft",
                )}
              >
                <span className="font-mono text-base font-bold text-fg">{noteName(t.midi, noteNames, naming)}</span>
                <span className="flex items-center gap-1 font-mono text-xs text-muted">
                  {t.hand && (
                    <span
                      aria-hidden
                      className="inline-flex size-4 items-center justify-center rounded-[2px] text-[10px] font-extrabold text-on-deg ring-1 ring-marker-ring"
                      style={{ background: t.hand === "right" ? "var(--hand-right)" : "var(--hand-left)" }}
                    >
                      {ks.handLetter[t.hand]}
                    </span>
                  )}
                  {t.finger && <span aria-hidden>{t.finger}</span>}
                </span>
              </button>
            );
          })}
        </div>

        {solved ? (
          <p className="flex items-center gap-2 rounded-sm bg-good-soft px-3 py-2.5 font-semibold text-good" role="status">
            <CheckCircle2 className="size-5 shrink-0" strokeWidth={2.5} aria-hidden />
            {s.solved}
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" disabled={selected === null} onClick={() => selected !== null && onShift(selected, -1)} aria-label={s.backAria}>
              <ChevronLeft aria-hidden />
              {s.back}
            </Button>
            <Button variant="secondary" disabled={selected === null} onClick={() => selected !== null && onShift(selected, 1)} aria-label={s.forwardAria}>
              {s.forward}
              <ChevronRight aria-hidden />
            </Button>
            {selected === null && <span className="text-sm text-muted">{s.selectFirst}</span>}
            {hint && (
              <Button variant="ghost" className="ml-auto" onClick={onShowHint} aria-expanded={showHint}>
                <Lightbulb aria-hidden />
                {s.hint}
              </Button>
            )}
          </div>
        )}
        {hint && showHint && !solved && <p className="rounded-sm bg-warn-soft px-3 py-2 text-sm text-fg">{hint}</p>}
      </div>
    </Panel>
  );
}
