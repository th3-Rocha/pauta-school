// Teclado · notas, posições e melodias usadas no mês 1 (as aulas em PT e EN usam as mesmas).
import type { Finger, Hand } from "../../lib/piano";

export const C3 = 48, D3 = 50, E3 = 52, F3 = 53, G3 = 55, A3 = 57, B3 = 59;
export const C4 = 60, D4 = 62, E4 = 64, F4 = 65, G4 = 67, A4 = 69, B4 = 71;
export const C5 = 72, D5 = 74, E5 = 76;
export const C6 = 84;
/** Pausa dentro de uma linha melódica. */
export const R = 0;

/** Dedos em cada posição. */
export const RH_C: Record<number, Finger> = { [C4]: 1, [D4]: 2, [E4]: 3, [F4]: 4, [G4]: 5, [A4]: 5 };
export const RH_G: Record<number, Finger> = { [G4]: 1, [A4]: 2, [B4]: 3, [C5]: 4, [D5]: 5 };
export const LH_C: Record<number, Finger> = { [C3]: 5, [D3]: 4, [E3]: 3, [F3]: 2, [G3]: 1 };

export type RollNote = { midi: number; start: number; duration: number; hand: Hand; finger?: Finger };

/** Linha de uma mão: [nota, duração em tempos]. Nota R (0) é pausa. */
export function line(hand: Hand, seq: [number, number][], fingers: Record<number, Finger>, start = 0): RollNote[] {
  let t = start;
  const out: RollNote[] = [];
  for (const [midi, duration] of seq) {
    if (midi !== R) out.push({ midi, start: t, duration, hand, finger: fingers[midi] });
    t += duration;
  }
  return out;
}

export const rh = (seq: [number, number][], fingers = RH_C, start = 0) => line("right", seq, fingers, start);
export const lh = (seq: [number, number][], fingers = LH_C, start = 0) => line("left", seq, fingers, start);

/** Para a pauta: a mesma linha, com pausas. */
export const staffOf = (seq: [number, number][]) => seq.map(([midi, d]) => (midi === R ? { rest: true as const, d } : { midi, d }));

/** Para o exercício de sequência: notas com dedo e duração. */
export const seqOf = (seq: [number, number][], fingers = RH_C) =>
  seq.filter(([m]) => m !== R).map(([midi, d]) => ({ midi, d, finger: fingers[midi] }));

/* ── Melodias ───────────────────────────────────────────────────────────── */

export const UP_DOWN: [number, number][] = [[C4, 1], [D4, 1], [E4, 1], [F4, 1], [G4, 1], [F4, 1], [E4, 1], [D4, 1], [C4, 4]];

/** "Passeio", original da Pauta (CC BY-SA). */
export const PASSEIO: [number, number][] = [
  [C4, 1], [D4, 1], [E4, 1], [C4, 1],
  [E4, 1], [F4, 1], [G4, 2],
  [G4, 1], [F4, 1], [E4, 1], [D4, 1],
  [C4, 4],
  [E4, 1], [E4, 1], [F4, 1], [G4, 1],
  [G4, 1], [F4, 1], [E4, 1], [D4, 1],
  [C4, 1], [D4, 1], [E4, 1], [D4, 1],
  [C4, 4],
];
/** Fundamentais da mão esquerda para o Passeio (mínimas). */
export const PASSEIO_LH: [number, number][] = [
  [C3, 2], [C3, 2], [C3, 2], [G3, 2], [G3, 2], [C3, 2], [C3, 4],
  [C3, 2], [C3, 2], [G3, 2], [G3, 2], [C3, 2], [G3, 2], [C3, 4],
];

/** Escada da mão esquerda (espelho do UP_DOWN). */
export const ESCADA_LH: [number, number][] = [[C3, 1], [D3, 1], [E3, 1], [F3, 1], [G3, 1], [F3, 1], [E3, 1], [D3, 1], [C3, 4]];

