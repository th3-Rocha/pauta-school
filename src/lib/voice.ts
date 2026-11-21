// src/lib/voice.ts
// Canto: corpo do Chimera, extensão, afinação e vogais do português.
// Funções puras: nada de áudio, microfone nem motor aqui.
import { noteName } from "./piano";

/* ── Tipos (iguais aos do brief) ──────────────────────────────────────── */

/** O corpo do Chimera: igual ao BodyMix dele. 0..1 cada, passos de 0.05. */
export type VoiceBody = { female: number; child: number };

/** Uma leitura do microfone, ou null em silêncio. */
export type VoiceReading = {
  hz: number;
  /** Com fração: 60.3 = Dó 4 + 30 cents. */
  midi: number;
  /** Desvio da nota mais próxima, -50..50. */
  cents: number;
  /** 0..1 */
  level: number;
  /** 0..1 (abaixo de ~0.6: soprado/ruído, não confie na altura). */
  clarity: number;
  /** Quando der para estimar a vogal. */
  formants?: { f1: number; f2: number };
} | null;

/** O que o Chimera está fazendo agora (vem da telemetria dele). */
export type GuideState = {
  status: "loading" | "idle" | "singing" | "no-audio" | "no-3d" | "error";
  /** A nota que ele está cantando. */
  midi?: number;
  /** "ma", "ê"… */
  syllable?: string;
  /** 0..1, para o brilho. */
  level?: number;
};

/** Extensão do aluno, em MIDI. */
export type VoiceRange = { low: number; high: number; comfortLow: number; comfortHigh: number };

export type Lang = "pt" | "en";
export type BodyCorner = "male" | "female" | "child";

/** Abaixo disso a leitura é soprada/ruidosa demais para confiar na altura. */
export const MIN_CLARITY = 0.6;

/* ── Corpo ─────────────────────────────────────────────────────────────── */

export const BODY_STEP = 0.05;
const clamp01 = (x: number) => (Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : 0);

/** Arredonda para a grade de 5% (ou outro passo). */
export const snap = (x: number, step = BODY_STEP) => clamp01(Math.round(x / step) * step);

export const BODY_PRESETS: Record<BodyCorner, VoiceBody> = {
  male: { female: 0, child: 0 },
  female: { female: 1, child: 0 },
  child: { female: 0, child: 1 },
};

/** Pesos de cada ponta (somam 1), como o motor do Chimera calcula. */
export function bodyWeights(b: VoiceBody): Record<BodyCorner, number> {
  const f = clamp01(b.female);
  const c = clamp01(b.child);
  return { male: (1 - c) * (1 - f), female: (1 - c) * f, child: c };
}

/** A ponta com mais peso (para o que fica por ponta, como a oitava do teclado). */
export function nearestCorner(b: VoiceBody): BodyCorner {
  const w = bodyWeights(b);
  return (Object.keys(w) as BodyCorner[]).reduce((best, k) => (w[k] > w[best] ? k : best), "male");
}

export const sameBody = (a: VoiceBody, b: VoiceBody) => Math.abs(a.female - b.female) < 1e-6 && Math.abs(a.child - b.child) < 1e-6;

/** Mistura geométrica por pesos (alturas e frequências). */
export function blendLog(b: VoiceBody, of: Record<BodyCorner, number>): number {
  const w = bodyWeights(b);
  return Math.exp(w.male * Math.log(of.male) + w.female * Math.log(of.female) + w.child * Math.log(of.child));
}

/** Altura padrão do Chimera para este corpo: 110 / 205 / 260 Hz, mistura logarítmica. */
export const defaultF0 = (b: VoiceBody) => blendLog(b, { male: 110, female: 205, child: 260 });

/** Primeira tecla do teclado do Chimera: C3, A3 ou C4 pela ponta mais próxima. */
export const keyboardBase = (b: VoiceBody) => ({ male: 48, female: 57, child: 60 })[nearestCorner(b)];

