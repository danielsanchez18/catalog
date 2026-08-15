import * as React from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";

import { cn } from "@/lib/utils";

const AlertDialogRoot = AlertDialog.Root;
const AlertDialogTrigger = AlertDialog.Trigger;
const AlertDialogPortal = AlertDialog.Portal;
const AlertDialogClose = AlertDialog.Close;
const AlertDialogTitle = AlertDialog.Title;
const AlertDialogDescription = AlertDialog.Description;

function AlertDialogBackdrop({ className, ...props }: React.ComponentProps<typeof AlertDialog.Backdrop>) {
  return (
    <AlertDialog.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-foreground/20 backdrop-blur-[2px] transition-opacity duration-200 data-closed:opacity-0 data-open:opacity-100",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogPopup({ className, ...props }: React.ComponentProps<typeof AlertDialog.Popup>) {
  return (
    <AlertDialog.Portal>
      <AlertDialogBackdrop />
      <AlertDialog.Popup
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-y-4 rounded-xl border border-border bg-popover p-6 text-popover-foreground shadow-lg outline-hidden data-closed:scale-95 data-closed:opacity-0 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          className
        )}
        {...props}
      />
    </AlertDialog.Portal>
  );
}

export {
  AlertDialogRoot as AlertDialog,
  AlertDialogTrigger,
  AlertDialogClose,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogPopup,
};
