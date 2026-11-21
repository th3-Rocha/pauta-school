// src/components/music/voice/VoiceRangeFinder.tsx
// Teste de extensão: grave → agudo → confortável → resultado. O app guarda as
// notas mais grave e mais aguda alcançadas (com clareza suficiente) e manda em
// `range`; o aluno ajusta a faixa confortável arrastando.
import * as React from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { MIN_CLARITY, VOICE_TYPES, classifyRange, tessitura, voiceNoteName, type Lang, type VoiceBody, type VoiceRange, type VoiceReading } from "../../../lib/voice";
import { Button } from "../../ui/Button";
import { Slider } from "../../ui/Slider";
import { Panel } from "../controls";

export type RangeStep = "low" | "high" | "comfort" | "result";

export type VoiceRangeFinderProps = {
  step: RangeStep;
  onStepChange: (step: RangeStep) => void;
  reading: VoiceReading;
  /** O que já foi medido. */
  range: Partial<VoiceRange>;
  /** Ajuste da faixa confortável (o app guarda). */
  onRangeChange: (range: Partial<VoiceRange>) => void;
  onRedo?: () => void;
  body?: VoiceBody;
  /** Notas mostradas na régua (padrão Mi 2 a Dó 6). */
  span?: [number, number];
  lang?: Lang;
  strings?: Partial<Strings["voiceRange"]>;
  className?: string;
};

const STEPS: RangeStep[] = ["low", "high", "comfort", "result"];

/** Régua de notas horizontal: semitons, Dós rotulados, marcas de extensão e o ponto ao vivo. */
function NoteRuler({ span, range, live, lang, labels }: { span: [number, number]; range: Partial<VoiceRange>; live: number | null; lang: Lang; labels: { low: string; high: string; you: string } }) {
  const [a, b] = span;
  const W = 600;
  const x = (m: number) => ((m - a) / (b - a)) * W;
  const ticks = Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const black = (m: number) => [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12);
  return (
    <svg viewBox={`-20 0 ${W + 40} 84`} className="w-full" aria-hidden>
      {range.comfortLow !== undefined && range.comfortHigh !== undefined && (
        <rect x={x(range.comfortLow)} y={30} width={x(range.comfortHigh) - x(range.comfortLow)} height={22} rx={4} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
      )}
      {range.low !== undefined && range.high !== undefined && (
        <rect x={x(range.low)} y={36} width={x(range.high) - x(range.low)} height={10} rx={2} fill="var(--line-strong)" opacity={0.5} />
      )}
      <line x1={0} x2={W} y1={41} y2={41} stroke="var(--line-strong)" strokeWidth={1} />
      {ticks.map((m) => (
        <g key={m}>
          <line x1={x(m)} x2={x(m)} y1={black(m) ? 36 : 33} y2={black(m) ? 46 : 49} stroke={m % 12 === 0 ? "var(--fg)" : "var(--line-strong)"} strokeWidth={m % 12 === 0 ? 1.6 : 1} />
          {m % 12 === 0 && (
            <text x={x(m)} y={66} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={13} fontWeight={600} fill="var(--muted)">
              {voiceNoteName(m, lang)}
            </text>
          )}
        </g>
      ))}
      {range.low !== undefined && (
        <g>
          <path d={`M${x(range.low)} 30 l-6 -9 h12 Z`} fill="var(--fg)" />
          <text x={x(range.low)} y={14} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill="var(--fg)">
            {labels.low}
          </text>
        </g>
      )}
      {range.high !== undefined && (
        <g>
          <path d={`M${x(range.high)} 30 l-6 -9 h12 Z`} fill="var(--fg)" />
          <text x={x(range.high)} y={14} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill="var(--fg)">
            {labels.high}
          </text>
        </g>
      )}
      {live !== null && live >= a && live <= b && (
        <g style={{ transform: `translateX(${x(live)}px)`, transition: "transform var(--dur-fast) var(--ease-out)" }}>
          <circle cx={0} cy={41} r={9} fill="var(--voice-you)" stroke="var(--marker-ring)" strokeWidth={2} />
          <text x={0} y={82} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill="var(--voice-you)">
            {labels.you}
          </text>
        </g>
      )}
    </svg>
  );
}

