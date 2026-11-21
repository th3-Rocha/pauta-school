// src/components/music/voice/VowelMapPT.tsx
// O trapézio das vogais (como os foneticistas desenham: anterior à esquerda,
// fechada em cima, aberta embaixo) com as 7 vogais orais do português e as
// nasais. As posições saem dos formantes do corpo escolhido. O ponto do aluno
// vem dos formantes do microfone, com rastro curto. Tocar numa vogal: o Chimera
// canta e a cabeça mostra a boca e a língua (`onSelect`).
import * as React from "react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { VOWELS_PT, nearestVowel, vowelFormants, type Lang, type Vowel, type VowelId, type VoiceBody } from "../../../lib/voice";

export type VowelMapPTProps = {
  body: VoiceBody;
  /** Formantes do aluno, do mais antigo ao mais novo (o último é o ponto atual). */
  trail?: { f1: number; f2: number }[];
  selected?: VowelId | null;
  onSelect?: (id: VowelId) => void;
  showNasal?: boolean;
  onShowNasalChange?: (show: boolean) => void;
  showMouths?: boolean;
  lang?: Lang;
  strings?: Partial<Strings["vowels"]>;
  className?: string;
};

/** Boca de frente, em linha: aberta, esticada ou arredondada. */
export function MouthShape({ mouth, className }: { mouth: Vowel["mouth"]; className?: string }) {
  const shape = {
    open: { rx: 13, ry: 14 },
    spread: { rx: 20, ry: 4 },
    "mid-spread": { rx: 18, ry: 8 },
    rounded: { rx: 7, ry: 8 },
    "mid-rounded": { rx: 11, ry: 11 },
  }[mouth];
  return (
    <svg viewBox="0 0 56 40" className={cn("h-8 w-11", className)} aria-hidden>
      <ellipse cx={28} cy={20} rx={shape.rx + 4} ry={shape.ry + 4} fill="none" stroke="currentColor" strokeWidth={2} />
      <ellipse cx={28} cy={20} rx={shape.rx} ry={shape.ry} fill="none" stroke="currentColor" strokeWidth={1.4} opacity={0.6} />
    </svg>
  );
}

const W = 450;
const H = 280;
/* trapézio: anterior-fechada, posterior-fechada, posterior-aberta, anterior-aberta */
const TL = [52, 34];
const TR = [372, 34];
const BR = [372, 236];
const BL = [182, 236];

