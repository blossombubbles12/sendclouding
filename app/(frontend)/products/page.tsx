import Link from "next/link";
import { ArrowRight, PenTool } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getProducts, getProductImage, type PayloadProduct } from "@/lib/data";

function mapProduct(p: PayloadProduct) {
  const image = getProductImage(p);
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category?.name ?? "Uncategorized",
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    image,
    badge: undefined as string | undefined,
    inStock: (p.inventory?.quantity ?? 0) > 0 || !p.inventory?.trackInventory,
    isCustomizable: p.isCustomizable,
  };
}

export const revalidate = 60;

export default async function ProductsPage() {
  const { products, totalDocs } = await getProducts({ limit: 24 });

  return (
    <Section background="white" spacing="lg">
      <Reveal>
        <SectionHeading
          eyebrow="All Products"
          title="Design and customize your signage"
          description={`${totalDocs} products ready for your personal touch. Upload your design or use our templates.`}
        />
      </Reveal>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
            <PenTool className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">No products found</h2>
          <p className="text-muted-foreground">Check back soon for new products to customize.</p>
          <Button asChild className="bg-secondary text-white hover:bg-secondary-600">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      ) : (
        <Grid cols={4} gap="lg" className="mt-14">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 40}>
              <ProductCard product={mapProduct(product)} />
            </Reveal>
          ))}
        </Grid>
      )}
    </Section>
  );
}
