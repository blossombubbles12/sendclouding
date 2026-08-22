"use client";

import * as React from "react";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export function AboutHero() {
  const [offset, setOffset] = React.useState(0);
  const [reduced, setReduced] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);

    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const y = reduced ? 0 : Math.min(offset * 0.25, 120);

  return (
    <section className="relative flex min-h-[520px] items-center overflow-hidden bg-primary-900 sm:min-h-[600px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${y}px, 0) scale(1.08)` }}
      >
        <Image
          src="/signageslide2.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="animate-fade-up [animation-fill-mode:forwards] motion-reduce:animate-none">
          <Breadcrumbs items={[{ label: "About Us" }]} className="[&_*]:!text-white/70" />
        </div>

        <h1 className="text-hero mt-6 max-w-3xl text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.35)]">
          Making brands <span className="text-secondary">visible</span> across Europe
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
          From a small printing shop to Europe's leading print-on-demand platform.
          We help businesses and individuals create professional signage that gets noticed.
        </p>
      </div>
    </section>
  );
}
