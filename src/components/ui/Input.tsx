// src/components/ui/Input.tsx
import * as React from "react";
import { cn } from "../../lib/cn";

const fieldBase = [
  "w-full rounded-sm border border-line-strong bg-bg px-3 text-base text-fg placeholder:text-muted",
  "transition-colors duration-[var(--dur-fast)] focus-ring",
  "aria-[invalid=true]:border-bad disabled:opacity-45",
];

export type InputProps = React.ComponentProps<"input"> & { mono?: boolean };

export function Input({ className, mono, type = "text", ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(fieldBase, "h-11", mono && "font-mono tracking-wide", className)}
      {...props}
    />
  );
}

export type TextareaProps = React.ComponentProps<"textarea"> & { mono?: boolean };

export function Textarea({ className, mono, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldBase, "min-h-24 resize-y py-2.5", mono && "font-mono tracking-wide", className)}
      {...props}
    />
  );
}

export type LabelProps = React.ComponentProps<"label">;

export function Label({ className, ...props }: LabelProps) {
  return <label data-slot="label" className={cn("text-sm font-semibold text-fg", className)} {...props} />;
}

export type FieldMessageProps = React.ComponentProps<"p"> & { tone?: "muted" | "bad" | "good" };

/** Mensagem abaixo do campo. Ligue ao campo com aria-describedby. */
export function FieldMessage({ className, tone = "muted", ...props }: FieldMessageProps) {
  return (
    <p
      data-slot="field-message"
      className={cn("text-sm", tone === "bad" ? "text-bad" : tone === "good" ? "text-good" : "text-muted", className)}
      {...props}
    />
  );
}
