// src/components/course/ProgressCodeDialog.tsx
import * as React from "react";
import { Check, Copy, Download, TriangleAlert } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings as defaultStrings, type Strings } from "../../lib/strings";
import { Button } from "../ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/Dialog";
import { FieldMessage, Label, Textarea } from "../ui/Input";

export type ProgressSummary = { day: number; completed: number };

export type ProgressCodeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Código hexadecimal do progresso atual (~100 caracteres). */
  code: string;
  /**
   * Decodifica um código colado. Devolve o resumo ou null se inválido.
   * A lógica de verdade fica no app; o componente só mostra o resultado.
   */
  parseCode: (code: string) => ProgressSummary | null;
  onImport: (code: string) => void;
  /** Chamado depois de copiar (para analytics local, toast etc.). */
  onCopy?: (code: string) => void;
  importing?: boolean;
  /** Conteúdo extra no topo (ex.: resumo do progresso atual). */
  children?: React.ReactNode;
  strings?: Partial<Strings["progressCode"]>;
};

/** Remove espaços, quebras e traços; deixa só hexadecimal em minúsculas. */
export function normalizeHexCode(raw: string): string {
  return raw.replace(/[\s-]+/g, "").toLowerCase();
}

/** Divide em grupos de 4 para leitura. */
export function groupCode(code: string, size = 4): string[] {
  const out: string[] = [];
  for (let i = 0; i < code.length; i += size) out.push(code.slice(i, i + size));
  return out;
}

export function ProgressCodeDialog({
  open,
  onOpenChange,
  code,
  parseCode,
  onImport,
  onCopy,
  importing,
  children,
  strings: stringsOverride,
}: ProgressCodeDialogProps) {
  const s = { ...defaultStrings.progressCode, ...stringsOverride };
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "failed">("idle");
  const [pasted, setPasted] = React.useState("");
  const codeRef = React.useRef<HTMLDivElement>(null);
  const msgId = React.useId();
  const inputId = React.useId();

  React.useEffect(() => {
    if (!open) {
      setPasted("");
      setCopyState("idle");
    }
  }, [open]);

  const normalized = normalizeHexCode(pasted);
  const summary = normalized ? parseCode(normalized) : null;
  const invalid = normalized.length > 0 && !summary;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
      onCopy?.(code);
    } catch {
      setCopyState("failed");
      const sel = window.getSelection();
      if (sel && codeRef.current) {
        const range = document.createRange();
        range.selectNodeContents(codeRef.current);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{s.title}</DialogTitle>
          <DialogDescription>{s.description}</DialogDescription>
        </DialogHeader>

        {children}

        <section className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <h3 className="panel-label text-muted">{s.yourCode}</h3>
            <span className="font-mono text-xs text-muted">{s.chars(code.length)}</span>
          </div>
          <div
            ref={codeRef}
            aria-label={s.yourCode}
            className="flex select-all flex-wrap gap-x-2.5 gap-y-1 rounded-sm border border-line-strong bg-bg p-3 font-mono text-base leading-7 text-fg"
          >
            {groupCode(code).map((g, i) => (
              <span key={i} className={i % 2 ? "text-fg" : "text-fg/80"}>
                {g}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={copy} variant={copyState === "copied" ? "secondary" : "primary"}>
              {copyState === "copied" ? <Check aria-hidden /> : <Copy aria-hidden />}
              {copyState === "copied" ? s.copied : s.copy}
            </Button>
            <p aria-live="polite" className={cn("text-sm", copyState === "failed" ? "text-bad" : "text-good")}>
              {copyState === "failed" ? s.copyFailed : ""}
            </p>
          </div>
        </section>

        <hr className="border-line" />

        <section className="flex flex-col gap-2">
          <h3 className="font-semibold text-fg">{s.importTitle}</h3>
          <Label htmlFor={inputId} className="text-muted">
            {s.importLabel}
          </Label>
          <Textarea
            id={inputId}
            mono
            rows={3}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            inputMode="text"
            placeholder={s.importPlaceholder}
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            aria-invalid={invalid || undefined}
            aria-describedby={msgId}
          />
          <div id={msgId} aria-live="polite">
            {invalid && (
              <FieldMessage tone="bad" className="flex items-center gap-1.5">
                <TriangleAlert className="size-4 shrink-0" aria-hidden />
                {s.invalid}
              </FieldMessage>
            )}
            {summary && (
              <div className="flex flex-col gap-1 rounded-sm border border-accent bg-accent-soft p-3">
                <p className="panel-label text-muted">{s.willImport}</p>
                <p className="font-semibold text-fg">{s.summary(summary.day, summary.completed)}</p>
                <p className="text-sm text-muted">{s.importWarning}</p>
              </div>
            )}
          </div>
          <Button
            variant="secondary"
            disabled={!summary}
            loading={importing}
            onClick={() => summary && onImport(normalized)}
            className="self-start"
          >
            <Download aria-hidden />
            {s.import}
          </Button>
        </section>
      </DialogContent>
    </Dialog>
  );
}
