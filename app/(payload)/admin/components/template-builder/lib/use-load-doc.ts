import { useCallback, useEffect, useState } from "react";
import { normalizeDesign } from "./serializer";
import type { PayloadTemplateDoc, TemplateDesign } from "./types";

interface LoadedDoc {
  doc: PayloadTemplateDoc | null;
  design: TemplateDesign;
  loading: boolean;
  error: string | null;
  docId: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  width: number;
  height: number;
  filesize?: number;
  thumbnailURL?: string;
  sizes?: Record<string, { url?: string; width?: number; height?: number }>;
}

/**
 * Loads a Product Template document (from the initial server-side doc when
 * available, otherwise a REST fetch) and normalizes its stored JSON into a
 * usable TemplateDesign.
 */
export function useLoadTemplateDocument(docId: string | undefined): LoadedDoc & { refresh: () => void } {
  const [doc, setDoc] = useState<PayloadTemplateDoc | null>(null);
  const [design, setDesign] = useState<TemplateDesign>(() =>
    normalizeDesign({
      app: "signages-templates",
      version: 1,
      title: "Untitled",
      width: 800,
      height: 800,
      unit: "px",
      dpi: 300,
      canvasColor: "#ffffff",
      layers: [],
    }),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!docId) {
      setLoading(false);
      setError("No template selected.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/product-templates/${docId}?depth=1`);
      if (!res.ok) throw new Error(`Failed to load template (${res.status})`);
      const json = (await res.json()) as Record<string, unknown>;
      const d = json as unknown as PayloadTemplateDoc;
      setDoc(d);

      const rawJSON = d.templateData?.templateJSON;
      if (rawJSON) {
        setDesign(normalizeDesign(rawJSON));
      } else {
        // Build from canvas/printAreas metadata
        setDesign(
          normalizeDesign({
            app: "signages-templates",
            version: 1,
            title: d.title,
            width: d.canvas?.width || 800,
            height: d.canvas?.height || 800,
            unit: d.canvas?.unit || "px",
            dpi: d.canvas?.dpi || 300,
            canvasColor: "#ffffff",
            layers: [],
          }),
        );
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load template.");
    } finally {
      setLoading(false);
    }
  }, [docId]);

  useEffect(() => {
    // Async data load; state updates occur in the promise continuation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { doc, design, loading, error, docId: (docId as string) ?? "", refresh: load };
}