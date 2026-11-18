import * as React from "react";
import { L, getLocale, localePath, switchLocalePath } from "../i18n";
import { AppHeader, type Theme } from "../components/course/AppHeader";
import { ProgressCodeDialog } from "../components/course/ProgressCodeDialog";
import { TOTAL_DAYS } from "../data/curriculum";
import { currentDay, decodeProgress, encodeProgress, importProgress, useProgress } from "./progress";

const THEME_KEY = "trastes:theme";

/** Link para a mesma página no outro idioma. */
function LangSwitch() {
  const other = getLocale() === "en" ? "pt" : "en";
  const [href, setHref] = React.useState(localePath("/", other));
  React.useEffect(() => setHref(switchLocalePath(window.location.pathname, other) + window.location.search), [other]);
  return (
    <a
      href={href}
      hrefLang={other === "en" ? "en" : "pt-BR"}
      aria-label={other === "en" ? "Read in English" : "Ler em português"}
      className="inline-flex h-10 items-center rounded-sm px-2.5 font-mono text-sm font-bold text-muted hover:bg-surface-2 hover:text-fg focus-ring"
    >
      {other === "en" ? "EN" : "PT"}
    </a>
  );
}

function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setTheme] = React.useState<Theme>("dark");
  React.useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "light" || t === "dark") setTheme(t);
  }, []);
  const change = (t: Theme) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      /* sem armazenamento: vale só nesta visita */
    }
  };
  return [theme, change];
}

/** Cabeçalho, troca de tema e diálogo do código de progresso. Envolve toda página. */
export function Shell({ children }: { children: React.ReactNode }) {
  const progress = useProgress();
  const [theme, setTheme] = useTheme();
  const [open, setOpen] = React.useState(false);
  const day = currentDay(progress);
  const code = React.useMemo(() => encodeProgress(progress), [progress]);

  return (
    <>
      <AppHeader
        day={day}
        totalDays={TOTAL_DAYS}
        onProgressClick={() => setOpen(true)}
        theme={theme}
        onThemeChange={setTheme}
        homeHref={localePath("/")}
        actions={<LangSwitch />}
      />
      {children}
      <ProgressCodeDialog
        open={open}
        onOpenChange={setOpen}
        code={code}
        parseCode={(c) => {
          const d = decodeProgress(c);
          if (!d) return null;
          return { day: currentDay({ completed: d.completed, blocks: {}, checks: {}, bestBpm: {} }), completed: d.completed.length };
        }}
        onImport={(c) => {
          if (importProgress(c)) setOpen(false);
        }}
      >
        <p className="text-base text-fg">
          {L("Você está no", "You are on")} <strong className="font-mono">{L("dia", "day")} {day}</strong> {L("e concluiu", "and finished")}{" "}
          <strong className="font-mono">{progress.completed.length}</strong>{" "}
          {progress.completed.length === 1 ? L("aula", "lesson") : L("aulas", "lessons")}.
        </p>
      </ProgressCodeDialog>
    </>
  );
}
