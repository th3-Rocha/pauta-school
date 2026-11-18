// src/components/music/keyboard/KeyboardPreviewSection.tsx
// Seção "Teclado" da DesignSystemPreview: todos os componentes do teclado nos
// dois temas. Cada demo também é exportada para os cards do design system.
import * as React from "react";
import { cn } from "../../../lib/cn";
import { MIDDLE_C } from "../../../lib/piano";
import { ToggleGroup, ToggleGroupItem } from "../../ui/ToggleGroup";
import { MarkerLegend, type MarkerKind } from "../markers";
import { strings } from "../../../lib/strings";
import { Keyboard, type KeyboardFeedback, type KeyMarker } from "./Keyboard";
import { KeyChord } from "./KeyChord";
import { HandPosition } from "./HandPosition";
import { GrandStaffFrame, type HandsMode, type OtherHandMode } from "./GrandStaffFrame";
import { PianoRoll, type RollNote } from "./PianoRoll";
import { MidiStatus, type InputSource, type MidiState } from "./MidiStatus";
import { PedalIndicator } from "./PedalIndicator";
import { ChordCheck } from "./ChordCheck";
import { KeyFixPuzzle, type KeyFixToken } from "./KeyFixPuzzle";
import { DynamicsMeter, type DynamicLevel } from "./DynamicsMeter";

/** Estado de teclas pressionadas, para as demos. */
function usePressed(initial: number[] = []) {
  const [pressed, setPressed] = React.useState<number[]>(initial);
  return {
    pressed,
    onPress: (m: number) => setPressed((p) => (p.includes(m) ? p : [...p, m])),
    onRelease: (m: number) => setPressed((p) => p.filter((x) => x !== m)),
    set: setPressed,
  };
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="panel-label text-muted">{children}</p>;
}

/* ── Keyboard ─────────────────────────────────────────────────────────── */

const C_POSITION: KeyMarker[] = [
  { midi: 60, kind: "root", hand: "right", finger: 1 },
  { midi: 62, kind: "in", hand: "right", finger: 2 },
  { midi: 64, kind: "deg-3", hand: "right", finger: 3 },
  { midi: 65, kind: "in", hand: "right", finger: 4 },
  { midi: 67, kind: "deg-5", hand: "right", finger: 5 },
  { midi: 48, kind: "root", hand: "left", finger: 5 },
  { midi: 55, kind: "deg-5", hand: "left", finger: 1 },
];

export function KeyboardDemo() {
  const kb = usePressed();
  const [feedback, setFeedback] = React.useState<KeyboardFeedback>("live");
  const [mode, setMode] = React.useState<"fit" | "touch" | "compact">("fit");
  const [names, setNames] = React.useState<"solfejo" | "cifra">("solfejo");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <ToggleGroup type="single" size="sm" value={mode} onValueChange={(v) => v && setMode(v as typeof mode)} aria-label="Tamanho">
          <ToggleGroupItem value="fit">Ajustar</ToggleGroupItem>
          <ToggleGroupItem value="touch">Toque 44px</ToggleGroupItem>
          <ToggleGroupItem value="compact">Compacto</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" size="sm" value={feedback} onValueChange={(v) => v && setFeedback(v as KeyboardFeedback)} aria-label="Feedback">
          <ToggleGroupItem value="off">Sem feedback</ToggleGroupItem>
          <ToggleGroupItem value="live">Ao vivo</ToggleGroupItem>
          <ToggleGroupItem value="result">Resultado</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" size="sm" value={names} onValueChange={(v) => v && setNames(v as typeof names)} aria-label="Nomes">
          <ToggleGroupItem value="solfejo">Dó Ré Mi</ToggleGroupItem>
          <ToggleGroupItem value="cifra">C D E</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Keyboard
        from={48}
        to={72}
        markers={C_POSITION}
        pressed={kb.pressed}
        onPress={kb.onPress}
        onRelease={kb.onRelease}
        handZones={[
          { hand: "right", from: 60, to: 67, label: "Posição de Dó", active: true },
          { hand: "left", from: 48, to: 55, label: "Dó grave" },
        ]}
        feedback={feedback}
        size={mode === "touch" ? "touch" : "fit"}
        compact={mode === "compact"}
        noteNames={names}
        computerKeys
      />
      <MarkerLegend
        kinds={["root", "deg-3", "deg-5", "in", "ghost"] as MarkerKind[]}
        labels={{ ...strings.keyboard.kinds, ghost: "faltou / próxima posição" }}
      />
    </div>
  );
}

