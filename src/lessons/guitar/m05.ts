// Mês 5 · dias 121 a 150 · Tétrades e funções
import type { Lesson } from "../types";
import { arp1, arpBox, arpProg, B, bars, bpmlog, changes, check, checks, chords, ear, jam, lesson, list, n, ol, r, rec, STR, strum, tab, theory, tip, warn, whichChord } from "./lib";

/* ii–V–I em quatro tons, com voicings perto (tônicas nas cordas 6 e 5). */
const IIVI = {
  C: ["Dm7@5", "G7@3", "Cmaj7@3", "Cmaj7@3"],
  G: ["Am7@5", "D7@5", "Gmaj7@3", "Gmaj7@3"],
  A: ["Bm7", "E7@7", "Amaj7@5", "Amaj7@5"],
  B: ["C#m7", "F#7", "Bmaj7", "Bmaj7"],
};
/** Arpejos de 1 oitava para o ii–V–I (acorde, corda da tônica, casa). */
const IIVI_ARP = {
  C: arpProg([["Dm7", 5, 5], ["G7", 6, 3], ["Cmaj7", 5, 3], ["Cmaj7", 5, 3]]),
  G: arpProg([["Am7", 6, 5], ["D7", 5, 5], ["Gmaj7", 6, 3], ["Gmaj7", 6, 3]]),
  A: arpProg([["Bm7", 5, 2], ["E7", 6, 0], ["Amaj7", 5, 0], ["Amaj7", 5, 0]]),
  Aup: arpProg([["Bm7", 6, 7], ["E7", 5, 7], ["Amaj7", 6, 5], ["Amaj7", 6, 5]]),
  B: arpProg([["C#m7", 5, 4], ["F#7", 6, 2], ["Bmaj7", 5, 2], ["Bmaj7", 5, 2]]),
};

const FIELD_C = ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bm7b5", "Cmaj7"];
const FIELD_C_MOV = ["Cmaj7@3", "Dm7@5", "Em7@7", "Fmaj7@1", "G7@3", "Am7@5", "Bm7b5", "Cmaj7@3"];
const FIELD_G = ["Gmaj7@3", "Am7@5", "Bm7", "Cmaj7@3", "D7@5", "Em7", "F#m7b5", "Gmaj7@3"];

/** Melodia original sobre I–vi–ii–V em Sol (Pauta). */
const TUNE_G = [
  n(2, 7, 1), n(2, 8, 0.5), n(1, 7, 0.5), n(2, 8, 1), n(3, 7, 1),
  n(2, 8, 1.5), n(2, 5, 0.5), n(3, 7, 2),
  n(2, 5, 1), n(2, 8, 0.5), n(1, 5, 0.5), n(1, 8, 1), n(2, 8, 1),
  n(2, 7, 2), n(3, 7, 2),
  n(2, 7, 1), n(1, 7, 1), n(1, 5, 1), n(2, 7, 1),
  n(2, 8, 1.5), n(1, 7, 0.5), n(1, 5, 2),
  n(2, 5, 1), n(2, 8, 1), n(2, 7, 1), n(3, 7, 1),
  n(3, 4, 4),
];

