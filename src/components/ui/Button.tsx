// src/components/ui/Button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings } from "../../lib/strings";

export const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap",
    "rounded-sm font-sans font-semibold focus-ring",
    "transition-[background-color,border-color,color,transform] duration-[var(--dur-fast)] ease-out",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /* Botão de amplificador: sólido, com brilho em cima */
        primary: "bg-accent text-on-accent shadow-knob hover:brightness-110",
        secondary: "border border-line-strong bg-surface-2 text-fg hover:bg-line",
        ghost: "text-fg hover:bg-surface-2",
        danger: "border border-bad bg-bad-soft text-bad hover:bg-bad hover:text-bg",
      },
      size: {
        sm: "h-9 px-3 text-sm [&_svg]:size-4",
        md: "h-11 px-4 text-base [&_svg]:size-[18px]",
        lg: "h-13 px-6 text-lg [&_svg]:size-5",
        icon: "size-11 [&_svg]:size-5",
        "icon-sm": "size-9 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Renderiza o filho (ex.: <a>) com o visual do botão. */
    asChild?: boolean;
    /** Mostra o giro e bloqueia cliques. O texto continua visível. */
    loading?: boolean;
    /** Texto lido por leitores de tela durante o carregamento. */
    loadingLabel?: string;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingLabel = strings.button.loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && (
            <>
              <Loader2 aria-hidden className="animate-spin" />
              <span className="sr-only">{loadingLabel}</span>
            </>
          )}
          {children}
        </>
      )}
    </Comp>
  );
}
