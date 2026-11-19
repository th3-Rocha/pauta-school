// Ferramentas para escrever as aulas de guitarra dos meses 2 a 12 sem repetir código.
import type { MarkerKind } from "../../components/music/markers";
import { STANDARD_TUNING } from "../../lib/music";
import { DEGREE_LABEL, parseChord, pcName, SCALES } from "../../lib/harmony";
import type { Block, Lesson, Node, Stroke, TabNote, Tech } from "../types";

export { n, r } from "./m01/shared";

/* ───────── aulas e blocos ───────── */

/** Bloco: título, minutos e conteúdo. */
export const B = (title: string | undefined, minutes: number, ...body: Node[]): Block => ({ title, minutes, body });

/** Aula com os 4 blocos (revisão, conceito, laboratório, ouvido). */
export function lesson(day: number, title: string, objectives: string[], blocks: [Block, Block, Block, Block]): Lesson {
  const minutes = blocks.reduce((a, b) => a + b.minutes, 0);
  return { day, month: Math.min(12, Math.floor((day - 1) / 30) + 1), title, minutes, objectives, blocks };
}

/** Nota com técnica: t(3, 7, "b", 1) = corda 3, casa 7, bend, 1 tempo. */
export const t = (s: number, f: number, tech: Tech, d = 1, b?: number): TabNote => (b ? { s, f, d, t: tech, b } : { s, f, d, t: tech });
/** Duas ou mais notas juntas (double stop): m([[3,7],[2,8]], 1). */
export const m = (pairs: [number, number][], d = 1, tech?: Tech): TabNote => (tech ? { multi: pairs.map(([s, f]) => ({ s, f })), d, t: tech } : { multi: pairs.map(([s, f]) => ({ s, f })), d });
/** Acorde inteiro na tablatura. */
export const c = (chord: string, d = 1): TabNote => ({ chord, d });
/** Mesmo ritmo para várias notas: seq(0.5, [5,3],[4,0],[4,2]). */
export const seq = (d: number, ...ns: [number, number][]): TabNote[] => ns.map(([s, f]) => ({ s, f, d }));

/* ───────── levadas ───────── */

export const D = "down" as const;
export const U = "up" as const;
export const X = "hit" as const;
export const _ = null;
export const P = "rest" as const;

/** Cada compasso com a mesma batida. */
export const bars = (chords: string[], strokes: Stroke[]) => chords.map((chord) => ({ chord, strokes }));

/** Batidas prontas (8 = colcheias, 16 = semicolcheias). */
export const STR = {
  quarters: [D, D, D, D] as Stroke[],
  eighths: [D, U, D, U, D, U, D, U] as Stroke[],
  folk: [D, _, D, U, _, U, D, U] as Stroke[], // ↓ ↓↑ ↑↓↑
  pop: [D, _, D, U, _, U, D, _] as Stroke[],
  rockEighths: [D, D, D, D, D, D, D, D] as Stroke[],
  backbeat: [D, U, X, U, D, U, X, U] as Stroke[],
  funk16: [D, U, D, U, X, U, D, U, D, U, D, U, X, U, D, U] as Stroke[],
  reggae: [P, _, D, _, P, _, D, _] as Stroke[],
  shuffle: [D, U, D, U, D, U, D, U] as Stroke[],
  bossa: [D, _, _, D, _, _, D, _, _, _, D, _, _, D, _, _] as Stroke[],
  samba: [D, _, U, D, _, U, D, U, D, _, U, D, _, U, D, U] as Stroke[],
  baiao: [D, _, _, D, _, _, D, _, D, _, _, D, _, _, D, _] as Stroke[],
  waltz: [D, D, D] as Stroke[],
  six8: [D, D, U, D, D, U] as Stroke[],
};

/* ───────── escalas e arpejos no braço ───────── */

type Marker = { s: number; f: number; label?: string; kind?: MarkerKind };
const midiAt = (s: number, f: number) => STANDARD_TUNING[s - 1] + f;

/** Tipo da bolinha conforme o grau (para destacar tônica, 3ª, 5ª, 7ª). */
function kindOf(iv: number, highlight: "root" | "chord" | "none"): MarkerKind | undefined {
  if (highlight === "none") return undefined;
  if (iv === 0) return "root";
  if (highlight === "root") return undefined;
  if (iv === 3 || iv === 4) return "deg-3";
  if (iv === 7 || iv === 6 || iv === 8) return "deg-5";
  if (iv === 10 || iv === 11 || iv === 9) return "deg-7";
  return undefined;
}

/**
 * Todas as notas de uma escala entre duas casas.
 * label: "degree" (1, b3, 5…), "note" (A, C, D…) ou "none".
 */
