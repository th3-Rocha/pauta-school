// src/lib/piano.ts
// Geometria e nomes do teclado. Funções puras: nada de áudio nem de Web MIDI aqui.
import { clamp } from "./music";

export type Hand = "right" | "left";
export type Finger = 1 | 2 | 3 | 4 | 5;
/** Nomes das notas na interface: solfejo (Dó Ré Mi) ou cifra (C D E). */
export type NoteNames = "solfege" | "letters";
/** Acidentes: sustenido (Dó#) ou bemol (Réb). */
export type Accidentals = "sharp" | "flat";

/** Dó central = C4 = MIDI 60 (padrão científico). */
export const MIDDLE_C = 60;

const BLACK_PCS = new Set([1, 3, 6, 8, 10]);
export const isBlack = (midi: number) => BLACK_PCS.has(((midi % 12) + 12) % 12);

const SOLFEGE_SHARP = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];
const SOLFEGE_FLAT = ["Dó", "Réb", "Ré", "Mib", "Mi", "Fá", "Solb", "Sol", "Láb", "Lá", "Sib", "Si"];
const LETTER_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const LETTER_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

/**
 * Nome da nota. `withOctave` acrescenta a oitava científica:
 * solfejo "Dó 4" (com espaço, como se fala), cifra "C4".
 */
export function noteName(midi: number, noteNames: NoteNames = "solfege", accidentals: Accidentals = "sharp", withOctave = false): string {
  const pc = ((midi % 12) + 12) % 12;
  const table = noteNames === "letters" ? (accidentals === "flat" ? LETTER_FLAT : LETTER_SHARP) : accidentals === "flat" ? SOLFEGE_FLAT : SOLFEGE_SHARP;
  const octave = Math.floor(midi / 12) - 1;
  if (!withOctave) return table[pc];
  return noteNames === "letters" ? `${table[pc]}${octave}` : `${table[pc]} ${octave}`;
}

/** Nome por extenso para leitores de tela: "Dó sustenido 4". */
export function noteSpoken(midi: number, accidentals: Accidentals = "sharp"): string {
  const pc = ((midi % 12) + 12) % 12;
  const base = ["Dó", "Dó", "Ré", "Ré", "Mi", "Fá", "Fá", "Sol", "Sol", "Lá", "Lá", "Si"];
  const flatBase = ["Dó", "Ré", "Ré", "Mi", "Mi", "Fá", "Sol", "Sol", "Lá", "Lá", "Si", "Si"];
  const octave = Math.floor(midi / 12) - 1;
  if (!isBlack(midi)) return `${base[pc]} ${octave}`;
  return accidentals === "flat" ? `${flatBase[pc]} bemol ${octave}` : `${base[pc]} sustenido ${octave}`;
}

/* ── Geometria ────────────────────────────────────────────────────────────
 * Unidades do viewBox. Proporção de um piano real: tecla branca 23,5 × 150 mm,
 * preta 13,7 × 95 mm. Aqui a branca é um pouco mais curta para caber no celular.
 */
export const KEY = {
  /** Largura da tecla branca (unidade base). */
  w: 24,
  /** Altura da tecla branca. */
  h: 120,
  /** Largura da preta (≈ 0,58 da branca). */
  bw: 14,
  /** Altura da preta (≈ 0,62 da branca). */
  bh: 75,
} as const;

/** Deslocamento do centro da tecla preta em relação à fresta entre as brancas (grupos 2 + 3). */
const BLACK_OFFSET: Record<number, number> = { 1: -2.4, 3: 2.4, 6: -3, 8: 0, 10: 3 };

export type KeyGeom = {
  midi: number;
  black: boolean;
  /** Canto esquerdo, em unidades. */
  x: number;
  width: number;
  height: number;
  /** Centro horizontal. */
  cx: number;
};

/** Alarga o intervalo para começar e terminar em tecla branca. */
export function snapRange(from: number, to: number): [number, number] {
  let a = Math.round(from);
  let b = Math.round(to);
  if (b < a) [a, b] = [b, a];
  if (isBlack(a)) a -= 1;
  if (isBlack(b)) b += 1;
  return [clamp(a, 0, 127), clamp(b, 0, 127)];
}

