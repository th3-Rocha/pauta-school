// src/data/instruments.ts — instrumentos da Pauta. Só a guitarra tem curso por enquanto.

export type InstrumentId = "guitar" | "acoustic-guitar" | "keyboard" | "harmonica" | "bass" | "ukulele" | "drums" | "voice";

export type Instrument = {
  id: InstrumentId;
  name: string;
  /** Uma linha sobre o curso. */
  tagline: string;
  available: boolean;
  /** Aberto, mas com poucas aulas ainda. */
  preview?: boolean;
  /** Nome e frase em inglês. */
  en: [string, string];
};

export const INSTRUMENTS: Instrument[] = [
  { id: "guitar", name: "Guitarra", tagline: "Do zero ao solo em 365 aulas", available: true, en: ["Guitar", "From zero to soloing in 365 lessons"] },
  { id: "keyboard", name: "Teclado", tagline: "Acordes, leitura e acompanhamento", available: true, preview: true, en: ["Keyboard", "Chords, reading and accompaniment"] },
  { id: "harmonica", name: "Gaita", tagline: "Blues, bends e melodias", available: false, en: ["Harmonica", "Blues, bends and melodies"] },
  { id: "acoustic-guitar", name: "Violão", tagline: "Levadas e dedilhados", available: false, en: ["Acoustic guitar", "Strumming and fingerpicking"] },
  { id: "bass", name: "Baixo", tagline: "Groove e linhas de baixo", available: false, en: ["Bass", "Groove and bass lines"] },
  { id: "ukulele", name: "Ukulele", tagline: "Primeiros acordes em dias", available: false, en: ["Ukulele", "First chords in days"] },
  { id: "drums", name: "Bateria", tagline: "Ritmo, coordenação e viradas", available: false, en: ["Drums", "Rhythm, coordination and fills"] },
  { id: "voice", name: "Canto", tagline: "Afinação, respiração e voz", available: false, en: ["Voice", "Pitch, breathing and tone"] },
];

export const CURRENT_INSTRUMENT: InstrumentId = "guitar";

/** Lista com nome e frase no idioma pedido. */
export function instrumentsIn(locale: "pt" | "en"): Instrument[] {
  return locale === "en" ? INSTRUMENTS.map((i) => ({ ...i, name: i.en[0], tagline: i.en[1] })) : INSTRUMENTS;
}
