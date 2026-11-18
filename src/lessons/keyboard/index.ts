import type { Lesson } from "../types";
import { KEYBOARD_M01 } from "./m01";

export const KEYBOARD_LESSONS: Record<number, Lesson> = Object.fromEntries(KEYBOARD_M01.map((l) => [l.day, l]));
