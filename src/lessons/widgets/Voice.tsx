// Widgets do curso de canto: ligam os componentes de src/components/music/voice
// ao microfone (app/voice.ts) e ao Chimera de verdade (vendor/chimera).
import * as React from "react";
import { Check, Mic, MicOff, Play, Square, Volume2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Callout } from "../../components/ui/Callout";
import { Panel } from "../../components/music/controls";
import { ChimeraStage, type ChimeraView } from "../../components/music/voice/ChimeraStage";
import { ChimeraHead, useChimera, useGuideState } from "../../components/music/voice/ChimeraLive";
import { VoiceBodyPicker, type BodySuggestState } from "../../components/music/voice/VoiceBodyPicker";
import { MatchNote } from "../../components/music/voice/MatchNote";
import { PitchRoll, type NoteResult, type RollMode, type RollNote, type TracePoint } from "../../components/music/voice/PitchRoll";
import { BreathCoach, type BreathPhase } from "../../components/music/voice/BreathCoach";
import { WarmupCard, type WarmupItem } from "../../components/music/voice/WarmupCard";
import { VoiceRangeFinder, type RangeStep } from "../../components/music/voice/VoiceRangeFinder";
import { VowelMapPT } from "../../components/music/voice/VowelMapPT";
import { SolfegeLadder } from "../../components/music/voice/SolfegeLadder";
import { audio, tick } from "../../app/audio";
import { chimeraSing, homeFromBody, readyChimera, setVoiceProfile, stopChimera, useMic, useVoiceProfile, type SungNote } from "../../app/voice";
import { hzToMidi, pitchVsTarget, steadiness, suggestBody, voiceNoteName, type VoiceRange, type VowelId } from "../../lib/voice";
import { EN } from "../../lib/strings-en";
import { getLocale, L } from "../../i18n";
import { md } from "../md";

const lang = () => getLocale();
const en = <K extends keyof typeof EN>(k: K) => (getLocale() === "en" ? EN[k] : undefined);
/** Graus da escala maior em semitons (0 = 1º grau … 7 = oitava). */
const MAJOR = [0, 2, 4, 5, 7, 9, 11, 12];

function MicError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <Callout variant="warning" label={L("Microfone", "Microphone")}>
      <p>{L("Não consegui abrir o microfone. Libere o acesso no cadeado ao lado do endereço e tente de novo.", "I couldn't open the microphone. Allow access in the padlock next to the address and try again.")}</p>
    </Callout>
  );
}

function Done({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-semibold text-good">
      <Check aria-hidden className="size-5" />
      {children}
    </p>
  );
}

/* ── Ajuste de voz: o triângulo + a nota-base ──────────────────────────── */

