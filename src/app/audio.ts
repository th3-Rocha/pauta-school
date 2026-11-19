// Som gerado no navegador: corda dedilhada (Karplus-Strong), metrônomo e
// leitura de altura pelo microfone. Nenhum arquivo de áudio.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

export function audio(): AudioContext {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 5200;
    master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(lp).connect(comp).connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

/* ───────── corda dedilhada ───────── */

const plucks = new Map<number, { buf: AudioBuffer; rate: number }>();
/** Duração máxima de uma nota solta (a corda vai morrendo sozinha até lá). */
const PLUCK_SECONDS = 4.2;

function pluckBuffer(midi: number) {
  const hit = plucks.get(midi);
  if (hit) return hit;
  const c = audio();
  const sr = c.sampleRate;
  const freq = midiToFreq(midi);
  const N = Math.max(2, Math.round(sr / freq - 0.5));
  const len = Math.floor(sr * PLUCK_SECONDS);
  const buf = c.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);
  const ring = new Float32Array(N);
  let prev = 0;
  for (let i = 0; i < N; i++) {
    const r = Math.random() * 2 - 1;
    ring[i] = (r + prev) * 0.5;
    prev = r;
  }
  const decay = midi < 50 ? 0.9978 : 0.9965;
  let peak = 0;
  for (let i = 0; i < len; i++) {
    const a = i % N;
    const v = ring[a];
    ring[a] = decay * 0.5 * (ring[a] + ring[(a + 1) % N]);
    d[i] = v;
    peak = Math.max(peak, Math.abs(v));
  }
  // Fim suave: o último trecho do buffer desce até zero em curva de cosseno,
  // para a nota nunca parar com um corte seco.
  const fade = Math.floor(sr * 1.4);
  for (let i = 0; i < len; i++) {
    let v = d[i] / (peak || 1);
    const k = i - (len - fade);
    if (k > 0) v *= 0.5 * (1 + Math.cos((Math.PI * k) / fade));
    d[i] = v;
  }
  // O filtro de média atrasa meio sample: corrige a afinação no playbackRate.
  const entry = { buf, rate: freq / (sr / (N + 0.5)) };
  plucks.set(midi, entry);
  return entry;
}

export function pluck(
  midi: number,
  opts: {
    when?: number;
    gain?: number;
    dur?: number;
    /** Muda a altura durante a nota: bend, slide, vibrato. `semis` relativo à nota tocada. */
    glide?: { semis: number; at: number; time: number }[];
    vibrato?: boolean;
  } = {},
) {
  const c = audio();
  const t = opts.when ?? c.currentTime;
  const { buf, rate } = pluckBuffer(midi);
  const src = c.createBufferSource();
  src.buffer = buf;
  src.playbackRate.setValueAtTime(rate, t);
  let cur = rate;
  for (const gl of opts.glide ?? []) {
    src.playbackRate.setValueAtTime(cur, t + gl.at);
    cur = rate * Math.pow(2, gl.semis / 12);
    src.playbackRate.linearRampToValueAtTime(cur, t + gl.at + gl.time);
  }
  if (opts.vibrato) {
    const lfo = c.createOscillator();
    const depth = c.createGain();
    lfo.frequency.value = 5.5;
    depth.gain.value = rate * 0.012;
    lfo.connect(depth).connect(src.playbackRate);
    lfo.start(t + 0.15);
    lfo.stop(t + (opts.dur ?? 2.5) + 0.1);
  }
  const g = c.createGain();
  const vol = opts.gain ?? 0.55;
  g.gain.setValueAtTime(vol, t);
  if (opts.dur) {
    // abafar a corda: queda exponencial curta, como a mão encostando, sem clique
    g.gain.setTargetAtTime(0, t + opts.dur, 0.07);
  }
  src.connect(g).connect(master!);
  src.start(t);
  src.stop(t + (opts.dur ? Math.min(opts.dur + 0.5, PLUCK_SECONDS) : PLUCK_SECONDS));
}

/* ───────── metrônomo ───────── */

export type ClickMode = "all" | "downbeat" | "offbeats" | "gap";

export type MetronomeConfig = { bpm: number; beats: number; mode: ClickMode; compound?: boolean };