export const MONTH_5: Lesson[] = [
  lesson(121, "O ciclo das quintas", ["Entender a ordem dos tons", "Contar sustenidos e bemóis de cada tom", "Usar o ciclo para transpor"], [
    B(undefined, 5, "Bem-vindo ao mês 5. Revise o blues do mês passado.", jam("Blues em Lá", "Lá", 85, "shuffle", ["A7", "D7", "A7", "A7", "D7", "D7", "A7", "A7", "E7", "D7", "A7", "E7"])),
    B("Um relógio de tons", 12,
      "Comece em **C** e suba de **5ª em 5ª**: C → G → D → A → E → B → F#. Cada passo acrescenta **um sustenido**: Dó não tem nenhum, Sol tem 1 (F#), Ré tem 2 (F#, C#), Lá tem 3…",
      "Desça de **5ª em 5ª** (ou suba de 4ª em 4ª): C → F → Bb → Eb → Ab → Db → Gb. Cada passo acrescenta **um bemol**: Fá tem 1 (Bb), Si bemol tem 2…",
      theory(["Sustenidos, na ordem em que aparecem: **F# C# G# D# A# E#**.", "Bemóis, na ordem: **Bb Eb Ab Db Gb Cb** (a mesma lista ao contrário)."], "Armaduras"),
      tip("No braço o ciclo é fácil: a **5ª** está na corda vizinha mais aguda, duas casas à frente (o desenho do power chord). A **4ª** está na mesma casa, na corda vizinha mais aguda."),
    ),
    B("Rodando o ciclo", 8, changes(["C5", "G5", "D5", "A5@5", "E5@7"], 70, 2, "Quintas subindo"), changes(["C5", "F5", "Bb5", "G5"], 70, 2), "Diga em voz alta quantos sustenidos ou bemóis tem cada tom enquanto troca."),
    B("Qual tipo de acorde?", 5, ear("quality", ["", "m", "7"])),
  ]),

  lesson(122, "Tétrade maior com sétima maior (maj7)", ["Acrescentar a 7ª à tríade", "Montar Cmaj7 e Fmaj7", "Ouvir a cor da maj7"], [
    B(undefined, 5, changes(["C5", "G5", "D5", "A5@5", "E5@7"], 75, 2)),
    B("Quatro notas", 10,
      "Uma **tétrade** é uma tríade com mais uma terça em cima: **1, 3, 5, 7**. São os acordes do jazz, da bossa e do pop sofisticado.",
      "**maj7** (escreve-se Cmaj7, C7M ou CΔ): tríade maior + **7ª maior** (meio tom abaixo da oitava). Som suave, brilhante, *de fim de tarde*.",
      chords("Cmaj7", "Fmaj7", "Amaj7", "Gmaj7"),
      arpBox("Cmaj7", 2, 5, "Cmaj7: 1 (vermelho), 3, 5 e 7 (azul)."),
    ),
    B("Tríade × tétrade", 10, changes(["C", "Cmaj7", "F", "Fmaj7"], 65), tip("Ouça como a 7ª maior adiciona uma tensão macia, sem pedir resolução.")),
    B("Tríade ou tétrade?", 5, ear("quality", ["", "maj7"])),
  ]),

  lesson(123, "m7 e 7: menor com sétima e dominante", ["Montar m7 e 7", "Diferenciar 7 de maj7", "Ouvir a tensão do dominante"], [
    B(undefined, 5, changes(["C", "Cmaj7", "F", "Fmaj7"], 70)),
    B("Duas sétimas menores", 10,
      list("**m7** (Am7): tríade menor + **7ª menor**. Macio, melancólico sem ser triste.", "**7** (G7, dominante): tríade **maior** + **7ª menor**. Tenso, quer resolver. É o acorde do blues e o motor da harmonia."),
      chords("Am7", "Em7", "Dm7", "G7", "E7", "D7"),
      warn("Cuidado com a cifra: **C7** é dominante (7ª menor). **Cmaj7** é sétima maior. Uma letra muda tudo."),
    ),
    B("Comparando", 10, changes(["Cmaj7", "C7", "Am", "Am7"], 65), changes(["G7", "C", "E7", "Am"], 65), "Repare: **G7 → C** e **E7 → Am** soam como pergunta → resposta. É a tensão do dominante resolvendo."),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(124, "m7(b5) e °7", ["Montar o meio-diminuto e o diminuto", "Saber onde aparecem", "Ouvir as quatro qualidades"], [
    B(undefined, 5, ear("quality", ["maj7", "m7", "7"])),
    B("Os diminutos", 10,
      list("**m7(b5)** ou **ø** (meio-diminuto, Bm7b5): tríade diminuta + **7ª menor**. É o acorde do 7º grau da escala maior.", "**°7** (diminuto, Bdim7): tríade diminuta + **7ª diminuta** (uma casa abaixo da 7ª menor). Todas as notas a **3 casas** uma da outra: o desenho se repete a cada 3 casas."),
      chords("Bm7b5", "F#m7b5", "Bdim7", "Edim7"),
      theory("O °7 é **simétrico**: Bdim7 = Ddim7 = Fdim7 = Abdim7 (mesmas notas). Por isso só existem **três** diminutos diferentes."),
    ),
    B("Ouvindo a tensão", 10, changes(["Bm7b5", "E7", "Am7", "Am7"], 60), changes(["C", "C#dim7", "Dm7", "G7"], 60), tip("O C#dim7 entre C e Dm7 é um **diminuto de passagem**: o baixo sobe C → C# → D. Você vai estudar isso no mês 7.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(125, "Tétrades móveis: tônica na corda 6", ["Montar maj7, 7, m7 e m7(b5) com tônica na 6", "Mudar a qualidade movendo um dedo", "Usar em qualquer tom"], [
    B(undefined, 5, changes(["Bm7b5", "E7", "Am7"], 65)),
    B("Quatro desenhos, todos os tons", 10,
      "Com a tônica na **corda 6**, estes desenhos sobem e descem o braço como as pestanas. Todos em **Sol** (casa 3):",
      chords("Gmaj7@3", "G7@3", "Gm7", "G7@shell"),
      "E o meio-diminuto, também com tônica na corda 6:",
      chords("F#m7b5", "Am7b5"),
      tip("Para tocar em Lá, desça tudo para a casa 5. Em Fá, casa 1."),
    ),
    B("Mesma tônica, quatro cores", 10, changes(["Gmaj7@3", "G7@3", "Gm7", "G7@3"], 60), changes(["Am7@5", "A7@5", "Amaj7@5", "Am7b5"], 60)),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(126, "Tétrades móveis: tônica na corda 5", ["Montar as tétrades com tônica na 5", "Combinar com as da corda 6", "Trocar sem pular pelo braço"], [
    B(undefined, 5, changes(["Gmaj7@3", "G7@3", "Gm7"], 65)),
    B("O segundo jogo de desenhos", 10,
      "Com a tônica na **corda 5**, todos em **Dó** (casa 3):",
      chords("Cmaj7@3", "C7@3", "Cm7", "Bm7b5"),
      "Com os dois jogos, qualquer progressão fica dentro de 4 ou 5 casas.",
    ),
    B("Combinando", 10, changes(["Cm7", "F7", "Bbmaj7", "Bbmaj7"], 60), changes(["Dm7@5", "G7@3", "Cmaj7@3", "Am7@5"], 60), tip("Repare como a mão quase não se move: corda 5 → corda 6 → corda 5.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(127, "Revisão da semana 18", ["Ciclo das quintas", "As cinco tétrades", "Desenhos nas cordas 6 e 5"], [
    B("Aquecimento", 6, changes(["Cm7", "F7", "Bbmaj7", "Bbmaj7"], 65)),
    B("O que você já sabe", 4, list("Ciclo: C G D A E B F# (sustenidos) e C F Bb Eb Ab Db Gb (bemóis)", "maj7 = 1 3 5 7 · m7 = 1 b3 5 b7 · 7 = 1 3 5 b7", "m7(b5) = 1 b3 b5 b7 · °7 = 1 b3 b5 bb7", "Desenhos móveis com tônica nas cordas 6 e 5")),
    B("Mini-desafio", 15, changes(["Gmaj7@3", "G7@3", "Gm7", "F#m7b5"], 70), checks("sem18", "Semana 18 concluída", "Digo a armadura de qualquer tom maior pelo ciclo", "Monto as 4 qualidades com tônica na 6 e na 5", "Acerto maj7 × m7 × 7 de ouvido 8 em 10")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5", "dim7"])),
  ]),

  lesson(128, "O campo harmônico em tétrades", ["Empilhar 4 notas em cada grau", "Saber as qualidades de cor", "Tocar o campo de Dó"], [
    B(undefined, 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
    B("Sete tétrades", 10,
      "Faça como no mês 3, mas empilhe **quatro** notas da escala. O campo maior em tétrades:",
      list("**Imaj7** Cmaj7 · **iim7** Dm7 · **iiim7** Em7", "**IVmaj7** Fmaj7 · **V7** G7", "**vim7** Am7 · **viim7(b5)** Bm7b5"),
      theory("Em todo tom maior: **maj7, m7, m7, maj7, 7, m7, m7(b5)**. Só existe **um** dominante (o V7) e **um** meio-diminuto (o vii).", "A regra de ouro, versão 2"),
    ),
    B("O campo de Dó", 10, changes(FIELD_C, 60, 2, "Abertos"), changes(FIELD_C_MOV, 60, 2, "Móveis")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(129, "O campo em Sol e pelo braço", ["Transpor o campo para Sol", "Tocar o campo com desenhos móveis", "Achar os graus pelo nome"], [
    B(undefined, 5, changes(FIELD_C_MOV, 65, 2)),
    B("Mesma ordem, outro tom", 8,
      "Em **Sol**: Gmaj7, Am7, Bm7, Cmaj7, **D7**, Em7, **F#m7b5**. Repare no F#, o sustenido de Sol maior, aparecendo no vii.",
      chords("Gmaj7@3", "Am7@5", "Bm7", "Cmaj7@3", "D7@5", "Em7", "F#m7b5"),
    ),
    B("Subindo o campo", 12, changes(FIELD_G, 60, 2), ol("Diga o grau de cada acorde enquanto toca: *um, dois, três…*", "Depois toque só **I, IV e V**: Gmaj7, Cmaj7, D7.", "Depois **ii–V–I**: Am7, D7, Gmaj7.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(130, "Funções: casa, afastamento e tensão", ["Agrupar os acordes por função", "Entender o trítono do dominante", "Substituir acordes da mesma função"], [
    B(undefined, 5, changes(FIELD_G, 65, 2)),
    B("Três papéis", 12,
      list("**Tônica (T):** repouso, casa. I, iii, vi.", "**Subdominante (SD):** afastamento, caminho. IV, ii.", "**Dominante (D):** tensão, quer voltar. V7, vii."),
      "Por que o **V7** é tão tenso? Porque ele tem um **trítono** (6 casas) entre a 3ª e a 7ª. Em G7: **B** e **F**. O B quer subir para C e o F quer descer para E: as duas notas caem dentro do acorde de **C**.",
      { w: "fretboard", from: 2, frets: 7, markers: [{ s: 4, f: 3, label: "F", kind: "deg-7" }, { s: 3, f: 4, label: "B", kind: "deg-3" }, { s: 4, f: 2, label: "E", kind: "ghost" }, { s: 3, f: 5, label: "C", kind: "ghost" }], caption: "O trítono do G7 (cheias) resolvendo em E e C (vazadas): meio tom cada." },
      tip("Acordes da mesma função podem trocar de lugar. Em vez de **C**, toque **Am** (tônica). Em vez de **F**, toque **Dm** (subdominante)."),
    ),
    B("Trocando por função", 8, changes(["C", "F", "G7", "C"], 65), changes(["Am", "Dm", "G7", "C"], 65), changes(["Em", "F", "Bm7b5", "C"], 65)),
    B("Qual progressão?", 5, ear("progression", ["I IV V I", "vi ii V I", "I vi IV V"])),
  ]),

  lesson(131, "Cadências", ["Reconhecer as cadências principais", "Tocar a cadência de engano", "Terminar frases musicalmente"], [
    B(undefined, 5, changes(["Am", "Dm", "G7", "C"], 70)),
    B("Como frases terminam", 10,
      list("**Cadência perfeita (V–I):** ponto final.", "**Cadência plagal (IV–I):** o *amém* das igrejas. Mais suave.", "**Semicadência (termina no V):** vírgula, pede continuação.", "**Cadência de engano (V–vi):** o ouvido espera o I e vem o vi. Surpresa."),
    ),
    B("Quatro finais", 10, changes(["F", "G7", "C", "C"], 65, 4, "Perfeita"), changes(["C", "F", "C", "C"], 65, 4, "Plagal"), changes(["C", "F", "C", "G7"], 65, 4, "Semicadência"), changes(["F", "G7", "Am", "Am"], 65, 4, "De engano")),
    B("Qual progressão?", 5, ear("progression", ["IV V I", "IV I", "IV V vi"])),
  ]),

  lesson(132, "O ii–V–I", ["Tocar a progressão mais importante do jazz", "Usar voicings perto", "Tocar em Dó e em Sol"], [
    B(undefined, 5, changes(["F", "G7", "Am", "Am"], 70)),
    B("Subdominante, dominante, tônica", 8,
      "O **ii–V–I** é a cadência completa em miniatura: **SD → D → T**. Em Dó: **Dm7 → G7 → Cmaj7**. Aparece em jazz, bossa, MPB, pop e até no sertanejo.",
      chords("Dm7@5", "G7@3", "Cmaj7@3"),
      "Os três desenhos ficam entre as casas 2 e 5. A mão quase não anda.",
    ),
    B("ii–V–I em dois tons", 12, changes(IIVI.C, 60, 4, "Em Dó"), changes(IIVI.G, 60, 4, "Em Sol"), jam("ii–V–I em Dó (swing)", "Dó", 90, "jazz", IIVI.C)),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "IV V I", "vi IV I"])),
  ]),

  lesson(133, "Shells: o ii–V–I com 3 notas", ["Tocar só 1, 3 e 7", "Ver as notas-guia mudando", "Comping leve"], [
    B(undefined, 5, changes(IIVI.C, 65)),
    B("O essencial do acorde", 10,
      "Um acorde de 4 notas pode ser reduzido a **três**: tônica, **3ª** e **7ª**. A 5ª quase não muda o som. Esses acordes enxutos são os **shells**.",
      chords("Dm7@shell", "G7@shell", "Cmaj7@shell"),
      "Repare: no ii–V–I com shells, a **7ª de um acorde desce meio tom e vira a 3ª do próximo**. C (7ª do Dm7) → B (3ª do G7). F (7ª do G7) → E (3ª do Cmaj7). São as **notas-guia**.",
    ),
    B("Shells no tempo", 10, changes(["Dm7@shell", "G7@shell", "Cmaj7@shell", "Cmaj7@shell"], 70), jam("ii–V–I (swing)", "Dó", 100, "jazz", IIVI.C), tip("No jazz, o acorde não precisa soar em todos os tempos. Toque no 1 e no *e* do 2 (o *Charleston*).")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(134, "Revisão da semana 19", ["Campo em tétrades", "Funções e cadências", "ii–V–I com voicings e shells"], [
    B("Aquecimento", 6, changes(FIELD_C_MOV, 70, 2)),
    B("O que você já sabe", 4, list("Campo: maj7 m7 m7 maj7 7 m7 m7(b5)", "T (I iii vi) · SD (IV ii) · D (V vii)", "Trítono do V7 resolve por semitom", "ii–V–I: SD → D → T", "Shells: 1, 3, 7")),
    B("Mini-desafio", 15, changes(IIVI.G, 70), changes(["Am7@shell", "D7@shell", "Gmaj7@shell", "Gmaj7@shell"], 70), checks("sem19", "Semana 19 concluída", "Campo de Sol em tétrades sem olhar", "ii–V–I em Dó e Sol a 70 BPM", "Explico por que o V7 quer resolver")),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "IV V I", "IV V vi"])),
  ]),

  lesson(135, "Arpejo maj7 de uma oitava", ["Tocar as notas do acorde uma de cada vez", "Arpejar a partir das cordas 6 e 5", "Cantar as notas do acorde"], [
    B(undefined, 5, changes(IIVI.C, 70)),
    B("O acorde em fila", 10,
      "**Arpejo** é o acorde tocado nota por nota. No solo, arpejos mostram a harmonia mesmo sem acompanhamento. Comece pela **maj7**, a partir da tônica:",
      arpBox("Gmaj7", 2, 6, "Gmaj7: tônica na corda 6, casa 3."),
      arpBox("Cmaj7", 2, 6, "Cmaj7: tônica na corda 5, casa 3."),
    ),
    B("Arpejos", 10, tab("Gmaj7, uma oitava", 60, arp1("Gmaj7", 6, 3)), tab("Cmaj7, uma oitava", 60, arp1("Cmaj7", 5, 3)), "Cante junto: *um, três, cinco, sete, oito*."),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "7"])),
  ]),

  lesson(136, "Arpejos m7 e 7", ["Arpejar m7 e dominante", "Comparar a 7ª maior com a menor", "Usar a mesma região"], [
    B(undefined, 5, tab("Gmaj7", 70, arp1("Gmaj7", 6, 3))),
    B("Mudando um grau", 10,
      list("**m7:** baixe a 3ª e a 7ª da maj7.", "**7:** baixe só a 7ª."),
      arpBox("Am7", 4, 8, "Am7: tônica na corda 6, casa 5."),
      arpBox("D7", 3, 7, "D7: tônica na corda 5, casa 5."),
    ),
    B("Arpejos", 10, tab("Am7", 60, arp1("Am7", 6, 5)), tab("D7", 60, arp1("D7", 5, 5)), tab("G7 e Gmaj7: ouça a diferença", 60, [...arp1("G7", 6, 3, 0.5, { down: false }), r(1.5), ...arp1("Gmaj7", 6, 3, 0.5, { down: false }), r(1.5)])),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(137, "Arpejo m7(b5) e o ii–V–I arpejado", ["Arpejar o meio-diminuto", "Arpejar ii–V–I em Dó", "Ligar os arpejos sem parar"], [
    B(undefined, 5, tab("Am7", 70, arp1("Am7", 6, 5))),
    B("O último arpejo", 8,
      arpBox("Bm7b5", 1, 5, "Bm7(b5): tônica na corda 5, casa 2."),
      "Agora junte: **um compasso por acorde**, quatro notas subindo e quatro descendo. É exatamente o formato do desafio do mês.",
    ),
    B("ii–V–I em Dó, arpejado", 12, tab("ii–V–I arpejado em Dó", 60, IIVI_ARP.C, { backing: IIVI.C }), tab("Bm7b5", 60, arp1("Bm7b5", 5, 2))),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(138, "ii–V–I arpejado em Sol", ["Arpejar Am7–D7–Gmaj7", "Ficar numa região só", "Chegar a 60 BPM"], [
    B(undefined, 5, tab("ii–V–I em Dó", 65, IIVI_ARP.C, { backing: IIVI.C })),
    B("Primeiro tom do desafio", 5, "O desafio pede **Sol, Lá e Si** maior. Sol primeiro: Am7 (corda 6, casa 5) → D7 (corda 5, casa 5) → Gmaj7 (corda 6, casa 3). Tudo entre as casas 2 e 7."),
    B("Em Sol", 15, tab("ii–V–I arpejado em Sol", 60, IIVI_ARP.G, { backing: IIVI.G }), jam("ii–V–I em Sol", "Sol", 70, "jazz", IIVI.G), tip("Se travar na troca, toque só a primeira nota de cada arpejo no tempo 1. Depois complete.")),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "vi ii V I"])),
  ]),

  lesson(139, "ii–V–I arpejado em Lá e Si", ["Transpor a forma para Lá e Si", "Escolher a região", "Completar os três tons"], [
    B(undefined, 5, tab("ii–V–I em Sol", 65, IIVI_ARP.G, { backing: IIVI.G })),
    B("Mesma forma, outra casa", 8,
      "Em **Lá**, suba tudo duas casas a partir de Sol: Bm7 (corda 6, casa 7) → E7 (corda 5, casa 7) → Amaj7 (corda 6, casa 5). Em **Si**, mais duas: C#m7 (casa 9) → F#7 (casa 9) → Bmaj7 (casa 7).",
      "Também dá para tocar perto do começo do braço, com as tônicas nas cordas 5 e 6 trocadas. As duas versões estão abaixo.",
    ),
    B("Lá e Si", 12, tab("ii–V–I em Lá (casa 5)", 60, IIVI_ARP.Aup, { backing: IIVI.A }), tab("ii–V–I em Lá (primeira posição)", 60, IIVI_ARP.A, { backing: IIVI.A }), tab("ii–V–I em Si", 60, IIVI_ARP.B, { backing: IIVI.B })),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "IV V I", "vi ii V I"])),
  ]),

  lesson(140, "Analisando uma música", ["Escrever os graus de uma cifra", "Marcar as funções", "Achar o tom pelo V7"], [
    B(undefined, 5, tab("ii–V–I em Lá", 65, IIVI_ARP.Aup, { backing: IIVI.A })),
    B("Como analisar", 10,
      ol("Procure o **V7**: ele aponta o tom. Se tem **D7**, o tom provavelmente é **Sol**.", "Escreva o campo do tom e marque o grau de cada acorde.", "Marque **T, SD, D** embaixo.", "Procure padrões: ii–V–I, I–vi–ii–V, cadências."),
      "Tente com esta progressão original da Pauta (8 compassos):",
      { list: ["| Gmaj7 | Em7 | Am7 | D7 |", "| Bm7 | Em7 | Am7 D7 | Gmaj7 |"] },
    ),
    B("Resposta e prática", 10, { callout: "theory", title: "Análise", text: ["Tom: **Sol**. Graus: I – vi – ii – V | iii – vi – ii V – I.", "Funções: T – T – SD – D | T – T – SD D – T.", "O **iii** (Bm7) substitui o I: mesma função de tônica."] }, jam("A progressão", "Sol", 80, "jazz", ["Gmaj7@3", "Em7", "Am7@5", "D7@5", "Bm7", "Em7", "Am7@5 D7@5", "Gmaj7@3"])),
    B("Qual progressão?", 5, ear("progression", ["I vi ii7 V7", "I IV V I", "ii7 V7 Imaj7"])),
  ]),

  lesson(141, "Revisão da semana 20", ["Arpejos de 1 oitava", "ii–V–I arpejado em G, A e B", "Análise harmônica"], [
    B("Aquecimento", 6, tab("ii–V–I em Sol", 65, IIVI_ARP.G, { backing: IIVI.G })),
    B("O que você já sabe", 4, list("Arpejos de maj7, m7, 7 e m7(b5)", "ii–V–I arpejado em 3 tons", "Achar o tom pelo V7 e marcar funções")),
    B("Mini-desafio", 15, tab("Lá", 65, IIVI_ARP.Aup, { backing: IIVI.A }), tab("Si", 65, IIVI_ARP.B, { backing: IIVI.B }), checks("sem20", "Semana 20 concluída", "ii–V–I arpejado em Sol a 65 BPM", "Em Lá e Si sem parar", "Analisei a progressão do dia 140 sozinho")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(142, "I–vi–ii–V: o ciclo do turnaround", ["Tocar a progressão circular", "Usar em Dó e Sol", "Reconhecer de ouvido"], [
    B(undefined, 5, changes(IIVI.G, 70)),
    B("A roda", 8,
      "**I–vi–ii–V** (Cmaj7 – Am7 – Dm7 – G7) gira sem parar: o V7 sempre puxa de volta para o I. É a base de standards de jazz, de bossa e do *doo-wop* dos anos 50.",
      "Os baixos andam em **quintas descendentes** a partir do vi: A → D → G → C. É o ciclo das quintas que você estudou no dia 121, agora em forma de progressão.",
    ),
    B("Rodando", 12, changes(["Cmaj7@3", "Am7@5", "Dm7@5", "G7@3"], 70), jam("I–vi–ii–V em Dó (bossa)", "Dó", 110, "bossa", ["Cmaj7@3", "Am7@5", "Dm7@5", "G7@3"]), jam("I–vi–ii–V em Sol (swing)", "Sol", 100, "jazz", ["Gmaj7@3", "Em7", "Am7@5", "D7@5"])),
    B("Qual progressão?", 5, ear("progression", ["I vi ii7 V7", "ii7 V7 Imaj7", "I V vi IV"])),
  ]),

  lesson(143, "Ouvindo tétrades", ["Distinguir maj7, m7, 7 e m7(b5)", "Cantar a 7ª", "Ligar som e nome"], [
    B(undefined, 5, changes(["Cmaj7@3", "Am7@5", "Dm7@5", "G7@3"], 75)),
    B("Pistas para o ouvido", 8, list("**maj7:** brilhante, *flutua*. A 7ª fica colada na oitava, quase roçando.", "**m7:** macio, escuro sem drama.", "**7:** maior com uma ponta de tensão, *blues*.", "**m7(b5):** escuro e instável, pede movimento."), "Toque cada um, segure, e **cante a 7ª**. Depois a tônica. Depois a 7ª de novo."),
    B("Treino intenso", 12, ear("quality", ["maj7", "m7", "7", "m7b5"]), ear("quality", ["maj7", "7", "m7", "dim7"])),
    B("Qual intervalo?", 5, ear("interval", ["7m", "7M", "6M", "8J"])),
  ]),

  lesson(144, "Mirando notas do acorde no solo", ["Usar arpejos para solar", "Chegar numa nota do acorde no tempo 1", "Ouvir a harmonia no solo"], [
    B(undefined, 5, ear("quality", ["maj7", "m7", "7"])),
    B("Notas que pousam", 8,
      "Sobre um ii–V–I, a escala maior inteira funciona, mas algumas notas **pousam** melhor: as notas do acorde da vez. A ideia de hoje: tocar a escala livremente e, no **tempo 1 de cada compasso**, cair numa nota do acorde.",
      arpBox("Am7", 4, 8), arpBox("D7", 4, 8), arpBox("Gmaj7", 4, 8, "As três tétrades na mesma região (casas 4 a 8). Mire as bolinhas coloridas no tempo 1."),
    ),
    B("Solo com alvo", 12, jam("ii–V–I em Sol", "Sol", 80, "jazz", IIVI.G), tab("Exemplo (original)", 80, [n(1, 5, 1), n(2, 5, 0.5), n(2, 7, 0.5), n(3, 5, 1), n(3, 7, 1), n(2, 7, 1), n(2, 5, 0.5), n(3, 7, 0.5), n(3, 5, 1), n(4, 7, 1), n(3, 4, 2), n(4, 5, 2), n(4, 4, 4)], { backing: IIVI.G }), rec("m5-alvo", "Grave 4 voltas mirando notas do acorde.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(145, "Valsa em tétrades", ["Tocar tétrades em 3/4", "Arpejar com a mão direita", "Sentir o compasso ternário"], [
    B(undefined, 5, changes(IIVI.G, 75)),
    B("Um, dois, três", 8,
      "Em **3/4** cada compasso tem **3 tempos**, com o acento no 1. Na valsa, o baixo cai no 1 e o acorde no 2 e no 3: *tum, tchá, tchá*.",
      strum("Levada de valsa", 90, bars(["Cmaj7", "Am7", "Dm7", "G7"], STR.waltz), { beats: 3 }),
    ),
    B("Valsa em Dó", 12, jam("Valsa", "Dó", 120, "waltz", ["Cmaj7", "Cmaj7", "Am7", "Am7", "Dm7", "Dm7", "G7", "G7"]), tip("Conte *UM dois três* em voz alta. A tendência é transformar a valsa em 4/4 sem perceber.")),
    B("Qual progressão?", 5, ear("progression", ["I vi ii7 V7", "I IV V I"])),
  ]),

  lesson(146, "Peça do mês: tema em Sol", ["Ler uma melodia sobre I–vi–ii–V", "Acompanhar com tétrades", "Improvisar um chorus"], [
    B(undefined, 5, jam("I–vi–ii–V em Sol", "Sol", 90, "jazz", ["Gmaj7@3", "Em7", "Am7@5", "D7@5"])),
    B("O tema", 8, "Um tema original de 8 compassos sobre a progressão do dia 140. A melodia usa principalmente notas dos acordes.", tab("Tema em Sol (original)", 80, TUNE_G, { backing: ["Gmaj7", "Em7", "Am7", "D7", "Bm7", "Em7", "Am7 D7", "Gmaj7"] })),
    B("Tema, acompanhamento, improviso", 12, changes(["Gmaj7@3", "Em7", "Am7@5", "D7@5", "Bm7", "Em7", "Am7@5", "Gmaj7@3"], 80), jam("Base do tema", "Sol", 80, "jazz", ["Gmaj7@3", "Em7", "Am7@5", "D7@5", "Bm7", "Em7", "Am7@5 D7@5", "Gmaj7@3"]), rec("m5-tema", "Grave: tema, uma volta de acordes, uma volta de improviso, tema.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(147, "Treino do desafio: três tons", ["Tocar G, A e B em sequência", "Achar a troca mais lenta", "Subir para 70 BPM"], [
    B(undefined, 5, tab("Sol", 65, IIVI_ARP.G, { backing: IIVI.G })),
    B("O que o desafio pede", 5, list("ii–V–I **arpejado** em **Sol, Lá e Si** maior.", "Um compasso por acorde, colcheias, **70 BPM**.", "**Sem parar** entre os acordes nem entre os tons.")),
    B("Os três seguidos", 15, tab("Sol → Lá → Si", 65, [...IIVI_ARP.G, ...IIVI_ARP.Aup, ...IIVI_ARP.B], { backing: [...IIVI.G, ...IIVI.A, ...IIVI.B] }), check("Qual troca travou? Toque só aquele par, 10 vezes, antes de voltar à sequência.")),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "I vi ii7 V7"])),
  ]),

  lesson(148, "Velocidade com calma", ["Subir 5 BPM de cada vez", "Respirar entre os tons", "Chegar a 70"], [
    B(undefined, 5, tab("Lá", 65, IIVI_ARP.Aup, { backing: IIVI.A })),
    B("Método da escadinha", 5, ol("Toque a sequência a 60 BPM, duas vezes limpa.", "Suba para 65. Duas vezes limpa.", "Suba para 70.", "Errou? Desça 5 e repita."), warn("Tensão no ombro ou no punho é sinal para parar. Velocidade vem de relaxamento, não de força.")),
    B("Escadinha", 15, tab("Sol → Lá → Si a 70", 70, [...IIVI_ARP.G, ...IIVI_ARP.Aup, ...IIVI_ARP.B], { backing: [...IIVI.G, ...IIVI.A, ...IIVI.B] })),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(149, "Ensaio geral do mês 5", ["Simular o desafio", "Gravar e ouvir", "Saber se está pronto"], [
    B(undefined, 5, changes(FIELD_G, 70, 2)),
    B("Simulado", 5, ol("Base ligada a 70 BPM.", "Sol → Lá → Si, ii–V–I arpejado, sem parar.", "Grave.")),
    B("Faça", 15, tab("Simulado", 70, [...IIVI_ARP.G, ...IIVI_ARP.Aup, ...IIVI_ARP.B], { backing: [...IIVI.G, ...IIVI.A, ...IIVI.B] }), rec("m5-simulado"), checks("ensaio5", "Estou pronto?", "Os três tons sem parar a 70", "Nenhuma nota errada nos tempos 1", "Consigo dizer o nome de cada nota do arpejo")),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "I vi ii7 V7", "IV V I"])),
  ]),

  lesson(150, "Desafio do mês 5", ["ii–V–I arpejado em Sol, Lá e Si", "70 BPM sem parar", "Registrar o BPM"], [
    B("Aquecimento", 5, tab("Sol", 65, IIVI_ARP.G, { backing: IIVI.G })),
    B("As regras", 3, list("Base com acordes ligada.", "ii–V–I arpejado em **Sol**, **Lá** e **Si**, um compasso por acorde.", "**70 BPM**, sem parar entre acordes e tons.", "Registre o maior BPM limpo.")),
    B("Desafio", 15, tab("Desafio do mês 5", 70, [...IIVI_ARP.G, ...IIVI_ARP.Aup, ...IIVI_ARP.B], { backing: [...IIVI.G, ...IIVI.A, ...IIVI.B] }), rec("m5-desafio"), bpmlog(5, 70)),
    B("O que vem", 7, ear("quality", ["maj7", "m7", "7", "m7b5"]), "No **mês 6** o ritmo vira protagonista: **síncope**, **6/8 e 12/8**, **swing**, **samba, bossa e baião**, e as **notas-guia** para solar mirando 3ªs e 7ªs."),
  ]),
];

