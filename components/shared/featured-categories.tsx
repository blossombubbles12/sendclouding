import { PenTool, Printer, ShoppingBag, Shirt, Briefcase, Building2 } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { CategoryCard, type CategoryCardData } from "@/components/shared/category-card";
import { Reveal } from "@/components/motion/reveal";

const categories: CategoryCardData[] = [
  { name: "Outdoor Banners", count: "24 products", href: "/products?category=outdoor-banners", icon: PenTool },
  { name: "Business Cards", count: "16 products", href: "/products?category=business-cards", icon: Briefcase },
  { name: "Custom T-Shirts", count: "32 products", href: "/products?category=t-shirts", icon: Shirt },
  { name: "Print & Stationery", count: "28 products", href: "/products?category=stationery", icon: Printer },
  { name: "Brand Merchandise", count: "19 products", href: "/products?category=merchandise", icon: ShoppingBag },
  { name: "Corporate Solutions", count: "12 products", href: "/corporate", icon: Building2 },
];

export function FeaturedCategories() {
  return (
    <Section background="white" spacing="lg">
      <Reveal>
        <SectionHeading
          eyebrow="Shop by Category"
          title="Everything your brand needs"
          description="From outdoor signage to branded merchandise, find the perfect product to make your brand stand out."
        />
      </Reveal>
      <Grid cols={3} gap="lg" className="mt-14">
        {categories.map((category, index) => (
          <Reveal key={category.name} delay={index * 60}>
            <CategoryCard category={category} />
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}
