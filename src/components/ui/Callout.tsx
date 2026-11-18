// src/components/ui/Callout.tsx
import * as React from "react";
import { cva } from "class-variance-authority";
import { BookOpen, ClipboardCheck, Lightbulb, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings } from "../../lib/strings";

export type CalloutVariant = "dica" | "atencao" | "autoavaliacao" | "teoria";

/**
 * Caixa de destaque dentro da aula. A etiqueta fica "colada" na borda de cima,
 * como uma fita de identificação num case. Nada de barra lateral colorida.
 */
const calloutVariants = cva("relative mt-3 rounded-md border px-4 pb-4 pt-5 text-base", {
  variants: {
    variant: {
      dica: "border-line-strong bg-surface",
      atencao: "border-warn bg-warn-soft",
      autoavaliacao: "border-accent bg-accent-soft",
      teoria: "border-line-strong bg-surface-2",
    },
  },
  defaultVariants: { variant: "dica" },
});

const tagClass: Record<CalloutVariant, string> = {
  dica: "bg-fg text-bg",
  atencao: "bg-warn text-bg",
  autoavaliacao: "bg-accent text-on-accent",
  teoria: "bg-surface text-fg border border-line-strong",
};

const icons: Record<CalloutVariant, LucideIcon> = {
  dica: Lightbulb,
  atencao: TriangleAlert,
  autoavaliacao: ClipboardCheck,
  teoria: BookOpen,
};

export type CalloutProps = Omit<React.ComponentProps<"aside">, "title"> & {
  variant?: CalloutVariant;
  /** Substitui a etiqueta padrão ("Dica", "Atenção"…). */
  label?: string;
  title?: React.ReactNode;
};

export function Callout({ className, variant = "dica", label, title, children, ...props }: CalloutProps) {
  const Icon = icons[variant];
  return (
    <aside data-slot="callout" data-variant={variant} className={cn(calloutVariants({ variant }), className)} {...props}>
      <span
        className={cn(
          "panel-label absolute -top-3 left-3 inline-flex h-6 items-center gap-1.5 rounded-xs px-2",
          tagClass[variant],
        )}
      >
        <Icon className="size-3.5" aria-hidden />
        {label ?? strings.callout[variant]}
      </span>
      {title && <p className="mb-1 font-semibold text-fg">{title}</p>}
      <div className="text-fg [&>p+p]:mt-2">{children}</div>
    </aside>
  );
}
