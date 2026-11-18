// Som de piano gerado no navegador: algumas parciais com decaimento, sem amostras.
// noteOn/noteOff respeitam o pedal de sustentação.
import { audio, midiToFreq } from "./audio";

type Voice = { gain: GainNode; oscs: OscillatorNode[]; released: boolean };

const voices = new Map<number, Voice>();
let pedalDown = false;
const sustained = new Set<number>();

// Parciais de um piano simples: fundamental forte, harmônicos caindo rápido.
const PARTIALS = [
  { mult: 1, amp: 1, type: "triangle" as OscillatorType },
  { mult: 2, amp: 0.32, type: "sine" as OscillatorType },
  { mult: 3, amp: 0.12, type: "sine" as OscillatorType },
  { mult: 4.01, amp: 0.06, type: "sine" as OscillatorType },
];

function out(): AudioNode {
  return (audio() as AudioContext & { _pautaPiano?: GainNode })._pautaPiano ?? makeBus();
}

function makeBus(): GainNode {
  const c = audio() as AudioContext & { _pautaPiano?: GainNode };
  const bus = c.createGain();
  bus.gain.value = 0.5;
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 3;
  bus.connect(comp).connect(c.destination);
  c._pautaPiano = bus;
  return bus;
}

/** Liga uma nota. `velocity` de 1 a 127 (padrão 90). */
export function noteOn(midi: number, velocity = 90) {
  stop(midi, 0.03);
  const c = audio();
  const t = c.currentTime;
  const f = midiToFreq(midi);
  const v = Math.max(0.05, Math.min(1, velocity / 127));
  const peak = 0.28 * v * v + 0.05;
  // Graves soam mais tempo que agudos.
  const decay = Math.max(1.2, 6 - (midi - 36) * 0.07);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.008);
  gain.gain.exponentialRampToValueAtTime(peak * 0.35, t + 0.25);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = Math.min(12000, f * (4 + v * 10));
  lp.connect(gain).connect(out());
  const oscs = PARTIALS.map((p) => {
    const o = c.createOscillator();
    o.type = p.type;
    o.frequency.value = f * p.mult;
    const g = c.createGain();
    g.gain.value = p.amp;
    o.connect(g).connect(lp);
    o.start(t);
    o.stop(t + decay + 0.1);
    return o;
  });
  voices.set(midi, { gain, oscs, released: false });
  sustained.delete(midi);
}

function stop(midi: number, fade: number) {
  const v = voices.get(midi);
  if (!v) return;
  const t = audio().currentTime;
  v.gain.gain.cancelScheduledValues(t);
  v.gain.gain.setValueAtTime(Math.max(0.0001, v.gain.gain.value), t);
  v.gain.gain.exponentialRampToValueAtTime(0.0001, t + fade);
  v.oscs.forEach((o) => {
    try {
      o.stop(t + fade + 0.02);
    } catch {
      /* já parou */
    }
  });
  voices.delete(midi);
}

/** Solta a nota. Com o pedal pisado, ela continua soando até soltar o pedal. */
export function noteOff(midi: number) {
  if (pedalDown) {
    sustained.add(midi);
    return;
  }
  stop(midi, 0.18);
}

export function setPedal(down: boolean) {
  pedalDown = down;
  if (!down) {
    sustained.forEach((m) => stop(m, 0.25));
    sustained.clear();
  }
}

/** Toca uma nota com duração fixa (exemplos, treino de ouvido). */
export function playKey(midi: number, seconds = 0.8, velocity = 90) {
  noteOn(midi, velocity);
  window.setTimeout(() => {
    if (!sustained.has(midi)) stop(midi, 0.2);
  }, seconds * 1000);
}

/** Toca uma sequência de notas, uma por `beat` segundos. */
export function playSequence(midis: number[], beat = 0.5) {
  midis.forEach((m, i) => window.setTimeout(() => playKey(m, beat * 0.95), i * beat * 1000));
}
