// src/components/music/BackingTrackPlayer.tsx
import { Repeat } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { LedToggle, Panel, PlayButton } from "./controls";

export type BackingChord = {
  symbol: string;
  /** Compassos que o acorde dura (largura do bloco). */
  bars?: number;
};

export type BackingTrackPlayerProps = {
  name: string;
  /** Tom, ex.: "A menor". (Não use `key`: é reservado do React.) */
  tonality: string;
  bpm: number;
  chords: BackingChord[];
  /** Índice do acorde que está soando. -1 = parado. */
  currentIndex?: number;
  playing: boolean;
  onPlayPause: () => void;
  loop: boolean;
  onLoopChange: (loop: boolean) => void;
  disabled?: boolean;
  strings?: Partial<Strings["backing"]>;
  className?: string;
};

export function BackingTrackPlayer({
  name,
  tonality,
  bpm,
  chords,
  currentIndex = -1,
  playing,
  onPlayPause,
  loop,
  onLoopChange,
  disabled,
  strings: stringsOverride,
  className,
}: BackingTrackPlayerProps) {
  const s = { ...defaultStrings.backing, ...stringsOverride };
  const next = currentIndex >= 0 ? (currentIndex + 1 < chords.length ? currentIndex + 1 : loop ? 0 : -1) : -1;
  return (
    <Panel label={s.label} data-slot="backing-track" className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-3">
        <PlayButton playing={playing} onClick={onPlayPause} playLabel={s.play} pauseLabel={s.pause} disabled={disabled} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl font-bold text-fg">{name}</p>
          <p className="flex flex-wrap gap-x-3 text-sm text-muted">
            <span>
              {s.key} <strong className="font-semibold text-fg">{tonality}</strong>
            </span>
            <span>
              <strong className="font-mono font-semibold text-fg">{bpm}</strong> {s.bpm}
            </span>
          </p>
        </div>
      </div>

      <ol className="flex flex-wrap gap-1.5" aria-label={name}>
        {chords.map((c, i) => {
          const cur = i === currentIndex;
          const nx = i === next && !cur;
          return (
            <li
              key={i}
              aria-current={cur ? "step" : undefined}
              className={cn(
                "relative flex h-14 min-w-14 flex-col items-center justify-center rounded-xs border px-3 transition-colors duration-[var(--dur-fast)]",
                cur ? "border-accent bg-accent text-on-accent shadow-knob" : nx ? "border-accent border-dashed text-fg" : "border-line-strong text-fg",
              )}
              style={{ flexGrow: c.bars ?? 1, flexBasis: `${(c.bars ?? 1) * 3.5}rem` }}
            >
              <span className="font-mono text-lg font-bold leading-none">{c.symbol}</span>
              {(cur || nx) && <span className={cn("mt-1 text-[10px] font-semibold uppercase tracking-wider", cur ? "text-on-accent" : "text-muted")}>{cur ? s.current : s.next}</span>}
            </li>
          );
        })}
      </ol>

      <div className="flex">
        <LedToggle pressed={loop} onPressedChange={onLoopChange} icon={<Repeat aria-hidden />}>
          {s.loop}
        </LedToggle>
      </div>
    </Panel>
  );
}
