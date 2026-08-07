"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, ArrowRight, RefreshCw, ShoppingBag, TruckIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <React.Suspense fallback={<div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
      <SuccessContent />
    </React.Suspense>
  );
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  paystack: "Online Payment (Paystack)",
  bank_transfer: "Bank Transfer",
};

function SuccessContent() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref") || "";
  const method = params.get("method") || "";
  const orderNumber = params.get("order") || "";
  const [status, setStatus] = React.useState<"loading" | "success" | "failed">("loading");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    // COD or bank transfer - no verification needed
    if (method && method !== "paystack") {
      setStatus("success");
      return;
    }

    // Paystack - verify payment
    if (!reference) {
      setStatus("failed");
      setError("No payment reference found.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`);
        const data = await res.json();
        if (data.success) {
          setStatus("success");
        } else {
          setStatus("failed");
          setError(data.error || "Payment verification failed.");
        }
      } catch {
        setStatus("failed");
        setError("Unable to verify payment. Please contact support.");
      }
    };

    verify();
  }, [reference, method]);

  const isCOD = method === "cod" || method === "bank_transfer";
  const paymentLabel = PAYMENT_METHOD_LABELS[method] || method || "Online Payment";

  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          {status === "loading" ? (
            <>
              <Loader2 className="mb-6 h-10 w-10 animate-spin text-primary" />
              <h1 className="text-page-title text-foreground">Verifying Payment</h1>
              <p className="text-body mt-4">Please wait while we confirm your payment...</p>
            </>
          ) : status === "success" ? (
            <>
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
                {isCOD ? (
                  <TruckIcon className="h-10 w-10 text-accent" />
                ) : (
                  <CheckCircle className="h-10 w-10 text-accent" />
                )}
              </div>
              <h1 className="text-page-title text-foreground">Order Confirmed!</h1>
              <p className="text-body mt-4">
                {isCOD
                  ? "Your order has been placed successfully. You will pay with cash when your order is delivered."
                  : "Thank you for your order. Your payment has been received and your order is being processed."
                }
              </p>

              {orderNumber && (
                <div className="mt-6 w-full rounded-2xl border border-border bg-muted/30 p-6">
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="mt-1 font-mono text-lg font-bold text-foreground">{orderNumber}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Payment method: {paymentLabel}</p>
                </div>
              )}

              {reference && !isCOD && (
                <div className="mt-4 w-full rounded-2xl border border-border bg-muted/30 p-6">
                  <p className="text-sm text-muted-foreground">Payment Reference</p>
                  <p className="mt-1 font-mono text-sm font-medium text-foreground">{reference}</p>
                </div>
              )}

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/account/orders">View Orders <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <h1 className="text-page-title text-foreground">Payment Failed</h1>
              <p className="text-body mt-4">{error || "We couldn't process your payment. Please try again."}</p>
              {reference && (
                <div className="mt-6 w-full rounded-2xl border border-border bg-muted/30 p-6">
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="mt-1 font-mono text-sm font-medium text-foreground">{reference}</p>
                </div>
              )}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/checkout"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
