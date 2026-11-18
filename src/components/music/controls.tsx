// src/components/music/controls.tsx
// Peças pequenas compartilhadas pelos componentes musicais.
import * as React from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "../../lib/cn";

export type LedToggleProps = Omit<React.ComponentProps<"button">, "onChange"> & {
  pressed: boolean;
  onPressedChange?: (pressed: boolean) => void;
  icon?: React.ReactNode;
};

/** Chave liga/desliga de amplificador: um LED aceso mostra o estado, além de aria-pressed. */
export function LedToggle({ pressed, onPressedChange, icon, className, children, ...props }: LedToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange?.(!pressed)}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-sm border px-3 text-sm font-semibold focus-ring",
        "transition-colors duration-[var(--dur-fast)] disabled:opacity-45 [&_svg]:size-4",
        pressed ? "border-accent bg-accent-soft text-fg" : "border-line-strong bg-surface-2 text-muted hover:text-fg",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "size-2 shrink-0 rounded-full ring-1 ring-marker-ring",
          pressed ? "bg-accent shadow-[0_0_0_3px_var(--accent-soft)]" : "bg-line-strong",
        )}
      />
      {icon}
      {children}
    </button>
  );
}

export type PlayButtonProps = Omit<React.ComponentProps<"button">, "children"> & {
  playing: boolean;
  playLabel: string;
  pauseLabel: string;
  size?: "md" | "lg" | "xl";
  /** Mostra o texto ao lado do ícone. */
  showLabel?: boolean;
};

/** Botão redondo de tocar/pausar. É o único controle circular do sistema. */
export function PlayButton({ playing, playLabel, pauseLabel, size = "lg", showLabel = false, className, ...props }: PlayButtonProps) {
  const label = playing ? pauseLabel : playLabel;
  const dims = size === "xl" ? "h-16 min-w-16 [&_svg]:size-7" : size === "lg" ? "h-13 min-w-13 [&_svg]:size-6" : "h-11 min-w-11 [&_svg]:size-5";
  return (
    <button
      type="button"
      aria-label={showLabel ? undefined : label}
      aria-pressed={playing}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent font-semibold text-on-accent shadow-knob focus-ring",
        "transition-[filter,transform] duration-[var(--dur-fast)] hover:brightness-110 active:translate-y-px disabled:opacity-45",
        showLabel ? "px-5" : "",
        dims,
        className,
      )}
      {...props}
    >
      {playing ? <Pause aria-hidden fill="currentColor" /> : <Play aria-hidden fill="currentColor" className="translate-x-[1px]" />}
      {showLabel && <span>{label}</span>}
    </button>
  );
}

/** Moldura padrão dos aparelhos (metrônomo, drone, base…): painel com rótulo de amplificador. */
export function Panel({
  label,
  aside,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & { label: string; aside?: React.ReactNode }) {
  const id = React.useId();
  return (
    <section aria-labelledby={id} className={cn("rounded-lg border border-line bg-surface p-4 shadow-md sm:p-5", className)} {...props}>
      <header className="mb-3 flex min-h-6 items-center justify-between gap-3">
        <h3 id={id} className="panel-label text-muted">
          {label}
        </h3>
        {aside}
      </header>
      {children}
    </section>
  );
}
