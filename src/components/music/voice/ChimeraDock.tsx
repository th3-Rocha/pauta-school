// src/components/music/voice/ChimeraDock.tsx
// A janelinha do Chimera que acompanha a aula de canto: fica no canto da tela,
// abre sozinha quando o Chimera canta (se nenhum monitor da aula estiver à vista)
// e mostra a nota e a sílaba que ele está cantando. Minimizada, vira uma pílula.
import * as React from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "../../../lib/cn";
import { voiceNoteName } from "../../../lib/voice";
import { useGuideNow } from "../../../app/voice";
import { getLocale, L } from "../../../i18n";
import { ChimeraHead, loadChimera, useInlineHeadVisible, type ChimeraModules } from "./ChimeraLive";

const KEY = "pauta:voice:dock";

export function ChimeraDock() {
  const guide = useGuideNow();
  const inlineVisible = useInlineHeadVisible();
  const [mods, setMods] = React.useState<ChimeraModules | null>(null);
  /** "auto": abre quando ele canta; "open": sempre aberta; "min": só a pílula. */
  const [pref, setPref] = React.useState<"auto" | "open" | "min">(() => {
    try {
      return (localStorage.getItem(KEY) as "auto" | "open" | "min" | null) ?? "auto";
    } catch {
      return "auto";
    }
  });
  const [lastSung, setLastSung] = React.useState<number>(0);

  const save = (p: typeof pref) => {
    setPref(p);
    try {
      localStorage.setItem(KEY, p);
    } catch {
      /* sem armazenamento */
    }
  };

  // o motor só carrega quando o Chimera canta pela primeira vez (ou a janela é aberta)
  React.useEffect(() => {
    if (mods || (!guide && pref !== "open")) return;
    loadChimera().then(setMods, () => {});
  }, [guide, pref, mods]);

  React.useEffect(() => {
    if (guide) setLastSung(Date.now());
  }, [guide]);

  // aberta: sempre que o aluno pediu, ou no automático enquanto canta e alguns segundos depois
  const [, tick] = React.useReducer((x: number) => x + 1, 0);
  React.useEffect(() => {
    if (!lastSung) return;
    const id = window.setTimeout(tick, 4000);
    return () => clearTimeout(id);
  }, [lastSung]);
  const recent = !!guide || Date.now() - lastSung < 4000;
  const open = !!mods && (pref === "open" || (pref === "auto" && recent && !inlineVisible));
  const note = guide ? voiceNoteName(guide.midi, getLocale()) : null;

  if (!mods && pref !== "open") return null;

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-40 flex justify-end sm:inset-x-auto sm:right-5 sm:bottom-5">
      {open && mods ? (
        <div
          role="region"
          aria-label={L("Chimera, a voz-guia", "Chimera, the guide voice")}
          className="pointer-events-auto w-full overflow-hidden rounded-lg bg-[var(--stage-frame)] p-1.5 shadow-2xl ring-1 ring-black/40 sm:w-[400px] motion-safe:animate-cameo-in"
        >
          <div className="relative flex flex-row-reverse overflow-hidden rounded-md bg-[var(--stage-bg)] ring-1 ring-[var(--stage-line)] sm:flex-col">
            <div className="flex flex-1 items-start justify-between gap-2 p-2">
              <div className="flex min-h-14 flex-col">
                <span className="stage-text text-[11px]">Chimera</span>
                <span className="font-mono text-3xl font-semibold leading-tight text-[var(--stage-sound)] [text-shadow:0_0_10px_var(--stage-sound-glow)]" aria-live="polite">
                  {note ?? "·"}
                </span>
                {guide?.syllable && <span className="font-mono text-base text-[var(--stage-text)]">{guide.syllable}</span>}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  aria-pressed={pref === "open"}
                  title={pref === "open" ? L("Abrir só quando ele canta", "Open only when it sings") : L("Deixar sempre aberta", "Keep it open")}
                  onClick={() => save(pref === "open" ? "auto" : "open")}
                  className="stage-text inline-flex size-9 items-center justify-center rounded-[2px] border border-[var(--stage-body-dim)] text-[var(--stage-body)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--stage-sound)]"
                >
                  <Maximize2 className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  title={L("Minimizar", "Minimize")}
                  onClick={() => save("min")}
                  className="stage-text inline-flex size-9 items-center justify-center rounded-[2px] border border-[var(--stage-body-dim)] text-[var(--stage-body)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--stage-sound)]"
                >
                  <Minimize2 className="size-4" aria-hidden />
                </button>
              </div>
            </div>
            <ChimeraHead mods={mods} view="2d" inline={false} className="chimera-views relative size-[150px] shrink-0 sm:h-[340px] sm:w-full" />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => save("open")}
          className={cn(
            "pointer-events-auto inline-flex h-11 items-center gap-2 rounded-full bg-[var(--stage-frame)] px-4 shadow-lg ring-1 ring-[var(--stage-line)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--stage-sound)]",
            guide && "ring-2 ring-[var(--stage-sound)]",
          )}
        >
          <span aria-hidden className={cn("size-2 rounded-full", guide ? "bg-[var(--stage-sound)] shadow-[0_0_6px_var(--stage-sound)]" : "bg-[var(--stage-body)]")} />
          <span className="stage-text text-xs">Chimera{note ? ` · ${note}` : ""}</span>
        </button>
      )}
    </div>
  );
}
