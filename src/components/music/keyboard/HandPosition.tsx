// src/components/music/keyboard/HandPosition.tsx
// Card "onde a mão começa": trecho do teclado com os 5 dedos numerados, o nome
// da posição e o desenho da mão com o polegar = 1 destacado.
import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { noteName, noteSpoken, type Accidentals, type Hand, type NoteNames, defaultNoteNames } from "../../../lib/piano";
import { MiniKeys, type MiniKeyMarker } from "./MiniKeys";

export type HandPlacement = {
  hand: Hand;
  /** Notas dos dedos 1 a 5, nesta ordem (índice 0 = polegar). */
  notes: [number, number, number, number, number];
};

export type HandPositionProps = {
  /** "Posição de Dó" */
  name: string;
  positions: HandPlacement[];
  /** Linha extra abaixo do nome. Padrão: "polegar no Dó 4" da primeira mão. */
  description?: string;
  /** Desenho da mão com os números dos dedos. */
  showFingerChart?: boolean;
  /** Nota "no teclado o polegar é o 1" (e a diferença para a guitarra). */
  showThumbNote?: boolean;
  noteNames?: NoteNames;
  naming?: Accidentals;
  strings?: Partial<Strings["handPosition"]>;
  keyboardStrings?: Partial<Strings["keyboard"]>;
  className?: string;
};

/** Mão vista de cima, dedos numerados. Polegar = 1 em accent. A esquerda é espelhada. */
export function FingerChart({ hand, title, fingerNames, className }: { hand: Hand; title: string; fingerNames: string[]; className?: string }) {
  // dedos da mão direita vistos de cima: polegar à esquerda
  const fingers = [
    { n: 1, x: 22, y: 62, h: 34, rot: -42 },
    { n: 2, x: 40, y: 18, h: 60, rot: -6 },
    { n: 3, x: 60, y: 10, h: 66, rot: 0 },
    { n: 4, x: 80, y: 16, h: 60, rot: 5 },
    { n: 5, x: 99, y: 32, h: 46, rot: 11 },
  ];
  const label = `${title}: ${fingers.map((f) => `${f.n} ${fingerNames[f.n - 1]}`).join(", ")}`;
  return (
    <svg viewBox="0 0 130 116" role="img" aria-label={label} className={cn("h-28 w-auto", className)}>
      <g transform={hand === "left" ? "translate(130 0) scale(-1 1)" : undefined}>
        <rect x={32} y={70} width={84} height={44} rx={18} fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth={1.5} />
        {fingers.map((f) => {
          const thumb = f.n === 1;
          const cx = f.x + 8;
          return (
            <g key={f.n} transform={`rotate(${f.rot} ${cx} ${f.y + f.h})`}>
              <rect
                x={f.x}
                y={f.y}
                width={16}
                height={f.h}
                rx={8}
                fill={thumb ? "var(--accent)" : "var(--surface-2)"}
                stroke={thumb ? "var(--marker-ring)" : "var(--line-strong)"}
                strokeWidth={1.5}
              />
              <g transform={hand === "left" ? `translate(${cx * 2} 0) scale(-1 1)` : undefined}>
                <text
                  x={cx}
                  y={f.y + 11}
                  dy="0.35em"
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontWeight={800}
                  fontSize={11}
                  fill={thumb ? "var(--on-accent)" : "var(--fg)"}
                >
                  {f.n}
                </text>
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function HandPosition({
  name,
  positions,
  description,
  showFingerChart = true,
  showThumbNote = true,
  noteNames = defaultNoteNames(),
  naming = "sharp",
  strings: stringsOverride,
  keyboardStrings,
  className,
}: HandPositionProps) {
  const s = { ...defaultStrings.handPosition, ...stringsOverride };
  const ks = { ...defaultStrings.keyboard, ...keyboardStrings };
  const all = positions.flatMap((p) => p.notes);
  const lo = Math.min(...all) - 2;
  const hi = Math.max(...all) + 2;
  const markers: MiniKeyMarker[] = positions.flatMap((p) =>
    p.notes.map((midi, i) => ({ midi, kind: "in" as const, label: String(i + 1), hand: p.hand, ring: i === 0 })),
  );
  const first = positions[0];
  const desc = description ?? (first ? s.thumbOn(noteName(first.notes[0], noteNames, naming, true)) : "");
  const aria = [
    `${s.label}: ${name}`,
    ...positions.flatMap((p) => p.notes.map((m, i) => `${ks.hand[p.hand]}, ${s.fingerOn(i + 1, noteSpoken(m, naming))}`)),
  ].join(". ");

  return (
    <section data-slot="hand-position" aria-label={`${s.label}: ${name}`} className={cn("flex flex-col gap-4 rounded-md border border-line bg-surface p-4", className)}>
      <header className="flex flex-col gap-0.5">
        <p className="panel-label text-muted">{s.label}</p>
        <h3 className="font-display text-xl font-bold text-fg">{name}</h3>
        {desc && <p className="text-sm text-fg">{desc}</p>}
      </header>

      <MiniKeys from={lo} to={hi} markers={markers} showNoteNames="c-only" noteNames={noteNames} naming={naming} handLetters={ks.handLetter} maxKeyPx={34} ariaLabel={aria} />

      {showFingerChart && (
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          {positions.map((p) => (
            <figure key={p.hand} className="flex flex-col items-center gap-1">
              <FingerChart hand={p.hand} title={s.handTitle[p.hand]} fingerNames={s.fingers} />
              <figcaption className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg">
                <span
                  className="inline-flex size-5 items-center justify-center rounded-xs font-mono text-[11px] font-extrabold text-on-deg ring-1 ring-marker-ring"
                  style={{ background: p.hand === "right" ? "var(--hand-right)" : "var(--hand-left)" }}
                  aria-hidden
                >
                  {ks.handLetter[p.hand]}
                </span>
                {s.handTitle[p.hand]}
              </figcaption>
            </figure>
          ))}
          {showThumbNote && (
            <div className="flex min-w-48 flex-1 gap-2 rounded-sm bg-accent-soft p-3 text-sm text-fg">
              <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              <p>
                <strong className="font-semibold">{s.thumbIsOne}</strong> <span className="text-fg">{s.guitarNote}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
