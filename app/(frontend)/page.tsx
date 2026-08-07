import { Suspense } from "react";
import { Hero } from "@/components/shared/hero";
import { HeroSlider } from "@/components/hero/HeroSlider";
import { FeaturedCategoriesLive } from "@/components/shared/featured-categories-live";
import { FeaturedProductsLive } from "@/components/shared/featured-products-live";
import { WhyChooseUs } from "@/components/shared/why-choose-us";
import { CompanyOverview } from "@/components/shared/company-overview";
import { ProductHighlights } from "@/components/shared/product-highlights";
import { Stats } from "@/components/shared/stats";
import { Testimonials } from "@/components/shared/testimonials";
import { LatestArticlesLive } from "@/components/shared/latest-articles-live";
import { Newsletter } from "@/components/shared/newsletter";
import { CTA } from "@/components/shared/cta";

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Hero />
      <Suspense fallback={null}>
        <FeaturedCategoriesLive />
        <FeaturedProductsLive />
        <LatestArticlesLive />
      </Suspense>
      <WhyChooseUs />
      <CompanyOverview />
      <ProductHighlights />
      <Stats />
      <Testimonials />
      <Newsletter />
      <CTA />
    </>
  );
}
