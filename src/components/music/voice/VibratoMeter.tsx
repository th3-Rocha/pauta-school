// src/components/music/voice/VibratoMeter.tsx
// A altura do aluno numa nota longa, com a faixa saudável de vibrato
// (≈5–7 Hz, ±30–100 cents) e os números ao vivo.
import * as React from "react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { vibratoStats } from "../../../lib/voice";
import { Panel } from "../controls";

export type VibratoState = "silent" | "none" | "good" | "slow" | "fast" | "wide";

export type VibratoMeterProps = {
  /** Amostras recentes da altura (~2 s): t em segundos, midi com fração. */
  samples: { t: number; midi: number }[];
  /** Faixas saudáveis. */
  healthyRate?: [number, number];
  healthyDepth?: [number, number];
  strings?: Partial<Strings["voice"]>;
  className?: string;
};

export function vibratoState(stats: { rateHz: number; depthCents: number } | null, rate: [number, number] = [5, 7], depth: [number, number] = [30, 100]): VibratoState {
  if (!stats) return "silent";
  if (stats.depthCents < 15) return "none";
  if (stats.depthCents > depth[1] * 1.3) return "wide";
  if (stats.rateHz < rate[0] - 0.5) return "slow";
  if (stats.rateHz > rate[1] + 0.5) return "fast";
  return "good";
}

export function VibratoMeter({ samples, healthyRate = [5, 7], healthyDepth = [30, 100], strings: stringsOverride, className }: VibratoMeterProps) {
  const s = { ...defaultStrings.voice, ...stringsOverride };
  const v = s.vibrato;
  const stats = vibratoStats(samples);
  const state = vibratoState(stats, healthyRate, healthyDepth);
  const W = 600;
  const H = 160;
  const mean = samples.length ? samples.reduce((a, x) => a + x.midi, 0) / samples.length : 0;
  const t0 = samples[0]?.t ?? 0;
  const t1 = samples[samples.length - 1]?.t ?? 1;
  const cy = (c: number) => H / 2 - (c / 150) * (H / 2 - 8);
  const d = samples.map((p, i) => `${i ? "L" : "M"}${(((p.t - t0) / Math.max(0.001, t1 - t0)) * W).toFixed(1)} ${cy((p.midi - mean) * 100).toFixed(1)}`).join("");
  const inRange = (x: number, r: [number, number]) => x >= r[0] && x <= r[1];

  return (
    <Panel label={v.label} className={cn("max-w-xl", className)}>
      <div className="flex flex-col gap-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-sm bg-surface-2" role="img" aria-label={`${v.label}: ${v.states[state]}${stats ? `. ${v.rate} ${v.hz(stats.rateHz)}, ${v.depth} ${v.cents(stats.depthCents)}` : ""}`}>
          {/* faixa saudável de profundidade (acima e abaixo do centro) */}
          <rect x={0} y={cy(healthyDepth[1])} width={W} height={cy(healthyDepth[0]) - cy(healthyDepth[1])} fill="var(--accent-soft)" />
          <rect x={0} y={cy(-healthyDepth[0])} width={W} height={cy(-healthyDepth[1]) - cy(-healthyDepth[0])} fill="var(--accent-soft)" />
          <line x1={0} x2={W} y1={H / 2} y2={H / 2} stroke="var(--line-strong)" strokeDasharray="4 4" />
          <text x={6} y={cy(healthyDepth[1]) + 14} fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill="var(--fg)">
            {v.healthy}
          </text>
          <path d={d} fill="none" stroke="var(--voice-you)" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
        </svg>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: v.rate, value: stats ? v.hz(stats.rateHz) : "—", ok: stats ? inRange(stats.rateHz, healthyRate) : null, hint: `${healthyRate[0]}–${healthyRate[1]} Hz` },
            { label: v.depth, value: stats ? v.cents(stats.depthCents) : "—", ok: stats ? inRange(stats.depthCents, healthyDepth) : null, hint: `±${healthyDepth[0]}–${healthyDepth[1]}` },
          ].map((m) => (
            <div key={m.label} className="rounded-sm border border-line px-3 py-2">
              <p className="panel-label text-muted">{m.label}</p>
              <p className={cn("font-mono text-3xl font-bold leading-tight", m.ok ? "text-good" : "text-fg")}>{m.value}</p>
              <p className="font-mono text-xs text-muted">{m.hint}</p>
            </div>
          ))}
        </div>

        <p className={cn("rounded-sm px-3 py-2 text-base font-semibold", state === "good" ? "bg-good-soft text-good" : "bg-surface-2 text-fg")} aria-live="polite">
          {v.states[state]}
        </p>
      </div>
    </Panel>
  );
}
