"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, PenTool } from "lucide-react";
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
  /** When true the button routes to the customer designer instead of adding directly. */
  customizable?: boolean;
}

export function AddToCartButton({ product, disabled = false, customizable = false }: AddToCartButtonProps) {
  const router = useRouter();
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    if (customizable) {
      router.push(`/design/${product.slug}`);
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity,
      image: product.image,
      imageAlt: product.imageAlt,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {!customizable && (
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
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-secondary-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PenTool className="h-4 w-4" />
        {disabled ? "Out of Stock" : customizable ? "Customize Now" : added ? "Added" : "Add to Cart"}
      </button>
    </div>
  );
}