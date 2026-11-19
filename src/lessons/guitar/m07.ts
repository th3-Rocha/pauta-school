// Mês 7 · dias 181 a 210 · Voicings e condução de vozes
import type { Lesson, Node } from "../types";
import type { MarkerKind } from "../../components/music/markers";
import { B, bars, bpmlog, c, changes, check, checks, chords, ear, jam, lesson, list, m, n, ol, rec, STR, strum, tab, theory, tip, warn, whichChord } from "./lib";

/** Um voicing desenhado no braço: forma "x x 5 5 5 7" + graus de cada nota tocada (grave → aguda). */
function voicing(shape: string, degrees: string[], caption?: string): Node {
  const fr = shape.split(/\s+/);
  const played = fr.map((f, i) => ({ s: 6 - i, f })).filter((q) => q.f !== "x").map((q) => ({ s: q.s, f: Number(q.f) }));
  const kindOf = (d: string): MarkerKind => (d === "1" ? "root" : d.includes("3") ? "deg-3" : d.includes("7") || d === "6" ? "deg-7" : d.includes("5") ? "deg-5" : "ext");
  const fs = played.map((p) => p.f).filter((f) => f > 0);
  const lo = fs.length ? Math.min(...fs) : 0;
  return {
    w: "fretboard",
    from: Math.max(0, lo - 1),
    frets: Math.max(lo + 4, ...played.map((p) => p.f)),
    markers: played.map((p, i) => ({ s: p.s, f: p.f, label: degrees[i], kind: kindOf(degrees[i]) })),
    caption,
  };
}

/** Progressão do desafio e seus voicings. */
const PROG = ["Cmaj7", "A7", "Dm7", "G7", "Em7", "A7", "Dm7 G7", "Cmaj7"];
const PROG_D2 = ["Cmaj7@d2b", "A7@d2", "Dm7@d2", "G7@d2", "Em7@d2", "A7@d2b", "Dm7 G7@d2o", "Cmaj7@d2"];
const PROG_SHELL = ["Cmaj7@shell", "A7@shell", "Dm7@shell", "G7@shell", "Em7@shell", "A7@shell", "Dm7@shell G7@shell", "Cmaj7@shell"];
const PROG_D2_CHANGES = ["Cmaj7@d2b", "A7@d2", "Dm7@d2", "G7@d2", "Em7@d2", "A7@d2b", "Dm7", "G7@d2o", "Cmaj7@d2"];

/** Tríades abertas (spread): 1-5-3 nas cordas 5, 3 e 2, ou 6, 4 e 3. */
const SPREAD = [m([[5, 3], [3, 0], [2, 5]], 2), m([[6, 3], [4, 0], [3, 4]], 2), m([[6, 5], [4, 2], [3, 5]], 2), m([[5, 7], [3, 4], [2, 8]], 2), m([[6, 1], [4, 3], [3, 2]], 2), m([[5, 3], [3, 0], [2, 5]], 2), m([[5, 5], [3, 2], [2, 6]], 2), m([[6, 3], [4, 0], [3, 4]], 2)];

/** Baixo descendente: C – G/B – Am – Am/G – F – C/E – Dm – G. */
const DESC = ["C", "G/B", "Am", "Am/G", "F", "C/E", "Dm", "G"];

