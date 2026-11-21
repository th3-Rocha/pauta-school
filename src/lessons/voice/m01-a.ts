// Canto · mês 1 · dias 1 a 15 (docs/curricula/voice.md, seção 8).
import type { Lesson } from "../types";
import { CHECK_AFTER, CHECK_BEFORE, COOLDOWN, D, NO_PAIN, PAUSE, STRAW_TIP, TRILL_HOW, WARMUP } from "./shared";

export const VOICE_M01_A: Lesson[] = [
  {
    day: 1,
    month: 1,
    title: "Sua voz já sabe afinar",
    minutes: 15,
    objectives: ["Escolher a voz do Chimera parecida com a sua", "Achar a nota confortável da sua fala", "Repetir uma nota longa e acertar o alvo"],
    blocks: [
      {
        title: "Antes de começar",
        minutes: 4,
        body: [
          "Bem-vindo ao canto. Se você acha que \"canta desafinado\", este curso é para você: **quase todo mundo consegue cantar afinado**. Só uma pessoa em cada 70 tem uma dificuldade real para perceber notas (a amusia). Para o resto, falta treino entre o ouvido e a voz, e treino se faz.",
          CHECK_BEFORE,
          "Agora escolha **com que voz o Chimera vai cantar com você**. O Chimera é uma voz simulada por física: pulmões, pregas vocais, garganta e boca. Ele vai cantar os exemplos na sua região, para você não precisar adivinhar a oitava.",
          "Toque em **Medir minha voz** e fale normalmente por uns segundos. O site sugere um ponto no triângulo e acha a sua **nota-base**: a nota confortável perto da sua fala. Todos os exercícios partem dela.",
          { w: "voice-setup" },
        ],
      },
      {
        title: "Falar e cantar usam o mesmo instrumento",
        minutes: 3,
        body: [
          "Quando você fala, duas **pregas vocais** (não \"cordas\") vibram dentro da garganta. Cantar é a mesma coisa, só que segurando a nota. Ou seja: **você canta desde que aprendeu a falar**.",
          "Repare no Chimera: o ar sobe dos pulmões, as pregas vibram e a boca dá forma ao som. Toque nos botões e veja a cabeça por dentro.",
          {
            w: "chimera",
            caption: "O âmbar é o som; o rosa, o corpo. No 3D, arraste a cabeça para girar.",
            demos: [
              { label: "Sua nota-base", notes: [0], vowel: "a", seconds: 2 },
              { label: "Falar × cantar", notes: [0, 2, 0], vowel: "a", seconds: 0.6 },
            ],
          },
        ],
      },
      {
        title: "Laboratório: a primeira nota",
        minutes: 6,
        body: [
          WARMUP,
          STRAW_TIP,
          TRILL_HOW,
          "Agora ouça o Chimera cantar a sua nota-base e repita com **\"hum\"** de boca fechada, sem força. Volume de conversa. Quando a sua voz entrar na faixa, o anel enche: segure **3 segundos**.",
          "Se o medidor disser que você está uma **oitava** acima ou abaixo, **vale**. Isso é normal quando vozes diferentes cantam juntas.",
          { w: "match", offset: 0, vowel: "u", tolerance: 50, hold: 3, title: "Repita a sua nota-base" },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido: guarde sua voz de hoje",
        minutes: 2,
        body: [
          "Grave 10 segundos: fale seu nome e cante a nota-base em \"hum\". Ouça sem julgar. É o retrato do seu dia 1.",
          { w: "recorder", id: "voice-d1", label: "Minha voz no dia 1" },
          NO_PAIN,
          CHECK_AFTER,
        ],
      },
    ],
  },
  {
    day: 2,
    month: 1,
    title: "O canudo protetor",
    minutes: 15,
    objectives: ["Entender por que o canudo protege a voz", "Subir e descer um degrau", "Ouvir qual nota é mais aguda"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "Ontem você achou sua nota-base. Repita ela uma vez, em \"hum\", e segure 3 segundos.", { w: "match", offset: 0, vowel: "u", tolerance: 50, hold: 3 }],
      },
      {
        title: "Por que o canudo",
        minutes: 3,
        body: [
          "Cantar num canudo fino (ou com os lábios vibrando, ou em \"hum\") **fecha parte da saída do ar**. O ar que volta empurra de leve as pregas vocais para fora, e elas batem uma na outra com **menos força**. Resultado: menos esforço e uma voz mais solta.",
          "Os especialistas chamam isso de **SOVT** (trato vocal semiocluído). Vai estar em toda aula, no começo e no fim. **Não precisa comprar nada:** sem canudo, o \"hum\" e o \"brrr\" fazem quase o mesmo.",
          {
            w: "chimera",
            view: "2d",
            caption: "Compare: com o canudo, o ar só tem um buraquinho para sair. Veja os lábios em bico em volta dele.",
            demos: [
              { label: "Boca aberta (\"á\")", notes: [0], vowel: "a", seconds: 1.6 },
              { label: "No canudo", notes: [0, 2, 0], vowel: "u", seconds: 1, artic: { lipAp: 0.12, lipProt: 1.2, lipWidth: 0.15, jaw: 0.5 }, prop: "straw" },
              { label: "\"Hum\" (sem canudo)", notes: [0], vowel: "u", seconds: 1.8, artic: { lipAp: -0.25, velum: 0.45, jaw: 0.4 }, prop: "hum" },
            ],
          },
        ],
      },
      {
        title: "Laboratório: um degrau",
        minutes: 7,
        body: [
          WARMUP,
          "Cante no canudo (ou em \"hum\") a sua nota-base e depois **um degrau acima** (o 2º grau). Volte para a base. Devagar, sem empurrar.",
          { w: "phrase", title: "Base → um degrau → base", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "hum", v: "u" }, { s: D[2], d: 2, syl: "hum", v: "u" }, { s: D[1], d: 4, syl: "hum", v: "u" }] },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido: qual é mais aguda?",
        minutes: 3,
        body: ["Ouça duas notas e diga qual é **mais aguda** (mais \"fina\"). Responda antes de cantar qualquer coisa: primeiro o ouvido, depois a voz.", { w: "ear", kind: "highlow-close" }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 3,
    month: 1,
    title: "Respirar sem erguer os ombros",
    minutes: 15,
    objectives: ["Respirar baixo, sem subir os ombros", "Medir seu primeiro \"sss\"", "Cantar a nota-base em \"hum\" com ar constante"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "Subir e descer um degrau, como ontem.", { w: "phrase", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "hum", v: "u" }, { s: D[2], d: 2, syl: "hum", v: "u" }, { s: D[1], d: 4, syl: "hum", v: "u" }] }],
      },
      {
        title: "O diafragma",
        minutes: 3,
        body: [
          "Ao inspirar, o **diafragma** (um músculo em forma de cúpula embaixo dos pulmões) desce e empurra a barriga para fora. Por isso **a barriga expandir é sinal de que ele trabalhou**. Os ombros não precisam subir.",
          "Dois mitos para esquecer: não é preciso \"cantar com a barriga dura\" (isso aperta a garganta) e ninguém respira \"pelas costas\".",
          {
            callout: "selfCheck",
            label: "Teste das mãos",
            text: ["Uma mão no peito, outra no umbigo. Inspire em silêncio pelo nariz.", "Só a mão de baixo deve avançar. A de cima fica quase parada."],
          },
        ],
      },
      {
        title: "Laboratório: o ar",
        minutes: 7,
        body: [
          WARMUP,
          "Siga o círculo: inspire em 4, segure em 4, solte em 8 com **\"sss\"**. O microfone mostra se o ar sai **constante**: linha reta é ótimo.",
          { w: "breath", pattern: [4, 4, 8], cycles: 3 },
          PAUSE,
          "Agora meça quanto tempo seu \"sss\" dura, sem forçar no fim. Esse número é a sua **linha de base**: no mês 3 você compara.",
          { w: "sss" },
          COOLDOWN,
        ],
      },
      {
        title: "Criação: ritmo com \"sss\"",
        minutes: 3,
        body: ["Ligue o metrônomo e invente ritmos curtos de \"sss\": longo, curto-curto, longo. Só ar, sem voz.", { w: "metronome", bpm: 60 }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 4,
    month: 1,
    title: "Vibrar os lábios sem vergonha",
    minutes: 15,
    objectives: ["Fazer a vibração de lábios (\"brrr\")", "Mapear as notas confortáveis", "Brincar com sirenes leves"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "Um ciclo de respiração: 4 inspira, 4 segura, 8 solta.", { w: "breath", pattern: [4, 4, 8], cycles: 1 }],
      },
      {
        title: "O \"brrr\" é um canudo natural",
        minutes: 3,
        body: [
          "Vibrar os lábios (o \"brrr\" de motorzinho) faz o mesmo que o canudo: fecha parte da saída do ar e deixa as pregas trabalharem leve.",
          TRILL_HOW,
          {
            w: "chimera",
            caption: "Repare: a boca fica parada e encostada; quem faz os lábios tremerem é o ar (em âmbar) passando.",
            demos: [
              { label: "Só o ar, sem voz", notes: [0], vowel: "u", seconds: 2, artic: { lipAp: 0.1, lipProt: 0.3, jaw: 0.35 }, prop: "trill", source: { voiced: false, pressure: 12, breathiness: 1 } },
              { label: "\"Brrr\" com voz", notes: [0, 2, 4, 2, 0], vowel: "u", seconds: 0.6, artic: { lipAp: 0.02, lipProt: 0.3, jaw: 0.35 }, prop: "trill", source: { roughness: 0.55 } },
            ],
          },
        ],
      },
      {
        title: "Laboratório: três notas vizinhas",
        minutes: 7,
        body: [
          WARMUP,
          "Em \"brrr\" (ou \"hum\"), cante base, um degrau acima e dois degraus acima, e volte. É a primeira escadinha.",
          { w: "phrase", title: "1 – 2 – 3 – 2 – 1", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "brr", v: "u" }, { s: D[2], d: 1, syl: "brr", v: "u" }, { s: D[3], d: 2, syl: "brr", v: "u" }, { s: D[2], d: 1, syl: "brr", v: "u" }, { s: D[1], d: 3, syl: "brr", v: "u" }] },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Criação: sirenes de fala",
        minutes: 3,
        body: [
          "Diga \"oi!\" e \"uau!\" do jeito animado que você falaria com um amigo. A voz sobe e desce sozinha: é uma sirene de fala. Faça 5 vezes, bem leve, e depois cante a nota-base de novo.",
          { w: "match", offset: 0, vowel: "u", tolerance: 50, hold: 3 },
          CHECK_AFTER,
        ],
      },
    ],
  },
  {
    day: 5,
    month: 1,
    title: "A primeira vogal aberta",
    minutes: 16,
    objectives: ["Entender fonte e filtro", "Passar do \"hum\" para \"mô\" e \"mú\" na mesma nota", "Responder ao Chimera"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "A escadinha de ontem, agora em \"hum\".", { w: "phrase", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "hum", v: "u" }, { s: D[2], d: 1, syl: "hum", v: "u" }, { s: D[3], d: 2, syl: "hum", v: "u" }, { s: D[2], d: 1, syl: "hum", v: "u" }, { s: D[1], d: 3, syl: "hum", v: "u" }] }],
      },
      {
        title: "Fonte e filtro",
        minutes: 3,
        body: [
          "A voz tem duas partes. A **fonte**: as pregas vocais, que fazem a nota. O **filtro**: garganta, língua e lábios, que transformam essa nota em \"a\", \"ô\" ou \"u\".",
          "Por isso dá para trocar de vogal **sem mudar a nota**: a fonte fica igual, só o filtro muda. Veja no Chimera: a nota é a mesma, a boca muda.",
          {
            w: "chimera",
            caption: "A mesma nota, três vogais: repare na língua e nos lábios.",
            demos: [
              { label: "u → ô → á", notes: [0, 0, 0], seconds: 1.2, vowels: ["u", "ô", "a"] },
              { label: "\"u\"", notes: [0], vowel: "u", seconds: 1.5 },
              { label: "\"ô\"", notes: [0], vowel: "ô", seconds: 1.5 },
              { label: "\"á\"", notes: [0], vowel: "a", seconds: 1.5 },
            ],
          },
        ],
      },
      {
        title: "Laboratório: do \"hum\" para a vogal",
        minutes: 7,
        body: [
          WARMUP,
          "Na nota-base: comece em \"hum\" e abra para **\"mô\"**, sem mexer o pescoço. Depois \"mú\".",
          { w: "phrase", title: "hum → mô → mú", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "hum", v: "u" }, { s: D[1], d: 2, syl: "mô", v: "ô" }, { s: D[1], d: 2, syl: "hum", v: "u" }, { s: D[1], d: 2, syl: "mú", v: "u" }] },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido: responda ao Chimera",
        minutes: 4,
        body: [
          "O Chimera canta duas notas em \"mú\". Ouça e cante igual logo depois.",
          { w: "phrase", title: "Chamado 1", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "mú" }, { s: D[2], d: 2, syl: "mú" }] },
          { w: "phrase", title: "Chamado 2", bpm: 66, tolerance: 50, notes: [{ s: D[3], d: 2, syl: "mú" }, { s: D[1], d: 2, syl: "mú" }] },
          CHECK_AFTER,
        ],
      },
    ],
  },
  {
    day: 6,
    month: 1,
    title: "Subir e descer degraus",
    minutes: 16,
    objectives: ["Cantar 1–2–3–2–1 em \"lô\"", "Saber que melodias andam por passos", "Inventar pergunta e resposta"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "Do \"hum\" para \"mô\" na nota-base.", { w: "phrase", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "hum", v: "u" }, { s: D[1], d: 2, syl: "mô" }] }],
      },
      {
        title: "Melodias andam por passos",
        minutes: 2,
        body: [
          "A maioria das melodias anda por **passos vizinhos**: de uma nota para a do lado. A partir de hoje, chamamos as notas por número: **1** é a nota-base, **2** o degrau de cima, **3** o seguinte.",
          { w: "solfege", title: "Os degraus 1, 2 e 3", steps: [0, 1, 2], tolerance: 50 },
        ],
      },
      {
        title: "Laboratório: a escadinha em \"lô\"",
        minutes: 8,
        body: [
          WARMUP,
          "Primeiro no canudo, depois em **\"lô\"**. Devagar.",
          { w: "phrase", title: "1 – 2 – 3 – 2 – 1 em \"lô\"", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "lô" }, { s: D[2], d: 1, syl: "lô" }, { s: D[3], d: 2, syl: "lô" }, { s: D[2], d: 1, syl: "lô" }, { s: D[1], d: 3, syl: "lô" }] },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Criação: pergunta e resposta",
        minutes: 4,
        body: [
          "Invente uma **pergunta** que sobe (1–2–3) e uma **resposta** que desce (3–2–1), em \"lô\". Grave e ouça.",
          { w: "recorder", id: "voice-d6" },
          CHECK_AFTER,
        ],
      },
    ],
  },
  {
    day: 7,
    month: 1,
    title: "Revisão 1: sua base segura",
    minutes: 16,
    objectives: ["Revisar a semana", "Comparar seu \"sss\" com o dia 3", "Cantar a primeira cantiga em \"lá\""],
    blocks: [
      {
        title: "Revisão da semana",
        minutes: 4,
        body: [
          CHECK_BEFORE,
          "Uma semana de voz! Pausas não são perda de tempo: a voz se recupera nelas, e o cérebro também guarda melhor o que treinou.",
          { w: "match", offset: 0, vowel: "ô", tolerance: 50, hold: 4, title: "Nota-base em \"mô\", 4 segundos" },
        ],
      },
      {
        title: "O que mudou",
        minutes: 2,
        body: ["Meça o \"sss\" de novo e compare com a primeira vez.", { w: "sss" }],
      },
      {
        title: "Laboratório: a escada inteira da semana",
        minutes: 6,
        body: [
          WARMUP,
          { w: "phrase", title: "1 – 2 – 3 – 2 – 1 em \"mô\"", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "mô" }, { s: D[2], d: 1, syl: "mô" }, { s: D[3], d: 2, syl: "mô" }, { s: D[2], d: 1, syl: "mô" }, { s: D[1], d: 3, syl: "mô" }] },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Cantiga: \"Bom dia\" em \"lá\"",
        minutes: 4,
        body: [
          "Sua primeira cantiga, só com as notas 1, 2 e 3. Primeiro ouça o Chimera, depois cante em \"lá\".",
          { w: "phrase", title: "Cantiga \"Bom dia\" (Pauta)", bpm: 72, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "lá" }, { s: D[2], d: 1, syl: "lá" }, { s: D[3], d: 1, syl: "lá" }, { s: D[3], d: 1, syl: "lá" }, { s: D[2], d: 1, syl: "lá" }, { s: D[2], d: 1, syl: "lá" }, { s: D[1], d: 2, syl: "lá" }] },
          CHECK_AFTER,
        ],
      },
    ],
  },
  {
    day: 8,
    month: 1,
    title: "Começar a nota sem bater",
    minutes: 16,
    objectives: ["Conhecer os três jeitos de começar uma nota", "Fazer o ataque suave", "Reconhecer o ataque suave de ouvido"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "A cantiga \"Bom dia\" em \"lá\".", { w: "phrase", bpm: 72, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "lá" }, { s: D[2], d: 1, syl: "lá" }, { s: D[3], d: 1, syl: "lá" }, { s: D[3], d: 1, syl: "lá" }, { s: D[2], d: 1, syl: "lá" }, { s: D[2], d: 1, syl: "lá" }, { s: D[1], d: 2, syl: "lá" }] }],
      },
      {
        title: "Três ataques",
        minutes: 3,
        body: [
          "O começo de uma nota se chama **ataque**. Há três jeitos:",
          { list: ["**Soprado:** o ar sai antes do som (\"hhô\"). A voz fica fraca e cansa.", "**Duro (golpe de glote):** as pregas batem fechadas, como num \"ô!\" de susto. Evite.", "**Suave:** o ar e as pregas chegam juntos. É o que vamos treinar."] },
          {
            w: "chimera",
            view: "2d",
            caption: "Ouça a diferença no começo da nota.",
            demos: [
              { label: "Soprado", notes: [0], vowel: "ô", seconds: 1.5, source: { breathiness: 0.85 } },
              { label: "Apertado", notes: [0], vowel: "ô", seconds: 1.5, source: { tension: 0.9 } },
              { label: "Equilibrado", notes: [0], vowel: "ô", seconds: 1.5 },
            ],
          },
        ],
      },
      {
        title: "Laboratório: o ataque suave",
        minutes: 7,
        body: [
          WARMUP,
          "O truque: comece com **\"m\"** (\"mmmô\"). O \"m\" já põe as pregas vibrando antes da boca abrir. Faça 5 vezes, cada uma uma nota separada.",
          { w: "phrase", title: "\"mô\" suave, 4 vezes", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "mô" }, { s: D[1], d: 2, syl: "mô" }, { s: D[2], d: 2, syl: "mô" }, { s: D[1], d: 2, syl: "mô" }] },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido: qual foi suave?",
        minutes: 4,
        body: [
          "Volte ao monitor acima e ouça os três ataques de novo, de olhos fechados. Consegue dizer qual é qual?",
          { w: "selfcheck", id: "d8", items: [{ id: "a", label: "Reconheci o soprado" }, { id: "b", label: "Reconheci o apertado" }, { id: "c", label: "Fiz 4 ataques suaves com \"m\"" }] },
          CHECK_AFTER,
        ],
      },
    ],
  },
  {
    day: 9,
    month: 1,
    title: "O pulso no corpo",
    minutes: 16,
    objectives: ["Sentir o pulso com o pé", "Entrar no tempo 1", "Fazer eco rítmico"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "Três ataques suaves em \"mô\".", { w: "match", offset: 0, vowel: "ô", tolerance: 50, hold: 2 }],
      },
      {
        title: "Entrar no tempo",
        minutes: 3,
        body: [
          "Cantar junto com a música depende de **sentir a batida antes de abrir a boca**. Bata o pé no clique, conte \"1, 2, 3, 4\" por dentro e entre no próximo \"1\".",
          "Nos exercícios de frase, o site dá **4 cliques** antes. A primeira nota cai no quinto.",
        ],
      },
      {
        title: "Laboratório: \"pá\" no tempo",
        minutes: 7,
        body: [
          WARMUP,
          { w: "metronome", bpm: 70 },
          "Com o metrônomo: \"pá\" curto em cada tempo 1. Depois, a frase abaixo (uma nota só, no tempo).",
          { w: "phrase", title: "\"pá\" nos tempos", bpm: 70, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "pá" }, { s: D[1], d: 1, syl: "pá" }, { s: D[1], d: 1, syl: "pá" }, { s: D[1], d: 1, syl: "pá" }, { s: D[2], d: 2, syl: "pá" }, { s: D[1], d: 2, syl: "pá" }] },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Criação: eco",
        minutes: 4,
        body: ["Com o metrônomo a 70: bata um ritmo de 4 tempos com as mãos e repita com \"pá\". Invente 3 ritmos diferentes.", { w: "metronome", bpm: 70 }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 10,
    month: 1,
    title: "Espaço para o \"á\"",
    minutes: 16,
    objectives: ["Abrir a boca na vertical", "Cantar \"lá\" em 3 notas", "Distinguir \"á\" de \"ô\""],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "\"pá\" no tempo, a 70.", { w: "phrase", bpm: 70, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "pá" }, { s: D[1], d: 1, syl: "pá" }, { s: D[2], d: 1, syl: "pá" }, { s: D[1], d: 1, syl: "pá" }] }],
      },
      {
        title: "A boca do \"á\"",
        minutes: 3,
        body: [
          "No \"á\" a boca abre **para baixo**, como num bocejo começando, sem puxar o queixo para a frente e sem encolher a língua (a ponta fica atrás dos dentes de baixo).",
          { w: "vowels" },
          { callout: "selfCheck", label: "No espelho", text: "Diga \"á\" bocejado. Cabe um dedo deitado entre os dentes? O queixo ficou no lugar?" },
        ],
      },
      {
        title: "Laboratório: \"lá\"",
        minutes: 7,
        body: [
          WARMUP,
          "Canudo primeiro, depois \"lá\" nas mesmas notas.",
          { w: "phrase", title: "1 – 2 – 3 – 2 – 1 em \"lá\"", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "lá" }, { s: D[2], d: 1, syl: "lá" }, { s: D[3], d: 2, syl: "lá" }, { s: D[2], d: 1, syl: "lá" }, { s: D[1], d: 3, syl: "lá" }] },
          PAUSE,
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido: \"á\" ou \"ô\"?",
        minutes: 4,
        body: [
          "Toque no mapa de vogais acima em **á** e depois em **ô**. Ouça como o Chimera muda a boca na mesma nota. Agora cante as duas e sinta a diferença na língua.",
          { w: "phrase", title: "lá – lô – lá – lô", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "lá" }, { s: D[1], d: 2, syl: "lô" }, { s: D[1], d: 2, syl: "lá" }, { s: D[1], d: 2, syl: "lô" }] },
          CHECK_AFTER,
        ],
      },
    ],
  },
  {
    day: 11,
    month: 1,
    title: "O segredo do \"ê\"",
    minutes: 16,
    objectives: ["Arquear a língua sem endurecer", "Escala 1–2–3–2–1 em \"mê\"", "Alternar \"lá\" e \"lê\""],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "\"lá\" na escadinha.", { w: "phrase", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "lá" }, { s: D[2], d: 1, syl: "lá" }, { s: D[3], d: 2, syl: "lá" }, { s: D[1], d: 2, syl: "lá" }] }],
      },
      {
        title: "A língua do \"ê\"",
        minutes: 3,
        body: [
          "No \"ê\" a língua **arqueia para a frente**, mas o embaixo da boca continua macio.",
          { callout: "selfCheck", label: "Teste do polegar", text: "Ponha o polegar embaixo do queixo, na parte mole. Cante \"ê\": se endurecer muito, a língua está empurrando. Solte e tente de novo." },
          { w: "chimera", view: "2d", caption: "Veja a língua subir para a frente do \"á\" para o \"ê\".", demos: [{ label: "á → ê", notes: [0, 0], seconds: 1.4, vowels: ["a", "ê"] }, { label: "\"ê\"", notes: [0], vowel: "ê", seconds: 1.6 }] },
        ],
      },
      {
        title: "Laboratório: \"mê\" e \"lê\"",
        minutes: 7,
        body: [
          WARMUP,
          { w: "phrase", title: "1 – 2 – 3 – 2 – 1 em \"mê\"", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "mê" }, { s: D[2], d: 1, syl: "mê" }, { s: D[3], d: 2, syl: "mê" }, { s: D[2], d: 1, syl: "mê" }, { s: D[1], d: 3, syl: "mê" }] },
          PAUSE,
          { w: "phrase", title: "O mesmo em \"lê\"", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "lê" }, { s: D[2], d: 1, syl: "lê" }, { s: D[3], d: 2, syl: "lê" }, { s: D[2], d: 1, syl: "lê" }, { s: D[1], d: 3, syl: "lê" }] },
          COOLDOWN,
        ],
      },
      {
        title: "Criação: lá e lê",
        minutes: 4,
        body: ["Alterne \"lá\" e \"lê\" na mesma nota, como uma conversa. A nota não muda, só a boca.", { w: "phrase", bpm: 66, tolerance: 50, notes: [{ s: D[3], d: 2, syl: "lá" }, { s: D[3], d: 2, syl: "lê" }, { s: D[2], d: 2, syl: "lá" }, { s: D[1], d: 2, syl: "lê" }] }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 12,
    month: 1,
    title: "Saltos pequenos: a terça",
    minutes: 16,
    objectives: ["Imaginar a nota antes de cantar", "Saltar do 1 para o 3", "Diferenciar passo e salto"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "\"mê\" na escadinha.", { w: "phrase", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "mê" }, { s: D[2], d: 1, syl: "mê" }, { s: D[3], d: 2, syl: "mê" }, { s: D[1], d: 2, syl: "mê" }] }],
      },
      {
        title: "Ouvir por dentro",
        minutes: 3,
        body: [
          "Até agora você andou de degrau em degrau. Hoje você **pula um**: do 1 direto para o 3. Esse salto se chama **terça**.",
          "O segredo é o **ensaio mental**: antes de cantar, **ouça a nota na cabeça por 3 segundos**. Quem imagina a nota antes acerta mais.",
          { w: "chimera", demos: [{ label: "1 – 3 – 1", notes: [0, 4, 0], vowel: "ô", seconds: 1 }, { label: "1 – 2 – 3 (passos)", notes: [0, 2, 4], vowel: "ô", seconds: 0.8 }] },
        ],
      },
      {
        title: "Laboratório: 1 – 3 – 1",
        minutes: 7,
        body: [
          WARMUP,
          "Antes de cada frase, 3 segundos de silêncio ouvindo por dentro.",
          { w: "phrase", title: "1 – 3 – 1 em \"lô\"", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "lô" }, { s: D[3], d: 2, syl: "lô" }, { s: D[1], d: 4, syl: "lô" }] },
          PAUSE,
          { w: "match", offset: D[3], vowel: "ô", tolerance: 50, hold: 3, title: "Segure o 3" },
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido: passo ou salto?",
        minutes: 4,
        body: ["Ouça dois intervalos e diga qual é qual: a **segunda** (passo) ou a **terça** (salto).", { w: "ear", kind: "interval", options: ["2M", "3M"] }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 13,
    month: 1,
    title: "Entendendo a oitava",
    minutes: 15,
    objectives: ["Entender por que vozes diferentes cantam a \"mesma\" nota", "Ouvir o Chimera na sua voz e na oposta", "Cantar na sua região"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "O salto 1 – 3 – 1.", { w: "phrase", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "lô" }, { s: D[3], d: 2, syl: "lô" }, { s: D[1], d: 4, syl: "lô" }] }],
      },
      {
        title: "A mesma nota, em outra altura",
        minutes: 4,
        body: [
          "Quando um homem e uma criança cantam \"Parabéns\" juntos, eles não cantam as mesmas notas: a criança canta **uma oitava acima**. A música soa igual, porque notas a uma oitava de distância \"combinam\" perfeitamente.",
          "É por isso que o medidor aceita a oitava, e é por isso que o Chimera canta na **sua** região: assim você não fica tentando imitar uma voz que não é a sua.",
          { w: "chimera", caption: "Mude a voz no triângulo (aula 1 ou página de ajuste) para ouvir outro corpo.", demos: [{ label: "Sua nota-base", notes: [0], vowel: "a", seconds: 1.4 }, { label: "Uma oitava acima", notes: [12], vowel: "a", seconds: 1.4 }, { label: "As duas, seguidas", notes: [0, 12, 0], vowel: "a", seconds: 1 }] },
        ],
      },
      {
        title: "Laboratório",
        minutes: 6,
        body: [WARMUP, "Cante a escadinha em \"lô\", na sua região.", { w: "phrase", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "lô" }, { s: D[2], d: 1, syl: "lô" }, { s: D[3], d: 2, syl: "lô" }, { s: D[2], d: 1, syl: "lô" }, { s: D[1], d: 3, syl: "lô" }] }, PAUSE, COOLDOWN],
      },
      {
        title: "Criação",
        minutes: 3,
        body: ["Fale uma frase qualquer (\"hoje o dia está bonito\") e depois **cante** essa frase só nas notas 1, 2 e 3. Grave.", { w: "recorder", id: "voice-d13" }, CHECK_AFTER],
      },
    ],
  },
  {
    day: 14,
    month: 1,
    title: "Revisão 2: voz e ouvido juntos",
    minutes: 17,
    objectives: ["Revisar as semanas 1 e 2", "Gravar e avaliar com checklist", "Notas longas afinadas"],
    blocks: [
      {
        title: "Revisão espaçada",
        minutes: 3,
        body: [CHECK_BEFORE, "Do dia 7: a cantiga \"Bom dia\".", { w: "phrase", bpm: 72, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "lá" }, { s: D[2], d: 1, syl: "lá" }, { s: D[3], d: 1, syl: "lá" }, { s: D[3], d: 1, syl: "lá" }, { s: D[2], d: 1, syl: "lá" }, { s: D[2], d: 1, syl: "lá" }, { s: D[1], d: 2, syl: "lá" }] }],
      },
      {
        title: "O que você já sabe",
        minutes: 2,
        body: [{ list: ["O canudo e o \"brrr\" protegem a voz.", "A barriga expande ao inspirar; os ombros ficam.", "Ataque suave: comece com \"m\".", "Ouça a nota por dentro antes de cantar.", "Oitava acima ou abaixo vale."] }],
      },
      {
        title: "Laboratório: notas longas",
        minutes: 8,
        body: [
          WARMUP,
          { w: "phrase", title: "Notas longas: 1 – 3 – 2 – 1", bpm: 60, tolerance: 50, goal: 0.75, notes: [{ s: D[1], d: 3, syl: "mô" }, { s: D[3], d: 3, syl: "mô" }, { s: D[2], d: 3, syl: "mô" }, { s: D[1], d: 4, syl: "mô" }] },
          PAUSE,
          { w: "phrase", title: "Ataques suaves e saltos", bpm: 60, tolerance: 50, notes: [{ s: D[1], d: 2, syl: "mô" }, { s: D[3], d: 2, syl: "mô" }, { s: D[1], d: 2, syl: "mô" }, { s: D[3], d: 2, syl: "mô" }, { s: D[1], d: 4, syl: "mô" }] },
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido: grave e avalie",
        minutes: 4,
        body: [
          "Grave 15 segundos da cantiga \"Bom dia\" e ouça com esta lista:",
          { w: "recorder", id: "voice-d14" },
          { w: "selfcheck", id: "d14", items: [{ id: "a", label: "As notas longas ficaram paradas (sem balançar)" }, { id: "b", label: "Os começos foram suaves" }, { id: "c", label: "Respirei sem subir os ombros" }] },
          CHECK_AFTER,
        ],
      },
    ],
  },
  {
    day: 15,
    month: 1,
    title: "Conhecendo seu centro",
    minutes: 16,
    objectives: ["Entender o que é tessitura", "Medir sua primeira extensão confortável", "Guardar no mapa de extensão"],
    blocks: [
      {
        title: "Revisão",
        minutes: 2,
        body: [CHECK_BEFORE, "Nota-base em \"mô\", 4 segundos.", { w: "match", offset: 0, vowel: "ô", tolerance: 50, hold: 4 }],
      },
      {
        title: "Tessitura",
        minutes: 3,
        body: [
          "**Extensão** é da nota mais grave à mais aguda que sua voz alcança. **Tessitura** é a parte do meio, onde a voz **flui sem esforço e sem grito**. É lá que vamos morar por enquanto.",
          "Nomes como soprano ou barítono são só um ponto de partida. A voz muda com o treino (e com a idade).",
        ],
      },
      {
        title: "Laboratório: o mapa da sua voz",
        minutes: 8,
        body: [
          WARMUP,
          "Deslize no canudo ou em \"u\" do grave ao agudo, **sem forçar**. Pare antes de apertar.",
          { w: "range" },
          { callout: "warning", label: "Atenção", text: "Pare se sentir qualquer desconforto. O teste não é para chegar o mais longe possível: é para achar onde a voz é feliz." },
          COOLDOWN,
        ],
      },
      {
        title: "Ouvido",
        minutes: 3,
        body: ["Ouça o Chimera cantar a sua nota-base e os degraus 1 a 3. Cante junto em \"lô\".", { w: "phrase", bpm: 66, tolerance: 50, notes: [{ s: D[1], d: 1, syl: "lô" }, { s: D[2], d: 1, syl: "lô" }, { s: D[3], d: 2, syl: "lô" }, { s: D[2], d: 1, syl: "lô" }, { s: D[1], d: 3, syl: "lô" }] }, CHECK_AFTER],
      },
    ],
  },
];