export function VoiceSetup() {
  const { mods, error, retry } = useChimera();
  const profile = useVoiceProfile();
  const guide = useGuideState(mods);
  const [view, setView] = React.useState<ChimeraView>("3d");
  const [applying, setApplying] = React.useState(false);
  const [measuring, setMeasuring] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState<{ body: typeof profile.body; home: number } | null>(null);
  const samples = React.useRef<number[]>([]);
  const mic = useMic(measuring, (f) => {
    if (f.reading) samples.current.push(f.reading.hz);
  });

  React.useEffect(() => {
    if (!mods) return;
    const st = mods.useStore.getState();
    if (st.body.female !== profile.body.female || st.body.child !== profile.body.child) st.setBody(profile.body);
  }, [mods, profile.body]);

  const measure = () => {
    samples.current = [];
    setSuggestion(null);
    setMeasuring(true);
    window.setTimeout(() => {
      setMeasuring(false);
      const xs = samples.current.filter((h) => h > 70 && h < 500).sort((a, b) => a - b);
      if (xs.length < 8) return;
      const median = xs[Math.floor(xs.length / 2)];
      setSuggestion({ body: suggestBody(median), home: Math.round(hzToMidi(median)) + 2 });
    }, 6000);
  };

  const commit = (body: typeof profile.body, home?: number) => {
    setVoiceProfile({ body, home: home ?? (profile.measured ? profile.home : homeFromBody(body)), measured: home !== undefined || profile.measured });
    if (mods) {
      setApplying(true);
      mods.useStore.getState().setBody(body);
      window.setTimeout(() => setApplying(false), 900);
    }
  };

  const stage = mods ? (
    <ChimeraStage
      guide={guide}
      size="inline"
      view={view}
      onViewChange={setView}
      onStartAudio={() => void readyChimera()}
      strings={en("chimera")}
    >
      <ChimeraHead mods={mods} view={view} />
    </ChimeraStage>
  ) : (
    <ChimeraStage guide={{ status: error ? "error" : "loading" }} size="inline" onRetry={retry} strings={en("chimera")} />
  );

  return (
    <div className="flex flex-col gap-4">
      <VoiceBodyPicker
        value={profile.body}
        onPreview={(b) => mods?.useStore.getState().previewBody(b)}
        onCommit={(b) => commit(b)}
        applying={applying}
        suggestion={suggestion?.body ?? null}
        suggestState={measuring ? "listening" : suggestion ? "ready" : ("idle" as BodySuggestState)}
        onMeasure={measure}
        onListen={() => void chimeraSing([{ midi: profile.home, seconds: 0.6, vowel: "a" }, { midi: profile.home + 4, seconds: 0.6, vowel: "a" }, { midi: profile.home + 7, seconds: 1.2, vowel: "a" }])}
        stage={stage}
        lang={lang()}
        strings={en("voiceBody")}
      />
      {measuring && (
        <Callout variant="tip" label={L("Ouvindo", "Listening")}>
          <p>{L("Fale normalmente por uns 5 segundos: diga seu nome, conte até dez, conte como foi seu dia.", "Speak normally for about 5 seconds: say your name, count to ten, tell me about your day.")}</p>
        </Callout>
      )}
      {suggestion && (
        <div className="flex flex-wrap items-center gap-3">
          <p>
            {L("Sua nota da fala fica perto de", "Your speaking note is near")} <strong>{voiceNoteName(suggestion.home - 2, lang())}</strong>.
          </p>
          <Button onClick={() => commit(suggestion.body, suggestion.home)}>
            <Check aria-hidden />
            {L("Usar sugestão", "Use suggestion")}
          </Button>
        </div>
      )}
      <MicError error={mic.error} />
      <p className="text-sm text-muted">
        {L("Sua nota-base agora:", "Your home note now:")} <strong className="text-fg">{voiceNoteName(profile.home, lang())}</strong>
        {profile.measured ? L(" (medida pela sua fala)", " (measured from your speech)") : L(" (estimada pelo corpo escolhido)", " (estimated from the chosen body)")}.{" "}
        {L("Todos os exercícios partem dela.", "Every exercise starts from it.")}
      </p>
    </div>
  );
}

/* ── O Chimera mostrando por dentro ────────────────────────────────────── */

export type ChimeraDemo = { label: string; notes: number[]; vowel?: VowelId; vowels?: VowelId[]; seconds?: number; source?: Record<string, number> };

