"use client";

interface HeroIndicatorsProps {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function HeroIndicators({ total, activeIndex, onSelect }: HeroIndicatorsProps) {
  return (
    <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 sm:bottom-10 lg:left-[40%] lg:translate-x-0" role="tablist" aria-label="Slide indicators">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onSelect(i)}
          className={`rounded-full transition-all duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            i === activeIndex
              ? "h-2.5 w-8 bg-primary"
              : "h-2.5 w-2.5 bg-foreground/25 hover:bg-foreground/40"
          }`}
        />
      ))}
    </div>
  );
}
