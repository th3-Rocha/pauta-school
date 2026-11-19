// Mês 3 · dias 61 a 90 · Intervalos e tríades
import type { Lesson, Node } from "../types";
import { B, bars, bend, box, bpmlog, changes, check, checks, chords, ear, jam, lesson, list, m, minute, n, ol, r, rec, run, STR, strum, t, tab, theory, tip, tuner, warn, whichChord } from "./lib";

const A = 9;
const C = 0;
const E = 4;
const NATURAL = [0, 2, 4, 5, 7, 9, 11];

/** Bolinhas com nome da nota, só em algumas cordas. */
const naturals = (strings: number[], caption: string): Node => box(C, NATURAL, 0, 12, caption, { label: "note", highlight: "none", strings });

/** Tríades nas cordas 3, 2 e 1. */
const TRI: Record<string, [number, number, number][]> = {
  C: [[5, 5, 3], [9, 8, 8], [12, 13, 12]],
  F: [[10, 10, 8], [2, 1, 1], [5, 6, 5]],
  G: [[12, 12, 10], [4, 3, 3], [7, 8, 7]],
  Am: [[2, 1, 0], [5, 5, 5], [9, 10, 8]],
  Em: [[9, 8, 7], [0, 0, 0], [4, 5, 3]],
  Dm: [[7, 6, 5], [10, 10, 10], [2, 3, 1]],
};
const tri = (name: string, inv: number, d = 1) => m([[3, TRI[name][inv][0]], [2, TRI[name][inv][1]], [1, TRI[name][inv][2]]], d);
const triMarkers = (name: string, inv: number, labels: [string, string, string]): Node => ({
  w: "fretboard",
  from: Math.max(0, Math.min(...TRI[name][inv]) - 1),
  frets: Math.max(...TRI[name][inv]) + 2,
  markers: TRI[name][inv].map((f, i) => ({ s: 3 - i, f, label: labels[i], kind: labels[i] === "1" ? "root" : labels[i] === "3" || labels[i] === "b3" ? "deg-3" : "deg-5" })),
});

/** Terças da escala de Dó maior nas cordas 3 e 2. */
const THIRDS: [number, number][] = [[0, 0], [2, 1], [4, 3], [5, 5], [7, 6], [9, 8], [10, 10], [12, 12]];
const THIRDS_TAB = [...THIRDS.map(([a, b]) => m([[3, a], [2, b]], 1)), ...[...THIRDS].reverse().slice(1).map(([a, b]) => m([[3, a], [2, b]], 1))];

/** Oitavas: corda 6 → corda 4 (2 casas acima); corda 4 → corda 2 (3 casas acima, por causa do G–B). */
const OCTAVES = [m([[6, 3], [4, 5]], 1), m([[6, 5], [4, 7]], 1), m([[5, 3], [3, 5]], 1), m([[5, 5], [3, 7]], 1), m([[4, 5], [2, 8]], 1), m([[4, 7], [2, 10]], 1), m([[3, 5], [1, 8]], 1), m([[3, 7], [1, 10]], 1)];

/** Frases com bend na pentatônica de Lá menor (originais). */
const BEND_LICK_1 = [n(2, 5, 0.5), n(2, 8, 0.5), t(3, 7, "b", 1, 2), n(3, 5, 1), n(4, 7, 1), r(4)];
const BEND_LICK_2 = [t(2, 8, "b", 1.5, 2), n(1, 5, 0.5), n(2, 8, 0.5), n(2, 5, 0.5), n(3, 7, 1), t(3, 7, "b", 1, 1), n(3, 5, 1), n(4, 7, 2)];
const BEND_LICK_3 = [n(3, 5, 0.5), t(3, 7, "b", 0.5, 2), t(3, 7, "r", 0.5, 2), n(3, 5, 0.5), n(4, 7, 2), r(4)];

/** Riff em Mi com palm mute e double stops (original). */
const RIFF_M3 = [
  t(6, 0, "pm", 0.5), t(6, 0, "pm", 0.5), m([[4, 2], [3, 0]], 0.5), t(6, 0, "pm", 0.5), m([[4, 4], [3, 2]], 0.5), t(6, 0, "pm", 0.5), m([[4, 2], [3, 0]], 1),
  t(6, 0, "pm", 0.5), t(6, 0, "pm", 0.5), m([[5, 2], [4, 0]], 0.5), t(6, 0, "pm", 0.5), m([[5, 0], [4, 2]], 0.5), t(6, 3, "/", 0.5), m([[6, 5], [5, 7]], 1),
];

const POP = ["G", "D", "Em", "C"];

