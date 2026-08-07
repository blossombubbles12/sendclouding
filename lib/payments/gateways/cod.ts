import type { PaymentGateway, PaymentInitializeParams, PaymentInitializeResult } from "../types";

export function createCashOnDeliveryGateway(): PaymentGateway {
  return {
    id: "cod",

    async initialize(
      params: PaymentInitializeParams
    ): Promise<PaymentInitializeResult> {
      return {
        success: true,
        reference: params.reference,
      };
    },

    async verify() {
      return { success: true, status: "pending" };
    },
  };
}
