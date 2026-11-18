import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

// Sheet shadcn (Radix Dialog), réinterprété en rideau de scène plein écran.
export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;
export const SheetTitle = Dialog.Title;

export const SheetContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Dialog.Content>>(
  ({ className, children, ...props }, ref) => (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-obsidian/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <Dialog.Content
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-obsidian grain outline-none",
          "data-[state=open]:[animation:curtain-in_.7s_var(--ease-throne)] data-[state=closed]:[animation:curtain-out_.5s_var(--ease-throne)]",
          className
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  )
);
SheetContent.displayName = "SheetContent";
