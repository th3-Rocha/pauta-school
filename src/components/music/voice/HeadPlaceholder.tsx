// src/components/music/voice/HeadPlaceholder.tsx
// Substituto em SVG da cabeça do Chimera, só para a vitrine e para avaliar o
// layout sem o motor: perfil em linhas azuis no preto, boca que abre com o
// volume e brilho âmbar quando canta. No app, o ChimeraStage recebe a cabeça
// de verdade (AnatomyView3D ou AnatomyView) como filho.
import * as React from "react";
import { cn } from "../../../lib/cn";
import { bodyWeights, type VoiceBody } from "../../../lib/voice";

export type HeadPlaceholderProps = {
  singing?: boolean;
  /** 0..1: abre a boca e acende o âmbar. */
  level?: number;
  /** Muda o tamanho do desenho (criança menor), como a cabeça real muda ao arrastar o triângulo. */
  body?: VoiceBody;
  /** Olhos fechados e coraçõezinhos (o carinho do Chimera). */
  petted?: boolean;
  /** Corte 2D (mostra o tubo por dentro) ou perfil simples. */
  variant?: "profile" | "cut";
  className?: string;
};

export function HeadPlaceholder({ singing = false, level = 0, body = { female: 0, child: 0 }, petted = false, variant = "cut", className }: HeadPlaceholderProps) {
  const w = bodyWeights(body);
  const scale = 1 - 0.18 * w.child - 0.05 * w.female;
  const open = singing ? 3 + level * 9 : 1.5;
  const lv = singing ? 0.35 + level * 0.65 : 0;
  return (
    <svg viewBox="0 0 200 220" className={cn("h-full w-full", className)} aria-hidden>
      <g transform={`translate(${100 - 100 * scale} ${118 - 118 * scale}) scale(${scale})`} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 2.5px var(--stage-glow))" }}>
        {/* crânio, testa, nariz, boca, queixo, pescoço (perfil para a direita) */}
        <path
          d={`M58 120 C40 96 42 52 78 34 C110 18 146 28 156 58 C160 70 160 78 158 86 L170 104 C172 108 168 110 164 110 L162 116 C164 118 164 121 160 122 L160 ${124 + open / 2} C162 ${128 + open} 158 ${134 + open} 150 136 L148 146 C146 154 136 156 126 154 L122 186`}
          stroke="var(--stage-body)"
          strokeWidth={1.6}
        />
        <path d="M58 120 C58 140 70 156 84 166 L86 186" stroke="var(--stage-body)" strokeWidth={1.6} />
        {/* boca: abre com o volume */}
        <path d={`M160 ${124} L148 ${124}`} stroke="var(--stage-body)" strokeWidth={1.2} />
        <path d={`M160 ${124 + open} L148 ${124 + open * 0.8}`} stroke="var(--stage-body)" strokeWidth={1.2} />
        {/* olho */}
        {petted ? (
          <path d="M132 70 q5 4 10 0" stroke="var(--stage-body)" strokeWidth={1.4} />
        ) : (
          <path d="M132 70 q5 -4 10 0 q-5 4 -10 0" stroke="var(--stage-body)" strokeWidth={1.2} />
        )}
        <path d="M128 60 q8 -5 16 -2" stroke="var(--stage-body-dim)" strokeWidth={1.2} />
        {variant === "cut" && (
          <>
            {/* cavidade nasal, palato mole (véu), língua, faringe, laringe */}
            <path d="M150 92 C134 88 116 90 104 98" stroke="var(--stage-body-dim)" strokeWidth={1.2} />
            <path d="M104 98 C96 102 94 110 98 116" stroke="var(--stage-body)" strokeWidth={1.4} />
            <path d={`M146 ${126 + open * 0.5} C134 ${114 + open * 0.3} 112 ${110 + open * 0.4} 104 ${128 + open * 0.2} C100 138 102 146 106 150`} stroke="var(--stage-body)" strokeWidth={1.6} />
            <path d="M98 116 C92 132 92 150 96 172" stroke="var(--stage-body-dim)" strokeWidth={1.2} />
            <path d="M106 150 C108 160 108 168 106 176" stroke="var(--stage-body-dim)" strokeWidth={1.2} />
            <path d="M96 168 L106 168" stroke="var(--stage-body)" strokeWidth={1.6} />
            {/* o som: tubo aceso em âmbar quando canta */}
            {singing && (
              <path
                d={`M101 168 C98 150 98 132 104 120 C112 112 134 116 152 ${124 + open / 2}`}
                stroke="var(--stage-sound)"
                strokeWidth={1 + lv * 2}
                opacity={lv}
                style={{ filter: "drop-shadow(0 0 4px var(--stage-sound-glow))" }}
              />
            )}
          </>
        )}
        {/* ondas de som saindo da boca */}
        {singing &&
          [0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${172 + i * 8} ${112 + open / 2 - 8 - i * 4} q${6 + i * 2} ${10 + i * 4} 0 ${20 + i * 8}`}
              stroke="var(--stage-sound)"
              strokeWidth={1.4}
              opacity={lv * (1 - i * 0.28)}
              style={{ filter: "drop-shadow(0 0 4px var(--stage-sound-glow))" }}
            />
          ))}
      </g>
      {petted &&
        [0, 1, 2].map((i) => (
          <path
            key={i}
            d="M0 3 C-4 -1 -2 -6 0 -3 C2 -6 4 -1 0 3 Z"
            transform={`translate(${118 + i * 14} ${36 - i * 8}) scale(${1.6 - i * 0.2})`}
            fill="none"
            stroke="var(--stage-sound)"
            strokeWidth={0.8}
            style={{ filter: "drop-shadow(0 0 3px var(--stage-sound-glow))" }}
          />
        ))}
    </svg>
  );
}
