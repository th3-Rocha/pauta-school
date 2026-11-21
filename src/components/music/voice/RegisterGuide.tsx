// src/components/music/voice/RegisterGuide.tsx
// Mapa dos registros sobre a extensão do aluno: peito, mix, cabeça (e falsete),
// com a zona de passagem. É ORIENTAÇÃO: o app não detecta o registro, e o texto
// diz isso. Com o microfone ligado, mostra só ONDE (que nota) o aluno está.
import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { MIN_CLARITY, passaggioFor, voiceNoteName, type Lang, type VoiceBody, type VoiceRange, type VoiceReading } from "../../../lib/voice";
import { Panel } from "../controls";

export type RegisterGuideProps = {
  range: VoiceRange;
  body: VoiceBody;
  /** Zona de passagem [início, fim] em MIDI. Padrão: `passaggioFor(body)`. */
  passaggio?: [number, number];
  reading?: VoiceReading;
  showFalsetto?: boolean;
  lang?: Lang;
  strings?: Partial<Strings["registers"]>;
  className?: string;
};

export function RegisterGuide({ range, body, passaggio, reading, showFalsetto = true, lang = "pt", strings: stringsOverride, className }: RegisterGuideProps) {
  const s = { ...defaultStrings.registers, ...stringsOverride };
  const [p0, p1] = passaggio ?? passaggioFor(body);
  const a = range.low - 1;
  const b = range.high + 1;
  const W = 600;
  const x = (m: number) => ((Math.max(a, Math.min(b, m)) - a) / (b - a)) * W;
  const live = reading && reading.clarity >= MIN_CLARITY ? reading.midi : null;
  const nn = (m: number) => voiceNoteName(m, lang);
  const uid = React.useId().replace(/:/g, "");

  const bands = [
    { id: "chest", from: range.low, to: p1, color: "var(--register-chest)", row: 0 },
    { id: "mix", from: p0, to: Math.min(range.high, p1 + 5), color: "var(--register-mix)", row: 1 },
    { id: "head", from: p0, to: range.high, color: "var(--register-head)", row: 2 },
  ] as const;

  const rowY = (r: number) => 34 + r * 34;
  const H = showFalsetto ? 34 + 4 * 34 + 30 : 34 + 3 * 34 + 30;

  return (
    <Panel label={s.label} className={cn("max-w-2xl", className)}>
      <div className="flex flex-col gap-3">
        <svg viewBox={`-74 0 ${W + 84} ${H}`} className="w-full" role="img" aria-label={`${s.label}: ${s.chest}, ${s.mix}, ${s.head}. ${s.passaggio} ${nn(p0)}–${nn(p1)}. ${s.honest}`}>
          <defs>
            <pattern id={`${uid}-p`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1={0} y1={0} x2={0} y2={6} stroke="var(--fg)" strokeWidth={1} strokeOpacity={0.35} />
            </pattern>
          </defs>
          {/* zona de passagem: hachura sobre todas as faixas */}
          <rect x={x(p0)} y={20} width={x(p1) - x(p0)} height={H - 46} fill={`url(#${uid}-p)`} stroke="var(--fg)" strokeOpacity={0.4} strokeDasharray="4 3" />
          <text x={(x(p0) + x(p1)) / 2} y={14} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill="var(--fg)">
            {s.passaggio}
          </text>

          {[...bands, ...(showFalsetto ? [{ id: "falsetto", from: Math.max(range.low, p0 - 2), to: range.high, color: "var(--register-head)", row: 3 } as const] : [])].map((band) => {
            const y = rowY(band.row);
            const label = s[band.id as "chest" | "mix" | "head" | "falsetto"];
            const isFal = band.id === "falsetto";
            return (
              <g key={band.id}>
                <text x={-8} y={y + 12} dy="0.35em" textAnchor="end" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill="var(--fg)">
                  {label}
                </text>
                <rect
                  x={x(band.from)}
                  y={y}
                  width={Math.max(4, x(band.to) - x(band.from))}
                  height={24}
                  rx={12}
                  fill={band.color}
                  fillOpacity={isFal ? 0.12 : 0.28}
                  stroke={band.color}
                  strokeWidth={2}
                  strokeDasharray={isFal ? "5 4" : undefined}
                />
              </g>
            );
          })}

          {/* régua de notas */}
          {Array.from({ length: b - a + 1 }, (_, i) => a + i).map((m) =>
            m % 12 === 0 ? (
              <g key={m}>
                <line x1={x(m)} x2={x(m)} y1={H - 26} y2={H - 18} stroke="var(--line-strong)" />
                <text x={x(m)} y={H - 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={12} fill="var(--muted)">
                  {nn(m)}
                </text>
              </g>
            ) : null,
          )}
          <line x1={0} x2={W} y1={H - 22} y2={H - 22} stroke="var(--line-strong)" />

          {live !== null && (
            <g style={{ transform: `translateX(${x(live)}px)`, transition: "transform var(--dur-fast) var(--ease-out)" }}>
              <line x1={0} x2={0} y1={20} y2={H - 22} stroke="var(--voice-you)" strokeWidth={2.5} />
              <circle cx={0} cy={H - 22} r={7} fill="var(--voice-you)" stroke="var(--marker-ring)" strokeWidth={1.5} />
            </g>
          )}
        </svg>

        {live !== null && (
          <p className="font-semibold text-fg" aria-live="polite">
            {s.youAt(nn(live))}
          </p>
        )}
        <ul className="grid gap-1 text-sm text-fg sm:grid-cols-2">
          {(["chest", "mix", "head", "falsetto"] as const).filter((id) => showFalsetto || id !== "falsetto").map((id) => (
            <li key={id}>
              <span className="font-semibold">{s[id]}:</span> {s.descriptions[id]}
            </li>
          ))}
          <li className="sm:col-span-2">
            <span className="font-semibold">{s.passaggio}:</span> {s.passaggioHint}
          </li>
        </ul>
        <p className="flex gap-2 rounded-sm bg-surface-2 px-3 py-2 text-sm text-fg">
          <Info className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
          {s.honest}
        </p>
      </div>
    </Panel>
  );
}
