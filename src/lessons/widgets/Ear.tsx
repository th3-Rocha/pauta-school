// Treinos de ouvido. Cada tipo gera uma pergunta e sabe tocar o som dela.
import * as React from "react";
import { EarTrainer, type EarOption } from "../../components/music/EarTrainer";
import { L } from "../../i18n";
import { STANDARD_TUNING } from "../../lib/music";
import { audio, pluck, strum, tick } from "../../app/audio";
import { chordMidis, chordName } from "../chords";
import { chordVoicing, pcName, romanToChord, SCALES } from "../../lib/harmony";
import type { EarKind } from "../types";

type Question = { answer: string; play: () => number /* duração em ms */ };
type Kind = { question: string; options: (chords?: string[]) => EarOption[]; make: (chords?: string[]) => Question };

/* ── tabelas para os treinos novos ── */
export const INTERVALS: Record<string, { semis: number; pt: string; en: string; ref?: string }> = {
  "2m": { semis: 1, pt: "2ª menor", en: "minor 2nd", ref: "tubarão" },
  "2M": { semis: 2, pt: "2ª maior", en: "major 2nd", ref: "parabéns pra você" },
  "3m": { semis: 3, pt: "3ª menor", en: "minor 3rd" },
  "3M": { semis: 4, pt: "3ª maior", en: "major 3rd" },
  "4J": { semis: 5, pt: "4ª justa", en: "perfect 4th", ref: "marcha nupcial" },
  TT: { semis: 6, pt: "trítono", en: "tritone" },
  "5J": { semis: 7, pt: "5ª justa", en: "perfect 5th", ref: "brilha, brilha estrelinha" },
  "6m": { semis: 8, pt: "6ª menor", en: "minor 6th" },
  "6M": { semis: 9, pt: "6ª maior", en: "major 6th" },
  "7m": { semis: 10, pt: "7ª menor", en: "minor 7th" },
  "7M": { semis: 11, pt: "7ª maior", en: "major 7th" },
  "8J": { semis: 12, pt: "oitava", en: "octave" },
};

export const QUALITY_NAMES: Record<string, [string, string]> = {
  "": ["maior", "major"],
  m: ["menor", "minor"],
  dim: ["diminuto", "diminished"],
  aug: ["aumentado", "augmented"],
  sus2: ["sus2", "sus2"],
  sus4: ["sus4", "sus4"],
  maj7: ["7M (maj7)", "maj7"],
  m7: ["m7", "m7"],
  "7": ["7 (dominante)", "7 (dominant)"],
  m7b5: ["m7(b5)", "m7♭5"],
  dim7: ["°7", "dim7"],
  "6": ["6", "6"],
  m6: ["m6", "m6"],
  "9": ["9", "9"],
  "7alt": ["7alt", "7alt"],
  "m(maj7)": ["m(7M)", "m(maj7)"],
};

export const SCALE_NAMES: Record<string, [string, string]> = {
  major: ["maior", "major"],
  minor: ["menor natural", "natural minor"],
  pentaMinor: ["pentatônica menor", "minor pentatonic"],
  pentaMajor: ["pentatônica maior", "major pentatonic"],
  blues: ["blues", "blues"],
  ionian: ["jônio", "Ionian"],
  dorian: ["dórico", "Dorian"],
  phrygian: ["frígio", "Phrygian"],
  lydian: ["lídio", "Lydian"],
  mixolydian: ["mixolídio", "Mixolydian"],
  aeolian: ["eólio", "Aeolian"],
  locrian: ["lócrio", "Locrian"],
  harmonicMinor: ["menor harmônica", "harmonic minor"],
  melodicMinor: ["menor melódica", "melodic minor"],
  phrygianDominant: ["frígio dominante", "Phrygian dominant"],
  lydianDominant: ["lídio b7", "Lydian dominant"],
  altered: ["alterada", "altered"],
  wholeTone: ["tons inteiros", "whole tone"],
  dimHalfWhole: ["diminuta (st)", "half-whole diminished"],
};

const chordOf = (symbol: string) => chordVoicing(symbol);

function playChords(symbols: string[], each = 1100) {
  symbols.forEach((c, i) => window.setTimeout(() => strum(chordOf(c), { gain: 0.5, dur: each / 1000 }), i * each));
  return symbols.length * each + 400;
}

const rnd = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(xs: T[]) => xs[rnd(xs.length)];

const twoNotes = (a: number, b: number, gap = 900) => () => {
  pluck(a, { dur: gap / 1000 });
  window.setTimeout(() => pluck(b, { dur: 1.1 }), gap);
  return gap + 1200;
};

