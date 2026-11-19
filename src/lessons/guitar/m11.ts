// Mês 11 · dias 301 a 330 · Fraseado de verdade
import type { Lesson, TabNote } from "../types";
import { arpBox, B, blues12, box, bpmlog, check, checks, ear, jam, lesson, list, n, ol, r, rec, run, t, tab, theory, tip, warn } from "./lib";

const A = 9;
const B_ = 11;
const E = 4;

const BLUES_A = blues12("A7", "D7", "E7", true);
const IIVI_C = ["Dm7@5", "G7@3", "Cmaj7@3", "Cmaj7@3"];

/* Aproximações e enclosures (originais). */
const APPROACH_BELOW = [n(2, 1, 0.5), n(2, 2, 3.5), n(2, 4, 0.5), n(2, 5, 3.5)];
const APPROACH_ABOVE = [n(2, 3, 0.5), n(2, 2, 3.5), n(2, 6, 0.5), n(2, 5, 3.5)];
const DOUBLE_APPROACH = [n(2, 0, 0.5), n(2, 1, 0.5), n(2, 2, 3), n(2, 7, 0.5), n(2, 6, 0.5), n(2, 5, 3)];
const ENCL_3 = [n(2, 3, 0.5), n(2, 1, 0.5), n(2, 2, 3), n(2, 6, 0.5), n(2, 4, 0.5), n(2, 5, 3)];
const ENCL_4 = [n(2, 6, 0.5), n(2, 3, 0.5), n(2, 4, 0.5), n(2, 5, 2.5), n(3, 5, 0.5), n(3, 2, 0.5), n(3, 3, 0.5), n(3, 4, 2.5)];
/** Enclosures nas notas-guia do ii–V–I: F (Dm7), B (G7), E (Cmaj7). */
const ENCL_IIVI = [r(1), n(2, 8, 0.5), n(2, 5, 0.5), n(2, 6, 1), n(3, 5, 0.5), n(3, 3, 0.5), n(3, 4, 2), r(1), n(2, 6, 0.5), n(2, 4, 0.5), n(2, 5, 4), r(4)];
/** No blues: enclosure no C# do A7 e no C do D7. */
const ENCL_BLUES = [n(2, 3, 0.5), n(2, 1, 0.5), n(2, 2, 1), n(3, 2, 1), n(1, 0, 1), r(4), n(2, 2, 0.5), n(2, 0, 0.5), n(2, 1, 1), n(3, 2, 1), n(4, 4, 1)];

/* Motivo e transformações (Lá menor). */
const MOTIF: TabNote[] = [n(3, 5, 0.5), n(3, 7, 0.5), n(2, 5, 1), r(2)];
const REPEAT = [...MOTIF, ...MOTIF];
const RHYTHM_VAR = [...MOTIF, n(3, 5, 1), n(3, 7, 0.5), n(2, 5, 1.5), r(1)];
const MELODY_VAR = [...MOTIF, n(3, 5, 0.5), n(3, 7, 0.5), n(2, 8, 1), r(2)];
const SEQUENCE = [n(3, 5, 0.5), n(3, 7, 0.5), n(2, 5, 1), r(0.5), n(3, 7, 0.5), n(2, 5, 0.5), n(2, 8, 1), r(0.5), n(2, 5, 0.5), n(2, 8, 0.5), n(1, 5, 1), r(2.5)];
const FRAGMENT = [...MOTIF.slice(0, 3), n(3, 7, 0.5), n(2, 5, 0.5), n(3, 7, 0.5), n(2, 5, 0.5), n(3, 7, 0.5), n(2, 5, 1.5), r(2)];
const INVERSION = [n(3, 5, 0.5), n(4, 7, 0.5), n(4, 5, 1), r(2)];
const RETRO = [n(2, 5, 0.5), n(3, 7, 0.5), n(3, 5, 1), r(2)];
const AUGMENT = [n(3, 5, 1), n(3, 7, 1), n(2, 5, 2)];
const DIMINISH = [n(3, 5, 0.25), n(3, 7, 0.25), n(2, 5, 0.5), n(3, 5, 0.25), n(3, 7, 0.25), n(2, 5, 0.5), n(3, 5, 0.25), n(3, 7, 0.25), n(2, 5, 1.5)];

/** Células de Coltrane (1 2 3 5) em Dó, Fá e Sol. */
const CELLS = [n(5, 3, 0.5), n(5, 5, 0.5), n(4, 2, 0.5), n(4, 5, 0.5), n(4, 3, 0.5), n(4, 5, 0.5), n(3, 2, 0.5), n(3, 5, 0.5), n(6, 3, 0.5), n(6, 5, 0.5), n(5, 2, 0.5), n(5, 5, 0.5), n(5, 3, 2)];

