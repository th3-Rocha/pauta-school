// Keyboard lessons in English.
import type { Lesson } from "../../types";
import { KEYBOARD_M01_EN } from "./m01";
import { KEYBOARD_WEEK1_EN } from "./m01-week1";
import { KEYBOARD_WEEK2_EN } from "./m01-week2";
import { KEYBOARD_WEEK3_EN } from "./m01-week3";
import { KEYBOARD_WEEK4_EN } from "./m01-week4";

export const KEYBOARD_LESSONS_EN: Record<number, Lesson> = Object.fromEntries(
  [...KEYBOARD_M01_EN, ...KEYBOARD_WEEK1_EN, ...KEYBOARD_WEEK2_EN, ...KEYBOARD_WEEK3_EN, ...KEYBOARD_WEEK4_EN].map((l) => [l.day, l]),
);
