// O que o curso de canto guarda e escuta: o perfil de voz do aluno (corpo do
// Chimera + nota-base), o microfone (nota, cents, volume) e o Chimera cantando
// sequências de notas.
import * as React from "react";
import { audio, detectPitch } from "./audio";
import { loadChimera, type ChimeraModules } from "../components/music/voice/ChimeraLive";
import { BODY_PRESETS, defaultF0, hzToMidi, VOWELS_PT, type VoiceBody, type VoiceRange, type VoiceReading, type VowelId } from "../lib/voice";

/* ── Perfil de voz ─────────────────────────────────────────────────────── */

export type VoiceProfile = {
  body: VoiceBody;
  /** Nota-base: a nota confortável perto da fala (MIDI inteiro). Os exercícios partem dela. */
  home: number;
  /** Quando a nota-base foi medida pela fala (e não estimada pelo corpo). */
  measured?: boolean;
  range?: VoiceRange;
};

const KEY = "pauta:voice";

/** Nota-base estimada pelo corpo: a fala média + 2 semitons. */
export const homeFromBody = (b: VoiceBody) => Math.round(hzToMidi(defaultF0(b))) + 2;

const DEFAULT: VoiceProfile = { body: BODY_PRESETS.male, home: homeFromBody(BODY_PRESETS.male) };

let profile: VoiceProfile | null = null;
const listeners = new Set<() => void>();

function read(): VoiceProfile {
  if (profile) return profile;
  try {
    const raw = localStorage.getItem(KEY);
    profile = raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    profile = DEFAULT;
  }
  return profile!;
}

export function hasVoiceProfile(): boolean {
  try {
    return !!localStorage.getItem(KEY);
  } catch {
    return false;
  }
}

export function setVoiceProfile(p: Partial<VoiceProfile>) {
  profile = { ...read(), ...p };
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    /* sem armazenamento: vale só nesta página */
  }
  listeners.forEach((l) => l());
}

export function useVoiceProfile(): VoiceProfile {
  return React.useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => DEFAULT,
  );
}

/* ── Microfone ─────────────────────────────────────────────────────────── */

export type MicFrame = { reading: VoiceReading; level: number };

/** Liga o microfone (~25 leituras/s). Devolve a função de desligar. */
export async function listenVoice(on: (f: MicFrame) => void): Promise<() => void> {
  const c = audio();
  if (c.state === "suspended") await c.resume();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false },
  });
  const src = c.createMediaStreamSource(stream);
  const an = c.createAnalyser();
  an.fftSize = 4096;
  src.connect(an);
  const buf = new Float32Array(an.fftSize);
  let smooth: number | null = null;
  const id = window.setInterval(() => {
    an.getFloatTimeDomainData(buf);
    let rms = 0;
    for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / buf.length);
    const level = Math.min(1, rms * 8);
    const f = detectPitch(buf, c.sampleRate);
    if (!f || f < 60 || f > 1400) {
      smooth = null;
      on({ reading: null, level });
      return;
    }
    const m = hzToMidi(f);
    smooth = smooth === null || Math.abs(smooth - m) > 0.6 ? m : smooth * 0.55 + m * 0.45;
    const midi = Math.round(smooth);
    on({ reading: { hz: f, midi: smooth, cents: Math.round((smooth - midi) * 100), level, clarity: 1 }, level });
  }, 40);
  return () => {
    window.clearInterval(id);
    src.disconnect();
    stream.getTracks().forEach((t) => t.stop());
  };
}

/** Microfone ligado enquanto `active`; erro de permissão em `error`. */
export function useMic(active: boolean, onFrame?: (f: MicFrame) => void): { frame: MicFrame; error: string | null } {
  const [frame, setFrame] = React.useState<MicFrame>({ reading: null, level: 0 });
  const [error, setError] = React.useState<string | null>(null);
  const cb = React.useRef(onFrame);
  cb.current = onFrame;
  React.useEffect(() => {
    if (!active) {
      setFrame({ reading: null, level: 0 });
      return;
    }
    let stop: (() => void) | null = null;
    let alive = true;
    setError(null);
    listenVoice((f) => {
      if (!alive) return;
      setFrame(f);
      cb.current?.(f);
    }).then(
      (s) => (alive ? (stop = s) : s()),
      (e) => alive && setError(e instanceof Error ? e.message : String(e)),
    );
    return () => {
      alive = false;
      stop?.();
    };
  }, [active]);
  return { frame, error };
}

/* ── O Chimera cantando ────────────────────────────────────────────────── */

export type SungNote = { midi: number; seconds: number; vowel?: VowelId; syllable?: string };

let current: { cancel: () => void } | null = null;

/** Liga o motor (precisa de um clique do aluno) e aplica o corpo do perfil. */
export async function readyChimera(): Promise<ChimeraModules> {
  const m = await loadChimera();
  const st = m.useStore.getState();
  const body = read().body;
  if (st.body.female !== body.female || st.body.child !== body.child) st.setBody(body);
  if (!st.started) await st.start();
  if (st.mode !== "play") st.setMode("play");
  return m;
}

export function setVowel(m: ChimeraModules, vowel: VowelId) {
  const st = m.useStore.getState();
  const ipa = VOWELS_PT.find((v) => v.id === vowel)?.ipa ?? "a";
  const model = m.getModel(st.body, st.started ? m.engine.sampleRate : 48000);
  const v = model.vowels.find((x) => x.ipa === ipa);
  if (v) st.setArtic(v.artic);
}

/**
 * O Chimera canta as notas em sequência. `onNote(i)` avisa a nota que começou
 * (-1 no fim). Uma chamada nova cancela a anterior.
 */
export async function chimeraSing(notes: SungNote[], opts: { onNote?: (i: number) => void; source?: Record<string, number>; gap?: number } = {}): Promise<void> {
  current?.cancel();
  const m = await readyChimera();
  const st = m.useStore.getState();
  const before = { ...st.source };
  if (opts.source) st.setSource(opts.source);
  let cancelled = false;
  let held: number | null = null;
  const timers: number[] = [];
  const done = new Promise<void>((resolve) => {
    const finish = () => {
      if (held !== null) m.useStore.getState().noteOff(held);
      held = null;
      if (opts.source) m.useStore.getState().setSource(before);
      opts.onNote?.(-1);
      resolve();
    };
    current = {
      cancel: () => {
        if (cancelled) return;
        cancelled = true;
        timers.forEach(clearTimeout);
        finish();
      },
    };
    let t = 0;
    notes.forEach((n, i) => {
      timers.push(
        window.setTimeout(() => {
          const s = m.useStore.getState();
          if (n.vowel) setVowel(m, n.vowel);
          if (held !== null) s.noteOff(held);
          s.noteOn(n.midi);
          held = n.midi;
          opts.onNote?.(i);
        }, t * 1000),
      );
      t += n.seconds;
      if (opts.gap) {
        timers.push(
          window.setTimeout(() => {
            if (held !== null) m.useStore.getState().noteOff(held);
            held = null;
          }, (t - opts.gap) * 1000),
        );
      }
    });
    timers.push(
      window.setTimeout(() => {
        if (!cancelled) {
          cancelled = true;
          finish();
        }
      }, t * 1000),
    );
  });
  return done;
}

export function stopChimera() {
  current?.cancel();
}
