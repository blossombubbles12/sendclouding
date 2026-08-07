"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroNavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

export function HeroNavigation({ onPrev, onNext }: HeroNavigationProps) {
  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:left-6 sm:h-14 sm:w-14"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:right-6 sm:h-14 sm:w-14"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
      </button>
    </>
  );
}