/** Side-slip: a mesma frase meio tom acima e de volta. */
const SIDESLIP = [n(2, 5, 0.5), n(2, 8, 0.5), n(3, 7, 0.5), n(3, 5, 0.5), n(2, 6, 0.5), n(2, 9, 0.5), n(3, 8, 0.5), n(3, 6, 0.5), n(2, 5, 0.5), n(2, 8, 0.5), n(3, 7, 0.5), n(3, 5, 0.5), n(4, 7, 2)];

export const MONTH_11: Lesson[] = [
  lesson(301, "Aproximação cromática por baixo", ["Chegar na nota-alvo vindo meio tom abaixo", "Colocar o alvo no tempo forte", "Ouvir o *puxão* cromático"], [
    B(undefined, 5, "Bem-vindo ao mês 11. Você já sabe **quais** notas tocar; agora o assunto é **como chegar** nelas e **como contar uma história**.", jam("Blues em Lá", "Lá", 85, "shuffle", BLUES_A)),
    B("Meio tom antes", 8,
      "A aproximação mais simples: tocar a nota **meio tom abaixo** do alvo, no contratempo, e cair no alvo **no tempo**. A nota de fora dura pouco e faz o alvo soar ainda mais *dentro*.",
      tab("C → C# e D# → E sobre A7 (original)", 70, APPROACH_BELOW, { backing: ["A7"] }),
      theory("Regra de ouro das aproximações: **a nota de fora no tempo fraco, o alvo no tempo forte.** Ao contrário, soa errado."),
    ),
    B("Aproximações no blues", 12, jam("Blues em Lá", "Lá", 80, "shuffle", BLUES_A), "Escolha as 3ªs como alvo: **C#** no A7, **F#** no D7, **G#** no E7. Chegue em cada uma por meio tom abaixo."),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M"])),
  ]),

  lesson(302, "Aproximação por cima e dupla", ["Chegar no alvo vindo de cima", "Usar duas notas cromáticas", "Variar a direção"], [
    B(undefined, 5, tab("Por baixo", 75, APPROACH_BELOW, { backing: ["A7"] })),
    B("Outras direções", 8,
      list("**Por cima (diatônica):** a nota da escala logo acima do alvo. Soa mais suave.", "**Por cima (cromática):** meio tom acima. Mais tensa.", "**Dupla:** duas notas cromáticas seguidas antes do alvo (B, C → C#)."),
      tab("Por cima", 70, APPROACH_ABOVE, { backing: ["A7"] }),
      tab("Dupla", 70, DOUBLE_APPROACH, { backing: ["A7"] }),
    ),
    B("Misturando", 12, jam("A7 parado", "Lá", 80, "shuffle", ["A7", "A7", "A7", "A7"]), "Mire o C# e o E. Use uma direção diferente a cada compasso."),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m"])),
  ]),

  lesson(303, "Enclosure: cercando o alvo", ["Tocar acima e abaixo antes do alvo", "Ouvir o efeito de cerco", "Usar no blues"], [
    B(undefined, 5, tab("Dupla", 75, DOUBLE_APPROACH, { backing: ["A7"] })),
    B("Cercar e pousar", 8,
      "No **enclosure** (cercamento), você toca uma nota **acima** e uma **abaixo** do alvo, e só então o alvo. É o som do bebop, mas também aparece no choro e no blues.",
      tab("Enclosure de 3 notas: D, C → C#; F, D# → E", 70, ENCL_3, { backing: ["A7"] }),
      tip("Acima costuma ser **diatônica** (da escala) e abaixo **cromática** (meio tom). É a combinação mais natural."),
    ),
    B("Enclosure no blues", 12, tab("Enclosures no A7 e no D7 (original)", 75, ENCL_BLUES, { backing: ["A7", "A7", "D7", "D7"], swing: true }), jam("Blues em Lá", "Lá", 80, "shuffle", BLUES_A)),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m", "3M"])),
  ]),

  lesson(304, "Enclosures de 4 notas", ["Tocar o cerco de bebop", "Encaixar em colcheias", "Chegar no tempo 1"], [
    B(undefined, 5, tab("Enclosure de 3", 75, ENCL_3, { backing: ["A7"] })),
    B("Cerco duplo", 8,
      "O enclosure de **4 notas**: diatônica acima, diatônica abaixo, cromática abaixo, **alvo**. Em colcheias, cabe exatamente em um tempo e meio antes do tempo forte.",
      tab("F, D, D# → E e C, A, A# → B (original)", 70, ENCL_4, { backing: ["Cmaj7", "G7"] }),
    ),
    B("Cercos no tempo", 12, jam("Cmaj7 – G7", "Dó", 90, "jazz", ["Cmaj7@3", "G7@3", "Cmaj7@3", "G7@3"]), check("Grave e confira: o alvo caiu **no tempo 1**? Se caiu antes ou depois, comece o enclosure um pouco antes.")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(305, "Enclosures nas notas-guia", ["Cercar a 3ª e a 7ª no ii–V–I", "Unir notas-guia e bebop", "Tocar uma linha de jazz"], [
    B(undefined, 5, tab("Enclosure de 4", 75, ENCL_4, { backing: ["Cmaj7", "G7"] })),
    B("Guias cercadas", 8,
      "Junte o mês 6 e o mês 11: as **notas-guia** viram os **alvos** dos enclosures. F (Dm7) → B (G7) → E (Cmaj7), cada uma cercada.",
      tab("Enclosures nas guias (original)", 70, ENCL_IIVI, { backing: ["Dm7", "G7", "Cmaj7", "Cmaj7"] }),
    ),
    B("Linha de jazz", 12, jam("ii–V–I em Dó", "Dó", 100, "jazz", IIVI_C), rec("m11-guias")),
    B("Qual tétrade?", 5, ear("quality", ["maj7", "m7", "7"])),
  ]),

  lesson(306, "Enclosures no blues inteiro", ["Mirar a 3ª de cada acorde do blues", "Cercar C#, F# e G#", "Misturar com a pentatônica"], [
    B(undefined, 5, tab("Enclosures nas guias", 80, ENCL_IIVI, { backing: ["Dm7", "G7", "Cmaj7", "Cmaj7"] })),
    B("O mapa do blues", 8, arpBox("A7", 4, 8, "A7: alvo C#."), arpBox("D7", 4, 8, "D7: alvo F#."), arpBox("E7", 4, 8, "E7: alvo G#."), "Plano: pentatônica no meio das frases, **enclosure na 3ª** quando o acorde muda."),
    B("Uma volta", 12, jam("Blues em Lá", "Lá", 85, "shuffle", BLUES_A), rec("m11-blues-encl")),
    B("Qual tipo de acorde?", 5, ear("quality", ["7", "m7", "maj7"])),
  ]),

  lesson(307, "Revisão da semana 44", ["Aproximações", "Enclosures de 3 e 4 notas", "Guias cercadas"], [
    B("Aquecimento", 6, tab("Enclosures no blues", 80, ENCL_BLUES, { backing: ["A7", "A7", "D7", "D7"], swing: true })),
    B("O que você já sabe", 4, list("Nota de fora no fraco, alvo no forte", "Por baixo, por cima, dupla", "Enclosure: acima + abaixo + alvo", "4 notas: diatônica, diatônica, cromática, alvo")),
    B("Mini-desafio", 15, jam("Blues em Lá", "Lá", 90, "shuffle", BLUES_A), checks("sem44", "Semana 44 concluída", "Enclosure no C# do A7 no tempo 1", "Enclosures nas guias do ii–V–I", "Uma volta de blues com pelo menos 3 enclosures")),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m", "3M"])),
  ]),

  lesson(308, "Motivo e repetição", ["Entender motivo", "Repetir uma ideia curta", "Deixar o ouvido reconhecer"], [
    B(undefined, 5, jam("Blues em Lá", "Lá", 85, "shuffle", BLUES_A)),
    B("Uma ideia de 3 notas", 8,
      "Um **motivo** é uma ideia musical curta (2 a 5 notas) com ritmo marcante. Grandes solos raramente são uma enxurrada de notas novas: são **um motivo que se desenvolve**.",
      "O passo mais simples é a **repetição**. Repetir dá ao ouvinte algo para segurar.",
      tab("O motivo (C D E)", 75, MOTIF),
      tab("Repetição", 75, REPEAT, { backing: ["Am7", "Am7"] }),
    ),
    B("Repetir na base", 12, jam("Lá menor", "Lá menor", 85, "funk", ["Am7@5", "Am7@5", "D7@5", "D7@5"]), "Toque o motivo, deixe 2 tempos de silêncio, repita. Faça isso 8 vezes. Parece pouco, mas soa como música de verdade."),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(309, "Variação rítmica e melódica", ["Mudar o ritmo do motivo", "Mudar uma nota do motivo", "Manter a identidade"], [
    B(undefined, 5, tab("Repetição", 80, REPEAT)),
    B("Mudando pouco", 8,
      list("**Variação rítmica:** mesmas notas, outro ritmo.", "**Variação melódica:** mesmo ritmo, uma nota diferente (de preferência a última)."),
      tab("Variação rítmica", 75, RHYTHM_VAR),
      tab("Variação melódica", 75, MELODY_VAR),
    ),
    B("Quatro versões", 12, jam("Lá menor", "Lá menor", 85, "funk", ["Am7@5", "Am7@5", "D7@5", "D7@5"]), ol("Compasso 1: motivo.", "Compasso 2: variação rítmica.", "Compasso 3: variação melódica.", "Compasso 4: as duas variações juntas.")),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(310, "Sequência", ["Transpor o motivo pela escala", "Subir e descer em sequência", "Usar no blues"], [
    B(undefined, 5, tab("Variações", 80, [...RHYTHM_VAR, ...MELODY_VAR])),
    B("O mesmo desenho, mais acima", 8,
      "**Sequência** é repetir o motivo começando em outra nota da escala, mantendo o desenho. É uma das ferramentas mais usadas por Bach, pelo choro e pelo rock de guitarra.",
      tab("Sequência subindo pela pentatônica", 75, SEQUENCE),
    ),
    B("Sequência na base", 12, jam("Blues em Lá", "Lá", 85, "shuffle", BLUES_A), tip("Uma sequência de 3 passos (sobe, sobe, sobe) cria expectativa. No 4º passo, quebre o padrão: o ouvinte sente a surpresa.")),
    B("Subiu ou desceu?", 5, ear("highlow-close")),
  ]),

  lesson(311, "Fragmentação e expansão", ["Usar só um pedaço do motivo", "Esticar o motivo com notas novas", "Criar tensão por insistência"], [
    B(undefined, 5, tab("Sequência", 80, SEQUENCE)),
    B("Pedaços e acréscimos", 8,
      list("**Fragmentação:** pegue só as duas últimas notas do motivo e repita insistentemente. Cria tensão.", "**Expansão:** acrescente notas ao final do motivo, como se a frase *continuasse falando*."),
      tab("Fragmentação", 75, FRAGMENT),
      tab("Expansão", 75, [...MOTIF.slice(0, 3), n(2, 8, 0.5), n(1, 5, 0.5), n(1, 8, 1), t(2, 8, "b", 1, 2), n(2, 5, 1), r(1)]),
    ),
    B("Na base", 12, jam("Lá menor", "Lá menor", 90, "funk", ["Am7@5", "Am7@5", "D7@5", "D7@5"]), rec("m11-frag")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(312, "Inversão e retrógrado", ["Virar o motivo de cabeça para baixo", "Tocar o motivo de trás para frente", "Reconhecer o motivo transformado"], [
    B(undefined, 5, tab("Fragmentação", 80, FRAGMENT)),
    B("Espelhos", 8,
      list("**Inversão:** os intervalos trocam de direção. Se o motivo sobe, a inversão desce.", "**Retrógrado:** as notas na ordem contrária."),
      tab("Original", 75, MOTIF), tab("Inversão (desce: C, A, G)", 75, INVERSION), tab("Retrógrado (E, D, C)", 75, RETRO),
    ),
    B("Pergunta e resposta com espelho", 12, jam("Lá menor", "Lá menor", 85, "funk", ["Am7@5", "Am7@5", "D7@5", "D7@5"]), "Toque o motivo como **pergunta** e a inversão como **resposta**. O ouvido percebe a relação mesmo sem saber o nome."),
    B("Subiu ou desceu?", 5, ear("highlow-close")),
  ]),

  lesson(313, "Aumentação e diminuição", ["Tocar o motivo mais lento", "Tocar o motivo mais rápido", "Variar a densidade do solo"], [
    B(undefined, 5, tab("Inversão", 80, INVERSION)),
    B("Esticar e encolher", 8, list("**Aumentação:** mesmas notas, durações dobradas. Soa majestoso.", "**Diminuição:** durações divididas por dois. Soa urgente."), tab("Aumentação", 75, AUGMENT), tab("Diminuição", 75, DIMINISH)),
    B("Densidade", 12, jam("Lá menor", "Lá menor", 85, "funk", ["Am7@5", "Am7@5", "D7@5", "D7@5"]), "Comece o solo com a **aumentação** (poucas notas), passe pelo motivo original e termine com a **diminuição** (muitas notas). É um arco de intensidade pronto."),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(314, "Revisão da semana 45", ["As transformações do motivo", "Pergunta e resposta", "Arco de densidade"], [
    B("Aquecimento", 6, tab("Motivo e transformações", 80, [...MOTIF, ...INVERSION, ...RETRO, ...AUGMENT])),
    B("O que você já sabe", 4, list("Repetição e variação", "Sequência", "Fragmentação e expansão", "Inversão e retrógrado", "Aumentação e diminuição")),
    B("Mini-desafio", 15, jam("Lá menor", "Lá menor", 90, "funk", ["Am7@5", "Am7@5", "D7@5", "D7@5"]), checks("sem45", "Semana 45 concluída", "8 compassos só com um motivo e suas transformações", "Usei pelo menos 4 transformações", "Alguém que ouviu reconheceu o motivo voltando")),
    B("Subiu ou desceu?", 5, ear("highlow-close")),
  ]),

  lesson(315, "Um solo inteiro a partir de um motivo", ["Construir 12 compassos de um motivo só", "Planejar as transformações", "Gravar"], [
    B(undefined, 5, tab("Motivo", 85, MOTIF)),
    B("Um plano", 8, ol("Compassos 1–4 (A7): motivo, repetição, variação.", "Compassos 5–6 (D7): sequência subindo.", "Compassos 7–8 (A7): fragmentação insistente.", "Compassos 9–10 (E7, D7): expansão com bend.", "Compassos 11–12: retrógrado, resolvendo no Lá.")),
    B("Solo motívico", 12, jam("Blues em Lá", "Lá", 85, "shuffle", BLUES_A), rec("m11-motivico", "Grave a volta motívica.")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(316, "Superposição: pentatônica a partir da 5ª", ["Tocar Mi menor pentatônica sobre Am7", "Ouvir a 9ª e a 11ª", "Trocar de cor sem trocar de desenho"], [
    B(undefined, 5, jam("Blues em Lá", "Lá", 85, "shuffle", BLUES_A)),
    B("Desenho conhecido, cor nova", 10,
      "**Superpor** é tocar uma escala *de outro lugar* sobre o acorde para tirar cores diferentes. A mais fácil: sobre **Am7**, toque a **pentatônica menor de Mi** (a 5ª de Lá).",
      "Mi menor penta = E G A B D. Sobre Am7: **5, b7, 1, 9, 11**. Sai a terça (C) e entram a 9ª e a 11ª: som aberto, moderno, *modal*.",
      box(E, "pentaMinor", 7, 10, "Mi menor pentatônica na casa 7."),
      box(A, "pentaMinor", 5, 8, "Compare com a de Lá na casa 5."),
    ),
    B("Alternando", 10, jam("Am7 parado", "Lá menor", 90, "funk", ["Am7@5", "Am7@5"]), tab("Mi penta sobre Am7", 85, run(E, "pentaMinor", 7, 10, 0.5), { backing: ["Am7"] }), "Alterne: 2 compassos com a penta de Lá, 2 com a de Mi. Ouça a mudança de cor."),
    B("Qual escala?", 5, ear("scale", ["pentaMinor", "pentaMajor", "dorian"])),
  ]),

  lesson(317, "Pentatônica meio tom abaixo: lídio no maj7", ["Tocar Si menor pentatônica sobre Cmaj7", "Ouvir o #11", "Usar no acorde I"], [
    B(undefined, 5, tab("Mi penta sobre Am7", 90, run(E, "pentaMinor", 7, 10, 0.5), { backing: ["Am7"] })),
    B("Lídio instantâneo", 8,
      "Sobre **Cmaj7**, toque a **pentatônica menor de Si** (meio tom abaixo da tônica): B D E F# A = **7, 9, 3, #11, 13**. Não tem a tônica, tem todas as cores do **lídio**.",
      box(B_, "pentaMinor", 7, 10, "Si menor pentatônica na casa 7."),
    ),
    B("Cmaj7 lídio", 12, jam("Cmaj7 parado", "Dó lídio", 80, "bossa", ["Cmaj7@3", "Cmaj7@3"]), tab("Si penta sobre Cmaj7", 80, run(B_, "pentaMinor", 7, 10, 0.5), { backing: ["Cmaj7"] })),
    B("Qual escala?", 5, ear("scale", ["ionian", "lydian", "mixolydian"])),
  ]),

  lesson(318, "Pentatônica a um trítono: o V7 alterado", ["Tocar Réb maior penta sobre G7", "Ouvir as alterações", "Resolver no Cmaj7"], [
    B(undefined, 5, tab("Si penta sobre Cmaj7", 85, run(B_, "pentaMinor", 7, 10, 0.5), { backing: ["Cmaj7"] })),
    B("Alterada com 5 notas", 8,
      "Sobre **G7**, a **pentatônica maior de Réb** (a um trítono) dá Db Eb F Ab Bb = **#11, b13, b7, b9, #9**. É uma alterada *simplificada*: só tensões, nenhuma nota *comportada*.",
      box(1, "pentaMajor", 6, 9, "Réb maior pentatônica (mesmas notas de Si bemol menor pentatônica)."),
      warn("Funciona porque o próximo acorde (Cmaj7) resolve tudo. Sem resolução, soa como erro."),
    ),
    B("ii – V(alt) – I", 12, tab("Db penta no G7, resolvendo (original)", 80, [n(2, 6, 2), n(3, 7, 1), n(3, 5, 1), n(2, 9, 0.5), n(2, 6, 0.5), n(3, 8, 0.5), n(3, 6, 0.5), n(4, 8, 0.5), n(4, 6, 0.5), r(1), n(3, 5, 4)], { backing: ["Dm7", "G7alt", "Cmaj7"] }), jam("ii – V – I", "Dó", 90, "jazz", IIVI_C)),
    B("Qual escala?", 5, ear("scale", ["mixolydian", "altered", "pentaMajor"])),
  ]),

  lesson(319, "Pentatônica m6 e células de Coltrane", ["Tocar a pentatônica menor com 6ª", "Tocar células 1-2-3-5", "Usar células em sequência"], [
    B(undefined, 5, jam("ii – V – I", "Dó", 95, "jazz", IIVI_C)),
    B("Duas ferramentas", 8,
      list("**Pentatônica m6** (1 2 b3 5 6): em Lá = A B C E F#. Som dórico, jazzístico. Ótima sobre Am6 e Am7.", "**Células de Coltrane:** grupos de 4 notas **1 2 3 5** (maior) ou **1 b3 4 5** (menor), movidos pelos acordes. Soam modernos e organizados."),
      box(A, "pentaM6", 4, 8, "Lá m6 pentatônica."),
    ),
    B("Células", 12, tab("1-2-3-5 em Dó, Fá e Sol (original)", 85, CELLS), jam("Base", "Dó", 90, "jazz", ["Cmaj7@3", "Fmaj7@1", "G7@3", "Cmaj7@3"])),
    B("Qual escala?", 5, ear("scale", ["pentaMinor", "pentaM6", "dorian"])),
  ]),

  lesson(320, "Outside controlado", ["Sair do tom de propósito", "Voltar no lugar certo", "Side-slipping"], [
    B(undefined, 5, tab("Células", 90, CELLS)),
    B("Sair para voltar", 8,
      "**Outside** é tocar notas fora da harmonia **de propósito**, com uma lógica clara, e **voltar**. O jeito mais simples: **side-slipping**, tocar a mesma frase **meio tom acima** por um momento e voltar.",
      tab("Frase dentro, fora, dentro (original)", 80, SIDESLIP, { backing: ["Am7", "Am7"] }),
      theory("O ouvido aceita o *fora* quando: (1) a frase tem desenho claro, (2) dura pouco, (3) volta para dentro com firmeza."),
    ),
    B("Fora e dentro", 12, jam("Am7 parado", "Lá menor", 90, "funk", ["Am7@5", "Am7@5"]), rec("m11-outside")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(321, "Revisão da semana 46", ["Superposições de pentatônica", "Células", "Outside controlado"], [
    B("Aquecimento", 6, tab("Side-slip", 85, SIDESLIP, { backing: ["Am7", "Am7"] })),
    B("O que você já sabe", 4, list("Penta da 5ª: 9 e 11", "Penta meio tom abaixo: lídio no maj7", "Penta a um trítono: alterada no V7", "Penta m6 e células 1-2-3-5", "Side-slip: sair e voltar")),
    B("Mini-desafio", 15, jam("ii – V – I", "Dó", 95, "jazz", IIVI_C), checks("sem46", "Semana 46 concluída", "Uso 3 pentatônicas diferentes no ii–V–I", "Side-slip com volta clara", "Células 1-2-3-5 em 3 acordes")),
    B("Qual escala?", 5, ear("scale", ["pentaMinor", "pentaMajor", "pentaM6", "lydian"])),
  ]),

  lesson(322, "Fraseado vocal: respirar", ["Tocar como quem canta", "Deixar espaço entre frases", "Frases do tamanho de um fôlego"], [
    B(undefined, 5, jam("Am7 parado", "Lá menor", 85, "funk", ["Am7@5", "Am7@5"])),
    B("Se não dá para cantar, é longo demais", 8,
      "Cante uma frase antes de tocar. Se você precisar respirar no meio, a frase está longa demais para soar *vocal*. Guitarristas que soam como cantores pensam assim.",
      list("Frases de **1 a 2 compassos**.", "Silêncio **do mesmo tamanho** depois.", "Varie onde a frase começa: no 1, no *e* do 1, no 2…"),
    ),
    B("Cante e toque", 12, jam("Balada", "Lá menor", 70, "ballad", ["Am", "F", "C", "G"]), ol("Cante uma frase de 2 compassos.", "Toque a mesma frase.", "Respire 2 compassos.", "Repita 8 vezes."), rec("m11-vocal")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(323, "Notas longas, notas rápidas e swells", ["Contrastar densidades", "Fazer volume swell", "Controlar o ataque"], [
    B(undefined, 5, jam("Balada", "Lá menor", 70, "ballad", ["Am", "F", "C", "G"])),
    B("Contraste", 8,
      "Uma nota longa depois de uma corrida rápida soa enorme. Uma corrida depois de silêncio soa explosiva. **Contraste** é o que prende a atenção.",
      "**Volume swell:** com o volume da guitarra no zero, toque a nota e gire o botão de volume para cima com o dedo mínimo. A nota *nasce* sem ataque, como um violino. (Sem botão de volume? Toque bem suave e cresça com vibrato.)",
      tab("Rápido e longo (original)", 70, [n(1, 5, 0.25), n(2, 8, 0.25), n(2, 5, 0.25), n(3, 7, 0.25), n(3, 5, 0.25), n(4, 7, 0.25), n(3, 5, 0.25), n(3, 7, 0.25), t(3, 7, "b", 2, 2), t(3, 9, "~", 4), r(2)]),
    ),
    B("Arco de densidade", 12, jam("Balada", "Lá menor", 70, "ballad", ["Am", "F", "C", "G", "Am", "F", "C", "G"]), rec("m11-swell")),
    B("Quanto durou?", 5, ear("duration")),
  ]),

  lesson(324, "Arco de intensidade em duas voltas", ["Planejar começo, meio e clímax", "Usar registro, densidade e dinâmica", "Terminar bem"], [
    B(undefined, 5, tab("Rápido e longo", 75, [n(1, 5, 0.25), n(2, 8, 0.25), n(2, 5, 0.25), n(3, 7, 0.25), t(3, 7, "b", 2, 2), r(1)])),
    B("O mapa de um solo", 8, ol("**Volta 1, compassos 1–4:** grave, poucas notas, motivo.", "**Volta 1, 5–12:** desenvolvimento, sobe um pouco.", "**Volta 2, 1–8:** registro agudo, mais notas, bends.", "**Volta 2, 9–10:** clímax (a nota mais aguda do solo).", "**Volta 2, 11–12:** descida e final na tônica.")),
    B("Duas voltas", 12, jam("Blues em Lá", "Lá", 90, "shuffle", [...BLUES_A, ...BLUES_A]), rec("m11-arco")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(325, "Peça do mês: jazz blues com enclosures", ["Tocar um tema de blues", "Improvisar com enclosures e motivo", "Gravar"], [
    B(undefined, 5, tab("Enclosures no blues", 85, ENCL_BLUES, { backing: ["A7", "A7", "D7", "D7"], swing: true })),
    B("O tema", 8, "Tema original de blues em Lá: um motivo de 2 compassos, repetido sobre o D7 e respondido no final.", tab("Tema (original)", 90, [n(3, 5, 0.5), n(3, 6, 0.5), n(2, 5, 1), n(3, 7, 1), n(3, 5, 1), n(4, 7, 4), n(3, 5, 0.5), n(3, 6, 0.5), n(2, 5, 1), n(3, 7, 1), n(3, 5, 1), n(4, 7, 4), n(3, 7, 0.5), n(3, 4, 0.5), n(3, 5, 1), n(4, 4, 1), n(4, 5, 1), n(4, 7, 4), n(2, 5, 0.5), n(2, 3, 0.5), n(2, 2, 1), n(3, 2, 2), n(4, 2, 4), n(4, 6, 4), r(4)], { backing: BLUES_A, swing: true })),
    B("Tema, solo, tema", 12, jam("Blues em Lá", "Lá", 90, "shuffle", BLUES_A), rec("m11-peca")),
    B("Qual tipo de acorde?", 5, ear("quality", ["7", "m7", "maj7"])),
  ]),

  lesson(326, "Planejando o solo do desafio", ["Escolher o motivo", "Marcar onde entram enclosures", "Marcar as pausas"], [
    B(undefined, 5, jam("Blues em Lá", "Lá", 90, "shuffle", BLUES_A)),
    B("O que o desafio pede", 8, list("**Gravar** um solo sobre **2 voltas de blues** de 12 compassos.", "**Pausas intencionais.**", "**Um motivo que se desenvolve.**", "**Enclosures que resolvem** nas notas do acorde."), "Escreva num papel: seu motivo (3 a 5 notas), em quais compassos ele volta transformado, e onde estão 3 enclosures (por exemplo, na entrada do D7, do E7 e da volta 2)."),
    B("Testando o plano", 12, jam("Blues em Lá", "Lá", 90, "shuffle", [...BLUES_A, ...BLUES_A]), rec("m11-plano")),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m", "3M"])),
  ]),

  lesson(327, "Gravação 1 e autoavaliação", ["Gravar a primeira versão", "Ouvir com a lista de critérios", "Anotar o que mudar"], [
    B(undefined, 5, tab("Motivo", 90, MOTIF)),
    B("Ouvir como produtor", 5, "Grave sem parar. Depois ouça **três vezes**, cada vez prestando atenção numa coisa só: (1) pausas, (2) motivo, (3) enclosures."),
    B("Gravação", 15, jam("Blues em Lá", "Lá", 90, "shuffle", [...BLUES_A, ...BLUES_A]), rec("m11-grav1"), checks("aval1", "Autoavaliação", "Há pelo menos 4 pausas de 1 compasso ou mais", "O motivo aparece pelo menos 3 vezes, transformado", "Pelo menos 3 enclosures caíram em nota do acorde")),
    B("Igual ou diferente?", 5, ear("same-diff")),
  ]),

  lesson(328, "Gravação 2: ajustes", ["Corrigir o ponto fraco", "Gravar de novo", "Comparar as versões"], [
    B(undefined, 5, jam("Blues em Lá", "Lá", 90, "shuffle", BLUES_A)),
    B("Um ajuste por vez", 5, "Escolha **um** item da autoavaliação que não marcou e treine só ele por 10 minutos. Depois grave de novo."),
    B("Gravação 2", 15, jam("Blues em Lá", "Lá", 90, "shuffle", [...BLUES_A, ...BLUES_A]), rec("m11-grav2"), check("Ouça a gravação 1 e a 2 em seguida. A segunda conta uma história mais clara?")),
    B("Qual intervalo?", 5, ear("interval", ["2m", "2M", "3m", "3M", "4J"])),
  ]),

  lesson(329, "Ensaio geral do mês 11", ["Simular o desafio", "Gravar em uma tomada", "Saber se está pronto"], [
    B(undefined, 5, tab("Enclosures no blues", 90, ENCL_BLUES, { backing: ["A7", "A7", "D7", "D7"], swing: true })),
    B("Simulado", 5, ol("Uma tomada só, sem repetir.", "Duas voltas a 90 BPM.", "Ouça com a lista do dia 327.")),
    B("Faça", 15, jam("Simulado", "Lá", 90, "shuffle", [...BLUES_A, ...BLUES_A]), rec("m11-simulado"), checks("ensaio11", "Estou pronto?", "Pausas intencionais", "Motivo que se desenvolve", "Enclosures que resolvem")),
    B("Qual tipo de acorde?", 5, ear("quality", ["7", "m7", "maj7", "7alt"])),
  ]),

  lesson(330, "Desafio do mês 11", ["Gravar um solo de 2 voltas de blues", "Pausas, motivo e enclosures", "90 BPM"], [
    B("Aquecimento", 5, tab("Motivo e transformações", 85, [...MOTIF, ...INVERSION, ...RETRO])),
    B("As regras", 3, list("Base de blues em Lá a **90 BPM**.", "**Duas voltas** de 12 compassos, gravadas numa tomada.", "Precisa ter **pausas intencionais**, **um motivo que se desenvolve** e **enclosures que resolvem**.", "Ouça e marque os três critérios.")),
    B("Desafio", 15, jam("Desafio do mês 11", "Lá", 90, "shuffle", [...BLUES_A, ...BLUES_A]), rec("m11-desafio"), checks("desafio11", "Critérios", "Pausas intencionais", "Um motivo que se desenvolve", "Enclosures que resolvem"), bpmlog(11, 90)),
    B("O que vem", 7, ear("progression", ["I IV V I", "ii7 V7 Imaj7", "i iv V7 i"]), "O **mês 12** é a reta final: síntese de estilos (blues-jazz, rock/fusion, MPB/bossa), **transcrição**, sextinas, pre-bends, volume swells, revisão dos 8 eixos e o **projeto final**."),
  ]),
];

