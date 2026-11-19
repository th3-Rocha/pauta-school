// Mês 2 · dias 31 a 60 · Pentatônica e primeiro improviso
import type { Lesson } from "../types";
import { POSTURE } from "./m01/shared";
import { B, bars, box, changes, check, checks, chords, ear, jam, lesson, list, m, metro, minute, n, ol, r, rec, run, seq, STR, strum, t, tab, theory, tip, tuner, warn, whichChord, bpmlog } from "./lib";

const A = 9;
const E = 4;
const C = 0;
const G = 7;

/** Aranha: 1-2-3-4 em cada corda, da 6 à 1, na casa 1. */
const SPIDER = [6, 5, 4, 3, 2, 1].flatMap((s) => seq(0.5, [s, 1], [s, 2], [s, 3], [s, 4]));
/** Cromática na corda 6, da solta à casa 12. */
const CHROMATIC_6 = Array.from({ length: 13 }, (_, f) => n(6, f, f === 12 ? 4 : 1)).slice(0, 13);
/** Escala de Dó maior, uma oitava a partir da casa 3 da corda 5. */
const C_MAJOR_5 = [...seq(1, [5, 3], [5, 5], [4, 2], [4, 3], [4, 5], [3, 2], [3, 4], [3, 5]), n(3, 5, 4)];
/** Escala de Sol maior, da corda 6 casa 3. */
const G_MAJOR = [...seq(0.5, [6, 3], [5, 0], [5, 2], [5, 3], [4, 0], [4, 2], [4, 4], [4, 5]), ...seq(0.5, [4, 4], [4, 2], [4, 0], [5, 3], [5, 2], [5, 0]), n(6, 3, 1)];

/** Riff original em power chords com palm mute (Pauta, CC BY-SA). */
const RIFF_E = [
  ...Array.from({ length: 6 }, () => m([[6, 0], [5, 2]], 0.5, "pm")),
  m([[6, 3], [5, 5]], 0.5),
  m([[6, 5], [5, 7]], 0.5),
  ...Array.from({ length: 6 }, () => m([[6, 0], [5, 2]], 0.5, "pm")),
  m([[6, 5], [5, 7]], 0.5),
  m([[6, 3], [5, 5]], 0.5),
];
const RIFF_G = [
  m([[6, 3], [5, 5]], 1.5),
  m([[6, 3], [5, 5]], 0.5, "pm"),
  m([[6, 5], [5, 7]], 1),
  m([[6, 0], [5, 2]], 1),
  m([[5, 3], [4, 5]], 1.5),
  m([[5, 3], [4, 5]], 0.5, "pm"),
  m([[5, 5], [4, 7]], 2),
];

/** Pentatônica de Lá menor, forma 1 (casas 5 a 8). */
const PENTA_AM = run(A, "pentaMinor", 5, 8, 0.5);
/** Pentatônica de Mi menor na primeira posição. */
const PENTA_EM = run(E, "pentaMinor", 0, 3, 0.5);

/** Frases originais em Lá menor (pergunta e resposta). */
const PHRASE_Q = [n(3, 5, 0.5), n(3, 7, 0.5), n(2, 5, 1), n(2, 8, 0.5), n(2, 5, 0.5), n(3, 7, 1), r(4)];
const PHRASE_A = [n(2, 5, 0.5), n(3, 7, 0.5), n(3, 5, 1), n(4, 7, 0.5), n(4, 5, 0.5), n(4, 7, 2), r(3)];
const LEGATO = [t(3, 5, "h", 0.5), t(3, 7, "h", 0.5), t(3, 7, "p", 0.5), n(3, 5, 0.5), t(4, 5, "h", 0.5), t(4, 7, "h", 0.5), t(4, 7, "p", 0.5), n(4, 5, 0.5)];
const LEGATO_REAL = [n(3, 5, 0.5), t(3, 7, "h", 0.5), n(2, 5, 0.5), t(2, 8, "h", 0.5), n(2, 8, 0.5), t(2, 5, "p", 0.5), n(3, 7, 1)];
const SLIDES = [n(4, 5, 0.5), t(4, 7, "/", 0.5), n(3, 5, 0.5), t(3, 7, "/", 0.5), n(3, 7, 0.5), t(3, 9, "/", 0.5), n(2, 8, 1), n(3, 9, 0.5), t(3, 7, "\\", 0.5), n(3, 5, 1), r(2)];

/** Melodia original com ligaduras e colcheias, em Dó (Pauta). */
const TIES = [n(2, 1, 1.5), n(2, 3, 0.5), n(1, 0, 1), n(1, 1, 1), n(1, 0, 3), r(1), n(2, 3, 0.5), n(2, 1, 0.5), n(3, 2, 1), n(2, 0, 1.5), n(2, 1, 0.5), n(2, 1, 4)];
/** Estudo do mês 2, parte A (melodia, 8 compassos). */
const ESTUDO_A = [
  n(4, 7, 1), n(3, 5, 0.5), n(3, 7, 0.5), n(2, 5, 1), n(3, 7, 1),
  n(3, 5, 1.5), n(4, 7, 0.5), n(3, 5, 2),
  n(2, 5, 1), n(2, 8, 0.5), n(2, 5, 0.5), n(3, 7, 1), n(3, 5, 1),
  n(4, 7, 3), r(1),
  n(3, 5, 0.5), n(3, 7, 0.5), n(2, 5, 0.5), n(2, 8, 0.5), n(1, 5, 1), n(1, 8, 1),
  n(1, 5, 1.5), n(2, 8, 0.5), n(2, 5, 2),
  n(3, 7, 1), n(3, 5, 1), n(4, 7, 1), n(4, 5, 1),
  n(4, 7, 4),
];