/**
 * Rótulo do corpo. Fala de som e tamanho do instrumento, não de identidade.
 * Ponta exata: "Adulto, mais grave"; mistura: "Masc. 40 · Fem. 30 · Criança 30%".
 */
export function bodyLabel(b: VoiceBody, lang: Lang = "pt"): string {
  const w = bodyWeights(b);
  const corner = (Object.keys(w) as BodyCorner[]).find((k) => w[k] > 0.999);
  const names = lang === "en" ? { male: "Adult, lower", female: "Adult, higher", child: "Child" } : { male: "Adulto, mais grave", female: "Adulto, mais agudo", child: "Criança" };
  if (corner) return names[corner];
  const short = lang === "en" ? { male: "Male", female: "Female", child: "Child" } : { male: "Masc.", female: "Fem.", child: "Criança" };
  const parts = (Object.keys(w) as BodyCorner[]).filter((k) => w[k] > 0.005).map((k) => `${short[k]} ${Math.round(w[k] * 100)}`);
  return `${parts.join(" · ")}%`;
}

/** Posição no triângulo (u: 0..1 da esquerda para a direita, v: 0..1 de cima para baixo). Igual ao BodyPad. */
export function toUV(b: VoiceBody): [number, number] {
  return [0.5 + (b.female - 0.5) * (1 - b.child), b.child];
}

/** O corpo numa posição do triângulo (preso dentro dele; na ponta da criança, `female` fica como estava). */
export function fromUV(u: number, v: number, prev: VoiceBody): VoiceBody {
  const child = snap(v);
  const female = child < 1 ? snap(0.5 + (u - 0.5) / (1 - Math.min(v, 0.999))) : prev.female;
  return { female, child };
}

/**
 * Sugestão de corpo a partir da voz falada (e da extensão, se houver).
 *
 * Regra (documentada para o currículo):
 * 1. A altura média da fala é parecida com a altura padrão de cada ponta (≈110 / 205 / 260 Hz).
 * 2. Com extensão, o centro da região confortável conta 40%: ele fica, em média, uma quinta acima
 *    da fala, então entra dividido por 1,5.
 * 3. Até 205 Hz anda na borda de cima (adulto): `female` vai de 0 (110 Hz) a 1 (205 Hz) em escala log.
 * 4. Acima de 205 Hz desce para a criança, mas para adultos (fala sozinha ou extensão que desce
 *    abaixo de Fá 3) fica no máximo em 40% criança: voz aguda de adulto não é voz de criança.
 * 5. Arredonda para a grade de 5%.
 */
export function suggestBody(medianSpeakingHz: number, range?: VoiceRange): VoiceBody {
  let hz = medianSpeakingHz;
  if (range) {
    const center = midiToHz((range.comfortLow + range.comfortHigh) / 2) / 1.5;
    hz = Math.exp(0.6 * Math.log(medianSpeakingHz) + 0.4 * Math.log(center));
  }
  const l = Math.log(hz);
  const [m, f, c] = [Math.log(110), Math.log(205), Math.log(260)];
  if (hz <= 205) return { female: snap((l - m) / (f - m)), child: 0 };
  let child = (l - f) / (c - f);
  const adultish = !range || range.low < 53;
  if (adultish) child = Math.min(child, 0.4);
  return { female: 1, child: snap(child) };
}

/* ── Afinação ──────────────────────────────────────────────────────────── */

export const hzToMidi = (hz: number) => 69 + 12 * Math.log2(hz / 440);
export const midiToHz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

/** Desvio em cents de `midi` (com fração) para `target`. Positivo = acima. */
export const centsOff = (midi: number, target: number) => (midi - target) * 100;

/** Mesma nota em qualquer oitava (para a nota "certa na oitava errada"). */
export const sameNoteAnyOctave = (a: number, b: number) => ((Math.round(a) - Math.round(b)) % 12 + 12) % 12 === 0;

