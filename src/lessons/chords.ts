// Acordes do curso. Formato: casas da corda 6 (grave) à 1 (aguda), "x" = não toca.
// Com casa 10 ou mais, separe por espaço: "x 10 12 12 12 x".
// Variantes do mesmo acorde usam "@": "G@3" é o G com pestana na casa 3. O nome mostrado é o que vem antes do "@".
import { STANDARD_TUNING } from "../lib/music";
import { chordVoicing, parseChord } from "../lib/harmony";

export type ChordShape = { shape: string; fingers: string; barre?: { fret: number; from: number; to: number }; label?: string; labelEn?: string };

const b = (fret: number, from = 6, to = 1) => ({ fret, from, to });

export const CHORDS: Record<string, ChordShape> = {
  // ── abertos (mês 1) ──
  Em: { shape: "022000", fingers: "023000" },
  E: { shape: "022100", fingers: "023100" },
  Am: { shape: "x02210", fingers: "x02310" },
  A: { shape: "x02220", fingers: "x01230" },
  D: { shape: "xx0232", fingers: "xx0132" },
  Dm: { shape: "xx0231", fingers: "xx0231" },
  C: { shape: "x32010", fingers: "x32010" },
  G: { shape: "320003", fingers: "210003" },

  // ── abertos com sétima e cores ──
  E7: { shape: "020100", fingers: "020100" },
  A7: { shape: "x02020", fingers: "x02030" },
  D7: { shape: "xx0212", fingers: "xx0213" },
  G7: { shape: "320001", fingers: "320001" },
  C7: { shape: "x32310", fingers: "x32410" },
  B7: { shape: "x21202", fingers: "x21304" },
  Am7: { shape: "x02010", fingers: "x02010" },
  Em7: { shape: "022030", fingers: "012030" },
  Dm7: { shape: "xx0211", fingers: "xx0211" },
  Cmaj7: { shape: "x32000", fingers: "x32000" },
  Fmaj7: { shape: "xx3210", fingers: "xx3210" },
  Amaj7: { shape: "x02120", fingers: "x02130" },
  Dmaj7: { shape: "xx0222", fingers: "xx0111" },
  Gmaj7: { shape: "320002", fingers: "320001" },
  Asus2: { shape: "x02200", fingers: "x01200" },
  Asus4: { shape: "x02230", fingers: "x01230" },
  Dsus2: { shape: "xx0230", fingers: "xx0130" },
  Dsus4: { shape: "xx0233", fingers: "xx0134" },
  Esus4: { shape: "022200", fingers: "023400" },
  Cadd9: { shape: "x32030", fingers: "x21030" },
  E9: { shape: "020102", fingers: "020104" },
  A6: { shape: "x02222", fingers: "x01111" },
  E6: { shape: "022120", fingers: "023140" },
  "D/C": { shape: "x30232", fingers: "x30132" },
  "D/F#": { shape: "200232", fingers: "100243" },
  "C/G": { shape: "332010", fingers: "342010" },
  "G/B": { shape: "x20003", fingers: "x10003" },
  "C/E": { shape: "032010", fingers: "032010" },
  "Am/G": { shape: "302210", fingers: "402310" },
  "Am/F#": { shape: "202210", fingers: "203410" },
  "Am(maj7)": { shape: "x02110", fingers: "x03120" },
  Am6: { shape: "x02212", fingers: "x01213" },
  Bdim: { shape: "x2343x", fingers: "x1243x" },
  Caug: { shape: "x32110", fingers: "x43120" },
  "C#dim7": { shape: "x4535x", fingers: "x2413x" },
  "D#dim7": { shape: "xx1212", fingers: "xx1324" },
  "G#dim7": { shape: "4x343x", fingers: "2x131x" },
  Edim7: { shape: "xx2323", fingers: "xx1324" },
  "F#dim7": { shape: "2x121x", fingers: "2x131x" },
  Bdim7: { shape: "x2313x", fingers: "x2314x" },
  Cdim7: { shape: "x3424x", fingers: "x2413x" },

  // ── power chords ──
  E5: { shape: "022xxx", fingers: "013xxx" },
  A5: { shape: "x022xx", fingers: "x013xx" },
  D5: { shape: "x577xx", fingers: "x134xx" },
  F5: { shape: "133xxx", fingers: "134xxx" },
  "F#5": { shape: "244xxx", fingers: "134xxx" },
  G5: { shape: "355xxx", fingers: "134xxx" },
  "A5@5": { shape: "577xxx", fingers: "134xxx" },
  B5: { shape: "x244xx", fingers: "x134xx" },
  C5: { shape: "x355xx", fingers: "x134xx" },
  Bb5: { shape: "x133xx", fingers: "x134xx" },
  "E5@7": { shape: "x799xx", fingers: "x134xx" },

  // ── pestana, tônica na corda 6 (forma de E) ──
  F: { shape: "133211", fingers: "134211", barre: b(1) },
  "F#": { shape: "244322", fingers: "134211", barre: b(2) },
  "G@3": { shape: "355433", fingers: "134211", barre: b(3) },
  Ab: { shape: "466544", fingers: "134211", barre: b(4) },
  "A@5": { shape: "577655", fingers: "134211", barre: b(5) },
  Fm: { shape: "133111", fingers: "134111", barre: b(1) },
  "F#m": { shape: "244222", fingers: "134111", barre: b(2) },
  Gm: { shape: "355333", fingers: "134111", barre: b(3) },
  "G#m": { shape: "466444", fingers: "134111", barre: b(4) },
  "Am@5": { shape: "577555", fingers: "134111", barre: b(5) },
  "Bm@7": { shape: "799777", fingers: "134111", barre: b(7) },
  F7: { shape: "131211", fingers: "131211", barre: b(1) },
  "G7@3": { shape: "353433", fingers: "131211", barre: b(3) },
  "A7@5": { shape: "575655", fingers: "131211", barre: b(5) },
  Fm7: { shape: "131111", fingers: "131111", barre: b(1) },
  Gm7: { shape: "353333", fingers: "131111", barre: b(3) },
  "Am7@5": { shape: "575555", fingers: "131111", barre: b(5) },
  "F#m7": { shape: "242222", fingers: "131111", barre: b(2) },

  // ── pestana, tônica na corda 5 (forma de A) ──
  Bb: { shape: "x13331", fingers: "x13331", barre: b(1, 5) },
  B: { shape: "x24442", fingers: "x13331", barre: b(2, 5) },
  "C@3": { shape: "x35553", fingers: "x13331", barre: b(3, 5) },
  "D@5": { shape: "x57775", fingers: "x13331", barre: b(5, 5) },
  Eb: { shape: "x68886", fingers: "x13331", barre: b(6, 5) },
  Bbm: { shape: "x13321", fingers: "x13421", barre: b(1, 5) },
  Bm: { shape: "x24432", fingers: "x13421", barre: b(2, 5) },
  Cm: { shape: "x35543", fingers: "x13421", barre: b(3, 5) },
  "C#m": { shape: "x46654", fingers: "x13421", barre: b(4, 5) },
  "Dm@5": { shape: "x57765", fingers: "x13421", barre: b(5, 5) },
  "Em@7": { shape: "x79987", fingers: "x13421", barre: b(7, 5) },
  "B7@2": { shape: "x24242", fingers: "x13141", barre: b(2, 5) },
  "C7@3": { shape: "x35353", fingers: "x13141", barre: b(3, 5) },
  "D7@5": { shape: "x57575", fingers: "x13141", barre: b(5, 5) },
  Bm7: { shape: "x24232", fingers: "x13121", barre: b(2, 5) },
  Cm7: { shape: "x35343", fingers: "x13121", barre: b(3, 5) },
  "Dm7@5": { shape: "x57565", fingers: "x13121", barre: b(5, 5) },
  "Em7@7": { shape: "x79787", fingers: "x13121", barre: b(7, 5) },
  "C#m7": { shape: "x46454", fingers: "x13121", barre: b(4, 5) },

  // ── tétrades móveis ──
  "Fmaj7@1": { shape: "1x221x", fingers: "1x342x" },
  "Gmaj7@3": { shape: "3x443x", fingers: "1x342x" },
  "Amaj7@5": { shape: "5x665x", fingers: "1x342x" },
  "Cmaj7@3": { shape: "x35453", fingers: "x13241", barre: b(3, 5) },
  "Dmaj7@5": { shape: "x57675", fingers: "x13241", barre: b(5, 5) },
  Bbmaj7: { shape: "x13231", fingers: "x13241", barre: b(1, 5) },
  Bmaj7: { shape: "x24342", fingers: "x13241", barre: b(2, 5) },
  "Emaj7@7": { shape: "x79897", fingers: "x13241", barre: b(7, 5) },
  "G#m7b5": { shape: "4x443x", fingers: "2x341x" },
  "C#m7b5": { shape: "x4545x", fingers: "x1324x" },
  "G#m7": { shape: "464444", fingers: "131111", barre: b(4) },
  "D#m7b5": { shape: "x6767x", fingers: "x1324x" },
  Dbmaj7: { shape: "x43111", fingers: "x43111", barre: b(1, 3) },
  Abmaj7: { shape: "4x554x", fingers: "1x342x" },
  Ebmaj7: { shape: "x68786", fingers: "x13241", barre: b(6, 5) },
  "F#m7b5": { shape: "2x221x", fingers: "2x341x" },
  "Am7b5": { shape: "5x554x", fingers: "2x341x" },
  "Bm7b5": { shape: "x2323x", fingers: "x1324x" },
  "Dm7b5": { shape: "x5656x", fingers: "x1324x" },
  "Em7b5": { shape: "x7878x", fingers: "x1324x" },
  Gdim7: { shape: "3x232x", fingers: "2x131x" },
  "Bb7": { shape: "x13131", fingers: "x13141", barre: b(1, 5) },
  "Eb7": { shape: "x68686", fingers: "x13141", barre: b(6, 5) },
  "Ab7": { shape: "464544", fingers: "131211", barre: b(4) },
  "Db7": { shape: "x46464", fingers: "x13141", barre: b(4, 5) },
  "E7@7": { shape: "x79797", fingers: "x13141", barre: b(7, 5) },
  "F#7": { shape: "242322", fingers: "131211", barre: b(2) },
  "C#7": { shape: "x46464", fingers: "x13141", barre: b(4, 5) },

  // ── cores: 9, 13, alt ──
  G9: { shape: "3x3435", fingers: "1x1213" },
  C9: { shape: "x3233x", fingers: "x2133x" },
  D9: { shape: "x5455x", fingers: "x2133x" },
  A9: { shape: "x0242x", fingers: "x0132x" },
  "E9@7": { shape: "x7677x", fingers: "x2133x" },
  G13: { shape: "3x3455", fingers: "1x1234" },
  A13: { shape: "5x5677", fingers: "1x1234" },
  E13: { shape: "0x0122", fingers: "0x0134" },
  "G7#9": { shape: "3x346x", fingers: "2x134x" },
  "E7#9": { shape: "x7678x", fingers: "x2134x" },
  "G7b9": { shape: "3x3434", fingers: "1x1213" },
  "A7b9": { shape: "x02323", fingers: "x01324" },
  "E7b9": { shape: "x7676x", fingers: "x2131x" },
  "D7#9": { shape: "x5456x", fingers: "x2134x" },
  "G7alt": { shape: "3x344x", fingers: "1x234x" },
  "E7alt": { shape: "0x0113", fingers: "0x0114" },
  "D9sus4": { shape: "x5555x", fingers: "x1111x" },
  "G9sus4": { shape: "3x3211", fingers: "3x4211" },
  "Cmaj9": { shape: "x3243x", fingers: "x2143x" },
  "Dm9": { shape: "x5355x", fingers: "x2134x" },
  "Am9": { shape: "x0201x", fingers: "x0201x" },
  "C6/9": { shape: "x3223x", fingers: "x2113x" },
  "Fm6": { shape: "1x011x", fingers: "1x023x" },
  "Dm6": { shape: "xx0201", fingers: "xx0201" },
  "Gm6": { shape: "3x233x", fingers: "2x134x" },

  // ── shells (1, 3 e 7) ──
  "G7@shell": { shape: "3x34xx", fingers: "1x23xx" },
  "Gmaj7@shell": { shape: "3x44xx", fingers: "1x34xx" },
  "Gm7@shell": { shape: "3x33xx", fingers: "1x11xx" },
  "Am7@shell": { shape: "5x55xx", fingers: "1x11xx" },
  "A7@shell": { shape: "5x56xx", fingers: "1x23xx" },
  "Fmaj7@shell": { shape: "1x22xx", fingers: "1x34xx" },
  "C7@shell": { shape: "x323xx", fingers: "x213xx" },
  "Cmaj7@shell": { shape: "x324xx", fingers: "x214xx" },
  "Cm7@shell": { shape: "x313xx", fingers: "x314xx" },
  "Dm7@shell": { shape: "x535xx", fingers: "x314xx" },
  "D7@shell": { shape: "x545xx", fingers: "x213xx" },
  "Bm7b5@shell": { shape: "x2x23x", fingers: "x1x23x" },
  "E7@shell": { shape: "0x01xx", fingers: "0x01xx" },
  "Fm7@shell": { shape: "1x11xx", fingers: "1x11xx" },
  "Bb7@shell": { shape: "x101xx", fingers: "x102xx" },
  "F7@shell": { shape: "1x12xx", fingers: "1x23xx" },
  "Bbmaj7@shell": { shape: "x102xx", fingers: "x103xx" },

  // ── drop 2 (cordas 4 a 1 e 5 a 2) ──
  "Dm7@d2": { shape: "xx3535", fingers: "xx1314" },
  "G7@d2": { shape: "xx3433", fingers: "xx1211" },
  "Cmaj7@d2": { shape: "xx2413", fingers: "xx2413" },
  "Cmaj7@d2b": { shape: "xx5557", fingers: "xx1114" },
  "Dm7@d2b": { shape: "xx7768", fingers: "xx2314" },
  "G7@d2b": { shape: "xx5767", fingers: "xx1324" },
  "Dm7@d2c": { shape: "x5756x", fingers: "x1312x" },
  "G7@d2c": { shape: "x5546x", fingers: "x2314x" },
  "Cmaj7@d2c": { shape: "x3545x", fingers: "x1324x" },
  "A7@d2": { shape: "xx5655", fingers: "xx1211" },
  "Em7@d2": { shape: "xx2433", fingers: "xx1423" },
  "A7@d2b": { shape: "xx2223", fingers: "xx1112" },
  "G7@d2o": { shape: "xx0001", fingers: "xx0001" },
  "Am7@d2": { shape: "xx5555", fingers: "xx1111" },
  "Fmaj7@d2": { shape: "xx3555", fingers: "xx1333" },
  "Bm7b5@d2": { shape: "xx3435", fingers: "xx1214" },
  "Em7@shell": { shape: "x757xx", fingers: "x214xx" },
  C6: { shape: "x32210", fingers: "x42310" },
  // ── drop 3 (cordas 6, 4, 3, 2) ──
  "Dm7@d3b": { shape: "5x353x", fingers: "3x142x" },
  "Cmaj7@d3b": { shape: "3x241x", fingers: "2x341x" },
  "G7@d3b": { shape: "3x343x", fingers: "1x243x" },
  "Cmaj7@d3": { shape: "8x998x", fingers: "1x342x" },
  "Dm7@d3": { shape: "x5x565", fingers: "x1x243" },
  "G7@d3": { shape: "3x343x", fingers: "1x243x" },
  "Am7@d3": { shape: "5x555x", fingers: "1x111x" },
};

