"use client";

import { useState } from "react";
import { ChevronDown, Type } from "./icons";
import type { AnyLayer, ImageLayer, ShapeLayer, SvgLayer, TextLayer } from "../lib/types";
import { DEFAULT_FONTS } from "../lib/defaults";

export interface PropertyPanelProps {
  layers: AnyLayer[];
  onUpdate: (id: string, patch: Partial<AnyLayer>) => void;
  onPickImage: (id: string) => void;
  onClearImage: (id: string) => void;
}

export function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="tb-section">
      <button className="tb-section-title" onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        <ChevronDown style={{ width: 14, height: 14, transform: open ? "" : "rotate(-90deg)", transition: "transform 0.15s" }} />
      </button>
      {open && <div className="tb-section-body">{children}</div>}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="tb-field">
      <span className="tb-field-label">{label}</span>
      {children}
    </div>
  );
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="tb-color-input">
        <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"} onChange={(e) => onChange(e.target.value)} />
        <input type="text" className="tb-input" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  );
}

export function NumberField({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min?: number; max?: number; step?: number; onChange: (v: number) => void }) {
  return (
    <Field label={label}>
      <input type="number" className="tb-input" value={value} min={min ?? 0} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))} />
    </Field>
  );
}

export function CommonTransform({ layer, onUpdate }: { layer: AnyLayer; onUpdate: (p: Partial<AnyLayer>) => void }) {
  return (
    <Section title="Position & Size">
      <div className="tb-row">
        <NumberField label="X" value={Math.round(layer.x)} onChange={(v) => onUpdate({ x: v })} />
        <NumberField label="Y" value={Math.round(layer.y)} onChange={(v) => onUpdate({ y: v })} />
      </div>
      <div className="tb-row">
        <NumberField label="W" value={Math.round(layer.width)} min={1} onChange={(v) => onUpdate({ width: v })} />
        <NumberField label="H" value={Math.round(layer.height)} min={1} onChange={(v) => onUpdate({ height: v })} />
      </div>
      <div className="tb-row">
        <NumberField label="Rotation°" value={Math.round(layer.rotation)} onChange={(v) => onUpdate({ rotation: v })} />
        <Field label="Opacity">
          <input type="number" className="tb-input" value={layer.opacity} min={0} max={1} step={0.05} onChange={(e) => onUpdate({ opacity: Number(e.target.value) })} />
        </Field>
      </div>
    </Section>
  );
}

