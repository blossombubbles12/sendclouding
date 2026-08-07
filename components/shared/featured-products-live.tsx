import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { Flex } from "@/components/layout/flex";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import type { ProductCardData } from "@/components/shared/product-card";

async function getFeaturedProducts(): Promise<ProductCardData[]> {
  try {
    const { getProducts, getProductImage } = await import("@/lib/data");
    const result = await getProducts({ limit: 8, featured: true });
    return result.products.map((p) => {
      const image = getProductImage(p);
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category?.name ?? "Uncategorized",
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        image,
        badge: p.featured ? "Featured" : undefined,
        inStock: (p.inventory?.quantity ?? 0) > 0 || !p.inventory?.trackInventory,
      };
    });
  } catch {
    return [];
  }
}

export async function FeaturedProductsLive() {
  const products = await getFeaturedProducts();
  if (products.length === 0) return null;

  return (
    <Section background="muted" spacing="lg" pattern="geometric">
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
