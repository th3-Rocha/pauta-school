// Widgets das aulas de teclado. Todos ouvem a mesma entrada (MIDI, computador ou tela).
import * as React from "react";
import { Play, RotateCcw, Settings2 } from "lucide-react";
import { Keyboard, type HandZone, type KeyMarker } from "../../components/music/keyboard/Keyboard";
import { MidiStatus, type InputSource } from "../../components/music/keyboard/MidiStatus";
import { HandPosition, type HandPlacement } from "../../components/music/keyboard/HandPosition";
import { EarTrainer } from "../../components/music/EarTrainer";
import { Panel } from "../../components/music/controls";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Progress } from "../../components/ui/Progress";
import { activateExercise, connectMidi, onNote, press, release, useKeyInput } from "../../app/key-input";
import { playKey, playSequence } from "../../app/piano-audio";
import { noteName, type Finger, type Hand } from "../../lib/piano";
import { md } from "../md";

const pc = (m: number) => ((m % 12) + 12) % 12;

/** Só um exercício ouve o teclado por vez. Clicar dentro dele ou em "Começar" ativa. */
function useExercise() {
  const id = React.useId();
  const kb = useKeyInput();
  const active = kb.activeExercise === id;
  const activeRef = React.useRef(active);
  activeRef.current = active;
  return { id, active, activeRef, activate: () => activateExercise(id) };
}

function ExerciseFrame({
  ex,
  label,
  aside,
  children,
}: {
  ex: ReturnType<typeof useExercise>;
  label: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Panel
      label={label}
      aside={aside}
      onPointerDownCapture={ex.activate}
      onFocusCapture={ex.activate}
      className={ex.active ? "border-accent" : undefined}
    >
      <div className="relative">
        {children}
        {!ex.active && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-bg/70 backdrop-blur-[2px]">
            <Button onClick={ex.activate}>
              <Play aria-hidden />
              Começar
            </Button>
          </div>
        )}
      </div>
    </Panel>
  );
}
const rnd = (n: number) => Math.floor(Math.random() * n);

/* ───────── de onde vêm as notas ───────── */

export function InputPanel({ showTestLink = true }: { showTestLink?: boolean }) {
  const kb = useKeyInput();
  const [source, setSource] = React.useState<InputSource>("screen");
  React.useEffect(() => {
    if (kb.midiState === "connected") setSource("midi");
  }, [kb.midiState]);
  return (
    <div className="flex flex-col gap-2">
      <MidiStatus
        source={source}
        onSourceChange={setSource}
        sources={["midi", "computer", "screen"]}
        midiState={kb.midiState}
        deviceName={kb.deviceName}
        activity={kb.activity || undefined}
        lastNote={kb.lastNote}
        onConnect={() => void connectMidi()}
      />
      {showTestLink && (
      <a href="/setup" className="inline-flex items-center gap-1.5 self-start text-sm text-muted underline decoration-line-strong underline-offset-4 hover:text-fg">
        <Settings2 className="size-4" aria-hidden />
        Testar o equipamento antes
      </a>
      )}
    </div>
  );
}

/* ───────── teclado livre ───────── */

export function KeysWidget({
  from,
  to,
  markers = [],
  handZones,
  names = "c-only",
  caption,
}: {
  from: number;
  to: number;
  markers?: KeyMarker[];
  handZones?: HandZone[];
  names?: "none" | "c-only" | "all";
  caption?: string;
}) {
  const kb = useKeyInput();
  return (
    <div className="flex flex-col gap-2">
      <Keyboard
        from={from}
        to={to}
        markers={markers}
        handZones={handZones}
        pressed={kb.pressed}
        pedal={kb.pedal}
        showNoteNames={names}
        computerKeys
        onPress={(m, v) => press(m, v ?? 90, "screen")}
        onRelease={(m) => release(m, "screen")}
      />
      {caption && <p className="text-sm text-muted">{md(caption)}</p>}
    </div>
  );
}

export function HandWidget({ name, positions, description }: { name: string; positions: HandPlacement[]; description?: string }) {
  return <HandPosition name={name} positions={positions} description={description} showFingerChart showThumbNote />;
}

/* ───────── ache as teclas ───────── */

/**
 * Dois modos:
 * - `all`: ache todas as teclas de uma nota (ex.: todos os Dó) no trecho mostrado.
 * - `quiz`: o app pede uma nota por vez; a meta é 80% de acerto.
 */
