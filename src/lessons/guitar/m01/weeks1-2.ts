// Mês 1 · dias 1 a 15
import type { Lesson } from "../../types";
import { CLEAN_CHORD, ALL_DOWN, TWINKLE, HALVES, ODE_TO_JOY, POSTURE, THREE_REST, n, r } from "./shared";

const M = 1;

export const DAYS_1_TO_15: Lesson[] = [
  {
    day: 1,
    month: M,
    title: "Conheça a guitarra e afine as seis cordas",
    minutes: 30,
    objectives: [
      "Saber o número e o nome de cada corda",
      "Afinar a guitarra com o afinador",
      "Segurar a guitarra e a palheta sem tensão",
      "Tocar as cordas soltas no pulso do metrônomo",
    ],
    blocks: [
      {
        title: "Antes de começar",
        subtitle: "O que você precisa e como funciona cada aula",
        minutes: 3,
        body: [
          "Hoje não tem nada para revisar, porque é o primeiro dia. Separe **a guitarra, uma palheta média** e um lugar onde dê para ouvir o celular ou o computador. Se a guitarra for elétrica, ligue no amplificador ou numa interface; se não tiver, dá para estudar desligada.",
          "Toda aula tem os mesmos quatro blocos: **revisão** de algo de dias anteriores, um **conceito**, o **laboratório** com metrônomo e o bloco de **ouvido**. Marque cada um quando terminar.",
          { callout: "tip", text: "Estude todo dia, mesmo que só 15 minutos. Pouco e sempre rende mais que muito de vez em quando." },
        ],
      },
      {
        title: "As seis cordas",
        minutes: 8,
        body: [
          "As cordas são numeradas de baixo para cima: a **corda 1** é a mais fina (som agudo) e a **corda 6** é a mais grossa (som grave). Cada corda solta toca uma nota, da 6 para a 1: **E A D G B E**.",
          "As letras são o jeito internacional de escrever as notas, e é o que aparece em cifras e tablaturas. Para decorar a ordem: **E**lefantes **A**ndam **D**evagar, **G**irafas **B**ebem **E**scondido.",
          { w: "letters" },
          { w: "strings" },
          { callout: "theory", text: "No desenho, a corda 1 fica em cima, igual ao que você vê olhando para a guitarra no colo. A tablatura usa a mesma convenção." },
        ],
      },
      {
        title: "Postura, afinação e pulso",
        minutes: 12,
        body: [
          { h: "1. Postura" },
          "Sente na beira da cadeira, com as costas retas. Confira cada item, de preferência na frente de um espelho.",
          POSTURE,
          { h: "2. Afinar" },
          "Escolha a corda, toque ela solta e gire a tarraxa devagar até o ponteiro parar no meio. Comece pela corda 6 e vá até a 1. Se a nota estiver muito longe, use **Ouvir a nota certa** para ter uma referência.",
          { w: "tuner" },
          { callout: "warning", text: "Gire a tarraxa aos poucos e toque de novo a cada giro. Esticar demais arrebenta a corda." },
          { h: "3. Cordas soltas no pulso" },
          "Ligue o metrônomo em `60 BPM`. Toque cada corda solta **4 vezes**, uma por clique, sempre com a palheta para baixo. Comece pela corda 6 e termine na 1, sem parar entre as cordas. Conte em voz alta: *1, 2, 3, 4*.",
          { w: "metronome", bpm: 60 },
          { callout: "selfCheck", text: "Grave 30 segundos no celular e escute. Cada nota cai junto com o clique? Se sim, suba para 70 BPM." },
        ],
      },
      {
        title: "Grave ou agudo",
        minutes: 7,
        body: [
          "Antes de dar nome às notas, o ouvido precisa perceber a direção: o som subiu ou desceu? Toque em **Ouvir de novo** para escutar duas cordas soltas, uma depois da outra, e responda. A meta é 80% de acerto.",
          { w: "ear", kind: "highlow-strings" },
          { h: "Crie" },
          "Escolha 4 cordas soltas em qualquer ordem e toque no pulso do metrônomo, repetindo a mesma sequência várias vezes. Isso já é um riff. Cante junto as notas que você está tocando.",
        ],
      },
    ],
  },

  {
    day: 2,
    month: M,
    title: "Casas, trastes e os dedos da mão esquerda",
    minutes: 30,
    objectives: ["Saber o que é casa e traste", "Numerar os dedos da mão esquerda", "Tocar o exercício 1-2-3-4 com um dedo por casa"],
    blocks: [
      {
        minutes: 5,
        body: [
          "Afine a guitarra, começando pela corda 6. Depois diga em voz alta o nome de cada corda enquanto toca: *E, A, D, G, B, E*.",
          { w: "tuner" },
        ],
      },
      {
        title: "Casa, traste e dedos",
        minutes: 8,
        body: [
          "Os **trastes** são as barrinhas de metal atravessadas no braço. O espaço entre dois trastes é a **casa**. Quando a tablatura diz *casa 3*, é para apertar a corda no espaço entre o 2º e o 3º traste.",
          "Aperte **logo atrás do traste**, não no meio da casa. Assim a nota sai limpa com pouca força.",
          "Os dedos da mão esquerda têm números: **1** indicador, **2** médio, **3** anelar, **4** mínimo. O polegar é **P**, mas ele fica atrás do braço.",
          {
            w: "fretboard",
            frets: 5,
            markers: [
              { s: 6, f: 1, label: "1" },
              { s: 6, f: 2, label: "2" },
              { s: 6, f: 3, label: "3" },
              { s: 6, f: 4, label: "4" },
            ],
            caption: "Um dedo por casa: dedo 1 na casa 1, dedo 2 na casa 2, e assim por diante. Toque nas bolinhas para ouvir.",
          },
        ],
      },
      {
        title: "Exercício 1-2-3-4",
        minutes: 12,
        body: [
          "Toque as casas 1, 2, 3 e 4 em cada corda, da 6 até a 1, uma nota por clique. Use **um dedo por casa** e deixe os dedos que já tocaram encostados na corda.",
          {
            w: "tab",
            title: "1-2-3-4 nas seis cordas",
            bpm: 60,
            notes: [6, 5, 4, 3, 2, 1].flatMap((s) => [n(s, 1), n(s, 2), n(s, 3), n(s, 4)]),
          },
          {
            w: "selfcheck",
            id: "dedos",
            title: "Confira a mão esquerda",
            items: [
              { id: "ponta", label: "Aperto com a ponta do dedo" },
              { id: "traste", label: "O dedo fica logo atrás do traste" },
              { id: "limpo", label: "Nenhuma nota sai abafada ou trastejando", hint: "Trastejar é aquele zumbido de metal. Aperte um pouco mais perto do traste." },
            ],
          },
          { callout: "tip", text: "Dói na ponta dos dedos? É normal nas primeiras semanas. Pare quando doer e volte mais tarde. Os calos chegam em umas duas semanas." },
        ],
      },
      {
        title: "Notas vizinhas",
        minutes: 5,
        body: ["Agora as duas notas ficam a poucas casas de distância. Escute com atenção: a segunda subiu ou desceu?", { w: "ear", kind: "highlow-close" }],
      },
    ],
  },

  {
    day: 3,
    month: M,
    title: "Lendo tablatura",
    minutes: 30,
    objectives: ["Ler uma tablatura", "Tocar sua primeira melodia", "Diferenciar notas iguais de diferentes"],
    blocks: [
      {
        minutes: 5,
        body: ["Faça o 1-2-3-4 só na corda 1 e na corda 2, devagar, a 60 BPM.", { w: "tab", bpm: 60, notes: [n(1, 1), n(1, 2), n(1, 3), n(1, 4), n(2, 1), n(2, 2), n(2, 3), n(2, 4)] }],
      },
      {
        title: "Como ler tablatura",
        minutes: 8,
        body: [
          "A tablatura tem **6 linhas**, uma para cada corda. A linha de **cima é a corda 1** (a mais fina), igual ao braço desenhado nas aulas.",
          "O **número** em cima da linha diz qual casa apertar. **0** é a corda solta. Lê-se da esquerda para a direita, como um texto.",
          "Embaixo da tablatura da Pauta aparece o **ritmo** de cada nota. Por enquanto, a bolinha preta com haste vale 1 tempo (um clique). Nos próximos dias você vai conhecer as outras.",
          { callout: "theory", text: "A tablatura diz *onde* tocar. A partitura diz *qual nota e quanto tempo*. Na Pauta as duas andam juntas, e a partitura entra aos poucos." },
        ],
      },
      {
        title: "Sua primeira melodia",
        minutes: 12,
        body: [
          "Primeiro leia sozinho, com o metrônomo, sem ouvir. Depois toque em **Tocar** para conferir. Use o dedo 1 na casa 1 e o dedo 3 na casa 3.",
          { w: "tab", title: "Primeira melodia", bpm: 60, notes: [n(1, 0), n(1, 1), n(1, 3), n(1, 1), n(1, 0), n(2, 3), n(2, 1, 2), n(2, 1), n(2, 3), n(1, 0), n(1, 1), n(1, 0, 4)] },
          { callout: "tip", text: "Errou? Siga em frente sem parar. Tocar no tempo é mais importante que acertar todas as notas." },
        ],
      },
      {
        title: "Igual ou diferente",
        minutes: 5,
        body: ["Duas notas, uma depois da outra. Elas são iguais ou diferentes? Às vezes a diferença é de uma casa só.", { w: "ear", kind: "same-diff" }],
      },
    ],
  },

  {
    day: 4,
    month: M,
    title: "O pulso e a semínima",
    minutes: 30,
    objectives: ["Entender pulso, BPM e compasso 4/4", "Ler semínima e pausa de semínima", "Contar em voz alta enquanto toca"],
    blocks: [
      {
        minutes: 5,
        body: ["Toque a primeira melodia de ontem. Tente a 70 BPM.", { w: "tab", bpm: 70, notes: [n(1, 0), n(1, 1), n(1, 3), n(1, 1), n(1, 0), n(2, 3), n(2, 1, 2), n(2, 1), n(2, 3), n(1, 0), n(1, 1), n(1, 0, 4)] }],
      },
      {
        title: "Pulso, compasso e semínima",
        minutes: 8,
        body: [
          "O **pulso** é a batida constante da música, aquela que você marca com o pé. O metrônomo dá o pulso, e o **BPM** diz quantas batidas por minuto.",
          "As batidas se agrupam em **compassos**. No compasso **4/4** cada grupo tem 4 tempos, e você conta *1, 2, 3, 4, 1, 2, 3, 4…*. A barra vertical na tablatura separa os compassos.",
          "A **semínima** (bolinha preta com haste) dura **1 tempo**. A **pausa de semínima** (o zigue-zague) é **1 tempo de silêncio**.",
          { callout: "warning", text: "Pausa é silêncio de verdade. Encoste a mão direita nas cordas para parar o som." },
        ],
      },
      {
        title: "Cordas soltas com pausas",
        minutes: 12,
        body: [
          "Conte em voz alta. Nas pausas, fale o número mais baixo e abafe as cordas.",
          { w: "tab", title: "Semínimas e pausas", bpm: 60, notes: [n(6, 0), r(), n(6, 0), r(), n(5, 0), n(5, 0), n(5, 0), n(5, 0), n(4, 0), r(), n(4, 0), n(4, 0), n(3, 0), n(3, 0), r(), r()] },
          { callout: "selfCheck", text: "Desligue o exemplo e toque só com o metrônomo. Cada nota cai em cima do clique? Então suba para 70 BPM." },
        ],
      },
      {
        title: "Igual ou diferente",
        minutes: 5,
        body: [{ w: "ear", kind: "same-diff" }, "Depois, cante uma nota qualquer e tente achar ela na corda 1, casa por casa."],
      },
    ],
  },

  {
    day: 5,
    month: M,
    title: "Mínima e semibreve",
    minutes: 30,
    objectives: ["Ler mínima (2 tempos) e semibreve (4 tempos)", "Segurar a nota até o tempo certo", "Reconhecer a duração de ouvido"],
    blocks: [
      {
        minutes: 5,
        body: ["Revise as semínimas e pausas de ontem a 70 BPM.", { w: "tab", bpm: 70, notes: [n(6, 0), r(), n(6, 0), r(), n(5, 0), n(5, 0), n(5, 0), n(5, 0), n(4, 0), r(), n(4, 0), n(4, 0), n(3, 0), n(3, 0), r(), r()] }],
      },
      {
        title: "Notas mais longas",
        minutes: 8,
        body: [
          "A **mínima** é uma bolinha **branca com haste** e dura **2 tempos**. A **semibreve** é uma bolinha **branca sem haste** e dura **4 tempos**, um compasso inteiro.",
          { list: ["1 semibreve = 2 mínimas = 4 semínimas", "Pausa de mínima: retângulo em cima da linha (2 tempos)", "Pausa de semibreve: retângulo pendurado (4 tempos)"] },
          "Tocar uma nota longa é fácil. O difícil é **não soltar antes**. Conte todos os tempos enquanto a nota soa.",
        ],
      },
      {
        title: "Durações misturadas",
        minutes: 12,
        body: [
          { w: "tab", title: "Semibreve, mínimas e semínimas", bpm: 60, notes: [n(5, 0, 4), n(4, 0, 2), n(4, 0, 2), n(3, 0), n(3, 0), n(2, 0, 2), n(1, 0, 4)] },
          "Agora com notas presas: use os dedos 1 e 3.",
          { w: "tab", title: "Com casas", bpm: 60, notes: [n(2, 1, 2), n(2, 3, 2), n(1, 0), n(1, 1), n(1, 3, 2), n(1, 1, 2), n(1, 0, 2), n(2, 1, 4)] },
        ],
      },
      {
        title: "Quanto durou?",
        minutes: 5,
        body: ["O metrônomo conta um compasso, depois entra uma nota. Ela durou 1, 2 ou 4 tempos?", { w: "ear", kind: "duration" }],
      },
    ],
  },

  {
    day: 6,
    month: M,
    title: "Sua primeira música: Hino à Alegria",
    minutes: 35,
    objectives: ["Achar as notas C, D, E, F e G na primeira posição", "Tocar o Hino à Alegria inteiro", "Cantar antes de tocar"],
    blocks: [
      { minutes: 5, body: ["Afine e toque o exercício de durações de ontem.", { w: "tuner" }] },
      {
        title: "As notas do hino",
        minutes: 8,
        body: [
          "O Hino à Alegria (Beethoven, 1824) usa só cinco notas, todas nas cordas 1 e 2:",
          {
            w: "fretboard",
            frets: 4,
            markers: [
              { s: 2, f: 1, label: "C" },
              { s: 2, f: 3, label: "D" },
              { s: 1, f: 0, label: "E" },
              { s: 1, f: 1, label: "F" },
              { s: 1, f: 3, label: "G" },
            ],
            caption: "Dedo 1 na casa 1, dedo 3 na casa 3. Toque na ordem C, D, E, F, G e escute a escadinha subindo.",
          },
          "Antes de pegar a guitarra, **cante a melodia** com *lá-lá-lá*. Se você consegue cantar, os dedos aprendem mais rápido.",
        ],
      },
      {
        title: "Hino à Alegria",
        minutes: 15,
        body: [
          "Comece com a velocidade em 70% e suba aos poucos. Toque junto com o exemplo e depois só com o metrônomo.",
          { w: "tab", title: "Hino à Alegria", bpm: 60, notes: ODE_TO_JOY },
          { callout: "tip", text: "Nos compassos 4 e 8 o ritmo muda: a primeira nota é mais longa e a segunda mais curta. Não precisa contar ainda. Escute o exemplo e imite." },
        ],
      },
      {
        title: "Subiu ou desceu",
        minutes: 7,
        body: [{ w: "ear", kind: "highlow-close" }, "No hino, cada nota é vizinha da anterior. Toque a melodia e diga em voz alta se cada nota sobe, desce ou repete."],
      },
    ],
  },

  {
    day: 7,
    month: M,
    title: "Revisão da semana 1",
    minutes: 30,
    objectives: ["Afinar sozinho", "Tocar o Hino à Alegria sem parar", "Ler uma tablatura nova"],
    blocks: [
      { title: "Afinar e aquecer", minutes: 5, body: ["Afine as seis cordas e diga os nomes em voz alta.", { w: "tuner" }, { w: "strings" }] },
      {
        title: "O que você já sabe",
        minutes: 5,
        body: [
          {
            list: [
              "Cordas de 1 (aguda) a 6 (grave): E A D G B E, da 6 para a 1",
              "Casa é o espaço entre trastes; aperte logo atrás do traste",
              "Dedos 1 a 4, um dedo por casa",
              "Tablatura: linha de cima = corda 1, número = casa",
              "Semínima 1 tempo, mínima 2, semibreve 4",
            ],
          },
        ],
      },
      {
        title: "Mini-desafio da semana",
        minutes: 15,
        body: [
          { w: "tab", title: "1-2-3-4 a 70 BPM", bpm: 70, notes: [6, 5, 4, 3, 2, 1].flatMap((s) => [n(s, 1), n(s, 2), n(s, 3), n(s, 4)]) },
          { w: "tab", title: "Hino à Alegria a 70 BPM", bpm: 70, notes: ODE_TO_JOY },
          {
            w: "selfcheck",
            id: "semana1",
            title: "Semana 1 concluída",
            items: [
              { id: "afinar", label: "Afinei as seis cordas em menos de 3 minutos" },
              { id: "hino", label: "Toquei o hino a 60 BPM sem parar" },
              { id: "1234", label: "Fiz o 1-2-3-4 a 70 BPM sem trastejar" },
            ],
          },
        ],
      },
      { title: "Ouvido", minutes: 5, body: [{ w: "ear", kind: "duration" }] },
    ],
  },

  {
    day: 8,
    month: M,
    title: "Seu primeiro acorde: Mi menor (Em)",
    minutes: 30,
    objectives: ["Ler um diagrama de acorde", "Montar o Em com as seis cordas soando", "Fazer uma batida no pulso"],
    blocks: [
      { minutes: 5, body: ["Toque o Hino à Alegria a 70 BPM.", { w: "tab", bpm: 70, notes: ODE_TO_JOY }] },
      {
        title: "O que é um acorde",
        minutes: 8,
        body: [
          "**Acorde** é um grupo de três ou mais notas tocadas juntas. Ele é a base de quase todo acompanhamento.",
          "No **diagrama de acorde** a guitarra fica em pé, olhando para você: as linhas verticais são as cordas (a **6 à esquerda**), as horizontais são os trastes. A bolinha mostra onde apertar e o número dentro dela é o dedo. **O** em cima = corda solta. **X** = não toque essa corda.",
          { w: "chords", chords: ["Em"] },
          "O Em é o acorde mais fácil da guitarra: dedo 2 na casa 2 da corda 5 e dedo 3 na casa 2 da corda 4. As outras cordas ficam soltas.",
        ],
      },
      {
        title: "Montar e bater",
        minutes: 12,
        body: [
          "Monte o Em e toque **corda por corda**, da 6 para a 1. Todas precisam soar.",
          CLEAN_CHORD("em"),
          "Agora uma batida para baixo em cada tempo, passando pelas seis cordas.",
          { w: "strum", title: "Em no pulso", bpm: 60, measures: [{ chord: "Em", strokes: ALL_DOWN }, { chord: "Em", strokes: ALL_DOWN }, { chord: "Em", strokes: ALL_DOWN }, { chord: "Em", strokes: ALL_DOWN }] },
        ],
      },
      {
        title: "Maior ou menor",
        minutes: 5,
        body: ["O Em é um acorde **menor**. Acordes menores costumam soar mais fechados, mais tristes. Os maiores soam mais abertos. Escute e responda.", { w: "ear", kind: "major-minor" }],
      },
    ],
  },

  {
    day: 9,
    month: M,
    title: "Lá menor (Am) e a primeira troca",
    minutes: 30,
    objectives: ["Montar o Am", "Trocar entre Em e Am no pulso", "Reconhecer Em e Am de ouvido"],
    blocks: [
      { minutes: 5, body: ["Monte o Em de olhos fechados, abra e confira. Repita 5 vezes.", { w: "chords", chords: ["Em"] }] },
      {
        title: "O Am",
        minutes: 8,
        body: [
          "Repare na semelhança: os dedos 2 e 3 fazem o **mesmo desenho do Em, uma corda abaixo** (cordas 4 e 3). Depois o dedo 1 entra na casa 1 da corda 2.",
          { w: "chords", chords: ["Em", "Am"] },
          "No Am a corda 6 tem **X**: comece a batida na corda 5.",
          CLEAN_CHORD("am"),
        ],
      },
      {
        title: "Trocas Em ↔ Am",
        minutes: 12,
        body: [
          "Quatro tempos em cada acorde. No último tempo (amarelo), comece a levantar os dedos para a próxima forma.",
          { w: "changes", chords: ["Em", "Am"], beats: 4, bpm: 50 },
          { w: "minute", id: "em-am", label: "Troque entre Em e Am o máximo de vezes que conseguir em 1 minuto, sem tocar a batida. Só montar, conferir e trocar." },
        ],
      },
      { title: "Qual acorde?", minutes: 5, body: [{ w: "ear", kind: "which-chord", chords: ["Em", "Am"] }] },
    ],
  },

  {
    day: 10,
    month: M,
    title: "A mão direita: batida no pulso",
    minutes: 30,
    objectives: ["Bater com o movimento do pulso", "Acentuar o tempo 1", "Fazer pausas abafando as cordas"],
    blocks: [
      { minutes: 5, body: [{ w: "changes", chords: ["Em", "Am"], beats: 4, bpm: 55 }] },
      {
        title: "Como bater",
        minutes: 8,
        body: [
          "A batida sai do **pulso**, não do braço inteiro. Imagine que está sacudindo água da mão.",
          "A mão fica **sempre em movimento**: desce no tempo, sobe no ar entre um tempo e outro. Isso vai deixar tudo pronto para as batidas para cima no mês 2.",
          "Toque o **tempo 1 um pouco mais forte**. Esse acento ajuda você (e quem toca junto) a saber onde o compasso começa.",
          { callout: "tip", text: "Para fazer pausa com acorde, encoste a lateral da mão direita nas cordas. O som para na hora." },
        ],
      },
      {
        title: "Três levadas",
        minutes: 12,
        body: [
          { w: "strum", title: "Levada 1 · quatro para baixo", bpm: 60, measures: [{ chord: "Em", strokes: ALL_DOWN }, { chord: "Em", strokes: ALL_DOWN }, { chord: "Am", strokes: ALL_DOWN }, { chord: "Am", strokes: ALL_DOWN }] },
          { w: "strum", title: "Levada 2 · mínimas (deixe soar)", bpm: 60, measures: [{ chord: "Em", strokes: HALVES }, { chord: "Em", strokes: HALVES }, { chord: "Am", strokes: HALVES }, { chord: "Am", strokes: HALVES }] },
          { w: "strum", title: "Levada 3 · três e pausa", bpm: 60, measures: [{ chord: "Em", strokes: THREE_REST }, { chord: "Em", strokes: THREE_REST }, { chord: "Am", strokes: THREE_REST }, { chord: "Am", strokes: THREE_REST }] },
        ],
      },
      { title: "Quanto durou?", minutes: 5, body: [{ w: "ear", kind: "duration" }] },
    ],
  },

  {
    day: 11,
    month: M,
    title: "Ré maior (D)",
    minutes: 30,
    objectives: ["Montar o D tocando só 4 cordas", "Trocar entre Am e D", "Ouvir a diferença entre maior e menor"],
    blocks: [
      { minutes: 5, body: [{ w: "strum", bpm: 60, measures: [{ chord: "Em", strokes: THREE_REST }, { chord: "Am", strokes: THREE_REST }, { chord: "Em", strokes: THREE_REST }, { chord: "Am", strokes: THREE_REST }] }] },
      {
        title: "O D",
        minutes: 8,
        body: [
          "O D forma um **triângulo** com os dedos 1, 2 e 3 nas cordas 3, 2 e 1. As cordas 6 e 5 têm X: a batida começa na **corda 4** (Ré solta).",
          { w: "chords", chords: ["D"] },
          CLEAN_CHORD("d"),
          { callout: "warning", text: "Se a corda 1 não soa, o dedo 3 deve estar deitado em cima dela. Arqueie mais o dedo." },
        ],
      },
      {
        title: "Trocas Am ↔ D",
        minutes: 12,
        body: [{ w: "changes", chords: ["Am", "D"], beats: 4, bpm: 50 }, { w: "minute", id: "am-d", label: "Am para D e de volta, o máximo de vezes em 1 minuto." }],
      },
      { title: "Maior ou menor", minutes: 5, body: ["O D é **maior**. Compare com o Am e o Em, que são menores.", { w: "ear", kind: "major-minor" }] },
    ],
  },

  {
    day: 12,
    month: M,
    title: "Técnica de troca: forma no ar e último tempo",
    minutes: 30,
    objectives: ["Montar o acorde inteiro de uma vez", "Começar a troca no último tempo", "Encadear Em, Am e D"],
    blocks: [
      { minutes: 5, body: ["Monte cada acorde 5 vezes: Em, Am, D.", { w: "chords", chords: ["Em", "Am", "D"] }] },
      {
        title: "Três segredos da troca",
        minutes: 8,
        body: [
          {
            list: [
              "**Forma no ar:** levante os dedos juntos e pouse todos ao mesmo tempo, como um carimbo. Treine a forma 10 vezes sem tocar.",
              "**Olhe para frente:** enquanto toca um acorde, pense no próximo.",
              "**Último tempo:** a troca começa no tempo 4. Tudo bem se o tempo 4 sair com cordas soltas; o tempo 1 do próximo acorde tem que sair certo.",
            ],
            ordered: true,
          },
          { callout: "tip", text: "Em → Am: os dedos 2 e 3 só descem uma corda juntos. Sinta esse movimento como um bloco." },
        ],
      },
      {
        title: "Em → Am → D",
        minutes: 12,
        body: [{ w: "changes", chords: ["Em", "Am", "D"], beats: 4, bpm: 50 }, { w: "minute", id: "em-am-d", label: "Faça a volta Em → Am → D → Em. Conte quantas voltas completas você faz em 1 minuto." }],
      },
      { title: "Qual acorde?", minutes: 5, body: [{ w: "ear", kind: "which-chord", chords: ["Em", "Am", "D"] }] },
    ],
  },

  {
    day: 13,
    month: M,
    title: "Melodia nas cordas graves: Brilha, Brilha, Estrelinha",
    minutes: 30,
    objectives: ["Achar C, D, E, F, G e A nas cordas graves", "Tocar Brilha, Brilha, Estrelinha", "Usar um dedo por casa"],
    blocks: [
      { minutes: 5, body: [{ w: "changes", chords: ["Em", "Am", "D"], beats: 4, bpm: 55 }] },
      {
        title: "As notas graves",
        minutes: 8,
        body: [
          "Até agora as melodias ficaram nas cordas agudas. Agora vamos para as cordas 5, 4 e 3:",
          {
            w: "fretboard",
            frets: 4,
            markers: [
              { s: 5, f: 3, label: "C" },
              { s: 4, f: 0, label: "D" },
              { s: 4, f: 2, label: "E" },
              { s: 4, f: 3, label: "F" },
              { s: 3, f: 0, label: "G" },
              { s: 3, f: 2, label: "A" },
            ],
            caption: "Casa 2 = dedo 2, casa 3 = dedo 3. Toque de C até A, subindo.",
          },
          "São as mesmas letras do hino, só que mais graves.",
        ],
      },
      { title: "Brilha, Brilha, Estrelinha", minutes: 12, body: [{ w: "tab", title: "Brilha, Brilha, Estrelinha (tradicional)", bpm: 70, notes: TWINKLE }, { callout: "tip", text: "Cante a letra enquanto toca. Se o canto e a guitarra não batem, a nota está errada." }] },
      { title: "Igual ou diferente", minutes: 5, body: [{ w: "ear", kind: "same-diff" }] },
    ],
  },

  {
    day: 14,
    month: M,
    title: "Revisão da semana 2",
    minutes: 30,
    objectives: ["Em, Am e D limpos", "Trocar os três a 60 BPM", "Reconhecer os três de ouvido"],
    blocks: [
      { title: "Melodias", minutes: 6, body: [{ w: "tab", title: "Hino à Alegria", bpm: 70, notes: ODE_TO_JOY }] },
      {
        title: "O que você já sabe",
        minutes: 4,
        body: [{ list: ["Diagrama: cordas na vertical, a 6 à esquerda", "Em, Am e D", "Batida com o pulso, acento no 1", "Troca: forma no ar e último tempo"] }],
      },
      {
        title: "Mini-desafio da semana",
        minutes: 15,
        body: [
          { w: "changes", title: "Meta: 60 BPM", chords: ["Em", "Am", "D", "Am"], beats: 4, bpm: 60 },
          { w: "minute", id: "em-am-d", label: "Voltas completas Em → Am → D em 1 minuto. Tente bater o seu recorde." },
          {
            w: "selfcheck",
            id: "semana2",
            title: "Semana 2 concluída",
            items: [
              { id: "limpos", label: "Em, Am e D soam limpos, corda por corda" },
              { id: "60", label: "Troquei os três a 60 BPM sem parar a batida" },
              { id: "brilha", label: "Toquei Brilha, Brilha a 70 BPM" },
            ],
          },
        ],
      },
      { title: "Qual acorde?", minutes: 5, body: [{ w: "ear", kind: "which-chord", chords: ["Em", "Am", "D"] }] },
    ],
  },

  {
    day: 15,
    month: M,
    title: "Lá maior (A)",
    minutes: 30,
    objectives: ["Montar o A com três dedos na mesma casa", "Ouvir a diferença entre A e Am", "Trocar A e D"],
    blocks: [
      { minutes: 5, body: [{ w: "tab", bpm: 70, notes: TWINKLE }] },
      {
        title: "O A, e o que muda do Am",
        minutes: 8,
        body: [
          "No A, os dedos 1, 2 e 3 ficam todos na **casa 2**, nas cordas 4, 3 e 2. Fica apertado: incline um pouco os dedos para caberem.",
          { w: "chords", chords: ["A", "Am"] },
          "Compare com o Am: **só a corda 2 muda**. No Am ela está na casa 1, no A está na casa 2. Uma casa de diferença (meio tom) muda o acorde de triste para alegre.",
          CLEAN_CHORD("a"),
        ],
      },
      {
        title: "Trocas",
        minutes: 12,
        body: [
          "Primeiro A e Am, para ouvir a mudança. Depois A e D.",
          { w: "strum", title: "A e Am", bpm: 60, measures: [{ chord: "A", strokes: ALL_DOWN }, { chord: "Am", strokes: ALL_DOWN }, { chord: "A", strokes: ALL_DOWN }, { chord: "Am", strokes: ALL_DOWN }] },
          { w: "changes", chords: ["A", "D"], beats: 4, bpm: 50 },
        ],
      },
      { title: "Maior ou menor", minutes: 5, body: [{ w: "ear", kind: "major-minor" }] },
    ],
  },
];

