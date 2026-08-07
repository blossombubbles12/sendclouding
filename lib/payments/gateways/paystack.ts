import crypto from "crypto";
import type { PaymentGateway, PaymentInitializeParams, PaymentInitializeResult, PaymentVerifyResult } from "../types";

export function createPaystackGateway(secretKey: string): PaymentGateway {
  const PAYSTACK_SECRET = secretKey;
  const PAYSTACK_BASE = "https://api.paystack.co";

  return {
    id: "paystack",

    async initialize(params: PaymentInitializeParams): Promise<PaymentInitializeResult> {
      try {
        const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: params.email,
            amount: params.amount * 100,
            reference: params.reference,
            callback_url: params.callbackUrl,
            metadata: params.metadata || {},
          }),
        });

        const data = await res.json();

        if (data.status && data.data?.authorization_url) {
          return {
            success: true,
            authorizationUrl: data.data.authorization_url,
            reference: params.reference,
          };
        }

        return { success: false, error: data.message || "Failed to initialize payment" };
      } catch {
        return { success: false, error: "Payment service unavailable. Please try again." };
      }
    },

    async verify(reference: string): Promise<PaymentVerifyResult> {
      try {
        const res = await fetch(
          `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
          { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
        );

        const data = await res.json();

        if (data.status && data.data?.status === "success") {
          return {
            success: true,
            status: "paid",
            amount: data.data.amount / 100,
          };
        }

        return {
          success: false,
          status: data.data?.status || "failed",
          error: data.message || "Payment verification failed",
        };
      } catch {
        return { success: false, error: "Unable to verify payment. Please contact support." };
      }
    },

    verifyWebhook(body: string, signature: string): boolean {
      if (!PAYSTACK_SECRET) return false;
      const hash = crypto.createHmac("sha512", PAYSTACK_SECRET).update(body).digest("hex");
      return hash === signature;
    },
  };
}
