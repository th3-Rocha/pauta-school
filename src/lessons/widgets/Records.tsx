// Minuto de trocas e registro do BPM do desafio.
import * as React from "react";
import { Plus, RotateCcw, Timer, Trophy } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Input";
import { audio, tick } from "../../app/audio";
import { update, useProgress } from "../../app/progress";

const recKey = (id: string) => `trastes:rec:${id}`;
function readRec(id: string): number {
  try {
    return Number(localStorage.getItem(recKey(id)) ?? 0) || 0;
  } catch {
    return 0;
  }
}

/** Um minuto contando quantas trocas limpas você faz. Guarda o recorde neste navegador. */
export function MinuteChallenge({ id, label }: { id: string; label: string }) {
  const [left, setLeft] = React.useState(60);
  const [running, setRunning] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [best, setBest] = React.useState(0);
  React.useEffect(() => setBest(readRec(id)), [id]);

  React.useEffect(() => {
    if (!running) return;
    const t0 = Date.now();
    const iv = window.setInterval(() => {
      const l = 60 - Math.floor((Date.now() - t0) / 1000);
      setLeft(Math.max(0, l));
      if (l <= 0) {
        window.clearInterval(iv);
        setRunning(false);
        tick(audio().currentTime + 0.02, true);
      }
    }, 200);
    return () => window.clearInterval(iv);
  }, [running]);

  React.useEffect(() => {
    if (!running && left === 0 && count > best) {
      setBest(count);
      try {
        localStorage.setItem(recKey(id), String(count));
      } catch {
        /* sem armazenamento */
      }
    }
  }, [running, left, count, best, id]);

  const startTimer = () => {
    setCount(0);
    setLeft(60);
    setRunning(true);
    tick(audio().currentTime + 0.02, true);
  };

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 shadow-md sm:p-5" aria-label="Minuto de trocas">
      <header className="flex items-center justify-between gap-2">
        <h3 className="panel-label inline-flex items-center gap-1.5 text-muted">
          <Timer className="size-4" aria-hidden />
          Minuto de trocas
        </h3>
        <span className="inline-flex items-center gap-1.5 font-mono text-sm text-muted">
          <Trophy className="size-4 text-warn" aria-hidden />
          Recorde: <strong className="text-fg">{best}</strong>
        </span>
      </header>
      <p className="text-base text-fg">{label}</p>
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-mono text-5xl font-bold text-fg" aria-live="off">
          0:{String(left).padStart(2, "0")}
        </span>
        <span className="font-mono text-5xl font-bold text-accent" aria-live="polite">
          {count}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {running ? (
          <Button size="lg" onClick={() => setCount((c) => c + 1)} className="min-w-40">
            <Plus aria-hidden />
            Troquei
          </Button>
        ) : (
          <Button size="lg" onClick={startTimer}>
            {left === 0 ? <RotateCcw aria-hidden /> : <Timer aria-hidden />}
            {left === 0 ? "De novo" : "Começar o minuto"}
          </Button>
        )}
      </div>
      <p className="text-sm text-muted">Toque em "Troquei" a cada troca que soou limpa. Conte só as limpas.</p>
    </section>
  );
}

/** Registra o melhor BPM tocado limpo no desafio do mês (vai no código de progresso). */
export function BpmLog({ month, target }: { month: number; target: number }) {
  const p = useProgress();
  const best = p.bestBpm[month] ?? 0;
  const [value, setValue] = React.useState("");
  const n = Number(value);
  const valid = Number.isInteger(n) && n >= 30 && n <= 250;
  return (
    <section className="flex flex-col gap-3 rounded-lg border-2 border-warn bg-surface p-4 sm:p-5" aria-label="Registrar o desafio">
      <h3 className="panel-label text-warn">Registrar o desafio</h3>
      <p className="text-base text-fg">
        Meta: <strong className="font-mono">{target} BPM</strong> sem parar.{" "}
        {best > 0 && (
          <>
            Seu melhor até agora: <strong className={best >= target ? "font-mono text-good" : "font-mono"}>{best} BPM</strong>.
          </>
        )}
      </p>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          update((pr) => ({ ...pr, bestBpm: { ...pr.bestBpm, [month]: Math.max(pr.bestBpm[month] ?? 0, n) } }));
          setValue("");
        }}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`bpm-${month}`}>Maior BPM que você tocou limpo</Label>
          <Input id={`bpm-${month}`} inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))} className="w-32 font-mono" placeholder="70" />
        </div>
        <Button type="submit" disabled={!valid}>
          Salvar
        </Button>
      </form>
      {best >= target && <p className="font-semibold text-good">Desafio vencido! Conclua a aula para fechar o mês 1.</p>}
    </section>
  );
}
