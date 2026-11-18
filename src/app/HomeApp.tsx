import * as React from "react";
import { ArrowRight, Cable, Ear, Headphones, Smartphone } from "lucide-react";
import { Button } from "../components/ui/Button";
import { YearMap, type YearMonth, type DayState } from "../components/course/YearMap";
import { MilestoneCard } from "../components/course/MilestoneCard";
import { InstrumentPicker } from "../components/course/InstrumentPicker";
import { INSTRUMENTS } from "../data/instruments";
import { selectInstrument, useInstrument } from "./instrument";
import { getCourse, type CourseInfo } from "../data/courses";
import { Shell } from "./Shell";
import { currentDay, setActiveInstrument, useProgress, type Progress } from "./progress";

function buildMonths(course: CourseInfo, p: Progress, today: number): YearMonth[] {
  const { isMilestoneDay, hasLesson } = course;
  const done = new Set(p.completed);
  return course.months.map((m) => ({
    month: m.month,
    title: m.title,
    days: Array.from({ length: m.lastDay - m.firstDay + 1 }, (_, i) => {
      const day = m.firstDay + i;
      let state: DayState;
      if (isMilestoneDay(day)) state = "marco";
      else if (done.has(day)) state = "concluido";
      else if (day === today) state = "atual";
      else if (day < today && hasLesson(day)) state = "disponivel";
      else state = "bloqueado";
      const passed = state === "marco" && (p.bestBpm[m.month] ?? 0) >= m.milestone.targetBpm;
      return { day, state, passed, title: course.titles[day] ?? (state === "marco" ? m.milestone.title : "Em breve") };
    }),
  }));
}

export default function HomeApp() {
  const instrument = useInstrument();
  setActiveInstrument(instrument, { silent: true });
  const course = getCourse(instrument);
  const go = (day: number) => {
    window.location.href = course.href(day);
  };
  const p = useProgress();
  const today = currentDay(p);
  const month = course.monthOfDay(today);
  const ready = course.hasLesson(today);
  const months = React.useMemo(() => buildMonths(course, p, today), [course, p, today]);

  return (
    <Shell>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 pb-20 pt-8 sm:pt-14">
        <section aria-labelledby="instrumento" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="instrumento" className="font-display text-2xl font-bold text-fg">
              Escolha seu instrumento
            </h2>
            <p className="text-muted">
              A guitarra já tem o primeiro mês inteiro e o teclado está em prévia. Gaita e os outros estão sendo preparados.{" "}
              <a href="/equipamento" className="underline decoration-line-strong underline-offset-4 hover:text-fg focus-ring">
                Testar meu equipamento
              </a>
            </p>
          </div>
          <InstrumentPicker instruments={INSTRUMENTS} selected={instrument} onSelect={selectInstrument} />
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div className="flex flex-col gap-5">
            <p className="panel-label text-accent">
              {course.name} · Mês {month.month} · {month.title}
            </p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance text-fg sm:text-5xl">
              {ready ? course.titles[today] : `A aula do dia ${today} ainda está sendo escrita`}
            </h1>
            <p className="max-w-[60ch] text-lg text-muted">
              Uma aula por dia, uns 30 minutos {course.pitch}. Em um ano você sai do zero e improvisa solos. Sem vídeo, sem
              cadastro, código aberto.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => go(today)} disabled={!ready}>
                {p.completed.length === 0 ? "Começar o dia 1" : `Ir para o dia ${today}`}
                <ArrowRight aria-hidden />
              </Button>
              {!ready && <span className="text-sm text-muted">Novas aulas chegam toda semana.</span>}
            </div>
          </div>

          <ul className="grid gap-3 text-base">
            {(instrument === "teclado"
              ? [
                  { icon: Cable, t: "Ligue seu teclado", d: "Com cabo USB o site ouve o que você toca e confere sozinho. Sem cabo, toque na tela." },
                  { icon: Ear, t: "Seu ouvido no centro", d: "Treinos curtos todo dia, com meta de 80% de acerto." },
                  { icon: Smartphone, t: "Celular na estante", d: "Metrônomo grande e teclado na tela, feitos para ler de longe." },
                ]
              : [
                  { icon: Headphones, t: "Som gerado no navegador", d: "Clique no braço e ouça. Use fone ou caixa de som." },
                  { icon: Ear, t: "Seu ouvido no centro", d: "Treinos curtos todo dia, com meta de 80% de acerto." },
                  { icon: Smartphone, t: "Celular na estante", d: "Metrônomo e afinador grandes, feitos para ler de longe." },
                ]
            ).map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-3 rounded-md border border-line bg-surface p-4">
                <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="block font-semibold text-fg">{t}</span>
                  <span className="text-sm text-muted">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="ano" className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="ano" className="font-display text-2xl font-bold text-fg">
              Seu ano
            </h2>
            <p className="font-mono text-sm text-muted">{p.completed.length}/365 aulas</p>
          </div>
          <YearMap months={months} onSelectDay={go} />
        </section>

        <section aria-labelledby="desafio" className="flex flex-col gap-4">
          <h2 id="desafio" className="font-display text-2xl font-bold text-fg">
            Desafio deste mês
          </h2>
          <MilestoneCard
            month={month.month}
            title={month.milestone.title}
            goal={month.milestone.goal}
            criteria={month.milestone.criteria}
            targetBpm={month.milestone.targetBpm}
            bestBpm={p.bestBpm[month.month]}
            status={today >= month.lastDay ? "disponivel" : "bloqueado"}
            onAttempt={() => go(month.lastDay)}
          />
        </section>

        <footer className="flex flex-col gap-2 border-t border-line pt-6 text-sm text-muted">
          <p>
            A Pauta é uma escola de música livre. Código sob licença MIT, aulas sob CC BY-SA 4.0. Seu progresso fica só neste navegador; use o botão
            de progresso no topo para levar para outro aparelho.
          </p>
          <p>
            <a href="/design" className="underline decoration-line-strong underline-offset-4 hover:text-fg focus-ring">
              Design system
            </a>
          </p>
        </footer>
      </main>
    </Shell>
  );
}
