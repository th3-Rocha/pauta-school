// Mês 4 · dias 91 a 120 · CAGED e blues
import type { Lesson, Stroke, TabNote } from "../types";
import { arpBox, B, bars, blues12, box, bpmlog, changes, check, checks, chords, D, ear, jam, lesson, list, m, metro, minute, n, ol, r, rec, run, strum, t, tab, theory, tip, U, warn, whichChord, X, _ } from "./lib";

const A = 9;

/** Uma das 15 figuras de semicolcheia num tempo: "1011" = colcheia + duas semicolcheias. */
function fig(p: string, s = 4, f = 7): TabNote[] {
  const out: TabNote[] = [];
  let lead = 0;
  while (lead < 4 && p[lead] === "0") lead++;
  if (lead) out.push(r(lead / 4));
  for (let i = lead; i < 4; i++) {
    if (p[i] !== "1") continue;
    let j = i + 1;
    while (j < 4 && p[j] === "0") j++;
    out.push(n(s, f, (j - i) / 4));
  }
  return out;
}
/** As 15 figuras, na ordem em que o curso ensina. */
export const FIGURES = ["1111", "1010", "1000", "1011", "1110", "1101", "1001", "1100", "0111", "0101", "0110", "0011", "0100", "0010", "0001"];
/** Cada figura repetida 4 vezes = um compasso. */
const figBar = (p: string) => [0, 1, 2, 3].flatMap(() => fig(p));
const figTab = (ps: string[]) => ps.flatMap(figBar);

/* CAGED de Dó: as cinco regiões. */
const CAGED_C: [string, number, number, string][] = [
  ["forma de C", 0, 3, "x32010"],
  ["forma de A", 3, 5, "x35553"],
  ["forma de G", 5, 8, "875558"],
  ["forma de E", 8, 10, "8 10 10 9 8 8"],
  ["forma de D", 10, 13, "x x 10 12 13 12"],
];

/* Pentatônica de Lá menor nas 5 regiões. */
const PENTA_POS: [number, number][] = [[5, 8], [7, 10], [9, 13], [12, 15], [2, 5]];
const pentaBox = (i: number, caption?: string) => box(A, "pentaMinor", PENTA_POS[i][0], PENTA_POS[i][1], caption ?? `Forma ${i + 1} de Lá menor.`);
const pentaRun = (i: number, d = 0.5) => run(A, "pentaMinor", PENTA_POS[i][0], PENTA_POS[i][1], d);

const BLUES_A = blues12("A7", "D7", "E7", true);
const BLUES_E = blues12("E7", "A7", "B7", true);

/** Boogie em Lá (shuffle): tônica + 5/6/b7 na corda de cima. */
const boogie = (s: number): TabNote[] => [
  m([[s, 0], [s - 1, 2]], 0.5), m([[s, 0], [s - 1, 2]], 0.5), m([[s, 0], [s - 1, 4]], 0.5), m([[s, 0], [s - 1, 4]], 0.5),
  m([[s, 0], [s - 1, 5]], 0.5), m([[s, 0], [s - 1, 5]], 0.5), m([[s, 0], [s - 1, 4]], 0.5), m([[s, 0], [s - 1, 4]], 0.5),
];
const BOOGIE_A = boogie(5);
const BOOGIE_D = boogie(4);
const BOOGIE_E = boogie(6);

/** Licks de blues em Lá (originais). */
const LICK_1 = [n(1, 5, 0.5), n(2, 8, 0.5), n(2, 5, 0.5), n(3, 7, 0.5), t(3, 7, "b", 1, 2), n(3, 5, 1), n(4, 7, 4)];
const LICK_BLUE = [n(3, 5, 0.5), n(3, 7, 0.5), n(3, 8, 0.5), n(3, 7, 0.5), n(3, 5, 0.5), n(4, 7, 1.5), n(5, 7, 0.5), n(5, 6, 0.5), n(5, 5, 3)];
const LICK_MAJOR = [n(3, 6, 0.5), n(2, 5, 0.5), n(3, 6, 0.5), n(4, 7, 0.5), n(4, 4, 0.5), n(5, 7, 0.5), n(5, 4, 1), n(6, 5, 4)];
const LICK_MIX = [n(3, 5, 0.5), t(3, 6, "h", 0.5), n(2, 5, 1), n(3, 6, 0.5), n(3, 5, 0.5), n(4, 7, 2), r(2)];
const TRILL = [n(3, 5, 0.25), t(3, 7, "h", 0.25), t(3, 5, "p", 0.25), t(3, 7, "h", 0.25), t(3, 5, "p", 0.25), t(3, 7, "h", 0.25), t(3, 5, "p", 0.25), t(3, 7, "h", 0.25), n(3, 7, 2)];
const TURNAROUND = [m([[3, 6], [1, 5]], 1), m([[3, 5], [1, 5]], 1), m([[3, 4], [1, 5]], 1), m([[3, 3], [1, 5]], 1), n(5, 0, 1), n(6, 1, 1), m([[6, 0], [4, 0], [3, 1]], 2)];
const SHIFT = [n(3, 7, 0.5), n(3, 9, 0.5), n(2, 8, 0.5), n(2, 10, 0.5), n(1, 8, 0.5), n(1, 10, 0.5), t(1, 10, "b", 1, 2), n(1, 8, 1), n(2, 10, 0.5), n(2, 8, 0.5), n(3, 9, 0.5), t(3, 7, "\\", 0.5), n(3, 5, 1), n(4, 7, 4)];

