import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-white text-foreground hover:bg-muted",
        primary: "border-transparent bg-primary-50 text-primary-700",
        secondary: "border-transparent bg-secondary-50 text-secondary-700",
        accent: "border-transparent bg-accent-50 text-accent-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {}

function Chip({ className, variant, ...props }: ChipProps) {
  return <span className={cn(chipVariants({ variant }), className)} {...props} />;
}

export { Chip, chipVariants };
