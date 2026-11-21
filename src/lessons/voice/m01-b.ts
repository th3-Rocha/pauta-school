// Canto · mês 1 · dias 16 a 30 (docs/curricula/voice.md, seção 8).
import type { Lesson, Node } from "../types";
import { CHECK_AFTER, CHECK_BEFORE, COOLDOWN, D, NO_PAIN, PAUSE, WARMUP } from "./shared";

type P = Extract<Node, { w: "phrase" }>["notes"];

const FIVE_UP_DOWN = (syl: string): P => [
  { s: D[1], d: 1, syl },
  { s: D[2], d: 1, syl },
  { s: D[3], d: 1, syl },
  { s: D[4], d: 1, syl },
  { s: D[5], d: 2, syl },
  { s: D[4], d: 1, syl },
  { s: D[3], d: 1, syl },
  { s: D[2], d: 1, syl },
  { s: D[1], d: 3, syl },
];

/** "Cantiga do caminho" (Pauta, original): 5 notas, para o marco do mês 1. */
const CAMINHO_A = (lyrics: boolean): P => {
  const syl = lyrics ? ["Vou", "can", "tan", "do", "pe", "lo", "ca", "mi", "nho"] : Array(9).fill("lá");
  const notes = [D[1], D[2], D[3], D[3], D[4], D[3], D[2], D[2], D[1]];
  const durs = [1, 1, 1, 1, 1, 1, 1, 1, 4];
  return notes.map((s, i) => ({ s, d: durs[i], syl: syl[i] }));
};
const CAMINHO_B = (lyrics: boolean): P => {
  const syl = lyrics ? ["sol", "e", "lu", "a", "vão", "co", "mi", "go"] : Array(8).fill("lá");
  const notes = [D[3], D[4], D[5], D[5], D[4], D[3], D[2], D[1]];
  const durs = [1, 1, 1, 1, 1, 1, 1, 5];
  return notes.map((s, i) => ({ s, d: durs[i], syl: syl[i] }));
};

