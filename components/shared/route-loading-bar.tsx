"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Slim top progress bar shown during client-side page navigations, so
 * clicking a link/button never feels unresponsive while the next page
 * (and its server data) loads.
 *
 * Works for both <Link> clicks and programmatic router.push()/replace()
 * calls (e.g. after a form submit) by patching the History API, since
 * that's what the Next.js App Router ultimately calls under the hood for
 * every client-side navigation.
 */
function LoadingBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    const start = () => {
      if (tickRef.current) return;
      if (hideRef.current) {
        clearTimeout(hideRef.current);
        hideRef.current = null;
      }
      setVisible(true);
      setProgress(8);
      tickRef.current = setInterval(() => {
        setProgress((p) => (p < 90 ? p + Math.max(1, (90 - p) / 12) : p));
      }, 200);
    };

    const originalPush = window.history.pushState.bind(window.history);
    const originalReplace = window.history.replaceState.bind(window.history);

    window.history.pushState = ((...args: Parameters<typeof window.history.pushState>) => {
      start();
      return originalPush(...args);
    }) as typeof window.history.pushState;

    window.history.replaceState = ((...args: Parameters<typeof window.history.replaceState>) => {
      start();
      return originalReplace(...args);
    }) as typeof window.history.replaceState;

    window.addEventListener("popstate", start);

    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      window.removeEventListener("popstate", start);
      if (tickRef.current) clearInterval(tickRef.current);
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, []);

  // Pathname/search params only change once the navigation has actually
  // committed, so that's our signal to finish and hide the bar.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setProgress(100);
    hideRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-[3px] bg-transparent">
      <div
        className="h-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function RouteLoadingBar() {
  return (
    <Suspense fallback={null}>
      <LoadingBarInner />
    </Suspense>
  );
}
