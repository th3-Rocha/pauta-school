// src/components/music/keyboard/PianoRoll.tsx
// "Ver a música antes de ler a partitura": cada nota é uma barra na coluna da
// sua tecla, o tempo corre de cima para baixo até a linha do "agora", colada ao
// Keyboard. Sóbrio: cores chapadas, sem brilho, sem efeito de jogo.
import * as React from "react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { KEY, layoutKeys, noteSpoken, type Accidentals, type Finger, type Hand } from "../../../lib/piano";
import { Keyboard, type KeyboardProps } from "./Keyboard";

export type RollNote = {
  midi: number;
  /** Em tempos (semínimas), a partir do 0. */
  start: number;
  duration: number;
  hand: Hand;
  finger?: Finger;
};

export type PianoRollProps = {
  notes: RollNote[];
  /** Tempo atual (pode ser fracionário). A linha do "agora" fica embaixo. */
  position: number;
  from: number;
  to: number;
  /** Unidades de desenho por tempo (a largura de uma tecla branca é 24). */
  pxPerBeat?: number;
  /** Quantos tempos à frente aparecem. */
  windowBeats?: number;
  beatsPerBar?: number;
  naming?: Accidentals;
  /** Desenha o Keyboard alinhado embaixo (mesmo `from`/`to`). */
  keyboard?: Omit<KeyboardProps, "from" | "to" | "size" | "compact" | "octaveNav">;
  /** `touch` usa teclas brancas de 44px (rola dentro). */
  size?: "fit" | "touch";
  strings?: Partial<Strings["pianoRoll"]>;
  keyboardStrings?: Partial<Strings["keyboard"]>;
  className?: string;
};

const CHEEK = 6;

