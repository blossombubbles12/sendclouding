"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, PenTool } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/providers/cart-provider";
import { useRouter } from "next/navigation";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice?: number | null;
  image?: { url: string; alt: string } | null;
  badge?: string;
  inStock?: boolean;
  isCustomizable?: boolean;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const [wishlisted, setWishlisted] = React.useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.isCustomizable) {
      router.push(`/design/${product.slug}`);
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      image: product.image?.url,
      imageAlt: product.image?.alt ?? product.name,
    });
  };

  return (
    <div className="group hover-lift relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-secondary-50 to-accent/10">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
            <PenTool className="h-16 w-16 text-secondary/25" aria-hidden="true" />
          </div>
        )}

        {product.badge && (
          <Badge variant="highlight" className="absolute left-3 top-3">
            {product.badge}
          </Badge>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setWishlisted((v) => !v);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground/70 shadow-sm transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Heart className={cn("h-4 w-4 transition-colors", wishlisted && "fill-destructive text-destructive")} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-caption uppercase tracking-wide text-secondary-700">
          {product.category}
        </span>
        <Link
          href={`/products/${product.slug}`}
          className="text-card-title text-foreground transition-colors hover:text-secondary"
        >
          {product.name}
        </Link>
        <div className="mt-auto pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5 wrap shrink-0">
            <span className="text-base font-bold text-foreground">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.inStock === false}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-secondary-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
          >
            <PenTool className="h-3 w-3" aria-hidden="true" />
            {product.inStock === false
              ? "Sold Out"
              : product.isCustomizable
              ? "Customize"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
