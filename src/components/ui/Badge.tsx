// src/components/ui/Badge.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/** Etiqueta pequena, cantos quase retos, como um rótulo colado no case. */
export const badgeVariants = cva(
  "inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-xs border px-2 text-xs font-semibold [&_svg]:size-3.5",
  {
    variants: {
      tone: {
        neutral: "border-line-strong bg-surface-2 text-fg",
        accent: "border-transparent bg-accent-soft text-accent",
        good: "border-transparent bg-good-soft text-good",
        warn: "border-transparent bg-warn-soft text-warn",
        bad: "border-transparent bg-bad-soft text-bad",
        outline: "border-line-strong bg-transparent text-muted",
        solid: "border-transparent bg-accent text-on-accent",
      },
      mono: { true: "font-mono tracking-wide", false: "" },
    },
    defaultVariants: { tone: "neutral", mono: false },
  },
);

export type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, mono, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ tone, mono }), className)} {...props} />;
}