const M2_PROG = ["Am", "F", "C", "G"];

export const MONTH_2: Lesson[] = [
  lesson(31, "As 12 notas: a escala cromática", ["Entender que a música ocidental usa 12 notas", "Tocar a escala cromática na corda 6", "Conhecer sustenido e bemol"], [
    B(undefined, 5, "Bem-vindo ao mês 2. Comece pelas trocas do desafio do mês 1, sem pressa.", changes(["G", "C", "D", "Em"], 65)),
    B("Entre as notas naturais", 10,
      "No mês 1 você usou as 7 notas naturais: **C D E F G A B**. Mas no braço existem notas **entre** elas. Cada casa é **meio tom** (um semitom). Contando todas, são **12 notas** antes de repetir.",
      list("**Sustenido (#)** sobe meio tom: C# é a casa logo depois do C.", "**Bemol (b)** desce meio tom: Db é a casa logo antes do D.", "C# e Db são **a mesma casa**. Chamamos isso de **enarmonia**: dois nomes, um som."),
      box(E, "chromatic", 0, 12, "Corda 6, da solta à casa 12: as 12 notas e a oitava. Toque cada uma e veja o nome.", { label: "note", highlight: "root" }),
      theory("Entre **E e F** e entre **B e C** não existe nota no meio. Por isso não há E# nem B# na prática do dia a dia: E# soa igual a F."),
    ),
    B("Subindo de casa em casa", 10, tab("Cromática na corda 6", 70, CHROMATIC_6), "Fale o nome de cada nota em voz alta: *Mi, Fá, Fá sustenido, Sol…*", tip("Use um dedo por casa: casas 1 a 4 com os dedos 1 a 4, depois deslize a mão.")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(32, "Tom e semitom no braço", ["Medir distâncias em casas", "Reconhecer tom e semitom", "Achar a mesma nota em duas cordas"], [
    B(undefined, 5, tab("Cromática na corda 6", 80, CHROMATIC_6)),
    B("A régua do braço", 10,
      list("**Semitom (meio tom)** = 1 casa.", "**Tom** = 2 casas.", "**Oitava** = 12 casas: a mesma nota, mais aguda."),
      "Por isso a **casa 12** tem o mesmo nome da corda solta. As marcações duplas no braço avisam isso.",
      "Agora uma ideia que vai te acompanhar o ano todo: a **casa 5** de uma corda tem a mesma nota da corda vizinha mais aguda, solta. A exceção é a corda 3: a nota da corda 2 solta (B) fica na **casa 4** da corda 3.",
      {
        w: "fretboard",
        frets: 5,
        markers: [
          { s: 6, f: 5, label: "A" }, { s: 5, f: 0, label: "A" },
          { s: 5, f: 5, label: "D" }, { s: 4, f: 0, label: "D" },
          { s: 4, f: 5, label: "G" }, { s: 3, f: 0, label: "G" },
          { s: 3, f: 4, label: "B", kind: "root" }, { s: 2, f: 0, label: "B", kind: "root" },
          { s: 2, f: 5, label: "E" }, { s: 1, f: 0, label: "E" },
        ],
        caption: "Pares de notas iguais. O par destacado (corda 3, casa 4) é a exceção.",
      },
    ),
    B("Afinação relativa", 10, "Use esse truque para conferir a afinação sem afinador: toque a casa 5 da corda 6 e a corda 5 solta. Devem soar iguais. Repita para cada par.", tuner, ol("Casa 5 da corda 6 = corda 5 solta", "Casa 5 da corda 5 = corda 4 solta", "Casa 5 da corda 4 = corda 3 solta", "**Casa 4** da corda 3 = corda 2 solta", "Casa 5 da corda 2 = corda 1 solta")),
    B("Subiu ou desceu?", 5, ear("highlow-close")),
  ]),

  lesson(33, "Colcheias e palhetada alternada", ["Contar colcheias: 1 e 2 e", "Palhetar para baixo no tempo e para cima no contratempo", "Manter o pulso com o metrônomo"], [
    B(undefined, 5, tuner),
    B("Dividindo o tempo em dois", 8,
      "A **colcheia** dura **meio tempo**. Em cada clique cabem duas: conte *1 e 2 e 3 e 4 e*.",
      { w: "staff", notes: [{ midi: 64, d: 1 }, { midi: 64, d: 1 }, { midi: 64, d: 0.5 }, { midi: 64, d: 0.5 }, { midi: 64, d: 0.5 }, { midi: 64, d: 0.5 }], caption: "Duas semínimas e quatro colcheias. As colcheias vêm unidas por uma barra." },
      "**Palhetada alternada:** no número (tempo) a palheta desce ↓; no *e* (contratempo) ela sobe ↑. A mão se move como um pêndulo, sem parar, mesmo quando não toca.",
      warn("Não palhete tudo para baixo nas colcheias. Funciona devagar, mas trava acima de 90 BPM."),
    ),
    B("Pêndulo", 12,
      tab("Corda 1 solta em colcheias", 60, seq(0.5, ...Array.from({ length: 16 }, (): [number, number] => [1, 0]))),
      tab("Trocando de corda", 60, [...seq(0.5, [1, 0], [1, 0], [2, 0], [2, 0], [3, 0], [3, 0], [2, 0], [2, 0]), ...seq(0.5, [1, 0], [1, 0], [2, 0], [2, 0], [3, 0], [3, 0], [2, 0], [2, 0])]),
      metro(60),
      tip("Conte em voz alta. Se perder a conta, pare, respire e recomece no 1."),
    ),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(34, "A aranha: um dedo por casa", ["Independência dos 4 dedos", "Palhetada alternada trocando de corda", "Aquecimento que você vai usar o ano todo"], [
    B(undefined, 5, tab("Pêndulo na corda 1", 70, seq(0.5, ...Array.from({ length: 8 }, (): [number, number] => [1, 0])))),
    B("O exercício", 6,
      "Coloque o dedo 1 na casa 1, o 2 na casa 2, o 3 na 3 e o 4 na 4. Toque **1-2-3-4** em cada corda, da 6 até a 1, com palhetada alternada.",
      list("Deixe os dedos perto das cordas mesmo quando não estão tocando.", "O polegar fica atrás do braço, não por cima.", "Comece devagar. Limpo vale mais que rápido."),
      POSTURE,
    ),
    B("Aranha no metrônomo", 14, tab("Aranha", 60, SPIDER), minute("aranha", "Aranha de ida e volta. Quantas voltas completas em 1 minuto sem errar?"), tip("Quando ficar fácil, faça a aranha começando na casa 5, onde as casas são menores.")),
    B("Subiu ou desceu?", 5, ear("highlow-close")),
  ]),

  lesson(35, "Power chords: E5 e A5", ["Montar um power chord de duas notas", "Abafar as cordas que não tocam", "Tocar o primeiro riff com palm mute"], [
    B(undefined, 5, tab("Aranha", 70, SPIDER.slice(0, 16))),
    B("Dois dedos, som de rock", 10,
      "Um **power chord** tem só a **tônica** e a **quinta** (escrito com 5: **E5**, **A5**). Não é maior nem menor: é neutro, e por isso soa bem com distorção.",
      chords("E5", "A5"),
      "**Palm mute (PM):** apoie a lateral da mão direita nas cordas, bem em cima da ponte. O som fica curto e pesado. Se apoiar longe da ponte, o som some; perto demais, não abafa.",
    ),
    B("Riff em Mi", 10, tab("Riff em E5 (original da Pauta)", 70, RIFF_E), check("Grave um trecho. As notas abafadas soam como *tchug*, e as abertas soam cheias?")),
    B("Maior ou menor?", 5, ear("major-minor")),
  ]),

  lesson(36, "Power chord móvel na corda 6", ["Mover o mesmo desenho pelo braço", "Achar G5, A5 e F5", "Tocar um riff trocando de casa"], [
    B(undefined, 5, tab("Riff em E5", 80, RIFF_E)),
    B("Um desenho, todos os acordes", 10,
      "O power chord com tônica na corda 6 é um desenho **móvel**: dedo 1 na tônica, dedo 3 (ou 4) duas casas acima na corda 5. Onde o dedo 1 cai, esse é o nome do acorde.",
      chords("F5", "G5", "A5@5"),
      box(E, [0, 1, 3, 5, 7, 8, 10], 0, 8, "Notas naturais da corda 6: F na 1, G na 3, A na 5, B na 7. Decore estas quatro.", { label: "note", highlight: "none", strings: [6] }),
    ),
    B("Riff em Sol", 10, tab("Riff em Sol (original da Pauta)", 70, RIFF_G), changes(["G5", "A5@5", "F5", "G5"], 70)),
    B("Qual acorde?", 5, whichChord("E5", "G5", "A5@5")),
  ]),

  lesson(37, "Revisão da semana 5", ["12 notas e enarmonia", "Palhetada alternada a 70 BPM", "Power chords móveis"], [
    B("Aquecimento", 6, tab("Aranha", 70, SPIDER)),
    B("O que você já sabe", 4, list("Semitom = 1 casa, tom = 2 casas", "C# = Db (enarmonia)", "Colcheia = meio tempo, alternada ↓↑", "Power chord = tônica + quinta, desenho móvel")),
    B("Mini-desafio", 15, tab("Riff em Sol a 80 BPM", 80, RIFF_G), checks("sem5", "Semana 5 concluída", "Aranha a 70 BPM sem parar", "Riff em E5 com palm mute limpo", "Sei achar F5, G5 e A5 na corda 6 sem olhar")),
    B("Qual acorde?", 5, whichChord("E5", "G5", "A5@5", "F5")),
  ]),

  lesson(38, "A escala maior: tom, tom, semitom", ["Entender a fórmula da escala maior", "Tocar Dó maior numa posição só", "Ouvir por que os semitons importam"], [
    B(undefined, 5, tab("Cromática na corda 6", 90, CHROMATIC_6)),
    B("A receita", 10,
      "Toda escala maior segue a mesma receita de distâncias: **T T S T T T S** (tom, tom, semitom, tom, tom, tom, semitom).",
      "Em Dó: C →(T) D →(T) E →(S) F →(T) G →(T) A →(T) B →(S) C. É por isso que Dó maior não tem sustenido: os semitons caem exatamente em E–F e B–C.",
      box(C, "major", 2, 5, "Dó maior na posição da casa 2: dedo 1 na casa 2, dedo 4 na casa 5.", { label: "degree" }),
    ),
    B("Dó maior, uma oitava", 10, tab("Escala de Dó maior (casa 3 da corda 5)", 60, C_MAJOR_5), "Agora cante junto: *dó ré mi fá sol lá si dó*. Cantar liga o ouvido à mão."),
    B("Subiu ou desceu?", 5, ear("highlow-close")),
  ]),

  lesson(39, "Sol maior e o primeiro sustenido", ["Aplicar a receita a partir de Sol", "Descobrir por que Sol maior tem F#", "Tocar Sol maior em colcheias"], [
    B(undefined, 5, tab("Dó maior", 70, C_MAJOR_5)),
    B("Mesma receita, outro ponto de partida", 10,
      "Comece em **G** e aplique T T S T T T S: G, A, B, C, D, E, **F#**, G.",
      "O sétimo grau precisa estar a **um semitom** da tônica. De F para G seria um tom, então o F sobe para **F#**. Dizemos que **Sol maior tem um sustenido**.",
      box(G, "major", 2, 5, "Sol maior na segunda posição. O F# é a casa 4 da corda 4 e a casa 2 da corda 1.", { label: "degree" }),
    ),
    B("Sol maior em colcheias", 10, tab("Sol maior, ida e volta", 60, G_MAJOR), tip("Palhetada alternada estrita: ↓↑↓↑ mesmo ao trocar de corda.")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(40, "Ligadura e ponto: notas que atravessam o tempo", ["Ler a ligadura de duração", "Ler semínima pontuada", "Tocar uma melodia com síncope leve"], [
    B(undefined, 5, tab("Sol maior", 70, G_MAJOR)),
    B("Somando durações", 10,
      list("**Ligadura:** um arco liga duas notas iguais. Toca a primeira e **segura** pela duração das duas.", "**Ponto:** aumenta a nota pela metade. Semínima pontuada = 1 + ½ = **1 tempo e meio**."),
      { w: "staff", notes: [{ midi: 72, d: 1.5 }, { midi: 74, d: 0.5 }, { midi: 76, d: 1 }, { midi: 77, d: 1 }], caption: "Semínima pontuada + colcheia: *1 – e 2 e*. A colcheia cai no *e* do 2." },
      "Conte sempre as colcheias por dentro: *1 e 2 e 3 e 4 e*. A nota pontuada começa no 1 e só termina no *e* do 2.",
    ),
    B("Melodia com pontos", 10, tab("Melodia com pontos (original da Pauta)", 60, TIES), metro(60)),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(41, "Power chords na corda 5", ["Usar o mesmo desenho a partir da corda 5", "Achar C5, D5 e B5", "Riff que passa pelas duas cordas"], [
    B(undefined, 5, tab("Riff em Sol", 80, RIFF_G)),
    B("Tônica na corda 5", 8,
      "O desenho é o mesmo, só que uma corda abaixo: dedo 1 na corda 5, dedo 3 na corda 4.",
      chords("B5", "C5", "D5"),
      box(A, [0, 2, 3, 5, 7, 8, 10], 0, 7, "Notas naturais da corda 5: B na 2, C na 3, D na 5, E na 7.", { label: "note", highlight: "none", strings: [5] }),
    ),
    B("Trocas sem pular", 12, changes(["G5", "C5", "D5", "G5"], 70), changes(["A5@5", "D5", "E5@7", "D5"], 70), tip("Se a tônica do próximo acorde está na outra corda, procure a casa mais perto em vez de pular pelo braço.")),
    B("Qual acorde?", 5, whichChord("G5", "C5", "D5")),
  ]),

  lesson(42, "Preparando a pestana", ["Entender como a pestana funciona", "Montar o F pequeno", "Fortalecer o dedo 1 sem machucar"], [
    B(undefined, 5, tab("Aranha", 70, SPIDER)),
    B("Um dedo, várias cordas", 10,
      "Na **pestana**, o dedo 1 deita sobre várias cordas na mesma casa, como um capotraste. É o passo que separa quem tem 6 acordes de quem tem todos.",
      list("Use a **lateral** do dedo (o lado do polegar), não a polpa.", "Coloque o dedo **colado no traste**.", "A força vem do **braço puxando para trás**, não do polegar apertando."),
      "Comece pelo **F pequeno**: só as 4 cordas agudas, com o dedo 1 pressionando as cordas 1 e 2 na casa 1.",
      chords("Fmaj7", "Dm"),
    ),
    B("Mini pestana", 10, "Fmaj7 é o F pequeno sem a pestana. Monte o Fmaj7, depois deite o dedo 1 também sobre a corda 1: virou F (só 4 cordas).", changes(["C", "Fmaj7"], 60), warn("Dor no músculo é normal; dor aguda ou formigamento não. Pare, solte a mão e continue amanhã.")),
    B("Qual acorde?", 5, whichChord("C", "Fmaj7", "Am")),
  ]),

  lesson(43, "F com pestana inteira", ["Montar F com seis cordas", "Achar a corda que não soa", "Trocar C → F"], [
    B(undefined, 5, changes(["C", "Fmaj7"], 65)),
    B("O F", 10,
      "O F com pestana é o **E maior** com o dedo 1 fazendo de capotraste na casa 1. Os dedos 2, 3 e 4 fazem o desenho do E.",
      chords("E", "F"),
      { w: "selfcheck", id: "pestana-f", title: "A pestana está limpa?", items: [
        { id: "lado", label: "Uso a lateral do dedo 1", hint: "Gire o dedo levemente para fora." },
        { id: "traste", label: "O dedo 1 está colado no traste", hint: "Longe do traste precisa de muito mais força." },
        { id: "cordas", label: "Toquei corda por corda e as 6 soaram", hint: "As cordas 2 e 3 costumam falhar: elas caem na dobra do dedo. Ajuste um pouco para cima ou para baixo." },
        { id: "polegar", label: "O polegar está relaxado atrás do braço", hint: "Puxe com o braço, não esmague com o polegar." },
      ] },
    ),
    B("C ↔ F", 10, changes(["C", "F"], 50), minute("c-f", "C ↔ F com pestana. Quantas em 1 minuto?")),
    B("Qual acorde?", 5, whichChord("C", "F", "G")),
  ]),

  lesson(44, "Revisão da semana 6", ["Escala maior em C e G", "Ligaduras e pontos", "Pestana do F"], [
    B("Aquecimento", 6, tab("Dó maior", 70, C_MAJOR_5), tab("Sol maior", 70, G_MAJOR)),
    B("O que você já sabe", 4, list("T T S T T T S: a receita da escala maior", "Sol maior tem F#", "Ponto = metade a mais; ligadura = soma", "Power chords nas cordas 6 e 5", "Pestana: lateral do dedo, colado no traste")),
    B("Mini-desafio", 15, changes(["C", "F", "G", "C"], 60), tab("Melodia com pontos", 70, TIES), checks("sem6", "Semana 6 concluída", "F soa com pelo menos 5 cordas", "C → F → G sem parar a 60 BPM", "Melodia com pontos sem perder a contagem")),
    B("Qual acorde?", 5, whichChord("C", "F", "G", "Am")),
  ]),

  lesson(45, "A pestana móvel: forma de E", ["Mover o F pelo braço", "Achar G, A e as menores", "Saber o nome pela casa da corda 6"], [
    B(undefined, 5, changes(["C", "F"], 60)),
    B("Um desenho, doze acordes", 10,
      "O F é móvel: arraste a mão inteira e o acorde muda. A tônica está **na corda 6**, embaixo do dedo 1.",
      chords("F", "G@3", "A@5"),
      "Para a versão **menor**, tire o dedo 2 (que fazia a 3ª maior). Fica o desenho do Em com pestana.",
      chords("Fm", "Gm", "Am@5"),
    ),
    B("Subindo pelo braço", 10, changes(["F", "G@3", "A@5", "G@3"], 60), changes(["Am@5", "Gm", "F", "Gm"], 60)),
    B("Maior ou menor?", 5, ear("major-minor")),
  ]),

  lesson(46, "A pestana móvel: forma de A", ["Montar Bm e B", "Achar a tônica na corda 5", "Trocar entre as duas formas"], [
    B(undefined, 5, changes(["F", "G@3", "A@5"], 65)),
    B("Tônica na corda 5", 10,
      "A segunda forma vem do **A** e do **Am**: pestana na casa da tônica (corda 5), cordas 4, 3 e 2 duas casas acima.",
      chords("Bm", "B", "C@3"),
      tip("No B maior, muita gente faz as cordas 4, 3 e 2 com uma **segunda pestana do dedo 3**, deixando a corda 1 abafada. Vale também."),
    ),
    B("Duas formas juntas", 10, changes(["G@3", "C@3", "D@5", "G@3"], 60), changes(["Em", "Bm", "C", "D"], 60), tip("Escolha a forma que deixa a mão perto. G (casa 3, corda 6) → C (casa 3, corda 5) quase não mexe a mão.")),
    B("Qual acorde?", 5, whichChord("Em", "Bm", "G", "D")),
  ]),

  lesson(47, "Progressão com pestana e levada folk", ["Tocar Am, F, C e G", "Levada de colcheias ↓ ↓↑ ↑↓↑", "Manter a mão direita em pêndulo"], [
    B(undefined, 5, changes(["Am", "F", "C", "G"], 60)),
    B("A levada folk", 8,
      "A mão direita não para: desce no tempo, sobe no contratempo. Algumas vezes ela passa **sem tocar**. É assim que nascem as levadas.",
      strum("Levada folk (sem acorde, só ritmo)", 70, bars(["Am", "Am"], STR.folk)),
      "Conte: **1**, **2** e, (3) **e**, **4** e. As setas dizem quando a palheta encosta.",
    ),
    B("Com a progressão", 12, strum("Am – F – C – G, levada folk", 70, bars(M2_PROG, STR.folk)), check("A troca de acorde acontece no último *e* do compasso. Tudo bem soltar o acorde um pouco antes: ninguém percebe, e o ritmo não para.")),
    B("Qual acorde?", 5, whichChord("Am", "F", "C", "G")),
  ]),

  lesson(48, "A pentatônica menor de Lá", ["Tocar a forma 1 da pentatônica", "Saber onde está a tônica", "Entender por que ela é a escala dos solos"], [
    B(undefined, 5, strum(undefined, 70, bars(M2_PROG, STR.folk))),
    B("Cinco notas, nenhuma errada", 10,
      "**Penta** = cinco. A **pentatônica menor** tem só 5 notas: **1, b3, 4, 5, b7**. Em Lá: **A C D E G**.",
      "Ela tira da escala menor as duas notas que mais criam choque. Por isso é a escala do rock, do blues e de boa parte dos solos: é muito difícil soar mal com ela.",
      box(A, "pentaMinor", 5, 8, "Forma 1, casa 5. As bolinhas vermelhas são o Lá (tônica). Duas notas por corda.", { label: "degree" }),
      tip("Dedo 1 na casa 5, dedo 4 (ou 3) na casa 8. A forma é quase um retângulo: só a corda 2 e a 3 mudam o dedo."),
    ),
    B("A forma em colcheias", 10, tab("Pentatônica de Lá menor, forma 1", 60, PENTA_AM), "Fale o grau de cada nota: *1, b3, 4, 5, b7…*"),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(49, "Pentatônica no tempo", ["Tocar a forma 1 a 70 BPM", "Começar e terminar na tônica", "Sequência de 3 notas"], [
    B(undefined, 5, tab("Pentatônica de Lá menor", 60, PENTA_AM)),
    B("Tônica como casa", 8,
      "Na forma 1 há **três Lás**: corda 6 casa 5, corda 4 casa 7 e corda 1 casa 5. Comece e termine as frases neles e o ouvido sente que *chegou em casa*.",
      "Um exercício clássico: subir em grupos de 3 notas (1-2-3, 2-3-4, 3-4-5…). Treina a mão e tira você do *sobe e desce*.",
    ),
    B("Grupos de 3", 12, tab("Penta em grupos de 3", 60, [...seq(0.5, [6, 5], [6, 8], [5, 5], [6, 8], [5, 5], [5, 7], [5, 5], [5, 7], [4, 5], [5, 7], [4, 5], [4, 7]), ...seq(0.5, [4, 5], [4, 7], [3, 5], [4, 7], [3, 5], [3, 7], [3, 5], [3, 7], [2, 5], [3, 7], [2, 5], [2, 8]), n(1, 5, 2), r(2)]), tab("Forma 1 a 70 BPM", 70, PENTA_AM)),
    B("Subiu ou desceu?", 5, ear("highlow-close")),
  ]),

  lesson(50, "Ligados e slides", ["Fazer hammer-on e pull-off", "Fazer slide de uma casa para outra", "Usar os três na pentatônica"], [
    B(undefined, 5, tab("Pentatônica de Lá menor", 70, PENTA_AM)),
    B("Tocar sem palhetar", 10,
      list("**Hammer-on (H):** palhete a nota de baixo e **martele** o outro dedo na casa de cima. A segunda nota soa sem palheta.", "**Pull-off (P):** com os dois dedos apoiados, palhete a nota de cima e **puxe** o dedo de cima um pouco para baixo, como se beliscasse a corda.", "**Slide (/ ou \\):** palhete e **deslize** o dedo até a outra casa sem tirar a pressão."),
      tab("Hammer e pull nas cordas 3 e 4", 60, LEGATO),
      warn("O hammer tem que ser rápido e na ponta do dedo. Se a nota sair fraca, martele mais perto do traste."),
    ),
    B("Ligados na escala", 10, tab("Ligados em Lá menor", 60, LEGATO_REAL), tab("Slides entre posições", 60, SLIDES)),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(51, "Revisão da semana 7", ["Pestanas móveis nas duas formas", "Levada folk", "Pentatônica com ligados"], [
    B("Aquecimento", 6, tab("Aranha", 80, SPIDER)),
    B("O que você já sabe", 4, list("Forma de E: tônica na corda 6", "Forma de A: tônica na corda 5", "Pentatônica menor: 1 b3 4 5 b7", "H, P e slides")),
    B("Mini-desafio", 15, strum("Am – F – C – G a 75 BPM", 75, bars(M2_PROG, STR.folk)), tab("Ligados em Lá menor", 70, LEGATO_REAL), checks("sem7", "Semana 7 concluída", "Levada folk sem parar a mão direita", "Pentatônica forma 1 a 70 BPM", "Hammer-on e pull-off soando quase tão forte quanto a nota palhetada")),
    B("Qual acorde?", 5, whichChord("Am", "F", "C", "G", "Bm")),
  ]),

  lesson(52, "Primeiras frases: pergunta e resposta", ["Entender frase musical", "Tocar uma pergunta e uma resposta", "Terminar na tônica"], [
    B(undefined, 5, tab("Pentatônica de Lá menor", 70, PENTA_AM)),
    B("Solo é conversa", 10,
      "Um solo não é uma escala tocada sem parar. É **frase, pausa, frase**. A forma mais simples é **pergunta e resposta**:",
      list("A **pergunta** termina numa nota que pede continuação (o 5 ou o b7).", "A **resposta** termina na **tônica**: sensação de ponto final."),
      tab("Pergunta (termina no 5)", 70, PHRASE_Q),
      tab("Resposta (termina no Lá)", 70, PHRASE_A),
    ),
    B("Sua vez", 10, jam("Base em Lá menor", "Lá menor", 70, "rock", ["Am", "Am", "Am", "Am"]), "Toque a pergunta da Pauta e invente a resposta. Depois o contrário. Use 2 compassos para tocar e 2 para respirar.", tip("Pausa não é erro. Pausa é o que faz a frase parecer frase.")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(53, "Pentatônica de Mi menor na primeira posição", ["Tocar a penta com cordas soltas", "Ver que a forma é a mesma, em outra casa", "Improvisar sobre Em"], [
    B(undefined, 5, tab("Pergunta e resposta", 70, [...PHRASE_Q, ...PHRASE_A])),
    B("A mesma forma na casa 0", 10,
      "A forma 1 é móvel: com a tônica na corda 6, ela vale para qualquer tom. Em **Mi**, a tônica é a corda 6 **solta**, e as cordas soltas viram o dedo 1.",
      box(E, "pentaMinor", 0, 3, "Pentatônica de Mi menor: E G A B D. Quase tudo é corda solta ou casas 2 e 3.", { label: "degree" }),
    ),
    B("Improviso em Mi menor", 10, tab("Penta de Mi menor", 70, PENTA_EM), jam("Base em Mi menor", "Mi menor", 75, "rock", ["Em", "Em", "D", "Em"])),
    B("Maior ou menor?", 5, ear("major-minor")),
  ]),

  lesson(54, "Ritmo nas frases", ["Usar colcheias, semínimas e pausas no solo", "Repetir uma ideia rítmica", "Frases de um compasso"], [
    B(undefined, 5, tab("Penta de Mi menor", 80, PENTA_EM)),
    B("O ritmo vem antes da nota", 8,
      "Pegue **duas notas** só, por exemplo C e D (casas 5 e 7 da corda 3), e crie ritmos diferentes com elas. Uma frase com ritmo forte e 2 notas soa melhor que 20 notas sem ritmo.",
      tab("Duas notas, três ritmos", 70, [n(3, 5, 1), n(3, 7, 1), r(2), n(3, 5, 0.5), n(3, 5, 0.5), n(3, 7, 1), r(2), n(3, 7, 1.5), n(3, 5, 0.5), n(3, 7, 2)]),
    ),
    B("Frases de um compasso", 12, jam("Lá menor", "Lá menor", 70, "pop", ["Am", "Am", "Am", "Am"]), ol("Compasso 1: toque uma frase com até 4 notas.", "Compasso 2: silêncio.", "Compasso 3: repita a mesma frase, mudando só a última nota.", "Compasso 4: silêncio."), rec("m2-frases", "Grave 4 voltas e ouça: as frases parecem perguntas e respostas?")),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(55, "Lá menor e Dó maior: as mesmas notas", ["Entender tom relativo", "Usar a penta de Lá sobre Dó maior", "Ouvir a mudança de centro"], [
    B(undefined, 5, tab("Pentatônica de Lá menor", 75, PENTA_AM)),
    B("Relativos", 10,
      "**Lá menor** e **Dó maior** usam as mesmas notas (nenhum sustenido). São **tons relativos**. O que muda é qual nota soa como casa.",
      "A pentatônica de Lá menor (A C D E G) vista a partir do Dó vira a **pentatônica de Dó maior** (C D E G A). Mesma forma, outra tônica.",
      box(C, "pentaMajor", 5, 8, "As mesmas casas, agora com o Dó como tônica (bolinhas vermelhas).", { label: "degree" }),
    ),
    B("Mesmo desenho, outro centro", 10, jam("Base em Dó maior", "Dó maior", 80, "pop", ["C", "G", "Am", "F"]), "Toque a forma 1 sobre esta base, mas termine as frases em **Dó** (casa 5 da corda 3, ou casa 8 das cordas 1 e 6).", check("Ouviu como o mesmo desenho soa mais alegre? O acompanhamento decide o caráter.")),
    B("Maior ou menor?", 5, ear("major-minor")),
  ]),

  lesson(56, "Improviso de quatro compassos", ["Planejar 4 compassos", "Usar pergunta, resposta e pausas", "Terminar na tônica no tempo 1"], [
    B(undefined, 5, tab("Pergunta e resposta", 75, [...PHRASE_Q, ...PHRASE_A])),
    B("Um mapa de 4 compassos", 8,
      ol("**Compasso 1:** frase curta (pergunta).", "**Compasso 2:** respire ou repita um pedaço.", "**Compasso 3:** frase que desce em direção ao Lá.", "**Compasso 4:** chegue no **Lá no tempo 1** e segure."),
      "Este é exatamente o desafio do fim do mês: 4 compassos seus, só com a pentatônica, terminando na tônica.",
    ),
    B("Ensaios", 12, jam("Base do desafio", "Lá menor", 70, "rock", ["Am", "Am", "Dm", "Am"]), rec("m2-ensaio1", "Grave três tentativas de 4 compassos.")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(57, "Estudo do mês: Lá menor com pestanas", ["Ler um estudo de 8 compassos", "Acompanhar com pestanas", "Juntar melodia e base"], [
    B(undefined, 5, changes(["Am", "Dm", "F", "E"], 65)),
    B("O estudo", 8,
      "O estudo do mês tem duas partes: **A** é uma melodia de 8 compassos na forma 1, **B** é o acompanhamento com levada folk em 8 compassos. Juntas, dão 32 compassos com as repetições.",
      tab("Estudo · parte A (melodia)", 70, ESTUDO_A),
    ),
    B("Parte B: acompanhamento", 12, strum("Estudo · parte B", 70, bars(["Am", "Am", "Dm", "Dm", "F", "G", "E", "E"], STR.folk)), chords("Am", "Dm", "F", "G", "E"), tip("Toque A, B, A, B. Isso são 32 compassos.")),
    B("Qual acorde?", 5, whichChord("Am", "Dm", "F", "E")),
  ]),

  lesson(58, "O estudo inteiro e o improviso", ["Tocar os 32 compassos sem parar", "Improvisar no lugar da última melodia", "Gravar"], [
    B(undefined, 5, tab("Estudo · parte A", 70, ESTUDO_A)),
    B("Do escrito ao seu", 5, "Hoje, na última repetição da parte A, **troque a melodia escrita por 4 compassos improvisados**. É uma ponte entre ler e criar."),
    B("A peça", 15, strum("Parte B", 75, bars(["Am", "Am", "Dm", "Dm", "F", "G", "E", "E"], STR.folk)), jam("Base para a parte A", "Lá menor", 70, "pop", ["Am", "Am", "Dm", "Dm", "F", "G", "E", "E"]), rec("m2-estudo", "Grave o estudo inteiro: A, B, A, B (com improviso no último A).")),
    B("Qual acorde?", 5, whichChord("Am", "Dm", "F", "G", "E")),
  ]),

  lesson(59, "Ensaio geral do mês 2", ["Simular o desafio", "Conferir os critérios", "Saber se está pronto"], [
    B(undefined, 5, tuner, tab("Pentatônica", 70, PENTA_AM)),
    B("O que o desafio pede", 5, list("**Improviso:** 4 compassos em Lá menor sobre a base, a 70 BPM.", "Só notas da pentatônica.", "A frase termina no **Lá**.", "Bônus: o estudo do mês com pestanas, sem parar."), check("Grave tudo. Ouça no dia seguinte, com ouvido de plateia.")),
    B("Simulado", 15, jam("Simulado", "Lá menor", 70, "rock", ["Am", "Am", "Dm", "Am"]), rec("m2-simulado"), checks("ensaio2", "Estou pronto?", "Toquei 4 compassos sem parar", "Usei pausas", "Terminei no Lá no tempo 1")),
    B("Maior ou menor?", 5, ear("major-minor")),
  ]),

  lesson(60, "Desafio do mês 2", ["Improvisar 4 compassos em Lá menor", "Usar só a pentatônica", "Terminar na tônica"], [
    B("Aquecimento", 5, tuner, tab("Pentatônica de Lá menor", 70, PENTA_AM)),
    B("As regras", 3, list("Base a **70 BPM**.", "Escute 4 compassos da base antes de entrar.", "Toque **4 compassos** seus, usando só a pentatônica de Lá menor.", "A última nota é o **Lá**, de preferência no tempo 1 do compasso seguinte.", "Errou uma nota? Vale. Parou o pulso? Recomece.")),
    B("Desafio", 15, jam("Desafio do mês 2", "Lá menor", 70, "rock", ["Am", "Am", "Dm", "Am"]), rec("m2-desafio", "Grave a sua melhor tentativa."), bpmlog(2, 70), tip("Passou? Tente a 80 BPM, ou sobre a base em Dó maior terminando no Dó.")),
    B("Ouvido e o que vem", 7, whichChord("Am", "Dm", "F", "G", "E"), "No **mês 3** você entende o que está tocando: **intervalos**, a diferença entre as cordas 3 e 2, **tríades**, o campo harmônico, double stops, palm mute e o **bend afinado**."),
  ]),
];

