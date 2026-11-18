// src/components/music/keyboard/MidiStatus.tsx
// De onde vêm as notas: teclado MIDI, teclado do computador, tela ou microfone.
// O LED pisca a cada nota recebida (ajuda a saber se o cabo funciona).
// Só visual: quem pede permissão e escuta o Web MIDI é o app.
import * as React from "react";
import { AlertTriangle, Ban, Cable, Keyboard as KeyboardIcon, Mic, Pointer, Plug, RefreshCw, ShieldCheck } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { Button } from "../../ui/Button";
import { ToggleGroup, ToggleGroupItem } from "../../ui/ToggleGroup";
import { Panel } from "../controls";

export type InputSource = "midi" | "computador" | "tela" | "microfone";
export type MidiState = "sem-suporte" | "pedir-permissao" | "nenhum-aparelho" | "conectado" | "negado";

export type MidiStatusProps = {
  source: InputSource;
  /** Sem ele, a fonte só é mostrada (sem seletor). */
  onSourceChange?: (source: InputSource) => void;
  /** Fontes oferecidas no seletor. */
  sources?: InputSource[];
  midiState: MidiState;
  /** Nome do aparelho conectado ("Casio CT-S300"). */
  deviceName?: string;
  /** Muda a cada nota recebida (contador ou timestamp). O LED pisca quando muda. */
  activity?: number;
  /** Última nota recebida, já com nome ("Dó 4"). */
  lastNote?: string;
  onConnect?: () => void;
  connecting?: boolean;
  strings?: Partial<Strings["midi"]>;
  className?: string;
};

const SOURCE_ICON: Record<InputSource, React.ReactNode> = {
  midi: <Cable aria-hidden />,
  computador: <KeyboardIcon aria-hidden />,
  tela: <Pointer aria-hidden />,
  microfone: <Mic aria-hidden />,
};

/** LED de atividade. Pisca (animate-led) quando `activity` muda. */
export function ActivityLed({ activity, on, label }: { activity?: number; on: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-label={label}>
      <span
        key={activity ?? 0}
        aria-hidden
        className={cn(
          "size-3 shrink-0 rounded-full ring-1 ring-marker-ring",
          on ? "bg-accent" : "bg-line-strong",
          on && activity ? "animate-led" : "",
        )}
      />
    </span>
  );
}

export function MidiStatus({
  source,
  onSourceChange,
  sources = ["midi", "tela", "computador", "microfone"],
  midiState,
  deviceName,
  activity,
  lastNote,
  onConnect,
  connecting,
  strings: stringsOverride,
  className,
}: MidiStatusProps) {
  const s = { ...defaultStrings.midi, ...stringsOverride };
  const connected = source === "midi" && midiState === "conectado";
  const receiving = source !== "microfone";

  const midiBody = () => {
    switch (midiState) {
      case "conectado":
        return (
          <p className="inline-flex items-center gap-2 text-sm text-fg">
            <ShieldCheck className="size-4 shrink-0 text-good" strokeWidth={2.5} aria-hidden />
            <span>
              <span className="font-semibold text-good">{s.states.conectado}</span>
              {deviceName && <span className="font-mono"> · {deviceName}</span>}
            </span>
          </p>
        );
      case "sem-suporte":
        return (
          <p className="flex gap-2 text-sm text-fg">
            <Ban className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            {s.states["sem-suporte"]}
          </p>
        );
      case "negado":
        return (
          <p className="flex gap-2 text-sm text-fg">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-bad" strokeWidth={2.5} aria-hidden />
            {s.states.negado}
          </p>
        );
      case "nenhum-aparelho":
        return (
          <div className="flex flex-col gap-3">
            <p className="flex gap-2 text-sm text-fg">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" strokeWidth={2.5} aria-hidden />
              {s.states["nenhum-aparelho"]}
            </p>
            {onConnect && (
              <Button variant="secondary" onClick={onConnect} loading={connecting} className="self-start">
                <RefreshCw aria-hidden />
                {s.retry}
              </Button>
            )}
          </div>
        );
      case "pedir-permissao":
      default:
        return (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-fg">{s.states["pedir-permissao"]}</p>
            {onConnect && (
              <Button onClick={onConnect} loading={connecting} className="self-start">
                <Plug aria-hidden />
                {s.connect}
              </Button>
            )}
          </div>
        );
    }
  };

  return (
    <Panel
      label={s.label}
      className={cn("max-w-xl", className)}
      aside={
        receiving && (
          <span className="inline-flex items-center gap-2 font-mono text-xs text-muted">
            {lastNote && <span className="text-fg">{lastNote}</span>}
            <span className="panel-label">{s.activity}</span>
            <ActivityLed activity={activity} on={source !== "midi" || connected} label={s.activityAria(lastNote)} />
          </span>
        )
      }
    >
      <div className="flex flex-col gap-4">
        {onSourceChange ? (
          <ToggleGroup
            type="single"
            size="sm"
            value={source}
            onValueChange={(v) => v && onSourceChange(v as InputSource)}
            aria-label={s.choose}
            className="w-full"
          >
            {sources.map((src) => (
              <ToggleGroupItem key={src} value={src} aria-label={s.sources[src]} title={s.sources[src]} className="h-11 min-w-0 basis-[calc(50%-2px)] sm:basis-0">
                {SOURCE_ICON[src]}
                <span className="truncate">{s.sourcesShort[src]}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        ) : (
          <p className="inline-flex items-center gap-2 text-base font-semibold text-fg [&_svg]:size-4">
            {SOURCE_ICON[source]}
            {s.sources[source]}
          </p>
        )}

        {source === "midi" && midiBody()}
        {source === "computador" && <p className="text-sm text-fg">{s.computerHint}</p>}
        {source === "microfone" && (
          <p className="flex gap-2 text-sm text-fg">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" strokeWidth={2.5} aria-hidden />
            {s.micHint}
          </p>
        )}
        {source === "midi" && midiState !== "sem-suporte" && <p className="text-sm text-muted">{s.explain}</p>}
      </div>
    </Panel>
  );
}