export const VOICE_M01_B: Lesson[] = [
  {
    day: 16,
    month: 1,
    title: "O salto de quinta",
    minutes: 17,
    objectives: ["Conhecer a quinta (1–5)", "Cantar o salto ligado e separado", "Diferenciar terça e quinta de ouvido"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "Do dia 12: o salto 1 – 3 – 1.", { w: "phrase", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "lô" }, { s: D[3], d: 2, syl: "lô" }, { s: D[1], d: 4, syl: "lô" }] }],
      },
      {
        title: "A quinta segura o tom",
        minutes: 3,
        body: [
          "Do 1 ao **5** é o salto de **quinta**. É o intervalo do começo de muita melodia e o mais \"firme\" depois da oitava.",
          "Para chegar no 5 sem apertar, o ar tem que continuar **igual até o fim**. Não é empurrar mais: é não parar de soltar.",
          { w: "chimera", demos: [{ label: "1 – 5 – 1 ligado", notes: [0, 7, 0], vowel: "u", seconds: 1 }, { label: "1 – 5 – 1 separado", notes: [0, 7, 0], vowel: "ô", seconds: 0.7 }] },
        ],
      },
      {
        title: "Laboratório: 1 – 5 – 1",
        minutes: 8,
        body: [
          WARMUP,
          "No canudo, ligado, deslizando do 1 ao 5 e de volta. Depois em \"vô\", notas separadas.",
          { w: "phrase", title: "1 – 5 – 1 em \"vô\"", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "vô" }, { s: D[5], d: 2, syl: "vô" }, { s: D[1], d: 4, syl: "vô" }] },
          PAUSE,
          { w: "match", offset: D[5], vowel: "ô", tolerance: 50, hold: 3, title: "Segure o 5" },
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido: terça ou quinta?",
        minutes: 4,
        body: [{ w: "ear", kind: "interval", options: ["3M", "5J"] }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 17,
    month: 1,
    title: "Cinco degraus",
    minutes: 17,
    objectives: ["Cantar 1–2–3–4–5 e voltar", "Manter a mesma leveza em cima e embaixo", "Compor uma melodia de 5 notas"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "O salto de quinta.", { w: "phrase", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "vô" }, { s: D[5], d: 2, syl: "vô" }, { s: D[1], d: 4, syl: "vô" }] }],
      },
      {
        title: "A escala de 5 notas",
        minutes: 2,
        body: [
          "Com os degraus 1 a 5 dá para cantar um monte de cantigas. Hoje você liga todos, subindo e descendo.",
          { w: "solfege", title: "Os 5 degraus", steps: [0, 1, 2, 3, 4], tolerance: 50 },
        ],
      },
      {
        title: "Laboratório: 1 a 5 e de volta",
        minutes: 9,
        body: [
          WARMUP,
          "Mesmo peso em cima e embaixo. Se o 5 apertar, volte para o canudo e tente de novo.",
          { w: "phrase", title: "1 – 2 – 3 – 4 – 5 – 4 – 3 – 2 – 1 em \"dú\"", bpm: 66, tolerance: 50, notes: FIVE_UP_DOWN("dú") },
          PAUSE,
          { w: "phrase", title: "O mesmo em \"dá\"", bpm: 66, tolerance: 50, notes: FIVE_UP_DOWN("dá") },
          COOLDOWN,
        ],
      },
      {
        title: "Criação: sua melodia",
        minutes: 4,
        body: ["Invente uma melodia curta só com os degraus 1 a 5, comece e termine no 1. Grave.", { w: "recorder", id: "voice-d17" }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 18,
    month: 1,
    title: "O \"í\" sem espremer",
    minutes: 16,
    objectives: ["Cantar \"í\" sem subir a laringe", "Usar os dedos no \"gogó\" como sensor", "Ver no Chimera o \"í\" solto"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "1 a 5 em \"dú\".", { w: "phrase", bpm: 66, tolerance: 50, notes: FIVE_UP_DOWN("dú") }],
      },
      {
        title: "Espaço no \"í\"",
        minutes: 3,
        body: [
          "No \"í\" a língua sobe bem alto. Se faltar espaço atrás, a **laringe** (o \"gogó\") sobe junto e a voz espreme.",
          { callout: "selfCheck", label: "Sensor do gogó", text: "Dois dedos leves no gogó. Cante \"ú\" e passe para \"í\" na mesma nota. Se o gogó subir, comece de novo pensando num bocejo." },
          { w: "chimera", view: "2d", caption: "Repare na laringe (embaixo) e na língua.", demos: [{ label: "ú → í", notes: [0, 0], vowels: ["u", "i"], seconds: 1.4 }, { label: "\"í\"", notes: [0], vowel: "i", seconds: 1.6 }] },
        ],
      },
      {
        title: "Laboratório: \"í\"",
        minutes: 7,
        body: [
          WARMUP,
          { w: "phrase", title: "ú – í na mesma nota", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "ú", v: "u" }, { s: D[1], d: 2, syl: "í", v: "i" }, { s: D[3], d: 2, syl: "ú", v: "u" }, { s: D[3], d: 2, syl: "í", v: "i" }] },
          PAUSE,
          { w: "phrase", title: "1 – 2 – 3 – 2 – 1 em \"mí\"", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "mí" }, { s: D[2], d: 1, syl: "mí" }, { s: D[3], d: 2, syl: "mí" }, { s: D[2], d: 1, syl: "mí" }, { s: D[1], d: 3, syl: "mí" }] },
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido",
        minutes: 4,
        body: ["Toque nas vogais do mapa e ouça o Chimera. Compare \"í\" e \"ê\": a língua sobe mais no \"í\".", { w: "vowels" }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 19,
    month: 1,
    title: "Nota longa sem empurrar",
    minutes: 16,
    objectives: ["Segurar 6 segundos no mesmo volume", "Economizar ar", "Ver a nota parada no gráfico"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "\"í\" na escadinha.", { w: "phrase", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "mí" }, { s: D[2], d: 1, syl: "mí" }, { s: D[3], d: 2, syl: "mí" }, { s: D[1], d: 2, syl: "mí" }] }],
      },
      {
        title: "Economia de ar",
        minutes: 2,
        body: [
          "Uma nota longa e parada não vem de força: vem de **soltar o ar devagar e por igual**. Inspire em silêncio em 2 tempos, sem encher demais.",
          { w: "breath", pattern: [2, 1, 6], cycles: 2 },
        ],
      },
      {
        title: "Laboratório: 6 segundos",
        minutes: 8,
        body: [
          WARMUP,
          { w: "match", offset: 0, vowel: "ô", tolerance: 50, hold: 6, title: "Nota-base em \"mô\" por 6 segundos" },
          PAUSE,
          { w: "match", offset: D[3], vowel: "ô", tolerance: 50, hold: 6, title: "O 3 por 6 segundos" },
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido",
        minutes: 4,
        body: ["Uma frase de notas longas: repare se elas ficam retas no gráfico.", { w: "phrase", bpm: 56, tolerance: 50, notes: [{ s: D[1], d: 4, syl: "mô" }, { s: D[2], d: 4, syl: "mô" }, { s: D[1], d: 4, syl: "mô" }] }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 20,
    month: 1,
    title: "O \"é\" e o \"ó\" abertos",
    minutes: 16,
    objectives: ["Cantar as vogais abertas com a mandíbula solta", "Trocar de vogal sem mudar a nota", "Saltos 1–3–5"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "Nota-base por 6 segundos.", { w: "match", offset: 0, vowel: "ô", tolerance: 50, hold: 6 }],
      },
      {
        title: "Vogais abertas",
        minutes: 3,
        body: [
          "O português tem **é** (pé) e **ê** (vê), **ó** (pó) e **ô** (avô). As abertas pedem **mandíbula solta**, descendo um pouco mais.",
          { w: "vowels" },
        ],
      },
      {
        title: "Laboratório: lé e ló",
        minutes: 7,
        body: [
          WARMUP,
          { w: "phrase", title: "1 – 3 – 5 – 3 – 1 alternando \"lé\" e \"ló\"", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "lé" }, { s: D[3], d: 1, syl: "ló" }, { s: D[5], d: 2, syl: "lé" }, { s: D[3], d: 1, syl: "ló" }, { s: D[1], d: 3, syl: "lé" }] },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido: quatro vogais, uma nota",
        minutes: 4,
        body: ["á – é – ó – ú na mesma nota, sem a afinação mexer.", { w: "phrase", bpm: 60, tolerance: 50, notes: [{ s: D[3], d: 2, syl: "á" }, { s: D[3], d: 2, syl: "é" }, { s: D[3], d: 2, syl: "ó" }, { s: D[3], d: 2, syl: "ú" }] }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 21,
    month: 1,
    title: "Revisão 3: três semanas de voz",
    minutes: 17,
    objectives: ["Revisar as vogais e os saltos", "Aprender a \"Cantiga do caminho\" em \"lá\"", "Cantar com letra"],
    blocks: [
      {
        title: "Revisão espaçada",
        minutes: 3,
        body: [CHECK_BEFORE, "Do dia 14: notas longas.", { w: "phrase", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 3, syl: "mô" }, { s: D[3], d: 3, syl: "mô" }, { s: D[2], d: 3, syl: "mô" }, { s: D[1], d: 4, syl: "mô" }] }],
      },
      {
        title: "Uma cantiga de 5 notas",
        minutes: 2,
        body: ["A **Cantiga do caminho** foi feita para este mês: só usa os degraus 1 a 5. Primeiro em \"lá\", depois com letra.", { callout: "theory", label: "Letra", text: ["Vou cantando pelo caminho,", "sol e lua vão comigo."] }],
      },
      {
        title: "Laboratório: pentacorde nas vogais e a cantiga",
        minutes: 8,
        body: [
          WARMUP,
          { w: "phrase", title: "1 a 5 em \"lô\"", bpm: 72, tolerance: 50, notes: FIVE_UP_DOWN("lô") },
          PAUSE,
          { w: "phrase", title: "Cantiga do caminho · parte 1 em \"lá\"", bpm: 72, tolerance: 50, notes: CAMINHO_A(false) },
          { w: "phrase", title: "Cantiga do caminho · parte 2 em \"lá\"", bpm: 72, tolerance: 50, notes: CAMINHO_B(false) },
          COOLDOWN,
        ],
      },
      {
        title: "Com letra",
        minutes: 4,
        body: [{ w: "phrase", title: "Parte 1 com letra", bpm: 72, tolerance: 50, notes: CAMINHO_A(true) }, { w: "phrase", title: "Parte 2 com letra", bpm: 72, tolerance: 50, notes: CAMINHO_B(true) }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 22,
    month: 1,
    title: "Cantar a letra sem travar",
    minutes: 17,
    objectives: ["Entender que a vogal segura a nota", "Juntar consoante e vogal sem cortar o ar", "Trocar consoantes no mesmo fluxo"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, { w: "phrase", title: "Cantiga do caminho · parte 1", bpm: 72, tolerance: 50, notes: CAMINHO_A(true) }],
      },
      {
        title: "A vogal canta, a consoante passa",
        minutes: 3,
        body: [
          "Quem segura a nota é a **vogal**. A consoante é rápida, e entra um instante **antes** do tempo, para a vogal cair em cima da batida.",
          { list: ["Fale a letra no ritmo.", "Cante só as vogais: \"ó a a o e o a i o\".", "Junte de volta as consoantes, sem cortar o ar."], ordered: true },
        ],
      },
      {
        title: "Laboratório",
        minutes: 8,
        body: [
          WARMUP,
          { w: "phrase", title: "Só as vogais da parte 1", bpm: 66, tolerance: 50, notes: CAMINHO_A(false).map((n, i) => ({ ...n, syl: ["ô", "a", "a", "o", "e", "o", "a", "i", "o"][i] })) },
          PAUSE,
          { w: "phrase", title: "Com as consoantes de volta", bpm: 66, tolerance: 50, notes: CAMINHO_A(true) },
          COOLDOWN,
        ],
      },
      {
        title: "Criação: troque a consoante",
        minutes: 4,
        body: ["Na escadinha, troque a consoante a cada nota (bá, má, lá, dá) mantendo o ar contínuo.", { w: "phrase", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "bá" }, { s: D[2], d: 1, syl: "má" }, { s: D[3], d: 1, syl: "lá" }, { s: D[2], d: 1, syl: "dá" }, { s: D[1], d: 4, syl: "bá" }] }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 23,
    month: 1,
    title: "Solfejo em números",
    minutes: 16,
    objectives: ["Usar números para os graus", "Achar o 3 e o 5 de ouvido, antes da guia", "Subir a escada de solfejo"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "Consoantes trocando, ar contínuo.", { w: "phrase", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "bá" }, { s: D[2], d: 1, syl: "má" }, { s: D[3], d: 1, syl: "lá" }, { s: D[1], d: 3, syl: "dá" }] }],
      },
      {
        title: "Números são funções",
        minutes: 3,
        body: [
          "Chamar as notas por número (1, 2, 3…) mostra o **papel** de cada uma: o 1 é a casa, o 5 é o apoio, o 3 dá a cor. Isso vale em qualquer tom. Os nomes (Dó, Ré, Mi) entram no mês 4.",
        ],
      },
      {
        title: "Laboratório: escada de solfejo",
        minutes: 7,
        body: [
          WARMUP,
          "Cante o degrau pedido. Primeiro tente **sem ouvir**: só toque no degrau para ouvir se errar.",
          { w: "solfege", title: "1 – 3 – 5 – 3 – 1", steps: [0, 2, 4, 2, 0], tolerance: 50 },
          PAUSE,
          { w: "solfege", title: "1 – 2 – 3 – 4 – 5", steps: [0, 1, 2, 3, 4], tolerance: 50 },
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido: qual grau?",
        minutes: 4,
        body: ["O site toca o 1 e depois outra nota. Qual é o grau?", { w: "ear", kind: "degree", options: ["1", "3", "5"] }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 24,
    month: 1,
    title: "Pausar e respirar na frase",
    minutes: 16,
    objectives: ["Respirar no lugar certo", "Entrar no tempo depois da pausa", "Montar uma frase com pausa"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, { w: "solfege", steps: [0, 2, 4, 0], tolerance: 50 }],
      },
      {
        title: "A respiração faz parte da música",
        minutes: 3,
        body: [
          "A respiração tem que caber **dentro** do tempo da música, sem atrasar a próxima frase. Respire nas **vírgulas** do texto, nunca no meio de uma palavra.",
          "Na Cantiga do caminho: \"Vou cantando pelo caminho, **(respira)** sol e lua vão comigo.\" A respiração entra no tempo 4 da nota longa.",
        ],
      },
      {
        title: "Laboratório: a cantiga inteira",
        minutes: 7,
        body: [
          WARMUP,
          { w: "phrase", title: "Cantiga do caminho inteira, respirando na vírgula", bpm: 72, tolerance: 50, notes: [...CAMINHO_A(true).slice(0, -1), { s: D[1], d: 3, syl: "nho" }, ...CAMINHO_B(true)] },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Criação: frase com pausa",
        minutes: 4,
        body: ["Invente 2 compassos: 3 notas, uma pausa de 1 tempo para respirar, mais 3 notas. Use o metrônomo.", { w: "metronome", bpm: 72 }, { w: "recorder", id: "voice-d24" }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 25,
    month: 1,
    title: "Cantar sem olhar a tela",
    minutes: 16,
    objectives: ["Confiar no ouvido", "Cantar com o gráfico escondido", "Comparar sensação e resultado"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, { w: "phrase", title: "Cantiga do caminho · parte 2", bpm: 72, tolerance: 50, notes: CAMINHO_B(true) }],
      },
      {
        title: "O ouvido interno",
        minutes: 2,
        body: ["O gráfico ajuda muito no começo, mas quem canta olhando a tela o tempo todo fica dependente dela. Hoje o gráfico **só aparece no fim**. Antes de ver, responda: **fiquei alto, baixo ou certo?**"],
      },
      {
        title: "Laboratório: gráfico escondido",
        minutes: 8,
        body: [
          WARMUP,
          { w: "phrase", title: "1 – 3 – 5 – 3 – 1 sem tela", bpm: 66, tolerance: 50, feedback: "after", notes: [{ s: D[1], d: 1, syl: "lô" }, { s: D[3], d: 1, syl: "lô" }, { s: D[5], d: 2, syl: "lô" }, { s: D[3], d: 1, syl: "lô" }, { s: D[1], d: 3, syl: "lô" }] },
          PAUSE,
          { w: "phrase", title: "Cantiga do caminho · parte 1 sem tela", bpm: 72, tolerance: 50, feedback: "after", notes: CAMINHO_A(true) },
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido: sensação × gráfico",
        minutes: 4,
        body: [{ w: "selfcheck", id: "d25", items: [{ id: "a", label: "Antes de ver o gráfico, eu disse se fiquei alto, baixo ou certo" }, { id: "b", label: "Minha sensação bateu com o gráfico" }] }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 26,
    month: 1,
    title: "Volume suave e médio",
    minutes: 16,
    objectives: ["Mudar o volume sem desafinar", "Cantar em volume íntimo e de conversa", "Usar dinâmica numa frase"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, { w: "phrase", bpm: 66, tolerance: 50, feedback: "after", notes: [{ s: D[1], d: 1, syl: "lô" }, { s: D[3], d: 1, syl: "lô" }, { s: D[5], d: 2, syl: "lô" }, { s: D[1], d: 3, syl: "lô" }] }],
      },
      {
        title: "Volume sem empurrar",
        minutes: 3,
        body: [
          "Mais volume vem de **um pouco mais de ar com a mesma garganta solta**, não de apertar. Muita gente sobe a nota sem querer quando canta mais forte, e desce quando canta mais fraco.",
          { w: "chimera", demos: [{ label: "Suave", notes: [0, 4, 0], vowel: "ô", seconds: 1, source: { pressure: 4.5 } }, { label: "Médio", notes: [0, 4, 0], vowel: "ô", seconds: 1 }] },
        ],
      },
      {
        title: "Laboratório: duas intensidades",
        minutes: 7,
        body: [
          WARMUP,
          "Cante a frase duas vezes: primeiro **íntima** (como um segredo), depois **de conversa**. A afinação não pode mudar.",
          { w: "phrase", title: "Íntima", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "mô" }, { s: D[3], d: 2, syl: "mô" }, { s: D[1], d: 4, syl: "mô" }] },
          { w: "phrase", title: "De conversa", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "mô" }, { s: D[3], d: 2, syl: "mô" }, { s: D[1], d: 4, syl: "mô" }] },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Criação: dinâmica na cantiga",
        minutes: 4,
        body: ["Cante a parte 2 da cantiga começando de conversa e terminando íntimo, como se a lua fosse embora.", { w: "phrase", bpm: 72, tolerance: 50, notes: CAMINHO_B(true) }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 27,
    month: 1,
    title: "Canto ligado (legato)",
    minutes: 16,
    objectives: ["Ligar as notas num fio de ar", "Comparar ligado e destacado", "Cantar 1 a 5 numa respiração só"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, { w: "match", offset: D[3], vowel: "ô", tolerance: 50, hold: 4 }],
      },
      {
        title: "Um fio de ar",
        minutes: 3,
        body: [
          "**Legato** é cantar as notas ligadas, sem buracos entre elas, como um fio que não corta. O ar continua saindo na troca de nota.",
          { w: "chimera", demos: [{ label: "Ligado", notes: [0, 2, 4, 5, 7], vowel: "ô", seconds: 0.7 }, { label: "Destacado", notes: [0, 2, 4, 5, 7], vowel: "ô", seconds: 0.35 }] },
        ],
      },
      {
        title: "Laboratório",
        minutes: 7,
        body: [WARMUP, "Uma respiração só, subindo e descendo em \"mô\".", { w: "phrase", title: "1 a 5 e volta, ligado", bpm: 72, tolerance: 50, notes: FIVE_UP_DOWN("mô") }, PAUSE, COOLDOWN],
      },
      {
        title: "Ouvido",
        minutes: 4,
        body: ["Cante a parte 1 da cantiga bem ligada.", { w: "phrase", bpm: 72, tolerance: 50, notes: CAMINHO_A(true) }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 28,
    month: 1,
    title: "Montando sua primeira canção",
    minutes: 18,
    objectives: ["Juntar respiração, ataque, vogais e pulso", "Cantar a cantiga devagar e no tempo", "Criar uma variação no final"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, { w: "phrase", title: "Ligado, 1 a 5", bpm: 72, tolerance: 50, notes: FIVE_UP_DOWN("mô") }],
      },
      {
        title: "Tudo junto",
        minutes: 2,
        body: [{ list: ["Inspire baixo, sem ombros.", "Comece suave (pense num \"m\" antes).", "Vogais claras; consoantes rápidas.", "Respire na vírgula, dentro do tempo.", "Ligue as notas."] }],
      },
      {
        title: "Laboratório: devagar, depois no tempo",
        minutes: 10,
        body: [
          WARMUP,
          { w: "phrase", title: "Cantiga do caminho devagar (60)", bpm: 60, tolerance: 50, notes: [...CAMINHO_A(true).slice(0, -1), { s: D[1], d: 3, syl: "nho" }, ...CAMINHO_B(true)] },
          PAUSE,
          { w: "phrase", title: "No tempo (75)", bpm: 75, tolerance: 50, notes: [...CAMINHO_A(true).slice(0, -1), { s: D[1], d: 3, syl: "nho" }, ...CAMINHO_B(true)] },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Criação: o seu final",
        minutes: 4,
        body: ["Cante a cantiga e mude **só a última nota**: mais longa, mais suave, ou subindo para o 3 antes de voltar. Grave.", { w: "recorder", id: "voice-d28" }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 29,
    month: 1,
    title: "Ensaio geral do mês 1",
    minutes: 17,
    objectives: ["Revisar os dias 1, 21 e 25", "Gravar a cantiga sem parar", "Escolher um acerto e um ajuste"],
    blocks: [
      {
        title: "Revisão espaçada",
        minutes: 3,
        body: [CHECK_BEFORE, "Do dia 1: a nota-base. Agora por 6 segundos.", { w: "match", offset: 0, vowel: "ô", tolerance: 50, hold: 6 }],
      },
      {
        title: "Como é o desafio de amanhã",
        minutes: 2,
        body: [{ list: ["Nota-base por 6 segundos dentro de ±50 cents.", "Cantiga do caminho com 80% das notas dentro de ±50 cents, **sem o gráfico ao vivo**."] }],
      },
      {
        title: "Laboratório: ensaio",
        minutes: 8,
        body: [
          WARMUP,
          { w: "phrase", title: "Ensaio da cantiga (com gráfico)", bpm: 75, tolerance: 50, notes: [...CAMINHO_A(true).slice(0, -1), { s: D[1], d: 3, syl: "nho" }, ...CAMINHO_B(true)] },
          PAUSE,
          { w: "recorder", id: "voice-d29", label: "Grave a cantiga inteira, sem parar" },
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido: um acerto, um ajuste",
        minutes: 4,
        body: [{ w: "selfcheck", id: "d29", items: [{ id: "a", label: "Achei um acerto claro na gravação" }, { id: "b", label: "Escolhi um ajuste simples para amanhã" }] }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 30,
    month: 1,
    title: "Desafio: primeira vitória",
    minutes: 18,
    objectives: ["Nota-base por 6 segundos dentro de ±50 cents", "Cantiga de 5 notas com 80% dentro de ±50 cents, sem gráfico ao vivo", "Comparar sua voz do dia 1 com a de hoje"],
    blocks: [
      {
        title: "Preparação",
        minutes: 3,
        body: [CHECK_BEFORE, "Trinta dias de voz. Respire, aqueça e lembre: o objetivo é cantar **com conforto**.", WARMUP],
      },
      {
        title: "Parte 1: a nota-base",
        minutes: 3,
        body: [{ w: "match", offset: 0, vowel: "ô", tolerance: 50, hold: 6, title: "Desafio: nota-base por 6 segundos" }],
      },
      {
        title: "Parte 2: a cantiga",
        minutes: 6,
        body: [
          "Ouça o Chimera uma vez, se quiser. Depois cante sem o gráfico: ele aparece no fim, com o resultado.",
          { w: "phrase", title: "Desafio: Cantiga do caminho", bpm: 75, tolerance: 50, feedback: "after", goal: 0.8, notes: [...CAMINHO_A(true).slice(0, -1), { s: D[1], d: 3, syl: "nho" }, ...CAMINHO_B(true)] },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Antes e depois",
        minutes: 6,
        body: [
          "Grave a cantiga de novo e ouça. Pense na voz do dia 1: o que mudou? Mais firme? Mais afinada? Menos vergonha?",
          { w: "recorder", id: "voice-d30", label: "Minha voz no dia 30" },
          NO_PAIN,
          "No mês 2: **ataque suave e pulso**, escalas de 5 notas e as primeiras cantigas folclóricas.",
          CHECK_AFTER,
        ],
      },
    ],
  },
];