/** Nome que aparece para o aluno ("G@3" → "G"). */
export const chordName = (key: string) => key.split("@")[0];

const ROOT_PT: Record<string, string> = { C: "Dó", D: "Ré", E: "Mi", F: "Fá", G: "Sol", A: "Lá", B: "Si" };
const QUAL: [RegExp, string, string][] = [
  [/^m7b5/, "meio-diminuto", "half-diminished"],
  [/^dim7/, "diminuto com sétima", "diminished 7th"],
  [/^dim/, "diminuto", "diminished"],
  [/^aug/, "aumentado", "augmented"],
  [/^m\(maj7\)/, "menor com sétima maior", "minor-major 7th"],
  [/^maj9/, "com sétima maior e nona", "major 9th"],
  [/^maj7/, "com sétima maior", "major 7th"],
  [/^m9/, "menor com nona", "minor 9th"],
  [/^m7/, "menor com sétima", "minor 7th"],
  [/^m6/, "menor com sexta", "minor 6th"],
  [/^m/, "menor", "minor"],
  [/^5/, "power chord", "power chord"],
  [/^7alt/, "com sétima alterado", "altered dominant"],
  [/^7#9/, "com sétima e nona aumentada", "7♯9"],
  [/^7b9/, "com sétima e nona menor", "7♭9"],
  [/^7/, "com sétima", "dominant 7th"],
  [/^9sus4/, "nona suspenso", "9sus4"],
  [/^9/, "com nona", "dominant 9th"],
  [/^13/, "com décima terceira", "13th"],
  [/^6\/9/, "com sexta e nona", "6/9"],
  [/^6/, "com sexta", "6th"],
  [/^sus2/, "com segunda suspensa", "sus2"],
  [/^sus4/, "com quarta suspensa", "sus4"],
  [/^add9/, "com nona adicionada", "add9"],
  [/^$/, "maior", "major"],
];

/** "Fá sustenido menor", "Si bemol com sétima", "Ré maior com baixo em Fá sustenido". */
export function chordLabel(key: string, en = false): string {
  const c = CHORDS[key];
  if (c?.label && !en) return c.label;
  if (c?.labelEn && en) return c.labelEn;
  const name = chordName(key);
  const [main, bass] = name.split("/");
  const m = /^([A-G])([#b]?)(.*)$/.exec(main);
  if (!m) return name;
  const accPt = m[2] === "#" ? " sustenido" : m[2] === "b" ? " bemol" : "";
  const accEn = m[2] === "#" ? "♯" : m[2] === "b" ? "♭" : "";
  const q = QUAL.find(([re]) => re.test(m[3]));
  const root = en ? m[1] + accEn : ROOT_PT[m[1]] + accPt;
  let out = q ? `${root} ${en ? q[2] : q[1]}` : `${root}${m[3]}`;
  if (bass) {
    const bm = /^([A-G])([#b]?)/.exec(bass);
    if (bm) out += en ? ` over ${bm[1]}${bm[2] === "#" ? "♯" : bm[2] === "b" ? "♭" : ""}` : ` com baixo em ${ROOT_PT[bm[1]]}${bm[2] === "#" ? " sustenido" : bm[2] === "b" ? " bemol" : ""}`;
  }
  return out;
}

function frets(shape: string): (number | "x")[] {
  const t = shape.includes(" ") ? shape.split(/\s+/) : [...shape];
  return t.map((c) => (c === "x" ? "x" : Number(c)));
}

/** Notas MIDI do acorde, da corda grave para a aguda. Sem diagrama, monta pelas notas da cifra. */
export function chordMidis(name: string): number[] {
  const c = CHORDS[name];
  if (!c) return chordVoicing(chordName(name));
  const out: number[] = [];
  frets(c.shape).forEach((f, i) => {
    if (f === "x") return;
    // shape começa na corda 6; STANDARD_TUNING começa na corda 1
    out.push(STANDARD_TUNING[5 - i] + f);
  });
  return out;
}

/** Casas por corda (corda 6 primeiro), para desenhar o acorde na tablatura. */
export function chordFrets(name: string): { s: number; f: number }[] {
  const c = CHORDS[name];
  if (!c) return [];
  return frets(c.shape)
    .map((f, k) => ({ s: 6 - k, f }))
    .filter((q): q is { s: number; f: number } => q.f !== "x");
}

export const hasDiagram = (name: string) => name in CHORDS;

/** Posições para o ChordDiagram (com dedos). */
export function chordPositions(name: string) {
  const c = CHORDS[name];
  if (!c) return [];
  const fg = frets(c.fingers);
  return frets(c.shape).map((f, i) => {
    if (f === "x") return { fret: "x" as const };
    const finger = fg[i];
    return f > 0 && finger !== "x" && finger !== 0 ? { fret: f, finger: finger as 1 | 2 | 3 | 4 } : { fret: f };
  });
}

export function chordBarre(name: string) {
  const bb = CHORDS[name]?.barre;
  return bb ? { fret: bb.fret, fromString: bb.from, toString: bb.to, finger: 1 as const } : undefined;
}

/** Usado pelo teste das cifras (scripts/check-chords). */
export function chordPcsMatch(name: string): { ok: boolean; extra: number[] } {
  const want = parseChord(chordName(name));
  const pcs = new Set(want.intervals.map((i) => (want.root + i) % 12));
  pcs.add(want.bass);
  const extra = chordMidis(name).map((m) => m % 12).filter((p) => !pcs.has(p));
  return { ok: extra.length === 0, extra };
}
