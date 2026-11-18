// src/components/DesignSystemPreview.tsx
// Página de referência: todos os tokens e componentes, nos dois temas.
// Os "demos" abaixo guardam estado só para a vitrine; os componentes em si são controlados.
import * as React from "react";
import { Bell, Plus, Trash2, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";
import { strings } from "../lib/strings";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Callout } from "./ui/Callout";
import { Checkbox } from "./ui/Checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "./ui/Dialog";
import { FieldMessage, Input, Label } from "./ui/Input";
import { Progress } from "./ui/Progress";
import { Slider } from "./ui/Slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";
import { KeyboardPreviewSection } from "./music/keyboard/KeyboardPreviewSection";
import { AppHeader, type Theme } from "./course/AppHeader";
import { YearMap, type YearMonth, type DayState } from "./course/YearMap";
import { LessonBlock } from "./course/LessonBlock";
import { LessonLayout, type LessonBlockData } from "./course/LessonLayout";
import { SelfCheck } from "./course/SelfCheck";
import { MilestoneCard } from "./course/MilestoneCard";
import { ProgressCodeDialog, type ProgressSummary } from "./course/ProgressCodeDialog";
import { Fretboard, type FretboardMarker } from "./music/Fretboard";
import { ChordDiagram } from "./music/ChordDiagram";
import { ScoreFrame } from "./music/ScoreFrame";
import { RhythmSlashes, type RhythmMeasure } from "./music/RhythmSlashes";
import { Metronome, type ClickMode, type TimeSignature } from "./music/Metronome";
import { Drone } from "./music/Drone";
import { BackingTrackPlayer } from "./music/BackingTrackPlayer";
import { EarTrainer } from "./music/EarTrainer";
import { PitchMeter, type MicPermission } from "./music/PitchMeter";
import { NoteFixPuzzle, type PuzzleNote } from "./music/NoteFixPuzzle";
import { MarkerLegend, MARKER_KINDS } from "./music/markers";

/* ───────────── Dados de exemplo ───────────── */

export const MONTH_TITLES = [
  "Postura e primeiros acordes",
  "Ritmo e troca de acordes",
  "Pestana e power chords",
  "Tablatura e riffs",
  "Pentatônica menor",
  "Blues de 12 compassos",
  "Campo harmônico maior",
  "Tríades e arpejos",
  "Escala maior no braço todo",
  "Bends, vibrato e ligados",
  "Improvisar sobre acordes",
  "Seus primeiros solos",
];

export function makeYear(currentDay = 37): YearMonth[] {
  let n = 0;
  return MONTH_TITLES.map((title, mi) => {
    const len = mi === 11 ? 35 : 30;
    const days = Array.from({ length: len }, (_, di) => {
      n += 1;
      const last = di === len - 1;
      let state: DayState = n < currentDay ? "done" : n === currentDay ? "current" : n <= currentDay + 2 ? "available" : "locked";
      if (last) state = "milestone";
      return { day: n, state, passed: last && n < currentDay, title: last ? `Desafio: ${title}` : undefined };
    });
    return { month: mi + 1, title, days };
  });
}

const PENTA_BOX: FretboardMarker[] = [
  { string: 6, fret: 5, label: "1", kind: "root" },
  { string: 6, fret: 8, label: "b3", kind: "deg-3" },
  { string: 5, fret: 5, label: "4", kind: "in" },
  { string: 5, fret: 7, label: "5", kind: "deg-5" },
  { string: 4, fret: 5, label: "b7", kind: "deg-7" },
  { string: 4, fret: 7, label: "1", kind: "root" },
  { string: 3, fret: 5, label: "b3", kind: "deg-3" },
  { string: 3, fret: 7, label: "4", kind: "in" },
  { string: 2, fret: 5, label: "5", kind: "deg-5" },
  { string: 2, fret: 8, label: "b7", kind: "deg-7" },
  { string: 1, fret: 5, label: "1", kind: "root" },
  { string: 1, fret: 8, label: "b3", kind: "deg-3" },
  { string: 2, fret: 6, label: "b6", kind: "tension" },
  { string: 3, fret: 6, label: "3", kind: "out" },
  { string: 1, fret: 7, label: "9", kind: "ext" },
  { string: 4, fret: 9, label: "", kind: "ghost" },
];

