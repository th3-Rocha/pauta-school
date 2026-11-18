// src/index.ts — ponto único de exportação do design system da Pauta.
export { cn } from "./lib/cn";
export { strings, withStrings, type Strings } from "./lib/strings";
export * from "./lib/music";

export * from "./components/ui/Button";
export * from "./components/ui/ToggleGroup";
export * from "./components/ui/Tabs";
export * from "./components/ui/Dialog";
export * from "./components/ui/Tooltip";
export * from "./components/ui/Badge";
export * from "./components/ui/Progress";
export * from "./components/ui/Slider";
export * from "./components/ui/Checkbox";
export * from "./components/ui/Input";
export * from "./components/ui/Callout";

export * from "./components/course/AppHeader";
export * from "./components/course/YearMap";
export * from "./components/course/LessonBlock";
export * from "./components/course/LessonLayout";
export * from "./components/course/SelfCheck";
export * from "./components/course/MilestoneCard";
export * from "./components/course/ProgressCodeDialog";

export * from "./components/music/markers";
export * from "./components/music/controls";
export * from "./components/music/Fretboard";
export * from "./components/music/ChordDiagram";
export * from "./components/music/ScoreFrame";
export * from "./components/music/RhythmSlashes";
export * from "./components/music/Metronome";
export * from "./components/music/Drone";
export * from "./components/music/BackingTrackPlayer";
export * from "./components/music/EarTrainer";
export * from "./components/music/PitchMeter";
export * from "./components/music/NoteFixPuzzle";

export { DesignSystemPreview } from "./components/DesignSystemPreview";
