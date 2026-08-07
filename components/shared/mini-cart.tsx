"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart, cartLineKey } from "@/providers/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function MiniCart() {
  const { items, totalItems, subtotal, isOpen, closeCart, removeItem, updateQuantity } = useCart();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50" onClick={closeCart} aria-hidden="true">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        </div>
      )}

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-400 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-foreground">
              Cart {totalItems > 0 && <span className="text-muted-foreground">({totalItems})</span>}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="text-lg font-medium text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add products to get started.</p>
            <Link
              href="/products"
              onClick={closeCart}
              className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-4">
                {items.map((item) => {
                  const lineKey = cartLineKey(item);
                  const shownImage = item.previewImage || item.image;
                  const itemHref = item.isCustomized ? `/design/${item.slug}?design=${item.designId}` : `/products/${item.slug}`;
                  return (
                    <li key={lineKey} className="flex gap-4">
                      <Link
                        href={itemHref}
                        onClick={closeCart}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"
                      >
                        {shownImage ? (
                          <Image
                            src={shownImage}
                            alt={item.imageAlt ?? item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <ShoppingBag className="h-6 w-6" />
                          </div>
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link
                            href={itemHref}
                            onClick={closeCart}
                            className="text-sm font-medium text-foreground hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm font-semibold text-foreground">
                            {formatCurrency(item.price)}
                          </p>
                          {item.isCustomized && (
                            <Link
                              href={itemHref}
                              onClick={closeCart}
                              className="text-xs font-medium text-secondary hover:underline"
                            >
                              Edit Design
                            </Link>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(lineKey, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(lineKey, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(lineKey)}
                            aria-label={`Remove ${item.name} from cart`}
                            className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mb-2.5 flex w-full items-center justify-center rounded-full bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              >
                View Cart &amp; Checkout
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="w-full rounded-full py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export function CartToggle() {
  const { totalItems, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Shopping bag, ${totalItems} items`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted"
    >
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-white">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}
