import crypto from "crypto";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_BASE = "https://api.paystack.co";

interface InitializeResult {
  success: boolean;
  authorizationUrl?: string;
  reference?: string;
  error?: string;
}

export async function initializePaystackTransaction({
  email,
  amount,
  reference,
  callbackUrl,
  metadata,
}: {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<InitializeResult> {
  try {
    const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack uses kobo
        reference,
        callback_url: callbackUrl,
        metadata: metadata || {},
      }),
    });

    const data = await res.json();

    if (data.status && data.data?.authorization_url) {
      return {
        success: true,
        authorizationUrl: data.data.authorization_url,
        reference,
      };
    }

    return { success: false, error: data.message || "Failed to initialize payment" };
  } catch {
    return { success: false, error: "Payment service unavailable. Please try again." };
  }
}

export async function verifyPaystackPayment(reference: string): Promise<{
  success: boolean;
  status?: string;
  amount?: number;
  error?: string;
}> {
  try {
    const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });

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
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!PAYSTACK_SECRET) return false;
  const hash = crypto.createHmac("sha512", PAYSTACK_SECRET).update(body).digest("hex");
  return hash === signature;
}
