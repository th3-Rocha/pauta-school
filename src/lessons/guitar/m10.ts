// Mês 10 · dias 271 a 300 · Cores alteradas
import type { Lesson, TabNote } from "../types";
import { arp1, arpBox, B, box, bpmlog, changes, check, checks, chords, drone, ear, jam, lesson, list, m, n, ol, r, rec, run, tab, theory, tip } from "./lib";

const E = 4;
const G = 7;
const A = 9;
const AB = 8;

const arp2 = (sym: string, s: number, f: number, d = 0.5) => arp1(sym, s, f, d, { octaves: 2 });

/** Tríades diatônicas de Dó subindo nas cordas 3-2-1 (triad ladder). */
const LADDER_321: [number, number, number][] = [[5, 5, 3], [7, 6, 5], [9, 8, 7], [10, 10, 8], [12, 12, 10], [14, 13, 12], [16, 15, 13], [17, 17, 15]];
const ladder = (frets: [number, number, number][], strings: [number, number, number], d = 1): TabNote[] => frets.map(([a, b2, c3]) => m([[strings[0], a], [strings[1], b2], [strings[2], c3]], d));
/** Mesmo, nas cordas 4-3-2. */
const LADDER_432: [number, number, number][] = [[10, 9, 8], [12, 10, 10], [14, 12, 12], [15, 14, 13], [5, 4, 3], [7, 5, 5], [9, 7, 6], [10, 9, 8]];

/** Permutações de um arpejo de Cmaj7 (casa 3, corda 5). */
const CM7 = [n(5, 3, 0.5), n(4, 2, 0.5), n(4, 5, 0.5), n(3, 4, 0.5)];
const perm = (order: number[]) => order.map((i) => CM7[i]);

/** Frase frígio dominante sobre E7 resolvendo em Am (original). */
const PD_LICK = [n(2, 6, 0.5), n(2, 5, 0.5), n(3, 7, 0.5), n(3, 5, 0.5), n(3, 4, 0.5), n(4, 7, 0.5), n(4, 6, 0.5), n(4, 7, 0.5), n(2, 5, 2), r(2)];
/** Frase alterada sobre G7 resolvendo em Cmaj7 (original). */
const ALT_LICK = [n(2, 4, 0.5), n(2, 6, 0.5), n(1, 4, 0.5), n(2, 6, 0.5), n(2, 4, 0.5), n(3, 4, 0.5), n(3, 3, 0.5), n(4, 5, 0.5), n(3, 4, 2), n(2, 5, 2)];
const ALT_LICK_2 = [n(1, 4, 0.5), n(1, 1, 0.5), n(2, 4, 0.5), n(2, 2, 0.5), n(3, 4, 0.5), n(3, 1, 0.5), n(4, 3, 0.5), n(3, 1, 0.5), n(3, 0, 2), r(2)];

const IIVI_MAJ = ["Dm7@5", "G7alt", "Cmaj7@3", "Cmaj7@3"];
const IIVI_MIN = ["Bm7b5", "E7b9", "Am6", "Am6"];

