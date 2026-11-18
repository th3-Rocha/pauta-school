// Keyboard · Month 1 · days 1 and 2 (English)
import type { Lesson } from "../../types";
import { C3, C4, C6, PASSEIO, UP_DOWN, rh } from "../shared";

const M = 1;

export const KEYBOARD_M01_EN: Lesson[] = [
  {
    day: 1,
    month: M,
    title: "The map of the black keys",
    minutes: 30,
    objectives: [
      "Sit at the right height, with relaxed hands",
      "Find any C using the group of 2 black keys",
      "Know the number of each finger (the thumb is 1)",
      "Play C–D–E–F–G with the right hand",
    ],
    blocks: [
      {
        title: "Before you start",
        subtitle: "Bench, posture and where the notes come from",
        minutes: 5,
        body: [
          "There's nothing to review today, since it's day one. Every lesson has the same four blocks: **review**, **concept**, **lab** and **ear and creation**. Mark each one when you finish it.",
          "Any keyboard with **61 keys or more** works. If you have a USB cable, plug it into your computer or phone and connect below: the site will hear what you play and check it for you. No cable? Tap the screen or use the computer keyboard (the row **A S D F G H J K** are the white keys, **W E T Y U** the black ones).",
          { w: "key-input" },
          { h: "How to sit" },
          "Adjust the bench so your **elbows are level with the keys**, or a little above. Sit on the front half of the bench, centered on the keyboard, with both feet flat on the floor.",
          {
            w: "selfcheck",
            id: "postura",
            title: "Check in a mirror or film yourself with your phone",
            items: [
              { id: "cotovelo", label: "Elbows level with the keys, not below", hint: "If your wrist is below the keys, raise the bench" },
              { id: "pes", label: "Feet flat on the floor" },
              { id: "ombro", label: "Shoulders relaxed, not raised" },
              { id: "costas", label: "Back straight, not leaning back" },
            ],
          },
        ],
      },
      {
        title: "Groups of 2 and 3",
        subtitle: "The only map you need",
        minutes: 10,
        body: [
          "Look only at the **black keys**. They aren't scattered: they form groups of **2** and **3**, one after the other, from one end of the keyboard to the other. That pattern is the map of everything.",
          "**C** is always the white key **just to the left of the group of 2 black keys**. Find a group of 2, step down one white key: C. It works on any keyboard, of any size.",
          {
            w: "keys",
            from: C3,
            to: C6,
            names: "c-only",
            markers: [
              { midi: 48, kind: "root", label: "C" },
              { midi: 60, kind: "root", label: "C" },
              { midi: 72, kind: "root", label: "C" },
              { midi: 84, kind: "root", label: "C" },
            ],
            caption: "Every C in this stretch. Notice the group of 2 black keys just to the right of each one.",
          },
          { w: "find-keys", mode: "all", from: C3, to: C6, targets: [0], title: "Find every C" },
          { h: "Middle C" },
          "**Middle C** is the C closest to the middle of the keyboard, usually just below the brand name. It's the reference for both hands: the right hand works upward from it, the left hand downward. In scientific notation it's **C4**.",
          { callout: "theory", text: "The white keys go **C D E F G A B** and then start again at C. **D** sits between the two black keys of the group of 2, and **E** just to the right of them." },
          { w: "find-keys", mode: "quiz", from: C3, to: C6, targets: [0, 2, 4], rounds: 10, title: "C, D or E" },
          { callout: "warning", text: "Don't put stickers with note names on the keys. They become a crutch: your eyes stop looking for the groups. The on-screen keyboard shows names when needed." },
        ],
      },
      {
        title: "Fingers and C position",
        subtitle: "Right hand, five notes, metronome at 60",
        minutes: 10,
        body: [
          "On the keyboard the fingers are numbered **1 to 5**, starting with the **thumb = 1**. Index 2, middle 3, ring 4, pinky 5. Same for both hands. (Coming from guitar? There the thumb has no number and the index is 1. Not here.)",
          {
            w: "hand",
            name: "C position",
            description: "Right thumb on middle C, one finger per key up to G.",
            positions: [{ hand: "right", notes: [60, 62, 64, 65, 67] }],
          },
          "Keep your fingers **curved**, as if holding a small orange. Play with the fingertips; the thumb plays with the side of its tip. Each finger stays over its key, even when it isn't playing.",
          {
            w: "sequence",
            title: "1 2 3 4 5 4 3 2 1",
            hand: "right",
            from: C4 - 5,
            to: C4 + 12,
            bpm: 60,
            goal: 3,
            notes: [
              { midi: 60, finger: 1 },
              { midi: 62, finger: 2 },
              { midi: 64, finger: 3 },
              { midi: 65, finger: 4 },
              { midi: 67, finger: 5 },
              { midi: 65, finger: 4 },
              { midi: 64, finger: 3 },
              { midi: 62, finger: 2 },
              { midi: 60, finger: 1 },
            ],
          },
          "Now with the metronome: **one note per click**, at 60 BPM. If you fall out of time, go down to 50. Do it 3 times in a row without stopping.",
          { w: "metronome", bpm: 60 },
          {
            w: "selfcheck",
            id: "mao",
            items: [
              { id: "curvo", label: "Fingers curved, tips not collapsing inward" },
              { id: "punho", label: "Wrist straight, in line with the forearm" },
              { id: "parado", label: "Fingers that aren't playing stay over the keys" },
              { id: "pulso", label: "One note per click, without rushing" },
            ],
          },
          { callout: "tip", text: "Sounding good right now doesn't mean you've learned it. We'll come back to this tomorrow, and what really stuck is what shows up tomorrow." },
        ],
      },
      {
        title: "Ear and creation",
        subtitle: "C, D and E by ear",
        minutes: 5,
        body: [
          "The site first plays a reference **C**, then another note: C, D or E. Say which it was, by clicking or playing the key. The goal is 80% correct.",
          { w: "key-echo", notes: [60, 62, 64] },
          { h: "Your first melody" },
          "Using **C, D and E** (fingers 1, 2 and 3), make up a **4-note** melody that ends on C. Play it 3 times the same way. If you like, record it on your phone: at the end of the month you'll listen to it again.",
          { w: "keys", from: C4 - 5, to: C4 + 12, names: "all", zones: [{ hand: "right", from: 60, to: 64, label: "C D E" }] },
        ],
      },
    ],
  },
  {
    day: 2,
    month: M,
    title: "Falling notes: your first song",
    minutes: 30,
    objectives: [
      "Find F and G using the group of 3 black keys",
      "Read the note roll: the column is the key, the length is the duration",
      "Play an 8-bar melody in C position",
      "Play in time with 80% accuracy",
    ],
    blocks: [
      {
        title: "Review: C, D, E",
        subtitle: "What you saw yesterday",
        minutes: 5,
        body: [
          "Before anything new, check that yesterday's map stuck. No names: C is just left of the group of 2 black keys, D between them, E just to the right.",
          { w: "key-input" },
          { w: "find-keys", mode: "quiz", from: C3, to: C6, targets: [0, 2, 4], rounds: 10, title: "C, D or E" },
          {
            w: "sequence",
            title: "Warm-up: 1 2 3 4 5 4 3 2 1",
            hand: "right",
            from: C4 - 5,
            to: C4 + 12,
            bpm: 60,
            goal: 2,
            notes: [
              { midi: 60, finger: 1 }, { midi: 62, finger: 2 }, { midi: 64, finger: 3 }, { midi: 65, finger: 4 }, { midi: 67, finger: 5 },
              { midi: 65, finger: 4 }, { midi: 64, finger: 3 }, { midi: 62, finger: 2 }, { midi: 60, finger: 1 },
            ],
          },
        ],
      },
      {
        title: "F, G and the note roll",
        subtitle: "The group of 3 black keys and how to read falling notes",
        minutes: 8,
        body: [
          "Now the **group of 3 black keys**. **F** is the white key just to its left, and **G** sits between the first and second black keys. That completes C position: **C D E F G**, fingers 1 to 5.",
          { w: "find-keys", mode: "quiz", from: C3, to: C6, targets: [0, 5, 7], rounds: 10, title: "C, F or G" },
          { h: "Reading the note roll" },
          "Today the music shows up as **bars falling** toward the keyboard. It's a simplified score, just to get started:",
          {
            list: [
              "**The column** tells you the key: each bar lands exactly on the key you'll play.",
              "**The length** tells you how long the note lasts. Short bar = 1 beat (quarter note). Twice as long = 2 beats (half note). Four times = 4 beats (whole note).",
              "**The now line** is where the bar touches the keyboard. That's when you press, and you hold until the bar has passed.",
              "**The number** at the end of the bar is the finger. **R** means right hand.",
            ],
          },
          { callout: "theory", text: "The dashed lines mark the beats and the solid lines mark the bars. In 4/4, each bar has 4 beats. It's the same count as in sheet music, which comes in a few days." },
          { w: "play-along", title: "Just watch and listen", notes: rh(UP_DOWN), bpm: 60, from: C4 - 5, to: C4 + 12, modes: ["listen"], defaultMode: "listen" },
        ],
      },
      {
        title: "Play along",
        subtitle: "First waiting for you, then in time",
        minutes: 12,
        body: [
          "Start in **Wait for me** mode: the music stops at each note until you play the right key. No rush. Notice which finger goes on each key.",
          { w: "play-along", title: "Up and down", notes: rh(UP_DOWN), bpm: 60, from: C4 - 5, to: C4 + 12, defaultMode: "wait" },
          "Now your first song: **Passeio** (\"stroll\"), 8 bars, only C D E F G. First do it in **Wait for me** until you don't miss a single key. Then switch to **In time**: the notes fall at tempo and the site marks whether you were on time, close, or missed. The goal is **80%**.",
          { w: "play-along", title: "Passeio", notes: rh(PASSEIO), bpm: 60, from: C4 - 5, to: C4 + 12, defaultMode: "wait" },
          { callout: "tip", text: "In time is too hard? Use 50% or 75% speed. Going up slowly is faster than making mistakes at full speed." },
          {
            w: "selfcheck",
            id: "passeio",
            items: [
              { id: "dedos", label: "Each finger stayed on its key, the hand didn't wander" },
              { id: "segura", label: "I held the long notes until the bar passed" },
              { id: "meta", label: "I got 80% or more in In time mode" },
            ],
          },
        ],
      },
      {
        title: "Ear and creation",
        subtitle: "C, E or G",
        minutes: 5,
        body: [
          "Same game as yesterday, with notes further apart: after the reference C comes **C, E or G**. Answer by clicking or playing the key.",
          { w: "key-echo", notes: [60, 64, 67] },
          { h: "Change the ending" },
          "Play **Passeio** from memory, but make up 4 new bars for the end, using the same five notes and ending on C. If you like it, record it on your phone.",
          { w: "keys", from: C4 - 5, to: C4 + 12, names: "all", zones: [{ hand: "right", from: 60, to: 67, label: "C position" }] },
        ],
      },
    ],
  },
];
