"use client";

import { Stage, Layer, Rect, Group, Image as KonvaImage, Text } from "react-konva";
import { useEffect, useState } from "react";
import type { AnyLayer, MockupDef, TemplateDesign } from "../lib/types";
import { DEFAULT_MOCKUPS } from "../lib/defaults";

export type { MockupKind } from "../lib/types";

function useImage(src: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) {
      // Resetting state when source becomes empty — external-state sync.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImg(null);
      return;
    }
    let cancelled = false;
    const el = new window.Image();
    el.crossOrigin = "anonymous";
    el.onload = () => {
      if (!cancelled) setImg(el);
    };
    el.onerror = () => {
      if (!cancelled) setImg(null);
    };
    el.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);
  return img;
}

function MockupRenderLayer({ layer }: { layer: AnyLayer }) {
  const img = useImage(layer.type === "image" ? layer.src : null);
  const common = {
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
    rotation: layer.rotation,
    opacity: layer.opacity,
    visible: layer.visible,
  };
  switch (layer.type) {
    case "text":
      return (
        <Text
          {...(common as object)}
          text={layer.text}
          fontFamily={layer.fontFamily}
          fontSize={layer.fontSize}
          fontStyle={layer.fontWeight === "bold" ? "bold" : "normal"}
          fill={layer.fill}
        />
      );
    case "shape":
      return <Rect {...(common as object)} fill={layer.fill} cornerRadius={layer.kind === "rect" ? layer.cornerRadius : undefined} />;
    case "image":
      return img ? <KonvaImage {...(common as object)} image={img} /> : <Rect {...(common as object)} fill="rgba(148,163,184,0.2)" />;
    case "svg":
      return <Rect {...(common as object)} fill="rgba(203,52,56,0.55)" />;
    default:
      return null;
  }
}

function MockupArtwork({ design, mockup }: { design: TemplateDesign; mockup: MockupDef }) {
  const { startX, startY, width, height } = mockup.warp;
  const scale = Math.min(width / design.width, height / design.height);
  const offX = startX + (width - design.width * scale) / 2;
  const offY = startY + (height - design.height * scale) / 2;

  const layers = design.layers
    .filter((l) => l.type !== "background")
    .slice()
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <Group x={offX} y={offY} scaleX={scale} scaleY={scale}>
      {layers.map((layer) => (
        <MockupRenderLayer key={layer.id} layer={layer} />
      ))}
    </Group>
  );
}

function MockupScene({ design, mockup, size }: { design: TemplateDesign; mockup: MockupDef; size: number }) {
  const bg = mockup.kind === "tshirt" ? "#f6f6f7" : "#e7ebf0";
  return (
    <Layer>
      <Rect x={0} y={0} width={size} height={size} fill="#EAEEF4" cornerRadius={8} />
      <Group x={6} y={6}>
        <Rect x={0} y={0} width={size - 12} height={size - 12} fill={bg} cornerRadius={10} />
        <Group x={0} y={0}>
          <MockupArtwork design={design} mockup={mockup} />
        </Group>
      </Group>
    </Layer>
  );
}

export function MockupPreview({ design, mockup, width = 220, height = 220 }: { design: TemplateDesign; mockup: MockupDef; width?: number; height?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
      <Stage width={width} height={height}>
        <MockupScene design={design} mockup={mockup} size={Math.min(width, height)} />
      </Stage>
    </div>
  );
}

export function MockupPicker({
  design,
  current,
  onSelect,
}: {
  design: TemplateDesign;
  current: string;
  onSelect: (m: MockupDef) => void;
}) {
  return (
    <div className="tb-mockup-row">
      {DEFAULT_MOCKUPS.map((m) => (
        <button
          key={m.kind}
          className={`tb-mockup-thumb ${current === m.kind ? "tb-mockup-thumb--active" : ""}`}
          title={m.label}
          onClick={() => onSelect(m)}
        >
          <Stage width={44} height={44}>
            <MockupScene design={design} mockup={m} size={44} />
          </Stage>
        </button>
      ))}
    </div>
  );
}