import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md";
  showValue?: boolean;
}

export function Rating({ value, max = 5, size = "sm", showValue = false, className, ...props }: RatingProps) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className={cn("flex items-center gap-1", className)} {...props}>
      <div className="flex items-center" role="img" aria-label={`Rated ${value} out of ${max}`}>
        {Array.from({ length: max }).map((_, index) => {
          const filled = index < Math.round(value);
          return (
            <Star
              key={index}
              className={cn(starSize, filled ? "fill-highlight text-highlight" : "fill-transparent text-border")}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          );
        })}
      </div>
      {showValue && <span className="text-caption font-medium text-foreground">{value.toFixed(1)}</span>}
    </div>
  );
}
