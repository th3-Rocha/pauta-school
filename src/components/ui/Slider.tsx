// src/components/ui/Slider.tsx
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/cn";

export type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** aria-label de cada alça, em ordem. */
  thumbLabels?: string[];
};

/** Alça de níquel (uma barra vertical, como um traste) com área de toque de 44px. */
export function Slider({ className, thumbLabels = [], value, defaultValue, min = 0, max = 100, ...props }: SliderProps) {
  const count = (value ?? defaultValue ?? [min]).length;
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      className={cn(
        "relative flex h-11 w-full touch-none select-none items-center data-[disabled]:opacity-45",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-surface-2 ring-1 ring-inset ring-line-strong">
        <SliderPrimitive.Range className="absolute h-full bg-accent" />
      </SliderPrimitive.Track>
      {Array.from({ length: count }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={thumbLabels[i]}
          className={cn(
            "relative block h-7 w-3.5 rounded-[3px] border border-marker-ring bg-fret shadow-knob focus-ring",
            "before:absolute before:-inset-x-4 before:-inset-y-2 before:content-['']",
            "after:absolute after:inset-y-1.5 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-marker-ring/40",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