/**
 * Compara a voz com o alvo considerando oitava: `octave` é quantas oitavas acima (+) ou abaixo (−)
 * o aluno cantou, e `cents` é o desvio dentro dessa oitava.
 */
export function pitchVsTarget(midi: number, target: number): { octave: number; cents: number } {
  const diff = midi - target;
  const octave = Math.round(diff / 12);
  return { octave, cents: (diff - octave * 12) * 100 };
}

/**
 * Leva um exercício para a região do aluno.
 * - `octave`: muda só de oitava (mantém o tom), escolhendo a que cabe melhor na região confortável.
 * - `key`: transpõe por semitons para o centro da região confortável (muda o tom).
 */
export function transposeToRange<T extends { midi: number }>(notes: T[], range: VoiceRange, by: "octave" | "key" = "octave"): { notes: T[]; shift: number } {
  if (notes.length === 0) return { notes, shift: 0 };
  const lo = Math.min(...notes.map((n) => n.midi));
  const hi = Math.max(...notes.map((n) => n.midi));
  const center = (lo + hi) / 2;
  const target = (range.comfortLow + range.comfortHigh) / 2;
  let shift: number;
  if (by === "key") shift = Math.round(target - center);
  else {
    const candidates = [-3, -2, -1, 0, 1, 2, 3].map((k) => k * 12);
    const outside = (s: number) => Math.max(0, range.comfortLow - (lo + s)) + Math.max(0, hi + s - range.comfortHigh);
    shift = candidates.reduce((best, s) => {
      const a = outside(s), b = outside(best);
      return a < b || (a === b && Math.abs(center + s - target) < Math.abs(center + best - target)) ? s : best;
    }, 0);
  }
  return { notes: notes.map((n) => ({ ...n, midi: n.midi + shift })), shift };
}

/* ── Extensão e tipo de voz ───────────────────────────────────────────── */

export type VoiceType = "bass" | "baritone" | "tenor" | "contralto" | "mezzo" | "soprano" | "child";

/** Faixa típica de cada tipo (MIDI), só como orientação. Fonte: tabelas usuais de canto coral. */
export const VOICE_TYPES: Record<VoiceType, { low: number; high: number }> = {
  bass: { low: 40, high: 64 }, // Mi 2 – Mi 4
  baritone: { low: 45, high: 69 }, // Lá 2 – Lá 4
  tenor: { low: 48, high: 72 }, // Dó 3 – Dó 5
  contralto: { low: 53, high: 77 }, // Fá 3 – Fá 5
  mezzo: { low: 57, high: 81 }, // Lá 3 – Lá 5
  soprano: { low: 60, high: 84 }, // Dó 4 – Dó 6
  child: { low: 57, high: 79 }, // Lá 3 – Sol 5
};

export type VoiceTypeGuess = { type: VoiceType; score: number; confidence: "high" | "medium" | "low" };

/**
 * Tipos de voz prováveis (nunca uma resposta só): cada tipo pontua pela sobreposição da região
 * confortável do aluno com a faixa típica e pela distância entre os centros. Devolve os 3 melhores.
 */
export function classifyRange(range: VoiceRange, body?: VoiceBody): VoiceTypeGuess[] {
  const cLo = range.comfortLow;
  const cHi = Math.max(range.comfortHigh, cLo + 1);
  const childW = body ? bodyWeights(body).child : 0;
  const out = (Object.keys(VOICE_TYPES) as VoiceType[]).map((type) => {
    const t = VOICE_TYPES[type];
    const overlap = Math.max(0, Math.min(cHi, t.high) - Math.max(cLo, t.low)) / (cHi - cLo);
    const centerDist = Math.abs((cLo + cHi) / 2 - (t.low + t.high) / 2);
    let score = overlap * 0.7 + Math.max(0, 1 - centerDist / 12) * 0.3;
    if (type === "child") score *= 0.3 + 0.7 * childW; // voz infantil só pesa com corpo de criança
    else score *= 1 - 0.5 * childW;
    return { type, score };
  });
  out.sort((a, b) => b.score - a.score);
  const top = out[0].score || 1;
  return out.slice(0, 3).map((g) => ({
    ...g,
    score: Math.round(g.score * 100) / 100,
    confidence: g.score / top > 0.9 && g.score > 0.6 ? "high" : g.score / top > 0.7 ? "medium" : "low",
  }));
}

