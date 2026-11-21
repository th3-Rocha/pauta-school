// src/components/music/voice/VoiceBodyPicker.tsx
// O ajuste do instrumento do canto: com que voz o Chimera canta com você.
// É o BodyPad do Chimera crescido: um ponto num triângulo entre adulto mais
// grave (masc.), adulto mais agudo (fem.) e criança. Fala de som e tamanho do
// instrumento, nunca de identidade.
// Arrastar mostra na hora (`onPreview`), soltar aplica (`onCommit`): o motor
// monta um trato novo, e `applying` mostra "ajustando a voz…".
import * as React from "react";
import { Loader2, Mic, Volume2, Wand2 } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import {
  BODY_PRESETS,
  BODY_STEP,
  bodyLabel,
  bodyWeights,
  defaultF0,
  fromUV,
  sameBody,
  snap,
  toUV,
  type BodyCorner,
  type Lang,
  type VoiceBody,
} from "../../../lib/voice";
import { Button } from "../../ui/Button";

export type BodySuggestState = "idle" | "listening" | "ready";

export type VoiceBodyPickerProps = {
  /** O corpo aplicado. */
  value: VoiceBody;
  /** Enquanto arrasta: o app chama o `previewBody` do Chimera. */
  onPreview?: (body: VoiceBody) => void;
  /** Ao soltar (e a cada passo do teclado): o app chama o `setBody` do Chimera. */
  onCommit: (body: VoiceBody) => void;
  /** O motor está reconstruindo a voz. */
  applying?: boolean;
  /** Corpo do Home (padrão: adulto mais grave, como no Chimera). */
  defaultBody?: VoiceBody;
  /** Sugestão a partir da fala do aluno (`suggestBody` em voice.ts). */
  suggestion?: VoiceBody | null;
  suggestState?: BodySuggestState;
  /** "Medir minha voz": o app abre o microfone e mede a fala. */
  onMeasure?: () => void;
  /** O Chimera canta uma frase curta neste corpo. */
  onListen?: () => void;
  /** O monitor do Chimera, mostrando a cabeça mudando de tamanho. Fica ao lado (acima, no celular). */
  stage?: React.ReactNode;
  lang?: Lang;
  strings?: Partial<Strings["voiceBody"]>;
  className?: string;
};

/* Geometria do triângulo (unidades do viewBox) */
const VB = { w: 360, h: 320 };
const T = { x0: 50, x1: 310, y0: 96, y1: 270 };
const X = (u: number) => T.x0 + u * (T.x1 - T.x0);
const Y = (v: number) => T.y0 + v * (T.y1 - T.y0);

/** Silhueta só de tamanho (sem gênero, sem idade além do tamanho), com a onda grave/aguda. */
function Silhouette({ x, y, small, wave }: { x: number; y: number; small?: boolean; wave?: "low" | "high" }) {
  const k = small ? 0.72 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} fill="none" stroke="var(--fg)" strokeWidth={1.8} strokeLinecap="round">
      <circle cx={0} cy={-26} r={6.5} />
      <path d="M-11 4 C-11 -10 -6 -16 0 -16 C6 -16 11 -10 11 4" />
      {wave && (
        <path
          d={wave === "low" ? "M16 -12 q4 -8 8 0 t8 0" : "M16 -12 q2 -6 4 0 t4 0 t4 0 t4 0"}
          stroke="var(--muted)"
          strokeWidth={1.6}
        />
      )}
    </g>
  );
}

