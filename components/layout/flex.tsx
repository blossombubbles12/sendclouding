import * as React from "react";
import { cn } from "@/lib/utils";

const gaps = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-8",
} as const;

const alignments = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const;

const justifications = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
} as const;

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: keyof typeof gaps;
  align?: keyof typeof alignments;
  justify?: keyof typeof justifications;
  wrap?: boolean;
  direction?: "row" | "col";
  as?: React.ElementType;
}

export function Flex({
  className,
  gap = "md",
  align = "center",
  justify = "start",
  wrap = false,
  direction = "row",
  as: Tag = "div",
  ...props
}: FlexProps) {
  return (
    <Tag
      className={cn(
        "flex",
        direction === "col" ? "flex-col" : "flex-row",
        wrap && "flex-wrap",
        gaps[gap],
        alignments[align],
        justifications[justify],
        className
      )}
      {...props}
    />
  );
}
