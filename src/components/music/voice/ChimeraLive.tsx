// src/components/music/voice/ChimeraLive.tsx
// A ponte entre a Pauta e o Chimera de verdade (src/vendor/chimera).
// Carrega o motor (wasm) e as vistas originais só quando é montado, e entrega
// para quem usa: as vistas 2D/3D do Chimera, o store dele e o GuideState.
import * as React from "react";
import type { GuideState, VoiceBody } from "../../../lib/voice";
import "../../../vendor/chimera/pauta-views.css";

type Mods = {
  useStore: typeof import("../../../vendor/chimera/ui/store").useStore;
  AnatomyView: typeof import("../../../vendor/chimera/ui/components/AnatomyView").AnatomyView;
  AnatomyView3D: typeof import("../../../vendor/chimera/ui/components/AnatomyView3D").AnatomyView3D;
  engine: typeof import("../../../vendor/chimera/audio/AudioEngine").engine;
  getModel: typeof import("../../../vendor/chimera/ui/useModel").getModel;
};

let loading: Promise<Mods> | null = null;

/**
 * O Chimera na cor do canto da Pauta. No original o corpo é azul; aqui o azul vira o rosa do
 * curso de canto. O âmbar (som) continua, porque é a cor da voz-guia em todos os gráficos.
 * O slot rosa dos controles vira lilás, para não confundir com o corpo.
 * Para voltar ao original: troque PAUTA_PALETTE por null.
 */
const PAUTA_PALETTE: Record<string, string> | null = {
  blue: "#f47cc0", // corpo e estrutura (era #4fb6f2)
  blueMid: "#c4559a", // (era #3487c4)
  blueDim: "#8a3a6c", // (era #1f5f8c)
  frame: "#4a1d3a", // (era #133954)
  pink: "#b9a4ff", // slot de controle (era #ff73cf)
};

function applyPautaPalette(colors: typeof import("../../../vendor/chimera/ui/colors")) {
  if (!PAUTA_PALETTE) return;
  const V = colors.V as Record<string, string>;
  const old = { ...V };
  Object.assign(V, PAUTA_PALETTE);
  // o que colors.ts já tinha derivado da paleta antiga
  const slots = colors.SLOTS as unknown as string[];
  slots.forEach((c, i) => {
    const k = Object.keys(old).find((key) => old[key] === c);
    if (k) slots[i] = V[k];
  });
  const C = colors.C as Record<string, string>;
  for (const key of Object.keys(C)) {
    const k = Object.keys(old).find((o) => old[o] === C[key]);
    if (k) C[key] = V[k];
  }
}

/** Carrega o Chimera uma vez (o motor precisa estar pronto antes dos módulos da interface). */
export function loadChimera(): Promise<Mods> {
  if (loading) return loading;
  loading = (async () => {
    const { initChimera } = await import("../../../vendor/chimera/wasm/chimera");
    await initChimera();
    // A paleta tem que mudar ANTES de qualquer vista do Chimera ser importada.
    applyPautaPalette(await import("../../../vendor/chimera/ui/colors"));
    const [store, a2, a3, eng, model] = await Promise.all([
      import("../../../vendor/chimera/ui/store"),
      import("../../../vendor/chimera/ui/components/AnatomyView"),
      import("../../../vendor/chimera/ui/components/AnatomyView3D"),
      import("../../../vendor/chimera/audio/AudioEngine"),
      import("../../../vendor/chimera/ui/useModel"),
    ]);
    if (import.meta.env.DEV) (window as unknown as { __chimera: unknown }).__chimera = { store: store.useStore, engine: eng.engine };
    return { useStore: store.useStore, AnatomyView: a2.AnatomyView, AnatomyView3D: a3.AnatomyView3D, engine: eng.engine, getModel: model.getModel };
  })();
  loading.catch(() => (loading = null));
  return loading;
}

export function useChimera(): { mods: Mods | null; error: string | null; retry: () => void } {
  const [mods, setMods] = React.useState<Mods | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [attempt, setAttempt] = React.useState(0);
  React.useEffect(() => {
    let alive = true;
    setError(null);
    loadChimera().then(
      (m) => alive && setMods(m),
      (e) => alive && setError(e instanceof Error ? e.message : String(e)),
    );
    return () => {
      alive = false;
    };
  }, [attempt]);
  return { mods, error, retry: () => setAttempt((n) => n + 1) };
}

