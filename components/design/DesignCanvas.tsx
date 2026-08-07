"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Text as KonvaText, Image as KonvaImage, Ellipse, Line, Group } from "react-konva";
import type { AnyLayer, TemplateDesign } from "@/lib/design/types";
import type { DesignOptions } from "@/lib/design/types";

export interface PreviewHandle {
  toDataURL: (scale?: number) => string | undefined;
}

const DEFAULT_SVG_FILL = "#CB3438";

export function useImageSrc(src: string | null | undefined) {
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  useEffect(() => {
    let stopped = false;
    if (!src) {
      // Resetting state when the source becomes empty — external-state sync.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImg(null);
      return;
    }
    const el = new window.Image();
    el.crossOrigin = "anonymous";
    el.onload = () => !stopped && setImg(el);
    el.onerror = () => !stopped && setImg(null);
    el.src = src;
    return () => {
      stopped = true;
    };
  }, [src]);
  return img;
}

function ImageFill({ src, width, height, cornerRadius, mode }: { src: string | null; width: number; height: number; cornerRadius: number; mode?: string }) {
  const img = useImageSrc(src);
  let rx = 0;
  let ry = 0;
  let rw = width;
  let rh = height;
  if (img && img.naturalWidth > 0) {
    const box = width / Math.max(1, height);
    const fw = img.naturalWidth / img.naturalHeight;
    if (mode === "contain") {
      if (fw > box) {
        rw = height * fw;
        rx = (width - rw) / 2;
      } else {
        rh = width / fw;
        ry = (height - rh) / 2;
      }
    } else {
      if (fw < box) {
        rw = height * fw;
        rx = (width - rw) / 2;
      } else {
        rh = width / fw;
        ry = (height - rh) / 2;
      }
    }
  }
  if (!img) {
    return <Rect width={width} height={height} cornerRadius={cornerRadius} fill="rgba(148,163,184,0.14)" stroke="#94A3B8" strokeWidth={1} strokeDasharray={[5, 4]} />;
  }
  return <KonvaImage image={img} x={rx} y={ry} width={rw} height={rh} cornerRadius={cornerRadius} />;
}

function RenderLayer({ layer, options }: { layer: AnyLayer; options: DesignOptions }) {
  const common = {
    x: layer.x,
    y: layer.y,
    rotation: layer.rotation,
    opacity: layer.opacity,
    visible: layer.visible,
    listening: false,
  };

  if (layer.type === "text") {
    const value = (layer.rules?.role === "editable_text" ? (options.text[layer.id] ?? layer.text) : layer.text) ?? "";
    return (
      <KonvaText
        {...common}
        id={layer.id}
        width={layer.width}
        height={layer.height}
        text={value || (layer.rules?.role === "editable_text" ? layer.rules.placeholder || "" : layer.text)}
        fontFamily={layer.fontFamily}
        fontSize={layer.fontSize}
        fontStyle={`${layer.fontWeight === 700 || layer.fontWeight === "bold" ? "bold " : ""}${layer.fontStyle}`}
        fill={layer.fill}
        align={layer.textAlign}
        decoration={layer.textDecoration === "none" ? undefined : layer.textDecoration}
        letterSpacing={layer.letterSpacing}
        lineHeight={layer.lineHeight}
      />
    );
  }

  if (layer.type === "image") {
    const imgOpt = options.images[layer.id];
    const src = imgOpt?.url || layer.src || null;
    return (
      <Group {...common} clipX={layer.x} clipY={layer.y} clipWidth={layer.width} clipHeight={layer.height}>
        <ImageFill
          src={src}
          width={layer.width}
          height={layer.height}
          cornerRadius={layer.cornerRadius}
          mode={layer.rules?.cropMode}
        />
      </Group>
    );
  }

  if (layer.type === "background") {
    if (layer.kind === "image" && layer.src) {
      return <ImageFill src={layer.src} width={layer.width} height={layer.height} cornerRadius={0} mode="cover" />;
    }
    return <Rect {...common} id={layer.id} width={layer.width} height={layer.height} fill={layer.fill} />;
  }

  if (layer.type === "shape") {
    if (layer.kind === "ellipse") {
      return <Ellipse {...common} id={layer.id} radiusX={layer.width / 2} radiusY={layer.height / 2} fill={layer.fill} stroke={layer.strokeWidth ? layer.stroke : undefined} strokeWidth={layer.strokeWidth} />;
    }
    if (layer.kind === "triangle") {
      const pts = [layer.width / 2, 0, layer.width, layer.height, 0, layer.height];
      return <Line {...common} id={layer.id} points={pts} closed fill={layer.fill} />;
    }
    return <Rect {...common} id={layer.id} width={layer.width} height={layer.height} cornerRadius={layer.cornerRadius} fill={layer.fill} />;
  }

  if (layer.type === "svg") {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${layer.fill === "transparent" ? "none" : layer.fill}" stroke="${layer.stroke || DEFAULT_SVG_FILL}" stroke-width="${layer.strokeWidth || 1.5}" stroke-linecap="round" stroke-linejoin="round"><path d="${layer.paths}" /></svg>`;
    return <ImageFill src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} width={layer.width} height={layer.height} cornerRadius={0} mode="cover" />;
  }

  return null;
}

interface DesignCanvasProps {
  design: TemplateDesign;
  options?: DesignOptions;
  className?: string;
}

export const DesignCanvas = forwardRef<PreviewHandle, DesignCanvasProps>(function DesignCanvas(
  { design, options = { text: {}, images: {} } },
  ref,
) {
  const stageRef = useRef<Konva.Stage>(null);

  useImperativeHandle(ref, () => ({
    toDataURL: (scale = 0.5) => {
      const stage = stageRef.current;
      if (!stage) return "";
      return stage.toDataURL({ pixelRatio: scale, mimeType: "image/png", quality: 0.92 });
    },
  }));

  const sorted = useMemo(() => [...design.layers].sort((a, b) => a.zIndex - b.zIndex), [design.layers]);

  return (
    <div style={{ aspectRatio: `${design.width} / ${design.height}` }} className="flex items-center justify-center overflow-hidden rounded-xl border border-border bg-white">
      <Stage ref={stageRef} width={design.width} height={design.height} listening={false}>
        <Layer listening={false}>
          <Rect x={0} y={0} width={design.width} height={design.height} fill={design.canvasColor} />
          {sorted.map((layer) => (
            <RenderLayer key={layer.id} layer={layer as AnyLayer} options={options} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
});