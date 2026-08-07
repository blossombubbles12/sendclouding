"use client";

import {
  Copy,
  Eye,
  EyeOff,
  ImageIcon,
  Lock,
  LockOpen,
  Plus,
  Shapes,
  Trash2,
  Type,
} from "./icons";
import type { AnyLayer } from "../lib/types";

export interface LayerPanelProps {
  layers: AnyLayer[];
  selection: string[];
  onSelect: (id: string, additive?: boolean) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleLock: (id: string) => void;
  onToggleVisible: (id: string) => void;
  onAddText: () => void;
  onAddShape: () => void;
  onAddImage: () => void;
  onReorder: (id: string, dir: "up" | "down") => void;
  onRename: (id: string, name: string) => void;
}

function typeIcon(layer: AnyLayer) {
  switch (layer.type) {
    case "text":
      return <Type />;
    case "image":
      return <ImageIcon />;
    case "shape":
      return <Shapes />;
    case "svg":
      return <Shapes />;
    case "background":
      return <Lock />;
    default:
      return <Shapes />;
  }
}

function typeLabel(layer: AnyLayer) {
  if (layer.type === "background") return "Background";
  if (layer.type === "text" && (layer as { rules?: { role?: string } }).rules?.role === "editable_text") return "Text placeholder";
  if (layer.type === "image" && (layer as { rules?: { role?: string } }).rules?.role === "image_placeholder") return "Image placeholder";
  return layer.type.charAt(0).toUpperCase() + layer.type.slice(1);
}

export function LayerPanel(props: LayerPanelProps) {
  // display in reverse z-order (top-most first)
  const ordered = [...props.layers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <aside className="tb-sidebar">
      <div className="tb-panel-head">
        <span>Layers</span>
        <div className="tb-row" style={{ gap: 2 }}>
          <button className="tb-btn tb-btn--small" title="Add text" onClick={props.onAddText}>
            <Type />
          </button>
          <button className="tb-btn tb-btn--small" title="Add shape" onClick={props.onAddShape}>
            <Shapes />
          </button>
          <button className="tb-btn tb-btn--small" title="Add image" onClick={props.onAddImage}>
            <ImageIcon />
          </button>
        </div>
      </div>

      <div className="tb-panel-scroll">
        <div className="tb-layer-list">
          {ordered.length === 0 && (
            <div className="tb-empty-inspector">
              <Plus />
              <p>Add text, shapes, images, or placeholders to begin.</p>
            </div>
          )}

          {ordered.map((layer, idx) => {
            const isSelected = props.selection.includes(layer.id);
            return (
              <div key={layer.id} className={`tb-layer-row ${isSelected ? "tb-layer-row--selected" : ""} ${!layer.visible ? "tb-layer-row--hidden" : ""}`}>
                <div className="tb-layer-icon">{typeIcon(layer)}</div>
                <div className="tb-layer-meta">
                  <input
                    className="tb-layer-name-input"
                    style={{ border: "none", background: "transparent", width: "100%", fontSize: 12.5, fontWeight: 600 }}
                    defaultValue={layer.name}
                    onBlur={(e) => props.onRename(layer.id, e.target.value || layer.name)}
                  />
                  <span className="tb-layer-type">{typeLabel(layer)} · #{idx + 1}</span>
                </div>

                <div className="tb-layer-tools">
                  <button title={layer.visible ? "Hide" : "Show"} onClick={() => props.onToggleVisible(layer.id)}>
                    {layer.visible ? <Eye /> : <EyeOff />}
                  </button>
                  {layer.type !== "background" && (
                    <button title={layer.locked ? "Unlock" : "Lock"} onClick={() => props.onToggleLock(layer.id)}>
                      {layer.locked ? <Lock /> : <LockOpen />}
                    </button>
                  )}
                  {layer.type !== "background" && (
                    <button title="Duplicate" onClick={() => props.onDuplicate(layer.id)}>
                      <Copy />
                    </button>
                  )}
                  {layer.type !== "background" && (
                    <button title="Delete" onClick={() => props.onDelete(layer.id)}>
                      <Trash2 />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="tb-panel-head">
        <span>Stacking</span>
      </div>
      <div className="tb-panel-scroll" style={{ paddingTop: 0 }}>
        <div className="tb-row">
          <button className="tb-btn" onClick={() => props.selection[0] && props.onReorder(props.selection[0], "up")} disabled={!props.selection[0]} title="Bring forward">
            Raise
          </button>
          <button className="tb-btn" onClick={() => props.selection[0] && props.onReorder(props.selection[0], "down")} disabled={!props.selection[0]} title="Send backward">
            Lower
          </button>
        </div>
      </div>
    </aside>
  );
}