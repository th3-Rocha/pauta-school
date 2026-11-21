import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Callout } from "../components/ui/Callout";
import { getCourse, registerTitles, type CourseInfo } from "../data/courses";
import type { Lesson as LessonData } from "../lessons/types";
import type { InstrumentId } from "../data/instruments";
import { setActiveInstrument } from "./progress";
import { selectInstrument } from "./instrument";
import { L, localePath, setLocale, type Locale } from "../i18n";
import { Shell } from "./Shell";
import { Lesson } from "../lessons/Lesson";
import { ChimeraDock } from "../components/music/voice/ChimeraDock";

function Soon({ day, course }: { day: number; course: CourseInfo }) {
  const m = course.monthOfDay(day);
  const milestone = course.isMilestoneDay(day);
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <p className="panel-label text-accent">
        {course.name} · {L("Mês", "Month")} {m.month} · {L("Dia", "Day")} {day}
      </p>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
        {milestone ? `${L("Desafio", "Challenge")}: ${m.milestone.title}` : L("Esta aula ainda está sendo escrita", "This lesson is still being written")}
      </h1>
      <p className="text-lg text-muted">
        {milestone ? m.milestone.goal : L(`Ela faz parte do mês "${m.title}".`, `It belongs to the month "${m.title}".`)}
      </p>
      <Callout variant="theory" label={L("O que vem neste mês", "Coming this month")}>
        <p>
          <strong>{L("Teoria", "Theory")}:</strong> {m.theory}
        </p>
        <p>
          <strong>{L("Prática", "Practice")}:</strong> {m.practice}
        </p>
      </Callout>
      <Button variant="secondary" asChild className="self-start">
        <a href={localePath("/")}>
          <ArrowLeft aria-hidden />
          {L("Voltar para o seu ano", "Back to your year")}
        </a>
      </Button>
    </main>
  );
}

export default function LessonApp({
  day,
  instrument = "guitar",
  locale = "pt",
  translated,
  titles,
}: {
  day: number;
  instrument?: InstrumentId;
  locale?: Locale;
  /** Aula já traduzida no build (inglês). Sem ela, usa a aula do curso. */
  translated?: LessonData | null;
  /** Títulos traduzidos, para o curso em inglês. */
  titles?: Record<number, string>;
}) {
  setLocale(locale);
  setActiveInstrument(instrument, { silent: true });
  if (titles) registerTitles(instrument, locale, titles);
  const course = getCourse(instrument);
  const raw = translated ?? course.lessons[day];
  // Toda aula de teclado mostra de onde vêm as notas (MIDI, computador, tela) no primeiro bloco.
  const lesson = React.useMemo(() => {
    if (!raw || instrument !== "keyboard") return raw;
    const has = raw.blocks.some((b) => b.body.some((n) => typeof n === "object" && "w" in n && n.w === "key-input"));
    if (has) return raw;
    const [first, ...rest] = raw.blocks;
    return { ...raw, blocks: [{ ...first, body: [{ w: "key-input" as const }, ...first.body] }, ...rest] as typeof raw.blocks };
  }, [raw, instrument]);
  React.useEffect(() => selectInstrument(instrument), [instrument]);
  // Em inglês, a página manda `translated` quando a aula está traduzida; null = ainda não.
  const untranslated = locale === "en" && !!lesson && translated === null;
  return (
    <Shell>
      {untranslated && (
        <div className="mx-auto w-full max-w-6xl px-4 pt-6">
          <Callout variant="tip" label="Translation in progress">
            <p>
              This lesson hasn't been translated to English yet, so it's shown in Portuguese. The exercises, audio and controls work the same.{" "}
              <a
                className="underline"
                href={`/${instrument}/day/${day}`}
                hrefLang="pt-BR"
                onClick={() => {
                  try {
                    localStorage.setItem("pauta:lang", "pt");
                  } catch {
                    /* sem armazenamento */
                  }
                }}
              >
                Open the Portuguese page
              </a>
              .
            </p>
          </Callout>
        </div>
      )}
      {lesson ? <Lesson lesson={lesson} href={course.href} homeHref={localePath("/")} /> : <Soon day={day} course={course} />}
      {instrument === "voice" && lesson && <ChimeraDock />}
    </Shell>
  );
}
