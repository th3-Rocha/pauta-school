// src/components/music/keyboard/MiniKeys.tsx
// Trecho de teclado estático, para diagramas (KeyChord, HandPosition, ChordCheck).
// Mesma geometria e mesmas cores do Keyboard, sem interação.
import * as React from "react";
import { KEY, MIDDLE_C, layoutKeys, noteName, type Accidentals, type Hand, type KeyGeom, type NoteNames } from "../../../lib/piano";
import { MarkerDefs, MarkerGlyph, type MarkerKind } from "../markers";

export const MINI = { lid: 8, felt: 4, cheek: 5 } as const;

export type MiniKeyMarker = {
  midi: number;
  kind: MarkerKind;
  label?: string;
  hand?: Hand;
  /** Anel extra em volta do marcador (ex.: "dedo fica" na condução de vozes). */
  ring?: boolean;
};

/** Etiqueta D/E da mão presa ao marcador. Sempre letra + cor. */
export function HandTag({ hand, cx, cy, letter }: { hand: Hand; cx: number; cy: number; letter: string }) {
  return (
    <g aria-hidden>
      <rect
        x={cx - 6}
        y={cy - 4.75}
        width={12}
        height={9.5}
        rx={2}
        fill={hand === "right" ? "var(--hand-right)" : "var(--hand-left)"}
        stroke="var(--marker-ring)"
        strokeWidth={1}
      />
      <text x={cx} y={cy} dy="0.35em" textAnchor="middle" fontFamily="var(--font-mono)" fontWeight={800} fontSize={7} fill="var(--on-deg)">
        {letter}
      </text>
    </g>
  );
}

export type MiniKeysProps = {
  from: number;
  to: number;
  markers?: MiniKeyMarker[];
  /** Espaço acima da caixa, em unidades (para setas de condução de vozes). */
  headroom?: number;
  showNoteNames?: "none" | "c-only" | "all";
  noteNames?: NoteNames;
  naming?: Accidentals;
  handLetters?: Record<Hand, string>;
  /** Desenho extra por cima, com acesso à geometria. */
  overlay?: (geom: { byMidi: Map<number, KeyGeom>; y0: number; markerY: (k: KeyGeom) => number }) => React.ReactNode;
  /** Largura máxima em px de cada tecla branca (o desenho encolhe para caber). */
  maxKeyPx?: number;
  ariaLabel: string;
  className?: string;
};

export function MiniKeys({
  from,
  to,
  markers = [],
  headroom = 0,
  showNoteNames = "none",
  noteNames = "solfege",
  naming = "sharp",
  handLetters = { right: "D", left: "E" },
  overlay,
  maxKeyPx = 32,
  ariaLabel,
  className,
}: MiniKeysProps) {
  const uid = React.useId().replace(/:/g, "");
  const { keys, width, byMidi } = layoutKeys(from, to);
  const y0 = headroom + MINI.lid + MINI.felt;
  const totalW = width + MINI.cheek * 2;
  const totalH = y0 + KEY.h + 2;
  const markerBy = new Map(markers.map((m) => [m.midi, m]));
  const markerY = (k: KeyGeom) => (k.black ? y0 + k.height - 22 : y0 + 88);

  return (
    <svg
      viewBox={`${-MINI.cheek} 0 ${totalW} ${totalH}`}
      width="100%"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{ maxWidth: (totalW / KEY.w) * maxKeyPx, height: "auto", display: "block" }}
    >
      <MarkerDefs hatchId={`${uid}-h`} />
      <rect x={-MINI.cheek} y={headroom} width={totalW} height={totalH - headroom} rx={3} fill="var(--case)" />
      {keys.map((k) => {
        const m = markerBy.get(k.midi);
        const bottom = y0 + k.height;
        const showName = !m && (showNoteNames === "all" || (showNoteNames === "c-only" && k.midi % 12 === 0)) && !k.black;
        return (
          <g key={k.midi}>
            {k.black ? (
              <>
                <rect x={k.x} y={y0 - 3} width={k.width} height={k.height + 3} rx={1.6} fill="var(--key-black)" />
                <rect x={k.x + 1.2} y={bottom - 8} width={k.width - 2.4} height={6.5} rx={1} fill="var(--case-shine)" />
              </>
            ) : (
              <>
                <rect x={k.x + 0.5} y={y0 - 3} width={k.width - 1} height={k.height + 3} rx={2.5} fill="var(--key-white)" stroke="var(--key-edge)" strokeWidth={1} />
                {k.midi === MIDDLE_C && <rect x={k.cx - 6} y={bottom - 3.5} width={12} height={2} rx={1} fill="var(--key-ink)" />}
              </>
            )}
            {showName && (
              <text x={k.cx} y={bottom - 8} textAnchor="middle" fontFamily="var(--font-mono)" fontWeight={600} fontSize={8} fill="var(--key-ink)" aria-hidden>
                {noteName(k.midi, noteNames, naming, k.midi % 12 === 0)}
              </text>
            )}
          </g>
        );
      })}
      {keys.map((k) => {
        const m = markerBy.get(k.midi);
        if (!m) return null;
        return (
          <g key={`m${k.midi}`}>
            {m && (
              <>
                {m.ring && (
                  <circle cx={k.cx} cy={markerY(k)} r={(k.black ? 7.5 : 9.5) + 3.5} fill="none" stroke="var(--note-active)" strokeWidth={2.5} />
                )}
                <MarkerGlyph
                  kind={m.kind}
                  cx={k.cx}
                  cy={markerY(k)}
                  r={k.black ? 7.5 : 9.5}
                  label={m.label}
                  surface={k.black ? "key-black" : "key-white"}
                  hatchId={`${uid}-h`}
                  animate={false}
                />
                {m.hand && (
                  <HandTag hand={m.hand} letter={handLetters[m.hand]} cx={k.cx} cy={k.black ? markerY(k) - 7.5 - 7 : markerY(k) + 9.5 + 8} />
                )}
              </>
            )}
          </g>
        );
      })}
      <rect x={-MINI.cheek} y={headroom} width={totalW} height={MINI.lid} rx={3} fill="var(--case)" />
      <rect x={-MINI.cheek + 3} y={headroom + 2.5} width={totalW - 6} height={1} rx={0.5} fill="var(--case-shine)" />
      <rect x={-MINI.cheek} y={headroom + MINI.lid} width={totalW} height={MINI.felt} fill="var(--felt)" />
      {overlay?.({ byMidi, y0, markerY })}
    </svg>
  );
}
