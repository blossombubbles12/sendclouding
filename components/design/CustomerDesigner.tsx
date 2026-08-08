"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2, Save, ShoppingCart, Sparkles, Upload, X, AlertTriangle, Check } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { DesignCanvas, type PreviewHandle } from "@/components/design/DesignCanvas";
import type { DesignPackage, DesignProductionMetadata } from "@/lib/design/types";
import {
  validatePlaceholders,
  textPlaceholders,
  imagePlaceholders,
  placeholderLabel,
  requiredPlaceholderCount,
} from "@/lib/design/validation";
import { saveDesign, uploadDesignImage, dataUrlToBlob, getGuestToken, rememberLastDesign, lastDesignIdFor, loadDesign } from "@/lib/design/client";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DesignerProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image?: string | null;
    imageAlt?: string;
  };
  template?: {
    id: string;
    title: string;
    templateVersion?: string;
    designJSON?: unknown;
    canvas?: { width?: number; height?: number; unit?: string; dpi?: number } | null;
  } | null;
  customization?: {
    printSpecifications?: {
      printableAreaWidth?: number;
      printableAreaHeight?: number;
      printableAreaUnit?: string;
      minimumImageResolution?: number;
    };
    productionSettings?: {
      productionTime?: number;
      designApprovalRequired?: boolean;
      printProvider?: string;
    };
  } | null;
  existingDesignId?: string | null;
  initialDesignJSON?: unknown;
}

