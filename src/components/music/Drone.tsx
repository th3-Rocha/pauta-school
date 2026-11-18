// src/components/music/Drone.tsx
import { Power } from "lucide-react";
import { cn } from "../../lib/cn";
import { midiToName, type NoteNaming } from "../../lib/music";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { ToggleGroup, ToggleGroupItem } from "../ui/ToggleGroup";
import { Panel } from "./controls";

export type DroneProps = {
  /** Classe de altura 0–11 (0 = C). */
  note: number;
  onNoteChange: (note: number) => void;
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  naming?: NoteNaming;
  strings?: Partial<Strings["drone"]>;
  className?: string;
};

export function Drone({ note, onNoteChange, playing, onPlayingChange, naming = "sharp", strings: stringsOverride, className }: DroneProps) {
  const s = { ...defaultStrings.drone, ...stringsOverride };
  const name = midiToName(note, naming);
  return (
    <Panel
      label={s.label}
      data-slot="drone"
      className={cn("flex flex-col gap-4", className)}
      aside={
        <span className={cn("panel-label", playing ? "text-accent" : "text-muted")} aria-live="polite">
          {playing ? s.playing(name) : s.stopped}
        </span>
      }
    >
      <div className="flex items-center gap-4">
        <div className="relative flex size-20 shrink-0 items-center justify-center">
          {playing && (
            <>
              <span aria-hidden className="absolute inset-0 rounded-full border-2 border-accent animate-pulse-ring" />
              <span aria-hidden className="absolute inset-0 rounded-full border-2 border-accent animate-pulse-ring [animation-delay:0.8s]" />
            </>
          )}
          <span
            className={cn(
              "relative flex size-20 items-center justify-center rounded-full border-2 font-mono text-3xl font-bold",
              playing ? "border-accent bg-accent-soft text-fg" : "border-line-strong bg-surface-2 text-muted",
            )}
          >
            {name}
          </span>
        </div>
        <button
          type="button"
          aria-pressed={playing}
          onClick={() => onPlayingChange(!playing)}
          className={cn(
            "inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-sm px-4 text-lg font-semibold shadow-knob focus-ring active:translate-y-px",
            playing ? "bg-accent text-on-accent" : "border border-line-strong bg-surface-2 text-fg",
          )}
        >
          <Power className="size-5" aria-hidden />
          {playing ? s.off : s.on}
        </button>
      </div>
      <ToggleGroup
        type="single"
        value={String(note)}
        onValueChange={(v) => v && onNoteChange(Number(v))}
        aria-label={s.note}
        className="grid w-full grid-cols-6"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <ToggleGroupItem key={i} value={String(i)} className="min-w-0 px-0 font-mono" aria-label={midiToName(i, naming)}>
            {midiToName(i, naming)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Panel>
  );
}