/** Ritmo: semínimas, mínimas, semibreve e pausas, só em Dó, Mi e Sol. */
export const RITMO: [number, number][] = [
  [C4, 1], [C4, 1], [C4, 2],
  [E4, 1], [E4, 1], [E4, 2],
  [G4, 1], [R, 1], [G4, 1], [R, 1],
  [C4, 4],
];

/** "Mary Had a Little Lamb" / "Maria tinha um carneirinho" (tradicional, domínio público). */
export const MARY: [number, number][] = [
  [E4, 1], [D4, 1], [C4, 1], [D4, 1],
  [E4, 1], [E4, 1], [E4, 2],
  [D4, 1], [D4, 1], [D4, 2],
  [E4, 1], [G4, 1], [G4, 2],
  [E4, 1], [D4, 1], [C4, 1], [D4, 1],
  [E4, 1], [E4, 1], [E4, 1], [E4, 1],
  [D4, 1], [D4, 1], [E4, 1], [D4, 1],
  [C4, 4],
];

/** "Pergunta e resposta", original: a direita pergunta, a esquerda responde. */
export const PERGUNTA_RH: [number, number][] = [
  [E4, 1], [D4, 1], [C4, 2], [R, 4],
  [E4, 1], [F4, 1], [G4, 2], [R, 4],
  [G4, 1], [F4, 1], [E4, 1], [D4, 1], [R, 4],
  [E4, 1], [D4, 1], [C4, 2], [R, 4],
];
export const PERGUNTA_LH: [number, number][] = [
  [R, 4], [E3, 1], [D3, 1], [C3, 2],
  [R, 4], [G3, 1], [F3, 1], [E3, 2],
  [R, 4], [G3, 1], [F3, 1], [E3, 1], [D3, 1],
  [R, 4], [C3, 4],
];

/** Hino à Alegria (Beethoven, domínio público), primeira frase. Versão com ritmo simplificado. */
export const ODE_SIMPLE: [number, number][] = [
  [E4, 1], [E4, 1], [F4, 1], [G4, 1],
  [G4, 1], [F4, 1], [E4, 1], [D4, 1],
  [C4, 1], [C4, 1], [D4, 1], [E4, 1],
  [E4, 2], [D4, 2],
  [E4, 1], [E4, 1], [F4, 1], [G4, 1],
  [G4, 1], [F4, 1], [E4, 1], [D4, 1],
  [C4, 1], [C4, 1], [D4, 1], [E4, 1],
  [D4, 2], [C4, 2],
];
/** O mesmo trecho com o ritmo original (semínima pontuada + colcheia). */
export const ODE: [number, number][] = [
  [E4, 1], [E4, 1], [F4, 1], [G4, 1],
  [G4, 1], [F4, 1], [E4, 1], [D4, 1],
  [C4, 1], [C4, 1], [D4, 1], [E4, 1],
  [E4, 1.5], [D4, 0.5], [D4, 2],
  [E4, 1], [E4, 1], [F4, 1], [G4, 1],
  [G4, 1], [F4, 1], [E4, 1], [D4, 1],
  [C4, 1], [C4, 1], [D4, 1], [E4, 1],
  [D4, 1.5], [C4, 0.5], [C4, 2],
];
export const ODE_LH: [number, number][] = [
  [C3, 4], [G3, 4], [C3, 4], [G3, 4],
  [C3, 4], [G3, 4], [C3, 4], [G3, 2], [C3, 2],
];

/** Posição de Sol: "Subida", original. */
export const SUBIDA: [number, number][] = [
  [G4, 1], [A4, 1], [B4, 1], [C5, 1],
  [D5, 2], [C5, 2],
  [B4, 1], [A4, 1], [G4, 1], [A4, 1],
  [B4, 4],
  [D5, 1], [C5, 1], [B4, 1], [A4, 1],
  [B4, 2], [A4, 2],
  [G4, 1], [A4, 1], [B4, 1], [A4, 1],
  [G4, 4],
];

