// SERVER ONLY (imported from .astro pages). Guitar lessons in English: the same lessons as Portuguese, with the text run through a
// PT → EN dictionary per month (en/guitar/mXX.json). A lesson only counts as translated
// when every one of its strings has a translation; otherwise the site shows the Portuguese
// lesson with a notice.
import type { Lesson } from "../types";
import { LESSONS } from "../index";
import { translateLesson } from "./translate";

const files = import.meta.glob<Record<string, string>>("./guitar/m*.json", { eager: true, import: "default" });
const DICT: Record<string, string> = Object.assign({}, ...Object.values(files));

export const LESSONS_EN: Record<number, Lesson> = Object.fromEntries(
  Object.values(LESSONS)
    .map((l) => translateLesson(l, DICT))
    .filter((l): l is Lesson => l !== null)
    .map((l) => [l.day, l]),
);

/** English titles of the translated guitar lessons (small; sent to the English home page). */
export const GUITAR_TITLES_EN: Record<number, string> = Object.fromEntries(Object.values(LESSONS_EN).map((l) => [l.day, l.title]));