export function TextInspector({ layer, onUpdate }: { layer: TextLayer; onUpdate: (p: Partial<TextLayer>) => void }) {
  return (
    <>
      <Section title="Text Content">
        <Field label="Text">
          <textarea className="tb-textarea" rows={3} value={layer.text} onChange={(e) => onUpdate({ text: e.target.value })} />
        </Field>
        <div className="tb-row">
          <Field label="Font">
            <select className="tb-select" value={layer.fontFamily} onChange={(e) => onUpdate({ fontFamily: e.target.value })}>
              {DEFAULT_FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Size">
            <input type="number" className="tb-input" value={layer.fontSize} min={4} onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })} />
          </Field>
        </div>
        <div className="tb-row">
          <Field label="Weight">
            <select className="tb-select" value={String(layer.fontWeight)} onChange={(e) => onUpdate({ fontWeight: e.target.value === "normal" ? "normal" : "bold" } as Partial<TextLayer>)}>
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </Field>
          <Field label="Style">
            <select className="tb-select" value={layer.fontStyle} onChange={(e) => onUpdate({ fontStyle: e.target.value as "normal" | "italic" })}>
              <option value="normal">Normal</option>
              <option value="italic">Italic</option>
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Formatting">
        <Field label="Align">
          <select className="tb-select" value={layer.textAlign} onChange={(e) => onUpdate({ textAlign: e.target.value as TextLayer["textAlign"] })}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </Field>
        <div className="tb-row">
          <NumberField label="Line height" value={layer.lineHeight} step={0.05} onChange={(v) => onUpdate({ lineHeight: v })} />
          <NumberField label="Letter spacing" value={layer.letterSpacing} onChange={(v) => onUpdate({ letterSpacing: v })} />
        </div>
        <ColorField label="Color" value={layer.fill} onChange={(v) => onUpdate({ fill: v })} />
      </Section>

      <Section title="Placeholder Rules" defaultOpen={false}>
        <Field label="Editable by customer">
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <input type="checkbox" checked={layer.rules?.editable} onChange={(e) => onUpdate({ rules: { ...layer.rules, editable: e.target.checked, role: e.target.checked ? "editable_text" : "design" } })} />
            Allow customers to edit this text
          </label>
        </Field>
        {layer.rules?.editable && (
          <>
            <Field label="Required">
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={layer.rules?.required} onChange={(e) => onUpdate({ rules: { ...layer.rules, required: e.target.checked } })} />
                Customer must fill this field
              </label>
            </Field>
            <div className="tb-row">
              <NumberField label="Min chars" value={layer.rules?.minLength ?? 0} onChange={(v) => onUpdate({ rules: { ...layer.rules, minLength: v } })} />
              <NumberField label="Max chars" value={layer.rules?.maxLength ?? 0} onChange={(v) => onUpdate({ rules: { ...layer.rules, maxLength: v } })} />
            </div>
            <Field label="Placeholder preview text">
              <input className="tb-input" value={layer.rules?.placeholder} onChange={(e) => onUpdate({ rules: { ...layer.rules, placeholder: e.target.value } })} />
            </Field>
          </>
        )}
      </Section>
    </>
  );
}

export function ImageInspector({ layer, onUpdate, onPickImage }: { layer: ImageLayer; onUpdate: (p: Partial<ImageLayer>) => void; onPickImage: () => void }) {
  return (
    <>
      <Section title="Image">
        <button className="tb-btn tb-btn--primary" onClick={onPickImage} style={{ width: "100%", justifyContent: "center" }}>
          {layer.src ? "Replace image" : "Choose image"}
        </button>
        <NumberField label="Corner radius" value={layer.cornerRadius} onChange={(v) => onUpdate({ cornerRadius: v })} />
      </Section>

      <Section title="Crop & Alignment" defaultOpen={false}>
        <Field label="Fit">
          <select className="tb-select" value={layer.rules?.cropMode ?? "cover"} onChange={(e) => onUpdate({ rules: { ...layer.rules, cropMode: e.target.value as ImageLayer["rules"]["cropMode"] } })}>
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="stretch">Stretch</option>
          </select>
        </Field>
        <Field label="Lock aspect ratio">
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <input type="checkbox" checked={layer.rules?.aspectRatioLocked} onChange={(e) => onUpdate({ rules: { ...layer.rules, aspectRatioLocked: e.target.checked } })} />
            Preserve original proportions
          </label>
        </Field>
      </Section>

      <Section title="Placeholder Rules" defaultOpen={false}>
        <Field label="Customer can replace image">
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <input type="checkbox" checked={layer.rules?.editable} onChange={(e) => onUpdate({ rules: { ...layer.rules, editable: e.target.checked, role: e.target.checked ? "image_placeholder" : "design" } })} />
            Allow customers to upload a photo
          </label>
        </Field>
        {layer.rules?.editable && (
          <>
            <Field label="Required">
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={layer.rules?.required} onChange={(e) => onUpdate({ rules: { ...layer.rules, required: e.target.checked } })} />
                Customer must upload an image
              </label>
            </Field>
            <div className="tb-row">
              <NumberField label="Min W px" value={layer.rules?.minResolution?.width ?? 0} onChange={(v) => onUpdate({ rules: { ...layer.rules, minResolution: { ...layer.rules?.minResolution, width: v } } })} />
              <NumberField label="Min H px" value={layer.rules?.minResolution?.height ?? 0} onChange={(v) => onUpdate({ rules: { ...layer.rules, minResolution: { ...layer.rules?.minResolution, height: v } } })} />
            </div>
            <NumberField label="Max file size (MB)" value={layer.rules?.maxFileSizeMB ?? 0} onChange={(v) => onUpdate({ rules: { ...layer.rules, maxFileSizeMB: v } })} />
          </>
        )}
      </Section>
    </>
  );
}

