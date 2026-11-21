// src/components/music/voice/MatchNote.tsx
// Uma nota só: o Chimera canta, o aluno repete. Estende o PitchMeter (mesmo
// alvo/você em mono, mesmo jeito de falar), mas em barra horizontal grande para
// ler de longe, com detecção de oitava e o anel que enche segurando a nota.
// Feedback é direção, não nota: nada de vermelho na voz da pessoa.
import * as React from "react";
import { ArrowDown, ArrowUp, Check, Ear, RotateCcw, Wind } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { MIN_CLARITY, SOLFEGE, pitchVsTarget, voiceNoteName, type GuideState, type Lang, type VoiceReading } from "../../../lib/voice";
import { Button } from "../../ui/Button";
import { Panel } from "../controls";

export type MatchState = "listen" | "silent" | "breathy" | "in-tune" | "up" | "down" | "octave-below" | "octave-above";

export type MatchNoteProps = {
  target: number;
  reading: VoiceReading;
  /** Enquanto o Chimera canta o exemplo, o medidor espera. */
  guide?: GuideState;
  /** Zona de acerto (± cents). Padrão 25. */
  tolerance?: number;
  /** Segundos segurando afinado (o app conta) e a meta. */
  held?: number;
  holdGoal?: number;
  onReplay?: () => void;
  lang?: Lang;
  strings?: Partial<Strings["pitchMatch"]>;
  className?: string;
};

/** Estado do exercício a partir da leitura (exportado para o app usar a mesma regra). */
export function matchState(target: number, reading: VoiceReading, tolerance = 25, guideSinging = false): { state: MatchState; cents: number } {
  if (guideSinging) return { state: "listen", cents: 0 };
  if (!reading || reading.level < 0.04) return { state: "silent", cents: 0 };
  if (reading.clarity < MIN_CLARITY) return { state: "breathy", cents: 0 };
  const { octave, cents } = pitchVsTarget(reading.midi, target);
  if (octave !== 0 && Math.abs(cents) <= 50) return { state: octave < 0 ? "octave-below" : "octave-above", cents };
  const total = (reading.midi - target) * 100;
  if (Math.abs(total) <= tolerance) return { state: "in-tune", cents: total };
  return { state: total < 0 ? "up" : "down", cents: total };
}

export function MatchNote({ target, reading, guide, tolerance = 25, held = 0, holdGoal = 2, onReplay, lang = "pt", strings: stringsOverride, className }: MatchNoteProps) {
  const s = { ...defaultStrings.pitchMatch, ...stringsOverride };
  const { state, cents } = matchState(target, reading, tolerance, guide?.status === "singing");
  const pc = ((target % 12) + 12) % 12;
  const name = voiceNoteName(target, lang);
  const hasPitch = state === "in-tune" || state === "up" || state === "down" || state.startsWith("octave");

  // barra: −100..+100 cents
  const W = 600;
  const cx = (c: number) => W / 2 + (Math.max(-100, Math.min(100, c)) / 100) * (W / 2 - 20);
  const tol = cx(tolerance) - cx(0);
  const pct = Math.min(1, held / holdGoal);

  const msg =
    state === "listen" ? s.listen
    : state === "silent" ? s.silent
    : state === "breathy" ? s.breathy
    : state === "in-tune" ? s.inTune
    : state === "octave-below" ? s.octaveBelow
    : state === "octave-above" ? s.octaveAbove
    : state === "up" ? (cents < -60 ? s.upMore : s.up)
    : cents > 60 ? s.downMore : s.down;
  const Icon = state === "in-tune" ? Check : state === "up" ? ArrowUp : state === "down" ? ArrowDown : state === "listen" ? Ear : state === "breathy" ? Wind : null;

  return (
    <Panel
      label={s.label}
      className={cn("max-w-2xl", className)}
      aside={
        onReplay && (
          <Button variant="ghost" size="sm" onClick={onReplay}>
            <RotateCcw aria-hidden />
            {s.replay}
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="panel-label text-muted">{s.target}</p>
            <p className="whitespace-nowrap font-mono text-4xl font-bold leading-none text-fg sm:text-6xl">{name}</p>
            <p className="mt-1 text-lg text-muted">“{SOLFEGE[pc]}”</p>
          </div>
          {/* anel que enche segurando afinado */}
          <div className="relative size-24 shrink-0 sm:size-28" role="progressbar" aria-label={s.held(held)} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)}>
            <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
              <circle cx={50} cy={50} r={42} fill="none" stroke="var(--surface-2)" strokeWidth={10} />
              <circle
                cx={50}
                cy={50}
                r={42}
                fill="none"
                stroke={pct >= 1 ? "var(--good)" : "var(--voice-you)"}
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={`${pct * 2 * Math.PI * 42} 999`}
                style={{ transition: "stroke-dasharray var(--dur-fast) linear" }}
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-xl font-bold text-fg">{held.toFixed(1)}s</span>
              <span className="text-xs text-muted">{s.hold}</span>
            </span>
          </div>
        </div>

        <svg viewBox={`0 0 ${W} 78`} className="w-full" role="img" aria-label={hasPitch ? s.aria(name, cents) : msg}>
          <rect x={10} y={22} width={W - 20} height={22} rx={11} fill="var(--surface-2)" />
          <rect x={cx(0) - tol} y={18} width={tol * 2} height={30} rx={6} fill="var(--accent-soft)" stroke="var(--good)" strokeWidth={1.5} />
          {[-100, -50, 0, 50, 100].map((c) => (
            <g key={c}>
              <line x1={cx(c)} x2={cx(c)} y1={c === 0 ? 12 : 48} y2={c === 0 ? 54 : 54} stroke={c === 0 ? "var(--fg)" : "var(--line-strong)"} strokeWidth={c === 0 ? 2 : 1} />
              {c !== 0 && (
                <text x={cx(c)} y={72} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={18} fill="var(--muted)">
                  {c > 0 ? `+${c}` : c}
                </text>
              )}
            </g>
          ))}
          {/* o alvo (Chimera): quadrado âmbar no centro */}
          <rect x={cx(0) - 6} y={0} width={12} height={12} fill="var(--voice-guide)" stroke="var(--marker-ring)" strokeWidth={1.5} />
          {/* você: bolinha teal */}
          {hasPitch && (
            <g style={{ transform: `translateX(${cx(cents) - cx(0)}px)`, transition: "transform var(--dur-fast) var(--ease-out)" }}>
              <circle cx={cx(0)} cy={33} r={13} fill="var(--voice-you)" stroke="var(--marker-ring)" strokeWidth={2} />
            </g>
          )}
        </svg>

        <p
          aria-live="polite"
          className={cn(
            "flex min-h-14 items-center justify-center gap-2 rounded-sm px-3 py-2 text-center text-xl font-bold [&_svg]:size-7 [&_svg]:shrink-0",
            state === "in-tune" ? "bg-good-soft text-good" : state.startsWith("octave") ? "bg-accent-soft text-base text-fg" : "text-fg",
          )}
        >
          {Icon && <Icon strokeWidth={3} aria-hidden />}
          {msg}
          {hasPitch && !state.startsWith("octave") && state !== "in-tune" && <span className="font-mono text-base font-semibold text-muted">{s.cents(cents)}</span>}
        </p>
      </div>
    </Panel>
  );
}