function click(t: number, accent: boolean) {
  const c = audio();
  const o = c.createOscillator();
  const g = c.createGain();
  o.frequency.value = accent ? 1760 : 1175;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(accent ? 0.5 : 0.32, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  o.connect(g).connect(master!);
  o.start(t);
  o.stop(t + 0.06);
}

/**
 * Agenda os cliques com antecedência (lookahead) para não atrasar mesmo com a
 * aba ocupada. Avisa a interface do tempo atual por `onBeat`.
 */
export class MetronomeEngine {
  private timer: number | null = null;
  private next = 0;
  private beat = 0;
  private measure = 0;
  private uiTimers: number[] = [];
  constructor(
    public cfg: MetronomeConfig,
    private onBeat: (beat: number, silentMeasure: boolean) => void,
  ) {}

  get running() {
    return this.timer !== null;
  }

  start() {
    if (this.timer !== null) return;
    const c = audio();
    this.next = c.currentTime + 0.08;
    this.beat = 0;
    this.measure = 0;
    this.timer = window.setInterval(() => this.tick(), 25);
    this.tick();
  }

  stop() {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    this.uiTimers.forEach((t) => window.clearTimeout(t));
    this.uiTimers = [];
    this.onBeat(-1, false);
  }

  private tick() {
    const c = audio();
    while (this.next < c.currentTime + 0.12) {
      const { bpm, beats, mode } = this.cfg;
      const spb = 60 / bpm;
      const silent = mode === "gap" && this.measure % 2 === 1;
      const beat = this.beat;
      const t = this.next;
      if (!silent) {
        if (mode === "all" || mode === "gap") click(t, beat === 0);
        else if (mode === "downbeat" && beat === 0) click(t, true);
        else if (mode === "offbeats") click(t + spb / 2, false);
      }
      const delay = Math.max(0, (t - c.currentTime) * 1000);
      this.uiTimers.push(window.setTimeout(() => this.onBeat(beat, silent), delay));
      if (this.uiTimers.length > 32) this.uiTimers.splice(0, 16);
      this.next += spb;
      this.beat = (this.beat + 1) % beats;
      if (this.beat === 0) this.measure++;
    }
  }
}

/* ───────── microfone: detecção de altura ───────── */

const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function noteName(midi: number) {
  return `${NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
}

/** Autocorrelação com refinamento parabólico. Devolve Hz ou null (silêncio/ruído). */
export function detectPitch(buf: Float32Array, sr: number): number | null {
  const n = buf.length;
  let rms = 0;
  for (let i = 0; i < n; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / n);
  if (rms < 0.01) return null;

  const minLag = Math.floor(sr / 1400);
  const maxLag = Math.min(n >> 1, Math.floor(sr / 70));
  const corr = new Float32Array(maxLag + 1);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0;
    for (let i = 0; i < n - lag; i++) s += buf[i] * buf[i + lag];
    corr[lag] = s;
  }
  // Primeiro pico forte (evita pegar a oitava de baixo)
  let best = -1;
  let bestVal = 0;
  for (let lag = minLag; lag <= maxLag; lag++) if (corr[lag] > bestVal) { bestVal = corr[lag]; best = lag; }
  if (best < 0) return null;
  for (let lag = minLag + 1; lag < maxLag; lag++) {
    if (corr[lag] > 0.9 * bestVal && corr[lag] >= corr[lag - 1] && corr[lag] >= corr[lag + 1]) { best = lag; break; }
  }
  const a = corr[best - 1] ?? corr[best];
  const b = corr[best];
  const c = corr[best + 1] ?? corr[best];
  const shift = (a - c) / (2 * (a - 2 * b + c) || 1);
  return sr / (best + (Number.isFinite(shift) ? shift : 0));
}

export type PitchReading = { midi: number; cents: number; freq: number } | null;

/** Liga o microfone e chama `onReading` ~20 vezes por segundo. Devolve a função de desligar. */
export async function listenPitch(onReading: (r: PitchReading) => void): Promise<() => void> {
  const c = audio();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });
  const src = c.createMediaStreamSource(stream);
  const an = c.createAnalyser();
  an.fftSize = 4096;
  src.connect(an);
  const buf = new Float32Array(an.fftSize);
  let smooth: number | null = null;
  const id = window.setInterval(() => {
    an.getFloatTimeDomainData(buf);
    const f = detectPitch(buf, c.sampleRate);
    if (!f) {
      smooth = null;
      onReading(null);
      return;
    }
    const m = 69 + 12 * Math.log2(f / 440);
    smooth = smooth === null || Math.abs(smooth - m) > 0.5 ? m : smooth * 0.6 + m * 0.4;
    const midi = Math.round(smooth);
    onReading({ midi, cents: Math.round((smooth - midi) * 100), freq: f });
  }, 50);
  return () => {
    window.clearInterval(id);
    src.disconnect();
    stream.getTracks().forEach((t) => t.stop());
  };
}

/* ───────── acordes e clique avulso ───────── */

/** Batida de acorde: notas em sequência rápida (para baixo = grave → aguda). */
export function strum(midis: number[], opts: { when?: number; down?: boolean; gain?: number; dur?: number } = {}) {
  const c = audio();
  const t = opts.when ?? c.currentTime;
  const ns = opts.down === false ? [...midis].reverse() : midis;
  const g = (opts.gain ?? 0.5) / Math.sqrt(Math.max(1, ns.length) / 2);
  ns.forEach((m, i) => pluck(m, { when: t + i * 0.015, gain: g, dur: opts.dur }));
}

/** Um clique de metrônomo num instante exato. */
export function tick(when: number, accent = false) {
  audio();
  click(when, accent);
}

/** Batida abafada (chuck / scratch): ruído curto filtrado. */
export function mutedStrum(when?: number, gain = 0.35) {
  const c = audio();
  const t = when ?? c.currentTime;
  const len = Math.floor(c.sampleRate * 0.06);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1800;
  bp.Q.value = 0.8;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(bp).connect(g).connect(master!);
  src.start(t);
}

/** Baixo: corda grave com ataque redondo. */
export function bass(midi: number, when: number, dur: number, gain = 0.6) {
  pluck(midi, { when, dur, gain });
}

/** Bateria sintetizada: bumbo, caixa, chimbal, aro (rim) e ganzá (shaker). */
export function drum(kind: "kick" | "snare" | "hat" | "rim" | "shaker", when: number, gain = 1) {
  const c = audio();
  const t = when;
  if (kind === "kick") {
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(0.9 * gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    o.connect(g).connect(master!);
    o.start(t);
    o.stop(t + 0.3);
    return;
  }
  const lenS = kind === "snare" ? 0.18 : kind === "shaker" ? 0.07 : kind === "rim" ? 0.03 : 0.04;
  const len = Math.floor(c.sampleRate * lenS);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = kind === "snare" ? "bandpass" : "highpass";
  f.frequency.value = kind === "snare" ? 1900 : kind === "rim" ? 2500 : 7000;
  const g = c.createGain();
  g.gain.value = (kind === "snare" ? 0.55 : kind === "rim" ? 0.5 : kind === "shaker" ? 0.18 : 0.22) * gain;
  src.connect(f).connect(g).connect(master!);
  src.start(t);
}

/** Drone contínuo numa classe de altura (0 = C). Devolve a função de parar. */
export function startDrone(pc: number): () => void {
  const c = audio();
  const t = c.currentTime;
  const out = c.createGain();
  out.gain.setValueAtTime(0.0001, t);
  out.gain.exponentialRampToValueAtTime(0.22, t + 0.6);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  lp.connect(out).connect(master!);
  const root = 36 + pc; // C2..B2
  const oscs = [root, root + 12, root + 19].map((m, i) => {
    const o = c.createOscillator();
    o.type = i === 0 ? "sawtooth" : "triangle";
    o.frequency.value = midiToFreq(m);
    o.detune.value = i === 1 ? 4 : 0;
    const g = c.createGain();
    g.gain.value = i === 0 ? 0.5 : 0.35;
    o.connect(g).connect(lp);
    o.start(t);
    return o;
  });
  return () => {
    const n = c.currentTime;
    out.gain.cancelScheduledValues(n);
    out.gain.setValueAtTime(out.gain.value, n);
    out.gain.exponentialRampToValueAtTime(0.0001, n + 0.3);
    oscs.forEach((o) => o.stop(n + 0.35));
  };
}
