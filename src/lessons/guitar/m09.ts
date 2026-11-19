// Mês 9 · dias 241 a 270 · Modos e o braço inteiro
import type { Lesson, Node } from "../types";
import { B, box, bpmlog, changes, check, checks, chords, drone, ear, jam, lesson, list, n, nps3, nps3Box, ol, r, rec, run, tab, theory, tip, warn } from "./lib";

const C = 0;
const D = 2;
const E = 4;
const G = 7;
const A = 9;

/** Os 7 padrões 3NPS de Dó maior (casa inicial na corda 6). */
const NPS_C = [8, 10, 12, 1, 3, 5, 7];
const npsC = (i: number, d = 0.5) => nps3(C, "major", NPS_C[i], d);

/** Os 7 modos de Dó, uma oitava cada, do mais claro ao mais escuro. */
const MODE_LADDER = ["lydian", "ionian", "mixolydian", "dorian", "aeolian", "phrygian", "locrian"].flatMap((md) => run(C, md as never, 7, 10, 0.5, { down: false, startOnRoot: true }).slice(0, 8));

/** Escala numa corda só. */
const linear = (rootPc: number, scale: string, s: number, from: number, to: number, d = 0.5) => run(rootPc, scale as never, from, to, d, { strings: [s] });

/** Modo sobre Dó: drone + desenho + nota característica destacada. */
function modeIntro(scale: string, name: string, color: string, from = 7, to = 10): Node[] {
  return [
    drone(C),
    box(C, scale as never, from, to, `Dó ${name}, casas ${from} a ${to}. ${color}`),
    tab(`Dó ${name} sobre o drone`, 70, run(C, scale as never, from, to, 0.5)),
  ];
}

