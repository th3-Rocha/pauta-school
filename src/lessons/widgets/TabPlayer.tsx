// Tablatura com ritmo embaixo, tocável. A moldura (controles) é o ScoreFrame do design system.
import * as React from "react";
import { ScoreFrame } from "../../components/music/ScoreFrame";
import { STANDARD_TUNING } from "../../lib/music";
import { pluck, strum, tick } from "../../app/audio";
import { chordMidis, CHORDS } from "../chords";
import type { TabNote } from "../types";
import { runSequence, type SeqEvent } from "./seq";

type Placed = { note: TabNote; start: number; measure: number };

function place(notes: TabNote[], perMeasure: number): { placed: Placed[]; measures: number } {
  let t = 0;
  const placed = notes.map((note) => {
    const p = { note, start: t, measure: Math.floor(t / perMeasure + 1e-6) };
    t += note.d;
    return p;
  });
  return { placed, measures: Math.ceil(t / perMeasure - 1e-6) };
}

const LINE = 13; // distância entre as linhas da tablatura
const TOP = 26;
const RHYTHM_Y = TOP + LINE * 5 + 30;
const ROW_H = RHYTHM_Y + 26;

/** Figura rítmica desenhada embaixo da nota (haste para cima). */
function Figure({ x, d, rest }: { x: number; d: number; rest?: boolean }) {
  const y = RHYTHM_Y;
  const ink = "var(--fg)";
  if (rest) {
    if (d >= 4) return <rect x={x - 6} y={y - 10} width={12} height={5} fill={ink} />;
    if (d >= 2) return <rect x={x - 6} y={y - 5} width={12} height={5} fill={ink} />;
    return <path d={`M${x - 2} ${y - 16} l5 6 l-5 5 l5 6 l-6 -2 l2 4`} stroke={ink} strokeWidth={2} fill="none" />;
  }
  const hollow = d >= 2;
  const dotted = d === 3 || d === 1.5;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={5.5} ry={4} transform={`rotate(-20 ${x} ${y})`} fill={hollow ? "none" : ink} stroke={ink} strokeWidth={1.6} />
      {d < 4 && <line x1={x + 5} y1={y - 1} x2={x + 5} y2={y - 22} stroke={ink} strokeWidth={1.6} />}
      {d === 0.5 && <path d={`M${x + 5} ${y - 22} q7 5 4 12`} stroke={ink} strokeWidth={1.6} fill="none" />}
      {dotted && <circle cx={x + 10} cy={y} r={1.8} fill={ink} />}
    </g>
  );
}

