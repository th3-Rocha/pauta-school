// /voice-lab: protótipo do canto. A cabeça ORIGINAL do Chimera (corte 2D e 3D)
// dentro do monitor da Pauta, o triângulo de corpo mexendo nela, vogais do
// português e um teclado para ela cantar.
import * as React from "react";
import { Wind } from "lucide-react";
import { Shell } from "./Shell";
import { Button } from "../components/ui/Button";
import { Panel } from "../components/music/controls";
import { ChimeraStage, type ChimeraView } from "../components/music/voice/ChimeraStage";
import { VoiceBodyPicker } from "../components/music/voice/VoiceBodyPicker";
import { ChimeraHead, useChimera, useGuideState, type ChimeraModules } from "../components/music/voice/ChimeraLive";
import { keyboardBase, VOWELS_PT, type VoiceBody } from "../lib/voice";
import { EN } from "../lib/strings-en";
import { L, setLocale, type Locale } from "../i18n";

const NAMES_PT = ["Dó", "Dó♯", "Ré", "Ré♯", "Mi", "Fá", "Fá♯", "Sol", "Sol♯", "Lá", "Lá♯", "Si"];
const NAMES_EN = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
/** Teclas do computador, como no Chimera: A W S E D F T G Y H U J K. */
const KEYMAP: Record<string, number> = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12 };
const BLACK = new Set([1, 3, 6, 8, 10]);