/** Tessitura: a região confortável, com o centro e a largura em semitons. */
export function tessitura(range: VoiceRange) {
  return {
    low: range.comfortLow,
    high: range.comfortHigh,
    center: (range.comfortLow + range.comfortHigh) / 2,
    span: range.comfortHigh - range.comfortLow,
  };
}

/** Região de passagem típica (início, fim) para o corpo, como orientação. */
export function passaggioFor(b: VoiceBody): [number, number] {
  const lo = blendLog(b, { male: midiToHz(62), female: midiToHz(69), child: midiToHz(70) });
  const hi = blendLog(b, { male: midiToHz(66), female: midiToHz(74), child: midiToHz(74) });
  return [Math.round(hzToMidi(lo)), Math.round(hzToMidi(hi))];
}

/* ── Nomes ─────────────────────────────────────────────────────────────── */

/** Sílaba de solfejo cantada, pela classe da nota (sustenidos com a sílaba de baixo). */
export const SOLFEGE = ["Dó", "Dó", "Ré", "Ré", "Mi", "Fá", "Fá", "Sol", "Sol", "Lá", "Lá", "Si"];

/** "Sol 3" / "G3". */
export const voiceNoteName = (midi: number, lang: Lang = "pt", withOctave = true) =>
  noteName(Math.round(midi), lang === "en" ? "letters" : "solfege", "sharp", withOctave);

/* ── Vogais do português ──────────────────────────────────────────────── */

export type VowelId = "a" | "é" | "ê" | "i" | "ó" | "ô" | "u" | "ã" | "ẽ" | "ĩ" | "õ" | "ũ";

export type Vowel = {
  id: VowelId;
  ipa: string;
  /** Palavra de exemplo, com a vogal destacável. */
  example: { pt: string; en: string };
  nasal: boolean;
  /** Forma da boca de frente. */
  mouth: "open" | "spread" | "mid-spread" | "rounded" | "mid-rounded";
  /** F1/F2 aproximados (Hz) de um adulto de voz grave; os outros corpos saem por escala. */
  f1: number;
  f2: number;
};

/** Valores médios do português brasileiro (aproximados, para posicionar no mapa; não são norma). */
export const VOWELS_PT: Vowel[] = [
  { id: "a", ipa: "a", example: { pt: "pá", en: "pá (like 'father')" }, nasal: false, mouth: "open", f1: 750, f2: 1300 },
  { id: "é", ipa: "ɛ", example: { pt: "pé", en: "pé (like 'bed')" }, nasal: false, mouth: "mid-spread", f1: 590, f2: 1850 },
  { id: "ê", ipa: "e", example: { pt: "vê", en: "vê (like 'day')" }, nasal: false, mouth: "spread", f1: 420, f2: 2050 },
  { id: "i", ipa: "i", example: { pt: "vi", en: "vi (like 'see')" }, nasal: false, mouth: "spread", f1: 290, f2: 2250 },
  { id: "ó", ipa: "ɔ", example: { pt: "pó", en: "pó (like 'law')" }, nasal: false, mouth: "mid-rounded", f1: 570, f2: 950 },
  { id: "ô", ipa: "o", example: { pt: "avô", en: "avô (like 'go')" }, nasal: false, mouth: "rounded", f1: 420, f2: 820 },
  { id: "u", ipa: "u", example: { pt: "tu", en: "tu (like 'too')" }, nasal: false, mouth: "rounded", f1: 310, f2: 760 },
  { id: "ã", ipa: "ɐ̃", example: { pt: "lã", en: "lã" }, nasal: true, mouth: "open", f1: 580, f2: 1350 },
  { id: "ẽ", ipa: "ẽ", example: { pt: "tempo", en: "tempo" }, nasal: true, mouth: "spread", f1: 430, f2: 1950 },
  { id: "ĩ", ipa: "ĩ", example: { pt: "sim", en: "sim" }, nasal: true, mouth: "spread", f1: 300, f2: 2200 },
  { id: "õ", ipa: "õ", example: { pt: "som", en: "som" }, nasal: true, mouth: "rounded", f1: 430, f2: 860 },
  { id: "ũ", ipa: "ũ", example: { pt: "um", en: "um" }, nasal: true, mouth: "rounded", f1: 320, f2: 800 },
];

