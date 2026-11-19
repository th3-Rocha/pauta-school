import type { Lesson } from "./types";
import { DAYS_1_TO_15 } from "./guitar/m01/weeks1-2";
import { DAYS_16_TO_30 } from "./guitar/m01/weeks3-4";
import { MONTH_2 } from "./guitar/m02";
import { MONTH_3 } from "./guitar/m03";
import { MONTH_4 } from "./guitar/m04";
import { MONTH_5 } from "./guitar/m05";
import { MONTH_6 } from "./guitar/m06";
import { MONTH_7 } from "./guitar/m07";
import { MONTH_8 } from "./guitar/m08";
import { MONTH_9 } from "./guitar/m09";
import { MONTH_10 } from "./guitar/m10";
import { MONTH_11 } from "./guitar/m11";
import { MONTH_12 } from "./guitar/m12";

export const LESSONS: Record<number, Lesson> = Object.fromEntries([...DAYS_1_TO_15, ...DAYS_16_TO_30, ...MONTH_2, ...MONTH_3, ...MONTH_4, ...MONTH_5, ...MONTH_6, ...MONTH_7, ...MONTH_8, ...MONTH_9, ...MONTH_10, ...MONTH_11, ...MONTH_12].map((l) => [l.day, l]));
