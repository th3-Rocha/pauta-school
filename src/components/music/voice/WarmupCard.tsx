// src/components/music/voice/WarmupCard.tsx
// Rotina de aquecimento (ou desaquecimento): lista com tempo por item, o
// Chimera demonstrando cada um, e o lembrete de saúde vocal sempre visível.
import * as React from "react";
import { Check, Droplet, Eye, Hand, Pause } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { Button } from "../../ui/Button";
import { Panel } from "../controls";

export type WarmupItem = {
  /** "lip-trill" | "hum" | "siren" | "five-note" | "yawn" | "slide-down" | outro (com `title`). */
  id: string;
  title?: string;
  seconds: number;
  done?: boolean;
};

export type WarmupCardProps = {
  variant?: "warmup" | "cooldown";
  items: WarmupItem[];
  /** Índice do item atual. */
  current?: number;
  /** O Chimera demonstra o item (o app canta e mostra no monitor). */
  onDemo?: (id: string) => void;
  onToggleDone?: (id: string, done: boolean) => void;
  /** Pausa obrigatória: segundos que faltam (null = sem pausa agora). */
  pause?: number | null;
  strings?: Partial<Strings["vocalHealth"]>;
  className?: string;
};

export function WarmupCard({ variant = "warmup", items, current, onDemo, onToggleDone, pause = null, strings: stringsOverride, className }: WarmupCardProps) {
  const s = { ...defaultStrings.vocalHealth, ...stringsOverride };
  const total = Math.round(items.reduce((a, i) => a + i.seconds, 0) / 60);

  return (
    <Panel label={variant === "warmup" ? s.warmup : s.cooldown} className={cn("max-w-xl", className)} aside={<span className="font-mono text-sm text-muted">{s.total(total)}</span>}>
      <div className="flex flex-col gap-4">
        {pause !== null && (
          <div className="flex items-center gap-3 rounded-md bg-accent-soft p-3" role="status">
            <Pause className="size-5 shrink-0 text-accent" aria-hidden />
            <div>
              <p className="font-semibold text-fg">{s.pause}</p>
              <p className="text-sm text-fg">{s.pauseHint(pause)}</p>
            </div>
            <span className="ml-auto font-mono text-3xl font-bold text-fg">{pause}</span>
          </div>
        )}

        <ol className="flex flex-col gap-2">
          {items.map((it, i) => {
            const isCur = i === current;
            const title = it.title ?? s.items[it.id] ?? it.id;
            return (
              <li
                key={it.id}
                aria-current={isCur ? "step" : undefined}
                className={cn("flex items-center gap-3 rounded-sm border px-3 py-2", isCur ? "border-accent bg-accent-soft" : "border-line bg-surface")}
              >
                <button
                  type="button"
                  aria-pressed={!!it.done}
                  aria-label={`${title}: ${s.done}`}
                  onClick={() => onToggleDone?.(it.id, !it.done)}
                  className={cn(
                    "inline-flex size-11 shrink-0 items-center justify-center rounded-sm border-2 focus-ring",
                    it.done ? "border-good bg-good-soft text-good" : "border-line-strong text-transparent",
                  )}
                >
                  <Check className="size-5" strokeWidth={3} aria-hidden />
                </button>
                <div className="min-w-0 flex-1">
                  <p className={cn("font-semibold", it.done ? "text-muted line-through" : "text-fg")}>{title}</p>
                  <p className="font-mono text-sm text-muted">
                    {s.seconds(it.seconds)}
                    {isCur && <span className="ml-2 text-accent">· {s.current}</span>}
                  </p>
                </div>
                {onDemo && (
                  <Button variant="ghost" size="sm" className="h-11" onClick={() => onDemo(it.id)}>
                    <Eye aria-hidden />
                    <span className="max-sm:sr-only">{s.demo}</span>
                  </Button>
                )}
              </li>
            );
          })}
        </ol>

        {/* saúde vocal: sempre à vista */}
        <ul className="flex flex-col gap-1.5 rounded-md border border-line bg-surface-2 p-3 text-sm text-fg">
          <li className="flex gap-2">
            <Droplet className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            {s.reminders.water}
          </li>
          <li className="flex gap-2">
            <Pause className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            {s.reminders.pauses}
          </li>
          <li className="flex gap-2 font-semibold">
            <Hand className="mt-0.5 size-4 shrink-0 text-fg" aria-hidden />
            {s.reminders.stop}
          </li>
          <li className="text-muted">{s.reminders.hoarse}</li>
        </ul>
      </div>
    </Panel>
  );
}