/* Quantos monitores do Chimera estão visíveis na página agora (a janelinha flutuante
   não abre sozinha quando já tem um na tela). */
const visibleHeads = new Set<object>();
const visListeners = new Set<() => void>();
export function useInlineHeadVisible(): boolean {
  return React.useSyncExternalStore(
    (l) => {
      visListeners.add(l);
      return () => visListeners.delete(l);
    },
    () => visibleHeads.size > 0,
    () => false,
  );
}

/* ── Objetos de cena: o canudo, a vibração dos lábios, o ar pelo nariz ── */

export type ChimeraProp = "straw" | "trill" | "hum" | null;
let prop: ChimeraProp = null;
let propSince = 0;
/** Mostra (ou tira) um objeto na boca do Chimera, nas duas vistas. */
export function setChimeraProp(p: ChimeraProp) {
  prop = p;
  propSince = performance.now();
}

type Pt = { x: number; y: number };
type View = { X(p: Pt): number; Y(p: Pt): number; readonly pxPerCm: number };
type Frame = { upperLip: Pt[]; lowerLip: Pt[]; nasalCavity: Pt[] };

const STRAW = "#eef6f8";
const AIR = "#ffb340";

function stroke(ctx: CanvasRenderingContext2D, color: string, width: number, alpha: number, draw: () => void) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  draw();
  ctx.stroke();
  ctx.restore();
}

