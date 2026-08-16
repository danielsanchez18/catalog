import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";

const DialogRoot = Dialog.Root;
const DialogTrigger = Dialog.Trigger;
const DialogPortal = Dialog.Portal;
const DialogClose = Dialog.Close;
const DialogTitle = Dialog.Title;
const DialogDescription = Dialog.Description;
const DialogViewport = Dialog.Viewport;

function DialogBackdrop({ className, ...props }: React.ComponentProps<typeof Dialog.Backdrop>) {
  return (
    <Dialog.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-foreground/20 backdrop-blur-[2px] transition-opacity duration-200 data-closed:opacity-0 data-open:opacity-100",
        className
      )}
      {...props}
    />
  );
}

function DialogPopup({ className, ...props }: React.ComponentProps<typeof Dialog.Popup>) {
  return (
    <Dialog.Portal>
      <DialogBackdrop />
      <Dialog.Popup
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid max-h-[min(100dvh-2rem,var(--popup-available-height,34rem))] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-y-4 rounded-xl border border-border bg-popover p-6 text-popover-foreground shadow-lg outline-hidden data-closed:scale-95 data-closed:opacity-0 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          className
        )}
        {...props}
      />
    </Dialog.Portal>
  );
}

export {
  DialogRoot as Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogViewport,
  DialogPopup,
};