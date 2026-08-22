import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function CompanyOverview() {
  return (
    <Section background="snow" spacing="lg" pattern="wave">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <div className="hover-lift relative aspect-[4/3] overflow-hidden rounded-3xl bg-white">
            <Image
              src="/homepage1.png"
              alt="Signages.ng printing facility"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={100} className="order-1 lg:order-2">
          <Chip variant="secondary" className="mb-6">
            Our Story
          </Chip>
          <h2 className="text-section-heading text-foreground">
            We make your brand visible
          </h2>
          <p className="text-body mt-6 text-lg">
            Signages.ng was born from a simple belief: every business deserves
            access to premium printing and signage. From startups to corporations, we
            provide the tools and quality to make your brand impossible to ignore.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "State-of-the-art digital and large-format printing",
              "Free online design tool with professional templates",
              "Nationwide delivery across the Netherlands and the UK",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                <span className="text-body">{point}</span>
              </li>
            ))}
          </ul>
          <Button className="mt-8" variant="outline" asChild>
            <Link href="/about">
              Learn more about us <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