function Lab({ mods, locale }: { mods: ChimeraModules; locale: Locale }) {
  const { useStore } = mods;
  const body = useStore((s) => s.body);
  const hold = useStore((s) => s.hold);
  const viewFlags = useStore((s) => s.view);
  const [applying, setApplying] = React.useState(false);
  const [view, setView] = React.useState<ChimeraView>("3d");
  const [vowel, setVowel] = React.useState("a");
  const guide = useGuideState(mods);
  const base = keyboardBase(body);
  const names = locale === "en" ? NAMES_EN : NAMES_PT;

  React.useEffect(() => mods.engine.onRebuilt(() => setApplying(false)), [mods]);

  const commit = (b: VoiceBody) => {
    setApplying(true);
    useStore.getState().setBody(b);
    // sem áudio ligado não há reconstrução para esperar
    if (!useStore.getState().started) setApplying(false);
    else setTimeout(() => setApplying(false), 1500);
  };

  const sayVowel = (ipa: string) => {
    setVowel(ipa);
    const st = useStore.getState();
    const m = mods.getModel(st.body, st.started ? mods.engine.sampleRate : 48000);
    const v = m.vowels.find((x) => x.ipa === ipa);
    if (v) st.setArtic(v.artic);
  };

  React.useEffect(() => {
    sayVowel(vowel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body]);

  // teclado do computador
  React.useEffect(() => {
    const down = new Map<string, number>();
    const onDown = (e: KeyboardEvent) => {
      const t = e.target;
      if (e.repeat || e.metaKey || e.ctrlKey || (t instanceof Element && t.closest("input, textarea, select, [role=slider]"))) return;
      const k = e.key.toLowerCase();
      if (!(k in KEYMAP) || down.has(k)) return;
      const st = useStore.getState();
      const midi = keyboardBase(st.body) + KEYMAP[k];
      down.set(k, midi);
      if (!st.started) void st.start();
      st.noteOn(midi);
    };
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const midi = down.get(k);
      if (midi === undefined) return;
      down.delete(k);
      useStore.getState().noteOff(midi);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [useStore]);

  const press = (midi: number) => {
    const st = useStore.getState();
    if (!st.started) void st.start();
    st.noteOn(midi);
  };
  const release = (midi: number) => useStore.getState().noteOff(midi);

  const chips = [
    { id: "pressure", label: L("Pressão", "Pressure"), on: viewFlags.pressure, onToggle: (on: boolean) => useStore.getState().setView({ pressure: on }) },
    { id: "particles", label: L("Fluxo", "Flow"), on: viewFlags.particles, onToggle: (on: boolean) => useStore.getState().setView({ particles: on }) },
    { id: "calipers", label: L("Medidas", "Measures"), on: viewFlags.calipers, onToggle: (on: boolean) => useStore.getState().setView({ calipers: on }) },
  ];

  const stage = (
    <ChimeraStage
      guide={guide}
      size="hero"
      view={view}
      onViewChange={setView}
      controls={chips}
      onStartAudio={() => void useStore.getState().start()}
      caption={L("Arraste a cabeça para girar (3D). Toque as teclas para ela cantar.", "Drag the head to turn it (3D). Play the keys to make it sing.")}
      strings={locale === "en" ? EN.chimera : undefined}
    >
      <ChimeraHead mods={mods} view={view} />
    </ChimeraStage>
  );

  return (
    <div className="flex flex-col gap-6">
      {stage}

      <VoiceBodyPicker
        value={body}
        onPreview={(b) => useStore.getState().previewBody(b)}
        onCommit={commit}
        applying={applying}
        onListen={() => {
          const st = useStore.getState();
          if (!st.started) void st.start();
          const b = keyboardBase(st.body) + 7;
          st.noteOn(b);
          setTimeout(() => useStore.getState().noteOff(b), 900);
        }}
        lang={locale}
        strings={locale === "en" ? EN.voiceBody : undefined}
      />

      <Panel label={L("Vogal", "Vowel")}>
        <div className="flex flex-wrap gap-2">
          {VOWELS_PT.filter((v) => !v.nasal).map((v) => (
            <Button key={v.id} variant={vowel === v.ipa ? "primary" : "secondary"} aria-pressed={vowel === v.ipa} onClick={() => sayVowel(v.ipa)}>
              <span className="font-display text-lg">{v.id}</span>
              <span className="text-muted text-sm">{locale === "en" ? v.example.en : v.example.pt}</span>
            </Button>
          ))}
        </div>
      </Panel>

      <Panel label={L("Cantar", "Sing")}>
        <div className="flex flex-col gap-3">
          <div className="flex select-none gap-1 overflow-x-auto pb-1" role="group" aria-label={L("Teclado: teclas A até K do computador", "Keyboard: computer keys A to K")}>
            {Array.from({ length: 13 }, (_, i) => base + i).map((midi) => {
              const black = BLACK.has(midi % 12);
              return (
                <button
                  key={midi}
                  type="button"
                  onPointerDown={(e) => {
                    (e.currentTarget as Element).setPointerCapture(e.pointerId);
                    press(midi);
                  }}
                  onPointerUp={() => release(midi)}
                  onPointerCancel={() => release(midi)}
                  className={
                    "flex h-28 min-w-11 flex-1 items-end justify-center rounded-md border pb-2 text-xs focus-ring " +
                    (black ? "h-20 border-line-strong bg-fg text-bg" : "border-line-strong bg-surface text-fg")
                  }
                >
                  {names[midi % 12]}
                  {Math.floor(midi / 12) - 1}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant={hold ? "primary" : "secondary"} aria-pressed={hold} onClick={() => void useStore.getState().toggleBreath()}>
              <Wind aria-hidden />
              {hold ? L("Parar", "Stop") : L("Segurar a voz", "Hold the voice")}
            </Button>
            <p className="text-muted text-sm">{L("Teclas A W S E D F T G Y H U J K do computador também tocam.", "Computer keys A W S E D F T G Y H U J K play too.")}</p>
          </div>
        </div>
      </Panel>

    </div>
  );
}

export default function VoiceLabApp({ locale }: { locale: Locale }) {
  setLocale(locale);
  const { mods, error, retry } = useChimera();
  return (
    <Shell>
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-3xl">{L("Laboratório de voz", "Voice lab")}</h1>
          <p className="text-muted">{L("Protótipo do curso de canto: o Chimera original, por dentro.", "Voice course prototype: the original Chimera, inside out.")}</p>
        </header>
        {mods ? (
          <Lab mods={mods} locale={locale} />
        ) : (
          <ChimeraStage guide={{ status: error ? "error" : "loading" }} size="hero" onRetry={retry} />
        )}
      </main>
    </Shell>
  );
}