/* ───────────── Demos (estado só da vitrine) ───────────── */

export function FretboardDemo({ orientation = "horizontal" as const }: { orientation?: "horizontal" | "vertical" }) {
  const [active, setActive] = React.useState<{ s: number; f: number } | null>(null);
  const markers = active ? [...PENTA_BOX, { string: active.s, fret: active.f, kind: "active" as const }] : PENTA_BOX;
  return (
    <div className="flex flex-col gap-3">
      <Fretboard
        frets={orientation === "vertical" ? 9 : 15}
        markers={markers}
        highlightRange={{ from: 5, to: 8, label: "Caixa 1" }}
        orientation={orientation}
        onPress={(s, f) => setActive({ s, f })}
      />
      <MarkerLegend kinds={MARKER_KINDS} labels={strings.fretboard.kinds} />
    </div>
  );
}

export function ChordDiagramDemo() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <ChordDiagram name="C" positions={[{ fret: "x" }, { fret: 3, finger: 3 }, { fret: 2, finger: 2 }, { fret: 0 }, { fret: 1, finger: 1 }, { fret: 0 }]} />
      <ChordDiagram
        name="Am"
        labelMode="degree"
        positions={[{ fret: "x" }, { fret: 0, degree: "root" }, { fret: 2, degree: "deg-5" }, { fret: 2, degree: "root" }, { fret: 1, degree: "deg-3", degreeLabel: "b3" }, { fret: 0, degree: "deg-5" }]}
      />
      <ChordDiagram
        name="A (pestana)"
        barre={{ fret: 5, fromString: 6, toString: 1, finger: 1 }}
        positions={[{ fret: 5 }, { fret: 7, finger: 3 }, { fret: 7, finger: 4 }, { fret: 6, finger: 2 }, { fret: 5 }, { fret: 5 }]}
      />
      <ChordDiagram
        name="G → C"
        previous={[{ string: 6, fret: 3 }, { string: 5, fret: 2 }, { string: 1, fret: 3 }]}
        positions={[{ fret: "x" }, { fret: 3, order: 1 }, { fret: 2, order: 2 }, { fret: 0 }, { fret: 1, order: 3 }, { fret: 0 }]}
      />
    </div>
  );
}

export function ScoreFrameDemo() {
  const [playing, setPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState(75);
  const [loop, setLoop] = React.useState(true);
  const [metro, setMetro] = React.useState(true);
  const [countIn, setCountIn] = React.useState(false);
  return (
    <ScoreFrame
      title="Riff do dia 37"
      subtitle="Pentatônica de Lá menor, caixa 1"
      playing={playing}
      onPlayPause={() => setPlaying((p) => !p)}
      speed={speed}
      onSpeedChange={setSpeed}
      loop={loop}
      onLoopChange={setLoop}
      loopLabel="c. 3–4"
      metronome={metro}
      onMetronomeChange={setMetro}
      countIn={countIn}
      onCountInChange={setCountIn}
      position={{ bar: 3, total: 8 }}
    >
      <div className="flex h-[200px] min-w-[520px] items-center justify-center rounded-sm border border-dashed border-line-strong font-mono text-sm text-muted">
        alphaTab desenha a partitura e a tablatura aqui
      </div>
    </ScoreFrame>
  );
}

function useTicker(on: boolean, ms: number, n: number) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (!on) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => clearInterval(t);
  }, [on, ms, n]);
  return i;
}

const GROOVE: RhythmMeasure[] = [
  { chord: "Am", strokes: ["down", null, "down", "up", null, "up", "down", "up"] },
  { chord: "Am", strokes: ["down", null, "down", "up", null, "up", "down", "up"] },
  { chord: "F", strokes: ["down", null, "down", "up", null, "up", "down", "up"] },
  { chord: "G", strokes: ["down", null, "down", "up", "hit", "up", "down", "up"] },
];