export function ShapeInspector({ layer, onUpdate }: { layer: ShapeLayer; onUpdate: (p: Partial<ShapeLayer>) => void }) {
  return (
    <>
      <Section title="Fill & Border">
        <ColorField label="Fill" value={layer.fill} onChange={(v) => onUpdate({ fill: v })} />
        <ColorField label="Stroke" value={layer.stroke} onChange={(v) => onUpdate({ stroke: v })} />
        <NumberField label="Stroke width" value={layer.strokeWidth} min={0} onChange={(v) => onUpdate({ strokeWidth: v })} />
        {layer.kind === "rect" && <NumberField label="Corner radius" value={layer.cornerRadius} min={0} onChange={(v) => onUpdate({ cornerRadius: v })} />}
      </Section>
      <Section title="Shadow" defaultOpen={false}>
        <ColorField label="Shadow color" value={layer.shadowColor} onChange={(v) => onUpdate({ shadowColor: v })} />
        <div className="tb-row">
          <NumberField label="Blur" value={layer.shadowBlur} min={0} onChange={(v) => onUpdate({ shadowBlur: v })} />
          <NumberField label="Opacity" value={layer.shadowOpacity} min={0} max={1} step={0.05} onChange={(v) => onUpdate({ shadowOpacity: v })} />
        </div>
      </Section>
    </>
  );
}

export function SvgInspector({ layer, onUpdate }: { layer: SvgLayer; onUpdate: (p: Partial<SvgLayer>) => void }) {
  return (
    <Section title="Icon Style">
      <ColorField label="Stroke color" value={layer.stroke} onChange={(v) => onUpdate({ stroke: v })} />
      <ColorField label="Fill" value={layer.fill} onChange={(v) => onUpdate({ fill: v })} />
      <NumberField label="Stroke width" value={layer.strokeWidth} min={0} onChange={(v) => onUpdate({ strokeWidth: v })} />
    </Section>
  );
}

export function PropertyPanel(props: PropertyPanelProps) {
  const { layers, onUpdate, onPickImage, onClearImage } = props;
  const layer = layers[0];

  return (
    <aside className="tb-sidebar tb-sidebar--right">
      <div className="tb-panel-head">
        <span>Inspector</span>
      </div>
      <div className="tb-panel-scroll">
        {!layer ? (
          <div className="tb-empty-inspector">
            <Type />
            <p>Select a layer to edit its properties, fonts, colors, and placeholders.</p>
          </div>
        ) : (
          <>
            <CommonTransform layer={layer} onUpdate={(p) => onUpdate(layer.id, p)} />
            {layer.type === "text" && <TextInspector layer={layer} onUpdate={(p) => onUpdate(layer.id, p)} />}
            {layer.type === "image" && <ImageInspector layer={layer} onUpdate={(p) => onUpdate(layer.id, p)} onPickImage={() => onPickImage(layer.id)} />}
            {layer.type === "shape" && <ShapeInspector layer={layer} onUpdate={(p) => onUpdate(layer.id, p)} />}
            {layer.type === "svg" && <SvgInspector layer={layer} onUpdate={(p) => onUpdate(layer.id, p)} />}
            {layer.type === "background" && <Section title="Background"><ColorField label="Color" value={layer.fill} onChange={(v) => onUpdate(layer.id, { fill: v })} /></Section>}
          </>
        )}
      </div>
      <div className="tb-panel-scroll" style={{ padding: 0, borderTop: "1px solid var(--theme-elevation-100)" }}>
        <button className="tb-btn" onClick={() => onClearImage(layer?.id)} disabled={!layer || layer.type !== "image"} title="Remove image">
          Clear
        </button>
      </div>
    </aside>
  );
}