export function FindKeys({
  mode,
  from,
  to,
  targets,
  rounds = 10,
  names = "none",
  title,
}: {
  mode: "all" | "quiz";
  from: number;
  to: number;
  /** Classes de altura (0 = Dó, 2 = Ré…). */
  targets: number[];
  rounds?: number;
  names?: "none" | "c-only" | "all";
  title?: string;
}) {
  const kb = useKeyInput();
  const ex = useExercise();
  const all = React.useMemo(() => {
    const out: number[] = [];
    for (let m = from; m <= to; m++) if (targets.includes(pc(m))) out.push(m);
    return out;
  }, [from, to, targets]);

  const [found, setFound] = React.useState<number[]>([]);
  const [wrong, setWrong] = React.useState<number | null>(null);
  const [asked, setAsked] = React.useState<number>(() => targets[0]);
  const [score, setScore] = React.useState({ correct: 0, total: 0 });
  const [flash, setFlash] = React.useState<"hit" | "miss" | null>(null);

  const done = mode === "all" ? found.length === all.length : score.total >= rounds;

  React.useEffect(
    () =>
      onNote((e) => {
        if (!e.on || done || !ex.activeRef.current) return;
        if (e.midi < from || e.midi > to) return;
        if (mode === "all") {
          if (targets.includes(pc(e.midi))) setFound((f) => (f.includes(e.midi) ? f : [...f, e.midi]));
          else {
            setWrong(e.midi);
            window.setTimeout(() => setWrong((w) => (w === e.midi ? null : w)), 700);
          }
        } else {
          const ok = pc(e.midi) === asked;
          setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
          setFlash(ok ? "hit" : "miss");
          if (!ok) {
            setWrong(e.midi);
            window.setTimeout(() => setWrong(null), 700);
          }
          window.setTimeout(() => {
            setFlash(null);
            setAsked((prev) => {
              let next = prev;
              while (targets.length > 1 && next === prev) next = targets[rnd(targets.length)];
              return next;
            });
          }, 500);
        }
      }),
    [mode, from, to, targets, asked, done],
  );

  const reset = () => {
    setFound([]);
    setScore({ correct: 0, total: 0 });
    setAsked(targets[rnd(targets.length)]);
  };

  const markers: KeyMarker[] =
    mode === "all"
      ? [
          ...found.map((m): KeyMarker => ({ midi: m, kind: "root", label: noteName(m) })),
          ...(wrong !== null ? [{ midi: wrong, kind: "out" as const, label: "✕" }] : []),
        ]
      : wrong !== null
        ? [{ midi: wrong, kind: "out", label: "✕" }]
        : [];

  const pct = score.total ? Math.round((score.correct / score.total) * 100) : 0;
  const askedName = noteName(asked);

  return (
    <ExerciseFrame
      ex={ex}
      label={title ?? (mode === "all" ? "Ache as teclas" : "Toque a nota")}
      aside={
        mode === "all" ? (
          <Badge mono tone={done ? "good" : "neutral"}>
            {found.length}/{all.length}
          </Badge>
        ) : (
          <Badge mono tone={done && pct >= 80 ? "good" : "neutral"}>
            {score.correct}/{score.total}
          </Badge>
        )
      }
    >
      <div className="flex flex-col gap-3">
        {mode === "quiz" && !done && (
          <p className="font-display text-3xl font-extrabold text-fg" aria-live="polite">
            Toque um <span className={flash === "hit" ? "text-good" : flash === "miss" ? "text-bad" : "text-accent"}>{askedName}</span>
          </p>
        )}
        {mode === "all" && !done && <p className="text-muted">Toque cada uma. As que você achar ficam marcadas.</p>}
        <Keyboard
          from={from}
          to={to}
          markers={markers}
          pressed={kb.pressed}
          showNoteNames={names}
          computerKeys
          onPress={(m, v) => press(m, v ?? 90, "screen")}
          onRelease={(m) => release(m, "screen")}
        />
        {mode === "quiz" && <Progress value={Math.min(100, (score.total / rounds) * 100)} aria-label="Rodadas" />}
        {done && (
          <div className="flex flex-wrap items-center gap-3">
            <p className={mode === "quiz" && pct < 80 ? "text-warn" : "text-good"}>
              {mode === "all" ? "Achou todas!" : pct >= 80 ? `${pct}% de acerto. Meta batida!` : `${pct}% de acerto. A meta é 80%: mais uma rodada?`}
            </p>
            <Button variant="secondary" size="sm" onClick={reset}>
              <RotateCcw aria-hidden />
              De novo
            </Button>
          </div>
        )}
      </div>
    </ExerciseFrame>
  );
}

/* ───────── sequência com dedilhado ───────── */

export type SeqNote = { midi: number; finger?: Finger };

