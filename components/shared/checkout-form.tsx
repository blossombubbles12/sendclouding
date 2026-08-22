"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowLeft, Loader2, CheckCircle, Banknote, CreditCard, Wallet, Truck, Store, Zap } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { createOrder } from "@/lib/orders";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PaymentMethodOption {
  id: string;
  label: string;
  description: string;
}

interface ShippingMethodOption {
  id: string;
  name: string;
  description: string;
  baseFee: number;
  estimatedDelivery: string;
}

const PAYMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  cod: Banknote,
  paystack: CreditCard,
  bank_transfer: Wallet,
};

const SHIPPING_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "home-delivery": Truck,
  "store-pickup": Store,
  "express-delivery": Zap,
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [step, setStep] = React.useState<"form" | "review">("form");

  // Form fields
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [country, setCountry] = React.useState("Netherlands");
  const [notes, setNotes] = React.useState("");

  // Payment methods
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethodOption[]>([]);
  const [selectedPayment, setSelectedPayment] = React.useState("cod");
  const [methodsLoading, setMethodsLoading] = React.useState(true);

  // Shipping methods
  const [shippingMethods, setShippingMethods] = React.useState<ShippingMethodOption[]>([]);
  const [selectedShipping, setSelectedShipping] = React.useState("");
  const [shippingZone, setShippingZone] = React.useState("");
  const [freeThreshold, setFreeThreshold] = React.useState(50000);
  const [shippingLoading, setShippingLoading] = React.useState(false);

  const tax = Math.round(subtotal * 0.075);
  const shippingFee = React.useMemo(() => {
    const method = shippingMethods.find((m) => m.id === selectedShipping);
    return method ? method.baseFee : 2000;
  }, [shippingMethods, selectedShipping]);
  const isFreeShipping = shippingMethods.length > 0 && shippingFee === 0;
  const total = subtotal + (subtotal >= freeThreshold ? 0 : shippingFee) + tax;

  React.useEffect(() => {
    fetch("/api/payment-methods")
      .then((res) => res.json())
      .then((data) => {
        if (data.methods?.length > 0) {
          setPaymentMethods(data.methods);
          setSelectedPayment(data.methods[0].id);
        }
      })
      .catch(() => {
        setPaymentMethods([
          { id: "cod", label: "Cash on Delivery", description: "Pay with cash when your order is delivered." },
        ]);
      })
      .finally(() => setMethodsLoading(false));
  }, []);

  const fetchShipping = React.useCallback(() => {
    if (!city || !state) return;
    setShippingLoading(true);
    fetch(`/api/delivery-options?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.methods?.length > 0) {
          setShippingMethods(data.methods);
          setShippingZone(data.zone || "");
          setFreeThreshold(data.freeThreshold || 50000);
          if (!selectedShipping || !data.methods.find((m: ShippingMethodOption) => m.id === selectedShipping)) {
            setSelectedShipping(data.methods[0].id);
          }
        }
      })
      .catch(() => {})
      .finally(() => setShippingLoading(false));
  }, [city, state, selectedShipping]);

  React.useEffect(() => {
    fetchShipping();
  }, [city, state]);

  const displayShippingCost = subtotal >= freeThreshold ? 0 : shippingFee;

  const validateForm = (): boolean => {
    if (!email || !firstName || !lastName || !phone || !address || !city || !state || !country) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!phone.match(/^\+?[\d\s-]{8,}$/)) {
      setError("Please enter a valid phone number.");
      return false;
    }
    return true;
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (validateForm()) setStep("review");
  };

  const handleSubmit = async () => {
    if (!selectedPayment) {
      setError("Please select a payment method.");
      return;
    }
    if (!selectedShipping) {
      setError("Please select a shipping method.");
      return;
    }

    setLoading(true);
    setError("");

    const selectedShipMethod = shippingMethods.find((m) => m.id === selectedShipping);

    const result = await createOrder(
      items.map((i) => ({
        id: i.id,
        name: i.name,
        sku: "",
        price: i.price,
        quantity: i.quantity,
        lineKey: i.lineKey || i.id,
        isCustomized: i.isCustomized,
        designId: i.designId,
        templateId: i.templateId,
        templateVersion: i.templateVersion,
        designJSON: i.designJSON,
        options: i.designOptions,
        previewImageId: i.previewMediaId,
        assets: i.assets?.map((a) => ({ id: a.id })),
        productionMetadata: i.productionMetadata,
      })),
      { email, firstName, lastName, phone, address, city, state, postalCode, country, notes },
      selectedPayment,
      selectedShipMethod
        ? { id: selectedShipMethod.id, name: selectedShipMethod.name, zone: shippingZone, fee: displayShippingCost }
        : undefined
    );

    if (result.success) {
      clearCart();
      if (result.paystackUrl) {
        window.location.href = result.paystackUrl;
      } else {
        router.push(`/checkout/success?method=${result.paymentMethod || selectedPayment}&order=${result.orderNumber || ""}`);
      }
    } else {
      setError(result.error || "Something went wrong");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingCart className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some products before checking out.</p>
        <Button asChild className="mt-2">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
      {/* Form */}
      <div>
        <Link href="/cart" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </Link>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {step === "form" ? (
          <form onSubmit={handleReview}>
            <div className="space-y-8">
              {/* Contact Info */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                  </div>
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" required />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+31 20 000 0000" required />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main Street" required />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Amsterdam" required />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="Amsterdam" required />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="1011 AB" />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special delivery instructions..."
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button type="button" variant="outline" asChild>
                <Link href="/cart">Back to Cart</Link>
              </Button>
              <Button type="submit" size="lg">
                Review Order
              </Button>
            </div>
          </form>
        ) : (
          /* Review Step */
          <div>
            <h2 className="mb-6 text-lg font-semibold text-foreground">Review Your Order</h2>

            <div className="space-y-6 rounded-2xl border border-border bg-white p-6">
              {/* Contact */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">Contact</h3>
                <p className="text-sm text-muted-foreground">{email}</p>
                <p className="text-sm text-muted-foreground">{phone}</p>
              </div>
              <Separator />
              {/* Shipping */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">Ship to</h3>
                <p className="text-sm text-muted-foreground">{firstName} {lastName}</p>
                <p className="text-sm text-muted-foreground">{address}</p>
                <p className="text-sm text-muted-foreground">{city}, {state} {postalCode}</p>
                <p className="text-sm text-muted-foreground">{country}</p>
              </div>
              <Separator />
              {/* Items */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Items ({items.length})</h3>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {item.image ? (
                          <Image src={item.image} alt={item.imageAlt ?? item.name} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Notes</h3>
                    <p className="text-sm text-muted-foreground">{notes}</p>
                  </div>
                </>
              )}
            </div>

            {/* Shipping Method Selection */}
            <div className="mt-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Delivery Method</h2>
              {!city || !state ? (
                <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                  Enter your city and state in the shipping address to see delivery options.
                </div>
              ) : shippingLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading delivery options...
                </div>
              ) : shippingMethods.length === 0 ? (
                <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                  No delivery methods available for your location. Please contact support.
                </div>
              ) : (
                <div className="grid gap-3">
                  {shippingMethods.map((method) => {
                    const Icon = SHIPPING_ICONS[method.id] || Truck;
                    const isSelected = selectedShipping === method.id;
                    const fee = subtotal >= freeThreshold ? 0 : method.baseFee;

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedShipping(method.id)}
                        className={cn(
                          "flex items-start gap-4 rounded-xl border p-4 text-left transition-colors",
                          isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border bg-white hover:border-primary/40"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                            isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">{method.name}</p>
                            {method.estimatedDelivery && (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                {method.estimatedDelivery}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{method.description}</p>
                        </div>
                        <div className="text-right">
                          <span className={cn("text-sm font-semibold", fee === 0 ? "text-accent" : "text-foreground")}>
                            {fee === 0 ? "Free" : formatCurrency(fee)}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "mt-1 h-5 w-5 shrink-0 rounded-full border-2",
                            isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                          )}
                        >
                          {isSelected && (
                            <svg className="h-full w-full text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  {shippingZone && (
                    <p className="text-xs text-muted-foreground">Delivery zone: {shippingZone}</p>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="mt-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Payment Method</h2>
              {methodsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading payment options...
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                  No payment methods available.
                </div>
              ) : (
                <div className="grid gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = PAYMENT_ICONS[method.id] || CreditCard;
                    const isSelected = selectedPayment === method.id;

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPayment(method.id)}
                        className={cn(
                          "flex items-start gap-4 rounded-xl border p-4 text-left transition-colors",
                          isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border bg-white hover:border-primary/40"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                            isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{method.label}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{method.description}</p>
                        </div>
                        <div
                          className={cn(
                            "mt-1 h-5 w-5 shrink-0 rounded-full border-2",
                            isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                          )}
                        >
                          {isSelected && (
                            <svg className="h-full w-full text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap justify-between gap-4">
              <Button type="button" variant="outline" onClick={() => setStep("form")}>
                Edit Details
              </Button>
              <Button type="button" size="lg" onClick={handleSubmit} disabled={loading || methodsLoading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  selectedPayment === "cod" ? "Place Order (Cash on Delivery)" : "Proceed to Payment"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Order Summary Sidebar */}
      <div>
        <div className="sticky top-24 rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
          <Separator className="my-4" />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className={cn("font-medium", displayShippingCost === 0 ? "text-accent" : "text-foreground")}>
                {displayShippingCost === 0 ? "Free" : formatCurrency(displayShippingCost)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (7.5%)</span>
              <span className="font-medium text-foreground">{formatCurrency(tax)}</span>
            </div>
            {subtotal >= freeThreshold && freeThreshold > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-2 text-xs font-medium text-accent">
                <CheckCircle className="h-3.5 w-3.5" />
                Free shipping on orders over {formatCurrency(freeThreshold)}
              </div>
            )}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-base">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-foreground">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