export const MONTH_7: Lesson[] = [
  lesson(181, "Inversões de tétrades", ["Ver que uma tétrade tem 4 inversões", "Nomear pelo baixo", "Ouvir a diferença"], [
    B(undefined, 5, "Bem-vindo ao mês 7. Este mês é sobre **acompanhar bem**: escolher qual versão de cada acorde tocar para que a música ande macia.", changes(["Dm7@5", "G7@3", "Cmaj7@3"], 80)),
    B("Quatro baixos", 10,
      "No mês 3 você viu tríades em 3 inversões. Uma tétrade tem **4**: com a tônica, a 3ª, a 5ª ou a 7ª no baixo.",
      list("**Fundamental:** 1 no baixo (Cmaj7).", "**1ª inversão:** 3 no baixo (Cmaj7/E).", "**2ª inversão:** 5 no baixo (Cmaj7/G).", "**3ª inversão:** 7 no baixo (Cmaj7/B). A mais tensa: a 7ª no baixo pede para descer."),
      voicing("x x 10 12 12 12", ["1", "5", "7", "3"], "Cmaj7 com a tônica no baixo (cordas 4 a 1)."),
      voicing("x x 2 4 1 3", ["3", "7", "1", "5"], "Cmaj7 com a 3ª no baixo."),
      voicing("x x 5 5 5 7", ["5", "1", "3", "7"], "Cmaj7 com a 5ª no baixo."),
      voicing("x x 9 9 8 8", ["7", "3", "5", "1"], "Cmaj7 com a 7ª no baixo."),
    ),
    B("As quatro", 10, tab("Cmaj7 nas 4 inversões", 60, [c("Cmaj7@d2", 2), c("Cmaj7@d2b", 2), m([[4, 9], [3, 9], [2, 8], [1, 8]], 2), m([[4, 10], [3, 12], [2, 12], [1, 12]], 2)]), "Mesmas 4 notas, quatro sons. O baixo muda o caráter."),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(182, "Spread triads: tríades abertas", ["Espalhar a tríade por cordas separadas", "Tocar 1-5-3", "Soar como um piano"], [
    B(undefined, 5, tab("Cmaj7 nas 4 inversões", 65, [c("Cmaj7@d2", 2), c("Cmaj7@d2b", 2), m([[4, 9], [3, 9], [2, 8], [1, 8]], 2), m([[4, 10], [3, 12], [2, 12], [1, 12]], 2)])),
    B("Abrindo a tríade", 8,
      "Uma tríade **fechada** tem as notas o mais perto possível (C E G). Na **aberta** (spread), a nota do meio sobe uma oitava: **C G E**. O som fica amplo, cheio de ar, como num arranjo de cordas.",
      voicing("x 3 x 0 5 x", ["1", "5", "3"], "Dó aberto: tônica na corda 5, 5ª na corda 3 solta, 3ª na corda 2."),
      voicing("3 x 0 4 x x", ["1", "5", "3"], "Sol aberto: corda 6, corda 4 solta, corda 3."),
      tip("Toque com os dedos (polegar e dois dedos) ou com palheta + dedo médio. Cordas separadas, palheta sozinha não alcança."),
    ),
    B("Progressão aberta", 12, tab("C–G–Am–Em–F–C–Dm–G em tríades abertas", 60, SPREAD), "Ouça como cada acorde *respira*. Esse som está em arranjos de MPB, de violão clássico e de trilhas de cinema."),
    B("Qual tríade?", 5, ear("quality", ["", "m", "sus4", "aug"])),
  ]),

  lesson(183, "Baixo descendente", ["Ligar acordes por um baixo que desce", "Usar inversões com barra", "Tocar a progressão clássica"], [
    B(undefined, 5, tab("Tríades abertas", 65, SPREAD)),
    B("A linha de baixo como melodia", 8,
      "Uma das ideias mais usadas da música: o baixo **desce por grau** enquanto os acordes mudam por cima. Em Dó: **C – B – A – G – F – E – D – G**.",
      { list: ["**C** · **G/B** · **Am** · **Am/G** · **F** · **C/E** · **Dm** · **G**"] },
      chords(...DESC),
    ),
    B("Descendo", 12, changes(DESC, 70, 4, "Baixo descendente"), strum("Com levada folk", 75, bars(DESC, STR.folk)), check("Toque só o baixo de cada acorde uma vez. Depois o acorde inteiro. A linha continua aparecendo?")),
    B("Qual acorde?", 5, whichChord("C", "G/B", "Am", "F")),
  ]),

  lesson(184, "Shells em todos os tons", ["Revisar shells nas cordas 6 e 5", "Fazer ii–V–I em 4 tons", "Alternar tônica 6 e 5"], [
    B(undefined, 5, changes(DESC, 75)),
    B("Dois desenhos de cada", 8,
      "Shells (1, 3, 7) existem com tônica na corda 6 e na 5. No ii–V–I, alterne: **ii na corda 5, V na corda 6, I na corda 5**, ou o contrário. A mão quase não sai do lugar.",
      chords("Dm7@shell", "G7@shell", "Cmaj7@shell"),
      chords("Am7@shell", "D7@shell", "Gmaj7@shell"),
    ),
    B("Quatro tons", 12, changes(["Dm7@shell", "G7@shell", "Cmaj7@shell", "Cmaj7@shell"], 70, 4, "Dó"), changes(["Am7@shell", "D7@shell", "Gmaj7@shell", "Gmaj7@shell"], 70, 4, "Sol"), changes(["Gm7@shell", "C7@shell", "Fmaj7@shell", "Fmaj7@shell"], 70, 4, "Fá"), changes(["Cm7@shell", "F7@shell", "Bbmaj7@shell", "Bbmaj7@shell"], 70, 4, "Si bemol")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(185, "Shells no jazz blues", ["Acompanhar um blues com shells", "Usar o Charleston", "Ouvir o baixo caminhando"], [
    B(undefined, 5, changes(["Dm7@shell", "G7@shell", "Cmaj7@shell", "Cmaj7@shell"], 75)),
    B("Blues de jazz", 8,
      "O **jazz blues** usa a forma de 12 compassos com mais acordes: ii–V nos lugares de passagem. Em Fá (tom favorito do jazz):",
      { list: ["| F7 | Bb7 | F7 | Cm7 F7 |", "| Bb7 | Bb7 | F7 | Am7 D7 |", "| Gm7 | C7 | F7 D7 | Gm7 C7 |"] },
      chords("F7", "Bb7", "C7@shell", "Gm7@shell"),
    ),
    B("Comping", 12, jam("Jazz blues em Fá", "Fá", 110, "jazz", ["F7", "Bb7", "F7", "Cm7 F7", "Bb7", "Bb7", "F7", "Am7 D7", "Gm7", "C7", "F7 D7", "Gm7 C7"]), tip("Use shells e toque curto, no 1 e no *e* do 2. Deixe o baixo caminhar sozinho.")),
    B("Qual tipo de acorde?", 5, ear("quality", ["7", "m7", "maj7"])),
  ]),

  lesson(186, "Condução de vozes: o princípio", ["Manter notas comuns", "Mover as outras o mínimo", "Pensar em vozes, não em formas"], [
    B(undefined, 5, jam("Jazz blues em Fá", "Fá", 110, "jazz", ["F7", "Bb7", "F7", "Cm7 F7", "Bb7", "Bb7", "F7", "Am7 D7", "Gm7", "C7", "F7 D7", "Gm7 C7"])),
    B("Cada nota é um cantor", 10,
      "Pense num acorde de 4 notas como **4 cantores**, um em cada corda. Ao mudar de acorde, cada cantor anda para a nota mais próxima do novo acorde. Regras de bolso:",
      ol("**Nota comum fica parada.**", "As outras andam **por grau** (1 ou 2 casas).", "Evite que **todas** pulem juntas na mesma direção."),
      voicing("x x 3 5 3 5", ["b3", "b7", "1", "5"], "Dm7: F C D A."),
      voicing("x x 3 4 3 3", ["b7", "3", "5", "1"], "G7: F B D G. F e D ficaram; C desceu para B; A desceu para G."),
      voicing("x x 2 4 1 3", ["3", "7", "1", "5"], "Cmaj7: E B C G. B ficou; F → E, D → C, G → G."),
    ),
    B("Ouvindo as vozes", 10, changes(["Dm7@d2", "G7@d2", "Cmaj7@d2", "Cmaj7@d2"], 65), "Toque devagar e cante a nota da **corda 2** em cada acorde: D → D → C. Depois a da corda 3: C → B → B. Cada corda é uma melodia.", warn("Se você está pulando 5 casas entre acordes, provavelmente existe uma inversão mais perto.")),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m"])),
  ]),

  lesson(187, "Revisão da semana 27", ["Inversões de tétrades", "Tríades abertas e baixo descendente", "Shells e condução"], [
    B("Aquecimento", 6, tab("Tríades abertas", 70, SPREAD)),
    B("O que você já sabe", 4, list("Tétrade = 4 inversões", "Spread: 1-5-3 em cordas separadas", "C – G/B – Am – Am/G…", "Shells nas cordas 6 e 5", "Nota comum fica; o resto anda pouco")),
    B("Mini-desafio", 15, changes(DESC, 75), changes(["Dm7@d2", "G7@d2", "Cmaj7@d2", "Cmaj7@d2"], 70), checks("sem27", "Semana 27 concluída", "Baixo descendente sem parar a 75", "ii–V–I com shells em 4 tons", "Explico por que Dm7 → G7 → Cmaj7 (cordas 4 a 1) soa macio")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(188, "Drop 2: de onde vem", ["Construir um drop 2", "Entender por que ele cabe na mão", "Tocar o primeiro drop 2"], [
    B(undefined, 5, changes(["Dm7@d2", "G7@d2", "Cmaj7@d2"], 75)),
    B("Abaixando a segunda voz", 10,
      "Uma tétrade **fechada** (C E G B, notas coladas) é impossível de tocar em 4 cordas vizinhas. A solução: pegue a **segunda nota de cima** e desça uma **oitava**. Esse é o **drop 2**.",
      list("Fechado: **C E G B** (de baixo para cima)", "A segunda de cima é o **G**. Desce uma oitava.", "Drop 2: **G C E B**: cabe em 4 cordas vizinhas."),
      voicing("x x 5 5 5 7", ["5", "1", "3", "7"], "Cmaj7 drop 2, cordas 4 a 1."),
      theory("O drop 2 é o voicing mais usado na guitarra de jazz e de MPB: soa equilibrado e permite levar a melodia na corda de cima."),
    ),
    B("Primeiros drop 2", 10, chords("Cmaj7@d2b", "Am7@d2", "Fmaj7@d2", "G7@d2"), changes(["Cmaj7@d2b", "Am7@d2", "Fmaj7@d2", "G7@d2"], 60)),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(189, "Drop 2 nas cordas 4 a 1: inversões", ["Tocar as 4 inversões de Cmaj7, Dm7 e G7", "Subir o braço pela mesma tétrade", "Achar a tônica em cada uma"], [
    B(undefined, 5, changes(["Cmaj7@d2b", "Am7@d2", "Fmaj7@d2", "G7@d2"], 65)),
    B("Subindo a mesma tétrade", 10,
      "Cada inversão do drop 2 é um desenho diferente. Subindo o braço, a ordem dos graus no baixo é sempre **1 → 3 → 5 → 7 → 1**.",
      voicing("x x 3 5 3 5", ["b3", "b7", "1", "5"], "Dm7 (3ª no baixo)."),
      voicing("x x 7 7 6 8", ["5", "1", "b3", "b7"], "Dm7 (5ª no baixo)."),
      voicing("x x 10 10 10 10", ["b7", "b3", "5", "1"], "Dm7 (7ª no baixo)."),
      voicing("x x 12 14 13 13", ["1", "5", "b7", "b3"], "Dm7 (tônica no baixo)."),
    ),
    B("Escadas", 10, tab("Dm7 subindo", 60, [m([[4, 3], [3, 5], [2, 3], [1, 5]], 2), m([[4, 7], [3, 7], [2, 6], [1, 8]], 2), m([[4, 10], [3, 10], [2, 10], [1, 10]], 2), m([[4, 12], [3, 14], [2, 13], [1, 13]], 2)]), tab("G7 subindo", 60, [m([[4, 3], [3, 4], [2, 3], [1, 3]], 2), m([[4, 5], [3, 7], [2, 6], [1, 7]], 2), m([[4, 9], [3, 10], [2, 8], [1, 10]], 2), m([[4, 12], [3, 12], [2, 12], [1, 13]], 2)])),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(190, "ii–V–I em drop 2 com o mínimo de movimento", ["Escolher inversões vizinhas", "Tocar o ii–V–I em duas regiões", "Ouvir a voz de cima"], [
    B(undefined, 5, tab("Dm7 subindo", 65, [m([[4, 3], [3, 5], [2, 3], [1, 5]], 2), m([[4, 7], [3, 7], [2, 6], [1, 8]], 2), m([[4, 10], [3, 10], [2, 10], [1, 10]], 2), m([[4, 12], [3, 14], [2, 13], [1, 13]], 2)])),
    B("Duas regiões", 8,
      "Com 4 inversões de cada acorde, sempre existe uma combinação em que **ninguém pula**. Duas boas para o ii–V–I de Dó:",
      list("**Região baixa:** Dm7 (casa 3) → G7 (casa 3) → Cmaj7 (casa 2).", "**Região média:** Dm7 (casa 7) → G7 (casa 5) → Cmaj7 (casa 5)."),
      chords("Dm7@d2", "G7@d2", "Cmaj7@d2"),
      chords("Dm7@d2b", "G7@d2b", "Cmaj7@d2b"),
    ),
    B("As duas", 12, changes(["Dm7@d2", "G7@d2", "Cmaj7@d2", "Cmaj7@d2"], 70), changes(["Dm7@d2b", "G7@d2b", "Cmaj7@d2b", "Cmaj7@d2b"], 70), jam("ii–V–I em Dó", "Dó", 100, "jazz", ["Dm7@d2", "G7@d2", "Cmaj7@d2", "Cmaj7@d2"]), tip("Repare na nota mais aguda (corda 1). Ela forma uma pequena melodia: A → G → G na região baixa; C → B → B na média.")),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "I vi ii7 V7"])),
  ]),

  lesson(191, "Drop 2 nas cordas 5 a 2", ["Levar os desenhos uma corda abaixo", "Ajustar o desvio G–B", "Combinar os dois grupos"], [
    B(undefined, 5, changes(["Dm7@d2b", "G7@d2b", "Cmaj7@d2b", "Cmaj7@d2b"], 75)),
    B("Mesma ideia, outro grupo", 8,
      "Os drop 2 também cabem nas cordas **5, 4, 3 e 2**. Os desenhos mudam porque agora o par G–B está no meio do acorde, não no topo.",
      chords("Dm7@d2c", "G7@d2c", "Cmaj7@d2c"),
      "Esse grupo soa mais **grave e encorpado**. É bom para quando não há baixista.",
    ),
    B("ii–V–I nas cordas 5 a 2", 12, changes(["Dm7@d2c", "G7@d2c", "Cmaj7@d2c", "Cmaj7@d2c"], 70), jam("ii–V–I em Dó (bossa)", "Dó", 110, "bossa", ["Dm7@d2c", "G7@d2c", "Cmaj7@d2c", "Cmaj7@d2c"])),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(192, "Drop 3", ["Construir um drop 3", "Tocar nas cordas 6, 4, 3 e 2", "Abafar a corda 5"], [
    B(undefined, 5, changes(["Dm7@d2c", "G7@d2c", "Cmaj7@d2c"], 75)),
    B("Abaixando a terceira voz", 10,
      "No **drop 3**, a nota que desce uma oitava é a **terceira de cima**. O baixo fica bem separado do resto: perfeito para tocar baixo e acorde juntos, no estilo do violão de bossa.",
      list("Comece pela tétrade fechada **B C E G** (a 7ª embaixo).", "A terceira nota de cima é o **C**. Desça uma oitava.", "Drop 3: **C B E G**, com a tônica sozinha lá embaixo (forma 8x998x)."),
      voicing("8 x 9 9 8 x", ["1", "7", "3", "5"], "Cmaj7 drop 3: tônica na corda 6, corda 5 abafada."),
      tip("A corda 5 fica **abafada** pela ponta do dedo que toca a corda 6. Pratique tocando as 5 cordas de baixo e confira que a 5 não soa."),
    ),
    B("Drop 3 com tônica na 6", 10, chords("Cmaj7@d3", "G7@d3", "Am7@d3", "Dm7@d3"), changes(["Am7@d3", "Dm7@d3", "G7@d3", "Cmaj7@d3"], 60)),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(193, "ii–V–I em drop 3", ["Tocar ii–V–I com baixo na corda 6", "Conectar drop 3 e drop 2", "Acompanhar sem baixista"], [
    B(undefined, 5, changes(["Am7@d3", "Dm7@d3", "G7@d3", "Cmaj7@d3"], 65)),
    B("A mão no lugar", 8,
      "Em drop 3, o ii–V–I de Dó cabe entre as casas 2 e 5: **Dm7 (casa 5) → G7 (casa 3) → Cmaj7 (casa 3)**. O baixo desce A → G → G e as vozes de cima andam por grau.",
      chords("Dm7@d3b", "G7@d3b", "Cmaj7@d3b"),
    ),
    B("Drop 3 e drop 2 juntos", 12, changes(["Dm7@d3b", "G7@d3b", "Cmaj7@d3b", "Cmaj7@d3b"], 65), changes(["Dm7@d3b", "G7@d2", "Cmaj7@d3b", "Cmaj7@d2"], 65), jam("ii–V–I em Dó", "Dó", 90, "jazz", ["Dm7@d3b", "G7@d3b", "Cmaj7@d3b", "Cmaj7@d3b"])),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "IV V I", "I vi ii7 V7"])),
  ]),

  lesson(194, "Revisão da semana 28", ["Drop 2 nos dois grupos", "Drop 3", "ii–V–I com mínimo movimento"], [
    B("Aquecimento", 6, changes(["Dm7@d2", "G7@d2", "Cmaj7@d2", "Cmaj7@d2"], 75)),
    B("O que você já sabe", 4, list("Drop 2: 2ª voz de cima desce uma oitava", "Drop 3: 3ª voz de cima desce", "4 inversões por tétrade", "Sempre existe uma inversão perto")),
    B("Mini-desafio", 15, changes(["Dm7@d2b", "G7@d2b", "Cmaj7@d2b", "Cmaj7@d2b"], 80), changes(["Dm7@d3b", "G7@d3b", "Cmaj7@d3b", "Cmaj7@d3b"], 80), checks("sem28", "Semana 28 concluída", "ii–V–I em drop 2 nas duas regiões a 80", "ii–V–I em drop 3 a 80", "Acho Dm7 em 4 inversões nas cordas 4 a 1")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m7b5"])),
  ]),

  lesson(195, "Diminuto de passagem ascendente", ["Inserir um °7 entre dois acordes", "Fazer o baixo subir por meio tom", "Tocar o clichê do samba e do choro"], [
    B(undefined, 5, changes(["Dm7@d3b", "G7@d3b", "Cmaj7@d3b", "Cmaj7@d3b"], 75)),
    B("O acorde que liga", 10,
      "Entre **C** e **Dm7**, o baixo pode subir C → **C#** → D. O acorde do C# é um **C#°7**. Ele funciona como um *dominante disfarçado* do Dm7 (é o A7(b9) sem a tônica).",
      chords("C", "C#dim7", "Dm7", "D#dim7", "C/E"),
      "Esse movimento está no samba, no choro, na bossa e em muita música pop de piano.",
    ),
    B("Subindo", 12, changes(["C", "C#dim7", "Dm7", "D#dim7", "C/E", "F", "G7", "C"], 65, 2), check("Toque só os baixos: C, C#, D, D#, E, F, G, C. Viu a escada cromática?")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "dim7"])),
  ]),

  lesson(196, "Diminuto descendente e auxiliar", ["Usar o °7 descendo", "Usar o °7 auxiliar sobre o mesmo baixo", "Reconhecer as três funções"], [
    B(undefined, 5, changes(["C", "C#dim7", "Dm7", "D#dim7", "C/E", "F", "G7", "C"], 70, 2)),
    B("Outras duas formas", 8,
      list("**Descendente:** o baixo desce por meio tom passando pelo °7. Ex.: Em7 → **Ebdim7** → Dm7.", "**Auxiliar:** o °7 tem o **mesmo baixo** do acorde que vem antes e depois: C → **Cdim7** → C. É um enfeite, como uma nota vizinha."),
      chords("Em7", "D#dim7", "Dm7", "C", "Cdim7"),
      tip("O D#dim7 e o Ebdim7 são o mesmo acorde. O nome muda conforme a direção do baixo."),
    ),
    B("Três diminutos", 12, changes(["Em7", "D#dim7", "Dm7", "G7"], 65, 4, "Descendente"), changes(["C", "Cdim7", "C", "Cdim7"], 65, 4, "Auxiliar"), jam("Os três numa progressão", "Dó", 90, "bossa", ["C", "C#dim7", "Dm7", "D#dim7", "Em7", "Cdim7", "Dm7", "G7"])),
    B("Qual tétrade?", 5, ear("quality", ["m7", "7", "dim7", "m7b5"])),
  ]),

  lesson(197, "A simetria do diminuto", ["Mover o °7 a cada 3 casas", "Usar as 4 inversões iguais", "Achar os 3 diminutos"], [
    B(undefined, 5, changes(["Em7", "D#dim7", "Dm7", "G7"], 70)),
    B("Um desenho, quatro nomes", 10,
      "O °7 é feito só de **terças menores** (3 casas). Mova o desenho **3 casas** e as notas são as mesmas, em outra ordem. Por isso **C#°7 = E°7 = G°7 = Bb°7**.",
      voicing("x x 2 3 2 3", ["1", "b5", "bb7", "b3"], "E°7 (cordas 4 a 1)."),
      voicing("x x 5 6 5 6", ["b3", "bb7", "1", "b5"], "Três casas acima: G°7, mesmas notas."),
      theory("Só existem **três** diminutos diferentes: C°7, C#°7 e D°7. Todos os outros são um deles com outro nome."),
    ),
    B("Subindo de 3 em 3", 10, tab("Diminuto subindo a cada 3 casas", 70, [m([[4, 2], [3, 3], [2, 2], [1, 3]], 2), m([[4, 5], [3, 6], [2, 5], [1, 6]], 2), m([[4, 8], [3, 9], [2, 8], [1, 9]], 2), m([[4, 11], [3, 12], [2, 11], [1, 12]], 2)]), "Esse movimento é um clichê de suspense e de rock progressivo."),
    B("Qual tétrade?", 5, ear("quality", ["dim7", "m7b5", "7"])),
  ]),

  lesson(198, "Line cliché menor", ["Fazer uma voz cromática dentro do acorde", "Tocar Am – Am(maj7) – Am7 – Am6", "Ouvir a voz interna"], [
    B(undefined, 5, tab("Diminutos", 75, [m([[4, 2], [3, 3], [2, 2], [1, 3]], 2), m([[4, 5], [3, 6], [2, 5], [1, 6]], 2)])),
    B("Uma voz que desce", 10,
      "No **line cliché**, o acorde fica parado e **uma voz interna** desce por meio tom: a tônica vira 7ª maior, depois 7ª menor, depois 6ª. Em Lá menor: **A → G# → G → F#**.",
      chords("Am", "Am(maj7)", "Am7", "Am6"),
      "É o som de abertura de muitos temas de detetive, de bossa e de baladas dos anos 60.",
    ),
    B("A linha", 12, changes(["Am", "Am(maj7)", "Am7", "Am6"], 65), changes(["Am", "Am/G", "Am/F#", "F"], 65, 4, "A mesma ideia no baixo"), jam("Line cliché", "Lá menor", 70, "ballad", ["Am", "Am(maj7)", "Am7", "Am6", "Dm", "E7", "Am", "Am"])),
    B("Qual tétrade?", 5, ear("quality", ["m", "m(maj7)", "m7", "m6"])),
  ]),

  lesson(199, "Line cliché maior", ["Fazer a voz subir no acorde maior", "Tocar C – Caug – C6 – C7", "Usar na passagem para o IV"], [
    B(undefined, 5, changes(["Am", "Am(maj7)", "Am7", "Am6"], 70)),
    B("Agora subindo", 8,
      "No acorde maior, a voz interna costuma **subir** a partir da 5ª: **G → G# → A → Bb**. Os acordes: **C → Caug → C6 → C7**, e o C7 leva naturalmente ao **F**.",
      chords("C", "Caug", "C6", "C7", "F"),
    ),
    B("Subindo até o IV", 12, changes(["C", "Caug", "C6", "C7", "F", "Fm", "C", "G7"], 65, 2), check("Cante a voz que se move enquanto toca. Ela é uma pequena melodia escondida no acompanhamento.")),
    B("Qual tríade?", 5, ear("quality", ["", "aug", "6", "7"])),
  ]),

  lesson(200, "Comping: ritmo + voicing", ["Escolher onde tocar o acorde", "Variar o ritmo do acompanhamento", "Deixar espaço"], [
    B(undefined, 5, changes(["C", "Caug", "C6", "C7"], 70)),
    B("Acompanhar é conversar", 8,
      "**Comping** (de *accompanying*, ou *complementing*) é o acompanhamento de jazz: acordes curtos, em lugares diferentes do compasso, respondendo ao solista.",
      list("Use **drop 2** e **shells**: pouca nota, som limpo.", "Varie o ritmo: Charleston, notas longas, antecipações no *e* do 4.", "**Deixe espaço.** Um compasso sem acorde também é comping."),
    ),
    B("Três ritmos", 12, strum("Charleston", 110, bars(["Dm7@d2", "G7@d2", "Cmaj7@d2", "Cmaj7@d2"], [ "down", null, null, "down", null, null, null, null ]), { swing: true }), strum("Antecipação", 110, bars(["Dm7@d2", "G7@d2", "Cmaj7@d2", "Cmaj7@d2"], ["down", null, null, null, null, null, null, "down"]), { swing: true }), jam("Base para comping", "Dó", 110, "jazz", ["Dm7@d2", "G7@d2", "Cmaj7@d2", "A7@d2b"])),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "I vi ii7 V7"])),
  ]),

  lesson(201, "Revisão da semana 29", ["Diminutos de passagem", "Line cliché", "Comping"], [
    B("Aquecimento", 6, changes(["C", "C#dim7", "Dm7", "D#dim7", "C/E", "F", "G7", "C"], 75, 2)),
    B("O que você já sabe", 4, list("°7 ascendente, descendente e auxiliar", "Simetria: o °7 se repete a cada 3 casas", "Line cliché menor (desce) e maior (sobe)", "Comping: pouca nota, ritmo variado")),
    B("Mini-desafio", 15, changes(["Am", "Am(maj7)", "Am7", "Am6"], 75), jam("Comping", "Dó", 110, "jazz", ["Dm7@d2", "G7@d2", "Cmaj7@d2", "A7@d2b"]), checks("sem29", "Semana 29 concluída", "Diminuto de passagem no lugar certo", "Line cliché menor e maior", "Comping variado por 2 voltas")),
    B("Qual tétrade?", 5, ear("quality", ["m7", "7", "dim7", "m(maj7)"])),
  ]),

  lesson(202, "Melodia no topo: chord melody", ["Levar a melodia na corda 1", "Escolher o drop 2 pela nota de cima", "Tocar uma frase harmonizada"], [
    B(undefined, 5, jam("Comping", "Dó", 110, "jazz", ["Dm7@d2", "G7@d2", "Cmaj7@d2", "A7@d2b"])),
    B("A nota de cima manda", 8,
      "No **chord melody**, você toca a melodia e os acordes ao mesmo tempo. O truque: escolha a inversão do drop 2 cuja **nota mais aguda** é a nota da melodia.",
      "Exemplo: melodia **A – G – G – A** sobre Dm7 – G7 – Cmaj7 – Am7. Os drop 2 com essas notas no topo:",
      chords("Dm7@d2", "G7@d2", "Cmaj7@d2", "Am7@d2"),
    ),
    B("Frase harmonizada", 12, tab("Chord melody (original)", 60, [c("Dm7@d2", 2), n(1, 3, 1), n(1, 5, 1), c("G7@d2", 3), n(1, 1, 1), c("Cmaj7@d2", 2), n(1, 0, 1), n(1, 1, 1), c("Am7@d2", 4)]), tip("Entre um acorde e outro, você pode tocar notas soltas da melodia. Assim a mão tem tempo de mudar.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(203, "Bossa com drop 2", ["Acompanhar bossa com drop 2 nas cordas 5 a 2", "Separar baixo e acorde", "Tocar a progressão inteira"], [
    B(undefined, 5, tab("Chord melody", 65, [c("Dm7@d2", 2), n(1, 3, 1), n(1, 5, 1), c("G7@d2", 3), n(1, 1, 1), c("Cmaj7@d2", 2), n(1, 0, 1), n(1, 1, 1), c("Am7@d2", 4)])),
    B("Violão de bossa na guitarra", 8, "Na bossa, o drop 3 com tônica na corda 6 deixa o polegar no baixo e os dedos no acorde. Use a levada do mês 6.", chords("Am7@d3", "Dm7@d3", "G7@d3", "Cmaj7@d3")),
    B("A progressão", 12, strum("Bossa em drop 3", 70, bars(["Am7@d3", "Dm7@d3", "G7@d3", "Cmaj7@d3"], STR.bossa)), jam("Bossa", "Dó", 120, "bossa", ["Am7@d3", "Dm7@d3", "G7@d3", "Cmaj7@d3"])),
    B("Qual progressão?", 5, ear("progression", ["vi ii7 V7 Imaj7", "I vi ii7 V7"])),
  ]),

  lesson(204, "A progressão do desafio em drop 2", ["Aprender os voicings da progressão", "Medir o movimento entre eles", "Tocar no tempo"], [
    B(undefined, 5, changes(["Am7@d3", "Dm7@d3", "G7@d3", "Cmaj7@d3"], 75)),
    B("Os 8 compassos", 8,
      { list: [`| ${PROG.join(" | ")} |`] },
      "Voicings em drop 2 (cordas 4 a 1), escolhidos para que **nenhum dedo ande mais de 2 casas**:",
      chords("Cmaj7@d2b", "A7@d2", "Dm7@d2", "G7@d2", "Em7@d2", "A7@d2b", "Dm7", "G7@d2o", "Cmaj7@d2"),
    ),
    B("No tempo", 12, changes(PROG_D2_CHANGES, 65), jam("Progressão do desafio", "Dó", 80, "jazz", PROG_D2)),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(205, "A progressão em shells", ["Tocar a mesma progressão com shells", "Comparar o som", "Escolher para cada contexto"], [
    B(undefined, 5, changes(PROG_D2_CHANGES, 70)),
    B("Mais grave, mais enxuto", 8, "Com shells, a progressão fica grave e econômica: ótima para tocar com outro instrumento fazendo harmonia em cima.", chords("Cmaj7@shell", "A7@shell", "Dm7@shell", "G7@shell", "Em7@shell")),
    B("Shells no tempo", 12, changes(["Cmaj7@shell", "A7@shell", "Dm7@shell", "G7@shell", "Em7@shell", "A7@shell", "Dm7@shell", "G7@shell", "Cmaj7@shell"], 70), jam("Com shells", "Dó", 80, "jazz", PROG_SHELL)),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(206, "Misturando shells, drop 2 e drop 3", ["Escolher o voicing pela região", "Mudar de grupo de cordas no meio", "Criar um arranjo de acompanhamento"], [
    B(undefined, 5, jam("Com shells", "Dó", 80, "jazz", PROG_SHELL)),
    B("Um arranjo", 8, ol("**Volta 1:** shells (grave, discreto).", "**Volta 2:** drop 3 (baixo + acorde, encorpado).", "**Volta 3:** drop 2 nas cordas 4 a 1 (brilhante, para o clímax).", "**Final:** Cmaj7 em drop 2 segurado."), "Essa ideia de **subir de registro** ao longo da música dá direção ao acompanhamento, sem precisar tocar mais alto."),
    B("Três voltas", 12, jam("Arranjo", "Dó", 80, "jazz", [...PROG_SHELL, ...PROG, ...PROG_D2]), rec("m7-arranjo", "Grave as três voltas.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "dim7"])),
  ]),

  lesson(207, "Peça do mês: acompanhamento completo", ["Acompanhar um tema", "Usar diminuto de passagem e line cliché", "Gravar"], [
    B(undefined, 5, changes(PROG_D2_CHANGES, 75)),
    B("O arranjo", 8, "Uma progressão de 16 compassos (original da Pauta) que usa tudo do mês: line cliché, diminuto de passagem, ii–V–I e baixo descendente.", { list: ["| Am | Am(maj7) | Am7 | Am6 |", "| Dm7 | G7 | Cmaj7 | C#dim7 |", "| Dm7 | D#dim7 | C/E | A7 |", "| Dm7 | G7 | C | E7 |"] }),
    B("Acompanhar", 12, jam("Peça do mês 7", "Lá menor / Dó", 80, "bossa", ["Am", "Am(maj7)", "Am7", "Am6", "Dm7@d2", "G7@d2", "Cmaj7@d2", "C#dim7", "Dm7@d2", "D#dim7", "C/E", "A7@d2b", "Dm7", "G7@d2o", "C", "E7"]), rec("m7-peca")),
    B("Qual acorde?", 5, ear("quality", ["m", "m7", "dim7", "7"])),
  ]),

  lesson(208, "Treino do desafio: condução", ["Medir o movimento dos dedos", "Achar trocas com pulo", "Chegar a 80 BPM"], [
    B(undefined, 5, jam("Progressão do desafio", "Dó", 75, "jazz", PROG_D2)),
    B("O que o desafio pede", 5, list("Acompanhar a progressão inteira (8 compassos) **com shells e com drop 2 ou 3**.", "**Nenhum dedo salta mais de 2 casas** entre acordes vizinhos.", "**80 BPM**, duas voltas sem parar.")),
    B("Treino", 15, changes(PROG_D2_CHANGES, 80), changes(["Cmaj7@shell", "A7@shell", "Dm7@shell", "G7@shell", "Em7@shell", "A7@shell", "Dm7@shell", "G7@shell", "Cmaj7@shell"], 80), check("Filme ou observe a mão esquerda num espelho. Alguma troca faz a mão *saltar*? Procure outra inversão para ela.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(209, "Ensaio geral do mês 7", ["Simular o desafio", "Gravar duas voltas", "Saber se está pronto"], [
    B(undefined, 5, changes(PROG_D2_CHANGES, 80)),
    B("Simulado", 5, ol("Volta 1 com shells.", "Volta 2 com drop 2.", "80 BPM, base de swing.", "Grave.")),
    B("Faça", 15, jam("Simulado", "Dó", 80, "jazz", [...PROG_SHELL, ...PROG_D2]), rec("m7-simulado"), checks("ensaio7", "Estou pronto?", "Duas voltas sem parar", "Nenhuma troca com salto de mais de 2 casas", "Os acordes soaram limpos")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "dim7"])),
  ]),

  lesson(210, "Desafio do mês 7", ["Acompanhar a progressão com condução suave", "Shells e drop 2/3", "80 BPM"], [
    B("Aquecimento", 5, changes(PROG_D2_CHANGES, 75)),
    B("As regras", 3, list("Base de swing a **80 BPM**.", "**Volta 1:** shells. **Volta 2:** drop 2 ou drop 3.", "Nenhum dedo salta **mais de 2 casas** entre acordes vizinhos.", "Grave e confira.")),
    B("Desafio", 15, jam("Desafio do mês 7", "Dó", 80, "jazz", [...PROG_SHELL, ...PROG_D2]), rec("m7-desafio"), bpmlog(7, 80)),
    B("O que vem", 7, ear("quality", ["maj7", "m7", "7", "m7b5", "dim7"]), "No **mês 8** a harmonia sai do tom: **campos menores**, **dominantes secundários**, **subV7**, **empréstimo modal** e a rearmonização de pop e MPB."),
  ]),
];