/** Desenha o objeto de cena por cima da cabeça (OverlayFn do Chimera). */
function drawProp(ctx: CanvasRenderingContext2D, r: View, _m: unknown, f: Frame) {
  if (!prop || !f?.upperLip?.length) return;
  const t = (performance.now() - propSince) / 1000;
  const fade = Math.min(1, t / 0.25);
  const lip = { x: (f.upperLip[6].x + f.lowerLip[6].x) / 2, y: (f.upperLip[6].y + f.lowerLip[6].y) / 2 };
  const px = r.pxPerCm;
  const x0 = r.X(lip), y0 = r.Y(lip);
  if (prop === "straw") {
    // canudo fino: 9 cm para a frente, um pouco para baixo, saindo do meio dos lábios
    const len = 9 * px, d = 0.55 * px, tilt = 0.12;
    const x1 = x0 - 0.6 * px, y1 = y0;
    const x2 = x1 + len, y2 = y1 + len * tilt;
    stroke(ctx, STRAW, 1.6, 0.95 * fade, () => {
      ctx.moveTo(x1, y1 - d / 2);
      ctx.lineTo(x2, y2 - d / 2);
      ctx.moveTo(x1, y1 + d / 2);
      ctx.lineTo(x2, y2 + d / 2);
      ctx.moveTo(x2, y2 - d / 2);
      ctx.lineTo(x2, y2 + d / 2);
    });
    // o ar saindo pela ponta, em âmbar (som)
    for (let i = 0; i < 3; i++) {
      const k = ((t * 1.4 + i / 3) % 1);
      stroke(ctx, AIR, 1.4, (1 - k) * 0.8 * fade, () => {
        const ax = x2 + (0.6 + k * 2.2) * px, ay = y2 + k * 0.3 * px;
        ctx.arc(ax, ay, (0.3 + k * 0.9) * px, -0.9, 0.9);
      });
    }
  } else if (prop === "trill") {
    // lábios soltos e encostados; o AR passa e faz a frente deles tremer sozinha, muito rápido
    const flap = Math.sin(t * 2 * Math.PI * 23) * 0.22 * px; // ~23 vezes por segundo
    const lipCurve = (pts: Pt[], dir: number) =>
      stroke(ctx, STRAW, 2, 0.9 * fade, () => {
        pts.slice(3, 10).forEach((p, i) => {
          const k = i / 6; // a ponta treme mais que o canto da boca
          const x = r.X(p), y = r.Y(p) + dir * flap * k;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
      });
    lipCurve(f.upperLip, -1);
    lipCurve(f.lowerLip, 1);
    // os sopros de ar saindo entre os lábios, em âmbar
    for (let i = 0; i < 5; i++) {
      const k = (t * 2.2 + i / 5) % 1;
      stroke(ctx, AIR, 1.3, (1 - k) * 0.85 * fade, () => {
        const ax = x0 + (0.4 + k * 3.2) * px, ay = y0 + Math.sin((t + i) * 40) * 0.12 * px;
        ctx.arc(ax, ay, (0.25 + k * 0.7) * px, -0.9, 0.9);
      });
    }
    // seta "ar" chegando por trás dos lábios
    ctx.save();
    ctx.globalAlpha = 0.8 * fade;
    ctx.fillStyle = AIR;
    ctx.font = `${Math.max(11, 0.75 * px)}px Hershey, ui-monospace, monospace`;
    ctx.fillText("AR", x0 + 0.8 * px, y0 - 1.6 * px);
    ctx.restore();
  } else if (prop === "hum") {
    // boca fechada: o som sai pelo nariz
    const nose = f.nasalCavity?.length ? f.nasalCavity.reduce((a, b) => (b.x > a.x ? b : a)) : { x: lip.x, y: lip.y + 2.5 };
    const nx = r.X(nose) + 0.8 * px, ny = r.Y(nose);
    for (let i = 0; i < 3; i++) {
      const k = ((t * 1.2 + i / 3) % 1);
      stroke(ctx, AIR, 1.4, (1 - k) * 0.85 * fade, () => {
        ctx.arc(nx + k * 2.4 * px, ny, (0.4 + k * 1.1) * px, -0.8, 0.8);
      });
    }
  }
}

/** A vista original do Chimera: o corte 2D ou a cabeça 3D. `inline`: é um monitor da aula (conta como visível). */
export function ChimeraHead({ mods, view, inline = true, className }: { mods: Mods; view: "2d" | "3d"; inline?: boolean; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!inline || !el) return;
    const key = {};
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio > 0.4) visibleHeads.add(key);
      else visibleHeads.delete(key);
      visListeners.forEach((l) => l());
    }, { threshold: [0, 0.4, 1] });
    io.observe(el);
    return () => {
      io.disconnect();
      visibleHeads.delete(key);
      visListeners.forEach((l) => l());
    };
  }, [inline]);
  // Sem os números do Chimera (formantes, medidas): na aula só a cabeça importa.
  return (
    <div ref={ref} className={className ?? "chimera-views absolute inset-x-0 bottom-0 top-10"}>
      {view === "3d" ? (
        <mods.AnatomyView3D readouts={false} overlay={drawProp as never} />
      ) : (
        <mods.AnatomyView bare overlay={drawProp as never} />
      )}
    </div>
  );
}

/** O estado do Chimera no formato da Pauta (GuideState), lido a cada quadro. */
export function useGuideState(mods: Mods | null): GuideState {
  // assinatura manual (os hooks não podem depender de `mods` existir)
  const [snap, setSnap] = React.useState<{ started: boolean; held: number[]; hold: boolean }>({ started: false, held: [], hold: false });
  React.useEffect(() => {
    if (!mods) return;
    const read = () => {
      const s = mods.useStore.getState();
      setSnap((p) => (p.started === s.started && p.held === s.heldNotes && p.hold === s.hold ? p : { started: s.started, held: s.heldNotes, hold: s.hold }));
    };
    read();
    return mods.useStore.subscribe(read);
  }, [mods]);
  const { started, held, hold } = snap;
  const [level, setLevel] = React.useState(0);
  const singing = held.length > 0 || hold;
  React.useEffect(() => {
    if (!mods || !singing) return setLevel(0);
    let raf = 0;
    const tick = () => {
      setLevel(Math.min(1, mods.engine.level() * 6));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mods, singing]);
  if (!mods) return { status: "loading" };
  if (!started) return { status: "no-audio" };
  if (singing) return { status: "singing", midi: held[held.length - 1], level };
  return { status: "idle" };
}

export type { Mods as ChimeraModules, VoiceBody };
