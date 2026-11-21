// src/components/music/voice/ChimeraCameo.tsx
// A aparição pequena do Chimera, num canto, com um balão de uma frase.
//
// REGRA DE FREQUÊNCIA (o app decide `open`; o componente só obedece)
// - Aparece só em momentos especiais: primeira nota afinada, marco do mês
//   (MilestoneCard vencido), sequência de 7, 30, 100 dias, aula concluída depois
//   de uma pausa longa, e na abertura do curso (dia 1).
// - No máximo UMA vez por bloco da aula e TRÊS por aula; nunca dois dias seguidos
//   pelo mesmo motivo; nunca durante "sua vez" (o aluno cantando) nem no meio de
//   um exercício cronometrado.
// - Nunca cobre o exercício: fica num canto, fora da área do exercício; no celular,
//   acima da barra inferior, e some se o exercício precisar do espaço.
// - Nunca toca som sozinho: canta uma nota curta SÓ quando o aluno toca nele
//   (`onTouch`). Carinho (arrastar o ponteiro em cima da cabeça) chama `onPet`:
//   o Chimera fecha os olhos e solta coraçõezinhos. É o segredo à vista.
// - Sempre pode ser fechado (botão de 44px, Esc). Fechado, não volta no mesmo bloco.
// - Some sozinho depois de `autoHideMs` (padrão 8 s) se ninguém interagir.
// - Com `prefers-reduced-motion`, entra sem animação e os corações não sobem.
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../../lib/strings";
import type { GuideState } from "../../../lib/voice";
import { ChimeraStage } from "./ChimeraStage";

export type ChimeraCameoProps = {
  open: boolean;
  /** Uma frase: "Primeira nota afinada!" */
  message: string;
  onClose: () => void;
  /** O aluno tocou: o app faz o Chimera cantar uma nota curta. */
  onTouch?: () => void;
  /** Carinho na cabeça: o app liga os olhos fechados e os coraçõezinhos do Chimera. */
  onPet?: () => void;
  guide?: GuideState;
  /** A cabeça (ou o HeadPlaceholder). */
  children?: React.ReactNode;
  corner?: "bottom-right" | "bottom-left" | "top-right";
  /** `fixed` na página ou `absolute` dentro de um contêiner relativo. */
  position?: "fixed" | "absolute";
  autoHideMs?: number;
  strings?: Partial<Strings["chimera"]>;
  className?: string;
};

const PET_DISTANCE = 140; // px de "carinho" em até 1,2 s

export function ChimeraCameo({
  open,
  message,
  onClose,
  onTouch,
  onPet,
  guide = { status: "idle" },
  children,
  corner = "bottom-right",
  position = "fixed",
  autoHideMs = 8000,
  strings: stringsOverride,
  className,
}: ChimeraCameoProps) {
  const s = { ...defaultStrings.chimera, ...stringsOverride };
  const [hearts, setHearts] = React.useState(0);
  const pet = React.useRef({ dist: 0, start: 0, lastX: 0, lastY: 0, moved: 0 });
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    if (!open || hover || !autoHideMs) return;
    const t = setTimeout(onClose, autoHideMs);
    return () => clearTimeout(t);
  }, [open, hover, autoHideMs, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);

  if (!open) return null;

  const onMove = (e: React.PointerEvent) => {
    const p = pet.current;
    const now = performance.now();
    if (now - p.start > 1200) { p.dist = 0; p.start = now; }
    if (p.lastX) p.dist += Math.hypot(e.clientX - p.lastX, e.clientY - p.lastY);
    p.moved += p.lastX ? Math.hypot(e.clientX - p.lastX, e.clientY - p.lastY) : 0;
    p.lastX = e.clientX;
    p.lastY = e.clientY;
    if (p.dist > PET_DISTANCE) {
      p.dist = 0;
      p.start = now;
      setHearts((h) => h + 1);
      onPet?.();
    }
  };

  const place = corner === "bottom-left" ? "bottom-4 left-4 items-start" : corner === "top-right" ? "top-4 right-4 items-end" : "bottom-4 right-4 items-end";

  return (
    <aside
      data-slot="chimera-cameo"
      aria-live="polite"
      className={cn(position, "z-40 flex max-w-[min(20rem,calc(100vw-2rem))] flex-col gap-2 motion-safe:animate-cameo-in", place, className)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => { setHover(false); pet.current.lastX = 0; }}
    >
      <div className="relative flex items-start gap-2 rounded-md border border-line bg-surface p-3 pr-12 shadow-lg">
        <p className="text-base font-semibold text-fg">{message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label={s.cameo.close}
          className="absolute right-0 top-0 inline-flex size-11 items-center justify-center rounded-md text-muted hover:text-fg focus-ring"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      <div className="relative">
        <button
          type="button"
          aria-label={`${s.cameo.touch}. ${s.cameo.pet}.`}
          title={s.credit}
          className="block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          onPointerDown={() => { pet.current.moved = 0; }}
          onPointerMove={onMove}
          onClick={() => { if (pet.current.moved < 12) onTouch?.(); }}
        >
          <span className="block rounded-full bg-[var(--stage-frame)] p-1 shadow-md">
            <ChimeraStage size="cameo" guide={guide}>
              {children}
            </ChimeraStage>
          </span>
        </button>
        {/* coraçõezinhos: um punhado a cada carinho */}
        {hearts > 0 && (
          <span key={hearts} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
            {[-14, 0, 14].map((dx, i) => (
              <svg
                key={i}
                viewBox="-6 -6 12 12"
                className="absolute size-4 opacity-0 motion-safe:animate-heart-up motion-reduce:opacity-100"
                style={{ ["--hx" as string]: `${dx}px`, animationDelay: `${i * 120}ms`, left: `calc(50% + ${dx / 2}px - 8px)` }}
              >
                <path d="M0 4 C-5 0 -3 -6 0 -2 C3 -6 5 0 0 4 Z" fill="none" stroke="var(--voice-guide)" strokeWidth={1.4} />
              </svg>
            ))}
          </span>
        )}
      </div>
    </aside>
  );
}