/** Os três estados de feedback, parados, para conferência visual. */
export function KeyboardFeedbackDemo() {
  return (
    <div className="flex flex-col gap-2">
      <Label>Alvo Dó–Mi–Sol · tocou Dó, Ré e Sol: certa, tecla errada, faltou</Label>
      <Keyboard
        from={57}
        to={72}
        markers={[
          { midi: 60, kind: "root", label: "1" },
          { midi: 64, kind: "deg-3", label: "3" },
          { midi: 67, kind: "deg-5", label: "5" },
        ]}
        pressed={[60, 62, 67, 70]}
        feedback="result"
        showNoteNames="all"
        pedal
        octaveNav={false}
      />
    </div>
  );
}

/* ── KeyChord ─────────────────────────────────────────────────────────── */

export function KeyChordDemo() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <KeyChord
        name="C"
        inversion={0}
        notes={[
          { midi: 60, degree: "1", finger: 1, hand: "right" },
          { midi: 64, degree: "3", finger: 3, hand: "right" },
          { midi: 67, degree: "5", finger: 5, hand: "right" },
        ]}
      />
      <KeyChord
        name="Am7"
        labelMode="note"
        notes={[
          { midi: 57, degree: "1", finger: 1 },
          { midi: 60, degree: "b3", finger: 2 },
          { midi: 64, degree: "5", finger: 3 },
          { midi: 67, degree: "b7", finger: 5 },
        ]}
      />
      <KeyChord
        name="F"
        inversion={2}
        labelMode="finger"
        previous={{
          name: "C",
          notes: [
            { midi: 60, degree: "1", finger: 1, hand: "right" },
            { midi: 64, degree: "3", finger: 3, hand: "right" },
            { midi: 67, degree: "5", finger: 5, hand: "right" },
          ],
        }}
        notes={[
          { midi: 60, degree: "5", finger: 1, hand: "right" },
          { midi: 65, degree: "1", finger: 4, hand: "right" },
          { midi: 69, degree: "3", finger: 5, hand: "right" },
        ]}
        className="sm:col-span-2"
      />
      <KeyChord
        name="G/B"
        inversion={1}
        labelMode="degree"
        notes={[
          { midi: 47, degree: "3", finger: 5, hand: "left" },
          { midi: 62, degree: "5", finger: 1, hand: "right" },
          { midi: 67, degree: "1", finger: 3, hand: "right" },
          { midi: 71, degree: "3", finger: 5, hand: "right" },
        ]}
        className="sm:col-span-2"
      />
    </div>
  );
}

/* ── HandPosition ─────────────────────────────────────────────────────── */

export function HandPositionDemo() {
  return (
    <div className="grid gap-4">
      <HandPosition name="Posição de Dó" positions={[{ hand: "right", notes: [60, 62, 64, 65, 67] }]} />
      <HandPosition
        name="Posição de Dó, duas mãos"
        description="ME com o mínimo no Dó 3, MD com o polegar no Dó central"
        positions={[
          { hand: "left", notes: [55, 53, 52, 50, 48] },
          { hand: "right", notes: [60, 62, 64, 65, 67] },
        ]}
        showThumbNote={false}
      />
    </div>
  );
}

/* ── GrandStaffFrame ──────────────────────────────────────────────────── */

