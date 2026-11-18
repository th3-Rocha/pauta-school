// src/components/ui/Checkbox.tsx
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

export type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root>;

/** Caixa de 22px com área de toque de 44px (o rótulo também marca). */
export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative size-[22px] shrink-0 rounded-xs border-2 border-line-strong bg-bg focus-ring",
        "transition-colors duration-[var(--dur-fast)]",
        "before:absolute before:-inset-[11px] before:content-['']",
        "data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-on-accent",
        "disabled:opacity-45",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center data-[state=checked]:animate-pluck">
        <Check className="size-4" strokeWidth={3} aria-hidden />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
