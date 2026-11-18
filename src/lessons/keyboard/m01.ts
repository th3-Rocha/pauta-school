// Teclado · Mês 1
import type { Lesson } from "../types";

const M = 1;
// Dó 3, Dó 4 (central), Dó 5, Dó 6
const C3 = 48;
const C4 = 60;
const C6 = 84;

export const KEYBOARD_M01: Lesson[] = [
  {
    day: 1,
    month: M,
    title: "O mapa das teclas pretas",
    minutes: 30,
    objectives: [
      "Sentar na altura certa, com as mãos soltas",
      "Achar qualquer Dó pelo grupo de 2 teclas pretas",
      "Saber o número de cada dedo (o polegar é o 1)",
      "Tocar Dó–Ré–Mi–Fá–Sol com a mão direita",
    ],
    blocks: [
      {
        title: "Antes de começar",
        subtitle: "Banco, postura e de onde vêm as notas",
        minutes: 5,
        body: [
          "Hoje não tem nada para revisar, porque é o primeiro dia. Toda aula tem os mesmos quatro blocos: **revisão**, **conceito**, **laboratório** e **ouvido e criação**. Marque cada um quando terminar.",
          "Serve qualquer teclado com **61 teclas ou mais**. Se tiver cabo USB, ligue no computador ou no celular e conecte abaixo: o site passa a ouvir o que você toca e confere sozinho. Sem cabo, toque na tela ou use o teclado do computador (a fileira **A S D F G H J K** são as teclas brancas, **W E T Y U** as pretas).",
          { w: "key-input" },
          { h: "Como sentar" },
          "Ajuste o banco para os **cotovelos ficarem na altura das teclas**, ou um pouco acima. Sente na metade da frente do banco, centralizado no teclado, com os dois pés inteiros no chão.",
          {
            w: "selfcheck",
            id: "postura",
            title: "Confira no espelho ou com o celular filmando",
            items: [
              { id: "cotovelo", label: "Cotovelos na altura das teclas, não abaixo", hint: "Se o punho fica abaixo das teclas, suba o banco" },
              { id: "pes", label: "Pés inteiros no chão" },
              { id: "ombro", label: "Ombros soltos, sem subir" },
              { id: "costas", label: "Costas retas, sem encostar" },
            ],
          },
        ],
      },
      {
        title: "Os grupos de 2 e 3",
        subtitle: "O único mapa que você precisa",
        minutes: 10,
        body: [
          "Olhe só as **teclas pretas**. Elas não estão espalhadas: formam grupos de **2** e de **3**, um depois do outro, do começo ao fim do teclado. Esse padrão é o mapa de tudo.",
          "O **Dó** é sempre a tecla branca **logo à esquerda do grupo de 2 pretas**. Ache um grupo de 2, desça uma branca: Dó. Funciona em qualquer teclado, de qualquer tamanho.",
          {
            w: "keys",
            from: C3,
            to: C6,
            names: "c-only",
            markers: [
              { midi: 48, kind: "root", label: "Dó" },
              { midi: 60, kind: "root", label: "Dó" },
              { midi: 72, kind: "root", label: "Dó" },
              { midi: 84, kind: "root", label: "Dó" },
            ],
            caption: "Todos os Dó deste trecho. Repare no grupo de 2 pretas logo à direita de cada um.",
          },
          { w: "find-keys", mode: "all", from: C3, to: C6, targets: [0], title: "Ache todos os Dó" },
          { h: "Dó central" },
          "O **Dó central** é o Dó mais perto do meio do teclado, quase sempre logo abaixo da marca do fabricante. É a referência para as duas mãos: a direita trabalha dele para cima, a esquerda dele para baixo. Na escrita internacional ele é o **C4**.",
          { callout: "theory", text: "As notas brancas seguem a ordem **Dó Ré Mi Fá Sol Lá Si** e recomeçam no Dó. Em cifra: **C D E F G A B**. O **Ré** fica entre as duas pretas do grupo de 2 e o **Mi** logo à direita delas." },
          { w: "find-keys", mode: "quiz", from: C3, to: C6, targets: [0, 2, 4], rounds: 10, title: "Dó, Ré ou Mi" },
          { callout: "warning", text: "Não cole adesivos com o nome das notas no teclado. Eles viram muleta: o olho para de procurar os grupos. O teclado da tela mostra o nome quando for preciso." },
        ],
      },
      {
        title: "Dedos e posição de Dó",
        subtitle: "Mão direita, cinco notas, metrônomo a 60",
        minutes: 10,
        body: [
          "No teclado os dedos são numerados de **1 a 5**, a partir do **polegar = 1**. Indicador 2, médio 3, anelar 4, mínimo 5. Vale para as duas mãos. (Se você vem da guitarra: lá o polegar não tem número e o indicador é o 1. Aqui não.)",
          {
            w: "hand",
            name: "Posição de Dó",
            description: "Polegar da mão direita no Dó central, um dedo por tecla até o Sol.",
            positions: [{ hand: "right", notes: [60, 62, 64, 65, 67] }],
          },
          "Deixe os dedos **curvos**, como se segurasse uma laranja pequena. Toque com a ponta dos dedos; o polegar toca com a lateral da ponta. Cada dedo fica parado em cima da sua tecla, mesmo quando não está tocando.",
          {
            w: "sequence",
            title: "1 2 3 4 5 4 3 2 1",
            hand: "right",
            from: C4 - 5,
            to: C4 + 12,
            bpm: 60,
            goal: 3,
            notes: [
              { midi: 60, finger: 1 },
              { midi: 62, finger: 2 },
              { midi: 64, finger: 3 },
              { midi: 65, finger: 4 },
              { midi: 67, finger: 5 },
              { midi: 65, finger: 4 },
              { midi: 64, finger: 3 },
              { midi: 62, finger: 2 },
              { midi: 60, finger: 1 },
            ],
          },
          "Agora com o metrônomo: **uma nota por clique**, a 60 BPM. Se escapar do pulso, baixe para 50. Faça 3 vezes seguidas sem parar.",
          { w: "metronome", bpm: 60 },
          {
            w: "selfcheck",
            id: "mao",
            items: [
              { id: "curvo", label: "Dedos curvos, sem dobrar a ponta para dentro" },
              { id: "punho", label: "Punho reto, na linha do antebraço" },
              { id: "parado", label: "Os dedos que não tocam ficam em cima das teclas" },
              { id: "pulso", label: "Uma nota por clique, sem correr" },
            ],
          },
          { callout: "tip", text: "Soar bem agora não quer dizer que já aprendeu. Amanhã a gente volta nisso, e o que ficou de verdade é o que aparecer amanhã." },
        ],
      },
      {
        title: "Ouvido e criação",
        subtitle: "Dó, Ré e Mi de ouvido",
        minutes: 5,
        body: [
          "O site toca primeiro um **Dó** de referência e depois outra nota: Dó, Ré ou Mi. Diga qual foi, clicando ou tocando a tecla. A meta é 80% de acerto.",
          { w: "key-echo", notes: [60, 62, 64] },
          { h: "Sua primeira melodia" },
          "Com **Dó, Ré e Mi** (dedos 1, 2 e 3), invente uma melodia de **4 notas** que termine no Dó. Toque 3 vezes do mesmo jeito. Se quiser, grave no celular: no fim do mês você vai ouvir de novo.",
          { w: "keys", from: C4 - 5, to: C4 + 12, names: "all", zones: [{ hand: "right", from: 60, to: 64, label: "Dó Ré Mi" }] },
        ],
      },
    ],
  },
];
