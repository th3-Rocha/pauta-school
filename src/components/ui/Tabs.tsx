// src/components/ui/Tabs.tsx
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/cn";

export type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>;
export function Tabs({ className, ...props }: TabsProps) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-4", className)} {...props} />;
}

export type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>;
/** Lista rolável na horizontal: no celular as abas nunca quebram a página. */
export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "-mx-1 flex max-w-full gap-1 overflow-x-auto border-b border-line px-1 [scrollbar-width:none]",
        className,
      )}
      {...props}
    />
  );
}

export type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>;
/** A aba ativa ganha uma barra de níquel embaixo, como um traste. */
export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative -mb-px inline-flex h-11 shrink-0 items-center gap-2 px-3 text-base font-semibold text-muted focus-ring",
        "transition-colors duration-[var(--dur-fast)] hover:text-fg [&_svg]:size-4",
        "after:absolute after:inset-x-2 after:bottom-0 after:h-[3px] after:rounded-t-[2px] after:bg-transparent",
        "data-[state=active]:text-fg data-[state=active]:after:bg-accent",
        className,
      )}
      {...props}
    />
  );
}

export type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content>;
export function TabsContent({ className, ...props }: TabsContentProps) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("focus-ring", className)} {...props} />;
}
