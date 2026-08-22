import type { Metadata } from "next";
import Image from "next/image";
import { Package, ArrowRight, Truck, MapPin, ShieldCheck, Users, Target, Heart, Zap, Globe, Award, Building2, Leaf, Lightbulb, Recycle } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | Send Clouding",
  description: "Send Clouding is Europe's modern logistics technology platform. We make shipping simple, transparent, and reliable with real-time tracking, instant quotes, and coverage across the Netherlands and the UK.",
  openGraph: {
    title: "About Us | Send Clouding",
    description: "Modern logistics technology platform. Ship packages, track shipments in real-time, and manage deliveries with confidence.",
    type: "website",
  },
};

const milestones = [
  { year: "2023", title: "Founded", description: "Started with a vision to modernize European logistics" },
  { year: "2023", title: "First 100 Cities", description: "Launched coverage across major Dutch and British cities" },
  { year: "2024", title: "API & Integrations", description: "Released REST API and Shopify/WooCommerce plugins" },
  { year: "2024", title: "Full Coverage", description: "Expanded to every region of the Netherlands and the UK with 30+ hubs" },
  { year: "2024", title: "1M+ Shipments", description: "Delivered over 1 million packages across Europe" },
  { year: "2025", title: "Cold Chain Launch", description: "Added temperature-controlled delivery for pharma & perishables" },
];

const values = [
  { icon: Target, title: "Customer Obsession", description: "Every decision starts with the customer. We listen, iterate, and deliver experiences that exceed expectations." },
  { icon: Zap, title: "Speed & Efficiency", description: "We move fast — in shipping and in innovation. Automation and technology eliminate friction at every step." },
  { icon: ShieldCheck, title: "Trust & Transparency", description: "Real-time tracking, honest pricing, and proactive communication. No hidden fees, no surprises." },
  { icon: Heart, title: "Care in Every Detail", description: "From fragile handling to temperature control, we treat every package like it's our own." },
  { icon: Globe, title: "European Reach", description: "We connect every corner of the Netherlands and the UK. Remote villages to major metros — no address is out of reach." },
  { icon: Lightbulb, title: "Continuous Innovation", description: "We constantly improve our network, technology, and service. Yesterday's best is today's baseline." },
];

const team = [
  { name: "Lars van der Berg", role: "Co-founder & CEO", bio: "Former logistics lead at a major European e-commerce platform. 15+ years in supply chain across Benelux and DACH." },
  { name: "Sophie Müller", role: "Co-founder & CTO", bio: "Built scalable platforms at leading fintechs in Berlin and London. Passionate about developer experience and open source." },
  { name: "Thomas Dubois", role: "VP Operations", bio: "Ex-DHL & DB Schenker. Deep expertise in last-mile delivery and network optimization across Western Europe." },
  { name: "Elena Rossi", role: "VP Customer Experience", bio: "Led support teams at top European tech companies. Obsessed with customer satisfaction and multilingual support excellence." },
];

