// Teoria para o som: lê uma cifra ("F#m7b5", "Bb7(9)", "C/E") e devolve as notas.
// Serve para tocar qualquer acorde que não tenha diagrama na biblioteca.

const LETTER: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** Classe de altura (0 = C) de um nome como "F#", "Bb", "Eb". */
export function pcOf(name: string): number {
  const m = /^([A-G])([#b]*)/.exec(name);
  if (!m) return 0;
  let pc = LETTER[m[1]];
  for (const ch of m[2]) pc += ch === "#" ? 1 : -1;
  return ((pc % 12) + 12) % 12;
}

/** Sufixos conhecidos → intervalos a partir da tônica (semitons). Do mais longo ao mais curto. */
const QUALITIES: [string, number[]][] = [
  ["m7b5", [0, 3, 6, 10]],
  ["ø", [0, 3, 6, 10]],
  ["dim7", [0, 3, 6, 9]],
  ["°7", [0, 3, 6, 9]],
  ["m(maj7)", [0, 3, 7, 11]],
  ["mMaj7", [0, 3, 7, 11]],
  ["mmaj7", [0, 3, 7, 11]],
  ["maj13", [0, 4, 7, 11, 14, 21]],
  ["maj9", [0, 4, 7, 11, 14]],
  ["maj7#11", [0, 4, 7, 11, 18]],
  ["maj7", [0, 4, 7, 11]],
  ["7M", [0, 4, 7, 11]],
  ["m11", [0, 3, 7, 10, 14, 17]],
  ["m9", [0, 3, 7, 10, 14]],
  ["m7", [0, 3, 7, 10]],
  ["m6/9", [0, 3, 7, 9, 14]],
  ["m6", [0, 3, 7, 9]],
  ["madd9", [0, 3, 7, 14]],
  ["m", [0, 3, 7]],
  ["dim", [0, 3, 6]],
  ["°", [0, 3, 6]],
  ["aug", [0, 4, 8]],
  ["+", [0, 4, 8]],
  ["7sus4", [0, 5, 7, 10]],
  ["9sus4", [0, 5, 7, 10, 14]],
  ["sus2", [0, 2, 7]],
  ["sus4", [0, 5, 7]],
  ["sus", [0, 5, 7]],
  ["add9", [0, 4, 7, 14]],
  ["6/9", [0, 4, 7, 9, 14]],
  ["6", [0, 4, 7, 9]],
  ["13", [0, 4, 10, 14, 21]],
  ["11", [0, 7, 10, 14, 17]],
  ["9", [0, 4, 7, 10, 14]],
  ["7alt", [0, 4, 10, 15, 20]],
  ["7#9", [0, 4, 7, 10, 15]],
  ["7b9", [0, 4, 7, 10, 13]],
  ["7#5", [0, 4, 8, 10]],
  ["7b13", [0, 4, 10, 20]],
  ["7#11", [0, 4, 7, 10, 18]],
  ["7", [0, 4, 7, 10]],
  ["5", [0, 7, 12]],
  ["", [0, 4, 7]],
];

export type ParsedChord = { root: number; intervals: number[]; bass: number };

export function parseChord(symbol: string): ParsedChord {
  const cut = symbol.search(/\/[A-G]/);
  const main = cut >= 0 ? symbol.slice(0, cut) : symbol;
  const slash = cut >= 0 ? symbol.slice(cut + 1) : undefined;
  const m = /^([A-G][#b]?)(.*)$/.exec(main.trim());
  if (!m) return { root: 0, intervals: [0, 4, 7], bass: 0 };
  const root = pcOf(m[1]);
  let rest = m[2].replace(/[()]/g, "");
  let found: number[] | undefined;
  for (const [suf, ivs] of QUALITIES) {
    if (rest.startsWith(suf)) {
      found = [...ivs];
      rest = rest.slice(suf.length);
      break;
    }
  }
  const intervals = found ?? [0, 4, 7];
  // extensões extras escritas depois: "7(9)", "7b9#11"
  for (const t of rest.match(/[#b]?\d+/g) ?? []) {
    const acc = t[0] === "#" ? 1 : t[0] === "b" ? -1 : 0;
    const deg = Number(t.replace(/[#b]/, ""));
    const base: Record<number, number> = { 9: 14, 11: 17, 13: 21, 5: 7 };
    if (base[deg] !== undefined) {
      if (deg === 5) {
        const i = intervals.indexOf(7);
        if (i >= 0) intervals[i] = 7 + acc;
      } else intervals.push(base[deg] + acc);
    }
  }
  const bass = slash && /^[A-G]/.test(slash) ? pcOf(slash) : root;
  return { root, intervals, bass };
}

/** Notas MIDI de uma voz de violão razoável: baixo na região E2–D3, resto entre G3 e E5. */
export function chordVoicing(symbol: string): number[] {
  const { root, intervals, bass } = parseChord(symbol);
  const low = 40 + ((bass - 4 + 12) % 12); // E2..D#3
  const out = [low];
  let base = 52 + ((root - 4 + 12) % 12); // E3..D#4
  if (base < low + 5) base += 12;
  for (const iv of intervals) {
    if (iv === 12) continue;
    let n = base + iv;
    while (n > 77) n -= 12;
    if (!out.includes(n)) out.push(n);
  }
  return out.sort((a, b) => a - b);
}

/* ───────── Graus romanos ───────── */

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];
const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];
/** Tons (maiores) escritos com bemóis. */
const FLAT_KEYS = new Set([5, 10, 3, 8, 1, 6]);

/** Nome da nota pela classe de altura, preferindo a grafia comum nos tons. */
export function pcName(pc: number, flats = true): string {
  const names = flats ? ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"] : ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return names[((pc % 12) + 12) % 12];
}

/**
 * Converte grau romano em cifra num tom. Ex.: romanToChord("ii7", 0) → "Dm7",
 * "bVII" → "Bb", "V7/vi" → "E7", "vii°" → "Bdim", "IVmaj7" → "Fmaj7".
 */
export function romanToChord(roman: string, keyPc: number, flats = FLAT_KEYS.has(keyPc)): string {
  const [main, target] = roman.split("/");
  let key = keyPc;
  if (target) {
    const t = parseRoman(target);
    key = (keyPc + t.offset) % 12;
  }
  const r = parseRoman(main);
  const pc = (key + r.offset) % 12;
  return pcName(pc, flats) + r.suffix;
}

function parseRoman(s: string): { offset: number; suffix: string } {
  const m = /^([b#]?)(VII|VI|V|IV|III|II|I|vii|vi|v|iv|iii|ii|i)(.*)$/.exec(s);
  if (!m) return { offset: 0, suffix: "" };
  const acc = m[1] === "b" ? -1 : m[1] === "#" ? 1 : 0;
  const deg = ROMAN.indexOf(m[2].toUpperCase());
  const lower = m[2] === m[2].toLowerCase();
  let suffix = m[3];
  if (suffix === "°") suffix = "dim";
  else if (suffix === "ø" || suffix === "ø7") suffix = "m7b5";
  else if (lower && !suffix.startsWith("°") && !suffix.startsWith("dim")) suffix = "m" + suffix;
  return { offset: (MAJOR_STEPS[deg] + acc + 12) % 12, suffix };
}

/* ───────── Escalas no braço ───────── */

export const SCALES: Record<string, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentaMinor: [0, 3, 5, 7, 10],
  pentaMajor: [0, 2, 4, 7, 9],
  blues: [0, 3, 5, 6, 7, 10],
  majorBlues: [0, 2, 3, 4, 7, 9],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  melodicMinor: [0, 2, 3, 5, 7, 9, 11],
  phrygianDominant: [0, 1, 4, 5, 7, 8, 10],
  lydianDominant: [0, 2, 4, 6, 7, 9, 10],
  altered: [0, 1, 3, 4, 6, 8, 10],
  locrianNat2: [0, 2, 3, 5, 6, 8, 10],
  dimHalfWhole: [0, 1, 3, 4, 6, 7, 9, 10],
  wholeTone: [0, 2, 4, 6, 8, 10],
  pentaM6: [0, 2, 3, 7, 9],
};

/** Nome do grau (relativo à tônica) para rótulo das bolinhas. */
export const DEGREE_LABEL: Record<number, string> = { 0: "1", 1: "b2", 2: "2", 3: "b3", 4: "3", 5: "4", 6: "b5", 7: "5", 8: "b6", 9: "6", 10: "b7", 11: "7" };
