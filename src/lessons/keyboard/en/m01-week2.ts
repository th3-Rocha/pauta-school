// Keyboard · Month 1 · days 8 to 14 (English)
import type { Lesson } from "../../types";
import {
  C3, C4, C6, D4, E4, F4, G4, E3, G3,
  MARY, ODE_SIMPLE, PASSEIO, PASSEIO_LH, PERGUNTA_LH, PERGUNTA_RH,
  lh, rh, seqOf, staffOf,
} from "../shared";

const M = 1;
const WIDE = { from: C3, to: C6 };
const POS = { from: C4 - 5, to: C4 + 12 };
const BOTH = { from: C3, to: C4 + 12 };
const FIVE = [C4, D4, E4, F4, G4];

export const KEYBOARD_WEEK2_EN: Lesson[] = [
  {
    day: 8,
    month: M,
    title: "Lines and spaces",
    minutes: 30,
    objectives: ["Read C, D, E, F and G on the staff", "Tell a line note from a space note", "Read a short phrase without looking at the keyboard"],
    blocks: [
      {
        title: "Review: map",
        minutes: 4,
        body: [{ w: "key-input" }, { w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 2, 4, 5, 7, 9, 11], rounds: 10, title: "Any white key" }],
      },
      {
        title: "Line, space, line, space",
        minutes: 10,
        body: [
          "Look at the drawing: **C** has a line through its middle (the ledger line). **D** hangs just below the staff. **E** is cut by the first line. **F** sits in the first space. **G** is cut by the second line.",
          "So: **line, space, line, space, line**. Each step on the staff is a neighboring white key.",
          { w: "staff", notes: staffOf([[C4, 2], [D4, 2], [E4, 2], [F4, 2], [G4, 4]]), names: true },
          { w: "staff-quiz", notes: FIVE, ...POS, rounds: 12, title: "C to G on the staff" },
        ],
      },
      {
        title: "Reading phrases",
        minutes: 11,
        body: [
          "The first half of a song you'll play tomorrow. Read it on the staff: the keyboard won't help.",
          { w: "sequence", title: "Reading", ...POS, notes: seqOf(MARY.slice(0, 13)), bpm: 60, goal: 2, staff: true, hideKeys: true },
          { callout: "tip", text: "Look one note ahead. While you play one, your eyes are already looking for the next." },
        ],
      },
      {
        title: "Ear and creation",
        minutes: 5,
        body: [{ w: "key-echo", notes: [C4, D4, E4] }, "Make up an 8-note phrase using only lines (C, E, G), then one using only spaces (D, F)."],
      },
    ],
  },
  {
    day: 9,
    month: M,
    title: "Mary Had a Little Lamb",
    minutes: 30,
    objectives: ["Read a whole song on the staff", "Play the long notes for their full length", "Reach 80% in In time mode"],
    blocks: [
      {
        title: "Review: reading",
        minutes: 5,
        body: [{ w: "staff-quiz", notes: FIVE, ...POS, rounds: 10, title: "C to G on the staff" }],
      },
      {
        title: "The song on the staff",
        minutes: 8,
        body: [
          "A traditional song, in the public domain, that fits entirely in C position. Read it first without playing: which notes appear? Where are the half notes and the whole note?",
          { w: "staff", notes: staffOf(MARY), caption: "Mary Had a Little Lamb (traditional)." },
          { w: "play-along", title: "Just listen", notes: rh(MARY), bpm: 72, ...POS, modes: ["listen"], defaultMode: "listen" },
        ],
      },
      {
        title: "Play",
        minutes: 12,
        body: [
          "First **Wait for me**, then **In time**.",
          { w: "play-along", title: "Mary Had a Little Lamb", notes: rh(MARY), bpm: 72, ...POS, defaultMode: "wait" },
          { callout: "selfCheck", text: "Did the three repeated notes (E E E) come out even, without the last one weaker? Repeating a key means releasing and playing again, not just pressing harder." },
        ],
      },
      {
        title: "Ear and creation",
        minutes: 5,
        body: [{ w: "key-echo", notes: [C4, E4, G4] }, "Change the ending: replace the last two bars with your own notes, ending on C."],
      },
    ],
  },
  {
    day: 10,
    month: M,
    title: "Question and answer",
    minutes: 30,
    objectives: ["Alternate hands without losing the pulse", "Use one hand's rest to get the other ready"],
    blocks: [
      {
        title: "Review: Mary",
        minutes: 5,
        body: [{ w: "play-along", title: "Mary Had a Little Lamb", notes: rh(MARY), bpm: 72, ...POS, defaultMode: "tempo" }],
      },
      {
        title: "One hand asks, the other answers",
        minutes: 6,
        body: [
          "In this piece the hands **don't play together**: the right plays two bars, stops, and the left answers. While one plays, the other stays **still over its keys**, ready.",
          "In the falling bars, the color tells the hand: **pink (R) is the right**, **hatched blue (L) is the left**.",
        ],
      },
      {
        title: "Question and answer",
        minutes: 14,
        body: [
          { w: "play-along", title: "Question and answer", notes: [...rh(PERGUNTA_RH), ...lh(PERGUNTA_LH)], bpm: 60, ...BOTH, defaultMode: "wait" },
          "Now in time. One hand's rest is exactly the other hand's turn: always count.",
          { w: "metronome", bpm: 60 },
        ],
      },
      {
        title: "Creation",
        minutes: 5,
        body: ["Make up your own: the right asks with 3 or 4 notes, the left answers imitating the rhythm. Play with the metronome.", { w: "keys", ...BOTH, names: "c-only" }],
      },
    ],
  },
  {
    day: 11,
    month: M,
    title: "The supporting left hand",
    minutes: 30,
    objectives: ["Play the low notes of the song (the roots) in the left hand", "Accompany while the site plays the melody", "Play the melody while the site plays the bass"],
    blocks: [
      {
        title: "Review: question and answer",
        minutes: 5,
        body: [{ w: "play-along", title: "Question and answer", notes: [...rh(PERGUNTA_RH), ...lh(PERGUNTA_LH)], bpm: 60, ...BOTH, defaultMode: "tempo" }],
      },
      {
        title: "Root",
        minutes: 6,
        body: [
          "A lot of music has a low note holding up the melody: the **root** of the chord. In Passeio it alternates between **C** and **G**, always in half notes (2 beats).",
          "In the left hand's C position, C is finger **5** and G is finger **1**. The hand doesn't need to move.",
        ],
      },
      {
        title: "You on the bass, the site on the melody",
        minutes: 14,
        body: [
          "First you play only the **left** and the site plays the melody. Then the other way around.",
          { w: "play-along", title: "Passeio: you on the left", notes: [...rh(PASSEIO), ...lh(PASSEIO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo", auto: ["right"] },
          { w: "play-along", title: "Passeio: you on the right", notes: [...rh(PASSEIO), ...lh(PASSEIO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo", auto: ["left"] },
          { callout: "tip", text: "When you play the left hand, listen to the melody: your C or G has to land together with its note at the start of each half note." },
        ],
      },
      {
        title: "Ear",
        minutes: 5,
        body: ["Low: C, E or G?", { w: "key-echo", notes: [C3, E3, G3] }],
      },
    ],
  },
  {
    day: 12,
    month: M,
    title: "Loud and soft",
    minutes: 30,
    objectives: ["Play soft (piano) and loud (forte) on purpose", "Control volume with arm weight, not finger force"],
    blocks: [
      {
        title: "Review: supporting left hand",
        minutes: 5,
        body: [{ w: "play-along", title: "Passeio: you on the left", notes: [...rh(PASSEIO), ...lh(PASSEIO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo", auto: ["right"] }],
      },
      {
        title: "Dynamics",
        minutes: 8,
        body: [
          "On a touch-sensitive keyboard, how fast the key goes down decides the volume. In sheet music this is called **dynamics**: **p** (piano) is soft, **mf** (mezzo forte) is medium, **f** (forte) is loud.",
          "Volume comes from **arm weight**, not from pushing with the finger. For forte, let the arm drop a bit faster. For piano, barely lean in.",
          { callout: "warning", text: "Loud doesn't mean hitting. If your wrist stiffens or the sound gets harsh, ease off." },
        ],
      },
      {
        title: "Piano, then forte",
        minutes: 12,
        body: [
          "Play the whole of Passeio **piano**. Then the whole thing **forte**. With MIDI, the meter shows whether you stayed in range.",
          { w: "dynamics", target: "p" },
          { w: "play-along", title: "Passeio", notes: rh(PASSEIO), bpm: 60, ...POS, defaultMode: "wait" },
          { w: "dynamics", target: "f" },
        ],
      },
      {
        title: "Creation",
        minutes: 5,
        body: ["Play your question-and-answer melody: the question **forte**, the answer **piano**, like an echo.", { w: "keys", ...BOTH, names: "c-only" }],
      },
    ],
  },
  {
    day: 13,
    month: M,
    title: "Ode to Joy",
    minutes: 30,
    objectives: ["Read and play an 8-bar song", "Keep the pulse through the half notes at the end of each phrase"],
    blocks: [
      {
        title: "Review: reading",
        minutes: 5,
        body: [{ w: "staff-quiz", notes: FIVE, ...POS, rounds: 10, title: "C to G on the staff" }],
      },
      {
        title: "The song",
        minutes: 7,
        body: [
          "The theme from Beethoven's Ninth Symphony (public domain), in a version with simplified rhythm. It fits entirely in C position.",
          { w: "staff", notes: staffOf(ODE_SIMPLE), caption: "Ode to Joy (Beethoven), simplified rhythm." },
          "Notice: both phrases start the same and only the ending changes. The first ends on **D** (it feels unfinished), the second on **C** (it closes).",
        ],
      },
      {
        title: "Play",
        minutes: 13,
        body: [{ w: "play-along", title: "Ode to Joy", notes: rh(ODE_SIMPLE), bpm: 72, ...POS, defaultMode: "wait" }],
      },
      {
        title: "Ear",
        subtitle: "Does it close or not?",
        minutes: 5,
        body: ["Play the first phrase and stop on D. Then the second and stop on C. Feel the difference: C is the **home** of the song.", { w: "key-echo", notes: [C4, D4, E4] }],
      },
    ],
  },
  {
    day: 14,
    month: M,
    title: "Week 2 review",
    minutes: 30,
    objectives: ["Read C to G quickly", "Play Mary and the Ode in time", "Alternate hands without stopping"],
    blocks: [
      {
        title: "Reading",
        minutes: 5,
        body: [{ w: "staff-quiz", notes: FIVE, ...POS, rounds: 12, title: "C to G on the staff" }],
      },
      {
        title: "Repertoire",
        minutes: 10,
        body: [
          { w: "play-along", title: "Mary Had a Little Lamb", notes: rh(MARY), bpm: 72, ...POS, defaultMode: "tempo" },
          { w: "play-along", title: "Ode to Joy", notes: rh(ODE_SIMPLE), bpm: 72, ...POS, defaultMode: "tempo" },
        ],
      },
      {
        title: "Both hands",
        minutes: 10,
        body: [
          { w: "play-along", title: "Question and answer", notes: [...rh(PERGUNTA_RH), ...lh(PERGUNTA_LH)], bpm: 66, ...BOTH, defaultMode: "tempo" },
          {
            w: "selfcheck",
            id: "semana2",
            title: "How the week went",
            items: [
              { id: "le", label: "I read C to G on the staff without counting lines" },
              { id: "musicas", label: "Mary and the Ode at 80% or more" },
              { id: "maos", label: "I alternate hands without losing the pulse" },
            ],
          },
        ],
      },
      {
        title: "Free play",
        minutes: 5,
        body: ["Play your favorite song from this week from memory, without looking at the screen.", { w: "keys", ...BOTH, names: "none" }],
      },
    ],
  },
];
