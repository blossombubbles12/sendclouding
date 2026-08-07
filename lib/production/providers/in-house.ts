import type { CheckStatusInput, PrintProvider, ProviderResult, SubmitJobInput } from "./types";
import type { PrintProviderName } from "./../types";

/**
 * In-house printing. Submitting a job records it as accepted by the internal
 * production line; status transitions are managed by staff via the job workflow
 * (approve -> printing -> quality check -> ...). This provider never leaves the
 * application and requires no configuration.
 */
export class InHousePrintProvider implements PrintProvider {
  readonly name: PrintProviderName = "in_house";
  readonly label = "In-House";

  isConfigured(): boolean {
    return true;
  }

  async submit(input: SubmitJobInput): Promise<ProviderResult> {
    return {
      externalId: `IH-${input.externalRef}`,
      status: "received",
      message: "Job queued for in-house production line.",
      raw: {
        sku: input.sku,
        quantity: input.quantity,
        files: input.files,
      },
    };
  }

  async checkStatus(input: CheckStatusInput): Promise<ProviderResult> {
    return {
      externalId: input.externalId,
      status: "in_progress",
      message: "In-house status is managed by the internal workflow.",
    };
  }
}