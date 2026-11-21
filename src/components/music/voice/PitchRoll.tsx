// src/components/music/voice/PitchRoll.tsx
// O "braço" do canto: notas-alvo como barras com a sílaba dentro, a linha do
// Chimera (guia: âmbar, TRACEJADA, marcador quadrado) e a do aluno (teal, CHEIA,
// marcador redondo), a faixa de tolerância e o cursor do tempo. O tempo corre da
// direita para a esquerda; o eixo vertical fica centrado na tessitura do aluno.
import * as React from "react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { voiceNoteName, SOLFEGE, type Lang, type VoiceRange } from "../../../lib/voice";

export type RollNote = { midi: number; t0: number; t1: number; syllable: string };
export type TracePoint = { t: number; midi: number | null };
export type NoteResult = "in-tune" | "low" | "high" | "octave-below" | "octave-above" | "scoop" | "missed";
export type RollMode = "listen" | "together" | "your-turn";

export type PitchRollProps = {
  notes: RollNote[];
  /** A altura cantada pelo Chimera ao longo do tempo (telemetria). */
  guideTrace?: TracePoint[];
  /** A altura do aluno (microfone). `midi: null` = silêncio/ruído. */
  youTrace?: TracePoint[];
  /** Tempo atual em segundos. */
  now: number;
  /** Revisão: mostra a frase inteira desde o começo (e a linha do aluno toda). */
  review?: boolean;
  range: VoiceRange;
  /** Tolerância do alvo em cents (±). Padrão 30. */
  tolerance?: number;
  mode?: RollMode;
  /** Resultado de cada nota (mesmo índice de `notes`). */
  results?: (NoteResult | undefined)[];
  /** Segundos visíveis. */
  windowSec?: number;
  /** Rótulos do eixo: nomes das notas ou solfejo (Dó Ré Mi como sílaba cantada). */
  axis?: "names" | "solfege";
  lang?: Lang;
  strings?: Partial<Strings["voice"]>;
  className?: string;
};

const BASE_W = 640;
const GUT = 52;
const RH = 22;
const CURSOR = 0.3;

