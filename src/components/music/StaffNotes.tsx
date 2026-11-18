// src/components/music/StaffNotes.tsx
// Pauta simples para as primeiras semanas de leitura: clave de Sol ou de Fá,
// notas naturais, semibreve a colcheia, ponto de aumento, pausas e barras de compasso.
// Desenho próprio em SVG (não depende do alphaTab).
import * as React from "react";
import { cn } from "../../lib/cn";
import { noteName } from "../../lib/piano";

export type StaffNote = { midi: number; d: number } | { rest: true; d: number };

export type StaffNotesProps = {
  notes: StaffNote[];
  clef?: "treble" | "bass";
  beatsPerBar?: number;
  /** Índice da nota em destaque (tocando agora / próxima). */
  active?: number;
  /** Índices com erro (pintados de vermelho). */
  wrong?: number[];
  /** Índices já tocados (ficam esmaecidos). */
  done?: number[];
  /** Escreve o nome embaixo de cada nota. */
  showNames?: boolean;
  label?: string;
  className?: string;
};

const GAP = 10; // distância entre linhas
const TOP = 34; // linha de cima
const BOTTOM = TOP + GAP * 4;
const LETTER_STEP = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6]; // classe de altura → letra (C=0 … B=6)

/** Posição diatônica: oitava * 7 + letra. */
const diatonic = (midi: number) => (Math.floor(midi / 12) - 1) * 7 + LETTER_STEP[((midi % 12) + 12) % 12];

/** Degraus acima da linha de baixo (Mi 4 na clave de Sol, Sol 2 na de Fá). */
function stepOf(midi: number, clef: "treble" | "bass") {
  return diatonic(midi) - (clef === "treble" ? 4 * 7 + 2 : 2 * 7 + 4);
}

const yOf = (step: number) => BOTTOM - (step * GAP) / 2;

function Head({ x, y, open, color }: { x: number; y: number; open: boolean; color: string }) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={5.6}
      ry={4.2}
      transform={`rotate(-20 ${x} ${y})`}
      fill={open ? "var(--surface)" : color}
      stroke={color}
      strokeWidth={open ? 1.8 : 1}
    />
  );
}

function Rest({ x, d, color }: { x: number; d: number; color: string }) {
  if (d >= 4) return <rect x={x - 6} y={TOP + GAP} width={12} height={5} fill={color} />;
  if (d >= 2) return <rect x={x - 6} y={TOP + GAP * 2 - 5} width={12} height={5} fill={color} />;
  return <path d={`M${x - 2} ${TOP + 8} l5 6 l-5 5 l5 6 l-6 -2 l2 4`} stroke={color} strokeWidth={2} fill="none" />;
}

