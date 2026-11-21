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

/** A vista original do Chimera: o corte 2D ou a cabeça 3D. */
export function ChimeraHead({ mods, view }: { mods: Mods; view: "2d" | "3d" }) {
  const Face = view === "3d" ? mods.AnatomyView3D : mods.AnatomyView;
  return (
    <div className="chimera-views absolute inset-x-0 bottom-0 top-12">
      <Face />
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
