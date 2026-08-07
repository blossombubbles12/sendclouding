import Image from "next/image";
import { Section } from "@/components/layout/section";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/motion/reveal";

const highlights = [
  "State-of-the-art digital and large-format printing",
  "Free online design tool with professional templates",
  "Premium materials and expert finishing",
];

export function OurStory() {
  return (
    <Section background="white" spacing="lg">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="hover-lift relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lg">
            <Image
              src="/signageslide1.png"
              alt="Signages.ng printing facility"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="glass absolute -bottom-6 -right-4 hidden rounded-2xl px-6 py-4 shadow-lg sm:-right-8 lg:block">
            <p className="text-2xl font-bold text-secondary">2,000+</p>
            <p className="text-caption">Businesses served</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <Chip variant="secondary" className="mb-6">
            Our Story
          </Chip>
          <h2 className="text-section-heading text-foreground">
            From a dream to Nigeria&apos;s leading print platform
          </h2>
          <p className="text-body mt-6 text-lg">
            Signages.ng began with a simple belief: every Nigerian business, no matter
            its size, deserves access to professional-quality printing and signage. What
            started as a small print shop has grown into a full-service print-on-demand
            platform trusted by thousands of businesses across the country.
          </p>
          <ul className="mt-8 space-y-4">
            {highlights.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                <span className="text-body">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
