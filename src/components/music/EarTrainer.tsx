// src/components/music/EarTrainer.tsx
import { Check, Volume2, X, ArrowRight, Target } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { Button } from "../ui/Button";
import { Progress } from "../ui/Progress";
import { Panel } from "./controls";

export type EarOption = { id: string; label: string; hint?: string };

export type EarTrainerProps = {
  /** Ex.: "Que intervalo é esse?" */
  question: string;
  options: EarOption[];
  /** asking: esperando resposta · correct/wrong: depois de responder */
  status: "asking" | "correct" | "wrong";
  selectedId?: string;
  /** Mostrado depois da resposta. */
  correctId?: string;
  onAnswer: (id: string) => void;
  onReplay: () => void;
  onNext: () => void;
  /** Bloqueia "Ouvir de novo" enquanto o som toca. */
  replaying?: boolean;
  score: { correct: number; total: number };
  /** 0–1. Padrão 0,8. */
  goal?: number;
  strings?: Partial<Strings["ear"]>;
  className?: string;
};

export function EarTrainer({
  question,
  options,
  status,
  selectedId,
  correctId,
  onAnswer,
  onReplay,
  onNext,
  replaying,
  score,
  goal = 0.8,
  strings: stringsOverride,
  className,
}: EarTrainerProps) {
  const s = { ...defaultStrings.ear, ...stringsOverride };
  const answered = status !== "asking";
  const pct = score.total ? Math.round((score.correct / score.total) * 100) : 0;
  const goalPct = Math.round(goal * 100);
  const reached = score.total > 0 && pct >= goalPct;
  const correctLabel = options.find((o) => o.id === correctId)?.label ?? "";

  return (
    <Panel
      label={s.label}
      data-slot="ear-trainer"
      className={cn("flex flex-col gap-4", className)}
      aside={<span className="font-mono text-sm font-semibold text-fg">{s.score(score.correct, score.total)}</span>}
    >
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-2xl font-bold text-fg">{question}</p>
        <Button variant="secondary" onClick={onReplay} disabled={replaying} className="shrink-0">
          <Volume2 aria-hidden />
          {s.replay}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2" role="group" aria-label={question}>
        {options.map((o) => {
          const isCorrect = answered && o.id === correctId;
          const isWrongPick = answered && o.id === selectedId && o.id !== correctId;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => !answered && onAnswer(o.id)}
              aria-disabled={answered || undefined}
              className={cn(
                "flex min-h-14 items-center justify-between gap-2 rounded-sm border-2 px-3 py-2 text-left text-base font-semibold focus-ring",
                "transition-colors duration-[var(--dur-fast)]",
                !answered && "border-line-strong bg-surface-2 text-fg hover:border-accent",
                answered && !isCorrect && !isWrongPick && "border-line bg-transparent text-muted",
                isCorrect && "border-good bg-good-soft text-fg",
                isWrongPick && "border-bad bg-bad-soft text-fg",
              )}
            >
              <span className="flex flex-col">
                <span>{o.label}</span>
                {o.hint && <span className="text-sm font-normal text-muted">{o.hint}</span>}
              </span>
              {isCorrect && <Check className="size-5 shrink-0 text-good" strokeWidth={3} aria-label={s.correct} />}
              {isWrongPick && <X className="size-5 shrink-0 text-bad" strokeWidth={3} aria-hidden />}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="min-h-0">
        {answered && (
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2.5",
              status === "correct" ? "border-good bg-good-soft" : "border-bad bg-bad-soft",
            )}
          >
            <p className={cn("flex items-center gap-2 font-semibold", status === "correct" ? "text-good" : "text-bad")}>
              {status === "correct" ? <Check className="size-5" strokeWidth={3} aria-hidden /> : <X className="size-5" strokeWidth={3} aria-hidden />}
              {status === "correct" ? s.correct : s.wrong(correctLabel)}
            </p>
            <Button size="sm" onClick={onNext}>
              {s.next}
              <ArrowRight aria-hidden />
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">
            {s.accuracy} <strong className="font-mono text-fg">{pct}%</strong>
          </span>
          <span className={cn("inline-flex items-center gap-1 font-semibold", reached ? "text-good" : "text-muted")}>
            <Target className="size-4" aria-hidden />
            {reached ? s.goalReached : s.goal(goalPct)}
          </span>
        </div>
        <Progress value={pct} goal={goalPct} tone={reached ? "good" : "accent"} aria-label={`${s.accuracy}: ${pct}%. ${s.goal(goalPct)}`} />
      </div>
    </Panel>
  );
}
