// src/components/music/keyboard/KeyChord.tsx
// Diagrama de acorde no teclado. Equivalente ao ChordDiagram da guitarra.
// Modo condução de vozes: o acorde anterior em `ghost`, setas para os dedos que
// se movem e anel teal nos dedos que ficam parados.
import * as React from "react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import { isBlack, noteName, noteSpoken, type Accidentals, type Finger, type Hand, type NoteNames } from "../../../lib/piano";
import { MarkerGlyph, type MarkerKind } from "../markers";
import { MiniKeys, type MiniKeyMarker } from "./MiniKeys";

export type ChordNote = {
  midi: number;
  /** Grau no acorde: "1", "b3", "3", "5", "b7", "9"… Define a cor (mesmas da guitarra). */
  degree?: string;
  /** Força um tipo de marcador; sem ele, sai do grau. */
  kind?: MarkerKind;
  finger?: Finger;
  hand?: Hand;
};

export type KeyChordProps = {
  /** Cifra: "C", "Am7", "G/B". */
  name: string;
  notes: ChordNote[];
  /** 0 = posição fundamental, 1 = 1ª inversão… */
  inversion?: 0 | 1 | 2 | 3;
  /** O que vai escrito nas bolinhas. */
  labelMode?: "degree" | "note" | "finger";
  /** Acorde anterior: liga o modo condução de vozes. */
  previous?: { name?: string; notes: ChordNote[] };
  /** Intervalo desenhado. Padrão: do Dó (ou Fá) abaixo da nota mais grave até completar ao menos uma oitava. */
  from?: number;
  to?: number;
  noteNames?: NoteNames;
  naming?: Accidentals;
  showLegend?: boolean;
  /** Largura máxima de cada tecla branca, em px. */
  maxKeyPx?: number;
  strings?: Partial<Strings["keyChord"]>;
  keyboardStrings?: Partial<Strings["keyboard"]>;
  className?: string;
};

