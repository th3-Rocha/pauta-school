// Widgets da guitarra a partir do mês 2: base de acompanhamento, drone, bend no microfone e gravador.
import * as React from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { L } from "../../i18n";
import { BackingTrackPlayer } from "../../components/music/BackingTrackPlayer";
import { Drone } from "../../components/music/Drone";
import { PitchMeter, type MicPermission } from "../../components/music/PitchMeter";
import { Button } from "../../components/ui/Button";
import { STANDARD_TUNING } from "../../lib/music";
import { parseChord } from "../../lib/harmony";
import { bass, drum, listenPitch, mutedStrum, noteName, pluck, startDrone, strum, tick } from "../../app/audio";
import { chordMidis, chordName } from "../chords";
import type { Feel } from "../types";
import { runSequence, type SeqEvent } from "./seq";
import { swingTime } from "./tabSound";
import { BpmControl } from "./Chords";

/* ─────────── Base de acompanhamento ─────────── */

type Slot = { chord: string; start: number; len: number; next: string };

const bassOf = (c: string, offset = 0) => {
  const p = parseChord(chordName(c));
  return 33 + ((((p.bass + offset - 9) % 12) + 12) % 12); // A1..G#2
};
const toneOf = (c: string, k: number) => {
  const p = parseChord(chordName(c));
  const iv = p.intervals[k % p.intervals.length] % 12;
  return 33 + ((((p.root + iv - 9) % 12) + 12) % 12);
};

