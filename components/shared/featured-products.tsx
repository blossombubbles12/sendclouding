import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { Flex } from "@/components/layout/flex";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCard, type ProductCardData } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

const iconClass = "h-16 w-16 text-accent/70";

const products: ProductCardData[] = [
  { id: "1", name: "Send Clouding Pure Water 75cl", category: "Bottled Water", slug: "aquabest-pure-water-75cl", price: 250, image: null },
  { id: "2", name: "Send Clouding Table Water 1.5L", category: "Bottled Water", slug: "aquabest-table-water-1-5l", price: 600, image: null },
  { id: "3", name: "Send Clouding Sachet Water (Pack)", category: "Sachet Water", slug: "aquabest-sachet-water-20", price: 200, image: null },
  { id: "4", name: "Golden Crust Butter Bread", category: "Bakeries", slug: "golden-crust-butter-bread", price: 1500, image: null },
  { id: "5", name: "Classic Meat Pie (Box of 6)", category: "Bakeries", slug: "classic-meat-pie-box-6", price: 3000, image: null },
  { id: "6", name: "Chocolate Chip Muffins", category: "Bakeries", slug: "chocolate-chip-muffins-4", price: 2200, image: null },
  { id: "7", name: "Send Clouding Dispenser Bottle 18.9L", category: "Dispenser Water", slug: "aquabest-dispenser-bottle-18-9l", price: 1800, image: null },
  { id: "8", name: "Vanilla Sponge Cake", category: "Bakeries", slug: "vanilla-celebration-cake", price: 8500, image: null },
];

export function FeaturedProducts() {
  return (
    <Section background="muted" spacing="lg">
      <Flex justify="between" align="end" wrap className="mb-14 gap-6">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Featured Products"
            title="Customer favorites this week"
            description="Handpicked bestsellers from our water production and bakery lines."
            className="mx-0 max-w-xl items-start text-left"
          />
        </Reveal>
        <Reveal delay={100}>
          <Button variant="outline" asChild>
            <Link href="/products">
              View all products <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </Flex>
      <Grid cols={4} gap="lg">
        {products.map((product, index) => (
          <Reveal key={product.id} delay={index * 50}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}
