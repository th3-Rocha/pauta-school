import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Callout } from "../components/ui/Callout";
import { getCourse, type CourseInfo } from "../data/courses";
import type { InstrumentId } from "../data/instruments";
import { setActiveInstrument } from "./progress";
import { selectInstrument } from "./instrument";
import { Shell } from "./Shell";
import { Lesson } from "../lessons/Lesson";

function Soon({ day, course }: { day: number; course: CourseInfo }) {
  const m = course.monthOfDay(day);
  const milestone = course.isMilestoneDay(day);
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <p className="panel-label text-accent">
        {course.name} · Mês {m.month} · Dia {day}
      </p>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
        {milestone ? `Desafio: ${m.milestone.title}` : "Esta aula ainda está sendo escrita"}
      </h1>
      <p className="text-lg text-muted">
        {milestone ? m.milestone.goal : `Ela faz parte do mês "${m.title}".`}
      </p>
      <Callout variant="theory" label="O que vem neste mês">
        <p>
          <strong>Teoria:</strong> {m.theory}
        </p>
        <p>
          <strong>Prática:</strong> {m.practice}
        </p>
      </Callout>
      <Button variant="secondary" asChild className="self-start">
        <a href="/">
          <ArrowLeft aria-hidden />
          Voltar para o seu ano
        </a>
      </Button>
    </main>
  );
}

export default function LessonApp({ day, instrument = "guitar" }: { day: number; instrument?: InstrumentId }) {
  setActiveInstrument(instrument, { silent: true });
  const course = getCourse(instrument);
  const lesson = course.lessons[day];
  React.useEffect(() => selectInstrument(instrument), [instrument]);
  return <Shell>{lesson ? <Lesson lesson={lesson} href={course.href} /> : <Soon day={day} course={course} />}</Shell>;
}
