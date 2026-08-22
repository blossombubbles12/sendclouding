import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Factory, Code, Users, Truck, BarChart3, ShieldCheck, Heart, Zap, Globe, Award, MapPin, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { SubpageHero } from "@/components/shared/subpage-hero";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Careers | Send Clouding",
  description: "Join Send Clouding — Europe's modern logistics technology platform. We're hiring engineers, operators, sales, and support to build the future of delivery.",
  openGraph: {
    title: "Careers | Send Clouding",
    description: "Build the future of European logistics. Open roles in engineering, operations, sales, and support.",
    type: "website",
  },
};

const departments = [
  { icon: Code, title: "Engineering", roles: 5, color: "bg-sky-500" },
  { icon: Factory, title: "Operations & Logistics", roles: 8, color: "bg-emerald-500" },
  { icon: Users, title: "Customer Experience", roles: 4, color: "bg-purple-500" },
  { icon: BarChart3, title: "Growth & Sales", roles: 3, color: "bg-orange-500" },
  { icon: ShieldCheck, title: "Security & Compliance", roles: 2, color: "bg-indigo-500" },
];

const roles = [
  {
    title: "Senior Backend Engineer (Go/PostgreSQL)",
    department: "Engineering",
    type: "Full-time",
    location: "Amsterdam (Hybrid)",
    level: "Senior",
  },
  {
    title: "Frontend Engineer (React/Next.js)",
    department: "Engineering",
    type: "Full-time",
    location: "Amsterdam (Hybrid)",
    level: "Mid-Senior",
  },
  {
    title: "DevOps / Platform Engineer",
    department: "Engineering",
    type: "Full-time",
    location: "Amsterdam (Hybrid)",
    level: "Senior",
  },
  {
    title: "Mobile Engineer (React Native)",
    department: "Engineering",
    type: "Full-time",
    location: "Amsterdam (Hybrid)",
    level: "Mid",
  },
  {
    title: "QA Automation Engineer",
    department: "Engineering",
    type: "Full-time",
    location: "Amsterdam (Hybrid)",
    level: "Mid",
  },
  {
    title: "Hub Operations Manager",
    department: "Operations & Logistics",
    type: "Full-time",
    location: "Amsterdam / London / Manchester",
    level: "Mid-Senior",
  },
  {
    title: "Last-Mile Operations Lead",
    department: "Operations & Logistics",
    type: "Full-time",
    location: "London",
    level: "Senior",
  },
  {
    title: "Fleet & Driver Operations",
    department: "Operations & Logistics",
    type: "Full-time",
    location: "Multiple Hubs",
    level: "Mid",
  },
  {
    title: "Sorting Hub Supervisor",
    department: "Operations & Logistics",
    type: "Full-time",
    location: "Various Hubs",
    level: "Mid",
  },
  {
    title: "Route Optimization Analyst",
    department: "Operations & Logistics",
    type: "Full-time",
    location: "Amsterdam",
    level: "Mid",
  },
  {
    title: "Customer Support Specialist",
    department: "Customer Experience",
    type: "Full-time",
    location: "Amsterdam (Remote-friendly)",
    level: "Entry-Mid",
  },
  {
    title: "Technical Support Engineer",
    department: "Customer Experience",
    type: "Full-time",
    location: "Amsterdam (Hybrid)",
    level: "Mid",
  },
  {
    title: "Account Manager — Business",
    department: "Customer Experience",
    type: "Full-time",
    location: "London",
    level: "Mid-Senior",
  },
  {
    title: "Onboarding & Success Manager",
    department: "Customer Experience",
    type: "Full-time",
    location: "Amsterdam",
    level: "Mid",
  },
  {
    title: "Business Development Manager",
    department: "Growth & Sales",
    type: "Full-time",
    location: "London",
    level: "Senior",
  },
  {
    title: "Partnerships & Integrations Lead",
    department: "Growth & Sales",
    type: "Full-time",
    location: "Amsterdam",
    level: "Senior",
  },
  {
    title: "Growth Marketing Manager",
    department: "Growth & Sales",
    type: "Full-time",
    location: "Amsterdam",
    level: "Mid-Senior",
  },
];

