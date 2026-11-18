import type { Lesson } from "../types";
import { KEYBOARD_M01 } from "./m01";
import { KEYBOARD_WEEK1 } from "./m01-week1";
import { KEYBOARD_WEEK2 } from "./m01-week2";
import { KEYBOARD_WEEK3 } from "./m01-week3";
import { KEYBOARD_WEEK4 } from "./m01-week4";

export const KEYBOARD_LESSONS: Record<number, Lesson> = Object.fromEntries(
  [...KEYBOARD_M01, ...KEYBOARD_WEEK1, ...KEYBOARD_WEEK2, ...KEYBOARD_WEEK3, ...KEYBOARD_WEEK4].map((l) => [l.day, l]),
);
