import { LESSONS } from "../lessons";
// Estrutura do ano (veja docs/curriculos/guitarra.md). Meses 1–11 têm 30 dias; o 12 tem 35.

export type Month = {
  month: number;
  title: string;
  /** Primeiro e último dia do ano neste mês. */
  firstDay: number;
  lastDay: number;
  theory: string;
  practice: string;
  milestone: { title: string; goal: string; criteria: string[]; targetBpm: number };
};

type MonthSeed = Omit<Month, "firstDay" | "lastDay">;

const SEEDS: MonthSeed[] = [
  {
    month: 1,
    title: "Primeiros passos",
    theory: "Alfabeto musical, partes da guitarra, tablatura e diagramas, figuras básicas em 4/4.",
    practice: "Postura, afinação, acordes abertos (A, D, C, G, Am, Em) e melodias na primeira posição.",
    milestone: {
      title: "Trocas de acordes no pulso",
      goal: "Trocar os acordes abertos básicos sem parar o ritmo.",
      criteria: ["G → C → D → Em, 4 tempos cada, 2 voltas sem parar", "Ler uma melodia nova de 4 compassos em tablatura"],
      targetBpm: 70,
    },
  },
  {
    month: 2,
    title: "Pentatônica e primeiro improviso",
    theory: "Escala cromática, tons e semitons, escala maior (C e G), colcheias e ligaduras.",
    practice: "Power chords, primeiras pestanas, palhetada alternada, pentatônica menor em Am e Em, slides.",
    milestone: {
      title: "Quatro compassos seus",
      goal: "Improvisar 4 compassos em Lá menor sobre a base.",
      criteria: ["Usar só notas da pentatônica", "Terminar a frase na tônica (Lá)"],
      targetBpm: 70,
    },
  },
  {
    month: 3,
    title: "Intervalos e tríades",
    theory: "Intervalos simples, a diferença entre as cordas Sol e Si, tríades e campo harmônico em tríades.",
    practice: "Notas até a casa 12, inversões, I–IV–V e I–V–vi–IV, double stops, palm mute e bends afinados.",
    milestone: {
      title: "Bend afinado",
      goal: "Achar notas no braço e afinar bends de meio e um tom.",
      criteria: ["Bend de 1 tom dentro de ±15 cents", "Reconhecer 3ª e 5ª de ouvido"],
      targetBpm: 70,
    },
  },
  {
    month: 4,
    title: "CAGED e blues",
    theory: "Sistema CAGED, semicolcheias, blues de 12 compassos, pentatônica maior e escala blues.",
    practice: "Ligar as 5 regiões, levadas de rock e funk, hammer-on, pull-off e riffs de blues.",
    milestone: {
      title: "Blues em duas regiões",
      goal: "Solar sobre um blues passando por duas regiões da pentatônica.",
      criteria: ["Tocar as 15 figuras de semicolcheia no metrônomo", "Trocar de região sem parar"],
      targetBpm: 80,
    },
  },
  {
    month: 5,
    title: "Tétrades e funções",
    theory: "Ciclo das quintas, tétrades, campo harmônico em tétrades, funções e ii–V–I.",
    practice: "Acordes com sétima, arpejos de uma oitava no CAGED, análise de músicas.",
    milestone: {
      title: "ii–V–I arpejado",
      goal: "Arpejar um ii–V–I em três tons.",
      criteria: ["G, A e B maior", "Sem parar entre os acordes"],
      targetBpm: 70,
    },
  },
  {
    month: 6,
    title: "Ritmo, swing e notas-guia",
    theory: "Síncope, 6/8 e 12/8, swing e shuffle, notas-guia, samba, bossa e baião.",
    practice: "Solo mirando 3ªs e 7ªs, vibrato, dinâmica, levadas de bossa e samba.",
    milestone: {
      title: "Oito compassos com notas-guia",
      goal: "Improvisar 8 compassos destacando terças e sétimas.",
      criteria: ["Até 2 acordes por compasso", "Notas-guia nos tempos 1 e 3"],
      targetBpm: 80,
    },
  },
  {
    month: 7,
    title: "Voicings e condução de vozes",
    theory: "Inversões, spread triads, shells, Drop 2 e Drop 3, diminutos e line cliché.",
    practice: "Drop 2 e Drop 3 em todo o braço, ii–V–I com pouco movimento, diminuto de passagem.",
    milestone: {
      title: "Progressão sem pular",
      goal: "Acompanhar uma progressão inteira com condução suave.",
      criteria: ["Shells e Drop 2/3", "Nenhum dedo salta mais de 2 casas"],
      targetBpm: 80,
    },
  },
  {
    month: 8,
    title: "Harmonia além do tom",
    theory: "Campos menores, dominantes secundários, subV7 e empréstimo modal.",
    practice: "Rearmonizar pop e MPB, baixos cromáticos, notas-guia em acordes de fora do tom.",
    milestone: {
      title: "Progressão mista",
      goal: "Analisar e solar sobre uma progressão com acordes de fora do tom.",
      criteria: ["Identificar o dominante secundário", "Ajustar a nota-alvo no compasso dele"],
      targetBpm: 80,
    },
  },
  {
    month: 9,
    title: "Modos e o braço inteiro",
    theory: "3NPS, CAGED e escala linear, tensões e avoid notes, os 7 modos sobre drone.",
    practice: "Escalas em 2 oitavas a 100 BPM, modos em paralelo destacando a nota característica.",
    milestone: {
      title: "Solo modal",
      goal: "Sustentar um solo modal sobre base estática.",
      criteria: ["Escalas ligadas em todas as posições", "A nota característica do modo aparece"],
      targetBpm: 100,
    },
  },
  {
    month: 10,
    title: "Cores alteradas",
    theory: "Modos da menor harmônica e melódica, tensões alteradas.",
    practice: "Voicings 7alt e m7b5, arpejos de 2 oitavas, triad ladders.",
    milestone: {
      title: "Resolver a tensão",
      goal: "Resolver a escala alterada e o frígio dominante sobre V7.",
      criteria: ["Arpejos em 2 oitavas", "Resolução em I e em i"],
      targetBpm: 90,
    },
  },
  {
    month: 11,
    title: "Fraseado de verdade",
    theory: "Aproximações, enclosures, superposição de pentatônicas, desenvolvimento motívico.",
    practice: "Enclosures sobre notas-guia, cor outside controlada, solo a partir de um motivo.",
    milestone: {
      title: "Solo gravado",
      goal: "Gravar um solo sobre duas voltas de blues.",
      criteria: ["Pausas intencionais", "Um motivo que se desenvolve", "Enclosures que resolvem"],
      targetBpm: 90,
    },
  },
  {
    month: 12,
    title: "Projeto final",
    theory: "Síntese de estilos, transcrição completa, revisão dos 8 eixos.",
    practice: "Transcrever um solo, sextinas, pre-bends, volume swells.",
    milestone: {
      title: "Projeto final",
      goal: "Analisar uma cifra nova, gravar a base e improvisar duas voltas.",
      criteria: ["2 acordes por compasso com desvios tonais", "Transcrever trechos do próprio solo"],
      targetBpm: 90,
    },
  },
];

export const TOTAL_DAYS = 365;

export const MONTHS: Month[] = SEEDS.map((s, i) => {
  const firstDay = i * 30 + 1;
  const lastDay = s.month === 12 ? TOTAL_DAYS : firstDay + 29;
  return { ...s, firstDay, lastDay };
});

export function monthOfDay(day: number): Month {
  return MONTHS.find((m) => day >= m.firstDay && day <= m.lastDay) ?? MONTHS[0];
}

/** O último dia de cada mês é o desafio (marco). */
export function isMilestoneDay(day: number): boolean {
  return MONTHS.some((m) => m.lastDay === day);
}

/** Títulos das aulas já escritas. Só dias com aula aparecem como disponíveis. */
export const LESSON_TITLES: Record<number, string> = Object.fromEntries(Object.values(LESSONS).map((l) => [l.day, l.title]));

export const hasLesson = (day: number) => day in LESSON_TITLES;