export function ChimeraShow({ demos, caption, view: initial = "3d" }: { demos: ChimeraDemo[]; caption?: string; view?: ChimeraView }) {
  const { mods, error, retry } = useChimera();
  const profile = useVoiceProfile();
  const guide = useGuideState(mods);
  const [view, setView] = React.useState<ChimeraView>(initial);
  const [playing, setPlaying] = React.useState<number | null>(null);

  const play = async (i: number) => {
    const d = demos[i];
    setPlaying(i);
    await chimeraSing(
      d.notes.map((n, k) => ({ midi: profile.home + n, seconds: d.seconds ?? 1.2, vowel: d.vowels?.[k] ?? d.vowel ?? "a" })),
      { source: d.source },
    );
    setPlaying((p) => (p === i ? null : p));
  };

  return (
    <div className="flex flex-col gap-3">
      {mods ? (
        <ChimeraStage guide={guide} size="inline" view={view} onViewChange={setView} onStartAudio={() => void readyChimera()} caption={caption ? md(caption) : undefined} strings={en("chimera")}>
          <ChimeraHead mods={mods} view={view} />
        </ChimeraStage>
      ) : (
        <ChimeraStage guide={{ status: error ? "error" : "loading" }} size="inline" onRetry={retry} strings={en("chimera")} />
      )}
      <div className="flex flex-wrap gap-2">
        {demos.map((d, i) => (
          <Button key={i} variant={playing === i ? "primary" : "secondary"} disabled={!mods} onClick={() => (playing === i ? stopChimera() : void play(i))}>
            {playing === i ? <Square aria-hidden /> : <Volume2 aria-hidden />}
            {d.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

/* ── Repetir uma nota ──────────────────────────────────────────────────── */

export function MatchWidget({ offset, vowel = "a", tolerance = 50, hold = 3, title }: { offset: number; vowel?: VowelId; tolerance?: number; hold?: number; title?: string }) {
  const profile = useVoiceProfile();
  const target = profile.home + offset;
  const [listening, setListening] = React.useState(false);
  const [held, setHeld] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const last = React.useRef(0);
  const mic = useMic(listening, (f) => {
    const now = performance.now();
    const dt = last.current ? (now - last.current) / 1000 : 0;
    last.current = now;
    const r = f.reading;
    const ok = r && Math.abs(pitchVsTarget(r.midi, target).cents) <= tolerance;
    setHeld((h) => {
      const next = ok ? h + dt : Math.max(0, h - dt * 0.5);
      if (next >= hold) setDone(true);
      return next;
    });
  });

  const replay = () => {
    setListening(false);
    void chimeraSing([{ midi: target, seconds: 2, vowel }]);
  };

  return (
    <Panel label={title ?? L("Repita a nota", "Match the note")}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={replay}>
            <Volume2 aria-hidden />
            {L("Ouvir o Chimera", "Hear Chimera")}
          </Button>
          <Button
            variant={listening ? "primary" : "secondary"}
            onClick={() => {
              stopChimera();
              last.current = 0;
              setHeld(0);
              setListening((x) => !x);
            }}
          >
            {listening ? <MicOff aria-hidden /> : <Mic aria-hidden />}
            {listening ? L("Parar", "Stop") : L("Cantar", "Sing")}
          </Button>
        </div>
        <MatchNote target={target} reading={mic.frame.reading} tolerance={tolerance} held={Math.min(held, hold)} holdGoal={hold} onReplay={replay} lang={lang()} strings={en("pitchMatch")} />
        <MicError error={mic.error} />
        {done && <Done>{L(`Segurou ${hold} segundos na nota. Muito bem!`, `You held the note for ${hold} seconds. Well done!`)}</Done>}
      </div>
    </Panel>
  );
}

/* ── Cantar uma frase (piano roll) ─────────────────────────────────────── */

export type PhraseNote = { s: number; d: number; syl?: string; v?: VowelId };

const SYL_VOWEL: Record<string, VowelId> = { a: "a", á: "a", à: "a", â: "a", e: "ê", é: "é", ê: "ê", i: "i", í: "i", o: "ô", ó: "ó", ô: "ô", u: "u", ú: "u", ã: "a", õ: "ô" };
function vowelOf(n: PhraseNote): VowelId {
  if (n.v) return n.v;
  const ch = [...(n.syl ?? "a").toLowerCase()].reverse().find((c) => c in SYL_VOWEL);
  return ch ? SYL_VOWEL[ch] : "a";
}

export function PhraseWidget({
  notes,
  bpm,
  title,
  tolerance = 50,
  feedback = "live",
  goal = 0.8,
}: {
  notes: PhraseNote[];
  bpm: number;
  title?: string;
  tolerance?: number;
  feedback?: "live" | "after" | "hidden";
  goal?: number;
}) {
  const profile = useVoiceProfile();
  const beat = 60 / bpm;
  const roll: RollNote[] = React.useMemo(() => {
    let t = 0;
    return notes.map((n) => {
      const r = { midi: profile.home + n.s, t0: t, t1: t + n.d * beat, syllable: n.syl ?? "" };
      t += n.d * beat;
      return r;
    });
  }, [notes, beat, profile.home]);
  const end = roll[roll.length - 1]?.t1 ?? 0;
  const range: VoiceRange = React.useMemo(() => {
    const ms = roll.map((n) => n.midi);
    const lo = Math.min(...ms), hi = Math.max(...ms);
    return { low: lo - 4, high: hi + 4, comfortLow: lo - 2, comfortHigh: hi + 2 };
  }, [roll]);
  const guideTrace: TracePoint[] = React.useMemo(() => roll.flatMap((n) => [{ t: n.t0, midi: n.midi }, { t: n.t1 - 0.02, midi: n.midi }, { t: n.t1 - 0.01, midi: null }]), [roll]);

  const [mode, setMode] = React.useState<RollMode>("listen");
  const [state, setState] = React.useState<"idle" | "listen" | "count" | "sing" | "done">("idle");
  const [now, setNow] = React.useState(0);
  const [you, setYou] = React.useState<TracePoint[]>([]);
  const [results, setResults] = React.useState<(NoteResult | undefined)[]>([]);
  const start = React.useRef(0);
  const youRef = React.useRef<TracePoint[]>([]);
  const raf = React.useRef(0);

  const mic = useMic(state === "sing" || state === "count", (f) => {
    if (state !== "sing") return;
    const t = (performance.now() - start.current) / 1000;
    youRef.current.push({ t, midi: f.reading ? f.reading.midi : null });
    if (feedback === "live") setYou([...youRef.current]);
  });

  const runClock = (onEnd: () => void) => {
    cancelAnimationFrame(raf.current);
    const loop = () => {
      const t = (performance.now() - start.current) / 1000;
      setNow(t);
      if (t >= end + 0.3) return onEnd();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  };
  React.useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const listen = async () => {
    setMode("listen");
    setState("listen");
    setYou([]);
    setResults([]);
    const sung: SungNote[] = roll.map((n, i) => ({ midi: n.midi, seconds: n.t1 - n.t0, vowel: vowelOf(notes[i]) }));
    const p = chimeraSing(sung, { gap: 0.04 });
    start.current = performance.now();
    runClock(() => setState("idle"));
    await p;
  };

  const sing = () => {
    stopChimera();
    setMode("your-turn");
    setResults([]);
    youRef.current = [];
    setYou([]);
    setState("count");
    const c = audio();
    const t0 = c.currentTime + 0.1;
    for (let i = 0; i < 4; i++) tick(t0 + i * beat, i === 0);
    window.setTimeout(() => {
      start.current = performance.now();
      setState("sing");
      runClock(finish);
    }, (0.1 + 4 * beat) * 1000);
  };

  const finish = () => {
    const pts = youRef.current;
    const res: NoteResult[] = roll.map((n) => {
      const dur = n.t1 - n.t0;
      const xs = pts.filter((p) => p.midi !== null && p.t >= n.t0 + Math.min(0.15, dur * 0.25) && p.t <= n.t1).map((p) => p.midi as number).sort((a, b) => a - b);
      if (xs.length < 3) return "missed";
      const med = xs[Math.floor(xs.length / 2)];
      const { octave, cents } = pitchVsTarget(med, n.midi);
      if (Math.abs(cents) > tolerance) return cents < 0 ? "low" : "high";
      if (octave < 0) return "octave-below";
      if (octave > 0) return "octave-above";
      return "in-tune";
    });
    setYou([...pts]);
    setResults(res);
    setState("done");
  };

  const hits = results.filter((r) => r === "in-tune" || r === "octave-below" || r === "octave-above").length;
  const score = results.length ? hits / results.length : 0;
  const octaves = results.some((r) => r === "octave-below" || r === "octave-above");

  return (
    <Panel label={title ?? L("Cante a frase", "Sing the phrase")} aside={<span className="font-mono text-xs text-muted">{bpm} bpm · ±{tolerance} cents</span>}>
      <div className="flex flex-col gap-3">
        <PitchRoll
          notes={roll}
          guideTrace={guideTrace}
          youTrace={feedback === "live" || state === "done" ? you : []}
          now={state === "idle" ? 0 : state === "done" ? end : Math.max(0, now)}
          review={state === "done"}
          range={range}
          tolerance={tolerance}
          mode={mode}
          results={state === "done" ? results : undefined}
          windowSec={state === "done" ? end + 0.6 : Math.max(6, Math.min(12, end + 1))}
          lang={lang()}
          strings={en("voice")}
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" disabled={state === "count" || state === "sing"} onClick={() => void listen()}>
            <Volume2 aria-hidden />
            {L("Ouvir o Chimera", "Hear Chimera")}
          </Button>
          <Button disabled={state === "count" || state === "sing"} onClick={sing}>
            <Mic aria-hidden />
            {state === "count" ? L("Prepare… 1, 2, 3, 4", "Get ready… 1, 2, 3, 4") : state === "sing" ? L("Cantando…", "Singing…") : L("Cantar (4 batidas antes)", "Sing (4 clicks first)")}
          </Button>
        </div>
        {feedback !== "live" && state === "sing" && <p className="text-sm text-muted">{L("O gráfico aparece no fim. Confie no ouvido.", "The graph shows up at the end. Trust your ear.")}</p>}
        <MicError error={mic.error} />
        {state === "done" && (
          <div className="flex flex-col gap-1">
            <p>
              {L(`${hits} de ${results.length} notas dentro de ±${tolerance} cents.`, `${hits} of ${results.length} notes within ±${tolerance} cents.`)}{" "}
              {octaves && L("(Notas uma oitava acima ou abaixo também valem.)", "(Notes an octave above or below count too.)")}
            </p>
            {score >= goal ? (
              <Done>{L("Meta do exercício alcançada!", "Exercise goal reached!")}</Done>
            ) : (
              <p className="text-muted">{L(`A meta é ${Math.round(goal * 100)}%. Ouça de novo e tente outra vez, sem pressa.`, `The goal is ${Math.round(goal * 100)}%. Listen again and try once more, no rush.`)}</p>
            )}
          </div>
        )}
      </div>
    </Panel>
  );
}

/* ── Respiração ────────────────────────────────────────────────────────── */

export function BreathWidget({ pattern, cycles = 4 }: { pattern: [number, number, number]; cycles?: number }) {
  const [running, setRunning] = React.useState(false);
  const [t, setT] = React.useState(0);
  const [levels, setLevels] = React.useState<number[]>([]);
  const start = React.useRef(0);
  const cycleLen = pattern[0] + pattern[1] + pattern[2];
  const c = t % cycleLen;
  const phase: BreathPhase = !running ? "idle" : c < pattern[0] ? "in" : c < pattern[0] + pattern[1] ? "hold" : "out";
  const elapsed = phase === "in" ? c : phase === "hold" ? c - pattern[0] : c - pattern[0] - pattern[1];
  const cycle = Math.floor(t / cycleLen) + 1;
  const phaseRef = React.useRef(phase);
  phaseRef.current = phase;
  const mic = useMic(running, (f) => {
    if (phaseRef.current === "out") setLevels((xs) => [...xs.slice(-79), f.level]);
  });
  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const nt = (performance.now() - start.current) / 1000;
      if (nt >= cycleLen * cycles) {
        setRunning(false);
        setT(0);
        return;
      }
      setT(nt);
    }, 100);
    return () => clearInterval(id);
  }, [running, cycleLen, cycles]);
  React.useEffect(() => {
    if (phase === "in") setLevels([]);
  }, [phase, cycle]);
  return (
    <div className="flex flex-col gap-2">
      <BreathCoach
        pattern={pattern}
        phase={phase}
        elapsed={elapsed}
        cycle={Math.min(cycle, cycles)}
        cycles={cycles}
        levels={levels}
        running={running}
        onStart={() => {
          start.current = performance.now();
          setT(0);
          setLevels([]);
          setRunning(true);
        }}
        onStop={() => setRunning(false)}
        strings={en("breath")}
      />
      <MicError error={mic.error} />
    </div>
  );
}

/* ── "sss" cronometrado ────────────────────────────────────────────────── */

const SSS_KEY = "pauta:voice:sss";
function readSss(): { first?: number; best?: number } {
  try {
    return JSON.parse(localStorage.getItem(SSS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function SssWidget() {
  const [on, setOn] = React.useState(false);
  const [secs, setSecs] = React.useState(0);
  const [levels, setLevels] = React.useState<number[]>([]);
  const [rec, setRec] = React.useState(readSss);
  const began = React.useRef(0);
  const quiet = React.useRef(0);
  const stopNow = (s: number, lv: number[]) => {
    setOn(false);
    if (s < 1) return;
    const r = readSss();
    const next = { first: r.first ?? s, best: Math.max(r.best ?? 0, s) };
    try {
      localStorage.setItem(SSS_KEY, JSON.stringify(next));
    } catch {
      /* sem armazenamento */
    }
    setRec(next);
    setLevels(lv);
  };
  const mic = useMic(on, (f) => {
    const now = performance.now();
    if (f.level > 0.035) {
      if (!began.current) began.current = now;
      quiet.current = 0;
      setSecs((now - began.current) / 1000);
      setLevels((xs) => [...xs.slice(-199), f.level]);
    } else if (began.current) {
      if (!quiet.current) quiet.current = now;
      else if (now - quiet.current > 700) {
        setLevels((lv) => {
          stopNow((quiet.current - began.current) / 1000, lv);
          return lv;
        });
        began.current = 0;
      }
    }
  });
  const steady = levels.length > 10 ? steadiness(levels) : null;
  return (
    <Panel label={L("Seu \"sss\" cronometrado", "Your timed \"sss\"")}>
      <div className="flex flex-col gap-3">
        <p className="font-display text-5xl tabular-nums">{secs.toFixed(1)} s</p>
        <div className="flex h-10 items-end gap-px" aria-hidden>
          {levels.slice(-80).map((l, i) => (
            <span key={i} className="w-1 rounded-t-sm bg-[var(--voice-you)]" style={{ height: `${Math.max(4, Math.min(100, l * 160))}%` }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={on ? "primary" : "secondary"}
            onClick={() => {
              if (on) return stopNow(secs, levels);
              began.current = 0;
              quiet.current = 0;
              setSecs(0);
              setLevels([]);
              setOn(true);
            }}
          >
            {on ? <Square aria-hidden /> : <Mic aria-hidden />}
            {on ? L("Parar", "Stop") : L("Começar: inspire e solte \"sss\"", "Start: breathe in and let out \"sss\"")}
          </Button>
        </div>
        <MicError error={mic.error} />
        {steady !== null && !on && (
          <p className="text-sm">
            {L("Constância do ar:", "Air steadiness:")} <strong>{Math.round(steady * 100)}%</strong>{" "}
            {steady >= 0.7 ? L("(linha reta, ótimo)", "(a straight line, great)") : L("(oscilou: solte o ar mais devagar e por igual)", "(it wobbled: let the air out slower and evenly)")}
          </p>
        )}
        {rec.first !== undefined && (
          <p className="text-sm text-muted">
            {L("Primeira vez:", "First time:")} {rec.first.toFixed(1)} s · {L("melhor:", "best:")} {(rec.best ?? 0).toFixed(1)} s
          </p>
        )}
      </div>
    </Panel>
  );
}

/* ── Aquecimento e desaquecimento ──────────────────────────────────────── */

const DEMO_OF: Record<string, number[]> = {
  "lip-trill": [0, 2, 4, 2, 0],
  hum: [0, 0],
  siren: [0, 4, 7, 4, 0],
  "five-note": [0, 2, 4, 5, 7, 5, 4, 2, 0],
  "slide-down": [7, 5, 4, 2, 0],
  yawn: [4, 0],
  straw: [0, 2, 4, 2, 0],
};

export function WarmupWidget({ items, variant = "warmup" }: { items: WarmupItem[]; variant?: "warmup" | "cooldown" }) {
  const profile = useVoiceProfile();
  const [done, setDone] = React.useState<string[]>([]);
  const [current, setCurrent] = React.useState(0);
  const [left, setLeft] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (left === null) return;
    if (left <= 0) {
      const it = items[current];
      setDone((d) => (it && !d.includes(it.id) ? [...d, it.id] : d));
      setLeft(null);
      setCurrent((c) => Math.min(items.length - 1, c + 1));
      return;
    }
    const id = window.setTimeout(() => setLeft((l) => (l === null ? null : l - 1)), 1000);
    return () => clearTimeout(id);
  }, [left, current, items]);
  const it = items[current];
  return (
    <div className="flex flex-col gap-3">
      <WarmupCard
        variant={variant}
        items={items.map((x) => ({ ...x, done: done.includes(x.id) }))}
        current={current}
        onDemo={(id) => {
          const steps = DEMO_OF[id] ?? [0, 2, 4, 2, 0];
          void chimeraSing(steps.map((s) => ({ midi: profile.home + s, seconds: id === "hum" ? 1.6 : 0.45, vowel: id === "hum" || id === "lip-trill" || id === "straw" ? "u" : "a" })));
        }}
        onToggleDone={(id, d) => setDone((xs) => (d ? [...xs, id] : xs.filter((x) => x !== id)))}
        strings={en("vocalHealth")}
      />
      {it && (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant={left !== null ? "primary" : "secondary"} onClick={() => setLeft(left !== null ? null : it.seconds)}>
            {left !== null ? <Square aria-hidden /> : <Play aria-hidden />}
            {left !== null ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}` : L("Cronômetro do item atual", "Timer for the current item")}
          </Button>
          {done.length === items.length && <Done>{variant === "warmup" ? L("Voz aquecida.", "Voice warmed up.") : L("Voz desaquecida.", "Voice cooled down.")}</Done>}
        </div>
      )}
    </div>
  );
}

/* ── Check-in de conforto vocal ────────────────────────────────────────── */

type Comfort = "free" | "tired" | "sore";

export function CheckinWidget({ day, when }: { day: number; when: "before" | "after" }) {
  const key = `pauta:voice:checkin:${day}:${when}`;
  const [v, setV] = React.useState<Comfort | null>(() => {
    try {
      return (localStorage.getItem(key) as Comfort | null) ?? null;
    } catch {
      return null;
    }
  });
  const pick = (c: Comfort) => {
    setV(c);
    try {
      localStorage.setItem(key, c);
    } catch {
      /* sem armazenamento */
    }
  };
  const opts: { id: Comfort; label: string }[] = [
    { id: "free", label: L("Voz livre", "Voice feels free") },
    { id: "tired", label: L("Cansaço leve", "A little tired") },
    { id: "sore", label: L("Ardência, dor ou rouquidão", "Burning, pain or hoarseness") },
  ];
  return (
    <div className="flex flex-col gap-3">
      <p className="font-semibold">{when === "before" ? L("Como está sua voz agora, antes de começar?", "How does your voice feel right now, before you start?") : L("E agora, no fim da aula?", "And now, at the end of the lesson?")}</p>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {opts.map((o) => (
          <Button key={o.id} role="radio" aria-checked={v === o.id} variant={v === o.id ? "primary" : "secondary"} onClick={() => pick(o.id)}>
            {o.label}
          </Button>
        ))}
      </div>
      {v === "tired" && <p className="text-muted">{L("Tudo bem. Faça a aula com volume baixo e respeite as pausas. Se piorar, pare.", "That's okay. Do the lesson quietly and take the breaks. If it gets worse, stop.")}</p>}
      {v === "sore" && (
        <Callout variant="warning" label={L("Aviso de segurança vocal da Pauta: pare a aula agora", "Pauta vocal safety notice: stop the lesson now")}>
          <p>
            {L(
              "Se você sentir dor ao cantar, ardência na garganta, perda repentina dos agudos, falhas na voz ou estiver com rouquidão há mais de 2 semanas, interrompa a aula imediatamente. Não tente \"aquecer para melhorar\" nem cante mais forte para compensar. Faça repouso vocal, hidrate-se e procure um médico otorrinolaringologista (para examinar suas pregas vocais) e um fonoaudiólogo antes de voltar a cantar. Cantar sem dor é regra inegociável na Pauta.",
              "If you feel pain when singing, burning in your throat, a sudden loss of high notes, breaks in your voice, or you've been hoarse for more than 2 weeks, stop the lesson right away. Don't try to \"warm up to make it better\" or sing louder to compensate. Rest your voice, drink water and see an ENT doctor (to examine your vocal folds) and a speech therapist before singing again. Singing without pain is a non-negotiable rule at Pauta.",
            )}
          </p>
        </Callout>
      )}
    </div>
  );
}

/* ── Teste de extensão ─────────────────────────────────────────────────── */

export function RangeWidget() {
  const profile = useVoiceProfile();
  const [step, setStep] = React.useState<RangeStep>(profile.range ? "result" : "low");
  const [range, setRange] = React.useState<Partial<VoiceRange>>(profile.range ?? {});
  const stable = React.useRef<{ midi: number; since: number } | null>(null);
  const active = step === "low" || step === "high";
  const mic = useMic(active, (f) => {
    const r = f.reading;
    if (!r) return (stable.current = null);
    const m = Math.round(r.midi);
    const now = performance.now();
    if (!stable.current || stable.current.midi !== m) stable.current = { midi: m, since: now };
    else if (now - stable.current.since > 350) {
      setRange((x) => (step === "low" ? { ...x, low: Math.min(x.low ?? 200, m) } : { ...x, high: Math.max(x.high ?? 0, m) }));
    }
  });
  React.useEffect(() => {
    if (step === "comfort" && range.low !== undefined && range.high !== undefined && range.comfortLow === undefined) {
      setRange((x) => ({ ...x, comfortLow: x.low! + 2, comfortHigh: x.high! - 3 }));
    }
    if (step === "result" && range.low !== undefined && range.high !== undefined && range.comfortLow !== undefined && range.comfortHigh !== undefined) {
      setVoiceProfile({ range: range as VoiceRange });
    }
  }, [step, range]);
  return (
    <div className="flex flex-col gap-2">
      <VoiceRangeFinder
        step={step}
        onStepChange={setStep}
        reading={mic.frame.reading}
        range={range}
        onRangeChange={setRange}
        onRedo={() => {
          setRange({});
          setStep("low");
        }}
        body={profile.body}
        lang={lang()}
        strings={en("voiceRange")}
      />
      <MicError error={mic.error} />
    </div>
  );
}

/* ── Vogais do português ───────────────────────────────────────────────── */

export function VowelsWidget({ showNasal = false }: { showNasal?: boolean }) {
  const profile = useVoiceProfile();
  const [sel, setSel] = React.useState<VowelId | null>(null);
  const [nasal, setNasal] = React.useState(showNasal);
  return (
    <VowelMapPT
      body={profile.body}
      selected={sel}
      onSelect={(id) => {
        setSel(id);
        void chimeraSing([{ midi: profile.home, seconds: 1.6, vowel: id }]);
      }}
      showNasal={nasal}
      onShowNasalChange={setNasal}
      lang={lang()}
      strings={en("vowels")}
    />
  );
}

/* ── Escada de solfejo ─────────────────────────────────────────────────── */

export function SolfegeWidget({ steps, tolerance = 50, title }: { steps: number[]; tolerance?: number; title?: string }) {
  const profile = useVoiceProfile();
  const [i, setI] = React.useState(0);
  const [reached, setReached] = React.useState<number[]>([]);
  const [guideStep, setGuideStep] = React.useState<number | null>(null);
  const [listening, setListening] = React.useState(false);
  const since = React.useRef(0);
  const target = steps[i] ?? null;
  const done = i >= steps.length;
  const mic = useMic(listening && !done, (f) => {
    if (target === null || !f.reading) return (since.current = 0);
    const { cents } = pitchVsTarget(f.reading.midi, profile.home + MAJOR[target]);
    if (Math.abs(cents) > tolerance) return (since.current = 0);
    if (!since.current) since.current = performance.now();
    else if (performance.now() - since.current > 500) {
      since.current = 0;
      setReached((r) => (r.includes(target) ? r : [...r, target]));
      setI((x) => x + 1);
    }
  });
  const sing = (step: number) => {
    setGuideStep(step);
    void chimeraSing([{ midi: profile.home + MAJOR[step], seconds: 1.2, vowel: "a" }]).then(() => setGuideStep(null));
  };
  return (
    <Panel label={title ?? L("Escada de solfejo", "Solfège ladder")}>
      <div className="flex flex-col gap-3">
        <p>
          {done ? L("Escada completa!", "Ladder complete!") : L(`Cante o grau ${target! + 1}.`, `Sing degree ${target! + 1}.`)}{" "}
          <span className="text-muted">{L("Toque num degrau para o Chimera cantar.", "Tap a step to hear Chimera sing it.")}</span>
        </p>
        <SolfegeLadder tonic={profile.home} target={done ? null : target} guideStep={guideStep} reading={mic.frame.reading} reached={reached} tolerance={tolerance} onSelect={sing} lang={lang()} strings={en("voice")} />
        <div className="flex flex-wrap gap-2">
          {!done && target !== null && (
            <Button variant="secondary" onClick={() => sing(target)}>
              <Volume2 aria-hidden />
              {L("Ouvir este grau", "Hear this degree")}
            </Button>
          )}
          <Button variant={listening ? "primary" : "secondary"} onClick={() => (done ? (setI(0), setReached([])) : setListening((x) => !x))}>
            {done ? <Play aria-hidden /> : listening ? <MicOff aria-hidden /> : <Mic aria-hidden />}
            {done ? L("De novo", "Again") : listening ? L("Parar", "Stop") : L("Cantar", "Sing")}
          </Button>
        </div>
        <MicError error={mic.error} />
        {done && <Done>{L("Todos os graus alcançados.", "Every degree reached.")}</Done>}
      </div>
    </Panel>
  );
}