const KINDS: Record<EarKind, Kind> = {
  interval: {
    get question() {
      return L("Qual é o intervalo entre as duas notas?", "What is the interval between the two notes?");
    },
    options: (opts = ["3m", "3M", "5J", "8J"]) => opts.map((o) => ({ id: o, label: L(INTERVALS[o].pt, INTERVALS[o].en), hint: INTERVALS[o].ref && L(INTERVALS[o].ref!, "") || undefined })),
    make: (opts = ["3m", "3M", "5J", "8J"]) => {
      const id = pick(opts);
      const base = 48 + rnd(12);
      return { answer: id, play: twoNotes(base, base + INTERVALS[id].semis) };
    },
  },
  "interval-harmonic": {
    get question() {
      return L("As duas notas soaram juntas. Qual é o intervalo?", "The two notes sounded together. What is the interval?");
    },
    options: (opts = ["3m", "3M", "5J", "8J"]) => opts.map((o) => ({ id: o, label: L(INTERVALS[o].pt, INTERVALS[o].en) })),
    make: (opts = ["3m", "3M", "5J", "8J"]) => {
      const id = pick(opts);
      const base = 48 + rnd(12);
      return {
        answer: id,
        play: () => {
          pluck(base, { dur: 1.6 });
          pluck(base + INTERVALS[id].semis, { dur: 1.6 });
          return 1800;
        },
      };
    },
  },
  quality: {
    get question() {
      return L("Qual é o tipo deste acorde?", "What kind of chord is this?");
    },
    options: (opts = ["", "m"]) => opts.map((o) => ({ id: o || "maj", label: L(QUALITY_NAMES[o]?.[0] ?? o, QUALITY_NAMES[o]?.[1] ?? o) })),
    make: (opts = ["", "m"]) => {
      const q = pick(opts);
      const root = pcName(rnd(12));
      const ms = chordOf(root + q);
      return {
        answer: q || "maj",
        play: () => {
          strum(ms, { gain: 0.55, dur: 1.4 });
          window.setTimeout(() => ms.forEach((m, i) => window.setTimeout(() => pluck(m, { gain: 0.45 }), i * 170)), 1500);
          return 1500 + ms.length * 170 + 1200;
        },
      };
    },
  },
  progression: {
    get question() {
      return L("Qual progressão tocou?", "Which progression was played?");
    },
    options: (opts = ["I IV V I", "I V vi IV"]) => opts.map((o) => ({ id: o, label: o.split(" ").join(" – ") })),
    make: (opts = ["I IV V I", "I V vi IV"]) => {
      const id = pick(opts);
      const key = pick([0, 2, 7, 9, 5]);
      return { answer: id, play: () => playChords(id.split(" ").map((r) => romanToChord(r, key))) };
    },
  },
  scale: {
    get question() {
      return L("Que escala (ou modo) é esta? Ouça a nota de fundo e o caráter.", "Which scale (or mode) is this? Listen to the bass note and the color.");
    },
    options: (opts = ["major", "minor"]) => opts.map((o) => ({ id: o, label: L(SCALE_NAMES[o]?.[0] ?? o, SCALE_NAMES[o]?.[1] ?? o) })),
    make: (opts = ["major", "minor"]) => {
      const id = pick(opts);
      const root = 52 + rnd(7);
      const steps = [...SCALES[id], 12];
      return {
        answer: id,
        play: () => {
          pluck(root - 12, { dur: steps.length * 0.32 + 0.6, gain: 0.45 });
          steps.forEach((st, i) => pluck(root + st, { when: audio().currentTime + 0.05 + i * 0.32, dur: 0.3, gain: 0.55 }));
          return steps.length * 320 + 700;
        },
      };
    },
  },
  degree: {
    get question() {
      return L("Depois da cadência, que grau da escala tocou?", "After the cadence, which scale degree was played?");
    },
    options: (opts = ["1", "3", "5"]) => opts.map((o) => ({ id: o, label: o })),
    make: (opts = ["1", "3", "5"]) => {
      const id = pick(opts);
      const key = pick([0, 2, 7, 9, 4]);
      const steps = [0, 2, 4, 5, 7, 9, 11];
      const note = 55 + ((key + steps[Number(id) - 1] - 7 + 12) % 12);
      return {
        answer: id,
        play: () => {
          const ms = playChords(["I", "IV", "V", "I"].map((r) => romanToChord(r, key)), 700);
          window.setTimeout(() => pluck(note, { dur: 1.4, gain: 0.7 }), ms);
          return ms + 1500;
        },
      };
    },
  },
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
    options: (chords = ["Em", "Am", "D"]) => chords.map((c) => ({ id: c, label: chordName(c) })),
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

export function Ear({ kind, chords: chordList, options }: { kind: EarKind; chords?: string[]; options?: string[] }) {
  const k = KINDS[kind];
  const chords = options ?? chordList;
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
