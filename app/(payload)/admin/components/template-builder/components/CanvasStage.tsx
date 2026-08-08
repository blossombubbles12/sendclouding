"use client";

import Konva from "konva";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Group, Layer, Line, Rect, Stage, Transformer } from "react-konva";
import { KonvaLayer } from "./KonvaLayer";
import type { AnyLayer, DraftShape, DrawingTool, PrintGeometry, TemplateDesign } from "../lib/types";

interface CanvasProps {
  design: TemplateDesign;
  print: PrintGeometry;
  selection: string[];
  zoom: number;
  pan: { x: number; y: number };
  showGrid: boolean;
  showPrintOverlays: boolean;
  snapToGuides: boolean;
  tool: "select" | "pan" | "rect" | "ellipse" | "text";
  onSelect: (ids: string[]) => void;
  onZoomChange: (zoom: number) => void;
  onPanChange: (pan: { x: number; y: number }) => void;
  onUpdateLayer: (id: string, patch: Partial<AnyLayer>) => void;
  onAddLayer: (layer: AnyLayer) => void;
  onBeginEditingText: (id: string) => void;
}

const SNAP_THRESHOLD = 6;

export function CanvasStage(props: CanvasProps) {
  const { design, print, selection, zoom, pan, showGrid, showPrintOverlays, snapToGuides, tool } = props;
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [draft, setDraft] = useState<DraftShape | null>(null);
  const [guides, setGuides] = useState<{ orientation: "v" | "h"; pos: number; x?: number; y?: number }[]>([]);

  const drawing = useRef<{ tool: DrawingTool; startX: number; startY: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const isPanning = useRef(false);

  // ── measure container ──────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ width: el.clientWidth, height: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── initial fit ────────────────────────────────────────────────────────
  const fitToScreen = useCallback(() => {
    const w = design.width;
    const h = design.height;
    const scale = Math.max(0.05, Math.min(size.width / (w + 120), size.height / (h + 120), 2));
    const cx = (size.width - w * scale) / 2;
    const cy = (size.height - h * scale) / 2;
    props.onZoomChange(scale);
    props.onPanChange({ x: cx, y: cy });
  }, [design, size, props]);

  useEffect(() => {
    if (size.width > 0 && size.height > 0) {
      fitToScreen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height]);

  // ── attach transformer to selection ────────────────────────────────────
  // Only re-run when the selected ids or their locked state actually change —
  // NOT on every `design.layers` update. That array gets a new reference on
  // every drag/transform tick, and re-calling `tr.nodes(...)` mid-gesture
  // interrupts Konva's active transform, which can make it fire a
  // `transformend` event with an undefined target (see onTransformEnd below).
  const selectionLockKey = selection
    .map((id) => `${id}:${design.layers.find((l) => l.id === id)?.locked ? 1 : 0}`)
    .join(",");
  useEffect(() => {
    const tr = transformerRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;
    if (selection.length === 0 || selection.some((id) => design.layers.find((l) => l.id === id)?.locked)) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }
    const nodes = selection
      .map((id) => stage.findOne(`#${id}`))
      .filter((n): n is Konva.Node => Boolean(n));
    tr.nodes(nodes);
    tr.getLayer()?.batchDraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, selectionLockKey]);

  // ── zoom on wheel ──────────────────────────────────────────────────────
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;
      const oldScale = zoom;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const mousePointTo = { x: (pointer.x - pan.x) / oldScale, y: (pointer.y - pan.y) / oldScale };
      const factor = e.evt.deltaY > 0 ? 0.92 : 1.08;
      const newScale = Math.max(0.05, Math.min(4, oldScale * factor));
      props.onZoomChange(newScale);
      props.onPanChange({ x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale });
    },
    [zoom, pan, props],
  );

  // ── snapping logic (canvas edges + centers + other layers) ─────────────
  const computeSnap = useCallback(
    (moving: { x: number; y: number; w: number; h: number }) => {
      if (!snapToGuides) return { x: moving.x, y: moving.y, guides: [] as { orientation: "v" | "h"; pos: number }[] };
      const lines: { orientation: "v" | "h"; pos: number }[] = [];
      let dx = 0;
      let dy = 0;

      const edgesX = [0, design.width / 2, design.width];
      const edgesY = [0, design.height / 2, design.height];
      const myEdgesX = [moving.x, moving.x + moving.w / 2, moving.x + moving.w];
      const myEdgesY = [moving.y, moving.y + moving.h / 2, moving.y + moving.h];

      // Snap to canvas edges / centers
      for (const t of edgesX) {
        for (const m of myEdgesX) {
          const d = t - m;
          if (Math.abs(d) < SNAP_THRESHOLD / zoom) {
            dx = d;
            lines.push({ orientation: "v", pos: t });
          }
        }
      }
      for (const t of edgesY) {
        for (const m of myEdgesY) {
          const d = t - m;
          if (Math.abs(d) < SNAP_THRESHOLD / zoom) {
            dy = d;
            lines.push({ orientation: "h", pos: t });
          }
        }
      }

      // Snap to other layer edges / centers (top-most non-selected layers)
      const others = design.layers.filter((l) => l.type !== "background" && !selection.includes(l.id));
      for (const other of others) {
        const otherEdgesX = [other.x, other.x + other.width / 2, other.x + other.width];
        const otherEdgesY = [other.y, other.y + other.height / 2, other.y + other.height];
        for (const t of otherEdgesX) {
          for (const m of myEdgesX) {
            const d = t - m;
            if (Math.abs(d) < SNAP_THRESHOLD / zoom) {
              dx = d;
              lines.push({ orientation: "v", pos: t });
            }
          }
        }
        for (const t of otherEdgesY) {
          for (const m of myEdgesY) {
            const d = t - m;
            if (Math.abs(d) < SNAP_THRESHOLD / zoom) {
              dy = d;
              lines.push({ orientation: "h", pos: t });
            }
          }
        }
      }

      return { x: moving.x + dx, y: moving.y + dy, guides: lines };
    },
    [design, selection, snapToGuides, zoom],
  );

  // ── stage-level mouse events ───────────────────────────────────────────
  const getStagePos = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const p = stage.getPointerPosition();
    if (!p) return { x: 0, y: 0 };
    return { x: (p.x - pan.x) / zoom, y: (p.y - pan.y) / zoom };
  }, [pan.x, pan.y, zoom]);

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;

      const isShape = e.target instanceof Konva.Shape && e.target.id() !== "" && e.target.id() !== "canvas-bg";

      // Begin drawing
      if ((tool === "rect" || tool === "ellipse") && !isShape) {
        const pos = getStagePos();
        drawing.current = { tool, startX: pos.x, startY: pos.y };
        setDraft({ tool, x: pos.x, y: pos.y, width: 0, height: 0 });
        return;
      }

      // Pan mode
      if (tool === "pan" || e.evt.button === 1) {
        isPanning.current = true;
        dragStart.current = { x: e.evt.clientX, y: e.evt.clientY };
        e.evt.preventDefault();
        return;
      }

      // Deselect when clicking empty canvas
      if (!isShape) {
        props.onSelect([]);
      }
    },
    [tool, props, getStagePos],
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (isPanning.current && dragStart.current) {
        const dx = e.evt.clientX - dragStart.current.x;
        const dy = e.evt.clientY - dragStart.current.y;
        props.onPanChange({ x: pan.x + dx, y: pan.y + dy });
        dragStart.current = { x: e.evt.clientX, y: e.evt.clientY };
        return;
      }

      if (drawing.current) {
        const pos = getStagePos();
        const start = drawing.current;
        const w = pos.x - start.startX;
        const h = pos.y - start.startY;
        setDraft({ tool: start.tool, x: Math.min(start.startX, pos.x), y: Math.min(start.startY, pos.y), width: Math.abs(w), height: Math.abs(h) });
      }
    },
    [pan, props, getStagePos],
  );

  const handleMouseUp = useCallback(() => {
    if (isPanning.current) {
      isPanning.current = false;
      dragStart.current = null;
      return;
    }
    if (drawing.current && draft && draft.width > 3 && draft.height > 3) {
      const base = {
        x: Math.round(draft.x),
        y: Math.round(draft.y),
        width: Math.round(draft.width),
        height: Math.round(draft.height),
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        freelyMovable: true,
        groupId: "",
        zIndex: design.layers.length + 1,
      };
      if (draft.tool === "rect" || draft.tool === "ellipse") {
        const layer: AnyLayer = {
          ...base,
          type: "shape",
          kind: draft.tool,
          name: draft.tool === "rect" ? "Rectangle" : "Ellipse",
          fill: "#CB3438",
          stroke: "rgba(0,0,0,0)",
          strokeWidth: 0,
          cornerRadius: 0,
          shadowColor: "rgba(0,0,0,0)",
          shadowBlur: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowOpacity: 0,
          rules: {
            editable: true,
            role: "design",
            required: false,
            placeholder: "",
            maxLength: 0,
            minLength: 0,
            allowedFormats: [],
            maxFileSizeMB: 0,
            minResolution: { width: 0, height: 0 },
            cropMode: "cover",
            aspectRatioLocked: false,
          },
        } as never;
        props.onAddLayer(layer);
      } else if (draft.tool === "text") {
        const layer: AnyLayer = {
          ...base,
          type: "text",
          name: "Text",
          text: "Your text",
          fontFamily: "Inter",
          fontSize: Math.max(12, draft.height / 2),
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
        } as never;
        props.onAddLayer(layer);
      }
    }
    drawing.current = null;
    setDraft(null);
  }, [draft, design.layers.length, props]);

  // ── drag (move) with snapping ─────────────────────────────────────────
  const handleDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, id: string) => {
      const layer = design.layers.find((l) => l.id === id);
      if (!layer || !snapToGuides) return;
      const node = e.target;
      const snapped = computeSnap({ x: node.x(), y: node.y(), w: layer.width, h: layer.height });
      node.x(snapped.x);
      node.y(snapped.y);
      props.onUpdateLayer(id, { x: Math.round(snapped.x), y: Math.round(snapped.y) });
      setGuides(
        snapped.guides.map((g) =>
          g.orientation === "v" ? { orientation: "v", pos: g.pos, x: g.pos, y: node.y() - 9999 } : { orientation: "h", pos: g.pos, x: node.x() - 9999, y: g.pos },
        ),
      );
    },
    [design.layers, snapToGuides, computeSnap, props],
  );

  const handleTransformEnd = useCallback(
    (id: string, attrs: Partial<AnyLayer>) => {
      props.onUpdateLayer(id, attrs);
    },
    [props],
  );

  // ── composite layers: groups resolved into their members ──────────────
  const renderLayers = useMemo(() => {
    return design.layers
      .filter((l) => l.type !== "group")
      .sort((a, b) => a.zIndex - b.zIndex);
  }, [design.layers]);

  // printable area geometry (screen space)
  const printScreen = {
    x: print.printable.x * zoom + pan.x,
    y: print.printable.y * zoom + pan.y,
    width: print.printable.width * zoom,
    height: print.printable.height * zoom,
  };
  const bleedScreen = {
    x: (print.printable.x - print.bleed) * zoom + pan.x,
    y: (print.printable.y - print.bleed) * zoom + pan.y,
    width: (print.printable.width + print.bleed * 2) * zoom,
    height: (print.printable.height + print.bleed * 2) * zoom,
  };
  const safeScreen = {
    x: (print.printable.x + print.safe) * zoom + pan.x,
    y: (print.printable.y + print.safe) * zoom + pan.y,
    width: (print.printable.width - print.safe * 2) * zoom,
    height: (print.printable.height - print.safe * 2) * zoom,
  };

  const gridLines = useMemo(() => {
    if (!showGrid) return [];
    const lines: { x: number; y: number; horizontal: boolean }[] = [];
    const step = 16 * zoom;
    if (step < 6) return [];
    for (let x = step; x < size.width; x += step) {
      lines.push({ x, y: 0, horizontal: false });
    }
    for (let y = step; y < size.height; y += step) {
      lines.push({ x: 0, y, horizontal: true });
    }
    return lines;
  }, [showGrid, zoom, size]);

  const handleSelect = useCallback((id: string) => {
    props.onSelect([id]);
  }, [props]);

  return (
    <div ref={containerRef} className="tb-canvas-viewport" style={{ width: "100%", height: "100%" }}>
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onMouseLeave={() => setGuides([])}
      >
        {/* Grid + background of viewport */}
        <Layer listening={false}>
          {gridLines.map((l, i) =>
            l.horizontal ? (
              <Line key={`h${i}`} points={[0, l.y, size.width, l.y]} stroke="rgba(128,128,128,0.12)" strokeWidth={1} />
            ) : (
              <Line key={`v${i}`} points={[l.x, 0, l.x, size.height]} stroke="rgba(128,128,128,0.12)" strokeWidth={1} />
            ),
          )}
        </Layer>

        {/* Design canvas */}
        <Layer>
          <Group x={pan.x} y={pan.y} scaleX={zoom} scaleY={zoom}>
            {/* Canvas background */}
            <Rect
              id="canvas-bg"
              x={0}
              y={0}
              width={design.width}
              height={design.height}
              fill={design.canvasColor}
              shadowColor="rgba(0,0,0,0.4)"
              shadowBlur={20}
              shadowOffsetY={4}
              onClick={() => props.onSelect([])}
              onMouseDown={(e) => {
                if (e.target.id() === "canvas-bg") {
                  // let stage handle deselect
                }
              }}
            />

            {/* Background layer (behind all) */}
            {design.layers
              .filter((l) => l.type === "background")
              .map((l) => (
                <KonvaLayer
                  key={l.id}
                  layer={l}
                  selected={false}
                  onSelect={() => {}}
                  onTransform={undefined}
transformerEnabled={false}
                />
              ))}

            {/* Regular layers */}
            {renderLayers.map((layer) => (
              <KonvaLayer
                key={layer.id}
                layer={layer}
                selected={selection.includes(layer.id)}
                onSelect={handleSelect}
                onTransform={handleTransformEnd}
                onDragMove={(_id, e) => handleDragMove(e, layer.id)}
                transformerEnabled={selection.includes(layer.id)}
                onBeginEditingText={props.onBeginEditingText}
              />
            ))}
          </Group>
        </Layer>

        {/* Overlays: printable / safe / bleed / guides / draft */}
        <Layer listening={false}>
          {showPrintOverlays && (
            <>
              {/* bleed */}
              <Rect x={bleedScreen.x} y={bleedScreen.y} width={bleedScreen.width} height={bleedScreen.height} stroke="rgba(203,52,56,0.55)" strokeWidth={1.5} dash={[6, 4]} />
              {/* printable */}
              <Rect x={printScreen.x} y={printScreen.y} width={printScreen.width} height={printScreen.height} stroke="rgba(76,175,80,0.7)" strokeWidth={1.5} />
              {/* safe */}
              <Rect x={safeScreen.x} y={safeScreen.y} width={safeScreen.width} height={safeScreen.height} stroke="rgba(245,158,11,0.6)" strokeWidth={1} dash={[4, 4]} />
            </>
          )}

          {/* snap guides */}
          {guides.map((g, i) =>
            g.orientation === "v" ? (
              <Line key={`gv${i}`} points={[g.pos, 0, g.pos, size.height]} stroke="rgba(99,102,241,0.9)" strokeWidth={1} />
            ) : (
              <Line key={`gh${i}`} points={[0, g.pos, size.width, g.pos]} stroke="rgba(99,102,241,0.9)" strokeWidth={1} />
            ),
          )}

          {/* draft shape */}
          {draft && draft.width > 0 && draft.height > 0 && (
            <Rect
              x={draft.x * zoom + pan.x}
              y={draft.y * zoom + pan.y}
              width={draft.width * zoom}
              height={draft.height * zoom}
              stroke="#6366F1"
              strokeWidth={1.5}
              dash={[5, 4]}
              fill="rgba(99,102,241,0.08)"
            />
          )}
        </Layer>

        {/* Transformer */}
        <Layer>
          <Transformer
            ref={transformerRef}
            rotateEnabled
            keepRatio={false}
            enabledAnchors={["top-left", "top-center", "top-right", "middle-right", "bottom-right", "bottom-center", "bottom-left", "middle-left"]}
            boundBoxFunc={(oldBox, newBox) => (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5 ? oldBox : newBox)}
            onTransformEnd={(e) => {
              // Konva's Transformer can fire `transformend` with an undefined
              // target if its attached nodes were cleared mid-gesture (e.g.
              // the selection-sync effect below ran while the user was still
              // dragging a resize handle). Guard against that instead of
              // crashing the canvas.
              const node = e.target;
              if (!node) return;
              const id = node.id();
              const layer = design.layers.find((l) => l.id === id);
              if (!layer) return;
              const scaleX = node.scaleX();
              const scaleY = node.scaleY();
              node.scaleX(1);
              node.scaleY(1);
              props.onUpdateLayer(id, {
                x: Math.round(node.x()),
                y: Math.round(node.y()),
                width: Math.max(1, Math.round(node.width() * scaleX)),
                height: Math.max(1, Math.round(node.height() * scaleY)),
                rotation: Math.round(node.rotation()),
              });
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
}
