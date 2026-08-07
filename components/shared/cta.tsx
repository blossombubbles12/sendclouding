import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function CTA() {
  return (
    <Section background="white" spacing="lg">
      <Reveal className="hover-lift relative overflow-hidden rounded-[2rem] bg-primary px-8 py-16 text-center sm:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,rgb(249_115_22/0.2),transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_40%_at_80%_100%,rgb(99_102_241/0.15),transparent)]"
        />
        <div className="relative">
          <h2 className="text-section-heading text-white">
            Ready to make your brand stand out?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">
            Start designing your custom signage, business cards, and branded merchandise today.
            Premium quality, delivered to your door.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-secondary text-white hover:bg-secondary-600" asChild>
              <Link href="/products">
                Start Designing <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
