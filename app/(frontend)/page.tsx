import { Hero } from "@/components/shared/hero";
import { TrackingHero } from "@/components/shared/tracking-hero";
import { HowItWorks } from "@/components/shared/how-it-works";
import { Services } from "@/components/shared/services";
import { TrackingPreview } from "@/components/shared/tracking-preview";
import { WhyChooseUs } from "@/components/shared/why-choose-us";
import { Coverage } from "@/components/shared/coverage";
import { BusinessSolutions } from "@/components/shared/business-solutions";
import { Testimonials } from "@/components/shared/testimonials";
import { FAQ } from "@/components/shared/faq";
import { CTA } from "@/components/shared/cta";

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrackingHero />
      <HowItWorks />
      <Services />
      <TrackingPreview />
      <WhyChooseUs />
      <Coverage />
      <BusinessSolutions />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}