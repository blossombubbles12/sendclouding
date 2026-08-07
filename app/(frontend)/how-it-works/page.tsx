import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, LayoutTemplate, ShieldCheck, Truck } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "How It Works | Signages.ng",
  description:
    "Learn how we turn your designs into premium prints and signage. Select templates, customize with our canvas tool, approve artwork, and get it delivered anywhere in Nigeria.",
};

const steps = [
  {
    step: "01",
    icon: LayoutTemplate,
    title: "Choose Your Canvas",
    description:
      "Explore our catalog of premium signages, roll-up banners, and merchandise templates curated specifically for modern brands, or start with your own blank template dimensions.",
    image: "/signageslide1.png",
    alt: "Choose customized signages template layout illustration",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "Design Your Brand Vision",
    description:
      "Use our state-of-the-art interactive graphics builder. Customize fonts, upload high-resolution vectors/logos, move layouts, and see exactly what your physical asset will look like in 3D-space previews.",
    image: "/signageslide2.png",
    alt: "Drag and drop template designer builder window screen",
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  },
  {
    step: "03",
    icon: ShieldCheck,
    title: "Artistic Artwork Verification",
    description:
      "Our in-house design and production staff vet every order. We check bounds, DPI resolution, and bleed margins to ensure perfect clarity before physical production begins.",
    image: "/signageslide3.png",
    alt: "Verify artwork print alignment bounding box screen mockup",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  {
    step: "04",
    icon: Truck,
    title: "Nationwide Doorstep Delivery",
    description:
      "Once quality check finishes, your order is securely packed and shipped. We deliver straight to your store or office anywhere in Nigeria with full tracking information provided.",
    image: "/homepage1.png",
    alt: "Secure signage packaging and doorstep dispatch delivery cargo",
    color: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[440px] items-center overflow-hidden bg-primary-900 sm:min-h-[520px]">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/signageslide3.png"
            alt="Signages.ng premium workflow production facility"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="animate-fade-up [animation-fill-mode:forwards] motion-reduce:animate-none">
            <Breadcrumbs items={[{ label: "How It Works" }]} className="[&_*]:!text-white/70" />
          </div>
          <h1 className="text-page-title mt-6 max-w-3xl text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.35)] sm:text-hero">
            Simple steps to <span className="text-secondary">premium signage</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
            From design to delivery, we offer a streamlined print production process to give your business high-quality materials.
          </p>
        </div>
      </section>

      {/* Main Process Workflow Section */}
      <Section background="white" spacing="lg" pattern="wave">
        <Container>
          <div className="flex flex-col gap-24 lg:gap-32">
            {steps.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.step}
                  className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20"
                >
                  {/* Left Column / Image Side */}
                  <Reveal className={isEven ? "" : "lg:order-2"}>
                    <div className="hover-lift relative aspect-[16/11] overflow-hidden rounded-[2rem] bg-zinc-50 shadow-md">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-zinc-950">
                        <item.icon className="h-7 w-7 text-secondary" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                    </div>
                  </Reveal>

                  {/* Right Column / Content Side */}
                  <Reveal delay={120} className={isEven ? "" : "lg:order-1"}>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-extrabold tracking-tight text-secondary/30">
                        {item.step}
                      </span>
                      <Chip variant="default" className="text-xs uppercase tracking-widest">
                        Process Stage
                      </Chip>
                    </div>

                    <h2 className="text-section-heading mt-4 text-foreground">
                      {item.title}
                    </h2>
                    <p className="text-body mt-5 text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Trust & CTA Banner Section */}
      <Section background="snow" spacing="md" pattern="wave">
        <Container className="text-center">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Ready to bring your ideas to life?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-600">
              Select premium templates of any product or upload custom measurements and start printing immediately.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" className="bg-secondary text-white hover:bg-secondary-600" asChild>
                <Link href="/products">
                  Explore Products <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Get Custom Quote</Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
