// src/components/ui/Tooltip.tsx
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../lib/cn";

/** Cada Tooltip traz seu próprio Provider: funciona isolado numa ilha do Astro. */
export type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root> & { delayDuration?: number };
export function Tooltip({ delayDuration = 300, ...props }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipPrimitive.Provider>
  );
}

export const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Content>;
export function TooltipContent({ className, sideOffset = 6, children, ...props }: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-64 rounded-xs bg-fg px-2.5 py-1.5 text-sm font-medium text-bg shadow-md",
          "data-[state=delayed-open]:animate-fade-in",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-fg" width={10} height={5} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
