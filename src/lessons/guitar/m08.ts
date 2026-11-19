// Mês 8 · dias 211 a 240 · Harmonia além do tom
import type { Lesson } from "../types";
import { arp1, arpBox, B, box, bpmlog, changes, check, checks, chords, ear, jam, lesson, list, n, ol, r, rec, run, tab, theory, tip, warn } from "./lib";

const A = 9;

/** Progressão do desafio. */
const PROG = ["Cmaj7@3", "E7", "Am7@5", "C7@3", "Fmaj7@1 Fm6", "Em7@7 A7@5", "Dm7@5 Db7", "Cmaj7@3"];
const PROG_NAMES = ["Cmaj7", "E7", "Am7", "C7", "Fmaj7 Fm6", "Em7 A7", "Dm7 Db7", "Cmaj7"];
/** Notas-alvo (3ª de cada acorde) na região das casas 4 a 8. */
const TARGETS = [n(2, 5, 4), n(4, 6, 4), n(3, 5, 4), n(2, 5, 4), n(3, 2, 2), n(3, 1, 2), n(3, 0, 2), n(2, 2, 2), n(2, 6, 2), n(2, 6, 2), n(2, 5, 4)];

const HARM_AM = run(A, "harmonicMinor", 4, 8, 0.5);

/** Frase que usa o G# sobre o E7 e resolve no Am (original). */
const HARM_LICK = [n(1, 5, 0.5), n(2, 6, 0.5), n(2, 5, 0.5), n(3, 7, 0.5), n(3, 6, 0.5), n(2, 5, 0.5), n(3, 7, 1), n(3, 5, 0.5), n(4, 7, 0.5), n(4, 6, 0.5), n(4, 7, 0.5), n(5, 7, 2)];

