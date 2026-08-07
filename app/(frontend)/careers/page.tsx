import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Factory,
  ClipboardList,
  Truck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { SubpageHero } from "@/components/shared/subpage-hero";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Careers | AquaBest Brands",
  description:
    "Join the AquaBest Brands team. Explore open roles in water production, bakeries, distribution, and more.",
};

const departments = [
  { icon: Factory, title: "Water Production", roles: 3 },
  { icon: ClipboardList, title: "Quality Assurance", roles: 2 },
  { icon: Truck, title: "Logistics & Distribution", roles: 4 },
  { icon: Sparkles, title: "Bakeries", roles: 5 },
  { icon: Wrench, title: "Engineering & Maintenance", roles: 1 },
];

const roles = [
  {
    title: "Production Technician — Water",
    department: "Water Production",
    type: "Full-time",
    location: "Lagos",
  },
  {
    title: "Artisan Baker",
    department: "Bakeries",
    type: "Full-time",
    location: "Lagos",
  },
  {
    title: "Quality Control Officer",
    department: "Quality Assurance",
    type: "Full-time",
    location: "Lagos",
  },
  {
    title: "Distribution Driver",
    department: "Logistics & Distribution",
    type: "Full-time",
    location: "Lagos",
  },
  {
    title: "Sales Representative",
    department: "Sales",
    type: "Full-time",
    location: "Various",
  },
];

const perks = [
  "Competitive salary & performance bonuses",
  "Health and safety-first work environment",
  "Training and career progression programs",
  "Team meals and on-site refreshments",
  "Steady, reliable employment",
];

export default function CareersPage() {
  return (
    <>
      <SubpageHero
        eyebrow="Join Our Team"
        title="Careers at AquaBest Brands"
        description="Looking to grow with a company that values quality, craft, and its people? Explore open opportunities with us."
      />

      <Section background="white" spacing="lg">
        <Reveal>
          <SectionHeading
            eyebrow="Open Positions"
            title="We're hiring across our teams"
            description="We're always on the lookout for talented, dedicated people who share our passion for quality."
          />
        </Reveal>

        <Grid cols={2} gap="lg" className="mt-14">
          {roles.map((role, index) => (
            <Reveal key={role.title} delay={index * 60} className="h-full">
              <div className="group hover-lift flex h-full flex-col rounded-2xl border border-border bg-white p-6">
                <div className="flex items-center gap-3">
                  <Badge variant="muted">{role.department}</Badge>
                  <Badge variant="outline">{role.type}</Badge>
                </div>
                <h3 className="text-card-title mt-4 text-foreground">{role.title}</h3>
                <p className="text-caption mt-1">{role.location}</p>
                <Button
                  variant="link"
                  className="mt-5 justify-start self-start px-0"
                  asChild
                >
                  <Link href="/contact">
                    Apply now <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          ))}
        </Grid>
      </Section>

      <Section background="muted" spacing="lg">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="text-section-heading text-foreground">
              Why work with us?
            </h2>
            <p className="text-body mt-5 text-lg">
              At AquaBest, we believe great products come from great people. We invest
              in our teams, provide safe workplaces, and grow together as a family.
            </p>
            <ul className="mt-8 space-y-4">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span className="text-body">{perk}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-1 gap-4">
              {departments.map((dept) => (
                <div
                  key={dept.title}
                  className="hover-lift flex items-center justify-between rounded-2xl border border-border bg-white p-5"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <dept.icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-card-title text-foreground">{dept.title}</h3>
                      <p className="text-caption mt-0.5">
                        {dept.roles} open position{dept.roles === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    aria-label={`View ${dept.title} roles`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-primary hover:text-white"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              ))}
              <Reveal delay={200}>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/contact">
                    Don&apos;t see your role? Send us your CV
                  </Link>
                </Button>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}