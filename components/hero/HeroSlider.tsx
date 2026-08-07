"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { heroSlides } from "./data";
import { HeroSlide } from "./HeroSlide";
import { HeroNavigation } from "./HeroNavigation";
import { HeroIndicators } from "./HeroIndicators";

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const autoplay = React.useMemo(
    () =>
      Autoplay({
        delay: 6000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 30,
      skipSnaps: false,
    },
    [autoplay]
  );

  const onPrev = React.useCallback(() => {
    emblaApi?.scrollPrev();
    autoplay.reset();
  }, [emblaApi, autoplay]);

  const onNext = React.useCallback(() => {
    emblaApi?.scrollNext();
    autoplay.reset();
  }, [emblaApi, autoplay]);

  const onSelect = React.useCallback((index: number) => {
    emblaApi?.scrollTo(index);
    autoplay.reset();
  }, [emblaApi, autoplay]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onPrev();
      } else if (e.key === "ArrowRight") {
        onNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onPrev, onNext]);

  // Track active slide
  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelectCb = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelectCb);
    onSelectCb();
    return () => {
      emblaApi.off("select", onSelectCb);
    };
  }, [emblaApi]);

  return (
    <section
      className="relative overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-roledescription="carousel"
      aria-label="Hero slider"
    >

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {heroSlides.map((slide) => (
            <div key={slide.id} className="min-w-0 flex-[0_0_100%]">
              <HeroSlide
                slide={slide}
                isActive={heroSlides[activeIndex]?.id === slide.id}
              />
            </div>
          ))}
        </div>
      </div>

      <HeroNavigation onPrev={onPrev} onNext={onNext} />
      <HeroIndicators total={heroSlides.length} activeIndex={activeIndex} onSelect={onSelect} />
    </section>
  );
}
