import type { CheckStatusInput, PrintProvider, ProviderResult, SubmitJobInput } from "./types";
import type { PrintProviderName } from "./../types";

export interface ExternalProviderConfig {
  /** Env var holding the API token. */
  envToken: string;
  /** Env var holding the API base URL. */
  envBaseUrl: string;
  /** Static flag in code whether this provider is currently wired up. */
  enabled: boolean;
}

/**
 * Base for REST-based fulfillment providers (Printful, Printify, Gelato).
 * Concrete subclasses map our shared `SubmitJobInput` to their own order payload
 * and map their response back to our `ProviderResult`.
 *
 * When the provider's API token is absent (`isConfigured() === false`), submit
 * and check are non-throwing no-ops so the purchasing flow never breaks while a
 * partner has not been wired up yet.
 */
export abstract class BaseHttpProvider implements PrintProvider {
  readonly name: PrintProviderName;
  readonly label: string;
  private readonly token: string;
  private readonly apiBaseUrl: string | undefined;
  private readonly configured: boolean;

  constructor(name: PrintProviderName, label: string, cfg: ExternalProviderConfig) {
    this.name = name;
    this.label = label;
    this.token = process.env[cfg.envToken] || "";
    this.apiBaseUrl = process.env[cfg.envBaseUrl] || undefined;
    this.configured = cfg.enabled;
  }

  isConfigured(): boolean {
    return this.configured && Boolean(this.token) && Boolean(this.apiBaseUrl);
  }

  protected get env(): { token: string; baseUrl: string | undefined } {
    return { token: this.token, baseUrl: this.apiBaseUrl };
  }

  async submit(input: SubmitJobInput): Promise<ProviderResult> {
    if (!this.isConfigured()) {
      return {
        externalId: `UNCONFIGURED-${input.externalRef}`,
        status: "queued_locally",
        message: `${this.label} is not configured — job held for manual processing.`,
      };
    }
    return this.dispatch(input);
  }

  async checkStatus(input: CheckStatusInput): Promise<ProviderResult> {
    if (!this.isConfigured()) {
      return { externalId: input.externalId, status: "unknown" };
    }
    return this.poll(input.externalId);
  }

  protected abstract dispatch(input: SubmitJobInput): Promise<ProviderResult>;
  protected abstract poll(externalId: string): Promise<ProviderResult>;
}