// Keyboard · Month 1 · days 15 to 21 (English)
import type { Lesson } from "../../types";
import {
  A4, B4, C3, C4, C5, C6, D5, E4, G3, G4,
  ODE_SIMPLE, PASSEIO, PONTE_C, PONTE_G, RH_G, SUBIDA, UP_DOWN, VALSINHA, VALSINHA_LH,
  lh, rh, seqOf, staffOf,
} from "../shared";

const M = 1;
const WIDE = { from: C3, to: C6 };
const HIGH = { from: C4 - 1, to: C5 + 7 };
const BOTH = { from: C3, to: C4 + 12 };
const UP_DOWN_G: [number, number][] = [[G4, 1], [A4, 1], [B4, 1], [C5, 1], [D5, 1], [C5, 1], [B4, 1], [A4, 1], [G4, 4]];
const LH_HOLD: [number, number][] = [[C3, 4], [C3, 4], [C3, 4]];

export const KEYBOARD_WEEK3_EN: Lesson[] = [
  {
    day: 15,
    month: M,
    title: "G position",
    minutes: 30,
    objectives: ["Move the right hand to G position", "Play G, A, B, C and D with fingers 1 to 5"],
    blocks: [
      {
        title: "Review: Ode to Joy",
        minutes: 5,
        body: [{ w: "key-input" }, { w: "play-along", title: "Ode to Joy", notes: rh(ODE_SIMPLE), bpm: 72, from: C4 - 5, to: C4 + 12, defaultMode: "tempo" }],
      },
      {
        title: "Hand a little to the right",
        minutes: 8,
        body: [
          "Until now the right hand has lived in C position. Today it moves: **thumb on G** (the same G that finger 5 played before) and the other fingers on **A, B, C and D**.",
          { w: "hand", name: "G position", description: "Thumb on G4, pinky on D5.", positions: [{ hand: "right", notes: [G4, A4, B4, C5, D5] }] },
          "Notice: C is now played by **finger 4**. The note is the same as always; the finger changes with the position.",
          { w: "find-keys", mode: "quiz", ...WIDE, targets: [9, 11], rounds: 10, title: "A or B" },
        ],
      },
      {
        title: "Ladder in G",
        minutes: 12,
        body: [
          { w: "sequence", title: "1 2 3 4 5 4 3 2 1 in G", ...HIGH, notes: seqOf(UP_DOWN_G, RH_G), bpm: 60, goal: 3 },
          { w: "play-along", title: "Ladder in G in time", notes: rh(UP_DOWN_G, RH_G), bpm: 60, ...HIGH, defaultMode: "tempo" },
        ],
      },
      {
        title: "Ear and creation",
        minutes: 5,
        body: [{ w: "key-echo", notes: [G4, B4, D5] }, "Make up a phrase in G position that ends on G."],
      },
    ],
  },
  {
    day: 16,
    month: M,
    title: "A, B, C and D on the staff",
    minutes: 30,
    objectives: ["Read the G-position notes on the staff", "Play Subida by reading"],
    blocks: [
      {
        title: "Review: ladder in G",
        minutes: 5,
        body: [{ w: "sequence", title: "Ladder in G", ...HIGH, notes: seqOf(UP_DOWN_G, RH_G), bpm: 60, goal: 2 }],
      },
      {
        title: "Higher on the staff",
        minutes: 10,
        body: [
          "Picking up where you left off: **G** on the second line, **A** in the second space, **B** on the third line (the middle one), **C** in the third space and **D** on the fourth line.",
          { w: "staff", notes: staffOf([[G4, 2], [A4, 2], [B4, 2], [C5, 2], [D5, 4]]), names: true },
          { w: "staff-quiz", notes: [G4, A4, B4, C5, D5], ...HIGH, rounds: 12, title: "G to D on the staff" },
          { callout: "theory", text: "There are two Cs near your hand: **C4** (middle C, on the ledger line below) and **C5** (in the third space). On the staff the pitch is exact: the low one and the high one are different keys." },
        ],
      },
      {
        title: "Subida",
        minutes: 10,
        body: [
          { w: "staff", notes: staffOf(SUBIDA), caption: "Subida (\"climb\"), an original Pauta melody." },
          { w: "play-along", title: "Subida", notes: rh(SUBIDA, RH_G), bpm: 66, ...HIGH, defaultMode: "wait" },
        ],
      },
      {
        title: "Ear",
        minutes: 5,
        body: [{ w: "key-echo", notes: [G4, A4, B4] }],
      },
    ],
  },
  {
    day: 17,
    month: M,
    title: "The dot and 3/4 time",
    minutes: 30,
    objectives: ["Read the dotted half note (3 beats)", "Count in 3: 1, 2, 3", "Feel the waltz"],
    blocks: [
      {
        title: "Review: Subida",
        minutes: 5,
        body: [{ w: "play-along", title: "Subida", notes: rh(SUBIDA, RH_G), bpm: 66, ...HIGH, defaultMode: "tempo" }],
      },
      {
        title: "Three beats per bar",
        minutes: 10,
        body: [
          "So far every bar had 4 beats (**4/4**). In **3/4** each bar has **3**: you count **1, 2, 3, 1, 2, 3**, with 1 the strongest. It's waltz time.",
          "A **dot** after a note adds half its value. A half note is 2; a **dotted half note is 3**: it fills a whole bar of 3/4.",
          { w: "staff", notes: staffOf([[C4, 1], [E4, 1], [G4, 1], [G4, 3]]), beatsPerBar: 3, caption: "Three quarter notes and a dotted half note in 3/4." },
          "Switch the metronome to **3/4** and count along, tapping your foot on 1.",
          { w: "metronome", bpm: 72 },
        ],
      },
      {
        title: "Ladder in 3",
        minutes: 10,
        body: [
          "The C-position ladder, now in 3/4: quarter notes, a half note, and a dotted half note at the end.",
          {
            w: "play-along",
            title: "Ladder in 3/4",
            notes: rh([[60, 1], [62, 1], [64, 1], [65, 2], [67, 1], [65, 1], [64, 1], [62, 1], [60, 3]]),
            bpm: 72,
            beatsPerBar: 3,
            from: C4 - 5,
            to: C4 + 12,
            defaultMode: "tempo",
          },
        ],
      },
      {
        title: "Creation",
        minutes: 5,
        body: ["Make up a little 4-bar waltz: three notes in the first bar, one long note (3 beats) in the last.", { w: "keys", from: C4 - 5, to: C4 + 12, names: "c-only" }],
      },
    ],
  },
  {
    day: 18,
    month: M,
    title: "Valsinha",
    minutes: 30,
    objectives: ["Play an 8-bar waltz", "Hold the dotted half notes to the end"],
    blocks: [
      {
        title: "Review: 3/4",
        minutes: 5,
        body: [{ w: "metronome", bpm: 72 }, "Count 1, 2, 3 out loud for a minute, tapping your foot on 1."],
      },
      {
        title: "The song",
        minutes: 7,
        body: [
          { w: "staff", notes: staffOf(VALSINHA), beatsPerBar: 3, caption: "Valsinha (\"little waltz\"), an original Pauta melody." },
          { w: "play-along", title: "Just listen", notes: [...rh(VALSINHA), ...lh(VALSINHA_LH)], bpm: 84, beatsPerBar: 3, ...BOTH, modes: ["listen"], defaultMode: "listen" },
        ],
      },
      {
        title: "Play",
        minutes: 13,
        body: [
          "You play the melody and the site plays the bass (one dotted half note per bar).",
          { w: "play-along", title: "Valsinha", notes: [...rh(VALSINHA), ...lh(VALSINHA_LH)], bpm: 84, beatsPerBar: 3, ...BOTH, defaultMode: "wait", auto: ["left"] },
        ],
      },
      {
        title: "Ear",
        minutes: 5,
        body: ["Listen to the waltz again and tap the 1 of each bar on your leg with your left hand.", { w: "key-echo", notes: [C4, E4, G4] }],
      },
    ],
  },
  {
    day: 19,
    month: M,
    title: "Changing position",
    minutes: 30,
    objectives: ["Move from C position to G position during the music", "Use the rest to move the hand"],
    blocks: [
      {
        title: "Review: Valsinha",
        minutes: 5,
        body: [{ w: "play-along", title: "Valsinha", notes: [...rh(VALSINHA), ...lh(VALSINHA_LH)], bpm: 84, beatsPerBar: 3, ...BOTH, defaultMode: "tempo", auto: ["left"] }],
      },
      {
        title: "The rest is for travelling",
        minutes: 8,
        body: [
          "Real music doesn't stay in one position. The trick is to **change position on a rest or a long note**: the whole hand lifts, moves and lands with the fingers already in place.",
          "In **Ponte** (\"bridge\"), the first half is in C position. On the rest, the hand moves up: **thumb on G**, and continues in G position.",
          { w: "staff", notes: staffOf([...PONTE_C, ...PONTE_G]), caption: "Ponte, an original Pauta melody. The rest in bar 2 is when you move." },
        ],
      },
      {
        title: "Ponte",
        minutes: 12,
        body: [
          { w: "play-along", title: "Ponte", notes: [...rh(PONTE_C), ...rh(PONTE_G, RH_G, 8)], bpm: 60, ...HIGH, defaultMode: "wait" },
          { callout: "tip", text: "Look where your hand is going **before** the rest. When the rest comes, the hand already knows the way." },
        ],
      },
      {
        title: "Creation",
        minutes: 5,
        body: ["Make your own bridge: 4 notes in C position, a rest, 4 notes in G position.", { w: "keys", ...HIGH, names: "c-only" }],
      },
    ],
  },
  {
    day: 20,
    month: M,
    title: "Hands together for the first time",
    minutes: 30,
    objectives: ["Hold a long note in the left hand while the right moves", "Start both hands exactly together"],
    blocks: [
      {
        title: "Review: Ponte",
        minutes: 5,
        body: [{ w: "play-along", title: "Ponte", notes: [...rh(PONTE_C), ...rh(PONTE_G, RH_G, 8)], bpm: 60, ...HIGH, defaultMode: "tempo" }],
      },
      {
        title: "One hand still, the other moving",
        minutes: 6,
        body: [
          "Today both hands play **at the same time** for the first time, in the simplest way: the left presses **low C and holds it** for 4 beats while the right goes up and down.",
          "The start is the hardest moment: both notes have to sound **together**. After that the left just stays still, holding.",
          { callout: "warning", text: "Don't let the left hand release when the right moves. They're independent: that's what you're training." },
        ],
      },
      {
        title: "Together",
        minutes: 14,
        body: [
          "In **Wait for me** mode, the music only moves when both notes at the start of each bar are pressed.",
          { w: "play-along", title: "Ladder with low C", notes: [...rh(UP_DOWN), ...lh(LH_HOLD)], bpm: 60, ...BOTH, defaultMode: "wait" },
          { w: "play-along", title: "Passeio with low C", notes: [...rh(PASSEIO.slice(0, 12)), ...lh([[C3, 4], [C3, 4], [C3, 4], [C3, 4]])], bpm: 60, ...BOTH, defaultMode: "wait" },
        ],
      },
      {
        title: "Ear",
        minutes: 5,
        body: ["Low and high together: play C3 with the left and C4 with the right at the same time. It's the same note, an octave apart.", { w: "key-echo", notes: [C3, G3, C4] }],
      },
    ],
  },
  {
    day: 21,
    month: M,
    title: "Week 3 review",
    minutes: 30,
    objectives: ["Read C4 to D5 on the staff", "Change position without stopping", "Start both hands together"],
    blocks: [
      {
        title: "Reading",
        minutes: 6,
        body: [{ w: "staff-quiz", notes: [C4, 62, E4, 65, G4, A4, B4, C5, D5], ...HIGH, rounds: 14, title: "C to D on the staff" }],
      },
      {
        title: "Repertoire",
        minutes: 12,
        body: [
          { w: "play-along", title: "Subida", notes: rh(SUBIDA, RH_G), bpm: 72, ...HIGH, defaultMode: "tempo" },
          { w: "play-along", title: "Valsinha", notes: [...rh(VALSINHA), ...lh(VALSINHA_LH)], bpm: 84, beatsPerBar: 3, ...BOTH, defaultMode: "tempo", auto: ["left"] },
        ],
      },
      {
        title: "Hands together",
        minutes: 7,
        body: [
          { w: "play-along", title: "Ladder with low C", notes: [...rh(UP_DOWN), ...lh(LH_HOLD)], bpm: 60, ...BOTH, defaultMode: "tempo" },
          {
            w: "selfcheck",
            id: "semana3",
            title: "How the week went",
            items: [
              { id: "sol", label: "I move to G position without looking much" },
              { id: "valsa", label: "I count in 3 without getting lost" },
              { id: "juntas", label: "Both hands start together" },
            ],
          },
        ],
      },
      {
        title: "Free play",
        minutes: 5,
        body: ["Play Valsinha with your own left hand too: low C at the start of each bar.", { w: "keys", ...BOTH, names: "c-only" }],
      },
    ],
  },
];
