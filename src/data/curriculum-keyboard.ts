// Estrutura do ano de teclado (veja docs/curricula/keyboard.md, seção 7).
import { buildMonths, type Month, type MonthSeed } from "./curriculum";

const SEEDS: MonthSeed[] = [
  {
    month: 1,
    title: "Conhecendo o teclado",
    theory: "Grupos de 2 e 3 teclas pretas, notas naturais, Dó central, dedos de 1 a 5, figuras básicas em 4/4 e clave de Sol.",
    practice: "Postura e banco, posição de Dó na mão direita, melodias de 5 notas e mão esquerda em notas longas.",
    milestone: {
      title: "Melodia com as duas mãos separadas",
      goal: "Tocar uma melodia curta na mão direita com a fundamental na esquerda.",
      criteria: ["Melodia de 8 compassos na MD com fundamentais da ME em mínimas", "Achar qualquer nota natural sem olhar o nome"],
      targetBpm: 60,
    },
  },
  {
    month: 2,
    title: "Escala maior e tríades",
    theory: "Tons e semitons, sustenidos e bemóis, escala maior (Dó e Sol), passagem de polegar, tríades maiores e menores, colcheias.",
    practice: "Escalas com mãos separadas, tríades em bloco na MD, I–IV–V em Dó com inversões próximas.",
    milestone: {
      title: "Escalas e I–IV–V",
      goal: "Escalas de Dó e Sol em 2 oitavas e I–IV–V com inversões próximas.",
      criteria: ["Dó e Sol maiores, mãos separadas, 2 oitavas a 60", "I–IV–V com a inversão mais próxima a 70"],
      targetBpm: 70,
    },
  },
  {
    month: 3,
    title: "Intervalos e pentatônicas",
    theory: "Intervalos diatônicos, escalas de Fá e Ré, menores (Lá, Mi, Ré), pentatônicas maior e menor, introdução à clave de Fá.",
    practice: "I–V–vi–IV, riffs, continuações de 2 compassos e improviso em pentatônica sobre base.",
    milestone: {
      title: "Primeiro improviso",
      goal: "Escalas em 2 oitavas e 4 compassos improvisados em pentatônica.",
      criteria: ["Escalas com mãos separadas a 60–80 sem tensão", "Improvisar 4 compassos em pentatônica sobre a base"],
      targetBpm: 80,
    },
  },
  {
    month: 4,
    title: "Mãos juntas e tétrades",
    theory: "Ciclo das quintas e quartas, tétrades (7M, 7, m7, m7(b5), °), campo maior em tétrades, cifra brasileira e americana.",
    practice: "Mãos juntas, escalas com as duas mãos, campo em tétrades e leitura da clave de Fá na ME.",
    milestone: {
      title: "Duas mãos de verdade",
      goal: "Escalas com as mãos juntas e o campo em tétrades em Dó.",
      criteria: ["Dó, Sol e Fá com mãos juntas em 2 oitavas a 66", "Campo em tétrades em Dó, subindo e descendo"],
      targetBpm: 66,
    },
  },
  {
    month: 5,
    title: "Notas-guia e II–V–I",
    theory: "Guide tones (3ª e 7ª), shells sem quinta, funções (T, SD, D), II–V–I, síncope e notação rítmica.",
    practice: "V7 pelo ciclo das quintas, padrão de comping de um compasso e leitura a duas mãos.",
    milestone: {
      title: "Ciclo dos dominantes",
      goal: "Encadear os 12 dominantes com o menor movimento possível.",
      criteria: ["V7 pelo ciclo (ME baixo + MD 3ª/7ª), 12 acordes a 70", "II–V–I em 3 tons"],
      targetBpm: 70,
    },
  },
  {
    month: 6,
    title: "Blues",
    theory: "Blues de 12 compassos, escala blues, dórico e mixolídio, swing.",
    practice: "Shells na ME com solo na MD, swing, dinâmica e articulação de ouvido.",
    milestone: {
      title: "Solo de blues",
      goal: "Solar duas voltas de blues de 12 compassos.",
      criteria: ["2 voltas de blues com a escala blues", "Escalas com mãos juntas a 80"],
      targetBpm: 80,
    },
  },
  {
    month: 7,
    title: "Menores e tensões",
    theory: "Campos menores, line cliché, tensões 9, 11 e 13 (5ª → 13), avoid notes, four-way close.",
    practice: "Voicings com tensões em II–V–I maior e menor, tríades aumentadas e sus, legato e staccato.",
    milestone: {
      title: "II–V–I com tensões",
      goal: "II–V–I maior e menor com tensões e condução suave.",
      criteria: ["II–V–I maior e menor em 4 tons", "Sem saltos grandes entre os acordes"],
      targetBpm: 80,
    },
  },
  {
    month: 8,
    title: "Dominantes secundários e motivos",
    theory: "Dominantes secundários e related II, approach notes, as 6 técnicas de desenvolvimento motívico.",
    practice: "Leitura de 8 compassos com mãos juntas e 2 improvisados, solo a partir de um motivo.",
    milestone: {
      title: "Motivo sobre V7/X",
      goal: "Tocar progressão com dominantes secundários e desenvolver um motivo.",
      criteria: ["Analisar e tocar a progressão com V7/X", "Improvisar 8 compassos a partir de um motivo"],
      targetBpm: 90,
    },
  },
  {
    month: 9,
    title: "Samba e bossa nova",
    theory: "Tercinas, 6/8 e 12/8, samba em 3 camadas, clave 2-3 e 3-2 da bossa, 6 tons em blocos (Dó a Fá).",
    practice: "ME de surdo e comping estável de 8 a 16 compassos, bossa de 90 a 115 BPM.",
    milestone: {
      title: "Bossa sobre II–V–I",
      goal: "Acompanhar bossa nova com dominantes secundários.",
      criteria: ["Bossa sobre II–V–I com V7/X a 95–115", "4 escalas com mãos juntas de Dó a Fá em colcheias"],
      targetBpm: 100,
    },
  },
  {
    month: 10,
    title: "Cromatismo e os 12 tons",
    theory: "SubV7, diminutos de passagem, empréstimo modal e napolitano, completar os 12 tons.",
    practice: "Rearmonização de pop e MPB, baixos cromáticos, ouvido de empréstimo modal.",
    milestone: {
      title: "Rearmonização",
      goal: "Tocar progressão com subV7, diminuto e empréstimo modal.",
      criteria: ["Analisar e tocar a progressão", "4 escalas com mãos juntas nos 12 tons"],
      targetBpm: 100,
    },
  },
  {
    month: 11,
    title: "Voicings de jazz",
    theory: "Rootless voicings (A e B), quartais, Drop 2, limites graves, enclosures, 3 contra 2.",
    practice: "Comping de standard com rootless, cross-rhythms, apojaturas, glissandos, pedal e dinâmica.",
    milestone: {
      title: "Standard completo",
      goal: "Acompanhar um standard e solar com enclosures.",
      criteria: ["Standard completo com rootless voicings", "Solo com enclosures sobre II–V–I"],
      targetBpm: 110,
    },
  },
  {
    month: 12,
    title: "Autonomia",
    theory: "Harmonia modal, introdução a upper structures, transcrição passo a passo e revisão do ano.",
    practice: "Repertório de MPB, jazz e pop, leitura de chart com final improvisado, transcrição.",
    milestone: {
      title: "Projeto final",
      goal: "Escalas nos 12 tons, chart inédito com improviso e 3 peças de estilos diferentes.",
      criteria: ["Escalas e arpejos com mãos juntas nos 12 tons", "Chart inédito com improviso sobre V7/X e subV7", "3 peças gravadas"],
      targetBpm: 100,
    },
  },
];

export const KEYBOARD_MONTHS: Month[] = buildMonths(SEEDS);
