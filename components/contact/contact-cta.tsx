import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function ContactCTA() {
  return (
    <Section background="white" spacing="lg">
      <Reveal className="hover-lift relative overflow-hidden rounded-[2rem] bg-primary px-8 py-16 text-center sm:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_90%_at_50%_0%,rgb(249_115_22/0.2),transparent)]"
        />
        <div className="relative">
          <h2 className="text-section-heading text-white">
            Ready to ship with Send Clouding?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Get a custom quote for your shipping volumes or track an existing
            shipment in real time — our team is here to help.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-secondary text-white hover:bg-secondary-600" asChild>
              <Link href="/quote">
                Get a Quote <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/track">Track a Shipment</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
