// Um curso por instrumento: meses, aulas e endereços, em cada idioma.
import type { Lesson } from "../lessons/types";
import { LESSONS } from "../lessons";
import { LESSONS_EN } from "../lessons/en";
import { KEYBOARD_LESSONS } from "../lessons/keyboard";
import { KEYBOARD_LESSONS_EN } from "../lessons/keyboard/en";
import { MONTHS, type Month } from "./curriculum";
import { GUITAR_MONTHS_EN } from "./curriculum-en";
import { KEYBOARD_MONTHS } from "./curriculum-keyboard";
import { KEYBOARD_MONTHS_EN } from "./curriculum-keyboard-en";
import type { InstrumentId } from "./instruments";
import { getLocale, localePath, type Locale } from "../i18n";

type CourseText = {
  name: string;
  /** Completa "Uma aula por dia, uns 30 minutos …" */
  pitch: string;
  months: Month[];
  lessons: Record<number, Lesson>;
};

type CourseDef = { instrument: InstrumentId; path: string; pt: CourseText; en: CourseText };

function make(def: CourseDef, locale: Locale) {
  const c = def[locale];
  const titles: Record<number, string> = Object.fromEntries(Object.values(c.lessons).map((l) => [l.day, l.title]));
  return {
    instrument: def.instrument,
    ...c,
    titles,
    href: (day: number) => localePath(`/${def.path}/day/${day}`, locale),
    hasLesson: (day: number) => day in titles,
    monthOfDay: (day: number) => c.months.find((m) => day >= m.firstDay && day <= m.lastDay) ?? c.months[0],
    isMilestoneDay: (day: number) => c.months.some((m) => m.lastDay === day),
  };
}

export type CourseInfo = ReturnType<typeof make>;

const DEFS: Partial<Record<InstrumentId, CourseDef>> = {
  guitar: {
    instrument: "guitar",
    path: "guitar",
    pt: { name: "Guitarra", pitch: "com a guitarra no colo", months: MONTHS, lessons: LESSONS },
    en: { name: "Guitar", pitch: "with the guitar on your lap", months: GUITAR_MONTHS_EN, lessons: LESSONS_EN },
  },
  keyboard: {
    instrument: "keyboard",
    path: "keyboard",
    pt: { name: "Teclado", pitch: "sentado ao teclado", months: KEYBOARD_MONTHS, lessons: KEYBOARD_LESSONS },
    en: { name: "Keyboard", pitch: "at the keyboard", months: KEYBOARD_MONTHS_EN, lessons: KEYBOARD_LESSONS_EN },
  },
};

const cache = new Map<string, CourseInfo>();

/** O curso no idioma atual (ou no pedido). */
export function getCourse(id: InstrumentId, locale: Locale = getLocale()): CourseInfo {
  const def = DEFS[id] ?? DEFS.guitar!;
  const key = `${def.instrument}:${locale}`;
  if (!cache.has(key)) cache.set(key, make(def, locale));
  return cache.get(key)!;
}
