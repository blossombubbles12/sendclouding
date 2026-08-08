"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CircleIcon,
  Grid3x3,
  Hand,
  ImageIcon,
  MousePointer2,
  Redo2,
  SaveIcon,
  Square,
  TextCursorInput,
  Type,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "./icons";

interface ToolbarProps {
  tool: string;
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  showGrid: boolean;
  showPrintOverlays: boolean;
  snapToGuides: boolean;
  saving: string;
  status: "idle" | "saving" | "saved" | "error";
  isDirty: boolean;
  canPublish: boolean;
  title: string;
  categoryId: string;
  onCategoryChange: (categoryId: string) => void;
  onToolChange: (tool: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onToggleGrid: () => void;
  onTogglePrintOverlays: () => void;
  onToggleSnap: () => void;
  onSave: () => void;
  onPublish: () => void;
  onAddImage: () => void;
  onTitleChange: (title: string) => void;
}

const TOOLS = [
  { id: "select", label: "Select", icon: MousePointer2 },
  { id: "hand", label: "Pan", icon: Hand },
  { id: "rect", label: "Rectangle", icon: Square },
  { id: "ellipse", label: "Ellipse", icon: CircleIcon },
  { id: "text", label: "Text", icon: TextCursorInput },
];

const STATUS_LABEL: Record<ToolbarProps["status"], string> = {
  idle: "Unsaved changes",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
};

export function Toolbar(props: ToolbarProps) {
  const { status } = props;
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/categories?limit=100&depth=0")
      .then((res) => (res.ok ? res.json() : { docs: [] }))
      .then((json) => {
        if (cancelled) return;
        const docs = (json.docs ?? []) as { id: string; name?: string }[];
        setCategories(docs.map((d) => ({ id: d.id, name: d.name || d.id })));
      })
      .catch(() => {
        // Non-fatal — category assignment is optional.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="tb-topbar">
      <Link className="tb-back" href="/admin/collections/product-templates" title="Back to templates">
        {"\u2190"} Templates
      </Link>
      <div className="tb-brand">
        <span className="tb-brand-dot" />
        Template Builder
      </div>

      <input
        className="tb-title-input"
        value={props.title}
        onChange={(e) => props.onTitleChange(e.target.value)}
        placeholder="Untitled template"
      />

      <select
        className="tb-select"
        style={{ maxWidth: 180 }}
        value={props.categoryId}
        onChange={(e) => props.onCategoryChange(e.target.value)}
        title="Template category"
      >
        <option value="">No category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <div className="tb-spacer" />

      {/* Tools */}
      <div className="tb-tool-group">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              className={`tb-btn ${props.tool === t.id ? "tb-btn--active" : ""}`}
              title={t.label}
              onClick={() => props.onToolChange(t.id)}
            >
              <Icon />
            </button>
          );
        })}
      </div>

      <div className="tb-gap" />

      {/* Toggles */}
      <div className="tb-tool-group">
        <button
          className={`tb-btn ${props.showGrid ? "tb-btn--active" : ""}`}
          title="Toggle grid"
          onClick={props.onToggleGrid}
        >
          <Grid3x3 />
        </button>
        <button
          className={`tb-btn ${props.showPrintOverlays ? "tb-btn--active" : ""}`}
          title="Toggle print area overlays"
          onClick={props.onTogglePrintOverlays}
        >
          <Square />
        </button>
        <button
          className={`tb-btn ${props.snapToGuides ? "tb-btn--active" : ""}`}
          title="Toggle snap to guides"
          onClick={props.onToggleSnap}
        >
          <Type />
        </button>
      </div>

      <div className="tb-gap" />

      {/* Zoom */}
      <div className="tb-tool-group">
        <button className="tb-btn" title="Zoom out" onClick={props.onZoomOut} disabled={props.zoom <= 0.05}>
          <ZoomOut />
        </button>
        <button className="tb-btn tb-btn--small" title="Reset zoom (100%)" onClick={props.onZoomReset}>
          {Math.round(props.zoom * 100)}%
        </button>
        <button className="tb-btn" title="Zoom in" onClick={props.onZoomIn} disabled={props.zoom >= 4}>
          <ZoomIn />
        </button>
      </div>

      <div className="tb-gap" />

      {/* Undo / Redo */}
      <div className="tb-tool-group">
        <button className="tb-btn" title="Undo (Ctrl+Z)" onClick={props.onUndo} disabled={!props.canUndo}>
          <Undo2 />
        </button>
        <button className="tb-btn" title="Redo (Ctrl+Y)" onClick={props.onRedo} disabled={!props.canRedo}>
          <Redo2 />
        </button>
      </div>

      <div className="tb-gap" />

      <button className="tb-btn tb-btn--primary" onClick={props.onAddImage} title="Add image from media library">
        <ImageIcon />
      </button>

      <div className="tb-gap" />

      <div className={`tb-status tb-status--${status}`}>
        <span className="tb-status-dot" />
        {props.isDirty ? STATUS_LABEL[status] : status === "saved" ? "All changes saved" : "No changes"}
      </div>

      <div className="tb-gap" />

      <button className="tb-btn tb-btn--ghost" onClick={props.onSave} title="Save now (Ctrl+S)">
        <SaveIcon /> Save
      </button>
      <button className="tb-btn tb-btn--primary" onClick={props.onPublish} disabled={!props.canPublish} title="Publish template">
        Publish
      </button>
    </header>
  );
}
