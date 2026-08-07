import { BaseHttpProvider } from "./base";
import type { ProviderResult, SubmitJobInput } from "./types";

/**
 * Printify fulfilment provider.
 * Docs: https://developers.printify.com/
 */
export class PrintifyProvider extends BaseHttpProvider {
  constructor() {
    super("printify", "Printify", {
      envToken: "PRINTIFY_API_TOKEN",
      envBaseUrl: "PRINTIFY_API_BASE_URL",
      enabled: false,
    });
  }

  protected async dispatch(input: SubmitJobInput): Promise<ProviderResult> {
    const { baseUrl, token } = this.env;
    // Real integration: create order on a shop; returns external order id.
    const res = await fetch(`${baseUrl}/v1/orders.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_id: input.externalRef,
        address_to: input.address ?? {},
        line_items: input.files.map((f) => ({
          quantity: input.quantity,
          variant_id: null,
          product_id: null,
          print_provider_id: null,
          template_images: [{ file: f.url }],
          metadata: { product: input.productName, sku: input.sku },
        })),
      }),
    });
    const json = await res.json().catch(() => ({}));
    return { externalId: String(json?.id ?? input.externalRef), status: json?.status, raw: json };
  }

  protected async poll(externalId: string): Promise<ProviderResult> {
    const { baseUrl, token } = this.env;
    const res = await fetch(`${baseUrl}/v1/orders/${externalId}.json`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json().catch(() => ({}));
    return { externalId, status: json?.status, raw: json };
  }
}