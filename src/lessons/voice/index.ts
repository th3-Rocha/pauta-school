import type { Lesson } from "../types";
import { VOICE_M01_A } from "./m01-a";
import { VOICE_M01_B } from "./m01-b";

export const VOICE_LESSONS: Record<number, Lesson> = Object.fromEntries([...VOICE_M01_A, ...VOICE_M01_B].map((l) => [l.day, l]));
