// src/components/music/keyboard/Keyboard.tsx
// O teclado clicável. Equivalente ao Fretboard: objeto físico (marfim, ébano,
// feltro vermelho, laca preta), marcadores de grau iguais aos da guitarra,
// mãos separadas por letra + posição (MD acima, ME abaixo) + cor.
import * as React from "react";
import { Check, ChevronLeft, ChevronRight, Footprints, RotateCw, X } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import {
  KEY,
  MIDDLE_C,
  computerKeyFor,
  isBlack,
  layoutKeys,
  noteName,
  noteSpoken,
  snapRange,
  type Accidentals,
  type Finger,
  type Hand,
  type KeyGeom,
  type NoteNames,
  defaultNoteNames,
} from "../../../lib/piano";
import { Button } from "../../ui/Button";
import { MarkerDefs, MarkerGlyph, type MarkerKind } from "../markers";
import { HandTag } from "./MiniKeys";

export type KeyMarker = {
  midi: number;
  kind: MarkerKind;
  /** Texto dentro da bolinha. Sem `label`, mostra o dedo (se houver). */
  label?: string;
  hand?: Hand;
  finger?: Finger;
};

export type HandZone = {
  hand: Hand;
  /** Primeira e última nota da região da mão (MIDI). */
  from: number;
  to: number;
  /** Ex.: "Posição de Dó". */
  label?: string;
  /** Zona em foco agora. No modo compacto, a janela segue a zona ativa. */
  active?: boolean;
};

/**
 * Feedback de execução, comparando `markers` (alvo) com `pressed`:
 * - `off`: nada
 * - `live`: enquanto toca — certa (alvo + pressionada) e tecla errada
 * - `result`: depois da tentativa — também mostra o que faltou
 */
export type KeyboardFeedback = "off" | "live" | "result";

export type KeyboardProps = {
  /** Primeira e última nota (MIDI). Se cair em tecla preta, o teclado começa/termina na branca vizinha. */
  from: number;
  to: number;
  markers?: KeyMarker[];
  /** Notas tocadas agora (MIDI, toque, teclado do computador). Várias ao mesmo tempo = acorde. */
  pressed?: number[];
  handZones?: HandZone[];
  showNoteNames?: "none" | "c-only" | "all";
  noteNames?: NoteNames;
  naming?: Accidentals;
  /** Mostra a letra do teclado do computador em cada tecla. Número = nota da tecla A (padrão: Dó central). */
  computerKeys?: boolean | number;
  /** Pedal de sustentação pisado. */
  pedal?: boolean;
  feedback?: KeyboardFeedback;
  /** `fit` ocupa a largura do contêiner; `touch` usa teclas brancas de 44px e rola dentro do componente. */
  size?: "fit" | "touch";
  /** Mostra só uma oitava e meia, seguindo a `handZone` ativa. Para o celular em pé. */
  compact?: boolean;
  /** Teclas brancas visíveis no modo compacto. */
  compactWhiteKeys?: number;
  /** Botões "‹ Oitava / Oitava ›". Padrão: ligado em `compact` e `touch`. */
  octaveNav?: boolean;
  onPress?: (midi: number, velocity?: number) => void;
  onRelease?: (midi: number) => void;
  label?: string;
  strings?: Partial<Strings["keyboard"]>;
  className?: string;
};

type KeyState = "hit" | "wrong" | "missed" | null;

const LID = 12;
const FELT = 5;
const Y0 = LID + FELT;
const CHEEK = 6;
const PX_TOUCH = 44;
const MIN_FIT_PX = 20;
const MAX_FIT_PX = 64;

/** Ícones de feedback desenhados em SVG (dentro da tecla). */
function FeedbackBadge({ state, cx, cy, r }: { state: Exclude<KeyState, null>; cx: number; cy: number; r: number }) {
  if (state === "missed") return null;
  const fill = state === "hit" ? "var(--good)" : "var(--bad)";
  const s = r * 0.5;
  return (
    <g aria-hidden>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke="var(--marker-ring)" strokeWidth={1.5} />
      {state === "hit" ? (
        <path d={`M${cx - s} ${cy} l${s * 0.7} ${s * 0.7} l${s * 1.3} -${s * 1.4}`} fill="none" stroke="var(--bg)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d={`M${cx - s * 0.8} ${cy - s * 0.8} l${s * 1.6} ${s * 1.6} m0 -${s * 1.6} l-${s * 1.6} ${s * 1.6}`} fill="none" stroke="var(--bg)" strokeWidth={2.2} strokeLinecap="round" />
      )}
    </g>
  );
}

