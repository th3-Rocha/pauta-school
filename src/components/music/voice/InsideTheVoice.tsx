// src/components/music/voice/InsideTheVoice.tsx
// Explicador: as vistas do Chimera (cabeça, pregas, tubo, espectro) dentro do
// monitor, com as partes numeradas NA tela (estilo Chimera) e a legenda em
// português FORA dela (estilo Pauta). Comparações lado a lado: o Chimera canta
// a mesma nota dos dois jeitos.
import * as React from "react";
import { Volume2 } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import type { GuideState } from "../../../lib/voice";
import { Button } from "../../ui/Button";
import { ToggleGroup, ToggleGroupItem } from "../../ui/ToggleGroup";
import { ChimeraStage, type ChimeraView } from "./ChimeraStage";

export type InsideTab = "head" | "folds" | "tube" | "spectrum";
export type InsidePart = { id: string; /** posição na tela, em % */ x: number; y: number };
export type ComparisonId = "larynx" | "nasal" | "register" | "onset";

export type InsideTheVoiceProps = {
  tab: InsideTab;
  onTabChange: (tab: InsideTab) => void;
  /** As vistas do Chimera (AnatomyView/3D, Stroboscope, TubeView, SpectrumView). */
  views: Partial<Record<InsideTab, React.ReactNode>>;
  guide: GuideState;
  /** Partes apontadas na aba "cabeça", em % da caixa da vista. Padrão: as do corte 2D. */
  parts?: InsidePart[];
  /** Proporção (largura/altura) da vista da cabeça, para alinhar as partes. Padrão 200/220. */
  contentAspect?: number;
  view?: ChimeraView;
  onViewChange?: (view: ChimeraView) => void;
  onStartAudio?: () => void;
  /** Comparação lado a lado (null = desligada). */
  compare?: ComparisonId | null;
  onCompareChange?: (id: ComparisonId | null) => void;
  /** As duas vistas da comparação. */
  compareViews?: [React.ReactNode, React.ReactNode];
  onPlaySide?: (id: ComparisonId, side: 0 | 1) => void;
  strings?: Partial<Strings["chimera"]>;
  className?: string;
};

/** Posições padrão para o corte 2D do HeadPlaceholder/AnatomyView. */
export const DEFAULT_PARTS: InsidePart[] = [
  { id: "nasal", x: 64, y: 40 },
  { id: "velum", x: 50, y: 46 },
  { id: "tongue", x: 63, y: 54 },
  { id: "lips", x: 79, y: 57 },
  { id: "pharynx", x: 46, y: 64 },
  { id: "folds", x: 46, y: 77 },
  { id: "larynx", x: 58, y: 82 },
];

export function InsideTheVoice({
  tab,
  onTabChange,
  views,
  guide,
  parts = DEFAULT_PARTS,
  contentAspect = 200 / 220,
  view,
  onViewChange,
  onStartAudio,
  compare = null,
  onCompareChange,
  compareViews,
  onPlaySide,
  strings: stringsOverride,
  className,
}: InsideTheVoiceProps) {
  const s = { ...defaultStrings.chimera, ...stringsOverride };
  const ins = s.inside;
  const tabs: InsideTab[] = ["head", "folds", "tube", "spectrum"];

  return (
    <section data-slot="inside-the-voice" aria-label={ins.label} className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-xl font-bold text-fg">{ins.label}</h3>
        <ToggleGroup type="single" size="sm" value={tab} onValueChange={(v) => v && onTabChange(v as InsideTab)} aria-label={ins.label}>
          {tabs.map((t) => (
            <ToggleGroupItem key={t} value={t} className="h-11 flex-none">
              {ins.tabs[t]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <ChimeraStage
        size="inline"
        guide={guide}
        title={ins.tabs[tab]}
        view={view}
        onViewChange={tab === "head" ? onViewChange : undefined}
        onStartAudio={onStartAudio}
        caption={ins.look[tab]}
        className="max-w-none"
      >
        <div className="relative mx-auto h-full" style={{ aspectRatio: tab === "head" ? contentAspect : undefined, width: tab === "head" ? undefined : "100%" }}>
          {views[tab]}
          {/* partes numeradas, na linguagem do Chimera (dentro da tela) */}
          {tab === "head" &&
            parts.map((p, i) => (
              <span
                key={p.id}
                aria-hidden
                className="stage-text absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--stage-sound)] bg-[var(--stage-bg)] text-xs text-[var(--stage-text)] [text-shadow:none]"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                {i + 1}
              </span>
            ))}
        </div>
      </ChimeraStage>

      {tab === "head" && (
        <ol className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-fg sm:grid-cols-2">
          {parts.map((p, i) => (
            <li key={p.id} className="flex items-center gap-2">
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-xs font-bold">{i + 1}</span>
              {ins.parts[p.id] ?? p.id}
            </li>
          ))}
        </ol>
      )}

      {onCompareChange && (
        <div className="flex flex-col gap-3 border-t border-line pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="panel-label text-muted">{ins.compare}</span>
            <ToggleGroup type="single" size="sm" value={compare ?? ""} onValueChange={(v) => onCompareChange((v || null) as ComparisonId | null)} aria-label={ins.compare}>
              {(Object.keys(ins.comparisons) as ComparisonId[]).map((id) => (
                <ToggleGroupItem key={id} value={id} className="h-11 flex-none">
                  {ins.comparisons[id].join(" × ")}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          {compare && compareViews && (
            <>
              <p className="text-sm text-muted">{ins.sameNote}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {([0, 1] as const).map((side) => (
                  <div key={side} className="flex flex-col gap-2">
                    <ChimeraStage size="inline" guide={{ status: "idle" }} title={ins.comparisons[compare][side]} hideCredit>
                      {compareViews[side]}
                    </ChimeraStage>
                    <Button variant="secondary" className="self-start" onClick={() => onPlaySide?.(compare, side)}>
                      <Volume2 aria-hidden />
                      {ins.playSide(ins.comparisons[compare][side])}
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