export function RhythmSlashesDemo() {
  const tick = useTicker(true, 500, 16);
  return <RhythmSlashes measures={GROOVE} currentMeasure={Math.floor(tick / 4)} currentBeat={tick % 4} />;
}

export function MetronomeDemo() {
  const [bpm, setBpm] = React.useState(72);
  const [playing, setPlaying] = React.useState(false);
  const [ts, setTs] = React.useState<TimeSignature>("4/4");
  const [mode, setMode] = React.useState<ClickMode>("all");
  const beats = { "2/4": 2, "3/4": 3, "4/4": 4, "6/8": 6 }[ts];
  const tick = useTicker(playing, 60000 / bpm, beats * 2);
  return (
    <Metronome
      bpm={bpm}
      onBpmChange={setBpm}
      playing={playing}
      onPlayingChange={setPlaying}
      timeSignature={ts}
      onTimeSignatureChange={setTs}
      clickMode={mode}
      onClickModeChange={setMode}
      currentBeat={playing ? tick % beats : -1}
      silentMeasure={mode === "gap" && tick >= beats}
    />
  );
}

export function DroneDemo() {
  const [note, setNote] = React.useState(9);
  const [on, setOn] = React.useState(true);
  return <Drone note={note} onNoteChange={setNote} playing={on} onPlayingChange={setOn} />;
}

export function BackingTrackDemo() {
  const [playing, setPlaying] = React.useState(true);
  const [loop, setLoop] = React.useState(true);
  const chords = [{ symbol: "Am", bars: 2 }, { symbol: "F" }, { symbol: "C" }, { symbol: "G" }, { symbol: "E7", bars: 2 }];
  const i = useTicker(playing, 1400, chords.length);
  return (
    <BackingTrackPlayer
      name="Blues lento em Lá"
      tonality="Lá menor"
      bpm={70}
      chords={chords}
      currentIndex={playing ? i : -1}
      playing={playing}
      onPlayPause={() => setPlaying((p) => !p)}
      loop={loop}
      onLoopChange={setLoop}
    />
  );
}

export function EarTrainerDemo() {
  const options = [
    { id: "m3", label: "Terça menor", hint: "triste" },
    { id: "M3", label: "Terça maior", hint: "alegre" },
    { id: "P4", label: "Quarta justa" },
    { id: "P5", label: "Quinta justa" },
  ];
  const [status, setStatus] = React.useState<"asking" | "correct" | "wrong">("asking");
  const [sel, setSel] = React.useState<string>();
  const [score, setScore] = React.useState({ correct: 7, total: 9 });
  const correctId = "P5";
  return (
    <EarTrainer
      question="Que intervalo é esse?"
      options={options}
      status={status}
      selectedId={sel}
      correctId={status === "asking" ? undefined : correctId}
      onAnswer={(id) => {
        setSel(id);
        const ok = id === correctId;
        setStatus(ok ? "correct" : "wrong");
        setScore((sc) => ({ correct: sc.correct + (ok ? 1 : 0), total: sc.total + 1 }));
      }}
      onReplay={() => {}}
      onNext={() => {
        setStatus("asking");
        setSel(undefined);
      }}
      score={score}
    />
  );
}

export function PitchMeterDemo({ mode = "note" as const }: { mode?: "note" | "bend" }) {
  const [perm, setPerm] = React.useState<MicPermission>("prompt");
  const [cents, setCents] = React.useState(-18);
  React.useEffect(() => {
    if (perm !== "granted") return;
    const t = setInterval(() => setCents((c) => Math.max(-50, Math.min(50, Math.round(c * 0.8 + (Math.random() - 0.5) * 14)))), 450);
    return () => clearInterval(t);
  }, [perm]);
  return (
    <PitchMeter
      mode={mode}
      permission={perm}
      onRequestPermission={() => setPerm("granted")}
      target={mode === "bend" ? "B3" : "A2"}
      targetHint={mode === "bend" ? "Bend de 1 tom a partir do A3, corda 3" : "Corda 5 solta"}
      detected={cents > 30 ? "A#2" : cents < -30 ? "G#2" : mode === "bend" ? "B3" : "A2"}
      cents={cents}
    />
  );
}

