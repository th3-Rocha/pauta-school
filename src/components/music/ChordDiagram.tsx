// src/components/music/ChordDiagram.tsx
import * as React from "react";
import { cn } from "../../lib/cn";
import { toRoman } from "../../lib/music";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { MarkerDefs, MarkerGlyph, type MarkerKind } from "./markers";

/** Ordem de troca no modo multiponto: 1 ● · 2 ✕ · 3 ■ · 4 ▲ */
export type ChordMoveOrder = 1 | 2 | 3 | 4;

export type ChordPosition = {
  /** número da casa, 0 = solta, "x" = abafada */
  fret: number | "x";
  /** dedo: 1 indicador … 4 mínimo; "P" polegar */
  finger?: 1 | 2 | 3 | 4 | "P";
  /** grau (para labelMode="degree" e a cor) */
  degree?: MarkerKind;
  /** texto do grau, ex.: "b3". Padrão: deduzido do tipo. */
  degreeLabel?: string;
  /** modo multiponto */
  order?: ChordMoveOrder;
};

export type ChordBarre = {
  fret: number;
  /** corda grave onde a pestana começa (6 = Mi grave) */
  fromString: number;
  /** corda aguda onde termina (1 = Mi aguda) */
  toString: number;
  finger?: 1 | 2 | 3 | 4;
};

export type ChordDiagramProps = {
  name: string;
  /** Seis posições, da corda 6 (grave, à esquerda) à corda 1. Aceita "x32010". */
  positions: ChordPosition[] | string;
  barre?: ChordBarre;
  /** O que aparece dentro da bolinha. */
  labelMode?: "finger" | "degree" | "none";
  /** Casa da primeira linha. Padrão: automático (1 se o acorde cabe nas 4 primeiras). */
  startFret?: number;
  /** Linhas de casas desenhadas (mín. 4). */
  rows?: number;
  /** Modo multiponto: mostra a posição anterior vazada e as formas de ordem. */
  previous?: { string: number; fret: number }[];
  /** Mostra a legenda do modo multiponto. Padrão: automático. */
  showLegend?: boolean;
  size?: "sm" | "md" | "lg";
  strings?: Partial<Strings["chordDiagram"]>;
  className?: string;
};

const DEGREE_TEXT: Partial<Record<MarkerKind, string>> = {
  root: "1",
  "deg-3": "3",
  "deg-5": "5",
  "deg-7": "7",
  ext: "9",
};

const SIZES = { sm: { gx: 20, gy: 24, r: 8 }, md: { gx: 28, gy: 34, r: 11 }, lg: { gx: 36, gy: 42, r: 14 } };

export function parsePositions(p: ChordPosition[] | string): ChordPosition[] {
  if (typeof p !== "string") return p;
  const tokens = p.includes(" ") || p.includes("-") ? p.split(/[\s-]+/) : p.split("");
  return tokens.map((t) => (t.toLowerCase() === "x" ? { fret: "x" as const } : { fret: Number(t) }));
}

export function OrderShape({ order, cx, cy, r }: { order: ChordMoveOrder; cx: number; cy: number; r: number }) {
  const fill = "var(--fg)";
  if (order === 1) return <circle cx={cx} cy={cy} r={r} fill={fill} />;
  if (order === 2)
    return (
      <g stroke={fill} strokeWidth={r * 0.5} strokeLinecap="round">
        <line x1={cx - r * 0.75} y1={cy - r * 0.75} x2={cx + r * 0.75} y2={cy + r * 0.75} />
        <line x1={cx + r * 0.75} y1={cy - r * 0.75} x2={cx - r * 0.75} y2={cy + r * 0.75} />
      </g>
    );
  if (order === 3) return <rect x={cx - r * 0.88} y={cy - r * 0.88} width={r * 1.76} height={r * 1.76} rx={2} fill={fill} />;
  return <path d={`M ${cx} ${cy - r} L ${cx + r * 1.05} ${cy + r * 0.8} L ${cx - r * 1.05} ${cy + r * 0.8} Z`} fill={fill} strokeLinejoin="round" />;
}

