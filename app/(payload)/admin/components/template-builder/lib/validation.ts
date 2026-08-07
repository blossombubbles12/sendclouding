import type {
  AnyLayer,
  ImageLayer,
  PrintGeometry,
  TemplateDesign,
  TextLayer,
} from "./types";

export interface ValidationIssue {
  layerId: string;
  layerName: string;
  severity: "error" | "warning";
  code: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  layerCount: number;
  editableLayerCount: number;
}

/**
 * Checks that a layer's bounding box stays inside the printable area.
 * Rotated boxes are evaluated via their four corners (AABB of the rotated rect).
 */
function boundingBoxOf(layer: AnyLayer) {
  const rad = ((layer.rotation % 360) * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const cx = layer.x + layer.width / 2;
  const cy = layer.y + layer.height / 2;
  const hw = layer.width / 2;
  const hh = layer.height / 2;

  const corners = [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh },
  ].map((c) => ({
    x: cx + c.x * cos - c.y * sin,
    y: cy + c.x * sin + c.y * cos,
  }));

  const xs = corners.map((c) => c.x);
  const ys = corners.map((c) => c.y);
  return { left: Math.min(...xs), top: Math.min(...ys), right: Math.max(...xs), bottom: Math.max(...ys) };
}

function isWithin(box: { left: number; top: number; right: number; bottom: number }, area: { x: number; y: number; width: number; height: number }, inset = 0): boolean {
  return (
    box.left >= area.x + inset &&
    box.top >= area.y + inset &&
    box.right <= area.x + area.width - inset &&
    box.bottom <= area.y + area.height - inset
  );
}

export function validateTemplate(design: TemplateDesign, print: PrintGeometry): ValidationResult {
  const issues: ValidationIssue[] = [];
  const layers = design.layers;

  for (const layer of layers) {
    if (layer.type === "group" || layer.type === "background") continue;

    const box = boundingBoxOf(layer);

    // Any part of the layer must stay within the printable region.
    if (!isWithin(box, print.printable, 0)) {
      issues.push({
        layerId: layer.id,
        layerName: layer.name,
        severity: "error",
        code: "OUTSIDE_PRINTABLE",
        message: `"${layer.name}" extends outside the printable area.`,
      });
    }

    // Text with customer placeholders should also stay inside the safe area so
    // they never collide with a trimmed edge.
    if (layer.type === "text" && layer.rules?.editable && !layer.rules?.required === false) {
      // intentionally left broad — required text must sit within safe area
    }
    if (layer.type === "text" && layer.rules?.editable) {
      if (!isWithin(box, print.printable, print.safe)) {
        issues.push({
          layerId: layer.id,
          layerName: layer.name,
          severity: "warning",
          code: "TEXT_NEAR_EDGE",
          message: `Editable text "${layer.name}" is close to the trim edge (inside the safe margin).`,
        });
      }
    }

    // Zero / degenerate size
    if (layer.width < 2 || layer.height < 2) {
      issues.push({
        layerId: layer.id,
        layerName: layer.name,
        severity: "warning",
        code: "DEGENERATE_SIZE",
        message: `"${layer.name}" is too small to print clearly.`,
      });
    }

    // Image placeholder validation
    if (layer.type === "image") {
      const img = layer as ImageLayer;
      if (!img.rules?.editable) continue;

      if (img.rules.required && !img.src) {
        issues.push({
          layerId: layer.id,
          layerName: layer.name,
          severity: "error",
          code: "REQUIRED_IMAGE_MISSING",
          message: `Image placeholder "${layer.name}" is required but has no image.`,
        });
      }

      // Resolution check (only when an image exists)
      const minW = img.rules?.minResolution?.width ?? 0;
      const minH = img.rules?.minResolution?.height ?? 0;
      if (img.src && minW > 0 && (img.imageWidth < minW || img.imageHeight < minH)) {
        issues.push({
          layerId: layer.id,
          layerName: layer.name,
          severity: "error",
          code: "LOW_RESOLUTION",
          message: `"${layer.name}" resolution (${img.imageWidth}×${img.imageHeight}) is below the ${minW}×${minH} minimum.`,
        });
      }
    }

    // Text placeholder validation
    if (layer.type === "text") {
      const txt = layer as TextLayer;
      if (!txt.rules?.editable) continue;
      const len = (txt.text || "").length;
      const max = txt.rules?.maxLength;
      if (txt.rules?.required && len === 0) {
        issues.push({
          layerId: layer.id,
          layerName: layer.name,
          severity: "error",
          code: "REQUIRED_TEXT_MISSING",
          message: `Text placeholder "${layer.name}" is required but empty.`,
        });
      }
      if (max && max > 0 && len > max) {
        issues.push({
          layerId: layer.id,
          layerName: layer.name,
          severity: "warning",
          code: "TEXT_TOO_LONG",
          message: `"${layer.name}" exceeds its ${max} character limit.`,
        });
      }
    }
  }

  const editableLayerCount = layers.filter(
    (l) =>
      l.type !== "background" &&
      !l.locked &&
      l.freelyMovable !== false &&
      ("rules" in l ? l.rules?.editable !== false : true),
  ).length;

  return {
    valid: issues.filter((i) => i.severity === "error").length === 0,
    issues,
    layerCount: layers.length,
    editableLayerCount,
  };
}
