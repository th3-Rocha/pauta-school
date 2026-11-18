// src/lib/music.ts
// Utilidades puras de teoria usadas pelos componentes visuais. Nada de áudio aqui.

/** Afinação padrão, da corda 1 (Mi aguda) à corda 6 (Mi grave), em MIDI. */
export const STANDARD_TUNING = [64, 59, 55, 50, 45, 40] as const;

export const NOTE_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
export const NOTE_NAMES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"] as const;
export const NOTE_NAMES_SOLFEGE = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"] as const;

export type NoteNaming = "sharp" | "flat" | "solfege";

/** Nome da nota de um número MIDI. `withOctave` usa a convenção C4 = 60. */
export function midiToName(midi: number, naming: NoteNaming = "sharp", withOctave = false): string {
  const pc = ((midi % 12) + 12) % 12;
  const table = naming === "flat" ? NOTE_NAMES_FLAT : naming === "solfege" ? NOTE_NAMES_SOLFEGE : NOTE_NAMES_SHARP;
  const name = table[pc];
  return withOctave ? `${name}${Math.floor(midi / 12) - 1}` : name;
}

/** Algarismo romano para a casa inicial dos diagramas (1–24). */
export function toRoman(n: number): string {
  const map: [number, string][] = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let out = "";
  let rest = Math.max(0, Math.floor(n));
  for (const [v, s] of map) while (rest >= v) { out += s; rest -= v; }
  return out;
}

/** Casas com marcação no braço. A 12 e a 24 são duplas. */
export const INLAY_FRETS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24] as const;
export const DOUBLE_INLAY_FRETS = [12, 24] as const;

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
