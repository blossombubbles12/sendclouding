"use client";

import * as React from "react";
import { Loader2, PackageSearch } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "found">("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!orderNumber.trim()) return;
    setStatus("loading");
    setTimeout(() => setStatus("found"), 600);
  }

  return (
    <Reveal className="mx-auto max-w-2xl">
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-10">
        <div className="flex items-start gap-4">
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent sm:flex">
            <PackageSearch className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-card-title text-foreground sm:text-xl">
              Where is my order?
            </h2>
            <p className="text-body mt-1.5">
              For security reasons, we share order status with the email address used
              at checkout. Tracking is also available from your account.
            </p>
          </div>
        </div>

        {status === "found" ? (
          <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 px-5 py-4 text-sm font-medium text-accent-700">
            We&apos;ve received your request for order{" "}
            <strong>{orderNumber}</strong>. Our team will send the latest status by
            email shortly. For urgent help, call us directly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number *</Label>
              <Input
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. ORD-XXXXXXXX"
                required
              />
            </div>
            <Button type="submit" size="lg" disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Checking...
                </>
              ) : (
                "Track Order"
              )}
            </Button>
          </form>
        )}
      </div>
    </Reveal>
  );
}