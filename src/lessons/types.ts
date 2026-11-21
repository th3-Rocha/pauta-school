// Formato de uma aula. Cada aula é só dados: texto + widgets interativos.
// O texto aceita **negrito**, *itálico* e `código`.

import type { MarkerKind } from "../components/music/markers";
import type { Finger, Hand } from "../lib/piano";
import type { VowelId } from "../lib/voice";

export type Text = string;

/**
 * Técnica escrita sobre a nota da tablatura.
 * h = hammer-on, p = pull-off, "/" e "\\" = slide subindo/descendo (vindo da nota anterior),
 * b = bend (sobe `b` semitons, padrão 2), pb = pre-bend (já começa esticada e solta),
 * r = release (solta um bend), "~" = vibrato, pm = palm mute, x = nota abafada,
 * harm = harmônico natural, t = tapping, "^" = acento.
 */
export type Tech = "h" | "p" | "/" | "\\" | "b" | "pb" | "r" | "~" | "pm" | "x" | "harm" | "t" | "^";

/** Nota de tablatura. `s` = corda (1 aguda … 6 grave), `f` = casa, `d` = duração em tempos. */
export type TabNote =
  | { s: number; f: number; d: number; t?: Tech; b?: number }
  | { chord: string; d: number }
  | { multi: { s: number; f: number }[]; d: number; t?: Tech }
  | { rest: true; d: number };

export type Stroke = "down" | "up" | "rest" | "hit" | null;

/** Levadas da base de acompanhamento. */
export type Feel =
  | "rock"
  | "pop"
  | "ballad"
  | "shuffle"
  | "blues"
  | "funk"
  | "reggae"
  | "bossa"
  | "samba"
  | "baiao"
  | "xote"
  | "jazz"
  | "waltz"
  | "six8"
  | "drone";

export type EarKind =
  | "highlow-strings" // duas cordas soltas: subiu ou desceu?
  | "highlow-close" // duas notas próximas na mesma corda
  | "same-diff" // mesma nota ou diferente?
  | "duration" // quantos tempos a nota durou?
  | "major-minor" // acorde maior ou menor?
  | "which-chord" // qual destes acordes?
  | "interval" // qual intervalo? (options: "2m","2M","3m","3M","4J","TT","5J","6m","6M","7m","7M","8J")
  | "interval-harmonic" // o mesmo, com as duas notas juntas
  | "quality" // qualidade do acorde (options: sufixos: "", "m", "dim", "aug", "sus2", "sus4", "maj7", "m7", "7", "m7b5", "dim7"…)
  | "progression" // qual progressão? (options: graus separados por espaço: "I IV V I")
  | "scale" // qual escala ou modo? (options: chaves de SCALES)
  | "degree"; // qual grau da escala? (options: "1","2","3","4","5","6","7")

export type Node =
  | Text
  | { h: Text }
  | { list: Text[]; ordered?: boolean }
  | { callout: "tip" | "warning" | "selfCheck" | "theory"; text: Text | Text[]; title?: Text; label?: Text }
  | { w: "strings" }
  | { w: "letters" }
  | { w: "tuner" }
  /** Checagem de bend pelo microfone: casa `f` da corda `s`, subindo `semis` semitons. */
  | { w: "bend"; s: number; f: number; semis: number }
  /** Gravador: grava pelo microfone e toca de volta. */
  | { w: "recorder"; id: string; label?: Text }
  /** Drone: nota pedal contínua (classe de altura 0–11, 0 = C). */
  | { w: "drone"; note: number }
  /**
   * Base de acompanhamento. `chords`: um item por compasso ("C", "G7") ou "C G" para dois acordes no compasso.
   * `beats`: tempos por compasso (padrão 4; 3 na valsa, 6 no 6/8, 12 no 12/8).
   */
  | { w: "jam"; title?: Text; key: string; bpm: number; feel: Feel; chords: string[]; beats?: number }
  | { w: "metronome"; bpm: number }
  | { w: "fretboard"; frets?: number; from?: number; markers: { s: number; f: number; label?: string; kind?: MarkerKind }[]; caption?: Text }
  | { w: "chords"; chords: string[] }
  | { w: "changes"; chords: string[]; beats: number; bpm: number; title?: Text }
  | { w: "tab"; title?: Text; bpm: number; notes: TabNote[]; beatsPerMeasure?: number; swing?: boolean; backing?: string[] }
  | {
      w: "strum";
      title?: Text;
      bpm: number;
      /** Um compasso por item: acorde + batidas (uma por tempo). */
      measures: { chord: string; strokes: Stroke[] }[];
      /** Tempos por compasso (padrão 4). */
      beats?: number;
      /** Colcheias suingadas (shuffle). */
      swing?: boolean;
      /** Melodia que o app toca junto enquanto você acompanha. */
      melody?: TabNote[];
    }
  | { w: "selfcheck"; id: string; title?: Text; items: { id: string; label: Text; hint?: Text }[] }
  | { w: "ear"; kind: EarKind; chords?: string[]; options?: string[] }
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
  | {
      w: "sequence";
      title?: Text;
      notes: { midi: number; finger?: Finger; d?: number }[];
      hand?: Hand;
      from: number;
      to: number;
      bpm?: number;
      goal?: number;
      staff?: boolean | "treble" | "bass";
      hideKeys?: boolean;
    }
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
      /** Mãos que o site toca sozinho. */
      auto?: Hand[];
    }
  | { w: "staff"; notes: ({ midi: number; d: number } | { rest: true; d: number })[]; clef?: "treble" | "bass"; beatsPerBar?: number; names?: boolean; caption?: Text }
  | { w: "staff-quiz"; notes: number[]; clef?: "treble" | "bass"; rounds?: number; from: number; to: number; title?: Text }
  | { w: "dynamics"; target: "p" | "mf" | "f" }
  // ── Canto (alturas em semitons a partir da nota-base do aluno) ──
  /** Ajuste de voz: o triângulo do Chimera e a nota-base pela fala. */
  | { w: "voice-setup" }
  /** O Chimera por dentro (2D/3D) com botões de demonstração. */
  | { w: "chimera"; demos: { label: Text; notes: number[]; vowel?: VowelId; vowels?: VowelId[]; seconds?: number; source?: Record<string, number | boolean>; artic?: Record<string, number>; prop?: "straw" | "trill" | "hum" }[]; caption?: Text; view?: "2d" | "3d" }
  /** Repetir uma nota e segurar `hold` segundos dentro de ±`tolerance` cents. */
  | { w: "match"; offset: number; vowel?: VowelId; tolerance?: number; hold?: number; title?: Text }
  /** Cantar uma frase no piano roll. `d` em tempos; `syl` = sílaba; `v` = vogal do Chimera. */
  | { w: "phrase"; notes: { s: number; d: number; syl?: string; v?: VowelId }[]; bpm: number; title?: Text; tolerance?: number; feedback?: "live" | "after" | "hidden"; goal?: number }
  | { w: "breath"; pattern: [number, number, number]; cycles?: number }
  | { w: "sss" }
  | { w: "warmup"; variant?: "warmup" | "cooldown"; items: { id: string; seconds: number; title?: Text }[] }
  | { w: "checkin"; when: "before" | "after" }
  | { w: "range" }
  | { w: "vowels"; nasal?: boolean }
  /** Escada de solfejo: graus pedidos em ordem (0 = 1º grau … 7 = oitava). */
  | { w: "solfege"; steps: number[]; tolerance?: number; title?: Text };

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
