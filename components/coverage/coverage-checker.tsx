"use client";

import * as React from "react";
import { Loader2, Search, MapPin, CheckCircle2 } from "lucide-react";

interface CheckResult {
  zone: string;
  methodsCount: number;
  covered: boolean;
}

export function CoverageChecker() {
  const [city, setCity] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [result, setResult] = React.useState<CheckResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function checkCoverage(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/delivery-options?city=${encodeURIComponent(city)}&state=${encodeURIComponent(region)}`);
      const data = await res.json();
      const methods = data.methods || [];
      setResult({
        zone: data.zone ?? "Default",
        methodsCount: methods.length,
        covered: methods.length > 0,
      });
    } catch {
      setError("Could not check coverage right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm shadow-sm outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20";

  return (
    <div>
      <form onSubmit={checkCoverage} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            className={`${inputClass} pl-11`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city, e.g. Amsterdam"
            aria-label="City"
            required
          />
        </div>
        <input
          className={inputClass}
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Region / state (optional)"
          aria-label="Region"
        />
        <button
          type="submit"
          disabled={loading || !city.trim()}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-secondary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Search className="h-5 w-5" aria-hidden="true" />}
          Check
        </button>
      </form>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                result.covered ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
              }`}
            >
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-card-title font-semibold text-foreground">
                {result.covered ? `We deliver to ${city.trim()}` : "Delivery available"}
              </h3>
              <p className="mt-1 text-body text-muted-foreground">
                {city.trim()} is in the <span className="font-medium text-foreground">{result.zone}</span> delivery zone
                with {result.methodsCount} service option{result.methodsCount === 1 ? "" : "s"} available.
              </p>
              <a
                href={`/ship?city=${encodeURIComponent(city)}&region=${encodeURIComponent(region)}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-secondary hover:underline"
              >
                Book a shipment to this destination →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}