const PUZZLE_START: PuzzleNote[] = [
  { id: "n1", string: 3, fret: 5 },
  { id: "n2", string: 3, fret: 7 },
  { id: "n3", string: 2, fret: 5 },
  { id: "n4", string: 2, fret: 7 },
  { id: "n5", string: 2, fret: 8 },
  { id: "n6", string: 1, fret: 5 },
];
const PUZZLE_ANSWER: Record<string, number> = { n4: 8 };

export function NoteFixDemo() {
  const [notes, setNotes] = React.useState(PUZZLE_START);
  const [sel, setSel] = React.useState<string | null>(null);
  const [moved, setMoved] = React.useState<string[]>([]);
  const [hint, setHint] = React.useState(false);
  const solved = notes.every((n) => (PUZZLE_ANSWER[n.id] ?? PUZZLE_START.find((p) => p.id === n.id)!.fret) === n.fret);
  return (
    <NoteFixPuzzle
      notes={notes}
      selectedId={sel}
      onSelect={setSel}
      onShift={(id, d) => {
        setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, fret: n.fret + d } : n)));
        setMoved((m) => (m.includes(id) ? m : [...m, id]));
      }}
      movedIds={moved}
      hint="Na pentatônica de Lá menor, a corda 2 só tem as casas 5 e 8 nesta caixa."
      showHint={hint}
      onShowHintChange={setHint}
      onPlay={() => {}}
      solved={solved}
    />
  );
}

export function AppHeaderDemo() {
  const [theme, setTheme] = React.useState<Theme>("dark");
  return <AppHeader day={37} onProgressClick={() => {}} theme={theme} onThemeChange={setTheme} sticky={false} />;
}

export function YearMapDemo() {
  const year = React.useMemo(() => makeYear(37), []);
  const [picked, setPicked] = React.useState<number | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <YearMap months={year} onSelectDay={setPicked} />
      <p className="text-sm text-muted" aria-live="polite">{picked ? `Abrir dia ${picked}` : ""}</p>
    </div>
  );
}

export function SelfCheckDemo() {
  const [checked, setChecked] = React.useState<string[]>(["punho"]);
  return (
    <SelfCheck
      items={[
        { id: "punho", label: "Punho reto?", hint: "Sem dobrar para trás nem para frente" },
        { id: "polegar", label: "Polegar atrás do braço?" },
        { id: "pontas", label: "Tocando com a ponta dos dedos?" },
        { id: "ombro", label: "Ombro solto?" },
      ]}
      checked={checked}
      onChange={setChecked}
    />
  );
}

export function MilestoneDemo() {
  return (
    <MilestoneCard
      month={2}
      title="Troca G–C–D sem parar"
      goal="Tocar a levada básica trocando G, C e D a cada compasso, 8 compassos seguidos."
      criteria={["Nenhuma parada entre acordes", "Todas as cordas soando limpas", "Metrônomo a 80 BPM, sem acelerar"]}
      targetBpm={80}
      bestBpm={72}
      status="available"
      onAttempt={() => {}}
    />
  );
}

const DEMO_CODE = "0025a3f19c07e4b2d8016f3a9b2c4e5d7f80112a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f7";
export function parseDemoCode(code: string): ProgressSummary | null {
  if (!/^[0-9a-f]+$/.test(code) || code.length < 96 || code.length > 104) return null;
  const day = parseInt(code.slice(0, 4), 16);
  if (day < 1 || day > 365) return null;
  return { day, completed: day - 1 };
}

export function ProgressCodeDemo({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Abrir código de progresso
      </Button>
      <ProgressCodeDialog open={open} onOpenChange={setOpen} code={DEMO_CODE} parseCode={parseDemoCode} onImport={() => setOpen(false)} />
    </>
  );
}

