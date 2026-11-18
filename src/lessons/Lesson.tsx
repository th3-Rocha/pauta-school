// Transforma os dados de uma aula (types.ts) na página com os 4 blocos.
import * as React from "react";
import { LessonLayout, type LessonBlockData } from "../components/course/LessonLayout";
import { SelfCheck } from "../components/course/SelfCheck";
import { Callout } from "../components/ui/Callout";
import { Fretboard } from "../components/music/Fretboard";
import { STANDARD_TUNING } from "../lib/music";
import { pluck } from "../app/audio";
import { completeDay, setBlockDone, setChecks, useProgress } from "../app/progress";
import { md } from "./md";
import { L } from "../i18n";
import type { Lesson as LessonData, Node } from "./types";
import { LetterTable, MetronomeExercise, StringsExplorer, Tuner } from "./widgets/Basics";
import { ChordCards, ChordChanger, StrumPattern } from "./widgets/Chords";
import { TabPlayer } from "./widgets/TabPlayer";
import { Ear } from "./widgets/Ear";
import { BpmLog, MinuteChallenge } from "./widgets/Records";
import { PlayAlong } from "./widgets/PlayAlong";
import { FindKeys, HandWidget, InputPanel, KeyEcho, KeysWidget, Sequence } from "./widgets/Keys";

const KINDS = ["review", "concept", "lab", "ear"] as const;

function FretboardWidget({ node }: { node: Extract<Node, { w: "fretboard" }> }) {
  const [last, setLast] = React.useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <Fretboard
        frets={node.frets ?? 5}
        markers={node.markers.map((m) => ({
          string: m.s,
          fret: m.f,
          label: m.label,
          kind: last === `${m.s}-${m.f}` ? "active" : (m.kind ?? "in"),
        }))}
        showNoteNames
        onPress={(s, f) => {
          pluck(STANDARD_TUNING[s - 1] + f);
          setLast(`${s}-${f}`);
        }}
      />
      {node.caption && <p className="text-sm text-muted">{md(node.caption)}</p>}
    </div>
  );
}

function Checks({ day, node }: { day: number; node: Extract<Node, { w: "selfcheck" }> }) {
  const p = useProgress();
  const prefix = `${node.id}:`;
  const all = p.checks[day] ?? [];
  const mine = all.filter((c) => c.startsWith(prefix)).map((c) => c.slice(prefix.length));
  return (
    <SelfCheck
      title={node.title}
      items={node.items}
      checked={mine}
      onChange={(ids) => setChecks(day, [...all.filter((c) => !c.startsWith(prefix)), ...ids.map((i) => prefix + i)])}
    />
  );
}

function render(node: Node, i: number, day: number): React.ReactNode {
  if (typeof node === "string") return <p key={i}>{md(node)}</p>;
  if ("h" in node) return <h3 key={i}>{md(node.h)}</h3>;
  if ("list" in node) {
    const L = node.ordered ? "ol" : "ul";
    return (
      <L key={i} className={node.ordered ? "flex list-decimal flex-col gap-1.5 pl-6" : "flex list-disc flex-col gap-1.5 pl-6"}>
        {node.list.map((t, k) => (
          <li key={k}>{md(t)}</li>
        ))}
      </L>
    );
  }
  if ("callout" in node) {
    const texts = Array.isArray(node.text) ? node.text : [node.text];
    return (
      <Callout key={i} variant={node.callout} title={node.title} label={node.label}>
        {texts.map((t, k) => (
          <p key={k}>{md(t)}</p>
        ))}
      </Callout>
    );
  }
  switch (node.w) {
    case "strings":
      return <StringsExplorer key={i} />;
    case "letters":
      return <LetterTable key={i} />;
    case "tuner":
      return <Tuner key={i} />;
    case "metronome":
      return <MetronomeExercise key={i} bpm={node.bpm} />;
    case "fretboard":
      return <FretboardWidget key={i} node={node} />;
    case "chords":
      return <ChordCards key={i} chords={node.chords} />;
    case "changes":
      return <ChordChanger key={i} chords={node.chords} beats={node.beats} bpm={node.bpm} title={node.title} />;
    case "tab":
      return <TabPlayer key={i} title={node.title} bpm={node.bpm} notes={node.notes} beatsPerMeasure={node.beatsPerMeasure} />;
    case "strum":
      return <StrumPattern key={i} title={node.title} bpm={node.bpm} measures={node.measures} melody={node.melody} />;
    case "selfcheck":
      return <Checks key={i} day={day} node={node} />;
    case "ear":
      return <Ear key={i} kind={node.kind} chords={node.chords} />;
    case "minute":
      return <MinuteChallenge key={i} id={node.id} label={node.label} />;
    case "bpmlog":
      return <BpmLog key={i} month={node.month} target={node.target} />;
    case "key-input":
      return <InputPanel key={i} />;
    case "keys":
      return (
        <KeysWidget
          key={i}
          from={node.from}
          to={node.to}
          markers={node.markers?.map((m) => ({ ...m, kind: m.kind ?? "in" }))}
          handZones={node.zones}
          names={node.names}
          caption={node.caption}
        />
      );
    case "hand":
      return <HandWidget key={i} name={node.name} description={node.description} positions={node.positions} />;
    case "find-keys":
      return <FindKeys key={i} {...node} />;
    case "sequence":
      return <Sequence key={i} {...node} />;
    case "key-echo":
      return <KeyEcho key={i} notes={node.notes} />;
    case "play-along":
      return <PlayAlong key={i} {...node} />;
  }
}

export function Lesson({ lesson, href = (d: number) => `/guitar/day/${d}`, homeHref = "/" }: { lesson: LessonData; href?: (day: number) => string; homeHref?: string }) {
  const p = useProgress();
  const done = new Set(p.blocks[lesson.day] ?? []);
  const blocks = lesson.blocks.map(
    (b, i): LessonBlockData => ({
      kind: KINDS[i],
      title: b.title,
      subtitle: b.subtitle,
      minutes: b.minutes,
      done: done.has(i),
      content: <div className="prose-aula">{b.body.map((n, k) => render(n, k, lesson.day))}</div>,
    }),
  ) as [LessonBlockData, LessonBlockData, LessonBlockData, LessonBlockData];

  return (
    <LessonLayout
      month={lesson.month}
      day={lesson.day}
      title={lesson.title}
      estimatedMinutes={lesson.minutes}
      objectives={lesson.objectives}
      blocks={blocks}
      onBlockDoneChange={(i, d) => setBlockDone(lesson.day, i, d)}
      completed={p.completed.includes(lesson.day)}
      onComplete={() => {
        completeDay(lesson.day);
        window.location.href = homeHref;
      }}
      footer={
        <nav className="flex justify-between gap-3 text-sm">
          {lesson.day > 1 ? (
            <a className="text-muted underline decoration-line-strong underline-offset-4 hover:text-fg" href={href(lesson.day - 1)}>
              ← {L("Dia", "Day")} {lesson.day - 1}
            </a>
          ) : (
            <span />
          )}
          <a className="text-muted underline decoration-line-strong underline-offset-4 hover:text-fg" href={homeHref}>
            {L("Seu ano", "Your year")}
          </a>
        </nav>
      }
    />
  );
}
