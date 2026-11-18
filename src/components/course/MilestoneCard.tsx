// src/components/course/MilestoneCard.tsx
import { Check, Flag, Lock } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { Button } from "../ui/Button";

export type MilestoneStatus = "bloqueado" | "disponivel" | "concluido";

export type MilestoneCardProps = {
  month: number;
  title: string;
  /** Meta em uma frase. */
  goal: string;
  /** Critérios de sucesso, objetivos e verificáveis. */
  criteria: string[];
  targetBpm: number;
  /** Melhor BPM que o aluno já tocou limpo. */
  bestBpm?: number;
  status: MilestoneStatus;
  onAttempt: () => void;
  strings?: Partial<Strings["milestone"]>;
  className?: string;
};

export function MilestoneCard({
  month,
  title,
  goal,
  criteria,
  targetBpm,
  bestBpm,
  status,
  onAttempt,
  strings: stringsOverride,
  className,
}: MilestoneCardProps) {
  const s = { ...defaultStrings.milestone, ...stringsOverride };
  const locked = status === "bloqueado";
  const passed = status === "concluido";
  return (
    <article
      data-slot="milestone-card"
      className={cn(
        "relative overflow-hidden rounded-lg border-2 bg-surface",
        passed ? "border-good" : locked ? "border-line" : "border-warn",
        className,
      )}
    >
      {/* Faixa de "fita" com o rótulo do desafio */}
      <div className={cn("flex items-center justify-between gap-3 px-4 py-2", passed ? "bg-good-soft" : locked ? "bg-surface-2" : "bg-warn-soft")}>
        <span className={cn("panel-label inline-flex items-center gap-1.5", passed ? "text-good" : locked ? "text-muted" : "text-warn")}>
          {passed ? <Check className="size-4" strokeWidth={3} aria-hidden /> : locked ? <Lock className="size-4" aria-hidden /> : <Flag className="size-4" aria-hidden />}
          {s.eyebrow(month)}
        </span>
        {passed && <span className="panel-label text-good">{s.passed}</span>}
      </div>

      <div className="grid gap-5 p-4 sm:grid-cols-[1fr_auto] sm:p-5">
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-2xl font-bold text-fg">{title}</h3>
          <p className="text-base text-fg">
            <span className="font-semibold">{s.goal}: </span>
            {goal}
          </p>
          <div>
            <p className="panel-label mb-1.5 text-muted">{s.criteria}</p>
            <ul className="flex flex-col gap-1.5">
              {criteria.map((c, i) => (
                <li key={i} className="flex gap-2 text-base text-fg">
                  <Check className="mt-1 size-4 shrink-0 text-muted" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:justify-between">
          <div className="sm:text-right">
            <p className="panel-label text-muted">{s.targetBpm}</p>
            <p className="font-mono text-5xl font-bold leading-none text-fg">{targetBpm}</p>
            {bestBpm !== undefined && (
              <p className="mt-1 text-sm text-muted">
                {s.best}: <strong className={cn("font-mono", bestBpm >= targetBpm ? "text-good" : "text-fg")}>{bestBpm}</strong>
              </p>
            )}
          </div>
          <Button
            size="lg"
            variant={passed ? "secondary" : "primary"}
            disabled={locked}
            onClick={onAttempt}
            className="ml-auto sm:ml-0"
          >
            {locked ? s.locked : passed ? s.retry : s.attempt}
          </Button>
        </div>
      </div>
    </article>
  );
}
