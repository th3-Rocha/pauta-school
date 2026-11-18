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

function SoundTest() {
  return (
    <Panel label="1 · Som">
      <div className="flex flex-col gap-3">
        <p className="text-muted">Clique e confira se ouve. Sem som? Aumente o volume, confira o fone e se a aba não está silenciada.</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => playSequence([60, 64, 67, 72], 0.3)}>
            <Piano aria-hidden />
            Som de piano
          </Button>
          <Button variant="secondary" onClick={() => strum([...STANDARD_TUNING].reverse(), { gain: 0.6 })}>
            <Guitar aria-hidden />
            Som de guitarra
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
    <Panel label="2 · Teclado">
      <div className="flex flex-col gap-4">
        <p className="text-muted">
          Ligue o teclado no USB e clique em conectar. Toque algumas teclas: o LED pisca, a tecla afunda na tela e o nome da nota aparece. Sem
          teclado MIDI, teste o teclado do computador (fileira <span className="font-mono">A S D F</span>) ou toque na tela.
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
            <h4 className="font-semibold text-fg">Força das teclas</h4>
            <p className="text-sm text-muted">
              Só aparece com MIDI. Toque forte e fraco: as barras devem mudar de altura. Se ficam todas iguais, o teclado não é sensível ao toque
              ou está em modo fixo.
            </p>
            {hits.length ? <DynamicsMeter hits={hits} target="mf" /> : <p className="text-sm text-muted">Nenhuma nota MIDI ainda.</p>}
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-fg">Pedal de sustentação</h4>
            <p className="text-sm text-muted">Pise o pedal ligado ao teclado: o desenho afunda. Sem pedal, segure o botão.</p>
            <PedalIndicator down={kb.pedal} onDownChange={setSustain} hasPedal={kb.midiState === "connected"} />
          </div>
        </div>
        <label className="flex items-start gap-3 text-sm">
          <Checkbox checked={kb.midiEcho} onCheckedChange={(v) => setMidiEcho(v === true)} />
          <span>
            <span className="font-semibold text-fg">Tocar o som do site junto com o MIDI.</span>{" "}
            <span className="text-muted">Desligue se o seu teclado já tem alto-falante e o som está saindo dobrado.</span>
          </span>
        </label>
      </div>
    </Panel>
  );
}

function GuitarTest() {
  return (
    <Panel label="3 · Guitarra pelo microfone">
      <div className="flex flex-col gap-3">
        <p className="text-muted">
          Permita o microfone, escolha uma corda e toque ela solta. A nota que você tocou aparece no visor. Se nada aparece, chegue a guitarra mais
          perto do microfone ou ligue o amplificador.
        </p>
        <Tuner />
      </div>
    </Panel>
  );
}

export default function SetupApp() {
  return (
    <Shell>
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-20 pt-8 sm:pt-12">
        <header className="flex flex-col gap-2">
          <p className="panel-label text-accent">Antes de estudar</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-fg">Testar equipamento</h1>
          <p className="max-w-[60ch] text-lg text-muted">Confira o som, o teclado e o microfone. Nada é gravado nem enviado: tudo fica no seu aparelho.</p>
        </header>
        <SoundTest />
        <KeyboardTest />
        <GuitarTest />
        <Callout variant="tip" label="MIDI no navegador">
          <p>
            O MIDI funciona no <strong>Chrome</strong>, no <strong>Edge</strong> e no <strong>Firefox</strong> recente. No iPhone e no Safari ainda não:
            use o teclado da tela.
          </p>
        </Callout>
        <a href="/" className="inline-flex items-center gap-1.5 self-start text-muted underline decoration-line-strong underline-offset-4 hover:text-fg">
          <Volume2 className="size-4" aria-hidden />
          Voltar para o início
        </a>
      </main>
    </Shell>
  );
}
