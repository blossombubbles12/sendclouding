"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CanvasStage } from "./components/CanvasStage";
import { Toolbar } from "./components/Toolbar";
import { LayerPanel } from "./components/LayerPanel";
import { PropertyPanel } from "./components/Inspector";
import { MediaBrowser } from "./components/MediaBrowser";
import { MockupPicker, MockupPreview } from "./components/MockupPreview";
import { useLoadTemplateDocument, type MediaItem } from "./lib/use-load-doc";
import { useHistory } from "./lib/use-history";
import { useAutoSave } from "./lib/use-autosave";
import { defaultImageLayer, PRESET_SHAPES, PRESET_SVGS, createId } from "./lib/defaults";
import { validateTemplate, type ValidationResult } from "./lib/validation";
import type { AnyLayer, ImageLayer, MockupDef, PrintGeometry, ShapeLayer, TemplateDesign, TextLayer, SvgLayer } from "./lib/types";

export interface TemplateBuilderProps {
  documentId?: string;
}

export function TemplateBuilder({ documentId }: TemplateBuilderProps) {
  // ── doc loading ────────────────────────────────────────────────────────
  const { doc, design: initialDesign, loading, error, refresh } = useLoadTemplateDocument(documentId);

  // ── design state ───────────────────────────────────────────────────────
  const [design, setDesign] = useState<TemplateDesign>(initialDesign);
  const [selection, setSelection] = useState<string[]>([]);
  const [tool, setTool] = useState<"select" | "pan" | "rect" | "ellipse" | "text">("select");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showPrintOverlays, setShowPrintOverlays] = useState(true);
  const [snapToGuides, setSnapToGuides] = useState(true);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [pendingImageLayerId, setPendingImageLayerId] = useState<string | null>(null);
  const [mockup, setMockup] = useState<MockupDef>(DEFAULT_MOCKUP);
  const [showMockup, setShowMockup] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [historyEnabled, setHistoryEnabled] = useState(false);
  const [categoryId, setCategoryId] = useState<string>("");
  const lastCommitted = useRef<string>("");

  const { push, undo, redo, canUndo, canRedo } = useHistory();

  // Sync design once doc loads
  useEffect(() => {
    if (!loading) {
      // Synchronizing externally-fetched document into editor state on first load.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDesign(initialDesign);
      setHistoryEnabled(true);
      lastCommitted.current = JSON.stringify(initialDesign);
      const cat = doc?.category;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategoryId(typeof cat === "string" ? cat : cat?.id ?? "");
    }
  }, [loading, initialDesign, doc]);

  // Persist a category change immediately — it's metadata, not design JSON,
  // so it doesn't need to wait on the debounced design autosave loop.
  const handleCategoryChange = useCallback(
    async (nextCategoryId: string) => {
      setCategoryId(nextCategoryId);
      if (!documentId) return;
      try {
        await fetch(`/api/product-templates/${documentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: nextCategoryId || null }),
        });
      } catch {
        // Non-fatal — the next full save (or a manual retry) will pick it up.
      }
    },
    [documentId],
  );

  // ── print geometry ─────────────────────────────────────────────────────
  const print = useMemo<PrintGeometry>(() => {
    const pa = doc?.printAreas;
    return {
      printable: pa?.printableArea ?? { x: 0, y: 0, width: design.width, height: design.height },
      bleed: pa?.bleedArea ?? 0,
      safe: pa?.safeArea ?? Math.min(design.width, design.height) * 0.05,
    };
  }, [doc, design.width, design.height]);

  // ── autosave ───────────────────────────────────────────────────────────
  const autosave = useAutoSave(documentId, design, !loading && !!documentId);

  useEffect(() => {
    if (documentId) autosave.setDocumentInfo(doc);
  }, [doc, documentId, autosave]);

  // Mark dirty + push history when design changes (post initial load)
  useEffect(() => {
    if (!historyEnabled) return;
    const serialized = JSON.stringify(design);
    if (serialized !== lastCommitted.current) {
      lastCommitted.current = serialized;
      setIsDirty(true);
    }
  }, [design, historyEnabled]);

  // ── validation ─────────────────────────────────────────────────────────
  const validation: ValidationResult = useMemo(() => {
    if (!historyEnabled) return { valid: true, issues: [], layerCount: 0, editableLayerCount: 0 };
    return validateTemplate(design, print);
  }, [design, print, historyEnabled]);

  // ── history commit on drag/transform end ───────────────────────────────
  const commitToHistory = useCallback(() => {
    push(design);
    setIsDirty(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design]);

  const handleUndo = useCallback(() => {
    const prev = undo(design);
    if (prev) {
      setDesign(prev);
      setIsDirty(true);
    }
  }, [undo, design]);

  const handleRedo = useCallback(() => {
    const next = redo(design);
    if (next) {
      setDesign(next);
      setIsDirty(true);
    }
  }, [redo, design]);

  const handleDelete = useCallback(
    (ids: string[]) => {
      setDesign((d) => ({ ...d, layers: d.layers.filter((l) => !ids.includes(l.id)) }));
      setSelection((s) => s.filter((id) => !ids.includes(id)));
      setIsDirty(true);
    },
    [],
  );

  // ── keyboard shortcuts ─────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) {
        if (e.key === "Escape") (target as HTMLInputElement).blur();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void autosave.saveNow();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        const sel = selection.filter((id) => {
          const l = design.layers.find((x) => x.id === id);
          return l && l.type !== "background" && !l.locked;
        });
        if (sel.length > 0) {
          e.preventDefault();
          handleDelete(sel);
        }
      } else if (e.key === "Escape") {
        setSelection([]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, design, handleUndo, handleRedo, autosave]);

  // ── layer ops ──────────────────────────────────────────────────────────
  const handleUpdateLayer = useCallback(
    (id: string, patch: Partial<AnyLayer>) => {
      setDesign((d) => ({
        ...d,
        layers: d.layers.map((l) => (l.id === id ? ({ ...l, ...patch } as AnyLayer) : l)),
      }));
    },
    [],
  );

  const handleAddLayer = useCallback((layer: AnyLayer) => {
    setDesign((d) => ({ ...d, layers: [...d.layers, layer] }));
    setSelection([layer.id]);
    setIsDirty(true);
  }, []);

  const handleDuplicate = useCallback(
    (id: string) => {
      const layer = design.layers.find((l) => l.id === id);
      if (!layer || layer.type === "background") return;
      const copy = JSON.parse(JSON.stringify(layer)) as AnyLayer;
      copy.id = createId(layer.type);
      copy.name = `${layer.name} copy`;
      copy.x += 12;
      copy.y += 12;
      copy.zIndex = design.layers.length + 1;
      setDesign((d) => ({ ...d, layers: [...d.layers, copy] }));
      setSelection([copy.id]);
      setIsDirty(true);
    },
    [design],
  );

  const handleToggleLock = useCallback(
    (id: string) => {
      setDesign((d) => ({ ...d, layers: d.layers.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)) }));
      setSelection((s) => s.filter((sid) => sid !== id));
    },
    [],
  );

  const handleToggleVisible = useCallback((id: string) => {
    setDesign((d) => ({ ...d, layers: d.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)) }));
  }, []);

  const handleRename = useCallback(
    (id: string, name: string) => {
      setDesign((d) => ({ ...d, layers: d.layers.map((l) => (l.id === id ? { ...l, name } : l)) }));
      setDesign((d) => d);
    },
    [],
  );

  const handleReorder = useCallback((id: string, dir: "up" | "down") => {
    setDesign((d) => {
      const layers = [...d.layers];
      const idx = layers.findIndex((l) => l.id === id);
      if (idx < 0) return d;
      const target = dir === "up" ? idx + 1 : idx - 1;
      if (target < 0 || target >= layers.length) return d;
      const tmp = layers[idx];
      layers[idx] = layers[target];
      layers[target] = tmp;
      layers.forEach((l, i) => (l.zIndex = i));
      return { ...d, layers };
    });
    setIsDirty(true);
  }, []);

  // ── add tools ──────────────────────────────────────────────────────────
  const addText = useCallback(() => {
    const layer: TextLayer = {
      id: createId("txt"),
      name: "Text",
      type: "text",
      x: 80,
      y: 80,
      width: 300,
      height: 60,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      freelyMovable: true,
      groupId: "",
      zIndex: design.layers.length + 1,
      text: "Your text here",
      fontFamily: "Inter",
      fontSize: 28,
      fontWeight: "bold",
      fontStyle: "normal",
      fill: "#18181B",
      textAlign: "center",
      textDecoration: "none",
      letterSpacing: 0,
      lineHeight: 1.2,
      rules: {
        editable: true,
        role: "editable_text",
        required: false,
        placeholder: "Type something…",
        maxLength: 120,
        minLength: 0,
        allowedFormats: [],
        maxFileSizeMB: 0,
        minResolution: { width: 0, height: 0 },
        cropMode: "cover",
        aspectRatioLocked: false,
      },
    };
    handleAddLayer(layer);
  }, [design.layers.length, handleAddLayer]);

  const addShape = useCallback(
    (kind: "rect" | "ellipse" | "triangle") => {
      const layer: ShapeLayer = {
        id: createId("shp"),
        name: kind.charAt(0).toUpperCase() + kind.slice(1),
        type: "shape",
        kind,
        x: 100,
        y: 100,
        width: 160,
        height: 160,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        freelyMovable: true,
        groupId: "",
        zIndex: design.layers.length + 1,
        fill: "#CB3438",
        stroke: "rgba(0,0,0,0)",
        strokeWidth: 0,
        cornerRadius: 0,
        shadowColor: "rgba(0,0,0,0)",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowOpacity: 0,
      };
      handleAddLayer(layer);
    },
    [design.layers.length, handleAddLayer],
  );

  const addSvgIcon = useCallback(
    (iconId: string) => {
      const preset = PRESET_SVGS.find((s) => s.id === iconId);
      if (!preset) return;
      const layer: SvgLayer = {
        id: createId("svg"),
        name: preset.label,
        type: "svg",
        paths: preset.d,
        icon: preset.id,
        x: 100,
        y: 100,
        width: 120,
        height: 120,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        freelyMovable: true,
        groupId: "",
        zIndex: design.layers.length + 1,
        fill: "transparent",
        stroke: "#CB3438",
        strokeWidth: 2,
      };
      handleAddLayer(layer);
    },
    [design.layers.length, handleAddLayer],
  );

  const openMediaForImage = useCallback((id: string | null) => {
    setPendingImageLayerId(id);
    setMediaOpen(true);
  }, []);

  const handleMediaSelect = useCallback(
    (item: MediaItem) => {
      const applyToImage = (l: ImageLayer): ImageLayer => ({
        ...l,
        src: item.sizes?.card?.url ?? item.url,
        mediaId: item.id,
        imageWidth: item.width || l.imageWidth,
        imageHeight: item.height || l.imageHeight,
      });

      if (pendingImageLayerId) {
        // replace existing image layer
        setDesign((d) => ({
          ...d,
          layers: d.layers.map((l) => (l.id === pendingImageLayerId ? applyToImage(l as ImageLayer) : l)),
        }));
      } else {
        // add new image layer
        const layer = applyToImage(
          defaultImageLayer({
            id: createId("img"),
            name: "Image",
            x: 80,
            y: 80,
            width: 240,
            height: 240,
            rules: {
              editable: true,
              role: "design",
              required: false,
              placeholder: "Image",
              maxLength: 0,
              minLength: 0,
              allowedFormats: ["png", "jpg", "jpeg", "webp"],
              maxFileSizeMB: 10,
              minResolution: { width: 0, height: 0 },
              cropMode: "cover",
              aspectRatioLocked: true,
            },
          }),
        );
        setDesign((d) => ({ ...d, layers: [...d.layers, layer] }));
        setSelection([layer.id]);
      }
      setMediaOpen(false);
      setPendingImageLayerId(null);
      setIsDirty(true);
    },
    [pendingImageLayerId],
  );

  const clearImage = useCallback((id: string) => {
    setDesign((d) => ({
      ...d,
      layers: d.layers.map((l) => (l.id === id ? { ...l, src: "", mediaId: null } : (l as AnyLayer))),
    }));
    setIsDirty(true);
  }, []);

  // ── publish / save ─────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    commitToHistory();
    await autosave.saveNow();
    setIsDirty(false);
  }, [commitToHistory, autosave]);

  const handlePublish = useCallback(async () => {
    if (!documentId) return;
    const result = validateTemplate(design, print);
    if (!result.valid) {
      alert("Template has validation errors that must be fixed before publishing.");
      return;
    }
    try {
      const res = await fetch(`/api/product-templates/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      if (!res.ok) throw new Error(`Publish failed: ${res.status}`);
      await autosave.saveNow();
      alert("Template published.");
      refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Publish failed.");
    }
  }, [design, print, documentId, autosave, refresh]);

  // ── shapes / icons menus in layer panel sidebar ────────────────────────
  const [shapeMenuOpen, setShapeMenuOpen] = useState(false);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(4, z * 1.15)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(0.05, z / 1.15)), []);
  const zoomReset = useCallback(() => setZoom(1), []);

  if (loading) {
    return (
      <div className="tb-loading">
        <div className="tb-spinner" />
        Loading template…
      </div>
    );
  }

  if (error) {
    return (
      <div className="tb-loading" style={{ color: "var(--tb-danger, #f87171)" }}>
        {error}
        <button className="tb-btn tb-btn--primary" onClick={() => refresh()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="tb-app">
      <Toolbar
        tool={tool}
        zoom={zoom}
        canUndo={canUndo}
        canRedo={canRedo}
        showGrid={showGrid}
        showPrintOverlays={showPrintOverlays}
        snapToGuides={snapToGuides}
        saving={autosave.status}
        status={autosave.status}
        isDirty={isDirty}
        canPublish={validation.valid}
        title={doc?.title ?? design.title}
        categoryId={categoryId}
        onCategoryChange={(id) => void handleCategoryChange(id)}
        onToolChange={(t) => setTool(t as typeof tool)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={zoomReset}
        onToggleGrid={() => setShowGrid((v) => !v)}
        onTogglePrintOverlays={() => setShowPrintOverlays((v) => !v)}
        onToggleSnap={() => setSnapToGuides((v) => !v)}
        onSave={() => void handleSave()}
        onPublish={() => void handlePublish()}
        onAddImage={() => openMediaForImage(null)}
        onTitleChange={(title) => {
          setDesign((d) => ({ ...d, title }));
          setIsDirty(true);
        }}
      />

      <div className="tb-body">
        <LayerPanel
          layers={design.layers}
          selection={selection}
          onSelect={(id, additive) => {
            if (additive) setSelection((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
            else setSelection([id]);
          }}
          onDelete={(id) => handleDelete([id])}
          onDuplicate={handleDuplicate}
          onToggleLock={handleToggleLock}
          onToggleVisible={handleToggleVisible}
          onAddText={addText}
          onAddShape={() => setShapeMenuOpen(true)}
          onAddImage={() => openMediaForImage(null)}
          onReorder={handleReorder}
          onRename={handleRename}
        />

        <div className="tb-canvas-wrap">
          <CanvasStage
            design={design}
            print={print}
            selection={selection}
            zoom={zoom}
            pan={pan}
            showGrid={showGrid}
            showPrintOverlays={showPrintOverlays}
            snapToGuides={snapToGuides}
            tool={tool}
            onSelect={setSelection}
            onZoomChange={setZoom}
            onPanChange={setPan}
            onUpdateLayer={handleUpdateLayer}
            onAddLayer={handleAddLayer}
            onBeginEditingText={(id) => {
              setEditingTextId(id);
            }}
          />
          {editingTextId && (
            <TextEditOverlay
              initialValue={design.layers.find((l) => l.id === editingTextId)?.type === "text" ? (design.layers.find((l) => l.id === editingTextId) as TextLayer).text : ""}
              onSave={(v) => handleUpdateLayer(editingTextId, { text: v })}
              onClose={() => setEditingTextId(null)}
            />
          )}
          <div className="tb-validation-panel">
            <div className="tb-validation-head">
              <span>Print Validation</span>
              <span
                style={{
                  marginLeft: "auto",
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  background: validation.valid ? "rgba(76,175,80,0.15)" : "rgba(220,38,38,0.15)",
                  color: validation.valid ? "#4caf50" : "#f87171",
                }}
              >
                {validation.valid ? `${validation.layerCount} layers · OK` : `${validation.issues.filter((i) => i.severity === "error").length} errors`}
              </span>
            </div>
            {validation.issues.length > 0 && (
              <div>
                {validation.issues.map((issue, i) => (
                  <div key={i} className={`tb-validation-item tb-validation-item--${issue.severity}`}>
                    <span>●</span>
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="tb-zoom-control">
            <button className="tb-btn tb-btn--small" onClick={zoomOut}>
              −
            </button>
            <span className="tb-zoom-value">{Math.round(zoom * 100)}%</span>
            <button className="tb-btn tb-btn--small" onClick={zoomIn}>
              +
            </button>
          </div>
        </div>

        <PropertyPanel
          layers={selection.map((id) => design.layers.find((l) => l.id === id)).filter((l): l is AnyLayer => Boolean(l))}
          onUpdate={handleUpdateLayer}
          onPickImage={(id) => openMediaForImage(id)}
          onClearImage={clearImage}
        />
      </div>

      {/* right dock for mockup preview */}
      {showMockup && (
        <div className="tb-sidebar tb-sidebar--right" style={{ position: "absolute", right: 0, top: 52, bottom: 0, width: 280, zIndex: 20, background: "var(--theme-elevation-0)" }}>
          <div className="tb-panel-head">
            <span>Live Preview</span>
            <button className="tb-btn tb-btn--small" onClick={() => setShowMockup(false)}>
              Hide
            </button>
          </div>
          <MockupPicker design={design} current={mockup.kind} onSelect={setMockup} />
          <MockupPreview design={design} mockup={mockup} />
        </div>
      )}

      <MediaBrowser open={mediaOpen} onClose={() => setMediaOpen(false)} onSelect={handleMediaSelect} />

      {/* shape picker */}
      {shapeMenuOpen && (
        <div className="tb-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShapeMenuOpen(false)}>
          <div className="tb-modal" style={{ maxWidth: 420 }}>
            <div className="tb-modal-head">
              <div className="tb-modal-title">Add Shape</div>
              <button className="tb-btn" onClick={() => setShapeMenuOpen(false)}>
                Close
              </button>
            </div>
            <div className="tb-modal-body">
              <div className="tb-panel-head">Shapes</div>
              <div className="tb-shape-grid">
                {PRESET_SHAPES.map((s) => (
                  <button
                    key={s}
                    className="tb-shape-cell"
                    onClick={() => {
                      addShape(s);
                      setShapeMenuOpen(false);
                    }}
                  >
                    {s === "rect" && <svg width="28" height="28" viewBox="0 0 24 24" fill="#CB3438"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>}
                    {s === "ellipse" && <svg width="28" height="28" viewBox="0 0 24 24" fill="#CB3438"><ellipse cx="12" cy="12" rx="9" ry="7" /></svg>}
                    {s === "triangle" && <svg width="28" height="28" viewBox="0 0 24 24" fill="#CB3438"><path d="M12 3L21 21H3L12 3z" /></svg>}
                  </button>
                ))}
              </div>
              <div className="tb-panel-head" style={{ marginTop: 12 }}>Icons</div>
              <div className="tb-icon-grid">
                {PRESET_SVGS.map((svg) => (
                  <button
                    key={svg.id}
                    className="tb-icon-cell"
                    title={svg.label}
                    onClick={() => {
                      addSvgIcon(svg.id);
                      setShapeMenuOpen(false);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CB3438" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={svg.d} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Minimal inline text editor overlay (textarea above the layer position).
function TextEditOverlay({ initialValue, onSave, onClose }: { initialValue: string; onSave: (v: string) => void; onClose: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 30,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div style={{ width: "min(480px, 90%)", background: "var(--theme-elevation-0)", border: "1px solid var(--theme-elevation-100)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Edit text</div>
        <textarea
          autoFocus
          className="tb-textarea"
          style={{ minHeight: 90 }}
          defaultValue={initialValue}
          placeholder="Type text…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onSave((e.target as HTMLTextAreaElement).value);
              onClose();
            }
            if (e.key === "Escape") onClose();
          }}
        />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="tb-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="tb-btn tb-btn--primary"
            onClick={(e) => {
              const ta = (e.currentTarget as HTMLButtonElement).closest("[data-tb-modal]")?.querySelector("textarea") as HTMLTextAreaElement | null;
              onSave(ta?.value ?? initialValue);
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_MOCKUP = {
  kind: "flat",
  label: "Design",
  shape: "rect",
  warp: { startX: 0, startY: 0, width: 1, height: 1, rx: 0 },
} as MockupDef;
