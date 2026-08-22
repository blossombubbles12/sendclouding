import type { PaymentGateway, PaymentMethodId, PaymentMethodOption } from "./types";
import { createCashOnDeliveryGateway } from "./gateways/cod";
import { createPaystackGateway } from "./gateways/paystack";
import { createBankTransferGateway } from "./gateways/bank-transfer";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface PaymentSettings {
  cod?: { enabled?: boolean; label?: string; description?: string };
  paystack?: { paystackEnabled?: boolean };
  stripe?: { stripeEnabled?: boolean };
  flutterwave?: { flutterwaveEnabled?: boolean };
  bankTransfer?: { enabled?: boolean; label?: string; description?: string };
}

let cachedSettings: PaymentSettings | null = null;
let cachedTimestamp = 0;
const CACHE_TTL = 300_000; // 5 minutes

function codOptions(): PaymentMethodOption {
  return {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay with cash when your order is delivered.",
  };
}

// Reliable: uses env vars only, no HTTP calls, never throws
function resolveMethodsFromEnv(): PaymentMethodOption[] {
  const methods: PaymentMethodOption[] = [codOptions()];

  if (process.env.PAYSTACK_SECRET_KEY) {
    methods.push({
      id: "paystack",
      label: "Pay Online (Paystack)",
      description: "Pay securely via card, iDEAL, or bank transfer.",
    });
  }

  return methods;
}

// Reliable: uses env vars only, no HTTP calls, never throws
function resolveGatewayFromEnv(methodId: PaymentMethodId): PaymentGateway | null {
  switch (methodId) {
    case "cod":
      return createCashOnDeliveryGateway();

    case "paystack": {
      const key = process.env.PAYSTACK_SECRET_KEY;
      if (!key) {
        console.warn("[Payment] Paystack key not configured");
        return null;
      }
      return createPaystackGateway(key);
    }

    case "bank_transfer":
      return createBankTransferGateway();

    default:
      console.warn(`[Payment] Unknown method: ${methodId}`);
      return null;
  }
}

// Optional: tries to fetch admin overrides, but never fails the caller
export async function fetchPaymentSettings(): Promise<PaymentSettings> {
  const now = Date.now();
  if (cachedSettings && now - cachedTimestamp < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${baseUrl}/api/globals/payment-settings`, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (data && data.cod) {
      cachedSettings = data;
      cachedTimestamp = now;
      return data;
    }
  } catch (err) {
    console.warn("[Payment] Admin settings unavailable, using env defaults:", (err as Error).message);
  }

  const fallback = { cod: { enabled: true } };
  cachedSettings = fallback;
  cachedTimestamp = now;
  return fallback;
}

// Preferred for admin/discovery: includes admin overrides if reachable
export async function getAvailablePaymentMethods(): Promise<PaymentMethodOption[]> {
  const admin = await fetchPaymentSettings();
  const methods: PaymentMethodOption[] = [];

  if (admin.cod?.enabled !== false) {
    methods.push({
      id: "cod",
      label: admin.cod?.label || "Cash on Delivery",
      description: admin.cod?.description || "Pay with cash when your order is delivered.",
    });
  }

  const paystackKey = process.env.PAYSTACK_SECRET_KEY;
  if (admin.paystack?.paystackEnabled === true && paystackKey) {
    methods.push({
      id: "paystack",
      label: "Pay Online (Paystack)",
      description: "Pay securely via card, iDEAL, or bank transfer.",
    });
  }

  if (admin.bankTransfer?.enabled) {
    methods.push({
      id: "bank_transfer",
      label: admin.bankTransfer?.label || "Bank Transfer",
      description: admin.bankTransfer?.description || "Transfer payment to our bank account.",
    });
  }

  if (admin.stripe?.stripeEnabled && process.env.STRIPE_SECRET_KEY) {
    methods.push({
      id: "stripe",
      label: "Pay Online (Stripe)",
      description: "Pay securely with your debit or credit card via Stripe.",
    });
  }

  if (admin.flutterwave?.flutterwaveEnabled && process.env.FLUTTERWAVE_SECRET_KEY) {
    methods.push({
      id: "flutterwave",
      label: "Pay Online (Flutterwave)",
      description: "Pay securely via card, iDEAL, or bank transfer.",
    });
  }

  if (methods.length === 0) {
    methods.push(codOptions());
  }

  return methods;
}

// Critical path: uses env vars only — never fails, never makes HTTP calls
export function getGateway(methodId: PaymentMethodId): PaymentGateway | null {
  return resolveGatewayFromEnv(methodId);
}

// Critical path: uses env vars only — never fails, never makes HTTP calls
export function validatePaymentMethodStable(methodId: string): {
  valid: boolean;
  fallbackId: PaymentMethodId;
  fallbackLabel: string;
} {
  const methods = resolveMethodsFromEnv();
  const found = methods.find((m) => m.id === methodId);

  if (found) {
    return {
      valid: true,
      fallbackId: found.id,
      fallbackLabel: found.label,
    };
  }

  console.warn(
    `[Payment] Method "${methodId}" not available. Falling back to COD.`
  );

  return {
    valid: false,
    fallbackId: "cod" as const,
    fallbackLabel: "Cash on Delivery",
  };
}
