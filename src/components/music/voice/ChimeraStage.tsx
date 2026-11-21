// src/components/music/voice/ChimeraStage.tsx
// O monitor do Chimera. Fora: a Pauta (moldura grafite, legenda, crédito).
// Dentro: o Chimera (preto puro, azul = corpo, âmbar = som, Hershey em caixa alta).
// A cabeça é um slot (`children`): nós passamos a AnatomyView3D, a AnatomyView
// (corte 2D, leve) ou, na vitrine, o HeadPlaceholder.
//
// Carregamento: o app só monta o motor (wasm) e o three.js quando o monitor entra
// na tela (IntersectionObserver no lado do app); até lá o status é "loading".
import * as React from "react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import type { GuideState } from "../../../lib/voice";

export type ChimeraStageSize = "hero" | "inline" | "cameo";
export type ChimeraView = "3d" | "2d";

export type StageChip = { id: string; label: string; on: boolean; onToggle?: (on: boolean) => void };

export type ChimeraStageProps = {
  guide: GuideState;
  size?: ChimeraStageSize;
  /** Legenda embaixo do monitor, do lado de fora (texto da Pauta). */
  caption?: React.ReactNode;
  /** O áudio ainda não foi liberado: o botão "Tocar para ouvir" chama isto. */
  onStartAudio?: () => void;
  onRetry?: () => void;
  view?: ChimeraView;
  onViewChange?: (view: ChimeraView) => void;
  /** Chips do Chimera no canto da tela (pressão, fluxo, medidas…). */
  controls?: StageChip[];
  /** Título da tela, em caixa alta (padrão: CHIMERA). */
  title?: string;
  /** Esconde o crédito (só quando ele já aparece logo ao lado, ex.: dois monitores lado a lado). */
  hideCredit?: boolean;
  /** A cabeça (ou outra vista do Chimera). */
  children?: React.ReactNode;
  strings?: Partial<Strings["chimera"]>;
  className?: string;
};

/** Chip no estilo do Chimera: moldura fina, caixa alta Hershey, aceso = mais brilho (sem preenchimento). */
export function StageChipButton({ label, on, onClick, disabled }: { label: string; on: boolean; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "stage-text inline-flex h-9 min-w-11 items-center justify-center rounded-[2px] border px-2.5 text-xs font-semibold leading-none outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--stage-sound)] disabled:opacity-40",
        on ? "border-[var(--stage-body)] text-[var(--stage-text)] shadow-[0_0_8px_var(--stage-glow)]" : "border-[var(--stage-body-dim)] text-[var(--stage-body)]",
      )}
    >
      {label}
    </button>
  );
}

