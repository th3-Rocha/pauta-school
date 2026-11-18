// src/components/course/YearMap.tsx
import * as React from "react";
import { Check, ChevronDown, Flag, Lock } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../lib/strings";

export type DayState = "locked" | "available" | "current" | "done" | "milestone";

export type YearDay = {
  /** Número do dia no ano (1–365). */
  day: number;
  state: DayState;
  title?: string;
  /** Desafio já vencido (só para state "milestone"). */
  passed?: boolean;
};

export type YearMonth = {
  /** 1–12 */
  month: number;
  title: string;
  /** 30 dias (o mês 12 tem 35). O último costuma ser o "milestone". */
  days: YearDay[];
};

export type YearMapProps = {
  months: YearMonth[];
  onSelectDay: (day: number) => void;
  /** Mês aberto ao montar. Padrão: o mês do dia "current". */
  defaultOpenMonth?: number;
  /** Mostra todos os meses abertos (bom para telas largas). */
  expandAll?: boolean;
  strings?: Partial<Strings["yearMap"]>;
  className?: string;
};

const STRIP: Record<DayState, string> = {
  locked: "bg-line",
  available: "bg-line-strong",
  current: "bg-accent",
  done: "bg-fg",
  milestone: "bg-warn",
};

export function YearMap({ months, onSelectDay, defaultOpenMonth, expandAll = false, strings: stringsOverride, className }: YearMapProps) {
  const s = { ...defaultStrings.yearMap, ...stringsOverride };
  const current = months.find((m) => m.days.some((d) => d.state === "current"))?.month;
  const [open, setOpen] = React.useState<Set<number>>(() => new Set([defaultOpenMonth ?? current ?? 1]));
  const toggle = (m: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });

  return (
    <div data-slot="year-map" className={cn("flex flex-col gap-2", className)}>
      <ol className="flex flex-col gap-2">
        {months.map((m) => {
          const isOpen = expandAll || open.has(m.month);
          const done = m.days.filter((d) => d.state === "done" || (d.state === "milestone" && d.passed)).length;
          const panelId = `ym-${m.month}`;
          const isCurrent = m.month === current;
          return (
            <li key={m.month} className={cn("rounded-md border bg-surface", isCurrent ? "border-accent" : "border-line")}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={isOpen ? s.collapse(m.month) : s.expand(m.month)}
                  onClick={() => !expandAll && toggle(m.month)}
                  className="flex min-h-14 w-full items-center gap-3 rounded-md px-3 py-2 text-left focus-ring"
                >
                  <span className="w-10 shrink-0 font-mono text-xs font-bold uppercase tracking-wider text-muted">
                    {String(m.month).padStart(2, "0")}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-semibold text-fg">{m.title}</span>
                      <span className="shrink-0 font-mono text-xs text-muted">{s.doneCount(done, m.days.length)}</span>
                    </span>
                    {/* Tira de "trastes": um traço por dia */}
                    <span aria-hidden className="flex h-2 gap-[2px]">
                      {m.days.map((d) => (
                        <span key={d.day} className={cn("h-full flex-1 rounded-[1px]", STRIP[d.state], d.state === "milestone" && !d.passed && "opacity-60")} />
                      ))}
                    </span>
                  </span>
                  {!expandAll && (
                    <ChevronDown aria-hidden className={cn("size-5 shrink-0 text-muted transition-transform duration-[var(--dur-base)]", isOpen && "rotate-180")} />
                  )}
                </button>
              </h3>
              {isOpen && (
                <div id={panelId} className="px-3 pb-3">
                  <ol className="grid grid-cols-6 gap-1.5 sm:flex sm:flex-wrap">
                    {m.days.map((d) => (
                      <li key={d.day}>
                        <DayCell day={d} onSelect={onSelectDay} s={s} />
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <YearMapLegend s={s} />
    </div>
  );
}

function DayCell({ day: d, onSelect, s }: { day: YearDay; onSelect: (day: number) => void; s: Strings["yearMap"] }) {
  const locked = d.state === "locked";
  const label = s.dayAria(d.day, d.state === "milestone" && d.passed ? `${s.states.milestone}, ${s.states.done}` : s.states[d.state], d.title);
  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => onSelect(d.day)}
      aria-label={label}
      aria-current={d.state === "current" ? "date" : undefined}
      title={d.title}
      className={cn(
        "relative flex aspect-square w-full min-h-11 sm:size-12 flex-col items-center justify-center rounded-xs border font-mono text-sm font-semibold focus-ring",
        "transition-colors duration-[var(--dur-fast)]",
        d.state === "locked" && "border-line bg-transparent text-muted/70",
        d.state === "available" && "border-line-strong bg-surface-2 text-fg hover:border-accent",
        d.state === "current" && "border-accent bg-accent text-on-accent shadow-knob",
        d.state === "done" && "border-transparent bg-surface-2 text-muted",
        d.state === "milestone" && (d.passed ? "border-warn bg-warn-soft text-fg" : "border-2 border-dashed border-warn text-fg hover:bg-warn-soft"),
      )}
    >
      {d.state === "milestone" ? <Flag className="size-4 text-warn" aria-hidden /> : <span>{d.day}</span>}
      {d.state === "done" && <Check aria-hidden className="absolute right-0.5 top-0.5 size-3 text-good" strokeWidth={3} />}
      {d.state === "locked" && <Lock aria-hidden className="absolute right-0.5 top-0.5 size-2.5 opacity-60" />}
      {d.state === "milestone" && d.passed && <Check aria-hidden className="absolute right-0.5 top-0.5 size-3 text-good" strokeWidth={3} />}
    </button>
  );
}

function YearMapLegend({ s }: { s: Strings["yearMap"] }) {
  const items: { state: DayState; node: React.ReactNode }[] = [
    { state: "current", node: <span className="size-4 rounded-[2px] bg-accent" /> },
    { state: "available", node: <span className="size-4 rounded-[2px] border border-line-strong bg-surface-2" /> },
    { state: "done", node: <span className="flex size-4 items-center justify-center rounded-[2px] bg-surface-2"><Check className="size-3 text-good" strokeWidth={3} /></span> },
    { state: "milestone", node: <span className="flex size-4 items-center justify-center rounded-[2px] border border-dashed border-warn"><Flag className="size-2.5 text-warn" /></span> },
    { state: "locked", node: <span className="flex size-4 items-center justify-center rounded-[2px] border border-line"><Lock className="size-2.5 text-muted" /></span> },
  ];
  return (
    <ul aria-label={s.legend} className="flex flex-wrap gap-x-4 gap-y-1.5 px-1 pt-1 text-sm text-muted">
      {items.map((it) => (
        <li key={it.state} className="inline-flex items-center gap-1.5">
          <span aria-hidden className="inline-flex">{it.node}</span>
          {s.states[it.state]}
        </li>
      ))}
    </ul>
  );
}
