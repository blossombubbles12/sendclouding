import Image from "next/image";
import { Section } from "@/components/layout/section";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/motion/reveal";

const highlights = [
  {
    eyebrow: "Outdoor Signage & Banners",
    title: "Make your brand impossible to miss",
    description:
      "From massive outdoor banners to sleek roll-up displays, our large-format printing ensures your message is seen loud and clear. Weather-resistant materials, vibrant colors, professional finishing.",
    image: "/homepage2.png",
    alt: "Outdoor signage and banners printing",
    reverse: false,
  },
  {
    eyebrow: "Custom Apparel & Merchandise",
    title: "Turn your designs into wearable art",
    description:
      "Premium custom t-shirts, caps, tote bags, and branded merchandise. Direct-to-garment printing, embroidery, and screen printing options for any quantity.",
    image: "/homepage3.png",
    alt: "Custom printed apparel and merchandise",
    reverse: true,
  },
];

export function ProductHighlights() {
  return (
    <Section background="white" spacing="lg" pattern="mesh">
      <div className="flex flex-col gap-20">
        {highlights.map((item) => (
          <div key={item.title} className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal className={item.reverse ? "lg:order-2" : ""}>
              <div className="hover-lift relative aspect-[16/11] overflow-hidden rounded-3xl bg-white shadow-sm">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={100} className={item.reverse ? "lg:order-1" : ""}>
              <Chip variant="secondary" className="mb-6">
                {item.eyebrow}
              </Chip>
              <h3 className="text-section-heading text-foreground">{item.title}</h3>
              <p className="text-body mt-5 text-lg">{item.description}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </Section>
  );
}
