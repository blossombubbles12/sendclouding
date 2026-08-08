import * as React from "react";
import { cn } from "@/lib/utils";

const gaps = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-10",
} as const;

const colsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-5",
  6: "grid-cols-2 md:grid-cols-6",
};

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: keyof typeof gaps;
}

export function Grid({ className, cols = 3, gap = "lg", ...props }: GridProps) {
  return <div className={cn("grid", colsMap[cols], gaps[gap], className)} {...props} />;
}
