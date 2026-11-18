// src/components/music/keyboard/ChordCheck.tsx
// Confere o acorde que o aluno segura contra o alvo. Substitui o PitchMeter no
// teclado: em vez de afinação, notas certas, faltando e sobrando.
import * as React from "react";
import { Check, CircleDashed, Hand as HandIcon, Plus, X } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { compareChord, noteName, type Accidentals, type NoteNames, defaultNoteNames } from "../../../lib/piano";
import { Panel } from "../controls";
import type { MarkerKind } from "../markers";
import { Keyboard } from "./Keyboard";
import { kindFromDegree } from "./KeyChord";

export type ChordTarget = {
  /** "C maior" ou "C" */
  name: string;
  /** "1ª inversão" — entra no resultado. */
  inversion?: string;
  /** Notas do alvo (MIDI). Em `pitch-class`, a oitava só importa para o baixo. */
  notes: number[];
  /** Graus, na mesma ordem de `notes`, para colorir os marcadores. */
  degrees?: string[];
};

export type ChordCheckProps = {
  target: ChordTarget;
  /** Notas seguradas agora. */
  held: number[];
  /** `pitch-class` aceita qualquer oitava (o baixo confere a inversão); `exact` exige as mesmas teclas. */
  mode?: "pitch-class" | "exact";
  /** Há uma entrada capaz de acorde (MIDI ou tela)? Sem ela, mostra o estado vazio. */
  inputReady?: boolean;
  /** Teclado de apoio com o alvo e o que está pressionado. */
  showKeyboard?: boolean;
  noteNames?: NoteNames;
  naming?: Accidentals;
  onPress?: (midi: number) => void;
  onRelease?: (midi: number) => void;
  strings?: Partial<Strings["chordCheck"]>;
  className?: string;
};

export function ChordCheck({
  target,
  held,
  mode = "pitch-class",
  inputReady = true,
  showKeyboard = true,
  noteNames = defaultNoteNames(),
  naming = "sharp",
  onPress,
  onRelease,
  strings: stringsOverride,
  className,
}: ChordCheckProps) {
  const s = { ...defaultStrings.chordCheck, ...stringsOverride };
  const r = compareChord(target.notes, held, mode);
  const nm = (m: number) => noteName(m, noteNames, naming);
  const full = [target.name, target.inversion].filter(Boolean).join(", ");
  const lo = Math.min(...target.notes, ...held) - 5;
  const hi = Math.max(...target.notes, ...held) + 5;
  const markers = target.notes.map((midi, i) => ({
    midi,
    kind: (target.degrees ? kindFromDegree(target.degrees[i]) : "in") as MarkerKind,
    label: target.degrees?.[i],
  }));

  let result: { tone: "good" | "bad" | "warn" | "muted"; icon: React.ReactNode; text: string };
  if (held.length === 0) result = { tone: "muted", icon: <HandIcon aria-hidden />, text: s.waiting };
  else if (r.ok) result = { tone: "good", icon: <Check strokeWidth={3} aria-hidden />, text: s.ok(full) };
  else if (r.missing.length === 0 && r.extra.length === 0 && !r.bassOk)
    result = { tone: "warn", icon: <CircleDashed strokeWidth={2.5} aria-hidden />, text: s.wrongBass(nm(Math.min(...target.notes))) };
  else
    result = {
      tone: "bad",
      icon: <X strokeWidth={3} aria-hidden />,
      text: [r.missing.length ? s.missingList(r.missing.map(nm).join(", ")) : "", r.extra.length ? s.extraList(r.extra.map(nm).join(", ")) : ""]
        .filter(Boolean)
        .join(" "),
    };

  const toneClass = { good: "bg-good-soft text-good", bad: "bg-bad-soft text-bad", warn: "bg-warn-soft text-warn", muted: "bg-surface-2 text-muted" }[result.tone];

  return (
    <Panel label={s.label} className={cn("max-w-2xl", className)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <span className="panel-label text-muted">{s.target}</span>
          <span className="font-display text-2xl font-bold text-fg">{target.name}</span>
          {target.inversion && <span className="text-base font-semibold text-fg">{target.inversion}</span>}
        </div>

        {!inputReady ? (
          <div className="flex gap-3 rounded-md border border-dashed border-line-strong p-4">
            <HandIcon className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden />
            <div>
              <p className="font-semibold text-fg">{s.emptyTitle}</p>
              <p className="text-sm text-muted">{s.emptyBody}</p>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex flex-wrap gap-2" aria-label={s.holding}>
              {target.notes.map((m) => {
                const ok = r.correct.includes(m);
                return (
                  <li
                    key={`t${m}`}
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 rounded-xs border px-2.5 font-mono text-sm font-bold",
                      ok ? "border-good bg-good-soft text-good" : "border-dashed border-line-strong text-muted",
                    )}
                  >
                    {ok ? <Check className="size-4" strokeWidth={3} aria-hidden /> : <CircleDashed className="size-4" aria-hidden />}
                    {nm(m)}
                    <span className="sr-only">, {ok ? s.correct : s.missing}</span>
                  </li>
                );
              })}
              {r.extra.map((m) => (
                <li key={`x${m}`} className="inline-flex h-9 items-center gap-1.5 rounded-xs border border-bad bg-bad-soft px-2.5 font-mono text-sm font-bold text-bad">
                  <Plus className="size-4" strokeWidth={3} aria-hidden />
                  {nm(m)}
                  <span className="sr-only">, {s.extra}</span>
                </li>
              ))}
            </ul>

            <p className={cn("flex items-center gap-2 rounded-sm px-3 py-2.5 text-base font-semibold [&_svg]:size-5 [&_svg]:shrink-0", toneClass)} aria-live="polite">
              {result.icon}
              {result.text}
            </p>

            {showKeyboard && (
              <Keyboard
                from={lo}
                to={hi}
                markers={markers}
                pressed={held}
                feedback={mode === "exact" && held.length ? "result" : "off"}
                showNoteNames="c-only"
                noteNames={noteNames}
                naming={naming}
                octaveNav={false}
                onPress={onPress}
                onRelease={onRelease}
              />
            )}
          </>
        )}
      </div>
    </Panel>
  );
}
