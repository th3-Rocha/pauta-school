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

/** Largura relativa da casa n, como numa guitarra de verdade: cada casa é 2^(-1/12) da anterior (regra do 17,817). */
function fretRatio(n: number) {
  return Math.pow(2, -(n - 1) / 12);
}
const FRET1 = 86; // largura da casa 1 quando não há espaço sobrando
const MIN_FRET = 40; // a casa mais estreita nunca fica menor que um dedo

/**
 * Uma corda. Ao ser tocada, o trecho entre a casa apertada e o cavalete vibra como uma
 * onda presa nas duas pontas: amplitude que decai, oscilação rápida (o olho vê um borrão)
 * e um "envelope" translúcido mostrando até onde a corda vai. O trecho até a casa fica parado.
 */
function GuitarString({
  index,
  cross,
  length,
  fretAt,
  vib,
  P,
}: {
  index: number;
  cross: number;
  length: number;
  /** Posição (ao longo do braço) onde a corda está presa ao vibrar: traste da casa, ou o capotraste. */
  fretAt: (f: number) => number;
  vib?: { f: number; k: number };
  P: (al: number, cr: number) => [number, number];
}) {
  const w = STRING_W[index] ?? 2;
  const wound = index >= 3;
  const refs = [React.useRef<SVGPathElement>(null), React.useRef<SVGPathElement>(null), React.useRef<SVGPathElement>(null)];
  const env = React.useRef<SVGPathElement>(null);

  const path = React.useCallback(
    (from: number, amp: number) => {
      // ponto fixo virtual (cavalete) além da borda direita: a corda visível é parte da onda
      if (amp === 0) {
        const [ax, ay] = P(0, cross);
        const [bx, by] = P(length, cross);
        return `M${ax} ${ay} L${bx} ${by}`;
      }
      const bridge = length + (length - from) * 0.55;
      const span = bridge - from;
      const pts: string[] = [];
      const [sx, sy] = P(0, cross);
      pts.push(`M${sx.toFixed(1)} ${sy.toFixed(1)}`);
      const [fx, fy] = P(from, cross);
      pts.push(`L${fx.toFixed(1)} ${fy.toFixed(1)}`);
      const N = 28;
      for (let i = 1; i <= N; i++) {
        const al = from + ((length - from) * i) / N;
        const y = amp * Math.sin((Math.PI * (al - from)) / span);
        const [x2, y2] = P(al, cross + y);
        pts.push(`L${x2.toFixed(1)} ${y2.toFixed(1)}`);
      }
      return pts.join(" ");
    },
    [length, cross, P],
  );

  const rest = path(0, 0);

  React.useEffect(() => {
    if (!vib) return;
    const from = vib.f === 0 ? fretAt(0) : fretAt(vib.f);
    const amp0 = 3 + index * 0.7; // cordas graves balançam mais
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const decay = Math.exp(-t / (0.45 + index * 0.08));
      // oscilação rápida + um pouco de irregularidade (harmônicos)
      const osc = Math.cos(t * 2 * Math.PI * 19) * 0.8 + Math.cos(t * 2 * Math.PI * 41 + 1.3) * 0.2;
      const a = amp0 * decay;
      const d = path(from, a * osc);
      for (const r of refs) r.current?.setAttribute("d", d);
      if (env.current) {
        env.current.setAttribute("d", `${path(from, a)} ${path(from, -a).replace(/^M[^L]*L/, "M")}`);
        env.current.style.opacity = String(Math.min(0.35, a / 8));
      }
      if (a > 0.08) raf = requestAnimationFrame(tick);
      else {
        for (const r of refs) r.current?.setAttribute("d", rest);
        if (env.current) env.current.style.opacity = "0";
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      for (const r of refs) r.current?.setAttribute("d", rest);
      if (env.current) env.current.style.opacity = "0";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vib?.k]);

  return (
    <g>
      <path ref={env} d={rest} fill="none" stroke={wound ? "var(--string-wound)" : "var(--string)"} strokeWidth={w} style={{ opacity: 0 }} />
      <path ref={refs[0]} d={rest} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={w + 1.2} transform="translate(0 1.2)" />
      <path ref={refs[1]} d={rest} fill="none" stroke={wound ? "var(--string-wound)" : "var(--string)"} strokeWidth={w} />
      {wound && <path ref={refs[2]} d={rest} fill="none" stroke="var(--marker-ring)" strokeOpacity={0.3} strokeWidth={w} strokeDasharray="0.8 1.4" />}
    </g>
  );
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

  // Largura disponível (horizontal): o braço estica as casas para ocupar o espaço.
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [avail, setAvail] = React.useState(0);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el || vertical) return;
    const ro = new ResizeObserver(([e]) => setAvail(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [vertical]);

  // Posições ao longo do braço
  const geo = React.useMemo(() => {
    const fixed = (showOpen ? OPEN + NUT : WIRE) + WIRE;
    let rel = 0;
    for (let f = firstCell; f <= lastFret; f++) rel += fretRatio(f);
    // unidade = largura da casa 1; nunca deixa a última casa menor que MIN_FRET
    const minUnit = Math.max(FRET1, MIN_FRET / fretRatio(lastFret));
    const fill = !vertical && avail > 0 ? (avail - fixed) / rel : 0;
    const unit = Math.max(minUnit, fill);
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
      a += fretRatio(f) * unit;
      end[f] = a;
    }
    return { start, end, length: Math.floor(a + WIRE) };
  }, [showOpen, firstCell, lastFret, avail, vertical]);

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
  const [vibs, setVibs] = React.useState<Record<number, { f: number; k: number }>>({});
  const press = (stringNo: number, fret: number) => {
    if (readOnly) return;
    setPluck((p) => ({ s: stringNo, f: fret, k: (p?.k ?? 0) + 1 }));
    setVibs((v) => ({ ...v, [stringNo]: { f: fret, k: (v[stringNo]?.k ?? 0) + 1 } }));
    onPress?.(stringNo, fret);
  };
  // Deslizar com o botão apertado: descobre a casa sob o ponteiro.
  const lastCell = React.useRef<{ s: number; f: number } | null>(null);
  const cellAt = (el: HTMLElement, cx: number, cy: number) => {
    const r = el.getBoundingClientRect();
    const x = cx - r.left;
    const y = cy - r.top;
    const al = vertical ? y : x;
    const cr = vertical ? x - BAND : y - TOP;
    const ordered = Math.round((cr - EDGE) / GAP);
    if (ordered < 0 || ordered >= nStrings) return null;
    const idx = vertical ? nStrings - 1 - ordered : highStringOnTop ? ordered : nStrings - 1 - ordered;
    const f = cells.find((c) => al >= geo.start[c] && al < geo.end[c]);
    return f === undefined ? null : { s: idx + 1, f };
  };
  // onde a corda fica presa: o traste da casa (fim da casa) ou o capotraste (corda solta)
  const fretAt = (f: number) => (f === 0 ? (showOpen ? OPEN : 0) : (geo.end[f] ?? 0));

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
            {Array.from({ length: nStrings }, (_, i) => (
              <GuitarString key={i} index={i} cross={crossOf(i)} length={geo.length} fretAt={fretAt} vib={vibs[i + 1]} P={P} />
            ))}
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
          <div
            role="grid"
            aria-label={ariaLabel ?? s.label}
            aria-readonly={readOnly || undefined}
            className="absolute inset-0 select-none"
            onDragStart={(e) => e.preventDefault()}
            onPointerDown={(e) => {
              lastCell.current = cellAt(e.currentTarget, e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (e.pointerType === "touch" || !(e.buttons & 1) || readOnly) return;
              const cur = cellAt(e.currentTarget, e.clientX, e.clientY);
              const last = lastCell.current;
              if (!cur || (last && last.s === cur.s && last.f === cur.f)) return;
              lastCell.current = cur;
              if (!last || last.s === cur.s) return press(cur.s, cur.f);
              // cruzou várias cordas num movimento só: toca todas no caminho, como uma palhetada
              const dir = cur.s > last.s ? 1 : -1;
              for (let sNo = last.s + dir; dir > 0 ? sNo <= cur.s : sNo >= cur.s; sNo += dir) press(sNo, cur.f);
            }}
            onPointerUp={() => (lastCell.current = null)}
          >
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
                          // solta a captura implícita para que as outras casas recebam o deslizar
                          try {
                            (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
                          } catch {
                            /* ponteiro sem captura: nada a soltar */
                          }
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
