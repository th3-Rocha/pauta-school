// src/components/music/markers.tsx
// Desenho compartilhado das bolinhas de nota (braço, teclado, diagramas, legenda).
// Cor nunca é o único sinal: cada tipo também tem forma (anel tracejado, hachura,
// contorno vazado) e rótulo (grau, nome da nota ou dedo).
import * as React from "react";
import { cn } from "../../lib/cn";

export type MarkerKind =
  | "root"
  | "deg-3"
  | "deg-5"
  | "deg-7"
  | "ext"
  | "in"
  | "tension"
  | "out"
  | "ghost"
  | "active";

export const MARKER_FILL: Record<MarkerKind, string> = {
  root: "var(--deg-root)",
  "deg-3": "var(--deg-3)",
  "deg-5": "var(--deg-5)",
  "deg-7": "var(--deg-7)",
  ext: "var(--deg-ext)",
  in: "var(--note-in)",
  tension: "var(--note-tension)",
  out: "none",
  ghost: "none",
  active: "var(--note-active)",
};

/** Ordem da legenda padrão. */
export const MARKER_KINDS: MarkerKind[] = ["root", "deg-3", "deg-5", "deg-7", "ext", "in", "tension", "out", "ghost", "active"];

/**
 * Onde a bolinha é desenhada. Define a cor dos traços claros (anel da tônica,
 * contorno vazado, rótulo das vazadas) e o "furo" das vazadas.
 * - `wood`: braço da guitarra (madrepérola sobre jacarandá)
 * - `page`: interface (cor do texto sobre surface)
 * - `key-white`: tecla de marfim (serigrafia escura)
 * - `key-black`: tecla de ébano (traço em marfim)
 */
export type MarkerSurface = "wood" | "page" | "key-white" | "key-black";

const SURFACE_LIGHT: Record<MarkerSurface, string> = {
  wood: "var(--pearl)",
  page: "var(--fg)",
  "key-white": "var(--key-ink)",
  "key-black": "var(--key-white)",
};

const SURFACE_HOLE: Record<MarkerSurface, string> = {
  wood: "var(--wood)",
  page: "var(--surface)",
  "key-white": "var(--key-white)",
  "key-black": "var(--key-black)",
};

export type MarkerGlyphProps = {
  kind: MarkerKind;
  cx: number;
  cy: number;
  r?: number;
  label?: string;
  /** Sobre a madeira os traços claros usam madrepérola; na página, a cor do texto; no teclado, a serigrafia ou o marfim. */
  surface?: MarkerSurface;
  /** id do <pattern> de hachura (veja MarkerDefs). */
  hatchId?: string;
  className?: string;
  animate?: boolean;
};

/** Defs SVG necessárias para `tension`. Coloque uma vez dentro do <svg>. */
export function MarkerDefs({ hatchId }: { hatchId: string }) {
  return (
    <defs>
      <pattern id={hatchId} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="5" height="5" fill="var(--note-tension)" />
        <line x1="0" y1="0" x2="0" y2="5" stroke="var(--marker-ring)" strokeWidth="1.6" strokeOpacity="0.45" />
      </pattern>
    </defs>
  );
}

export function MarkerGlyph({ kind, cx, cy, r = 15, label, surface = "wood", hatchId, className, animate = true }: MarkerGlyphProps) {
  const light = SURFACE_LIGHT[surface];
  const hollow = kind === "out" || kind === "ghost";
  const fill = kind === "tension" && hatchId ? `url(#${hatchId})` : MARKER_FILL[kind];
  const textFill = hollow ? light : "var(--on-deg)";
  const fontSize = label && label.length > 2 ? r * 0.72 : r * 0.86;
  return (
    <g
      className={cn(animate && "animate-pluck", className)}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
      opacity={kind === "ghost" ? 0.7 : 1}
    >
      {kind === "active" && (
        <circle
          cx={cx}
          cy={cy}
          r={r + 3}
          fill="none"
          stroke="var(--note-active)"
          strokeWidth={2}
          className="animate-pulse-ring"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      )}
      {kind === "root" && (
        <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={light} strokeWidth={2} strokeDasharray="3.2 2.4" />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={hollow ? r - 1 : r}
        fill={hollow ? SURFACE_HOLE[surface] : fill}
        stroke={kind === "out" ? "var(--note-out)" : kind === "ghost" ? light : "var(--marker-ring)"}
        strokeWidth={hollow ? 2.5 : 2}
        strokeDasharray={kind === "ghost" ? "4 3" : undefined}
      />
      {label && (
        <text
          x={cx}
          y={cy}
          dy="0.35em"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontWeight={700}
          fontSize={fontSize}
          fill={textFill}
          style={{ pointerEvents: "none" }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/** Legenda dos tipos de marcador, para usar abaixo do braço, do teclado ou do diagrama. */
export type MarkerLegendProps = {
  kinds: MarkerKind[];
  labels: Partial<Record<MarkerKind, string>>;
  className?: string;
};

export function MarkerLegend({ kinds, labels, className }: MarkerLegendProps) {
  const id = React.useId().replace(/:/g, "");
  return (
    <ul className={cn("flex flex-wrap gap-x-4 gap-y-2 text-sm text-fg", className)}>
      {kinds.map((k) => (
        <li key={k} className="inline-flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
            <MarkerDefs hatchId={`${id}-h`} />
            <MarkerGlyph kind={k} cx={13} cy={13} r={k === "root" ? 7.5 : 10} surface="page" hatchId={`${id}-h`} animate={false} />
          </svg>
          {labels[k] ?? k}
        </li>
      ))}
    </ul>
  );
}
