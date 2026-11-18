// Widgets básicos: cordas, notas, afinador e metrônomo.
import { L } from "../../i18n";
import * as React from "react";
import { Volume2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/ToggleGroup";
import { Fretboard, type FretboardMarker } from "../../components/music/Fretboard";
import { Metronome, type ClickMode, type TimeSignature } from "../../components/music/Metronome";
import { PitchMeter, type MicPermission } from "../../components/music/PitchMeter";
import { STANDARD_TUNING } from "../../lib/music";
import { MetronomeEngine, listenPitch, noteName, pluck } from "../../app/audio";

export const STRINGS = [
  { n: 1, letter: "E", pt: "Mi", desc: "a mais fina, mais perto do chão", descEn: "the thinnest, closest to the floor" },
  { n: 2, letter: "B", pt: "Si", desc: "", descEn: "" },
  { n: 3, letter: "G", pt: "Sol", desc: "", descEn: "" },
  { n: 4, letter: "D", pt: "Ré", desc: "", descEn: "" },
  { n: 5, letter: "A", pt: "Lá", desc: "", descEn: "" },
  { n: 6, letter: "E", pt: "Mi", desc: "a mais grossa, mais perto do seu rosto", descEn: "the thickest, closest to your face" },
];
const midiOf = (stringNo: number) => STANDARD_TUNING[stringNo - 1];

/* ─────────── Bloco 2: as seis cordas ─────────── */

export function StringsExplorer() {
  const [last, setLast] = React.useState<number | null>(null);
  const markers: FretboardMarker[] = STRINGS.map((s) => ({
    string: s.n,
    fret: 0,
    label: s.letter,
    kind: s.n === last ? "active" : s.n === 6 || s.n === 1 ? "root" : "in",
  }));
  const info = last ? STRINGS[last - 1] : null;
  return (
    <div className="flex flex-col gap-3">
      <Fretboard
        frets={5}
        markers={markers}
        onPress={(s, f) => {
          pluck(midiOf(s) + f);
          if (f === 0) setLast(s);
        }}
        aria-label={L("Braço com as seis cordas soltas. Toque numa corda para ouvir.", "Neck with the six open strings. Tap a string to hear it.")}
      />
      <p aria-live="polite" className="min-h-12 rounded-sm border border-line bg-bg px-4 py-3 text-base text-fg">
        {info ? (
          <>
            {L(
              <>
                <strong className="font-mono">Corda {info.n}</strong>: {info.pt} ({info.letter}){info.desc ? `, ${info.desc}` : ""}.
              </>,
              <>
                <strong className="font-mono">String {info.n}</strong>: {info.letter}{info.descEn ? `, ${info.descEn}` : ""}.
              </>,
            )}
          </>
        ) : (
          L("Toque nas bolinhas da esquerda (as cordas soltas) para ouvir cada corda.", "Tap the dots on the left (the open strings) to hear each string.")
        )}
      </p>
    </div>
  );
}

const LETTERS = [
  ["C", "Dó"],
  ["D", "Ré"],
  ["E", "Mi"],
  ["F", "Fá"],
  ["G", "Sol"],
  ["A", "Lá"],
  ["B", "Si"],
];

export function LetterTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[22rem] border-collapse text-center font-mono">
        <tbody>
          <tr>
            {LETTERS.map(([l]) => (
              <td key={l} className="border border-line bg-surface-2 py-2 text-lg font-bold text-fg">
                {l}
              </td>
            ))}
          </tr>
          <tr>
            {LETTERS.map(([l, pt]) => (
              <td key={l} className="border border-line py-2 text-sm text-muted">
                {pt}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ─────────── Bloco 3: afinador ─────────── */

export function Tuner() {
  const [stringNo, setStringNo] = React.useState(6);
  const [permission, setPermission] = React.useState<MicPermission>("prompt");
  const [reading, setReading] = React.useState<{ midi: number; cents: number } | null>(null);
  const stopRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) setPermission("unsupported");
    return () => stopRef.current?.();
  }, []);

  const start = async () => {
    try {
      stopRef.current = await listenPitch((r) => setReading(r));
      setPermission("granted");
    } catch {
      setPermission("denied");
    }
  };

  const target = midiOf(stringNo);
  // Desvio em relação ao alvo (não à nota mais próxima): mostra se falta muito.
  const cents = reading ? Math.round((reading.midi + reading.cents / 100 - target) * 100) : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          type="single"
          value={String(stringNo)}
          onValueChange={(v) => v && setStringNo(Number(v))}
          aria-label={L("Corda que você está afinando", "String you are tuning")}
        >
          {[6, 5, 4, 3, 2, 1].map((n) => (
            <ToggleGroupItem key={n} value={String(n)} aria-label={L(`Corda ${n}, ${STRINGS[n - 1].pt}`, `String ${n}, ${STRINGS[n - 1].letter}`)}>
              <span className="font-mono">
                {n}·{STRINGS[n - 1].letter}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button variant="secondary" onClick={() => pluck(target, { gain: 0.7 })}>
          <Volume2 aria-hidden />
          {L("Ouvir a nota certa", "Hear the right note")}
        </Button>
      </div>
      <PitchMeter
        permission={permission}
        onRequestPermission={start}
        target={noteName(target)}
        targetHint={L(`Corda ${stringNo} solta (${STRINGS[stringNo - 1].pt})`, `Open string ${stringNo} (${STRINGS[stringNo - 1].letter})`)}
        detected={reading ? noteName(reading.midi) : null}
        cents={cents}
      />
    </div>
  );
}

/* ─────────── Bloco 3: metrônomo ─────────── */

const BEATS: Record<TimeSignature, number> = { "2/4": 2, "3/4": 3, "4/4": 4, "6/8": 6 };

export function MetronomeExercise({ bpm: initialBpm = 60 }: { bpm?: number }) {
  const [bpm, setBpm] = React.useState(initialBpm);
  const [playing, setPlaying] = React.useState(false);
  const [ts, setTs] = React.useState<TimeSignature>("4/4");
  const [mode, setMode] = React.useState<ClickMode>("all");
  const [beat, setBeat] = React.useState(-1);
  const [silent, setSilent] = React.useState(false);
  const engine = React.useRef<MetronomeEngine | null>(null);

  React.useEffect(() => () => engine.current?.stop(), []);
  React.useEffect(() => {
    if (engine.current) engine.current.cfg = { bpm, beats: BEATS[ts], mode };
  }, [bpm, ts, mode]);

  const toggle = (on: boolean) => {
    if (!engine.current)
      engine.current = new MetronomeEngine({ bpm, beats: BEATS[ts], mode }, (b, s) => {
        setBeat(b);
        setSilent(s);
      });
    on ? engine.current.start() : engine.current.stop();
    setPlaying(on);
  };

  return (
    <Metronome
      bpm={bpm}
      onBpmChange={setBpm}
      playing={playing}
      onPlayingChange={toggle}
      timeSignature={ts}
      onTimeSignatureChange={setTs}
      clickMode={mode}
      onClickModeChange={setMode}
      currentBeat={beat}
      silentMeasure={silent}
    />
  );
}