export function LessonDemo() {
  const [done, setDone] = React.useState([true, true, false, false]);
  const [completed, setCompleted] = React.useState(false);
  const blocks = [
    { kind: "review", minutes: 8, content: <p>Toque a troca Am–F do dia 33 por 2 minutos, a 70 BPM.</p> },
    {
      kind: "concept",
      minutes: 10,
      content: (
        <>
          <p>A pentatônica menor tem 5 notas. Na caixa 1, a tônica fica na corda 6, casa 5.</p>
          <Fretboard frets={9} startFret={4} markers={PENTA_BOX.slice(0, 12)} highlightRange={{ from: 5, to: 8 }} readOnly />
          <Callout variant="theory">Pentatônica = penta (cinco) + tônica (tom). Não tem a 2ª nem a 6ª da escala menor.</Callout>
        </>
      ),
    },
    { kind: "lab", minutes: 12, content: <Callout variant="warning">Comece a 60 BPM. Só suba quando tocar 4 vezes seguidas sem erro.</Callout> },
    { kind: "ear", minutes: 8, content: <p>Improvise 4 compassos usando só as notas 1, b3 e 5 sobre a base.</p> },
  ].map((b, i) => ({ ...b, done: done[i] })) as unknown as [LessonBlockData, LessonBlockData, LessonBlockData, LessonBlockData];
  return (
    <LessonLayout
      month={2}
      day={37}
      title="A primeira caixa da pentatônica"
      estimatedMinutes={38}
      objectives={["Tocar a caixa 1 da pentatônica de Lá menor", "Achar a tônica em três cordas", "Improvisar com três notas"]}
      blocks={blocks}
      onBlockDoneChange={(i, d) => setDone((arr) => arr.map((v, j) => (j === i ? d : v)))}
      onComplete={() => setCompleted(true)}
      completed={completed}
      className="px-0 py-0 sm:py-0"
    />
  );
}

export function LessonBlockDemo() {
  const [done, setDone] = React.useState(false);
  return (
    <LessonBlock index={3} kind="lab" minutes={12} done={done} onDoneChange={setDone}>
      <p>Alterne palhetada para baixo e para cima na corda 3, casa 5, a 70 BPM.</p>
    </LessonBlock>
  );
}

/* Base */

export function ButtonDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button>Concluir aula</Button>
        <Button variant="secondary">Ouvir de novo</Button>
        <Button variant="ghost">Pular</Button>
        <Button variant="danger">
          <Trash2 aria-hidden />
          Apagar progresso
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">Pequeno</Button>
        <Button size="md">Médio</Button>
        <Button size="lg">Grande</Button>
        <Button loading>Salvando</Button>
        <Button size="icon" variant="secondary" aria-label="Adicionar">
          <Plus aria-hidden />
        </Button>
      </div>
    </div>
  );
}

export function ToggleGroupDemo() {
  const [v, setV] = React.useState("4/4");
  return (
    <ToggleGroup type="single" value={v} onValueChange={(x) => x && setV(x)} aria-label="Compasso">
      {["2/4", "3/4", "4/4", "6/8"].map((x) => (
        <ToggleGroupItem key={x} value={x} className="font-mono">
          {x}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export function TabsDemo() {
  return (
    <Tabs defaultValue="tab">
      <TabsList aria-label="Ver como">
        <TabsTrigger value="tab">Tablatura</TabsTrigger>
        <TabsTrigger value="braco">Braço</TabsTrigger>
        <TabsTrigger value="partitura">Partitura</TabsTrigger>
      </TabsList>
      <TabsContent value="tab" className="text-muted">Números = casas. Linha de cima = corda mais aguda.</TabsContent>
      <TabsContent value="braco" className="text-muted">O braço mostra onde cada nota mora.</TabsContent>
      <TabsContent value="partitura" className="text-muted">A partitura mostra o ritmo exato.</TabsContent>
    </Tabs>
  );
}

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Abrir diálogo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pular para o dia 40?</DialogTitle>
          <DialogDescription>Você ainda não fez os dias 38 e 39. Dá para voltar depois.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Pular mesmo assim</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary" size="icon" aria-label="Lembrete">
          <Bell aria-hidden />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Lembrete diário às 20h</TooltipContent>
    </Tooltip>
  );
}

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Mês 2</Badge>
      <Badge tone="accent">Hoje</Badge>
      <Badge tone="good">Concluído</Badge>
      <Badge tone="warn">Desafio</Badge>
      <Badge tone="bad">Errou 3</Badge>
      <Badge tone="outline" mono>
        80 BPM
      </Badge>
      <Badge tone="solid">Novo</Badge>
    </div>
  );
}

export function ProgressDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Progress value={37 / 3.65} aria-label="Progresso do ano" />
      <Progress value={72} goal={80} tone="warn" aria-label="Acertos, meta 80%" />
      <Progress value={88} goal={80} tone="good" size="sm" aria-label="Acertos, meta batida" />
    </div>
  );
}

