// src/components/music/voice/BreathCoach.tsx
// Ciclos de respiração (inspira / segura / solta). O círculo cresce, para e
// esvazia; a contagem é grande para ler de pé, longe do celular. No "solta", o
// volume do "sss" (microfone) mostra se o ar sai constante. Com o Chimera no
// monitor, o ar dele (pressão nos pulmões) aparece junto, tracejado.
import * as React from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { steadiness } from "../../../lib/voice";
import { Button } from "../../ui/Button";
import { Panel } from "../controls";

export type BreathPhase = "idle" | "in" | "hold" | "out" | "rest";

export type BreathCoachProps = {
  /** Segundos de [inspira, segura, solta], ex.: [4, 4, 8] ou [4, 7, 8]. */
  pattern: [number, number, number];
  phase: BreathPhase;
  /** Segundos desde o começo da fase. */
  elapsed: number;
  cycle?: number;
  cycles?: number;
  /** Volume do "sss" (0..1) durante o "solta", da amostra mais antiga para a mais nova. */
  levels?: number[];
  /** Pressão nos pulmões do Chimera (0..1), da telemetria. */
  guideAir?: number[];
  running?: boolean;
  onStart?: () => void;
  onStop?: () => void;
  strings?: Partial<Strings["breath"]>;
  className?: string;
};

const PHASE_VAR: Record<BreathPhase, string> = {
  idle: "var(--line-strong)",
  in: "var(--breath-in)",
  hold: "var(--breath-hold)",
  out: "var(--breath-out)",
  rest: "var(--line-strong)",
};

function Spark({ data, color, dashed, h = 48 }: { data: number[]; color: string; dashed?: boolean; h?: number }) {
  if (data.length < 2) return null;
  const W = 300;
  const d = data.map((v, i) => `${i ? "L" : "M"}${((i / (data.length - 1)) * W).toFixed(1)} ${(h - 4 - Math.max(0, Math.min(1, v)) * (h - 8)).toFixed(1)}`).join("");
  return <path d={d} fill="none" stroke={color} strokeWidth={dashed ? 2 : 2.5} strokeDasharray={dashed ? "6 4" : undefined} strokeLinejoin="round" strokeLinecap="round" />;
}

export function BreathCoach({
  pattern,
  phase,
  elapsed,
  cycle = 1,
  cycles = 4,
  levels = [],
  guideAir,
  running = false,
  onStart,
  onStop,
  strings: stringsOverride,
  className,
}: BreathCoachProps) {
  const s = { ...defaultStrings.breath, ...stringsOverride };
  const dur = phase === "in" ? pattern[0] : phase === "hold" ? pattern[1] : phase === "out" ? pattern[2] : 0;
  const p = dur ? Math.min(1, elapsed / dur) : 0;
  const scale = phase === "in" ? 0.45 + 0.55 * p : phase === "hold" ? 1 : phase === "out" ? 1 - 0.55 * p : 0.45;
  const remaining = dur ? Math.max(1, Math.ceil(dur - elapsed)) : null;
  const steady = levels.length > 8 ? steadiness(levels) : null;
  const color = PHASE_VAR[phase];

  return (
    <Panel
      label={s.label}
      className={cn("max-w-xl", className)}
      aside={
        <span className="font-mono text-sm text-muted">
          {s.patternLabel} <span className="font-semibold text-fg">{s.pattern(pattern)}</span>
        </span>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-5">
          {/* o círculo: cresce no inspira, para no segura, esvazia no solta */}
          <div className="relative flex size-36 shrink-0 items-center justify-center sm:size-44" aria-hidden>
            <span className="absolute inset-0 rounded-full border-2 border-dashed border-line-strong" />
            <span
              className="absolute inset-0 rounded-full"
              style={{
                transform: `scale(${scale})`,
                background: `color-mix(in srgb, ${color} 22%, transparent)`,
                border: `3px solid ${color}`,
                transition: "transform 250ms linear",
              }}
            />
            {/* forma por fase, além da cor: setas para dentro / barras / setas para fora */}
            <svg viewBox="0 0 40 40" className="relative size-10 text-fg">
              {phase === "in" && <path d="M6 20 h10 m-4 -4 l4 4 l-4 4 M34 20 h-10 m4 -4 l-4 4 l4 4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}
              {phase === "hold" && <path d="M15 12 v16 M25 12 v16" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />}
              {phase === "out" && <path d="M16 20 h-10 m4 -4 l-4 4 l4 4 M24 20 h10 m-4 -4 l4 4 l-4 4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}
            </svg>
          </div>
          <div className="min-w-0" aria-live="polite">
            <p className="font-display text-4xl font-extrabold leading-none text-fg sm:text-5xl">{s.phases[phase]}</p>
            {remaining !== null && <p className="font-mono text-6xl font-bold leading-tight text-fg sm:text-7xl">{remaining}</p>}
            <p className="text-base text-muted">{s.phaseHint[phase]}</p>
          </div>
        </div>

        {/* fases do padrão, com nome (nunca só cor) */}
        <ol className="grid grid-cols-3 gap-1" aria-label={s.patternLabel}>
          {(["in", "hold", "out"] as const).map((ph, i) => (
            <li
              key={ph}
              className={cn("flex items-center gap-2 rounded-xs border px-2 py-1.5 text-sm", ph === phase ? "border-fg font-semibold text-fg" : "border-line text-muted")}
            >
              <span aria-hidden className="h-3 w-1.5 rounded-full" style={{ background: PHASE_VAR[ph] }} />
              {s.phases[ph]} <span className="ml-auto font-mono">{pattern[i]}s</span>
            </li>
          ))}
        </ol>

        {(levels.length > 1 || (guideAir && guideAir.length > 1)) && (
          <figure className="flex flex-col gap-1.5">
            <svg viewBox="0 0 300 48" className="h-12 w-full rounded-sm bg-surface-2" aria-hidden>
              {guideAir && <Spark data={guideAir} color="var(--voice-guide)" dashed />}
              <Spark data={levels} color="var(--voice-you)" />
            </svg>
            <figcaption className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-5 bg-[var(--voice-you)]" aria-hidden /> {s.yourAir}
              </span>
              {guideAir && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0 w-5 border-t-2 border-dashed border-[var(--voice-guide)]" aria-hidden /> {s.guideAir}
                </span>
              )}
            </figcaption>
            {steady !== null && phase === "out" && (
              <p className={cn("text-sm font-semibold", steady > 0.6 ? "text-good" : "text-fg")} aria-live="polite">
                {steady > 0.6 ? s.steady : s.uneven}
              </p>
            )}
          </figure>
        )}

        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-muted">{s.cycle(cycle, cycles)}</span>
          {running ? (
            <Button variant="secondary" className="ml-auto" onClick={onStop}>
              <Pause aria-hidden />
              {s.stop}
            </Button>
          ) : (
            <Button className="ml-auto" onClick={onStart}>
              <Play aria-hidden />
              {s.start}
            </Button>
          )}
        </div>
      </div>
    </Panel>
  );
}
