// src/components/music/voice/VoicePreviewSection.tsx
// Seção "Canto" da DesignSystemPreview: tudo nos dois temas, com o substituto
// SVG da cabeça no lugar do Chimera. Cada demo também é exportada para os cards.
import * as React from "react";
import { cn } from "../../../lib/cn";
import { midiToHz, suggestBody, type GuideState, type VoiceBody, type VoiceRange, type VoiceReading } from "../../../lib/voice";
import { ToggleGroup, ToggleGroupItem } from "../../ui/ToggleGroup";
import { Button } from "../../ui/Button";
import { ChimeraStage, type ChimeraStageSize, type ChimeraView } from "./ChimeraStage";
import { HeadPlaceholder } from "./HeadPlaceholder";
import { ChimeraCameo } from "./ChimeraCameo";
import { VoiceBodyPicker, type BodySuggestState } from "./VoiceBodyPicker";
import { VoiceRangeFinder, type RangeStep } from "./VoiceRangeFinder";
import { PitchRoll, type NoteResult, type RollMode, type RollNote, type TracePoint } from "./PitchRoll";
import { MatchNote } from "./MatchNote";
import { BreathCoach, type BreathPhase } from "./BreathCoach";
import { VowelMapPT } from "./VowelMapPT";
import { InsideTheVoice, type ComparisonId, type InsideTab } from "./InsideTheVoice";
import { RegisterGuide } from "./RegisterGuide";
import { VibratoMeter } from "./VibratoMeter";
import { SolfegeLadder } from "./SolfegeLadder";
import { WarmupCard, type WarmupItem } from "./WarmupCard";

/** Relógio da demo: segundos desde a montagem (parado com movimento reduzido). */
function useClock(fps = 30) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const id = setInterval(() => setT((performance.now() - start) / 1000), 1000 / fps);
    return () => clearInterval(id);
  }, [fps]);
  return t;
}

const RANGE: VoiceRange = { low: 45, high: 69, comfortLow: 50, comfortHigh: 64 };
const reading = (midi: number, clarity = 0.9): VoiceReading => ({ hz: midiToHz(midi), midi, cents: Math.round((midi - Math.round(midi)) * 100), level: 0.6, clarity });

/* ── ChimeraStage ─────────────────────────────────────────────────────── */

