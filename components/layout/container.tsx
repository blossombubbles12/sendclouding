import * as React from "react";
import { cn } from "@/lib/utils";

const widths = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[90rem]",
  full: "max-w-none",
} as const;

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof widths;
  as?: React.ElementType;
}

export function Container({
  className,
  size = "lg",
  as: Tag = "div",
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", widths[size], className)}
      {...props}
    />
  );
}