export const MONTH_3: Lesson[] = [
  lesson(61, "Notas nas cordas 6 e 5 até a casa 12", ["Achar qualquer nota natural nas cordas graves", "Usar as marcações do braço", "Nomear power chords por elas"], [
    B(undefined, 5, "Bem-vindo ao mês 3. Antes de tudo, a pentatônica do mês passado.", tab("Pentatônica de Lá menor", 70, run(A, "pentaMinor", 5, 8))),
    B("O mapa das cordas graves", 10,
      "As cordas 6 e 5 são as mais importantes para achar notas: é nelas que ficam as **tônicas** dos acordes com pestana e dos power chords.",
      naturals([6, 5], "Notas naturais nas cordas 6 e 5. As marcações (3, 5, 7, 9, 12) ajudam: G na 3 e A na 5 (corda 6), C na 3 e D na 5 (corda 5)."),
      tip("Não decore 14 posições de uma vez. Decore as das **marcações** e ache as outras contando tons e semitons a partir delas."),
    ),
    B("Ache sem olhar", 10, ol("Diga uma nota (por exemplo, **D**) e ache nas duas cordas.", "Confira tocando a corda solta correspondente ou com o afinador.", "Repita com todas as 7 notas naturais."), changes(["G5", "C5", "D5", "A5@5"], 70), minute("notas65", "Quantas notas você acha nas cordas 6 e 5 em 1 minuto? Peça para alguém (ou um sorteio) falar as notas.")),
    B("Subiu ou desceu?", 5, ear("highlow-close")),
  ]),

  lesson(62, "Oitavas e as cordas do meio", ["Achar notas nas cordas 4 e 3 por oitavas", "Entender o desvio entre as cordas 3 e 2", "Tocar melodias em oitavas"], [
    B(undefined, 5, changes(["G5", "C5", "D5", "A5@5"], 75)),
    B("Duas cordas abaixo, duas casas acima", 10,
      "A **oitava** de uma nota da corda 6 está **duas cordas mais agudas e duas casas à frente** (corda 4). Vale também da corda 5 para a 3.",
      "Da corda 4 para a 2 e da 3 para a 1, a oitava fica **três casas acima**. É culpa da afinação: entre as cordas 3 (G) e 2 (B) há uma **3ª maior** (4 casas) em vez de uma 4ª (5 casas). Todo desenho que atravessa esse par anda **uma casa** para a direita.",
      naturals([4, 3], "Notas naturais nas cordas 4 e 3."),
    ),
    B("Oitavas", 10, tab("Oitavas pelas cordas", 60, OCTAVES), tip("Abafe a corda do meio com a parte de baixo do dedo 1. Assim você pode palhetar mais solto.")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(63, "O que é um intervalo", ["Medir distância entre duas notas", "Contar por letras e por casas", "Diferenciar intervalo melódico e harmônico"], [
    B(undefined, 5, tab("Oitavas", 70, OCTAVES)),
    B("Duas contagens", 10,
      "**Intervalo** é a distância entre duas notas. Ele tem um **número** e uma **qualidade**:",
      list("**Número:** conte as letras incluindo as duas pontas. C → E = C, D, E = **3ª**.", "**Qualidade:** conte as casas. C → E são 4 casas: **3ª maior**. C → Eb são 3: **3ª menor**."),
      theory(["Tabela dos simples (casas): 2ªm = 1 · 2ªM = 2 · 3ªm = 3 · 3ªM = 4 · 4ªJ = 5 · trítono = 6 · 5ªJ = 7 · 6ªm = 8 · 6ªM = 9 · 7ªm = 10 · 7ªM = 11 · 8ª = 12.", "**J** = justo: 4ª, 5ª e 8ª não são maiores nem menores."], "Intervalos em casas"),
      list("**Melódico:** uma nota depois da outra.", "**Harmônico:** as duas juntas."),
    ),
    B("Intervalos na corda 2", 10, tab("Da casa 1 (C) para cima, mesma corda", 60, [n(2, 1, 1), n(2, 3, 1), n(2, 1, 1), n(2, 5, 1), n(2, 1, 1), n(2, 6, 1), n(2, 1, 1), n(2, 8, 1), n(2, 1, 1), n(2, 13, 3), r(1)]), "C → D (2ªM), C → E (3ªM), C → F (4ªJ), C → G (5ªJ), C → C (8ª). Cante cada um antes de tocar."),
    B("Qual intervalo?", 5, ear("interval", ["5J", "8J"])),
  ]),

  lesson(64, "Terças: maior e menor", ["Achar 3ª maior e menor no braço", "Ouvir a diferença", "Ligar a 3ª ao caráter de maior e menor"], [
    B(undefined, 5, ear("interval", ["5J", "8J"])),
    B("A nota que decide", 10,
      "A **3ª** é o intervalo mais importante da harmonia. Uma 3ª **maior** soa clara; uma 3ª **menor** soa escura. É ela que faz um acorde ser maior ou menor.",
      { w: "fretboard", from: 2, frets: 8, markers: [{ s: 5, f: 3, label: "1", kind: "root" }, { s: 4, f: 2, label: "3", kind: "deg-3" }, { s: 4, f: 1, label: "b3", kind: "ghost" }, { s: 6, f: 8, label: "1", kind: "root" }, { s: 5, f: 7, label: "3", kind: "deg-3" }, { s: 5, f: 6, label: "b3", kind: "ghost" }], caption: "Entre cordas vizinhas: a 3ª maior fica **na corda vizinha mais aguda, uma casa para trás**; a menor, **duas casas para trás**." },
      "Atravessando o par G–B, ajuste uma casa: da corda 3 para a 2, a 3ª maior fica **na mesma casa** e a menor **uma casa atrás**.",
    ),
    B("Terças de Dó maior", 10, tab("Terças da escala de Dó, cordas 3 e 2", 60, THIRDS_TAB), "Repare: algumas são maiores (4 casas de distância) e outras menores (3). A escala decide qual cabe em cada grau."),
    B("Qual terça?", 5, ear("interval", ["3m", "3M"])),
  ]),

  lesson(65, "Quintas e quartas", ["Achar 5ª e 4ª justas", "Reconhecer o power chord como 5ª", "Ouvir o som aberto dos intervalos justos"], [
    B(undefined, 5, tab("Terças de Dó", 70, THIRDS_TAB)),
    B("Os intervalos justos", 10,
      list("**5ª justa:** 7 casas. No braço: na corda vizinha mais aguda, **duas casas à frente**. É o power chord.", "**4ª justa:** 5 casas. Na mesma casa, na corda vizinha mais aguda (exceto G–B).", "Uma 4ª de C para F e uma 5ª de F para C juntas formam uma oitava: são **inversões** uma da outra."),
      { w: "fretboard", from: 2, frets: 8, markers: [{ s: 6, f: 3, label: "1", kind: "root" }, { s: 5, f: 5, label: "5", kind: "deg-5" }, { s: 5, f: 3, label: "4", kind: "in" }, { s: 4, f: 5, label: "8", kind: "root" }] },
    ),
    B("Quartas em movimento", 10, tab("Quartas paralelas nas cordas 4 e 3", 60, [m([[4, 5], [3, 5]], 1), m([[4, 7], [3, 7]], 1), m([[4, 9], [3, 9]], 1), m([[4, 7], [3, 7]], 1), m([[4, 5], [3, 5]], 2), m([[4, 3], [3, 3]], 2)]), "Quartas paralelas soam medievais, ou de abertura de filme. Experimente a mesma ideia com quintas (power chords)."),
    B("Qual intervalo?", 5, ear("interval", ["3m", "3M", "4J", "5J"])),
  ]),

  lesson(66, "Todos os intervalos simples", ["Montar a tabela de intervalos no braço", "Cantar cada intervalo", "Usar músicas de referência"], [
    B(undefined, 5, ear("interval", ["3M", "4J", "5J", "8J"])),
    B("Mapa de intervalos", 10,
      "Todos os intervalos a partir de **C** (corda 5, casa 3), dentro de uma mão:",
      box(C, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 2, 6, "Cada bolinha mostra o intervalo a partir do Dó. b2 = 2ª menor, 2 = 2ª maior, b3 = 3ª menor… b5 = trítono.", { strings: [5, 4, 3] }),
      "Músicas de referência ajudam: **5ª justa** é o começo de *Brilha, brilha, estrelinha*; **4ª justa**, da *marcha nupcial*; **2ª menor**, do tema de *tubarão*.",
    ),
    B("Cante, depois toque", 10, ol("Toque o Dó.", "Cante o intervalo pedido.", "Ache a nota no braço e confira."), list("3ª maior · 5ª justa · 4ª justa · 6ª maior · 7ª menor · oitava"), tip("Se não conseguir cantar, toque primeiro e cante depois. O caminho voz → ouvido → braço é o que o currículo chama de *ciclo*.")),
    B("Qual intervalo?", 5, ear("interval", ["2M", "3m", "3M", "4J", "5J", "8J"])),
  ]),

  lesson(67, "Revisão da semana 9", ["Notas nas 4 cordas graves", "Oitavas e o desvio G–B", "Intervalos de ouvido"], [
    B("Aquecimento", 6, tab("Oitavas", 75, OCTAVES)),
    B("O que você já sabe", 4, list("Notas naturais até a casa 12 nas cordas 6, 5, 4 e 3", "Oitava: 2 cordas mais agudas, 2 casas à frente (3 se atravessar G–B)", "3ª maior = 4 casas, menor = 3", "4ª e 5ª justas")),
    B("Mini-desafio", 15, tab("Terças de Dó a 70 BPM", 70, THIRDS_TAB), checks("sem9", "Semana 9 concluída", "Acho qualquer nota natural nas cordas 6 e 5 em até 3 segundos", "Toco oitavas em qualquer par de cordas", "Acerto 3ª maior e menor de ouvido 8 em 10")),
    B("Qual intervalo?", 5, ear("interval", ["3m", "3M", "4J", "5J", "8J"])),
  ]),

  lesson(68, "A tríade maior", ["Construir um acorde empilhando terças", "Montar tríades de três cordas", "Ver 1, 3 e 5 nos acordes abertos"], [
    B(undefined, 5, ear("interval", ["3m", "3M"])),
    B("Terça sobre terça", 10,
      "Uma **tríade** são três notas empilhadas em terças: **1, 3, 5**. Na **tríade maior**, a primeira terça é maior (4 casas) e a segunda é menor (3 casas).",
      "Dó maior: C (1) → E (3ª maior) → G (3ª menor acima do E, 5ª justa acima do C).",
      triMarkers("C", 0, ["1", "3", "5"]),
      "Todo acorde maior aberto que você conhece é uma tríade com notas repetidas. O C aberto tem C, E, G, C, E.",
    ),
    B("Tríades nas cordas agudas", 10, tab("C, F e G nas cordas 3-2-1", 60, [tri("C", 0, 2), tri("F", 2, 2), tri("G", 2, 2), tri("C", 0, 2)]), tip("Toque só as três cordas de cima, com palhetadas curtas. É o som do *funk* e do *reggae*.")),
    B("Maior ou menor?", 5, ear("major-minor")),
  ]),

  lesson(69, "A tríade menor", ["Baixar a 3ª", "Montar tríades menores", "Comparar maior e menor no mesmo lugar"], [
    B(undefined, 5, tab("Tríades maiores", 65, [tri("C", 0, 2), tri("F", 2, 2), tri("G", 2, 2), tri("C", 0, 2)])),
    B("Uma casa muda tudo", 10,
      "Na **tríade menor** a ordem das terças inverte: primeiro uma **menor** (3 casas), depois uma **maior** (4). Resultado: **1, b3, 5**.",
      "No braço, basta **descer a 3ª uma casa**. Compare:",
      triMarkers("Am", 1, ["b3", "5", "1"]),
      chords("A", "Am", "E", "Em"),
    ),
    B("Maior ↔ menor", 10, tab("Am, Dm e Em nas cordas 3-2-1", 60, [tri("Am", 1, 2), tri("Dm", 2, 2), tri("Em", 2, 2), tri("Am", 1, 2)]), changes(["A", "Am", "E", "Em"], 70)),
    B("Maior ou menor?", 5, ear("quality", ["", "m"])),
  ]),

  lesson(70, "Diminuta, aumentada e suspensas", ["Montar as tríades diminuta e aumentada", "Usar sus2 e sus4", "Reconhecer as cores de ouvido"], [
    B(undefined, 5, ear("quality", ["", "m"])),
    B("As outras tríades", 10,
      list("**Diminuta (dim, °):** 1, b3, b5. Duas terças menores. Tensa, quer ir para algum lugar.", "**Aumentada (aug, +):** 1, 3, #5. Duas terças maiores. Flutua, como sonho.", "**sus4:** 1, 4, 5. A 3ª é trocada pela 4ª: fica *suspensa* esperando resolver.", "**sus2:** 1, 2, 5. Aberta, moderna."),
      chords("Bdim", "Caug", "Asus4", "Asus2", "Dsus4", "Dsus2"),
    ),
    B("Suspender e resolver", 10, changes(["Dsus4", "D", "Dsus2", "D"], 70), changes(["Asus4", "A", "Asus2", "A"], 70), "O sus4 → maior é um dos clichês mais bonitos do pop e do rock. Repare como o dedo 4 sai e o 3 assume."),
    B("Qual tríade?", 5, ear("quality", ["", "m", "dim", "aug"])),
  ]),

  lesson(71, "O campo harmônico maior", ["Formar uma tríade em cada nota da escala", "Saber quais graus são maiores e menores", "Tocar o campo de Dó"], [
    B(undefined, 5, changes(["Dsus4", "D", "Asus4", "A"], 75)),
    B("Sete acordes de uma escala", 12,
      "Pegue a escala de Dó maior e empilhe terças **usando só notas da escala** a partir de cada grau. Saem sete tríades:",
      list("**I** C (maior) · **ii** Dm (menor) · **iii** Em (menor)", "**IV** F (maior) · **V** G (maior) · **vi** Am (menor)", "**vii°** Bdim (diminuta)"),
      theory("Em todo tom maior a ordem é a mesma: **maior, menor, menor, maior, maior, menor, diminuto**. Isso é o **campo harmônico maior**.", "A regra de ouro"),
      chords("C", "Dm", "Em", "F", "G", "Am", "Bdim"),
    ),
    B("O campo de Dó", 8, changes(["C", "Dm", "Em", "F", "G", "Am", "Bdim", "C"], 60, 2)),
    B("Qual tríade?", 5, ear("quality", ["", "m", "dim"])),
  ]),

  lesson(72, "Graus romanos: I–IV–V e I–V–vi–IV", ["Escrever progressões com números", "Transpor uma progressão de tom", "Tocar as progressões mais famosas"], [
    B(undefined, 5, changes(["C", "Dm", "Em", "F", "G", "Am", "Bdim", "C"], 65, 2)),
    B("Números em vez de nomes", 10,
      "Músicos falam de progressões pelos graus: **maiúscula** = acorde maior, **minúscula** = menor. Assim a mesma progressão vale em qualquer tom.",
      list("**I–IV–V:** C F G em Dó · G C D em Sol · A D E em Lá. Rock, blues, forró.", "**I–V–vi–IV:** C G Am F em Dó · G D Em C em Sol. Metade do pop do mundo."),
      tip("Para transpor: escreva os graus, ache o campo do novo tom e troque os nomes."),
    ),
    B("Duas progressões, dois tons", 10, strum("I–V–vi–IV em Sol", 75, bars(POP, STR.folk)), strum("I–IV–V–I em Lá", 75, bars(["A", "D", "E", "A"], STR.pop))),
    B("Qual progressão?", 5, ear("progression", ["I IV V I", "I V vi IV"])),
  ]),

  lesson(73, "Tríades e inversões nas cordas agudas", ["Tocar a mesma tríade em 3 lugares", "Reconhecer fundamental, 1ª e 2ª inversão", "Ligar acordes com pouco movimento"], [
    B(undefined, 5, strum("I–V–vi–IV", 80, bars(POP, STR.folk))),
    B("Três formas de C", 10,
      "As mesmas três notas podem vir em ordens diferentes. A nota mais grave decide o nome:",
      list("**Fundamental:** 1 embaixo (C E G).", "**1ª inversão:** 3 embaixo (E G C).", "**2ª inversão:** 5 embaixo (G C E)."),
      triMarkers("C", 0, ["1", "3", "5"]),
      triMarkers("C", 1, ["3", "5", "1"]),
      triMarkers("C", 2, ["5", "1", "3"]),
    ),
    B("Subindo o braço", 10, tab("C em três lugares", 60, [tri("C", 0, 2), tri("C", 1, 2), tri("C", 2, 4)]), tab("C–F–G com o mínimo de movimento", 60, [tri("C", 0, 2), tri("F", 2, 2), tri("G", 1, 2), tri("C", 0, 2)]), tip("Para ir de um acorde ao outro, procure a inversão **mais perto**. Notas em comum ficam paradas.")),
    B("Qual tríade?", 5, ear("quality", ["", "m", "dim", "aug"])),
  ]),

  lesson(74, "Revisão da semana 10", ["Tríades e suas qualidades", "Campo harmônico maior", "Graus romanos"], [
    B("Aquecimento", 6, changes(["C", "Dm", "Em", "F", "G", "Am", "Bdim", "C"], 70, 2)),
    B("O que você já sabe", 4, list("Tríade = 1 3 5 em terças", "M, m, dim, aug, sus2, sus4", "Campo maior: M m m M M m dim", "I–IV–V e I–V–vi–IV em qualquer tom", "Inversões nas cordas 3-2-1")),
    B("Mini-desafio", 15, tab("C–F–G nas inversões próximas", 70, [tri("C", 0, 2), tri("F", 2, 2), tri("G", 1, 2), tri("C", 0, 2)]), checks("sem10", "Semana 10 concluída", "Monto o campo de Dó sem olhar", "Toco I–V–vi–IV em Sol e em Dó", "Acerto maior × menor × diminuto de ouvido 8 em 10")),
    B("Qual progressão?", 5, ear("progression", ["I IV V I", "I V vi IV", "vi IV I V"])),
  ]),

  lesson(75, "Baixos invertidos e baixo que caminha", ["Ler cifra com barra (C/E)", "Fazer um baixo descendo por grau", "Tocar G–D/F#–Em"], [
    B(undefined, 5, tab("C–F–G", 75, [tri("C", 0, 2), tri("F", 2, 2), tri("G", 1, 2), tri("C", 0, 2)])),
    B("O nome depois da barra", 10,
      "Na cifra **C/E**, a barra diz qual nota fica **no baixo**: acorde de Dó com Mi na corda mais grave. É uma inversão escrita na cifra.",
      "O uso mais comum é fazer o baixo **andar por grau**, ligando acordes como uma melodia grave:",
      chords("G", "D/F#", "Em", "C/G", "G/B", "C/E"),
    ),
    B("Baixos que descem", 10, changes(["G", "D/F#", "Em", "C"], 65), changes(["C", "G/B", "Am", "Am/G", "F", "C/E", "Dm", "G"], 65, 2), tip("Toque primeiro só o baixo de cada acorde para ouvir a linha. Depois o acorde inteiro.")),
    B("Qual acorde?", 5, whichChord("G", "D/F#", "Em", "C")),
  ]),

  lesson(76, "Double stops em terças", ["Tocar duas notas juntas com a palheta", "Usar terças da escala em riffs", "Deslizar double stops"], [
    B(undefined, 5, changes(["G", "D/F#", "Em", "C"], 70)),
    B("Duas cordas, um gesto", 8,
      "**Double stop** é tocar duas notas ao mesmo tempo. Terças nas cordas 3 e 2 são o tempero do soul, do country e do rock dos anos 60.",
      "Dica de técnica: palhete as duas cordas com um movimento curto e abafe as outras com a mão esquerda.",
    ),
    B("Terças no tempo", 12, tab("Terças de Dó", 70, THIRDS_TAB), tab("Lick de terças em Dó (original)", 70, [m([[3, 5], [2, 5]], 0.5), m([[3, 7], [2, 6]], 0.5), m([[3, 9], [2, 8]], 1), m([[3, 7], [2, 6]], 0.5), m([[3, 5], [2, 5]], 0.5), m([[3, 4], [2, 3]], 1), m([[3, 5], [2, 5]], 4)], { backing: ["C", "C"] })),
    B("Intervalo harmônico", 5, ear("interval-harmonic", ["3m", "3M", "5J"])),
  ]),

  lesson(77, "Palm mute com dinâmica", ["Controlar o quanto abafa", "Alternar abafado e aberto", "Fazer crescendo com a mão direita"], [
    B(undefined, 5, tab("Riff em E5", 80, Array.from({ length: 8 }, () => m([[6, 0], [5, 2]], 0.5, "pm")))),
    B("Abafar é um botão de volume", 8,
      "Mais perto da ponte = menos abafado. Mais para dentro = mais abafado. Use isso para criar **dinâmica**: começar fechado e abrir aos poucos.",
      list("**Verso:** palm mute fechado, colcheias.", "**Pré-refrão:** solte a mão aos poucos.", "**Refrão:** acordes abertos, batida cheia."),
    ),
    B("Riff do mês", 12, tab("Riff em Mi com double stops (original)", 75, RIFF_M3), jam("Rock em Mi", "Mi menor", 90, "rock", ["E5", "E5", "G5", "A5@5"]), rec("m3-pm", "Grave o riff e confira: o palm mute ficou igual em todas as notas?")),
    B("Qual intervalo?", 5, ear("interval", ["4J", "5J", "8J"])),
  ]),

  lesson(78, "Bend de meio tom", ["Empurrar a corda até a nota certa", "Usar os dedos de reforço", "Conferir com o alvo"], [
    B(undefined, 5, tab("Riff do mês", 80, RIFF_M3)),
    B("Esticar a corda é mudar a nota", 10,
      "No **bend**, você empurra a corda para cima (ou puxa para baixo, nas cordas 6 e 5) e a nota sobe. O importante: **subir até uma nota de verdade**, não *mais ou menos*.",
      list("Use o **dedo 3** para o bend, com os dedos 1 e 2 atrás **ajudando a empurrar**.", "O movimento vem do **punho girando**, como girar uma maçaneta, não dos dedos.", "**Antes do bend, toque a nota-alvo** uma casa acima (meio tom) e grave na cabeça."),
      tab("Alvo, depois bend de meio tom", 50, [n(3, 8, 2), t(3, 7, "b", 2, 1), n(3, 8, 2), t(3, 7, "b", 2, 1)]),
    ),
    B("Confira no afinador", 10, bend(3, 7, 1), "Este bend (Ré → Ré#) é a **blue note** da pentatônica de Lá: aparece em quase todo blues.", warn("Cordas de aço calibre 0.10 ou mais grossas cansam rápido. Faça séries curtas e descanse a mão.")),
    B("Subiu ou desceu?", 5, ear("highlow-close")),
  ]),

  lesson(79, "Bend de um tom", ["Subir dois semitons com controle", "Parar exatamente no alvo", "Soltar o bend (release)"], [
    B(undefined, 5, bend(3, 7, 1)),
    B("Mais longe, mesma técnica", 8,
      "O bend de **um tom** é o mais usado. Alvo: a nota **duas casas acima**. Ouça o alvo, faça o bend, compare.",
      list("**B1** na tablatura = bend de um tom. **B½** = meio tom.", "**R** = release: com o bend lá em cima, desça a corda devagar até a nota original sem palhetar de novo."),
      tab("Bend de 1 tom e release", 50, [n(3, 9, 2), t(3, 7, "b", 2, 2), n(2, 10, 2), t(2, 8, "b", 2, 2), t(3, 7, "b", 1, 2), t(3, 7, "r", 1, 2), n(3, 5, 2)]),
    ),
    B("Afinado de verdade", 12, bend(3, 7, 2), bend(2, 8, 2), check("Meta do mês: o bend de 1 tom chega dentro de **±15 cents** do alvo. Se passar do alvo, use menos força; se ficar baixo, gire mais o punho.")),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m"])),
  ]),

  lesson(80, "Frases com bend", ["Usar bends na pentatônica", "Escolher as notas que dobram bem", "Juntar bend e vibrato simples"], [
    B(undefined, 5, bend(3, 7, 2)),
    B("Onde dobrar", 8,
      "Na forma 1 de Lá menor, os bends mais naturais são:",
      list("**Corda 3, casa 7** (D → E): do 4 para o 5.", "**Corda 2, casa 8** (G → A): do b7 para a tônica.", "**Corda 1, casa 8** (C → D): da b3 para o 4."),
      "Dobrar **até uma nota da escala** é a regra. Por isso esses três funcionam.",
    ),
    B("Três frases", 12, tab("Frase 1", 70, BEND_LICK_1), tab("Frase 2", 70, BEND_LICK_2), tab("Frase 3 (bend e release)", 70, BEND_LICK_3), jam("Base em Lá menor", "Lá menor", 75, "rock", ["Am", "G", "F", "G"])),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m", "3M"])),
  ]),

  lesson(81, "Revisão da semana 11", ["Inversões e baixos", "Double stops e palm mute", "Bends afinados"], [
    B("Aquecimento", 6, tab("Terças de Dó", 80, THIRDS_TAB)),
    B("O que você já sabe", 4, list("C/E: acorde com baixo diferente", "Double stops em terças", "Palm mute com dinâmica", "Bend de ½ e 1 tom com alvo")),
    B("Mini-desafio", 15, bend(2, 8, 2), tab("Frases com bend", 75, [...BEND_LICK_1, ...BEND_LICK_2]), checks("sem11", "Semana 11 concluída", "Bend de 1 tom dentro de ±15 cents em 3 de 5 tentativas", "Toco o riff do mês com palm mute igual", "G–D/F#–Em–C sem parar")),
    B("Qual intervalo?", 5, ear("interval", ["2M", "3m", "3M", "4J", "5J"])),
  ]),

  lesson(82, "Tríades sobre a base pop", ["Acompanhar I–V–vi–IV com tríades agudas", "Escolher inversões próximas", "Tocar como segunda guitarra"], [
    B(undefined, 5, strum("I–V–vi–IV em Dó", 80, bars(["C", "G", "Am", "F"], STR.folk))),
    B("Segunda guitarra", 8,
      "Numa banda, a segunda guitarra raramente toca acordes de 6 cordas. Ela usa **tríades nas cordas agudas** para não brigar com o baixo e o violão.",
      "Em Dó, a sequência mais econômica é: C (fundamental, casa 5) → G (2ª inversão, casa 7) → Am (1ª inversão, casa 5) → F (2ª inversão, casa 5).",
    ),
    B("Com a base", 12, tab("C–G–Am–F em tríades", 80, [tri("C", 0, 4), tri("G", 2, 4), tri("Am", 1, 4), tri("F", 2, 4)]), jam("Pop em Dó", "Dó maior", 80, "pop", ["C", "G", "Am", "F"]), tip("Toque com batidas curtas em colcheias, ou só no 2 e no 4.")),
    B("Qual progressão?", 5, ear("progression", ["I V vi IV", "vi IV I V", "I IV V I"])),
  ]),

  lesson(83, "Ouvindo terças e quintas dentro dos acordes", ["Cantar a 3ª de um acorde", "Reconhecer 3ª e 5ª de ouvido", "Preparar o desafio"], [
    B(undefined, 5, ear("interval", ["3m", "3M", "5J"])),
    B("Dentro do acorde", 8,
      "Toque um acorde e cante as notas de baixo para cima: **1, 3, 5**. Depois cante só a 3ª. Isso treina o ouvido a separar as notas do acorde, coisa que você vai usar no solo para *mirar* notas.",
      { w: "chords", chords: ["C", "Am", "G", "Em"] },
    ),
    B("Canto e conferência", 12, ol("Toque C. Cante a 3ª (E). Confira na corda 4, casa 2.", "Toque Am. Cante a 3ª (C). Confira na corda 2, casa 1.", "Toque G. Cante a 5ª (D). Confira na corda 2, casa 3.", "Toque Em. Cante a 3ª (G). Confira na corda 3 solta."), ear("interval-harmonic", ["3m", "3M", "5J"])),
    B("Qual intervalo?", 5, ear("interval", ["3m", "3M", "4J", "5J", "8J"])),
  ]),

  lesson(84, "Todos os Dós do braço", ["Achar uma nota em todas as cordas", "Usar oitavas para navegar", "Conectar regiões"], [
    B(undefined, 5, tab("Oitavas", 80, OCTAVES)),
    B("Uma nota, muitos lugares", 8,
      "Escolha uma nota e ache **todas** as posições dela até a casa 12. Usando oitavas e uníssonos, ninguém decora: deduz.",
      box(C, [0], 0, 12, "Todos os Dós até a casa 12.", { label: "note" }),
    ),
    B("Jogo das notas", 12, ol("Escolha uma nota natural.", "Ache em cada corda, da 6 à 1, com metrônomo a 40 BPM: uma corda por clique.", "Suba para 60 BPM quando acertar todas."), { w: "metronome", bpm: 40 }, minute("notas-todas", "Quantas cordas você completa em 1 minuto?")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(85, "Riff com double stops e bend", ["Juntar as técnicas do mês num riff", "Tocar no tempo com a base", "Gravar"], [
    B(undefined, 5, tab("Frase 3", 75, BEND_LICK_3)),
    B("O riff", 8,
      "Um riff de 4 compassos em Lá que usa double stop, bend, slide e palm mute.",
      tab("Riff do mês 3 (original)", 70, [
        t(5, 0, "pm", 0.5), t(5, 0, "pm", 0.5), m([[3, 5], [2, 5]], 0.5), m([[3, 7], [2, 6]], 0.5), m([[3, 5], [2, 5]], 1), r(1),
        t(5, 0, "pm", 0.5), t(5, 0, "pm", 0.5), n(4, 5, 0.5), t(4, 7, "/", 0.5), t(3, 7, "b", 1, 2), n(3, 5, 1),
        t(5, 0, "pm", 0.5), t(5, 0, "pm", 0.5), m([[3, 5], [2, 5]], 0.5), m([[3, 7], [2, 6]], 0.5), m([[3, 9], [2, 8]], 1), r(1),
        t(2, 8, "b", 1.5, 2), n(2, 5, 0.5), n(3, 7, 1), n(5, 0, 1),
      ]),
    ),
    B("Com a banda", 12, jam("Base do riff", "Lá menor", 80, "rock", ["Am", "Am", "Am", "Am"]), rec("m3-riff", "Grave 2 voltas do riff com a base.")),
    B("Qual intervalo?", 5, ear("interval-harmonic", ["3m", "3M", "4J", "5J"])),
  ]),

  lesson(86, "Solo curto em Sol maior", ["Usar a penta de Mi menor sobre Sol maior", "Mirar as notas dos acordes", "Bends sobre I–V–vi–IV"], [
    B(undefined, 5, strum("I–V–vi–IV em Sol", 80, bars(POP, STR.folk))),
    B("Penta relativa", 8,
      "Sol maior e Mi menor são relativos. A pentatônica de Mi menor (forma 1 na casa 12, ou na casa 0) serve para solar sobre **G–D–Em–C**.",
      box(E, "pentaMinor", 12, 15, "Forma 1 de Mi menor, casa 12. O Sol (relativo maior) está na corda 6 casa 15 e na corda 3 casa 12.", { label: "degree" }),
      "Termine as frases em **Sol** e o solo soa maior. Termine em **Mi** e soa mais melancólico.",
    ),
    B("Solo de 8 compassos", 12, jam("Pop em Sol", "Sol maior", 85, "pop", ["G", "D", "Em", "C", "G", "D", "Em", "C"]), tab("Ideia para começar", 85, [t(2, 15, "b", 1, 2), n(1, 12, 1), n(2, 15, 1), n(2, 12, 1), n(3, 12, 4), t(3, 14, "b", 1, 2), n(3, 12, 1), n(4, 14, 1), n(4, 12, 1), n(5, 14, 4)])),
    B("Qual progressão?", 5, ear("progression", ["I V vi IV", "I IV V I"])),
  ]),

  lesson(87, "Peça do mês: rock em Mi", ["Tocar riff, base e solo em sequência", "Manter o palm mute e a dinâmica", "Encaixar um solo de 4 compassos"], [
    B(undefined, 5, tab("Riff em Mi", 80, RIFF_M3)),
    B("Roteiro", 5, ol("**Intro:** riff em Mi 2×.", "**Verso:** E5–G5–A5–E5 com palm mute (8 compassos).", "**Refrão:** G–D–Em–C com acordes abertos (8 compassos).", "**Solo:** 4 compassos de pentatônica de Mi com um bend.", "**Final:** riff e acorde de E segurado.")),
    B("A peça", 15, tab("Intro", 80, RIFF_M3), strum("Verso", 85, bars(["E5", "G5", "A5@5", "E5"], STR.rockEighths)), strum("Refrão", 85, bars(POP, STR.folk)), jam("Solo", "Mi menor", 85, "rock", ["Em", "Em", "C", "D"])),
    B("Qual acorde?", 5, whichChord("E5", "G5", "A5@5", "Em", "C")),
  ]),

  lesson(88, "Treino do desafio: bends e intervalos", ["Medir seus bends", "Medir seu ouvido", "Achar o ponto fraco"], [
    B(undefined, 5, tuner),
    B("O que o desafio pede", 5, list("**Bend de 1 tom** dentro de **±15 cents** (corda 3 casa 7 e corda 2 casa 8).", "**Bend de ½ tom** afinado (corda 3 casa 7).", "**Ouvido:** reconhecer 3ª e 5ª.", "**Notas:** achar notas no braço com fluência.")),
    B("Treino focado", 15, bend(3, 7, 2), bend(2, 8, 2), bend(3, 7, 1), check("Faça 10 bends de cada. Anote quantos ficaram dentro da faixa verde.")),
    B("Qual intervalo?", 5, ear("interval", ["3m", "3M", "5J"])),
  ]),

  lesson(89, "Ensaio geral do mês 3", ["Simular o desafio", "Saber se está pronto", "Revisar o que ficou fraco"], [
    B(undefined, 5, tab("Frases com bend", 75, [...BEND_LICK_1, ...BEND_LICK_3])),
    B("Simulado", 5, ol("Afinador ligado.", "3 bends de 1 tom seguidos na corda 2, casa 8.", "3 bends de ½ tom na corda 3, casa 7.", "10 perguntas de 3ª e 5ª.")),
    B("Faça", 15, bend(2, 8, 2), bend(3, 7, 1), ear("interval", ["3m", "3M", "5J"]), checks("ensaio3", "Estou pronto?", "3 de 3 bends de 1 tom na faixa", "3 de 3 bends de ½ tom na faixa", "8 de 10 intervalos certos")),
    B("Qual tríade?", 5, ear("quality", ["", "m", "dim", "aug"])),
  ]),

  lesson(90, "Desafio do mês 3", ["Bend de 1 tom dentro de ±15 cents", "Reconhecer 3ª e 5ª de ouvido", "Achar notas no braço"], [
    B("Aquecimento", 5, tuner, tab("Terças de Dó", 70, THIRDS_TAB)),
    B("As regras", 3, list("**Bends:** 5 bends de 1 tom na corda 2, casa 8. Passa com **4 de 5** dentro de ±15 cents.", "**Ouvido:** 10 intervalos (3ª menor, 3ª maior, 5ª). Passa com **8 de 10**.", "**Notas:** sorteie uma nota (dado, papelzinho ou um colega) e ache nas cordas 6, 5 e 4 em até 5 segundos.")),
    B("Desafio", 15, bend(2, 8, 2), ear("interval", ["3m", "3M", "5J"]), box(C, NATURAL, 0, 12, "Cubra o braço com a mão e confira depois.", { label: "note", highlight: "none", strings: [6, 5, 4] }), bpmlog(3, 70), tip("No registro de BPM, anote o andamento em que você toca as frases com bend sem perder a afinação.")),
    B("O que vem", 7, ear("progression", ["I IV V I", "I V vi IV"]), "No **mês 4** o braço inteiro se abre: o sistema **CAGED**, as **semicolcheias**, o **blues de 12 compassos**, a **pentatônica maior** e a **escala blues**."),
  ]),
];