export function StageDemo() {
  const t = useClock();
  const [status, setStatus] = React.useState<GuideState["status"]>("singing");
  const [size, setSize] = React.useState<ChimeraStageSize>("inline");
  const [view, setView] = React.useState<ChimeraView>("3d");
  const [pressure, setPressure] = React.useState(true);
  const level = 0.5 + 0.4 * Math.sin(t * 5);
  const guide: GuideState = { status, syllable: "má", midi: 57, level };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <ToggleGroup type="single" size="sm" value={status} onValueChange={(v) => v && setStatus(v as GuideState["status"])} aria-label="Estado">
          {(["loading", "idle", "singing", "no-audio", "no-3d", "error"] as const).map((s) => (
            <ToggleGroupItem key={s} value={s}>
              {s}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ToggleGroup type="single" size="sm" value={size} onValueChange={(v) => v && setSize(v as ChimeraStageSize)} aria-label="Tamanho">
          <ToggleGroupItem value="hero">hero</ToggleGroupItem>
          <ToggleGroupItem value="inline">inline</ToggleGroupItem>
          <ToggleGroupItem value="cameo">cameo</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <ChimeraStage
        guide={guide}
        size={size}
        view={view}
        onViewChange={setView}
        controls={[{ id: "p", label: "Pressão", on: pressure, onToggle: setPressure }]}
        caption="Repare: a laringe sobe na nota aguda."
        onStartAudio={() => setStatus("idle")}
        onRetry={() => setStatus("loading")}
      >
        <HeadPlaceholder singing={status === "singing"} level={level} variant={view === "2d" || status === "no-3d" ? "cut" : "profile"} />
      </ChimeraStage>
    </div>
  );
}

/* ── ChimeraCameo ─────────────────────────────────────────────────────── */

export function CameoDemo() {
  const [open, setOpen] = React.useState(true);
  const [singing, setSinging] = React.useState(false);
  const [petted, setPetted] = React.useState(false);
  return (
    <div className="relative min-h-64 rounded-md border border-dashed border-line-strong p-4">
      <p className="max-w-sm text-sm text-muted">Área do exercício. O cameo fica no canto, nunca por cima do que o aluno precisa ver. Toque nele para cantar; passe o ponteiro em cima da cabeça para fazer carinho.</p>
      {!open && (
        <Button size="sm" variant="secondary" className="mt-3" onClick={() => setOpen(true)}>
          Mostrar o cameo
        </Button>
      )}
      <ChimeraCameo
        open={open}
        position="absolute"
        message="Primeira nota afinada!"
        onClose={() => setOpen(false)}
        onTouch={() => { setSinging(true); setTimeout(() => setSinging(false), 900); }}
        onPet={() => { setPetted(true); setTimeout(() => setPetted(false), 1500); }}
        guide={{ status: singing ? "singing" : "idle", level: 0.7 }}
        autoHideMs={0}
      >
        <HeadPlaceholder variant="profile" singing={singing} level={0.7} petted={petted} />
      </ChimeraCameo>
    </div>
  );
}

/* ── VoiceBodyPicker ──────────────────────────────────────────────────── */

export function BodyPickerDemo() {
  const [body, setBody] = React.useState<VoiceBody>({ female: 0.3, child: 0.3 });
  const [preview, setPreview] = React.useState<VoiceBody | null>(null);
  const [applying, setApplying] = React.useState(false);
  const [sug, setSug] = React.useState<BodySuggestState>("idle");
  const shown = preview ?? body;
  return (
    <VoiceBodyPicker
      value={body}
      onPreview={setPreview}
      onCommit={(b) => { setPreview(null); setBody(b); setApplying(true); setTimeout(() => setApplying(false), 700); }}
      applying={applying}
      suggestion={sug === "ready" ? suggestBody(150, RANGE) : null}
      suggestState={sug}
      onMeasure={() => { setSug("listening"); setTimeout(() => setSug("ready"), 1200); }}
      onListen={() => {}}
      stage={
        <ChimeraStage size="hero" guide={{ status: applying ? "loading" : "idle" }}>
          <HeadPlaceholder body={shown} variant="profile" />
        </ChimeraStage>
      }
    />
  );
}

/* ── VoiceRangeFinder ─────────────────────────────────────────────────── */

export function RangeFinderDemo() {
  const t = useClock(20);
  const [step, setStep] = React.useState<RangeStep>("comfort");
  const [range, setRange] = React.useState<Partial<VoiceRange>>({ low: 45, high: 69 });
  const live = step === "low" ? 47 + Math.sin(t) * 2 : step === "high" ? 66 + Math.sin(t) * 2 : 55 + Math.sin(t / 2) * 5;
  return (
    <VoiceRangeFinder
      step={step}
      onStepChange={setStep}
      reading={reading(live)}
      range={range}
      onRangeChange={setRange}
      onRedo={() => { setRange({}); setStep("low"); }}
      body={{ female: 0.3, child: 0 }}
    />
  );
}

/* ── PitchRoll ────────────────────────────────────────────────────────── */

const VOCALISE: RollNote[] = [
  { midi: 50, t0: 0, t1: 1, syllable: "ma" },
  { midi: 52, t0: 1, t1: 2, syllable: "me" },
  { midi: 54, t0: 2, t1: 3, syllable: "mi" },
  { midi: 55, t0: 3, t1: 4, syllable: "mo" },
  { midi: 57, t0: 4, t1: 6, syllable: "mu" },
  { midi: 55, t0: 6, t1: 7, syllable: "mo" },
  { midi: 54, t0: 7, t1: 8, syllable: "mi" },
  { midi: 52, t0: 8, t1: 9, syllable: "me" },
  { midi: 50, t0: 9, t1: 11, syllable: "ma" },
];
const at = (t: number) => VOCALISE.find((n) => t >= n.t0 && t < n.t1);
const GUIDE: TracePoint[] = Array.from({ length: 230 }, (_, i) => {
  const t = i * 0.05;
  const n = at(t);
  return { t, midi: n ? n.midi + 0.12 * Math.sin(t * 2 * Math.PI * 5.5) * Math.min(1, (t - n.t0) * 2) : null };
});
const YOU: TracePoint[] = Array.from({ length: 230 }, (_, i) => {
  const t = i * 0.05 + 0.15;
  const n = at(t - 0.15);
  if (!n || t - n.t0 < 0.2) return { t, midi: null };
  const k = VOCALISE.indexOf(n);
  const off = k === 2 ? -0.45 : k === 4 ? 0.1 - Math.max(0, 0.6 - (t - n.t0)) * 1.2 : k === 6 ? -12.05 : 0.05;
  return { t, midi: n.midi + off + 0.08 * Math.sin(t * 9) };
});
const RESULTS: NoteResult[] = ["in-tune", "in-tune", "low", "in-tune", "scoop", "in-tune", "octave-below", "in-tune", "missed"];

export function PitchRollDemo() {
  const t = useClock();
  const [mode, setMode] = React.useState<RollMode>("together");
  const now = 2 + (t % 9);
  const done = RESULTS.map((r, i) => (VOCALISE[i].t1 < now ? r : undefined));
  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup type="single" size="sm" value={mode} onValueChange={(v) => v && setMode(v as RollMode)} aria-label="Modo">
        <ToggleGroupItem value="listen">Ouça</ToggleGroupItem>
        <ToggleGroupItem value="together">Junto</ToggleGroupItem>
        <ToggleGroupItem value="your-turn">Sua vez</ToggleGroupItem>
      </ToggleGroup>
      <PitchRoll notes={VOCALISE} guideTrace={GUIDE} youTrace={YOU} now={now} range={RANGE} mode={mode} results={done} />
    </div>
  );
}

/* ── MatchNote ────────────────────────────────────────────────────────── */

export function MatchNoteDemo() {
  const [cents, setCents] = React.useState(-35);
  const [oct, setOct] = React.useState(0);
  const target = 55;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="panel-label text-muted">Simular voz</span>
        <input type="range" min={-90} max={90} value={cents} onChange={(e) => setCents(Number(e.target.value))} aria-label="Cents" className="w-48 accent-[var(--accent)]" />
        <ToggleGroup type="single" size="sm" value={String(oct)} onValueChange={(v) => v && setOct(Number(v))} aria-label="Oitava">
          <ToggleGroupItem value="-1">8ª abaixo</ToggleGroupItem>
          <ToggleGroupItem value="0">mesma</ToggleGroupItem>
          <ToggleGroupItem value="1">8ª acima</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <MatchNote target={target} reading={reading(target + oct * 12 + cents / 100)} held={Math.abs(cents) <= 25 && oct === 0 ? 1.4 : 0.3} onReplay={() => {}} />
    </div>
  );
}

