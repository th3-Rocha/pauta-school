// src/components/music/Fretboard.tsx
import * as React from "react";
import { cn } from "../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { DOUBLE_INLAY_FRETS, INLAY_FRETS, STANDARD_TUNING, midiToName, type NoteNaming } from "../../lib/music";
import { MarkerDefs, MarkerGlyph, type MarkerKind } from "./markers";

export type FretboardMarker = {
  /** 1 = Mi aguda … 6 = Mi grave */
  string: number;
  /** 0 = corda solta */
  fret: number;
  /** Texto na bolinha: grau ("b3") ou nota ("C"). Sem label, usa o nome da nota se `showNoteNames`. */
  label?: string;
  kind: MarkerKind;
};

export type FretboardRange = { from: number; to: number; label?: string };

export type FretboardProps = {
  /** MIDI de cada corda, da corda 1 (aguda) à 6 (grave). Padrão: E A D G B E. */
  tuning?: readonly number[];
  /** Última casa desenhada (0–24). */
  frets?: number;
  /** Primeira casa desenhada. 0 mostra a área das cordas soltas e o capotraste. */
  startFret?: number;
  markers?: FretboardMarker[];
  /** Destaca uma "caixa" (ex.: casas 5–8). */
  highlightRange?: FretboardRange;
  /** true: bolinhas sem label mostram a nota. "all": mostra a nota em todas as posições, bem discreta. */
  showNoteNames?: boolean | "all";
  naming?: NoteNaming;
  orientation?: "horizontal" | "vertical";
  /** Só no horizontal: corda aguda em cima (como você vê a guitarra no colo). */
  highStringOnTop?: boolean;
  onPress?: (string: number, fret: number) => void;
  /** Desliga o toque (o braço vira só ilustração). */
  readOnly?: boolean;
  /** Rola até esta casa ao montar (padrão: início do highlightRange ou do 1º marcador). */
  scrollToFret?: number;
  "aria-label"?: string;
  strings?: Partial<Strings["fretboard"]>;
  className?: string;
};

// Geometria (px). O SVG não escala: no celular, o contêiner rola.
const GAP = 44; // distância entre cordas = alvo de toque
const EDGE = 22;
const OPEN = 56; // área das cordas soltas
const NUT = 8;
const BAND = 26; // faixa dos números das casas
const WIRE = 3;
const STRING_W = [1.1, 1.4, 1.8, 2.3, 2.8, 3.3];

function fretWidth(n: number) {
  // encurta como numa guitarra de verdade, sem ficar menor que um dedo
  return Math.max(48, Math.round(86 * Math.pow(0.9715, n - 1)));
}

