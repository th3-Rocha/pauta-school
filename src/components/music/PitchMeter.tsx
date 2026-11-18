// src/components/music/PitchMeter.tsx
import { Mic, MicOff, Check, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../../lib/cn";
import { clamp } from "../../lib/music";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { Button } from "../ui/Button";
import { Panel } from "./controls";

export type MicPermission = "prompt" | "granted" | "denied" | "unsupported";

export type PitchMeterProps = {
  /** note: toque a nota alvo · bend: confira se o bend chegou na nota alvo */
  mode?: "note" | "bend";
  permission: MicPermission;
  onRequestPermission?: () => void;
  /** Nota alvo, ex.: "A4". */
  target: string;
  /** Texto auxiliar do alvo, ex.: "bend de 1 tom a partir de G4". */
  targetHint?: string;
  /** Nota detectada, ex.: "A4". null = silêncio. */
  detected?: string | null;
  /** Desvio em cents em relação ao alvo (−50 a +50; valores maiores ficam no limite). */
  cents?: number | null;
  /** Zona de acerto em cents (±). Padrão 10. */
  tolerance?: number;
  strings?: Partial<Strings["pitch"]>;
  className?: string;
};

const ARC = 58; // graus para cada lado

export function PitchMeter({
  mode = "note",
  permission,
  onRequestPermission,
  target,
  targetHint,
  detected,
  cents,
  tolerance = 10,
  strings: stringsOverride,
  className,
}: PitchMeterProps) {
  const s = { ...defaultStrings.pitch, ...stringsOverride };

  if (permission !== "granted") {
    const denied = permission === "denied";
    const unsupported = permission === "unsupported";
    return (
      <Panel label={s.modes[mode]} data-slot="pitch-meter" className={className}>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <span className={cn("flex size-16 items-center justify-center rounded-full border-2", denied || unsupported ? "border-bad text-bad" : "border-accent text-accent")}>
            {denied || unsupported ? <MicOff className="size-7" aria-hidden /> : <Mic className="size-7" aria-hidden />}
          </span>
          <p className="font-display text-xl font-bold text-fg">{unsupported ? s.deniedTitle : denied ? s.deniedTitle : s.allowTitle}</p>
          <p className="max-w-sm text-base text-muted">{unsupported ? s.unsupported : denied ? s.deniedBody : s.allowBody}</p>
          {permission === "prompt" && (
            <Button size="lg" onClick={onRequestPermission}>
              <Mic aria-hidden />
              {s.allow}
            </Button>
          )}
        </div>
      </Panel>
    );
  }

  const hasPitch = detected != null && cents != null;
  const c = hasPitch ? clamp(cents!, -50, 50) : 0;
  const inZone = hasPitch && Math.abs(c) <= tolerance;
  const angle = (c / 50) * ARC;

  let status = s.nothing;
  let StatusIcon: typeof Check | null = null;
  if (hasPitch) {
    if (inZone) {
      status = s.inTune;
      StatusIcon = Check;
    } else if (mode === "bend") {
      status = c < 0 ? s.bendShort : s.bendOver;
      StatusIcon = c < 0 ? ArrowUp : ArrowDown;
    } else {
      status = c > 0 ? s.sharp : s.flat;
      StatusIcon = c > 0 ? ArrowDown : ArrowUp;
    }
  }

  // Geometria do mostrador
  const W = 280;
  const cx = W / 2;
  const cy = 150;
  const R = 118;
  const pt = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const arc = (d0: number, d1: number, r: number) => {
    const [x0, y0] = pt(d0, r);
    const [x1, y1] = pt(d1, r);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  const zoneDeg = (tolerance / 50) * ARC;

  return (
    <Panel label={s.modes[mode]} data-slot="pitch-meter" className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="panel-label text-muted">{s.target}</p>
          <p className="font-mono text-4xl font-bold leading-none text-fg">{target}</p>
          {targetHint && <p className="mt-1 text-sm text-muted">{targetHint}</p>}
        </div>
        <div className="text-right">
          <p className="panel-label text-muted">{s.detected}</p>
          <p className={cn("font-mono text-4xl font-bold leading-none", hasPitch ? (inZone ? "text-good" : "text-fg") : "text-muted")}>{hasPitch ? detected : "—"}</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[320px]">
        <svg viewBox={`0 0 ${W} 172`} className="w-full" role="img" aria-label={hasPitch ? `${status}, ${s.cents(Math.round(c))}` : status}>
          <path d={arc(-ARC, ARC, R)} fill="none" stroke="var(--surface-2)" strokeWidth={22} strokeLinecap="butt" />
          <path d={arc(-zoneDeg, zoneDeg, R)} fill="none" stroke="var(--good)" strokeWidth={22} />
          {Array.from({ length: 11 }, (_, i) => {
            const v = -50 + i * 10;
            const d = (v / 50) * ARC;
            const [x0, y0] = pt(d, R - 16);
            const [x1, y1] = pt(d, R + (v === 0 ? 18 : 12));
            const [tx, ty] = pt(d, R + 28);
            return (
              <g key={v}>
                <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={v === 0 ? "var(--fg)" : "var(--line-strong)"} strokeWidth={v === 0 ? 3 : 1.5} />
                {v % 25 === 0 || v === 0 || Math.abs(v) === 50 ? (
                  <text x={tx} y={ty} dy="0.35em" textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fill="var(--muted)">
                    {v > 0 ? `+${v}` : v}
                  </text>
                ) : null}
              </g>
            );
          })}
          <g
            style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: "transform var(--dur-base) var(--ease-out)" }}
            opacity={hasPitch ? 1 : 0.35}
          >
            <line x1={cx} y1={cy} x2={cx} y2={cy - R - 6} stroke={inZone ? "var(--good)" : "var(--fg)"} strokeWidth={4} strokeLinecap="round" />
          </g>
          <circle cx={cx} cy={cy} r={10} fill="var(--fret)" stroke="var(--marker-ring)" strokeWidth={2} />
        </svg>
      </div>

      <p
        aria-live="polite"
        className={cn(
          "flex items-center justify-center gap-2 text-center text-xl font-bold",
          !hasPitch ? "text-muted" : inZone ? "text-good" : "text-warn",
        )}
      >
        {StatusIcon && <StatusIcon className="size-6" strokeWidth={3} aria-hidden />}
        {status}
        {hasPitch && <span className="font-mono text-base font-semibold text-muted">{s.cents(Math.round(c))}</span>}
      </p>
    </Panel>
  );
}
