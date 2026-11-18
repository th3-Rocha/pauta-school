// Teclado · Mês 1 · dias 22 a 30
import type { Lesson } from "../types";
import {
  A4, B4, C3, C4, C5, C6, D4, D5, E4, F4, G3, G4,
  CAMINHO, CAMINHO_LH, ODE, ODE_LH, SIGHT_1, SIGHT_2, SIGHT_3, TWINKLE, TWINKLE_LH,
  lh, rh, seqOf, staffOf,
} from "./shared";

const M = 1;
const WIDE = { from: C3, to: C6 };
const POS = { from: C4 - 5, to: C4 + 12 };
const BOTH = { from: C3, to: C4 + 12 };
const ALL_READ = [C4, D4, E4, F4, G4, A4, B4, C5, D5];

export const KEYBOARD_WEEK4: Lesson[] = [
  {
    day: 22,
    month: M,
    title: "Esticando até o Lá",
    minutes: 30,
    objectives: ["Alcançar uma nota fora da posição sem mudar a mão", "Tocar Brilha, brilha, estrelinha"],
    blocks: [
      {
        title: "Revisão: mãos juntas",
        minutes: 5,
        body: [
          { w: "key-input" },
          { w: "play-along", title: "Escada com Dó grave", notes: [...rh([[60, 1], [62, 1], [64, 1], [65, 1], [67, 1], [65, 1], [64, 1], [62, 1], [60, 4]]), ...lh([[C3, 4], [C3, 4], [C3, 4]])], bpm: 60, ...BOTH, defaultMode: "tempo" },
        ],
      },
      {
        title: "Extensão",
        minutes: 7,
        body: [
          "Às vezes a música pede uma nota logo depois da posição. Em vez de mudar a mão toda, o dedo **5 estica** até a tecla vizinha e volta.",
          "Em **Brilha, brilha, estrelinha** (canção tradicional, domínio público), a mão fica na posição de Dó e o 5 estica do Sol até o **Lá** nas duas vezes em que ele aparece.",
          { callout: "warning", text: "Estique abrindo a mão, sem girar o punho. Depois do Lá, a mão volta ao formato normal." },
        ],
      },
      {
        title: "Brilha, brilha",
        minutes: 13,
        body: [
          { w: "staff", notes: staffOf(TWINKLE), caption: "Brilha, brilha, estrelinha (tradicional)." },
          { w: "play-along", title: "Brilha, brilha, estrelinha", notes: rh(TWINKLE), bpm: 80, ...POS, defaultMode: "wait" },
        ],
      },
      {
        title: "Ouvido",
        minutes: 5,
        body: [{ w: "key-echo", notes: [C4, G4, A4] }],
      },
    ],
  },
  {
    day: 23,
    month: M,
    title: "Brilha, brilha com as duas mãos",
    minutes: 30,
    objectives: ["Tocar a esquerda com três notas: Dó, Fá e Sol", "Juntar com a melodia no modo Esperar"],
    blocks: [
      {
        title: "Revisão: Brilha, brilha",
        minutes: 5,
        body: [{ w: "play-along", title: "Brilha, brilha", notes: rh(TWINKLE), bpm: 80, ...POS, defaultMode: "tempo" }],
      },
      {
        title: "Três notas graves",
        minutes: 6,
        body: [
          "A esquerda fica na posição de Dó e usa três notas: **Dó (5)**, **Fá (2)** e **Sol (1)**. Elas são as fundamentais dos três acordes da música.",
          { w: "play-along", title: "Só a esquerda", notes: [...rh(TWINKLE), ...lh(TWINKLE_LH)], bpm: 80, ...BOTH, defaultMode: "wait", auto: ["right"] },
        ],
      },
      {
        title: "Juntas",
        minutes: 14,
        body: [
          "Agora as duas. Comece no **Esperar por mim**: a música só anda quando as notas que começam juntas estão apertadas.",
          { w: "play-along", title: "Brilha, brilha (duas mãos)", notes: [...rh(TWINKLE), ...lh(TWINKLE_LH)], bpm: 80, ...BOTH, defaultMode: "wait" },
          { callout: "tip", text: "Difícil? Faça só as duas primeiras linhas várias vezes antes de seguir. Pedaço pequeno bem feito rende mais do que a música inteira mal feita." },
        ],
      },
      {
        title: "Ouvido",
        minutes: 5,
        body: ["Fundamentais: depois do Dó grave vem Dó, Fá ou Sol?", { w: "key-echo", notes: [C3, 53, G3] }],
      },
    ],
  },
  {
    day: 24,
    month: M,
    title: "Hino à Alegria com o ritmo original",
    minutes: 30,
    objectives: ["Ler a semínima pontuada seguida de colcheia", "Tocar o Hino com a esquerda de apoio"],
    blocks: [
      {
        title: "Revisão: duas mãos",
        minutes: 5,
        body: [{ w: "play-along", title: "Brilha, brilha (duas mãos)", notes: [...rh(TWINKLE), ...lh(TWINKLE_LH)], bpm: 80, ...BOTH, defaultMode: "wait" }],
      },
      {
        title: "Pontuada e colcheia",
        minutes: 8,
        body: [
          "A **colcheia** vale meio tempo: duas cabem num clique. Tem uma bandeirinha na haste.",
          "A **semínima pontuada** vale 1 tempo e meio. Junto com uma colcheia, completa 2 tempos: **longa-curta**. Conte \"1 e 2 e\": a pontuada vai do 1 até o \"e\" do 1 e meio; a colcheia cai no \"e\" do 2.",
          { w: "staff", notes: staffOf([[E4, 1.5], [D4, 0.5], [D4, 2]]), caption: "O fim da primeira frase do Hino: pontuada, colcheia, mínima." },
        ],
      },
      {
        title: "O Hino de verdade",
        minutes: 12,
        body: [
          { w: "staff", notes: staffOf(ODE) },
          { w: "play-along", title: "Hino à Alegria (ritmo original)", notes: rh(ODE), bpm: 72, ...POS, defaultMode: "tempo" },
          { w: "play-along", title: "Com a esquerda", notes: [...rh(ODE), ...lh(ODE_LH)], bpm: 72, ...BOTH, defaultMode: "wait" },
        ],
      },
      {
        title: "Ouvido",
        minutes: 5,
        body: ["Toque o fim das frases das duas formas: tudo igual (simplificado) e longa-curta (original). Qual soa mais como a música que você conhece?", { w: "keys", ...POS, names: "c-only" }],
      },
    ],
  },
  {
    day: 25,
    month: M,
    title: "Leitura à primeira vista",
    minutes: 30,
    objectives: ["Ler frases que você nunca viu", "Não parar para corrigir"],
    blocks: [
      {
        title: "Revisão: leitura",
        minutes: 5,
        body: [{ w: "staff-quiz", notes: ALL_READ, from: C4 - 1, to: C5 + 7, rounds: 12, title: "Dó a Ré na pauta" }],
      },
      {
        title: "Antes de tocar, olhe",
        minutes: 5,
        body: [
          "Ler à primeira vista é tocar algo novo, do começo ao fim, sem parar. Antes, gaste 20 segundos olhando:",
          { list: ["Qual é a primeira nota? Coloque a mão na posição.", "Tem nota longa? Tem pausa?", "A melodia sobe ou desce? Pula ou vai de vizinha em vizinha?"], ordered: true },
        ],
      },
      {
        title: "Três frases novas",
        minutes: 15,
        body: [
          { w: "sequence", title: "Frase 1", ...POS, notes: seqOf(SIGHT_1), bpm: 60, goal: 1, staff: true, hideKeys: true },
          { w: "sequence", title: "Frase 2", ...POS, notes: seqOf(SIGHT_2), bpm: 60, goal: 1, staff: true, hideKeys: true },
          { w: "sequence", title: "Frase 3", ...POS, notes: seqOf(SIGHT_3), bpm: 60, goal: 1, staff: true, hideKeys: true },
        ],
      },
      {
        title: "Criação",
        minutes: 5,
        body: ["Escreva uma frase de 2 compassos no papel e dê para alguém (ou para você amanhã) ler à primeira vista."],
      },
    ],
  },
  {
    day: 26,
    month: M,
    title: "Improviso com cinco notas",
    minutes: 30,
    objectives: ["Improvisar na posição de Dó sobre um grave fixo", "Terminar as frases no Dó"],
    blocks: [
      {
        title: "Revisão: Hino",
        minutes: 5,
        body: [{ w: "play-along", title: "Hino à Alegria", notes: rh(ODE), bpm: 72, ...POS, defaultMode: "tempo" }],
      },
      {
        title: "Não existe nota errada",
        minutes: 5,
        body: [
          "Na posição de Dó, as cinco notas combinam com um grave em Dó. Então dá para inventar à vontade. As regras de hoje são só três:",
          { list: ["Toque no pulso do metrônomo.", "Faça frases curtas, com respiro (pausas) entre elas.", "Termine cada frase no **Dó**."], ordered: true },
        ],
      },
      {
        title: "Improviso",
        minutes: 15,
        body: [
          "Ligue o metrônomo a 70. A esquerda segura o **Dó grave** (aperte de novo a cada 4 tempos) e a direita improvisa.",
          { w: "metronome", bpm: 70 },
          { w: "keys", ...BOTH, names: "c-only", zones: [{ hand: "left", from: C3, to: C3, label: "Dó grave" }, { hand: "right", from: C4, to: G4, label: "Posição de Dó" }] },
          { callout: "selfCheck", text: "Grave 1 minuto do seu improviso. Ouvindo, dá para perceber onde cada frase começa e termina?" },
        ],
      },
      {
        title: "Ouvido",
        minutes: 5,
        body: [{ w: "key-echo", notes: [C4, E4, G4] }],
      },
    ],
  },
  {
    day: 27,
    month: M,
    title: "Revisão geral de leitura",
    minutes: 30,
    objectives: ["Ler qualquer nota de Dó 4 a Ré 5", "Achar qualquer branca no teclado inteiro"],
    blocks: [
      {
        title: "Mapa",
        minutes: 5,
        body: [{ w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 2, 4, 5, 7, 9, 11], rounds: 14, title: "Qualquer branca" }],
      },
      {
        title: "Pauta",
        minutes: 10,
        body: [{ w: "staff-quiz", notes: ALL_READ, from: C4 - 1, to: C5 + 7, rounds: 20, title: "Dó a Ré na pauta" }],
      },
      {
        title: "A peça do desafio",
        minutes: 10,
        body: [
          "Conheça a música do desafio do mês: **Caminho de casa**. Hoje só ouça e leia. Amanhã você começa a tocar.",
          { w: "staff", notes: staffOf(CAMINHO), caption: "Caminho de casa, melodia original da Pauta." },
          { w: "play-along", title: "Só ouça", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, modes: ["listen"], defaultMode: "listen" },
        ],
      },
      {
        title: "Ouvido",
        minutes: 5,
        body: ["Cante a melodia do Caminho de casa junto com o site. Quem canta, toca melhor.", { w: "key-echo", notes: [C4, D4, E4] }],
      },
    ],
  },
  {
    day: 28,
    month: M,
    title: "Ensaio do desafio: cada mão",
    minutes: 30,
    objectives: ["Tocar a melodia do Caminho de casa no tempo", "Tocar o grave do Caminho de casa no tempo"],
    blocks: [
      {
        title: "Revisão: leitura da peça",
        minutes: 5,
        body: [{ w: "sequence", title: "Caminho de casa, devagar", ...POS, notes: seqOf(CAMINHO), bpm: 60, goal: 1, staff: true }],
      },
      {
        title: "Mão direita",
        minutes: 10,
        body: [{ w: "play-along", title: "Você na direita", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo", auto: ["left"] }],
      },
      {
        title: "Mão esquerda",
        minutes: 10,
        body: [
          "A esquerda só tem Dó e Sol, em mínimas. Parece fácil; o difícil é não atrasar.",
          { w: "play-along", title: "Você na esquerda", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo", auto: ["right"] },
        ],
      },
      {
        title: "Ouvido",
        minutes: 5,
        body: [{ w: "key-echo", notes: [C3, G3, C4] }],
      },
    ],
  },
  {
    day: 29,
    month: M,
    title: "Ensaio do desafio: mãos juntas",
    minutes: 30,
    objectives: ["Tocar o Caminho de casa com as duas mãos", "Subir a velocidade aos poucos até 60 BPM"],
    blocks: [
      {
        title: "Revisão: cada mão",
        minutes: 5,
        body: [{ w: "play-along", title: "Você na direita", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo", auto: ["left"] }],
      },
      {
        title: "Esperar por mim",
        minutes: 8,
        body: [{ w: "play-along", title: "Caminho de casa (duas mãos)", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, defaultMode: "wait" }],
      },
      {
        title: "No tempo, subindo",
        minutes: 12,
        body: [
          "Agora **No tempo**: 50%, depois 75%, depois a velocidade cheia. Só suba quando passar de 80%.",
          { w: "play-along", title: "Caminho de casa (duas mãos)", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo" },
          { callout: "tip", text: "Amanhã é o desafio. Se hoje não chegou a 80% na velocidade cheia, tudo bem: o desafio fica aberto e você volta nele quando quiser." },
        ],
      },
      {
        title: "Descanso",
        minutes: 5,
        body: ["Toque a música que você mais gostou do mês, só por prazer.", { w: "keys", ...BOTH, names: "c-only" }],
      },
    ],
  },
  {
    day: 30,
    month: M,
    title: "Desafio do mês 1",
    minutes: 30,
    objectives: ["Tocar o Caminho de casa com as duas mãos a 60 BPM", "Achar qualquer nota natural sem olhar nomes"],
    blocks: [
      {
        title: "Aquecimento",
        minutes: 5,
        body: [
          { w: "key-input" },
          { w: "sequence", title: "1 2 3 4 5 4 3 2 1", from: C4 - 5, to: C4 + 12, notes: seqOf([[60, 1], [62, 1], [64, 1], [65, 1], [67, 1], [65, 1], [64, 1], [62, 1], [60, 4]]), bpm: 60, goal: 2 },
        ],
      },
      {
        title: "Parte 1: o mapa",
        subtitle: "Qualquer branca, sem nomes",
        minutes: 5,
        body: ["Meta: **80%** ou mais.", { w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 2, 4, 5, 7, 9, 11], rounds: 20, title: "Qualquer branca" }],
      },
      {
        title: "Parte 2: Caminho de casa",
        subtitle: "Duas mãos, no tempo",
        minutes: 15,
        body: [
          "Toque no modo **No tempo**. Comece mais devagar se precisar e suba até 60 BPM. Quando passar de 80%, registre o maior BPM que tocou limpo.",
          { w: "play-along", title: "Caminho de casa (duas mãos)", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo" },
          { w: "bpmlog", month: 1, target: 60 },
        ],
      },
      {
        title: "Fechando o mês",
        minutes: 5,
        body: [
          {
            w: "selfcheck",
            id: "mes1",
            title: "O que você sabe agora",
            items: [
              { id: "mapa", label: "Acho qualquer tecla branca pelos grupos de pretas" },
              { id: "dedos", label: "Uso os dedos certos nas posições de Dó e de Sol" },
              { id: "le", label: "Leio de Dó 4 a Ré 5 na clave de Sol" },
              { id: "ritmo", label: "Conto semínima, mínima, semibreve, pontuada e pausa" },
              { id: "maos", label: "Toco uma melodia com a esquerda segurando o grave" },
            ],
          },
          "Parabéns pelo primeiro mês. No mês 2 chegam a **escala maior**, a **passagem do polegar** e os primeiros **acordes**.",
        ],
      },
    ],
  },
];
