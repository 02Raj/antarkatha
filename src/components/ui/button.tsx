import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-sans font-medium whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 ease-(--ease-calm) select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-55 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-forest text-surface hover:bg-forest-deep",
        accent: "bg-saffron text-white hover:bg-saffron-ink",
        outline:
          "border border-copper bg-transparent text-ink hover:border-forest hover:bg-surface",
        quiet: "bg-transparent text-ink hover:bg-paper-deep",
        link: "h-auto px-0 text-forest underline decoration-copper underline-offset-4 hover:decoration-forest",
        danger: "bg-danger text-white hover:bg-[#8a3131]",
      },
      size: {
        sm: "h-9 rounded-md px-3.5 text-sm",
        md: "h-11 rounded-md px-5 text-[0.9375rem]",
        lg: "h-12 rounded-lg px-6 text-base",
        icon: "size-10 rounded-md",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
