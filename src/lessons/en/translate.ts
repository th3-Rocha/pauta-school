// Gera a versão em inglês de uma aula aplicando um dicionário português → inglês.
// Exercícios, tablaturas e bases são os mesmos; só o texto muda.
import type { Lesson } from "../types";

/** Chaves cujo valor não é texto para o aluno (iguais às do script de extração). */
const SKIP = new Set(["w", "kind", "feel", "chord", "chords", "options", "backing", "strokes", "t", "id", "markers", "notes", "measures", "melody", "shape", "zones", "positions", "targets", "callout", "clef", "names", "hand", "modes", "defaultMode", "auto", "target"]);

const isText = (s: string) => /[a-zà-ú]/i.test(s);

/** Traduz a aula; devolve null se algum texto ainda não tem tradução. */
export function translateLesson(lesson: Lesson, dict: Record<string, string>): Lesson | null {
  let missing = false;
  const map = (v: unknown, key?: string): unknown => {
    if (key && SKIP.has(key)) return v;
    if (typeof v === "string") {
      if (!isText(v)) return v;
      const t = dict[v];
      if (t === undefined) missing = true;
      return t ?? v;
    }
    if (Array.isArray(v)) return v.map((x) => map(x));
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, map(x, k)]));
    return v;
  };
  const out = { ...lesson, title: map(lesson.title) as string, objectives: map(lesson.objectives) as string[], blocks: map(lesson.blocks) as Lesson["blocks"] };
  return missing ? null : out;
}