export const MONTH_9: Lesson[] = [
  lesson(241, "3NPS: três notas por corda", ["Tocar a escala maior com 3 notas em cada corda", "Palhetada alternada sem pausas", "Comparar com o CAGED"], [
    B(undefined, 5, "Bem-vindo ao mês 9. O braço inteiro vai se conectar: três sistemas de escala e os sete modos.", box(C, "major", 7, 10)),
    B("Um padrão que se repete", 10,
      "No **3NPS** (*three notes per string*), cada corda tem exatamente **3 notas**. A palhetada fica regular (↓↑↓ ↑↓↑…), e a escala cobre **duas oitavas e meia** numa região só.",
      nps3Box(C, "major", 8, "Dó maior em 3NPS a partir da casa 8 (corda 6). Repare na abertura de 5 casas em algumas cordas."),
      warn("O 3NPS exige abrir a mão (até 5 casas). Aqueça antes e não force: use o dedo 4 nas aberturas grandes, sem girar o punho."),
    ),
    B("Padrão 1", 10, tab("Dó maior, 3NPS a partir da casa 8", 70, npsC(0)), tip("Com 3 notas por corda, a palhetada alternada estrita faz cada corda começar com a direção oposta da anterior. É bom para a mão direita.")),
    B("Qual escala?", 5, ear("scale", ["major", "minor", "pentaMajor"])),
  ]),

  lesson(242, "3NPS: os próximos padrões", ["Tocar os padrões 2 e 3", "Ver onde um termina e o outro começa", "Subir o braço pela escala"], [
    B(undefined, 5, tab("Padrão 1", 75, npsC(0))),
    B("Subindo", 8, "Cada padrão começa na **próxima nota da escala** na corda 6. Em Dó: casa 8 (C), 10 (D), 12 (E), e depois volta para baixo: casa 1 (F), 3 (G), 5 (A), 7 (B).", nps3Box(C, "major", 10, "Padrão 2, a partir do D (casa 10)."), nps3Box(C, "major", 12, "Padrão 3, a partir do E (casa 12).")),
    B("Padrões 2 e 3", 12, tab("Padrão 2", 70, npsC(1)), tab("Padrão 3", 70, npsC(2))),
    B("Qual escala?", 5, ear("scale", ["major", "minor", "pentaMajor"])),
  ]),

  lesson(243, "3NPS: os sete padrões", ["Conhecer os 7 padrões de Dó maior", "Tocar os padrões graves (casas 1 a 7)", "Ligar o braço inteiro"], [
    B(undefined, 5, tab("Padrão 3", 75, npsC(2))),
    B("O mapa completo", 10, nps3Box(C, "major", 1, "Padrão 4 (F), casa 1."), nps3Box(C, "major", 3, "Padrão 5 (G), casa 3."), nps3Box(C, "major", 5, "Padrão 6 (A), casa 5."), nps3Box(C, "major", 7, "Padrão 7 (B), casa 7."), theory("São **7 padrões** porque a escala tem 7 notas. Cada um começa num grau diferente. Isso já é um primeiro contato com os modos, mas cuidado: **padrão** não é **modo**. O modo depende da harmonia, não da casa onde você começa.")),
    B("Padrões 4 a 7", 10, tab("Padrão 4", 70, npsC(3)), tab("Padrão 5", 70, npsC(4)), tab("Padrão 6", 70, npsC(5)), tab("Padrão 7", 70, npsC(6))),
    B("Qual escala?", 5, ear("scale", ["major", "minor", "harmonicMinor"])),
  ]),

  lesson(244, "A escala em uma corda só", ["Tocar a escala horizontalmente", "Ver os intervalos como distâncias", "Sair das caixas"], [
    B(undefined, 5, tab("Padrão 6", 75, npsC(5))),
    B("Linear", 8,
      "Tocar numa corda só obriga a **ver as distâncias**: tom = 2 casas, semitom = 1. É o jeito mais claro de enxergar a forma de uma escala, e é como o sitar, o bandolim e muitos guitarristas de slide pensam.",
      box(C, "major", 0, 15, "Dó maior só na corda 2.", { strings: [2] }),
    ),
    B("Uma corda, duas cordas", 12, tab("Dó maior na corda 2", 70, linear(C, "major", 2, 1, 13)), tab("Dó maior na corda 3", 70, linear(C, "major", 3, 0, 17)), tip("Use slides para trocar de região: dedo 1 desliza para a próxima nota a cada duas ou três notas.")),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m", "3M"])),
  ]),

  lesson(245, "CAGED, 3NPS e linear juntos", ["Tocar a mesma escala de três jeitos", "Escolher o sistema conforme a música", "Trocar de sistema no meio"], [
    B(undefined, 5, tab("Corda 3", 75, linear(C, "major", 3, 0, 17))),
    B("Três mapas, um território", 8,
      list("**CAGED** (mês 4): ancorado nos acordes, ótimo para ver tônica, 3ª e 5ª.", "**3NPS:** palhetada regular, ótimo para velocidade e frases longas.", "**Linear:** liberdade horizontal, slides, som vocal."),
      "Nenhum é *o certo*. A meta é que os três virem um único mapa na cabeça.",
      box(C, "major", 7, 10, "Dó maior no CAGED (região da casa 8)."),
      nps3Box(C, "major", 8, "A mesma região em 3NPS."),
    ),
    B("Mesma frase, três caminhos", 12, tab("Sobe em 3NPS, desce linear (original)", 75, [...nps3(C, "major", 8, 0.5, { down: false, strings: 3 }), n(3, 12, 0.5), n(3, 10, 0.5), n(3, 9, 0.5), n(3, 7, 0.5), n(3, 5, 2)])),
    B("Qual escala?", 5, ear("scale", ["major", "minor", "pentaMajor", "blues"])),
  ]),

  lesson(246, "Duas oitavas a 100 BPM", ["Escala de 2 oitavas sem parar", "Subir o andamento com método", "Manter a palhetada relaxada"], [
    B(undefined, 5, tab("Padrão 1", 80, npsC(0))),
    B("Meta do mês", 5, "O desafio pede **escalas ligadas em todas as posições a 100 BPM** (colcheias). Hoje você mede onde está.", warn("Escada de andamento: 80 → 85 → 90 → 95 → 100. Só suba quando tocar **duas vezes limpo**.")),
    B("Escada de BPM", 15, tab("Padrão 1 a 100", 100, npsC(0)), tab("Padrão 4 a 100", 100, npsC(3)), tab("Padrão 6 a 100", 100, npsC(5))),
    B("Qual escala?", 5, ear("scale", ["major", "minor", "pentaMinor"])),
  ]),

  lesson(247, "Revisão da semana 36", ["3NPS: 7 padrões", "Escala linear", "Os três sistemas juntos"], [
    B("Aquecimento", 6, tab("Padrão 2", 90, npsC(1))),
    B("O que você já sabe", 4, list("3NPS: 3 notas por corda, 7 padrões", "Linear: uma corda, distâncias", "CAGED + 3NPS + linear = um mapa", "Escada de BPM")),
    B("Mini-desafio", 15, tab("Padrões 1 a 7 em sequência (colcheias)", 90, NPS_C.flatMap((_, i) => npsC(i).slice(0, 18))), checks("sem36", "Semana 36 concluída", "Toco os 7 padrões de Dó maior", "Dó maior em uma corda, ida e volta", "Pelo menos 3 padrões a 100 BPM")),
    B("Qual escala?", 5, ear("scale", ["major", "minor", "harmonicMinor", "melodicMinor"])),
  ]),

  lesson(248, "Tensões disponíveis: 9, 11 e 13", ["Entender o que é tensão", "Achar 9, 11 e 13 sobre o acorde", "Ouvir a cor das extensões"], [
    B(undefined, 5, tab("Padrão 4", 95, npsC(3))),
    B("Notas além da tétrade", 10,
      "Sobre um acorde, as notas da escala que **não** são 1, 3, 5 ou 7 são as **tensões**: a 2ª vira **9**, a 4ª vira **11**, a 6ª vira **13** (contadas na oitava de cima).",
      "**Regra prática:** uma nota **um tom acima** de uma nota do acorde é uma **tensão disponível**: soa bem segurada. Ex.: sobre Cmaj7, o **D** (9) fica um tom acima do C.",
      chords("Cmaj9", "Dm9", "G13", "C6/9"),
    ),
    B("Segurando tensões", 10, jam("Cmaj7 parado", "Dó", 70, "drone", ["Cmaj7@3", "Cmaj7@3"]), tab("9, #11 e 13 sobre Cmaj7", 60, [n(3, 7, 2), n(3, 5, 2), n(2, 7, 2), n(2, 8, 2), n(2, 10, 2), n(1, 7, 2)], { backing: ["Cmaj7"] }), "D (9) soa doce; A (13) soa aberto; F# (#11) soa *lídio*, moderno."),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "9", "6", "m7"])),
  ]),

  lesson(249, "Avoid notes: notas de passagem", ["Achar a nota que choca", "Usar a 4ª no maior só de passagem", "Ouvir a diferença"], [
    B(undefined, 5, jam("Cmaj7 parado", "Dó", 70, "drone", ["Cmaj7@3", "Cmaj7@3"])),
    B("Meio tom acima do acorde", 8,
      "Uma nota **meio tom acima** de uma nota do acorde tende a ser **avoid note**: segurada, ela choca. Use de **passagem**, resolvendo.",
      list("**Jônio (Cmaj7):** a 4ª (**F**) fica meio tom acima do E.", "**Mixolídio (G7):** a 4ª (**C**) fica meio tom acima do B.", "**Eólio (Am7):** a b6 (**F**) fica meio tom acima do E.", "**Dórico como iim7 (Dm7):** a 6ª (**B**) costuma ser evitada no contexto tonal."),
    ),
    B("Ouvindo o choque", 12, tab("F segurado × F de passagem sobre Cmaj7", 60, [n(2, 6, 4), r(2), n(2, 6, 0.5), n(2, 5, 1.5), r(4)], { backing: ["Cmaj7"] }), check("O F segurado soa como *erro*. O F que desce para E soa como *melodia*. Mesma nota, função diferente.")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(250, "Modos: a mesma tônica, outra escala", ["Entender modo como cor", "Comparar maior e menor sobre o mesmo drone", "Ligar modo à nota característica"], [
    B(undefined, 5, tab("Padrão 1", 95, npsC(0))),
    B("O jeito certo de aprender modos", 12,
      "Um **modo** é uma escala com uma **cor própria**, ouvida sobre **uma tônica fixa**. Por isso este mês você toca todos os modos **sobre um drone de Dó**: Dó jônio, Dó dórico, Dó frígio… Assim cada modo soa diferente de verdade.",
      warn("Tocar as notas de Dó maior começando no Ré **não** é *Ré dórico* se a música está em Dó. O ouvido continua ouvindo Dó. Modo depende da harmonia de fundo."),
      list("**Modos maiores** (3ª maior): jônio, lídio, mixolídio.", "**Modos menores** (3ª menor): dórico, eólio, frígio.", "**Diminuto:** lócrio."),
      theory("Cada modo tem uma **nota característica**: a que o diferencia do maior ou do menor mais parecido. É ela que você vai destacar no solo modal."),
    ),
    B("Maior × menor sobre o drone", 8, drone(C), tab("Dó maior (jônio)", 70, run(C, "ionian", 7, 10, 0.5)), tab("Dó menor (eólio)", 70, run(C, "aeolian", 7, 10, 0.5))),
    B("Qual escala?", 5, ear("scale", ["ionian", "aeolian"])),
  ]),

  lesson(251, "Jônio e lídio", ["Tocar Dó jônio e Dó lídio", "Ouvir o #4", "Usar o lídio sobre maj7"], [
    B(undefined, 5, ...modeIntro("ionian", "jônio", "A escala maior de sempre.")),
    B("Lídio: o maior com #4", 10,
      "O **lídio** é a escala maior com a **4ª aumentada** (#4): em Dó, **F#** no lugar de F. A avoid note do jônio some e o som fica *flutuante*, de trilha de filme espacial.",
      box(C, "lydian", 7, 10, "Dó lídio. O F# é a nota característica."),
      chords("D/C", "Cmaj7@3"),
    ),
    B("Lídio sobre o drone", 10, drone(C), tab("Dó lídio", 70, run(C, "lydian", 7, 10, 0.5)), jam("Vamp lídio: C – D/C", "Dó lídio", 80, "ballad", ["C", "D/C"]), tip("Pouse no F# e segure. Se soar bonito em vez de errado, você está ouvindo o lídio.")),
    B("Qual escala?", 5, ear("scale", ["ionian", "lydian"])),
  ]),

  lesson(252, "Mixolídio", ["Tocar Dó mixolídio", "Ouvir a b7 sobre o maior", "Usar sobre dominante e no baião"], [
    B(undefined, 5, jam("Vamp lídio", "Dó lídio", 80, "ballad", ["C", "D/C"])),
    B("O maior com b7", 10,
      "O **mixolídio** é a escala maior com a **7ª menor** (b7): em Dó, **Bb**. É a escala do acorde **7** (dominante) e o som do rock clássico, do blues maior e do **baião**.",
      box(C, "mixolydian", 7, 10, "Dó mixolídio. O Bb é a nota característica."),
      "Vamp mixolídio típico: **C – Bb** (I – bVII) ou **C7** parado.",
    ),
    B("Mixolídio", 10, drone(C), tab("Dó mixolídio", 70, run(C, "mixolydian", 7, 10, 0.5)), jam("Vamp mixolídio: C – Bb", "Dó mixolídio", 90, "rock", ["C@3", "Bb"]), jam("Baião em Dó mixolídio", "Dó mixolídio", 95, "baiao", ["C7@3", "C7@3", "Bb", "C7@3"])),
    B("Qual escala?", 5, ear("scale", ["ionian", "lydian", "mixolydian"])),
  ]),

  lesson(253, "Dórico", ["Tocar Dó dórico", "Ouvir a 6ª maior no menor", "Usar sobre m7 em vamp"], [
    B(undefined, 5, jam("Vamp mixolídio", "Dó mixolídio", 90, "rock", ["C@3", "Bb"])),
    B("O menor com 6ª maior", 10,
      "O **dórico** é a escala menor com a **6ª maior**: em Dó, **A** no lugar de Ab. Soa menor, mas *luminoso*, com groove. É o som do funk, do jazz modal e de muito rock latino.",
      box(C, "dorian", 7, 10, "Dó dórico. O A (6ª maior) é a nota característica."),
      "Vamp dórico: **Cm7 – F7** (i – IV7).",
    ),
    B("Dórico", 10, drone(C), tab("Dó dórico", 70, run(C, "dorian", 7, 10, 0.5)), jam("Vamp dórico: Cm7 – F7", "Dó dórico", 95, "funk", ["Cm7", "F7"])),
    B("Qual escala?", 5, ear("scale", ["aeolian", "dorian"])),
  ]),

  lesson(254, "Revisão da semana 37", ["Tensões e avoid notes", "Jônio, lídio, mixolídio, dórico", "Nota característica"], [
    B("Aquecimento", 6, drone(C), tab("Dó dórico", 80, run(C, "dorian", 7, 10, 0.5))),
    B("O que você já sabe", 4, list("Tensão = 1 tom acima de nota do acorde", "Avoid = meio tom acima", "Lídio #4 · Mixolídio b7 · Dórico 6", "Modos sobre a mesma tônica")),
    B("Mini-desafio", 15, jam("Vamp dórico", "Dó dórico", 95, "funk", ["Cm7", "F7"]), checks("sem37", "Semana 37 concluída", "Toco os 4 modos sobre o drone de Dó", "Destaco o F# no lídio, o Bb no mixolídio e o A no dórico", "Acerto jônio × lídio × mixolídio de ouvido 7 em 10")),
    B("Qual escala?", 5, ear("scale", ["ionian", "lydian", "mixolydian", "dorian"])),
  ]),

  lesson(255, "Eólio e frígio", ["Tocar Dó eólio e Dó frígio", "Ouvir a b2", "Comparar os três menores"], [
    B(undefined, 5, jam("Vamp dórico", "Dó dórico", 95, "funk", ["Cm7", "F7"])),
    B("Os menores escuros", 10,
      list("**Eólio** (menor natural): b3, b6, b7. Em Dó: **Ab** é a característica frente ao dórico.", "**Frígio:** eólio com **b2**. Em Dó: **Db**. Soa espanhol, árabe, metal."),
      box(C, "aeolian", 7, 10, "Dó eólio."),
      box(C, "phrygian", 7, 10, "Dó frígio. O Db (b2) é a nota característica."),
    ),
    B("Do claro ao escuro", 10, drone(C), tab("Dórico → eólio → frígio", 70, [...run(C, "dorian", 7, 10, 0.5, { down: false }), r(1), ...run(C, "aeolian", 7, 10, 0.5, { down: false }), r(1), ...run(C, "phrygian", 7, 10, 0.5, { down: false }), r(1)]), jam("Vamp frígio: Cm – Db", "Dó frígio", 80, "rock", ["Cm", "Db7"])),
    B("Qual escala?", 5, ear("scale", ["dorian", "aeolian", "phrygian"])),
  ]),

  lesson(256, "Lócrio", ["Tocar Dó lócrio", "Ouvir a b5", "Saber por que ele é raro como centro"], [
    B(undefined, 5, drone(C), tab("Dó frígio", 75, run(C, "phrygian", 7, 10, 0.5))),
    B("O modo instável", 8,
      "O **lócrio** é o frígio com **b5**: em Dó, **Gb**. A tríade da tônica é **diminuta** (C Eb Gb): não soa como repouso. Por isso raramente é centro de música inteira. Ele vive sobre o **m7(b5)**, como no ii do ii–V menor.",
      box(C, "locrian", 7, 10, "Dó lócrio. O Gb (b5) é a nota característica."),
    ),
    B("Lócrio onde ele mora", 12, drone(C), tab("Dó lócrio", 70, run(C, "locrian", 7, 10, 0.5)), changes(["Bm7b5", "E7", "Am6", "Am6"], 70), tip("Sobre o Bm7b5 do ii–V menor, a escala de **Si lócrio** são as notas de Lá menor natural. Você já tocou isso no mês 8 sem saber o nome.")),
    B("Qual escala?", 5, ear("scale", ["phrygian", "locrian", "aeolian"])),
  ]),

  lesson(257, "Os sete modos, do mais claro ao mais escuro", ["Tocar os 7 modos de Dó em ordem de brilho", "Ver que cada passo muda uma nota", "Memorizar a ordem"], [
    B(undefined, 5, drone(C), tab("Dó lócrio", 75, run(C, "locrian", 7, 10, 0.5))),
    B("Uma nota por vez", 10,
      "Ordem de brilho: **lídio → jônio → mixolídio → dórico → eólio → frígio → lócrio**. De um para o próximo, **uma única nota** desce meio tom.",
      list("Lídio → jônio: #4 vira 4", "Jônio → mixolídio: 7 vira b7", "Mixolídio → dórico: 3 vira b3", "Dórico → eólio: 6 vira b6", "Eólio → frígio: 2 vira b2", "Frígio → lócrio: 5 vira b5"),
    ),
    B("A escada dos modos", 10, drone(C), tab("Sete modos de Dó (uma oitava cada)", 80, MODE_LADDER)),
    B("Qual escala?", 5, ear("scale", ["lydian", "ionian", "mixolydian", "dorian", "aeolian", "phrygian"])),
  ]),

  lesson(258, "Tonal × modal", ["Entender música modal", "Tocar sobre um vamp de dois acordes", "Não resolver como no tonal"], [
    B(undefined, 5, drone(C), tab("Dó dórico", 80, run(C, "dorian", 7, 10, 0.5))),
    B("Parado é diferente de resolver", 8,
      "Na música **tonal**, os acordes caminham para a tônica (ii–V–I). Na **modal**, a harmonia **fica parada** num ou dois acordes (o *vamp*), e o interesse está na **cor do modo**.",
      "Vamp dórico clássico: **Dm7 – G7** repetido. Parece ii–V, mas o G7 **não resolve** em C: ele volta para Dm7. Aí o ouvido aceita o **Ré** como tônica, e a escala é **Ré dórico**.",
      box(D, "dorian", 5, 8, "Ré dórico, casas 5 a 8. Característica: B natural."),
    ),
    B("Vamp", 12, jam("Vamp: Dm7 – G7 (Ré dórico)", "Ré dórico", 90, "funk", ["Dm7@5", "G7@3"]), rec("m9-vamp", "Grave 8 compassos destacando o B.")),
    B("Qual escala?", 5, ear("scale", ["dorian", "aeolian", "mixolydian"])),
  ]),

  lesson(259, "Vamps mixolídio e lídio", ["Solar sobre I–bVII", "Solar sobre I–II (lídio)", "Destacar a nota característica"], [
    B(undefined, 5, jam("Vamp dórico", "Ré dórico", 90, "funk", ["Dm7@5", "G7@3"])),
    B("Mais dois vamps", 8,
      list("**Mixolídio:** **G – F** (I – bVII). Escala de **Sol mixolídio**. Característica: F.", "**Lídio:** **C – D/C**. Escala de **Dó lídio**. Característica: F#."),
      box(G, "mixolydian", 2, 5, "Sol mixolídio, casas 2 a 5."),
    ),
    B("Dois vamps", 12, jam("Vamp mixolídio: G – F", "Sol mixolídio", 100, "rock", ["G", "F"]), jam("Vamp lídio: C – D/C", "Dó lídio", 75, "ballad", ["C", "D/C"])),
    B("Qual escala?", 5, ear("scale", ["ionian", "lydian", "mixolydian"])),
  ]),

  lesson(260, "Frígio: flamenco e metal", ["Solar sobre E – F", "Usar o frígio dominante (3ª maior)", "Sentir a cadência andaluza"], [
    B(undefined, 5, jam("Vamp mixolídio", "Sol mixolídio", 100, "rock", ["G", "F"])),
    B("A b2 que pesa", 8,
      "O vamp **E – F** é o som do frígio: o F (b2) cai meio tom sobre o E. Com acorde de **E maior**, a escala vira **frígio dominante** (frígio com 3ª maior, G#), que você vai aprofundar no mês 10.",
      box(E, "phrygian", 0, 3, "Mi frígio na primeira posição: só notas naturais."),
      "A **cadência andaluza** do flamenco: **Am – G – F – E**, terminando no E maior.",
    ),
    B("Frígio", 12, jam("Vamp frígio: Em – F", "Mi frígio", 90, "rock", ["Em", "F"]), jam("Cadência andaluza", "Mi frígio", 100, "six8", ["Am", "G", "F", "E"]), tab("Frase frígia (original)", 90, [n(6, 0, 0.5), n(6, 1, 0.5), n(6, 0, 0.5), n(6, 3, 0.5), n(5, 0, 0.5), n(6, 3, 0.5), n(6, 1, 1), n(6, 0, 4)])),
    B("Qual escala?", 5, ear("scale", ["aeolian", "phrygian", "phrygianDominant"])),
  ]),

  lesson(261, "Revisão da semana 38", ["Eólio, frígio, lócrio", "A escada de brilho", "Vamps modais"], [
    B("Aquecimento", 6, drone(C), tab("Escada dos modos", 85, MODE_LADDER)),
    B("O que você já sabe", 4, list("Lídio → jônio → mixolídio → dórico → eólio → frígio → lócrio", "Uma nota muda de um para o próximo", "Modal = harmonia parada, cor em destaque", "Vamps: Dm7–G7 (dórico), G–F (mixolídio), C–D/C (lídio), Em–F (frígio)")),
    B("Mini-desafio", 15, jam("Vamp dórico", "Ré dórico", 95, "funk", ["Dm7@5", "G7@3"]), checks("sem38", "Semana 38 concluída", "Toco os 7 modos de Dó sobre o drone", "Digo a nota característica de cada um", "Solo de 8 compassos num vamp destacando a característica")),
    B("Qual escala?", 5, ear("scale", ["lydian", "ionian", "mixolydian", "dorian", "aeolian", "phrygian"])),
  ]),

  lesson(262, "Modos em outras tônicas", ["Achar Lá dórico, Mi mixolídio, Ré lídio", "Pensar: tônica + fórmula", "Não depender da escala-mãe"], [
    B(undefined, 5, jam("Vamp mixolídio", "Sol mixolídio", 100, "rock", ["G", "F"])),
    B("Fórmula, não decoreba", 8,
      "Para tocar **Lá dórico**, você não precisa pensar *Sol maior começando no Lá*. Pense: **Lá menor + 6ª maior (F#)**. Para **Mi mixolídio**: **Mi maior + b7 (D)**.",
      box(A, "dorian", 5, 8, "Lá dórico, casas 5 a 8: a pentatônica de Lá menor + B + F#."),
      box(E, "mixolydian", 7, 10, "Mi mixolídio, casa 7."),
    ),
    B("Três tônicas", 12, drone(A), tab("Lá dórico", 80, run(A, "dorian", 5, 8, 0.5)), jam("Lá dórico: Am7 – D7", "Lá dórico", 95, "funk", ["Am7@5", "D7@5"]), jam("Mi mixolídio: E – D", "Mi mixolídio", 100, "rock", ["E", "D"])),
    B("Qual escala?", 5, ear("scale", ["dorian", "mixolydian", "lydian", "aeolian"])),
  ]),

  lesson(263, "Solo modal: a característica nos tempos fortes", ["Planejar onde a nota característica cai", "Evitar soar como o modo vizinho", "Construir frases modais"], [
    B(undefined, 5, jam("Lá dórico", "Lá dórico", 95, "funk", ["Am7@5", "D7@5"])),
    B("A nota que conta a história", 8,
      "Se você tocar só a pentatônica sobre Am7–D7, o ouvido não sabe se é dórico ou eólio. A **nota característica** (F#) precisa aparecer, e de preferência num **tempo forte** ou numa **nota longa**.",
      tab("Frase dórica (original)", 90, [n(3, 7, 0.5), n(3, 9, 0.5), n(3, 11, 1), n(3, 9, 0.5), n(3, 7, 0.5), n(4, 9, 1), n(2, 7, 2), n(1, 7, 1), n(1, 5, 1), n(2, 7, 1), n(2, 5, 1), n(3, 7, 4)], { backing: ["Am7", "D7"] }),
    ),
    B("Solo modal", 12, jam("Lá dórico", "Lá dórico", 95, "funk", ["Am7@5", "D7@5"]), rec("m9-modal", "Grave e confira: o F# aparece em pelo menos 3 tempos fortes?")),
    B("Qual escala?", 5, ear("scale", ["dorian", "aeolian"])),
  ]),

  lesson(264, "Modos em 3NPS", ["Aplicar 3NPS a um modo", "Tocar Lá dórico em 2 oitavas", "Velocidade com cor"], [
    B(undefined, 5, tab("Frase dórica", 95, [n(3, 7, 0.5), n(3, 9, 0.5), n(3, 11, 1), n(3, 9, 0.5), n(3, 7, 0.5), n(4, 9, 1), n(2, 7, 2)])),
    B("O mesmo mapa, outra tônica", 8, "Os 7 padrões 3NPS valem para qualquer modo: o desenho é da escala-mãe, a **tônica** é que muda. Lá dórico em 3NPS a partir da casa 5:", nps3Box(A, "dorian", 5, "Lá dórico, 3NPS, casa 5.")),
    B("Duas oitavas", 12, tab("Lá dórico em 3NPS", 90, nps3(A, "dorian", 5)), tab("Lá dórico a 100", 100, nps3(A, "dorian", 5)), jam("Base", "Lá dórico", 100, "funk", ["Am7@5", "D7@5"])),
    B("Qual escala?", 5, ear("scale", ["dorian", "aeolian", "mixolydian"])),
  ]),

  lesson(265, "Peça do mês: groove dórico", ["Tocar riff, base e solo modal", "Usar 3NPS e linear no solo", "Gravar"], [
    B(undefined, 5, tab("Lá dórico em 3NPS", 95, nps3(A, "dorian", 5))),
    B("Roteiro", 5, ol("**Riff:** semicolcheias em Am7 com abafados (funk do mês 4).", "**Solo:** 16 compassos em Lá dórico, destacando o F#.", "**Final:** riff e Am7 segurado.")),
    B("A peça", 15, tab("Riff (original)", 95, [n(5, 0, 0.25), n(5, 0, 0.25), { s: 5, f: 0, d: 0.25, t: "x" }, n(4, 7, 0.25), n(4, 5, 0.5), n(5, 7, 0.5), n(5, 0, 0.25), { s: 5, f: 0, d: 0.25, t: "x" }, n(4, 4, 0.25), n(4, 5, 0.25), n(4, 7, 1)]), jam("Groove dórico", "Lá dórico", 95, "funk", ["Am7@5", "D7@5", "Am7@5", "D7@5"]), rec("m9-peca")),
    B("Qual escala?", 5, ear("scale", ["dorian", "mixolydian", "phrygian", "lydian"])),
  ]),

  lesson(266, "Escalas ligadas: subindo o braço", ["Ligar os 7 padrões numa escala só", "Trocar de padrão sem parar", "Chegar a 100 BPM"], [
    B(undefined, 5, tab("Padrão 1", 95, npsC(0))),
    B("Escala diagonal", 8, "Uma forma de ligar posições: subir **duas cordas** num padrão, deslizar para o próximo, e continuar. Assim você atravessa o braço numa diagonal, do grave ao agudo.", tab("Diagonal em Dó maior (original)", 80, [...nps3(C, "major", 3, 0.5, { down: false, strings: 2 }), ...nps3(C, "major", 7, 0.5, { down: false }).slice(4)])),
    B("Todas as posições", 12, tab("Os 7 padrões a 100 (ida e volta de cada)", 100, NPS_C.flatMap((_, i) => npsC(i)))),
    B("Qual escala?", 5, ear("scale", ["major", "lydian", "mixolydian"])),
  ]),

  lesson(267, "Treino do desafio: escalas", ["Medir os 7 padrões a 100", "Achar o padrão fraco", "Treinar a ligação"], [
    B(undefined, 5, tab("Padrão 4", 95, npsC(3))),
    B("O que o desafio pede", 5, list("**Escalas:** os padrões ligados em todas as posições a **100 BPM** (colcheias).", "**Solo modal:** 16 compassos sobre uma base estática, com a nota característica aparecendo.")),
    B("Treino", 15, tab("Os 7 padrões a 100", 100, NPS_C.flatMap((_, i) => npsC(i))), check("Marque qual padrão travou. Toque só ele 5 vezes a 90 e depois volte à sequência.")),
    B("Qual escala?", 5, ear("scale", ["major", "dorian", "mixolydian", "aeolian"])),
  ]),

  lesson(268, "Treino do desafio: solo modal", ["Escolher o modo do desafio", "Planejar a característica", "Gravar 16 compassos"], [
    B(undefined, 5, jam("Lá dórico", "Lá dórico", 95, "funk", ["Am7@5", "D7@5"])),
    B("Escolha o seu modo", 5, list("**Dórico:** Am7 – D7 (Lá dórico). Característica: F#.", "**Mixolídio:** G – F (Sol mixolídio). Característica: F.", "**Lídio:** C – D/C (Dó lídio). Característica: F#.", "**Frígio:** Em – F (Mi frígio). Característica: F.")),
    B("Treino", 15, jam("Dórico", "Lá dórico", 95, "funk", ["Am7@5", "D7@5"]), jam("Mixolídio", "Sol mixolídio", 100, "rock", ["G", "F"]), jam("Lídio", "Dó lídio", 80, "ballad", ["C", "D/C"]), jam("Frígio", "Mi frígio", 90, "rock", ["Em", "F"]), rec("m9-treino")),
    B("Qual escala?", 5, ear("scale", ["dorian", "mixolydian", "lydian", "phrygian"])),
  ]),

  lesson(269, "Ensaio geral do mês 9", ["Simular o desafio", "Escalas + solo modal", "Saber se está pronto"], [
    B(undefined, 5, tab("Padrão 1", 100, npsC(0))),
    B("Simulado", 5, ol("Os 7 padrões a 100, sem parar entre eles.", "16 compassos de solo modal no modo escolhido.", "Grave os dois.")),
    B("Faça", 15, tab("Escalas", 100, NPS_C.flatMap((_, i) => npsC(i))), jam("Solo modal", "Lá dórico", 95, "funk", ["Am7@5", "D7@5"]), rec("m9-simulado"), checks("ensaio9", "Estou pronto?", "7 padrões a 100 sem parar", "Nota característica em tempos fortes", "Não soou como o modo vizinho")),
    B("Qual escala?", 5, ear("scale", ["lydian", "ionian", "mixolydian", "dorian", "aeolian", "phrygian"])),
  ]),

  lesson(270, "Desafio do mês 9", ["Escalas em todas as posições a 100 BPM", "Solo modal sobre base estática", "Nota característica presente"], [
    B("Aquecimento", 5, drone(C), tab("Escada dos modos", 85, MODE_LADDER)),
    B("As regras", 3, list("**Escalas:** os 7 padrões 3NPS de Dó maior a **100 BPM**, sem parar.", "**Solo:** 16 compassos sobre o vamp que você escolheu, com a nota característica aparecendo em tempos fortes.", "Grave os dois.")),
    B("Desafio", 15, tab("Escalas", 100, NPS_C.flatMap((_, i) => npsC(i))), jam("Solo modal", "Lá dórico", 95, "funk", ["Am7@5", "D7@5"]), rec("m9-desafio"), bpmlog(9, 100)),
    B("O que vem", 7, ear("scale", ["harmonicMinor", "melodicMinor", "phrygianDominant", "altered"]), "No **mês 10**, as **cores alteradas**: modos da menor harmônica e melódica, **frígio dominante**, **escala alterada**, voicings **7alt** e **m7(b5)**, arpejos de **2 oitavas** e **triad ladders**."),
  ]),
];

