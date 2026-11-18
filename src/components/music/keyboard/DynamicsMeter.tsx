// src/components/music/keyboard/DynamicsMeter.tsx
// Força de cada nota (velocity do MIDI, 1–127) contra a faixa alvo p, mf ou f.
import * as React from "react";
import { ArrowDown, ArrowUp, Check } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { Panel } from "../controls";

export type DynamicLevel = "p" | "mf" | "f";

export const DEFAULT_DYNAMIC_RANGES: Record<DynamicLevel, [number, number]> = {
  p: [20, 55],
  mf: [56, 90],
  f: [91, 127],
};

export type DynamicsMeterProps = {
  /** Notas recebidas, da mais antiga para a mais nova. */
  hits: { velocity: number }[];
  target: DynamicLevel;
  ranges?: Record<DynamicLevel, [number, number]>;
  /** Quantas barras aparecem (as mais recentes). */
  max?: number;
  strings?: Partial<Strings["dynamics"]>;
  className?: string;
};

export function DynamicsMeter({ hits, target, ranges = DEFAULT_DYNAMIC_RANGES, max = 12, strings: stringsOverride, className }: DynamicsMeterProps) {
  const s = { ...defaultStrings.dynamics, ...stringsOverride };
  const [lo, hi] = ranges[target];
  const shown = hits.slice(-max);
  const W = 300;
  const H = 120;
  const gutter = 26;
  const bw = (W - gutter) / max;
  const y = (v: number) => H - (v / 127) * H;
  const okCount = shown.filter((h) => h.velocity >= lo && h.velocity <= hi).length;
  const last = shown[shown.length - 1];
  const verdict = !last ? null : last.velocity < lo ? "up" : last.velocity > hi ? "down" : "ok";

  return (
    <Panel
      label={s.label}
      className={cn("max-w-xl", className)}
      aside={shown.length > 0 && <span className="font-mono text-sm font-semibold text-fg">{s.score(okCount, shown.length)}</span>}
    >
      <div className="flex flex-col gap-3">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="panel-label text-muted">{s.target}</span>
          <span className="font-display text-2xl font-bold italic text-fg">{target}</span>
          <span className="text-sm text-muted">{s.levels[target]} ({s.levelHint[target]})</span>
        </p>

        <svg viewBox={`0 0 ${W} ${H + 4}`} className="h-auto w-full" role="img" aria-label={`${s.target} ${s.levels[target]}. ${shown.map((h) => s.hit(h.velocity)).join(", ") || s.empty}`}>
          {(Object.keys(ranges) as DynamicLevel[]).map((lvl) => {
            const [a, b] = ranges[lvl];
            const isT = lvl === target;
            return (
              <g key={lvl}>
                {isT && <rect x={gutter} y={y(b)} width={W - gutter} height={y(a) - y(b)} fill="var(--accent-soft)" />}
                <line x1={gutter} x2={W} y1={y(b)} y2={y(b)} stroke={isT ? "var(--accent)" : "var(--line)"} strokeWidth={isT ? 1.5 : 1} strokeDasharray={isT ? "4 3" : undefined} />
                <text x={gutter - 6} y={(y(a) + y(b)) / 2} dy="0.35em" textAnchor="end" fontFamily="var(--font-display)" fontStyle="italic" fontWeight={700} fontSize={13} fill={isT ? "var(--fg)" : "var(--muted)"}>
                  {lvl}
                </text>
              </g>
            );
          })}
          <line x1={gutter} x2={W} y1={H} y2={H} stroke="var(--line-strong)" strokeWidth={1} />
          {shown.map((h, i) => {
            const inRange = h.velocity >= lo && h.velocity <= hi;
            const x = gutter + i * bw + bw * 0.2;
            const w = bw * 0.6;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y(h.velocity)}
                  width={w}
                  height={H - y(h.velocity)}
                  rx={2}
                  fill={inRange ? "var(--good)" : "var(--surface-2)"}
                  stroke={inRange ? "var(--marker-ring)" : "var(--line-strong)"}
                  strokeWidth={1}
                />
              </g>
            );
          })}
        </svg>

        {verdict ? (
          <p
            className={cn(
              "flex items-center gap-2 rounded-sm px-3 py-2 font-semibold [&_svg]:size-5",
              verdict === "ok" ? "bg-good-soft text-good" : "bg-warn-soft text-warn",
            )}
            aria-live="polite"
          >
            {verdict === "ok" ? <Check strokeWidth={3} aria-hidden /> : verdict === "up" ? <ArrowUp strokeWidth={3} aria-hidden /> : <ArrowDown strokeWidth={3} aria-hidden />}
            {verdict === "ok" ? s.inRange : verdict === "up" ? s.harder : s.softer}
            <span className="ml-auto font-mono text-sm">{s.hit(last!.velocity)}</span>
          </p>
        ) : (
          <p className="text-sm text-muted">{s.empty}</p>
        )}
      </div>
    </Panel>
  );
}