export function VowelMapPT({
  body,
  trail = [],
  selected,
  onSelect,
  showNasal: showNasalProp,
  onShowNasalChange,
  showMouths = true,
  lang = "pt",
  strings: stringsOverride,
  className,
}: VowelMapPTProps) {
  const s = { ...defaultStrings.vowels, ...stringsOverride };
  const [localNasal, setLocalNasal] = React.useState(false);
  const showNasal = showNasalProp ?? localNasal;
  const setNasal = onShowNasalChange ?? setLocalNasal;

  // escala de formantes para este corpo: usa o "i" e o "a"/"u" como cantos
  const fi = vowelFormants(VOWELS_PT.find((v) => v.id === "i")!, body);
  const fa = vowelFormants(VOWELS_PT.find((v) => v.id === "a")!, body);
  const fu = vowelFormants(VOWELS_PT.find((v) => v.id === "u")!, body);
  const f1lo = Math.log(fi.f1 * 0.9), f1hi = Math.log(fa.f1 * 1.08);
  const f2hi = Math.log(fi.f2 * 1.06), f2lo = Math.log(fu.f2 * 0.92);
  const pos = (f1: number, f2: number): [number, number] => {
    const v = (Math.log(f1) - f1lo) / (f1hi - f1lo); // 0 fechada .. 1 aberta
    const u = (f2hi - Math.log(f2)) / (f2hi - f2lo); // 0 anterior .. 1 posterior
    const yy = TL[1] + Math.max(0, Math.min(1, v)) * (BL[1] - TL[1]);
    const left = TL[0] + (BL[0] - TL[0]) * Math.max(0, Math.min(1, v));
    const xx = left + Math.max(0, Math.min(1, u)) * (TR[0] - left);
    return [Math.round(xx * 100) / 100, Math.round(yy * 100) / 100];
  };

  const list = VOWELS_PT.filter((v) => showNasal || !v.nasal);
  const cur = trail[trail.length - 1];
  const near = cur ? nearestVowel(cur.f1, cur.f2, body, showNasal) : null;
  const oral = VOWELS_PT.filter((v) => !v.nasal);

  return (
    <section data-slot="vowel-map" aria-label={s.label} className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="panel-label text-muted">{s.label}</p>
        <label className="inline-flex h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-fg">
          <input type="checkbox" checked={showNasal} onChange={(e) => setNasal(e.target.checked)} className="size-5 accent-[var(--accent)]" />
          {s.showNasal}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <path d={`M${TL} L${TR} L${BR} L${BL} Z`} fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth={1.5} />
          <line x1={(TL[0] + TR[0]) / 2} y1={TL[1]} x2={(BL[0] + BR[0]) / 2} y2={BL[1]} stroke="var(--line)" strokeDasharray="4 4" />
          <line x1={(TL[0] + BL[0]) / 2} y1={(TL[1] + BL[1]) / 2} x2={BR[0]} y2={(TL[1] + BR[1]) / 2} stroke="var(--line)" strokeDasharray="4 4" />
          {/* eixos */}
          <text x={TL[0]} y={18} fontFamily="var(--font-sans)" fontSize={14} fill="var(--muted)">← {s.front}</text>
          <text x={TR[0]} y={18} textAnchor="end" fontFamily="var(--font-sans)" fontSize={14} fill="var(--muted)">{s.back} →</text>
          <text x={TR[0] + 6} y={TL[1] + 4} fontFamily="var(--font-sans)" fontSize={14} fill="var(--muted)">{s.closed}</text>
          <text x={TR[0] + 6} y={BR[1]} fontFamily="var(--font-sans)" fontSize={14} fill="var(--muted)">{s.open}</text>

          {/* rastro e ponto do aluno */}
          {trail.length > 1 && (
            <path
              d={trail.map((p, i) => `${i ? "L" : "M"}${pos(p.f1, p.f2).join(" ")}`).join("")}
              fill="none"
              stroke="var(--voice-you)"
              strokeWidth={2}
              strokeOpacity={0.5}
              strokeLinecap="round"
            />
          )}

          {cur && (() => {
            const [x, y] = pos(cur.f1, cur.f2);
            return (
              <g>
                <circle cx={x} cy={y} r={8} fill="var(--voice-you)" stroke="var(--marker-ring)" strokeWidth={2} />
                <text x={x - 12} y={y - 12} textAnchor="end" fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill="var(--voice-you)" stroke="var(--surface-2)" strokeWidth={4} paintOrder="stroke">
                  {s.you}
                </text>
              </g>
            );
          })()}

          {list.map((v) => {
            const f = vowelFormants(v, body);
            const [x, y] = pos(f.f1, f.f2);
            const isSel = v.id === selected;
            const isNear = near?.vowel.id === v.id;
            const word = v.example[lang];
            return (
              <g
                key={v.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSel}
                aria-label={`${s.play(v.id, word)}${v.nasal ? `, ${s.nasal.toLowerCase()}` : ""}`}
                onClick={() => onSelect?.(v.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect?.(v.id); } }}
                className="group/v cursor-pointer outline-none"
              >
                <circle cx={x} cy={y} r={22} fill="transparent" />
                {isNear && <circle cx={x} cy={y} r={22} fill="none" stroke="var(--voice-you)" strokeWidth={2.5} />}
                <circle
                  cx={x}
                  cy={y}
                  r={17}
                  fill={isSel ? "var(--accent)" : "var(--surface)"}
                  stroke={v.nasal ? "var(--fg)" : "var(--line-strong)"}
                  strokeWidth={1.5}
                  strokeDasharray={v.nasal ? "3 2" : undefined}
                />
                <circle cx={x} cy={y} r={20.5} fill="none" stroke="var(--focus)" strokeWidth={2.5} className="opacity-0 group-focus-visible/v:opacity-100" />
                <text x={x} y={y} dy="0.35em" textAnchor="middle" fontFamily="var(--font-display)" fontSize={19} fontWeight={800} fill={isSel ? "var(--on-accent)" : "var(--fg)"}>
                  {v.id}
                </text>
                <text x={x + 21} y={y + 5} fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill="var(--fg)" stroke="var(--surface-2)" strokeWidth={3} paintOrder="stroke">
                  {word.split(" ")[0]}
                </text>
                <text x={x} y={y + 31} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={12} fill="var(--muted)">
                  /{v.ipa}/
                </text>
              </g>
            );
          })}


        </svg>

        {showMouths && (
          <ul className="grid grid-cols-4 gap-2 md:grid-cols-2" aria-label={s.oral}>
            {oral.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(v.id)}
                  aria-label={`${s.play(v.id, v.example[lang])}: ${s.mouths[v.mouth]}`}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-2 rounded-sm border px-2 py-1 text-left focus-ring",
                    v.id === selected ? "border-accent bg-accent-soft text-fg" : "border-line text-fg hover:border-line-strong",
                  )}
                >
                  <MouthShape mouth={v.mouth} />
                  <span className="font-display text-lg font-bold">{v.id}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-base text-fg" aria-live="polite">
        {near ? s.youAreNear(near.vowel.id) : s.noFormants}
      </p>
    </section>
  );
}
