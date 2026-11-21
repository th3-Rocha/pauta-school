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
    { id: "straw", seconds: 60, title: "Canudo (ou \"hum\"): cante dentro dele, deslizando devagar" },
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
  label: "Precisa de canudo de verdade?",
  text: [
    "**Não é obrigatório.** O canudo ajuda porque deixa só um buraquinho para o ar sair, e isso alivia as pregas vocais. Se tiver um em casa, use o mais fino (tipo mexedor de café) e cante dentro dele, com a boca fechada em volta.",
    "**Sem canudo**, faça o mesmo exercício com os lábios vibrando (\"brrr\") ou com \"hum\" de boca fechada: o efeito é parecido. Toque em **Ver o Chimera** para ver cada um.",
  ],
};

/** Como fazer o "brrr" (lip trill): quem nunca fez costuma abrir e fechar a boca com força. */
export const TRILL_HOW: Node = {
  callout: "tip",
  label: "Como fazer o \"brrr\" (lábios vibrando)",
  text: [
    "**Não é você que abre e fecha a boca.** Os lábios ficam **soltos, encostados de leve**, e quem faz eles baterem é o **ar**: você sopra, e o ar passa empurrando os lábios, que tremem sozinhos, muito rápido. É o barulho de motorzinho que criança faz brincando de carro.",
    "Passo a passo: (1) relaxe a boca e o rosto; (2) feche os lábios de leve, sem apertar; (3) **sopre só ar**, sem voz, até os lábios tremerem; (4) quando tremerem, junte um \"hum\" baixinho por baixo do sopro.",
    "Não saiu? Apoie dois dedos nas bochechas, perto dos cantos da boca, e empurre de leve para cima: isso solta os lábios. E sopre **menos** ar, não mais. Ainda difícil? Procure **\"lip trill\"** no YouTube para ver alguém fazendo. Enquanto não sai, use o \"hum\": ele dá o mesmo efeito.",
  ],
};

export const NO_PAIN: Node = {
  callout: "warning",
  label: "Regra da Pauta",
  text: "Cantar **nunca dói**. Se arder, apertar ou doer, pare e descanse. Volume de conversa basta para tudo neste mês.",
};
