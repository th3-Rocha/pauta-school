// src/components/course/AppHeader.tsx
import { BarChart3, Moon, Sun } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { Button } from "../ui/Button";

export type Theme = "dark" | "light";

export type AppHeaderProps = {
  courseName?: string;
  /** Link do nome do curso (o Astro cuida da navegação). */
  homeHref?: string;
  day: number;
  totalDays?: number;
  onProgressClick: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  /** Gruda no topo ao rolar. */
  sticky?: boolean;
  strings?: Partial<Strings["appHeader"]>;
  className?: string;
};

/** Marca: as cinco linhas da pauta com uma nota. Desenho próprio da Pauta. */
export function PautaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={cn("size-7", className)} aria-hidden>
      <rect x="1" y="3" width="26" height="22" rx="4" fill="var(--wood)" />
      {[8, 11.5, 15, 18.5, 22].map((y) => (
        <line key={y} x1="4" y1={y} x2="24" y2={y} stroke="var(--fret)" strokeWidth="0.9" />
      ))}
      <ellipse cx="12" cy="18.5" rx="3.1" ry="2.3" transform="rotate(-20 12 18.5)" fill="var(--pearl)" />
      <line x1="14.8" y1="17.8" x2="14.8" y2="6" stroke="var(--pearl)" strokeWidth="1.3" />
      <path d="M14.8 6 q3.5 1.5 4.2 5" stroke="var(--pearl)" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

export function AppHeader({
  courseName = "Pauta",
  homeHref = "/",
  day,
  totalDays = 365,
  onProgressClick,
  theme,
  onThemeChange,
  sticky = true,
  strings: stringsOverride,
  className,
}: AppHeaderProps) {
  const s = { ...defaultStrings.appHeader, ...stringsOverride };
  const pct = Math.round((Math.min(day, totalDays) / totalDays) * 100);
  return (
    <header
      data-slot="app-header"
      className={cn(
        "z-40 border-b border-line bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/85",
        sticky && "sticky top-0",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
        <a href={homeHref} aria-label={s.home} className="flex items-center gap-2 rounded-sm focus-ring">
          <PautaMark />
          <span className="font-display text-xl font-extrabold tracking-tight text-fg">{courseName}</span>
        </a>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" onClick={onProgressClick} aria-label={`${s.progressAria}. ${s.day(day, totalDays)}`} className="gap-2.5 px-2.5 sm:px-3">
            <span className="flex flex-col items-end leading-none">
              <span className="font-mono text-sm font-bold text-fg">
                <span className="sm:hidden">{s.dayShort(day)}</span>
                <span className="hidden sm:inline">{s.day(day, totalDays)}</span>
              </span>
              <span aria-hidden className="mt-1.5 block h-1 w-16 overflow-hidden rounded-full bg-surface-2">
                <span className="block h-full bg-accent" style={{ width: `${pct}%` }} />
              </span>
            </span>
            <BarChart3 className="text-muted" aria-hidden />
            <span className="sr-only">{s.progress}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? s.themeToLight : s.themeToDark}
          >
            {theme === "dark" ? <Sun aria-hidden /> : <Moon aria-hidden />}
          </Button>
        </div>
      </div>
    </header>
  );
}