export function ChimeraStage({
  guide,
  size = "inline",
  caption,
  onStartAudio,
  onRetry,
  view = "3d",
  onViewChange,
  controls = [],
  title,
  hideCredit = false,
  children,
  strings: stringsOverride,
  className,
}: ChimeraStageProps) {
  const s = { ...defaultStrings.chimera, ...stringsOverride };
  const st = guide.status;
  const stateLabel = s.states[st];
  const cameo = size === "cameo";
  const level = Math.max(0, Math.min(1, guide.level ?? 0));
  const aria = s.aria(stateLabel, st === "singing" ? guide.syllable : undefined);

  const screen = (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-[var(--stage-bg)]",
        cameo ? "size-[72px] rounded-full ring-2 ring-[var(--stage-line)]" : "w-full rounded-md ring-1 ring-[var(--stage-line)]",
        size === "hero" && "aspect-[4/5] sm:aspect-[16/11]",
        size === "inline" && "aspect-video",
      )}
      role="img"
      aria-label={aria}
    >
      {/* a cabeça (slot) */}
      {st !== "error" && <div className={cn("absolute inset-0", !cameo && "p-6 pt-12", st === "loading" && "opacity-30")}>{children}</div>}

      {/* cabeçalho da tela: título + estado à esquerda, vista e chips à direita */}
      {!cameo && (
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2.5">
          <p className="stage-text flex items-center gap-2 text-sm font-semibold">
            <span
              aria-hidden
              className={cn(
                "size-1.5 rounded-full",
                st === "singing" ? "bg-[var(--stage-sound)] shadow-[0_0_6px_var(--stage-sound)]" : st === "error" ? "bg-[var(--stage-alert)]" : "bg-[var(--stage-body)]",
              )}
            />
            {title ?? s.name}
            <span className="text-[var(--stage-text)] [text-shadow:0_0_6px_var(--stage-glow)]">· {stateLabel}</span>
          </p>
          <div className="flex flex-wrap justify-end gap-1.5">
            {onViewChange && (
              <div role="group" aria-label={s.viewLabel} className="flex gap-1">
                <StageChipButton label={s.view3d} on={view === "3d" && st !== "no-3d"} disabled={st === "no-3d"} onClick={() => onViewChange("3d")} />
                <StageChipButton label={s.view2d} on={view === "2d" || st === "no-3d"} onClick={() => onViewChange("2d")} />
              </div>
            )}
            {controls.map((c) => (
              <StageChipButton key={c.id} label={c.label} on={c.on} onClick={() => c.onToggle?.(!c.on)} />
            ))}
          </div>
        </div>
      )}

      {/* cantando: sílaba em âmbar e o nível de som */}
      {!cameo && st === "singing" && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
          {guide.syllable && (
            <p className="stage-text text-3xl leading-none text-[var(--stage-sound)] [text-shadow:0_0_10px_var(--stage-sound-glow)] sm:text-4xl">{guide.syllable}</p>
          )}
          <span aria-hidden className="mb-1 h-1.5 w-24 overflow-hidden rounded-full border border-[var(--stage-body-dim)]">
            <span className="block h-full bg-[var(--stage-sound)] shadow-[0_0_6px_var(--stage-sound)]" style={{ width: `${level * 100}%` }} />
          </span>
        </div>
      )}

      {/* estados */}
      {st === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          {!cameo && <p className="stage-text text-sm">{stateLabel}…</p>}
          <span aria-hidden className={cn("relative h-px overflow-hidden bg-[var(--stage-body-dim)]", cameo ? "w-10" : "w-40")}>
            <span className="absolute inset-y-0 left-0 w-1/3 animate-[pulse_1.2s_ease-in-out_infinite] bg-[var(--stage-body)] shadow-[0_0_8px_var(--stage-glow)]" />
          </span>
        </div>
      )}
      {st === "no-audio" && !cameo && (
        <div className="absolute inset-0 flex flex-col items-center justify-end gap-2 p-4 pb-6">
          <button
            type="button"
            onClick={onStartAudio}
            className="stage-text inline-flex h-12 items-center gap-2 rounded-[2px] border-2 border-[var(--stage-sound)] px-5 text-sm text-[var(--stage-sound)] shadow-[0_0_12px_var(--stage-sound-glow)] outline-none [text-shadow:0_0_8px_var(--stage-sound-glow)] focus-visible:ring-2 focus-visible:ring-[var(--stage-text)]"
          >
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
              <path d="M4 3 L13 8 L4 13 Z" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
            </svg>
            {s.startAudio}
          </button>
          <p className="stage-text max-w-xs text-center text-[10px] normal-case tracking-normal text-[var(--stage-body-dim)]">{s.startAudioHint}</p>
        </div>
      )}
      {st === "error" && !cameo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="stage-text text-sm text-[var(--stage-alert)] [text-shadow:none]">{stateLabel}</p>
          <p className="max-w-xs text-xs text-[var(--stage-text)]">{s.errorHint}</p>
          {onRetry && (
            <StageChipButton label={s.retry} on={false} onClick={onRetry} />
          )}
        </div>
      )}
    </div>
  );

  if (cameo) return <div className={className} title={s.credit}>{screen}</div>;

  return (
    <figure data-slot="chimera-stage" className={cn("flex w-full flex-col gap-2", size === "hero" ? "max-w-3xl" : "max-w-2xl", className)}>
      {/* a moldura da Pauta: grafite fosco, igual nos dois temas, como um aparelho */}
      <div className="rounded-lg bg-[var(--stage-frame)] p-2 shadow-md ring-1 ring-black/40 sm:p-2.5">{screen}</div>
      {(caption || !hideCredit) && (
        <figcaption className="flex flex-col gap-1 px-1">
          {caption && <span className="text-base text-fg">{caption}</span>}
          {!hideCredit && (
            <a href={s.creditUrl} target="_blank" rel="noreferrer" className="self-start rounded-xs font-mono text-xs text-muted underline-offset-2 hover:underline focus-ring">
              {s.credit}
            </a>
          )}
        </figcaption>
      )}
    </figure>
  );
}
