// src/data/instruments.ts — instrumentos da Pauta. Só a guitarra tem curso por enquanto.

export type InstrumentId = "guitarra" | "violao" | "teclado" | "gaita" | "baixo" | "ukulele" | "bateria" | "canto";

export type Instrument = {
  id: InstrumentId;
  name: string;
  /** Uma linha sobre o curso. */
  tagline: string;
  available: boolean;
  /** Aberto, mas com poucas aulas ainda. */
  preview?: boolean;
};

export const INSTRUMENTS: Instrument[] = [
  { id: "guitarra", name: "Guitarra", tagline: "Do zero ao solo em 365 aulas", available: true },
  { id: "teclado", name: "Teclado", tagline: "Acordes, leitura e acompanhamento", available: true, preview: true },
  { id: "gaita", name: "Gaita", tagline: "Blues, bends e melodias", available: false },
  { id: "violao", name: "Violão", tagline: "Levadas e dedilhados", available: false },
  { id: "baixo", name: "Baixo", tagline: "Groove e linhas de baixo", available: false },
  { id: "ukulele", name: "Ukulele", tagline: "Primeiros acordes em dias", available: false },
  { id: "bateria", name: "Bateria", tagline: "Ritmo, coordenação e viradas", available: false },
  { id: "canto", name: "Canto", tagline: "Afinação, respiração e voz", available: false },
];

export const CURRENT_INSTRUMENT: InstrumentId = "guitarra";