/* ── BreathCoach ──────────────────────────────────────────────────────── */

export function BreathDemo() {
  const t = useClock(10);
  const pattern: [number, number, number] = [4, 4, 8];
  const cycleLen = 16;
  const c = t % cycleLen;
  const phase: BreathPhase = c < 4 ? "in" : c < 8 ? "hold" : "out";
  const elapsed = phase === "in" ? c : phase === "hold" ? c - 4 : c - 8;
  const levels = Array.from({ length: 60 }, (_, i) => 0.55 + 0.05 * Math.sin(i / 3) + (i > 40 ? 0.15 * Math.sin(i * 1.7) : 0));
  const guideAir = Array.from({ length: 60 }, (_, i) => 0.6 - i * 0.003);
  return <BreathCoach pattern={pattern} phase={phase} elapsed={elapsed} cycle={Math.floor(t / cycleLen) + 1} cycles={4} levels={levels} guideAir={guideAir} running />;
}

/* ── VowelMapPT ───────────────────────────────────────────────────────── */

export function VowelDemo() {
  const t = useClock(10);
  const [sel, setSel] = React.useState<import("../../../lib/voice").VowelId | null>("é");
  const trail = Array.from({ length: 12 }, (_, i) => ({ f1: 600 + 40 * Math.sin((t - i * 0.1) * 1.3), f2: 1800 + 120 * Math.cos((t - i * 0.1) * 0.9) }));
  return <VowelMapPT body={{ female: 0, child: 0 }} trail={trail} selected={sel} onSelect={setSel} />;
}

