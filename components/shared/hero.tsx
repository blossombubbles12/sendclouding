import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, PenTool } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionBackground } from "@/components/layout/section-background";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/motion/reveal";

const trustPoints = [
  { icon: PenTool, label: "Free Design Tool" },
  { icon: Truck, label: "Nationwide Delivery" },
  { icon: ShieldCheck, label: "Quality Guaranteed" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <SectionBackground variant="radial" />
      <Container className="grid grid-cols-1 items-center gap-16 py-20 sm:py-24 lg:grid-cols-2 lg:py-32">
        <Reveal>
          <Chip variant="secondary" className="mb-6">
            Nigeria&apos;s Print-on-Demand Platform
          </Chip>
          <h1 className="text-hero text-foreground">
            Design it, <span className="text-secondary">we print it.</span>
          </h1>
          <p className="text-body mt-6 max-w-lg text-lg">
            Create custom signage, banners, business cards, and branded merchandise.
            Design online, and we handle the printing and delivery to your doorstep
            anywhere in Nigeria.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg" className="bg-secondary text-white hover:bg-secondary-600" asChild>
              <Link href="/products">
                Start Designing <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>
          <dl className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {trustPoints.map((point) => (
              <div key={point.label} className="flex items-center gap-2.5">
                <point.icon className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                <dt className="sr-only">Trust indicator</dt>
                <dd className="text-caption font-medium text-foreground">{point.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={150} className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div className="hover-lift absolute inset-0 overflow-hidden rounded-[2.5rem] shadow-xl">
              <Image
                src="/signagemain.jpg"
                alt="Premium signage and printing services"
                fill
                sizes="(max-width: 1024px) 100vw, 448px"
                className="object-cover"
                priority
              />
            </div>
            <div className="glass absolute -left-6 top-10 rounded-2xl px-4 py-3 shadow-lg">
              <p className="text-lg font-bold text-secondary">2,000+</p>
              <p className="text-caption">Happy businesses</p>
            </div>
            <div className="glass absolute -right-4 bottom-12 rounded-2xl px-4 py-3 shadow-lg">
              <p className="text-lg font-bold text-accent">Fast</p>
              <p className="text-caption">Nationwide delivery</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