const FUNK: Stroke[] = [D, X, U, D, X, U, D, U, X, U, D, U, X, U, D, U];
const GALLOP: Stroke[] = [D, _, D, U, D, _, D, U, D, _, D, U, D, _, D, U];

export const MONTH_4: Lesson[] = [
  lesson(91, "CAGED: cinco formas de um acorde", ["Entender a ideia do CAGED", "Ver o Dó maior em cinco lugares", "Ligar acordes abertos a pestanas"], [
    B(undefined, 5, "Bem-vindo ao mês 4. Comece revisando a forma 1 da pentatônica com um bend.", tab("Forma 1 de Lá menor", 80, pentaRun(0))),
    B("Os acordes abertos são móveis", 12,
      "Você conhece cinco acordes abertos maiores: **C, A, G, E, D**. Cada um é um **desenho**. Com pestana, qualquer desenho vira qualquer acorde. O **CAGED** mostra que esses cinco desenhos se encaixam um depois do outro pelo braço, nessa ordem: C → A → G → E → D → C…",
      "Veja o **Dó maior** nas cinco formas. Em todas, as notas são as mesmas (C, E, G); só muda a região.",
      ...CAGED_C.map(([name, from, to]) => arpBox("C", from, to, `Dó maior, ${name} (casas ${from}–${to}).`)),
    ),
    B("O Dó pelo braço", 8, changes(["C", "C@3"], 60), "Monte o C aberto e o C com pestana na casa 3 (forma de A). Repare que a forma de A **começa onde a forma de C termina**: a casa 3 é compartilhada.", tip("Não precisa tocar as cinco formas como acordes completos. Algumas (G e D) são desconfortáveis. O que importa é **ver** as notas.")),
    B("Qual acorde?", 5, whichChord("C", "A", "G", "E", "D")),
  ]),

  lesson(92, "CAGED: as formas de C, A e G", ["Tocar o arpejo de Dó nas três primeiras regiões", "Achar a tônica em cada forma", "Conectar as regiões"], [
    B(undefined, 5, changes(["C", "C@3"], 70)),
    B("Tônica, terça e quinta", 10,
      "Em cada forma, ache primeiro as **tônicas** (vermelho). Elas são a âncora. Depois as **terças** e **quintas** em volta.",
      arpBox("C", 0, 3, "Forma de C: tônicas nas cordas 5 e 2."),
      arpBox("C", 3, 5, "Forma de A: tônicas nas cordas 5 e 3."),
      arpBox("C", 5, 8, "Forma de G: tônicas nas cordas 6, 3 e 1."),
    ),
    B("Arpejos", 10, tab("Arpejo de Dó, forma de A", 60, run(0, [0, 4, 7], 3, 5, 0.5)), tab("Arpejo de Dó, forma de G", 60, run(0, [0, 4, 7], 5, 8, 0.5))),
    B("Qual tríade?", 5, ear("quality", ["", "m", "aug", "dim"])),
  ]),

  lesson(93, "CAGED: as formas de E e D", ["Completar as cinco regiões", "Voltar ao começo na casa 12", "Tocar o Dó em todo o braço"], [
    B(undefined, 5, tab("Arpejo de Dó, forma de G", 70, run(0, [0, 4, 7], 5, 8, 0.5))),
    B("Fechando o ciclo", 10,
      arpBox("C", 8, 10, "Forma de E: é o F com pestana levado para a casa 8."),
      arpBox("C", 10, 13, "Forma de D: tônica na corda 4 (casa 10) e na corda 2 (casa 13)."),
      "Depois da forma de D vem de novo a forma de C, agora na casa 12. O braço é um círculo.",
    ),
    B("Todas em sequência", 10, tab("Dó maior, forma de E", 60, run(0, [0, 4, 7], 8, 10, 0.5)), tab("Dó maior, forma de D", 60, run(0, [0, 4, 7], 10, 13, 0.5)), arpBox("C", 0, 15, "As cinco formas juntas: todas as notas de Dó maior até a casa 15.")),
    B("Qual tríade?", 5, ear("quality", ["", "m", "sus2", "sus4"])),
  ]),

  lesson(94, "CAGED em outro tom", ["Aplicar o CAGED a Sol e a Lá", "Achar a forma pela tônica", "Escolher a forma mais perto"], [
    B(undefined, 5, arpBox("C", 0, 15, "Revise as cinco regiões de Dó.")),
    B("A ordem não muda", 10,
      "Em qualquer tom, as formas aparecem na mesma ordem: **C A G E D**. Muda só onde começa. Em **Sol**, a forma de E fica na casa 3 (G com pestana), e a ordem continua: D na casa 5, C na casa 7, A na casa 10, G na casa 12.",
      arpBox("G", 0, 15, "Sol maior pelo braço."),
      arpBox("A", 0, 15, "Lá maior pelo braço. A forma de E fica na casa 5; a de A, no lugar do aberto e na casa 12."),
    ),
    B("Achar rápido", 10, ol("Escolha um acorde (por exemplo, **D**).", "Ache a tônica na corda 6 e use a forma de E.", "Ache a tônica na corda 5 e use a forma de A.", "Ache a tônica na corda 4 e use a forma de D."), changes(["G@3", "C@3", "D@5", "G@3"], 70)),
    B("Qual acorde?", 5, whichChord("G", "A", "D", "C")),
  ]),

  lesson(95, "Semicolcheias: 1 e + a", ["Dividir o tempo em quatro", "Contar semicolcheias", "Palhetada alternada a 16 por compasso"], [
    B(undefined, 5, changes(["G@3", "C@3", "D@5", "G@3"], 75)),
    B("Quatro por tempo", 10,
      "A **semicolcheia** dura **¼ de tempo**. Em cada clique cabem quatro. Conte: **1 é + a, 2 é + a…** (fala-se *um-é-mais-a*).",
      { w: "staff", notes: [{ midi: 64, d: 0.25 }, { midi: 64, d: 0.25 }, { midi: 64, d: 0.25 }, { midi: 64, d: 0.25 }, { midi: 64, d: 0.5 }, { midi: 64, d: 0.5 }, { midi: 64, d: 1 }, { midi: 64, d: 1 }], caption: "Semicolcheias têm duas barras." },
      "A mão direita faz **↓ ↑ ↓ ↑** em cada tempo: para baixo no número e no +, para cima no *é* e no *a*.",
      warn("Comece lento: a 60 BPM, semicolcheias já são 4 notas por segundo."),
    ),
    B("Semicolcheias contínuas", 10, tab("Casa 7 da corda 4 em semicolcheias", 50, figTab(["1111", "1111"])), tab("Escala em semicolcheias", 50, run(A, "pentaMinor", 5, 8, 0.25)), metro(50)),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(96, "As 15 figuras · parte 1", ["Conhecer as figuras com 2 e 4 notas", "Tocar cada uma por um compasso", "Ler sem contar nos dedos"], [
    B(undefined, 5, tab("Semicolcheias", 60, figTab(["1111"]))),
    B("Combinando semicolcheias", 10,
      "Um tempo tem 4 posições: **1, é, +, a**. Tocando ou não em cada uma, saem **15 figuras** (mais a pausa inteira). Hoje, as mais comuns:",
      list("**1111** · quatro semicolcheias", "**1010** · duas colcheias", "**1000** · semínima", "**1011** · colcheia + duas semicolcheias (o *galope*)", "**1110** · duas semicolcheias + colcheia"),
      "Na tablatura abaixo, cada compasso repete uma figura quatro vezes, nessa ordem.",
    ),
    B("Um compasso de cada", 10, tab("Figuras 1 a 5", 60, figTab(["1111", "1010", "1000", "1011", "1110"])), tip("Mantenha a mão direita fazendo ↓↑↓↑ o tempo todo. Quando a figura tem pausa, a mão passa sem encostar. É o segredo de todas as 15.")),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(97, "Revisão da semana 14", ["CAGED de Dó", "Semicolcheias", "Primeiras 5 figuras"], [
    B("Aquecimento", 6, arpBox("C", 0, 15)),
    B("O que você já sabe", 4, list("C A G E D: cinco formas na ordem", "Em qualquer tom, a ordem é a mesma", "Semicolcheia = ¼ de tempo: 1 é + a", "Mão direita sempre em ↓↑↓↑")),
    B("Mini-desafio", 15, tab("Figuras 1 a 5 a 70 BPM", 70, figTab(["1111", "1010", "1000", "1011", "1110"])), checks("sem14", "Semana 14 concluída", "Acho Dó maior nas 5 regiões", "Toco as 5 primeiras figuras a 70 BPM", "Conto 1 é + a em voz alta tocando")),
    B("Qual acorde?", 5, whichChord("C", "A", "G", "E", "D")),
  ]),

  lesson(98, "As 15 figuras · parte 2", ["Figuras com pontos e pausas", "Notas que começam fora do tempo", "Completar as 15"], [
    B(undefined, 5, tab("Figuras 1 a 5", 70, figTab(["1111", "1010", "1000", "1011", "1110"]))),
    B("As figuras deslocadas", 10,
      list("**1101** · semicolcheia, colcheia, semicolcheia (síncope curta)", "**1001** · colcheia pontuada + semicolcheia", "**1100** · duas semicolcheias e pausa", "**0111** · pausa no 1, três notas", "**0101** · só o *é* e o *a*", "**0110** · *é* e *+*", "**0011** · *+* e *a*", "**0100**, **0010**, **0001** · uma nota só, fora do tempo"),
      "As que começam com pausa são as mais difíceis: o clique cai no 1 e você não toca. Por isso a mão continua se movendo.",
    ),
    B("As outras 10", 10, tab("Figuras 6 a 10", 60, figTab(["1101", "1001", "1100", "0111", "0101"])), tab("Figuras 11 a 15", 60, figTab(["0110", "0011", "0100", "0010", "0001"]))),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(99, "Funk: semicolcheias e abafados", ["Usar o abafado (✕) da mão esquerda", "Tocar uma levada de funk", "Acordes de 9 no funk"], [
    B(undefined, 5, tab("Figuras 6 a 10", 70, figTab(["1101", "1001", "1100", "0111", "0101"]))),
    B("Ritmo com o mínimo de nota", 10,
      "No funk, a mão direita faz semicolcheias sem parar. A esquerda decide: **pressiona** (o acorde soa) ou **alivia** (sai um *tchk* abafado, o ✕).",
      chords("E9@7"),
      "O **E9** na casa 7 é o acorde mais clássico do funk. Pratique alternando pressão e alívio sem tirar os dedos das cordas.",
    ),
    B("Levada de funk", 10, strum("Funk em E9", 70, bars(["E9@7", "E9@7"], FUNK)), jam("Base de funk", "Mi", 90, "funk", ["E9@7", "E9@7", "E9@7", "A7"]), tip("Toque só nas cordas 4, 3 e 2. O resto fica abafado pelos dedos.")),
    B("Qual tipo de acorde?", 5, ear("quality", ["", "7", "9"])),
  ]),

  lesson(100, "Galope e rock em semicolcheias", ["Tocar o galope (1011)", "Usar palm mute em semicolcheias", "Manter a velocidade sem tensão"], [
    B(undefined, 5, strum("Funk em E9", 75, bars(["E9@7", "E9@7"], FUNK))),
    B("Galope", 8,
      "A figura **1011** (colcheia + duas semicolcheias) repetida vira o **galope**, o ritmo de cavalgada do rock pesado. Com palm mute ela fica percussiva.",
      tab("Galope em E5 com palm mute", 70, [0, 1, 2, 3, 4, 5, 6, 7].flatMap(() => [t(6, 0, "pm", 0.5), t(6, 0, "pm", 0.25), t(6, 0, "pm", 0.25)])),
    ),
    B("Galope com acordes", 12, strum("Galope: Em – C – D – Em", 80, bars(["E5", "C5", "D5", "E5"], GALLOP)), jam("Rock", "Mi menor", 100, "rock", ["E5", "C5", "D5", "E5"]), minute("galope", "Galope contínuo em E5 com palm mute: quantos segundos sem acelerar?")),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(101, "Pentatônica: forma 2", ["Tocar a segunda região da pentatônica", "Ligar formas 1 e 2", "Ver a forma 2 dentro do CAGED"], [
    B(undefined, 5, tab("Forma 1", 80, pentaRun(0))),
    B("A próxima caixa", 10,
      "A forma 1 termina onde a forma 2 começa: as notas da **casa 8** da forma 1 são as primeiras da forma 2.",
      pentaBox(1, "Forma 2 de Lá menor, casas 7 a 10."),
      box(A, "pentaMinor", 5, 10, "Formas 1 e 2 juntas: repare nas notas compartilhadas."),
      theory("Cada forma da pentatônica se encaixa numa forma do CAGED. A forma 1 de Lá menor mora em volta do **Am com pestana na casa 5**; a forma 2, em volta do **Dó maior com pestana na casa 8** (forma de E)."),
    ),
    B("Forma 2", 10, tab("Forma 2, ida e volta", 60, pentaRun(1)), tab("Da forma 1 para a 2 (original)", 70, SHIFT)),
    B("Qual intervalo?", 5, ear("interval", ["3m", "4J", "5J", "7m"])),
  ]),

  lesson(102, "Pentatônica: formas 3 e 4", ["Tocar a terceira e quarta região", "Achar as tônicas em cada uma", "Subir até a casa 15"], [
    B(undefined, 5, tab("Forma 2", 80, pentaRun(1))),
    B("Subindo o braço", 10, pentaBox(2, "Forma 3, casas 9 a 13."), pentaBox(3, "Forma 4, casas 12 a 15. Depois vem a forma 5, e a forma 1 volta na casa 17."), tip("Ache primeiro as tônicas (Lá) de cada forma. O resto do desenho se organiza em volta delas.")),
    B("Formas 3 e 4", 10, tab("Forma 3", 60, pentaRun(2)), tab("Forma 4", 60, pentaRun(3))),
    B("Qual intervalo?", 5, ear("interval", ["3m", "4J", "5J", "7m", "8J"])),
  ]),

  lesson(103, "Pentatônica: forma 5 e o braço inteiro", ["Completar as 5 formas", "Ver o mapa completo", "Trocar de forma no meio da frase"], [
    B(undefined, 5, tab("Forma 4", 80, pentaRun(3))),
    B("O mapa", 10, pentaBox(4, "Forma 5, casas 2 a 5 (ou 14 a 17). Depois dela, a forma 1 de novo."), box(A, "pentaMinor", 0, 17, "A pentatônica de Lá menor no braço inteiro. São só 5 notas repetidas: A C D E G."), "Você não precisa usar as cinco em todo solo. Mas saber onde estão impede que você fique preso numa caixa."),
    B("Caminho pelas formas", 10, tab("Forma 5", 60, pentaRun(4)), tab("Subindo pela corda 3 e 2 através das formas", 70, [n(3, 2, 0.5), n(3, 5, 0.5), n(2, 5, 0.5), n(3, 7, 0.5), n(3, 9, 0.5), n(2, 8, 0.5), n(2, 10, 0.5), n(3, 12, 0.5), n(3, 14, 0.5), n(2, 13, 0.5), n(2, 15, 0.5), n(1, 17, 2.5)])),
    B("Qual escala?", 5, ear("scale", ["pentaMinor", "pentaMajor"])),
  ]),

  lesson(104, "Revisão da semana 15", ["As 15 figuras", "Funk e galope", "As 5 formas da pentatônica"], [
    B("Aquecimento", 6, tab("Figuras 11 a 15", 70, figTab(["0110", "0011", "0100", "0010", "0001"]))),
    B("O que você já sabe", 4, list("15 figuras de semicolcheia", "Abafado da mão esquerda no funk", "Galope com palm mute", "Pentatônica nas 5 regiões")),
    B("Mini-desafio", 15, tab("As 15 figuras em sequência", 70, figTab(FIGURES)), checks("sem15", "Semana 15 concluída", "As 15 figuras a 70 BPM sem parar", "As 5 formas da pentatônica de Lá, de cor", "Funk em E9 com abafados limpos")),
    B("Qual escala?", 5, ear("scale", ["pentaMinor", "pentaMajor", "major"])),
  ]),

  lesson(105, "O blues de 12 compassos", ["Conhecer a forma do blues", "Tocar I7, IV7 e V7", "Contar os 12 compassos"], [
    B(undefined, 5, tab("Forma 1", 80, pentaRun(0))),
    B("A forma mais tocada da música popular", 10,
      "O **blues** usa três acordes **com sétima** (dominantes): **I7, IV7 e V7**. Em Lá: **A7, D7, E7**. A sequência tem **12 compassos** e se repete:",
      list("**1–4:** A7 (no 2º compasso, um *quick change* para D7)", "**5–6:** D7", "**7–8:** A7", "**9:** E7 · **10:** D7", "**11:** A7 · **12:** E7 (o *turnaround*, que puxa de volta ao começo)"),
      chords("A7", "D7", "E7"),
      theory("O acorde com sétima (**7**) tem uma 7ª menor sobre a tríade maior. No blues, **todos** os acordes são assim. Isso dá a cor do estilo."),
    ),
    B("12 compassos", 10, changes(BLUES_A, 80, 4, "Blues em Lá"), check("Conte os compassos em voz alta: *um, dois, três…* até doze. Saber onde você está é metade do blues.")),
    B("Qual tipo de acorde?", 5, ear("quality", ["", "7"])),
  ]),

  lesson(106, "Shuffle: a colcheia que balança", ["Tocar colcheias suingadas", "Fazer o riff de boogie", "Acompanhar o blues em shuffle"], [
    B(undefined, 5, changes(BLUES_A, 80)),
    B("Longa-curta", 8,
      "No **shuffle**, cada par de colcheias vira **longa-curta**: a primeira dura 2/3 do tempo, a segunda 1/3. Pense em *tá…ca, tá…ca*. A partitura escreve colcheias normais e avisa *swing* no começo.",
      tab("Boogie em Lá (shuffle)", 80, BOOGIE_A, { swing: true }),
      "O **boogie**: tônica na corda solta e, na corda de cima, 5ª → 6ª → b7 → 6ª. O mesmo desenho serve para os três acordes.",
    ),
    B("O blues inteiro em boogie", 12, tab("Boogie em Ré (para o D7)", 80, BOOGIE_D, { swing: true }), tab("Boogie em Mi (para o E7)", 80, BOOGIE_E, { swing: true }), jam("Blues em Lá (shuffle)", "Lá", 85, "shuffle", BLUES_A)),
    B("Qual tipo de acorde?", 5, ear("quality", ["", "m", "7"])),
  ]),

  lesson(107, "Pentatônica maior", ["Tocar a pentatônica maior de Lá", "Ouvir a diferença para a menor", "Usar sobre acordes maiores"], [
    B(undefined, 5, tab("Boogie em Lá", 85, BOOGIE_A, { swing: true })),
    B("Cinco notas, outro caráter", 10,
      "A **pentatônica maior** é **1, 2, 3, 5, 6**. Em Lá: **A B C# E F#**. Soa doce, country, ensolarada.",
      box(A, "pentaMajor", 4, 7, "Pentatônica maior de Lá, casas 4 a 7. Tônica na corda 6 casa 5."),
      "Truque: a pentatônica **maior de Lá** tem as mesmas notas da **menor de F#**. É a forma 1 menor, três casas abaixo da tônica.",
    ),
    B("Sobre o blues", 10, tab("Lick de penta maior (original)", 80, LICK_MAJOR, { swing: true, backing: ["A7", "A7"] }), jam("Blues em Lá", "Lá", 80, "shuffle", BLUES_A)),
    B("Qual escala?", 5, ear("scale", ["pentaMinor", "pentaMajor"])),
  ]),

  lesson(108, "A escala blues e a blue note", ["Acrescentar a b5 à pentatônica", "Usar a blue note de passagem", "Tocar o lick clássico"], [
    B(undefined, 5, box(A, "pentaMajor", 4, 7)),
    B("A nota de tempero", 8,
      "A **escala blues** é a pentatônica menor com uma nota a mais: a **b5** (blue note). Em Lá: **A C D Eb E G**.",
      box(A, "blues", 5, 8, "Escala blues de Lá, forma 1. A b5 está nas cordas 5 (casa 6) e 3 (casa 8)."),
      warn("A blue note é de **passagem**: ela soa ótima indo para o 4 ou para o 5, e estranha se você parar nela."),
    ),
    B("Licks com a b5", 12, tab("Lick da blue note (original)", 70, LICK_BLUE, { swing: true, backing: ["A7", "A7"] }), tab("Escala blues, ida e volta", 70, run(A, "blues", 5, 8, 0.5), { swing: true })),
    B("Qual escala?", 5, ear("scale", ["pentaMinor", "pentaMajor", "blues"])),
  ]),

  lesson(109, "Menor e maior no mesmo blues", ["Misturar b3 e 3", "Puxar a b3 até a 3", "Escolher a escala pelo acorde"], [
    B(undefined, 5, tab("Lick da blue note", 75, LICK_BLUE, { swing: true })),
    B("A ambiguidade do blues", 10,
      "Sobre **A7** (que tem C#, a 3ª maior), tocar o **C** da pentatônica menor deveria soar errado… mas é exatamente o som do blues. O segredo é **resolver**: a b3 (C) sobe meio tom até a 3 (C#).",
      tab("b3 → 3 (original)", 70, LICK_MIX, { swing: true, backing: ["A7"] }),
      list("No **A7**: misture menor e maior, resolva na 3 (C#) ou na tônica.", "No **D7**: a pentatônica menor de Lá funciona muito bem (o C é a b7 do D7).", "No **E7**: mire o **G#** (3ª do E7) ou o **E**."),
    ),
    B("Solo com as duas", 10, jam("Blues em Lá", "Lá", 80, "shuffle", BLUES_A), rec("m4-mix", "Grave uma volta usando as duas pentatônicas.")),
    B("Maior ou menor?", 5, ear("major-minor")),
  ]),

  lesson(110, "Ligados rápidos: trinados e licks", ["Fazer trinados com hammer e pull", "Licks em semicolcheias", "Fortalecer os dedos 3 e 4"], [
    B(undefined, 5, tab("b3 → 3", 75, LICK_MIX, { swing: true })),
    B("Trinado", 8,
      "O **trinado** alterna duas notas o mais rápido possível usando só hammer-on e pull-off. Palhete uma vez e deixe a mão esquerda fazer o resto.",
      tab("Trinado na corda 3", 60, TRILL),
    ),
    B("Licks de blues ligados", 12, tab("Lick 1", 70, LICK_1, { swing: true }), tab("Trinado + bend", 60, [...TRILL.slice(0, 8), t(3, 7, "b", 2, 2), n(3, 5, 1), n(4, 7, 1)]), minute("trinado", "Quantas notas de trinado limpas você consegue em 10 segundos? (Conte os ciclos.)")),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m"])),
  ]),

  lesson(111, "Revisão da semana 16", ["Forma do blues", "Shuffle e boogie", "Escala blues e mistura maior/menor"], [
    B("Aquecimento", 6, tab("Boogie em Lá", 90, BOOGIE_A, { swing: true })),
    B("O que você já sabe", 4, list("Blues: 12 compassos, I7 IV7 V7", "Shuffle: colcheias longa-curta", "Penta maior: 1 2 3 5 6", "Blue note: b5 de passagem", "b3 → 3 sobre o acorde I")),
    B("Mini-desafio", 15, jam("Blues em Lá", "Lá", 85, "shuffle", BLUES_A), checks("sem16", "Semana 16 concluída", "Acompanho as 12 barras com boogie sem me perder", "Toco o lick da blue note no tempo", "Uso b3 → 3 sobre o A7")),
    B("Qual escala?", 5, ear("scale", ["pentaMinor", "pentaMajor", "blues"])),
  ]),

  lesson(112, "Turnaround: a frase que fecha o ciclo", ["Tocar um turnaround clássico", "Encaixar nos compassos 11 e 12", "Ouvir quando o ciclo recomeça"], [
    B(undefined, 5, tab("Lick 1", 80, LICK_1, { swing: true })),
    B("Os dois últimos compassos", 8,
      "O **turnaround** é a frase dos compassos 11 e 12 que anuncia: *vai começar de novo*. Este usa uma linha cromática descendo na corda 3 com o Lá parado na corda 1, e termina no E7.",
      tab("Turnaround em Lá (tradicional)", 70, TURNAROUND, { swing: true }),
    ),
    B("Dentro do blues", 12, jam("Blues em Lá", "Lá", 80, "shuffle", BLUES_A), "Acompanhe com o boogie nos compassos 1 a 10 e toque o turnaround nos compassos 11 e 12."),
    B("Qual progressão?", 5, ear("progression", ["I IV I V", "I IV V I"])),
  ]),

  lesson(113, "Trocando de região no solo", ["Passar da forma 1 para a 2 sem parar", "Usar o slide como ponte", "Ampliar a extensão do solo"], [
    B(undefined, 5, tab("Turnaround", 75, TURNAROUND, { swing: true })),
    B("A ponte", 8,
      "Para mudar de região sem parar a frase, use um **slide** numa corda: você chega à forma vizinha com a mão já no lugar. Na corda 3, deslize da casa 7 para a 9; na corda 2, da 8 para a 10.",
      box(A, "pentaMinor", 5, 10, "Formas 1 e 2: os caminhos de slide estão nas cordas 3 e 2."),
    ),
    B("Ida e volta", 12, tab("Da forma 1 para a 2 e de volta", 70, SHIFT, { swing: true }), jam("Blues em Lá", "Lá", 80, "shuffle", BLUES_A), tip("Regra prática: comece cada volta numa forma diferente.")),
    B("Qual intervalo?", 5, ear("interval", ["2M", "3m", "4J", "5J"])),
  ]),

  lesson(114, "Solo de blues em duas regiões", ["Solar uma volta inteira", "Usar pergunta e resposta", "Trocar de região na metade"], [
    B(undefined, 5, tab("Da forma 1 para a 2", 80, SHIFT, { swing: true })),
    B("Um plano para 12 compassos", 8, ol("**1–4 (A7):** frase na forma 1, com pausa.", "**5–6 (D7):** resposta, ainda na forma 1.", "**7–8 (A7):** slide para a forma 2 e uma frase mais aguda.", "**9–10 (E7, D7):** bend na forma 2.", "**11–12:** desça de volta e termine no Lá, ou toque o turnaround.")),
    B("Solo", 12, jam("Blues em Lá", "Lá", 80, "shuffle", BLUES_A), rec("m4-solo", "Grave duas voltas de solo.")),
    B("Qual escala?", 5, ear("scale", ["pentaMinor", "pentaMajor", "blues"])),
  ]),

  lesson(115, "Blues em Mi e funk-blues", ["Transpor o blues para Mi", "Usar a forma 1 na casa 12 e na casa 0", "Blues com levada de funk"], [
    B(undefined, 5, jam("Blues em Lá", "Lá", 85, "shuffle", BLUES_A)),
    B("Outro tom, mesmas formas", 8,
      "Em **Mi**, o blues é **E7, A7, B7**. A forma 1 da pentatônica de Mi fica na casa 12 (ou na casa 0, com cordas soltas).",
      chords("E7", "A7", "B7"),
      box(4, "blues", 0, 3, "Escala blues de Mi na primeira posição."),
    ),
    B("Mi em dois estilos", 12, jam("Blues em Mi (shuffle)", "Mi", 90, "shuffle", BLUES_E), jam("Blues em Mi (funk)", "Mi", 95, "funk", ["E9@7", "E9@7", "E9@7", "E9@7", "A7", "A7", "E9@7", "E9@7", "B7", "A7", "E9@7", "B7"])),
    B("Qual tipo de acorde?", 5, ear("quality", ["", "7", "9", "m7"])),
  ]),

  lesson(116, "Peça do mês: blues em Lá", ["Tocar intro, base e solo", "Usar boogie, turnaround e licks", "Gravar a peça inteira"], [
    B(undefined, 5, tab("Turnaround", 80, TURNAROUND, { swing: true })),
    B("Roteiro", 5, ol("**Intro:** turnaround (2 compassos).", "**Volta 1:** boogie nos 12 compassos.", "**Volta 2:** solo em duas regiões.", "**Volta 3:** boogie com turnaround no final.", "**Final:** A7 segurado com vibrato.")),
    B("A peça", 15, jam("Blues em Lá", "Lá", 85, "shuffle", BLUES_A), tab("Boogie", 85, BOOGIE_A, { swing: true }), rec("m4-peca", "Grave a peça inteira.")),
    B("Qual acorde?", 5, whichChord("A7", "D7", "E7")),
  ]),

  lesson(117, "As 15 figuras a 80 BPM", ["Ler as figuras em qualquer ordem", "Chegar ao andamento do desafio", "Achar as figuras difíceis"], [
    B(undefined, 5, tab("As 15 figuras", 70, figTab(FIGURES))),
    B("Fora de ordem", 5, "No desafio, as figuras não vêm na ordem que você estudou. Hoje elas aparecem misturadas. Leia antes de tocar: diga *1 é + a* e bata palma nas posições certas."),
    B("Leitura misturada", 15, tab("Mistura 1", 80, figTab(["1011", "0101", "1001", "0111", "1110", "0010", "1101", "0011"])), tab("Mistura 2", 80, figTab(["0110", "1000", "0001", "1100", "0100", "1010", "1111"]))),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(118, "Treino do desafio: figuras e regiões", ["Medir as figuras no metrônomo", "Medir a troca de região", "Achar o ponto fraco"], [
    B(undefined, 5, tab("Mistura 1", 80, figTab(["1011", "0101", "1001", "0111", "1110", "0010", "1101", "0011"]))),
    B("O que o desafio pede", 5, list("**Ritmo:** as 15 figuras no metrônomo a **80 BPM**, sem parar.", "**Solo:** uma volta de blues trocando entre **duas regiões** da pentatônica sem parar.")),
    B("Treino focado", 15, tab("As 15 figuras a 80 BPM", 80, figTab(FIGURES)), tab("Troca de região", 80, SHIFT, { swing: true }), jam("Blues", "Lá", 80, "shuffle", BLUES_A)),
    B("Qual escala?", 5, ear("scale", ["pentaMinor", "pentaMajor", "blues"])),
  ]),

  lesson(119, "Ensaio geral do mês 4", ["Simular o desafio", "Gravar e ouvir", "Saber se está pronto"], [
    B(undefined, 5, tab("Boogie", 85, BOOGIE_A, { swing: true })),
    B("Simulado", 5, ol("Metrônomo a 80. As 15 figuras de primeira.", "Base de blues a 80. Uma volta de solo começando na forma 1 e terminando na forma 2 (ou o contrário).")),
    B("Faça", 15, tab("Figuras", 80, figTab(FIGURES)), jam("Blues", "Lá", 80, "shuffle", BLUES_A), rec("m4-simulado"), checks("ensaio4", "Estou pronto?", "15 figuras a 80 BPM sem parar", "Troquei de região sem parar a frase", "Terminei a volta no Lá")),
    B("Qual acorde?", 5, whichChord("A7", "D7", "E7")),
  ]),

  lesson(120, "Desafio do mês 4", ["As 15 figuras de semicolcheia a 80 BPM", "Solo de blues em duas regiões", "Registrar o BPM"], [
    B("Aquecimento", 5, tab("Forma 1 e 2", 80, [...pentaRun(0), ...pentaRun(1)])),
    B("As regras", 3, list("**Ritmo:** toque as 15 figuras (ordem da tablatura) a **80 BPM**. Pode errar nota, não pode parar.", "**Solo:** sobre a base de blues em Lá, uma volta de 12 compassos passando por **duas regiões** da pentatônica.", "Registre o maior BPM em que as figuras saíram limpas.")),
    B("Desafio", 15, tab("As 15 figuras", 80, figTab(FIGURES)), jam("Desafio: blues em Lá", "Lá", 80, "shuffle", BLUES_A), rec("m4-desafio"), bpmlog(4, 80)),
    B("O que vem", 7, ear("quality", ["", "m", "7", "maj7", "m7"]), "No **mês 5** os acordes ganham a **sétima**: maj7, m7, 7, m7(b5) e °7. Você monta o **campo harmônico em tétrades**, entende **funções** (tônica, subdominante, dominante) e toca o **ii–V–I**."),
  ]),
];