export const MONTH_8: Lesson[] = [
  lesson(211, "O campo menor natural", ["Construir o campo de Lá menor", "Ver que é o campo de Dó em outra ordem", "Tocar i–iv–v e i–VI–VII"], [
    B(undefined, 5, "Bem-vindo ao mês 8: o mês mais denso do ano. Repetir semanas é normal e esperado.", changes(["Cmaj7@d2b", "A7@d2", "Dm7@d2", "G7@d2"], 75)),
    B("O menor relativo, por dentro", 10,
      "A escala de **Lá menor natural** (A B C D E F G) tem as notas de Dó maior começando no Lá. Então o campo é o mesmo, girado:",
      list("**i** Am7 · **iiø** Bm7b5 · **III** Cmaj7", "**iv** Dm7 · **v** Em7 · **VI** Fmaj7 · **VII** G7"),
      box(A, "minor", 5, 8, "Lá menor natural, casas 5 a 8."),
      "Repare: no menor natural o **v é menor** (Em7). A tensão que puxa para casa fica fraca. É por isso que surgem as outras escalas menores.",
    ),
    B("O som do menor", 10, changes(["Am", "Dm", "Em", "Am"], 70, 4, "i – iv – v – i"), changes(["Am", "F", "G", "Am"], 70, 4, "i – VI – VII – i (rock e pop)"), jam("i – VI – VII", "Lá menor", 85, "rock", ["Am", "F", "G", "Am"])),
    B("Maior ou menor?", 5, ear("progression", ["i iv v i", "i VI VII i", "I IV V I"])),
  ]),

  lesson(212, "Menor harmônica: o V7 aparece", ["Subir a 7ª da escala menor", "Entender por que o E7 existe em Lá menor", "Tocar a escala menor harmônica"], [
    B(undefined, 5, changes(["Am", "F", "G", "Am"], 75)),
    B("Um sustenido muda tudo", 10,
      "Na **menor harmônica**, a 7ª sobe meio tom: em Lá, **G vira G#**. Agora o acorde do 5º grau tem 3ª maior: **E7**, um dominante de verdade, com trítono (G# e D) resolvendo em Am.",
      box(A, "harmonicMinor", 4, 8, "Lá menor harmônica. O G# (casa 4 da corda 6, casa 6 da corda 4, casa 9 da corda 2…) é o que dá o sabor *árabe* entre F e G#."),
      warn("Quando o E7 aparece numa música em Lá menor, **não é modulação**: é o V7 natural do tom menor."),
    ),
    B("A escala", 10, tab("Lá menor harmônica", 60, HARM_AM), changes(["Am", "E7", "Am", "E7"], 70)),
    B("Qual escala?", 5, ear("scale", ["minor", "harmonicMinor"])),
  ]),

  lesson(213, "Campo da menor harmônica e i–iv–V–i", ["Montar os acordes principais do menor", "Tocar a cadência menor", "Usar o G#°7"], [
    B(undefined, 5, tab("Lá menor harmônica", 65, HARM_AM)),
    B("O que muda no campo", 8,
      list("**V7:** E7 (antes Em7).", "**vii°7:** G#°7 (o diminuto que também puxa para Am).", "**i(maj7):** Am(maj7), o acorde de filme de suspense."),
      chords("Am", "Dm", "E7", "G#dim7", "Am(maj7)"),
      theory("Na prática, a música em tom menor mistura os três: natural (Em7, G), harmônica (E7, G#°7) e melódica. O compositor escolhe a cor."),
    ),
    B("Cadências menores", 12, changes(["Am", "Dm", "E7", "Am"], 70, 4, "i – iv – V7 – i"), changes(["Am", "Bm7b5", "E7", "Am"], 70, 4, "i – iiø – V7 – i"), changes(["Am", "Dm", "G#dim7", "Am"], 70, 4, "com o diminuto"), jam("i – iv – V7", "Lá menor", 75, "bossa", ["Am7@5", "Dm7@5", "E7", "Am7@5"])),
    B("Qual progressão?", 5, ear("progression", ["i iv V7 i", "i iv v i", "i VI VII i"])),
  ]),

  lesson(214, "Menor melódica e o ii–V menor", ["Conhecer a menor melódica", "Tocar Bm7b5 – E7 – Am", "Usar a 6ª maior no menor"], [
    B(undefined, 5, changes(["Am", "Bm7b5", "E7", "Am"], 75)),
    B("Subindo a 6ª também", 8,
      "A **menor melódica** sobe a 6ª e a 7ª: em Lá, **F# e G#**. Soa como *maior com 3ª menor*. No jazz ela é usada subindo e descendo. O acorde típico é o **Am6** ou o **Am(maj7)**.",
      box(A, "melodicMinor", 4, 8, "Lá menor melódica."),
      "O **ii–V menor** (Bm7b5 – E7 – Am) é a versão menor do ii–V–I: aparece em todo standard de jazz e em muita bossa.",
    ),
    B("ii–V menor", 12, changes(["Bm7b5", "E7", "Am6", "Am6"], 70), jam("ii–V–i em Lá menor", "Lá menor", 110, "bossa", ["Bm7b5", "E7", "Am6", "Am6"]), tab("Arpejos do ii–V–i menor", 65, [...arp1("Bm7b5", 5, 2, 0.5, { down: false }), r(0.5), ...arp1("E7", 6, 0, 0.5, { down: false }), r(1.5), ...arp1("Am6", 5, 0, 0.5, { down: false }), r(1.5)])),
    B("Qual escala?", 5, ear("scale", ["minor", "harmonicMinor", "melodicMinor"])),
  ]),

  lesson(215, "Solando no menor", ["Usar a pentatônica no i e no iv", "Trocar G por G# no V7", "Resolver no Lá"], [
    B(undefined, 5, jam("ii–V–i em Lá menor", "Lá menor", 110, "bossa", ["Bm7b5", "E7", "Am6", "Am6"])),
    B("Uma nota muda no V7", 8,
      "Sobre **Am** e **Dm**, a pentatônica de Lá funciona como sempre. Sobre o **E7**, troque o **G** pelo **G#**: é a 3ª do E7 e puxa com força para o Lá.",
      tab("Frase com o G# (original)", 70, HARM_LICK, { backing: ["E7", "Am"] }),
    ),
    B("Solo em menor", 12, jam("Lá menor", "Lá menor", 80, "rock", ["Am", "Dm", "E7", "Am"]), rec("m8-menor", "Grave 4 voltas usando o G# só no E7.")),
    B("Qual escala?", 5, ear("scale", ["minor", "harmonicMinor", "pentaMinor"])),
  ]),

  lesson(216, "Ouvindo maior e menor", ["Distinguir progressões maiores e menores", "Ouvir o V7 no menor", "Identificar o tom"], [
    B(undefined, 5, tab("Frase com o G#", 75, HARM_LICK)),
    B("Pistas", 8, list("O primeiro e o último acorde quase sempre dizem o tom.", "Um acorde **maior com sétima** que resolve num **menor** = V7 de um tom menor.", "i–VI–VII soa épico; i–iv–V soa dramático, clássico.")),
    B("Treino", 12, ear("progression", ["i iv V7 i", "I IV V I", "i VI VII i", "I V vi IV"]), ear("quality", ["", "m", "7", "m7b5"])),
    B("Qual escala?", 5, ear("scale", ["major", "minor", "harmonicMinor"])),
  ]),

  lesson(217, "Revisão da semana 31", ["Campos menores", "V7 e vii°7 no menor", "Solar no menor"], [
    B("Aquecimento", 6, tab("Lá menor harmônica", 70, HARM_AM)),
    B("O que você já sabe", 4, list("Menor natural = relativo do maior", "Harmônica: 7ª sobe (G#), aparece o E7", "Melódica: 6ª e 7ª sobem", "i–iv–V7, i–iiø–V7, i–VI–VII")),
    B("Mini-desafio", 15, jam("Lá menor", "Lá menor", 85, "rock", ["Am", "Dm", "E7", "Am"]), checks("sem31", "Semana 31 concluída", "Toco as três escalas menores de Lá", "ii–V–i menor com arpejos", "Uso o G# só no E7 sem errar")),
    B("Qual progressão?", 5, ear("progression", ["i iv V7 i", "i iiø7 V7 i", "i VI VII i"])),
  ]),

  lesson(218, "Dominante secundário: V7 do V", ["Entender o dominante de outro grau", "Tocar D7 em Dó", "Ver a nota de fora"], [
    B(undefined, 5, changes(["Am", "Bm7b5", "E7", "Am"], 75)),
    B("Um dominante emprestado", 10,
      "Todo acorde do campo pode ganhar **seu próprio dominante**. O mais comum é o **V7 do V**: em Dó, o V é G, e o dominante de G é **D7**. Escreve-se **V7/V**.",
      "O D7 tem **F#**, nota que não está em Dó maior. Essa nota *de fora* é a 3ª do D7 e sobe meio tom para o G. É ela que cria a sensação de *empurrão*.",
      chords("C", "D7", "G7", "C"),
    ),
    B("Ouvindo o empurrão", 10, changes(["C", "Dm7", "G7", "C"], 70, 4, "Sem o secundário"), changes(["C", "D7", "G7", "C"], 70, 4, "Com o D7"), check("Compare as duas: o D7 soa *mais iluminado* e mais urgente que o Dm7.")),
    B("Qual tipo de acorde?", 5, ear("quality", ["m7", "7"])),
  ]),

  lesson(219, "V7 do ii, do vi e do IV", ["Achar o dominante de cada grau", "Tocar A7, E7 e C7 em Dó", "Reconhecer pela resolução"], [
    B(undefined, 5, changes(["C", "D7", "G7", "C"], 75)),
    B("A família de dominantes", 10,
      "Em Dó maior, os dominantes secundários mais usados:",
      list("**A7 → Dm** (V7/ii): nota de fora **C#**.", "**E7 → Am** (V7/vi): nota de fora **G#**.", "**C7 → F** (V7/IV): nota de fora **Bb**.", "**D7 → G** (V7/V): nota de fora **F#**.", "**B7 → Em** (V7/iii): notas de fora **D#** e **F#**."),
      chords("A7", "E7", "C7", "D7", "B7"),
      tip("Regra para achar: pegue o acorde-alvo, suba uma **5ª** (ou desça uma 4ª) e faça um acorde **7** ali."),
    ),
    B("Cada um no seu lugar", 10, changes(["C", "A7", "Dm", "G7"], 70), changes(["C", "E7", "Am", "Am"], 70), changes(["C", "C7", "F", "G7"], 70)),
    B("Qual progressão?", 5, ear("progression", ["I V7/vi vi IV", "I V7/ii ii V", "I V7/IV IV V"])),
  ]),

  lesson(220, "Notas-alvo nos dominantes secundários", ["Mirar a 3ª do secundário", "Ajustar a escala no compasso dele", "Resolver no acorde seguinte"], [
    B(undefined, 5, changes(["C", "E7", "Am", "Am"], 75)),
    B("A nota de fora é a melhor nota", 8,
      "Sobre um dominante secundário, a escala do tom **erra** justamente a nota mais importante. A regra do currículo: **no compasso do secundário, mire a 3ª dele** (a nota de fora), e resolva meio tom acima no acorde seguinte.",
      arpBox("E7", 4, 8, "E7 na região 4–8. O G# (3ª) está nas cordas 6 (casa 4), 4 (casa 6) e 3 (casa 1)…"),
      arpBox("A7", 4, 8, "A7: o C# na corda 5 (casa 4) e na corda 2 (casa 2)…"),
    ),
    B("Alvo e resolução", 12, tab("G# → A sobre E7 → Am (original)", 70, [n(2, 5, 0.5), n(3, 7, 0.5), n(4, 6, 1), n(4, 7, 2), n(2, 5, 0.5), n(2, 4, 0.5), n(2, 5, 1), n(2, 5, 2)], { backing: ["E7", "Am"] }), jam("C – E7 – Am – A7 – Dm – G7", "Dó", 80, "pop", ["C", "E7", "Am", "A7", "Dm", "G7", "C", "C"]), rec("m8-alvos")),
    B("Qual tipo de acorde?", 5, ear("quality", ["", "m", "7"])),
  ]),

  lesson(221, "ii–V secundários", ["Preparar o secundário com seu ii", "Tocar Em7–A7–Dm7", "Ver ii–V em cadeia"], [
    B(undefined, 5, jam("C – E7 – Am", "Dó", 85, "pop", ["C", "E7", "Am", "A7", "Dm", "G7", "C", "C"])),
    B("ii–V para qualquer acorde", 8,
      "Assim como o V7 tem o seu ii (Dm7 – G7), o dominante secundário pode vir com o **ii relacionado**: **Em7 – A7 → Dm7**. É um ii–V *em miniatura* dentro do tom.",
      list("Para Dm7: **Em7 – A7**", "Para Em7: **F#m7b5 – B7**", "Para Am7: **Bm7b5 – E7**"),
    ),
    B("Cadeia", 12, changes(["Cmaj7@3", "Em7@7", "A7@5", "Dm7@5", "G7@3", "Cmaj7@3"], 70, 4), jam("ii–V secundário", "Dó", 100, "jazz", ["Cmaj7@3", "Em7@7 A7@5", "Dm7@5", "G7@3", "Cmaj7@3", "Bm7b5 E7", "Am7@5", "Dm7@5 G7@3"])),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "iii7 V7/ii ii7 V7"])),
  ]),

  lesson(222, "Dominantes estendidos", ["Encadear dominantes em quintas", "Tocar E7–A7–D7–G7–C", "Sentir o ciclo das quintas"], [
    B(undefined, 5, changes(["Cmaj7@3", "Em7@7", "A7@5", "Dm7@5", "G7@3", "Cmaj7@3"], 75)),
    B("Dominantes em fila", 8,
      "Quando um dominante resolve **em outro dominante**, e esse em outro, temos **dominantes estendidos**: **E7 → A7 → D7 → G7 → C**. O baixo anda pelo ciclo das quintas e a tensão só se resolve no final.",
      "É o motor do ragtime, do choro e de muitas canções dos anos 30. Em choro, chama-se *rodar o ciclo*.",
    ),
    B("Rodando", 12, changes(["E7", "A7", "D7", "G7", "C"], 70, 4), changes(["E7@7", "A7@5", "D7@5", "G7@3", "Cmaj7@3"], 70, 4, "Com acordes móveis"), jam("Dominantes estendidos", "Dó", 90, "jazz", ["Cmaj7@3", "E7@7", "A7@5", "D7@5", "G7@3", "Cmaj7@3", "Dm7@5", "G7@3"])),
    B("Qual tipo de acorde?", 5, ear("quality", ["7", "m7", "maj7"])),
  ]),

  lesson(223, "Rearmonizar pop com secundários", ["Trocar acordes do campo por secundários", "Colorir I–vi–IV–V", "Manter a melodia"], [
    B(undefined, 5, jam("Dominantes estendidos", "Dó", 95, "jazz", ["Cmaj7@3", "E7@7", "A7@5", "D7@5", "G7@3", "Cmaj7@3", "Dm7@5", "G7@3"])),
    B("Rearmonizar", 8,
      "**Rearmonizar** é trocar os acordes de uma música mantendo a melodia. Um jeito simples: colocar o dominante secundário **antes** do acorde-alvo, roubando metade do compasso anterior.",
      { list: ["Original: | C | Am | F | G |", "Rearmonizado: | C **E7** | Am **C7** | F **D7** | G7 |"] },
    ),
    B("Antes e depois", 12, jam("Original", "Dó", 85, "pop", ["C", "Am", "F", "G"]), jam("Rearmonizado", "Dó", 85, "pop", ["C E7", "Am C7", "F D7", "G7"]), rec("m8-rearmonia", "Toque a melodia que quiser (pode ser inventada) sobre os dois e compare.")),
    B("Qual progressão?", 5, ear("progression", ["I vi IV V", "I V7/vi vi IV"])),
  ]),

  lesson(224, "Revisão da semana 32", ["Dominantes secundários", "Notas-alvo", "Rearmonização"], [
    B("Aquecimento", 6, changes(["E7", "A7", "D7", "G7", "C"], 75)),
    B("O que você já sabe", 4, list("V7/V, V7/ii, V7/vi, V7/IV, V7/iii", "Nota de fora = 3ª do secundário", "ii–V secundário", "Dominantes estendidos", "Rearmonizar com secundários")),
    B("Mini-desafio", 15, jam("Rearmonizado", "Dó", 90, "pop", ["C E7", "Am C7", "F D7", "G7"]), checks("sem32", "Semana 32 concluída", "Acho o dominante de qualquer grau em Dó", "Miro a 3ª do E7 e do A7 no solo", "Expliquei a rearmonização para alguém (ou para o espelho)")),
    B("Qual progressão?", 5, ear("progression", ["I V7/vi vi IV", "I V7/ii ii V", "I V7/IV IV V"])),
  ]),

  lesson(225, "SubV7: o substituto do trítono", ["Trocar G7 por Db7", "Entender o trítono em comum", "Ouvir o baixo cromático"], [
    B(undefined, 5, jam("Rearmonizado", "Dó", 90, "pop", ["C E7", "Am C7", "F D7", "G7"])),
    B("Dois dominantes, um trítono", 10,
      "O **G7** tem o trítono **B–F**. O **Db7** tem **F–Cb** (Cb = B). **É o mesmo trítono!** Por isso o Db7 pode substituir o G7: ele resolve no C do mesmo jeito, só que o baixo desce **meio tom** (Db → C) em vez de cair uma quinta.",
      { w: "fretboard", from: 0, frets: 5, markers: [{ s: 4, f: 3, label: "F", kind: "deg-7" }, { s: 3, f: 4, label: "B", kind: "deg-3" }], caption: "As notas-guia do G7 (B e F) são as mesmas do Db7 (F e Cb), com os papéis trocados." },
      chords("G7@3", "Db7", "Cmaj7@3"),
      theory("**subV7** = o dominante que fica a um **trítono** (6 casas) do V7 original. Para G7, é Db7. Para D7, é Ab7. Para A7, é Eb7."),
    ),
    B("V7 × subV7", 10, changes(["Dm7@5", "G7@3", "Cmaj7@3", "Cmaj7@3"], 70), changes(["Dm7@5", "Db7", "Cmaj7@3", "Cmaj7@3"], 70), check("Toque só os baixos: D → G → C e D → Db → C. O segundo é uma escada cromática.")),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "ii7 bII7 Imaj7"])),
  ]),

  lesson(226, "Baixos cromáticos com subV7", ["Encadear subV7 dos secundários", "Fazer o baixo descer por semitons", "Rearmonizar com subV"], [
    B(undefined, 5, changes(["Dm7@5", "Db7", "Cmaj7@3", "Cmaj7@3"], 75)),
    B("Escada descendo", 8,
      "Aplicando o subV7 a cada dominante estendido, a cadeia **E7 – A7 – D7 – G7 – C** vira **E7 – Eb7 – D7 – Db7 – C**: o baixo desce **cromático**, e cada acorde ainda é um dominante resolvendo.",
      chords("E7@7", "Eb7", "D7@5", "Db7", "Cmaj7@3"),
    ),
    B("Cromático", 12, changes(["E7@7", "Eb7", "D7@5", "Db7", "Cmaj7@3"], 65), jam("Ciclo com subV", "Dó", 95, "bossa", ["Cmaj7@3", "E7@7", "Eb7", "D7@5", "Db7", "Cmaj7@3", "Dm7@5", "Db7"])),
    B("Qual tipo de acorde?", 5, ear("quality", ["7", "maj7", "m7"])),
  ]),

  lesson(227, "Solando sobre o subV7", ["Mirar as guias do subV7", "Usar a escala certa", "Resolver por meio tom"], [
    B(undefined, 5, changes(["E7@7", "Eb7", "D7@5", "Db7", "Cmaj7@3"], 70)),
    B("A escala do subV7", 8,
      "Sobre o **Db7** no lugar do G7, a escala mais natural é o **lídio b7** de Db (Db Eb F G Ab Bb Cb). Ela tem o **G** (a tônica do V7 original) como #11. Na prática, mire as guias **F** e **B (Cb)**, que são as mesmas do G7, e resolva em **E** e **C**.",
      box(1, "lydianDominant", 3, 7, "Db lídio b7, casas 3 a 7."),
    ),
    B("Solo", 12, tab("Frase sobre Dm7 – Db7 – Cmaj7 (original)", 70, [n(2, 6, 1), n(2, 3, 0.5), n(2, 1, 0.5), n(3, 2, 1), n(3, 5, 1), n(3, 4, 1), n(2, 4, 0.5), n(2, 6, 0.5), n(3, 6, 1), n(3, 4, 1), n(2, 5, 4)], { backing: ["Dm7", "Db7", "Cmaj7"] }), jam("ii – subV – I", "Dó", 85, "bossa", ["Dm7@5", "Db7", "Cmaj7@3", "Cmaj7@3"])),
    B("Qual progressão?", 5, ear("progression", ["ii7 V7 Imaj7", "ii7 bII7 Imaj7"])),
  ]),

  lesson(228, "Empréstimo modal: o iv menor", ["Pegar acordes do tom menor paralelo", "Tocar F → Fm → C", "Ouvir o acorde *surpresa*"], [
    B(undefined, 5, jam("ii – subV – I", "Dó", 90, "bossa", ["Dm7@5", "Db7", "Cmaj7@3", "Cmaj7@3"])),
    B("Pedindo emprestado ao Dó menor", 10,
      "**Empréstimo modal** é usar, em Dó maior, um acorde de **Dó menor** (o tom paralelo: mesma tônica, outro modo). O mais famoso: o **iv menor (Fm)**.",
      "O **Ab** do Fm desce meio tom para o **G** (5ª do C). É uma das resoluções mais emocionantes da música pop: o acorde que faz o refrão *apertar o coração*.",
      chords("F", "Fm", "Fm6", "C"),
    ),
    B("Maior → menor → casa", 10, changes(["C", "F", "Fm", "C"], 65), changes(["Cmaj7@3", "Fmaj7@1", "Fm6", "Cmaj7@3"], 65), jam("Com o iv menor", "Dó", 75, "ballad", ["C", "Am", "F", "Fm", "C", "Am", "Dm7", "G7"])),
    B("Maior ou menor?", 5, ear("major-minor")),
  ]),

  lesson(229, "bVII e bVI: o empréstimo do rock", ["Tocar Bb e Ab em Dó", "Fazer a cadência bVI–bVII–I", "Usar a pentatônica menor sobre eles"], [
    B(undefined, 5, changes(["C", "F", "Fm", "C"], 70)),
    B("Acordes do Dó menor", 8,
      "Outros empréstimos muito usados em Dó maior: **Bb (bVII)** e **Ab (bVI)**. A sequência **Ab – Bb – C** (bVI – bVII – I) é a cadência *heroica* do rock e das trilhas de videogame.",
      chords("Ab", "Bb", "C@3"),
      tip("Sobre bVII e bVI, a **pentatônica menor de Dó** encaixa bem, porque ela tem Eb e Bb."),
    ),
    B("Épico", 12, changes(["C@3", "Bb", "F", "C@3"], 75, 4, "I – bVII – IV – I"), changes(["Ab", "Bb", "C@3", "C@3"], 75, 4, "bVI – bVII – I"), jam("Rock com empréstimos", "Dó", 100, "rock", ["C5", "Bb5", "F5", "C5", "Ab", "Bb", "C5", "C5"])),
    B("Qual progressão?", 5, ear("progression", ["I bVII IV I", "bVI bVII I", "I IV V I"])),
  ]),

  lesson(230, "Empréstimos da MPB", ["Usar ivm6, bVIImaj7 e bIImaj7", "Ouvir a sofisticação da MPB", "Analisar uma progressão"], [
    B(undefined, 5, jam("Rock com empréstimos", "Dó", 100, "rock", ["C5", "Bb5", "F5", "C5", "Ab", "Bb", "C5", "C5"])),
    B("Cores emprestadas", 8,
      list("**Fm6** (ivm6): o iv menor com 6ª, macio, de bossa.", "**Bbmaj7** (bVIImaj7): luminoso e inesperado.", "**Abmaj7** (bVImaj7): sonho, suspense bom.", "**Dbmaj7** (bIImaj7): o *napolitano*, muito usado como substituto do V."),
      chords("Fm6", "Bbmaj7", "Abmaj7", "Dbmaj7"),
    ),
    B("Progressão com empréstimos (original)", 12, changes(["Cmaj7@3", "Abmaj7", "Bbmaj7", "Cmaj7@3"], 65), changes(["Cmaj7@3", "Fm6", "Dbmaj7", "Cmaj7@3"], 65), jam("Bossa com empréstimos", "Dó", 110, "bossa", ["Cmaj7@3", "Cmaj7@3", "Fmaj7@1", "Fm6", "Em7@7", "Abmaj7", "Dbmaj7", "Cmaj7@3"])),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m6", "m7", "7"])),
  ]),

  lesson(231, "Revisão da semana 33", ["subV7", "Empréstimo modal", "Baixos cromáticos"], [
    B("Aquecimento", 6, changes(["E7@7", "Eb7", "D7@5", "Db7", "Cmaj7@3"], 75)),
    B("O que você já sabe", 4, list("subV7: dominante a um trítono, mesmo trítono", "Empréstimo: acordes do menor paralelo", "iv menor, bVII, bVI, bIImaj7", "Pentatônica menor sobre os empréstimos")),
    B("Mini-desafio", 15, jam("Bossa com empréstimos", "Dó", 110, "bossa", ["Cmaj7@3", "Cmaj7@3", "Fmaj7@1", "Fm6", "Em7@7", "Abmaj7", "Dbmaj7", "Cmaj7@3"]), checks("sem33", "Semana 33 concluída", "Acho o subV7 de qualquer dominante", "Toco F → Fm → C e sinto a resolução", "Analiso Abmaj7 e Dbmaj7 em Dó")),
    B("Qual progressão?", 5, ear("progression", ["ii7 bII7 Imaj7", "I bVII IV I", "bVI bVII I"])),
  ]),

  lesson(232, "Rearmonização no estilo MPB", ["Rearmonizar uma melodia simples", "Usar secundários, subV e empréstimo", "Comparar versões"], [
    B(undefined, 5, changes(["Cmaj7@3", "Fm6", "Dbmaj7", "Cmaj7@3"], 70)),
    B("Uma melodia, três harmonias", 8,
      "A melodia abaixo (original) pode ser harmonizada de várias formas. Toque a melodia e escute cada base.",
      tab("Melodia (original)", 70, [n(2, 1, 2), n(2, 3, 1), n(1, 0, 1), n(2, 3, 2), n(2, 1, 2), n(1, 1, 2), n(1, 0, 1), n(2, 3, 1), n(2, 1, 4)]),
    ),
    B("Três versões", 12, jam("Versão 1: só o campo", "Dó", 75, "bossa", ["C", "G", "F", "C"]), jam("Versão 2: secundários e subV", "Dó", 75, "bossa", ["Cmaj7@3", "A7@5", "Dm7@5 Db7", "Cmaj7@3"]), jam("Versão 3: empréstimos", "Dó", 75, "bossa", ["Cmaj7@3", "Abmaj7", "Fm6", "Cmaj7@3"]), rec("m8-mpb", "Grave a melodia sobre as três e escolha a sua favorita.")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m6", "7"])),
  ]),

  lesson(233, "Análise da progressão do desafio", ["Analisar 8 compassos com acordes de fora", "Marcar secundários, subV e empréstimo", "Achar a nota-alvo de cada compasso"], [
    B(undefined, 5, jam("Versão 2", "Dó", 80, "bossa", ["Cmaj7@3", "A7@5", "Dm7@5 Db7", "Cmaj7@3"])),
    B("A progressão", 10,
      { list: [`| ${PROG_NAMES.join(" | ")} |`] },
      { callout: "theory", title: "Análise", text: ["**Cmaj7** I · **E7** V7/vi · **Am7** vi · **C7** V7/IV", "**Fmaj7 Fm6** IV – ivm6 (empréstimo) · **Em7 A7** iii – V7/ii (ii–V secundário)", "**Dm7 Db7** ii – subV7 · **Cmaj7** I"] },
      "Notas-alvo (3ª de cada acorde): **E · G# · C · E · A Ab · G C# · F F · E**. Repare nas linhas cromáticas: A → Ab → G e C# → (D) …",
    ),
    B("As notas-alvo", 10, tab("Linha de notas-alvo", 65, TARGETS, { backing: PROG_NAMES }), check("Cante a linha de alvos junto com a base antes de tocar.")),
    B("Qual tipo de acorde?", 5, ear("quality", ["maj7", "m7", "7", "m6"])),
  ]),

  lesson(234, "Alvos compasso a compasso", ["Tocar só a nota-alvo no tempo 1", "Acrescentar uma aproximação", "Montar um esqueleto de solo"], [
    B(undefined, 5, tab("Linha de notas-alvo", 70, TARGETS, { backing: PROG_NAMES })),
    B("Do alvo ao solo", 5, ol("Volta 1: só as notas-alvo, longas.", "Volta 2: uma nota antes de cada alvo (meio tom abaixo ou acima).", "Volta 3: duas ou três notas antes de cada alvo.")),
    B("Três voltas", 15, jam("Progressão do desafio", "Dó", 75, "bossa", PROG), rec("m8-esqueleto")),
    B("Qual progressão?", 5, ear("progression", ["I V7/vi vi V7/IV", "ii7 bII7 Imaj7", "IV ivm I"])),
  ]),

  lesson(235, "Solo sobre a progressão · parte 1", ["Solar com escala do tom e ajustes", "Trocar a nota no compasso certo", "Gravar"], [
    B(undefined, 5, tab("Linha de notas-alvo", 75, TARGETS, { backing: PROG_NAMES })),
    B("Escala do tom, com remendos", 8,
      "Use a escala de Dó maior (ou a pentatônica de Lá menor) como base e **remende** só nos compassos de fora:",
      list("**E7:** G# no lugar de G.", "**C7:** Bb no lugar de B.", "**Fm6:** Ab no lugar de A.", "**A7:** C# no lugar de C.", "**Db7:** Db e Ab; resolva em E ou C."),
    ),
    B("Solo", 12, jam("Progressão do desafio", "Dó", 80, "bossa", PROG), rec("m8-solo1")),
    B("Qual tipo de acorde?", 5, ear("quality", ["maj7", "m7", "7", "m6"])),
  ]),

  lesson(236, "Solo sobre a progressão · parte 2", ["Usar arpejos nos acordes de fora", "Misturar pentatônica e alvos", "Dar forma ao solo"], [
    B(undefined, 5, jam("Progressão do desafio", "Dó", 80, "bossa", PROG)),
    B("Arpejos nos pontos difíceis", 8, arpBox("E7", 4, 8), arpBox("C7", 4, 8), arpBox("A7", 4, 8), "Nos compassos de fora, arpeje o acorde. Nos de dentro, use a pentatônica. O contraste soa intencional."),
    B("Solo com forma", 12, jam("Progressão do desafio (swing)", "Dó", 80, "jazz", PROG), rec("m8-solo2", "Grave duas voltas: a primeira calma, a segunda mais intensa.")),
    B("Qual progressão?", 5, ear("progression", ["I V7/vi vi V7/IV", "ii7 bII7 Imaj7", "IV ivm I"])),
  ]),

  lesson(237, "Peça do mês: tema rearmonizado", ["Tocar um tema sobre a progressão", "Improvisar um chorus", "Gravar tudo"], [
    B(undefined, 5, tab("Linha de notas-alvo", 75, TARGETS, { backing: PROG_NAMES })),
    B("O tema", 8, "Tema original construído sobre as notas-alvo, com ritmo de bossa.", tab("Tema (original)", 80, [n(2, 5, 1.5), n(2, 3, 0.5), n(2, 1, 2), r(0.5), n(4, 6, 0.5), n(4, 7, 1), n(4, 6, 2), n(3, 5, 1.5), n(3, 7, 0.5), n(2, 5, 2), r(0.5), n(3, 3, 0.5), n(3, 5, 1), n(2, 5, 2), n(3, 2, 2), n(3, 1, 2), n(3, 0, 2), n(2, 2, 2), n(2, 6, 2), n(2, 6, 2), n(2, 5, 4)], { backing: PROG_NAMES })),
    B("Tema + solo + tema", 12, jam("Peça do mês 8", "Dó", 80, "bossa", PROG), rec("m8-peca")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7", "m6"])),
  ]),

  lesson(238, "Treino do desafio: alvos de fora", ["Analisar sem consultar", "Solar mirando os alvos", "Achar o compasso fraco"], [
    B(undefined, 5, jam("Progressão do desafio", "Dó", 80, "bossa", PROG)),
    B("O que o desafio pede", 5, list("**Analisar** a progressão: dizer qual é o dominante secundário, o subV7 e o empréstimo.", "**Improvisar** sobre ela a **80 BPM**.", "No compasso do **dominante secundário**, a nota-alvo é a **3ª dele**.")),
    B("Treino", 15, ol("Escreva a análise num papel, sem olhar o dia 233.", "Confira.", "Toque duas voltas de solo e grave."), jam("Treino", "Dó", 80, "bossa", PROG), rec("m8-treino")),
    B("Qual progressão?", 5, ear("progression", ["I V7/vi vi V7/IV", "ii7 bII7 Imaj7", "IV ivm I"])),
  ]),

  lesson(239, "Ensaio geral do mês 8", ["Simular o desafio", "Ouvir a gravação com a análise do lado", "Saber se está pronto"], [
    B(undefined, 5, tab("Linha de notas-alvo", 80, TARGETS, { backing: PROG_NAMES })),
    B("Simulado", 5, ol("Análise escrita em 2 minutos.", "Base a 80 BPM.", "Duas voltas de solo.", "Grave.")),
    B("Faça", 15, jam("Simulado", "Dó", 80, "bossa", PROG), rec("m8-simulado"), checks("ensaio8", "Estou pronto?", "Análise certa sem consultar", "Toquei G# no E7 e C# no A7", "Resolvi o Db7 em E ou C")),
    B("Qual tipo de acorde?", 5, ear("quality", ["maj7", "m7", "7", "m6"])),
  ]),

  lesson(240, "Desafio do mês 8", ["Analisar uma progressão com acordes de fora", "Solar ajustando a nota-alvo", "80 BPM"], [
    B("Aquecimento", 5, changes(["Cmaj7@3", "E7", "Am7@5", "C7@3"], 75)),
    B("As regras", 3, list("**Análise:** escreva os graus da progressão e marque secundários, subV7 e empréstimo.", "**Solo:** duas voltas a **80 BPM**.", "No compasso do **E7**, mire o **G#**. No do **A7**, o **C#**.")),
    B("Desafio", 15, jam("Desafio do mês 8", "Dó", 80, "bossa", PROG), rec("m8-desafio"), bpmlog(8, 80)),
    B("O que vem", 7, ear("scale", ["major", "minor", "harmonicMinor"]), "No **mês 9** o braço inteiro se conecta: **3NPS**, **CAGED** e **escala linear**, **tensões e avoid notes**, e os **7 modos** tocados sobre drone, sempre na mesma tônica."),
  ]),
];

