import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProductBySlug, getProductImage, isInStock, getTags, type PayloadProduct } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const image = getProductImage(product);
  const allImages = product.images?.map((img) => ({
    url: (img.image ?? img).url ?? "",
    alt: (img.image ?? img).alt ?? product.name,
  })) ?? [];
  const inStock = isInStock(product);
  const quantity = product.inventory?.quantity ?? 0;

  const tags = getTags(product);

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <Container>
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-secondary/10">
              {image ? (
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ShoppingCart className="h-24 w-24 text-accent/20" aria-hidden="true" />
                </div>
              )}

              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <Badge variant="accent" className="absolute left-4 top-4">
                  Sale
                </Badge>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.map((img, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="flex flex-col gap-5">
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm font-medium uppercase tracking-wide text-accent-700 transition-colors hover:text-accent"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="text-page-title text-foreground">{product.name}</h1>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>

            {product.description ? (
              <div className="text-body leading-relaxed">
                {typeof product.description === "string"
                  ? product.description
                  : "View product details below for more information."}
              </div>
            ) : null}

            {product.sku && (
              <p className="text-sm text-muted-foreground">
                SKU: <span className="font-mono text-foreground">{product.sku}</span>
              </p>
            )}

            {inStock ? (
              <p className="flex items-center gap-1.5 text-sm font-medium text-accent">
                <Check className="h-4 w-4" /> In Stock
                {product.inventory?.trackInventory && quantity <= 10 && quantity > 0 && (
                  <span className="ml-1 text-highlight-600">
                    — Only {quantity} left
                  </span>
                )}
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                Out of Stock
              </p>
            )}

            <Separator />

            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: image?.url,
                imageAlt: image?.alt ?? product.name,
              }}
              disabled={!inStock}
              customizable={product.isCustomizable}
            />

            <Separator />

            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {product.specifications && product.specifications.length > 0 && (
          <div className="mt-16">
            <h2 className="text-section-heading mb-6">Specifications</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-left text-sm">
                <tbody>
                  {(product.specifications as { name?: string; value?: string }[]).map((spec, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : "bg-white"}>
                      <td className="px-6 py-3 font-medium text-foreground">{spec.name}</td>
                      <td className="px-6 py-3 text-muted-foreground">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