/** Agenda um compasso (ou meio) de cada levada. Tempos em semínimas; `sw` aplica o swing. */
function scheduleSlot(feel: Feel, s: Slot, beats: number, push: (t: number, f: (w: number, spb: number) => void) => void) {
  const ms = chordMidis(s.chord);
  const hi = ms.length > 4 ? ms.slice(-4) : ms;
  const at = (t: number, f: (w: number, spb: number) => void) => t < s.len - 1e-6 && push(s.start + t, f);
  const sw = (t: number) => swingTime(t);
  const root = bassOf(s.chord);
  const fifth = bassOf(s.chord, 7);
  const isBarStart = Math.abs(s.start % beats) < 1e-6;
  const st = (t: number, gain = 0.32, len = 0.9, down = true) => at(t, (w, spb) => strum(hi, { when: w, gain, dur: len * spb, down }));

  switch (feel) {
    case "rock":
    case "pop": {
      for (let b = 0; b < s.len; b++) {
        at(b, (w) => drum(b % 2 === 0 ? "kick" : "snare", w));
        at(b, (w) => drum("hat", w));
        at(b + 0.5, (w) => drum("hat", w, 0.7));
        if (feel === "rock") {
          at(b, (w, spb) => bass(root, w, spb * 0.45, 0.55));
          at(b + 0.5, (w, spb) => bass(root, w, spb * 0.45, 0.45));
          at(b, (w, spb) => strum(ms.slice(0, 3), { when: w, gain: 0.3, dur: spb * 0.45 }));
          at(b + 0.5, (w, spb) => strum(ms.slice(0, 3), { when: w, gain: 0.22, dur: spb * 0.45 }));
        } else {
          at(b, (w, spb) => bass(b === 2 ? fifth : root, w, spb * 0.9, 0.5));
        }
      }
      if (feel === "rock") at(2.5, (w) => drum("kick", w, 0.8));
      if (feel === "pop") {
        st(0, 0.34);
        st(1, 0.3);
        st(1.5, 0.22, 0.5, false);
        st(2.5, 0.22, 0.5, false);
        st(3, 0.3);
        st(3.5, 0.22, 0.5, false);
      }
      break;
    }
    case "ballad": {
      at(0, (w) => drum("kick", w, 0.7));
      at(2, (w) => drum("snare", w, 0.6));
      for (let b = 0; b < s.len; b++) at(b, (w) => drum("hat", w, 0.5));
      at(0, (w, spb) => bass(root, w, spb * Math.min(s.len, 4) * 0.95, 0.5));
      for (let e = 0; e < s.len * 2; e++) {
        const m = hi[[0, 1, 2, 3, 2, 1, 2, 3][e % 8] % hi.length];
        at(e / 2, (w, spb) => pluck(m, { when: w, gain: 0.32, dur: spb }));
      }
      break;
    }
    case "shuffle":
    case "blues": {
      for (let b = 0; b < s.len; b++) {
        at(b, (w) => drum(b % 2 === 0 ? "kick" : "snare", w, b % 2 === 0 ? 0.9 : 0.7));
        at(b, (w) => drum("hat", w, 0.8));
        at(sw(b + 0.5), (w) => drum("hat", w, 0.5));
      }
      // boogie: 1-5, 1-6, 1-b7, 1-6 em pares suingados (registro de guitarra base)
      const low = 40 + ((parseChord(chordName(s.chord)).root - 4 + 12) % 12);
      const tops = [7, 9, 10, 9];
      for (let b = 0; b < s.len; b++) {
        at(b, (w, spb) => {
          pluck(low, { when: w, gain: 0.38, dur: spb * 0.6 });
          pluck(low + tops[(b + (isBarStart ? 0 : 2)) % 4], { when: w, gain: 0.3, dur: spb * 0.6 });
        });
        at(sw(b + 0.5), (w, spb) => {
          pluck(low, { when: w, gain: 0.3, dur: spb * 0.3 });
          pluck(low + tops[(b + (isBarStart ? 0 : 2)) % 4], { when: w, gain: 0.24, dur: spb * 0.3 });
        });
        at(b, (w, spb) => bass(b % 2 === 0 ? root : fifth, w, spb * 0.9, 0.45));
      }
      break;
    }
    case "funk": {
      for (let k = 0; k < s.len * 4; k++) at(k / 4, (w) => drum("hat", w, k % 2 === 0 ? 0.7 : 0.4));
      for (let b = 0; b < s.len; b += 4) {
        [0, 0.75, 2.5].forEach((t) => at(b + t, (w) => drum("kick", w)));
        [1, 3].forEach((t) => at(b + t, (w) => drum("snare", w)));
        [0, 0.75, 2.5, 3.5].forEach((t, i) => at(b + t, (w, spb) => bass(i === 3 ? root + 12 : root, w, spb * 0.35, 0.55)));
      }
      for (let k = 0; k < s.len * 4; k++) {
        const t = k / 4;
        const stab = [0.5, 1.75, 2.75, 3.5].some((x) => Math.abs((t % 4) - x) < 1e-6);
        if (stab) at(t, (w, spb) => strum(hi, { when: w, gain: 0.3, dur: spb * 0.2 }));
        else if (k % 2 === 1) at(t, (w) => mutedStrum(w, 0.18));
      }
      break;
    }
    case "reggae": {
      for (let b = 0; b < s.len; b++) {
        at(b, (w) => drum("hat", w, 0.5));
        at(b + 0.5, (w) => drum("hat", w, 0.35));
        if (b % 2 === 1) at(b, (w, spb) => strum(hi, { when: w, gain: 0.3, dur: spb * 0.18 }));
      }
      at(2, (w) => {
        drum("kick", w);
        drum("rim", w);
      });
      at(0, (w, spb) => bass(root, w, spb * 1.4, 0.55));
      at(1.5, (w, spb) => bass(root, w, spb * 0.4, 0.45));
      at(2.5, (w, spb) => bass(fifth, w, spb * 1, 0.45));
      break;
    }
    case "bossa": {
      for (let e = 0; e < s.len * 2; e++) at(e / 2, (w) => drum("shaker", w, e % 2 === 0 ? 0.9 : 0.6));
      [0, 1.5, 2, 3.5].forEach((t, i) => at(t, (w, spb) => bass(i % 2 === 0 ? root : fifth, w, spb * (i % 2 === 0 ? 1.4 : 0.45), 0.5)));
      const bar = Math.round(s.start / beats) % 2;
      const clave = bar === 0 ? [0, 1.5, 3] : [1, 2.5];
      clave.forEach((t) => at(t, (w) => drum("rim", w, 0.8)));
      const comp = bar === 0 ? [0, 1.5, 3] : [0.5, 2, 2.5];
      comp.forEach((t) => at(t, (w, spb) => strum(hi, { when: w, gain: 0.26, dur: spb * 0.45 })));
      break;
    }
    case "samba": {
      for (let k = 0; k < s.len * 4; k++) at(k / 4, (w) => drum("shaker", w, k % 4 === 0 ? 0.9 : 0.45));
      for (let b = 0; b < s.len; b++) at(b, (w, spb) => bass(b % 2 === 0 ? root : fifth, w, spb * 0.8, b % 2 === 1 ? 0.6 : 0.45));
      for (let b = 0; b < s.len; b += 2) at(b + 1, (w) => drum("kick", w));
      const bar = Math.round(s.start / beats) % 2;
      const teleco = bar === 0 ? [0, 0.5, 1.25, 1.75, 2.25, 3, 3.5] : [0.25, 1, 1.5, 2.25, 2.75, 3.5];
      teleco.forEach((t) => at(t, (w, spb) => strum(hi, { when: w, gain: 0.24, dur: spb * 0.22 })));
      break;
    }
    case "baiao": {
      for (let k = 0; k < s.len * 4; k++) at(k / 4, (w) => drum("hat", w, k % 4 === 3 ? 0.9 : 0.35));
      for (let b = 0; b < s.len; b += 2) {
        at(b, (w, spb) => {
          bass(root, w, spb * 0.7, 0.55);
          drum("kick", w);
        });
        at(b + 0.75, (w, spb) => bass(root, w, spb * 0.25, 0.45));
        at(b + 1, (w, spb) => {
          bass(fifth, w, spb * 0.9, 0.5);
          drum("kick", w, 0.6);
        });
        [0, 0.75, 1.5].forEach((t) => at(b + t, (w, spb) => strum(hi, { when: w, gain: 0.22, dur: spb * 0.3 })));
      }
      break;
    }
    case "xote": {
      for (let b = 0; b < s.len; b += 2) {
        at(b, (w, spb) => {
          bass(root, w, spb * 0.8, 0.5);
          drum("kick", w);
        });
        at(b + 1.5, (w, spb) => bass(fifth, w, spb * 0.4, 0.45));
        at(b + 1, (w) => drum("snare", w, 0.5));
        [0, 1, 1.5].forEach((t) => at(b + t, (w, spb) => strum(hi, { when: w, gain: 0.24, dur: spb * 0.4 })));
      }
      for (let e = 0; e < s.len * 2; e++) at(e / 2, (w) => drum("shaker", w, 0.5));
      break;
    }
    case "jazz": {
      for (let b = 0; b < s.len; b++) {
        at(b, (w) => drum("hat", w, 0.7));
        if (b % 2 === 1) at(sw(b + 0.5), (w) => drum("hat", w, 0.45));
        // baixo caminhando: 1, 3, 5 e aproximação cromática do próximo acorde
        const last = b === s.len - 1;
        const nextRoot = bassOf(s.next);
        const note = last ? (nextRoot > root ? nextRoot - 1 : nextRoot + 1) : b === 0 ? root : toneOf(s.chord, b);
        at(b, (w, spb) => bass(note, w, spb * 0.9, 0.5));
      }
      at(0, (w, spb) => strum(hi, { when: w, gain: 0.24, dur: spb * 0.6 }));
      if (s.len >= 2) at(sw(1.5), (w, spb) => strum(hi, { when: w, gain: 0.22, dur: spb * 0.8 }));
      break;
    }
    case "waltz": {
      at(0, (w, spb) => {
        bass(root, w, spb * 0.9, 0.55);
        drum("kick", w, 0.7);
      });
      [1, 2].forEach((t) => at(t, (w, spb) => strum(hi, { when: w, gain: 0.26, dur: spb * 0.6 })));
      break;
    }
    case "six8": {
      // pulso em colcheias: 6 por compasso
      at(0, (w, spb) => {
        bass(root, w, spb * 2.8, 0.55);
        drum("kick", w, 0.8);
      });
      at(3, (w, spb) => {
        bass(fifth, w, spb * 2.8, 0.45);
        drum("snare", w, 0.5);
      });
      for (let e = 0; e < s.len; e++) {
        const m = hi[[0, 1, 2, 3, 2, 1][e % 6] % hi.length];
        at(e, (w, spb) => pluck(m, { when: w, gain: 0.3, dur: spb * 1.2 }));
      }
      break;
    }
    case "drone": {
      at(0, (w, spb) => {
        bass(root, w, spb * s.len * 0.98, 0.5);
        strum(hi, { when: w, gain: 0.25, dur: spb * s.len * 0.98 });
      });
      break;
    }
  }
}