export function Fretboard({
  tuning = STANDARD_TUNING,
  frets = 12,
  startFret = 0,
  markers = [],
  highlightRange,
  showNoteNames = false,
  naming = "sharp",
  orientation = "horizontal",
  highStringOnTop = true,
  onPress,
  readOnly = false,
  scrollToFret,
  "aria-label": ariaLabel,
  strings: stringsOverride,
  className,
}: FretboardProps) {
  const s = { ...defaultStrings.fretboard, ...stringsOverride };
  const uid = React.useId().replace(/:/g, "");
  const vertical = orientation === "vertical";
  const nStrings = tuning.length;
  const lastFret = Math.max(1, Math.min(24, frets));
  const first = Math.max(0, Math.min(startFret, lastFret));
  const showOpen = first === 0;
  const firstCell = Math.max(1, first);

  // Posições ao longo do braço
  const geo = React.useMemo(() => {
    const start: Record<number, number> = {};
    const end: Record<number, number> = {};
    let a = 0;
    if (showOpen) {
      start[0] = 0;
      end[0] = OPEN;
      a = OPEN + NUT;
    } else {
      a = WIRE;
    }
    for (let f = firstCell; f <= lastFret; f++) {
      start[f] = a;
      a += fretWidth(f);
      end[f] = a;
    }
    return { start, end, length: a + WIRE };
  }, [showOpen, firstCell, lastFret]);

  const crossOf = (stringIdx: number) => {
    // stringIdx: 0 = corda 1
    const ordered = vertical ? nStrings - 1 - stringIdx : highStringOnTop ? stringIdx : nStrings - 1 - stringIdx;
    return EDGE + ordered * GAP;
  };
  const woodAcross = EDGE * 2 + GAP * (nStrings - 1);
  const TOP = !vertical && highlightRange?.label ? 22 : 0; // faixa do rótulo da caixa
  const W = vertical ? woodAcross + BAND : geo.length;
  const H = vertical ? geo.length : woodAcross + BAND + TOP;
  // along/cross → x/y
  const P = (al: number, cr: number): [number, number] =>
    vertical ? [cr + BAND, al] : [al, cr + TOP];
  const R = (a0: number, a1: number, c0: number, c1: number) => {
    const [x0, y0] = P(a0, c0);
    const [x1, y1] = P(a1, c1);
    return { x: Math.min(x0, x1), y: Math.min(y0, y1), width: Math.abs(x1 - x0), height: Math.abs(y1 - y0) };
  };
  const centerAlong = (f: number) => (geo.start[f] + geo.end[f]) / 2;

  // Pressionar: animação curta da corda
  const [pluck, setPluck] = React.useState<{ s: number; f: number; k: number } | null>(null);
  const press = (stringNo: number, fret: number) => {
    if (readOnly) return;
    setPluck((p) => ({ s: stringNo, f: fret, k: (p?.k ?? 0) + 1 }));
    onPress?.(stringNo, fret);
  };

  // Foco itinerante (uma parada de Tab; setas navegam)
  const cells: number[] = [];
  if (showOpen) cells.push(0);
  for (let f = firstCell; f <= lastFret; f++) cells.push(f);
  const firstMarker = markers[0];
  const [focus, setFocus] = React.useState<{ s: number; f: number }>(() => ({
    s: firstMarker?.string ?? 1,
    f: firstMarker && cells.includes(firstMarker.fret) ? firstMarker.fret : cells[0],
  }));
  const cellRefs = React.useRef(new Map<string, HTMLDivElement>());
  const moveFocus = (sNo: number, f: number) => {
    setFocus({ s: sNo, f });
    cellRefs.current.get(`${sNo}-${f}`)?.focus();
  };
  const onKeyDown = (e: React.KeyboardEvent, sNo: number, f: number) => {
    const idx = cells.indexOf(f);
    const prevF = cells[Math.max(0, idx - 1)];
    const nextF = cells[Math.min(cells.length - 1, idx + 1)];
    // corda visualmente acima/abaixo (ou à esquerda/direita no vertical)
    const visualUp = vertical ? Math.min(nStrings, sNo + 1) : highStringOnTop ? Math.max(1, sNo - 1) : Math.min(nStrings, sNo + 1);
    const visualDown = vertical ? Math.max(1, sNo - 1) : highStringOnTop ? Math.min(nStrings, sNo + 1) : Math.max(1, sNo - 1);
    const map: Record<string, () => void> = vertical
      ? {
          ArrowUp: () => moveFocus(sNo, prevF),
          ArrowDown: () => moveFocus(sNo, nextF),
          ArrowLeft: () => moveFocus(visualUp, f),
          ArrowRight: () => moveFocus(visualDown, f),
        }
      : {
          ArrowLeft: () => moveFocus(sNo, prevF),
          ArrowRight: () => moveFocus(sNo, nextF),
          ArrowUp: () => moveFocus(visualUp, f),
          ArrowDown: () => moveFocus(visualDown, f),
        };
    map.Home = () => moveFocus(sNo, cells[0]);
    map.End = () => moveFocus(sNo, cells[cells.length - 1]);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      press(sNo, f);
      return;
    }
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  // Rola até a área de interesse
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const target = scrollToFret ?? highlightRange?.from ?? firstMarker?.fret;
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el || target === undefined || geo.start[target] === undefined) return;
    const pos = Math.max(0, geo.start[target] - 48);
    if (vertical) return; // no vertical quem rola é a página
    el.scrollLeft = pos;
  }, [target, vertical, geo]);

  const markerAt = new Map<string, FretboardMarker>();
  for (const m of markers) markerAt.set(`${m.string}-${m.fret}`, m);

  const noteName = (sNo: number, f: number) => midiToName((tuning[sNo - 1] ?? 64) + f, naming);
  const cellLabel = (sNo: number, f: number) => {
    const m = markerAt.get(`${sNo}-${f}`);
    const note = noteName(sNo, f);
    const parts = [`${s.string(sNo)}, ${s.fret(f)}: ${note}`];
    if (m) parts.push(m.label && m.label !== note ? `${m.label}, ${s.kinds[m.kind]}` : s.kinds[m.kind]);
    return parts.join(", ");
  };

  const grain = [0.18, 0.37, 0.52, 0.71, 0.86];

  return (
    <div className={cn("relative max-w-full", !vertical && "w-full [contain:inline-size]", className)} data-slot="fretboard">
      <div
        ref={scrollRef}
        className={cn(
          "max-w-full overscroll-x-contain",
          vertical ? "overflow-visible" : "overflow-x-auto pb-1 [scrollbar-color:var(--line-strong)_transparent]",
        )}
      >
        <div className="relative" style={{ width: W, height: H }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden className="block select-none">
            <MarkerDefs hatchId={`${uid}-hatch`} />
            {/* Área das cordas soltas (mão) */}
            {showOpen && <rect {...R(0, OPEN, 0, woodAcross)} fill="var(--headstock)" rx={4} />}
            {/* Madeira */}
            <rect {...R(showOpen ? OPEN + NUT : 0, geo.length, 0, woodAcross)} fill="var(--wood)" />
            {grain.map((g, i) => {
              const [x0, y0] = P(showOpen ? OPEN + NUT : 0, woodAcross * g);
              const [x1, y1] = P(geo.length, woodAcross * (g + (i % 2 ? 0.03 : -0.02)));
              return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--wood-grain)" strokeWidth={i % 2 ? 6 : 3} strokeOpacity={0.55} strokeLinecap="round" />;
            })}
            {/* Caixa destacada */}
            {highlightRange && geo.start[Math.max(firstCell, highlightRange.from)] !== undefined && (
              <g>
                <rect
                  {...R(
                    geo.start[Math.max(firstCell, highlightRange.from)] - 2,
                    geo.end[Math.min(lastFret, highlightRange.to)] + 2,
                    3,
                    woodAcross - 3,
                  )}
                  fill="var(--pearl)"
                  fillOpacity={0.1}
                  stroke="var(--pearl)"
                  strokeWidth={2}
                  strokeDasharray="7 5"
                  rx={6}
                />
              </g>
            )}
            {/* Marcações de madrepérola */}
            {INLAY_FRETS.filter((f) => f >= firstCell && f <= lastFret).map((f) => {
              const a = centerAlong(f);
              const dbl = (DOUBLE_INLAY_FRETS as readonly number[]).includes(f);
              const cs = dbl ? [woodAcross * 0.3, woodAcross * 0.7] : [woodAcross / 2];
              return cs.map((c, i) => {
                const [x, y] = P(a, c);
                return <circle key={`${f}-${i}`} cx={x} cy={y} r={7} fill="var(--pearl)" opacity={0.92} />;
              });
            })}
            {/* Capotraste */}
            {showOpen && <rect {...R(OPEN, OPEN + NUT, 0, woodAcross)} fill="var(--nut)" />}
            {/* Trastes */}
            {Array.from({ length: lastFret - firstCell + 1 }, (_, i) => firstCell + i).map((f) => {
              const a = geo.end[f];
              return (
                <g key={f}>
                  <rect {...R(a - WIRE / 2, a + WIRE / 2, 0, woodAcross)} fill="var(--fret)" />
                  <rect {...R(a - WIRE / 2, a - WIRE / 2 + 1, 0, woodAcross)} fill="var(--fret-shine)" />
                </g>
              );
            })}
            {!showOpen && <rect {...R(0, WIRE, 0, woodAcross)} fill="var(--fret)" />}
            {/* Cordas */}
            {Array.from({ length: nStrings }, (_, i) => {
              const c = crossOf(i);
              const [x0, y0] = P(0, c);
              const [x1, y1] = P(geo.length, c);
              const w = STRING_W[i] ?? 2;
              const wound = i >= 3;
              const plucked = pluck && pluck.s === i + 1;
              return (
                <g key={`${i}-${plucked ? pluck!.k : 0}`} className={plucked ? (vertical ? "animate-vibrate-x" : "animate-vibrate") : undefined}>
                  <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="rgba(0,0,0,0.35)" strokeWidth={w + 1.2} transform={vertical ? "translate(1.2 0)" : "translate(0 1.2)"} />
                  <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={wound ? "var(--string-wound)" : "var(--string)"} strokeWidth={w} />
                  {wound && <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--marker-ring)" strokeOpacity={0.3} strokeWidth={w} strokeDasharray="0.8 1.4" />}
                </g>
              );
            })}
            {/* Números das casas */}
            {cells.map((f) => {
              const a = centerAlong(f);
              const [x, y] = vertical ? [BAND / 2, a] : [a, TOP + woodAcross + BAND / 2];
              const strong = (INLAY_FRETS as readonly number[]).includes(f);
              return (
                <text
                  key={f}
                  x={x}
                  y={y}
                  dy="0.35em"
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={12}
                  fontWeight={strong ? 700 : 500}
                  fill={strong ? "var(--fg)" : "var(--muted)"}
                >
                  {f}
                </text>
              );
            })}
            {highlightRange?.label && geo.start[Math.max(firstCell, highlightRange.from)] !== undefined && (() => {
              if (vertical) return null;
              const x = geo.start[Math.max(firstCell, highlightRange.from)];
              return (
                <text x={x} y={15} fontFamily="var(--font-mono)" fontSize={11} fontWeight={700} fill="var(--fg)" letterSpacing="0.08em">
                  {highlightRange.label.toUpperCase()}
                </text>
              );
            })()}
            {/* Nomes de todas as notas (modo "all") */}
            {showNoteNames === "all" &&
              cells.flatMap((f) =>
                Array.from({ length: nStrings }, (_, i) => {
                  if (markerAt.has(`${i + 1}-${f}`)) return null;
                  const [x, y] = P(centerAlong(f), crossOf(i));
                  return (
                    <text key={`n${i}-${f}`} x={x} y={y} dy="-0.55em" textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10} fill="var(--pearl)" opacity={0.6}>
                      {noteName(i + 1, f)}
                    </text>
                  );
                }),
              )}
            {/* Toque: anel que se expande */}
            {pluck && geo.start[pluck.f] !== undefined && (() => {
              const [x, y] = P(centerAlong(pluck.f), crossOf(pluck.s - 1));
              return (
                <circle
                  key={`r${pluck.k}`}
                  cx={x}
                  cy={y}
                  r={14}
                  fill="none"
                  stroke="var(--pearl)"
                  strokeWidth={2}
                  className="animate-pulse-ring [animation-iteration-count:1] [animation-fill-mode:forwards]"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              );
            })()}
            {/* Marcadores */}
            {markers
              .filter((m) => geo.start[m.fret] !== undefined && m.string >= 1 && m.string <= nStrings)
              .map((m) => {
                const [x, y] = P(centerAlong(m.fret), crossOf(m.string - 1));
                const label = m.label ?? (showNoteNames ? noteName(m.string, m.fret) : undefined);
                return (
                  <MarkerGlyph
                    key={`${m.string}-${m.fret}-${m.kind}`}
                    kind={m.kind}
                    cx={x}
                    cy={y}
                    r={m.kind === "active" ? 16 : 15}
                    label={label}
                    hatchId={`${uid}-hatch`}
                  />
                );
              })}
          </svg>

          {/* Camada de toque e teclado */}
          <div role="grid" aria-label={ariaLabel ?? s.label} aria-readonly={readOnly || undefined} className="absolute inset-0">
            {Array.from({ length: nStrings }, (_, i) => {
              const sNo = i + 1;
              return (
                <div role="row" key={sNo} className="contents">
                  {cells.map((f) => {
                    const r = R(geo.start[f], geo.end[f], crossOf(i) - GAP / 2, crossOf(i) + GAP / 2);
                    const isFocus = focus.s === sNo && focus.f === f;
                    return (
                      <div
                        key={f}
                        role="gridcell"
                        ref={(el) => {
                          if (el) cellRefs.current.set(`${sNo}-${f}`, el);
                          else cellRefs.current.delete(`${sNo}-${f}`);
                        }}
                        tabIndex={isFocus ? 0 : -1}
                        aria-label={cellLabel(sNo, f)}
                        onFocus={() => setFocus({ s: sNo, f })}
                        onPointerDown={(e) => {
                          if (e.pointerType === "mouse" && e.button !== 0) return;
                          press(sNo, f);
                        }}
                        onKeyDown={(e) => onKeyDown(e, sNo, f)}
                        className={cn(
                          "absolute rounded-[6px] focus-ring-wood",
                          !readOnly && "cursor-pointer hover:bg-pearl/10",
                        )}
                        style={{ left: r.x, top: r.y, width: r.width, height: r.height }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