/** "Valsinha", original em 3/4. */
export const VALSINHA: [number, number][] = [
  [C4, 1], [E4, 1], [G4, 1],
  [F4, 2], [E4, 1],
  [D4, 1], [F4, 1], [D4, 1],
  [E4, 3],
  [E4, 1], [G4, 1], [E4, 1],
  [F4, 2], [D4, 1],
  [D4, 1], [E4, 1], [D4, 1],
  [C4, 3],
];
export const VALSINHA_LH: [number, number][] = [
  [C3, 3], [C3, 3], [G3, 3], [C3, 3], [C3, 3], [G3, 3], [G3, 3], [C3, 3],
];

/** "Ponte", original: começa na posição de Dó e termina na de Sol (troca na pausa). */
export const PONTE_C: [number, number][] = [[C4, 1], [D4, 1], [E4, 1], [F4, 1], [G4, 2], [R, 2]];
export const PONTE_G: [number, number][] = [[A4, 1], [B4, 1], [C5, 2], [D5, 1], [C5, 1], [B4, 2], [A4, 1], [B4, 1], [G4, 2]];

/** "Brilha, brilha, estrelinha" (tradicional, domínio público). O 5 estica até o Lá. */
export const TWINKLE: [number, number][] = [
  [C4, 1], [C4, 1], [G4, 1], [G4, 1],
  [A4, 1], [A4, 1], [G4, 2],
  [F4, 1], [F4, 1], [E4, 1], [E4, 1],
  [D4, 1], [D4, 1], [C4, 2],
  [G4, 1], [G4, 1], [F4, 1], [F4, 1],
  [E4, 1], [E4, 1], [D4, 2],
  [G4, 1], [G4, 1], [F4, 1], [F4, 1],
  [E4, 1], [E4, 1], [D4, 2],
  [C4, 1], [C4, 1], [G4, 1], [G4, 1],
  [A4, 1], [A4, 1], [G4, 2],
  [F4, 1], [F4, 1], [E4, 1], [E4, 1],
  [D4, 1], [D4, 1], [C4, 2],
];
export const TWINKLE_LH: [number, number][] = [
  [C3, 4], [F3, 2], [C3, 2], [F3, 2], [C3, 2], [G3, 2], [C3, 2],
  [C3, 2], [F3, 2], [C3, 2], [G3, 2], [C3, 2], [F3, 2], [C3, 2], [G3, 2],
  [C3, 4], [F3, 2], [C3, 2], [F3, 2], [C3, 2], [G3, 2], [C3, 2],
];

/** "Caminho de casa", original: a peça do desafio do mês 1. */
export const CAMINHO: [number, number][] = [
  [E4, 1], [F4, 1], [G4, 2],
  [F4, 1], [E4, 1], [D4, 2],
  [E4, 1], [D4, 1], [C4, 1], [E4, 1],
  [D4, 4],
  [E4, 1], [F4, 1], [G4, 2],
  [G4, 1], [F4, 1], [E4, 2],
  [D4, 1], [E4, 1], [F4, 1], [D4, 1],
  [C4, 4],
];
export const CAMINHO_LH: [number, number][] = [
  [C3, 2], [C3, 2], [G3, 2], [G3, 2], [C3, 2], [C3, 2], [G3, 2], [G3, 2],
  [C3, 2], [C3, 2], [C3, 2], [C3, 2], [G3, 2], [G3, 2], [C3, 4],
];

/** Leitura à primeira vista: frases curtas novas. */
export const SIGHT_1: [number, number][] = [[C4, 1], [E4, 1], [D4, 1], [F4, 1], [E4, 2], [C4, 2]];
export const SIGHT_2: [number, number][] = [[G4, 2], [F4, 1], [E4, 1], [F4, 1], [D4, 1], [C4, 2]];
export const SIGHT_3: [number, number][] = [[E4, 1], [G4, 1], [F4, 1], [D4, 1], [E4, 1], [C4, 1], [D4, 2]];