export function Jam({ title, keyName, bpm: initialBpm, feel, chords, beats = feel === "waltz" ? 3 : feel === "six8" ? 6 : 4 }: { title?: string; keyName: string; bpm: number; feel: Feel; chords: string[]; beats?: number }) {
  const [bpm, setBpm] = React.useState(initialBpm);
  const [playing, setPlaying] = React.useState(false);
  const [loop, setLoop] = React.useState(true);
  const [idx, setIdx] = React.useState(-1);
  const stopRef = React.useRef<(() => void) | null>(null);
  React.useEffect(() => () => stopRef.current?.(), []);

  // um item por compasso; "C G" divide o compasso
  const slots: Slot[] = [];
  chords.forEach((bar, bi) => {
    const parts = bar.split(/\s+/);
    const len = beats / parts.length;
    parts.forEach((c, k) => slots.push({ chord: c, start: bi * beats + k * len, len, next: "" }));
  });
  slots.forEach((s, i) => (s.next = slots[(i + 1) % slots.length].chord));
  const display = chords.map((bar) => ({ symbol: bar.split(/\s+/).map(chordName).join(" "), bars: 1 }));

  const stop = () => {
    stopRef.current?.();
    stopRef.current = null;
    setPlaying(false);
    setIdx(-1);
  };
  const start = (tempo = bpm) => {
    const spb = 60 / tempo;
    const ev: SeqEvent[] = [];
    const pre = beats === 6 ? 6 : beats;
    for (let b = 0; b < pre; b++) ev.push({ t: b * spb, sound: (w) => tick(w, b === 0) });
    for (const s of slots) scheduleSlot(feel, s, beats, (t, f) => ev.push({ t: (pre + t) * spb, sound: (w) => f(w, spb) }));
    chords.forEach((_, bi) => ev.push({ t: (pre + bi * beats) * spb, ui: () => setIdx(bi) }));
    stopRef.current = runSequence(ev, (pre + chords.length * beats) * spb, { onEnd: () => (loop ? start(tempo) : stop()) });
    setPlaying(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <BackingTrackPlayer
        name={title ?? L("Base", "Backing track")}
        tonality={keyName}
        bpm={bpm}
        chords={display}
        currentIndex={idx}
        playing={playing}
        onPlayPause={() => (playing ? stop() : start())}
        loop={loop}
        onLoopChange={setLoop}
      />
      <div className="flex flex-wrap items-center gap-3">
        <BpmControl
          bpm={bpm}
          onChange={(b) => {
            setBpm(b);
            if (playing) {
              stopRef.current?.();
              start(b);
            }
          }}
        />
        <span className="text-sm text-muted">
          {L("Levada", "Feel")}: {FEEL_NAMES[feel][0] && L(FEEL_NAMES[feel][0], FEEL_NAMES[feel][1])}
          {beats === 6 ? L(" · conta em colcheias (6 por compasso)", " · counts in eighth notes (6 per bar)") : ""}
        </span>
      </div>
    </div>
  );
}

const FEEL_NAMES: Record<Feel, [string, string]> = {
  rock: ["rock", "rock"],
  pop: ["pop", "pop"],
  ballad: ["balada dedilhada", "fingerpicked ballad"],
  shuffle: ["shuffle", "shuffle"],
  blues: ["blues", "blues"],
  funk: ["funk em semicolcheias", "16th-note funk"],
  reggae: ["reggae", "reggae"],
  bossa: ["bossa nova", "bossa nova"],
  samba: ["samba", "samba"],
  baiao: ["baião", "baião"],
  xote: ["xote", "xote"],
  jazz: ["swing com baixo caminhando", "swing with walking bass"],
  waltz: ["valsa (3/4)", "waltz (3/4)"],
  six8: ["6/8", "6/8"],
  drone: ["acorde parado", "sustained chord"],
};

/* ─────────── Drone ─────────── */

export function DroneWidget({ note: initial }: { note: number }) {
  const [note, setNote] = React.useState(initial);
  const [playing, setPlaying] = React.useState(false);
  const stopRef = React.useRef<(() => void) | null>(null);
  React.useEffect(() => () => stopRef.current?.(), []);
  const set = (on: boolean, pc = note) => {
    stopRef.current?.();
    stopRef.current = on ? startDrone(pc) : null;
    setPlaying(on);
  };
  return (
    <Drone
      note={note}
      onNoteChange={(n) => {
        setNote(n);
        if (playing) set(true, n);
      }}
      playing={playing}
      onPlayingChange={(on) => set(on)}
    />
  );
}

/* ─────────── Bend no microfone ─────────── */

export function BendCheck({ s, f, semis }: { s: number; f: number; semis: number }) {
  const [permission, setPermission] = React.useState<MicPermission>("prompt");
  const [reading, setReading] = React.useState<{ midi: number; cents: number } | null>(null);
  const stopRef = React.useRef<(() => void) | null>(null);
  React.useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) setPermission("unsupported");
    return () => stopRef.current?.();
  }, []);
  const target = STANDARD_TUNING[s - 1] + f + semis;
  const cents = reading ? Math.round((reading.midi + reading.cents / 100 - target) * 100) : null;
  const amount = semis === 1 ? L("meio tom", "a half step") : semis === 2 ? L("um tom", "a whole step") : semis === 3 ? L("um tom e meio", "a step and a half") : `${semis / 2} ${L("tons", "steps")}`;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={() => pluck(target, { gain: 0.7 })}>
          <Volume2 aria-hidden />
          {L(`Ouvir o alvo (casa ${f + semis})`, `Hear the target (fret ${f + semis})`)}
        </Button>
        <Button variant="ghost" onClick={() => pluck(STANDARD_TUNING[s - 1] + f, { gain: 0.7, dur: 2, glide: [{ semis, at: 0.35, time: 0.25 }] })}>
          {L("Ouvir o bend", "Hear the bend")}
        </Button>
      </div>
      <PitchMeter
        mode="bend"
        permission={permission}
        onRequestPermission={async () => {
          try {
            stopRef.current = await listenPitch((r) => setReading(r));
            setPermission("granted");
          } catch {
            setPermission("denied");
          }
        }}
        target={noteName(target)}
        targetHint={L(`Corda ${s}, casa ${f}, subindo ${amount}`, `String ${s}, fret ${f}, bending ${amount}`)}
        detected={reading ? noteName(reading.midi) : null}
        cents={cents}
        tolerance={15}
      />
    </div>
  );
}

