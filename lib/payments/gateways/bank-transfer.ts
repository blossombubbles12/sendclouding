import type { PaymentGateway, PaymentInitializeResult, PaymentVerifyResult } from "../types";

export function createBankTransferGateway(): PaymentGateway {
  return {
    id: "bank_transfer",

    async initialize(): Promise<PaymentInitializeResult> {
      return { success: true };
    },

    async verify(): Promise<PaymentVerifyResult> {
      return { success: true, status: "pending" };
    },
  };
}
