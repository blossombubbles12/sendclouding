import type { Metadata } from "next";
import {
  AboutHero,
  OurStory,
  MissionVision,
  Values,
  OurProducts,
  WhyChoose,
  CompanyStats,
  ProductionStandards,
  AboutCTA,
} from "@/components/about";
import { Newsletter } from "@/components/shared/newsletter";

export const metadata: Metadata = {
  title: "About Us | Signages.ng",
  description:
    "Discover Signages.ng — Nigeria's premium print-on-demand platform. Design, personalize, and print professional signage, banners, business cards, and branded merchandise.",
  openGraph: {
    title: "About Us | Signages.ng",
    description:
      "Nigeria's premium print-on-demand platform. Design, personalize, and print professional signage.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <MissionVision />
      <Values />
      <OurProducts />
      <WhyChoose />
      <CompanyStats />
      <ProductionStandards />
      <AboutCTA />
      <Newsletter />
    </>
  );
}
