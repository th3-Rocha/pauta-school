// Som de uma nota de tablatura, com a técnica escrita nela.
import { STANDARD_TUNING } from "../../lib/music";
import { mutedStrum, pluck, strum } from "../../app/audio";
import { chordMidis } from "../chords";
import type { TabNote } from "../types";

const midiAt = (s: number, f: number) => STANDARD_TUNING[s - 1] + f;
const HARM: Record<number, number> = { 12: 12, 7: 19, 5: 24, 19: 19, 24: 24, 4: 28, 9: 28 };

/** Toca a nota em `when`. `prev` é a nota anterior (para slides e ligados). `dur` em segundos. */
export function playTabNote(n: TabNote, when: number, dur: number, prev?: TabNote) {
  if ("rest" in n) return;
  if ("chord" in n) return strum(chordMidis(n.chord), { when, dur });
  if ("multi" in n) {
    if (n.t === "x") return mutedStrum(when);
    const ms = n.multi.map((q) => midiAt(q.s, q.f)).sort((a, b) => a - b);
    const short = n.t === "pm" ? Math.min(dur, 0.14) : dur;
    return ms.forEach((m, i) => pluck(m, { when: when + i * 0.008, dur: short, gain: 0.45, vibrato: n.t === "~" }));
  }
  const m = midiAt(n.s, n.f);
  const bend = n.b ?? 2;
  switch (n.t) {
    case "x":
      return mutedStrum(when, 0.3);
    case "pm":
      return pluck(m, { when, dur: Math.min(dur, 0.13), gain: 0.5 });
    case "h":
    case "p":
      return pluck(m, { when, dur, gain: 0.38 });
    case "/":
    case "\\": {
      const from = prev && "s" in prev ? midiAt(prev.s, prev.f) : m + (n.t === "/" ? -2 : 2);
      return pluck(from, { when, dur, gain: 0.4, glide: [{ semis: m - from, at: 0, time: Math.min(0.12, dur * 0.5) }] });
    }
    case "b":
      return pluck(m, { when, dur, glide: [{ semis: bend, at: 0.04, time: Math.min(0.2, dur * 0.5) }], vibrato: dur > 0.8 });
    case "pb":
    case "r":
      return pluck(m, { when, dur, glide: [{ semis: bend, at: 0, time: 0.001 }, { semis: 0, at: Math.max(0.05, dur * 0.35), time: Math.min(0.2, dur * 0.5) }] });
    case "~":
      return pluck(m, { when, dur, vibrato: true });
    case "harm":
      return pluck(STANDARD_TUNING[n.s - 1] + (HARM[n.f] ?? 12 + n.f), { when, dur: Math.max(dur, 1.2), gain: 0.35 });
    case "^":
      return pluck(m, { when, dur, gain: 0.75 });
    default:
      return pluck(m, { when, dur });
  }
}

/** Posição suingada: colcheias 2:1 dentro de cada tempo. */
export function swingTime(t: number): number {
  const b = Math.floor(t + 1e-6);
  const f = t - b;
  return b + (f <= 0.5 ? f * (4 / 3) : 2 / 3 + (f - 0.5) * (2 / 3));
}

/** Rótulo curto da técnica, escrito acima da tablatura. */
export function techLabel(n: TabNote): string | null {
  if (!("t" in n) || !n.t) return null;
  const amount = "b" in n && n.b ? n.b : 2;
  const bendTxt = amount === 1 ? "½" : amount === 2 ? "1" : amount === 3 ? "1½" : amount === 4 ? "2" : String(amount / 2);
  switch (n.t) {
    case "h":
      return "H";
    case "p":
      return "P";
    case "/":
      return "/";
    case "\\":
      return "\\";
    case "b":
      return `B${bendTxt}`;
    case "pb":
      return `PB${bendTxt}`;
    case "r":
      return "R";
    case "~":
      return "~~";
    case "pm":
      return "PM";
    case "t":
      return "T";
    case "harm":
      return "◇";
    case "^":
      return ">";
    default:
      return null;
  }
}
