// src/components/music/ScoreFrame.tsx
import * as React from "react";
import { Gauge, Repeat, Timer, Activity } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { Slider } from "../ui/Slider";
import { LedToggle, PlayButton } from "./controls";

export type ScoreFrameProps = {
  title?: string;
  subtitle?: string;
  /** Onde o alphaTab desenha. Passe o elemento de montagem como filho. */
  children: React.ReactNode;
  playing: boolean;
  onPlayPause: () => void;
  /** 50–100 (%) */
  speed: number;
  onSpeedChange: (speed: number) => void;
  loop: boolean;
  onLoopChange: (loop: boolean) => void;
  /** Ex.: "c. 3–4" (o trecho selecionado na partitura). */
  loopLabel?: string;
  metronome: boolean;
  onMetronomeChange: (on: boolean) => void;
  countIn: boolean;
  onCountInChange: (on: boolean) => void;
  position?: { bar: number; total: number };
  /** Enquanto o alphaTab carrega, os controles ficam desabilitados. */
  disabled?: boolean;
  /** Altura mínima da área da partitura. */
  minHeight?: number;
  strings?: Partial<Strings["score"]>;
  className?: string;
};

/**
 * Moldura para partitura + tablatura. A renderização vem de fora (alphaTab);
 * aqui ficam só a moldura e os controles.
 */
export function ScoreFrame({
  title,
  subtitle,
  children,
  playing,
  onPlayPause,
  speed,
  onSpeedChange,
  loop,
  onLoopChange,
  loopLabel,
  metronome,
  onMetronomeChange,
  countIn,
  onCountInChange,
  position,
  disabled,
  minHeight = 220,
  strings: stringsOverride,
  className,
}: ScoreFrameProps) {
  const s = { ...defaultStrings.score, ...stringsOverride };
  return (
    <section
      data-slot="score-frame"
      aria-label={title ?? s.label}
      className={cn("overflow-hidden rounded-lg border border-line bg-surface", className)}
    >
      {(title || position) && (
        <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-4 py-3">
          <div className="min-w-0">
            {title && <h3 className="font-display text-xl font-bold text-fg">{title}</h3>}
            {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
          </div>
          {position && (
            <p className="font-mono text-sm text-muted" aria-live="polite">
              {s.position(position.bar, position.total)}
            </p>
          )}
        </header>
      )}

      <div className="overflow-x-auto overscroll-x-contain bg-surface px-2 py-3 text-fg" style={{ minHeight }}>
        {children}
      </div>

      <div className="flex flex-col gap-3 border-t border-line bg-surface-2 p-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-3">
          <PlayButton playing={playing} onClick={onPlayPause} playLabel={s.play} pauseLabel={s.pause} disabled={disabled} />
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:w-56 sm:flex-none">
            <Gauge className="size-4 shrink-0 text-muted" aria-hidden />
            <Slider
              value={[speed]}
              min={50}
              max={100}
              step={5}
              onValueChange={([v]) => onSpeedChange(v)}
              thumbLabels={[s.speed]}
              disabled={disabled}
            />
            <output className="w-12 shrink-0 text-right font-mono text-sm font-semibold text-fg">{speed}%</output>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <LedToggle pressed={loop} onPressedChange={onLoopChange} icon={<Repeat aria-hidden />} disabled={disabled}>
            {s.loop}
            {loopLabel && <span className="font-mono text-xs text-muted">{loopLabel}</span>}
          </LedToggle>
          <LedToggle pressed={metronome} onPressedChange={onMetronomeChange} icon={<Activity aria-hidden />} disabled={disabled}>
            {s.metronome}
          </LedToggle>
          <LedToggle pressed={countIn} onPressedChange={onCountInChange} icon={<Timer aria-hidden />} disabled={disabled}>
            {s.countIn}
          </LedToggle>
        </div>
      </div>
    </section>
  );
}
