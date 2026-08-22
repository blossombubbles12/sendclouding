import {
  Award,
  Factory,
  ShieldCheck,
  Palette,
  Truck,
  Headset,
} from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Industry-leading materials and printing technology for professional results.",
  },
  {
    icon: Palette,
    title: "Free Design Tool",
    description: "Design your prints online with our intuitive customization platform.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guarantee",
    description: "Not satisfied with the print quality? We'll reprint or refund, no questions.",
  },
  {
    icon: Factory,
    title: "Modern Facility",
    description: "State-of-the-art printing equipment operated by skilled professionals.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Fast, reliable shipping to every region across the Netherlands and the UK.",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    description: "Responsive customer care team ready to help with your design and orders.",
  },
];

export function WhyChoose() {
  return (
    <Section background="muted" spacing="lg">
      <Reveal>
        <SectionHeading
          eyebrow="Why Choose Send Clouding"
          title="Professional printing you can rely on"
          description="From design to delivery, we set the standard for quality print-on-demand in Europe."
        />
      </Reveal>
      <Grid cols={3} gap="lg" className="mt-14">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 60}>
            <div className="group hover-lift h-full rounded-3xl border border-border bg-white p-8 text-center transition-colors hover:border-secondary/20 sm:text-left">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary transition-all duration-300 group-hover:bg-secondary group-hover:text-white sm:mx-0">
                <feature.icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="text-card-title mt-5 text-foreground">{feature.title}</h3>
              <p className="text-body mt-2">{feature.description}</p>
            </div>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}
