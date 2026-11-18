// Instrumento escolhido na página inicial. Fica só neste navegador.
import { useSyncExternalStore } from "react";
import { CURRENT_INSTRUMENT, INSTRUMENTS, type InstrumentId } from "../data/instruments";

const KEY = "pauta:instrument";
let selected: InstrumentId | null = null;
const listeners = new Set<() => void>();

function read(): InstrumentId {
  if (selected) return selected;
  try {
    const v = localStorage.getItem(KEY) as InstrumentId | null;
    selected = v && INSTRUMENTS.some((i) => i.id === v && i.available) ? v : CURRENT_INSTRUMENT;
  } catch {
    selected = CURRENT_INSTRUMENT;
  }
  return selected;
}

export function selectInstrument(id: InstrumentId) {
  selected = id;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* sem armazenamento */
  }
  listeners.forEach((l) => l());
}

export function useInstrument(): InstrumentId {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    read,
    () => CURRENT_INSTRUMENT,
  );
}