/* ── InsideTheVoice ───────────────────────────────────────────────────── */

export function InsideDemo() {
  const [tab, setTab] = React.useState<InsideTab>("head");
  const [cmp, setCmp] = React.useState<ComparisonId | null>("larynx");
  const placeholder = (k: InsideTab) =>
    k === "head" ? <HeadPlaceholder variant="cut" /> : (
      <svg viewBox="0 0 200 100" className="h-full w-full" aria-hidden>
        <text x={100} y={54} textAnchor="middle" fontFamily="var(--font-stage)" fontSize={10} fill="var(--stage-body-dim)">
          {k.toUpperCase()} (VISTA DO CHIMERA)
        </text>
      </svg>
    );
  return (
    <InsideTheVoice
      tab={tab}
      onTabChange={setTab}
      views={{ head: placeholder("head"), folds: placeholder("folds"), tube: placeholder("tube"), spectrum: placeholder("spectrum") }}
      guide={{ status: "idle" }}
      compare={cmp}
      onCompareChange={setCmp}
      compareViews={[<HeadPlaceholder key="a" variant="cut" />, <HeadPlaceholder key="b" variant="cut" body={{ female: 0, child: 0.2 }} />]}
      onPlaySide={() => {}}
    />
  );
}

/* ── RegisterGuide, VibratoMeter, SolfegeLadder, WarmupCard ───────────── */

export function RegisterDemo() {
  const t = useClock(10);
  return <RegisterGuide range={RANGE} body={{ female: 0.3, child: 0 }} reading={reading(58 + 6 * Math.sin(t / 2))} />;
}

export function VibratoDemo() {
  const t = useClock(20);
  const [kind, setKind] = React.useState<"good" | "slow" | "fast" | "none">("good");
  const rate = kind === "slow" ? 3.6 : kind === "fast" ? 8.6 : 5.8;
  const depth = kind === "none" ? 0.04 : 0.55;
  const samples = Array.from({ length: 120 }, (_, i) => {
    const tt = t - 2 + i / 60;
    return { t: tt, midi: 57 + depth * Math.sin(tt * 2 * Math.PI * rate) };
  });
  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup type="single" size="sm" value={kind} onValueChange={(v) => v && setKind(v as typeof kind)} aria-label="Cenário">
        <ToggleGroupItem value="good">Bom</ToggleGroupItem>
        <ToggleGroupItem value="slow">Lento</ToggleGroupItem>
        <ToggleGroupItem value="fast">Rápido</ToggleGroupItem>
        <ToggleGroupItem value="none">Reto</ToggleGroupItem>
      </ToggleGroup>
      <VibratoMeter samples={samples} />
    </div>
  );
}

export function SolfegeDemo() {
  const t = useClock(10);
  return <SolfegeLadder range={RANGE} target={4} guideStep={4} reached={[0, 2]} reading={reading(48 + 7 - 0.6 + Math.min(0.6, (t % 4) / 3))} />;
}