export function kindFromDegree(degree?: string): MarkerKind {
  if (!degree) return "in";
  const d = degree.replace(/[b#♭♯]/g, "");
  if (d === "1" || d === "8") return "root";
  if (d === "3") return "deg-3";
  if (d === "5") return "deg-5";
  if (d === "7") return "deg-7";
  return "ext";
}

function autoRange(all: number[]): [number, number] {
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  // começa no Dó ou no Fá branco imediatamente abaixo
  let a = lo;
  while (a % 12 !== 0 && a % 12 !== 5) a--;
  let b = Math.max(hi, a + 11);
  while (b % 12 !== 4 && b % 12 !== 11) b++;
  if (isBlack(b)) b++;
  return [a, b];
}

export function KeyChord({
  name,
  notes,
  inversion,
  labelMode = "degree",
  previous,
  from,
  to,
  noteNames = "solfejo",
  naming = "sharp",
  showLegend,
  maxKeyPx = 40,
  strings: stringsOverride,
  keyboardStrings,
  className,
}: KeyChordProps) {
  const s = { ...defaultStrings.keyChord, ...stringsOverride };
  const ks = { ...defaultStrings.keyboard, ...keyboardStrings };
  const all = [...notes, ...(previous?.notes ?? [])].map((n) => n.midi);
  const [a, b] = from !== undefined && to !== undefined ? [from, to] : autoRange(all);

  const labelOf = (n: ChordNote) =>
    labelMode === "finger" ? (n.finger ? String(n.finger) : undefined) : labelMode === "note" ? noteName(n.midi, noteNames, naming) : n.degree;

  // Condução de vozes: pares por mão + dedo
  const pair = (n: ChordNote) => `${n.hand ?? "right"}-${n.finger ?? n.midi}`;
  const prevBy = new Map((previous?.notes ?? []).map((p) => [pair(p), p]));
  const curMidis = new Set(notes.map((n) => n.midi));
  const moves: { finger: number; from: number; to: number }[] = [];
  const stays = new Set<number>();
  if (previous) {
    for (const n of notes) {
      const p = prevBy.get(pair(n));
      if (!p) continue;
      if (p.midi === n.midi) stays.add(n.midi);
      else moves.push({ finger: n.finger ?? 0, from: p.midi, to: n.midi });
    }
  }

  const markers: MiniKeyMarker[] = [
    ...(previous?.notes ?? [])
      .filter((p) => !curMidis.has(p.midi))
      .map((p) => ({ midi: p.midi, kind: "ghost" as MarkerKind, label: p.finger ? String(p.finger) : undefined })),
    ...notes.map((n) => ({
      midi: n.midi,
      kind: n.kind ?? kindFromDegree(n.degree),
      label: labelOf(n),
      hand: n.hand,
      ring: stays.has(n.midi),
    })),
  ];

  const headroom = previous ? 26 : 0;
  const fingering = (["right", "left"] as Hand[])
    .map((h) => {
      const fs = notes
        .filter((n) => (n.hand ?? "right") === h && n.finger)
        .sort((x, y) => x.midi - y.midi)
        .map((n) => n.finger);
      return fs.length ? `${ks.handShort[h]} ${fs.join("-")}` : "";
    })
    .filter(Boolean)
    .join(" · ");
  const twoHands = notes.some((n) => n.hand === "left") && notes.some((n) => (n.hand ?? "right") === "right");
  const bassNote = twoHands ? notes.filter((n) => n.hand === "left").sort((x, y) => x.midi - y.midi)[0] : undefined;

  const aria = [
    s.chord(name),
    inversion !== undefined ? s.inversion[inversion] : "",
    notes
      .slice()
      .sort((x, y) => x.midi - y.midi)
      .map((n) => [noteSpoken(n.midi, naming), n.finger ? ks.finger(n.finger) : "", n.hand ? ks.hand[n.hand] : ""].filter(Boolean).join(" "))
      .join("; "),
    ...moves.map((m) => s.moveAria(m.finger, noteSpoken(m.from, naming), noteSpoken(m.to, naming))),
    ...[...stays].map((m) => s.stayAria(notes.find((n) => n.midi === m)?.finger ?? 0, noteSpoken(m, naming))),
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <figure data-slot="key-chord" className={cn("inline-flex w-full max-w-md flex-col gap-2", className)}>
      <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <span className="font-display text-xl font-bold text-fg">{name}</span>
        {inversion !== undefined && <span className="text-sm font-semibold text-fg">{s.inversion[inversion]}</span>}
        {previous?.name && <span className="text-sm text-muted">{s.from(previous.name)}</span>}
      </figcaption>

      <MiniKeys
        from={a}
        to={b}
        markers={markers}
        headroom={headroom}
        noteNames={noteNames}
        naming={naming}
        handLetters={ks.handLetter}
        maxKeyPx={maxKeyPx}
        ariaLabel={aria}
        overlay={({ byMidi }) =>
          moves.map((m, i) => {
            const k1 = byMidi.get(m.from);
            const k2 = byMidi.get(m.to);
            if (!k1 || !k2) return null;
            const y = headroom - 3;
            const mid = (k1.cx + k2.cx) / 2;
            const dir = Math.sign(k2.cx - k1.cx) || 1;
            const apex = 5;
            const ex = k2.cx - dir * 1;
            const cy = apex - 4;
            // ponta da seta na direção da tangente do fim da curva
            const ux = ex - mid, uy = y - cy;
            const len = Math.hypot(ux, uy) || 1;
            const tx = ux / len, ty = uy / len;
            const h1 = `${ex - tx * 5 - ty * 3.2} ${y - ty * 5 + tx * 3.2}`;
            const h2 = `${ex - tx * 5 + ty * 3.2} ${y - ty * 5 - tx * 3.2}`;
            return (
              <g key={i} aria-hidden>
                <path d={`M${k1.cx} ${y} Q${mid} ${cy} ${ex} ${y}`} fill="none" stroke="var(--fg)" strokeWidth={1.8} strokeLinecap="round" />
                <path d={`M${h1} L${ex} ${y} L${h2}`} fill="none" stroke="var(--fg)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <rect x={mid - 6} y={apex - 2} width={12} height={10} rx={2} fill="var(--surface)" stroke="var(--line-strong)" strokeWidth={1} />
                <text x={mid} y={apex + 3} dy="0.35em" textAnchor="middle" fontFamily="var(--font-mono)" fontWeight={700} fontSize={7.5} fill="var(--fg)">
                  {m.finger || ""}
                </text>
              </g>
            );
          })
        }
      />

      {(fingering || bassNote) && (
        <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm text-fg">
          {fingering && (
            <span>
              <span className="text-muted">{s.fingering} </span>
              {fingering}
            </span>
          )}
          {bassNote && (
            <span>
              <span className="text-muted">{s.bass} </span>
              {noteName(bassNote.midi, noteNames, naming)}
            </span>
          )}
        </p>
      )}

      {(showLegend ?? !!previous) && previous && (
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-fg" aria-label={s.legend}>
          <li className="inline-flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
              <circle cx={13} cy={13} r={11.5} fill="none" stroke="var(--note-active)" strokeWidth={2.5} />
              <MarkerGlyph kind="deg-3" cx={13} cy={13} r={8} surface="page" animate={false} />
            </svg>
            {s.stays}
          </li>
          <li className="inline-flex items-center gap-2">
            <svg width="30" height="26" viewBox="0 0 30 26" aria-hidden>
              <path d="M4 20 Q15 2 26 20" fill="none" stroke="var(--fg)" strokeWidth={2} strokeLinecap="round" />
              <path d="M26 20 l-5 -2.5 m5 2.5 l-1 -5.5" fill="none" stroke="var(--fg)" strokeWidth={2} strokeLinecap="round" />
            </svg>
            {s.moves}
          </li>
          <li className="inline-flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
              <MarkerGlyph kind="ghost" cx={13} cy={13} r={9} surface="page" animate={false} />
            </svg>
            {s.previous}
          </li>
        </ul>
      )}
    </figure>
  );
}