export function SliderDemo() {
  const [v, setV] = React.useState([75]);
  return (
    <div className="flex items-center gap-3">
      <Slider value={v} onValueChange={setV} min={50} max={100} step={5} thumbLabels={["Velocidade"]} />
      <output className="w-12 text-right font-mono font-semibold">{v[0]}%</output>
    </div>
  );
}

export function CheckboxDemo() {
  const [c, setC] = React.useState(true);
  return (
    <label className="flex min-h-11 items-center gap-3">
      <Checkbox checked={c} onCheckedChange={(v) => setC(v === true)} />
      <span>Lembrar de afinar antes de começar</span>
    </label>
  );
}

export function InputDemo() {
  return (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="ds-bpm">BPM alvo</Label>
      <Input id="ds-bpm" mono inputMode="numeric" defaultValue="80" aria-describedby="ds-bpm-msg" />
      <FieldMessage id="ds-bpm-msg">Entre 40 e 200.</FieldMessage>
      <Label htmlFor="ds-bad" className="mt-2">Código</Label>
      <Input id="ds-bad" mono defaultValue="3fa2 9c0" aria-invalid aria-describedby="ds-bad-msg" />
      <FieldMessage id="ds-bad-msg" tone="bad">Código inválido: confira se colou inteiro.</FieldMessage>
    </div>
  );
}

export function CalloutDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Callout variant="tip">Deixe o polegar atrás do braço, mais ou menos na altura do dedo médio.</Callout>
      <Callout variant="warning">Se doer o punho, pare. Dor não é parte do treino.</Callout>
      <Callout variant="selfCheck" title="Grave 30 segundos e ouça">As notas soam do mesmo volume?</Callout>
      <Callout variant="theory">Um tom = duas casas. Meio tom = uma casa.</Callout>
    </div>
  );
}

/* ───────────── Tokens ───────────── */

const UI_COLORS: [string, string][] = [
  ["bg", "Fundo da página"],
  ["surface", "Cartões e blocos"],
  ["surface-2", "Controles, áreas rebaixadas"],
  ["line", "Divisórias"],
  ["line-strong", "Bordas de controles"],
  ["fg", "Texto principal"],
  ["muted", "Texto secundário"],
  ["accent", "Ação, foco, agora"],
  ["on-accent", "Texto sobre accent"],
  ["accent-soft", "Seleção suave"],
  ["good", "Acertou"],
  ["warn", "Quase / desafio"],
  ["bad", "Errou"],
];
const PHYSICAL: [string, string][] = [
  ["wood", "Jacarandá"],
  ["headstock", "Mão"],
  ["nut", "Capotraste"],
  ["fret", "Traste"],
  ["string", "Corda lisa"],
  ["string-wound", "Corda encapada"],
  ["pearl", "Madrepérola"],
];
const DEGREES: [string, string][] = [
  ["deg-root", "Tônica"],
  ["deg-3", "Terça"],
  ["deg-5", "Quinta"],
  ["deg-7", "Sétima"],
  ["deg-ext", "Tensões 9 11 13"],
  ["note-in", "Da escala"],
  ["note-tension", "Tensa"],
  ["note-out", "Fora"],
  ["note-active", "Tocando"],
];

