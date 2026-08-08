"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Search, Upload, X } from "./icons";
import type { MediaItem } from "../lib/use-load-doc";

interface MediaBrowserProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
}

interface UploadDoc {
  id: string;
  url: string;
  alt?: string;
  thumbnailUrl?: string;
  cardUrl?: string;
}

/**
 * Browse the Payload Media collection. Re-uses the same assets admins manage in
 * the CMS so designers can drop brand library images into a template — or
 * upload a new file straight from their computer (button or drag-and-drop),
 * which is applied to the canvas immediately.
 */
export function MediaBrowser({ open, onClose, onSelect }: MediaBrowserProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    if (!open) return;
    // Loading the media library is an external-data fetch; the loading/error
    // state resets here before the network request.
    /* eslint-disable react-hooks/set-state-in-effect */
    setLoading(true);
    setError(null);
    /* eslint-enable react-hooks/set-state-in-effect */
    const qs = new URLSearchParams({ limit: "60", depth: "0" });
    if (query.trim()) qs.set("where[or][0][filename][like]", query.trim());
    fetch(`/api/media?${qs.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => setItems(json.docs ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load media"))
      .finally(() => setLoading(false));
  }, [open, query]);

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) {
      setUploadError("Please choose an image file.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const uploaded: MediaItem[] = [];
      for (const file of list) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("alt", file.name);
        const res = await fetch("/api/design/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || `Failed to upload ${file.name}`);
        }
        const doc = json.doc as UploadDoc;
        uploaded.push({
          id: doc.id,
          filename: file.name,
          url: doc.url,
          mimeType: file.type,
          width: 0,
          height: 0,
          sizes: {
            thumbnail: { url: doc.thumbnailUrl },
            card: { url: doc.cardUrl },
          },
        });
      }
      setItems((prev) => [...uploaded, ...prev]);
      // The whole point of a direct-upload option is to skip the extra
      // "now go find it in the grid and click it" step — apply the newest
      // upload straight away and close the browser.
      const last = uploaded[uploaded.length - 1];
      if (last) {
        onSelect(last);
        onClose();
      }
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="tb-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="tb-modal"
        onDragEnter={(e) => {
          e.preventDefault();
          dragCounter.current += 1;
          setDragActive(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          dragCounter.current = Math.max(0, dragCounter.current - 1);
          if (dragCounter.current === 0) setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          dragCounter.current = 0;
          setDragActive(false);
          if (e.dataTransfer.files?.length) void uploadFiles(e.dataTransfer.files);
        }}
      >
        <div className="tb-modal-head">
          <div className="tb-modal-title">Media Library</div>
          <button className="tb-btn" onClick={onClose} title="Close">
            <X />
          </button>
        </div>

        <div className="tb-modal-body">
          <div className="tb-media-search">
            <div style={{ display: "flex", gap: 8, flex: 1 }}>
              <Search style={{ width: 16, height: 16, alignSelf: "center", opacity: 0.6 }} />
              <input className="tb-input" placeholder="Search by filename…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <button className="tb-btn tb-btn--primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload style={{ width: 14, height: 14 }} />
              {uploading ? "Uploading…" : "Upload from computer"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files?.length) void uploadFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {uploadError && (
            <div className="tb-media-empty-state" style={{ color: "var(--tb-danger, #f87171)", padding: "8px 0" }}>
              {uploadError}
            </div>
          )}

          {loading && <div className="tb-media-empty-state">Loading media…</div>}
          {error && <div className="tb-media-empty-state" style={{ color: "var(--tb-danger, #f87171)" }}>{error}</div>}

          {!loading && !error && items.length === 0 && (
            <div className="tb-media-empty-state">
              <ImageIcon style={{ width: 40, height: 40, opacity: 0.5, marginBottom: 12 }} />
              <p>No media found yet. Drag &amp; drop an image here, or use &ldquo;Upload from computer&rdquo; above.</p>
            </div>
          )}

          <div className="tb-media-grid">
            {items.map((item) => (
              <button
                key={item.id}
                className="tb-media-item"
                onClick={() => onSelect(item)}
                title={`${item.filename} (${item.width}×${item.height})`}
              >
                {item.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.sizes?.thumbnail?.url ?? item.url} alt={item.filename} loading="lazy" />
                ) : (
                  <div className="tb-media-item--empty">
                    <ImageIcon />
                    {item.mimeType}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {dragActive && (
          <div className="tb-media-dropzone-overlay">
            <Upload style={{ width: 40, height: 40 }} />
            <p>Drop image to upload</p>
          </div>
        )}
      </div>
    </div>
  );
}
