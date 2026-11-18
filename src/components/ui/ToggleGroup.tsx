// src/components/ui/ToggleGroup.tsx
import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "../../lib/cn";

/**
 * Chave seletora estilo canal de amplificador: uma peça só, segmentos encostados.
 * Use `type="single"` para escolher um valor (compasso, modo de clique).
 */
export type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> & {
  size?: "sm" | "md";
};

const SizeContext = React.createContext<"sm" | "md">("md");

export function ToggleGroup({ className, size = "md", ...props }: ToggleGroupProps) {
  return (
    <SizeContext.Provider value={size}>
      <ToggleGroupPrimitive.Root
        data-slot="toggle-group"
        className={cn(
          "inline-flex max-w-full flex-wrap items-stretch gap-0.5 rounded-sm border border-line-strong bg-bg p-0.5",
          className,
        )}
        {...props}
      />
    </SizeContext.Provider>
  );
}

export type ToggleGroupItemProps = React.ComponentProps<typeof ToggleGroupPrimitive.Item>;

export function ToggleGroupItem({ className, ...props }: ToggleGroupItemProps) {
  const size = React.useContext(SizeContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[4px] font-semibold text-muted focus-ring",
        "transition-colors duration-[var(--dur-fast)] hover:text-fg",
        "data-[state=on]:bg-surface-2 data-[state=on]:text-fg data-[state=on]:shadow-knob",
        "disabled:opacity-45 [&_svg]:size-4",
        size === "sm" ? "h-8 min-w-8 px-2.5 text-sm" : "h-10 min-w-11 px-3 text-base",
        className,
      )}
      {...props}
    />
  );
}
