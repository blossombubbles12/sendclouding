import { BaseHttpProvider } from "./base";
import type { ProviderResult, SubmitJobInput } from "./types";

/**
 * Printful fulfilment provider.
 * Docs: https://developers.printful.com/docs/
 */
export class PrintfulProvider extends BaseHttpProvider {
  constructor() {
    super("printful", "Printful", {
      envToken: "PRINTFUL_API_KEY",
      envBaseUrl: "PRINTFUL_API_BASE_URL",
      enabled: false,
    });
  }

  protected async dispatch(input: SubmitJobInput): Promise<ProviderResult> {
    // Real integration would POST to /v2/orders with your "export_templates"
    // and map the returned `id` / `status`.
    // Example payload:
    //   { recipient, items: [{ mockup: ..., files: [{type:"default", url, filename}] }] }
    const { baseUrl, token } = this.env;
    const res = await fetch(`${baseUrl}/v2/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        external_id: input.externalRef,
        recipient: input.address ?? {},
        items: input.files.map((f) => ({
          files: [{ type: "default", url: f.url, filename: f.name }],
        })),
      }),
    });
    const json = await res.json().catch(() => ({}));
    return {
      externalId: String(json?.id ?? input.externalRef),
      status: json?.status,
      raw: json,
    };
  }

  protected async poll(externalId: string): Promise<ProviderResult> {
    const { baseUrl, token } = this.env;
    const res = await fetch(`${baseUrl}/v2/orders/${externalId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json().catch(() => ({}));
    return { externalId, status: json?.status, raw: json };
  }
}