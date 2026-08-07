import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
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
        <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
          {eyebrow}
        </span>
      )}
      <h2 className="text-section-heading text-foreground">{title}</h2>
      {description && <p className="text-body max-w-xl">{description}</p>}
    </div>
  );
}
