"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({ className, children, side = "bottom", ...props }) {
  const sideClasses = {
    bottom: "inset-x-0 bottom-0 rounded-t-2xl border-t data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom",
    right: "inset-y-0 right-0 h-full w-full max-w-sm border-l data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
  };
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col bg-card border-cardline shadow-xl max-h-[85vh]",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 text-text4 hover:bg-card2 focus-visible:outline-none">
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }) {
  return <div className={cn("px-5 pt-5 pb-3", className)} {...props} />;
}
export function SheetTitle({ className, ...props }) {
  return <DialogPrimitive.Title className={cn("font-display font-semibold text-base text-ink", className)} {...props} />;
}
export function SheetDescription({ className, ...props }) {
  return <DialogPrimitive.Description className={cn("text-[12.5px] text-text4", className)} {...props} />;
}
