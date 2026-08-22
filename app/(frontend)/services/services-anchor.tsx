"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

const FALLBACK_TYPES: Record<string, string> = {
  nationwide: "service-express",
  local: "service-same-day",
  custom: "service-freight",
};

export function ServicesAnchor() {
  const params = useSearchParams();

  React.useEffect(() => {
    const type = params.get("type");
    if (!type) return;

    let target: HTMLElement | null = null;
    if (FALLBACK_TYPES[type]) {
      target = document.getElementById(FALLBACK_TYPES[type]);
    } else {
      target =
        document.getElementById(`service-${type}`) ??
        document.getElementById(`special-${type}`);
    }

    const el = target ?? document.getElementById("services-grid");

    const timer = window.setTimeout(() => {
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("services-highlight");
      window.setTimeout(() => el.classList.remove("services-highlight"), 2600);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [params]);

  return null;
}