import type { AnyLayer, TemplateDesign } from "./types";
import type { DesignOptions } from "./types";

/** Layers the customer is allowed to fill in (text + image placeholders). */
export function editableLayers(design: TemplateDesign): (Extract<AnyLayer, { type: "text" }> | Extract<AnyLayer, { type: "image" }>)[] {
  return design.layers.filter(
    (l): l is Extract<AnyLayer, { type: "text" }> | Extract<AnyLayer, { type: "image" }> =>
      (l.type === "text" || l.type === "image") && l.rules?.editable === true,
  );
}

/** Editable text placeholders (`editable_text`) the customer must/can fill. */
export function textPlaceholders(design: TemplateDesign): Extract<AnyLayer, { type: "text" }>[] {
  return editableLayers(design).filter(
    (l): l is Extract<AnyLayer, { type: "text" }> => l.type === "text" && l.rules?.role === "editable_text",
  );
}

/** Editable image placeholders (`image_placeholder`) the customer must/can fill. */
export function imagePlaceholders(design: TemplateDesign): Extract<AnyLayer, { type: "image" }>[] {
  return editableLayers(design).filter(
    (l): l is Extract<AnyLayer, { type: "image" }> => l.type === "image" && l.rules?.role === "image_placeholder",
  );
}

/** Human label for a placeholder. */
export function placeholderLabel(layer: AnyLayer): string {
  if (layer.name && layer.name !== layer.id) return layer.name;
  if (layer.type === "text") return "Text";
  if (layer.type === "image") return "Image";
  return layer.type;
}

export interface PlaceholderStatus {
  id: string;
  name: string;
  type: "text" | "image";
  required: boolean;
  empty: boolean;
  maxLength?: number;
  error?: string;
}

/**
 * Evaluates whether all required placeholders have been completed. Used as the
 * gate before adding to cart and, defensively, at checkout.
 */
export function validatePlaceholders(
  design: TemplateDesign,
  options: DesignOptions,
): { complete: boolean; missing: PlaceholderStatus[]; all: PlaceholderStatus[] } {
  const all: PlaceholderStatus[] = [];

  for (const layer of editableLayers(design)) {
    if (layer.type === "text" && layer.rules?.role === "editable_text") {
      const value = options.text[layer.id] ?? layer.text ?? "";
      const required = Boolean(layer.rules?.required);
      const empty = value.trim().length === 0;
      const maxLength = layer.rules?.maxLength ?? 0;
      const over = maxLength > 0 && value.length > maxLength;
      all.push({
        id: layer.id,
        name: placeholderLabel(layer),
        type: "text",
        required,
        empty,
        maxLength: maxLength || undefined,
        error: empty
          ? required
            ? "Required"
            : undefined
          : over
            ? `Maximum ${maxLength} characters`
            : undefined,
      });
    }

    if (layer.type === "image" && layer.rules?.role === "image_placeholder") {
      const ref = options.images[layer.id];
      const required = Boolean(layer.rules?.required);
      const empty = Boolean(!ref || !ref.id);
      all.push({
        id: layer.id,
        name: placeholderLabel(layer),
        type: "image",
        required,
        empty,
        error: empty ? (required ? "Required" : undefined) : undefined,
      });
    }
  }

  const missing = all.filter((s) => s.error);
  return { complete: missing.length === 0, missing, all };
}

/** Count required placeholders in a design. */
export function requiredPlaceholderCount(design: TemplateDesign): number {
  return textPlaceholders(design).filter((l) => l.rules?.required).length;
}