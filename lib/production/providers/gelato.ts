import { BaseHttpProvider } from "./base";
import type { ProviderResult, SubmitJobInput } from "./types";

/**
 * Gelato fulfilment provider.
 * Docs: https://docs.gelato.one/
 */
export class GelatoProvider extends BaseHttpProvider {
  constructor() {
    super("gelato", "Gelato", {
      envToken: "GELATO_API_KEY",
      envBaseUrl: "GELATO_API_BASE_URL",
      enabled: false,
    });
  }

  protected async dispatch(input: SubmitJobInput): Promise<ProviderResult> {
    const { baseUrl, token } = this.env;
    // Real = POST /v3/orders with the product/files + delivery info.
    const res = await fetch(`${baseUrl}/v3/orders`, {
      method: "POST",
      headers: { "X-API-KEY": token, "Content-Type": "application/json" },
      body: JSON.stringify({
        externalId: input.externalRef,
        recipient: input.address ?? {},
        items: input.files.map((f) => ({ files: [{ type: "default", url: f.url, name: f.name }] })),
      }),
    });
    const json = await res.json().catch(() => ({}));
    return { externalId: String(json?.id ?? input.externalRef), status: json?.status, raw: json };
  }

  protected async poll(externalId: string): Promise<ProviderResult> {
    const { baseUrl, token } = this.env;
    const res = await fetch(`${baseUrl}/v3/orders/${externalId}`, {
      headers: { "X-API-KEY": token },
    });
    const json = await res.json().catch(() => ({}));
    return { externalId, status: json?.status, raw: json };
  }
}