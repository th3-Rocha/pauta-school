// src/components/course/LessonBlock.tsx
import * as React from "react";
import { Check, Clock } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../lib/strings";

export type LessonBlockKind = "revisao" | "conceito" | "laboratorio" | "ouvido";

export type LessonBlockProps = {
  /** 1–4: posição fixa do bloco na aula. */
  index: 1 | 2 | 3 | 4;
  kind: LessonBlockKind;
  /** Substitui o título padrão do tipo. */
  title?: string;
  /** Substitui o subtítulo padrão. */
  subtitle?: string;
  /** Duração sugerida em minutos. */
  minutes: number;
  done: boolean;
  onDoneChange: (done: boolean) => void;
  children: React.ReactNode;
  id?: string;
  strings?: Partial<Strings["lesson"]>;
  className?: string;
};

/**
 * Um dos quatro blocos fixos da aula. O número grande funciona como a casa
 * do braço: 01, 02, 03, 04 — o aluno sempre sabe onde está.
 */
export function LessonBlock({
  index,
  kind,
  title,
  subtitle,
  minutes,
  done,
  onDoneChange,
  children,
  id,
  strings: stringsOverride,
  className,
}: LessonBlockProps) {
  const s = { ...defaultStrings.lesson, ...stringsOverride };
  const headingId = React.useId();
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-slot="lesson-block"
      data-done={done || undefined}
      className={cn(
        "scroll-mt-20 rounded-lg border bg-surface transition-colors duration-[var(--dur-base)]",
        done ? "border-line" : "border-line-strong",
        className,
      )}
    >
      <header className="flex items-start gap-3 border-b border-line p-4 sm:gap-4 sm:p-5">
        <span
          aria-hidden
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xs font-mono text-xl font-bold",
            done ? "bg-good-soft text-good" : "bg-fg text-bg",
          )}
        >
          {done ? <Check className="size-6" strokeWidth={3} /> : String(index).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="panel-label flex flex-wrap items-center gap-x-2 text-muted">
            <span>{s.blockNumber(index)}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden />
              {defaultStrings.common.aboutMinutes(minutes)}
            </span>
          </p>
          <h2 id={headingId} className="mt-0.5 font-display text-xl font-bold text-fg sm:text-2xl">
            {title ?? s.blockKinds[kind]}
          </h2>
          <p className="text-sm text-muted">{subtitle ?? s.blockSubtitles[kind]}</p>
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4 sm:p-5">{children}</div>

      <footer className="flex justify-end border-t border-line px-4 py-3 sm:px-5">
        <button
          type="button"
          aria-pressed={done}
          onClick={() => onDoneChange(!done)}
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-sm border px-4 font-semibold focus-ring transition-colors duration-[var(--dur-fast)]",
            done ? "border-good bg-good-soft text-good" : "border-line-strong bg-surface-2 text-fg hover:border-accent",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "flex size-5 items-center justify-center rounded-xs border-2",
              done ? "border-good bg-good text-bg" : "border-line-strong",
            )}
          >
            {done && <Check className="size-3.5" strokeWidth={3.5} />}
          </span>
          {done ? s.done : s.markDone}
        </button>
      </footer>
    </section>
  );
}
