import { Gem, Scale, Lightbulb, Star, ShieldCheck, HeartHandshake } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";

const values = [
  {
    icon: Gem,
    title: "Quality",
    description: "Premium materials and printing techniques that make your brand stand out.",
  },
  {
    icon: Scale,
    title: "Integrity",
    description: "Transparent pricing, honest timelines, and promises we always keep.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Modern printing technology and design tools keep us ahead of the curve.",
  },
  {
    icon: Star,
    title: "Craftsmanship",
    description: "Expert finishing, color accuracy, and attention to detail in every print.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    description: "Consistent quality and delivery you can count on, order after order.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    description: "Your satisfaction is our priority. We print, you approve, we deliver.",
  },
];

export function Values() {
  return (
    <Section background="white" spacing="lg">
      <Reveal>
        <SectionHeading
          eyebrow="Our Values"
          title="The principles behind every print"
          description="Six values guide how we design, print, and deliver every product bearing the Signages.ng name."
        />
      </Reveal>
      <Grid cols={3} gap="lg" className="mt-14">
        {values.map((value, index) => (
          <Reveal key={value.title} delay={index * 60}>
            <div className="group hover-lift h-full rounded-3xl border border-border bg-white p-8 transition-colors hover:border-secondary/20">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary transition-all duration-300 group-hover:bg-secondary group-hover:text-white">
                <value.icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="text-card-title mt-5 text-foreground">{value.title}</h3>
              <p className="text-body mt-2">{value.description}</p>
            </div>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}
