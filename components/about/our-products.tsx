import Image from "next/image";
import { PenTool, Printer } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/motion/reveal";

const products = [
  {
    icon: PenTool,
    eyebrow: "Signage & Banners",
    title: "Large-format printing that commands attention",
    description:
      "From outdoor banners to indoor displays, we produce vibrant, durable signage using premium materials and state-of-the-art large-format printers. Every print is color-calibrated and weather-resistant.",
    image: "/signageslide1.png",
    imageAlt: "Premium signage printing",
    reverse: false,
  },
  {
    icon: Printer,
    eyebrow: "Business & Print",
    title: "Professional stationery for every business",
    description:
      "Business cards, letterheads, flyers, and brochures printed on premium paper stocks with expert finishing. Your brand deserves materials that make the right first impression.",
    image: "/signageslide2.png",
    imageAlt: "Business printing services",
    reverse: true,
  },
];

export function OurProducts() {
  return (
    <Section background="white" spacing="lg">
      <div className="flex flex-col gap-20 lg:gap-28">
        {products.map((item) => (
          <div
            key={item.eyebrow}
            className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20"
          >
            <Reveal className={item.reverse ? "lg:order-2" : ""}>
              <div className="hover-lift relative aspect-[16/11] overflow-hidden rounded-[2rem] shadow-lg">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-secondary shadow-md backdrop-blur-sm">
                  <item.icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
              </div>
            </Reveal>
            <Reveal delay={120} className={item.reverse ? "lg:order-1" : ""}>
              <Chip variant="secondary" className="mb-6">
                {item.eyebrow}
              </Chip>
              <h2 className="text-section-heading text-foreground">{item.title}</h2>
              <p className="text-body mt-5 text-lg">{item.description}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </Section>
  );
}
