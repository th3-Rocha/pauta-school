// src/components/ui/Progress.tsx
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/cn";

export type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  /** 0–100 */
  value: number;
  /** Marca uma meta na trilha (ex.: 80). Desenhada como um traste. */
  goal?: number;
  tone?: "accent" | "good" | "warn" | "bad";
  size?: "sm" | "md";
};

const toneClass = { accent: "bg-accent", good: "bg-good", warn: "bg-warn", bad: "bg-bad" } as const;

export function Progress({ className, value, goal, tone = "accent", size = "md", ...props }: ProgressProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={v}
      className={cn(
        "relative w-full overflow-visible rounded-full bg-surface-2 ring-1 ring-inset ring-line",
        size === "sm" ? "h-1.5" : "h-2.5",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full rounded-full transition-[width] duration-[var(--dur-slow)] ease-out", toneClass[tone])}
        style={{ width: `${v}%` }}
      />
      {goal !== undefined && (
        <span
          aria-hidden
          className="absolute -top-1 -bottom-1 w-[3px] -translate-x-1/2 rounded-[1px] bg-fg"
          style={{ left: `${goal}%` }}
        />
      )}
    </ProgressPrimitive.Root>
  );
}
