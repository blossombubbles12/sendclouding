"use client";

import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Ellipse, Group, Image as KonvaImage, Line, Rect, Text } from "react-konva";
import type { AnyLayer, BackgroundLayer, ImageLayer, ShapeLayer, SvgLayer, TextLayer } from "../lib/types";

const DEFAULT_SVG_FILL = "#CB3438";

function useImage(src: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) {
      // Resetting state when the source becomes empty — external-state sync.
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

type TransformHandler = (attrs: Partial<AnyLayer>) => void;
type DragMoveHandler = (e: Konva.KonvaEventObject<DragEvent>) => void;

// ── Text ────────────────────────────────────────────────────────────────
function TextNode({
  layer,
  onSelect,
  onTransform,
  onDragMove,
  onBeginEditing,
}: {
  layer: TextLayer;
  onSelect: () => void;
  onTransform?: TransformHandler;
  onDragMove?: DragMoveHandler;
  onBeginEditing?: () => void;
}) {
  const textRef = useRef<Konva.Text>(null);

  const handleTransformEnd = () => {
    if (!onTransform || !textRef.current) return;
    const node = textRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    // Resizing a text box should visually grow/shrink the text itself, not
    // just its bounding box — otherwise dragging a corner handle looks like
    // it "does nothing" to the letters. Scale font size by the average of
    // both axes so diagonal drags feel natural, and corner drags on a
    // single-axis-locked handle still nudge the size.
    const scale = (scaleX + scaleY) / 2;
    const nextFontSize = Math.max(6, Math.round((layer.fontSize || 16) * scale));
    onTransform({
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      width: Math.max(1, Math.round(node.width() * scaleX)),
      height: Math.max(1, Math.round(node.height() * scaleY)),
      fontSize: nextFontSize,
      rotation: Math.round(node.rotation()),
    });
  };

  return (
    <Text
      id={layer.id}
      ref={textRef}
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      rotation={layer.rotation}
      opacity={layer.opacity}
      visible={layer.visible}
      draggable={!layer.locked}
      text={layer.text}
      fontFamily={layer.fontFamily}
      fontSize={layer.fontSize}
      fontStyle={`${layer.fontWeight === "bold" || layer.fontWeight === 700 ? "bold " : ""}${layer.fontStyle}`}
      fill={layer.fill}
      align={layer.textAlign}
      decoration={layer.textDecoration === "none" ? undefined : layer.textDecoration}
      letterSpacing={layer.letterSpacing}
      lineHeight={layer.lineHeight}
      onMouseDown={onSelect}
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={(e) => {
        e.cancelBubble = true;
        onBeginEditing?.();
      }}
      onDblTap={(e) => {
        e.cancelBubble = true;
        onBeginEditing?.();
      }}
      onDragMove={(e) => onDragMove?.(e)}
      onDragEnd={(e) =>
        onTransform?.({
          x: Math.round(e.target.x()),
          y: Math.round(e.target.y()),
        })
      }
      onTransformEnd={handleTransformEnd}
    />
  );
}

// ── Image ───────────────────────────────────────────────────────────────
function ImageNode({
  layer,
  onSelect,
  onTransform,
  onDragMove,
}: {
  layer: ImageLayer;
  onSelect: () => void;
  onTransform?: TransformHandler;
  onDragMove?: DragMoveHandler;
}) {
  const img = useImage(layer.src || null);
  const nodeRef = useRef<Konva.Group>(null);

  const boxRatio = layer.width / Math.max(1, layer.height);
  let imgX = 0;
  let imgY = 0;
  let imgW = layer.width;
  let imgH = layer.height;

  if (img && img.naturalWidth > 0) {
    const fw = img.naturalWidth / img.naturalHeight;
    if (layer.rules?.cropMode === "contain") {
      if (fw > boxRatio) {
        imgW = layer.height * fw;
        imgX = (layer.width - imgW) / 2;
      } else {
        imgH = layer.width / fw;
        imgY = (layer.height - imgH) / 2;
      }
    } else {
      // cover / stretch / crop → cover default
      if (fw < boxRatio) {
        imgW = layer.height * fw;
        imgX = (layer.width - imgW) / 2;
      } else {
        imgH = layer.width / fw;
        imgY = (layer.height - imgH) / 2;
      }
    }
  }

  const handleTransformEnd = () => {
    if (!onTransform || !nodeRef.current) return;
    const node = nodeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    onTransform({
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      width: Math.max(1, Math.round(node.width() * scaleX)),
      height: Math.max(1, Math.round(node.height() * scaleY)),
      rotation: Math.round(node.rotation()),
    });
  };

  return (
    <Group
      id={layer.id}
      ref={nodeRef}
      x={layer.x}
      y={layer.y}
      rotation={layer.rotation}
      opacity={layer.opacity}
      visible={layer.visible}
      draggable={!layer.locked}
      onMouseDown={onSelect}
      onClick={onSelect}
      onTap={onSelect}
      onDragMove={(e) => onDragMove?.(e)}
      onDragEnd={(e) => onTransform?.({ x: Math.round(e.target.x()), y: Math.round(e.target.y()) })}
      onTransformEnd={handleTransformEnd}
    >
      {img ? (
        <KonvaImage image={img} x={imgX} y={imgY} width={imgW} height={imgH} cornerRadius={layer.cornerRadius} />
      ) : (
        <Rect
          width={layer.width}
          height={layer.height}
          cornerRadius={layer.cornerRadius}
          fill="rgba(148,163,184,0.12)"
          stroke="#64748B"
          strokeWidth={1}
          strokeDasharray={[5, 4]}
        />
      )}
    </Group>
  );
}

// ── Shape ───────────────────────────────────────────────────────────────
function ShapeNode({
  layer,
  onSelect,
  onTransform,
  onDragMove,
}: {
  layer: ShapeLayer;
  onSelect: () => void;
  onTransform?: TransformHandler;
  onDragMove?: DragMoveHandler;
}) {
  const nodeRef = useRef<Konva.Shape | null>(null);

  const common = {
    id: layer.id,
    x: layer.x,
    y: layer.y,
    rotation: layer.rotation,
    opacity: layer.opacity,
    visible: layer.visible,
    draggable: !layer.locked,
    fill: layer.fill,
    stroke: layer.strokeWidth > 0 ? layer.stroke : undefined,
    strokeWidth: layer.strokeWidth,
    shadowColor: layer.shadowBlur > 0 ? layer.shadowColor : undefined,
    shadowBlur: layer.shadowBlur,
    shadowOffsetX: layer.shadowOffsetX,
    shadowOffsetY: layer.shadowOffsetY,
    shadowOpacity: layer.shadowOpacity,
    onMouseDown: onSelect,
    onClick: onSelect,
    onTap: onSelect,
  };

  const handleTransformEnd = () => {
    if (!onTransform || !nodeRef.current) return;
    const node = nodeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    onTransform({
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      width: Math.max(1, Math.round(node.width() * scaleX)),
      height: Math.max(1, Math.round(node.height() * scaleY)),
      rotation: Math.round(node.rotation()),
    });
  };

  const events = {
    onDragMove: onDragMove,
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => onTransform?.({ x: Math.round(e.target.x()), y: Math.round(e.target.y()) }),
    onTransformEnd: handleTransformEnd,
  };

  if (layer.kind === "ellipse") {
    return <Ellipse ref={nodeRef as React.Ref<Konva.Ellipse>} {...common} {...events} radiusX={layer.width / 2} radiusY={layer.height / 2} />;
  }
  if (layer.kind === "triangle") {
    const pts = [layer.width / 2, 0, layer.width, layer.height, 0, layer.height];
    return <Line ref={nodeRef as React.Ref<Konva.Line>} {...common} {...events} points={pts} closed fill={layer.fill} />;
  }
  return <Rect ref={nodeRef as React.Ref<Konva.Rect>} {...common} {...events} width={layer.width} height={layer.height} cornerRadius={layer.cornerRadius} />;
}

// ── SVG / icon ──────────────────────────────────────────────────────────
function SvgNode({
  layer,
  onSelect,
  onTransform,
  onDragMove,
}: {
  layer: SvgLayer;
  onSelect: () => void;
  onTransform?: TransformHandler;
  onDragMove?: DragMoveHandler;
}) {
  const nodeRef = useRef<Konva.Group>(null);
  const svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${layer.fill === "transparent" ? "none" : layer.fill}" stroke="${layer.stroke || DEFAULT_SVG_FILL}" stroke-width="${layer.strokeWidth || 1.5}" stroke-linecap="round" stroke-linejoin="round"><path d="${layer.paths}" /></svg>`;
  const img = useImage(`data:image/svg+xml;utf8,${encodeURIComponent(svgData)}`);

  const handleTransformEnd = () => {
    if (!onTransform || !nodeRef.current) return;
    const node = nodeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    onTransform({
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      width: Math.max(1, Math.round(node.width() * scaleX)),
      height: Math.max(1, Math.round(node.height() * scaleY)),
      rotation: Math.round(node.rotation()),
    });
  };

  return (
    <Group
      id={layer.id}
      ref={nodeRef}
      x={layer.x}
      y={layer.y}
      rotation={layer.rotation}
      opacity={layer.opacity}
      visible={layer.visible}
      draggable={!layer.locked}
      onMouseDown={onSelect}
      onClick={onSelect}
      onTap={onSelect}
      onDragMove={(e) => onDragMove?.(e)}
      onDragEnd={(e) => onTransform?.({ x: Math.round(e.target.x()), y: Math.round(e.target.y()) })}
      onTransformEnd={handleTransformEnd}
    >
      {img && <KonvaImage image={img} width={layer.width} height={layer.height} />}
      {!img && <Rect width={layer.width} height={layer.height} fill="rgba(148,163,184,0.1)" stroke="#64748B" strokeDasharray={[5, 4]} />}
    </Group>
  );
}

// ── Background ──────────────────────────────────────────────────────────
function BackgroundNode({ layer }: { layer: BackgroundLayer }) {
  const img = useImage(layer.kind === "image" ? layer.src : null);
  return (
    <Group x={0} y={0}>
      {layer.kind === "image" && img ? (
        <KonvaImage image={img} width={layer.width} height={layer.height} />
      ) : (
        <Rect width={layer.width} height={layer.height} fill={layer.fill} />
      )}
    </Group>
  );
}

// ── Dispatcher ──────────────────────────────────────────────────────────
export function KonvaLayer({
  layer,
  selected,
  onSelect,
  onTransform,
  onDragMove,
  onBeginEditingText,
  transformerEnabled,
}: {
  layer: AnyLayer;
  selected: boolean;
  onSelect: (id: string) => void;
  onTransform?: (id: string, attrs: Partial<AnyLayer>) => void;
  onDragMove?: (id: string, e: Konva.KonvaEventObject<DragEvent>) => void;
  onBeginEditingText?: (id: string) => void;
  transformerEnabled: boolean;
}) {
  const select = () => onSelect(layer.id);

  let node: React.ReactNode = null;
  switch (layer.type) {
    case "text":
      node = (
        <TextNode
          layer={layer}
          onSelect={select}
          onTransform={(a) => onTransform?.(layer.id, a)}
          onDragMove={(e) => onDragMove?.(layer.id, e)}
          onBeginEditing={() => onBeginEditingText?.(layer.id)}
        />
      );
      break;
    case "image":
      node = (
        <ImageNode layer={layer} onSelect={select} onTransform={(a) => onTransform?.(layer.id, a)} onDragMove={(e) => onDragMove?.(layer.id, e)} />
      );
      break;
    case "shape":
      node = (
        <ShapeNode layer={layer} onSelect={select} onTransform={(a) => onTransform?.(layer.id, a)} onDragMove={(e) => onDragMove?.(layer.id, e)} />
      );
      break;
    case "svg":
      node = (
        <SvgNode layer={layer} onSelect={select} onTransform={(a) => onTransform?.(layer.id, a)} onDragMove={(e) => onDragMove?.(layer.id, e)} />
      );
      break;
    case "background":
      node = <BackgroundNode layer={layer} />;
      break;
    case "group":
      return null;
  }

  if (selected && layer.type !== "background" && !layer.locked && transformerEnabled) {
    return <>{node}</>;
  }

  return node;
}
