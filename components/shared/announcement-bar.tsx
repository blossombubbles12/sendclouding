"use client";

import * as React from "react";
import { X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const MESSAGE = "Free delivery on orders over \u20A620,000 nationwide. Start designing your custom prints today.";

export function AnnouncementBar() {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <div className={cn("relative bg-secondary text-white")}>
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center text-xs font-medium sm:text-sm">
        <Sparkles className="hidden h-3.5 w-3.5 shrink-0 text-white/70 sm:block" aria-hidden="true" />
        <p className="truncate">{MESSAGE}</p>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
