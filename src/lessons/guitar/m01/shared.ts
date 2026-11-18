import type { Stroke, TabNote } from "../../types";

/** Nota de tablatura: corda, casa, duração em tempos. */
export const n = (s: number, f: number, d = 1): TabNote => ({ s, f, d });
/** Pausa. */
export const r = (d = 1): TabNote => ({ rest: true, d });

export const ALL_DOWN: Stroke[] = ["down", "down", "down", "down"];
export const HALVES: Stroke[] = ["down", null, "down", null];
export const WHOLE: Stroke[] = ["down", null, null, null];
export const THREE_REST: Stroke[] = ["down", "down", "down", "rest"];
export const DOWN_REST: Stroke[] = ["down", "rest", "down", "rest"];

/** Hino à Alegria (Beethoven, domínio público), cordas 1 e 2. */
export const ODE_TO_JOY: TabNote[] = [
  n(1, 0), n(1, 0), n(1, 1), n(1, 3),
  n(1, 3), n(1, 1), n(1, 0), n(2, 3),
  n(2, 1), n(2, 1), n(2, 3), n(1, 0),
  n(1, 0, 1.5), n(2, 3, 0.5), n(2, 3, 2),
  n(1, 0), n(1, 0), n(1, 1), n(1, 3),
  n(1, 3), n(1, 1), n(1, 0), n(2, 3),
  n(2, 1), n(2, 1), n(2, 3), n(1, 0),
  n(2, 3, 1.5), n(2, 1, 0.5), n(2, 1, 2),
];

/** Brilha, brilha, estrelinha (tradicional), cordas graves. */
export const TWINKLE: TabNote[] = [
  n(5, 3), n(5, 3), n(3, 0), n(3, 0),
  n(3, 2), n(3, 2), n(3, 0, 2),
  n(4, 3), n(4, 3), n(4, 2), n(4, 2),
  n(4, 0), n(4, 0), n(5, 3, 2),
  n(3, 0), n(3, 0), n(4, 3), n(4, 3),
  n(4, 2), n(4, 2), n(4, 0, 2),
  n(3, 0), n(3, 0), n(4, 3), n(4, 3),
  n(4, 2), n(4, 2), n(4, 0, 2),
];

/** Escala de Dó maior na primeira posição, subindo e descendo. */
export const C_MAJOR_SCALE: TabNote[] = [
  n(5, 3), n(4, 0), n(4, 2), n(4, 3),
  n(3, 0), n(3, 2), n(2, 0), n(2, 1),
  n(2, 1), n(2, 0), n(3, 2), n(3, 0),
  n(4, 3), n(4, 2), n(4, 0), n(5, 3),
];

/** Melodias originais da Pauta para leitura (CC BY-SA). */
export const MELODY_A: TabNote[] = [
  n(2, 1), n(2, 3), n(1, 0), n(2, 3),
  n(2, 1, 2), n(3, 0, 2),
  n(3, 2), n(2, 0), n(2, 1), n(2, 3),
  n(2, 1, 4),
];
export const MELODY_B: TabNote[] = [
  n(1, 3), n(1, 0), n(1, 1), n(2, 3),
  n(1, 0, 2), n(2, 1, 2),
  n(2, 3), n(1, 0), n(1, 1), n(1, 3),
  n(1, 0, 4),
];
export const MELODY_C: TabNote[] = [
  n(3, 0), n(3, 2), n(2, 0), n(3, 2),
  n(3, 0, 2), r(2),
  n(2, 1), n(2, 0), n(3, 2), n(2, 0),
  n(2, 1, 4),
];
export const MELODY_D: TabNote[] = [
  n(1, 0), n(2, 3), n(2, 1), n(2, 3),
  n(1, 0), n(1, 1), n(1, 3, 2),
  n(1, 1), n(1, 0), n(2, 3), r(1),
  n(2, 1, 4),
];

export const POSTURE = {
  w: "selfcheck" as const,
  id: "postura",
  title: "Checagem de postura",
  items: [
    { id: "perna", label: "A guitarra está apoiada na perna direita", hint: "Sentado, sem cruzar as pernas. O braço aponta um pouco para cima." },
    { id: "punho", label: "O punho esquerdo está reto", hint: "Sem dobrar para dentro. Dobra forte cansa e machuca." },
    { id: "polegar", label: "O polegar esquerdo fica atrás do braço", hint: "Mais ou menos na altura do dedo médio, sem apertar." },
    { id: "palheta", label: "A palheta está entre o polegar e a lateral do indicador", hint: "Só a pontinha aparece. Firme, mas sem esmagar." },
    { id: "ombros", label: "Os ombros estão soltos", hint: "Respire e solte. Tensão aparece primeiro no ombro." },
  ],
};

export const CLEAN_CHORD = (id: string) => ({
  w: "selfcheck" as const,
  id,
  title: "O acorde está limpo?",
  items: [
    { id: "pontas", label: "Os dedos estão na ponta, bem arqueados", hint: "Assim eles não encostam nas cordas vizinhas." },
    { id: "traste", label: "Cada dedo está logo atrás do traste", hint: "Quanto mais perto do traste, menos força você precisa." },
    { id: "corda", label: "Toquei corda por corda e todas soaram", hint: "Se uma corda morre, descubra qual dedo está encostando nela." },
    { id: "x", label: "As cordas com X ficaram de fora", hint: "Comece a batida na corda certa." },
  ],
});
