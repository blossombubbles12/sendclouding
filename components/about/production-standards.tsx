import Image from "next/image";
import { BadgeCheck, Palette, Printer, Wrench, ClipboardCheck } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/motion/reveal";

const standards = [
  {
    icon: BadgeCheck,
    step: "01",
    title: "Quality Materials",
    description: "Premium papers, vinyls, fabrics, and inks sourced from trusted global suppliers.",
  },
  {
    icon: Palette,
    step: "02",
    title: "Color Accuracy",
    description: "Advanced color calibration ensures your brand colors print exactly as designed.",
  },
  {
    icon: Printer,
    step: "03",
    title: "Modern Equipment",
    description: "State-of-the-art digital and large-format printers for consistent, high-resolution output.",
  },
  {
    icon: Wrench,
    step: "04",
    title: "Expert Finishing",
    description: "Professional cutting, lamination, mounting, and binding by skilled technicians.",
  },
  {
    icon: ClipboardCheck,
    step: "05",
    title: "Quality Control",
    description: "Multi-point inspection before any order leaves our facility.",
  },
];

export function ProductionStandards() {
  return (
    <Section background="white" spacing="lg">
      <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <Chip variant="secondary" className="mb-6">
              Our Standards
            </Chip>
            <h2 className="text-section-heading text-foreground">
              Rigorous quality at every step
            </h2>
            <p className="text-body mt-5 text-lg">
              From material selection to final inspection, five pillars of excellence
              guide everything we print.
            </p>
          </Reveal>

          <ol className="mt-10 space-y-0">
            {standards.map((item, index) => (
              <li key={item.title}>
                <Reveal delay={index * 60}>
                  <div className="group relative flex gap-5 pb-8 last:pb-0">
                    {index < standards.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[1.35rem] top-14 h-[calc(100%-3.5rem)] w-px bg-border"
                      />
                    )}
                    <span className="relative z-10 mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary transition-all duration-300 group-hover:bg-secondary group-hover:text-white">
                      <item.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-caption font-semibold text-secondary-700">
                          {item.step}
                        </span>
                        <h3 className="text-card-title text-foreground">{item.title}</h3>
                      </div>
                      <p className="text-body mt-1.5">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Reveal delay={120} className="lg:sticky lg:top-28">
          <div className="hover-lift relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lg">
            <Image
              src="/signageslide3.png"
              alt="Signages.ng printing facility"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
