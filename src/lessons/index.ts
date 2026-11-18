import type { Lesson } from "./types";
import { DIAS_1_A_15 } from "./m01/semana1e2";
import { DIAS_16_A_30 } from "./m01/semana3e4";

export const LESSONS: Record<number, Lesson> = Object.fromEntries([...DIAS_1_A_15, ...DIAS_16_A_30].map((l) => [l.day, l]));
