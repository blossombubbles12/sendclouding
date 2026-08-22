"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Package, ArrowRight, Sparkles } from "lucide-react";

interface MethodOption {
  id: string;
  name: string;
  description: string;
  baseFee: number;
  estimatedDelivery: string;
  isActive?: boolean;
}

interface QuoteResult {
  methods: MethodOption[];
  zone: string;
}

export function ShipForm({ initialCity = "", initialRegion = "" }: { initialCity?: string; initialRegion?: string }) {
  const router = useRouter();

  const [senderName, setSenderName] = React.useState("");
  const [senderCompany, setSenderCompany] = React.useState("");
  const [senderPhone, setSenderPhone] = React.useState("");
  const [senderEmail, setSenderEmail] = React.useState("");
  const [recipientName, setRecipientName] = React.useState("");
  const [recipientCompany, setRecipientCompany] = React.useState("");
  const [recipientPhone, setRecipientPhone] = React.useState("");
  const [recipientEmail, setRecipientEmail] = React.useState("");

  const [packageDescription, setPackageDescription] = React.useState("");
  const [packageWeight, setPackageWeight] = React.useState("");
  const [packageWeightUnit, setPackageWeightUnit] = React.useState("kg");
  const [packageDeclaredValue, setPackageDeclaredValue] = React.useState("");
  const [packageIsFragile, setPackageIsFragile] = React.useState(false);

  const [deliveryCity, setDeliveryCity] = React.useState(initialCity);
  const [deliveryRegion, setDeliveryRegion] = React.useState(initialRegion);

  const [quote, setQuote] = React.useState<QuoteResult | null>(null);
  const [selectedMethod, setSelectedMethod] = React.useState<string>("");
  const [quoting, setQuoting] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [created, setCreated] = React.useState<{ trackingNumber: string } | null>(null);

  const inputClass =
    "h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm shadow-sm outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20";

  async function getQuote() {
    setQuoting(true);
    setError("");
    setQuote(null);
    try {
      const res = await fetch(`/api/delivery-options?city=${encodeURIComponent(deliveryCity)}&state=${encodeURIComponent(deliveryRegion)}`);
      const data = await res.json();
      const methods = (data.methods || []).filter((m: MethodOption) => m.isActive !== false);
      setQuote({ methods, zone: data.zone ?? "Default" });
      if (methods.length > 0) setSelectedMethod(methods[0].id);
    } catch {
      setError("Could not load delivery options. Please try again.");
    } finally {
      setQuoting(false);
    }
  }

  const selected = quote?.methods.find((m) => m.id === selectedMethod);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: { name: senderName, company: senderCompany, phone: senderPhone, email: senderEmail },
          recipient: { name: recipientName, company: recipientCompany, phone: recipientPhone, email: recipientEmail },
          deliveryService: selectedMethod || null,
          package: {
            description: packageDescription,
            weight: packageWeight ? Number(packageWeight) : null,
            weightUnit: packageWeightUnit,
            declaredValue: packageDeclaredValue ? Number(packageDeclaredValue) : null,
            isFragile: packageIsFragile,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Booking failed");
      }
      setCreated({ trackingNumber: data.trackingNumber });
      router.push(`/track?tn=${encodeURIComponent(data.trackingNumber)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (created) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-white p-10 text-center shadow-sm">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-section-heading text-foreground">Shipment booked!</h2>
        <p className="mt-3 text-body text-muted-foreground">
          Your tracking number is{" "}
          <span className="font-mono font-semibold text-foreground">{created.trackingNumber}</span>.
          Redirecting to tracking…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-2 text-card-title font-semibold text-foreground">
            <Package className="h-5 w-5 text-secondary" aria-hidden="true" /> Sender
          </h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Full name *</span>
              <input className={inputClass} value={senderName} onChange={(e) => setSenderName(e.target.value)} required />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Company</span>
              <input className={inputClass} value={senderCompany} onChange={(e) => setSenderCompany(e.target.value)} />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Phone *</span>
                <input className={inputClass} type="tel" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} required />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
                <input className={inputClass} type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-2 text-card-title font-semibold text-foreground">
            <Package className="h-5 w-5 text-secondary" aria-hidden="true" /> Recipient
          </h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Full name *</span>
              <input className={inputClass} value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Company</span>
              <input className={inputClass} value={recipientCompany} onChange={(e) => setRecipientCompany(e.target.value)} />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Phone *</span>
                <input className={inputClass} type="tel" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} required />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
                <input className={inputClass} type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />
              </label>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <h2 className="flex items-center gap-2 text-card-title font-semibold text-foreground">
          <Package className="h-5 w-5 text-secondary" aria-hidden="true" /> Package
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Description</span>
            <input className={inputClass} value={packageDescription} onChange={(e) => setPackageDescription(e.target.value)} placeholder="e.g. Documents, small parcel" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Weight</span>
            <input className={inputClass} type="number" min={0} step="0.1" value={packageWeight} onChange={(e) => setPackageWeight(e.target.value)} placeholder="0.0" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Unit</span>
            <select className={inputClass} value={packageWeightUnit} onChange={(e) => setPackageWeightUnit(e.target.value)}>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Declared value (€)</span>
            <input className={inputClass} type="number" min={0} value={packageDeclaredValue} onChange={(e) => setPackageDeclaredValue(e.target.value)} placeholder="0" />
          </label>
          <label className="flex items-center gap-2 pt-7 text-sm font-medium text-foreground">
            <input type="checkbox" checked={packageIsFragile} onChange={(e) => setPackageIsFragile(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-secondary focus:ring-secondary" />
            Fragile
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <h2 className="flex items-center gap-2 text-card-title font-semibold text-foreground">
          <Sparkles className="h-5 w-5 text-secondary" aria-hidden="true" /> Delivery options
        </h2>
        <p className="mt-2 text-caption text-muted-foreground">
          Enter the delivery destination below, then get an instant quote.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Delivery city *</span>
            <input className={inputClass} value={deliveryCity} onChange={(e) => setDeliveryCity(e.target.value)} placeholder="e.g. Amsterdam" required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Region / state</span>
            <input className={inputClass} value={deliveryRegion} onChange={(e) => setDeliveryRegion(e.target.value)} placeholder="e.g. North Holland" />
          </label>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={getQuote}
            disabled={quoting || !deliveryCity}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-secondary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {quoting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Get instant quote
          </button>
        </div>

        {quote && (
          <div className="mt-5">
            <p className="text-caption text-muted-foreground">
              Zone: <span className="font-medium text-foreground">{quote.zone}</span>
            </p>
            <div className="mt-3 space-y-3">
              {quote.methods.length === 0 && (
                <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">No delivery options available for this zone.</p>
              )}
              {quote.methods.map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
                    selectedMethod === method.id ? "border-secondary bg-secondary/5" : "border-border bg-white hover:border-secondary/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="method"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="mt-1 h-4 w-4 border-slate-300 text-secondary focus:ring-secondary"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{method.name}</p>
                      <p className="text-caption text-muted-foreground">{method.description} · {method.estimatedDelivery}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-lg font-bold text-foreground">€{method.baseFee.toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </section>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="flex flex-col items-center gap-4 rounded-2xl bg-primary p-6 text-white sm:flex-row sm:justify-between sm:p-8">
        <div>
          <p className="text-caption uppercase tracking-wide text-white/60">Estimated total</p>
          <p className="text-3xl font-bold">
            {selected ? `€${selected.baseFee.toFixed(2)}` : "—"}
          </p>
          {selected && <p className="text-caption text-white/70">{selected.name} · {selected.estimatedDelivery}</p>}
        </div>
        <button
          type="submit"
          disabled={loading || !selected}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-secondary px-8 text-base font-semibold text-white shadow-lg shadow-secondary/25 transition-all hover:bg-secondary-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Booking…
            </>
          ) : (
            <>
              Book shipment <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}