// Entrada do teclado: MIDI (Web MIDI), teclado do computador e toque na tela.
// Um só estado para a página inteira, para que todos os exercícios ouçam as
// mesmas notas. O som do site toca em cada nota (dá para desligar no MIDI,
// caso o teclado já tenha alto-falante).
import { useSyncExternalStore } from "react";
import { MIDDLE_C, computerKeyMap, noteName } from "../lib/piano";
import type { InputSource, MidiState } from "../components/music/keyboard/MidiStatus";
import { noteOff, noteOn, setPedal } from "./piano-audio";

export type NoteEvent = { midi: number; velocity: number; on: boolean; source: InputSource };

export type KeyInputState = {
  pressed: number[];
  pedal: boolean;
  midiState: MidiState;
  deviceName?: string;
  /** Muda a cada nota recebida. */
  activity: number;
  lastNote?: string;
  lastVelocity?: number;
  lastSource?: InputSource;
  /** Toca o som do site também nas notas vindas do MIDI. */
  midiEcho: boolean;
  /** Exercício que está ouvindo o teclado agora (só um por vez). */
  activeExercise: string | null;
};

const ECHO_KEY = "pauta:midi-echo";

let state: KeyInputState = {
  pressed: [],
  pedal: false,
  midiState: "prompt",
  activity: 0,
  midiEcho: true,
  activeExercise: null,
};
const listeners = new Set<() => void>();
const noteListeners = new Set<(e: NoteEvent) => void>();

function set(patch: Partial<KeyInputState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

/* ───────── notas ───────── */

export function press(midi: number, velocity = 90, source: InputSource = "screen") {
  if (source !== "midi" || state.midiEcho) noteOn(midi, velocity);
  set({
    pressed: state.pressed.includes(midi) ? state.pressed : [...state.pressed, midi],
    activity: state.activity + 1,
    lastNote: noteName(midi, "solfege", "sharp", true),
    lastVelocity: velocity,
    lastSource: source,
  });
  noteListeners.forEach((l) => l({ midi, velocity, on: true, source }));
}

export function release(midi: number, source: InputSource = "screen") {
  noteOff(midi);
  set({ pressed: state.pressed.filter((m) => m !== midi) });
  noteListeners.forEach((l) => l({ midi, velocity: 0, on: false, source }));
}

export function setSustain(down: boolean) {
  setPedal(down);
  set({ pedal: down });
}

export function setMidiEcho(on: boolean) {
  try {
    localStorage.setItem(ECHO_KEY, on ? "1" : "0");
  } catch {
    /* sem armazenamento */
  }
  set({ midiEcho: on });
}

/** Liga um exercício para ouvir o teclado; os outros param de ouvir. */
export function activateExercise(id: string) {
  if (state.activeExercise !== id) set({ activeExercise: id });
}

/** Avisa a cada nota ligada ou desligada. Devolve a função para parar de ouvir. */
export function onNote(fn: (e: NoteEvent) => void): () => void {
  noteListeners.add(fn);
  return () => {
    noteListeners.delete(fn);
  };
}

/* ───────── MIDI ───────── */

let access: MIDIAccess | null = null;

function handleMessage(e: MIDIMessageEvent) {
  if (!e.data) return;
  const [status, d1, d2] = e.data;
  const cmd = status & 0xf0;
  if (cmd === 0x90 && d2 > 0) press(d1, d2, "midi");
  else if (cmd === 0x80 || (cmd === 0x90 && d2 === 0)) release(d1, "midi");
  else if (cmd === 0xb0 && d1 === 64) setSustain(d2 >= 64);
}

function attach() {
  if (!access) return;
  const names: string[] = [];
  access.inputs.forEach((input) => {
    input.onmidimessage = handleMessage;
    if (input.name) names.push(input.name);
  });
  set({ midiState: names.length ? "connected" : "no-device", deviceName: names.join(", ") || undefined });
}

export async function connectMidi() {
  if (!("requestMIDIAccess" in navigator)) {
    set({ midiState: "unsupported" });
    return;
  }
  try {
    const a = await navigator.requestMIDIAccess();
    access = a;
    a.onstatechange = attach;
    attach();
  } catch {
    set({ midiState: "denied" });
  }
}

/* ───────── teclado do computador ───────── */

const KEYMAP = computerKeyMap(MIDDLE_C);
const held = new Set<string>();

function keyFromEvent(e: KeyboardEvent): string {
  if (e.code === "Semicolon") return "Ç";
  return e.key.length === 1 ? e.key.toUpperCase() : e.key;
}

function typing(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
}

/** Espaço = pedal, menos quando o foco está num botão ou campo (aí o Espaço é do navegador). */
function spaceIsPedal(e: KeyboardEvent) {
  if (e.code !== "Space" || typing(e)) return false;
  const t = e.target as HTMLElement | null;
  return !t || !t.closest("button, a, [role=button], [role=radio], [role=checkbox], select");
}

function onKeyDown(e: KeyboardEvent) {
  if (spaceIsPedal(e)) {
    e.preventDefault();
    if (!e.repeat && !state.pedal) setSustain(true);
    return;
  }
  if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || typing(e)) return;
  const k = keyFromEvent(e);
  const midi = KEYMAP.get(k);
  if (midi === undefined) return;
  e.preventDefault();
  held.add(k);
  press(midi, 90, "computer");
}

function onKeyUp(e: KeyboardEvent) {
  if (e.code === "Space" && state.pedal) {
    setSustain(false);
    return;
  }
  const k = keyFromEvent(e);
  if (!held.has(k)) return;
  held.delete(k);
  const midi = KEYMAP.get(k);
  if (midi !== undefined) release(midi, "computer");
}

/* ───────── início ───────── */

let started = false;

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  try {
    const echo = localStorage.getItem(ECHO_KEY);
    if (echo !== null) state = { ...state, midiEcho: echo === "1" };
  } catch {
    /* sem armazenamento */
  }
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", () => {
    held.forEach((k) => {
      const m = KEYMAP.get(k);
      if (m !== undefined) release(m, "computer");
    });
    held.clear();
  });
  if (!("requestMIDIAccess" in navigator)) {
    state = { ...state, midiState: "unsupported" };
    return;
  }
  // Se o navegador já deu permissão antes, conecta sem perguntar.
  navigator.permissions
    ?.query({ name: "midi" as PermissionName })
    .then((p) => {
      if (p.state === "granted") void connectMidi();
      else if (p.state === "denied") set({ midiState: "denied" });
    })
    .catch(() => {});
}

function subscribe(l: () => void) {
  start();
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

const SERVER: KeyInputState = { ...state };

export function useKeyInput(): KeyInputState {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}
