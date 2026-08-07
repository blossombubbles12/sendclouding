import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Droplets,
  GlassWater,
  Container,
  Croissant,
  Cake,
  Sandwich,
} from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: { url: string; alt: string } | null;
}

const categoryIconBySlug: Record<
  string,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  "bottled-water": Droplets,
  "sachet-water": GlassWater,
  "dispenser-water": Container,
  "bread-pastries": Croissant,
  "cakes-desserts": Cake,
  "snacks-meat-pies": Sandwich,
};

function getCategoryIcon(name: string, slug: string) {
  const direct = categoryIconBySlug[slug];
  if (direct) return direct;

  const normalized = name.toLowerCase();
  if (normalized.includes("water")) return GlassWater;
  if (normalized.includes("bread") || normalized.includes("pastr") || normalized.includes("bakery"))
    return Croissant;
  if (
    normalized.includes("cake") ||
    normalized.includes("dessert") ||
    normalized.includes("muffin")
  )
    return Cake;
  if (normalized.includes("snack") || normalized.includes("pie")) return Sandwich;
  return ArrowUpRight;
}

async function getCategories(): Promise<CategoryItem[]> {
  try {
    const { getCategories: fetchCats } = await import("@/lib/data");
    const cats = await fetchCats({ featured: true });
    return cats.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image?.url ? { url: c.image.url, alt: c.name } : null,
    }));
  } catch {
    return [];
  }
}

export async function FeaturedCategoriesLive() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  return (
    <Section background="white" spacing="lg" pattern="dots">
      <Reveal>
        <SectionHeading
          eyebrow="Shop by Category"
          title="Everything you need, freshly made"
          description="From purified water to oven-fresh pastries, explore our full range of AquaBest products."
        />
      </Reveal>
      <Grid cols={3} gap="lg" className="mt-14">
        {categories.map((category, index) => {
          const Icon = getCategoryIcon(category.name, category.slug);
          return (
            <Reveal key={category.id} delay={index * 60}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group hover-lift relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-6 sm:p-7"
              >
                <div className="flex items-start justify-between">
                  {category.image ? (
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
                      <Image
                        src={category.image.url}
                        alt={category.image.alt}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                  )}
                  <ArrowUpRight
                    className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-8">
                  <h3 className="text-card-title text-foreground">{category.name}</h3>
                  <p className="text-caption mt-1">View products</p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </Grid>
    </Section>
  );
}
