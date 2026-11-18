// Teclado · Mês 1 · dias 8 a 14
import type { Lesson } from "../types";
import {
  C3, C4, C6, D4, E4, F4, G4, E3, G3,
  MARY, ODE_SIMPLE, PASSEIO, PASSEIO_LH, PERGUNTA_LH, PERGUNTA_RH,
  lh, rh, seqOf, staffOf,
} from "./shared";

const M = 1;
const WIDE = { from: C3, to: C6 };
const POS = { from: C4 - 5, to: C4 + 12 };
const BOTH = { from: C3, to: C4 + 12 };
const FIVE = [C4, D4, E4, F4, G4];

export const KEYBOARD_WEEK2: Lesson[] = [
  {
    day: 8,
    month: M,
    title: "Linhas e espaços",
    minutes: 30,
    objectives: [
      "Ler Dó, Ré, Mi, Fá e Sol na pauta",
      "Distinguir nota na linha de nota no espaço",
      "Ler uma frase curta sem olhar o teclado",
    ],
    blocks: [
      {
        title: "Revisão: mapa",
        minutes: 4,
        body: [
          { w: "key-input" },
          { w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 2, 4, 5, 7, 9, 11], rounds: 10, title: "Qualquer branca" },
        ],
      },
      {
        title: "Linha, espaço, linha, espaço",
        minutes: 10,
        body: [
          "Repare no desenho: o **Dó** tem uma linha passando pelo meio (a suplementar). O **Ré** fica pendurado embaixo da pauta. O **Mi** é cortado pela primeira linha. O **Fá** fica no primeiro espaço. O **Sol** é cortado pela segunda linha.",
          "Ou seja: **linha, espaço, linha, espaço, linha**. Cada degrau na pauta é uma tecla branca vizinha.",
          { w: "staff", notes: staffOf([[C4, 2], [D4, 2], [E4, 2], [F4, 2], [G4, 4]]), names: true },
          { w: "staff-quiz", notes: FIVE, ...POS, rounds: 12, title: "Dó a Sol na pauta" },
        ],
      },
      {
        title: "Lendo frases",
        minutes: 11,
        body: [
          "A primeira metade de uma música que você vai tocar amanhã. Leia na pauta: o teclado não ajuda.",
          { w: "sequence", title: "Leitura", ...POS, notes: seqOf(MARY.slice(0, 13)), bpm: 60, goal: 2, staff: true, hideKeys: true },
          { callout: "tip", text: "Olhe uma nota à frente. Enquanto toca uma, os olhos já procuram a próxima." },
        ],
      },
      {
        title: "Ouvido e criação",
        minutes: 5,
        body: [{ w: "key-echo", notes: [C4, D4, E4] }, "Invente uma frase de 8 notas só com linhas (Dó, Mi, Sol) e depois uma só com espaços (Ré, Fá)."],
      },
    ],
  },
  {
    day: 9,
    month: M,
    title: "Maria tinha um carneirinho",
    minutes: 30,
    objectives: ["Ler uma música inteira na pauta", "Tocar com as notas longas no tempo certo", "Chegar a 80% no modo No tempo"],
    blocks: [
      {
        title: "Revisão: leitura",
        minutes: 5,
        body: [{ w: "staff-quiz", notes: FIVE, ...POS, rounds: 10, title: "Dó a Sol na pauta" }],
      },
      {
        title: "A música na pauta",
        minutes: 8,
        body: [
          "Uma canção tradicional, de domínio público, que cabe toda na posição de Dó. Leia primeiro, sem tocar: quais notas aparecem? Onde estão as mínimas e a semibreve?",
          { w: "staff", notes: staffOf(MARY), caption: "Maria tinha um carneirinho (tradicional)." },
          { w: "play-along", title: "Só ouça", notes: rh(MARY), bpm: 72, ...POS, modes: ["listen"], defaultMode: "listen" },
        ],
      },
      {
        title: "Toque",
        minutes: 12,
        body: [
          "Primeiro **Esperar por mim**, depois **No tempo**.",
          { w: "play-along", title: "Maria tinha um carneirinho", notes: rh(MARY), bpm: 72, ...POS, defaultMode: "wait" },
          { callout: "selfCheck", text: "As três notas repetidas (Mi Mi Mi) saíram iguais, sem a última mais fraca? Repetir a mesma tecla pede soltar e tocar de novo, não só apertar mais." },
        ],
      },
      {
        title: "Ouvido e criação",
        minutes: 5,
        body: [{ w: "key-echo", notes: [C4, E4, G4] }, "Mude o fim da música: troque os dois últimos compassos por notas suas, terminando no Dó."],
      },
    ],
  },
  {
    day: 10,
    month: M,
    title: "Pergunta e resposta",
    minutes: 30,
    objectives: ["Revezar as mãos sem perder o pulso", "Usar a pausa de uma mão para preparar a outra"],
    blocks: [
      {
        title: "Revisão: Maria",
        minutes: 5,
        body: [{ w: "play-along", title: "Maria tinha um carneirinho", notes: rh(MARY), bpm: 72, ...POS, defaultMode: "tempo" }],
      },
      {
        title: "Uma mão pergunta, a outra responde",
        minutes: 6,
        body: [
          "Nesta música as mãos **não tocam juntas**: a direita toca dois compassos, para, e a esquerda responde. Enquanto uma toca, a outra fica **parada em cima das teclas**, pronta.",
          "Nas barras caindo, a cor diz a mão: **rosa (D) é a direita**, **azul hachurado (E) é a esquerda**.",
        ],
      },
      {
        title: "Pergunta e resposta",
        minutes: 14,
        body: [
          { w: "play-along", title: "Pergunta e resposta", notes: [...rh(PERGUNTA_RH), ...lh(PERGUNTA_LH)], bpm: 60, ...BOTH, defaultMode: "wait" },
          "Agora no tempo. A pausa de uma mão é exatamente o tempo da outra: conte sempre.",
          { w: "metronome", bpm: 60 },
        ],
      },
      {
        title: "Criação",
        minutes: 5,
        body: [
          "Invente a sua: a direita pergunta com 3 ou 4 notas, a esquerda responde imitando o ritmo. Toque no metrônomo.",
          { w: "keys", ...BOTH, names: "c-only" },
        ],
      },
    ],
  },
  {
    day: 11,
    month: M,
    title: "A mão esquerda de apoio",
    minutes: 30,
    objectives: [
      "Tocar as notas graves da música (as fundamentais) na mão esquerda",
      "Acompanhar enquanto o site toca a melodia",
      "Tocar a melodia enquanto o site faz o grave",
    ],
    blocks: [
      {
        title: "Revisão: pergunta e resposta",
        minutes: 5,
        body: [{ w: "play-along", title: "Pergunta e resposta", notes: [...rh(PERGUNTA_RH), ...lh(PERGUNTA_LH)], bpm: 60, ...BOTH, defaultMode: "tempo" }],
      },
      {
        title: "Fundamental",
        minutes: 6,
        body: [
          "Muita música tem uma nota grave que sustenta a melodia: a **fundamental** do acorde. No Passeio, ela alterna entre **Dó** e **Sol**, sempre em mínimas (2 tempos).",
          "Na posição de Dó da esquerda, o Dó é o **5** e o Sol é o **1**. A mão não precisa sair do lugar.",
        ],
      },
      {
        title: "Você no grave, o site na melodia",
        minutes: 14,
        body: [
          "Primeiro você toca só a **esquerda** e o site toca a melodia. Depois o contrário.",
          { w: "play-along", title: "Passeio: você na esquerda", notes: [...rh(PASSEIO), ...lh(PASSEIO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo", auto: ["right"] },
          { w: "play-along", title: "Passeio: você na direita", notes: [...rh(PASSEIO), ...lh(PASSEIO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo", auto: ["left"] },
          { callout: "tip", text: "Tocando a esquerda, ouça a melodia: o seu Dó ou Sol tem que cair junto com a nota dela no começo de cada mínima." },
        ],
      },
      {
        title: "Ouvido",
        minutes: 5,
        body: ["Grave: Dó, Mi ou Sol?", { w: "key-echo", notes: [C3, E3, G3] }],
      },
    ],
  },
  {
    day: 12,
    month: M,
    title: "Forte e piano",
    minutes: 30,
    objectives: ["Tocar fraco (piano) e forte de propósito", "Controlar o volume pelo peso do braço, não pela força do dedo"],
    blocks: [
      {
        title: "Revisão: esquerda de apoio",
        minutes: 5,
        body: [{ w: "play-along", title: "Passeio: você na esquerda", notes: [...rh(PASSEIO), ...lh(PASSEIO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo", auto: ["right"] }],
      },
      {
        title: "Dinâmica",
        minutes: 8,
        body: [
          "No teclado sensível ao toque, a velocidade com que a tecla desce decide o volume. Na partitura isso se chama **dinâmica**: **p** (piano) é fraco, **mf** (meio forte) é médio, **f** (forte) é forte.",
          "O volume vem do **peso do braço**, não de apertar com o dedo. Para o forte, deixe o braço cair um pouco mais rápido. Para o piano, encoste quase sem peso.",
          { callout: "warning", text: "Forte não é bater. Se o punho endurece ou o som fica estalado, alivie." },
        ],
      },
      {
        title: "Piano, depois forte",
        minutes: 12,
        body: [
          "Toque o Passeio inteiro **piano**. Depois inteiro **forte**. Com MIDI, o medidor mostra se você ficou na faixa.",
          { w: "dynamics", target: "p" },
          { w: "play-along", title: "Passeio", notes: rh(PASSEIO), bpm: 60, ...POS, defaultMode: "wait" },
          { w: "dynamics", target: "f" },
        ],
      },
      {
        title: "Criação",
        minutes: 5,
        body: ["Toque a sua melodia de pergunta e resposta: a pergunta **forte**, a resposta **piano**, como um eco.", { w: "keys", ...BOTH, names: "c-only" }],
      },
    ],
  },
  {
    day: 13,
    month: M,
    title: "Hino à Alegria",
    minutes: 30,
    objectives: ["Ler e tocar uma música de 8 compassos", "Manter o pulso nas mínimas do fim de cada frase"],
    blocks: [
      {
        title: "Revisão: leitura",
        minutes: 5,
        body: [{ w: "staff-quiz", notes: FIVE, ...POS, rounds: 10, title: "Dó a Sol na pauta" }],
      },
      {
        title: "A música",
        minutes: 7,
        body: [
          "O tema da Nona Sinfonia de Beethoven (domínio público), numa versão com ritmo simplificado. Cabe inteiro na posição de Dó.",
          { w: "staff", notes: staffOf(ODE_SIMPLE), caption: "Hino à Alegria (Beethoven), ritmo simplificado." },
          "Repare: as duas frases começam iguais e só o fim muda. A primeira termina no **Ré** (parece que falta algo), a segunda no **Dó** (fecha).",
        ],
      },
      {
        title: "Toque",
        minutes: 13,
        body: [{ w: "play-along", title: "Hino à Alegria", notes: rh(ODE_SIMPLE), bpm: 72, ...POS, defaultMode: "wait" }],
      },
      {
        title: "Ouvido",
        subtitle: "Fecha ou não fecha?",
        minutes: 5,
        body: ["Toque a primeira frase e pare no Ré. Depois a segunda e pare no Dó. Sinta a diferença: o Dó é a **casa** da música.", { w: "key-echo", notes: [C4, D4, E4] }],
      },
    ],
  },
  {
    day: 14,
    month: M,
    title: "Revisão da semana 2",
    minutes: 30,
    objectives: ["Ler Dó a Sol rápido", "Tocar Maria e o Hino no tempo", "Revezar as mãos sem parar"],
    blocks: [
      {
        title: "Leitura",
        minutes: 5,
        body: [{ w: "staff-quiz", notes: FIVE, ...POS, rounds: 12, title: "Dó a Sol na pauta" }],
      },
      {
        title: "Repertório",
        minutes: 10,
        body: [
          { w: "play-along", title: "Maria tinha um carneirinho", notes: rh(MARY), bpm: 72, ...POS, defaultMode: "tempo" },
          { w: "play-along", title: "Hino à Alegria", notes: rh(ODE_SIMPLE), bpm: 72, ...POS, defaultMode: "tempo" },
        ],
      },
      {
        title: "Duas mãos",
        minutes: 10,
        body: [
          { w: "play-along", title: "Pergunta e resposta", notes: [...rh(PERGUNTA_RH), ...lh(PERGUNTA_LH)], bpm: 66, ...BOTH, defaultMode: "tempo" },
          {
            w: "selfcheck",
            id: "semana2",
            title: "Como foi a semana",
            items: [
              { id: "le", label: "Leio Dó a Sol na pauta sem contar linhas" },
              { id: "musicas", label: "Maria e o Hino com 80% ou mais" },
              { id: "maos", label: "Revezo as mãos sem perder o pulso" },
            ],
          },
        ],
      },
      {
        title: "Livre",
        minutes: 5,
        body: ["Toque a música que mais gostou desta semana, de cor, sem olhar a tela.", { w: "keys", ...BOTH, names: "none" }],
      },
    ],
  },
];
