"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HeroButtonsProps {
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  className?: string;
  staggerDelay?: number;
}

export function HeroButtons({ primary, secondary, className = "", staggerDelay = 0 }: HeroButtonsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <span style={{ animationDelay: `${staggerDelay}ms` }} className="animate-fade-up opacity-0 [animation-fill-mode:forwards]">
        <Button size="lg" asChild>
          <Link href={primary.href}>
            {primary.label}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </span>
      <span style={{ animationDelay: `${staggerDelay + 100}ms` }} className="animate-fade-up opacity-0 [animation-fill-mode:forwards]">
        <Button
          size="lg"
          asChild
          className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white"
        >
          <Link href={secondary.href}>{secondary.label}</Link>
        </Button>
      </span>
    </div>
  );
}
