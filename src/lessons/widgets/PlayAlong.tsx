// Notas caindo até o teclado. Três modos:
// - listen: o site toca sozinho, para ver e ouvir antes
// - wait:   a música para em cada nota até o aluno apertar a tecla certa
// - tempo:  corre no andamento, com contagem; acerto, quase, perdida e meta de 80%
import * as React from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { PianoRoll, type RollNote } from "../../components/music/keyboard/PianoRoll";
import type { KeyMarker } from "../../components/music/keyboard/Keyboard";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/ToggleGroup";
import { onNote, press, release, useKeyInput } from "../../app/key-input";
import { playKey } from "../../app/piano-audio";
import { audio, tick } from "../../app/audio";
import { ExerciseFrame, useExercise } from "./Keys";
import { L } from "../../i18n";

export type PlayMode = "listen" | "wait" | "tempo";

type Result = "hit" | "close" | "miss" | "auto";

/** Em tempos: até aqui conta como certo; até CLOSE, como quase. */
const HIT = 0.18;
const CLOSE = 0.4;

export function PlayAlong({
  title,
  notes,
  bpm,
  from,
  to,
  beatsPerBar = 4,
  modes = ["listen", "wait", "tempo"],
  defaultMode = "wait",
  goal = 0.8,
  auto = [],
}: {
  title?: string;
  notes: RollNote[];
  bpm: number;
  from: number;
  to: number;
  beatsPerBar?: number;
  modes?: PlayMode[];
  defaultMode?: PlayMode;
  /** Meta do modo no tempo (0–1). */
  goal?: number;
  /** Mãos que o site toca sozinho (não contam na nota). Ex.: ["left"] para o aluno tocar só a direita. */
  auto?: ("right" | "left")[];
}) {
  const kb = useKeyInput();
  const ex = useExercise();
  const sorted = React.useMemo(() => [...notes].sort((a, b) => a.start - b.start), [notes]);
  const end = React.useMemo(() => Math.max(...sorted.map((n) => n.start + n.duration)), [sorted]);

  const [mode, setMode] = React.useState<PlayMode>(defaultMode);
  const [speed, setSpeed] = React.useState(1);
  const [running, setRunning] = React.useState(false);
  const runningRef = React.useRef(false);
  runningRef.current = running;
  const [finished, setFinished] = React.useState(false);
  const [position, setPosition] = React.useState(-beatsPerBar);
  const [results, setResults] = React.useState<(Result | null)[]>(() => sorted.map(() => null));
  const [wrong, setWrong] = React.useState(0);
  const [flash, setFlash] = React.useState<number | null>(null);

  // Estado do motor em ref: o requestAnimationFrame lê sem re-render.
  const eng = React.useRef({ pos: -beatsPerBar, last: 0, raf: 0, nextTick: 0, results: [] as (Result | null)[], played: new Set<number>() });

  const spb = 60 / (bpm * speed); // segundos por tempo

  const stop = React.useCallback(() => {
    cancelAnimationFrame(eng.current.raf);
    setRunning(false);
  }, []);

  const reset = React.useCallback(() => {
    stop();
    const start = mode === "wait" ? -1 : -beatsPerBar;
    eng.current = { pos: start, last: 0, raf: 0, nextTick: Math.ceil(start), results: sorted.map(() => null), played: new Set() };
    setPosition(start);
    setResults(sorted.map(() => null));
    setWrong(0);
    setFinished(false);
  }, [stop, mode, beatsPerBar, sorted]);

  // Troca de modo ou de música: começa do zero.
  React.useEffect(() => {
    reset();
  }, [mode, sorted, speed]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => () => cancelAnimationFrame(eng.current.raf), []);

  /** Primeira nota (ou grupo) ainda sem resultado no modo esperar. */
  const pendingGroupStart = () => {
    const i = eng.current.results.findIndex((r) => r === null);
    return i < 0 ? null : sorted[i].start;
  };

  const frame = React.useCallback(
    (t: number) => {
      const e = eng.current;
      const dt = e.last ? (t - e.last) / 1000 : 0;
      e.last = t;
      let pos = e.pos + dt / spb;

      // Mão que o site toca: soa quando chega na linha e não conta na nota.
      if (mode !== "listen" && auto.length) {
        sorted.forEach((n, i) => {
          if (e.results[i] === null && auto.includes(n.hand) && n.start <= pos) {
            e.results[i] = "auto";
            playKey(n.midi, n.duration * spb * 0.95);
          }
        });
      }

      if (mode === "wait") {
        const hold = pendingGroupStart();
        if (hold !== null && pos > hold) pos = hold;
      }

      // Metrônomo (contagem e, no modo tempo, a música toda)
      if (mode !== "wait") {
        while (e.nextTick <= pos) {
          if (e.nextTick < 0 || mode === "tempo") tick(audio().currentTime, ((e.nextTick % beatsPerBar) + beatsPerBar) % beatsPerBar === 0);
          e.nextTick++;
        }
      }

      // Modo ouvir: o site toca as notas quando chegam na linha
      if (mode === "listen") {
        sorted.forEach((n, i) => {
          if (!e.played.has(i) && n.start <= pos) {
            e.played.add(i);
            playKey(n.midi, n.duration * spb * 0.95);
          }
        });
      }

      // Modo tempo: nota que passou da janela sem ser tocada = perdida
      if (mode === "tempo") {
        let changed = false;
        sorted.forEach((n, i) => {
          if (e.results[i] === null && !auto.includes(n.hand) && pos - n.start > CLOSE) {
            e.results[i] = "miss";
            changed = true;
          }
        });
        if (changed) setResults([...e.results]);
      }

      e.pos = pos;
      setPosition(pos);

      const done = mode === "wait" ? e.results.every((r) => r !== null) && pos >= end : pos >= end + 1;
      if (done) {
        setRunning(false);
        setFinished(true);
        return;
      }
      e.raf = requestAnimationFrame(frame);
    },
    [mode, spb, sorted, end, beatsPerBar, auto],
  );

  const start = () => {
    ex.activate();
    if (finished) reset();
    audio();
    // Conta o tempo a partir do clique, não do primeiro quadro desenhado.
    eng.current.last = performance.now();
    setRunning(true);
    eng.current.raf = requestAnimationFrame(frame);
  };

  // Notas do aluno
  React.useEffect(
    () =>
      onNote((evt) => {
        if (!evt.on || !ex.activeRef.current || mode === "listen") return;
        const e = eng.current;
        if (mode === "wait") {
          const hold = pendingGroupStart();
          if (hold === null) return;
          // Pode apertar um pouco antes de a nota chegar na linha.
          const i = sorted.findIndex((n, k) => e.results[k] === null && !auto.includes(n.hand) && n.start === hold && n.midi === evt.midi);
          // Parado, aceita a próxima nota e já começa; andando, pode apertar até 1 tempo antes.
          if (i >= 0 && (!runningRef.current || hold - e.pos <= 1.01)) {
            e.results[i] = "hit";
            setResults([...e.results]);
            if (!runningRef.current) start();
          } else {
            setWrong((w) => w + 1);
            setFlash(evt.midi);
            window.setTimeout(() => setFlash((f) => (f === evt.midi ? null : f)), 500);
          }
          return;
        }
        // tempo: a nota pendente mais próxima com a mesma altura
        let best = -1;
        let bestDt = Infinity;
        sorted.forEach((n, k) => {
          if (e.results[k] !== null || auto.includes(n.hand) || n.midi !== evt.midi) return;
          const d = Math.abs(e.pos - n.start);
          if (d < bestDt) {
            bestDt = d;
            best = k;
          }
        });
        if (best >= 0 && bestDt <= CLOSE) {
          e.results[best] = bestDt <= HIT ? "hit" : "close";
          setResults([...e.results]);
        } else if (running) {
          setWrong((w) => w + 1);
          setFlash(evt.midi);
          window.setTimeout(() => setFlash((f) => (f === evt.midi ? null : f)), 500);
        }
      }),
    [mode, sorted, running, frame, finished], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // No modo esperar, a nota parada na linha aparece marcada no teclado.
  const markers: KeyMarker[] = [];
  if (mode === "wait" && !finished) {
    const hold = pendingGroupStart();
    sorted.forEach((n, k) => {
      if (hold !== null && n.start === hold && results[k] === null && !auto.includes(n.hand) && position >= hold - 0.01)
        markers.push({ midi: n.midi, kind: "active", hand: n.hand, finger: n.finger });
    });
  }
  if (flash !== null) markers.push({ midi: flash, kind: "out", label: "✕" });

  const hits = results.filter((r) => r === "hit").length;
  const close = results.filter((r) => r === "close").length;
  const miss = results.filter((r) => r === "miss").length;
  const scored = sorted.filter((n) => !auto.includes(n.hand)).length;
  const score = scored ? (hits + close * 0.5) / scored : 0;
  const pct = Math.round(score * 100);
  const counting = position < 0 && running && mode !== "wait";
  const tally = L(
    `${hits} ${hits === 1 ? "certa" : "certas"}, ${close} quase, ${miss} ${miss === 1 ? "perdida" : "perdidas"}`,
    `${hits} on time, ${close} close, ${miss} missed`,
  );

  return (
    <ExerciseFrame
      ex={ex}
      label={title ?? L("Toque junto", "Play along")}
      aside={
        mode === "tempo" && (finished || hits + close + miss > 0) ? (
          <Badge mono tone={finished ? (score >= goal ? "good" : "warn") : "neutral"}>{pct}%</Badge>
        ) : mode === "wait" ? (
          <Badge mono tone={finished ? "good" : "neutral"}>
            {hits}/{scored}
          </Badge>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup type="single" size="sm" value={mode} onValueChange={(v) => v && setMode(v as PlayMode)} aria-label={L("Modo", "Mode")}>
            {modes.includes("listen") && <ToggleGroupItem value="listen">{L("Ouvir", "Listen")}</ToggleGroupItem>}
            {modes.includes("wait") && <ToggleGroupItem value="wait">{L("Esperar por mim", "Wait for me")}</ToggleGroupItem>}
            {modes.includes("tempo") && <ToggleGroupItem value="tempo">{L("No tempo", "In time")}</ToggleGroupItem>}
          </ToggleGroup>
          {mode !== "wait" && (
            <ToggleGroup type="single" size="sm" value={String(speed)} onValueChange={(v) => v && setSpeed(Number(v))} aria-label={L("Velocidade", "Speed")}>
              <ToggleGroupItem value="0.5">50%</ToggleGroupItem>
              <ToggleGroupItem value="0.75">75%</ToggleGroupItem>
              <ToggleGroupItem value="1">{bpm} BPM</ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>

        <p className="min-h-6 text-sm text-muted" aria-live="polite">
          {finished
            ? mode === "tempo"
              ? score >= goal
                ? L(`${pct}%: meta batida! ${tally}.`, `${pct}%: goal reached! ${tally}.`)
                : L(`${pct}%. A meta é ${Math.round(goal * 100)}%: tente a 75% da velocidade. ${tally}.`, `${pct}%. The goal is ${Math.round(goal * 100)}%: try at 75% speed. ${tally}.`)
              : mode === "wait"
                ? L(
                    `Pronto! ${wrong === 0 ? "Sem nenhuma tecla errada." : `${wrong} ${wrong === 1 ? "tecla errada" : "teclas erradas"} no caminho.`} Agora tente No tempo.`,
                    `Done! ${wrong === 0 ? "Not a single wrong key." : `${wrong} wrong ${wrong === 1 ? "key" : "keys"} along the way.`} Now try In time.`,
                  )
                : L("Agora é com você: escolha Esperar por mim.", "Your turn now: choose Wait for me.")
            : counting
              ? `${L("Contagem", "Count-in")}: ${Math.ceil(-position)}…`
              : mode === "wait"
                ? L("A música para em cada nota e espera você tocar a tecla marcada.", "The music stops at each note and waits for you to play the marked key.")
                : mode === "tempo"
                  ? L("Toque cada nota quando ela encostar na linha. Primeiro vem um compasso de contagem.", "Play each note when it touches the line. First comes one bar of count-in.")
                  : L("Veja e ouça. As notas tocam quando encostam na linha.", "Watch and listen. Notes play when they touch the line.")}
        </p>

        <PianoRoll
          notes={sorted}
          position={Math.max(position, -beatsPerBar)}
          from={from}
          to={to}
          windowBeats={6}
          pxPerBeat={24}
          beatsPerBar={beatsPerBar}
          keyboard={{
            // No modo ouvir, o teclado mostra a nota que o site está tocando.
            pressed: mode === "listen" ? undefined : kb.pressed,
            markers,
            showNoteNames: "c-only",
            computerKeys: true,
            onPress: (m, v) => press(m, v ?? 90, "screen"),
            onRelease: (m) => release(m, "screen"),
          }}
        />

        <div className="flex flex-wrap items-center gap-2">
          {running ? (
            <Button variant="secondary" onClick={stop}>
              <Pause aria-hidden />
              {L("Pausar", "Pause")}
            </Button>
          ) : (
            <Button onClick={start}>
              <Play aria-hidden />
              {finished ? L("De novo", "Again") : position > (mode === "wait" ? -1 : -beatsPerBar) ? L("Continuar", "Continue") : mode === "listen" ? L("Ouvir", "Listen") : L("Começar", "Start")}
            </Button>
          )}
          <Button variant="ghost" onClick={reset}>
            <RotateCcw aria-hidden />
            {L("Do início", "From the top")}
          </Button>
          {mode === "wait" && !running && !finished && <span className="text-sm text-muted">{L("Ou só toque a primeira nota.", "Or just play the first note.")}</span>}
        </div>
      </div>
    </ExerciseFrame>
  );
}
