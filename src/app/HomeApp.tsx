import * as React from "react";
import { ArrowRight, Cable, Ear, Headphones, Smartphone } from "lucide-react";
import { Button } from "../components/ui/Button";
import { YearMap, type YearMonth, type DayState } from "../components/course/YearMap";
import { MilestoneCard } from "../components/course/MilestoneCard";
import { InstrumentPicker } from "../components/course/InstrumentPicker";
import { instrumentsIn } from "../data/instruments";
import { selectInstrument, useInstrument } from "./instrument";
import { L, localePath, setLocale, type Locale } from "../i18n";
import { getCourse, registerTitles, type CourseInfo } from "../data/courses";
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
      if (isMilestoneDay(day)) state = "milestone";
      else if (done.has(day)) state = "done";
      else if (day === today) state = "current";
      else if (day < today && hasLesson(day)) state = "available";
      else state = "locked";
      const passed = state === "milestone" && (p.bestBpm[m.month] ?? 0) >= m.milestone.targetBpm;
      return { day, state, passed, title: course.titles[day] ?? (state === "milestone" ? m.milestone.title : L("Em breve", "Coming soon")) };
    }),
  }));
}

export default function HomeApp({ locale = "pt", guitarTitles }: { locale?: Locale; guitarTitles?: Record<number, string> }) {
  setLocale(locale);
  if (guitarTitles) registerTitles("guitar", locale, guitarTitles);
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
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-20 pt-8 sm:pt-14">
        <section aria-labelledby="instrumento" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="instrumento" className="font-display text-2xl font-bold text-fg">
              {L("Escolha seu instrumento", "Choose your instrument")}
            </h2>
            <p className="text-muted">
              {L(
                "A guitarra já tem o ano inteiro, 365 aulas. O teclado tem o primeiro mês. Gaita e os outros estão sendo preparados.",
                "Guitar has the whole year, all 365 lessons. Keyboard has its first month. Harmonica and the others are on the way.",
              )}{" "}
              <a href={localePath("/setup")} className="underline decoration-line-strong underline-offset-4 hover:text-fg focus-ring">
                {L("Testar meu equipamento", "Test my setup")}
              </a>
            </p>
          </div>
          <InstrumentPicker instruments={instrumentsIn(locale)} selected={instrument} onSelect={selectInstrument} />
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div className="flex flex-col gap-5">
            <p className="panel-label text-accent">
              {course.name} · {L("Mês", "Month")} {month.month} · {month.title}
            </p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance text-fg sm:text-5xl">
              {ready ? course.titles[today] : L(`A aula do dia ${today} ainda está sendo escrita`, `The lesson for day ${today} is still being written`)}
            </h1>
            <p className="max-w-[60ch] text-lg text-muted">
              {L(
                `Uma aula por dia, uns 30 minutos ${course.pitch}. Em um ano você sai do zero e improvisa solos. Sem vídeo, sem cadastro, código aberto.`,
                `One lesson a day, about 30 minutes ${course.pitch}. In a year you go from zero to improvising solos. No video, no sign-up, open source.`,
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => go(today)} disabled={!ready}>
                {p.completed.length === 0 ? L("Começar o dia 1", "Start day 1") : L(`Ir para o dia ${today}`, `Go to day ${today}`)}
                <ArrowRight aria-hidden />
              </Button>
              {!ready && <span className="text-sm text-muted">{L("Novas aulas chegam toda semana.", "New lessons arrive every week.")}</span>}
            </div>
          </div>

          <ul className="grid gap-3 text-base">
            {(instrument === "keyboard"
              ? [
                  { icon: Cable, t: L("Ligue seu teclado", "Plug in your keyboard"), d: L("Com cabo USB o site ouve o que você toca e confere sozinho. Sem cabo, toque na tela.", "With a USB cable the site hears what you play and checks it for you. No cable? Tap the screen.") },
                  { icon: Ear, t: L("Seu ouvido no centro", "Your ear at the center"), d: L("Treinos curtos todo dia, com meta de 80% de acerto.", "Short drills every day, with an 80% accuracy goal.") },
                  { icon: Smartphone, t: L("Celular na estante", "Phone on the stand"), d: L("Metrônomo grande e teclado na tela, feitos para ler de longe.", "Big metronome and on-screen keyboard, made to read from a distance.") },
                ]
              : [
                  { icon: Headphones, t: L("Som gerado no navegador", "Sound made in the browser"), d: L("Clique no braço e ouça. Use fone ou caixa de som.", "Click the neck and listen. Use headphones or speakers.") },
                  { icon: Ear, t: L("Seu ouvido no centro", "Your ear at the center"), d: L("Treinos curtos todo dia, com meta de 80% de acerto.", "Short drills every day, with an 80% accuracy goal.") },
                  { icon: Smartphone, t: L("Celular na estante", "Phone on the stand"), d: L("Metrônomo e afinador grandes, feitos para ler de longe.", "Big metronome and tuner, made to read from a distance.") },
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
              {L("Seu ano", "Your year")}
            </h2>
            <p className="font-mono text-sm text-muted">{p.completed.length}/365 {L("aulas", "lessons")}</p>
          </div>
          <YearMap months={months} onSelectDay={go} />
        </section>

        <section aria-labelledby="desafio" className="flex flex-col gap-4">
          <h2 id="desafio" className="font-display text-2xl font-bold text-fg">
            {L("Desafio deste mês", "This month's challenge")}
          </h2>
          <MilestoneCard
            month={month.month}
            title={month.milestone.title}
            goal={month.milestone.goal}
            criteria={month.milestone.criteria}
            targetBpm={month.milestone.targetBpm}
            bestBpm={p.bestBpm[month.month]}
            status={today >= month.lastDay ? "available" : "locked"}
            onAttempt={() => go(month.lastDay)}
          />
        </section>

        <footer className="flex flex-col gap-2 border-t border-line pt-6 text-sm text-muted">
          <p>
            {L(
              "A Pauta é uma escola de música livre. Código sob licença MIT, aulas sob CC BY-SA 4.0. Seu progresso fica só neste navegador; use o botão de progresso no topo para levar para outro aparelho.",
              "Pauta is a free music school. Code under the MIT license, lessons under CC BY-SA 4.0. Your progress stays in this browser; use the progress button at the top to take it to another device.",
            )}
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
