import type { Lesson } from "./types";
import { DAYS_1_TO_15 } from "./guitar/m01/weeks1-2";
import { DAYS_16_TO_30 } from "./guitar/m01/weeks3-4";

export const LESSONS: Record<number, Lesson> = Object.fromEntries([...DAYS_1_TO_15, ...DAYS_16_TO_30].map((l) => [l.day, l]));