/** Desenho de mentira no lugar do alphaTab, só para a prévia. */
export function FakeGrandStaff() {
  const staff = (top: number) =>
    Array.from({ length: 5 }, (_, i) => <line key={i} x1={14} x2={560} y1={top + i * 9} y2={top + i * 9} stroke="currentColor" strokeWidth={1} />);
  const head = (x: number, y: number, k: string) => <ellipse key={k} cx={x} cy={y} rx={5.4} ry={4} transform={`rotate(-20 ${x} ${y})`} fill="currentColor" />;
  return (
    <svg viewBox="0 0 570 150" className="h-auto w-full min-w-[480px] text-fg" aria-hidden>
      {staff(30)}
      {staff(100)}
      <path d="M12 30 Q2 30 4 52 Q6 66 0 69 Q6 72 4 86 Q2 136 12 136" fill="none" stroke="currentColor" strokeWidth={2.5} />
      <line x1={14} x2={14} y1={30} y2={136} stroke="currentColor" strokeWidth={1.5} />
      <text x={20} y={66} fontSize={44} fontFamily="'Noto Music','Bravura',serif" fill="currentColor">𝄞</text>
      <text x={22} y={127} fontSize={34} fontFamily="'Noto Music','Bravura',serif" fill="currentColor">𝄢</text>
      {[80, 150, 220, 290].map((x, i) => [head(x + 20, 75 - i * 4.5, `t${i}`), head(x + 20, 136 - 4.5 * (i % 2), `b${i}`)])}
      <line x1={80 + 20 + 160} x2={80 + 20 + 160} y1={30} y2={136} stroke="currentColor" strokeWidth={1} />
      {[340, 400, 460, 520].map((x, i) => [head(x, 62 - i * 4.5, `t2${i}`), head(x, 122 + i * 4.5, `b2${i}`)])}
      <line x1={559} x2={559} y1={30} y2={136} stroke="currentColor" strokeWidth={2} />
      <rect x={326} y={22} width={40} height={124} rx={3} fill="var(--accent)" opacity={0.18} />
    </svg>
  );
}

export function GrandStaffDemo() {
  const [playing, setPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState(70);
  const [loop, setLoop] = React.useState(true);
  const [metronome, setMetronome] = React.useState(true);
  const [countIn, setCountIn] = React.useState(false);
  const [hands, setHands] = React.useState<HandsMode>("right");
  const [other, setOther] = React.useState<OtherHandMode>("background");
  const [clefs, setClefs] = React.useState(true);
  return (
    <GrandStaffFrame
      title="Ode à Alegria, mãos separadas"
      subtitle="Compassos 1–4"
      position={{ bar: 3, total: 8 }}
      playing={playing}
      onPlayPause={() => setPlaying((p) => !p)}
      speed={speed}
      onSpeedChange={setSpeed}
      loop={loop}
      onLoopChange={setLoop}
      loopLabel="c. 3–4"
      metronome={metronome}
      onMetronomeChange={setMetronome}
      countIn={countIn}
      onCountInChange={setCountIn}
      hands={hands}
      onHandsChange={setHands}
      otherHand={other}
      onOtherHandChange={setOther}
      showClefLabels={clefs}
      onShowClefLabelsChange={setClefs}
      minHeight={180}
    >
      <FakeGrandStaff />
    </GrandStaffFrame>
  );
}

/* ── PianoRoll ────────────────────────────────────────────────────────── */

const ODE: RollNote[] = [
  // MD: Mi Mi Fá Sol | Sol Fá Mi Ré | Dó Dó Ré Mi | Mi. Ré Ré
  ...[64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64].map((midi, i) => ({
    midi,
    start: i,
    duration: 1,
    hand: "right" as const,
    finger: ({ 60: 1, 62: 2, 64: 3, 65: 4, 67: 5 } as Record<number, 1 | 2 | 3 | 4 | 5>)[midi],
  })),
  { midi: 64, start: 12, duration: 1.5, hand: "right", finger: 3 },
  { midi: 62, start: 13.5, duration: 0.5, hand: "right", finger: 2 },
  { midi: 62, start: 14, duration: 2, hand: "right", finger: 2 },
  // ME: notas longas
  { midi: 48, start: 0, duration: 4, hand: "left", finger: 5 },
  { midi: 43, start: 4, duration: 4, hand: "left", finger: 5 },
  { midi: 48, start: 8, duration: 4, hand: "left", finger: 5 },
  { midi: 43, start: 12, duration: 2, hand: "left", finger: 5 },
  { midi: 47, start: 14, duration: 2, hand: "left", finger: 3 },
];

export function PianoRollDemo() {
  const [pos, setPos] = React.useState(2);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="panel-label text-muted">Tempo</span>
        <input
          type="range"
          min={0}
          max={14}
          step={0.25}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Posição no tempo"
          className="w-48 accent-[var(--accent)]"
        />
        <output className="font-mono text-sm text-fg">{pos.toFixed(2)}</output>
      </div>
      <PianoRoll notes={ODE} position={pos} from={43} to={69} windowBeats={8} keyboard={{ showNoteNames: "c-only" }} />
    </div>
  );
}