const values = [
  { icon: Zap, title: "Move Fast, Ship Faster", description: "We iterate quickly, deploy daily, and measure impact in days — not quarters." },
  { icon: Heart, title: "Customer Obsession", description: "Every decision starts with the sender and recipient. We listen, fix, and delight." },
  { icon: Globe, title: "European Impact", description: "Your code ships packages from Amsterdam to Glasgow. Real-world impact at scale." },
  { icon: Award, title: "Engineering Excellence", description: "Clean code, solid architecture, thorough testing. We build for the long term." },
  { icon: Users, title: "Team First", description: "Collaborative, inclusive, ego-free. We win together or learn together." },
  { icon: ShieldCheck, title: "Trust & Transparency", description: "Open salaries, shared metrics, honest feedback. No politics, no surprises." },
];

const benefits = [
  "Competitive salary + equity (ESOP for all full-time)",
  "Health insurance (you + dependents) + pension",
  "€1,200 annual learning budget (courses, conferences, books)",
  "Flexible hybrid: 3 days office, 2 days remote",
  "Latest MacBook Pro + monitor + accessories",
  "25 days annual leave + public holidays",
  "Parental leave: 16 weeks (primary) / 4 weeks (secondary)",
  "Quarterly team offsites across Europe",
  "Free Send Clouding shipments for personal use",
];

export default function CareersPage() {
  return (
    <>
      <SubpageHero
        eyebrow="Join the Mission"
        title="Build the future of European logistics"
        description="We're a team of builders, operators, and problem-solvers making delivery simple, transparent, and reliable for millions. Come ship with us."
      />

      <Section background="white" spacing="lg">
        <Reveal>
          <SectionHeading
            eyebrow="Open Roles"
            title="We're hiring across the board"
            description="From backend engineers to hub managers — every role moves Europe's logistics forward."
          />
        </Reveal>

        <Grid cols={2} gap="lg" className="mt-14">
          {roles.map((role, index) => (
            <Reveal key={role.title} delay={index * 30} className="h-full">
              <Card className="h-full hover:border-secondary/30 transition-colors group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className={cn("text-xs", role.level === "Senior" && "bg-emerald-500")}>
                      {role.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{role.type}</Badge>
                  </div>
                  <h3 className="text-card-title text-foreground group-hover:text-secondary transition-colors">{role.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-caption text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {(() => {
                        switch (role.department) {
                          case "Engineering": return <Code className="h-3 w-3" />;
                          case "Operations & Logistics": return <Factory className="h-3 w-3" />;
                          case "Customer Experience": return <Users className="h-3 w-3" />;
                          case "Growth & Sales": return <BarChart3 className="h-3 w-3" />;
                          default: return <ShieldCheck className="h-3 w-3" />;
                        }
                      })()}
                      {role.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {role.location}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 justify-start self-start px-0"
                    asChild
                  >
                    <Link href="/contact?role={encodeURIComponent(role.title)}">
                      Apply <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Section>

      <Section background="muted" spacing="lg" pattern="dots">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="text-section-heading text-foreground">Why Send Clouding?</h2>
            <p className="text-body mt-5 text-lg">We're not just another logistics company — we're a technology platform transforming how Europe moves.</p>
            <ul className="mt-8 space-y-6">
              {values.map((value, index) => (
                <Reveal key={value.title} delay={index * 100}>
                  <li className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <value.icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-card-title text-foreground">{value.title}</h3>
                      <p className="text-body mt-1">{value.description}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <div className="space-y-6">
              <h3 className="text-section-heading text-foreground">Benefits & Perks</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <Reveal key={benefit} delay={index * 50}>
                    <li className="flex items-start gap-3 p-4 rounded-xl bg-white border border-border hover:border-secondary/30 transition-colors">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                      <span className="text-body">{benefit}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
              <Reveal delay={200} className="mt-4">
                <Button variant="outline" asChild>
                  <Link href="/contact">View Full Benefits <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                </Button>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section background="primary" spacing="lg" pattern="band" className="text-white">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-section-heading text-white">Don't see your perfect role?</h2>
          <p className="text-body mt-4 text-white/80">We're always looking for exceptional people. Send us your CV and tell us how you'd contribute.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-secondary text-white hover:bg-secondary-600 w-full sm:w-auto" asChild>
              <Link href="/contact">Send Your CV <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto" asChild>
              <Link href="/about">Learn About Us</Link>
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}