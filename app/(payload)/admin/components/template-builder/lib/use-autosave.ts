import { useCallback, useEffect, useRef, useState } from "react";
import { designToSavePayload } from "./serializer";
import type { PayloadTemplateDoc, TemplateDesign } from "./types";

type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Debounced autosave. Writes the full template payload to the Product Templates
 * collection via Payload's REST API (/api/product-templates/:id). Polls after a
 * quiet period and exposes a manual save trigger.
 */
export function useAutoSave(docId: string | undefined, design: TemplateDesign, enabled: boolean) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDesign = useRef(design);
  const docInfo = useRef<PayloadTemplateDoc | null>(null);

  // Keep the snapshot ref in sync with the latest design.
  useEffect(() => {
    latestDesign.current = design;
  }, [design]);

  const saveNow = useCallback(async () => {
    if (!docId || !enabled) return;
    const design = latestDesign.current;
    setStatus("saving");
    try {
      const info = docInfo.current;
      const payload = designToSavePayload(design, {
        title: info?.title,
        slug: info?.slug,
        status: info?.status,
        templateData: info?.templateData as PayloadTemplateDoc["templateData"],
        previewImage: undefined,
      });
      const res = await fetch(`/api/product-templates/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      setStatus("saved");
      setLastSavedAt(new Date());
      setError(null);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Save failed");
    }
  }, [docId, enabled]);

  // Debounce autosave on design changes.
  useEffect(() => {
    if (!enabled || !docId) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void saveNow();
    }, 1500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [design, enabled, docId, saveNow]);

  const setDocumentInfo = useCallback((info: PayloadTemplateDoc | null) => {
    docInfo.current = info;
  }, []);

  return { status, lastSavedAt, error, saveNow, setDocumentInfo };
}
