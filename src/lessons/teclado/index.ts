import type { Lesson } from "../types";
import { TECLADO_M01 } from "./m01";

export const LESSONS_TECLADO: Record<number, Lesson> = Object.fromEntries(TECLADO_M01.map((l) => [l.day, l]));