export function scaleMarkers(rootPc: number, scale: keyof typeof SCALES | number[], from: number, to: number, opts: { label?: "degree" | "note" | "none"; highlight?: "root" | "chord" | "none"; strings?: number[] } = {}): Marker[] {
  const ivs = Array.isArray(scale) ? scale : SCALES[scale];
  const out: Marker[] = [];
  for (const s of opts.strings ?? [6, 5, 4, 3, 2, 1])
    for (let f = from; f <= to; f++) {
      const iv = (((midiAt(s, f) - rootPc) % 12) + 12) % 12;
      if (!ivs.includes(iv)) continue;
      const label = opts.label === "none" ? undefined : opts.label === "note" ? pcName((rootPc + iv) % 12, ![2, 4, 7, 9, 11].includes(rootPc)) : DEGREE_LABEL[iv];
      out.push({ s, f, label, kind: kindOf(iv, opts.highlight ?? "root") });
    }
  return out;
}

/** Desenho no braço pronto para o widget. */
export function box(rootPc: number, scale: keyof typeof SCALES | number[], from: number, to: number, caption?: string, opts: Parameters<typeof scaleMarkers>[4] = {}): Node {
  return { w: "fretboard", from: Math.max(0, from - (from > 0 ? 1 : 0)), frets: Math.max(to, from + 4), markers: scaleMarkers(rootPc, scale, from, to, opts), caption };
}

/** Notas de um acorde (arpejo) entre duas casas, com graus. */
export function arpBox(symbol: string, from: number, to: number, caption?: string): Node {
  const p = parseChord(symbol);
  const ivs = p.intervals.map((i) => i % 12);
  return box(p.root, ivs, from, to, caption, { highlight: "chord" });
}

/**
 * Percorre a escala na região (corda 6 → 1, casas em ordem), subindo e (opcional) descendo.
 * `perString`: limita quantas notas por corda (3 para 3NPS).
 */
export function run(rootPc: number, scale: keyof typeof SCALES | number[], from: number, to: number, d = 0.5, opts: { down?: boolean; strings?: number[]; startOnRoot?: boolean } = {}): TabNote[] {
  const ivs = Array.isArray(scale) ? scale : SCALES[scale];
  const up: TabNote[] = [];
  let lastMidi = -1;
  for (const s of opts.strings ?? [6, 5, 4, 3, 2, 1])
    for (let f = from; f <= to; f++) {
      const mm = midiAt(s, f);
      const iv = (((mm - rootPc) % 12) + 12) % 12;
      if (!ivs.includes(iv) || mm <= lastMidi) continue;
      up.push({ s, f, d });
      lastMidi = mm;
    }
  let notes = up;
  if (opts.startOnRoot) {
    const i = up.findIndex((q) => "s" in q && (((midiAt(q.s, q.f) - rootPc) % 12) + 12) % 12 === 0);
    let j = -1;
    up.forEach((q, k) => "s" in q && (((midiAt(q.s, q.f) - rootPc) % 12) + 12) % 12 === 0 && (j = k));
    notes = up.slice(i, j + 1);
  }
  if (opts.down !== false) notes = [...notes, ...[...notes].reverse().slice(1)];
  return notes;
}

/** Arpejo de um acorde na região, subindo e descendo. */
export function arp(symbol: string, from: number, to: number, d = 0.5, opts: { down?: boolean; strings?: number[] } = {}): TabNote[] {
  const p = parseChord(symbol);
  return run(p.root, p.intervals.map((i) => i % 12), from, to, d, { ...opts, startOnRoot: true });
}

/** Repete uma figura N vezes. */
export const times = <T,>(k: number, xs: T[]): T[] => Array.from({ length: k }, () => xs).flat();

/** Blues de 12 compassos em graus (I7 IV7 V7). */
export function blues12(I: string, IV: string, V: string, quickChange = false): string[] {
  return [I, quickChange ? IV : I, I, I, IV, IV, I, I, V, IV, I, V];
}

/* ───────── nós prontos ───────── */

export const tip = (text: string | string[], title?: string): Node => ({ callout: "tip", text, title });
export const warn = (text: string | string[], title?: string): Node => ({ callout: "warning", text, title });
export const theory = (text: string | string[], title?: string): Node => ({ callout: "theory", text, title });
export const check = (text: string | string[], title?: string): Node => ({ callout: "selfCheck", text, title });
export const list = (...items: string[]): Node => ({ list: items });
export const ol = (...items: string[]): Node => ({ list: items, ordered: true });
export const h = (text: string): Node => ({ h: text });
export const checks = (id: string, title: string, ...items: string[]): Node => ({
  w: "selfcheck",
  id,
  title,
  items: items.map((label, i) => ({ id: `${id}-${i + 1}`, label })),
});

