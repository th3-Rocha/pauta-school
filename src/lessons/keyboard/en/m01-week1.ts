// Keyboard · Month 1 · days 3 to 7 (English)
import type { Lesson } from "../../types";
import {
  C3, C4, C6, D4, E4, F4, G4, E3, G3,
  ESCADA_LH, LH_C, PASSEIO, RITMO, UP_DOWN,
  lh, rh, seqOf, staffOf,
} from "../shared";

const M = 1;
const WIDE = { from: C3, to: C6 };
const POS = { from: C4 - 5, to: C4 + 12 };
const BOTH = { from: C3, to: C4 + 12 };

export const KEYBOARD_WEEK1_EN: Lesson[] = [
  {
    day: 3,
    month: M,
    title: "All the white keys",
    minutes: 30,
    objectives: ["Find A and B using the group of 3 black keys", "Say the 7 notes in order", "Play Passeio in time with 80% accuracy"],
    blocks: [
      {
        title: "Review: C, F and G",
        minutes: 5,
        body: [
          "C from the group of 2, F and G from the group of 3. No names.",
          { w: "key-input" },
          { w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 5, 7], rounds: 10, title: "C, F or G" },
        ],
      },
      {
        title: "A and B",
        subtitle: "Completing the seven notes",
        minutes: 8,
        body: [
          "Two white keys are left in the group of 3 black keys. **A** sits between the second and third black keys; **B** is the white key right after the third. After B comes a group of 2 again, and C starts over.",
          { callout: "theory", text: "The 7 notes: **C D E F G A B**. Many countries also use solfège names (**Do Re Mi Fa Sol La Ti**). It's worth knowing both, but here we use letters." },
          {
            w: "keys",
            ...POS,
            names: "all",
            markers: [{ midi: 69, kind: "in", label: "A" }, { midi: 71, kind: "in", label: "B" }],
            caption: "A and B at the end of the group of 3 black keys.",
          },
          { w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 2, 4, 5, 7, 9, 11], rounds: 14, title: "Any white key" },
        ],
      },
      {
        title: "Passeio in time",
        subtitle: "Yesterday's song, now without the music waiting for you",
        minutes: 12,
        body: [
          "Warm up with yesterday's sequence, then play **Passeio** in **In time** mode. If you're below 80%, go down to 75% speed and come back up later.",
          { w: "sequence", title: "Warm-up", ...POS, notes: seqOf(UP_DOWN), bpm: 60, goal: 2 },
          { w: "play-along", title: "Passeio", notes: rh(PASSEIO), bpm: 60, ...POS, defaultMode: "tempo" },
          { callout: "tip", text: "Missed a note in time? Don't stop. The music keeps going and you come back in on the next one. Stopping at every mistake trains stopping." },
        ],
      },
      {
        title: "Ear and creation",
        minutes: 5,
        body: [
          "After the reference C comes C, E or G.",
          { w: "key-echo", notes: [C4, E4, G4] },
          "Now use all **seven notes**: make up a phrase that starts on C, climbs to A or B and comes back to C.",
          { w: "keys", ...POS, names: "c-only" },
        ],
      },
    ],
  },
  {
    day: 4,
    month: M,
    title: "The left hand",
    minutes: 30,
    objectives: ["Number the left-hand fingers (the thumb is also 1)", "Put the left hand in C position, one octave lower", "Play the 5-4-3-2-1 ladder with the left hand"],
    blocks: [
      {
        title: "Review: the seven notes",
        minutes: 5,
        body: [{ w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 2, 4, 5, 7, 9, 11], rounds: 10, title: "Any white key" }],
      },
      {
        title: "Left-hand fingers",
        subtitle: "Same numbers, mirrored order",
        minutes: 8,
        body: [
          "The left hand uses the same numbers: **thumb = 1, pinky = 5**. But it mirrors the right: in C position, the **pinky (5) is on C** and the **thumb (1) is on G**.",
          "Put your left hand one octave below middle C: that's **C3**. The five fingers sit on C, D, E, F, G, one per key.",
          { w: "hand", name: "C position, left hand", description: "Pinky on C3, thumb on G3.", positions: [{ hand: "left", notes: [G3, 53, E3, 50, C3] }] },
          { callout: "warning", text: "The left hand is usually weaker and slower. That's normal. Work slowly: it catches up with the right in a few weeks." },
        ],
      },
      {
        title: "Left-hand ladder",
        minutes: 12,
        body: [
          "Play from bottom to top and back: **5 4 3 2 1 2 3 4 5**. Notice that on the left hand, going up in pitch means going from 5 to 1.",
          { w: "sequence", title: "5 4 3 2 1 2 3 4 5", hand: "left", from: C3 - 2, to: C4 + 2, notes: seqOf(ESCADA_LH, LH_C), bpm: 60, goal: 3 },
          { w: "play-along", title: "Ladder in time", notes: lh(ESCADA_LH), bpm: 60, from: C3 - 2, to: C4 + 2, defaultMode: "wait" },
          {
            w: "selfcheck",
            id: "me",
            items: [
              { id: "curvo", label: "Fingers curved on the left hand too" },
              { id: "mindo", label: "The pinky plays with its tip, not lying flat" },
              { id: "punho", label: "Wrist relaxed, not dropping below the keys" },
            ],
          },
        ],
      },
      {
        title: "Ear and creation",
        subtitle: "Low notes",
        minutes: 5,
        body: [
          "Now the reference is low C. What came next: C, E or G?",
          { w: "key-echo", notes: [C3, E3, G3] },
          "Make up a phrase with the left hand only, ending on C3. Low notes sound great slow: try long notes.",
          { w: "keys", from: C3 - 2, to: C4 + 2, names: "c-only", zones: [{ hand: "left", from: C3, to: G3, label: "C position" }] },
        ],
      },
    ],
  },
  {
    day: 5,
    month: M,
    title: "Pulse, note values and rests",
    minutes: 30,
    objectives: ["Count the pulse out loud with the metronome", "Recognize quarter (1), half (2) and whole notes (4 beats)", "Play a rest: real silence, lifting the finger"],
    blocks: [
      {
        title: "Review: left-hand ladder",
        minutes: 5,
        body: [{ w: "sequence", title: "5 4 3 2 1 2 3 4 5", hand: "left", from: C3 - 2, to: C4 + 2, notes: seqOf(ESCADA_LH, LH_C), bpm: 60, goal: 2 }],
      },
      {
        title: "How long each note lasts",
        minutes: 10,
        body: [
          "The **pulse** is the steady beat of the music, the one you tap with your foot. The metronome makes that pulse. Each click is a **beat**.",
          {
            list: [
              "**Quarter note**: lasts 1 beat. Filled head with a stem.",
              "**Half note**: lasts 2 beats. Hollow head with a stem.",
              "**Whole note**: lasts 4 beats. Hollow head, no stem.",
              "**Rest**: silence for the same time. The quarter rest looks like a lightning bolt.",
            ],
          },
          { w: "staff", notes: staffOf(RITMO), caption: "Today's exercise on the staff: quarter notes, half notes, rests and a whole note at the end." },
          "Count out loud **1, 2, 3, 4** with the metronome before playing. On a rest, **lift your finger**: the key has to come up for the sound to stop.",
          { w: "metronome", bpm: 60 },
        ],
      },
      {
        title: "Rhythm on the keyboard",
        minutes: 10,
        body: [
          "Only three notes (C, E, G), but each with its own length. In the falling bars, length is duration; on the staff, it's the shape of the note.",
          { w: "play-along", title: "Rhythm with rests", notes: rh(RITMO), bpm: 60, ...POS, defaultMode: "tempo" },
          { callout: "selfCheck", text: "Did you hold the half note for both beats? Did you lift on the rest? The two most common mistakes are cutting long notes short and running into the rest." },
        ],
      },
      {
        title: "Ear",
        subtitle: "How many beats?",
        minutes: 5,
        body: ["The metronome counts 4 beats and a note sounds. Did it last 1, 2 or 4 beats?", { w: "ear", kind: "duration" }],
      },
    ],
  },
  {
    day: 6,
    month: M,
    title: "The treble clef",
    minutes: 30,
    objectives: ["Know what the staff, lines, spaces and clef are", "Find middle C on the staff (the ledger line)", "Read C, D and E on the staff and play them"],
    blocks: [
      {
        title: "Review: rhythm",
        minutes: 5,
        body: [{ w: "play-along", title: "Rhythm with rests", notes: rh(RITMO), bpm: 60, ...POS, defaultMode: "tempo" }],
      },
      {
        title: "The staff",
        subtitle: "Five lines that tell the pitch",
        minutes: 10,
        body: [
          "The **staff** has 5 lines and 4 spaces. Each line and each space is a white key: going up on the staff, you go up on the keyboard, one white key per step.",
          "The **treble clef** (the symbol at the start) tells you which notes they are. It's used for the **right hand**. Here **middle C sits on a small line below the staff**, the ledger line. From there up: D in the space just below the staff, E on the first line, F in the first space, G on the second line.",
          { w: "staff", notes: staffOf([[C4, 1], [D4, 1], [E4, 1], [F4, 1], [G4, 4]]), names: true, caption: "C position on the staff: C, D, E, F and G." },
          { w: "staff-quiz", notes: [C4, D4, E4], ...POS, rounds: 10, title: "C, D or E on the staff" },
        ],
      },
      {
        title: "Reading the ladder",
        minutes: 10,
        body: [
          "The same ladder as day 1, now read from the staff. The keyboard **doesn't show** where to play: look only at the staff.",
          { w: "sequence", title: "Reading: up and down", ...POS, notes: seqOf(UP_DOWN), bpm: 60, goal: 2, staff: true, hideKeys: true },
          { callout: "tip", text: "Read by distance, not by name: if the next note is one step up, it's the neighboring white key. In time the names come by themselves." },
        ],
      },
      {
        title: "Ear and creation",
        minutes: 5,
        body: [{ w: "key-echo", notes: [C4, E4, G4] }, "On paper, draw a staff and write a 4-note melody with C, D and E. Then play what you wrote."],
      },
    ],
  },
  {
    day: 7,
    month: M,
    title: "Week 1 review",
    minutes: 30,
    objectives: ["Find any white key quickly", "Play Passeio in time", "Read C to G on the staff"],
    blocks: [
      {
        title: "Keyboard map",
        minutes: 5,
        body: ["Nothing new today: it's a day to pull together what you've seen. Start with the map.", { w: "find-keys", mode: "quiz", ...WIDE, targets: [0, 2, 4, 5, 7, 9, 11], rounds: 14, title: "Any white key" }],
      },
      {
        title: "Reading",
        minutes: 7,
        body: [{ w: "staff-quiz", notes: [C4, D4, E4, F4, G4], ...POS, rounds: 10, title: "C to G on the staff" }],
      },
      {
        title: "Both hands, one at a time",
        minutes: 13,
        body: [
          "Right hand on Passeio, left hand on the ladder. Both in **In time** mode.",
          { w: "play-along", title: "Passeio", notes: rh(PASSEIO), bpm: 60, ...POS, defaultMode: "tempo" },
          { w: "play-along", title: "Left-hand ladder", notes: lh(ESCADA_LH), bpm: 60, from: C3 - 2, to: C4 + 2, defaultMode: "tempo" },
          {
            w: "selfcheck",
            id: "semana1",
            title: "How the week went",
            items: [
              { id: "mapa", label: "I find any white key without thinking much" },
              { id: "passeio", label: "Passeio at 80% or more in time" },
              { id: "le", label: "I read C to G on the staff" },
            ],
          },
        ],
      },
      {
        title: "Free play",
        minutes: 5,
        body: ["Play whatever you like with both hands, one at a time. How about your day 1 melody, now in the left hand?", { w: "keys", ...BOTH, names: "c-only" }],
      },
    ],
  },
];
