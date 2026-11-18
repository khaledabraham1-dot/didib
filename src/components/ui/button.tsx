import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Bouton shadcn, redessiné : coins vifs, remplissage laiton qui monte au survol.
const buttonVariants = cva(
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap font-sans font-wide uppercase tracking-[.14em] text-[12px] transition-colors duration-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        crown:
          "bg-brass text-obsidian before:absolute before:inset-0 before:-translate-y-full before:bg-ivory before:transition-transform before:duration-500 before:ease-[var(--ease-throne)] hover:before:translate-y-0",
        outline:
          "border border-brass/50 text-ivory before:absolute before:inset-0 before:translate-y-full before:bg-brass before:transition-transform before:duration-500 before:ease-[var(--ease-throne)] hover:text-obsidian hover:before:translate-y-0",
        ghost: "text-ivory hover:text-brass",
      },
      size: { default: "h-12 px-6", sm: "h-9 px-4 text-[11px]", lg: "h-14 px-8", icon: "size-11" },
    },
    defaultVariants: { variant: "crown", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
      {asChild ? children : <span className="relative z-10 inline-flex items-center gap-3">{children}</span>}
    </Comp>
  );
});
Button.displayName = "Button";
export { buttonVariants };
