"use client";

import * as React from "react";
import { useInView } from "@/hooks/use-in-view";

export interface CounterProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
  decimals?: number;
}

/**
 * Animated number counter that counts up when scrolled into view.
 * Respects prefers-reduced-motion by jumping straight to the value.
 */
export function Counter({ value, suffix = "", label, duration = 1800, decimals = 0 }: CounterProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;

    let frame: number;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(frame);
    }

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, duration]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold tracking-tight sm:text-5xl">
        <span aria-hidden="true">
          {display.toLocaleString("en-NG", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}
          {suffix}
        </span>
        <span className="sr-only">
          {value.toLocaleString("en-NG")}
          {suffix} {label}
        </span>
      </p>
      <p className="mt-2 text-sm font-medium text-white/75">{label}</p>
    </div>
  );
}