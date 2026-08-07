"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  as?: React.ElementType;
}

/**
 * Wraps children with a subtle fade + rise animation that plays once
 * the element scrolls into the viewport. Respects prefers-reduced-motion.
 */
export function Reveal({ className, style, delay = 0, as: Tag = "div", children, ...props }: RevealProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={cn("reveal", isInView && "is-visible", className)}
      style={{ transitionDelay: isInView ? `${delay}ms` : "0ms", ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
