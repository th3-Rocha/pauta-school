// src/components/music/NoteFixPuzzle.tsx
import * as React from "react";
import { Check, Lightbulb, Volume2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { Button } from "../ui/Button";
import { Callout } from "../ui/Callout";
import { Panel } from "./controls";

export type PuzzleNote = {
  id: string;
  /** 1 = Mi aguda … 6 = Mi grave */
  string: number;
  fret: number;
};

export type NoteFixPuzzleProps = {
  notes: PuzzleNote[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  /** delta: −1 volta uma casa, +1 avança uma casa. */
  onShift: (id: string, delta: -1 | 1) => void;
  /** Ids das fichas que o aluno já mexeu (ganham um ponto). */
  movedIds?: string[];
  hint?: string;
  showHint?: boolean;
  onShowHintChange?: (show: boolean) => void;
  onPlay?: () => void;
  solved?: boolean;
  maxFret?: number;
  stringCount?: number;
  strings?: Partial<Strings["noteFix"]>;
  className?: string;
};

const LINE_GAP = 40;
const COL = 52;

export function NoteFixPuzzle({
  notes,
  selectedId,
  onSelect,
  onShift,
  movedIds = [],
  hint,
  showHint = false,
  onShowHintChange,
  onPlay,
  solved = false,
  maxFret = 24,
  stringCount = 6,
  strings: stringsOverride,
  className,
}: NoteFixPuzzleProps) {
  const s = { ...defaultStrings.noteFix, ...stringsOverride };
  const selected = notes.find((n) => n.id === selectedId) ?? null;
  const refs = React.useRef(new Map<string, HTMLButtonElement>());
  const H = LINE_GAP * (stringCount - 1) + 44;
  const W = 44 + COL * notes.length + 12;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const go = (j: number) => {
      const n = notes[Math.max(0, Math.min(notes.length - 1, j))];
      refs.current.get(n.id)?.focus();
    };
    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
    if (!solved && selected && notes[i].id === selected.id) {
      if (e.key === "-" || e.key === "ArrowDown") { e.preventDefault(); if (selected.fret > 0) onShift(selected.id, -1); }
      if (e.key === "+" || e.key === "=" || e.key === "ArrowUp") { e.preventDefault(); if (selected.fret < maxFret) onShift(selected.id, 1); }
    }
  };

  return (
    <Panel
      label={s.label}
      data-slot="note-fix-puzzle"
      className={cn("flex flex-col gap-4", className)}
      aside={
        onPlay && (
          <Button variant="ghost" size="sm" onClick={onPlay}>
            <Volume2 aria-hidden />
            {s.play}
          </Button>
        )
      }
    >
      <p className="text-base text-fg">{s.instructions}</p>

      <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 pb-1">
        <div className="relative" style={{ width: W, height: H }} role="listbox" aria-label={s.label} aria-orientation="horizontal">
          {/* Linhas da tablatura */}
          <svg width={W} height={H} className="absolute inset-0" aria-hidden>
            {Array.from({ length: stringCount }, (_, i) => (
              <line key={i} x1={0} x2={W} y1={22 + i * LINE_GAP} y2={22 + i * LINE_GAP} stroke="var(--line-strong)" strokeWidth={1.5} />
            ))}
            {["T", "A", "B"].map((ch, k) => (
              <text key={ch} x={14} y={22 + LINE_GAP * (0.9 + k * 1.6)} dy="0.35em" textAnchor="middle" fontFamily="var(--font-mono)" fontWeight={700} fontSize={18} fill="var(--muted)" stroke="var(--surface)" strokeWidth={6} paintOrder="stroke">
                {ch}
              </text>
            ))}
            <line x1={W - 2} x2={W - 2} y1={22} y2={22 + (stringCount - 1) * LINE_GAP} stroke="var(--fg)" strokeWidth={2} />
          </svg>
          {notes.map((n, i) => {
            const isSel = n.id === selectedId;
            const moved = movedIds.includes(n.id);
            return (
              <button
                key={n.id}
                ref={(el) => {
                  if (el) refs.current.set(n.id, el);
                  else refs.current.delete(n.id);
                }}
                type="button"
                role="option"
                aria-selected={isSel}
                aria-label={s.token(i + 1, n.string, n.fret)}
                tabIndex={isSel || (!selectedId && i === 0) ? 0 : -1}
                disabled={solved}
                onClick={() => onSelect(n.id)}
                onKeyDown={(e) => onKey(e, i)}
                className="group absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus-ring rounded-xs"
                style={{ left: 44 + COL * i + COL / 2, top: 22 + (n.string - 1) * LINE_GAP }}
              >
                <span
                  className={cn(
                    "relative flex h-8 min-w-8 items-center justify-center rounded-xs border-2 px-1 font-mono text-base font-bold tabular-nums",
                    "transition-[transform,background-color] duration-[var(--dur-fast)]",
                    solved
                      ? "border-good bg-good-soft text-fg"
                      : isSel
                        ? "-translate-y-0.5 border-accent bg-accent text-on-accent shadow-md"
                        : "border-line-strong bg-surface text-fg group-hover:border-accent",
                  )}
                >
                  {n.fret}
                  {moved && !solved && (
                    <span aria-hidden className={cn("absolute -right-1 -top-1 size-2.5 rounded-full ring-2 ring-surface", isSel ? "bg-fg" : "bg-accent")} />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {solved ? (
        <p aria-live="polite" className="flex items-center gap-2 rounded-md border border-good bg-good-soft px-3 py-3 font-semibold text-good">
          <Check className="size-5" strokeWidth={3} aria-hidden />
          {s.solved}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 font-mono"
            disabled={!selected || selected.fret <= 0}
            onClick={() => selected && onShift(selected.id, -1)}
            aria-label={s.backAria}
          >
            {s.back}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 font-mono"
            disabled={!selected || selected.fret >= maxFret}
            onClick={() => selected && onShift(selected.id, 1)}
            aria-label={s.forwardAria}
          >
            {s.forward}
          </Button>
          {hint && (
            <Button variant="ghost" size="lg" aria-pressed={showHint} onClick={() => onShowHintChange?.(!showHint)}>
              <Lightbulb aria-hidden />
              {s.hint}
            </Button>
          )}
          {!selected && <p className="w-full text-sm text-muted">{s.selectFirst}</p>}
        </div>
      )}

      {hint && showHint && !solved && <Callout variant="tip">{hint}</Callout>}
    </Panel>
  );
}
