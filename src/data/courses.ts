// Um curso por instrumento: meses, aulas e endereços.
import type { Lesson } from "../lessons/types";
import { LESSONS } from "../lessons";
import { LESSONS_TECLADO } from "../lessons/teclado";
import { MONTHS, type Month } from "./curriculum";
import { MONTHS_TECLADO } from "./curriculum-teclado";
import type { InstrumentId } from "./instruments";

export type Course = {
  instrument: InstrumentId;
  name: string;
  /** "guitarra no colo", "no teclado": completa "Uma aula por dia, ~30 minutos …" */
  pitch: string;
  months: Month[];
  lessons: Record<number, Lesson>;
  href: (day: number) => string;
};

function make(c: Course) {
  const titles: Record<number, string> = Object.fromEntries(Object.values(c.lessons).map((l) => [l.day, l.title]));
  return {
    ...c,
    titles,
    hasLesson: (day: number) => day in titles,
    monthOfDay: (day: number) => c.months.find((m) => day >= m.firstDay && day <= m.lastDay) ?? c.months[0],
    isMilestoneDay: (day: number) => c.months.some((m) => m.lastDay === day),
  };
}

export type CourseInfo = ReturnType<typeof make>;

export const COURSES: Partial<Record<InstrumentId, CourseInfo>> = {
  guitarra: make({
    instrument: "guitarra",
    name: "Guitarra",
    pitch: "com a guitarra no colo",
    months: MONTHS,
    lessons: LESSONS,
    href: (d) => `/dia/${d}`,
  }),
  teclado: make({
    instrument: "teclado",
    name: "Teclado",
    pitch: "sentado ao teclado",
    months: MONTHS_TECLADO,
    lessons: LESSONS_TECLADO,
    href: (d) => `/teclado/dia/${d}`,
  }),
};

export function getCourse(id: InstrumentId): CourseInfo {
  return COURSES[id] ?? COURSES.guitarra!;
}
