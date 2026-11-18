// Idioma da página. Cada página chama setLocale antes de renderizar; o português
// fica na raiz ("/") e o inglês em "/en".
import { applyLocaleStrings } from "../lib/strings";
import { setDefaultNoteNames } from "../lib/piano";

export type Locale = "pt" | "en";

let current: Locale = "pt";

export const getLocale = (): Locale => current;

export function setLocale(locale: Locale) {
  current = locale;
  applyLocaleStrings(locale);
  setDefaultNoteNames(locale === "en" ? "letters" : "solfege");
}

/** Escolhe o texto do idioma atual: L("Ouvir", "Listen"). */
export const L = <T,>(pt: T, en: T): T => (current === "en" ? en : pt);

/** Caminho no idioma atual: "/setup" vira "/en/setup" em inglês. */
export function localePath(path: string, locale: Locale = current): string {
  if (locale === "pt") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

/** O mesmo endereço no outro idioma (para o botão PT / EN). */
export function switchLocalePath(pathname: string, to: Locale): string {
  const bare = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return localePath(bare, to);
}
