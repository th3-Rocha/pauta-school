// Página "Testar equipamento": som, teclado (MIDI, computador, tela) e microfone da guitarra.
import * as React from "react";
import { Guitar, Piano, Volume2 } from "lucide-react";
import { Shell } from "./Shell";
import { Button } from "../components/ui/Button";
import { Callout } from "../components/ui/Callout";
import { Checkbox } from "../components/ui/Checkbox";
import { Panel } from "../components/music/controls";
import { Keyboard } from "../components/music/keyboard/Keyboard";
import { DynamicsMeter } from "../components/music/keyboard/DynamicsMeter";
import { PedalIndicator } from "../components/music/keyboard/PedalIndicator";
import { InputPanel } from "../lessons/widgets/Keys";
import { Tuner } from "../lessons/widgets/Basics";
import { onNote, press, release, setMidiEcho, setSustain, useKeyInput } from "./key-input";
import { playSequence } from "./piano-audio";
import { strum } from "./audio";
import { STANDARD_TUNING } from "../lib/music";
import { L, localePath, setLocale, type Locale } from "../i18n";

function SoundTest() {
  return (
    <Panel label={L("1 · Som", "1 · Sound")}>
      <div className="flex flex-col gap-3">
        <p className="text-muted">{L("Clique e confira se ouve. Sem som? Aumente o volume, confira o fone e se a aba não está silenciada.", "Click and check that you hear it. No sound? Turn the volume up, check your headphones and that the tab isn't muted.")}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => playSequence([60, 64, 67, 72], 0.3)}>
            <Piano aria-hidden />
            {L("Som de piano", "Piano sound")}
          </Button>
          <Button variant="secondary" onClick={() => strum([...STANDARD_TUNING].reverse(), { gain: 0.6 })}>
            <Guitar aria-hidden />
            {L("Som de guitarra", "Guitar sound")}
          </Button>
        </div>
      </div>
    </Panel>
  );
}

function KeyboardTest() {
  const kb = useKeyInput();
  const [hits, setHits] = React.useState<{ velocity: number }[]>([]);
  React.useEffect(
    () =>
      onNote((e) => {
        if (e.on && e.source === "midi") setHits((h) => [...h.slice(-11), { velocity: e.velocity }]);
      }),
    [],
  );
  return (
    <Panel label={L("2 · Teclado", "2 · Keyboard")}>
      <div className="flex flex-col gap-4">
        <p className="text-muted">
          {L(
            "Ligue o teclado no USB e clique em conectar. Toque algumas teclas: o LED pisca, a tecla afunda na tela e o nome da nota aparece. Sem teclado MIDI, teste o teclado do computador (fileira A S D F) ou toque na tela.",
            "Plug the keyboard into USB and click connect. Play a few keys: the LED blinks, the key goes down on screen and the note name shows up. No MIDI keyboard? Try the computer keyboard (row A S D F) or tap the screen.",
          )}
        </p>
        <InputPanel showTestLink={false} />
        <Keyboard
          from={48}
          to={84}
          pressed={kb.pressed}
          pedal={kb.pedal}
          showNoteNames="c-only"
          computerKeys
          onPress={(m, v) => press(m, v ?? 90, "screen")}
          onRelease={(m) => release(m, "screen")}
        />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-fg">{L("Força das teclas", "Key velocity")}</h4>
            <p className="text-sm text-muted">
              {L(
                "Só aparece com MIDI. Toque forte e fraco: as barras devem mudar de altura. Se ficam todas iguais, o teclado não é sensível ao toque ou está em modo fixo.",
                "Only shows with MIDI. Play loud and soft: the bars should change height. If they're all the same, the keyboard isn't touch-sensitive or is in fixed mode.",
              )}
            </p>
            {hits.length ? <DynamicsMeter hits={hits} target="mf" /> : <p className="text-sm text-muted">{L("Nenhuma nota MIDI ainda.", "No MIDI notes yet.")}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-fg">{L("Pedal de sustentação", "Sustain pedal")}</h4>
            <p className="text-sm text-muted">{L("Pise o pedal ligado ao teclado: o desenho afunda. Sem pedal, segure o botão.", "Press the pedal plugged into the keyboard: the drawing goes down. No pedal? Hold the button.")}</p>
            <PedalIndicator down={kb.pedal} onDownChange={setSustain} hasPedal={kb.midiState === "connected"} />
          </div>
        </div>
        <label className="flex items-start gap-3 text-sm">
          <Checkbox checked={kb.midiEcho} onCheckedChange={(v) => setMidiEcho(v === true)} />
          <span>
            <span className="font-semibold text-fg">{L("Tocar o som do site junto com o MIDI.", "Play the site's sound along with MIDI.")}</span>{" "}
            <span className="text-muted">{L("Desligue se o seu teclado já tem alto-falante e o som está saindo dobrado.", "Turn it off if your keyboard has its own speakers and you hear the sound twice.")}</span>
          </span>
        </label>
      </div>
    </Panel>
  );
}

function GuitarTest() {
  return (
    <Panel label={L("3 · Guitarra pelo microfone", "3 · Guitar through the microphone")}>
      <div className="flex flex-col gap-3">
        <p className="text-muted">
          {L(
            "Permita o microfone, escolha uma corda e toque ela solta. A nota que você tocou aparece no visor. Se nada aparece, chegue a guitarra mais perto do microfone ou ligue o amplificador.",
            "Allow the microphone, pick a string and play it open. The note you played shows on the display. If nothing shows, bring the guitar closer to the microphone or turn on the amp.",
          )}
        </p>
        <Tuner />
      </div>
    </Panel>
  );
}

export default function SetupApp({ locale = "pt" }: { locale?: Locale }) {
  setLocale(locale);
  return (
    <Shell>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-20 pt-8 sm:pt-12">
        <header className="flex flex-col gap-2">
          <p className="panel-label text-accent">{L("Antes de estudar", "Before you practice")}</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-fg">{L("Testar equipamento", "Test your setup")}</h1>
          <p className="max-w-[60ch] text-lg text-muted">{L("Confira o som, o teclado e o microfone. Nada é gravado nem enviado: tudo fica no seu aparelho.", "Check the sound, the keyboard and the microphone. Nothing is recorded or sent: everything stays on your device.")}</p>
        </header>
        <SoundTest />
        <KeyboardTest />
        <GuitarTest />
        <Callout variant="tip" label={L("MIDI no navegador", "MIDI in the browser")}>
          <p>
            {L(
              "O MIDI funciona no Chrome, no Edge e no Firefox recente. No iPhone e no Safari ainda não: use o teclado da tela.",
              "MIDI works in Chrome, Edge and recent Firefox. Not yet on iPhone or Safari: use the on-screen keyboard.",
            )}
          </p>
        </Callout>
        <a href={localePath("/")} className="inline-flex items-center gap-1.5 self-start text-muted underline decoration-line-strong underline-offset-4 hover:text-fg">
          <Volume2 className="size-4" aria-hidden />
          {L("Voltar para o início", "Back to home")}
        </a>
      </main>
    </Shell>
  );
}