export function whiteCount(from: number, to: number): number {
  let n = 0;
  for (let m = from; m <= to; m++) if (!isBlack(m)) n++;
  return n;
}

/** Posição de cada tecla. As brancas vêm primeiro (são desenhadas por baixo). */
export function layoutKeys(from: number, to: number): { keys: KeyGeom[]; width: number; byMidi: Map<number, KeyGeom> } {
  const [a, b] = snapRange(from, to);
  const whites: KeyGeom[] = [];
  const blacks: KeyGeom[] = [];
  let wi = 0;
  for (let m = a; m <= b; m++) {
    if (!isBlack(m)) {
      const x = wi * KEY.w;
      whites.push({ midi: m, black: false, x, width: KEY.w, height: KEY.h, cx: x + KEY.w / 2 });
      wi++;
    } else {
      const seam = wi * KEY.w;
      const cx = seam + BLACK_OFFSET[((m % 12) + 12) % 12];
      blacks.push({ midi: m, black: true, x: cx - KEY.bw / 2, width: KEY.bw, height: KEY.bh, cx });
    }
  }
  const keys = [...whites, ...blacks];
  return { keys, width: wi * KEY.w, byMidi: new Map(keys.map((k) => [k.midi, k])) };
}

/** Centro horizontal de uma nota, em fração da largura total (0–1). Útil para alinhar HTML ao SVG. */
export function keyFraction(midi: number, from: number, to: number): { left: number; right: number; center: number } | null {
  const { byMidi, width } = layoutKeys(from, to);
  const k = byMidi.get(midi);
  if (!k) return null;
  return { left: k.x / width, right: (k.x + k.width) / width, center: k.cx / width };
}

/* ── Teclado do computador ────────────────────────────────────────────────
 * Fileira A S D F G H J K L Ç = brancas; W E T Y U O P = pretas.
 * A primeira tecla (A) toca a nota `base` (padrão: Dó central).
 */
const COMPUTER_ROW: [string, number][] = [
  ["A", 0], ["W", 1], ["S", 2], ["E", 3], ["D", 4], ["F", 5], ["T", 6], ["G", 7], ["Y", 8], ["H", 9], ["U", 10], ["J", 11],
  ["K", 12], ["O", 13], ["L", 14], ["P", 15], ["Ç", 16],
];

/** Mapa letra → MIDI. O app usa para ouvir o teclado; o componente só mostra a letra. */
export function computerKeyMap(base = MIDDLE_C): Map<string, number> {
  return new Map(COMPUTER_ROW.map(([k, off]) => [k, base + off]));
}

/** Letra do teclado do computador que toca esta nota, se houver. */
export function computerKeyFor(midi: number, base = MIDDLE_C): string | undefined {
  const off = midi - base;
  return COMPUTER_ROW.find(([, o]) => o === off)?.[0];
}

/* ── Acordes ──────────────────────────────────────────────────────────── */

/** Compara o acorde alvo com o que está pressionado. Por classe de altura (padrão) ou nota exata. */
export function compareChord(target: number[], held: number[], mode: "pitch-class" | "exact" = "pitch-class") {
  const pc = (m: number) => ((m % 12) + 12) % 12;
  const key = mode === "exact" ? (m: number) => m : pc;
  const targetKeys = new Set(target.map(key));
  const heldKeys = new Set(held.map(key));
  const correct = target.filter((m) => heldKeys.has(key(m)));
  const missing = target.filter((m) => !heldKeys.has(key(m)));
  const extra = held.filter((m) => !targetKeys.has(key(m)));
  /** No modo por classe, a inversão confere pelo baixo: a nota mais grave tem de ser a do alvo. */
  const bassOk = held.length > 0 && target.length > 0 ? key(Math.min(...held)) === key(Math.min(...target)) : false;
  return { correct, missing, extra, bassOk, ok: missing.length === 0 && extra.length === 0 && bassOk };
}