export function ChordDiagram({
  name,
  positions,
  barre,
  labelMode = "finger",
  startFret,
  rows = 4,
  previous,
  showLegend,
  size = "md",
  strings: stringsOverride,
  className,
}: ChordDiagramProps) {
  const s = { ...defaultStrings.chordDiagram, ...stringsOverride };
  const uid = React.useId().replace(/:/g, "");
  const pos = parsePositions(positions);
  const n = pos.length;
  const { gx, gy, r } = SIZES[size];

  const fretted = pos.map((p) => p.fret).filter((f): f is number => typeof f === "number" && f > 0);
  if (barre) fretted.push(barre.fret);
  const maxF = fretted.length ? Math.max(...fretted) : 1;
  const minF = fretted.length ? Math.min(...fretted) : 1;
  const start = startFret ?? (maxF <= Math.max(4, rows) ? 1 : minF);
  const nRows = Math.max(rows, maxF - start + 1);

  const left = r + (size === "sm" ? 16 : 24); // espaço do número romano
  const top = r * 2 + 8; // linha do X/O
  const W = left + gx * (n - 1) + r + 6;
  const H = top + gy * nRows + 6;
  const xOf = (i: number) => left + gx * i; // i: 0 = corda 6
  const yOf = (fret: number) => top + gy * (fret - start) + gy / 2;
  const isMulti = pos.some((p) => p.order) || !!previous?.length;

  const ariaParts = pos.map((p, i) => {
    const sNo = n - i;
    if (p.fret === "x") return `corda ${sNo} ${s.muted}`;
    if (p.fret === 0) return `corda ${sNo} ${s.open}`;
    return `${s.fretAt(sNo, p.fret)}${p.finger ? `, dedo ${p.finger}` : ""}`;
  });
  if (barre) ariaParts.unshift(s.barre(barre.fret));
  if (start > 1) ariaParts.unshift(s.startFret(toRoman(start)));

  const textSize = size === "sm" ? 10 : size === "lg" ? 14 : 12;

  return (
    <figure data-slot="chord-diagram" className={cn("inline-flex flex-col items-center gap-1.5", className)}>
      <figcaption className={cn("font-display font-bold text-fg", size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl")}>
        {name}
      </figcaption>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${s.chord(name)}: ${ariaParts.join("; ")}`}>
        <MarkerDefs hatchId={`${uid}-h`} />
        {/* Casas */}
        {Array.from({ length: nRows + 1 }, (_, i) => (
          <line
            key={i}
            x1={xOf(0)}
            x2={xOf(n - 1)}
            y1={top + gy * i}
            y2={top + gy * i}
            stroke={i === 0 && start === 1 ? "var(--fg)" : "var(--line-strong)"}
            strokeWidth={i === 0 && start === 1 ? 5 : 1.5}
            strokeLinecap="square"
          />
        ))}
        {/* Cordas: mais grossas no grave */}
        {pos.map((_, i) => (
          <line key={i} x1={xOf(i)} x2={xOf(i)} y1={top} y2={top + gy * nRows} stroke="var(--fg)" strokeOpacity={0.85} strokeWidth={1 + ((n - 1 - i) / (n - 1)) * 1.1} />
        ))}
        {/* Casa inicial */}
        {start > 1 && (
          <text x={left - r - 5} y={top + gy / 2} dy="0.35em" textAnchor="end" fontFamily="var(--font-mono)" fontSize={textSize} fontWeight={700} fill="var(--fg)">
            {toRoman(start)}
          </text>
        )}
        {/* X / O */}
        {pos.map((p, i) => {
          const cx = xOf(i);
          const cy = top - r - 4;
          if (p.fret === "x") {
            const k = r * 0.55;
            return (
              <g key={i} stroke="var(--fg)" strokeWidth={2} strokeLinecap="round">
                <line x1={cx - k} y1={cy - k} x2={cx + k} y2={cy + k} />
                <line x1={cx + k} y1={cy - k} x2={cx - k} y2={cy + k} />
              </g>
            );
          }
          if (p.fret === 0) return <circle key={i} cx={cx} cy={cy} r={r * 0.6} fill="none" stroke="var(--fg)" strokeWidth={2} />;
          return null;
        })}
        {/* Posição anterior (multiponto) */}
        {previous?.map((p, i) => {
          const col = n - p.string;
          if (p.fret < start || p.fret > start + nRows - 1) return null;
          return <circle key={`p${i}`} cx={xOf(col)} cy={yOf(p.fret)} r={r} fill="none" stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="3 2.5" />;
        })}
        {/* Pestana */}
        {barre && (
          <g>
            <rect
              x={xOf(n - barre.fromString) - r}
              y={yOf(barre.fret) - r}
              width={xOf(n - barre.toString) - xOf(n - barre.fromString) + r * 2}
              height={r * 2}
              rx={r}
              fill="var(--fg)"
            />
            {labelMode === "finger" && barre.finger && (
              <text x={xOf(n - barre.fromString)} y={yOf(barre.fret)} dy="0.35em" textAnchor="middle" fontFamily="var(--font-mono)" fontSize={textSize} fontWeight={700} fill="var(--bg)">
                {barre.finger}
              </text>
            )}
          </g>
        )}
        {/* Dedos */}
        {pos.map((p, i) => {
          if (typeof p.fret !== "number" || p.fret <= 0) return null;
          if (barre && p.fret === barre.fret && !p.degree && !p.order && n - i <= barre.fromString && n - i >= barre.toString) return null;
          const cx = xOf(i);
          const cy = yOf(p.fret);
          if (p.order) return <OrderShape key={i} order={p.order} cx={cx} cy={cy} r={r} />;
          if (labelMode === "degree" && p.degree) {
            return (
              <MarkerGlyph
                key={i}
                kind={p.degree}
                cx={cx}
                cy={cy}
                r={p.degree === "root" ? r - 2 : r}
                label={p.degreeLabel ?? DEGREE_TEXT[p.degree]}
                surface="page"
                hatchId={`${uid}-h`}
                animate={false}
              />
            );
          }
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="var(--fg)" />
              {labelMode === "finger" && p.finger !== undefined && (
                <text x={cx} y={cy} dy="0.35em" textAnchor="middle" fontFamily="var(--font-mono)" fontSize={textSize} fontWeight={700} fill="var(--bg)">
                  {p.finger}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {(showLegend ?? isMulti) && (
        <figure aria-label={s.legend} className="mt-1 text-sm text-muted">
          <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {([1, 2, 3, 4] as ChordMoveOrder[]).map((o) => (
              <li key={o} className="inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <OrderShape order={o} cx={7} cy={7.5} r={5.5} />
                </svg>
                <span>{s.order[o - 1]}</span>
              </li>
            ))}
            {previous?.length ? (
              <li className="inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <circle cx="7" cy="7" r="5.5" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="3 2.5" />
                </svg>
                <span>{s.from}</span>
              </li>
            ) : null}
          </ul>
        </figure>
      )}
    </figure>
  );
}
