import Link from "next/link";
import { ArrowRight, PenTool, Printer } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";

const actions = [
  {
    icon: PenTool,
    title: "Start Designing",
    description: "Customize signage, banners, and more with our online design tool.",
    href: "/products?category=outdoor-banners",
    label: "Design Now",
  },
  {
    icon: Printer,
    title: "Business Printing",
    description: "Professional business cards, flyers, and stationery for your brand.",
    href: "/products?category=business-cards",
    label: "Print Now",
  },
];

export function AboutCTA() {
  return (
    <Section background="white" spacing="lg">
      <Reveal className="hover-lift relative overflow-hidden rounded-[2rem] bg-primary px-8 py-16 sm:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_90%_at_50%_0%,rgb(249_115_22/0.2),transparent)]"
        />
        <div className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-section-heading text-white">
              Ready to make your brand stand out?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Join thousands of businesses and individuals who trust Send Clouding for their
              printing and signage needs.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {actions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-6 text-left transition-colors hover:bg-white/20"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-secondary">
                  <action.icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-lg font-semibold text-white">
                    {action.title}
                  </span>
                  <span className="mt-1 block text-sm text-white/70">
                    {action.description}
                  </span>
                </span>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
                  {action.label}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
