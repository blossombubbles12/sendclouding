import { GelatoProvider } from "./gelato";
import { InHousePrintProvider } from "./in-house";
import { PrintfulProvider } from "./printful";
import { PrintifyProvider } from "./printify";
import type { PrintProvider } from "./types";
import type { PrintProviderName } from "./../types";

const registry = new Map<PrintProviderName, PrintProvider>([
  ["in_house", new InHousePrintProvider()],
  ["printful", new PrintfulProvider()],
  ["printify", new PrintifyProvider()],
  ["gelato", new GelatoProvider()],
]);

/** Get a registered provider instance (in-memory singleton). */
export function getPrintProvider(name: PrintProviderName): PrintProvider {
  const provider = registry.get(name);
  if (!provider) {
    throw new Error(`Unknown print provider: ${name}`);
  }
  return provider;
}

/** All registered providers. */
export function listPrintProviders(): PrintProvider[] {
  return Array.from(registry.values());
}

export type { PrintProvider, ProviderResult, SubmitJobInput, CheckStatusInput } from "./types";