const investors = [
  "Project A",
  "Northzone",
  "Atomico",
  "LocalGlobe",
  "Angels: Pieter van der Does, Niklas Östberg, Daniel Dines",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary">
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/about-hero.png"
            alt="Send Clouding logistics operations"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(2,6,23,0.92) 0%, rgba(15,23,42,0.82) 50%, rgba(2,6,23,0.9) 100%)",
            }}
          />
        </div>

        <Container className="relative flex min-h-[70vh] items-center py-20 sm:py-28 lg:py-32">
          <Reveal className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-secondary mx-auto">
              <Package className="h-8 w-8" aria-hidden="true" />
            </div>
            <h1 className="text-page-title text-white">Building the Future of European Logistics</h1>
            <p className="text-body mt-6 max-w-xl mx-auto text-lg text-white/80">
              Send Clouding was founded on a simple belief: shipping in Europe should be as easy as sending a message. 
              We combine technology, network, and care to deliver packages with confidence.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/ship">Ship a Package <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-primary-900 border-white hover:bg-white/90 active:bg-white" asChild>
                <Link href="/contact">Talk to Our Team</Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Our Story */}
      <Section background="white" spacing="lg" pattern="dots">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Our Story"
              title="From frustration to innovation"
              description="Our founders experienced the pain of unreliable shipping firsthand — lost packages, no tracking, hidden fees, and weeks of uncertainty. They decided to build the solution."
            />
          </Reveal>
          <Reveal delay={100} className="mt-14">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <p className="text-body text-lg">
                  In 2023, Chidi and Adaeze were running an e-commerce business and constantly battling logistics nightmares. 
                  Packages disappeared, customers couldn't track orders, and "next-day" delivery often meant "next-week."
                </p>
                <p className="text-body">
                  They realized the problem wasn't capacity — it was visibility and technology. Traditional couriers operated on paper and phone calls. 
                  Customers deserved Uber-level tracking for their shipments.
                </p>
                <p className="text-body">
                  So they built Send Clouding: a logistics platform where every shipment is tracked in real-time, 
                  every quote is instant and transparent, and every delivery is confirmed with photo and GPS proof.
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <Award className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">2,000+ businesses trust us</p>
                    <p className="text-caption text-muted-foreground">99.2% on-time delivery rate</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="/about2.png"
                    alt="Send Clouding logistics network"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-secondary-900/60 to-accent-900/40" />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="text-center text-white">
                      <Package className="mx-auto h-24 w-24 text-white/30 mb-4" aria-hidden="true" />
                      <p className="text-foreground/60 text-white/80">Our logistics network spans 500+ cities</p>
                      <p className="text-3xl font-bold text-white mt-2">30+</p>
                      <p className="text-white/70">Sorting Hubs</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-border animate-float-subtle">
                  <p className="text-2xl font-bold text-secondary">1M+</p>
                  <p className="text-caption text-muted-foreground">Shipments Delivered</p>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Milestones */}
      <Section background="muted" spacing="md" pattern="route">
        <Container>
          <Reveal className="text-center">
            <SectionHeading
              eyebrow="Milestones"
              title="Our journey so far"
              description="Key moments that shaped Send Clouding into Europe's leading logistics technology platform."
            />
          </Reveal>
          <div className="mt-10 relative">
            {/* Central timeline line — subtle, premium */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-border/40 to-transparent lg:left-[calc(50%-0.5px)]" />
            
            <div className="space-y-8 lg:space-y-10">
              {milestones.map((milestone, index) => {
                const isLast = index === milestones.length - 1;
                const isLeft = index % 2 === 0;
                
                return (
                  <Reveal 
                    key={`${milestone.year}-${index}`} 
                    delay={120 + index * 60}
                    className={`relative ${isLeft ? 'lg:flex lg:items-start' : 'lg:flex lg:items-start lg:flex-row-reverse'}`}
                  >
                    {/* Timeline connector column */}
                    <div className="relative lg:w-1/2 lg:pr-6 lg:flex lg:items-start lg:justify-end min-h-[100px]">
                      <div className="absolute left-1/2 top-[40px] -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-1/2 lg:-translate-x-[12px] z-10 flex flex-col items-center">
                        {/* Connecting line to center — only on desktop */}
                        <div className="hidden lg:block w-[calc(50%-1.5rem)] h-[1px] bg-border/30" />
                        
                        {/* Timeline Dot — Double Bezel Architecture */}
                        <div className="relative group">
                          {/* Outer Shell — subtle glass bezel */}
                          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/50 backdrop-blur-sm ring-1 ring-border/30 shadow-[0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.3)] group-hover:ring-secondary/30">
                            {/* Inner Core — the actual dot */}
                            <div className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                              isLast
                                ? 'bg-gradient-to-br from-secondary via-orange-500 to-secondary text-white shadow-[0_0_0_3px_rgba(255,107,0,0.2),0_4px_10px_rgba(255,107,0,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_0_5px_rgba(255,107,0,0.25),0_6px_18px_rgba(255,107,0,0.3)]'
                                : 'bg-white text-muted-foreground shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] group-hover:bg-primary/5 group-hover:text-primary group-hover:shadow-[0_0_0_3px_rgba(14,165,233,0.15),inset_0_1px_2px_rgba(0,0,0,0.06)]'
                            }`}>
                              {isLast ? (
                                <svg className="h-4.5 w-4.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                              ) : (
                                <span className="text-[10px] font-medium tracking-tight">{index + 1}</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Pulse ring on hover for last milestone */}
                          {isLast && (
                            <div className="absolute inset-0 rounded-full bg-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 animate-ping" aria-hidden="true" />
                          )}
                        </div>
                        
                        {/* Year label on mobile only */}
                        <div className="lg:hidden mt-2.5 text-center w-[180px] -translate-x-1/2 left-1/2 absolute">
                          <div className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2.5 py-1 text-[10px] font-semibold text-primary">
                            <span className="relative h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                            {milestone.year}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Milestone Card — Double Bezel Architecture */}
                    <div className="relative w-full lg:w-1/2 lg:pl-6 lg:mt-2">
                      {/* Outer Shell */}
                      <div className="relative bg-white/50 backdrop-blur-sm ring-1 ring-border/30 rounded-[1.25rem] shadow-[0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:ring-secondary/20 hover:-translate-y-0.5 ${
                        isLast ? 'ring-secondary/20 bg-gradient-to-br from-white via-white to-primary/5' : ''
                      } group">
                        {/* Inner Core */}
                        <div className="relative p-5 lg:p-6 rounded-[calc(1.25rem-2px)] bg-white/80 backdrop-blur-sm">
                          {/* Year badge — premium pill */}
                          <div className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-3 py-1 text-[10px] font-semibold text-primary mb-4 tracking-wide uppercase">
                            <span className="relative h-1.5 w-1.5 rounded-full bg-secondary animate-pulse-subtle" aria-hidden="true" />
                            {milestone.year}
                          </div>
                          
                          {/* Title with optional "Latest" badge */}
                          <h3 className="text-card-title text-foreground font-semibold tracking-tight mb-2.5 leading-snug flex items-baseline gap-2.5">
                            {milestone.title}
                            {isLast && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-medium uppercase tracking-wider whitespace-nowrap shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                                Latest
                              </span>
                            )}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-body text-muted-foreground leading-relaxed text-sm">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Year label on desktop — positioned elegantly */}
                      <div className="hidden lg:block absolute -top-3 left-0 lg:left-auto lg:right-0 w-fit">
                        <div className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-3 py-1 text-[10px] font-semibold text-primary tracking-wide uppercase shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
                          <span className="relative h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                          {milestone.year}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section background="white" spacing="lg" pattern="dots">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Our Values"
              title="What drives us"
              description="These principles guide every decision we make — from product design to customer support to network expansion."
            />
          </Reveal>
          <Grid cols={3} gap="lg" className="mt-14">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 70}>
                <Card className="h-full hover:border-secondary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <value.icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <h3 className="text-card-title text-foreground">{value.title}</h3>
                    <p className="text-body mt-2">{value.description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Team */}
      <Section background="muted" spacing="lg" pattern="geometric">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Leadership"
              title="The team behind the mission"
              description="Experienced operators and builders who've scaled logistics and technology businesses across Europe."
            />
          </Reveal>
          <Grid cols={4} gap="lg" className="mt-14">
            {team.map((member, index) => (
              <Reveal key={member.name} delay={index * 70} className="text-center">
                <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-secondary/20 to-accent/20">
                  <Users className="h-14 w-14 text-secondary" aria-hidden="true" />
                </div>
                <h3 className="text-card-title text-foreground">{member.name}</h3>
                <p className="text-sm text-secondary font-medium">{member.role}</p>
                <p className="text-caption text-muted-foreground mt-2">{member.bio}</p>
              </Reveal>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Investors */}
      <section className="relative bg-[#F1F3F4] py-20 sm:py-28 lg:py-32">
        <Container>
          <Reveal className="text-center">
            <SectionHeading
              eyebrow="Backed By"
              title="Trusted by leading investors"
              description="We're supported by Europe's top venture capital firms and angel investors who believe in our vision."
            />
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground/60">
              {investors.map((investor, i) => (
                <span key={i} className="text-sm font-medium">{investor}</span>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Impact */}
      <section className="relative isolate overflow-hidden bg-primary text-white">
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/aboutusbottom.png"
            alt="Send Clouding logistics network and facilities"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Dark gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(2,6,23,0.92) 0%, rgba(15,23,42,0.88) 40%, rgba(15,23,42,0.85) 60%, rgba(2,6,23,0.9) 100%)",
            }}
          />
          {/* Bottom fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-32"
            style={{
              background: "linear-gradient(to top, rgba(2,6,23,0.95), transparent)",
            }}
          />
        </div>

        <Container className="relative py-20 sm:py-28 lg:py-32">
          <Reveal>
            <div className="grid gap-8 md:grid-cols-4 text-center">
              {[
                { icon: Building2, value: "500+", label: "Cities Connected" },
                { icon: Truck, value: "30+", label: "Sorting Hubs" },
                { icon: Leaf, value: "Carbon", label: "Neutral Goal 2026" },
                { icon: Recycle, value: "100%", label: "Recyclable Packaging" },
              ].map((stat, index) => (
                <Reveal key={stat.label} delay={index * 70}>
                  <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
                      <stat.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                    <p className="text-sm text-white/70 mt-1">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <Section background="muted" spacing="lg" pattern="cloud">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-section-heading text-foreground">Join Us on the Journey</h2>
            <p className="text-body mt-4 text-muted-foreground">Whether you're a customer, partner, or future team member — we'd love to hear from you.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/ship">Start Shipping <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/careers">View Careers</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="/press">Press Kit</Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}