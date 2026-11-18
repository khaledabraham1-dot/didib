import * as React from "react";
import * as T from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

// Tabs shadcn, sous forme de réglette numérotée en chiffres romains.
export const Tabs = T.Root;
export const TabsList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof T.List>>(({ className, ...p }, ref) => (
  <T.List ref={ref} className={cn("flex gap-1 overflow-x-auto [scrollbar-width:none]", className)} {...p} />
));
TabsList.displayName = "TabsList";
export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof T.Trigger>>(({ className, ...p }, ref) => (
  <T.Trigger
    ref={ref}
    className={cn(
      "relative shrink-0 px-3 py-2 label text-ash transition-colors hover:text-ivory data-[state=active]:text-brass",
      "after:absolute after:inset-x-3 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-500 data-[state=active]:after:scale-x-100",
      className
    )}
    {...p}
  />
));
TabsTrigger.displayName = "TabsTrigger";
export const TabsContent = T.Content;
