import * as React from "react";
import { cn } from "@/lib/utils";

const gaps = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-8",
  xl: "gap-12",
} as const;

const alignments = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: keyof typeof gaps;
  align?: keyof typeof alignments;
  as?: React.ElementType;
}

export function Stack({
  className,
  gap = "md",
  align = "stretch",
  as: Tag = "div",
  ...props
}: StackProps) {
  return (
    <Tag className={cn("flex flex-col", gaps[gap], alignments[align], className)} {...props} />
  );
}
