// src/components/music/keyboard/GrandStaffFrame.tsx
// Moldura da partitura em sistema duplo. Estende o ScoreFrame: os mesmos
// controles (tocar, velocidade, loop, metrônomo, contagem) + mão isolada e
// rótulos das claves para iniciante. O desenho continua vindo do alphaTab.
import * as React from "react";
import { Tags } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import type { Hand } from "../../../lib/piano";
import { ToggleGroup, ToggleGroupItem } from "../../ui/ToggleGroup";
import { LedToggle } from "../controls";
import { ScoreFrame, type ScoreFrameProps } from "../ScoreFrame";

export type HandsMode = "both" | Hand;
export type OtherHandMode = "background" | "muted";

export type GrandStaffFrameProps = Omit<ScoreFrameProps, "extraControls" | "strings"> & {
  hands: HandsMode;
  onHandsChange: (hands: HandsMode) => void;
  /** Com uma mão isolada, a outra toca baixinho de fundo ou fica muda. */
  otherHand: OtherHandMode;
  onOtherHandChange: (mode: OtherHandMode) => void;
  /** "Clave de sol: mão direita" / "Clave de fá: mão esquerda" à esquerda da pauta. */
  showClefLabels: boolean;
  onShowClefLabelsChange?: (show: boolean) => void;
  /**
   * Altura (em % da área da partitura) do centro de cada pauta, para alinhar os rótulos
   * ao desenho do alphaTab. Padrão: 30% e 72%.
   */
  clefLabelPositions?: { treble: number; bass: number };
  strings?: Partial<Strings["score"]>;
  grandStaffStrings?: Partial<Strings["grandStaff"]>;
  keyboardStrings?: Partial<Strings["keyboard"]>;
};

function HandLetter({ hand, letter }: { hand: Hand; letter: string }) {
  return (
    <span
      aria-hidden
      className="inline-flex size-4 items-center justify-center rounded-[2px] font-mono text-[10px] font-extrabold text-on-deg ring-1 ring-marker-ring"
      style={{ background: hand === "right" ? "var(--hand-right)" : "var(--hand-left)" }}
    >
      {letter}
    </span>
  );
}

export function GrandStaffFrame({
  hands,
  onHandsChange,
  otherHand,
  onOtherHandChange,
  showClefLabels,
  onShowClefLabelsChange,
  clefLabelPositions = { treble: 30, bass: 72 },
  children,
  strings: scoreStrings,
  grandStaffStrings,
  keyboardStrings,
  disabled,
  title,
  ...props
}: GrandStaffFrameProps) {
  const g = { ...defaultStrings.grandStaff, ...grandStaffStrings };
  const ks = { ...defaultStrings.keyboard, ...keyboardStrings };
  const isolated = hands !== "both";
  const id = React.useId();

  const clefChip = (hand: Hand, clef: string, hint: string, top: number) => (
    <div
      className="absolute left-0 -translate-y-1/2 rounded-xs border border-line-strong bg-surface px-1.5 py-1 text-xs leading-4 shadow-sm"
      style={{ top: `${top}%` }}
    >
      <span className="flex items-center gap-1 font-semibold text-fg">
        <HandLetter hand={hand} letter={ks.handLetter[hand]} />
        {clef}
      </span>
      <span className="block text-muted">{hint}</span>
    </div>
  );

  return (
    <ScoreFrame
      {...props}
      title={title ?? g.label}
      disabled={disabled}
      strings={scoreStrings}
      extraControls={
        <>
          <div className="flex items-center gap-2">
            <span className="panel-label text-muted" id={`${id}-hands`}>
              {g.hands}
            </span>
            <ToggleGroup
              type="single"
              size="sm"
              value={hands}
              onValueChange={(v) => v && onHandsChange(v as HandsMode)}
              aria-labelledby={`${id}-hands`}
              disabled={disabled}
            >
              <ToggleGroupItem value="both" aria-label={g.bothAria}>
                {g.both}
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label={g.rightOnlyAria}>
                <HandLetter hand="right" letter={ks.handLetter.right} />
                {g.rightOnly}
              </ToggleGroupItem>
              <ToggleGroupItem value="left" aria-label={g.leftOnlyAria}>
                <HandLetter hand="left" letter={ks.handLetter.left} />
                {g.leftOnly}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className={cn("flex items-center gap-2", !isolated && "opacity-45")}>
            <span className="panel-label text-muted" id={`${id}-other`}>
              {g.otherHand}
            </span>
            <ToggleGroup
              type="single"
              size="sm"
              value={otherHand}
              onValueChange={(v) => v && onOtherHandChange(v as OtherHandMode)}
              aria-labelledby={`${id}-other`}
              disabled={disabled || !isolated}
            >
              <ToggleGroupItem value="background" aria-label={g.otherBackgroundAria}>
                {g.otherBackground}
              </ToggleGroupItem>
              <ToggleGroupItem value="muted" aria-label={g.otherMutedAria}>
                {g.otherMuted}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {onShowClefLabelsChange && (
            <LedToggle
              pressed={showClefLabels}
              onPressedChange={onShowClefLabelsChange}
              icon={<Tags aria-hidden />}
              disabled={disabled}
              className="h-9 sm:ml-auto"
            >
              {g.clefLabels}
            </LedToggle>
          )}
        </>
      }
    >
      <div className="relative flex min-h-[inherit]">
        {showClefLabels && (
          <div className="relative w-28 shrink-0" aria-label={`${g.treble}: ${g.trebleHint}. ${g.bass}: ${g.bassHint}.`} role="note">
            {clefChip("right", g.treble, g.trebleHint, clefLabelPositions.treble)}
            {clefChip("left", g.bass, g.bassHint, clefLabelPositions.bass)}
          </div>
        )}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </ScoreFrame>
  );
}
