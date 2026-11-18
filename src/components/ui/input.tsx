import * as React from "react";
import { cn } from "@/lib/utils";

// Input shadcn, en ligne d'écriture : seule la base est tracée.
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-14 w-full border-0 border-b border-brass/40 bg-transparent px-0 font-display text-2xl italic text-ivory placeholder:text-ash/60 focus:border-brass focus:outline-none focus-visible:outline-none transition-colors",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
