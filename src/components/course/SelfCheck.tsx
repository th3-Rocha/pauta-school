// src/components/course/SelfCheck.tsx
import * as React from "react";
import { ClipboardCheck } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { Checkbox } from "../ui/Checkbox";

export type SelfCheckItem = { id: string; label: string; hint?: string };

export type SelfCheckProps = {
  items: SelfCheckItem[];
  /** ids marcados */
  checked: string[];
  onChange: (checked: string[]) => void;
  title?: string;
  strings?: Partial<Strings["selfCheck"]>;
  className?: string;
};

/** Checklist de postura e técnica ("punho reto?"). Cada linha inteira é clicável. */
export function SelfCheck({ items, checked, onChange, title, strings: stringsOverride, className }: SelfCheckProps) {
  const s = { ...defaultStrings.selfCheck, ...stringsOverride };
  const uid = React.useId();
  const all = items.length > 0 && checked.length >= items.length;
  const toggle = (id: string, on: boolean) => onChange(on ? [...new Set([...checked, id])] : checked.filter((c) => c !== id));
  return (
    <fieldset data-slot="self-check" className={cn("rounded-md border border-accent bg-accent-soft p-4", className)}>
      <legend className="sr-only">{title ?? s.title}</legend>
      <div aria-hidden className="mb-2 flex items-center justify-between gap-3">
        <span className="panel-label inline-flex items-center gap-1.5 text-fg">
          <ClipboardCheck className="size-4" />
          {title ?? s.title}
        </span>
        <span className="font-mono text-sm font-semibold text-fg">{s.count(checked.length, items.length)}</span>
      </div>
      <ul className="flex flex-col">
        {items.map((it) => {
          const id = `${uid}-${it.id}`;
          const on = checked.includes(it.id);
          return (
            <li key={it.id}>
              <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-sm py-2.5">
                <Checkbox id={id} checked={on} onCheckedChange={(v) => toggle(it.id, v === true)} className="mt-px" />
                <span className="flex flex-col">
                  <span className={cn("text-base font-medium", on ? "text-muted line-through decoration-1" : "text-fg")}>{it.label}</span>
                  {it.hint && <span className="text-sm text-muted">{it.hint}</span>}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <p aria-live="polite" className="text-sm font-semibold text-good">
        {all ? s.allDone : ""}
      </p>
    </fieldset>
  );
}
