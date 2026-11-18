// Progresso do aluno: salvo no localStorage e exportável como código hexadecimal.
//
// Formato do código (v1), 61 bytes = 122 caracteres hex:
//   byte 0        versão (0x01)
//   bytes 1–46    aulas concluídas, 1 bit por dia (dia 1 = bit 0 do byte 1)
//   bytes 47–58   melhor BPM no desafio de cada mês (0 = ainda não tentou)
//   bytes 59–60   CRC-16/CCITT dos bytes 0–58, para detectar código colado errado
//
// O que não vai no código (blocos marcados, checklists) é detalhe do dia e
// fica só neste navegador.

import { useSyncExternalStore } from "react";
import { TOTAL_DAYS } from "../data/curriculum";

export type Progress = {
  completed: number[];
  /** dia → blocos marcados (índices 0–3) */
  blocks: Record<number, number[]>;
  /** dia → itens do checklist marcados */
  checks: Record<number, string[]>;
  /** mês → melhor BPM no desafio */
  bestBpm: Record<number, number>;
};

const KEY = "trastes:progress:v1";
const VERSION = 1;
const BITSET_BYTES = Math.ceil(TOTAL_DAYS / 8); // 46
const CODE_BYTES = 1 + BITSET_BYTES + 12 + 2; // 61

const EMPTY: Progress = { completed: [], blocks: {}, checks: {}, bestBpm: {} };

/* ───────── armazenamento ───────── */

let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

function write(next: Progress) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* modo privado ou armazenamento cheio: segue só em memória */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function update(fn: (p: Progress) => Progress) {
  write(fn(read()));
}

/* ───────── derivados ───────── */

/** Dia atual = o primeiro dia ainda não concluído. */
export function currentDay(p: Progress): number {
  const done = new Set(p.completed);
  for (let d = 1; d <= TOTAL_DAYS; d++) if (!done.has(d)) return d;
  return TOTAL_DAYS;
}

/* ───────── ações ───────── */

export function setBlockDone(day: number, index: number, done: boolean) {
  update((p) => {
    const cur = new Set(p.blocks[day] ?? []);
    done ? cur.add(index) : cur.delete(index);
    return { ...p, blocks: { ...p.blocks, [day]: [...cur].sort() } };
  });
}

export function setChecks(day: number, ids: string[]) {
  update((p) => ({ ...p, checks: { ...p.checks, [day]: ids } }));
}

export function completeDay(day: number) {
  update((p) => (p.completed.includes(day) ? p : { ...p, completed: [...p.completed, day].sort((a, b) => a - b) }));
}

/* ───────── código hexadecimal ───────── */

function crc16(bytes: Uint8Array): number {
  let crc = 0xffff;
  for (const b of bytes) {
    crc ^= b << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc;
}

export function encodeProgress(p: Progress): string {
  const bytes = new Uint8Array(CODE_BYTES);
  bytes[0] = VERSION;
  for (const d of p.completed) {
    if (d < 1 || d > TOTAL_DAYS) continue;
    const bit = d - 1;
    bytes[1 + (bit >> 3)] |= 1 << (bit & 7);
  }
  for (let m = 1; m <= 12; m++) bytes[BITSET_BYTES + m] = Math.min(255, Math.max(0, p.bestBpm[m] ?? 0));
  const crc = crc16(bytes.subarray(0, CODE_BYTES - 2));
  bytes[CODE_BYTES - 2] = crc >> 8;
  bytes[CODE_BYTES - 1] = crc & 0xff;
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function decodeProgress(hex: string): Pick<Progress, "completed" | "bestBpm"> | null {
  const clean = hex.replace(/[\s-]+/g, "").toLowerCase();
  if (clean.length !== CODE_BYTES * 2 || !/^[0-9a-f]+$/.test(clean)) return null;
  const bytes = new Uint8Array(CODE_BYTES);
  for (let i = 0; i < CODE_BYTES; i++) bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  if (bytes[0] !== VERSION) return null;
  const crc = crc16(bytes.subarray(0, CODE_BYTES - 2));
  if (bytes[CODE_BYTES - 2] !== crc >> 8 || bytes[CODE_BYTES - 1] !== (crc & 0xff)) return null;
  const completed: number[] = [];
  for (let bit = 0; bit < TOTAL_DAYS; bit++) if (bytes[1 + (bit >> 3)] & (1 << (bit & 7))) completed.push(bit + 1);
  const bestBpm: Record<number, number> = {};
  for (let m = 1; m <= 12; m++) if (bytes[BITSET_BYTES + m]) bestBpm[m] = bytes[BITSET_BYTES + m];
  return { completed, bestBpm };
}

export function importProgress(hex: string): boolean {
  const data = decodeProgress(hex);
  if (!data) return false;
  write({ ...EMPTY, ...data });
  return true;
}
