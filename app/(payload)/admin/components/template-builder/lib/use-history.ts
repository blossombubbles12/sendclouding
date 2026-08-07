import { useCallback, useRef, useState } from "react";
import type { TemplateDesign } from "../lib/types";

const MAX_HISTORY = 50;

/**
 * Stack-based undo/redo for design snapshots. `push` is called whenever a
 * user-facing action completes; transient drag/resize updates are coalesced by
 * only committing on pointer-up.
 */
export function useHistory() {
  const undoStack = useRef<TemplateDesign[]>([]);
  const redoStack = useRef<TemplateDesign[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const push = useCallback((design: TemplateDesign) => {
    undoStack.current.push(JSON.parse(JSON.stringify(design)));
    if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
    redoStack.current = [];
    setCanUndo(true);
    setCanRedo(false);
  }, []);

  const undo = useCallback((current: TemplateDesign): TemplateDesign | null => {
    const prev = undoStack.current.pop();
    if (!prev) return null;
    redoStack.current.push(JSON.parse(JSON.stringify(current)));
    setCanRedo(true);
    setCanUndo(undoStack.current.length > 0);
    return prev;
  }, []);

  const redo = useCallback((current: TemplateDesign): TemplateDesign | null => {
    const next = redoStack.current.pop();
    if (!next) return null;
    undoStack.current.push(JSON.parse(JSON.stringify(current)));
    setCanUndo(true);
    setCanRedo(redoStack.current.length > 0);
    return next;
  }, []);

  return { push, undo, redo, canUndo, canRedo };
}
