// Treinos de ouvido. Cada tipo gera uma pergunta e sabe tocar o som dela.
import * as React from "react";
import { EarTrainer, type EarOption } from "../../components/music/EarTrainer";
import { L } from "../../i18n";
import { STANDARD_TUNING } from "../../lib/music";
import { audio, pluck, strum, tick } from "../../app/audio";
import { chordMidis } from "../chords";
import type { EarKind } from "../types";

type Question = { answer: string; play: () => number /* duração em ms */ };
type Kind = { question: string; options: (chords?: string[]) => EarOption[]; make: (chords?: string[]) => Question };

const rnd = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(xs: T[]) => xs[rnd(xs.length)];

const twoNotes = (a: number, b: number, gap = 900) => () => {
  pluck(a, { dur: gap / 1000 });
  window.setTimeout(() => pluck(b, { dur: 1.1 }), gap);
  return gap + 1200;
};

const KINDS: Record<EarKind, Kind> = {
  "highlow-strings": {
    get question() {
      return L("A segunda nota foi mais aguda ou mais grave que a primeira?", "Was the second note higher or lower than the first?");
    },
    options: () => [
      { id: "aguda", label: L("Mais aguda", "Higher"), hint: L("mais fina, mais alta", "thinner, brighter") },
      { id: "grave", label: L("Mais grave", "Lower"), hint: L("mais grossa, mais baixa", "thicker, deeper") },
    ],
    make: () => {
      const a = rnd(6);
      let b = a;
      while (b === a) b = rnd(6);
      const ma = STANDARD_TUNING[a];
      const mb = STANDARD_TUNING[b];
      return { answer: mb > ma ? "aguda" : "grave", play: twoNotes(ma, mb) };
    },
  },
  "highlow-close": {
    get question() {
      return L("Agora as notas são vizinhas. A segunda subiu ou desceu?", "Now the notes are neighbors. Did the second go up or down?");
    },
    options: () => [
      { id: "aguda", label: L("Subiu", "Up"), hint: L("ficou mais aguda", "got higher") },
      { id: "grave", label: L("Desceu", "Down"), hint: L("ficou mais grave", "got lower") },
    ],
    make: () => {
      const base = STANDARD_TUNING[pick([1, 2, 3])] + 2 + rnd(3);
      const step = (1 + rnd(3)) * (Math.random() < 0.5 ? 1 : -1);
      return { answer: step > 0 ? "aguda" : "grave", play: twoNotes(base, base + step) };
    },
  },
  "same-diff": {
    get question() {
      return L("As duas notas são iguais ou diferentes?", "Are the two notes the same or different?");
    },
    options: () => [
      { id: "igual", label: L("Iguais", "Same") },
      { id: "diferente", label: L("Diferentes", "Different") },
    ],
    make: () => {
      const base = 52 + rnd(12);
      const same = Math.random() < 0.45;
      const other = base + (same ? 0 : pick([-2, -1, 1, 2]));
      return { answer: same ? "igual" : "diferente", play: twoNotes(base, other) };
    },
  },
  duration: {
    get question() {
      return L("O metrônomo conta 4 tempos. Quantos tempos a nota durou?", "The metronome counts 4 beats. How many beats did the note last?");
    },
    options: () => [
      { id: "1", label: L("1 tempo", "1 beat"), hint: L("semínima", "quarter note") },
      { id: "2", label: L("2 tempos", "2 beats"), hint: L("mínima", "half note") },
      { id: "4", label: L("4 tempos", "4 beats"), hint: L("semibreve", "whole note") },
    ],
    make: () => {
      const d = pick([1, 2, 4]);
      return {
        answer: String(d),
        play: () => {
          const c = audio();
          const spb = 60 / 72;
          const t0 = c.currentTime + 0.1;
          for (let b = 0; b < 8; b++) tick(t0 + b * spb, b % 4 === 0);
          pluck(pick([57, 59, 60, 62]), { when: t0 + 4 * spb, dur: d * spb * 0.95, gain: 0.7 });
          return 8 * spb * 1000 + 300;
        },
      };
    },
  },
  "major-minor": {
    get question() {
      return L("Esse acorde soa maior (aberto, alegre) ou menor (fechado, triste)?", "Does this chord sound major (open, happy) or minor (closed, sad)?");
    },
    options: () => [
      { id: "maior", label: L("Maior", "Major"), hint: L("aberto, alegre", "open, happy") },
      { id: "menor", label: L("Menor", "Minor"), hint: L("fechado, triste", "closed, sad") },
    ],
    make: () => {
      const [maj, min] = pick([
        ["A", "Am"],
        ["E", "Em"],
        ["D", "Dm"],
      ]);
      const isMaj = Math.random() < 0.5;
      const name = isMaj ? maj : min;
      return {
        answer: isMaj ? "maior" : "menor",
        play: () => {
          strum(chordMidis(name), { gain: 0.6 });
          window.setTimeout(() => chordMidis(name).forEach((m, i) => window.setTimeout(() => pluck(m, { gain: 0.45 }), i * 160)), 1300);
          return 2600;
        },
      };
    },
  },
  "which-chord": {
    get question() {
      return L("Qual acorde tocou?", "Which chord was played?");
    },
    options: (chords = ["Em", "Am", "D"]) => chords.map((c) => ({ id: c, label: c })),
    make: (chords = ["Em", "Am", "D"]) => {
      const name = pick(chords);
      return {
        answer: name,
        play: () => {
          strum(chordMidis(name), { gain: 0.6 });
          return 1500;
        },
      };
    },
  },
};

export function Ear({ kind, chords }: { kind: EarKind; chords?: string[] }) {
  const k = KINDS[kind];
  const [q, setQ] = React.useState<Question>(() => k.make(chords));
  const [status, setStatus] = React.useState<"asking" | "correct" | "wrong">("asking");
  const [selected, setSelected] = React.useState<string>();
  const [score, setScore] = React.useState({ correct: 0, total: 0 });
  const [replaying, setReplaying] = React.useState(false);

  const play = (question: Question) => {
    setReplaying(true);
    const ms = question.play();
    window.setTimeout(() => setReplaying(false), ms);
  };

  return (
    <EarTrainer
      question={k.question}
      options={k.options(chords)}
      status={status}
      selectedId={selected}
      correctId={status === "asking" ? undefined : q.answer}
      onAnswer={(id) => {
        setSelected(id);
        const ok = id === q.answer;
        setStatus(ok ? "correct" : "wrong");
        setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
      }}
      onReplay={() => play(q)}
      onNext={() => {
        const n = k.make(chords);
        setQ(n);
        setStatus("asking");
        setSelected(undefined);
        play(n);
      }}
      replaying={replaying}
      score={score}
    />
  );
}
