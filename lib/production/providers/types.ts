// ─────────────────────────────────────────────────────────────────────────────
// Print provider abstraction.
//
// Every production flow (in-house, Printful, Printify, Gelato, or a custom
// partner) implements the same interface so the rest of the module can dispatch
// jobs and poll statuses without knowing which channel is in use. This seam keeps
// the module portable and future-proof.
// -----------------------------------------------------------------------------

import type { PrintProviderName } from "./../types";

export interface SubmitJobInput {
  externalRef: string;
  provider: PrintProviderName;
  quantity: number;
  productName: string;
  sku?: string;
  files: Array<{ format: string; name: string; url: string }>;
  address?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface CheckStatusInput {
  externalRef: string;
  provider: PrintProviderName;
  externalId: string;
}

export interface ProviderResult {
  externalId: string;
  status?: string;
  message?: string;
  raw?: Record<string, unknown>;
}

export interface PrintProvider {
  readonly name: PrintProviderName;
  readonly label: string;
  isConfigured(): boolean;
  submit(input: SubmitJobInput): Promise<ProviderResult>;
  checkStatus(input: CheckStatusInput): Promise<ProviderResult>;
}