export const MONTH_10: Lesson[] = [
  lesson(271, "Frígio dominante: o 5º modo da menor harmônica", ["Tocar Mi frígio dominante", "Ouvir o som espanhol e árabe", "Usar sobre E7 em Lá menor"], [
    B(undefined, 5, "Bem-vindo ao mês 10: as cores mais tensas da harmonia.", tab("Lá menor harmônica", 75, run(A, "harmonicMinor", 4, 8, 0.5))),
    B("A menor harmônica vista do Mi", 10,
      "Toque as notas de **Lá menor harmônica** a partir do **Mi** e você tem o **frígio dominante**: 1 b2 3 4 5 b6 b7. É frígio com **3ª maior**. É o modo do flamenco, da música árabe, do *metal neoclássico* e de muito forró.",
      box(E, "phrygianDominant", 0, 4, "Mi frígio dominante na primeira posição. Notas características: F (b2) e G# (3)."),
      theory("Sobre o **E7** de Lá menor, o frígio dominante tem as tensões **b9 (F)** e **b13 (C)**: as duas resolvem meio tom para notas do Am (E e A)."),
    ),
    B("Sobre o drone", 10, drone(E), tab("Mi frígio dominante", 75, run(E, "phrygianDominant", 0, 4, 0.5)), jam("E7 parado (frígio dominante)", "Mi frígio dominante", 90, "six8", ["E", "F", "E", "E"])),
    B("Qual escala?", 5, ear("scale", ["phrygian", "phrygianDominant"])),
  ]),

  lesson(272, "Frígio dominante resolvendo", ["Tocar frígio dominante no E7", "Resolver em Am", "Mirar b9 → 5 e 3 → 1"], [
    B(undefined, 5, tab("Mi frígio dominante", 80, run(E, "phrygianDominant", 0, 4, 0.5))),
    B("Tensão e chegada", 8,
      "A beleza do frígio dominante está na **resolução**: o **F** (b9 do E7) desce para **E** (5ª do Am); o **G#** (3ª do E7) sobe para **A** (tônica).",
      tab("Frase frígio dominante → Am (original)", 75, PD_LICK, { backing: ["E7", "Am"] }),
      box(A, "harmonicMinor", 4, 8, "Na região da casa 5: mesmas notas (Lá menor harmônica), pensadas a partir do Mi."),
    ),
    B("E7 → Am", 12, jam("i – V7", "Lá menor", 80, "bossa", ["Am6", "Am6", "E7b9", "E7b9"]), rec("m10-pd")),
    B("Qual escala?", 5, ear("scale", ["aeolian", "harmonicMinor", "phrygianDominant"])),
  ]),

  lesson(273, "Modos da menor melódica", ["Conhecer lídio b7, lócrio #2 e alterada", "Ver de onde vêm", "Saber onde usar cada um"], [
    B(undefined, 5, tab("Frase frígio dominante", 80, PD_LICK, { backing: ["E7", "Am"] })),
    B("Uma escala, três ferramentas", 12,
      "A **menor melódica** (1 2 b3 4 5 6 7) gera modos muito usados no jazz:",
      list("**4º modo · lídio b7** (1 2 3 #4 5 6 b7): dominante que **não resolve** por quinta, subV7, acordes 7(#11).", "**6º modo · lócrio #2** (1 2 b3 4 b5 b6 b7): o **m7(b5)**, com a 9ª natural (mais doce que o lócrio).", "**7º modo · alterada** (1 b9 #9 3 #11 b13 b7): o dominante **alterado** que resolve no I."),
      box(G, "lydianDominant", 2, 6, "Sol lídio b7 (de Ré menor melódica)."),
      box(G, "altered", 2, 6, "Sol alterada (de Lá bemol menor melódica)."),
    ),
    B("Ouvindo os três", 8, drone(G), tab("Sol lídio b7", 75, run(G, "lydianDominant", 2, 6, 0.5)), tab("Sol alterada", 75, run(G, "altered", 2, 6, 0.5))),
    B("Qual escala?", 5, ear("scale", ["mixolydian", "lydianDominant", "altered"])),
  ]),

  lesson(274, "A escala alterada", ["Tocar Sol alterada sobre G7", "Ouvir b9, #9, #11 e b13", "Resolver no Cmaj7"], [
    B(undefined, 5, drone(G), tab("Sol alterada", 75, run(G, "altered", 2, 6, 0.5))),
    B("Todas as tensões alteradas", 10,
      "A **escala alterada** mantém do dominante só o essencial: **1, 3 e b7**. Todo o resto é alterado: **b9, #9, #11 (b5), b13 (#5)**. Sobre **G7**: G **Ab** **A#** B **C#** **D#** F.",
      "Por que funciona? Porque cada nota alterada está a **meio tom** de uma nota do Cmaj7: Ab → G, A# → B, C# → C ou D, D# → E. A tensão é máxima, e a resolução, inevitável.",
      chords("G7alt", "G7#9", "G7b9", "Cmaj7@3"),
    ),
    B("G7alt → Cmaj7", 10, tab("Frase alterada → Cmaj7 (original)", 70, ALT_LICK, { backing: ["G7alt", "Cmaj7"] }), changes(["G7alt", "Cmaj7@3", "G7#9", "Cmaj7@3"], 65)),
    B("Qual escala?", 5, ear("scale", ["mixolydian", "altered"])),
  ]),

  lesson(275, "Alterada = menor melódica meio tom acima", ["Achar a alterada pelo atalho", "Tocar Lá bemol menor melódica sobre G7", "Usar desenhos que você já sabe"], [
    B(undefined, 5, tab("Frase alterada", 75, ALT_LICK, { backing: ["G7alt", "Cmaj7"] })),
    B("O atalho", 8,
      "Para achar a alterada de um dominante, suba **meio tom** e toque a **menor melódica** dali. **G7alt → Lá bemol menor melódica**. **E7alt → Fá menor melódica**.",
      box(AB, "melodicMinor", 3, 7, "Lá bemol menor melódica, casas 3 a 7 = Sol alterada."),
      tip("Pensar *menor melódica* é mais fácil do que pensar em 4 notas alteradas soltas. O desenho é um só."),
    ),
    B("Mesmas notas", 12, tab("Lá bemol menor melódica (sobre G7alt)", 75, run(AB, "melodicMinor", 3, 7, 0.5), { backing: ["G7alt"] }), tab("Segunda frase alterada (original)", 70, ALT_LICK_2, { backing: ["G7alt", "Cmaj7"] })),
    B("Qual escala?", 5, ear("scale", ["melodicMinor", "altered", "harmonicMinor"])),
  ]),

  lesson(276, "Lídio b7: o dominante que flutua", ["Usar lídio b7 sobre 7 que não resolve", "Usar no subV7", "Ouvir o #11"], [
    B(undefined, 5, tab("Lá bemol menor melódica", 80, run(AB, "melodicMinor", 3, 7, 0.5))),
    B("Dominante sem pressa", 8,
      "Quando o acorde 7 **não resolve** uma quinta abaixo (blues, vamp, subV7, IV7), o **lídio b7** é a escolha: tem a 3ª e a b7 do dominante, mas o **#11** no lugar da 4ª (que seria avoid).",
      list("**Db7** no lugar do G7 (subV7) → Db lídio b7.", "**D7** como II7 (*D7/C* em bossa) → D lídio b7.", "**F7** num blues em Dó → F lídio b7."),
    ),
    B("Lídio b7 em contexto", 12, jam("Cmaj7 – D7 (II7 lídio)", "Dó", 80, "bossa", ["Cmaj7@3", "Cmaj7@3", "D7@5", "D7@5"]), tab("D lídio b7", 75, run(2, "lydianDominant", 4, 8, 0.5), { backing: ["D7"] })),
    B("Qual escala?", 5, ear("scale", ["mixolydian", "lydianDominant", "lydian"])),
  ]),

  lesson(277, "Revisão da semana 40", ["Frígio dominante", "Modos da menor melódica", "Alterada e lídio b7"], [
    B("Aquecimento", 6, drone(G), tab("Sol alterada", 80, run(G, "altered", 2, 6, 0.5))),
    B("O que você já sabe", 4, list("Frígio dominante: 5º modo da harmônica, V7 do menor", "Alterada: 7º modo da melódica, V7 que resolve no I", "Atalho: alterada = melódica meio tom acima", "Lídio b7: dominante que não resolve")),
    B("Mini-desafio", 15, jam("i – V7", "Lá menor", 85, "bossa", ["Am6", "Am6", "E7b9", "E7b9"]), jam("ii – V7alt – I", "Dó", 85, "bossa", IIVI_MAJ), checks("sem40", "Semana 40 concluída", "Frase frígio dominante resolvendo em Am", "Frase alterada resolvendo em Cmaj7", "Digo a alterada de qualquer dominante pelo atalho")),
    B("Qual escala?", 5, ear("scale", ["phrygianDominant", "altered", "lydianDominant", "mixolydian"])),
  ]),

  lesson(278, "Voicings alterados", ["Montar 7(b9), 7(#9), 7(b13) e 7alt", "Escolher pela nota de cima", "Resolver com condução"], [
    B(undefined, 5, jam("ii – V7alt – I", "Dó", 85, "bossa", IIVI_MAJ)),
    B("Acordes com tensão", 10,
      list("**7(b9):** dramático, clássico. Muito usado no V7 do menor.", "**7(#9):** o *acorde Hendrix*: maior e menor ao mesmo tempo.", "**7(b13):** sombrio, comum antes de um menor.", "**7alt:** termo geral: qualquer combinação de b9, #9, #11, b13."),
      chords("G7b9", "G7#9", "G7alt", "E7b9", "E7#9", "A7b9"),
    ),
    B("Resolvendo", 10, changes(["Dm7@5", "G7b9", "Cmaj7@3", "Cmaj7@3"], 65), changes(["Bm7b5", "E7b9", "Am6", "Am6"], 65), changes(["Dm7@5", "G7#9", "Cmaj7@3", "A7b9"], 65)),
    B("Qual tétrade?", 5, ear("quality", ["7", "7alt", "m7b5", "maj7"])),
  ]),

  lesson(279, "7(#9) no rock e no funk", ["Usar o acorde Hendrix", "Riff com 7(#9)", "Pentatônica menor sobre ele"], [
    B(undefined, 5, changes(["Dm7@5", "G7#9", "Cmaj7@3", "A7b9"], 70)),
    B("Maior e menor juntos", 8,
      "O **7(#9)** tem a 3ª maior (G# em E7#9) e a **#9** que soa como 3ª menor (G). Por isso a **pentatônica menor** funciona perfeitamente por cima: o choque já está no acorde.",
      chords("E7#9", "D7#9"),
    ),
    B("Riff e solo", 12, tab("Riff em E7#9 (original)", 90, [n(6, 0, 0.5), n(6, 0, 0.5), m([[5, 7], [4, 6], [3, 7], [2, 8]], 0.5), n(6, 0, 0.5), r(0.5), m([[5, 7], [4, 6], [3, 7], [2, 8]], 1), n(6, 3, 0.25), n(6, 2, 0.25), n(6, 0, 0.5), m([[5, 7], [4, 6], [3, 7], [2, 8]], 3.5)]), jam("Funk em E7#9", "Mi", 95, "funk", ["E7#9", "E7#9", "E7#9", "A7"])),
    B("Qual tétrade?", 5, ear("quality", ["7", "7alt", "m7"])),
  ]),

  lesson(280, "m7(b5) e lócrio #2", ["Montar m7(b5) em várias regiões", "Usar a 9ª natural", "Tocar o iiø do menor com cor"], [
    B(undefined, 5, jam("Funk em E7#9", "Mi", 95, "funk", ["E7#9", "E7#9", "E7#9", "A7"])),
    B("O meio-diminuto bem tocado", 8,
      "O **m7(b5)** aparece como **ii do menor**. Sobre ele, o **lócrio #2** (6º modo da menor melódica) troca a b9 dura do lócrio pela **9ª natural**: mais macio.",
      chords("Bm7b5", "Em7b5", "F#m7b5", "Am7b5"),
      box(11, "locrianNat2", 1, 5, "Si lócrio #2 (de Ré menor melódica). Característica: C# (9ª natural)."),
    ),
    B("iiø com cor", 12, changes(["Bm7b5", "E7b9", "Am6", "Am6"], 65), tab("Si lócrio #2", 70, run(11, "locrianNat2", 1, 5, 0.5), { backing: ["Bm7b5"] })),
    B("Qual tétrade?", 5, ear("quality", ["m7", "m7b5", "dim7"])),
  ]),

  lesson(281, "ii–V–i menor com todas as cores", ["Tocar Bm7(b5) – E7(b9) – Am6", "Uma escala por acorde", "Solar no ii–V–i menor"], [
    B(undefined, 5, changes(IIVI_MIN, 70)),
    B("Três escalas, uma frase", 8,
      list("**Bm7(b5):** Si lócrio #2 (ou lócrio).", "**E7(b9):** Mi frígio dominante (ou alterada).", "**Am6:** Lá menor melódica (ou dórico)."),
      "Na prática, o frígio dominante e a menor harmônica cobrem os dois primeiros acordes juntos. A melódica entra no **i**.",
    ),
    B("Solo", 12, jam("ii–V–i em Lá menor", "Lá menor", 110, "bossa", IIVI_MIN), tab("Exemplo (original)", 80, [n(2, 3, 0.5), n(2, 6, 0.5), n(3, 4, 0.5), n(3, 7, 0.5), n(4, 7, 1), n(3, 4, 1), n(2, 6, 0.5), n(2, 5, 0.5), n(3, 7, 0.5), n(3, 5, 0.5), n(3, 4, 1), n(4, 6, 1), n(4, 7, 2), n(3, 4, 2), n(2, 5, 4)], { backing: ["Bm7b5", "E7b9", "Am6", "Am6"] }), rec("m10-iiv-menor")),
    B("Qual escala?", 5, ear("scale", ["locrian", "phrygianDominant", "melodicMinor"])),
  ]),

  lesson(282, "Escala diminuta sobre 7(b9)", ["Tocar a escala semitom-tom", "Usar sobre dominante b9", "Aproveitar a simetria"], [
    B(undefined, 5, jam("ii–V–i menor", "Lá menor", 110, "bossa", IIVI_MIN)),
    B("Simétrica", 8,
      "A **diminuta semitom-tom** alterna meio tom e tom: G Ab Bb B C# D E F. Sobre **G7(b9)** ela dá b9, #9, 3, #11, 5, 13, b7: brilhante e tensa ao mesmo tempo.",
      box(G, "dimHalfWhole", 2, 6, "Sol diminuta semitom-tom."),
      theory("Como o °7, ela se repete a cada **3 casas**: G, Bb, Db e E diminuta são a mesma escala."),
    ),
    B("Diminuta no V7", 12, tab("Sol diminuta (semitom-tom)", 70, run(G, "dimHalfWhole", 2, 6, 0.5)), jam("ii – V7(b9) – I", "Dó", 85, "jazz", ["Dm7@5", "G7b9", "Cmaj7@3", "Cmaj7@3"])),
    B("Qual escala?", 5, ear("scale", ["dimHalfWhole", "altered", "mixolydian"])),
  ]),

  lesson(283, "Tons inteiros sobre 7(#5)", ["Tocar a escala de tons inteiros", "Usar sobre o dominante aumentado", "Ouvir a sensação de sonho"], [
    B(undefined, 5, tab("Sol diminuta", 75, run(G, "dimHalfWhole", 2, 6, 0.5))),
    B("Seis notas iguais", 8,
      "A **escala de tons inteiros** só tem tons: G A B C# D# F. Sem semitons, não há tônica clara: soa como sonho, como *flashback* de filme. Sobre **G7(#5)** ela dá 9, 3, #11, #5, b7.",
      box(G, "wholeTone", 2, 6, "Sol tons inteiros."),
      tip("Só existem **duas** escalas de tons inteiros diferentes: a de C e a de C#. Todas as outras são uma delas."),
    ),
    B("Sonho e resolução", 12, tab("Sol tons inteiros", 70, run(G, "wholeTone", 2, 6, 0.5)), jam("G7(#5) → C", "Dó", 75, "ballad", ["Cmaj7@3", "G7#5", "Cmaj7@3", "G7#5"])),
    B("Qual escala?", 5, ear("scale", ["wholeTone", "dimHalfWhole", "altered"])),
  ]),

  lesson(284, "Revisão da semana 41", ["Voicings alterados", "ii–V–i menor com cores", "Diminuta e tons inteiros"], [
    B("Aquecimento", 6, changes(IIVI_MIN, 75)),
    B("O que você já sabe", 4, list("7(b9), 7(#9), 7(b13), 7alt", "m7(b5) + lócrio #2", "Diminuta semitom-tom no 7(b9)", "Tons inteiros no 7(#5)")),
    B("Mini-desafio", 15, jam("ii–V–i menor", "Lá menor", 110, "bossa", IIVI_MIN), checks("sem41", "Semana 41 concluída", "Monto G7b9, G7#9 e G7alt", "Solo de 2 voltas no ii–V–i menor", "Reconheço diminuta e tons inteiros de ouvido")),
    B("Qual escala?", 5, ear("scale", ["altered", "dimHalfWhole", "wholeTone", "phrygianDominant"])),
  ]),

  lesson(285, "Arpejos de 2 oitavas: maj7", ["Arpejar maj7 em duas oitavas", "Usar a mão inteira na região", "Subir sem trocar de posição"], [
    B(undefined, 5, tab("Sol tons inteiros", 80, run(G, "wholeTone", 2, 6, 0.5))),
    B("Do grave ao agudo", 8,
      "Um arpejo de **2 oitavas** cobre quase todas as cordas. Comece pela tônica na corda 6 e suba sem sair da região (às vezes com uma pequena extensão de dedo).",
      arpBox("Gmaj7", 2, 8, "Gmaj7 em duas oitavas a partir da casa 3."),
      arpBox("Cmaj7", 2, 8, "Cmaj7 a partir da corda 5, casa 3."),
    ),
    B("maj7 em 2 oitavas", 12, tab("Gmaj7, 2 oitavas", 70, arp2("Gmaj7", 6, 3)), tab("Cmaj7, 2 oitavas", 70, arp2("Cmaj7", 5, 3))),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "7", "m7"])),
  ]),

  lesson(286, "Arpejos de 2 oitavas: m7 e 7", ["Arpejar m7 e 7 em duas oitavas", "Comparar com o maj7", "Chegar a 80 BPM"], [
    B(undefined, 5, tab("Gmaj7, 2 oitavas", 75, arp2("Gmaj7", 6, 3))),
    B("Duas qualidades", 8, arpBox("Am7", 4, 10, "Am7 em 2 oitavas."), arpBox("G7", 2, 8, "G7 em 2 oitavas."), arpBox("Dm7", 4, 10, "Dm7 a partir da corda 5.")),
    B("m7 e 7", 12, tab("Am7, 2 oitavas", 75, arp2("Am7", 6, 5)), tab("G7, 2 oitavas", 75, arp2("G7", 6, 3)), tab("Dm7, 2 oitavas", 75, arp2("Dm7", 5, 5))),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "7", "m7"])),
  ]),

  lesson(287, "Arpejos de 2 oitavas: m7(b5) e °7", ["Arpejar os diminutos em duas oitavas", "Fechar o ii–V–I arpejado em 2 oitavas", "Ligar os arpejos"], [
    B(undefined, 5, tab("Am7, 2 oitavas", 80, arp2("Am7", 6, 5))),
    B("Os instáveis", 8, arpBox("Bm7b5", 1, 7, "Bm7(b5) a partir da corda 5."), arpBox("F#m7b5", 1, 7, "F#m7(b5) a partir da corda 6."), arpBox("G#dim7", 3, 9, "G#°7: a cada 3 casas, o mesmo desenho.")),
    B("Arpejos e ii–V–I", 12, tab("Bm7(b5), 2 oitavas", 70, arp2("Bm7b5", 5, 2)), tab("G#°7, 2 oitavas", 70, arp2("G#dim7", 6, 4)), tab("ii–V–I em 2 oitavas: Dm7 – G7 – Cmaj7", 75, [...arp2("Dm7", 5, 5), r(1), ...arp2("G7", 6, 3), r(1), ...arp2("Cmaj7", 5, 3), r(1)])),
    B("Qual tétrade?", 5, ear("quality", ["m7b5", "dim7", "m7"])),
  ]),

  lesson(288, "Triad ladders: tríades subindo o braço", ["Tocar as tríades da escala numa escada", "Ver o campo harmônico horizontal", "Usar como recurso de solo"], [
    B(undefined, 5, tab("ii–V–I em 2 oitavas", 80, [...arp2("Dm7", 5, 5), r(1), ...arp2("G7", 6, 3), r(1)])),
    B("Escada de tríades", 8,
      "Uma **triad ladder** sobe o campo harmônico **num mesmo grupo de cordas**: C, Dm, Em, F, G, Am, Bdim, C, cada um uma posição acima. Você enxerga a escala inteira *como acordes*.",
      tip("Toque as tríades arpejadas também (uma nota por vez). É um dos sons mais modernos de solo: frases que *desenham* acordes."),
    ),
    B("Escada nas cordas 3-2-1", 12, tab("Campo de Dó nas cordas 3-2-1 (fundamental)", 70, ladder(LADDER_321, [3, 2, 1])), tab("Arpejado", 80, LADDER_321.flatMap(([a, b2, c3]) => [n(3, a, 0.5), n(2, b2, 0.5), n(1, c3, 0.5), n(2, b2, 0.5)]))),
    B("Qual tríade?", 5, ear("quality", ["", "m", "dim"])),
  ]),

  lesson(289, "Triad ladders em outros grupos", ["Escada nas cordas 4-3-2", "Inversões na escada", "Misturar grupos"], [
    B(undefined, 5, tab("Escada 3-2-1", 75, ladder(LADDER_321, [3, 2, 1]))),
    B("Outro grupo", 8, "Nas cordas **4, 3 e 2**, o desenho muda por causa do par G–B. Comece em C com o baixo na corda 4 (casa 10) e suba; depois desça para a região da casa 5.", "Para variar, use a **mesma inversão** em toda a escada: todas em 1ª inversão, por exemplo. Soa como uma seção de metais."),
    B("Escada nas cordas 4-3-2", 12, tab("Campo de Dó nas cordas 4-3-2", 70, ladder(LADDER_432, [4, 3, 2])), jam("Base para as escadas", "Dó", 80, "pop", ["C", "Am", "F", "G"])),
    B("Qual tríade?", 5, ear("quality", ["", "m", "dim", "aug"])),
  ]),

  lesson(290, "Permutações de arpejo", ["Tocar o arpejo em ordens diferentes", "Sair do sobe-desce", "Criar frases com arpejos"], [
    B(undefined, 5, tab("Escada 4-3-2", 75, ladder(LADDER_432, [4, 3, 2]))),
    B("1-3-5-7 é só o começo", 8,
      "As 4 notas de um arpejo podem ser tocadas em **24 ordens**. Algumas das mais úteis: **1-3-5-7**, **3-5-7-1**, **7-5-3-1**, **1-5-3-7**, **5-3-7-1**. Mudar a ordem transforma exercício em frase.",
    ),
    B("Cinco permutações de Cmaj7", 12, tab("Permutações (cordas 5 a 3)", 70, [...perm([0, 1, 2, 3]), ...perm([1, 2, 3, 0]), ...perm([3, 2, 1, 0]), ...perm([0, 2, 1, 3]), ...perm([2, 1, 3, 0]), n(5, 3, 2)], { backing: ["Cmaj7"] }), jam("Cmaj7 parado", "Dó", 70, "bossa", ["Cmaj7@3", "Cmaj7@3"])),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(291, "Revisão da semana 42", ["Arpejos de 2 oitavas", "Triad ladders", "Permutações"], [
    B("Aquecimento", 6, tab("Gmaj7, 2 oitavas", 80, arp2("Gmaj7", 6, 3))),
    B("O que você já sabe", 4, list("maj7, m7, 7, m7(b5), °7 em 2 oitavas", "Campo harmônico em escada de tríades", "24 ordens para um arpejo")),
    B("Mini-desafio", 15, tab("ii–V–I em 2 oitavas", 80, [...arp2("Dm7", 5, 5), r(1), ...arp2("G7", 6, 3), r(1), ...arp2("Cmaj7", 5, 3), r(1)]), checks("sem42", "Semana 42 concluída", "Os 5 tipos de arpejo em 2 oitavas", "Escada de tríades nas cordas 3-2-1", "Uma frase feita só com permutações")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5", "dim7"])),
  ]),

  lesson(292, "Resolver a alterada no I", ["Usar alterada no V7 e resolver no maj7", "Escolher a nota de chegada", "Ouvir a resolução por semitom"], [
    B(undefined, 5, tab("Frase alterada", 80, ALT_LICK, { backing: ["G7alt", "Cmaj7"] })),
    B("Chegar perto", 8,
      "A resolução da alterada fica mais forte quando a **última nota alterada** está a **meio tom** da nota de chegada:",
      list("**Ab (b9)** → G (5 do C)", "**A# (#9)** → B (7 do Cmaj7)", "**D# (b13)** → E (3 do C)", "**C# (#11)** → C ou D"),
    ),
    B("Quatro chegadas", 12, tab("b13 → 3 (original)", 70, [n(3, 4, 0.5), n(3, 6, 0.5), n(2, 4, 0.5), n(2, 6, 0.5), n(1, 4, 0.5), n(1, 1, 0.5), n(2, 4, 1), n(2, 5, 4)], { backing: ["G7alt", "Cmaj7"] }), jam("ii – V7alt – I", "Dó", 85, "bossa", IIVI_MAJ), rec("m10-alt")),
    B("Qual escala?", 5, ear("scale", ["mixolydian", "altered", "dimHalfWhole"])),
  ]),

  lesson(293, "Resolver o frígio dominante no i", ["Usar frígio dominante e resolver no menor", "Mirar b9 → 5", "Frases em Lá menor"], [
    B(undefined, 5, tab("Frase frígio dominante", 80, PD_LICK, { backing: ["E7", "Am"] })),
    B("A volta para o menor", 8, "Sobre E7 → Am, a frase mais clássica desce pelo frígio dominante e cai no **E** ou no **C** do Am. Resolver na **3ª menor (C)** soa especialmente dramático.", tab("b9 → 5 e 3 → 1 (original)", 70, [n(1, 1, 1), n(1, 0, 1), n(2, 3, 0.5), n(2, 1, 0.5), n(3, 1, 1), n(2, 1, 2), n(3, 2, 2)], { backing: ["E7b9", "Am"] })),
    B("Resoluções", 12, jam("i – V7", "Lá menor", 85, "bossa", ["Am6", "Am6", "E7b9", "E7b9"]), rec("m10-pd2")),
    B("Qual escala?", 5, ear("scale", ["harmonicMinor", "phrygianDominant", "aeolian"])),
  ]),

  lesson(294, "Solo no ii–V–I maior com alterada", ["Solar no ii–V–I usando alterada no V", "Contrastar diatônico e alterado", "Resolver com clareza"], [
    B(undefined, 5, jam("ii – V7alt – I", "Dó", 85, "bossa", IIVI_MAJ)),
    B("Dentro, fora, dentro", 5, "Toque o **Dm7** com a escala de Dó (dentro), o **G7alt** com a alterada (fora) e volte para dentro no **Cmaj7**. O contraste é o que torna o som moderno."),
    B("Solo", 15, jam("ii – V7alt – I (swing)", "Dó", 100, "jazz", IIVI_MAJ), rec("m10-solo-maior", "Grave 4 voltas.")),
    B("Qual tétrade?", 5, ear("quality", ["m7", "7alt", "maj7"])),
  ]),

  lesson(295, "Solo no ii–V–i menor com frígio dominante", ["Solar no ii–V–i menor", "Usar menor harmônica e melódica", "Arpejos de 2 oitavas no meio"], [
    B(undefined, 5, jam("ii–V–i menor", "Lá menor", 110, "bossa", IIVI_MIN)),
    B("O menor completo", 5, list("**Bm7(b5):** arpejo de 2 oitavas ou lócrio #2.", "**E7(b9):** frígio dominante.", "**Am6:** Lá menor melódica, resolvendo em A ou C.")),
    B("Solo", 15, jam("ii–V–i menor", "Lá menor", 110, "bossa", IIVI_MIN), rec("m10-solo-menor")),
    B("Qual escala?", 5, ear("scale", ["locrianNat2", "phrygianDominant", "melodicMinor"])),
  ]),

  lesson(296, "Peça do mês: tema menor", ["Tocar um tema com V7alt", "Acompanhar com voicings alterados", "Improvisar"], [
    B(undefined, 5, changes(IIVI_MIN, 75)),
    B("O tema", 8, "Tema original em Lá menor, 8 compassos, com ii–V–i e um V7alt.", tab("Tema menor (original)", 85, [n(1, 5, 1.5), n(1, 3, 0.5), n(1, 2, 1), n(1, 0, 1), n(2, 1, 2), n(1, 1, 1), n(1, 0, 1), n(2, 3, 2), n(2, 1, 2), n(2, 5, 4), n(2, 5, 1.5), n(2, 3, 0.5), n(2, 1, 1), n(3, 2, 1), n(2, 1, 2), n(1, 1, 1), n(1, 0, 1), n(2, 3, 2), n(1, 1, 2), n(1, 0, 4)], { backing: ["Am6", "Dm7", "Bm7b5", "E7b9", "Am6", "F", "Bm7b5 E7alt", "Am6"] })),
    B("Tema e solo", 12, jam("Peça do mês 10", "Lá menor", 100, "bossa", ["Am6", "Dm7@5", "Bm7b5", "E7b9", "Am6", "Fmaj7@1", "Bm7b5 E7alt", "Am6"]), rec("m10-peca")),
    B("Qual tétrade?", 5, ear("quality", ["m6", "m7b5", "7alt", "maj7"])),
  ]),

  lesson(297, "Treino do desafio: arpejos", ["Arpejos de 2 oitavas a 90", "Encadear os cinco tipos", "Achar o fraco"], [
    B(undefined, 5, tab("Gmaj7", 85, arp2("Gmaj7", 6, 3))),
    B("O que o desafio pede", 5, list("**Arpejos de 2 oitavas** (maj7, m7, 7, m7(b5)) a **90 BPM**.", "**Resolver** a alterada no I e o frígio dominante no i, sobre V7.")),
    B("Arpejos", 15, tab("Gmaj7 – Am7 – G7 – Bm7(b5) a 90", 90, [...arp2("Gmaj7", 6, 3), r(1), ...arp2("Am7", 6, 5), r(1), ...arp2("G7", 6, 3), r(1), ...arp2("Bm7b5", 5, 2), r(1)]), check("Marque o arpejo mais lento e toque só ele por 2 minutos.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(298, "Treino do desafio: resoluções", ["Resolver alterada e frígio dominante", "Gravar as duas", "Conferir as notas de chegada"], [
    B(undefined, 5, tab("Frase alterada", 85, ALT_LICK, { backing: ["G7alt", "Cmaj7"] })),
    B("Duas resoluções", 5, ol("**Maior:** Dm7 – G7alt – Cmaj7. Alterada no G7, chegada no tempo 1 do Cmaj7.", "**Menor:** Bm7(b5) – E7(b9) – Am6. Frígio dominante no E7, chegada no tempo 1 do Am6.")),
    B("Treino", 15, jam("Maior", "Dó", 90, "bossa", IIVI_MAJ), jam("Menor", "Lá menor", 90, "bossa", IIVI_MIN), rec("m10-treino")),
    B("Qual escala?", 5, ear("scale", ["altered", "phrygianDominant", "mixolydian"])),
  ]),

  lesson(299, "Ensaio geral do mês 10", ["Simular o desafio", "Arpejos + resoluções", "Saber se está pronto"], [
    B(undefined, 5, tab("Am7", 90, arp2("Am7", 6, 5))),
    B("Simulado", 5, ol("Os quatro arpejos de 2 oitavas a 90.", "Duas voltas do ii–V–I maior com alterada.", "Duas voltas do ii–V–i menor com frígio dominante.", "Grave tudo.")),
    B("Faça", 15, tab("Arpejos a 90", 90, [...arp2("Gmaj7", 6, 3), r(1), ...arp2("Am7", 6, 5), r(1), ...arp2("G7", 6, 3), r(1), ...arp2("Bm7b5", 5, 2), r(1)]), jam("Maior", "Dó", 90, "bossa", IIVI_MAJ), jam("Menor", "Lá menor", 90, "bossa", IIVI_MIN), rec("m10-simulado"), checks("ensaio10", "Estou pronto?", "Arpejos a 90 sem parar", "A alterada resolveu por semitom", "O frígio dominante resolveu no Am")),
    B("Qual escala?", 5, ear("scale", ["altered", "phrygianDominant", "lydianDominant", "dimHalfWhole"])),
  ]),

  lesson(300, "Desafio do mês 10", ["Arpejos de 2 oitavas a 90 BPM", "Resolver a alterada no I", "Resolver o frígio dominante no i"], [
    B("Aquecimento", 5, tab("Gmaj7", 85, arp2("Gmaj7", 6, 3))),
    B("As regras", 3, list("**Arpejos:** Gmaj7, Am7, G7 e Bm7(b5) em 2 oitavas a **90 BPM**.", "**Resolução maior:** duas voltas de Dm7 – G7alt – Cmaj7 com a alterada no V.", "**Resolução menor:** duas voltas de Bm7(b5) – E7(b9) – Am6 com frígio dominante no V.")),
    B("Desafio", 15, tab("Arpejos", 90, [...arp2("Gmaj7", 6, 3), r(1), ...arp2("Am7", 6, 5), r(1), ...arp2("G7", 6, 3), r(1), ...arp2("Bm7b5", 5, 2), r(1)]), jam("Resolução maior", "Dó", 90, "bossa", IIVI_MAJ), jam("Resolução menor", "Lá menor", 90, "bossa", IIVI_MIN), rec("m10-desafio"), bpmlog(10, 90)),
    B("O que vem", 7, ear("interval", ["2m", "2M", "3m", "3M"]), "No **mês 11**, **fraseado de verdade**: aproximações, **enclosures**, superposição de pentatônicas, *outside* controlado e **desenvolvimento motívico**."),
  ]),
];

