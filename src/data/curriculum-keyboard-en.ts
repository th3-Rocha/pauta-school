// Keyboard year in English (same structure as curriculum-keyboard.ts).
import { buildMonths, type Month, type MonthSeed } from "./curriculum";

const SEEDS: MonthSeed[] = [
  {
    month: 1,
    title: "Getting to know the keyboard",
    theory: "Groups of 2 and 3 black keys, natural notes, middle C, fingers 1 to 5, basic note values in 4/4 and the treble clef.",
    practice: "Posture and bench, C position in the right hand, five-note melodies and long notes in the left hand.",
    milestone: {
      title: "Melody with hands separate",
      goal: "Play a short melody in the right hand with the root in the left.",
      criteria: ["8-bar RH melody with LH roots in half notes", "Find any natural note without looking at names"],
      targetBpm: 60,
    },
  },
  {
    month: 2,
    title: "Major scale and triads",
    theory: "Whole and half steps, sharps and flats, major scale (C and G), thumb-under, major and minor triads, eighth notes.",
    practice: "Scales hands separate, block triads in the RH, I–IV–V in C with close inversions.",
    milestone: {
      title: "Scales and I–IV–V",
      goal: "C and G scales over 2 octaves and I–IV–V with close inversions.",
      criteria: ["C and G major, hands separate, 2 octaves at 60", "I–IV–V with the closest inversion at 70"],
      targetBpm: 70,
    },
  },
  {
    month: 3,
    title: "Intervals and pentatonics",
    theory: "Diatonic intervals, F and D scales, minor keys (A, E, D), major and minor pentatonic, intro to the bass clef.",
    practice: "I–V–vi–IV, riffs, 2-bar continuations and pentatonic improv over a backing track.",
    milestone: {
      title: "First improv",
      goal: "Scales over 2 octaves and 4 improvised pentatonic bars.",
      criteria: ["Scales hands separate at 60–80 without tension", "Improvise 4 pentatonic bars over the backing"],
      targetBpm: 80,
    },
  },
  {
    month: 4,
    title: "Hands together and seventh chords",
    theory: "Circle of fifths and fourths, seventh chords (maj7, 7, m7, m7b5, °), harmonized scale in sevenths, Brazilian and US chord symbols.",
    practice: "Hands together, scales with both hands, sevenths in C and reading the bass clef in the LH.",
    milestone: {
      title: "Really two hands",
      goal: "Scales hands together and the C harmonized scale in sevenths.",
      criteria: ["C, G and F hands together over 2 octaves at 66", "Seventh chords in C, up and down"],
      targetBpm: 66,
    },
  },
  {
    month: 5,
    title: "Guide tones and ii–V–I",
    theory: "Guide tones (3rd and 7th), rootless-fifth shells, function (T, SD, D), ii–V–I, syncopation and rhythmic notation.",
    practice: "V7 around the circle of fifths, a one-bar comping pattern and reading with both hands.",
    milestone: {
      title: "Cycle of dominants",
      goal: "Chain all 12 dominants with as little movement as possible.",
      criteria: ["V7 around the cycle (LH root + RH 3rd/7th), 12 chords at 70", "ii–V–I in 3 keys"],
      targetBpm: 70,
    },
  },
  {
    month: 6,
    title: "Blues",
    theory: "12-bar blues, blues scale, Dorian and Mixolydian, swing.",
    practice: "LH shells with a RH solo, swing, dynamics and articulation by ear.",
    milestone: {
      title: "Blues solo",
      goal: "Solo over two choruses of a 12-bar blues.",
      criteria: ["2 choruses with the blues scale", "Scales hands together at 80"],
      targetBpm: 80,
    },
  },
  {
    month: 7,
    title: "Minor keys and tensions",
    theory: "Minor harmony, line clichés, 9, 11 and 13 tensions (5th → 13), avoid notes, four-way close.",
    practice: "Voicings with tensions in major and minor ii–V–I, augmented and sus triads, legato and staccato.",
    milestone: {
      title: "ii–V–I with tensions",
      goal: "Major and minor ii–V–I with tensions and smooth voice leading.",
      criteria: ["Major and minor ii–V–I in 4 keys", "No big jumps between chords"],
      targetBpm: 80,
    },
  },
  {
    month: 8,
    title: "Secondary dominants and motifs",
    theory: "Secondary dominants and related ii, approach notes, the 6 motivic development techniques.",
    practice: "Reading 8 bars hands together with 2 improvised, soloing from a motif.",
    milestone: {
      title: "Motif over V7/X",
      goal: "Play a progression with secondary dominants and develop a motif.",
      criteria: ["Analyze and play the progression with V7/X", "Improvise 8 bars from a motif"],
      targetBpm: 90,
    },
  },
  {
    month: 9,
    title: "Samba and bossa nova",
    theory: "Triplets, 6/8 and 12/8, samba in 3 layers, the bossa 2-3 and 3-2 clave, 6 keys in blocks (C to F).",
    practice: "Surdo-style LH and steady comping for 8 to 16 bars, bossa from 90 to 115 BPM.",
    milestone: {
      title: "Bossa over ii–V–I",
      goal: "Comp bossa nova with secondary dominants.",
      criteria: ["Bossa over ii–V–I with V7/X at 95–115", "4 scales hands together from C to F in eighths"],
      targetBpm: 100,
    },
  },
  {
    month: 10,
    title: "Chromaticism and all 12 keys",
    theory: "Tritone subs, passing diminished, modal interchange and the Neapolitan, completing all 12 keys.",
    practice: "Reharmonizing pop and MPB, chromatic bass lines, modal interchange by ear.",
    milestone: {
      title: "Reharmonization",
      goal: "Play a progression with a tritone sub, diminished and modal interchange.",
      criteria: ["Analyze and play the progression", "4 scales hands together in all 12 keys"],
      targetBpm: 100,
    },
  },
  {
    month: 11,
    title: "Jazz voicings",
    theory: "Rootless voicings (A and B), quartal voicings, Drop 2, low interval limits, enclosures, 3 against 2.",
    practice: "Comping a standard with rootless voicings, cross-rhythms, grace notes, glissandos, pedal and dynamics.",
    milestone: {
      title: "A whole standard",
      goal: "Comp a standard and solo with enclosures.",
      criteria: ["Whole standard with rootless voicings", "Solo with enclosures over ii–V–I"],
      targetBpm: 110,
    },
  },
  {
    month: 12,
    title: "Independence",
    theory: "Modal harmony, intro to upper structures, step-by-step transcription and review of the year.",
    practice: "MPB, jazz and pop repertoire, reading a chart with an improvised ending, transcription.",
    milestone: {
      title: "Final project",
      goal: "Scales in all 12 keys, a new chart with improv and 3 pieces in different styles.",
      criteria: ["Scales and arpeggios hands together in all 12 keys", "New chart with improv over V7/X and subV7", "3 pieces recorded"],
      targetBpm: 100,
    },
  },
];

export const KEYBOARD_MONTHS_EN: Month[] = buildMonths(SEEDS);