export function CustomerDesigner({
  product,
  template,
  customization,
  existingDesignId,
  initialDesignJSON,
}: DesignerProps) {
  const router = useRouter();
  const { addItem, updateDesignItem } = useCart();
  const previewRef = React.useRef<PreviewHandle>(null);

  const [designJSON, setDesignJSON] = React.useState<unknown>(initialDesignJSON ?? template?.designJSON ?? null);
  const [activeDesignId, setActiveDesignId] = React.useState<string | null>(existingDesignId ?? null);
  const restoredRef = React.useRef(false);
  const [textValues, setTextValues] = React.useState<Record<string, string>>({});
  const [imageValues, setImageValues] = React.useState<Record<string, { url: string; id: string }>>({});
  const [uploadingFor, setUploadingFor] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState("");
  const [summary, setSummary] = React.useState<string | null>(null);

  const design = React.useMemo(() => {
    if (!designJSON || typeof designJSON !== "object") return null;
    return designJSON as {
      width: number;
      height: number;
      unit: string;
      dpi: number;
      canvasColor: string;
      version: number;
      app: string;
      layers: Array<Record<string, unknown>>;
    };
  }, [designJSON]);

  const textFields = React.useMemo(() => (design ? textPlaceholders(design as never) : []), [design]);
  const imageFields = React.useMemo(() => (design ? imagePlaceholders(design as never) : []), [design]);

  const required = design ? requiredPlaceholderCount(design as never) : 0;
  const options = React.useMemo(
    () => ({ text: textValues, images: imageValues }),
    [textValues, imageValues],
  );

  const validation = React.useMemo(() => {
    if (!design) return { complete: true, missing: [] as { name: string }[], all: [] as unknown[] };
    const result = validatePlaceholders(design as never, options);
    return result;
  }, [design, options]);

  // Seed text values from template defaults once.
  React.useEffect(() => {
    if (!design || Object.keys(textValues).length > 0) return;
    const seed: Record<string, string> = {};
    for (const f of textFields) {
      const value = typeof f.text === "string" ? f.text : "";
      if (value && f.rules?.role === "editable_text") seed[f.id] = value;
    }
    if (Object.keys(seed).length > 0) {
      // One-time initialization from the template's default text values.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTextValues(seed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design]);

  // Auto-restore an unfinished design for this product when no design is open —
  // e.g. the customer returns but didn't come through the cart edit link.
  React.useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    if (existingDesignId) return;
    const lastId = lastDesignIdFor(product.id);
    if (!lastId) return;
    let cancelled = false;
    (async () => {
      try {
        const pkg = await loadDesign(lastId);
        if (cancelled || !pkg?.design) return;
        setDesignJSON(pkg.design);
        setActiveDesignId(pkg.designId);
        setImageValues((prev) => ({ ...prev, ...(pkg.options?.images ?? {}) }));
        const textSeed = pkg.options?.text ?? {};
        if (Object.keys(textSeed).length) setTextValues(textSeed);
      } catch {
        /* ignore restore failures */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [existingDesignId, product.id]);

  const uploadImage = async (layerId: string, file: File) => {
    setUploadingFor(layerId);
    setError("");
    try {
      const ref = await uploadDesignImage(file, placeholderLabel(imageFields.find((f) => f.id === layerId) as never) || "Design image");
      setImageValues((prev) => ({ ...prev, [layerId]: { url: ref.url, id: ref.id } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed.");
    } finally {
      setUploadingFor(null);
    }
  };

  const generatePackage = async (): Promise<DesignPackage> => {
    const designObj = design as {
      width: number;
      height: number;
      unit: string;
      dpi: number;
      layers: Array<Record<string, unknown>>;
    };

    // Build a merged design where placeholder layers carry the customer's answers.
    const layers = designObj.layers.map((layer) => {
      const l = { ...layer } as Record<string, unknown>;
      const layerId = typeof layer.id === "string" ? layer.id : "";
      const role = (layer.rules as Record<string, unknown> | undefined)?.role;
      if (textValues[layerId] !== undefined && role === "editable_text") l.text = textValues[layerId];
      const img = imageValues[layerId];
      if (img && role === "image_placeholder") {
        l.src = img.url;
        l.mediaId = img.id;
      }
      return l;
    });
    const filledDesign = { ...designObj, layers };

    // Persist preview thumbnail via canvas export.
    let previewMedia: { id: string; url: string; thumbnailUrl?: string } | null = null;
    let previewDataUrl: string | null = null;
    const dataUrl = previewRef.current?.toDataURL(0.5);
    if (dataUrl) {
      previewDataUrl = dataUrl;
      try {
        previewMedia = await uploadDesignImage(dataUrlToBlob(dataUrl), `${product.name} preview`);
      } catch {
        previewMedia = null;
      }
    }

    const print = customization?.printSpecifications;
    const prodSettings = customization?.productionSettings;

    const production: DesignProductionMetadata = {
      productId: product.id,
      templateId: template?.id ?? null,
      templateVersion: template?.templateVersion ?? null,
      productName: product.name,
      canvas: { width: designObj.width, height: designObj.height, unit: designObj.unit, dpi: designObj.dpi },
      print: {
        widthMm: print?.printableAreaWidth,
        heightMm: print?.printableAreaHeight,
        unit: print?.printableAreaUnit,
        minResolutionDpi: print?.minimumImageResolution,
        productionTimeDays: prodSettings?.productionTime,
        printProvider: prodSettings?.printProvider,
        designApprovalRequired: prodSettings?.designApprovalRequired,
      },
      requiredPlaceholderCount: required,
      completedPlaceholderCount: required - validation.missing.length,
      allRequiredCompleted: validation.complete,
    };

    const assets = Object.values(imageValues).map((v) => ({ id: v.id, url: v.url }));

    return {
      designId: activeDesignId || "pending",
      productId: product.id,
      productName: product.name,
      templateId: template?.id ?? null,
      templateVersion: template?.templateVersion ?? null,
      design: filledDesign as never,
      options: { text: textValues, images: imageValues },
      previewImage: previewDataUrl,
      previewMedia,
      assets,
      production,
    };
  };

  const handleSave = async (status: "draft" | "saved" = "saved") => {
    if (!design) return;
    setSaving(true);
    setError("");
    try {
      const pkg = await generatePackage();
      const doc = await saveDesign(pkg, activeDesignId, status);
      rememberLastDesign(product.id, doc.id);
      setActiveDesignId(doc.id);
      setSaved(true);
      setSummary(`Design saved. ${status === "draft" ? "You can return anytime to continue." : ""}`.trim());
      router.replace(`/design/${product.slug}?design=${doc.id}${status === "draft" ? "&saved=1" : ""}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save design.");
    } finally {
      setSaving(false);
    }
  };

  const buildCartItem = (pkg: DesignPackage, docId: string) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    quantity: 1,
    image: pkg.previewMedia?.thumbnailUrl || pkg.previewMedia?.url || product.image || undefined,
    imageAlt: `${product.name} — customized design`,
    lineKey: docId,
    isCustomized: true,
    designId: docId,
    previewImage: pkg.previewMedia?.url || pkg.previewImage || undefined,
    previewMediaId: pkg.previewMedia?.id || undefined,
    designOptions: pkg.options,
    productionReady: validation.complete,
    productionMetadata: pkg.production,
    templateId: pkg.templateId ?? undefined,
    templateVersion: pkg.templateVersion ?? undefined,
    designJSON: pkg.design,
    assets: pkg.assets,
  });

  const handleAddToCart = async () => {
    if (!design) return;
    if (!validation.complete) {
      setError(`Please complete the required fields: ${validation.missing.map((m) => m.name).join(", ")}.`);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const pkg = await generatePackage();
      const doc = await saveDesign(pkg, activeDesignId, "saved");
      pkg.designId = doc.id;
      // Editing an existing design updates the existing cart line; otherwise add new.
      if (activeDesignId) {
        // Keep the original line key so the existing row is matched in place.
        updateDesignItem(activeDesignId, { ...buildCartItem(pkg, doc.id), lineKey: activeDesignId });
      } else {
        addItem(buildCartItem(pkg, doc.id));
      }
      router.push("/cart");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add to cart.");
      setSaving(false);
    }
  };

  if (!design) {
    // This isn't a transient loading state — all data is resolved server-side
    // before this component ever mounts. If we get here, the product simply
    // has no design template (or design) attached, so show that clearly
    // instead of spinning forever.
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        <p className="font-medium text-foreground">No design template is available yet for this product.</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {`We haven't set up a customization template for "${product.name}" yet. Please check back soon or contact us for help.`}
        </p>
        <LinkToBack slug={product.slug} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
      {/* Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
            <p className="text-sm text-muted-foreground">
              {template?.title || "Custom design"} · {formatCurrency(product.price)}
            </p>
          </div>
          <LinkToBack slug={product.slug} />
        </div>

        <DesignCanvas ref={previewRef} design={design as never} options={options} />

        <div className="flex items-center gap-2 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
          <Sparkles className="h-4 w-4 text-secondary" />
          {validation.complete
            ? "All required placeholders complete — ready to add to cart."
            : `${validation.all.filter((v) => (v as { error?: string }).error).length} placeholder${validation.all.filter((v) => (v as { error?: string }).error).length === 1 ? "" : "s"} need attention.`}
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent">
            <Check className="h-4 w-4" /> {summary || "Design saved."}
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Placeholder controls */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="mb-1 text-lg font-semibold text-foreground">Customize Your Design</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Fill the highlighted areas. {required > 0 && <span className="font-medium text-foreground">{required} required.</span>}
          </p>

          {textFields.length === 0 && imageFields.length === 0 && (
            <p className="text-sm text-muted-foreground">This template has no editable placeholders.</p>
          )}

          {textFields.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Text</h3>
              {textFields.map((field) => (
                <div key={field.id}>
                  <Label htmlFor={field.id}>
                    {placeholderLabel(field as never)}
                    {field.rules?.required && <span className="text-destructive"> *</span>}
                  </Label>
                  <Input
                    id={field.id}
                    value={textValues[field.id] ?? ""}
                    maxLength={field.rules?.maxLength || undefined}
                    onChange={(e) => setTextValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                    placeholder={field.rules?.placeholder || "Type here"}
                  />
                  {field.rules?.maxLength ? (
                    <p className="mt-1 text-right text-[11px] text-muted-foreground">
                      {(textValues[field.id] ?? "").length}/{field.rules.maxLength}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          {imageFields.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Images</h3>
              {imageFields.map((field) => {
                const current = imageValues[field.id];
                return (
                  <div key={field.id}>
                    <Label>
                      {placeholderLabel(field as never)}
                      {field.rules?.required && <span className="text-destructive"> *</span>}
                    </Label>
                    <UploadArea
                      current={current}
                      busy={uploadingFor === field.id}
                      onFile={(file) => uploadImage(field.id, file)}
                      onClear={() =>
                        setImageValues((prev) => {
                          const next = { ...prev };
                          delete next[field.id];
                          return next;
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button className="w-full" size="lg" onClick={handleAddToCart} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
            Add to Cart
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleSave("draft")} disabled={saving}>
            <Save className="h-4 w-4" /> Save for Later
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Saved to <span className="font-mono">{getGuestToken().slice(0, 10)}…</span> — return anytime to continue.
        </p>
      </div>
    </div>
  );
}

function LinkToBack({ slug }: { slug: string }) {
  return (
    <a href={`/products/${slug}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" /> Back
    </a>
  );
}

function UploadArea({
  current,
  busy,
  onFile,
  onClear,
}: {
  current?: { url: string; id: string };
  busy: boolean;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="mt-1.5">
      {current ? (
        <div className="flex items-center gap-3 rounded-xl border border-border p-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image src={current.url} alt="Uploaded design" fill className="object-cover" sizes="56px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">Image ready</p>
            <button type="button" onClick={onClear} className="mt-0.5 inline-flex items-center gap-1 text-xs text-destructive hover:underline">
              <X className="h-3 w-3" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-secondary hover:text-secondary disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? "Uploading…" : "Click to upload an image"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}