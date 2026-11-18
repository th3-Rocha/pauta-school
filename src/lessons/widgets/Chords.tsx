import * as React from "react";
import { Minus, Plus, Volume2 } from "lucide-react";
import { ChordDiagram } from "../../components/music/ChordDiagram";
import { RhythmSlashes } from "../../components/music/RhythmSlashes";
import { PlayButton, LedToggle } from "../../components/music/controls";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/cn";
import { STANDARD_TUNING } from "../../lib/music";
import { pluck, strum, tick } from "../../app/audio";
import { CHORDS, chordMidis, chordPositions } from "../chords";
import type { Stroke, TabNote } from "../types";
import { runSequence, type SeqEvent } from "./seq";

/* ─────────── Cartões de acorde ─────────── */

export function ChordCards({ chords }: { chords: string[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {chords.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2 rounded-md border border-line bg-surface-2 p-3">
          <ChordDiagram name={name} positions={chordPositions(name)} size="md" />
          <p className="text-sm text-muted">{CHORDS[name].label}</p>
          <div className="flex gap-1.5">
            <Button size="sm" variant="secondary" onClick={() => strum(chordMidis(name), { gain: 0.6 })}>
              <Volume2 aria-hidden />
              Batida
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const ms = chordMidis(name);
                ms.forEach((m, i) => window.setTimeout(() => pluck(m, { gain: 0.55 }), i * 280));
              }}
            >
              Corda por corda
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────── BPM -/+ ─────────── */

function BpmControl({ bpm, onChange, min = 40, max = 160 }: { bpm: number; onChange: (b: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Andamento">
      <Button size="icon" variant="secondary" aria-label="Diminuir 5 BPM" onClick={() => onChange(Math.max(min, bpm - 5))}>
        <Minus aria-hidden />
      </Button>
      <span className="w-20 text-center font-mono text-lg font-bold text-fg" aria-live="polite">
        {bpm} <span className="text-xs text-muted">BPM</span>
      </span>
      <Button size="icon" variant="secondary" aria-label="Aumentar 5 BPM" onClick={() => onChange(Math.min(max, bpm + 5))}>
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
    <section className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 shadow-md sm:p-5" aria-label={title ?? "Trocas de acorde"}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="panel-label text-muted">{title ?? "Trocas no pulso"}</h3>
        <p className="font-mono text-sm text-muted">
          {chords.join(" → ")} · {beats} tempos cada
        </p>
      </header>
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="font-display text-6xl font-extrabold leading-none text-fg sm:text-7xl">{cur}</span>
            <span className="mt-1 text-sm text-muted">{CHORDS[cur]?.label}</span>
          </div>
          <ChordDiagram name={cur} positions={chordPositions(cur)} size="sm" className="hidden sm:block" />
        </div>
        <div className="flex flex-col items-center gap-1 rounded-md border border-line bg-surface-2 px-3 py-2">
          <span className="panel-label text-muted">Próximo</span>
          <span className="font-display text-3xl font-bold text-muted">{next}</span>
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
        <PlayButton playing={playing} playLabel="Começar" pauseLabel="Parar" showLabel onClick={() => (playing ? stop() : start())} />
        <BpmControl bpm={bpm} onChange={setBpm} />
        <LedToggle pressed={example} onPressedChange={setExample}>
          Ouvir exemplo
        </LedToggle>
      </div>
      <p className="text-sm text-muted">O último tempo de cada acorde fica amarelo: é a hora de começar a trocar.</p>
    </section>
  );
}

/* ─────────── Batida (levada) com cifra ─────────── */

export function StrumPattern({
  title,
  bpm: initialBpm,
  measures,
  melody,
}: {
  title?: string;
  bpm: number;
  measures: { chord: string; strokes: Stroke[] }[];
  melody?: TabNote[];
}) {
  const [bpm, setBpm] = React.useState(initialBpm);
  const [playing, setPlaying] = React.useState(false);
  const [example, setExample] = React.useState(!melody);
  const [pos, setPos] = React.useState({ m: -1, b: -1 });
  const stopRef = React.useRef<(() => void) | null>(null);
  React.useEffect(() => () => stopRef.current?.(), []);
  const perBar = 4;

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
        if (!example || (s !== "down" && s !== "up")) return;
        const t = (pre + mi * perBar + k / sub) * spb;
        ev.push({ t, sound: (w) => strum(chordMidis(m.chord), { when: w, down: s === "down", gain: s === "down" ? 0.5 : 0.35, dur: spb / sub }) });
      });
    });
    if (melody) {
      let t = 0;
      for (const n of melody) {
        if ("s" in n) {
          const at = (pre + t) * spb;
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
    <section className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 shadow-md sm:p-5" aria-label={title ?? "Levada"}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="panel-label text-muted">{title ?? "Levada"}</h3>
        <span className="text-sm text-muted">↓ para baixo · ↑ para cima · conta 4 antes de começar</span>
      </header>
      <RhythmSlashes measures={measures.map((m) => ({ chord: m.chord, strokes: m.strokes }))} beatsPerMeasure={perBar} currentMeasure={pos.m} currentBeat={pos.b} perRow={4} />
      <div className="flex flex-wrap items-center gap-3">
        <PlayButton playing={playing} playLabel="Tocar" pauseLabel="Parar" showLabel onClick={() => (playing ? stop() : start())} />
        <BpmControl bpm={bpm} onChange={(b) => !playing && setBpm(b)} />
        <LedToggle pressed={example} onPressedChange={(v) => !playing && setExample(v)}>
          {melody ? "Tocar os acordes também" : "Ouvir exemplo"}
        </LedToggle>
      </div>
      {melody && <p className="text-sm text-muted">O app toca a melodia. Você faz os acordes, no pulso do clique.</p>}
    </section>
  );
}
