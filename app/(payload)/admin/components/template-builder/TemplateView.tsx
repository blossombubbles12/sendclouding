"use client";

import Link from "next/link";
import { useState } from "react";
import { useDocumentInfo } from "@payloadcms/ui";
import { TemplateBuilder } from "./TemplateBuilder";
import "./builder.css";

/**
 * Client-side entry point for Payload's custom document view.
 *
 * NOTE: `routeSegments` only exists on `DocumentViewServerPropsOnly` and is
 * NOT forwarded to client components (`DocumentViewClientProps`), so it is
 * always `undefined` here — reading it directly would make this component
 * think there's no document id and always render the "create new" form,
 * even when editing an existing template. Instead we read the id from
 * Payload's `useDocumentInfo()` context, which is populated correctly for
 * both the create and edit routes.
 */
export function TemplateBuilderView() {
  const { id } = useDocumentInfo();

  if (!id) {
    return <CreateTemplate />;
  }

  return <TemplateBuilder documentId={String(id)} />;
}

function CreateTemplate() {
  const [title, setTitle] = useState("");
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const loadProducts = async () => {
    if (fetched) return;
    try {
      const res = await fetch("/api/products?limit=100&depth=0");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setProducts((json.docs ?? []).map((d: { id: string; name?: string; title?: string }) => ({ id: d.id, name: d.name || d.title || d.id })));
    } catch {
      // non-fatal; product list optional
    }
    setFetched(true);
  };

  const create = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/product-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
          status: "draft",
          linkedProduct: productId || undefined,
          canvas: { width: 800, height: 800, unit: "px", dpi: 300 },
          printAreas: {
            printableArea: { x: 0, y: 0, width: 800, height: 800 },
            bleedArea: 0,
            safeArea: 40,
          },
          templateData: {
            templateVersion: "1.0.0",
            templateJSON: {
              app: "signages-templates",
              version: 1,
              title: title.trim(),
              width: 800,
              height: 800,
              unit: "px",
              dpi: 300,
              canvasColor: "#ffffff",
              layers: [],
            },
            layerCount: 0,
            editableLayerCount: 0,
          },
        }),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      const doc = await res.json();
      // The admin panel is a separate SPA; a full navigation is required to
      // (re)mount the template builder with the newly-created document id.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/admin/collections/product-templates/${doc.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create template.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tb-app" style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 420, background: "var(--theme-elevation-0)", border: "1px solid var(--theme-elevation-100)", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
        <Link href="/admin/collections/product-templates" className="tb-back" style={{ alignSelf: "flex-start" }} title="Back to templates">
          {"\u2190 Back to templates"}
        </Link>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Create a new template</div>
          <div style={{ fontSize: 13, color: "var(--theme-elevation-500)", marginTop: 4 }}>
            Set up the basic template, then open the visual builder to design your print layout.
          </div>
        </div>
        <input className="tb-input" placeholder="Template title (e.g. Birthday Mug Design)" value={title} onChange={(e) => setTitle(e.target.value)} onFocus={loadProducts} />
        <select className="tb-select" value={productId} onChange={(e) => setProductId(e.target.value)} onFocus={loadProducts}>
          <option value="">— Link to a product (optional) —</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {error && <div style={{ color: "#f87171", fontSize: 13 }}>{error}</div>}
        <button className="tb-btn tb-btn--primary" style={{ width: "100%", justifyContent: "center", padding: "10px 12px" }} onClick={() => void create()} disabled={loading || !title.trim()}>
          {loading ? "Creating…" : "Create & Open Builder"}
        </button>
      </div>
    </div>
  );
}

export default TemplateBuilderView;
