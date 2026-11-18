// Agenda uma sequência curta (até ~1 min) de sons e avisos para a interface.
import { audio } from "../../app/audio";

export type SeqEvent = {
  /** segundos desde o início */
  t: number;
  sound?: (when: number) => void;
  ui?: () => void;
};

/** Toca a sequência; com `loop`, recomeça ao terminar. Devolve a função de parar. */
export function runSequence(events: SeqEvent[], length: number, opts: { loop?: boolean; onEnd?: () => void } = {}): () => void {
  let stopped = false;
  let timers: number[] = [];
  const play = () => {
    const c = audio();
    const t0 = c.currentTime + 0.1;
    for (const e of events) {
      e.sound?.(t0 + e.t);
      if (e.ui) timers.push(window.setTimeout(() => !stopped && e.ui!(), (e.t + 0.1) * 1000));
    }
    timers.push(
      window.setTimeout(() => {
        if (stopped) return;
        timers = [];
        if (opts.loop) play();
        else opts.onEnd?.();
      }, (length + 0.1) * 1000),
    );
  };
  play();
  return () => {
    stopped = true;
    timers.forEach((t) => window.clearTimeout(t));
    timers = [];
  };
}
