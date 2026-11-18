// Teclado · Mês 1 · dias 15 a 21
import type { Lesson } from "../types";
import {
  A4, B4, C3, C4, C5, C6, D5, E4, G3, G4,
  ODE_SIMPLE, PASSEIO, PONTE_C, PONTE_G, RH_G, SUBIDA, UP_DOWN, VALSINHA, VALSINHA_LH,
  lh, rh, seqOf, staffOf,
} from "./shared";

const M = 1;
const WIDE = { from: C3, to: C6 };
const HIGH = { from: C4 - 1, to: C5 + 7 };
const BOTH = { from: C3, to: C4 + 12 };
const UP_DOWN_G: [number, number][] = [[G4, 1], [A4, 1], [B4, 1], [C5, 1], [D5, 1], [C5, 1], [B4, 1], [A4, 1], [G4, 4]];
const LH_HOLD: [number, number][] = [[C3, 4], [C3, 4], [C3, 4]];

export const KEYBOARD_WEEK3: Lesson[] = [
  {
    day: 15,
    month: M,
    title: "Posição de Sol",
    minutes: 30,
    objectives: ["Mudar a mão direita para a posição de Sol", "Tocar Sol, Lá, Si, Dó e Ré com os dedos 1 a 5"],
    blocks: [
      {
        title: "Revisão: Hino à Alegria",
        minutes: 5,
        body: [{ w: "key-input" }, { w: "play-along", title: "Hino à Alegria", notes: rh(ODE_SIMPLE), bpm: 72, from: C4 - 5, to: C4 + 12, defaultMode: "tempo" }],
      },
      {
        title: "Mão um pouco mais para a direita",
        minutes: 8,
        body: [
          "Até agora a mão direita morou na posição de Dó. Hoje ela muda: **polegar no Sol** (o mesmo Sol do dedo 5 de antes) e os outros dedos em **Lá, Si, Dó e Ré**.",
          { w: "hand", name: "Posição de Sol", description: "Polegar no Sol 4, mínimo no Ré 5.", positions: [{ hand: "right", notes: [G4, A4, B4, C5, D5] }] },
          "Repare: o Dó agora é tocado pelo **dedo 4**. A nota é a mesma de sempre, o dedo é que muda conforme a posição.",
          { w: "find-keys", mode: "quiz", ...WIDE, targets: [9, 11], rounds: 10, title: "Lá ou Si" },
        ],
      },
      {
        title: "Escada em Sol",
        minutes: 12,
        body: [
          { w: "sequence", title: "1 2 3 4 5 4 3 2 1 em Sol", ...HIGH, notes: seqOf(UP_DOWN_G, RH_G), bpm: 60, goal: 3 },
          { w: "play-along", title: "Escada em Sol no tempo", notes: rh(UP_DOWN_G, RH_G), bpm: 60, ...HIGH, defaultMode: "tempo" },
        ],
      },
      {
        title: "Ouvido e criação",
        minutes: 5,
        body: [{ w: "key-echo", notes: [G4, B4, D5] }, "Invente uma frase na posição de Sol que termine no Sol."],
      },
    ],
  },
  {
    day: 16,
    month: M,
    title: "Lá, Si, Dó e Ré na pauta",
    minutes: 30,
    objectives: ["Ler as notas da posição de Sol na pauta", "Tocar a Subida lendo"],
    blocks: [
      {
        title: "Revisão: escada em Sol",
        minutes: 5,
        body: [{ w: "sequence", title: "Escada em Sol", ...HIGH, notes: seqOf(UP_DOWN_G, RH_G), bpm: 60, goal: 2 }],
      },
      {
        title: "Mais alto na pauta",
        minutes: 10,
        body: [
          "Continuando de onde parou: **Sol** na segunda linha, **Lá** no segundo espaço, **Si** na terceira linha (a do meio), **Dó** no terceiro espaço e **Ré** na quarta linha.",
          { w: "staff", notes: staffOf([[G4, 2], [A4, 2], [B4, 2], [C5, 2], [D5, 4]]), names: true },
          { w: "staff-quiz", notes: [G4, A4, B4, C5, D5], ...HIGH, rounds: 12, title: "Sol a Ré na pauta" },
          { callout: "theory", text: "Existem dois Dó perto da sua mão: o **Dó 4** (central, na linha suplementar embaixo) e o **Dó 5** (no terceiro espaço). Na pauta a altura é exata: o de baixo e o de cima são teclas diferentes." },
        ],
      },
      {
        title: "Subida",
        minutes: 10,
        body: [
          { w: "staff", notes: staffOf(SUBIDA), caption: "Subida, melodia original da Pauta." },
          { w: "play-along", title: "Subida", notes: rh(SUBIDA, RH_G), bpm: 66, ...HIGH, defaultMode: "wait" },
        ],
      },
      {
        title: "Ouvido",
        minutes: 5,
        body: [{ w: "key-echo", notes: [G4, A4, B4] }],
      },
    ],
  },
  {
    day: 17,
    month: M,
    title: "Ponto de aumento e o compasso 3/4",
    minutes: 30,
    objectives: ["Ler a mínima pontuada (3 tempos)", "Contar em 3: 1, 2, 3", "Sentir a valsa"],
    blocks: [
      {
        title: "Revisão: Subida",
        minutes: 5,
        body: [{ w: "play-along", title: "Subida", notes: rh(SUBIDA, RH_G), bpm: 66, ...HIGH, defaultMode: "tempo" }],
      },
      {
        title: "Três tempos por compasso",
        minutes: 10,
        body: [
          "Até agora todo compasso tinha 4 tempos (o **4/4**). No **3/4** cada compasso tem **3**: conta-se **1, 2, 3, 1, 2, 3**, com o 1 mais forte. É o compasso da valsa.",
          "O **ponto de aumento** depois de uma nota soma metade do valor dela. A mínima vale 2; **mínima pontuada vale 3**: enche um compasso de 3/4 inteiro.",
          { w: "staff", notes: staffOf([[C4, 1], [E4, 1], [G4, 1], [G4, 3]]), beatsPerBar: 3, caption: "Três semínimas e uma mínima pontuada em 3/4." },
          "Mude o metrônomo para **3/4** e conte junto, batendo o pé no 1.",
          { w: "metronome", bpm: 72 },
        ],
      },
      {
        title: "Escada em 3",
        minutes: 10,
        body: [
          "A escada da posição de Dó, agora em 3/4: duas semínimas e uma mínima, e uma mínima pontuada no fim.",
          {
            w: "play-along",
            title: "Escada em 3/4",
            notes: rh([[60, 1], [62, 1], [64, 1], [65, 2], [67, 1], [65, 1], [64, 1], [62, 1], [60, 3]]),
            bpm: 72,
            beatsPerBar: 3,
            from: C4 - 5,
            to: C4 + 12,
            defaultMode: "tempo",
          },
        ],
      },
      {
        title: "Criação",
        minutes: 5,
        body: ["Invente uma valsinha de 4 compassos: três notas no primeiro, uma longa (3 tempos) no último.", { w: "keys", from: C4 - 5, to: C4 + 12, names: "c-only" }],
      },
    ],
  },
  {
    day: 18,
    month: M,
    title: "Valsinha",
    minutes: 30,
    objectives: ["Tocar uma valsa de 8 compassos", "Segurar as mínimas pontuadas até o fim"],
    blocks: [
      {
        title: "Revisão: 3/4",
        minutes: 5,
        body: [{ w: "metronome", bpm: 72 }, "Conte 1, 2, 3 em voz alta por um minuto, batendo o pé no 1."],
      },
      {
        title: "A música",
        minutes: 7,
        body: [
          { w: "staff", notes: staffOf(VALSINHA), beatsPerBar: 3, caption: "Valsinha, original da Pauta." },
          { w: "play-along", title: "Só ouça", notes: [...rh(VALSINHA), ...lh(VALSINHA_LH)], bpm: 84, beatsPerBar: 3, ...BOTH, modes: ["listen"], defaultMode: "listen" },
        ],
      },
      {
        title: "Toque",
        minutes: 13,
        body: [
          "Você toca a melodia e o site faz o grave (uma mínima pontuada por compasso).",
          { w: "play-along", title: "Valsinha", notes: [...rh(VALSINHA), ...lh(VALSINHA_LH)], bpm: 84, beatsPerBar: 3, ...BOTH, defaultMode: "wait", auto: ["left"] },
        ],
      },
      {
        title: "Ouvido",
        minutes: 5,
        body: ["Ouça a valsa de novo e marque o 1 de cada compasso com a mão esquerda batendo na perna.", { w: "key-echo", notes: [C4, E4, G4] }],
      },
    ],
  },
  {
    day: 19,
    month: M,
    title: "Trocando de posição",
    minutes: 30,
    objectives: ["Mudar da posição de Dó para a de Sol durante a música", "Usar a pausa para levar a mão"],
    blocks: [
      {
        title: "Revisão: Valsinha",
        minutes: 5,
        body: [{ w: "play-along", title: "Valsinha", notes: [...rh(VALSINHA), ...lh(VALSINHA_LH)], bpm: 84, beatsPerBar: 3, ...BOTH, defaultMode: "tempo", auto: ["left"] }],
      },
      {
        title: "A pausa é para a mão viajar",
        minutes: 8,
        body: [
          "Músicas de verdade não ficam numa posição só. O truque é **trocar de posição numa pausa ou numa nota longa**: a mão inteira se levanta, anda e cai já com os dedos no lugar.",
          "Na **Ponte**, a primeira metade é na posição de Dó. Na pausa, a mão sobe: **polegar no Sol** e segue na posição de Sol.",
          { w: "staff", notes: staffOf([...PONTE_C, ...PONTE_G]), caption: "Ponte, original da Pauta. A pausa no compasso 2 é a hora de mudar." },
        ],
      },
      {
        title: "Ponte",
        minutes: 12,
        body: [
          { w: "play-along", title: "Ponte", notes: [...rh(PONTE_C), ...rh(PONTE_G, RH_G, 8)], bpm: 60, ...HIGH, defaultMode: "wait" },
          { callout: "tip", text: "Olhe para onde a mão vai **antes** da pausa. Quando a pausa chegar, a mão já sabe o caminho." },
        ],
      },
      {
        title: "Criação",
        minutes: 5,
        body: ["Faça a sua ponte: 4 notas na posição de Dó, uma pausa, 4 notas na de Sol.", { w: "keys", ...HIGH, names: "c-only" }],
      },
    ],
  },
  {
    day: 20,
    month: M,
    title: "Mãos juntas pela primeira vez",
    minutes: 30,
    objectives: ["Segurar uma nota longa na esquerda enquanto a direita anda", "Começar as duas mãos exatamente juntas"],
    blocks: [
      {
        title: "Revisão: Ponte",
        minutes: 5,
        body: [{ w: "play-along", title: "Ponte", notes: [...rh(PONTE_C), ...rh(PONTE_G, RH_G, 8)], bpm: 60, ...HIGH, defaultMode: "tempo" }],
      },
      {
        title: "Uma mão parada, outra andando",
        minutes: 6,
        body: [
          "Hoje as duas mãos tocam **ao mesmo tempo** pela primeira vez, do jeito mais simples: a esquerda aperta o **Dó grave e segura** por 4 tempos enquanto a direita sobe e desce.",
          "O começo é o momento mais difícil: as duas notas têm que sair **juntas**. Depois a esquerda só fica parada, segurando.",
          { callout: "warning", text: "Não deixe a esquerda soltar a nota quando a direita se mexe. Elas são independentes: isso é o que você está treinando." },
        ],
      },
      {
        title: "Juntas",
        minutes: 14,
        body: [
          "No modo **Esperar por mim**, a música só anda quando as duas notas do começo de cada compasso estão apertadas.",
          { w: "play-along", title: "Escada com Dó grave", notes: [...rh(UP_DOWN), ...lh(LH_HOLD)], bpm: 60, ...BOTH, defaultMode: "wait" },
          { w: "play-along", title: "Passeio com Dó grave", notes: [...rh(PASSEIO.slice(0, 12)), ...lh([[C3, 4], [C3, 4], [C3, 4], [C3, 4]])], bpm: 60, ...BOTH, defaultMode: "wait" },
        ],
      },
      {
        title: "Ouvido",
        minutes: 5,
        body: ["Grave e agudo juntos: toque Dó 3 com a esquerda e Dó 4 com a direita ao mesmo tempo. É a mesma nota, uma oitava de distância.", { w: "key-echo", notes: [C3, G3, C4] }],
      },
    ],
  },
  {
    day: 21,
    month: M,
    title: "Revisão da semana 3",
    minutes: 30,
    objectives: ["Ler Dó 4 a Ré 5 na pauta", "Trocar de posição sem parar", "Começar as duas mãos juntas"],
    blocks: [
      {
        title: "Leitura",
        minutes: 6,
        body: [{ w: "staff-quiz", notes: [C4, 62, E4, 65, G4, A4, B4, C5, D5], ...HIGH, rounds: 14, title: "Dó a Ré na pauta" }],
      },
      {
        title: "Repertório",
        minutes: 12,
        body: [
          { w: "play-along", title: "Subida", notes: rh(SUBIDA, RH_G), bpm: 72, ...HIGH, defaultMode: "tempo" },
          { w: "play-along", title: "Valsinha", notes: [...rh(VALSINHA), ...lh(VALSINHA_LH)], bpm: 84, beatsPerBar: 3, ...BOTH, defaultMode: "tempo", auto: ["left"] },
        ],
      },
      {
        title: "Mãos juntas",
        minutes: 7,
        body: [
          { w: "play-along", title: "Escada com Dó grave", notes: [...rh(UP_DOWN), ...lh(LH_HOLD)], bpm: 60, ...BOTH, defaultMode: "tempo" },
          {
            w: "selfcheck",
            id: "semana3",
            title: "Como foi a semana",
            items: [
              { id: "sol", label: "Mudo para a posição de Sol sem olhar muito" },
              { id: "valsa", label: "Conto em 3 sem me perder" },
              { id: "juntas", label: "As duas mãos começam juntas" },
            ],
          },
        ],
      },
      {
        title: "Livre",
        minutes: 5,
        body: ["Toque a Valsinha com a sua mão esquerda também: Dó grave no começo de cada compasso.", { w: "keys", ...BOTH, names: "c-only" }],
      },
    ],
  },
];
