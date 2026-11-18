// Mês 1 · dias 16 a 30
import type { Lesson } from "../../types";
import { CLEAN_CHORD, ALL_DOWN, DOWN_REST, C_MAJOR_SCALE, HALVES, ODE_TO_JOY, MELODY_A, MELODY_B, MELODY_C, MELODY_D, THREE_REST } from "./shared";

const M = 1;
const bars = (chords: string[], strokes = ALL_DOWN) => chords.map((chord) => ({ chord, strokes }));

export const DAYS_16_TO_30: Lesson[] = [
  {
    day: 16,
    month: M,
    title: "Dó maior (C)",
    minutes: 30,
    objectives: ["Montar o C em escadinha", "Trocar C e Am mantendo dois dedos parados", "Reconhecer C, Am e Em de ouvido"],
    blocks: [
      { minutes: 5, body: [{ w: "changes", chords: ["A", "D"], beats: 4, bpm: 55 }] },
      {
        title: "O C",
        minutes: 8,
        body: [
          "O C é uma **escadinha**: dedo 3 na casa 3 da corda 5, dedo 2 na casa 2 da corda 4, dedo 1 na casa 1 da corda 2. A corda 6 tem X.",
          { w: "chords", chords: ["C", "Am"] },
          "Agora compare com o Am: **os dedos 1 e 2 estão no mesmo lugar**. Para trocar, só o dedo 3 se mexe, da corda 3 para a corda 5. Dedos que não precisam sair, não saem.",
          CLEAN_CHORD("c"),
          { callout: "warning", text: "O dedo 1 costuma encostar na corda 1 e abafar. Arqueie bem: a corda 1 tem que soar solta." },
        ],
      },
      { title: "C ↔ Am", minutes: 12, body: [{ w: "changes", chords: ["C", "Am"], beats: 4, bpm: 60 }, { w: "minute", id: "c-am", label: "C para Am e de volta, só mexendo o dedo 3." }] },
      { title: "Qual acorde?", minutes: 5, body: [{ w: "ear", kind: "which-chord", chords: ["C", "Am", "Em"] }] },
    ],
  },

  {
    day: 17,
    month: M,
    title: "Sol maior (G)",
    minutes: 30,
    objectives: ["Montar o G com o baixo forte", "Trocar G e Em", "Completar os seis acordes do mês"],
    blocks: [
      { minutes: 5, body: [{ w: "changes", chords: ["C", "Am"], beats: 4, bpm: 65 }] },
      {
        title: "O G",
        minutes: 8,
        body: [
          "O G usa as seis cordas: dedo 2 na casa 3 da corda 6, dedo 1 na casa 2 da corda 5 e dedo 3 na casa 3 da corda 1. As cordas do meio ficam soltas.",
          { w: "chords", chords: ["G"] },
          "O baixo do G (corda 6) é o que dá peso ao acorde. Comece a batida bem nele.",
          CLEAN_CHORD("g"),
          { callout: "tip", text: "Você também vai ver o G com os dedos 3, 2 e 4. Os dois funcionam. Aqui usamos 2, 1 e 3 porque fica mais fácil chegar no C depois." },
        ],
      },
      { title: "G ↔ Em", minutes: 12, body: [{ w: "changes", chords: ["G", "Em"], beats: 4, bpm: 50 }, { w: "minute", id: "g-em", label: "G para Em e de volta." }] },
      { title: "Qual acorde?", minutes: 5, body: [{ w: "ear", kind: "which-chord", chords: ["G", "C", "D"] }] },
    ],
  },

  {
    day: 18,
    month: M,
    title: "G, C e D: a dupla mais famosa ganha um terceiro",
    minutes: 30,
    objectives: ["Encadear G, C e D", "Resolver a troca G → C", "Ouvir os três juntos"],
    blocks: [
      { minutes: 5, body: ["Monte cada um 5 vezes: G, C, D.", { w: "chords", chords: ["G", "C", "D"] }] },
      {
        title: "Uma progressão de verdade",
        minutes: 8,
        body: [
          "Uma **progressão** é uma sequência de acordes que se repete. **G, C e D** juntos aparecem em milhares de músicas de rock, country, forró e sertanejo. Daqui a dois meses você vai entender por quê; hoje é para sentir nas mãos.",
          "A troca mais difícil é **G → C**: os três dedos mudam de corda. Mova a mão como um bloco, com o dedo 3 chegando primeiro na corda 5.",
        ],
      },
      {
        title: "G → C → D",
        minutes: 12,
        body: [
          { w: "changes", chords: ["G", "C", "D", "G"], beats: 4, bpm: 50 },
          { w: "strum", title: "Com levada de mínimas", bpm: 60, measures: bars(["G", "C", "D", "G"], HALVES) },
          { w: "minute", id: "g-c", label: "Só a troca G ↔ C, a mais difícil. Quantas em 1 minuto?" },
        ],
      },
      { title: "Qual acorde?", minutes: 5, body: [{ w: "ear", kind: "which-chord", chords: ["G", "C", "D"] }] },
    ],
  },

  {
    day: 19,
    month: M,
    title: "Pausas com acordes: o silêncio também é ritmo",
    minutes: 30,
    objectives: ["Abafar acordes no tempo", "Tocar levadas com pausas", "Contar enquanto toca"],
    blocks: [
      { minutes: 5, body: [{ w: "changes", chords: ["G", "C", "D", "G"], beats: 4, bpm: 55 }] },
      {
        title: "Duas formas de abafar",
        minutes: 8,
        body: [
          {
            list: [
              "**Mão direita:** encoste a lateral da mão nas cordas, perto da ponte.",
              "**Mão esquerda:** alivie a pressão dos dedos sem tirá-los das cordas. Funciona melhor em acordes sem cordas soltas, que você vai aprender no mês 2.",
            ],
          },
          "A pausa é um tempo como outro qualquer. Conte em voz alta: *1, 2, 3, pausa*.",
        ],
      },
      {
        title: "Levadas com pausa",
        minutes: 12,
        body: [
          { w: "strum", title: "Três e pausa", bpm: 60, measures: bars(["G", "C", "D", "G"], THREE_REST) },
          { w: "strum", title: "Bate e pausa", bpm: 60, measures: bars(["Em", "Am", "D", "G"], DOWN_REST) },
          { callout: "selfCheck", text: "Grave um trecho. Nas pausas o som corta de verdade, ou fica um rastro do acorde?" },
        ],
      },
      { title: "Quanto durou?", minutes: 5, body: [{ w: "ear", kind: "duration" }] },
    ],
  },

  {
    day: 20,
    month: M,
    title: "As notas naturais e a escala de Dó",
    minutes: 30,
    objectives: ["Achar as 7 notas naturais na primeira posição", "Tocar a escala de Dó maior", "Ver onde ficam os meios tons"],
    blocks: [
      { minutes: 5, body: [{ w: "strum", bpm: 60, measures: bars(["G", "C", "D", "G"], THREE_REST) }] },
      {
        title: "Dó, Ré, Mi… no braço",
        minutes: 10,
        body: [
          "As sete notas naturais são **C D E F G A B** (Dó Ré Mi Fá Sol Lá Si). Na primeira posição elas ficam assim:",
          {
            w: "fretboard",
            frets: 4,
            markers: [
              { s: 5, f: 3, label: "C", kind: "root" },
              { s: 4, f: 0, label: "D" },
              { s: 4, f: 2, label: "E" },
              { s: 4, f: 3, label: "F" },
              { s: 3, f: 0, label: "G" },
              { s: 3, f: 2, label: "A" },
              { s: 2, f: 0, label: "B" },
              { s: 2, f: 1, label: "C", kind: "root" },
            ],
            caption: "Toque de C até C. Isso é a **escala de Dó maior**: Dó Ré Mi Fá Sol Lá Si Dó.",
          },
          "Repare nas distâncias. Quase sempre há **duas casas** entre uma nota e a seguinte (um tom). Mas de **E para F** e de **B para C** a distância é de **uma casa** (meio tom). Essa diferença é o que dá o som da escala maior. Você vai estudar isso a fundo no mês 2.",
        ],
      },
      { title: "A escala", minutes: 10, body: [{ w: "tab", title: "Escala de Dó maior, sobe e desce", bpm: 60, notes: C_MAJOR_SCALE }, "Fale o nome de cada nota enquanto toca."] },
      { title: "Subiu ou desceu", minutes: 5, body: [{ w: "ear", kind: "highlow-close" }] },
    ],
  },

  {
    day: 21,
    month: M,
    title: "Revisão da semana 3",
    minutes: 30,
    objectives: ["Seis acordes limpos", "Trocar G, C, D e Em a 60 BPM", "Escala de Dó a 70 BPM"],
    blocks: [
      { title: "Os seis acordes", minutes: 6, body: ["Monte cada acorde e toque corda por corda.", { w: "chords", chords: ["Em", "Am", "D", "A", "C", "G"] }] },
      {
        title: "O que você já sabe",
        minutes: 4,
        body: [{ list: ["Seis acordes abertos: Em, Am, D, A, C, G", "Dedo que não precisa sair, não sai (C ↔ Am)", "Pausas abafando com a mão direita", "As 7 notas naturais e a escala de Dó"] }],
      },
      {
        title: "Mini-desafio da semana",
        minutes: 15,
        body: [
          "Esta é a sequência do desafio do fim do mês. Hoje a meta é 60 BPM.",
          { w: "changes", title: "G → C → D → Em", chords: ["G", "C", "D", "Em"], beats: 4, bpm: 60 },
          { w: "tab", title: "Escala de Dó a 70 BPM", bpm: 70, notes: C_MAJOR_SCALE },
          {
            w: "selfcheck",
            id: "semana3",
            title: "Semana 3 concluída",
            items: [
              { id: "seis", label: "Os seis acordes soam limpos" },
              { id: "gcde", label: "G → C → D → Em a 60 BPM, duas voltas sem parar" },
              { id: "escala", label: "Escala de Dó a 70 BPM, falando as notas" },
            ],
          },
        ],
      },
      { title: "Qual acorde?", minutes: 5, body: [{ w: "ear", kind: "which-chord", chords: ["G", "C", "D", "Em"] }] },
    ],
  },

  {
    day: 22,
    month: M,
    title: "Levada lenta: G, Em, C, D",
    minutes: 30,
    objectives: ["Tocar uma progressão de quatro acordes", "Alternar levadas no meio da música", "Manter o pulso nas trocas"],
    blocks: [
      { minutes: 5, body: [{ w: "tab", bpm: 70, notes: C_MAJOR_SCALE }] },
      {
        title: "Uma progressão clássica",
        minutes: 6,
        body: [
          "**G → Em → C → D** é a progressão das baladas dos anos 50 e 60, e ainda aparece em muita música hoje. Ela gira em círculo: o D pede para voltar ao G.",
          "Comece com **mínimas** (deixe o acorde soar 2 tempos). Quando estiver confortável, passe para quatro batidas por compasso.",
        ],
      },
      {
        title: "Duas levadas",
        minutes: 14,
        body: [
          { w: "strum", title: "Mínimas", bpm: 60, measures: bars(["G", "Em", "C", "D"], HALVES) },
          { w: "strum", title: "Quatro para baixo", bpm: 60, measures: bars(["G", "Em", "C", "D"]) },
          { w: "changes", chords: ["G", "Em", "C", "D"], beats: 4, bpm: 60 },
        ],
      },
      { title: "Maior ou menor", minutes: 5, body: ["Na progressão, só o Em é menor. Escute como ele escurece o som por um compasso.", { w: "ear", kind: "major-minor" }] },
    ],
  },

  {
    day: 23,
    month: M,
    title: "G, D, Em, C: a progressão do pop",
    minutes: 30,
    objectives: ["Tocar G → D → Em → C", "Treinar a troca D → Em", "Perceber como a ordem muda o clima"],
    blocks: [
      { minutes: 5, body: [{ w: "strum", bpm: 60, measures: bars(["G", "Em", "C", "D"]) }] },
      {
        title: "Mesmos acordes, outra ordem",
        minutes: 6,
        body: [
          "Os quatro acordes de ontem, em outra ordem: **G → D → Em → C**. Essa é provavelmente a progressão mais usada no pop das últimas décadas. Coloque para tocar e cante qualquer melodia por cima: muita coisa encaixa.",
          "Ontem o D pedia para voltar ao G. Hoje o C no fim deixa a volta mais suave. A **ordem** dos acordes muda a sensação.",
        ],
      },
      {
        title: "G → D → Em → C",
        minutes: 14,
        body: [
          { w: "changes", chords: ["G", "D", "Em", "C"], beats: 4, bpm: 60 },
          { w: "strum", title: "Levada", bpm: 70, measures: bars(["G", "D", "Em", "C"]) },
          { w: "minute", id: "d-em", label: "Só a troca D ↔ Em. A mão inteira muda de lugar: pense em formas, não em dedos." },
        ],
      },
      { title: "Qual acorde?", minutes: 5, body: [{ w: "ear", kind: "which-chord", chords: ["G", "D", "Em", "C"] }] },
    ],
  },

  {
    day: 24,
    month: M,
    title: "Leitura à primeira vista",
    minutes: 30,
    objectives: ["Seguir um método para ler música nova", "Tocar sem parar mesmo errando", "Ler duas melodias novas"],
    blocks: [
      { minutes: 5, body: [{ w: "changes", chords: ["G", "D", "Em", "C"], beats: 4, bpm: 60 }] },
      {
        title: "Quatro passos antes de tocar",
        minutes: 6,
        body: [
          {
            list: [
              "**Olhe o ritmo:** onde estão as notas longas e as pausas?",
              "**Ache as cordas:** em quais cordas a melodia anda? Posicione a mão.",
              "**Conte e cante** a melodia de cabeça, no tempo.",
              "**Toque devagar e não pare.** Errou, segue. O pulso manda.",
            ],
            ordered: true,
          },
          { callout: "warning", text: "Nestas melodias, não aperte Tocar antes de tentar. Ligue só o metrônomo (desligue o exemplo depois de ouvir a contagem) e leia. Depois confira com o exemplo." },
        ],
      },
      {
        title: "Duas melodias novas",
        minutes: 14,
        body: [{ w: "tab", title: "Melodia A", bpm: 60, notes: MELODY_A }, { w: "tab", title: "Melodia B", bpm: 60, notes: MELODY_B }],
      },
      { title: "Igual ou diferente", minutes: 5, body: [{ w: "ear", kind: "same-diff" }] },
    ],
  },

  {
    day: 25,
    month: M,
    title: "Maior ou menor: uma nota muda tudo",
    minutes: 30,
    objectives: ["Montar o E (Mi maior)", "Entender que maior e menor diferem por uma nota", "Reconhecer de ouvido com 80% de acerto"],
    blocks: [
      { minutes: 5, body: [{ w: "tab", title: "Melodia A", bpm: 70, notes: MELODY_A }] },
      {
        title: "Uma casa de diferença",
        minutes: 8,
        body: [
          "Você já viu que **A e Am** diferem só na corda 2. Com **E e Em** é igual: no E, o dedo 1 entra na casa 1 da corda 3. No Em, essa corda fica solta.",
          { w: "chords", chords: ["E", "Em", "A", "Am"] },
          "Essa nota que muda se chama **terça**. Quando ela está uma casa mais alta, o acorde é maior. Uma casa mais baixa, menor. No mês 3 você vai montar acordes a partir disso.",
        ],
      },
      { title: "Ouça a troca", minutes: 10, body: [{ w: "strum", title: "Maior, menor, maior, menor", bpm: 60, measures: bars(["E", "Em", "A", "Am"], HALVES) }] },
      { title: "Maior ou menor", minutes: 7, body: ["Meta de hoje: 80% de acerto em pelo menos 10 perguntas.", { w: "ear", kind: "major-minor" }] },
    ],
  },

  {
    day: 26,
    month: M,
    title: "Afinar sem afinador",
    minutes: 30,
    objectives: ["Afinar uma corda pela outra", "Lembrar a exceção da corda 3", "Perceber batimento entre duas notas"],
    blocks: [
      { minutes: 5, body: [{ w: "strum", bpm: 60, measures: bars(["E", "Em", "A", "Am"], HALVES) }] },
      {
        title: "A regra da casa 5",
        minutes: 8,
        body: [
          "Uma corda apertada na **casa 5** dá a mesma nota da corda de baixo solta. Por exemplo: corda 6 na casa 5 é Lá, igual à corda 5 solta.",
          {
            list: [
              "Corda 6, casa 5 = corda 5 solta",
              "Corda 5, casa 5 = corda 4 solta",
              "Corda 4, casa 5 = corda 3 solta",
              "**Corda 3, casa 4** = corda 2 solta (a exceção)",
              "Corda 2, casa 5 = corda 1 solta",
            ],
          },
          {
            w: "fretboard",
            frets: 5,
            markers: [
              { s: 6, f: 5, label: "A" },
              { s: 5, f: 0, label: "A" },
              { s: 5, f: 5, label: "D" },
              { s: 4, f: 0, label: "D" },
              { s: 4, f: 5, label: "G" },
              { s: 3, f: 0, label: "G" },
              { s: 3, f: 4, label: "B", kind: "tension" },
              { s: 2, f: 0, label: "B" },
              { s: 2, f: 5, label: "E" },
              { s: 1, f: 0, label: "E" },
            ],
            caption: "Toque cada par: as duas notas têm que ser iguais. A corda 3 é a exceção, na casa 4. Essa diferença vai aparecer muito no curso.",
          },
        ],
      },
      {
        title: "Afinar de ouvido",
        minutes: 12,
        body: [
          "Desafine de leve a corda 5. Toque a corda 6 na casa 5 e a corda 5 solta, juntas. Se estiverem diferentes, você ouve um **batimento**, um *uá-uá-uá*. Gire a tarraxa até o batimento sumir.",
          "Faça o mesmo com todas as cordas. Depois confira no afinador.",
          { w: "tuner" },
        ],
      },
      { title: "Igual ou diferente", minutes: 5, body: ["É a mesma habilidade de afinar: perceber se duas notas são iguais.", { w: "ear", kind: "same-diff" }] },
    ],
  },

  {
    day: 27,
    month: M,
    title: "Acompanhando uma melodia",
    minutes: 30,
    objectives: ["Tocar acordes enquanto a melodia acontece", "Trocar C e G no tempo da música", "Ouvir o acorde e a melodia juntos"],
    blocks: [
      { minutes: 5, body: [{ w: "tab", title: "Hino à Alegria", bpm: 70, notes: ODE_TO_JOY }] },
      {
        title: "Acorde e melodia",
        minutes: 6,
        body: [
          "Quando alguém canta, a guitarra faz os **acordes**. Cada acorde combina com as notas da melodia daquele trecho.",
          "No Hino à Alegria bastam dois acordes: **C** e **G**. O app toca a melodia e você acompanha.",
          { w: "chords", chords: ["C", "G"] },
        ],
      },
      {
        title: "Acompanhe o hino",
        minutes: 14,
        body: [
          { w: "changes", chords: ["C", "G"], beats: 4, bpm: 60 },
          { w: "strum", title: "Hino à Alegria: você nos acordes", bpm: 60, measures: bars(["C", "G", "C", "G", "C", "G", "C", "C"]), melody: ODE_TO_JOY },
          { callout: "tip", text: "Depois troque os papéis: grave você tocando os acordes no celular e toque a melodia por cima." },
        ],
      },
      { title: "Qual acorde?", minutes: 5, body: [{ w: "ear", kind: "which-chord", chords: ["C", "G"] }] },
    ],
  },

  {
    day: 28,
    month: M,
    title: "Treino de trocas para o desafio",
    minutes: 30,
    objectives: ["Achar a troca mais lenta", "Treinar cada par separado", "Chegar perto de 70 BPM"],
    blocks: [
      { minutes: 5, body: [{ w: "changes", chords: ["G", "C"], beats: 4, bpm: 60 }] },
      {
        title: "A troca mais lenta manda",
        minutes: 5,
        body: [
          "O desafio do mês é **G → C → D → Em**, 4 tempos cada, a **70 BPM**. A sequência inteira só vai tão rápido quanto a troca mais difícil.",
          "Hoje você mede cada par em 1 minuto e descobre qual é o seu gargalo.",
        ],
      },
      {
        title: "Quatro minutos de trocas",
        minutes: 15,
        body: [
          { w: "minute", id: "g-c", label: "G ↔ C" },
          { w: "minute", id: "c-d", label: "C ↔ D" },
          { w: "minute", id: "d-em", label: "D ↔ Em" },
          { w: "minute", id: "em-g", label: "Em ↔ G" },
          "Repita mais duas vezes o par com o menor número. Depois a sequência inteira:",
          { w: "changes", chords: ["G", "C", "D", "Em"], beats: 4, bpm: 65 },
        ],
      },
      { title: "Qual acorde?", minutes: 5, body: [{ w: "ear", kind: "which-chord", chords: ["G", "C", "D", "Em"] }] },
    ],
  },

  {
    day: 29,
    month: M,
    title: "Ensaio geral",
    minutes: 30,
    objectives: ["Simular o desafio do mês", "Ler uma melodia nova sem ouvir antes", "Saber se está pronto"],
    blocks: [
      { minutes: 5, body: ["Afine a guitarra. Amanhã é dia de desafio.", { w: "tuner" }] },
      {
        title: "O que o desafio pede",
        minutes: 5,
        body: [
          { list: ["**Trocas:** G → C → D → Em, 4 tempos cada, duas voltas a 70 BPM sem parar a batida.", "**Leitura:** uma melodia de 4 compassos que você nunca viu, a 60 BPM, sem ouvir antes."] },
          { callout: "selfCheck", text: "Grave os dois. Ouvir a gravação mostra coisas que você não percebe tocando." },
        ],
      },
      {
        title: "Simulado",
        minutes: 15,
        body: [
          { w: "changes", title: "Simulado a 70 BPM", chords: ["G", "C", "D", "Em"], beats: 4, bpm: 70 },
          { w: "tab", title: "Melodia C (leia antes de ouvir)", bpm: 60, notes: MELODY_C },
          {
            w: "selfcheck",
            id: "ensaio",
            title: "Estou pronto?",
            items: [
              { id: "70", label: "Duas voltas a 70 BPM sem parar" },
              { id: "limpo", label: "O tempo 1 de cada acorde sai limpo" },
              { id: "leitura", label: "Li a melodia C sem parar" },
            ],
          },
          "Se ainda não deu, sem problema: repita este dia amanhã antes do desafio.",
        ],
      },
      { title: "Qual acorde?", minutes: 5, body: [{ w: "ear", kind: "which-chord", chords: ["G", "C", "D", "Em", "Am", "A"] }] },
    ],
  },

  {
    day: 30,
    month: M,
    title: "Desafio do mês 1",
    minutes: 30,
    objectives: ["G → C → D → Em a 70 BPM, duas voltas sem parar", "Ler uma melodia nova de 4 compassos", "Registrar seu BPM"],
    blocks: [
      { title: "Aquecimento", minutes: 5, body: ["Afine e faça uma volta devagar.", { w: "tuner" }, { w: "changes", chords: ["G", "C", "D", "Em"], beats: 4, bpm: 60 }] },
      {
        title: "As regras",
        minutes: 3,
        body: [
          {
            list: [
              "Metrônomo a **70 BPM**, 4 tempos em cada acorde.",
              "**Duas voltas** de G → C → D → Em sem parar a batida.",
              "Errou uma nota? Vale, se o pulso não parou. Parou? Recomece.",
              "Depois, leia a melodia nova **sem apertar Tocar antes**.",
            ],
          },
        ],
      },
      {
        title: "Desafio",
        minutes: 15,
        body: [
          { w: "changes", title: "Desafio: G → C → D → Em", chords: ["G", "C", "D", "Em"], beats: 4, bpm: 70 },
          { w: "tab", title: "Melodia D (primeira vista)", bpm: 60, notes: MELODY_D },
          { w: "bpmlog", month: 1, target: 70 },
          { callout: "tip", text: "Não chegou nos 70? Registre o que conseguiu e siga para o mês 2 mesmo assim. Volte aqui daqui a uma semana. As trocas continuam no mês 2 e vão melhorar." },
        ],
      },
      {
        title: "Ouvido e o que vem",
        minutes: 7,
        body: [
          { w: "ear", kind: "which-chord", chords: ["G", "C", "D", "Em", "Am", "A"] },
          "No **mês 2** você aprende a escala cromática, tons e semitons, power chords, a primeira pestana e a **pentatônica**: a escala dos solos. No fim dele, você improvisa seus primeiros 4 compassos.",
        ],
      },
    ],
  },
];
