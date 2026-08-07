"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingCart, ArrowRight, Tag, Check } from "lucide-react";
import { useCart, cartLineKey } from "@/providers/cart-provider";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function CartItems() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();
  const [couponCode, setCouponCode] = React.useState("");
  const [couponApplied, setCouponApplied] = React.useState(false);
  const [couponError, setCouponError] = React.useState("");

  const shipping = 0;
  const tax = Math.round(subtotal * 0.075);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + tax - discount;

  const handleApplyCoupon = () => {
    setCouponError("");
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    if (couponCode.toUpperCase() === "SIGNAGES10") {
      setCouponApplied(true);
    } else {
      setCouponError("Invalid coupon code. Try SIGNAGES10 for 10% off.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
          <ShoppingCart className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some products to customize and get started.</p>
        <Button asChild className="mt-2 bg-secondary text-white hover:bg-secondary-600">
          <Link href="/products">
            Browse Products <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
      <div>
        <div className="hidden sm:grid sm:grid-cols-[1fr_120px_120px_40px] sm:gap-4 sm:border-b sm:border-border sm:pb-3 sm:text-xs sm:font-semibold sm:uppercase sm:tracking-wider sm:text-muted-foreground">
          <span>Product</span>
          <span className="text-center">Quantity</span>
          <span className="text-right">Total</span>
          <span />
        </div>

        <ul className="divide-y divide-border">
          {items.map((item) => {
            const lineKey = cartLineKey(item);
            const shownImage = item.previewImage || item.image;
            return (
              <li
                key={lineKey}
                className="flex flex-col gap-3 py-5 sm:grid sm:grid-cols-[1fr_120px_120px_40px] sm:items-center sm:gap-4"
              >
                <div className="flex items-center gap-4">
                  <Link
                    href={item.isCustomized ? `/design/${item.slug}?design=${item.designId}` : `/products/${item.slug}`}
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
                        <ShoppingCart className="h-6 w-6" />
                      </div>
                    )}
                  </Link>
                  <div>
                    <Link
                      href={item.isCustomized ? `/design/${item.slug}?design=${item.designId}` : `/products/${item.slug}`}
                      className="text-sm font-medium text-foreground transition-colors hover:text-secondary"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                    <div className="mt-1 flex items-center gap-3">
                      {item.isCustomized && (
                        <>
                          <Link
                            href={`/design/${item.slug}?design=${item.designId}`}
                            className="text-xs font-medium text-secondary hover:underline"
                          >
                            Edit Design
                          </Link>
                          {item.productionReady === false && (
                            <span className="text-xs font-medium text-amber-600">Needs design</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(lineKey, item.quantity - 1)}
                    aria-label={`Decrease quantity of ${item.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(lineKey, item.quantity + 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <p className="text-sm font-semibold text-foreground sm:text-right">
                  {formatCurrency(item.price * item.quantity)}
                </p>

                <button
                  type="button"
                  onClick={() => removeItem(lineKey)}
                  aria-label={`Remove ${item.name} from cart`}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" size="sm" onClick={clearCart}>
            Clear Cart
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>

      <div>
        <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
          <Separator className="my-4" />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-xs text-muted-foreground">
                {subtotal > 0 ? "Calculated at checkout" : "\u2014"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (7.5%)</span>
              <span className="font-medium text-foreground">{formatCurrency(tax)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-secondary">
                <span>Discount (10%)</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-border p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Tag className="h-4 w-4" />
              Coupon Code
            </div>
            {couponApplied ? (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-2 text-sm font-medium text-secondary-700">
                <Check className="h-4 w-4" />
                SIGNAGES10 applied \u2014 10% off
                <button
                  type="button"
                  onClick={() => {
                    setCouponApplied(false);
                    setCouponCode("");
                  }}
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError("");
                  }}
                  placeholder="Enter code"
                  className="h-9 text-sm"
                />
                <Button size="sm" variant="outline" onClick={handleApplyCoupon}>
                  Apply
                </Button>
              </div>
            )}
            {couponError && (
              <p className="mt-1.5 text-xs text-destructive">{couponError}</p>
            )}
          </div>

          <Separator className="my-4" />
          <div className="flex justify-between text-base">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-foreground">{formatCurrency(total)}</span>
          </div>
          <Button className="mt-6 w-full bg-secondary text-white hover:bg-secondary-600" size="lg" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Shipping calculated at checkout. Free delivery on orders above \u20A620,000.
          </p>
        </div>
      </div>
    </div>
  );
}
