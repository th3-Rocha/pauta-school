// Teclado · Mês 1 · dias 3 a 7
import type { Lesson } from "../types";
import {
  C3, C4, C6, D4, E4, F4, G4, E3, G3,
  ESCADA_LH, LH_C, PASSEIO, RITMO, UP_DOWN,
  lh, rh, seqOf, staffOf,
} from "./shared";

const M = 1;
const WIDE = { from: C3, to: C6 };
const POS = { from: C4 - 5, to: C4 + 12 };
const BOTH = { from: C3, to: C4 + 12 };

export const KEYBOARD_WEEK1: Lesson[] = [
  {
    day: 3,
    month: M,
    title: "Todas as teclas brancas",
    minutes: 30,
    objectives: [
      "Achar Lá e Si pelo grupo de 3 pretas",
      "Dizer as 7 notas em ordem, em português e em cifra",
      "Tocar o Passeio no tempo com 80% de acerto",
    ],
    blocks: [
      {
        title: "Revisão: Dó, Fá e Sol",
        minutes: 5,
        body: [
          "Dó pelo grupo de 2, Fá e Sol pelo grupo de 3. Sem olhar nomes.",
          { w: "key-input" },
          { w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 5, 7], rounds: 10, title: "Dó, Fá ou Sol" },
        ],
      },
      {
        title: "Lá e Si",
        subtitle: "Completando as sete notas",
        minutes: 8,
        body: [
          "No grupo de 3 pretas ainda sobraram duas brancas. O **Lá** fica entre a segunda e a terceira preta; o **Si** é a branca logo depois da terceira. Depois do Si vem de novo um grupo de 2, e o Dó recomeça.",
          { callout: "theory", text: "As 7 notas: **Dó Ré Mi Fá Sol Lá Si**. Em cifra: **C D E F G A B**. A cifra começa no Lá (A) por motivo histórico, por isso o Dó é C. Vale decorar as duas." },
          {
            w: "keys",
            ...POS,
            names: "all",
            markers: [{ midi: 69, kind: "in", label: "Lá" }, { midi: 71, kind: "in", label: "Si" }],
            caption: "Lá e Si no fim do grupo de 3 pretas.",
          },
          { w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 2, 4, 5, 7, 9, 11], rounds: 14, title: "Qualquer branca" },
        ],
      },
      {
        title: "Passeio no tempo",
        subtitle: "A música de ontem, agora sem a música esperar você",
        minutes: 12,
        body: [
          "Aqueça com a sequência de ontem, depois toque o **Passeio** no modo **No tempo**. Se ficar abaixo de 80%, baixe para 75% da velocidade e suba de novo depois.",
          { w: "sequence", title: "Aquecimento", ...POS, notes: seqOf(UP_DOWN), bpm: 60, goal: 2 },
          { w: "play-along", title: "Passeio", notes: rh(PASSEIO), bpm: 60, ...POS, defaultMode: "tempo" },
          { callout: "tip", text: "Errou uma nota no tempo? Não pare. A música continua e você entra de novo na próxima. Parar a cada erro treina parar." },
        ],
      },
      {
        title: "Ouvido e criação",
        minutes: 5,
        body: [
          "Depois do Dó de referência vem Dó, Mi ou Sol.",
          { w: "key-echo", notes: [C4, E4, G4] },
          "Agora use as **sete notas**: invente uma frase que comece no Dó, suba até o Lá ou o Si e volte para o Dó.",
          { w: "keys", ...POS, names: "c-only" },
        ],
      },
    ],
  },
  {
    day: 4,
    month: M,
    title: "A mão esquerda",
    minutes: 30,
    objectives: [
      "Numerar os dedos da mão esquerda (o polegar também é o 1)",
      "Colocar a mão esquerda na posição de Dó, uma oitava abaixo",
      "Tocar a escada 5-4-3-2-1 com a mão esquerda",
    ],
    blocks: [
      {
        title: "Revisão: as sete notas",
        minutes: 5,
        body: [{ w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 2, 4, 5, 7, 9, 11], rounds: 10, title: "Qualquer branca" }],
      },
      {
        title: "Os dedos da mão esquerda",
        subtitle: "Mesmos números, ordem espelhada",
        minutes: 8,
        body: [
          "A mão esquerda usa os mesmos números: **polegar = 1, mínimo = 5**. Só que ela é o espelho da direita: na posição de Dó, o **mínimo (5) fica no Dó** e o **polegar (1) fica no Sol**.",
          "Coloque a mão esquerda uma oitava abaixo do Dó central: é o **Dó 3**. Os cinco dedos ficam em Dó, Ré, Mi, Fá, Sol, um por tecla.",
          {
            w: "hand",
            name: "Posição de Dó, mão esquerda",
            description: "Mínimo no Dó 3, polegar no Sol 3.",
            positions: [{ hand: "left", notes: [G3, 53, E3, 50, C3] }],
          },
          { callout: "warning", text: "A mão esquerda costuma ser mais fraca e mais lenta. É normal. Trabalhe devagar: ela alcança a direita em algumas semanas." },
        ],
      },
      {
        title: "Escada da mão esquerda",
        minutes: 12,
        body: [
          "Toque de baixo para cima e volte: **5 4 3 2 1 2 3 4 5**. Repare que, na esquerda, subir as notas é ir do 5 para o 1.",
          { w: "sequence", title: "5 4 3 2 1 2 3 4 5", hand: "left", from: C3 - 2, to: C4 + 2, notes: seqOf(ESCADA_LH, LH_C), bpm: 60, goal: 3 },
          { w: "play-along", title: "Escada no tempo", notes: lh(ESCADA_LH), bpm: 60, from: C3 - 2, to: C4 + 2, defaultMode: "wait" },
          {
            w: "selfcheck",
            id: "me",
            items: [
              { id: "curvo", label: "Dedos curvos também na esquerda" },
              { id: "mindo", label: "O mínimo toca com a ponta, sem deitar" },
              { id: "punho", label: "Punho solto, sem cair abaixo das teclas" },
            ],
          },
        ],
      },
      {
        title: "Ouvido e criação",
        subtitle: "Notas graves",
        minutes: 5,
        body: [
          "Agora a referência é o Dó grave. Qual veio depois: Dó, Mi ou Sol?",
          { w: "key-echo", notes: [C3, E3, G3] },
          "Invente uma frase só com a mão esquerda, terminando no Dó 3. Notas graves soam bem devagar: experimente notas longas.",
          { w: "keys", from: C3 - 2, to: C4 + 2, names: "c-only", zones: [{ hand: "left", from: C3, to: G3, label: "Posição de Dó" }] },
        ],
      },
    ],
  },
  {
    day: 5,
    month: M,
    title: "Pulso, figuras e pausas",
    minutes: 30,
    objectives: [
      "Contar o pulso em voz alta junto com o metrônomo",
      "Reconhecer semínima (1), mínima (2) e semibreve (4 tempos)",
      "Fazer a pausa: silêncio de verdade, levantando o dedo",
    ],
    blocks: [
      {
        title: "Revisão: escada da esquerda",
        minutes: 5,
        body: [{ w: "sequence", title: "5 4 3 2 1 2 3 4 5", hand: "left", from: C3 - 2, to: C4 + 2, notes: seqOf(ESCADA_LH, LH_C), bpm: 60, goal: 2 }],
      },
      {
        title: "Quanto tempo dura cada nota",
        minutes: 10,
        body: [
          "O **pulso** é a batida constante da música, a que você marca com o pé. O metrônomo faz esse pulso. Cada clique é um **tempo**.",
          {
            list: [
              "**Semínima**: dura 1 tempo. Bolinha preenchida com haste.",
              "**Mínima**: dura 2 tempos. Bolinha vazada com haste.",
              "**Semibreve**: dura 4 tempos. Bolinha vazada, sem haste.",
              "**Pausa**: silêncio pelo mesmo tempo. A de semínima parece um raio.",
            ],
          },
          { w: "staff", notes: staffOf(RITMO), caption: "O exercício de hoje na pauta: semínimas, mínimas, pausas e uma semibreve no fim." },
          "Conte em voz alta **1, 2, 3, 4** junto com o metrônomo antes de tocar. Na pausa, **levante o dedo**: a tecla tem que subir para o som parar.",
          { w: "metronome", bpm: 60 },
        ],
      },
      {
        title: "Ritmo no teclado",
        minutes: 10,
        body: [
          "Só três notas (Dó, Mi, Sol), mas cada uma com sua duração. Nas barras caindo, a duração é o comprimento; na pauta, é o desenho da nota.",
          { w: "play-along", title: "Ritmo com pausas", notes: rh(RITMO), bpm: 60, ...POS, defaultMode: "tempo" },
          { callout: "selfCheck", text: "Segurou a mínima pelos dois tempos inteiros? Soltou o dedo na pausa? Os dois erros mais comuns são encurtar a nota longa e emendar na pausa." },
        ],
      },
      {
        title: "Ouvido",
        subtitle: "Quantos tempos durou?",
        minutes: 5,
        body: ["O metrônomo conta 4 tempos e uma nota soa. Ela durou 1, 2 ou 4 tempos?", { w: "ear", kind: "duration" }],
      },
    ],
  },
  {
    day: 6,
    month: M,
    title: "A clave de Sol",
    minutes: 30,
    objectives: [
      "Saber o que são pauta, linha, espaço e clave",
      "Achar o Dó central na pauta (a linha suplementar)",
      "Ler Dó, Ré e Mi na pauta e tocar no teclado",
    ],
    blocks: [
      {
        title: "Revisão: ritmo",
        minutes: 5,
        body: [{ w: "play-along", title: "Ritmo com pausas", notes: rh(RITMO), bpm: 60, ...POS, defaultMode: "tempo" }],
      },
      {
        title: "A pauta",
        subtitle: "Cinco linhas que dizem a altura",
        minutes: 10,
        body: [
          "A **pauta** tem 5 linhas e 4 espaços. Cada linha e cada espaço é uma nota branca: subindo na pauta, você sobe no teclado, uma tecla branca por degrau.",
          "A **clave de Sol** (o desenho no começo) diz quais são as notas. Ela é usada para a **mão direita**. Nela, o **Dó central fica numa linha pequena abaixo da pauta**, a linha suplementar. Daí para cima: Ré no espaço logo abaixo da pauta, Mi na primeira linha, Fá no primeiro espaço, Sol na segunda linha.",
          { w: "staff", notes: staffOf([[C4, 1], [D4, 1], [E4, 1], [F4, 1], [G4, 4]]), names: true, caption: "A posição de Dó na pauta: Dó, Ré, Mi, Fá e Sol." },
          { w: "staff-quiz", notes: [C4, D4, E4], ...POS, rounds: 10, title: "Dó, Ré ou Mi na pauta" },
        ],
      },
      {
        title: "Lendo a escada",
        minutes: 10,
        body: [
          "A mesma escada do dia 1, agora lida na pauta. O teclado **não mostra** onde tocar: olhe só a pauta.",
          { w: "sequence", title: "Lendo: sobe e desce", ...POS, notes: seqOf(UP_DOWN), bpm: 60, goal: 2, staff: true, hideKeys: true },
          { callout: "tip", text: "Leia pela distância, não pelo nome: se a próxima nota está um degrau acima, é a tecla branca vizinha. Com o tempo o nome vem sozinho." },
        ],
      },
      {
        title: "Ouvido e criação",
        minutes: 5,
        body: [
          { w: "key-echo", notes: [C4, E4, G4] },
          "Escreva no papel uma melodia de 4 notas com Dó, Ré e Mi, desenhando a pauta. Depois toque o que escreveu.",
        ],
      },
    ],
  },
  {
    day: 7,
    month: M,
    title: "Revisão da semana 1",
    minutes: 30,
    objectives: ["Achar qualquer branca rápido", "Tocar o Passeio no tempo", "Ler Dó a Sol na pauta"],
    blocks: [
      {
        title: "Mapa do teclado",
        minutes: 5,
        body: [
          "Hoje não tem nada novo: é dia de juntar o que você viu. Comece pelo mapa.",
          { w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 2, 4, 5, 7, 9, 11], rounds: 14, title: "Qualquer branca" },
        ],
      },
      {
        title: "Leitura",
        minutes: 7,
        body: [{ w: "staff-quiz", notes: [C4, D4, E4, F4, G4], ...POS, rounds: 10, title: "Dó a Sol na pauta" }],
      },
      {
        title: "As duas mãos, uma de cada vez",
        minutes: 13,
        body: [
          "Mão direita no Passeio, mão esquerda na escada. Os dois no modo **No tempo**.",
          { w: "play-along", title: "Passeio", notes: rh(PASSEIO), bpm: 60, ...POS, defaultMode: "tempo" },
          { w: "play-along", title: "Escada da esquerda", notes: lh(ESCADA_LH), bpm: 60, from: C3 - 2, to: C4 + 2, defaultMode: "tempo" },
          {
            w: "selfcheck",
            id: "semana1",
            title: "Como foi a semana",
            items: [
              { id: "mapa", label: "Acho qualquer branca sem pensar muito" },
              { id: "passeio", label: "Passeio com 80% ou mais no tempo" },
              { id: "le", label: "Leio Dó a Sol na pauta" },
            ],
          },
        ],
      },
      {
        title: "Livre",
        minutes: 5,
        body: [
          "Toque o que quiser com as duas mãos, uma de cada vez. Que tal a sua melodia do dia 1, agora na mão esquerda?",
          { w: "keys", ...BOTH, names: "c-only" },
        ],
      },
    ],
  },
];
