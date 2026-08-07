import type { Metadata } from "next";
import Image from "next/image";
import {
  Factory,
  ShieldCheck,
  Cpu,
  Sparkles,
  Award,
  CheckCircle2,
  Droplets,
} from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { SubpageHero } from "@/components/shared/subpage-hero";
import { Reveal } from "@/components/motion/reveal";
import { Chip } from "@/components/ui/chip";

export const metadata: Metadata = {
  title: "Our Facilities | AquaBest Brands",
  description:
    "Explore AquaBest Brands modern water production and artisan bakery facilities built for quality, hygiene, and freshness.",
};

const facilities = [
  {
    icon: Factory,
    title: "AquaBest Water Production",
    description:
      "A state-of-the-art bottling facility with multi-stage filtration, reverse osmosis, and UV sterilization to deliver pure, safe drinking water.",
  },
  {
    icon: Sparkles,
    title: "AquaBest Bakeries",
    description:
      "Our artisan bakery runs before sunrise each day, crafting fresh breads, pastries, cakes, and confectioneries with quality ingredients.",
  },
  {
    icon: Cpu,
    title: "Modern Equipment",
    description:
      "Automated, advanced machinery ensures precision, consistency, and efficiency across every line.",
  },
  {
    icon: ShieldCheck,
    title: "Hygiene & Safety",
    description:
      "Sanitized environments and trained staff keep food safety and hygiene at the center of everything we do.",
  },
];

export default function FacilitiesPage() {
  return (
    <>
      <SubpageHero
        eyebrow="Behind the Brand"
        title="Our Facilities"
        description="A closer look at the modern production facilities where we craft every AquaBest product."
      />

      <Section background="white" spacing="lg">
        <Reveal>
          <SectionHeading
            eyebrow="Inside AquaBest"
            title="Built for quality, designed for trust"
            description="Every facility is engineered around one goal: producing premium, safe, and fresh products consistently."
          />
        </Reveal>

        <Grid cols={2} gap="lg" className="mt-14">
          {facilities.map((facility, index) => (
            <Reveal key={facility.title} delay={index * 60} className="h-full">
              <div className="hover-lift flex h-full flex-col rounded-2xl border border-border bg-white p-8">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <facility.icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="text-card-title mt-5 text-foreground">{facility.title}</h3>
                <p className="text-body mt-2">{facility.description}</p>
              </div>
            </Reveal>
          ))}
        </Grid>
      </Section>

      <Section background="muted" spacing="lg">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="hover-lift relative aspect-[16/11] overflow-hidden rounded-[2rem] shadow-lg">
              <Image
                src="/homepageabout2.png"
                alt="AquaBest modern production facility"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Chip variant="secondary" className="mb-6">
              Quality First
            </Chip>
            <h2 className="text-section-heading text-foreground">
              Every facility, held to the same high standard
            </h2>
            <p className="text-body mt-5 text-lg">
              Whether it&apos;s water production or the bakery, every AquaBest facility
              follows the same rigorous standards of quality, safety, and hygiene.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "NAFDAC-certified processes and products",
                "Strict quality control at every step",
                "Clean, hygienic, and well-maintained facilities",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <span className="text-body">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section background="primary" spacing="md">
        <Grid cols={3} gap="lg">
          {[
            { icon: Award, value: "2", label: "World-class facilities" },
            { icon: Droplets, value: "100%", label: "Hygiene-focused processing" },
            { icon: CheckCircle2, value: "24/7", label: "Quality monitoring" },
          ].map((item, index) => (
            <Reveal key={item.label} delay={index * 70} className="text-center">
              <div className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                <item.icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <p className="text-4xl font-bold tracking-tight text-white">{item.value}</p>
              <p className="text-sm font-medium text-white/70">{item.label}</p>
            </div>
            </Reveal>
          ))}
        </Grid>
      </Section>
    </>
  );
}