const WARMUP: WarmupItem[] = [
  { id: "lip-trill", seconds: 60, done: true },
  { id: "hum", seconds: 60, done: true },
  { id: "siren", seconds: 90 },
  { id: "five-note", seconds: 120 },
];

export function WarmupDemo() {
  const [items, setItems] = React.useState(WARMUP);
  return (
    <div className="grid gap-4">
      <WarmupCard items={items} current={2} onDemo={() => {}} onToggleDone={(id, d) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, done: d } : x)))} />
      <WarmupCard variant="cooldown" items={[{ id: "slide-down", seconds: 60 }, { id: "yawn", seconds: 45 }, { id: "hum", seconds: 45 }]} pause={30} />
    </div>
  );
}

/* ── Tokens ───────────────────────────────────────────────────────────── */

export function VoiceTokensDemo() {
  const fixed = ["stage-bg", "stage-frame", "stage-line", "stage-body", "stage-body-dim", "stage-sound", "stage-text"];
  const themed = ["voice-guide", "voice-you", "voice-target", "breath-in", "breath-hold", "breath-out", "register-chest", "register-mix", "register-head"];
  const Sw = ({ n }: { n: string }) => (
    <li className="flex items-center gap-2">
      <span className="size-9 shrink-0 rounded-xs ring-1 ring-line-strong" style={{ background: `var(--${n})` }} aria-hidden />
      <span className="truncate font-mono text-xs text-fg">{n}</span>
    </li>
  );
  return (
    <div className="flex flex-col gap-3">
      <p className="panel-label text-muted">Monitor do Chimera (fixos)</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">{fixed.map((n) => <Sw key={n} n={n} />)}</ul>
      <p className="panel-label text-muted">Por tema</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">{themed.map((n) => <Sw key={n} n={n} />)}</ul>
    </div>
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

export type VoicePreviewSectionProps = { className?: string };

/** Seção "Canto" para encaixar na DesignSystemPreview. */
export function VoicePreviewSection({ className }: VoicePreviewSectionProps) {
  return (
    <section aria-labelledby="ds-canto" className={cn("flex flex-col gap-10", className)}>
      <header className="flex flex-col gap-1">
        <p className="panel-label text-muted">Seção</p>
        <h2 id="ds-canto" className="font-display text-2xl font-bold text-fg">
          Canto
        </h2>
        <p className="max-w-2xl text-base text-muted">
          O instrumento é o corpo do aluno, e o Chimera mostra o que ele não vê. Dentro do monitor vale o Chimera (preto, azul, âmbar, Hershey); fora
          dele, a Pauta. Âmbar tracejado com quadrado = Chimera. Teal cheio com bolinha = você.
        </p>
      </header>
      <Row title="Tokens do canto" wide>{() => <VoiceTokensDemo />}</Row>
      <Row title="ChimeraStage" wide>{() => <StageDemo />}</Row>
      <Row title="ChimeraCameo">{() => <CameoDemo />}</Row>
      <Row title="VoiceBodyPicker" wide>{() => <BodyPickerDemo />}</Row>
      <Row title="VoiceRangeFinder">{() => <RangeFinderDemo />}</Row>
      <Row title="PitchRoll" wide>{() => <PitchRollDemo />}</Row>
      <Row title="MatchNote">{() => <MatchNoteDemo />}</Row>
      <Row title="BreathCoach">{() => <BreathDemo />}</Row>
      <Row title="VowelMapPT" wide>{() => <VowelDemo />}</Row>
      <Row title="InsideTheVoice" wide>{() => <InsideDemo />}</Row>
      <Row title="RegisterGuide">{() => <RegisterDemo />}</Row>
      <Row title="VibratoMeter">{() => <VibratoDemo />}</Row>
      <Row title="SolfegeLadder">{() => <SolfegeDemo />}</Row>
      <Row title="WarmupCard">{() => <WarmupDemo />}</Row>
    </section>
  );
}