/* ── MidiStatus ───────────────────────────────────────────────────────── */

export function MidiStatusDemo() {
  const [source, setSource] = React.useState<InputSource>("midi");
  const [state, setState] = React.useState<MidiState>("conectado");
  const [activity, setActivity] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setActivity((a) => a + 1), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup type="single" size="sm" value={state} onValueChange={(v) => v && setState(v as MidiState)} aria-label="Estado do MIDI">
        {(["sem-suporte", "pedir-permissao", "nenhum-aparelho", "conectado", "negado"] as MidiState[]).map((s) => (
          <ToggleGroupItem key={s} value={s}>
            {s}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <MidiStatus
        source={source}
        onSourceChange={setSource}
        midiState={state}
        deviceName="Casio CT-S300"
        activity={state === "conectado" || source !== "midi" ? activity : undefined}
        lastNote={state === "conectado" ? "Dó 4" : undefined}
        onConnect={() => setState("conectado")}
      />
    </div>
  );
}

/* ── PedalIndicator ───────────────────────────────────────────────────── */

export function PedalDemo() {
  const [down, setDown] = React.useState(false);
  return (
    <div className="grid gap-4">
      <PedalIndicator
        down={down}
        onDownChange={setDown}
        hasPedal={false}
        marks={[
          { start: 0, end: 4 },
          { start: 4, end: 8 },
          { start: 8, end: 14 },
        ]}
        position={5.5}
        beats={16}
      />
      <PedalIndicator down hasPedal />
    </div>
  );
}

/* ── ChordCheck ───────────────────────────────────────────────────────── */

export function ChordCheckDemo() {
  const kb = usePressed([64, 67]);
  const target = { name: "C maior", inversion: "1ª inversão", notes: [64, 67, 72], degrees: ["3", "5", "1"] };
  return (
    <div className="grid gap-4">
      <ChordCheck target={target} held={kb.pressed} onPress={kb.onPress} onRelease={kb.onRelease} />
      <ChordCheck target={target} held={[64, 67, 72]} showKeyboard={false} />
      <ChordCheck target={target} held={[]} inputReady={false} />
    </div>
  );
}

/* ── KeyFixPuzzle ─────────────────────────────────────────────────────── */

export function KeyFixDemo() {
  const answer = [64, 64, 65, 67, 67, 65, 64, 62];
  const [tokens, setTokens] = React.useState<KeyFixToken[]>(() =>
    answer.map((midi, i) => ({ midi: i === 5 ? 66 : midi, finger: ({ 62: 2, 64: 3, 65: 4, 67: 5 } as Record<number, 2 | 3 | 4 | 5>)[midi], hand: "right" as const })),
  );
  const [sel, setSel] = React.useState<number | null>(null);
  const [hint, setHint] = React.useState(false);
  const solved = tokens.every((t, i) => t.midi === answer[i]);
  return (
    <KeyFixPuzzle
      tokens={tokens}
      selected={sel}
      onSelect={setSel}
      onShift={(i, d) => setTokens((ts) => ts.map((t, j) => (j === i ? { ...t, midi: t.midi + d } : t)))}
      solved={solved}
      hint="A frase fica toda nas teclas brancas da posição de Dó."
      showHint={hint}
      onShowHint={() => setHint((h) => !h)}
      onPlay={() => {}}
    />
  );
}

/* ── DynamicsMeter ────────────────────────────────────────────────────── */

export function DynamicsDemo() {
  const [target, setTarget] = React.useState<DynamicLevel>("mf");
  const hits = [44, 62, 71, 88, 95, 77, 69, 52, 73].map((velocity) => ({ velocity }));
  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup type="single" size="sm" value={target} onValueChange={(v) => v && setTarget(v as DynamicLevel)} aria-label="Alvo">
        <ToggleGroupItem value="p">p</ToggleGroupItem>
        <ToggleGroupItem value="mf">mf</ToggleGroupItem>
        <ToggleGroupItem value="f">f</ToggleGroupItem>
      </ToggleGroup>
      <DynamicsMeter hits={hits} target={target} />
    </div>
  );
}

/* ── Tokens do teclado ────────────────────────────────────────────────── */

const KEY_TOKENS = [
  ["key-white", "Tecla branca (marfim)"],
  ["key-white-pressed", "Branca afundada"],
  ["key-black", "Tecla preta (ébano)"],
  ["key-black-pressed", "Preta afundada"],
  ["key-edge", "Fresta"],
  ["key-ink", "Serigrafia"],
  ["felt", "Feltro"],
  ["case", "Caixa (laca)"],
  ["case-shine", "Verniz"],
  ["pedal", "Pedais (latão)"],
  ["hand-right", "Mão direita · D"],
  ["hand-left", "Mão esquerda · E"],
] as const;

export function KeyTokensDemo() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {KEY_TOKENS.map(([name, label]) => (
        <li key={name} className="flex items-center gap-2">
          <span className="size-9 shrink-0 rounded-xs ring-1 ring-line-strong" style={{ background: `var(--${name})` }} aria-hidden />
          <span className="min-w-0">
            <span className="block truncate font-mono text-xs text-fg">{name}</span>
            <span className="block truncate text-xs text-muted">{label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ── A seção ──────────────────────────────────────────────────────────── */

function Themed({ theme, children }: { theme: "dark" | "light"; children: React.ReactNode }) {
  return (
    <div data-theme={theme} className="min-w-0 rounded-lg border border-line bg-bg p-4 text-fg">
      <p className="panel-label mb-3 text-muted">{theme === "dark" ? "Tema escuro" : "Tema claro"}</p>
      {children}
    </div>
  );
}

function Row({ title, children, wide }: { title: string; children: () => React.ReactNode; wide?: boolean }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-display text-xl font-bold text-fg">{title}</h3>
      <div className={cn("grid gap-4", wide ? "grid-cols-1" : "xl:grid-cols-2")}>
        <Themed theme="dark">{children()}</Themed>
        <Themed theme="light">{children()}</Themed>
      </div>
    </section>
  );
}

export type KeyboardPreviewSectionProps = { className?: string };

/** Seção "Teclado" para encaixar na DesignSystemPreview. */
export function KeyboardPreviewSection({ className }: KeyboardPreviewSectionProps) {
  return (
    <section aria-labelledby="ds-teclado" className={cn("flex flex-col gap-10", className)}>
      <header className="flex flex-col gap-1">
        <p className="panel-label text-muted">Seção</p>
        <h2 id="ds-teclado" className="font-display text-2xl font-bold text-fg">
          Teclado
        </h2>
        <p className="max-w-2xl text-base text-muted">
          Marfim, ébano, feltro vermelho e laca preta: o teclado é um objeto físico e não muda com o tema. A interface em volta é a mesma da
          guitarra. Dó central = {MIDDLE_C} (C4).
        </p>
      </header>
      <Row title="Tokens do teclado" wide>{() => <KeyTokensDemo />}</Row>
      <Row title="Keyboard" wide>{() => <KeyboardDemo />}</Row>
      <Row title="Keyboard · feedback de execução" wide>{() => <KeyboardFeedbackDemo />}</Row>
      <Row title="KeyChord">{() => <KeyChordDemo />}</Row>
      <Row title="HandPosition">{() => <HandPositionDemo />}</Row>
      <Row title="GrandStaffFrame" wide>{() => <GrandStaffDemo />}</Row>
      <Row title="PianoRoll" wide>{() => <PianoRollDemo />}</Row>
      <Row title="MidiStatus">{() => <MidiStatusDemo />}</Row>
      <Row title="PedalIndicator">{() => <PedalDemo />}</Row>
      <Row title="ChordCheck">{() => <ChordCheckDemo />}</Row>
      <Row title="KeyFixPuzzle">{() => <KeyFixDemo />}</Row>
      <Row title="DynamicsMeter">{() => <DynamicsDemo />}</Row>
    </section>
  );
}
