// Acordes do curso. Formato: casas da corda 6 (grave) à 1 (aguda), "x" = não toca.
import { STANDARD_TUNING } from "../lib/music";

export type ChordShape = { shape: string; fingers: string; label: string; labelEn: string };

export const CHORDS: Record<string, ChordShape> = {
  Em: { shape: "022000", fingers: "023000", label: "Mi menor", labelEn: "E minor" },
  E: { shape: "022100", fingers: "023100", label: "Mi maior", labelEn: "E major" },
  Am: { shape: "x02210", fingers: "x02310", label: "Lá menor", labelEn: "A minor" },
  A: { shape: "x02220", fingers: "x01230", label: "Lá maior", labelEn: "A major" },
  D: { shape: "xx0232", fingers: "xx0132", label: "Ré maior", labelEn: "D major" },
  Dm: { shape: "xx0231", fingers: "xx0231", label: "Ré menor", labelEn: "D minor" },
  C: { shape: "x32010", fingers: "x32010", label: "Dó maior", labelEn: "C major" },
  G: { shape: "320003", fingers: "210003", label: "Sol maior", labelEn: "G major" },
};

/** Notas MIDI do acorde, da corda grave para a aguda. */
export function chordMidis(name: string): number[] {
  const c = CHORDS[name];
  if (!c) return [];
  const out: number[] = [];
  [...c.shape].forEach((ch, i) => {
    if (ch === "x") return;
    // shape começa na corda 6; STANDARD_TUNING começa na corda 1
    out.push(STANDARD_TUNING[5 - i] + Number(ch));
  });
  return out;
}

/** Posições para o ChordDiagram (com dedos). */
export function chordPositions(name: string) {
  const c = CHORDS[name];
  return [...c.shape].map((ch, i) => {
    if (ch === "x") return { fret: "x" as const };
    const fret = Number(ch);
    const fg = c.fingers[i];
    return fret > 0 && fg !== "0" ? { fret, finger: Number(fg) as 1 | 2 | 3 | 4 } : { fret };
  });
}