/** Escala dos formantes por ponta do corpo (tratos menores = formantes mais altos). */
const FORMANT_SCALE: Record<BodyCorner, { f1: number; f2: number }> = {
  male: { f1: 1, f2: 1 },
  female: { f1: 1.15, f2: 1.18 },
  child: { f1: 1.3, f2: 1.35 },
};

/** F1/F2 da vogal para este corpo (mistura geométrica das três pontas). */
export function vowelFormants(v: Vowel, body: VoiceBody): { f1: number; f2: number } {
  return {
    f1: blendLog(body, { male: v.f1 * FORMANT_SCALE.male.f1, female: v.f1 * FORMANT_SCALE.female.f1, child: v.f1 * FORMANT_SCALE.child.f1 }),
    f2: blendLog(body, { male: v.f2 * FORMANT_SCALE.male.f2, female: v.f2 * FORMANT_SCALE.female.f2, child: v.f2 * FORMANT_SCALE.child.f2 }),
  };
}

/** A vogal mais próxima destes formantes (distância em escala log, F2 pesando metade). */
export function nearestVowel(f1: number, f2: number, body: VoiceBody, includeNasal = false): { vowel: Vowel; distance: number } {
  let best = VOWELS_PT[0];
  let bestD = Infinity;
  for (const v of VOWELS_PT) {
    if (v.nasal && !includeNasal) continue;
    const t = vowelFormants(v, body);
    const d = Math.hypot(Math.log(f1 / t.f1), 0.5 * Math.log(f2 / t.f2));
    if (d < bestD) { bestD = d; best = v; }
  }
  return { vowel: best, distance: bestD };
}

/* ── Vibrato e constância ─────────────────────────────────────────────── */

/** Velocidade (Hz) e profundidade (± cents) do vibrato numa janela de amostras {t (s), midi}. */
export function vibratoStats(samples: { t: number; midi: number }[]): { rateHz: number; depthCents: number } | null {
  if (samples.length < 8) return null;
  const mean = samples.reduce((s, x) => s + x.midi, 0) / samples.length;
  let crossings = 0;
  for (let i = 1; i < samples.length; i++) if ((samples[i - 1].midi - mean) * (samples[i].midi - mean) < 0) crossings++;
  const dur = samples[samples.length - 1].t - samples[0].t;
  if (dur <= 0) return null;
  const devs = samples.map((x) => Math.abs(x.midi - mean) * 100).sort((a, b) => a - b);
  const p90 = devs[Math.floor(devs.length * 0.9)];
  return { rateHz: crossings / 2 / dur, depthCents: p90 };
}

/** Quão constante é um sinal (volume do "sss"): 1 = reto, 0 = serra. */
export function steadiness(levels: number[]): number {
  const xs = levels.filter((x) => x > 0.02);
  if (xs.length < 4) return 0;
  const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((s, x) => s + (x - mean) ** 2, 0) / xs.length);
  return Math.max(0, Math.min(1, 1 - (sd / mean) * 2.5));
}
