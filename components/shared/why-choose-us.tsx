import { PenTool, Palette, Printer, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";

const reasons = [
  {
    icon: Palette,
    title: "Design It Yourself",
    description:
      "Use our free online design tool to customize any product. Upload your artwork or start from our templates.",
  },
  {
    icon: Printer,
    title: "Premium Quality Printing",
    description:
      "State-of-the-art digital and large-format printers using premium materials for vivid, durable results.",
  },
  {
    icon: Truck,
    title: "Fast Nationwide Delivery",
    description:
      "We deliver to every state in Nigeria. Track your order from production to your doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "Satisfaction Guaranteed",
    description:
      "Not happy with your print? We'll reprint or refund. Quality assurance on every single order.",
  },
];

export function WhyChooseUs() {
  return (
    <Section background="snow" spacing="lg" pattern="geometric">
      <Reveal>
        <SectionHeading
          eyebrow="Why Signages.ng"
          title="Professional printing made simple"
          description="We combine cutting-edge printing technology with a seamless design experience to deliver quality every time."
        />
      </Reveal>
      <Grid cols={4} gap="lg" className="mt-14">
        {reasons.map((reason, index) => (
          <Reveal key={reason.title} delay={index * 70} className="text-center sm:text-left">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary sm:mx-0">
              <reason.icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h3 className="text-card-title mt-5 text-foreground">{reason.title}</h3>
            <p className="text-body mt-2">{reason.description}</p>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}