export function VoiceBodyPicker({
  value,
  onPreview,
  onCommit,
  applying = false,
  defaultBody = BODY_PRESETS.male,
  suggestion,
  suggestState = "idle",
  onMeasure,
  onListen,
  stage,
  lang = "pt",
  strings: stringsOverride,
  className,
}: VoiceBodyPickerProps) {
  const s = { ...defaultStrings.voiceBody, ...stringsOverride };
  const svgRef = React.useRef<SVGSVGElement>(null);
  const titleId = React.useId();
  const drag = React.useRef<{ id: number; at: VoiceBody } | null>(null);
  const [dragging, setDragging] = React.useState<VoiceBody | null>(null);
  const shown = dragging ?? value;
  const w = bodyWeights(shown);
  const pct = (x: number) => Math.round(x * 100);

  const at = (e: React.PointerEvent): VoiceBody => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const u = Math.min(1, Math.max(0, (p.x - T.x0) / (T.x1 - T.x0)));
    const v = Math.min(1, Math.max(0, (p.y - T.y0) / (T.y1 - T.y0)));
    return fromUV(u, v, drag.current?.at ?? value);
  };
  const move = (b: VoiceBody) => {
    if (!drag.current || sameBody(b, drag.current.at)) return;
    drag.current.at = b;
    setDragging(b);
    onPreview?.(b);
  };
  const end = () => {
    const d = drag.current;
    drag.current = null;
    setDragging(null);
    if (d && !sameBody(d.at, value)) onCommit(d.at);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const b = value;
    const next =
      e.key === "ArrowLeft" ? { ...b, female: snap(b.female - BODY_STEP) }
      : e.key === "ArrowRight" ? { ...b, female: snap(b.female + BODY_STEP) }
      : e.key === "ArrowUp" ? { ...b, child: snap(b.child - BODY_STEP) }
      : e.key === "ArrowDown" ? { ...b, child: snap(b.child + BODY_STEP) }
      : e.key === "Home" ? defaultBody
      : null;
    if (!next) return;
    e.preventDefault();
    if (!sameBody(next, b)) onCommit(next);
  };

  // grade de 5% desenhada a cada 25% (linhas de "mesma idade" e "mesma divisão")
  const grid: string[] = [];
  for (let k = 0.25; k < 1; k += 0.25) {
    grid.push(`M${X(0.5 - 0.5 * (1 - k))} ${Y(k)}H${X(0.5 + 0.5 * (1 - k))}`);
    grid.push(`M${X(k)} ${Y(0)}L${X(0.5)} ${Y(1)}`);
  }
  const fine: string[] = [];
  for (let k = 0.05; k < 0.999; k += 0.05) {
    if (Math.abs(k * 4 - Math.round(k * 4)) < 1e-6) continue;
    fine.push(`M${X(0.5 - 0.5 * (1 - k))} ${Y(k)}H${X(0.5 + 0.5 * (1 - k))}`);
  }

  const [u, v] = toUV(shown);
  const sug = suggestion ? toUV(suggestion) : null;
  const corners: BodyCorner[] = ["male", "female", "child"];
  const atCorner = (c: BodyCorner) => sameBody(value, BODY_PRESETS[c]);

  return (
    <section data-slot="voice-body-picker" aria-labelledby={titleId} className={cn("grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start", className)}>
      {stage && <div className="lg:order-2">{stage}</div>}

      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <p className="panel-label text-muted">{s.label}</p>
          <h3 id={titleId} className="font-display text-2xl font-bold text-fg">
            {s.title}
          </h3>
          <p className="text-base text-fg">{s.why}</p>
        </header>

        <div className="relative mx-auto w-full max-w-md">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            className="w-full touch-none select-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            role="slider"
            tabIndex={0}
            aria-label={s.title}
            aria-valuetext={`${s.aria(pct(w.male), pct(w.female), pct(w.child))}. ${s.keysHint}`}
            aria-valuenow={pct(shown.child)}
            aria-valuemin={0}
            aria-valuemax={100}
            onKeyDown={onKey}
            onPointerDown={(e) => {
              if (e.button !== 0) return;
              (e.currentTarget as Element).setPointerCapture(e.pointerId);
              drag.current = { id: e.pointerId, at: value };
              move(at(e));
            }}
            onPointerMove={(e) => drag.current?.id === e.pointerId && move(at(e))}
            onPointerUp={end}
            onPointerCancel={end}
            onLostPointerCapture={end}
          >
            <path d={`M${X(0)} ${Y(0)}H${X(1)}L${X(0.5)} ${Y(1)}Z`} fill="var(--surface-2)" />
            <path d={fine.join("")} stroke="var(--line)" strokeWidth={0.8} fill="none" />
            <path d={grid.join("")} stroke="var(--line-strong)" strokeWidth={1} strokeDasharray="3 3" fill="none" />
            <path d={`M${X(0)} ${Y(0)}H${X(1)}L${X(0.5)} ${Y(1)}Z`} fill="none" stroke="var(--fg)" strokeWidth={2} strokeLinejoin="round" />

            {/* pontas: silhueta só de tamanho + onda grave/aguda */}
            <Silhouette x={X(0) - 2} y={Y(0) - 14} wave="low" />
            <Silhouette x={X(1) - 18} y={Y(0) - 14} wave="high" />
            <Silhouette x={X(0.5) - 34} y={Y(1) + 18} small />

            {/* sugestão: ponto fantasma tracejado */}
            {sug && (
              <g aria-hidden>
                <circle cx={X(sug[0])} cy={Y(sug[1])} r={11} fill="none" stroke="var(--voice-guide)" strokeWidth={2} strokeDasharray="4 3" />
                <text x={X(sug[0])} y={Y(sug[1]) + 24} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fontWeight={600} fill="var(--voice-guide)">
                  {s.suggestion}
                </text>
              </g>
            )}

            {/* o ponto atual */}
            <circle cx={X(u)} cy={Y(v)} r={13} fill="var(--accent)" opacity={0.18} />
            <circle cx={X(u)} cy={Y(v)} r={8} fill="var(--accent)" stroke="var(--marker-ring)" strokeWidth={2} />
          </svg>

          {/* rótulos das pontas (HTML, para ficarem legíveis em qualquer largura) */}
          <span className="pointer-events-none absolute left-0 top-0 text-left">
            <span className="block text-sm font-semibold leading-4 text-fg">{s.corners.male.title}</span>
            <span className="block text-xs text-muted">{s.corners.male.sub}</span>
          </span>
          <span className="pointer-events-none absolute right-0 top-0 text-right">
            <span className="block text-sm font-semibold leading-4 text-fg">{s.corners.female.title}</span>
            <span className="block text-xs text-muted">{s.corners.female.sub}</span>
          </span>
          <span
            className="pointer-events-none absolute text-left"
            style={{ left: `${((X(0.5) + 12) / VB.w) * 100}%`, top: `${((Y(1) + 4) / VB.h) * 100}%` }}
          >
            <span className="block text-sm font-semibold leading-4 text-fg">{s.corners.child.title}</span>
            <span className="block text-xs text-muted">{s.corners.child.sub}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <p className="font-mono text-base font-semibold text-fg" aria-live="polite">
            {bodyLabel(shown, lang)}
          </p>
          <p className="font-mono text-sm text-muted">{s.pitch(defaultF0(shown))}</p>
          {applying && (
            <p className="inline-flex items-center gap-1.5 text-sm text-muted" role="status">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {s.applying}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label={s.label}>
          {corners.map((c) => (
            <Button key={c} variant={atCorner(c) ? "primary" : "secondary"} size="sm" className="h-11" aria-pressed={atCorner(c)} onClick={() => onCommit(BODY_PRESETS[c])}>
              {s.corners[c].title}
            </Button>
          ))}
          {onListen && (
            <Button variant="ghost" size="sm" className="h-11" onClick={onListen} disabled={applying}>
              <Volume2 aria-hidden />
              {s.listen}
            </Button>
          )}
        </div>

        {onMeasure && (
          <div className="flex flex-col gap-2 rounded-md border border-line bg-surface p-3">
            {suggestState === "ready" && suggestion ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex size-5 shrink-0 rounded-full border-2 border-dashed border-[var(--voice-guide)]" aria-hidden />
                <p className="text-sm text-fg">
                  <span className="font-semibold">{s.suggestion}:</span> <span className="font-mono">{bodyLabel(suggestion, lang)}</span>
                </p>
                <Button size="sm" className="h-11 sm:ml-auto" onClick={() => onCommit(suggestion)}>
                  <Wand2 aria-hidden />
                  {s.useSuggestion}
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-fg">{s.speak}</p>
                  <p className="text-sm text-muted">{suggestState === "listening" ? s.listening : s.speakHint}</p>
                </div>
                <Button variant="secondary" size="sm" className="h-11" onClick={onMeasure} loading={suggestState === "listening"}>
                  <Mic aria-hidden />
                  {s.measure}
                </Button>
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-muted">{s.free}</p>
      </div>
    </section>
  );
}
