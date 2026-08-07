"use client";

import Image from "next/image";
import { Chip } from "@/components/ui/chip";
import { HeroButtons } from "./HeroButtons";
import type { HeroSlideData } from "./data";

interface HeroSlideProps {
  slide: HeroSlideData;
  isActive: boolean;
}

export function HeroSlide({ slide, isActive }: HeroSlideProps) {
  return (
    <div className="relative flex min-h-[500px] w-full items-center sm:min-h-[600px] lg:min-h-[680px]">
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={slide.id === "signage"}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-900/45 to-primary-900/10" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 sm:px-8 lg:px-10">
        <div className="max-w-lg lg:max-w-xl">
          <span
            className={
              isActive
                ? "animate-fade-up opacity-0 [animation-fill-mode:forwards] motion-reduce:animate-none motion-reduce:opacity-100"
                : ""
            }
          >
            <Chip variant="secondary" className="mb-5 w-fit bg-white/90 backdrop-blur-sm text-secondary-700 font-medium">
              {slide.category}
            </Chip>
          </span>

          <span
            className={
              isActive
                ? "animate-fade-up opacity-0 [animation-fill-mode:forwards] motion-reduce:animate-none motion-reduce:opacity-100"
                : ""
            }
            style={{ animationDelay: "80ms", display: "block" }}
          >
            <h2 className="text-page-title text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.3)]">
              {slide.headline}
            </h2>
          </span>

          <span
            className={
              isActive
                ? "animate-fade-up opacity-0 [animation-fill-mode:forwards] motion-reduce:animate-none motion-reduce:opacity-100"
                : ""
            }
            style={{ animationDelay: "160ms" }}
          >
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              {slide.description}
            </p>
          </span>

          <HeroButtons
            primary={slide.primaryCta}
            secondary={slide.secondaryCta}
            className="mt-7"
            staggerDelay={240}
          />

          {slide.trustBadges && (
            <dl
              className={
                isActive
                  ? "mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 animate-fade-up opacity-0 [animation-fill-mode:forwards] motion-reduce:animate-none motion-reduce:opacity-100"
                  : "mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
              }
              style={{ animationDelay: "360ms" }}
            >
              {slide.trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <dt className="sr-only">Trust indicator</dt>
                  <dd className="text-xs font-medium text-white/70">{badge.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