export function PianoRoll({
  notes,
  position,
  from,
  to,
  pxPerBeat = 22,
  windowBeats = 8,
  beatsPerBar = 4,
  naming = "sharp",
  keyboard,
  size = "fit",
  strings: stringsOverride,
  keyboardStrings,
  className,
}: PianoRollProps) {
  const s = { ...defaultStrings.pianoRoll, ...stringsOverride };
  const ks = { ...defaultStrings.keyboard, ...keyboardStrings };
  const uid = React.useId().replace(/:/g, "");
  const { keys, width, byMidi } = layoutKeys(from, to);
  const totalW = width + CHEEK * 2;
  const H = windowBeats * pxPerBeat;
  const y = (beat: number) => H - (beat - position) * pxPerBeat;
  const end = position + windowBeats;

  const visible = notes.filter((n) => n.start < end && n.start + n.duration > position);
  const sounding = new Set(notes.filter((n) => n.start <= position && position < n.start + n.duration).map((n) => n.midi));

  const firstBar = Math.floor(position / beatsPerBar);
  const lastBar = Math.ceil(end / beatsPerBar);
  const beats: number[] = [];
  for (let b = Math.ceil(position); b <= end; b++) beats.push(b);

  const wrapperStyle: React.CSSProperties =
    size === "touch" ? { width: (totalW / KEY.w) * 44 } : { width: "100%", minWidth: (totalW / KEY.w) * 20, maxWidth: (totalW / KEY.w) * 52 };

  const upcoming = visible
    .filter((n) => n.start >= position)
    .sort((a, b) => a.start - b.start)
    .slice(0, 8);
  const totalBars = Math.max(1, Math.ceil(Math.max(0, ...notes.map((n) => n.start + n.duration)) / beatsPerBar));

  return (
    <div data-slot="piano-roll" className={cn("keyboard-scroll", className)}>
      <div className="mx-auto" style={wrapperStyle}>
        <svg
          viewBox={`${-CHEEK} 0 ${totalW} ${H + 2}`}
          width="100%"
          role="img"
          aria-label={`${s.label}: ${s.summary(notes.length, totalBars)}`}
          className="block rounded-t-md"
          style={{ height: "auto" }}
        >
          <defs>
            <pattern id={`${uid}-l`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="4" height="4" fill="var(--hand-left)" />
              <line x1="0" y1="0" x2="0" y2="4" stroke="var(--marker-ring)" strokeWidth="1.2" strokeOpacity="0.35" />
            </pattern>
            <clipPath id={`${uid}-c`}>
              <rect x={-CHEEK} y={0} width={totalW} height={H} />
            </clipPath>
          </defs>

          {/* Raias: colunas das teclas pretas um tom abaixo, linha forte em cada Dó */}
          <rect x={-CHEEK} y={0} width={totalW} height={H} fill="var(--surface)" />
          {keys
            .filter((k) => k.black)
            .map((k) => (
              <rect key={k.midi} x={k.x} y={0} width={k.width} height={H} fill="var(--surface-2)" />
            ))}
          {keys
            .filter((k) => !k.black && k.midi % 12 === 0)
            .map((k) => (
              <line key={k.midi} x1={k.x} x2={k.x} y1={0} y2={H} stroke="var(--line)" strokeWidth={1} />
            ))}

          {/* Tempos e compassos */}
          {beats.map((b) => (
            <line
              key={b}
              x1={-CHEEK}
              x2={width + CHEEK}
              y1={y(b)}
              y2={y(b)}
              stroke={b % beatsPerBar === 0 ? "var(--line-strong)" : "var(--line)"}
              strokeWidth={b % beatsPerBar === 0 ? 1.2 : 0.6}
              strokeDasharray={b % beatsPerBar === 0 ? undefined : "2 3"}
            />
          ))}
          {Array.from({ length: lastBar - firstBar + 1 }, (_, i) => firstBar + i).map((bar) => {
            const yy = y(bar * beatsPerBar);
            if (yy < 10 || yy > H) return null;
            return (
              <text key={bar} x={-CHEEK + 2} y={yy - 3} fontFamily="var(--font-mono)" fontSize={8} fontWeight={600} fill="var(--muted)">
                {s.bar(bar + 1)}
              </text>
            );
          })}

          {/* Notas */}
          <g clipPath={`url(#${uid}-c)`}>
            {visible.map((n, i) => {
              const k = byMidi.get(n.midi);
              if (!k) return null;
              const inset = k.black ? 1 : 3;
              const x = k.x + inset;
              const w = k.width - inset * 2;
              const top = y(n.start + n.duration) + 1;
              const bottom = y(n.start) - 1;
              const h = Math.max(4, bottom - top);
              const playing = sounding.has(n.midi) && n.start <= position && position < n.start + n.duration;
              const fill = n.hand === "right" ? "var(--hand-right)" : `url(#${uid}-l)`;
              const showFinger = n.finger && h >= 14;
              const showLetter = h >= 34 && w >= 12;
              return (
                <g key={i} aria-hidden>
                  <rect
                    x={x}
                    y={top}
                    width={w}
                    height={h}
                    rx={3}
                    fill={fill}
                    stroke={playing ? "var(--note-active)" : "var(--marker-ring)"}
                    strokeWidth={playing ? 2.5 : 1}
                  />
                  {showLetter && (
                    <text x={x + w / 2} y={top + 8} dy="0.35em" textAnchor="middle" fontFamily="var(--font-mono)" fontWeight={800} fontSize={7} fill="var(--on-deg)">
                      {ks.handLetter[n.hand]}
                    </text>
                  )}
                  {showFinger && (
                    <>
                      <circle cx={x + w / 2} cy={bottom - 8} r={Math.min(6.5, w / 2)} fill="var(--key-white)" stroke="var(--marker-ring)" strokeWidth={1} />
                      <text x={x + w / 2} y={bottom - 8} dy="0.35em" textAnchor="middle" fontFamily="var(--font-mono)" fontWeight={800} fontSize={8} fill="var(--on-deg)">
                        {n.finger}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </g>

          {/* Linha do agora: encosta no teclado */}
          <line x1={-CHEEK} x2={width + CHEEK} y1={H} y2={H} stroke="var(--accent)" strokeWidth={2.5} />
          <text x={width + CHEEK - 2} y={H - 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize={8} fontWeight={700} fill="var(--accent)">
            {s.now.toUpperCase()}
          </text>
        </svg>

        <ol className="sr-only">
          {upcoming.map((n, i) => (
            <li key={i}>{s.note(noteSpoken(n.midi, naming), ks.hand[n.hand], n.finger)}</li>
          ))}
        </ol>

        {keyboard && (
          <Keyboard
            {...keyboard}
            from={from}
            to={to}
            size="fit"
            octaveNav={false}
            pressed={keyboard.pressed ?? [...sounding]}
            strings={keyboardStrings}
          />
        )}
      </div>
    </div>
  );
}
