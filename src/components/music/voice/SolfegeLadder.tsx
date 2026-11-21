// src/components/music/voice/SolfegeLadder.tsx
// Escada vertical de Dó a Dó, com as cores de grau de markers.tsx. O Chimera
// canta um degrau (quadrado âmbar), o aluno repete (bolinha teal); o degrau certo
// acende quando o aluno chega. A tônica se ajusta à tessitura do aluno.
import * as React from "react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { MIN_CLARITY, voiceNoteName, transposeToRange, type Lang, type VoiceRange, type VoiceReading } from "../../../lib/voice";
import { MARKER_FILL, type MarkerKind } from "../markers";

export type SolfegeLadderProps = {
  /** Tônica em MIDI. Sem ela, usa Dó e transpõe por oitava para a região do aluno. */
  tonic?: number;
  range?: VoiceRange;
  /** Degrau pedido (0 = Dó … 7 = Dó de cima). */
  target?: number | null;
  /** Degrau que o Chimera está cantando. */
  guideStep?: number | null;
  reading?: VoiceReading;
  /** Degraus já alcançados neste exercício. */
  reached?: number[];
  /** Tolerância em cents para acender o degrau. */
  tolerance?: number;
  onSelect?: (step: number) => void;
  lang?: Lang;
  strings?: Partial<Strings["voice"]>;
  className?: string;
};

const STEPS = [
  { syl: "Dó", semis: 0, kind: "root" },
  { syl: "Ré", semis: 2, kind: "in" },
  { syl: "Mi", semis: 4, kind: "deg-3" },
  { syl: "Fá", semis: 5, kind: "in" },
  { syl: "Sol", semis: 7, kind: "deg-5" },
  { syl: "Lá", semis: 9, kind: "in" },
  { syl: "Si", semis: 11, kind: "deg-7" },
  { syl: "Dó", semis: 12, kind: "root" },
] as const;

export function SolfegeLadder({
  tonic,
  range,
  target = null,
  guideStep = null,
  reading,
  reached = [],
  tolerance = 30,
  onSelect,
  lang = "pt",
  strings: stringsOverride,
  className,
}: SolfegeLadderProps) {
  const s = { ...defaultStrings.voice, ...stringsOverride };
  const base = tonic ?? (range ? transposeToRange([{ midi: 60 }, { midi: 72 }], range, "octave").notes[0].midi : 60);
  const live = reading && reading.clarity >= MIN_CLARITY ? reading.midi : null;
  // posição contínua em "degraus" (interpola entre os semitons de cada degrau)
  const pos = (() => {
    if (live === null) return null;
    const d = live - base;
    if (d <= 0) return d / 2;
    for (let i = 0; i < STEPS.length - 1; i++) {
      const a = STEPS[i].semis, b = STEPS[i + 1].semis;
      if (d <= b) return i + (d - a) / (b - a);
    }
    return 7 + (d - 12) / 2;
  })();
  const H = 8 * 52;

  return (
    <section data-slot="solfege-ladder" aria-label={s.solfege.label} className={cn("flex max-w-sm flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="panel-label text-muted">{s.solfege.label}</p>
        <p className="font-mono text-sm text-muted">{s.solfege.tonic(voiceNoteName(base, lang))}</p>
      </div>
      <div className="relative" style={{ height: H }}>
        <ol className="flex h-full flex-col-reverse">
          {STEPS.map((st, i) => {
            const midi = base + st.semis;
            const isTarget = target === i;
            const isGuide = guideStep === i;
            const near = live !== null && Math.abs((live - midi) * 100) <= tolerance;
            const done = reached.includes(i) || (isTarget && near);
            return (
              <li key={i} className="flex-1 py-0.5">
                <button
                  type="button"
                  onClick={() => onSelect?.(i)}
                  aria-label={`${s.solfege.step(st.syl, voiceNoteName(midi, lang))}${isGuide ? `, ${s.solfege.guideHere}` : ""}${done ? `, ${s.solfege.reached}` : ""}`}
                  aria-current={isTarget ? "step" : undefined}
                  className={cn(
                    "relative flex h-full w-full items-center gap-3 rounded-sm border px-3 text-left focus-ring",
                    "transition-[background-color,border-color] duration-[var(--dur-fast)]",
                    done ? "border-good bg-good-soft" : isTarget ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-line-strong",
                  )}
                  style={{ marginLeft: `${i * 3}%`, width: `${100 - i * 3}%` }}
                >
                  <span
                    aria-hidden
                    className="flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold text-on-deg ring-2 ring-marker-ring"
                    style={{ background: MARKER_FILL[st.kind as MarkerKind] }}
                  >
                    {i === 7 ? 8 : i + 1}
                  </span>
                  <span className="font-display text-xl font-bold text-fg">{st.syl}</span>
                  <span className="font-mono text-sm text-muted">{voiceNoteName(midi, lang)}</span>
                  {isGuide && <span aria-hidden className="ml-auto size-3.5 bg-[var(--voice-guide)] ring-1 ring-marker-ring" />}
                </button>
              </li>
            );
          })}
        </ol>
        {/* você: bolinha teal na altura cantada (contínua) */}
        {pos !== null && pos > -0.5 && pos < 7.5 && (
          <span
            aria-hidden
            className="pointer-events-none absolute -right-2 size-5 -translate-y-1/2 rounded-full bg-[var(--voice-you)] ring-2 ring-marker-ring"
            style={{ top: `${(1 - (pos + 0.5) / 8) * 100}%`, transition: "top var(--dur-fast) var(--ease-out)" }}
          />
        )}
      </div>
    </section>
  );
}
