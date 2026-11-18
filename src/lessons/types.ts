// Formato de uma aula. Cada aula é só dados: texto + widgets interativos.
// O texto aceita **negrito**, *itálico* e `código`.

import type { MarkerKind } from "../components/music/markers";
import type { Finger, Hand } from "../lib/piano";

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
  | { callout: "tip" | "warning" | "selfCheck" | "theory"; text: Text | Text[]; title?: Text; label?: Text }
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
  | { w: "bpmlog"; month: number; target: number }
  // ── Teclado ──
  | { w: "key-input" }
  | {
      w: "keys";
      from: number;
      to: number;
      markers?: { midi: number; kind?: MarkerKind; label?: string; hand?: Hand; finger?: Finger }[];
      zones?: { hand: Hand; from: number; to: number; label?: string }[];
      names?: "none" | "c-only" | "all";
      caption?: Text;
    }
  | { w: "hand"; name: Text; description?: Text; positions: { hand: Hand; notes: [number, number, number, number, number] }[] }
  | { w: "find-keys"; mode: "all" | "quiz"; from: number; to: number; targets: number[]; rounds?: number; names?: "none" | "c-only" | "all"; title?: Text }
  | { w: "sequence"; title?: Text; notes: { midi: number; finger?: Finger }[]; hand?: Hand; from: number; to: number; bpm?: number; goal?: number }
  | { w: "key-echo"; notes: number[] }
  | {
      w: "play-along";
      title?: Text;
      /** Tempos em semínimas a partir do 0. */
      notes: { midi: number; start: number; duration: number; hand: Hand; finger?: Finger }[];
      bpm: number;
      from: number;
      to: number;
      beatsPerBar?: number;
      modes?: ("listen" | "wait" | "tempo")[];
      defaultMode?: "listen" | "wait" | "tempo";
    };

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
