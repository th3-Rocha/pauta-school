// Mês 6 · dias 151 a 180 · Ritmo, swing e notas-guia
import type { Lesson, Node, Stroke } from "../types";
import { parseChord } from "../../lib/harmony";
import { arpBox, B, bars, box, bpmlog, changes, check, checks, chords, D, ear, jam, lesson, list, m, metro, n, ol, r, rec, STR, strum, t, tab, theory, tip, U, warn, X, _, P } from "./lib";

/** Só a 3ª e a 7ª de um acorde numa região (notas-guia). */
function guides(symbol: string, from: number, to: number, caption?: string): Node {
  const p = parseChord(symbol);
  const g = p.intervals.filter((i) => [3, 4, 10, 11, 9].includes(i % 12) && i !== 9).map((i) => i % 12);
  return box(p.root, [0, ...g], from, to, caption ?? `${symbol}: tônica, 3ª e 7ª.`, { highlight: "chord" });
}

const IIVI_C = ["Dm7@5", "G7@3", "Cmaj7@3", "Cmaj7@3"];
/** Linha de notas-guia no ii–V–I de Dó: 7 → 3 → 7 (C → B → B) e 3 → 7 → 3 (F → F → E). */
const GUIDE_LINE_1 = [n(3, 5, 4), n(3, 4, 4), n(3, 4, 4), n(3, 4, 4)];
const GUIDE_LINE_2 = [n(2, 6, 4), n(2, 6, 4), n(2, 5, 4), n(2, 5, 4)];
const GUIDE_SOLO = [n(3, 5, 1), n(3, 7, 0.5), n(2, 6, 0.5), n(3, 7, 1), n(3, 5, 1), n(3, 4, 1), n(3, 7, 0.5), n(2, 6, 0.5), n(3, 7, 1), n(3, 5, 0.5), n(3, 4, 0.5), n(2, 5, 2), n(3, 4, 2), r(4)];

/** Progressão do desafio: 8 compassos com maj7, m7 e 7, até dois acordes por compasso. */
const M6_PROG = ["Cmaj7@3", "Am7@5", "Dm7@5 G7@3", "Cmaj7@3", "Fmaj7@1", "Em7@7 A7@5", "Dm7@5 G7@3", "Cmaj7@3"];
/** Linha de guias da progressão: B C | C B | B | A | G G | F F | E. */
const GUIDE_M6 = [n(3, 4, 4), n(2, 1, 4), n(2, 1, 2), n(3, 4, 2), n(3, 4, 4), n(3, 2, 4), n(3, 0, 2), n(3, 0, 2), n(4, 3, 2), n(4, 3, 2), n(4, 2, 4)];
const M6_PROG_NAMES = ["Cmaj7", "Am7", "Dm7 G7", "Cmaj7", "Fmaj7", "Em7 A7", "Dm7 G7", "Cmaj7"];

const BOSSA_PROG = ["Am7@5", "Am7@5", "Dm7@5", "Dm7@5", "G7@3", "G7@3", "Cmaj7@3", "E7@7"];
const SAMBA_PROG = ["Dm7@5", "G7@3", "Cmaj7@3", "A7@5"];
const BAIAO_PROG = ["G7@3", "G7@3", "F", "G7@3"];

/** Síncopes: notas que antecipam o tempo. */
const SYNC_1 = [n(2, 1, 1), n(2, 3, 1), n(1, 0, 1.5), n(1, 1, 0.5), n(1, 0, 4)];
const SYNC_2 = [n(2, 1, 0.5), n(2, 3, 1), n(1, 0, 1), n(1, 1, 1.5), n(1, 0, 2), r(2)];
const SYNC_3 = [r(0.5), n(2, 1, 0.5), r(0.5), n(2, 3, 0.5), r(0.5), n(1, 0, 1.5), n(2, 3, 0.5), n(2, 1, 1), n(3, 2, 2.5)];

const SKANK: Stroke[] = [P, _, D, _, P, _, D, _];
const SAMBA_STROKES: Stroke[] = [D, _, U, D, _, U, D, _, D, _, U, D, _, U, D, _];
const BAIAO: Stroke[] = [D, _, _, D, _, _, D, _, D, _, _, D, _, _, D, _];
const XOTE: Stroke[] = [D, _, X, _, D, U, X, _, D, _, X, _, D, U, X, _];
const CHARLESTON: Stroke[] = [D, _, _, D, _, _, _, _];

/** Vibratos em Lá menor. */
const VIBRATO = [t(2, 8, "~", 2), t(2, 5, "~", 2), t(3, 7, "~", 2), t(3, 5, "~", 2), t(2, 8, "b", 1, 2), t(2, 8, "~", 3)];

