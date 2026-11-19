// Mês 12 · dias 331 a 365 · Projeto final
import type { Lesson, TabNote } from "../types";
import { arpBox, B, bars, blues12, box, bpmlog, c, changes, check, checks, chords, drone, ear, jam, lesson, list, metro, n, nps3, ol, r, rec, run, STR, strum, t, tab, theory, tip, tuner, warn } from "./lib";

const A = 9;
const G = 7;

const BLUES_A = blues12("A7", "D7", "E7", true);
const JAZZ_BLUES_F = ["F7", "Bb7", "F7", "Cm7 F7", "Bb7", "Bb7", "F7", "Am7 D7", "Gm7", "C7", "F7 D7", "Gm7 C7"];

/** Cifra do projeto final: 12 compassos em Sol, dois acordes por compasso, com desvios tonais. */
const PROJECT = ["Gmaj7 Em7", "Am7 D7", "Bm7 E7", "Am7 D7", "Gmaj7 G7", "Cmaj7 Cm6", "Bm7 E7", "Am7 D7", "Em7 A7", "Am7 D7", "Gmaj7 E7", "Am7 D7"];
/** Cifra de treino (Dó): 8 compassos. */
const PRACTICE = ["Cmaj7 A7", "Dm7 G7", "Em7 A7", "Dm7 G7", "Fmaj7 Fm6", "Em7 A7", "Dm7 Db7", "Cmaj7"];

/** Sextinas na pentatônica de Lá (6 notas por tempo). */
const S = 1 / 6;
const SEXTUPLETS: TabNote[] = [
  ...[[1, 8], [1, 5], [2, 8], [2, 5], [3, 7], [3, 5]].map(([s, f]) => n(s, f, S)),
  ...[[2, 8], [2, 5], [3, 7], [3, 5], [4, 7], [4, 5]].map(([s, f]) => n(s, f, S)),
  ...[[3, 7], [3, 5], [4, 7], [4, 5], [5, 7], [5, 5]].map(([s, f]) => n(s, f, S)),
  n(6, 5, 1),
];

/** Pre-bends e releases (originais). */
const PREBENDS = [t(2, 8, "pb", 2, 2), n(2, 5, 1), n(3, 7, 1), t(3, 7, "pb", 2, 2), n(3, 5, 2), t(2, 10, "pb", 1, 1), t(2, 10, "r", 1, 1), n(2, 8, 2)];
/** Legato e tapping (originais). */
const LEGATO_3NPS = nps3(A, "dorian", 5, 0.25, { down: false }).map((q, i) => ("s" in q && i % 3 !== 0 ? { ...q, t: "h" as const } : q));
const TAPPING = [t(1, 12, "t", 0.25), t(1, 5, "p", 0.25), t(1, 8, "h", 0.25), t(1, 12, "t", 0.25), t(1, 5, "p", 0.25), t(1, 8, "h", 0.25), t(1, 12, "t", 0.25), t(1, 8, "p", 0.25), t(1, 15, "t", 0.25), t(1, 5, "p", 0.25), t(1, 8, "h", 0.25), t(1, 15, "t", 0.25), t(1, 5, "p", 0.25), t(1, 8, "h", 0.25), t(1, 15, "t", 0.25), t(1, 8, "p", 0.25), n(1, 5, 2)];

/** Melodia nova para leitura com final improvisado (original). */
const READING = [n(2, 3, 1), n(2, 5, 0.5), n(2, 3, 0.5), n(2, 1, 1), n(3, 4, 1), n(3, 2, 1.5), n(3, 4, 0.5), n(2, 1, 2), n(1, 0, 1), n(2, 3, 1), n(2, 1, 1), n(3, 2, 1), n(3, 4, 4), r(4), r(4)];

