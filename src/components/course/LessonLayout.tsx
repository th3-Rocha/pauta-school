// src/components/course/LessonLayout.tsx
import * as React from "react";
import { Check, Clock, Target } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { Button } from "../ui/Button";
import { LessonBlock, type LessonBlockKind } from "./LessonBlock";

export type LessonBlockData = {
  kind: LessonBlockKind;
  minutes: number;
  done: boolean;
  title?: string;
  subtitle?: string;
  content: React.ReactNode;
};

export type LessonLayoutProps = {
  month: number;
  day: number;
  title: string;
  /** Tempo total estimado, em minutos. */
  estimatedMinutes: number;
  objectives: string[];
  /** Exatamente 4, nesta ordem: revisão, conceito, laboratório, ouvido. */
  blocks: [LessonBlockData, LessonBlockData, LessonBlockData, LessonBlockData];
  onBlockDoneChange: (index: number, done: boolean) => void;
  onComplete: () => void;
  completed?: boolean;
  /** Deixa concluir sem marcar os 4 blocos. Padrão: false. */
  allowIncomplete?: boolean;
  completing?: boolean;
  /** Conteúdo extra antes do botão final (ex.: SelfCheck). */
  footer?: React.ReactNode;
  strings?: Partial<Strings["lesson"]>;
  className?: string;
};

export function LessonLayout({
  month,
  day,
  title,
  estimatedMinutes,
  objectives,
  blocks,
  onBlockDoneChange,
  onComplete,
  completed = false,
  allowIncomplete = false,
  completing,
  footer,
  strings: stringsOverride,
  className,
}: LessonLayoutProps) {
  const s = { ...defaultStrings.lesson, ...stringsOverride };
  const doneCount = blocks.filter((b) => b.done).length;
  const canComplete = allowIncomplete || doneCount === blocks.length;
  const hintId = React.useId();
  const blockId = (i: number) => `bloco-${day}-${i + 1}`;

  // Bloco na tela agora, para destacar no roteiro lateral.
  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => {
    const els = blocks.map((_, i) => document.getElementById(blockId(i))).filter(Boolean) as HTMLElement[];
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setCurrent(els.indexOf(vis.target as HTMLElement));
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, blocks.length]);

  const outlineLabel = (b: LessonBlockData) => b.title ?? s.blockKinds[b.kind];

  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 py-6 sm:py-10 xl:grid xl:grid-cols-[13rem_minmax(0,1fr)] xl:gap-10", className)}>
      {/* Roteiro lateral (telas grandes): acompanha a rolagem */}
      <aside className="hidden xl:block" aria-label={s.outline}>
        <nav className="sticky top-24 flex flex-col gap-2">
          <p className="panel-label text-muted">{s.outline}</p>
          <ol className="flex flex-col gap-1.5">
            {blocks.map((b, i) => (
              <li key={i}>
                <a
                  href={`#${blockId(i)}`}
                  aria-current={i === current ? "step" : undefined}
                  className={cn(
                    "flex flex-col gap-0.5 rounded-xs border-l-[3px] px-3 py-2 focus-ring transition-colors",
                    i === current ? "border-accent bg-surface" : "border-line hover:bg-surface",
                  )}
                >
                  <span className={cn("flex items-center gap-1 font-mono text-xs font-bold", b.done ? "text-good" : "text-muted")}>
                    {b.done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : null}
                    {String(i + 1).padStart(2, "0")} · {b.minutes}′
                  </span>
                  <span className="text-sm font-semibold leading-tight text-fg">{outlineLabel(b)}</span>
                </a>
              </li>
            ))}
          </ol>
          <p className="text-sm text-muted" aria-live="polite">
            {s.blocksDone(doneCount, blocks.length)}
          </p>
        </nav>
      </aside>

    <article data-slot="lesson-layout" className="flex w-full min-w-0 flex-col gap-6">
      <header className="flex max-w-3xl flex-col gap-4">
        <p className="panel-label text-accent">{s.monthDay(month, day)}</p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{title}</h1>
        <p className="inline-flex items-center gap-2 text-base text-muted">
          <Clock className="size-4" aria-hidden />
          <span className="sr-only">{s.estimatedLabel}:</span>
          <span className="font-mono font-semibold text-fg">{s.estimated(estimatedMinutes)}</span>
        </p>
        {objectives.length > 0 && (
          <div className="rounded-md border border-line bg-surface p-4">
            <h2 className="panel-label mb-2 flex items-center gap-1.5 text-muted">
              <Target className="size-3.5" aria-hidden />
              {s.objectives}
            </h2>
            <ul className="flex flex-col gap-1.5">
              {objectives.map((o, i) => (
                <li key={i} className="flex gap-2.5 text-base text-fg">
                  <span aria-hidden className="mt-2.5 h-[3px] w-3 shrink-0 rounded-[1px] bg-fret" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Roteiro: os 4 blocos como trastes (no topo, até a lateral aparecer) */}
        <nav aria-label={s.outline} className="xl:hidden">
          <ol className="grid grid-cols-4 gap-1.5">
            {blocks.map((b, i) => (
              <li key={i}>
                <a
                  href={`#${blockId(i)}`}
                  className={cn(
                    "flex h-full min-h-14 flex-col justify-between rounded-xs border px-2 py-1.5 focus-ring transition-colors",
                    b.done ? "border-transparent bg-good-soft" : "border-line-strong bg-surface hover:border-accent",
                  )}
                >
                  <span className={cn("flex items-center gap-1 font-mono text-xs font-bold", b.done ? "text-good" : "text-muted")}>
                    {b.done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : null}
                    {String(i + 1).padStart(2, "0")}
                    <span className="hidden font-normal sm:inline">· {b.minutes}′</span>
                  </span>
                  <span className="text-xs font-semibold leading-tight text-fg sm:text-sm">{outlineLabel(b)}</span>
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-sm text-muted" aria-live="polite">
            {s.blocksDone(doneCount, blocks.length)}
          </p>
        </nav>
      </header>

      {blocks.map((b, i) => (
        <LessonBlock
          key={i}
          id={blockId(i)}
          index={(i + 1) as 1 | 2 | 3 | 4}
          kind={b.kind}
          title={b.title}
          subtitle={b.subtitle}
          minutes={b.minutes}
          done={b.done}
          onDoneChange={(d) => onBlockDoneChange(i, d)}
          strings={stringsOverride}
        >
          {b.content}
        </LessonBlock>
      ))}

      {footer}

      <footer className="flex flex-col items-stretch gap-2 border-t border-line pt-6 sm:items-end">
        {completed ? (
          <p className="inline-flex h-13 items-center justify-center gap-2 rounded-sm bg-good-soft px-6 text-lg font-semibold text-good">
            <Check className="size-5" strokeWidth={3} aria-hidden />
            {s.completed}
          </p>
        ) : (
          <>
            <Button size="lg" onClick={onComplete} disabled={!canComplete} loading={completing} aria-describedby={!canComplete ? hintId : undefined}>
              {s.complete}
            </Button>
            {!canComplete && (
              <p id={hintId} className="text-sm text-muted sm:text-right">
                {s.completeHint}
              </p>
            )}
          </>
        )}
      </footer>
    </article>
    </div>
  );
}
