import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SubpageHero } from "@/components/shared/subpage-hero";
import { Reveal } from "@/components/motion/reveal";
import { TrackOrderForm } from "@/components/track-order/track-order-form";

export const metadata: Metadata = {
  title: "Track Order | AquaBest Brands",
  description:
    "Track the status of your AquaBest delivery. Enter your order number to see the latest updates.",
};

const helpChannels = [
  { icon: Phone, title: "Call Us", value: "+234 800 000 0000" },
  { icon: Mail, title: "Email Us", value: "hello@aquabestbrands.com" },
  { icon: MapPin, title: "Visit Us", value: "Lagos, Nigeria" },
];

export default function TrackOrderPage() {
  return (
    <>
      <SubpageHero
        eyebrow="Customer Support"
        title="Track Your Order"
        description="Enter your order number below to trace the status of your AquaBest delivery."
      />

      <Section background="white" spacing="lg">
        <TrackOrderForm />

        <Grid cols={3} gap="lg" className="mt-10">
          {helpChannels.map((channel, index) => (
            <Reveal key={channel.title} delay={index * 70} className="h-full">
              <div className="hover-lift flex h-full items-center gap-4 rounded-2xl border border-border bg-white p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <channel.icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-card-title text-foreground">{channel.title}</h3>
                  <p className="text-caption mt-0.5">{channel.value}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </Grid>
      </Section>
    </>
  );
}