// Guitar year in English (same structure as curriculum.ts).
import { buildMonths, type Month, type MonthSeed } from "./curriculum";

const SEEDS: MonthSeed[] = [
  {
    month: 1,
    title: "First steps",
    theory: "Musical alphabet, parts of the guitar, tab and chord diagrams, basic note values in 4/4.",
    practice: "Posture, tuning, open chords (A, D, C, G, Am, Em) and melodies in first position.",
    milestone: {
      title: "Chord changes in time",
      goal: "Change between the basic open chords without stopping the rhythm.",
      criteria: ["G → C → D → Em, 4 beats each, 2 rounds without stopping", "Read a new 4-bar melody in tab"],
      targetBpm: 70,
    },
  },
  {
    month: 2,
    title: "Pentatonic and first improv",
    theory: "Chromatic scale, whole and half steps, major scale (C and G), eighth notes and ties.",
    practice: "Power chords, first barre chords, alternate picking, A and E minor pentatonic, slides.",
    milestone: {
      title: "Four bars of your own",
      goal: "Improvise 4 bars in A minor over the backing track.",
      criteria: ["Use only pentatonic notes", "End the phrase on the root (A)"],
      targetBpm: 70,
    },
  },
  {
    month: 3,
    title: "Intervals and triads",
    theory: "Simple intervals, the G–B string offset, triads and the harmonized scale in triads.",
    practice: "Notes up to fret 12, inversions, I–IV–V and I–V–vi–IV, double stops, palm muting and in-tune bends.",
    milestone: {
      title: "In-tune bend",
      goal: "Find notes on the neck and bend in tune by a half and a whole step.",
      criteria: ["Whole-step bend within ±15 cents", "Recognize the 3rd and 5th by ear"],
      targetBpm: 70,
    },
  },
  {
    month: 4,
    title: "CAGED and blues",
    theory: "CAGED system, sixteenth notes, 12-bar blues, major pentatonic and blues scale.",
    practice: "Connecting the 5 shapes, rock and funk strumming, hammer-ons, pull-offs and blues riffs.",
    milestone: {
      title: "Blues in two shapes",
      goal: "Solo over a blues moving between two pentatonic shapes.",
      criteria: ["Play the 15 sixteenth-note figures with the metronome", "Change shapes without stopping"],
      targetBpm: 80,
    },
  },
  {
    month: 5,
    title: "Seventh chords and function",
    theory: "Circle of fifths, seventh chords, harmonized scale in sevenths, function and ii–V–I.",
    practice: "Seventh chords, one-octave arpeggios in CAGED, song analysis.",
    milestone: {
      title: "Arpeggiated ii–V–I",
      goal: "Arpeggiate a ii–V–I in three keys.",
      criteria: ["G, A and B major", "No stopping between chords"],
      targetBpm: 70,
    },
  },
  {
    month: 6,
    title: "Rhythm, swing and guide tones",
    theory: "Syncopation, 6/8 and 12/8, swing and shuffle, guide tones, samba, bossa and baião.",
    practice: "Soloing toward 3rds and 7ths, vibrato, dynamics, bossa and samba strumming.",
    milestone: {
      title: "Eight bars with guide tones",
      goal: "Improvise 8 bars highlighting thirds and sevenths.",
      criteria: ["Up to 2 chords per bar", "Guide tones on beats 1 and 3"],
      targetBpm: 80,
    },
  },
  {
    month: 7,
    title: "Voicings and voice leading",
    theory: "Inversions, spread triads, shells, Drop 2 and Drop 3, diminished chords and line clichés.",
    practice: "Drop 2 and Drop 3 across the neck, ii–V–I with little movement, passing diminished.",
    milestone: {
      title: "A progression without jumps",
      goal: "Comp a whole progression with smooth voice leading.",
      criteria: ["Shells and Drop 2/3", "No finger jumps more than 2 frets"],
      targetBpm: 80,
    },
  },
  {
    month: 8,
    title: "Harmony beyond the key",
    theory: "Minor keys, secondary dominants, tritone subs and modal interchange.",
    practice: "Reharmonizing pop and MPB, chromatic bass lines, guide tones on non-diatonic chords.",
    milestone: {
      title: "Mixed progression",
      goal: "Analyze and solo over a progression with non-diatonic chords.",
      criteria: ["Spot the secondary dominant", "Adjust the target note in its bar"],
      targetBpm: 80,
    },
  },
  {
    month: 9,
    title: "Modes and the whole neck",
    theory: "3NPS, CAGED and linear scales, tensions and avoid notes, the 7 modes over a drone.",
    practice: "Two-octave scales at 100 BPM, parallel modes highlighting the characteristic note.",
    milestone: {
      title: "Modal solo",
      goal: "Sustain a modal solo over a static backing track.",
      criteria: ["Connected scales in every position", "The mode's characteristic note shows up"],
      targetBpm: 100,
    },
  },
  {
    month: 10,
    title: "Altered colors",
    theory: "Modes of harmonic and melodic minor, altered tensions.",
    practice: "7alt and m7b5 voicings, two-octave arpeggios, triad ladders.",
    milestone: {
      title: "Resolve the tension",
      goal: "Resolve the altered scale and Phrygian dominant over V7.",
      criteria: ["Two-octave arpeggios", "Resolution to I and to i"],
      targetBpm: 90,
    },
  },
  {
    month: 11,
    title: "Real phrasing",
    theory: "Approach notes, enclosures, pentatonic superimposition, motivic development.",
    practice: "Enclosures on guide tones, controlled outside color, soloing from a motif.",
    milestone: {
      title: "Recorded solo",
      goal: "Record a solo over two choruses of blues.",
      criteria: ["Intentional rests", "A motif that develops", "Enclosures that resolve"],
      targetBpm: 90,
    },
  },
  {
    month: 12,
    title: "Final project",
    theory: "Style synthesis, full transcription, review of the 8 areas.",
    practice: "Transcribe a solo, sextuplets, pre-bends, volume swells.",
    milestone: {
      title: "Final project",
      goal: "Analyze a new chart, record the backing and improvise two choruses.",
      criteria: ["2 chords per bar with key changes", "Transcribe parts of your own solo"],
      targetBpm: 90,
    },
  },
];

export const GUITAR_MONTHS_EN: Month[] = buildMonths(SEEDS);