export function Sequence({
  title,
  notes,
  hand = "right",
  from,
  to,
  bpm = 60,
  goal = 3,
}: {
  title?: string;
  notes: SeqNote[];
  hand?: Hand;
  from: number;
  to: number;
  bpm?: number;
  /** Quantas vezes seguidas sem erro para concluir. */
  goal?: number;
}) {
  const kb = useKeyInput();
  const ex = useExercise();
  const [idx, setIdx] = React.useState(0);
  const [clean, setClean] = React.useState(0);
  const [errors, setErrors] = React.useState(0);
  const [wrong, setWrong] = React.useState<number | null>(null);
  const roundErr = React.useRef(0);

  React.useEffect(
    () =>
      onNote((e) => {
        if (!e.on || !ex.activeRef.current) return;
        setIdx((i) => {
          const target = notes[i];
          if (e.midi === target.midi) {
            if (i + 1 === notes.length) {
              if (roundErr.current === 0) setClean((c) => c + 1);
              else setClean(0);
              roundErr.current = 0;
              return 0;
            }
            return i + 1;
          }
          roundErr.current++;
          setErrors((x) => x + 1);
          setWrong(e.midi);
          window.setTimeout(() => setWrong(null), 600);
          return i;
        });
      }),
    [notes],
  );

  const target = notes[idx];
  const markers: KeyMarker[] = [];
  const seen = new Set<number>();
  notes.forEach((n) => {
    if (seen.has(n.midi)) return;
    seen.add(n.midi);
    markers.push({ midi: n.midi, kind: n.midi === target.midi ? "active" : "in", hand, finger: n.finger });
  });
  if (wrong !== null && !seen.has(wrong)) markers.push({ midi: wrong, kind: "out", label: "✕" });

  const done = clean >= goal;
  return (
    <ExerciseFrame
      ex={ex}
      label={title ?? "Sequência"}
      aside={
        <Badge mono tone={done ? "good" : "neutral"}>
          {Math.min(clean, goal)}/{goal} sem erro
        </Badge>
      }
    >
      <div className="flex flex-col gap-3">
        <ol className="flex flex-wrap gap-1.5 font-mono text-sm" aria-label="Notas da sequência">
          {notes.map((n, i) => (
            <li
              key={i}
              className={
                "rounded-xs border px-2 py-1 " +
                (i === idx ? "border-accent bg-accent-soft text-accent" : i < idx ? "border-line text-muted" : "border-line-strong text-fg")
              }
            >
              {noteName(n.midi)}
              {n.finger && <sup className="ml-0.5">{n.finger}</sup>}
            </li>
          ))}
        </ol>
        <Keyboard
          from={from}
          to={to}
          markers={markers}
          pressed={kb.pressed}
          showNoteNames="none"
          computerKeys
          onPress={(m, v) => press(m, v ?? 90, "screen")}
          onRelease={(m) => release(m, "screen")}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => playSequence(notes.map((n) => n.midi), 60 / bpm)}>
            <Play aria-hidden />
            Ouvir a {bpm} BPM
          </Button>
          <span className="text-sm text-muted">
            {done ? "Pronto! Pode seguir." : `Toque a nota marcada em teal. Erros nesta sessão: ${errors}.`}
          </span>
        </div>
      </div>
    </ExerciseFrame>
  );
}

/* ───────── ouvido: qual nota tocou ───────── */

export function KeyEcho({ notes }: { notes: number[] }) {
  const ex = useExercise();
  const [answer, setAnswer] = React.useState(() => notes[rnd(notes.length)]);
  const [status, setStatus] = React.useState<"asking" | "correct" | "wrong">("asking");
  const [selected, setSelected] = React.useState<string>();
  const [score, setScore] = React.useState({ correct: 0, total: 0 });
  const statusRef = React.useRef(status);
  statusRef.current = status;

  const ref = notes[0];
  const play = React.useCallback(() => {
    // Referência (primeira nota) e depois a pergunta.
    playKey(ref, 0.6);
    window.setTimeout(() => playKey(answer, 0.9), 750);
  }, [ref, answer]);

  const respond = React.useCallback(
    (id: string) => {
      if (statusRef.current !== "asking") return;
      const ok = Number(id) === answer;
      setSelected(id);
      setStatus(ok ? "correct" : "wrong");
      setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
    },
    [answer],
  );

  // Também aceita a resposta tocada no teclado.
  React.useEffect(
    () =>
      onNote((e) => {
        if (e.on && ex.activeRef.current && notes.includes(e.midi)) respond(String(e.midi));
      }),
    [notes, respond],
  );

  return (
    <div onPointerDownCapture={ex.activate} onFocusCapture={ex.activate}>
    <EarTrainer
      question={`Primeiro toca o ${noteName(ref)} de referência. Qual foi a segunda nota? Responda aqui ou tocando a tecla.`}
      options={notes.map((m) => ({ id: String(m), label: noteName(m) }))}
      status={status}
      selectedId={selected}
      correctId={String(answer)}
      onAnswer={respond}
      onReplay={play}
      onNext={() => {
        setStatus("asking");
        setSelected(undefined);
        const next = notes[rnd(notes.length)];
        setAnswer(next);
        window.setTimeout(() => {
          playKey(ref, 0.6);
          window.setTimeout(() => playKey(next, 0.9), 750);
        }, 50);
      }}
      score={score}
    />
    </div>
  );
}