/* ─────────── Gravador ─────────── */

export function Recorder({ label }: { id: string; label?: string }) {
  const [state, setState] = React.useState<"idle" | "rec" | "denied">("idle");
  const [url, setUrl] = React.useState<string | null>(null);
  const [secs, setSecs] = React.useState(0);
  const rec = React.useRef<{ mr: MediaRecorder; stream: MediaStream; timer: number } | null>(null);
  React.useEffect(
    () => () => {
      rec.current?.stream.getTracks().forEach((t) => t.stop());
      if (rec.current) window.clearInterval(rec.current.timer);
    },
    [],
  );

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        if (url) URL.revokeObjectURL(url);
        setUrl(URL.createObjectURL(new Blob(chunks, { type: mr.mimeType })));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setSecs(0);
      const timer = window.setInterval(() => setSecs((x) => x + 1), 1000);
      rec.current = { mr, stream, timer };
      setState("rec");
    } catch {
      setState("denied");
    }
  };
  const stop = () => {
    if (!rec.current) return;
    window.clearInterval(rec.current.timer);
    rec.current.mr.stop();
    rec.current = null;
    setState("idle");
  };

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 shadow-md sm:p-5" aria-label={L("Gravador", "Recorder")}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="panel-label text-muted">{L("Gravador", "Recorder")}</h3>
        {state === "rec" && (
          <span className="font-mono text-sm text-bad" aria-live="polite">
            ● {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}
          </span>
        )}
      </header>
      {label && <p className="text-sm">{label}</p>}
      <div className="flex flex-wrap items-center gap-3">
        {state === "rec" ? (
          <Button onClick={stop}>
            <Square aria-hidden />
            {L("Parar", "Stop")}
          </Button>
        ) : (
          <Button onClick={start}>
            <Mic aria-hidden />
            {url ? L("Gravar de novo", "Record again") : L("Gravar", "Record")}
          </Button>
        )}
        {url && state !== "rec" && <audio controls src={url} className="h-10 max-w-full" />}
      </div>
      {state === "denied" && <p className="text-sm text-bad">{L("Sem acesso ao microfone. Libere no navegador e tente de novo.", "No microphone access. Allow it in the browser and try again.")}</p>}
      <p className="text-xs text-muted">{L("A gravação fica só no seu navegador. Nada é enviado.", "The recording stays in your browser. Nothing is uploaded.")}</p>
    </section>
  );
}
