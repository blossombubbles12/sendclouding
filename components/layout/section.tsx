import * as React from "react";
import { cn } from "@/lib/utils";
import { Container, type ContainerProps } from "@/components/layout/container";
import type { SectionBackgroundType } from "@/components/layout/section-background";

const backgrounds = {
  white: "bg-white",
  muted: "bg-muted/60",
  primary: "bg-primary text-white",
  "primary-tint": "bg-primary-50",
  snow: "bg-[#EAF4FB]",
  warm: "bg-[#FAF7F2]",
  transparent: "bg-transparent",
} as const;

const spacing = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-20 lg:py-24",
  lg: "py-20 sm:py-28 lg:py-32",
} as const;

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: keyof typeof backgrounds;
  spacing?: keyof typeof spacing;
  containerSize?: ContainerProps["size"];
  noContainer?: boolean;
  /**
   * Optional decorative background pattern rendered behind the section content.
   * Applies the matching `.bg-pattern-*` utility (see globals.css).
   */
  pattern?: SectionBackgroundType;
}

export function Section({
  className,
  background = "white",
  spacing: spacingProp = "md",
  containerSize = "lg",
  noContainer = false,
  pattern,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        backgrounds[background],
        spacing[spacingProp],
        pattern ? `bg-pattern-${pattern}` : "",
        className
      )}
      {...props}
    >
      {noContainer ? children : <Container size={containerSize}>{children}</Container>}
    </section>
  );
}