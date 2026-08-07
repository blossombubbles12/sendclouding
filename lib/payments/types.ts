export type PaymentMethodId = "cod" | "paystack" | "stripe" | "flutterwave" | "bank_transfer";

export interface PaymentMethodOption {
  id: PaymentMethodId;
  label: string;
  description: string;
}

export interface PaymentInitializeParams {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentInitializeResult {
  success: boolean;
  authorizationUrl?: string;
  reference?: string;
  error?: string;
}

export interface PaymentVerifyResult {
  success: boolean;
  status?: string;
  amount?: number;
  error?: string;
}

export interface PaymentGateway {
  id: PaymentMethodId;
  initialize(params: PaymentInitializeParams): Promise<PaymentInitializeResult>;
  verify(reference: string): Promise<PaymentVerifyResult>;
  verifyWebhook?(body: string, signature: string): boolean;
}