export function TabStaff({
  notes,
  beatsPerMeasure = 4,
  active = -1,
  width,
}: {
  notes: TabNote[];
  beatsPerMeasure?: number;
  active?: number;
  width: number;
}) {
  const { placed, measures } = place(notes, beatsPerMeasure);
  const perRow = width < 520 ? 1 : width < 860 ? 2 : 4;
  const rows = Math.ceil(measures / perRow);
  const left = 22;
  const mW = (width - left - 4) / perRow;
  const beatW = mW / beatsPerMeasure;
  const H = rows * ROW_H + 6;
  const posOf = (p: Placed) => {
    const row = Math.floor(p.measure / perRow);
    const col = p.measure % perRow;
    const inMeasure = p.start - p.measure * beatsPerMeasure;
    return { x: left + col * mW + inMeasure * beatW + beatW * 0.5, y0: row * ROW_H };
  };

  return (
    <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} role="img" aria-label="Tablatura" className="block">
      {Array.from({ length: rows }, (_, r) => {
        const y0 = r * ROW_H;
        const inRow = Math.min(perRow, measures - r * perRow);
        const right = left + inRow * mW;
        return (
          <g key={r}>
            <text x={2} y={y0 + TOP + LINE * 1.2} className="fill-muted font-mono text-[11px] font-bold">T</text>
            <text x={2} y={y0 + TOP + LINE * 2.6} className="fill-muted font-mono text-[11px] font-bold">A</text>
            <text x={2} y={y0 + TOP + LINE * 4} className="fill-muted font-mono text-[11px] font-bold">B</text>
            {Array.from({ length: 6 }, (_, i) => (
              <line key={i} x1={left} x2={right} y1={y0 + TOP + i * LINE} y2={y0 + TOP + i * LINE} stroke="var(--line-strong)" strokeWidth={1} />
            ))}
            {Array.from({ length: inRow + 1 }, (_, i) => (
              <line key={i} x1={left + i * mW} x2={left + i * mW} y1={y0 + TOP} y2={y0 + TOP + 5 * LINE} stroke="var(--line-strong)" strokeWidth={i === inRow && r === rows - 1 ? 3 : 1.2} />
            ))}
            {Array.from({ length: inRow }, (_, i) => (
              <text key={i} x={left + i * mW + 3} y={y0 + 12} className="fill-muted font-mono text-[10px]">
                {r * perRow + i + 1}
              </text>
            ))}
          </g>
        );
      })}
      {placed.map((p, i) => {
        const { x, y0 } = posOf(p);
        const on = i === active;
        const n = p.note;
        const frets: { s: number; f: number }[] =
          "s" in n ? [{ s: n.s, f: n.f }] : "chord" in n ? [...CHORDS[n.chord].shape].map((c, k) => ({ s: 6 - k, f: c === "x" ? -1 : Number(c) })).filter((q) => q.f >= 0) : [];
        return (
          <g key={i}>
            {on && <rect x={x - 11} y={y0 + TOP - 9} width={22} height={LINE * 5 + 18} rx={4} fill="var(--accent-soft)" />}
            {"chord" in n && (
              <text x={x} y={y0 + TOP - 8} textAnchor="middle" className="fill-fg font-mono text-[11px] font-bold">
                {n.chord}
              </text>
            )}
            {frets.map((q) => (
              <g key={q.s}>
                <rect x={x - 7} y={y0 + TOP + (q.s - 1) * LINE - 7} width={14} height={14} fill={on ? "var(--accent-soft)" : "var(--surface)"} />
                <text
                  x={x}
                  y={y0 + TOP + (q.s - 1) * LINE + 4.5}
                  textAnchor="middle"
                  className={on ? "fill-accent font-mono text-[13px] font-bold" : "fill-fg font-mono text-[13px] font-bold"}
                >
                  {q.f}
                </text>
              </g>
            ))}
            <g transform={`translate(0 ${y0})`}>
              <Figure x={x} d={n.d} rest={"rest" in n} />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

function useWidth(ref: React.RefObject<HTMLElement | null>) {
  const [w, setW] = React.useState(640);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

export function TabPlayer({ title, bpm, notes, beatsPerMeasure = 4 }: { title?: string; bpm: number; notes: TabNote[]; beatsPerMeasure?: number }) {
  const box = React.useRef<HTMLDivElement>(null);
  const width = useWidth(box);
  const [playing, setPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState(100);
  const [loop, setLoop] = React.useState(false);
  const [metro, setMetro] = React.useState(true);
  const [countIn, setCountIn] = React.useState(true);
  const [active, setActive] = React.useState(-1);
  const stopRef = React.useRef<(() => void) | null>(null);
  const { measures } = place(notes, beatsPerMeasure);

  React.useEffect(() => () => stopRef.current?.(), []);

  const stop = () => {
    stopRef.current?.();
    stopRef.current = null;
    setPlaying(false);
    setActive(-1);
  };

  const start = () => {
    const spb = 60 / ((bpm * speed) / 100);
    const pre = countIn ? beatsPerMeasure : 0;
    const ev: SeqEvent[] = [];
    for (let b = 0; b < pre; b++) ev.push({ t: b * spb, sound: (w) => tick(w, b === 0) });
    const total = measures * beatsPerMeasure;
    if (metro) for (let b = 0; b < total; b++) ev.push({ t: (pre + b) * spb, sound: (w) => tick(w, b % beatsPerMeasure === 0) });
    let t = 0;
    notes.forEach((n, i) => {
      const at = (pre + t) * spb;
      const dur = n.d * spb * 0.95;
      if ("s" in n) ev.push({ t: at, sound: (w) => pluck(STANDARD_TUNING[n.s - 1] + n.f, { when: w, dur }), ui: () => setActive(i) });
      else if ("chord" in n) ev.push({ t: at, sound: (w) => strum(chordMidis(n.chord), { when: w, dur }), ui: () => setActive(i) });
      else ev.push({ t: at, ui: () => setActive(i) });
      t += n.d;
    });
    stopRef.current = runSequence(ev, (pre + total) * spb, { loop, onEnd: stop });
    setPlaying(true);
  };

  return (
    <ScoreFrame
      title={title}
      subtitle={`${bpm} BPM · ${measures} ${measures === 1 ? "compasso" : "compassos"}`}
      playing={playing}
      onPlayPause={() => (playing ? stop() : start())}
      speed={speed}
      onSpeedChange={setSpeed}
      loop={loop}
      onLoopChange={setLoop}
      metronome={metro}
      onMetronomeChange={setMetro}
      countIn={countIn}
      onCountInChange={setCountIn}
      minHeight={0}
    >
      <div ref={box} className="w-full">
        <TabStaff notes={notes} beatsPerMeasure={beatsPerMeasure} active={active} width={width} />
      </div>
    </ScoreFrame>
  );
}
