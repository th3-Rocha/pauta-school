// Peças que se repetem nas aulas de canto (docs/curricula/voice.md, seção 10.1).
// Alturas em semitons a partir da nota-base do aluno: 1º grau = 0, 2º = 2, 3º = 4, 4º = 5, 5º = 7.
import type { Node } from "../types";

export const D = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 8: 12 } as const;

export const CHECK_BEFORE: Node = { w: "checkin", when: "before" };
export const CHECK_AFTER: Node = { w: "checkin", when: "after" };

/** Aquecimento de 3 minutos, sempre no começo do laboratório. */
export const WARMUP: Node = {
  w: "warmup",
  items: [
    { id: "straw", seconds: 60, title: "Canudo: sopre com som, deslizando devagar" },
    { id: "lip-trill", seconds: 60 },
    { id: "hum", seconds: 60 },
  ],
};

/** Desaquecimento de 2 minutos, sempre no fim do laboratório. */
export const COOLDOWN: Node = {
  w: "warmup",
  variant: "cooldown",
  items: [
    { id: "slide-down", seconds: 60 },
    { id: "hum", seconds: 60 },
  ],
};

export const PAUSE: Node = { callout: "tip", label: "Pausa de voz", text: "**1 minuto de silêncio e um gole de água.** A pausa faz parte do treino: é nela que a voz descansa." };

export const STRAW_TIP: Node = {
  callout: "tip",
  label: "Sem canudo?",
  text: "Use o mais fino que tiver (tipo mexedor de café). Sem nenhum, faça o mesmo exercício com os lábios vibrando (\"brrr\") ou com \"hum\" de boca fechada.",
};

export const NO_PAIN: Node = {
  callout: "warning",
  label: "Regra da Pauta",
  text: "Cantar **nunca dói**. Se arder, apertar ou doer, pare e descanse. Volume de conversa basta para tudo neste mês.",
};