function Swatches({ items }: { items: [string, string][] }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {items.map(([name, desc]) => (
        <li key={name} className="flex items-center gap-3 rounded-sm border border-line bg-surface p-2">
          <span className="size-10 shrink-0 rounded-xs border border-line-strong" style={{ background: `var(--${name})` }} />
          <span className="min-w-0">
            <span className="block truncate font-mono text-xs font-semibold text-fg">--{name}</span>
            <span className="block truncate text-xs text-muted">{desc}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TokensDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="panel-label mb-2 text-muted">Interface (muda com o tema)</h3>
        <Swatches items={UI_COLORS} />
      </div>
      <div>
        <h3 className="panel-label mb-2 text-muted">Objeto físico (igual nos dois temas)</h3>
        <Swatches items={PHYSICAL} />
      </div>
      <div>
        <h3 className="panel-label mb-2 text-muted">Graus e notas</h3>
        <Swatches items={DEGREES} />
      </div>
      <div>
        <h3 className="panel-label mb-2 text-muted">Tipografia</h3>
        <div className="flex flex-col gap-2 rounded-md border border-line bg-surface p-4">
          <p className="font-display text-4xl font-extrabold tracking-tight">Bricolage 48</p>
          <p className="font-display text-3xl font-extrabold tracking-tight">Título da aula 36</p>
          <p className="font-display text-2xl font-bold">Seção 28</p>
          <p className="font-display text-xl font-bold">Bloco 21</p>
          <p className="text-lg">Lead 19: um amigo que toca bem e explica sem enrolar.</p>
          <p className="text-base">Texto 16: Figtree para tudo o que é lido com calma, com a guitarra no colo.</p>
          <p className="text-sm text-muted">Auxiliar 14</p>
          <p className="panel-label text-muted">Rótulo de painel 12</p>
          <p className="font-mono text-base">e|--5--8--| JetBrains Mono para tab, notas e BPM</p>
          <p className="font-mono text-5xl font-bold">120</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <h3 className="panel-label mb-2 text-muted">Raios</h3>
          <div className="flex items-end gap-3">
            {[["xs", "3"], ["sm", "6"], ["md", "10"], ["lg", "16"]].map(([k, v]) => (
              <div key={k} className="flex flex-col items-center gap-1">
                <span className={cn("size-12 border-2 border-fg bg-surface-2", `rounded-${k}`)} style={{ borderRadius: `${v}px` }} />
                <span className="font-mono text-xs text-muted">{k} {v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="panel-label mb-2 text-muted">Espaço (4px)</h3>
          <div className="flex flex-col gap-1">
            {[1, 2, 3, 4, 6, 8, 12].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <span className="h-3 bg-accent" style={{ width: n * 4 }} />
                <span className="font-mono text-xs text-muted">{n} · {n * 4}px</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="panel-label mb-2 text-muted">Sombras</h3>
          <div className="flex gap-3">
            <span className="size-14 rounded-md bg-surface shadow-sm" />
            <span className="size-14 rounded-md bg-surface shadow-md" />
            <span className="size-14 rounded-md bg-surface shadow-lg" />
            <span className="size-14 rounded-full bg-surface-2 shadow-knob" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Página ───────────── */

function Section({ title, children, id }: { title: string; children: React.ReactNode; id: string }) {
  return (
    <section id={id} className="flex flex-col gap-4 border-t border-line pt-8">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Item({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <h3 className="panel-label text-muted">{name}</h3>
      {children}
    </div>
  );
}

function Showcase() {
  return (
    <div className="flex flex-col gap-10">
      <Section id="tokens" title="Fundamentos">
        <TokensDemo />
      </Section>
      <Section id="musicais" title="Componentes musicais">
        <Item name="Fretboard"><FretboardDemo /></Item>
        <Item name="Fretboard vertical (celular)"><div className="flex justify-center"><Fretboard orientation="vertical" frets={7} startFret={4} markers={PENTA_BOX.slice(0, 12)} highlightRange={{ from: 5, to: 8 }} /></div></Item>
        <Item name="ChordDiagram"><ChordDiagramDemo /></Item>
        <Item name="ScoreFrame"><ScoreFrameDemo /></Item>
        <Item name="RhythmSlashes"><RhythmSlashesDemo /></Item>
        <div className="grid gap-6 lg:grid-cols-2">
          <Item name="Metronome"><MetronomeDemo /></Item>
          <div className="flex flex-col gap-6">
            <Item name="Drone"><DroneDemo /></Item>
            <Item name="BackingTrackPlayer"><BackingTrackDemo /></Item>
          </div>
          <Item name="EarTrainer"><EarTrainerDemo /></Item>
          <Item name="PitchMeter"><PitchMeterDemo /></Item>
        </div>
        <Item name="NoteFixPuzzle"><NoteFixDemo /></Item>
      </Section>
      <div id="keyboard" className="border-t border-line pt-8">
        <KeyboardPreviewSection />
      </div>
      <Section id="curso" title="Estrutura do curso">
        <Item name="AppHeader"><div className="overflow-hidden rounded-md border border-line"><AppHeaderDemo /></div></Item>
        <Item name="YearMap"><YearMapDemo /></Item>
        <Item name="MilestoneCard"><MilestoneDemo /></Item>
        <Item name="SelfCheck"><SelfCheckDemo /></Item>
        <Item name="ProgressCodeDialog"><div><ProgressCodeDemo /></div></Item>
        <Item name="LessonLayout + LessonBlock"><LessonDemo /></Item>
      </Section>
      <Section id="base" title="Base">
        <div className="grid gap-8 md:grid-cols-2">
          <Item name="Button"><ButtonDemo /></Item>
          <Item name="ToggleGroup"><ToggleGroupDemo /></Item>
          <Item name="Tabs"><TabsDemo /></Item>
          <Item name="Dialog · Tooltip"><div className="flex gap-2"><DialogDemo /><TooltipDemo /></div></Item>
          <Item name="Badge"><BadgeDemo /></Item>
          <Item name="Progress"><ProgressDemo /></Item>
          <Item name="Slider"><SliderDemo /></Item>
          <Item name="Checkbox"><CheckboxDemo /></Item>
          <Item name="Input"><InputDemo /></Item>
          <Item name="Callout"><CalloutDemo /></Item>
        </div>
      </Section>
    </div>
  );
}

export type DesignSystemPreviewProps = { defaultView?: "dark" | "light" | "both" };

export function DesignSystemPreview({ defaultView = "dark" }: DesignSystemPreviewProps) {
  const [view, setView] = React.useState<"dark" | "light" | "both">(defaultView);
  const panes: ("dark" | "light")[] = view === "both" ? ["dark", "light"] : [view];
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="panel-label text-accent">Design system</p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight">Pauta</h1>
            <p className="text-muted">Escola de música gratuita. Guitarra: madeira, níquel e madrepérola. Teclado: marfim, ébano e feltro. Nos dois temas.</p>
          </div>
          <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as typeof view)} aria-label="Tema da vitrine">
            <ToggleGroupItem value="dark">Escuro</ToggleGroupItem>
            <ToggleGroupItem value="light">Claro</ToggleGroupItem>
            <ToggleGroupItem value="both">
              Lado a lado <ArrowRight className="hidden" aria-hidden />
            </ToggleGroupItem>
          </ToggleGroup>
        </header>
        <div className={cn("grid gap-6", view === "both" && "xl:grid-cols-2")}>
          {panes.map((t) => (
            <div key={t} data-theme={t} className="min-w-0 rounded-lg bg-bg p-1 text-fg sm:p-4">
              {view === "both" && <p className="panel-label mb-4 text-muted">Tema {t === "dark" ? "escuro" : "claro"}</p>}
              <Showcase />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DesignSystemPreview;