export function StaffNotes({
  notes,
  clef = "treble",
  beatsPerBar = 4,
  active = -1,
  wrong = [],
  done = [],
  showNames = false,
  label,
  className,
}: StaffNotesProps) {
  // Largura proporcional, com mínimo por nota para não amontoar.
  const LEFT = 74;
  const unit = 26;
  let x = LEFT;
  let beat = 0;
  const placed: { n: StaffNote; x: number; i: number }[] = [];
  const bars: number[] = [];
  notes.forEach((n, i) => {
    placed.push({ n, x: x + 10, i });
    x += Math.max(unit, n.d * unit * 0.9);
    beat += n.d;
    if (Math.abs(beat % beatsPerBar) < 1e-6 && i < notes.length - 1) {
      bars.push(x + 2);
      x += 8;
    }
  });
  const width = x + 16;
  const height = BOTTOM + (showNames ? 44 : 30);

  const ink = "var(--fg)";
  const names = notes.filter((n): n is { midi: number; d: number } => "midi" in n).map((n) => noteName(n.midi)).join(", ");

  return (
    <div className={cn("overflow-x-auto rounded-md border border-line bg-surface", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width * 1.6}
        style={{ maxWidth: "none", height: "auto" }}
        role="img"
        aria-label={label ?? names}
        className="block"
      >
        {/* Linhas */}
        {[0, 1, 2, 3, 4].map((k) => (
          <line key={k} x1={8} x2={width - 8} y1={TOP + k * GAP} y2={TOP + k * GAP} stroke="var(--line-strong)" strokeWidth={1} />
        ))}
        {/* Clave */}
        <text
          x={8}
          y={clef === "treble" ? BOTTOM + 8 : TOP + 28}
          fontSize={clef === "treble" ? 58 : 38}
          fill={ink}
          fontFamily="'Noto Music', 'Bravura', 'Segoe UI Symbol', 'DejaVu Sans', serif"
          aria-hidden
        >
          {clef === "treble" ? "\u{1D11E}" : "\u{1D122}"}
        </text>
        {/* Fórmula de compasso */}
        <g fontFamily="var(--font-display)" fontWeight={800} fontSize={17} fill={ink} textAnchor="middle" aria-hidden>
          <text x={56} y={TOP + GAP * 2 - 2}>
            {beatsPerBar}
          </text>
          <text x={56} y={BOTTOM - 1}>
            4
          </text>
        </g>
        {/* Barras de compasso */}
        {bars.map((bx, k) => (
          <line key={k} x1={bx} x2={bx} y1={TOP} y2={BOTTOM} stroke={ink} strokeWidth={1.2} />
        ))}
        <line x1={width - 10} x2={width - 10} y1={TOP} y2={BOTTOM} stroke={ink} strokeWidth={1.2} />
        <line x1={width - 6} x2={width - 6} y1={TOP} y2={BOTTOM} stroke={ink} strokeWidth={3} />

        {placed.map(({ n, x: nx, i }) => {
          const color = wrong.includes(i) ? "var(--bad)" : i === active ? "var(--accent)" : done.includes(i) ? "var(--muted)" : ink;
          if (!("midi" in n)) return <Rest key={i} x={nx} d={n.d} color={color} />;
          const step = stepOf(n.midi, clef);
          const y = yOf(step);
          const dotted = n.d === 3 || n.d === 1.5 || n.d === 0.75;
          const base = dotted ? n.d / 1.5 : n.d;
          const open = base >= 2;
          const stemUp = step < 4;
          const ledgers: number[] = [];
          for (let s = -2; s >= step; s -= 2) ledgers.push(s);
          for (let s = 10; s <= step; s += 2) ledgers.push(s);
          return (
            <g key={i}>
              {i === active && <rect x={nx - 11} y={TOP - 22} width={22} height={BOTTOM - TOP + 44} rx={4} fill="var(--accent-soft)" />}
              {ledgers.map((s) => (
                <line key={s} x1={nx - 9} x2={nx + 9} y1={yOf(s)} y2={yOf(s)} stroke={ink} strokeWidth={1.2} />
              ))}
              <Head x={nx} y={y} open={open} color={color} />
              {base < 4 &&
                (stemUp ? (
                  <line x1={nx + 5} x2={nx + 5} y1={y - 1} y2={y - 30} stroke={color} strokeWidth={1.5} />
                ) : (
                  <line x1={nx - 5} x2={nx - 5} y1={y + 1} y2={y + 30} stroke={color} strokeWidth={1.5} />
                ))}
              {base === 0.5 &&
                (stemUp ? (
                  <path d={`M${nx + 5} ${y - 30} q8 6 5 14`} stroke={color} strokeWidth={1.5} fill="none" />
                ) : (
                  <path d={`M${nx - 5} ${y + 30} q8 -6 5 -14`} stroke={color} strokeWidth={1.5} fill="none" />
                ))}
              {dotted && <circle cx={nx + 10} cy={step % 2 === 0 ? y - GAP / 2 : y} r={1.8} fill={color} />}
              {showNames && (
                <text x={nx} y={BOTTOM + 36} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10} fontWeight={700} fill={color}>
                  {noteName(n.midi)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
