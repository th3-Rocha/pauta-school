// src/components/music/keyboard/PedalIndicator.tsx
// Pedal de sustentação: estado (pisado/solto), botão de segurar para quem não
// tem pedal (a barra de Espaço fica com o app) e a marcação "Ped. … *" da
// partitura em versão visual, para o laboratório.
import * as React from "react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { Panel } from "../controls";

export type PedalMark = { start: number; end: number };

export type PedalIndicatorProps = {
  /** Pedal pisado agora (do MIDI CC64, da barra de Espaço ou do botão). */
  down: boolean;
  /** Liga o botão "segure para pisar". O app também escuta a barra de Espaço. */
  onDownChange?: (down: boolean) => void;
  /** O aluno tem pedal ligado ao teclado MIDI. Sem pedal, mostra o botão e a dica. */
  hasPedal?: boolean;
  /** Marcação da partitura, em tempos. */
  marks?: PedalMark[];
  /** Tempo atual, para o cursor da marcação. */
  position?: number;
  /** Duração total do trecho, em tempos. */
  beats?: number;
  beatsPerBar?: number;
  strings?: Partial<Strings["pedal"]>;
  className?: string;
};

/** Pedal visto de lado: latão sobre a laca. Afunda quando pisado. */
export function PedalGlyph({ down, className }: { down: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={cn("h-10 w-16", className)} aria-hidden>
      <rect x={2} y={28} width={60} height={10} rx={2} fill="var(--case)" />
      <rect x={4} y={30} width={56} height={1} fill="var(--case-shine)" />
      <g
        style={{ transformBox: "fill-box", transformOrigin: "100% 100%", transition: "transform var(--dur-fast) var(--ease-out)" }}
        transform={down ? "rotate(-8 54 27)" : undefined}
      >
        <path d="M8 14 Q8 10 12 10 L52 18 Q56 19 56 23 L56 27 L10 22 Q8 22 8 20 Z" fill="var(--pedal)" stroke="var(--marker-ring)" strokeWidth={1.5} />
        <path d="M12 13 L50 20" stroke="var(--marker-ring)" strokeOpacity={0.25} strokeWidth={1} />
      </g>
    </svg>
  );
}

export function PedalIndicator({
  down,
  onDownChange,
  hasPedal = true,
  marks = [],
  position,
  beats,
  beatsPerBar = 4,
  strings: stringsOverride,
  className,
}: PedalIndicatorProps) {
  const s = { ...defaultStrings.pedal, ...stringsOverride };
  const holding = React.useRef(false);
  const total = beats ?? Math.max(beatsPerBar, ...marks.map((m) => m.end));
  const W = 320;
  const x = (b: number) => (b / total) * W;

  const set = (v: boolean) => {
    if (holding.current === v) return;
    holding.current = v;
    onDownChange?.(v);
  };

  return (
    <Panel
      label={s.label}
      className={cn("max-w-xl", className)}
      aside={
        <span
          className={cn(
            "inline-flex h-6 items-center gap-1.5 rounded-xs border px-2 text-xs font-semibold",
            down ? "border-accent bg-accent-soft text-fg" : "border-line-strong bg-surface-2 text-muted",
          )}
          role="status"
        >
          <span aria-hidden className={cn("size-2 rounded-full ring-1 ring-marker-ring", down ? "bg-accent" : "bg-line-strong")} />
          {down ? s.on : s.off}
        </span>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <PedalGlyph down={down} />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="font-display text-xl font-bold text-fg">{s.sustain}</p>
            {!hasPedal && <p className="text-sm text-muted">{s.noPedal}</p>}
          </div>
          {!hasPedal && onDownChange && (
            <button
              type="button"
              aria-pressed={down}
              aria-label={s.holdAria}
              className={cn(
                "inline-flex h-13 min-w-40 select-none items-center justify-center gap-2 rounded-sm border px-4 font-semibold focus-ring touch-none",
                "transition-[background-color,transform] duration-[var(--dur-fast)]",
                down ? "translate-y-px border-accent bg-accent-soft text-fg" : "border-line-strong bg-surface-2 text-fg shadow-knob",
              )}
              onPointerDown={(e) => {
                e.preventDefault();
                set(true);
              }}
              onPointerUp={() => set(false)}
              onPointerCancel={() => set(false)}
              onPointerLeave={() => set(false)}
              onKeyDown={(e) => {
                if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                  e.preventDefault();
                  set(true);
                }
              }}
              onKeyUp={(e) => {
                if (e.key === " " || e.key === "Enter") set(false);
              }}
              onBlur={() => set(false)}
            >
              <kbd className="rounded-xs border border-line-strong bg-bg px-1.5 font-mono text-xs text-muted">{s.spaceKey}</kbd>
              {s.holdTouch}
            </button>
          )}
        </div>

        {marks.length > 0 && (
          <figure className="flex flex-col gap-1.5">
            <figcaption className="panel-label text-muted">{s.marks}</figcaption>
            <svg viewBox={`-4 0 ${W + 8} 34`} className="h-auto w-full" role="img" aria-label={marks.map((m) => s.markAria(m.start + 1, m.end + 1)).join(". ")}>
              {Array.from({ length: Math.floor(total / beatsPerBar) + 1 }, (_, i) => (
                <line key={i} x1={x(i * beatsPerBar)} x2={x(i * beatsPerBar)} y1={2} y2={32} stroke="var(--line)" strokeWidth={1} />
              ))}
              {marks.map((m, i) => {
                const active = position !== undefined && position >= m.start && position < m.end;
                const color = active ? "var(--accent)" : "var(--fg)";
                // troca de pedal: a próxima marca começa onde esta termina (notação em ^)
                const change = marks.some((n) => n.start === m.end);
                const continued = marks.some((n) => n.end === m.start);
                const x0 = x(m.start) + (continued ? 0 : 2);
                const x1 = x(m.end) - (change ? 0 : 3);
                return (
                  <g key={i}>
                    {!continued && (
                      <text x={x0} y={14} fontFamily="var(--font-display)" fontStyle="italic" fontWeight={700} fontSize={12} fill={color}>
                        {s.ped}
                      </text>
                    )}
                    <path
                      d={`M${x0} ${continued ? 21 : 20} ${continued ? `L${x0 + 3} 26` : `L${x0} 26`} L${change ? x1 - 3 : x1} 26 L${x1} ${change ? 21 : 20}`}
                      fill="none"
                      stroke={color}
                      strokeWidth={active ? 2.5 : 1.6}
                      strokeLinejoin="round"
                    />
                    {!change && (
                      <text x={x1} y={14} textAnchor="middle" fontFamily="var(--font-display)" fontWeight={700} fontSize={13} fill={color}>
                        {s.release}
                      </text>
                    )}
                  </g>
                );
              })}
              {position !== undefined && (
                <line x1={x(position)} x2={x(position)} y1={0} y2={34} stroke="var(--accent)" strokeWidth={2} />
              )}
            </svg>
          </figure>
        )}
      </div>
    </Panel>
  );
}
