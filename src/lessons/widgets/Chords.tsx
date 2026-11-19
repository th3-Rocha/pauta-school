import * as React from "react";
import { L } from "../../i18n";
import { Minus, Plus, Volume2 } from "lucide-react";
import { ChordDiagram } from "../../components/music/ChordDiagram";
import { RhythmSlashes } from "../../components/music/RhythmSlashes";
import { PlayButton, LedToggle } from "../../components/music/controls";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/cn";
import { STANDARD_TUNING } from "../../lib/music";
import { mutedStrum, pluck, strum, tick } from "../../app/audio";
import { getLocale } from "../../i18n";
import { chordBarre, chordLabel, chordMidis, chordName, chordPositions, hasDiagram } from "../chords";
import { swingTime } from "./tabSound";

const label = (k: string) => chordLabel(k, getLocale() === "en");
import type { Stroke, TabNote } from "../types";
import { runSequence, type SeqEvent } from "./seq";

/* ─────────── Cartões de acorde ─────────── */

export function ChordCards({ chords }: { chords: string[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {chords.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2 rounded-md border border-line bg-surface-2 p-3">
          {hasDiagram(name) ? (
            <ChordDiagram name={chordName(name)} positions={chordPositions(name)} barre={chordBarre(name)} size="md" />
          ) : (
            <span className="font-display text-4xl font-bold">{chordName(name)}</span>
          )}
          <p className="max-w-40 text-center text-sm text-muted">{label(name)}</p>
          <div className="flex gap-1.5">
            <Button size="sm" variant="secondary" onClick={() => strum(chordMidis(name), { gain: 0.6 })}>
              <Volume2 aria-hidden />
              {L("Batida", "Strum")}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const ms = chordMidis(name);
                ms.forEach((m, i) => window.setTimeout(() => pluck(m, { gain: 0.55 }), i * 280));
              }}
            >
              {L("Corda por corda", "String by string")}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────── BPM -/+ ─────────── */

export function BpmControl({ bpm, onChange, min = 40, max = 160 }: { bpm: number; onChange: (b: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Andamento">
      <Button size="icon" variant="secondary" aria-label={L("Diminuir 5 BPM", "Slower by 5 BPM")} onClick={() => onChange(Math.max(min, bpm - 5))}>
        <Minus aria-hidden />
      </Button>
      <span className="w-20 text-center font-mono text-lg font-bold text-fg" aria-live="polite">
        {bpm} <span className="text-xs text-muted">BPM</span>
      </span>
      <Button size="icon" variant="secondary" aria-label={L("Aumentar 5 BPM", "Faster by 5 BPM")} onClick={() => onChange(Math.min(max, bpm + 5))}>
        <Plus aria-hidden />
      </Button>
    </div>
  );
}

/* ─────────── Trocas de acorde no pulso ─────────── */

export function ChordChanger({ chords, beats, bpm: initialBpm, title }: { chords: string[]; beats: number; bpm: number; title?: string }) {
  const [bpm, setBpm] = React.useState(initialBpm);
  const [playing, setPlaying] = React.useState(false);
  const [example, setExample] = React.useState(false);
  const [pos, setPos] = React.useState<{ chord: number; beat: number }>({ chord: 0, beat: -1 });
  const stopRef = React.useRef<(() => void) | null>(null);
  React.useEffect(() => () => stopRef.current?.(), []);

  const stop = () => {
    stopRef.current?.();
    stopRef.current = null;
    setPlaying(false);
    setPos({ chord: 0, beat: -1 });
  };
  const start = () => {
    const spb = 60 / bpm;
    const ev: SeqEvent[] = [];
    chords.forEach((name, ci) => {
      for (let b = 0; b < beats; b++) {
        const t = (ci * beats + b) * spb;
        ev.push({
          t,
          sound: (w) => {
            tick(w, b === 0);
            if (example) strum(chordMidis(name), { when: w, gain: 0.45, dur: spb * 0.9 });
          },
          ui: () => setPos({ chord: ci, beat: b }),
        });
      }
    });
    stopRef.current = runSequence(ev, chords.length * beats * spb, { loop: true });
    setPlaying(true);
  };
  // muda andamento/modo: reinicia
  React.useEffect(() => {
    if (playing) {
      stopRef.current?.();
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, example]);

  const cur = chords[pos.chord];
  const next = chords[(pos.chord + 1) % chords.length];
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 shadow-md sm:p-5" aria-label={title ?? L("Trocas de acorde", "Chord changes")}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="panel-label text-muted">{title ?? L("Trocas no pulso", "Changes in time")}</h3>
        <p className="font-mono text-sm text-muted">
          {chords.map(chordName).join(" → ")} · {beats} {L("tempos cada", "beats each")}
        </p>
      </header>
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="font-display text-6xl font-extrabold leading-none text-fg sm:text-7xl">{chordName(cur)}</span>
            <span className="mt-1 text-sm text-muted">{label(cur)}</span>
          </div>
          {hasDiagram(cur) && <ChordDiagram name={chordName(cur)} positions={chordPositions(cur)} barre={chordBarre(cur)} size="sm" className="hidden sm:block" />}
        </div>
        <div className="flex flex-col items-center gap-1 rounded-md border border-line bg-surface-2 px-3 py-2">
          <span className="panel-label text-muted">{L("Próximo", "Next")}</span>
          <span className="font-display text-3xl font-bold text-muted">{chordName(next)}</span>
        </div>
      </div>
      <div className="flex gap-2" aria-hidden>
        {Array.from({ length: beats }, (_, b) => (
          <span
            key={b}
            className={cn(
              "h-3 flex-1 rounded-full transition-colors duration-75",
              pos.beat === b ? (b === 0 ? "bg-accent" : "bg-fg") : "bg-surface-2",
              pos.beat === beats - 1 && b === beats - 1 && "bg-warn",
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <PlayButton playing={playing} playLabel={L("Começar", "Start")} pauseLabel={L("Parar", "Stop")} showLabel onClick={() => (playing ? stop() : start())} />
        <BpmControl bpm={bpm} onChange={setBpm} />
        <LedToggle pressed={example} onPressedChange={setExample}>
          {L("Ouvir exemplo", "Play example")}
        </LedToggle>
      </div>
      <p className="text-sm text-muted">{L("O último tempo de cada acorde fica amarelo: é a hora de começar a trocar.", "The last beat of each chord turns yellow: time to start changing.")}</p>
    </section>
  );
}

/* ─────────── Batida (levada) com cifra ─────────── */

export function StrumPattern({
  title,
  bpm: initialBpm,
  measures,
  melody,
  beats = 4,
  swing = false,
}: {
  title?: string;
  bpm: number;
  measures: { chord: string; strokes: Stroke[] }[];
  melody?: TabNote[];
  beats?: number;
  swing?: boolean;
}) {
  const [bpm, setBpm] = React.useState(initialBpm);
  const [playing, setPlaying] = React.useState(false);
  const [example, setExample] = React.useState(!melody);
  const [pos, setPos] = React.useState({ m: -1, b: -1 });
  const stopRef = React.useRef<(() => void) | null>(null);
  React.useEffect(() => () => stopRef.current?.(), []);
  const perBar = beats;
  const sw = (t: number) => (swing ? swingTime(t) : t);

  const stop = () => {
    stopRef.current?.();
    stopRef.current = null;
    setPlaying(false);
    setPos({ m: -1, b: -1 });
  };
  const start = () => {
    const spb = 60 / bpm;
    const pre = perBar;
    const ev: SeqEvent[] = [];
    for (let b = 0; b < pre; b++) ev.push({ t: b * spb, sound: (w) => tick(w, b === 0) });
    measures.forEach((m, mi) => {
      const sub = m.strokes.length / perBar; // batidas por tempo
      for (let b = 0; b < perBar; b++) {
        const t = (pre + mi * perBar + b) * spb;
        ev.push({ t, sound: (w) => tick(w, b === 0), ui: () => setPos({ m: mi, b }) });
      }
      m.strokes.forEach((s, k) => {
        if (!example || (s !== "down" && s !== "up" && s !== "hit")) return;
        const t = (pre + mi * perBar + sw(k / sub)) * spb;
        if (s === "hit") ev.push({ t, sound: (w) => mutedStrum(w) });
        else ev.push({ t, sound: (w) => strum(chordMidis(m.chord), { when: w, down: s === "down", gain: s === "down" ? 0.5 : 0.35, dur: spb / sub }) });
      });
    });
    if (melody) {
      let t = 0;
      for (const n of melody) {
        if ("s" in n) {
          const at = (pre + sw(t)) * spb;
          const dur = n.d * spb * 0.95;
          ev.push({ t: at, sound: (w) => pluck(STANDARD_TUNING[n.s - 1] + n.f, { when: w, gain: 0.7, dur }) });
        }
        t += n.d;
      }
    }
    stopRef.current = runSequence(ev, (pre + measures.length * perBar) * spb, { onEnd: stop });
    setPlaying(true);
  };

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 shadow-md sm:p-5" aria-label={title ?? L("Levada", "Strumming")}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="panel-label text-muted">{title ?? L("Levada", "Strumming")}</h3>
        <span className="text-sm text-muted">{L("↓ para baixo · ↑ para cima · ✕ abafado", "↓ down · ↑ up · ✕ muted")}{swing ? " · swing" : ""}</span>
      </header>
      <RhythmSlashes measures={measures.map((m) => ({ chord: chordName(m.chord), strokes: m.strokes }))} beatsPerMeasure={perBar} currentMeasure={pos.m} currentBeat={pos.b} perRow={4} />
      <div className="flex flex-wrap items-center gap-3">
        <PlayButton playing={playing} playLabel={L("Tocar", "Play")} pauseLabel={L("Parar", "Stop")} showLabel onClick={() => (playing ? stop() : start())} />
        <BpmControl bpm={bpm} onChange={(b) => !playing && setBpm(b)} />
        <LedToggle pressed={example} onPressedChange={(v) => !playing && setExample(v)}>
          {melody ? L("Tocar os acordes também", "Play the chords too") : L("Ouvir exemplo", "Play example")}
        </LedToggle>
      </div>
      {melody && <p className="text-sm text-muted">{L("O app toca a melodia. Você faz os acordes, no pulso do clique.", "The app plays the melody. You play the chords, on the click.")}</p>}
    </section>
  );
}
