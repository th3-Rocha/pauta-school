// src/components/music/Metronome.tsx
import * as React from "react";
import { Minus, Plus, Hand } from "lucide-react";
import { cn } from "../../lib/cn";
import { clamp } from "../../lib/music";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { Slider } from "../ui/Slider";
import { ToggleGroup, ToggleGroupItem } from "../ui/ToggleGroup";
import { Panel, PlayButton } from "./controls";

export type TimeSignature = "2/4" | "3/4" | "4/4" | "6/8";
/** all: todos os tempos · downbeat: só o 1 · offbeats: só os contratempos · gap: alterna compasso com clique e compasso mudo */
export type ClickMode = "all" | "downbeat" | "offbeats" | "gap";

export type MetronomeProps = {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  min?: number;
  max?: number;
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  timeSignature: TimeSignature;
  onTimeSignatureChange: (ts: TimeSignature) => void;
  clickMode: ClickMode;
  onClickModeChange: (mode: ClickMode) => void;
  /** Tempo atual vindo do motor de áudio (base 0). -1 ou undefined = parado. */
  currentBeat?: number;
  /** No modo "gap": true quando o compasso atual é o mudo. */
  silentMeasure?: boolean;
  /** Chamado a cada toque do tap tempo (para tocar um clique, se quiser). */
  onTap?: () => void;
  strings?: Partial<Strings["metronome"]>;
  className?: string;
};

const BEATS: Record<TimeSignature, number> = { "2/4": 2, "3/4": 3, "4/4": 4, "6/8": 6 };
const SIGNATURES: TimeSignature[] = ["2/4", "3/4", "4/4", "6/8"];

/** Pensado para ser lido de longe, com o celular apoiado na estante. */
export function Metronome({
  bpm,
  onBpmChange,
  min = 30,
  max = 240,
  playing,
  onPlayingChange,
  timeSignature,
  onTimeSignatureChange,
  clickMode,
  onClickModeChange,
  currentBeat,
  silentMeasure,
  onTap,
  strings: stringsOverride,
  className,
}: MetronomeProps) {
  const s = { ...defaultStrings.metronome, ...stringsOverride };
  const beats = BEATS[timeSignature];
  const taps = React.useRef<number[]>([]);
  const [tapFlash, setTapFlash] = React.useState(0);

  const set = (v: number) => onBpmChange(clamp(Math.round(v), min, max));

  const tap = () => {
    const now = performance.now();
    const list = taps.current.filter((t) => now - t < 2500);
    list.push(now);
    taps.current = list.slice(-5);
    setTapFlash((n) => n + 1);
    onTap?.();
    if (taps.current.length >= 2) {
      const iv = taps.current.slice(1).map((t, i) => t - taps.current[i]);
      const avg = iv.reduce((a, b) => a + b, 0) / iv.length;
      set(60000 / avg);
    }
  };

  const isAccent = (b: number) => b === 0 || (timeSignature === "6/8" && b === 3);
  const isAudible = (b: number) => {
    if (silentMeasure) return false;
    if (clickMode === "downbeat") return b === 0;
    if (clickMode === "offbeats") return timeSignature === "6/8" ? !isAccent(b) : b % 2 === 1;
    return true;
  };

  return (
    <Panel label={s.label} className={cn("flex flex-col gap-4", className)} data-slot="metronome">
      {/* BPM grande */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => set(bpm - 1)}
          aria-label={s.slower}
          className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-2 text-fg shadow-knob focus-ring active:translate-y-px"
        >
          <Minus className="size-6" aria-hidden />
        </button>
        <div className="flex flex-col items-center">
          <output aria-live="off" className="font-mono text-5xl font-bold tabular-nums leading-none tracking-tight text-fg sm:text-[6rem]">
            {bpm}
          </output>
          <span className="panel-label mt-1 text-muted">{s.bpm}</span>
        </div>
        <button
          type="button"
          onClick={() => set(bpm + 1)}
          aria-label={s.faster}
          className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-2 text-fg shadow-knob focus-ring active:translate-y-px"
        >
          <Plus className="size-6" aria-hidden />
        </button>
      </div>

      {/* Batida visual */}
      <ol className="flex items-center justify-center gap-2 sm:gap-3" aria-label={s.signature + " " + timeSignature}>
        {Array.from({ length: beats }, (_, b) => {
          const on = playing && currentBeat === b;
          const audible = isAudible(b);
          return (
            <li
              key={b}
              aria-current={on ? "step" : undefined}
              aria-label={s.beat(b + 1, beats)}
              className={cn(
                "flex items-center justify-center rounded-full border-2 font-mono text-sm font-bold transition-colors duration-[var(--dur-fast)]",
                isAccent(b) ? "size-12 sm:size-14" : "size-10 sm:size-12",
                audible ? "border-line-strong" : "border-dashed border-line-strong",
                on && audible && "animate-beat border-accent bg-accent text-on-accent",
                on && !audible && "border-accent text-accent",
                !on && "text-muted",
              )}
            >
              {b + 1}
            </li>
          );
        })}
      </ol>

      <Slider value={[bpm]} min={min} max={max} step={1} onValueChange={([v]) => set(v)} thumbLabels={[s.bpm]} />

      <div className="flex items-stretch gap-2">
        <PlayButton
          playing={playing}
          onClick={() => onPlayingChange(!playing)}
          playLabel={s.start}
          pauseLabel={s.stop}
          showLabel
          size="lg"
          className="flex-1 rounded-sm text-lg"
        />
        <button
          type="button"
          onClick={tap}
          aria-label={s.tap}
          title={s.tapHint}
          className="relative inline-flex h-13 min-w-24 items-center justify-center gap-2 overflow-hidden rounded-sm border border-line-strong bg-surface-2 px-4 font-semibold text-fg shadow-knob focus-ring active:translate-y-px"
        >
          <Hand key={tapFlash} className={cn("size-5", tapFlash > 0 && "animate-beat")} aria-hidden />
          <span>Tap</span>
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
        <span className="panel-label text-muted">{s.signature}</span>
        <ToggleGroup
          type="single"
          value={timeSignature}
          onValueChange={(v) => v && onTimeSignatureChange(v as TimeSignature)}
          aria-label={s.signature}
          className="w-full"
        >
          {SIGNATURES.map((ts) => (
            <ToggleGroupItem key={ts} value={ts} className="font-mono">
              {ts}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <span className="panel-label text-muted">{s.clickMode}</span>
        <ToggleGroup
          type="single"
          value={clickMode}
          onValueChange={(v) => v && onClickModeChange(v as ClickMode)}
          aria-label={s.clickMode}
          size="sm"
          className="grid w-full grid-cols-2 sm:flex"
        >
          {(Object.keys(s.modes) as ClickMode[]).map((m) => (
            <ToggleGroupItem key={m} value={m} className="h-10">
              {s.modes[m]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </Panel>
  );
}
