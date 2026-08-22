import { Target, Sparkles } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";

const cards = [
  {
    icon: Target,
    eyebrow: "Our Mission",
    title: "Mission",
    description:
      "Make professional printing and signage accessible to every business and individual in Europe, with quality that rivals global standards.",
    tone: "secondary",
  },
  {
    icon: Sparkles,
    eyebrow: "Our Vision",
    title: "Vision",
    description:
      "Become Europe's most trusted print-on-demand platform, empowering brands to express themselves through premium printed products.",
    tone: "accent",
  },
] as const;

export function MissionVision() {
  return (
    <Section background="muted" spacing="lg">
      <Reveal>
        <SectionHeading
          eyebrow="Our Purpose"
          title="Driven by a clear mission and vision"
          description="Everything we do points toward one goal — helping brands make their mark."
        />
      </Reveal>
      <Grid cols={2} gap="lg" className="mt-14">
        {cards.map((card, index) => (
          <Reveal key={card.title} delay={index * 100}>
            <div className="hover-lift relative h-full overflow-hidden rounded-3xl border border-border bg-white p-9 sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-secondary-50 to-accent/10"
              />
              <div className="relative">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <card.icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <p className="mt-7 text-caption font-semibold uppercase tracking-widest text-secondary-700">
                  {card.eyebrow}
                </p>
                <h3 className="text-section-heading mt-2 text-foreground">{card.title}</h3>
                <p className="text-body mt-4 text-lg">{card.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}
