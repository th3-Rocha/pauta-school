// src/components/ui/Dialog.tsx
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
import { strings } from "../../lib/strings";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;

export type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  /** Rótulo do botão de fechar (leitor de tela). */
  closeLabel?: string;
  hideClose?: boolean;
};

/**
 * No celular vira uma folha que sobe de baixo (o polegar alcança).
 * A partir de 640px fica centralizado.
 */
export function DialogContent({
  className,
  children,
  closeLabel = strings.dialog.close,
  hideClose = false,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className="fixed inset-0 z-50 bg-overlay data-[state=open]:animate-fade-in"
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed z-50 flex max-h-[92dvh] w-full flex-col gap-4 overflow-y-auto border border-line bg-surface p-5 text-fg shadow-lg focus-ring",
          "inset-x-0 bottom-0 rounded-t-lg pb-[max(1.25rem,env(safe-area-inset-bottom))]",
          "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:p-6",
          "data-[state=open]:animate-sheet-in sm:data-[state=open]:animate-fade-in",
          className,
        )}
        {...props}
      >
        <div aria-hidden className="mx-auto -mt-2 h-1 w-10 shrink-0 rounded-full bg-line-strong sm:hidden" />
        {children}
        {!hideClose && (
          <DialogPrimitive.Close
            className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-sm text-muted hover:bg-surface-2 hover:text-fg focus-ring"
            aria-label={closeLabel}
          >
            <X className="size-5" aria-hidden />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1.5 pr-10", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-display text-2xl font-bold tracking-tight", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-base text-muted", className)} {...props} />;
}
