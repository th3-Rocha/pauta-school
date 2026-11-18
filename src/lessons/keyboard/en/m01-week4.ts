// Keyboard · Month 1 · days 22 to 30 (English)
import type { Lesson } from "../../types";
import {
  A4, B4, C3, C4, C5, C6, D4, D5, E4, F4, G3, G4,
  CAMINHO, CAMINHO_LH, ODE, ODE_LH, SIGHT_1, SIGHT_2, SIGHT_3, TWINKLE, TWINKLE_LH,
  lh, rh, seqOf, staffOf,
} from "../shared";

const M = 1;
const WIDE = { from: C3, to: C6 };
const POS = { from: C4 - 5, to: C4 + 12 };
const BOTH = { from: C3, to: C4 + 12 };
const ALL_READ = [C4, D4, E4, F4, G4, A4, B4, C5, D5];
const LADDER: [number, number][] = [[60, 1], [62, 1], [64, 1], [65, 1], [67, 1], [65, 1], [64, 1], [62, 1], [60, 4]];

export const KEYBOARD_WEEK4_EN: Lesson[] = [
  {
    day: 22,
    month: M,
    title: "Stretching to A",
    minutes: 30,
    objectives: ["Reach a note outside the position without moving the hand", "Play Twinkle, Twinkle, Little Star"],
    blocks: [
      {
        title: "Review: hands together",
        minutes: 5,
        body: [{ w: "key-input" }, { w: "play-along", title: "Ladder with low C", notes: [...rh(LADDER), ...lh([[C3, 4], [C3, 4], [C3, 4]])], bpm: 60, ...BOTH, defaultMode: "tempo" }],
      },
      {
        title: "Extension",
        minutes: 7,
        body: [
          "Sometimes the music asks for a note just past the position. Instead of moving the whole hand, **finger 5 stretches** to the neighboring key and comes back.",
          "In **Twinkle, Twinkle, Little Star** (traditional, public domain), the hand stays in C position and finger 5 stretches from G to **A** both times it appears.",
          { callout: "warning", text: "Stretch by opening the hand, without twisting the wrist. After the A, the hand goes back to its normal shape." },
        ],
      },
      {
        title: "Twinkle, twinkle",
        minutes: 13,
        body: [
          { w: "staff", notes: staffOf(TWINKLE), caption: "Twinkle, Twinkle, Little Star (traditional)." },
          { w: "play-along", title: "Twinkle, Twinkle, Little Star", notes: rh(TWINKLE), bpm: 80, ...POS, defaultMode: "wait" },
        ],
      },
      {
        title: "Ear",
        minutes: 5,
        body: [{ w: "key-echo", notes: [C4, G4, A4] }],
      },
    ],
  },
  {
    day: 23,
    month: M,
    title: "Twinkle with both hands",
    minutes: 30,
    objectives: ["Play the left hand with three notes: C, F and G", "Put it together with the melody in Wait mode"],
    blocks: [
      {
        title: "Review: Twinkle",
        minutes: 5,
        body: [{ w: "play-along", title: "Twinkle, twinkle", notes: rh(TWINKLE), bpm: 80, ...POS, defaultMode: "tempo" }],
      },
      {
        title: "Three low notes",
        minutes: 6,
        body: [
          "The left hand stays in C position and uses three notes: **C (5)**, **F (2)** and **G (1)**. They're the roots of the song's three chords.",
          { w: "play-along", title: "Left hand only", notes: [...rh(TWINKLE), ...lh(TWINKLE_LH)], bpm: 80, ...BOTH, defaultMode: "wait", auto: ["right"] },
        ],
      },
      {
        title: "Together",
        minutes: 14,
        body: [
          "Now both. Start in **Wait for me**: the music only moves when the notes that start together are pressed.",
          { w: "play-along", title: "Twinkle (both hands)", notes: [...rh(TWINKLE), ...lh(TWINKLE_LH)], bpm: 80, ...BOTH, defaultMode: "wait" },
          { callout: "tip", text: "Too hard? Do just the first two lines several times before moving on. A small chunk done well beats the whole song done badly." },
        ],
      },
      {
        title: "Ear",
        minutes: 5,
        body: ["Roots: after low C comes C, F or G?", { w: "key-echo", notes: [C3, 53, G3] }],
      },
    ],
  },
  {
    day: 24,
    month: M,
    title: "Ode to Joy with the original rhythm",
    minutes: 30,
    objectives: ["Read the dotted quarter followed by an eighth note", "Play the Ode with the supporting left hand"],
    blocks: [
      {
        title: "Review: both hands",
        minutes: 5,
        body: [{ w: "play-along", title: "Twinkle (both hands)", notes: [...rh(TWINKLE), ...lh(TWINKLE_LH)], bpm: 80, ...BOTH, defaultMode: "wait" }],
      },
      {
        title: "Dotted quarter and eighth",
        minutes: 8,
        body: [
          "An **eighth note** lasts half a beat: two fit in one click. It has a little flag on the stem.",
          "A **dotted quarter note** lasts one and a half beats. With an eighth note it fills 2 beats: **long-short**. Count \"1 and 2 and\": the dotted quarter goes from 1 through the \"and\"; the eighth lands on the \"and\" of 2.",
          { w: "staff", notes: staffOf([[E4, 1.5], [D4, 0.5], [D4, 2]]), caption: "The end of the Ode's first phrase: dotted quarter, eighth, half note." },
        ],
      },
      {
        title: "The real Ode",
        minutes: 12,
        body: [
          { w: "staff", notes: staffOf(ODE) },
          { w: "play-along", title: "Ode to Joy (original rhythm)", notes: rh(ODE), bpm: 72, ...POS, defaultMode: "tempo" },
          { w: "play-along", title: "With the left hand", notes: [...rh(ODE), ...lh(ODE_LH)], bpm: 72, ...BOTH, defaultMode: "wait" },
        ],
      },
      {
        title: "Ear",
        minutes: 5,
        body: ["Play the phrase endings both ways: all even (simplified) and long-short (original). Which sounds more like the song you know?", { w: "keys", ...POS, names: "c-only" }],
      },
    ],
  },
  {
    day: 25,
    month: M,
    title: "Sight-reading",
    minutes: 30,
    objectives: ["Read phrases you've never seen", "Don't stop to fix mistakes"],
    blocks: [
      {
        title: "Review: reading",
        minutes: 5,
        body: [{ w: "staff-quiz", notes: ALL_READ, from: C4 - 1, to: C5 + 7, rounds: 12, title: "C to D on the staff" }],
      },
      {
        title: "Look before you play",
        minutes: 5,
        body: [
          "Sight-reading means playing something new, start to finish, without stopping. Before you start, spend 20 seconds looking:",
          { list: ["What's the first note? Put your hand in position.", "Are there long notes? Rests?", "Does the melody go up or down? Does it jump or move between neighbors?"], ordered: true },
        ],
      },
      {
        title: "Three new phrases",
        minutes: 15,
        body: [
          { w: "sequence", title: "Phrase 1", ...POS, notes: seqOf(SIGHT_1), bpm: 60, goal: 1, staff: true, hideKeys: true },
          { w: "sequence", title: "Phrase 2", ...POS, notes: seqOf(SIGHT_2), bpm: 60, goal: 1, staff: true, hideKeys: true },
          { w: "sequence", title: "Phrase 3", ...POS, notes: seqOf(SIGHT_3), bpm: 60, goal: 1, staff: true, hideKeys: true },
        ],
      },
      {
        title: "Creation",
        minutes: 5,
        body: ["Write a 2-bar phrase on paper and give it to someone (or to yourself tomorrow) to sight-read."],
      },
    ],
  },
  {
    day: 26,
    month: M,
    title: "Improvising with five notes",
    minutes: 30,
    objectives: ["Improvise in C position over a fixed bass", "End your phrases on C"],
    blocks: [
      {
        title: "Review: the Ode",
        minutes: 5,
        body: [{ w: "play-along", title: "Ode to Joy", notes: rh(ODE), bpm: 72, ...POS, defaultMode: "tempo" }],
      },
      {
        title: "There are no wrong notes",
        minutes: 5,
        body: [
          "In C position, all five notes go with a C in the bass. So you can make things up freely. Today's rules are just three:",
          { list: ["Play in time with the metronome.", "Make short phrases, with breaths (rests) between them.", "End each phrase on **C**."], ordered: true },
        ],
      },
      {
        title: "Improvise",
        minutes: 15,
        body: [
          "Set the metronome to 70. The left hand holds **low C** (press it again every 4 beats) and the right improvises.",
          { w: "metronome", bpm: 70 },
          { w: "keys", ...BOTH, names: "c-only", zones: [{ hand: "left", from: C3, to: C3, label: "Low C" }, { hand: "right", from: C4, to: G4, label: "C position" }] },
          { callout: "selfCheck", text: "Record 1 minute of your improv. Listening back, can you tell where each phrase starts and ends?" },
        ],
      },
      {
        title: "Ear",
        minutes: 5,
        body: [{ w: "key-echo", notes: [C4, E4, G4] }],
      },
    ],
  },
  {
    day: 27,
    month: M,
    title: "Reading review",
    minutes: 30,
    objectives: ["Read any note from C4 to D5", "Find any white key across the keyboard"],
    blocks: [
      {
        title: "Map",
        minutes: 5,
        body: [{ w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 2, 4, 5, 7, 9, 11], rounds: 14, title: "Any white key" }],
      },
      {
        title: "Staff",
        minutes: 10,
        body: [{ w: "staff-quiz", notes: ALL_READ, from: C4 - 1, to: C5 + 7, rounds: 20, title: "C to D on the staff" }],
      },
      {
        title: "The challenge piece",
        minutes: 10,
        body: [
          "Meet the music for this month's challenge: **Caminho de casa** (\"the way home\"). Today just listen and read. Tomorrow you start playing.",
          { w: "staff", notes: staffOf(CAMINHO), caption: "Caminho de casa, an original Pauta melody." },
          { w: "play-along", title: "Just listen", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, modes: ["listen"], defaultMode: "listen" },
        ],
      },
      {
        title: "Ear",
        minutes: 5,
        body: ["Sing the melody of Caminho de casa along with the site. If you can sing it, you'll play it better.", { w: "key-echo", notes: [C4, D4, E4] }],
      },
    ],
  },
  {
    day: 28,
    month: M,
    title: "Challenge rehearsal: each hand",
    minutes: 30,
    objectives: ["Play the melody of Caminho de casa in time", "Play the bass of Caminho de casa in time"],
    blocks: [
      {
        title: "Review: reading the piece",
        minutes: 5,
        body: [{ w: "sequence", title: "Caminho de casa, slowly", ...POS, notes: seqOf(CAMINHO), bpm: 60, goal: 1, staff: true }],
      },
      {
        title: "Right hand",
        minutes: 10,
        body: [{ w: "play-along", title: "You on the right", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo", auto: ["left"] }],
      },
      {
        title: "Left hand",
        minutes: 10,
        body: [
          "The left hand only has C and G, in half notes. It looks easy; the hard part is not dragging.",
          { w: "play-along", title: "You on the left", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo", auto: ["right"] },
        ],
      },
      {
        title: "Ear",
        minutes: 5,
        body: [{ w: "key-echo", notes: [C3, G3, C4] }],
      },
    ],
  },
  {
    day: 29,
    month: M,
    title: "Challenge rehearsal: hands together",
    minutes: 30,
    objectives: ["Play Caminho de casa with both hands", "Build the speed up to 60 BPM"],
    blocks: [
      {
        title: "Review: each hand",
        minutes: 5,
        body: [{ w: "play-along", title: "You on the right", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo", auto: ["left"] }],
      },
      {
        title: "Wait for me",
        minutes: 8,
        body: [{ w: "play-along", title: "Caminho de casa (both hands)", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, defaultMode: "wait" }],
      },
      {
        title: "In time, building up",
        minutes: 12,
        body: [
          "Now **In time**: 50%, then 75%, then full speed. Only move up once you pass 80%.",
          { w: "play-along", title: "Caminho de casa (both hands)", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo" },
          { callout: "tip", text: "Tomorrow is the challenge. If you didn't reach 80% at full speed today, that's fine: the challenge stays open and you can come back whenever you want." },
        ],
      },
      {
        title: "Rest",
        minutes: 5,
        body: ["Play your favorite song from this month, just for fun.", { w: "keys", ...BOTH, names: "c-only" }],
      },
    ],
  },
  {
    day: 30,
    month: M,
    title: "Month 1 challenge",
    minutes: 30,
    objectives: ["Play Caminho de casa with both hands at 60 BPM", "Find any natural note without looking at names"],
    blocks: [
      {
        title: "Warm-up",
        minutes: 5,
        body: [{ w: "key-input" }, { w: "sequence", title: "1 2 3 4 5 4 3 2 1", from: C4 - 5, to: C4 + 12, notes: seqOf(LADDER), bpm: 60, goal: 2 }],
      },
      {
        title: "Part 1: the map",
        subtitle: "Any white key, no names",
        minutes: 5,
        body: ["Goal: **80%** or more.", { w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 2, 4, 5, 7, 9, 11], rounds: 20, title: "Any white key" }],
      },
      {
        title: "Part 2: Caminho de casa",
        subtitle: "Both hands, in time",
        minutes: 15,
        body: [
          "Play in **In time** mode. Start slower if you need to and build up to 60 BPM. Once you pass 80%, log the highest BPM you played cleanly.",
          { w: "play-along", title: "Caminho de casa (both hands)", notes: [...rh(CAMINHO), ...lh(CAMINHO_LH)], bpm: 60, ...BOTH, defaultMode: "tempo" },
          { w: "bpmlog", month: 1, target: 60 },
        ],
      },
      {
        title: "Wrapping up the month",
        minutes: 5,
        body: [
          {
            w: "selfcheck",
            id: "mes1",
            title: "What you know now",
            items: [
              { id: "mapa", label: "I find any white key using the black-key groups" },
              { id: "dedos", label: "I use the right fingers in C and G position" },
              { id: "le", label: "I read C4 to D5 in the treble clef" },
              { id: "ritmo", label: "I count quarter, half, whole, dotted notes and rests" },
              { id: "maos", label: "I play a melody with the left hand holding the bass" },
            ],
          },
          "Congratulations on your first month. Month 2 brings the **major scale**, **thumb-under** and your first **chords**.",
        ],
      },
    ],
  },
];