export const MONTH_6: Lesson[] = [
  lesson(151, "Síncope: o tempo forte fora do lugar", ["Entender síncope e antecipação", "Ler notas ligadas sobre o tempo", "Sentir o balanço brasileiro"], [
    B(undefined, 5, "Bem-vindo ao mês 6. Revise o ii–V–I do desafio.", changes(IIVI_C, 75)),
    B("Acento no fraco", 10,
      "**Síncope** é uma nota que começa num tempo fraco (ou no contratempo) e se prolonga sobre o tempo forte. O ouvido espera o acento no 1 e ele chega *antes*. É a base do samba, do funk, do reggae e da MPB.",
      "A forma mais comum é a **antecipação**: a nota que deveria cair no 1 chega meia colcheia antes, no *e* do 4, ligada ao compasso seguinte.",
      { w: "staff", notes: [{ midi: 72, d: 0.5 }, { midi: 74, d: 1 }, { midi: 76, d: 1 }, { midi: 77, d: 1.5 }], caption: "Colcheia, semínima, semínima, semínima pontuada: as notas caem nos *e*." },
    ),
    B("Três frases sincopadas", 10, tab("Sem síncope", 70, SYNC_1), tab("Com antecipação", 70, SYNC_2), tab("Toda no contratempo", 70, SYNC_3), tip("Bata o pé no tempo. As notas sincopadas caem com o pé **no ar**.")),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(152, "Metrônomo nos contratempos", ["Ouvir o clique como contratempo", "Manter o pulso sem o clique no 1", "Firmar a síncope"], [
    B(undefined, 5, tab("Com antecipação", 75, SYNC_2)),
    B("O clique no lugar do *e*", 8,
      "Treino clássico do jazz e do funk: o metrônomo toca **só os contratempos**. Você continua contando *1 e 2 e*, mas o clique cai no *e*.",
      "No metrônomo abaixo, escolha o modo **contratempos**. No começo parece que o clique *virou*. Insista até ele soar como o lugar certo.",
      metro(70),
    ),
    B("Tocando contra o clique", 12, tab("Escala de Dó em semínimas (clique no contratempo)", 70, [n(5, 3), n(5, 5), n(4, 2), n(4, 3), n(4, 5), n(3, 2), n(3, 4), n(3, 5, 4)]), "Depois toque as frases sincopadas do dia 151 com o mesmo clique.", warn("Se o clique *virar* e você perceber que está tocando junto com ele, pare e conte em voz alta antes de recomeçar.")),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(153, "Compasso composto: 6/8", ["Contar em 6", "Sentir dois pulsos de três", "Tocar uma levada em 6/8"], [
    B(undefined, 5, metro(70)),
    B("Dois grupos de três", 10,
      "No **6/8** cabem 6 colcheias por compasso, agrupadas em **2 grupos de 3**: **UM** dois três **QUA**tro cinco seis. O pé bate duas vezes por compasso (no 1 e no 4).",
      "É o balanço das baladas *soul*, das canções de ninar e de muita música folclórica.",
      strum("Levada em 6/8", 120, bars(["Am", "Am", "F", "E"], STR.six8), { beats: 6 }),
    ),
    B("Dedilhado em 6/8", 10, jam("Balada em 6/8", "Lá menor", 120, "six8", ["Am", "Am", "F", "E", "Am", "Dm", "E", "Am"]), "Toque baixo no 1 e no 4, e as cordas agudas nas outras colcheias. O BPM aqui conta **colcheias**."),
    B("Qual acorde?", 5, ear("which-chord", ["Am", "F", "E", "Dm"])),
  ]),

  lesson(154, "12/8 e o blues lento", ["Entender o 12/8", "Ligar 12/8 ao shuffle", "Tocar um blues lento"], [
    B(undefined, 5, jam("Balada em 6/8", "Lá menor", 120, "six8", ["Am", "Am", "F", "E"])),
    B("Quatro grupos de três", 8,
      "**12/8** = quatro grupos de três colcheias. Cada tempo se divide em **três**: *UM-e-a DOIS-e-a…* (tercinas).",
      theory("O **shuffle** do mês 4 é o 12/8 com a nota do meio de cada grupo em silêncio: *TÁ - ca, TÁ - ca*. Por isso shuffle e blues lento combinam tanto."),
    ),
    B("Blues lento", 12, jam("Blues lento em Lá (12/8)", "Lá", 55, "shuffle", ["A7", "D7", "A7", "A7", "D7", "D7", "A7", "A7", "E7", "D7", "A7", "E7"]), tab("Lick em tercinas (original)", 55, [n(1, 5, 1 / 3), n(2, 8, 1 / 3), n(2, 5, 1 / 3), n(3, 7, 1 / 3), n(3, 5, 1 / 3), n(4, 7, 1 / 3), t(3, 7, "b", 2, 2), n(3, 5, 1), n(4, 7, 3)]), tip("Num blues lento, cada nota pesa. Toque menos e deixe soar.")),
    B("Qual tipo de acorde?", 5, ear("quality", ["", "7", "m7"])),
  ]),

  lesson(155, "Swing: o balanço do jazz", ["Tocar colcheias suingadas", "Acompanhar com o Charleston", "Ouvir o baixo caminhando"], [
    B(undefined, 5, tab("Lick em tercinas", 60, [n(1, 5, 1 / 3), n(2, 8, 1 / 3), n(2, 5, 1 / 3), n(3, 7, 1 / 3), n(3, 5, 1 / 3), n(4, 7, 1 / 3), n(3, 7, 2)])),
    B("Swing é shuffle com leveza", 8,
      "No jazz, as colcheias são suingadas (longa-curta), mas mais leves e com acento no **contratempo**. O baterista marca **2 e 4** no chimbal.",
      "A guitarra base faz o **Charleston**: acorde curto no **1** e no **e do 2**. Simples, e deixa espaço para o resto da banda.",
      strum("Charleston", 110, bars(IIVI_C, CHARLESTON), { swing: true }),
    ),
    B("Comping", 12, jam("ii–V–I em Dó (swing)", "Dó", 110, "jazz", IIVI_C), tab("Escala de Dó suingada", 110, [n(5, 3, 0.5), n(5, 5, 0.5), n(4, 2, 0.5), n(4, 3, 0.5), n(4, 5, 0.5), n(3, 2, 0.5), n(3, 4, 0.5), n(3, 5, 0.5), n(3, 4, 0.5), n(3, 2, 0.5), n(4, 5, 0.5), n(4, 3, 0.5), n(4, 2, 0.5), n(5, 5, 0.5), n(5, 3, 1)], { swing: true })),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(156, "Reggae: o contratempo manda", ["Tocar o skank", "Usar tríades curtas", "Deixar o 1 vazio"], [
    B(undefined, 5, strum("Charleston", 110, bars(IIVI_C, CHARLESTON), { swing: true })),
    B("O skank", 8,
      "No reggae, a guitarra toca **só nos contratempos** (2 e 4, ou nos *e*), com acordes curtíssimos nas cordas agudas. O tempo 1 fica para o baixo e a bateria.",
      strum("Skank em Am e D", 75, bars(["Am", "D", "Am", "D"], SKANK)),
      tip("Use as tríades das cordas 3-2-1 do mês 3. Toque e solte a pressão da mão esquerda logo em seguida."),
    ),
    B("Com a banda", 12, jam("Reggae em Lá menor", "Lá menor", 75, "reggae", ["Am", "D", "Am", "D", "F", "G", "Am", "Am"]), check("Grave e ouça: os acordes estão **curtos** de verdade? Acorde que soa demais apaga o balanço.")),
    B("Qual acorde?", 5, ear("which-chord", ["Am", "D", "F", "G"])),
  ]),

  lesson(157, "Revisão da semana 22", ["Síncope e contratempo", "6/8 e 12/8", "Swing e reggae"], [
    B("Aquecimento", 6, tab("Toda no contratempo", 75, SYNC_3)),
    B("O que você já sabe", 4, list("Síncope: acento no tempo fraco, antecipação", "6/8: dois grupos de três · 12/8: quatro", "Swing: longa-curta, Charleston", "Reggae: só no contratempo")),
    B("Mini-desafio", 15, metro(75), strum("Skank", 80, bars(["Am", "D", "Am", "D"], SKANK)), checks("sem22", "Semana 22 concluída", "Toco a escala com o clique nos contratempos sem virar", "Sinto os 2 pulsos do 6/8", "Charleston no ii–V–I a 110 BPM")),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(158, "Bossa nova: a levada", ["Separar baixo e acorde", "Tocar a levada básica de bossa", "Usar acordes m7 e 7"], [
    B(undefined, 5, strum("Skank", 80, bars(["Am", "D", "Am", "D"], SKANK))),
    B("Polegar e dedos", 10,
      "A bossa nasceu no violão de dedo: o **polegar** faz o baixo em **1 e 3** (tônica e quinta), e os **dedos** tocam o acorde em pontos sincopados que mudam a cada compasso. Na guitarra com palheta, simplifique: baixo no tempo, acorde nos pontos da levada.",
      strum("Levada de bossa (acordes)", 70, bars(["Am7@5", "Am7@5", "Dm7@5", "Dm7@5"], STR.bossa)),
      theory("A levada se repete a cada **dois compassos** e é parente do **clave** cubano. É por isso que a bossa parece estar sempre *flutuando*."),
    ),
    B("Com a base", 10, jam("Bossa em Lá menor", "Lá menor", 120, "bossa", BOSSA_PROG), chords("Am7@5", "Dm7@5", "G7@3", "Cmaj7@3", "E7@7")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(159, "Bossa: acordes com cor", ["Usar 9ª e 6ª na bossa", "Trocar acordes com dedos de apoio", "Tocar uma progressão inteira"], [
    B(undefined, 5, strum("Bossa", 75, bars(["Am7@5", "Am7@5", "Dm7@5", "Dm7@5"], STR.bossa))),
    B("Acordes de bossa", 10,
      "A bossa raramente usa tríades. Os acordes ganham **9ª**, **6ª** e **13ª**: notas que não mudam a função, só a cor.",
      chords("Dm9", "G13", "Cmaj9", "C6/9", "A7b9", "Am9"),
      "Progressão clássica de bossa (original da Pauta, no estilo): **Dm9 – G13 – Cmaj9 – A7b9**.",
    ),
    B("ii–V–I com cor", 10, changes(["Dm9", "G13", "Cmaj9", "A7b9"], 60), jam("Bossa com cor", "Dó", 120, "bossa", ["Dm9", "G13", "Cmaj9", "A7b9"])),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "9"])),
  ]),

  lesson(160, "Samba: a batida", ["Tocar a levada de samba", "Sentir o 2/4 dentro do 4/4", "Acentuar o segundo tempo"], [
    B(undefined, 5, jam("Bossa com cor", "Dó", 120, "bossa", ["Dm9", "G13", "Cmaj9", "A7b9"])),
    B("Semicolcheias com acento", 8,
      "O samba é escrito em **2/4**, com semicolcheias. O acento forte é no **segundo tempo** (o surdo). Na guitarra, a mão direita faz semicolcheias contínuas, tocando só em alguns pontos: a levada abaixo é uma versão simplificada do *teleco-teco* do cavaquinho e do violão.",
      strum("Levada de samba", 60, bars(SAMBA_PROG, SAMBA_STROKES)),
    ),
    B("Com a percussão", 12, jam("Samba em Dó", "Dó", 90, "samba", SAMBA_PROG), tip("Comece a 70 BPM. Samba de verdade costuma passar de 100.")),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "I vi ii7 V7"])),
  ]),

  lesson(161, "Baião e xote", ["Tocar a célula do baião", "Tocar o xote", "Conhecer o som do Nordeste"], [
    B(undefined, 5, strum("Samba", 70, bars(SAMBA_PROG, SAMBA_STROKES))),
    B("A célula do baião", 10,
      "O baião se apoia numa célula de três notas a cada dois tempos: **colcheia pontuada, semicolcheia, colcheia** (*TUM - tu TUM*). É o ritmo da zabumba.",
      strum("Baião", 70, bars(BAIAO_PROG, BAIAO)),
      "O **xote** é mais lento e dançado *dois pra lá, dois pra cá*, com a batida abafada no contratempo:",
      strum("Xote", 70, bars(["G", "C", "D", "G"], XOTE)),
      theory("Muitas melodias de baião usam a **escala mixolídia** (maior com a 7ª menor). Você vai estudá-la no mês 9; por enquanto, repare no som do **G7** como acorde principal."),
    ),
    B("Com a banda", 10, jam("Baião em Sol", "Sol", 95, "baiao", BAIAO_PROG), jam("Xote em Sol", "Sol", 80, "xote", ["G", "C", "D", "G"])),
    B("Qual acorde?", 5, ear("which-chord", ["G", "C", "D", "F"])),
  ]),

  lesson(162, "Notas-guia: 3ª e 7ª", ["Achar 3ª e 7ª de cada acorde", "Entender por que elas definem o acorde", "Ver as notas-guia no braço"], [
    B(undefined, 5, jam("Baião em Sol", "Sol", 95, "baiao", BAIAO_PROG)),
    B("As notas que contam", 10,
      "A **3ª** diz se o acorde é maior ou menor. A **7ª** diz se é maj7, m7 ou 7. Juntas, elas são as **notas-guia**: tocando só as duas, o ouvido já entende a harmonia. A tônica o baixo toca; a 5ª quase não muda nada.",
      guides("Dm7", 3, 7), guides("G7", 3, 7), guides("Cmaj7", 3, 7, "Cmaj7: as notas-guia estão a poucas casas umas das outras."),
    ),
    B("Só as guias", 10, tab("3ª e 7ª no ii–V–I", 60, [m([[4, 3], [3, 5]], 4), m([[4, 3], [3, 4]], 4), m([[4, 2], [3, 4]], 4), m([[4, 2], [3, 4]], 4)], { backing: IIVI_C }), "Repare: entre Dm7 e G7 só **uma nota** se move (C → B). Entre G7 e Cmaj7, só uma (F → E). A harmonia anda por **meio tom**."),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(163, "Linhas de notas-guia", ["Fazer uma melodia só com 3ªs e 7ªs", "Mover por meio tom", "Cantar as linhas"], [
    B(undefined, 5, tab("3ª e 7ª no ii–V–I", 65, [m([[4, 3], [3, 5]], 4), m([[4, 3], [3, 4]], 4), m([[4, 2], [3, 4]], 4), m([[4, 2], [3, 4]], 4)], { backing: IIVI_C })),
    B("Duas melodias escondidas", 8,
      "Separando as duas vozes, saem duas **linhas**: uma desce de C para B (7 → 3 → 7) e a outra de F para E (3 → 7 → 3). Uma boa melodia de solo muitas vezes segue uma dessas linhas por baixo das notas rápidas.",
      tab("Linha 1: C → B → B", 60, GUIDE_LINE_1, { backing: IIVI_C }),
      tab("Linha 2: F → F → E", 60, GUIDE_LINE_2, { backing: IIVI_C }),
    ),
    B("Cante e toque", 12, ol("Toque a base.", "Cante a linha 1 (só uma nota por acorde).", "Toque a linha 1 na guitarra.", "Repita com a linha 2."), jam("ii–V–I em Dó", "Dó", 80, "jazz", IIVI_C)),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m", "3M"])),
  ]),

  lesson(164, "Revisão da semana 23", ["Bossa, samba, baião e xote", "Notas-guia", "Linhas de guia"], [
    B("Aquecimento", 6, strum("Bossa", 75, bars(["Am7@5", "Am7@5", "Dm7@5", "Dm7@5"], STR.bossa))),
    B("O que você já sabe", 4, list("Bossa: baixo em 1 e 3, acordes sincopados", "Samba: semicolcheias, acento no 2", "Baião: TUM - tu TUM", "Notas-guia = 3ª e 7ª", "No ii–V–I, as guias andam por meio tom")),
    B("Mini-desafio", 15, jam("Samba", "Dó", 85, "samba", SAMBA_PROG), tab("Linha 1", 70, GUIDE_LINE_1, { backing: IIVI_C }), checks("sem23", "Semana 23 concluída", "Levada de bossa com a base sem perder o lugar", "Acho 3ª e 7ª de Dm7, G7 e Cmaj7 sem olhar", "Canto as duas linhas de guia")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(165, "Solo com notas do acorde nos tempos 1 e 3", ["Planejar notas de chegada", "Encher o caminho com a escala", "Fazer a harmonia aparecer no solo"], [
    B(undefined, 5, tab("Linha 2", 70, GUIDE_LINE_2, { backing: IIVI_C })),
    B("Chegar no lugar certo", 8,
      "Regra do mês: nos **tempos 1 e 3**, toque uma **nota do acorde** (de preferência 3ª ou 7ª). Nos tempos 2 e 4 e nos contratempos, qualquer nota da escala serve para chegar lá.",
      arpBox("Dm7", 3, 7), arpBox("G7", 3, 7), arpBox("Cmaj7", 3, 7),
    ),
    B("Solo guiado", 12, tab("Exemplo (original)", 70, GUIDE_SOLO, { backing: IIVI_C }), jam("ii–V–I em Dó", "Dó", 75, "jazz", IIVI_C), rec("m6-tempo13", "Grave 4 voltas. Ouça e marque: as notas dos tempos 1 e 3 eram do acorde?")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(166, "Caminhos entre as guias", ["Ligar notas-guia por grau conjunto", "Aproximar por cima e por baixo", "Variar o ritmo do caminho"], [
    B(undefined, 5, tab("Exemplo", 75, GUIDE_SOLO, { backing: IIVI_C })),
    B("De uma guia à outra", 8,
      "Entre a guia de um acorde e a do próximo há um caminho de 2 a 4 notas. Três jeitos simples:",
      list("**Escala descendo** até a guia.", "**Escala subindo** até a guia.", "**Nota acima e nota abaixo** da guia, depois a guia (você vai aprofundar isso no mês 11)."),
      tab("Três caminhos para o B do G7", 70, [n(3, 5, 1), n(2, 6, 1), n(2, 5, 0.5), n(2, 3, 0.5), n(3, 4, 1), r(4), n(3, 5, 1), n(2, 6, 1), n(3, 0, 0.5), n(3, 2, 0.5), n(3, 4, 1), r(4), n(3, 5, 1), n(2, 6, 1), n(3, 5, 0.5), n(3, 2, 0.5), n(3, 4, 1), r(4)]),
    ),
    B("Caminhos com a base", 12, jam("ii–V–I em Dó", "Dó", 80, "jazz", IIVI_C), tip("Varie o ritmo: o caminho pode ser rápido (colcheias) e a guia longa, ou o contrário.")),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m", "3M"])),
  ]),

  lesson(167, "Vibrato", ["Fazer vibrato com o punho", "Controlar largura e velocidade", "Vibrato depois do bend"], [
    B(undefined, 5, jam("ii–V–I em Dó", "Dó", 80, "jazz", IIVI_C)),
    B("A assinatura do guitarrista", 10,
      "**Vibrato** é balançar a altura da nota, subindo e voltando rapidamente. É o que deixa a nota longa *viva*, como uma voz.",
      list("**Rock e blues:** gire o **punho** como no bend, em pequenos bends repetidos. Use os dedos de apoio.", "**Jazz e clássico:** mova o dedo **ao longo** da corda (para os lados), vibrato mais estreito.", "Controle duas coisas: **largura** (quanto sobe) e **velocidade**. Pratique lento e largo, depois rápido e estreito."),
      tab("Vibratos em Lá menor", 60, VIBRATO),
    ),
    B("Notas longas", 10, jam("Lá menor lento", "Lá menor", 65, "ballad", ["Am", "F", "C", "G"]), "Toque **uma nota por compasso**, só notas da pentatônica, cada uma com vibrato. Parece pouco, mas é um dos exercícios mais musicais que existem.", warn("Vibrato não é tremer a mão. Se o braço inteiro tremer, desacelere.")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(168, "Dinâmica no solo", ["Tocar do pp ao ff", "Controlar ataque", "Construir um arco de intensidade"], [
    B(undefined, 5, tab("Vibratos", 65, VIBRATO)),
    B("Volume é expressão", 8,
      list("**pp** (pianíssimo) · **p** · **mp** · **mf** · **f** · **ff** (fortíssimo).", "**Ataque:** palheta mais perto do braço = macio; perto da ponte = brilhante e agressivo.", "**Crescendo** (cresc.): aumentar aos poucos. **Decrescendo**: diminuir."),
      "Um solo bom costuma ter um **arco**: começa calmo, cresce até um ponto alto, e volta.",
    ),
    B("O arco", 12, ol("Compassos 1–4: **p**, notas longas, perto do braço.", "Compassos 5–8: **mf**, mais notas, ataque no meio.", "Compassos 9–12: **f**, bends e vibrato, perto da ponte.", "Compassos 13–16: **p** de novo, termine na tônica."), jam("Base para o arco", "Lá menor", 70, "ballad", ["Am", "F", "C", "G", "Am", "F", "C", "G", "Am", "F", "C", "G", "Am", "F", "G", "Am"]), rec("m6-arco", "Grave o arco de 16 compassos.")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(169, "Dois acordes por compasso", ["Mirar a guia no tempo 1 e no 3", "Reagir à troca rápida", "Ler cifras com dois acordes"], [
    B(undefined, 5, tab("Exemplo de guias", 75, GUIDE_SOLO, { backing: IIVI_C })),
    B("A troca no meio", 8,
      "Quando há dois acordes no compasso, cada um dura **2 tempos**. Aí a regra fica mais exigente: **tempo 1 = guia do primeiro acorde, tempo 3 = guia do segundo**.",
      { list: ["| Cmaj7 | Am7 | **Dm7 G7** | Cmaj7 |", "Compasso 3: guia do Dm7 (F ou C) no tempo 1, guia do G7 (B ou F) no tempo 3."] },
    ),
    B("Praticando a troca", 12, tab("Guias com troca no meio (original)", 70, [n(2, 5, 2), n(3, 4, 2), n(1, 3, 2), n(2, 1, 2), n(2, 6, 1), n(2, 5, 1), n(3, 4, 1), n(3, 2, 1), n(2, 5, 4)], { backing: ["Cmaj7", "Am7", "Dm7 G7", "Cmaj7"] }), jam("Quatro compassos", "Dó", 75, "jazz", ["Cmaj7@3", "Am7@5", "Dm7@5 G7@3", "Cmaj7@3"])),
    B("Qual progressão?", 5, ear("progression", ["I vi ii7 V7", "ii7 V7 Imaj7"])),
  ]),

  lesson(170, "Blues com notas-guia", ["Achar as guias de A7, D7 e E7", "Solar com elas no blues", "Misturar pentatônica e guias"], [
    B(undefined, 5, jam("Quatro compassos", "Dó", 80, "jazz", ["Cmaj7@3", "Am7@5", "Dm7@5 G7@3", "Cmaj7@3"])),
    B("As guias do blues", 8,
      "No blues, cada acorde é um 7, com sua própria 3ª e 7ª: **A7 (C#, G)**, **D7 (F#, C)**, **E7 (G#, D)**. A pentatônica menor de Lá tem G, C e D, mas **não** tem C#, F# nem G#. É por isso que os grandes do blues misturam: pentatônica para a cor, guias para a harmonia.",
      guides("A7", 4, 8), guides("D7", 4, 8), guides("E7", 4, 8),
    ),
    B("Blues com guias", 12, jam("Blues em Lá", "Lá", 80, "shuffle", ["A7", "D7", "A7", "A7", "D7", "D7", "A7", "A7", "E7", "D7", "A7", "E7"]), tip("Na troca A7 → D7, o C# desce para C (a 7ª do D7). Meio tom. Tente tocar exatamente isso no compasso 5.")),
    B("Qual tipo de acorde?", 5, ear("quality", ["", "7", "m7", "maj7"])),
  ]),

  lesson(171, "Revisão da semana 24", ["Notas-guia no tempo 1 e 3", "Vibrato e dinâmica", "Dois acordes por compasso"], [
    B("Aquecimento", 6, tab("Vibratos", 70, VIBRATO)),
    B("O que você já sabe", 4, list("Guias nos tempos 1 e 3, caminhos no meio", "Vibrato: largura e velocidade", "pp a ff, ataque", "Dois acordes no compasso: guia no 1 e no 3")),
    B("Mini-desafio", 15, jam("Progressão do desafio", "Dó", 75, "jazz", M6_PROG), checks("sem24", "Semana 24 concluída", "Notas-guia nos tempos 1 e 3 em 4 compassos seguidos", "Vibrato controlado em notas longas", "Toquei sobre a troca no meio do compasso sem me perder")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(172, "Tema de bossa", ["Ler uma melodia sincopada", "Tocar sobre a base de bossa", "Improvisar entre as repetições"], [
    B(undefined, 5, jam("Bossa em Lá menor", "Lá menor", 120, "bossa", BOSSA_PROG)),
    B("O tema", 8, "Tema original da Pauta, no estilo da bossa: frases curtas, sincopadas, que terminam em notas de cor (9ª e 7ª).", tab("Tema de bossa (original)", 100, [r(0.5), n(1, 7, 0.5), n(1, 5, 1), n(2, 8, 0.5), n(1, 5, 1.5), r(1), n(2, 6, 0.5), n(2, 5, 1), n(2, 6, 0.5), n(2, 8, 2), r(1), n(1, 5, 0.5), n(1, 3, 1), n(2, 6, 0.5), n(1, 3, 1.5), r(1), n(2, 6, 0.5), n(2, 5, 1), n(2, 3, 0.5), n(2, 5, 2), r(1), n(2, 3, 0.5), n(3, 4, 1), n(2, 3, 0.5), n(2, 5, 1.5), r(1), n(2, 5, 0.5), n(3, 4, 0.5), n(3, 2, 1), n(3, 4, 2), r(2), n(1, 0, 4), n(2, 4, 4)], { backing: ["Am7", "Am7", "Dm7", "Dm7", "G7", "G7", "Cmaj7", "E7"] })),
    B("Tema e improviso", 12, jam("Base do tema", "Lá menor", 110, "bossa", BOSSA_PROG), rec("m6-bossa", "Grave tema, uma volta improvisada e tema.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(173, "Solo sobre samba", ["Usar síncope no solo", "Frases curtas e repetidas", "Guias sobre o samba"], [
    B(undefined, 5, strum("Samba", 75, bars(SAMBA_PROG, SAMBA_STROKES))),
    B("Frase de samba", 8, "No samba, o solo conversa com a percussão: frases curtas, sincopadas, muitas vezes repetidas com pequenas variações.", tab("Frase sincopada (original)", 80, [r(0.25), n(2, 5, 0.25), n(2, 6, 0.25), n(2, 8, 0.25), r(0.25), n(1, 5, 0.5), n(2, 8, 0.25), n(2, 6, 1), n(2, 5, 1), r(0.25), n(3, 7, 0.25), n(2, 5, 0.25), n(2, 6, 0.25), r(0.25), n(2, 8, 0.5), n(2, 6, 0.25), n(2, 5, 1), n(3, 4, 1)], { backing: SAMBA_PROG.map((c) => c.split("@")[0]) })),
    B("Solo", 12, jam("Samba em Dó", "Dó", 85, "samba", SAMBA_PROG), tip("Repita uma frase 2 ou 3 vezes mudando só a última nota. O público sambando agradece.")),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "I vi ii7 V7"])),
  ]),

  lesson(174, "Baião no solo", ["Tocar uma melodia de baião", "Usar a 7ª menor sobre o acorde maior", "Frases com a célula do baião"], [
    B(undefined, 5, jam("Baião em Sol", "Sol", 95, "baiao", BAIAO_PROG)),
    B("O som do sertão", 8, "A melodia de baião costuma ficar em cima do acorde maior com sétima (G7) e usar o **F natural**. Esta frase usa a célula *TUM - tu TUM* na melodia.", tab("Frase de baião (original)", 90, [n(3, 4, 0.75), n(3, 4, 0.25), n(3, 5, 1), n(2, 3, 0.75), n(2, 3, 0.25), n(2, 1, 1), n(3, 4, 0.75), n(3, 2, 0.25), n(3, 0, 1), n(4, 3, 2), n(3, 0, 0.75), n(3, 2, 0.25), n(3, 4, 1), n(2, 3, 0.75), n(2, 1, 0.25), n(3, 4, 1), n(3, 2, 2), n(3, 0, 2)], { backing: ["G7", "G7", "F", "G7"] })),
    B("Solo de baião", 12, jam("Baião", "Sol", 95, "baiao", BAIAO_PROG), rec("m6-baiao")),
    B("Qual acorde?", 5, ear("which-chord", ["G", "G7", "F", "C"])),
  ]),

  lesson(175, "A progressão do desafio", ["Analisar os 8 compassos", "Achar as guias de cada acorde", "Montar um mapa"], [
    B(undefined, 5, changes(["Cmaj7@3", "Am7@5", "Dm7@5", "G7@3"], 75)),
    B("Mapa", 10,
      { list: M6_PROG_NAMES.map((c, i) => `Compasso ${i + 1}: **${c}**`) },
      { callout: "theory", title: "Análise", text: ["Tom: Dó. I – vi – ii V – I | IV – iii **V7/ii** – ii V – I.", "O **A7** é o dominante do Dm7 (o ii): um acorde *de fora* que você vai estudar no mês 8. As guias dele são **C#** (3ª) e **G** (7ª): mire numa delas no tempo 3 do compasso 6."] },
    ),
    B("As guias, compasso a compasso", 10, tab("Linha de guias (original)", 70, GUIDE_M6, { backing: M6_PROG_NAMES })),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(176, "Improviso guiado nos 8 compassos", ["Solar com guias em 8 compassos", "Usar vibrato e dinâmica", "Gravar e avaliar"], [
    B(undefined, 5, tab("Linha de guias", 75, GUIDE_M6, { backing: M6_PROG_NAMES })),
    B("Do esqueleto ao solo", 5, ol("Volta 1: só a linha de guias (notas longas).", "Volta 2: guias + uma nota de caminho antes de cada uma.", "Volta 3: guias nos tempos 1 e 3 e caminhos livres.", "Volta 4: solo livre, mas confira que as guias continuam lá.")),
    B("Quatro voltas", 15, jam("Progressão do desafio", "Dó", 80, "jazz", M6_PROG), rec("m6-guiado", "Grave as 4 voltas.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(177, "Treino do desafio: notas-guia", ["Simular os 8 compassos", "Medir guias nos tempos certos", "Achar o compasso fraco"], [
    B(undefined, 5, changes(["Dm7@5", "G7@3", "Cmaj7@3", "A7@5"], 80)),
    B("O que o desafio pede", 5, list("Improvisar **8 compassos** sobre a progressão (maj7, m7 e 7, até 2 acordes por compasso).", "**Notas-guia nos tempos 1 e 3.**", "**80 BPM.**")),
    B("Treino", 15, jam("Progressão do desafio", "Dó", 80, "jazz", M6_PROG), rec("m6-treino"), check("Ouça a gravação com a lista de guias do dia 175 do lado. Marque os compassos em que errou a guia e treine só eles.")),
    B("Qual progressão?", 5, ear("progression", ["I vi ii7 V7", "ii7 V7 Imaj7", "IV V I"])),
  ]),

  lesson(178, "O desafio em outro ritmo", ["Tocar a progressão em bossa", "Manter as guias com outro balanço", "Escolher o estilo do desafio"], [
    B(undefined, 5, jam("Progressão do desafio", "Dó", 80, "jazz", M6_PROG)),
    B("Mesmas guias, outro balanço", 5, "O desafio pode ser feito em **swing** ou em **bossa**. Experimente os dois e escolha o que soa mais natural para você."),
    B("Bossa", 15, jam("Progressão do desafio em bossa", "Dó", 120, "bossa", M6_PROG), rec("m6-bossa-desafio")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(179, "Ensaio geral do mês 6", ["Simular o desafio", "Saber se está pronto", "Ajustar o que falta"], [
    B(undefined, 5, tab("Linha de guias", 80, GUIDE_M6, { backing: M6_PROG_NAMES })),
    B("Simulado", 5, ol("Escolha swing ou bossa.", "Escute 1 volta da base.", "Improvise 8 compassos com guias no 1 e no 3.", "Grave.")),
    B("Faça", 15, jam("Simulado", "Dó", 80, "jazz", M6_PROG), rec("m6-simulado"), checks("ensaio6", "Estou pronto?", "Toquei 8 compassos sem parar", "Guias nos tempos 1 e 3 em pelo menos 6 compassos", "Ouvi a troca no meio do compasso")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(180, "Desafio do mês 6", ["Improvisar 8 compassos com notas-guia", "Até dois acordes por compasso", "80 BPM"], [
    B("Aquecimento", 5, changes(["Cmaj7@3", "Am7@5", "Dm7@5", "G7@3"], 80)),
    B("As regras", 3, list("Base a **80 BPM** (swing ou bossa).", "**8 compassos** de improviso sobre a progressão do mês.", "Nos **tempos 1 e 3**, uma **nota-guia** (3ª ou 7ª) do acorde da vez.", "Grave e confira com a lista do dia 175.")),
    B("Desafio", 15, jam("Desafio do mês 6", "Dó", 80, "jazz", M6_PROG), rec("m6-desafio"), bpmlog(6, 80)),
    B("O que vem", 7, ear("quality", ["maj7", "m7", "7", "m7b5", "dim7"]), "No **mês 7** você aprende a acompanhar como profissional: **inversões**, **spread triads**, **shells**, **Drop 2 e Drop 3**, **condução de vozes**, **diminutos de passagem** e **line cliché**."),
  ]),
];