export function Keyboard({
  from,
  to,
  markers = [],
  pressed = [],
  handZones = [],
  showNoteNames = "c-only",
  noteNames = defaultNoteNames(),
  naming = "sharp",
  computerKeys = false,
  pedal = false,
  feedback = "off",
  size = "fit",
  compact = false,
  compactWhiteKeys = 10,
  octaveNav,
  onPress,
  onRelease,
  label,
  strings: stringsOverride,
  className,
}: KeyboardProps) {
  const s = { ...defaultStrings.keyboard, ...stringsOverride };
  const uid = React.useId().replace(/:/g, "");
  const [lo, hi] = snapRange(from, to);

  // ── Janela visível (modo compacto) ───────────────────────────────────
  const whites = React.useMemo(() => {
    const out: number[] = [];
    for (let m = lo; m <= hi; m++) if (!isBlack(m)) out.push(m);
    return out;
  }, [lo, hi]);
  const activeZone = handZones.find((z) => z.active) ?? handZones[0];
  const zoneKey = activeZone ? `${activeZone.hand}-${activeZone.from}-${activeZone.to}` : "none";
  const [offset, setOffset] = React.useState(0);
  React.useEffect(() => setOffset(0), [zoneKey]);

  const n = Math.min(compactWhiteKeys, whites.length);
  const baseStart = React.useMemo(() => {
    const center = activeZone ? (activeZone.from + activeZone.to) / 2 : MIDDLE_C;
    let idx = 0;
    let best = Infinity;
    whites.forEach((m, i) => {
      const d = Math.abs(m - center);
      if (d < best) { best = d; idx = i; }
    });
    return Math.max(0, Math.min(whites.length - n, idx - Math.floor(n / 2)));
  }, [whites, n, activeZone?.from, activeZone?.to]);
  const start = compact ? Math.max(0, Math.min(whites.length - n, baseStart + offset)) : 0;
  const viewFrom = compact ? whites[start] : lo;
  const viewTo = compact ? whites[start + n - 1] : hi;

  const { keys, width, byMidi } = React.useMemo(() => layoutKeys(viewFrom, viewTo), [viewFrom, viewTo]);
  const totalW = width + CHEEK * 2;
  const totalH = Y0 + KEY.h + 2;
  const xOf = (unit: number) => ((unit + CHEEK) / totalW) * 100;

  // ── Estado de cada tecla ─────────────────────────────────────────────
  const pressedSet = React.useMemo(() => new Set(pressed), [pressed]);
  const markerBy = React.useMemo(() => new Map(markers.map((m) => [m.midi, m])), [markers]);
  const stateOf = (midi: number): KeyState => {
    if (feedback === "off") return null;
    const target = markerBy.has(midi) && markerBy.get(midi)!.kind !== "ghost" && markerBy.get(midi)!.kind !== "out";
    const down = pressedSet.has(midi);
    if (target && down) return "hit";
    if (!target && down) return "wrong";
    if (target && !down && feedback === "result") return "missed";
    return null;
  };
  const counts = React.useMemo(() => {
    let hit = 0, wrong = 0, missed = 0;
    for (let m = lo; m <= hi; m++) {
      const st = stateOf(m);
      if (st === "hit") hit++;
      else if (st === "wrong") wrong++;
      else if (st === "missed") missed++;
    }
    return { hit, wrong, missed };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lo, hi, pressedSet, markerBy, feedback]);

  const compBase = typeof computerKeys === "number" ? computerKeys : MIDDLE_C;

  // ── Toque (ponteiro) ─────────────────────────────────────────────────
  const active = React.useRef(new Map<number, number>());
  const press = (pointerId: number, midi: number) => {
    active.current.set(pointerId, midi);
    onPress?.(midi);
  };
  const release = (pointerId: number) => {
    const m = active.current.get(pointerId);
    if (m === undefined) return;
    active.current.delete(pointerId);
    onRelease?.(m);
  };

  // ── Teclado (foco itinerante) ────────────────────────────────────────
  const firstTarget = markers.find((m) => m.midi >= viewFrom && m.midi <= viewTo)?.midi;
  const [focusMidi, setFocusMidi] = React.useState<number>(firstTarget ?? (MIDDLE_C >= viewFrom && MIDDLE_C <= viewTo ? MIDDLE_C : viewFrom));
  const focusable = focusMidi >= viewFrom && focusMidi <= viewTo ? focusMidi : viewFrom;
  const refs = React.useRef(new Map<number, SVGGElement>());
  const keyDown = React.useRef(new Set<number>());
  const [ring, setRing] = React.useState<number | null>(null);

  const moveFocus = (next: number) => {
    const target = Math.max(lo, Math.min(hi, next));
    if (compact && (target < viewFrom || target > viewTo)) {
      setOffset((o) => o + (target < viewFrom ? -7 : 7));
    }
    setFocusMidi(target);
    requestAnimationFrame(() => {
      const el = refs.current.get(target);
      el?.focus({ preventScroll: true });
      el?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    });
  };

  const onKeyDown = (e: React.KeyboardEvent, midi: number) => {
    switch (e.key) {
      case "ArrowRight": e.preventDefault(); moveFocus(midi + 1); break;
      case "ArrowLeft": e.preventDefault(); moveFocus(midi - 1); break;
      case "ArrowUp": e.preventDefault(); moveFocus(midi + 12); break;
      case "ArrowDown": e.preventDefault(); moveFocus(midi - 12); break;
      case "Home": e.preventDefault(); moveFocus(lo); break;
      case "End": e.preventDefault(); moveFocus(hi); break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!e.repeat && !keyDown.current.has(midi)) {
          keyDown.current.add(midi);
          onPress?.(midi);
        }
        break;
    }
  };
  const onKeyUp = (e: React.KeyboardEvent, midi: number) => {
    if ((e.key === "Enter" || e.key === " ") && keyDown.current.has(midi)) {
      keyDown.current.delete(midi);
      onRelease?.(midi);
    }
  };

  // ── Rolagem até a zona ativa (modo não compacto) ─────────────────────
  const scroller = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = scroller.current;
    if (!el || compact || el.scrollWidth <= el.clientWidth) return;
    const center = activeZone ? (activeZone.from + activeZone.to) / 2 : MIDDLE_C;
    const k = byMidi.get(Math.round(center)) ?? byMidi.get(Math.round(center) + 1);
    if (!k) return;
    el.scrollLeft = ((k.cx + CHEEK) / totalW) * el.scrollWidth - el.clientWidth / 2;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneKey, compact, size]);

  const showNav = octaveNav ?? (compact || size === "touch");
  const shift = (dir: -1 | 1) => {
    if (compact) {
      setOffset((o) => o + dir * 7);
      return;
    }
    const el = scroller.current;
    if (!el) return;
    const keyPx = el.scrollWidth / (whites.length + (CHEEK * 2) / KEY.w);
    el.scrollBy({ left: dir * 7 * keyPx, behavior: "smooth" });
  };
  const canDown = compact ? start > 0 : true;
  const canUp = compact ? start + n < whites.length : true;

  const wrapperStyle: React.CSSProperties =
    size === "touch"
      ? { width: (totalW / KEY.w) * PX_TOUCH }
      : { width: "100%", minWidth: (totalW / KEY.w) * MIN_FIT_PX, maxWidth: (totalW / KEY.w) * MAX_FIT_PX };

  // ── Rótulos ──────────────────────────────────────────────────────────
  const ariaFor = (k: KeyGeom) => {
    const m = markerBy.get(k.midi);
    const st = stateOf(k.midi);
    const comp = computerKeys ? computerKeyFor(k.midi, compBase) : undefined;
    return s.keyAria([
      noteSpoken(k.midi, naming),
      k.black ? s.black : s.white,
      k.midi === MIDDLE_C ? s.middleC : "",
      m?.finger ? s.finger(m.finger) : "",
      m?.hand ? s.hand[m.hand] : "",
      m && !m.finger ? s.kinds[m.kind] : "",
      st ? s.feedback[st] : "",
      comp ? s.computerKey(comp) : "",
    ]);
  };

  const zonesRight = handZones.filter((z) => z.hand === "right");
  const zonesLeft = handZones.filter((z) => z.hand === "left");
  const middleCVisible = MIDDLE_C >= viewFrom && MIDDLE_C <= viewTo;

  const zoneRow = (zones: HandZone[], place: "above" | "below") =>
    zones.length > 0 && (
      <div className="relative h-11" aria-hidden>
        {zones.map((z, i) => {
          const a = byMidi.get(Math.max(z.from, viewFrom));
          const b = byMidi.get(Math.min(z.to, viewTo));
          if (!a || !b || z.to < viewFrom || z.from > viewTo) return null;
          const left = xOf(a.x);
          const right = xOf(b.x + b.width);
          const color = z.hand === "right" ? "var(--hand-right)" : "var(--hand-left)";
          const dim = activeZone && !z.active && handZones.some((h) => h.active);
          const chip = (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-fg sm:text-sm">
              <span
                className="inline-flex size-5 items-center justify-center rounded-xs font-mono text-[11px] font-extrabold text-on-deg ring-1 ring-marker-ring"
                style={{ background: color }}
              >
                {s.handLetter[z.hand]}
              </span>
              {s.zone(s.handShort[z.hand], z.label)}
            </span>
          );
          return (
            <div
              key={i}
              className={cn("absolute inset-y-0 flex flex-col", place === "above" ? "justify-end" : "justify-start", dim && "opacity-55")}
              style={{ left: `${left}%`, width: `${right - left}%` }}
            >
              {place === "below" && (
                <span className="h-2 border-x-2 border-b-2" style={{ borderColor: color, borderStyle: dim ? "dashed" : "solid" }} />
              )}
              <span className={cn("py-0.5", place === "above" ? "order-first" : "")}>{chip}</span>
              {place === "above" && (
                <span className="h-2 border-x-2 border-t-2" style={{ borderColor: color, borderStyle: dim ? "dashed" : "solid" }} />
              )}
            </div>
          );
        })}
      </div>
    );

  return (
    <div data-slot="keyboard" className={cn("flex flex-col gap-2", className)}>
      {(showNav || pedal) && (
        <div className="flex items-center gap-2">
          {pedal && (
            <span className="inline-flex h-7 items-center gap-1.5 rounded-xs border border-line-strong bg-surface-2 px-2 text-xs font-semibold text-fg">
              <Footprints className="size-3.5" aria-hidden />
              <span className="size-2 rounded-full ring-1 ring-marker-ring" style={{ background: "var(--pedal)" }} aria-hidden />
              {s.pedalOn}
            </span>
          )}
          {showNav && (
            <div className="ml-auto flex gap-2">
              <Button variant="secondary" size="md" onClick={() => shift(-1)} disabled={!canDown} aria-label={s.octaveDownAria} className="px-3">
                <ChevronLeft aria-hidden />
                {s.octaveDown}
              </Button>
              <Button variant="secondary" size="md" onClick={() => shift(1)} disabled={!canUp} aria-label={s.octaveUpAria} className="px-3">
                {s.octaveUp}
                <ChevronRight aria-hidden />
              </Button>
            </div>
          )}
        </div>
      )}

      <div ref={scroller} className={cn("keyboard-scroll -mx-1 px-1 pb-1", compact && size === "fit" && "overflow-x-hidden")}>
        <div className="relative mx-auto" style={wrapperStyle}>
          {zoneRow(zonesRight, "above")}

          <div role="group" aria-label={label ?? s.label} className="touch-none select-none">
            <svg viewBox={`${-CHEEK} 0 ${totalW} ${totalH}`} width="100%" className="block" style={{ height: "auto" }}>
              <MarkerDefs hatchId={`${uid}-h`} />
              {/* Caixa: bochechas laterais em laca */}
              <rect x={-CHEEK} y={0} width={totalW} height={totalH} rx={4} fill="var(--case)" />

              {keys.map((k) => {
                const down = pressedSet.has(k.midi);
                const st = stateOf(k.midi);
                const m = markerBy.get(k.midi);
                const showName =
                  !m && !st && (showNoteNames === "all" || (showNoteNames === "c-only" && k.midi % 12 === 0)) && (!k.black || showNoteNames === "all");
                const comp = computerKeys ? computerKeyFor(k.midi, compBase) : undefined;
                const isFocus = k.midi === focusable;
                const bottom = Y0 + k.height;
                return (
                  <g
                    key={k.midi}
                    ref={(el) => { if (el) refs.current.set(k.midi, el); else refs.current.delete(k.midi); }}
                    role="button"
                    tabIndex={isFocus ? 0 : -1}
                    aria-label={ariaFor(k)}
                    aria-pressed={down}
                    className="group/key cursor-pointer outline-none"
                    onFocus={(e) => { setFocusMidi(k.midi); setRing(e.currentTarget.matches(":focus-visible") ? k.midi : null); }}
                    onBlur={() => setRing(null)}
                    onKeyDown={(e) => onKeyDown(e, k.midi)}
                    onKeyUp={(e) => onKeyUp(e, k.midi)}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
                      press(e.pointerId, k.midi);
                    }}
                    onPointerEnter={(e) => {
                      const prev = active.current.get(e.pointerId);
                      if (prev !== undefined && prev !== k.midi && e.buttons) {
                        release(e.pointerId);
                        press(e.pointerId, k.midi);
                      }
                    }}
                    onPointerUp={(e) => release(e.pointerId)}
                    onPointerCancel={(e) => release(e.pointerId)}
                    onPointerLeave={(e) => { if (!e.buttons) release(e.pointerId); }}
                  >
                    {k.black ? (
                      <>
                        <rect x={k.x} y={Y0 - 3} width={k.width} height={k.height + 3} rx={1.6} fill={down ? "var(--key-black-pressed)" : "var(--key-black)"} />
                        {/* frente chanfrada da tecla preta; encurta quando afunda */}
                        <rect x={k.x + 1.2} y={bottom - (down ? 4 : 8)} width={k.width - 2.4} height={down ? 3 : 6.5} rx={1} fill="var(--case-shine)" />
                      </>
                    ) : (
                      <>
                        <rect
                          x={k.x + 0.5}
                          y={Y0 - 3}
                          width={k.width - 1}
                          height={k.height + 3}
                          rx={2.5}
                          fill={down ? "var(--key-white-pressed)" : "var(--key-white)"}
                          stroke="var(--key-edge)"
                          strokeWidth={1}
                        />
                        {down && <rect x={k.x + 1} y={Y0} width={k.width - 2} height={7} fill="var(--key-edge)" opacity={0.45} />}
                        {k.midi === MIDDLE_C && <rect x={k.cx - 6} y={bottom - 3.5} width={12} height={2} rx={1} fill="var(--key-ink)" />}
                      </>
                    )}

                    {comp && !m && !st && (
                      <text
                        x={k.cx}
                        y={k.black ? Y0 + k.height - 16 : bottom - 22}
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                        fontWeight={700}
                        fontSize={k.black ? 7 : 8.5}
                        fill={k.black ? "var(--key-white)" : "var(--key-ink)"}
                        aria-hidden
                      >
                        {comp}
                      </text>
                    )}
                    {showName && (
                      <text
                        x={k.cx}
                        y={k.black ? Y0 + k.height - 6 : bottom - 8}
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                        fontWeight={600}
                        fontSize={k.black ? 5.5 : 8}
                        fill={k.black ? "var(--key-white)" : "var(--key-ink)"}
                        aria-hidden
                      >
                        {noteName(k.midi, noteNames, naming, !k.black && k.midi % 12 === 0)}
                      </text>
                    )}

                  </g>
                );
              })}


              {/* Segunda passada: marcadores, mãos, feedback e foco por cima de todas as teclas */}
              <g pointerEvents="none">
                {keys.map((k) => {
                  const st = stateOf(k.midi);
                  const m = markerBy.get(k.midi);
                  const kind: MarkerKind | undefined = st === "missed" ? "ghost" : m?.kind;
                  const markLabel = m ? (m.label ?? (m.finger ? String(m.finger) : undefined)) : undefined;
                  const mcy = k.black ? Y0 + k.height - 22 : Y0 + 88;
                  const mr = k.black ? 7.5 : 9.5;
                  return (
                    <g key={k.midi}>
                      {kind && (
                        <MarkerGlyph kind={kind} cx={k.cx} cy={mcy} r={mr} label={markLabel} surface={k.black ? "key-black" : "key-white"} hatchId={`${uid}-h`} />
                      )}
                      {m?.hand && kind && (
                        <HandTag hand={m.hand} letter={s.handLetter[m.hand]} cx={k.cx} cy={k.black ? mcy - mr - 7 : mcy + mr + 8} />
                      )}
                      {st &&
                        (kind ? (
                          <FeedbackBadge state={st} cx={k.cx + mr * 0.85} cy={mcy - mr * 0.85} r={5.5} />
                        ) : (
                          <FeedbackBadge state={st} cx={k.cx} cy={mcy} r={k.black ? 6.5 : 8} />
                        ))}
                    </g>
                  );
                })}
                {ring !== null && byMidi.get(ring) && (() => {
                  const k = byMidi.get(ring)!;
                  return (
                    <>
                      <rect x={k.x - 1.5} y={Y0 - 1.5} width={k.width + 3} height={k.height + 3} rx={3} fill="none" stroke="var(--marker-ring)" strokeWidth={4.5} />
                      <rect x={k.x - 1.5} y={Y0 - 1.5} width={k.width + 3} height={k.height + 3} rx={3} fill="none" stroke="var(--focus)" strokeWidth={2.5} />
                    </>
                  );
                })()}
              </g>
              {/* Tampa em laca com reflexo do verniz e a faixa de feltro: por cima do topo das teclas */}
              <rect x={-CHEEK} y={0} width={totalW} height={LID} rx={4} fill="var(--case)" pointerEvents="none" />
              <rect x={-CHEEK + 4} y={3} width={totalW - 8} height={1.2} rx={0.6} fill="var(--case-shine)" pointerEvents="none" />
              <rect x={-CHEEK} y={LID} width={totalW} height={FELT} fill="var(--felt)" pointerEvents="none" />
            </svg>
          </div>

          {middleCVisible && byMidi.get(MIDDLE_C) && (
            <div className="relative h-5" aria-hidden>
              <span
                className="absolute top-0.5 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] font-semibold leading-4 text-muted"
                style={{ left: `${xOf(byMidi.get(MIDDLE_C)!.cx)}%` }}
              >
                ▲ {s.middleC}
              </span>
            </div>
          )}

          {zoneRow(zonesLeft, "below")}
        </div>
      </div>

      {feedback !== "off" && (counts.hit + counts.wrong + counts.missed > 0) && (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-fg" aria-live="polite">
          {counts.hit > 0 && (
            <span className="inline-flex items-center gap-1 text-good" aria-hidden>
              <Check className="size-4" strokeWidth={3} /> {s.count.hit(counts.hit)}
            </span>
          )}
          {counts.wrong > 0 && (
            <span className="inline-flex items-center gap-1 text-bad" aria-hidden>
              <X className="size-4" strokeWidth={3} /> {s.count.wrong(counts.wrong)}
            </span>
          )}
          {counts.missed > 0 && (
            <span className="inline-flex items-center gap-1 text-muted" aria-hidden>
              <span className="inline-block size-3.5 rounded-full border-2 border-dashed border-current" /> {s.count.missed(counts.missed)}
            </span>
          )}
          <span className="sr-only">{s.summary(counts.hit, counts.wrong, counts.missed)}</span>
        </p>
      )}

      {(compact || size === "touch") && (
        <p className="hidden items-center gap-2 text-sm text-muted portrait:max-sm:flex">
          <RotateCw className="size-4 shrink-0" aria-hidden />
          {s.rotateHint}
        </p>
      )}
    </div>
  );
}
