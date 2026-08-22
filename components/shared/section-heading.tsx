import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  /**
   * "light" = section has a light background (default, dark text).
   * "dark" = section has a dark background (white text).
   */
  tone?: "light" | "dark";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center"
          ? "mx-auto max-w-2xl items-center text-center"
          : "items-start text-left",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider",
            tone === "dark"
              ? "bg-white/10 text-secondary-300"
              : "bg-secondary-50 text-secondary-700"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-section-heading",
          tone === "dark" ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-xl",
            tone === "dark" ? "text-white/70" : "text-body"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
