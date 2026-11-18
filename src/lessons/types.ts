// Formato de uma aula. Cada aula é só dados: texto + widgets interativos.
// O texto aceita **negrito**, *itálico* e `código`.

import type { MarkerKind } from "../components/music/markers";

export type Text = string;

/** Nota de tablatura. `s` = corda (1 aguda … 6 grave), `f` = casa, `d` = duração em tempos. */
export type TabNote =
  | { s: number; f: number; d: number }
  | { chord: string; d: number }
  | { rest: true; d: number };

export type Stroke = "down" | "up" | "rest" | null;

export type EarKind =
  | "highlow-strings" // duas cordas soltas: subiu ou desceu?
  | "highlow-close" // duas notas próximas na mesma corda
  | "same-diff" // mesma nota ou diferente?
  | "duration" // quantos tempos a nota durou?
  | "major-minor" // acorde maior ou menor?
  | "which-chord"; // qual destes acordes?

export type Node =
  | Text
  | { h: Text }
  | { list: Text[]; ordered?: boolean }
  | { callout: "dica" | "atencao" | "autoavaliacao" | "teoria"; text: Text | Text[]; title?: Text; label?: Text }
  | { w: "strings" }
  | { w: "letters" }
  | { w: "tuner" }
  | { w: "metronome"; bpm: number }
  | { w: "fretboard"; frets?: number; markers: { s: number; f: number; label?: string; kind?: MarkerKind }[]; caption?: Text }
  | { w: "chords"; chords: string[] }
  | { w: "changes"; chords: string[]; beats: number; bpm: number; title?: Text }
  | { w: "tab"; title?: Text; bpm: number; notes: TabNote[]; beatsPerMeasure?: number }
  | {
      w: "strum";
      title?: Text;
      bpm: number;
      /** Um compasso por item: acorde + batidas (uma por tempo). */
      measures: { chord: string; strokes: Stroke[] }[];
      /** Melodia que o app toca junto enquanto você acompanha. */
      melody?: TabNote[];
    }
  | { w: "selfcheck"; id: string; title?: Text; items: { id: string; label: Text; hint?: Text }[] }
  | { w: "ear"; kind: EarKind; chords?: string[] }
  | { w: "minute"; id: string; label: Text }
  | { w: "bpmlog"; month: number; target: number };

export type Block = { title?: Text; subtitle?: Text; minutes: number; body: Node[] };

export type Lesson = {
  day: number;
  month: number;
  title: Text;
  minutes: number;
  objectives: Text[];
  /** Exatamente 4: revisão, conceito, laboratório, ouvido. */
  blocks: [Block, Block, Block, Block];
};