export const ear = (kind: Extract<Node, { w: "ear" }>["kind"], options?: string[]): Node => (options ? { w: "ear", kind, options } : { w: "ear", kind });
export const whichChord = (...chords: string[]): Node => ({ w: "ear", kind: "which-chord", chords });
export const metro = (bpm: number): Node => ({ w: "metronome", bpm });
export const minute = (id: string, label: string): Node => ({ w: "minute", id, label });
export const chords = (...cs: string[]): Node => ({ w: "chords", chords: cs });
export const changes = (cs: string[], bpm: number, beats = 4, title?: string): Node => ({ w: "changes", chords: cs, beats, bpm, title });
export const tab = (title: string | undefined, bpm: number, notes: TabNote[], extra: { swing?: boolean; backing?: string[]; beatsPerMeasure?: number } = {}): Node => ({ w: "tab", title, bpm, notes, ...extra });
export const strum = (title: string | undefined, bpm: number, measures: { chord: string; strokes: Stroke[] }[], extra: { beats?: number; swing?: boolean; melody?: TabNote[] } = {}): Node => ({ w: "strum", title, bpm, measures, ...extra });
export const jam = (title: string, key: string, bpm: number, feel: Extract<Node, { w: "jam" }>["feel"], cs: string[], beats?: number): Node => ({ w: "jam", title, key, bpm, feel, chords: cs, ...(beats ? { beats } : {}) });
export const drone = (note: number): Node => ({ w: "drone", note });
export const bend = (s: number, f: number, semis = 2): Node => ({ w: "bend", s, f, semis });
export const rec = (id: string, label?: string): Node => ({ w: "recorder", id, label });
export const tuner: Node = { w: "tuner" };
export const bpmlog = (month: number, target: number): Node => ({ w: "bpmlog", month, target });

/** Classe de altura pelo nome ("A" → 9). */
export { pcOf as pc } from "../../lib/harmony";

/**
 * Arpejo de uma oitava a partir da tônica na corda `s`, casa `f` (sobe e desce).
 * Procura cada nota do acorde na corda mais grave possível dentro de uma mão (f-2 a f+3).
 */
export function arp1(symbol: string, s: number, f: number, d = 0.5, opts: { down?: boolean; octaves?: 1 | 2 } = {}): TabNote[] {
  const p = parseChord(symbol);
  const R = midiAt(s, f);
  const top = R + 12 * (opts.octaves ?? 1);
  const tones: number[] = [];
  for (let k = R; k <= top; k++) if (p.intervals.some((iv) => (iv % 12) === (((k - R) % 12) + 12) % 12)) tones.push(k);
  const out: TabNote[] = [];
  let cur = s;
  const lo = Math.max(0, f - 2);
  const hi = f + 3 + (opts.octaves === 2 ? 2 : 0);
  for (const k of tones) {
    for (let st = cur; st >= 1; st--) {
      const fr = k - STANDARD_TUNING[st - 1];
      if (fr >= lo && fr <= hi) {
        out.push({ s: st, f: fr, d });
        cur = st;
        break;
      }
    }
  }
  return opts.down === false ? out : [...out, ...[...out].reverse().slice(1)];
}

/** Arpejos de uma progressão, um acorde por compasso (4 colcheias subindo, 4 descendo). */
export function arpProg(items: [string, number, number][], d = 0.5): TabNote[] {
  return items.flatMap(([sym, s, f]) => {
    const up = arp1(sym, s, f, d, { down: false });
    const four = up.slice(0, 4);
    while (four.length < 4) four.push(up[up.length - 1]);
    return [...four, ...[...four].reverse()];
  });
}

/** Escala com 3 notas por corda (3NPS), começando na corda 6 na casa `f`. Sobe e (opcional) desce. */
export function nps3(rootPc: number, scale: keyof typeof SCALES | number[], f: number, d = 0.5, opts: { down?: boolean; strings?: number } = {}): TabNote[] {
  const ivs = Array.isArray(scale) ? scale : SCALES[scale];
  const start = midiAt(6, f);
  const notes: number[] = [];
  for (let k = start; notes.length < 3 * (opts.strings ?? 6); k++) if (ivs.includes((((k - rootPc) % 12) + 12) % 12)) notes.push(k);
  const up: TabNote[] = notes.map((mm, i) => {
    const s = 6 - Math.floor(i / 3);
    return { s, f: mm - STANDARD_TUNING[s - 1], d };
  });
  return opts.down === false ? up : [...up, ...[...up].reverse().slice(1)];
}

/** Marcadores de um padrão 3NPS (para desenhar no braço). */
export function nps3Box(rootPc: number, scale: keyof typeof SCALES | number[], f: number, caption?: string): Node {
  const notes = nps3(rootPc, scale, f, 1, { down: false }) as { s: number; f: number }[];
  const ivs = Array.isArray(scale) ? scale : SCALES[scale];
  void ivs;
  const fs = notes.map((q) => q.f);
  return {
    w: "fretboard",
    from: Math.max(0, Math.min(...fs) - 1),
    frets: Math.max(...fs) + 1,
    markers: notes.map((q) => {
      const iv = (((midiAt(q.s, q.f) - rootPc) % 12) + 12) % 12;
      return { s: q.s, f: q.f, label: DEGREE_LABEL[iv], kind: iv === 0 ? ("root" as const) : undefined };
    }),
    caption,
  };
}