export function VoiceRangeFinder({
  step,
  onStepChange,
  reading,
  range,
  onRangeChange,
  onRedo,
  body,
  span = [40, 84],
  lang = "pt",
  strings: stringsOverride,
  className,
}: VoiceRangeFinderProps) {
  const s = { ...defaultStrings.voiceRange, ...stringsOverride };
  const live = reading && reading.clarity >= MIN_CLARITY ? reading.midi : null;
  const i = STEPS.indexOf(step);
  const full: VoiceRange | null =
    range.low !== undefined && range.high !== undefined
      ? {
          low: range.low,
          high: range.high,
          comfortLow: range.comfortLow ?? Math.round(range.low + (range.high - range.low) * 0.2),
          comfortHigh: range.comfortHigh ?? Math.round(range.high - (range.high - range.low) * 0.25),
        }
      : null;
  const canNext = step === "low" ? range.low !== undefined : step === "high" ? range.high !== undefined : step === "comfort" ? !!full : false;
  const nn = (m: number) => voiceNoteName(m, lang);

  return (
    <Panel label={s.label} className={cn("max-w-2xl", className)}>
      <div className="flex flex-col gap-4">
        {/* etapas */}
        <ol className="grid grid-cols-4 gap-1" aria-label={s.label}>
          {STEPS.map((st, k) => (
            <li
              key={st}
              aria-current={st === step ? "step" : undefined}
              className={cn(
                "rounded-xs border px-1 py-1.5 text-center text-xs font-semibold sm:text-sm",
                st === step ? "border-accent bg-accent-soft text-fg" : k < i ? "border-line text-fg" : "border-line text-muted",
              )}
            >
              {k + 1}. {s.steps[st]}
            </li>
          ))}
        </ol>

        {/* aviso sempre visível */}
        <p className="flex items-center gap-2 rounded-sm bg-warn-soft px-3 py-2 text-sm font-semibold text-warn">
          <AlertTriangle className="size-4 shrink-0" strokeWidth={2.5} aria-hidden />
          {s.stop}
        </p>

        <p className="text-base text-fg">{s.instructions[step]}</p>

        {(step === "low" || step === "high") && (
          <p className="text-center font-mono text-5xl font-bold leading-none text-fg sm:text-6xl" aria-live="polite">
            {live !== null ? nn(live) : "—"}
          </p>
        )}

        <NoteRuler span={span} range={step === "comfort" || step === "result" ? (full ?? range) : range} live={step === "result" ? null : live} lang={lang} labels={{ low: s.lowest, high: s.highest, you: s.current }} />

        {step === "comfort" && full && (
          <div className="flex flex-col gap-1 px-[3.125%]">
            <Slider
              min={span[0]}
              max={span[1]}
              step={1}
              value={[full.comfortLow, full.comfortHigh]}
              minStepsBetweenThumbs={2}
              onValueChange={([lo, hi]) => onRangeChange({ ...range, comfortLow: Math.max(full.low, lo), comfortHigh: Math.min(full.high, hi) })}
              thumbLabels={[s.comfortLowAria, s.comfortHighAria]}
            />
            <p className="text-center font-mono text-sm text-fg">
              {s.comfortable}: {nn(full.comfortLow)} – {nn(full.comfortHigh)}
            </p>
          </div>
        )}

        {step === "result" && full && (
          <div className="flex flex-col gap-3">
            <p className="font-display text-xl font-bold text-fg">
              {s.tessitura(nn(tessitura(full).low), nn(tessitura(full).high))} <span className="font-mono text-sm font-normal text-muted">({s.span(tessitura(full).span)})</span>
            </p>
            <div>
              <p className="panel-label mb-2 text-muted">{s.likely}</p>
              <ul className="flex flex-col gap-2">
                {classifyRange(full, body).map((g) => (
                  <li key={g.type} className="flex items-center gap-3 rounded-sm bg-surface-2 px-3 py-2">
                    <span className="min-w-24 font-semibold text-fg">{s.types[g.type]}</span>
                    <span className="flex gap-0.5" aria-hidden>
                      {[0, 1, 2].map((k) => (
                        <span key={k} className={cn("h-2.5 w-4 rounded-[2px]", k < (g.confidence === "high" ? 3 : g.confidence === "medium" ? 2 : 1) ? "bg-accent" : "bg-line")} />
                      ))}
                    </span>
                    <span className="text-sm text-fg">{s.confidence[g.confidence]}</span>
                    <span className="ml-auto hidden font-mono text-xs text-muted sm:inline">{s.typicalRange(nn(VOICE_TYPES[g.type].low), nn(VOICE_TYPES[g.type].high))}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="rounded-sm bg-accent-soft px-3 py-2 text-sm text-fg">{s.disclaimer}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {i > 0 && (
            <Button variant="secondary" onClick={() => onStepChange(STEPS[i - 1])}>
              <ArrowLeft aria-hidden />
              {s.back}
            </Button>
          )}
          {step !== "result" ? (
            <Button className="ml-auto" disabled={!canNext} onClick={() => onStepChange(STEPS[i + 1])}>
              {s.next}
              <ArrowRight aria-hidden />
            </Button>
          ) : (
            onRedo && (
              <Button variant="ghost" className="ml-auto" onClick={onRedo}>
                <RotateCcw aria-hidden />
                {s.redo}
              </Button>
            )
          )}
        </div>
      </div>
    </Panel>
  );
}
