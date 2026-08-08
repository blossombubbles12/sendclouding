"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, PenTool, Zap } from "lucide-react";
import { useCart } from "@/providers/cart-provider";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image?: string;
    imageAlt?: string;
  };
  disabled?: boolean;
  /** When true, an additional "Customize This Product" option is shown. */
  customizable?: boolean;
}

export function AddToCartButton({ product, disabled = false, customizable = false }: AddToCartButtonProps) {
  const router = useRouter();
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const { addItem } = useCart();

  // Always uses the product's authoritative base price (as loaded from
  // Payload on the server) times the selected quantity — never a
  // customization surcharge, since this path skips the designer entirely.
  const buildLineItem = () => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    quantity,
    image: product.image,
    imageAlt: product.imageAlt,
  });

  const handleAddToCart = () => {
    addItem(buildLineItem());
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(buildLineItem());
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border border-border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={disabled}
            className="flex h-11 w-11 items-center justify-center rounded-l-full text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex h-11 w-12 items-center justify-center border-x border-border text-sm font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={disabled}
            className="flex h-11 w-11 items-center justify-center rounded-r-full text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={disabled}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-secondary px-8 text-sm font-semibold text-secondary transition-all duration-300 hover:bg-secondary/10 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? "Out of Stock" : added ? "Added" : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={disabled}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-secondary-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap className="h-4 w-4" />
          {disabled ? "Out of Stock" : "Buy Now"}
        </button>
      </div>

      {customizable && (
        <Link
          href={`/design/${product.slug}`}
          className="inline-flex h-11 w-fit items-center gap-2 rounded-full border border-dashed border-accent px-8 text-sm font-semibold text-accent-700 transition-all duration-300 hover:bg-accent/10 active:scale-[0.97]"
        >
          <PenTool className="h-4 w-4" />
          Customize This Product
        </Link>
      )}
    </div>
  );
}