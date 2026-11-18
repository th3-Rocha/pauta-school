import * as React from "react";
import { AppHeader, type Theme } from "../components/course/AppHeader";
import { ProgressCodeDialog } from "../components/course/ProgressCodeDialog";
import { TOTAL_DAYS } from "../data/curriculum";
import { currentDay, decodeProgress, encodeProgress, importProgress, useProgress } from "./progress";

const THEME_KEY = "trastes:theme";

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
      <AppHeader day={day} totalDays={TOTAL_DAYS} onProgressClick={() => setOpen(true)} theme={theme} onThemeChange={setTheme} />
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
          Você está no <strong className="font-mono">dia {day}</strong> e concluiu{" "}
          <strong className="font-mono">{progress.completed.length}</strong> {progress.completed.length === 1 ? "aula" : "aulas"}.
        </p>
      </ProgressCodeDialog>
    </>
  );
}