function ResultBadge({ r, x, y }: { r: NoteResult; x: number; y: number }) {
  if (r === "missed") return null;
  const good = r === "in-tune";
  const half = r === "octave-below" || r === "octave-above";
  return (
    <g aria-hidden>
      <circle cx={x} cy={y} r={7.5} fill={good ? "var(--good)" : "var(--surface)"} stroke={good ? "var(--marker-ring)" : "var(--line-strong)"} strokeWidth={1.4} />
      {good && <path d={`M${x - 3.5} ${y} l2.5 2.5 l4.5 -5`} fill="none" stroke="var(--bg)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />}
      {r === "low" && <path d={`M${x} ${y + 4} v-8 m-3 3 l3 -3 l3 3`} fill="none" stroke="var(--fg)" strokeWidth={1.6} strokeLinecap="round" />}
      {r === "high" && <path d={`M${x} ${y - 4} v8 m-3 -3 l3 3 l3 -3`} fill="none" stroke="var(--fg)" strokeWidth={1.6} strokeLinecap="round" />}
      {half && (
        <text x={x} y={y} dy="0.35em" textAnchor="middle" fontFamily="var(--font-mono)" fontSize={7.5} fontWeight={800} fill="var(--fg)">
          8ª
        </text>
      )}
      {r === "scoop" && <path d={`M${x - 4} ${y + 3} q3 0 4 -3 t4 -3`} fill="none" stroke="var(--fg)" strokeWidth={1.6} strokeLinecap="round" />}
    </g>
  );
}

export function PitchRoll({
  notes,
  guideTrace = [],
  youTrace = [],
  now,
  review = false,
  range,
  tolerance = 30,
  mode = "together",
  results = [],
  windowSec = 8,
  axis = "names",
  lang = "pt",
  strings: stringsOverride,
  className,
}: PitchRollProps) {
  const s = { ...defaultStrings.voice, ...stringsOverride };
  const uid = React.useId().replace(/:/g, "");
  // largura real em px: 1 unidade = 1 px, para o texto não encolher no celular
  const box = React.useRef<HTMLDivElement>(null);
  const [W, setW] = React.useState(BASE_W);
  React.useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(300, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // no celular a janela de tempo encolhe junto, para as notas não ficarem espremidas
  const win = Math.max(4, (windowSec * W) / BASE_W);

  // eixo vertical: centrado na tessitura, alargado para caber as notas
  const center = (range.comfortLow + range.comfortHigh) / 2;
  const noteLo = notes.length ? Math.min(...notes.map((n) => n.midi)) : center;
  const noteHi = notes.length ? Math.max(...notes.map((n) => n.midi)) : center;
  const half = Math.max(6, Math.ceil(Math.max(center - noteLo, noteHi - center)) + 2);
  const top = Math.round(center + half);
  const bottom = Math.round(center - half);
  const rows = top - bottom + 1;
  const H = rows * RH;
  const y = (m: number) => (top - m) * RH + RH / 2;
  const t0 = review ? -0.2 : now - win * CURSOR;
  const x = (t: number) => GUT + ((t - t0) / win) * (W - GUT);
  const visible = (a: number, b: number) => b >= t0 && a <= t0 + win;

  const path = (pts: TracePoint[], until?: number) => {
    let d = "";
    let pen = false;
    for (const p of pts) {
      if (until !== undefined && p.t > until) break;
      if (p.t < t0 - 0.5 || p.t > t0 + win + 0.5 || p.midi === null) {
        pen = false;
        continue;
      }
      const yy = Math.max(2, Math.min(H - 2, y(p.midi)));
      d += `${pen ? "L" : "M"}${x(p.t).toFixed(1)} ${yy.toFixed(1)}`;
      pen = true;
    }
    return d;
  };
  const head = (pts: TracePoint[]) => {
    for (let i = pts.length - 1; i >= 0; i--) if (pts[i].t <= now && pts[i].midi !== null) return pts[i].t > now - 0.3 ? pts[i] : null;
    return null;
  };
  const showGuide = guideTrace.length > 0;
  const showYou = mode !== "listen" && youTrace.length > 0;
  const gHead = showGuide ? head(guideTrace) : null;
  const yHead = showYou ? head(youTrace) : null;
  const ghost = mode === "your-turn";
  const label = (m: number) => {
    const pc = ((m % 12) + 12) % 12;
    if ([1, 3, 6, 8, 10].includes(pc)) return "";
    return axis === "solfege" ? SOLFEGE[pc] : voiceNoteName(m, lang, pc === 0);
  };

  return (
    <figure data-slot="pitch-roll" className={cn("flex flex-col gap-2", className)}>
      <div ref={box} className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block max-w-full rounded-md border border-line bg-surface" role="img" aria-label={`${s.rollLabel}. ${s.modeHint[mode]}`}>
        <defs>
          <clipPath id={`${uid}-c`}>
            <rect x={GUT} y={0} width={W - GUT} height={H} />
          </clipPath>
        </defs>
        {/* linhas das notas: naturais com nome, região confortável realçada */}
        {Array.from({ length: rows }, (_, i) => top - i).map((m) => {
          const pc = ((m % 12) + 12) % 12;
          const blackKey = [1, 3, 6, 8, 10].includes(pc);
          const comfy = m >= range.comfortLow && m <= range.comfortHigh;
          return (
            <g key={m}>
              <rect x={GUT} y={y(m) - RH / 2} width={W - GUT} height={RH} fill={blackKey ? "var(--surface-2)" : "transparent"} opacity={0.6} />
              {pc === 0 && <line x1={GUT} x2={W} y1={y(m) + RH / 2} y2={y(m) + RH / 2} stroke="var(--line-strong)" strokeWidth={1} />}
              {comfy && <rect x={GUT - 4} y={y(m) - RH / 2} width={3} height={RH} fill="var(--accent)" opacity={0.6} />}
              <text x={GUT - 8} y={y(m)} dy="0.35em" textAnchor="end" fontFamily="var(--font-mono)" fontSize={11} fontWeight={pc === 0 ? 700 : 500} fill={pc === 0 ? "var(--fg)" : "var(--muted)"}>
                {label(m)}
              </text>
            </g>
          );
        })}

        <g clipPath={`url(#${uid}-c)`}>
          {/* notas-alvo: barra de ±50 cents, faixa de tolerância mais forte, sílaba dentro */}
          {notes.map((n, i) => {
            if (!visible(n.t0, n.t1)) return null;
            const r = results[i];
            const x0 = x(n.t0);
            const x1 = x(n.t1);
            const tolH = Math.max(4, (tolerance / 50) * RH);
            return (
              <g key={i}>
                <rect
                  x={x0}
                  y={y(n.midi) - RH / 2 + 1}
                  width={x1 - x0}
                  height={RH - 2}
                  rx={4}
                  fill="var(--voice-target)"
                  stroke={r === "missed" ? "var(--line-strong)" : "var(--fg)"}
                  strokeWidth={1}
                  strokeDasharray={r === "missed" ? "4 3" : undefined}
                  strokeOpacity={0.5}
                />
                <rect x={x0} y={y(n.midi) - tolH / 2} width={x1 - x0} height={tolH} fill="var(--voice-target)" />
                <text
                  x={x0 + 4}
                  y={y(n.midi) - RH / 2 - 4}
                  fontFamily="var(--font-sans)"
                  fontSize={13}
                  fontWeight={700}
                  fill="var(--fg)"
                  stroke="var(--surface)"
                  strokeWidth={4}
                  paintOrder="stroke"
                >
                  {n.syllable}
                </text>
                {r && <ResultBadge r={r} x={x1 - 8} y={y(n.midi) - RH / 2 - 6} />}
              </g>
            );
          })}

          {/* Chimera: tracejado, âmbar */}
          {showGuide && (
            <path d={path(guideTrace)} fill="none" stroke="var(--voice-guide)" strokeWidth={2.5} strokeDasharray="7 5" strokeLinecap="round" opacity={ghost ? 0.35 : 1} />
          )}
          {/* você: cheio, teal (só até agora) */}
          {showYou && <path d={path(youTrace, review ? undefined : now)} fill="none" stroke="var(--voice-you)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />}
        </g>

        {/* cursor do tempo */}
        <line x1={x(now)} x2={x(now)} y1={0} y2={H} stroke="var(--fg)" strokeWidth={1.5} opacity={0.5} />

        {/* cabeças das linhas com marcador e rótulo */}
        {gHead && gHead.midi !== null && (
          <g opacity={ghost ? 0.5 : 1}>
            <rect x={x(gHead.t) - 6} y={y(gHead.midi) - 6} width={12} height={12} fill="var(--voice-guide)" stroke="var(--marker-ring)" strokeWidth={1.5} />
            <text x={x(gHead.t) + 10} y={y(gHead.midi) - 10} fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill="var(--voice-guide)" stroke="var(--surface)" strokeWidth={4} paintOrder="stroke">
              {s.guide}
            </text>
          </g>
        )}
        {yHead && yHead.midi !== null && (
          <g>
            <circle cx={x(yHead.t)} cy={Math.max(6, Math.min(H - 6, y(yHead.midi)))} r={7} fill="var(--voice-you)" stroke="var(--marker-ring)" strokeWidth={1.5} />
            <text x={x(yHead.t) + 10} y={Math.max(6, Math.min(H - 6, y(yHead.midi))) + 18} fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill="var(--voice-you)" stroke="var(--surface)" strokeWidth={4} paintOrder="stroke">
              {s.you}
            </text>
          </g>
        )}
      </svg>
      </div>

      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-fg">
        <span className="inline-flex items-center gap-2">
          <svg width="34" height="12" aria-hidden>
            <line x1={2} x2={24} y1={6} y2={6} stroke="var(--voice-guide)" strokeWidth={2.5} strokeDasharray="6 4" />
            <rect x={24} y={1} width={10} height={10} fill="var(--voice-guide)" />
          </svg>
          {s.guideLine}
        </span>
        <span className="inline-flex items-center gap-2">
          <svg width="34" height="12" aria-hidden>
            <line x1={2} x2={24} y1={6} y2={6} stroke="var(--voice-you)" strokeWidth={3} />
            <circle cx={28} cy={6} r={5} fill="var(--voice-you)" />
          </svg>
          {s.youLine}
        </span>
        <span className="text-muted">{s.modeHint[mode]}</span>
      </figcaption>

      <ol className="sr-only">
        {notes.map((n, i) => (
          <li key={i}>{s.noteAria(n.syllable, voiceNoteName(n.midi, lang), results[i] ? s.results[results[i]!] : undefined)}</li>
        ))}
      </ol>
    </figure>
  );
}
