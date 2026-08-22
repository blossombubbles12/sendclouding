"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, MapPin, Package, ArrowRight } from "lucide-react";

interface MethodOption {
  id: string;
  name: string;
  description: string;
  baseFee: number;
  estimatedDelivery: string;
  isActive?: boolean;
}

export function QuoteForm() {
  const [city, setCity] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [results, setResults] = React.useState<{ methods: MethodOption[]; zone: string } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const inputClass =
    "h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm shadow-sm outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20";

  async function getQuote(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch(`/api/delivery-options?city=${encodeURIComponent(city)}&state=${encodeURIComponent(region)}`);
      const data = await res.json();
      const methods = (data.methods || []).filter((m: MethodOption) => m.isActive !== false);
      setResults({ methods, zone: data.zone ?? "Default" });
    } catch {
      setError("Could not load quotes right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={getQuote} className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Delivery city *</span>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input className={`${inputClass} pl-11`} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. London" required />
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Region / state</span>
            <input className={inputClass} value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Greater London" />
          </label>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Package weight (kg)</span>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input className={`${inputClass} pl-11`} type="number" min={0} step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 2.5" />
            </div>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading || !city.trim()}
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-secondary px-8 text-base font-semibold text-white shadow-lg shadow-secondary/25 transition-all hover:bg-secondary-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
          Get my quote
        </button>
      </form>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {results && (
        <div className="mt-6">
          <p className="text-caption text-muted-foreground">
            Quotes for delivery to <span className="font-medium text-foreground">{city.trim()}</span> ({results.zone} zone)
            {weight ? ` · ${weight} kg` : ""}
          </p>
          <div className="mt-4 space-y-3">
            {results.methods.length === 0 && (
              <p className="rounded-xl bg-muted px-4 py-4 text-sm text-muted-foreground">
                No delivery options available for this destination.
              </p>
            )}
            {results.methods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-foreground">{method.name}</p>
                  <p className="text-caption text-muted-foreground">
                    {method.description} · {method.estimatedDelivery}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-bold text-foreground">€{method.baseFee.toFixed(2)}</p>
                  <Link
                    href={`/ship?city=${encodeURIComponent(city)}&region=${encodeURIComponent(region)}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-secondary hover:underline"
                  >
                    Book this <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}