export const MONTH_12: Lesson[] = [
  lesson(331, "Sextinas", ["Tocar 6 notas por tempo", "Agrupar em 3 + 3", "Corridas na pentatônica"], [
    B(undefined, 5, "Bem-vindo ao último mês. Ele junta tudo em estilos reais, ensina a transcrever e termina no **projeto final**.", jam("Blues em Lá", "Lá", 85, "shuffle", BLUES_A)),
    B("Seis no tempo", 8,
      "A **sextina** divide o tempo em **6**. Pense em duas tercinas: *1-e-a-2-e-a* dentro de um clique. Na pentatônica, o padrão clássico desce **duas cordas por grupo** com 6 notas, dando aquela corrida *em cascata* do rock.",
      tab("Cascata em sextinas (original)", 50, SEXTUPLETS),
      tip("Comece a 50 BPM. Acentue a primeira de cada grupo de 3 para não perder a conta."),
    ),
    B("Sextinas no tempo", 12, tab("A 60", 60, SEXTUPLETS), tab("A 70", 70, SEXTUPLETS), metro(60)),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(332, "Pre-bend e release", ["Fazer pre-bend afinado", "Soltar o bend em tempo", "Usar como efeito de choro"], [
    B(undefined, 5, tab("Cascata", 65, SEXTUPLETS)),
    B("A nota começa esticada", 8,
      "No **pre-bend (PB)**, você estica a corda **antes** de palhetar, e só então solta (**R**). O ouvido ouve a nota *caindo*: um choro, um suspiro. A dificuldade é acertar a altura sem ouvir antes.",
      list("Treine: faça o bend normal e memorize a sensação no dedo.", "Pre-bend: estique em silêncio até a mesma sensação, palhete, solte devagar.", "Confira no afinador: a primeira nota precisa estar afinada."),
      { w: "bend", s: 2, f: 8, semis: 2 },
    ),
    B("Frases com pre-bend", 12, tab("Pre-bends (original)", 70, PREBENDS), jam("Balada em Lá menor", "Lá menor", 70, "ballad", ["Am", "F", "C", "G"])),
    B("Subiu ou desceu?", 5, ear("highlow-close")),
  ]),

  lesson(333, "Volume swells e sustentação", ["Fazer swell com o botão de volume", "Criar pads de guitarra", "Tocar como cordas de orquestra"], [
    B(undefined, 5, tab("Pre-bends", 70, PREBENDS)),
    B("Sem ataque", 8,
      "O **volume swell** apaga o ataque da palheta: a nota cresce do nada. Com acordes, vira um **pad**, como cordas de orquestra. É usado em fusion, post-rock e baladas.",
      ol("Volume no zero.", "Toque o acorde.", "Gire o volume com o dedo mínimo até o máximo em 1 tempo.", "Abaixe enquanto troca de acorde."),
      warn("Sem botão de volume perto da mão? Toque **pp** com a polpa do polegar e acrescente vibrato: o efeito é parecido."),
    ),
    B("Pads", 12, jam("Pad modal", "Ré dórico", 60, "drone", ["Dm9", "Dm9", "G13", "G13"]), "Faça swells em Dm9 e G13 (acordes do mês 6), um por compasso. Depois uma melodia em notas longas com swell, em Ré dórico.", rec("m12-swell")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(334, "Fusion: legato e tapping", ["Tocar 3NPS em legato", "Fazer tapping de 3 notas", "Frases rápidas sem esforço"], [
    B(undefined, 5, jam("Pad modal", "Ré dórico", 60, "drone", ["Dm9", "G13"])),
    B("Mais notas, menos palheta", 8,
      list("**Legato 3NPS:** palhete só a primeira nota de cada corda; as outras duas com hammer-on.", "**Tapping (T):** a mão direita martela uma nota aguda e faz pull-off para a mão esquerda. Padrão clássico: T – P – H."),
      tab("Legato em Lá dórico (3NPS)", 70, LEGATO_3NPS),
      tab("Tapping na corda 1 (original)", 60, TAPPING),
    ),
    B("Fusion sobre vamp", 12, jam("Vamp de fusion", "Lá dórico", 100, "funk", ["Am7@5", "Am7@5", "D7@5", "D7@5"]), tip("Fusion = vocabulário de jazz (modos, arpejos, alterações) com som e energia de rock.")),
    B("Qual escala?", 5, ear("scale", ["dorian", "mixolydian", "lydian"])),
  ]),

  lesson(335, "Síntese rock: riff, base e solo", ["Montar um rock com tudo que você sabe", "Riff com double stops e PM", "Solo com motivo, bends e sextinas"], [
    B(undefined, 5, tab("Tapping", 70, TAPPING)),
    B("Roteiro de rock", 5, ol("**Riff** em E5 com palm mute (mês 2–3).", "**Verso:** power chords com galope (mês 4).", "**Refrão:** acordes abertos e pestana (mês 1–2).", "**Solo:** motivo (mês 11), bends afinados (mês 3), sextinas (mês 12).")),
    B("Rock", 15, strum("Verso com galope", 100, bars(["E5", "C5", "D5", "E5"], ["down", null, "down", "up", "down", null, "down", "up", "down", null, "down", "up", "down", null, "down", "up"])), jam("Refrão", "Mi menor", 110, "rock", ["Em", "C", "G", "D"]), jam("Solo", "Mi menor", 110, "rock", ["Em", "C", "D", "Em"]), rec("m12-rock")),
    B("Qual progressão?", 5, ear("progression", ["i VI VII i", "vi IV I V", "I V vi IV"])),
  ]),

  lesson(336, "Síntese fusion: modal e alterado", ["Solar num vamp modal", "Inserir um V7alt", "Usar 3NPS e superposições"], [
    B(undefined, 5, jam("Vamp de fusion", "Lá dórico", 100, "funk", ["Am7@5", "D7@5"])),
    B("Modal + alterado", 5, "Base: 8 compassos de **Am7** (dórico) e 1 compasso de **E7alt** que volta para Am7. No Am7: 3NPS, penta de Mi por cima (mês 11). No E7alt: alterada (Fá menor melódica)."),
    B("Fusion", 15, jam("Fusion", "Lá dórico", 100, "funk", ["Am7@5", "Am7@5", "Am7@5", "Am7@5", "Am7@5", "Am7@5", "Am7@5", "E7alt"]), box(5, "melodicMinor", 0, 4, "Fá menor melódica = Mi alterada."), rec("m12-fusion")),
    B("Qual escala?", 5, ear("scale", ["dorian", "altered", "melodicMinor"])),
  ]),

  lesson(337, "Revisão da semana 49", ["Sextinas, pre-bends, swells", "Legato e tapping", "Rock e fusion"], [
    B("Aquecimento", 6, tab("Legato 3NPS", 75, LEGATO_3NPS)),
    B("O que você já sabe", 4, list("Sextinas em cascata", "Pre-bend e release afinados", "Volume swell", "Legato 3NPS e tapping", "Rock e fusion com o vocabulário do ano")),
    B("Mini-desafio", 15, jam("Fusion", "Lá dórico", 100, "funk", ["Am7@5", "Am7@5", "Am7@5", "E7alt"]), checks("sem49", "Semana 49 concluída", "Sextinas a 70 BPM", "Pre-bend afinado em 3 de 5", "Solo de fusion com o V7alt resolvendo")),
    B("Qual escala?", 5, ear("scale", ["pentaMinor", "dorian", "altered", "lydian"])),
  ]),

  lesson(338, "Síntese blues-jazz: comping", ["Acompanhar um jazz blues", "Usar shells, drop 2 e diminutos", "Charleston e antecipações"], [
    B(undefined, 5, jam("Blues em Lá", "Lá", 90, "shuffle", BLUES_A)),
    B("Jazz blues em Fá", 8, { list: ["| F7 | Bb7 | F7 | Cm7 F7 |", "| Bb7 | Bb7 | F7 | Am7 D7 |", "| Gm7 | C7 | F7 D7 | Gm7 C7 |"] }, "Use shells (mês 7) e drop 2. No compasso 6, experimente um **B°7** (diminuto de passagem) no lugar do segundo Bb7.", chords("F7", "Bb7", "Gm7@shell", "C7@shell")),
    B("Comping", 12, jam("Jazz blues em Fá", "Fá", 120, "jazz", JAZZ_BLUES_F), rec("m12-comping")),
    B("Qual tipo de acorde?", 5, ear("quality", ["7", "m7", "maj7", "dim7"])),
  ]),

  lesson(339, "Síntese blues-jazz: solo", ["Misturar pentatônica, guias e enclosures", "Usar alterada no V7 que resolve", "Duas voltas com forma"], [
    B(undefined, 5, jam("Jazz blues em Fá", "Fá", 120, "jazz", JAZZ_BLUES_F)),
    B("Camadas", 5, list("**Base:** pentatônica de Fá (menor e maior misturadas, mês 4).", "**Trocas:** guias e enclosures nos acordes novos (meses 6 e 11).", "**D7 e C7:** alterada quando resolvem (mês 10).")),
    B("Solo", 15, box(5, "blues", 0, 4, "Escala blues de Fá, primeira posição."), arpBox("D7", 3, 7), jam("Jazz blues em Fá", "Fá", 110, "jazz", [...JAZZ_BLUES_F, ...JAZZ_BLUES_F]), rec("m12-jazzblues")),
    B("Qual escala?", 5, ear("scale", ["blues", "mixolydian", "altered"])),
  ]),

  lesson(340, "Síntese MPB/bossa: chord melody", ["Tocar melodia e harmonia juntas", "Bossa com drop 2 e drop 3", "Arranjo de 8 compassos"], [
    B(undefined, 5, changes(["Am7@d3", "Dm7@d3", "G7@d3", "Cmaj7@d3"], 75)),
    B("Arranjo", 8, "Arranjo original no estilo da bossa: acorde no tempo 1 (drop 3, polegar no baixo) e melodia nas cordas agudas no resto do compasso.", tab("Chord melody de bossa (original)", 70, [c("Am7@d3", 1.5), n(2, 5, 0.5), n(2, 8, 1), n(2, 5, 1), c("Dm7@d3", 1.5), n(2, 6, 0.5), n(2, 5, 1), n(2, 3, 1), c("G7@d3", 1.5), n(2, 3, 0.5), n(2, 6, 1), n(1, 3, 1), c("Cmaj7@d3", 4)])),
    B("Com a base", 12, jam("Bossa", "Dó", 110, "bossa", ["Am7@d3", "Dm7@d3", "G7@d3", "Cmaj7@d3"]), rec("m12-chordmelody")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(341, "Síntese MPB: samba e baião", ["Solar sobre samba com síncope", "Solar sobre baião em mixolídio", "Trocar de estilo na mesma sessão"], [
    B(undefined, 5, jam("Bossa", "Dó", 110, "bossa", ["Am7@d3", "Dm7@d3", "G7@d3", "Cmaj7@d3"])),
    B("Dois brasis", 5, list("**Samba:** frases curtas, sincopadas, repetidas (mês 6) + guias (mês 6).", "**Baião:** Sol mixolídio (mês 9) com a célula *TUM - tu TUM* no ritmo da frase.")),
    B("Samba e baião", 15, jam("Samba", "Dó", 90, "samba", ["Dm7@5", "G7@3", "Cmaj7@3", "A7@5"]), jam("Baião", "Sol mixolídio", 100, "baiao", ["G7@3", "G7@3", "F", "G7@3"]), rec("m12-brasil")),
    B("Qual escala?", 5, ear("scale", ["mixolydian", "ionian", "dorian"])),
  ]),

  lesson(342, "Transcrição: o método", ["Separar ritmo e altura", "Achar a primeira nota", "Ouvir trechos curtos"], [
    B(undefined, 5, jam("Samba", "Dó", 90, "samba", ["Dm7@5", "G7@3", "Cmaj7@3", "A7@5"])),
    B("Como transcrever", 10,
      ol("Escolha um trecho **curto** (2 a 4 compassos).", "**Cante** antes de tocar. Se não consegue cantar, ouça mais.", "Escreva o **ritmo** primeiro (bata palmas, conte *1 e 2 e*).", "Ache a **primeira nota** na guitarra. As outras vêm por intervalo.", "Desacelere o áudio **sem mudar a altura** (a maioria dos players tem essa opção) para trechos rápidos.", "Só **depois** compare com uma transcrição publicada, se houver."),
      theory("O currículo chama isso de **ciclo voz–ouvido–braço**: se você consegue cantar, consegue ouvir; se consegue ouvir, consegue achar no braço."),
    ),
    B("Primeiro exercício", 10, "Grave você tocando uma frase curta qualquer. Espere um dia. Ouça a gravação e transcreva sem olhar a mão. Hoje, grave a frase:", rec("m12-transc-1"), ear("degree", ["1", "2", "3", "4", "5", "6", "7"])),
    B("Qual intervalo?", 5, ear("interval", ["2M", "3m", "3M", "4J", "5J", "6M"])),
  ]),

  lesson(343, "Ditado rítmico", ["Escrever o ritmo de uma frase", "Reconhecer figuras de ouvido", "Usar a contagem falada"], [
    B(undefined, 5, ear("degree", ["1", "3", "5", "6"])),
    B("Só o ritmo", 8, "Toque o exemplo abaixo **sem olhar a tela** (peça para alguém apertar Tocar, ou feche os olhos). Escreva as figuras num papel. Depois confira.", tab("Ditado 1 (feche os olhos)", 70, [n(3, 5, 1.5), n(3, 7, 0.5), n(2, 5, 1), r(1), n(2, 5, 0.5), n(2, 8, 0.5), n(2, 5, 0.5), n(3, 7, 0.5), n(3, 5, 2)])),
    B("Mais ditados", 12, tab("Ditado 2 (feche os olhos)", 70, [r(0.5), n(2, 5, 0.5), n(2, 8, 1), n(2, 5, 0.25), n(3, 7, 0.25), n(3, 5, 0.5), n(4, 7, 1), n(4, 7, 0.75), n(4, 5, 0.25), n(5, 7, 3)]), tab("Ditado 3 (feche os olhos)", 70, [n(1, 5, 1 / 3), n(2, 8, 1 / 3), n(2, 5, 1 / 3), n(3, 7, 1), n(3, 5, 0.5), n(3, 7, 0.5), n(2, 5, 1.5), n(2, 8, 0.5), n(1, 5, 2)])),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(344, "Revisão da semana 50", ["Sínteses de blues-jazz e MPB", "Método de transcrição", "Ditado rítmico"], [
    B("Aquecimento", 6, jam("Jazz blues em Fá", "Fá", 115, "jazz", JAZZ_BLUES_F)),
    B("O que você já sabe", 4, list("Comping de jazz blues", "Chord melody de bossa", "Samba e baião no solo", "Transcrição: ritmo, primeira nota, intervalos")),
    B("Mini-desafio", 15, rec("m12-transc-1b", "Transcreva a frase gravada no dia 342 e grave você tocando a transcrição."), checks("sem50", "Semana 50 concluída", "Comping de jazz blues uma volta inteira", "Chord melody de bossa de 4 compassos", "Transcrevi minha frase do dia 342")),
    B("Qual grau?", 5, ear("degree", ["1", "2", "3", "4", "5", "6", "7"])),
  ]),

  lesson(345, "Transcrever acordes pelo baixo", ["Cantar o baixo de uma progressão", "Deduzir os graus", "Escolher a qualidade pelo ouvido"], [
    B(undefined, 5, ear("degree", ["1", "4", "5", "6"])),
    B("O baixo conta a história", 8, ol("Ouça a progressão e **cante só o baixo**.", "Descubra o **grau** de cada nota do baixo em relação à tônica.", "Para cada grau, o campo harmônico sugere a qualidade (ii = m7, V = 7…).", "Confira a **qualidade** de ouvido: soa maior, menor ou dominante?")),
    B("Ditados de progressão", 12, ear("progression", ["I vi IV V", "I IV V I", "ii7 V7 Imaj7", "I V vi IV", "vi IV I V"]), ear("progression", ["I vi ii7 V7", "I V7/vi vi IV", "IV ivm I", "i VI VII i"])),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(346, "Transcrever o próprio solo", ["Gravar um solo curto", "Transcrever trechos dele", "Ver o que você realmente toca"], [
    B(undefined, 5, ear("progression", ["I vi ii7 V7", "ii7 V7 Imaj7", "I V7/vi vi IV"])),
    B("Espelho", 5, "Transcrever o próprio solo mostra seus **vícios** (as frases que você sempre repete) e seus **achados** (ideias boas que você nem percebeu). É também uma parte do projeto final."),
    B("Grave e transcreva", 15, jam("ii–V–I em Dó", "Dó", 90, "jazz", ["Dm7@5", "G7@3", "Cmaj7@3", "A7@5"]), rec("m12-proprio", "Grave 4 compassos de solo."), "Transcreva a gravação num papel (tablatura com ritmo embaixo, igual às da Pauta). Marque com um círculo as notas-guia e os enclosures que você encontrar."),
    B("Qual grau?", 5, ear("degree", ["1", "2", "3", "4", "5", "6", "7"])),
  ]),

  lesson(347, "Leitura com final improvisado", ["Ler uma melodia nova", "Continuar improvisando no estilo", "Ligar leitura e criação"], [
    B(undefined, 5, ear("degree", ["1", "3", "5", "7"])),
    B("Ler, depois criar", 5, "A melodia abaixo tem **4 compassos escritos** e **2 compassos de pausa**. Leia os 4 (sem ouvir antes!) e **improvise os 2 últimos** continuando a ideia."),
    B("Leitura", 15, tab("Melodia nova (original): leia sem ouvir antes", 70, READING, { backing: ["Dm7", "G7", "Cmaj7", "Am7", "Dm7", "G7"] }), jam("Base para continuar", "Dó", 70, "bossa", ["Dm7@5", "G7@3", "Cmaj7@3", "Am7@5", "Dm7@5", "G7@3"]), rec("m12-leitura")),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(348, "Revisão dos eixos 1 e 2: braço e ritmo", ["Revisar geografia do braço", "Revisar figuras e levadas", "Medir onde você está"], [
    B(undefined, 5, tuner),
    B("Eixo 1 · braço · Eixo 2 · ritmo", 5, list("Notas em todas as cordas até a 12ª casa (mês 3).", "Oitavas e o desvio G–B (mês 3).", "As 15 figuras de semicolcheia (mês 4).", "Síncope, 6/8, swing, shuffle (mês 6).", "Levadas: folk, funk, reggae, bossa, samba, baião (meses 2–6).")),
    B("Teste rápido", 15, box(0, [0, 2, 4, 5, 7, 9, 11], 0, 12, "Diga as notas sem olhar, depois confira.", { label: "note", highlight: "none" }), strum("Levadas em sequência", 80, [...bars(["Am7@5"], STR.funk16), ...bars(["Am7@5"], STR.bossa), ...bars(["Am7@5"], STR.samba), ...bars(["Am7@5"], STR.folk)]), checks("eixo12", "Eixos 1 e 2", "Acho qualquer nota em até 3 segundos", "Toco as 15 figuras a 80", "Toco 4 levadas brasileiras e 2 de rock/funk")),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(349, "Revisão dos eixos 3 e 4: intervalos e acordes", ["Revisar intervalos", "Revisar tríades, tétrades e voicings", "Medir"], [
    B(undefined, 5, ear("interval", ["2m", "2M", "3m", "3M", "4J", "TT", "5J", "6m", "6M", "7m", "7M", "8J"])),
    B("Eixo 3 · intervalos · Eixo 4 · acordes", 5, list("Todos os intervalos simples no braço e de ouvido (mês 3).", "Tríades M, m, dim, aug, sus e inversões (mês 3).", "Tétrades e campo em tétrades (mês 5).", "Shells, drop 2, drop 3 (mês 7).", "Tensões e alterações (meses 9–10).")),
    B("Teste rápido", 15, changes(["Cmaj7@d2b", "A7@d2", "Dm7@d2", "G7@d2", "Em7@d2", "A7@d2b", "Dm7", "G7@d2o", "Cmaj7@d2"], 80), chords("G7b9", "G7#9", "Bm7b5", "C#dim7"), checks("eixo34", "Eixos 3 e 4", "80% de acerto nos 12 intervalos", "Progressão em drop 2 sem saltos", "Monto 7(b9), 7(#9), m7(b5) e °7")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5", "dim7", "7alt"])),
  ]),

  lesson(350, "Revisão dos eixos 5 e 6: harmonia e escalas", ["Revisar funções e acordes de fora", "Revisar escalas e modos", "Medir"], [
    B(undefined, 5, ear("progression", ["ii7 V7 Imaj7", "ii7 bII7 Imaj7", "IV ivm I", "I V7/vi vi IV"])),
    B("Eixo 5 · harmonia · Eixo 6 · escalas", 5, list("Funções T, SD, D e cadências (mês 5).", "Campos menores, secundários, subV7, empréstimo (mês 8).", "Pentatônicas, blues, CAGED (meses 2–4).", "3NPS, linear, 7 modos (mês 9).", "Menor harmônica e melódica, alterada (mês 10).")),
    B("Teste rápido", 15, drone(0), tab("Escada dos modos", 85, ["lydian", "ionian", "mixolydian", "dorian", "aeolian", "phrygian", "locrian"].flatMap((md) => run(0, md as never, 7, 10, 0.5, { down: false, startOnRoot: true }).slice(0, 8))), checks("eixo56", "Eixos 5 e 6", "Analiso uma progressão com secundário, subV e empréstimo", "Toco os 7 modos sobre o drone", "Toco a alterada e o frígio dominante resolvendo")),
    B("Qual escala?", 5, ear("scale", ["lydian", "mixolydian", "dorian", "phrygian", "altered", "phrygianDominant"])),
  ]),

  lesson(351, "Revisão dos eixos 7 e 8: improviso e ouvido", ["Revisar ferramentas de improviso", "Revisar o treino de ouvido", "Medir"], [
    B(undefined, 5, ear("degree", ["1", "2", "3", "4", "5", "6", "7"])),
    B("Eixo 7 · improviso · Eixo 8 · ouvido", 5, list("Notas-guia, chord-tones nos tempos fortes (mês 6).", "Aproximações e enclosures (mês 11).", "Motivo e suas transformações (mês 11).", "Fraseado vocal, espaço, dinâmica (meses 6 e 11).", "Ciclo voz–ouvido–braço e transcrição (mês 12).")),
    B("Teste rápido", 15, jam("Blues em Lá", "Lá", 90, "shuffle", BLUES_A), rec("m12-eixo78"), checks("eixo78", "Eixos 7 e 8", "Uma volta com motivo, pausas e enclosures", "Transcrevi 2 compassos da gravação", "80% em graus e progressões")),
    B("Qual progressão?", 5, ear("progression", ["I vi ii7 V7", "ii7 V7 Imaj7", "i iv V7 i", "I V7/vi vi IV"])),
  ]),

  lesson(352, "Projeto final: como analisar uma cifra nova", ["Seguir um roteiro de análise", "Achar o tom e os desvios", "Planejar a escala de cada trecho"], [
    B(undefined, 5, ear("progression", ["I vi ii7 V7", "I V7/vi vi IV", "IV ivm I"])),
    B("O roteiro", 10,
      ol("**Tom:** primeiro e último acorde + o V7 que resolve.", "**Graus:** escreva o grau de cada acorde.", "**Funções:** T, SD, D.", "**Desvios:** marque secundários (7 que não é o V), subV7 (7 que desce meio tom), empréstimos (acordes do menor paralelo).", "**Padrões:** ii–V, I–vi–ii–V, cadências.", "**Alvos:** a 3ª de cada acorde de fora."),
      "Pratique com esta cifra de treino:",
      { list: [`| ${PRACTICE.join(" | ")} |`] },
    ),
    B("Resposta", 10, { callout: "theory", title: "Análise da cifra de treino", text: ["Tom: Dó maior.", "| I V7/ii | ii V | iii V7/ii | ii V | IV ivm | iii V7/ii | ii subV7 | I |", "Desvios: **A7** (V7/ii, alvo C#), **Fm6** (empréstimo, alvo Ab), **Db7** (subV7, alvos F e Cb)."] }, jam("Cifra de treino", "Dó", 90, "bossa", PRACTICE)),
    B("Qual tipo de acorde?", 5, ear("quality", ["maj7", "m7", "7", "m6"])),
  ]),

  lesson(353, "A cifra do projeto", ["Analisar a cifra do projeto final", "Marcar os alvos", "Tocar os acordes"], [
    B(undefined, 5, jam("Cifra de treino", "Dó", 90, "bossa", PRACTICE)),
    B("A cifra", 10,
      "Esta é a cifra do projeto final (original da Pauta). **Analise antes de abrir a resposta**: escreva os graus, as funções e marque os desvios.",
      { list: ["| Gmaj7 Em7 | Am7 D7 | Bm7 E7 | Am7 D7 |", "| Gmaj7 G7 | Cmaj7 Cm6 | Bm7 E7 | Am7 D7 |", "| Em7 A7 | Am7 D7 | Gmaj7 E7 | Am7 D7 |"] },
      warn("Não role para baixo antes de terminar a sua análise."),
    ),
    B("Resposta e acordes", 10, { callout: "theory", title: "Análise do projeto", text: ["Tom: **Sol maior**. Dois acordes por compasso.", "| I vi | ii V | iii **V7/ii** | ii V |", "| I **V7/IV** | IV **ivm6** | iii **V7/ii** | ii V |", "| vi **V7/V** | ii V | I **V7/ii** | ii V |", "Alvos dos desvios: **E7 → G#**, **G7 → B**, **Cm6 → Eb**, **A7 → C#**."] }, chords("Gmaj7@3", "Em7", "Am7@5", "D7@5", "Bm7", "E7", "G7@3", "Cmaj7@3")),
    B("Qual progressão?", 5, ear("progression", ["I vi ii7 V7", "iii7 V7/ii ii7 V7", "IV ivm I"])),
  ]),

  lesson(354, "Gravar a base no estilo", ["Escolher o estilo", "Gravar você tocando os acordes", "Usar voicings do mês 7"], [
    B(undefined, 5, jam("Projeto (bossa)", "Sol", 90, "bossa", PROJECT)),
    B("Seu estilo", 5, list("**Bossa:** drop 3 com polegar no baixo, levada do mês 6.", "**Jazz:** shells e drop 2 em Charleston, swing.", "**Pop/MPB:** levada folk com acordes de cor."), "O projeto pede que **você** grave a base. A base da Pauta serve para ensaiar."),
    B("Gravar", 15, jam("Projeto (jazz)", "Sol", 90, "jazz", PROJECT), rec("m12-base", "Grave você tocando a cifra inteira no estilo escolhido, a 90 BPM, com metrônomo no fone se puder.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m6"])),
  ]),

  lesson(355, "Planejar o improviso", ["Escolher motivo e alvos", "Decidir onde ficam as pausas", "Planejar as duas voltas"], [
    B(undefined, 5, jam("Projeto", "Sol", 90, "bossa", PROJECT)),
    B("O plano", 8, ol("**Motivo:** escolha 3 a 5 notas da escala de Sol.", "**Alvos:** marque as 3ªs dos desvios (G#, B, Eb, C#).", "**Pausas:** pelo menos uma a cada 4 compassos.", "**Volta 1:** mais calma, registro médio, motivo e variações.", "**Volta 2:** mais aguda, enclosures, um clímax no compasso 9–10, final no Sol."), arpBox("E7", 3, 7, "E7: alvo G#."), arpBox("A7", 3, 7, "A7: alvo C#.")),
    B("Teste do plano", 12, jam("Projeto", "Sol", 85, "bossa", [...PROJECT, ...PROJECT]), rec("m12-plano")),
    B("Qual grau?", 5, ear("degree", ["1", "2", "3", "4", "5", "6", "7"])),
  ]),

  lesson(356, "Improviso · volta 1", ["Tocar a primeira volta com calma", "Motivo e pausas", "Acertar os alvos"], [
    B(undefined, 5, box(G, "major", 2, 6, "Sol maior na região da casa 3.")),
    B("Foco da volta 1", 5, list("Registro médio (casas 2 a 8).", "Motivo + 3 transformações.", "Alvos certos nos desvios.", "Pausas.")),
    B("Volta 1", 15, jam("Projeto", "Sol", 90, "bossa", PROJECT), rec("m12-volta1"), check("Ouça e confira os alvos: G# no E7 (compassos 3, 7 e 11), B no G7 (compasso 5), Eb no Cm6 (compasso 6), C# no A7 (compasso 9).")),
    B("Qual tipo de acorde?", 5, ear("quality", ["maj7", "m7", "7", "m6"])),
  ]),

  lesson(357, "Improviso · volta 2", ["Subir a intensidade", "Enclosures nos desvios", "Clímax e final"], [
    B(undefined, 5, jam("Projeto", "Sol", 90, "bossa", PROJECT)),
    B("Foco da volta 2", 5, list("Registro agudo (casas 7 a 15).", "Enclosures nos alvos.", "Clímax nos compassos 9–10 (nota mais aguda, bend ou sextina).", "Final na tônica, com vibrato.")),
    B("Volta 2", 15, box(G, "major", 7, 12, "Sol maior na região da casa 10."), jam("Projeto (2 voltas)", "Sol", 90, "bossa", [...PROJECT, ...PROJECT]), rec("m12-volta2")),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m", "3M"])),
  ]),

  lesson(358, "Revisão da semana 51", ["Projeto: análise, base, plano e voltas", "Ouvir com olhos de banca", "Ajustar"], [
    B("Aquecimento", 6, jam("Projeto", "Sol", 90, "bossa", PROJECT)),
    B("Checklist", 4, list("Análise escrita", "Base gravada", "Volta 1 e volta 2 gravadas", "Falta: transcrever trechos do solo")),
    B("Ajustes", 15, jam("Projeto", "Sol", 90, "jazz", [...PROJECT, ...PROJECT]), checks("sem51", "Semana 51 concluída", "Análise conferida", "Base no estilo, sem parar", "Duas voltas de solo com alvos certos")),
    B("Qual progressão?", 5, ear("progression", ["I vi ii7 V7", "iii7 V7/ii ii7 V7", "IV ivm I"])),
  ]),

  lesson(359, "Transcrever trechos do próprio solo", ["Escolher os melhores 4 compassos", "Transcrever ritmo e notas", "Marcar alvos e motivo"], [
    B(undefined, 5, ear("degree", ["1", "3", "5", "7"])),
    B("A última parte do projeto", 5, ol("Ouça suas gravações das voltas 1 e 2.", "Escolha **dois trechos de 2 a 4 compassos**: o melhor da volta 1 e o melhor da volta 2.", "Transcreva (ritmo primeiro, depois notas).", "Marque: **motivo**, **alvos**, **enclosures**.")),
    B("Transcrever", 15, "Use papel ou um editor de tablatura. Se precisar, ouça as gravações abaixo de novo.", rec("m12-transc-solo", "Grave você tocando a transcrição para conferir com o original.")),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m", "3M", "4J", "5J"])),
  ]),

  lesson(360, "Ajustes finais", ["Escolher o que melhorar", "Treinar só isso", "Deixar o projeto pronto"], [
    B(undefined, 5, jam("Projeto", "Sol", 90, "bossa", PROJECT)),
    B("Um ponto por vez", 5, "Releia seus checklists das semanas 49 a 51. Escolha **um** ponto que ainda falha e treine **só ele** hoje: um alvo que sempre escapa, uma troca de acorde da base, um trecho da transcrição."),
    B("Treino focado", 15, jam("Projeto (mais lento)", "Sol", 75, "bossa", PROJECT), jam("Projeto", "Sol", 90, "bossa", PROJECT)),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m6", "m7b5"])),
  ]),

  lesson(361, "Ensaio geral 1", ["Simular o projeto inteiro", "Base + solo + transcrição", "Cronometrar"], [
    B(undefined, 5, tuner),
    B("Simulado completo", 5, ol("Análise (5 min, sem consultar).", "Base gravada (1 tomada).", "Duas voltas de solo (1 tomada).", "Transcrição de 2 compassos (10 min).")),
    B("Faça", 15, jam("Simulado", "Sol", 90, "bossa", [...PROJECT, ...PROJECT]), rec("m12-ensaio1"), checks("ensaio12a", "Ensaio 1", "Análise certa", "Base sem parar", "Solo com alvos, motivo e pausas", "Transcrição feita")),
    B("Qual progressão?", 5, ear("progression", ["I vi ii7 V7", "iii7 V7/ii ii7 V7", "IV ivm I"])),
  ]),

  lesson(362, "Ensaio geral 2: outro estilo", ["Tocar o projeto em outro estilo", "Adaptar a base e o fraseado", "Escolher a versão final"], [
    B(undefined, 5, jam("Projeto (bossa)", "Sol", 90, "bossa", PROJECT)),
    B("Mesma cifra, outro mundo", 5, "Toque o projeto num estilo **diferente** do que você escolheu: se fez bossa, faça swing; se fez swing, faça bossa. Adapte o fraseado: no swing, colcheias suingadas e enclosures; na bossa, síncopes e notas longas."),
    B("Faça", 15, jam("Projeto (swing)", "Sol", 100, "jazz", [...PROJECT, ...PROJECT]), rec("m12-ensaio2"), check("Qual versão ficou mais sua? É essa que você apresenta amanhã.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m6"])),
  ]),

  lesson(363, "Véspera: descanso ativo", ["Revisar sem cansar", "Tocar por prazer", "Chegar descansado"], [
    B(undefined, 5, "Hoje é dia de tocar leve. O cérebro consolida durante o descanso: é ciência (lembra da prática distribuída do começo do curso?).", jam("Blues em Lá", "Lá", 85, "shuffle", BLUES_A)),
    B("Repertório do ano", 5, "Toque, só por prazer, uma coisa de cada trimestre: o Hino à Alegria (mês 1), o blues em Lá (mês 4), a valsa em tétrades (mês 5), o groove dórico (mês 9)."),
    B("Tocar por prazer", 15, jam("Valsa em tétrades", "Dó", 120, "waltz", ["Cmaj7", "Cmaj7", "Am7", "Am7", "Dm7", "Dm7", "G7", "G7"]), jam("Groove dórico", "Lá dórico", 95, "funk", ["Am7@5", "D7@5"])),
    B("Para relaxar", 5, ear("which-chord", ["G", "C", "D", "Em"])),
  ]),

  lesson(364, "Projeto final · parte 1: análise e base", ["Analisar a cifra", "Gravar a base definitiva", "Preparar o terreno para amanhã"], [
    B("Aquecimento", 5, tuner, changes(["Gmaj7@3", "Em7", "Am7@5", "D7@5"], 80)),
    B("Análise", 5, "Escreva a análise completa da cifra do projeto, **sem consultar** o dia 353: tom, graus, funções, desvios e alvos.", { list: ["| Gmaj7 Em7 | Am7 D7 | Bm7 E7 | Am7 D7 |", "| Gmaj7 G7 | Cmaj7 Cm6 | Bm7 E7 | Am7 D7 |", "| Em7 A7 | Am7 D7 | Gmaj7 E7 | Am7 D7 |"] }),
    B("Base definitiva", 15, rec("m12-base-final", "Grave a base definitiva, no seu estilo, a 90 BPM."), checks("proj1", "Parte 1", "Análise completa e certa", "Base gravada sem parar", "Estilo reconhecível")),
    B("Qual progressão?", 5, ear("progression", ["iii7 V7/ii ii7 V7", "I V7/IV IV ivm", "vi V7/V ii7 V7"])),
  ]),

  lesson(365, "Projeto final", ["Improvisar duas voltas sobre a cifra", "Dois acordes por compasso com desvios tonais", "Transcrever trechos do próprio solo"], [
    B("Aquecimento", 5, tuner, box(G, "major", 2, 6)),
    B("As regras", 3, list("Base a **90 BPM** (a sua gravação de ontem ou a da Pauta).", "**Duas voltas** de 12 compassos de improviso, numa tomada.", "**Alvos** nos desvios: G# no E7, B no G7, Eb no Cm6, C# no A7.", "**Motivo**, **pausas** e **enclosures**.", "Depois: **transcreva** 2 trechos de 2 a 4 compassos do seu solo.")),
    B("Projeto final", 15, jam("Projeto final", "Sol", 90, "bossa", [...PROJECT, ...PROJECT]), rec("m12-final", "Grave o projeto final."), checks("projfinal", "Projeto final", "Análise da cifra inédita", "Base gravada no estilo", "Duas voltas com 2 acordes por compasso e desvios tonais", "Trechos do solo transcritos"), bpmlog(12, 90)),
    B("Fim do ano. Começo do resto.", 7,
      "Você chegou ao **dia 365**. Do primeiro Mi menor até um solo sobre dominantes secundários, subV e empréstimo modal, com motivo e enclosures. Isso é o patamar de um **intermediário autônomo**: você consegue aprender sozinho daqui para frente.",
      list("**Continue transcrevendo:** um trecho por semana de quem você admira.", "**Toque com gente:** jams, rodas de samba, bandas. Nada substitui.", "**Repita meses:** o curso é uma espiral. Refazer o mês 8 daqui a seis meses é outra experiência.", "**Ensine alguém:** é o jeito mais rápido de descobrir o que você sabe."),
      tip("Obrigado por estudar com a Pauta. Se o curso te ajudou, conte para alguém: ele é livre e aberto."),
    ),
  ]),
];

