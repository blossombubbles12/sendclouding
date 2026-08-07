"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Search, X } from "./icons";
import type { MediaItem } from "../lib/use-load-doc";

interface MediaBrowserProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
}

/**
 * Browse the Payload Media collection. Re-uses the same assets admins manage in
 * the CMS so designers can drop brand library images into a template.
 */
export function MediaBrowser({ open, onClose, onSelect }: MediaBrowserProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  if (!open) return null;

  return (
    <div className="tb-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="tb-modal">
        <div className="tb-modal-head">
          <div className="tb-modal-title">Media Library</div>
          <button className="tb-btn" onClick={onClose} title="Close">
            <X />
          </button>
        </div>

        <div className="tb-modal-body">
          <div className="tb-media-search">
            <div style={{ display: "flex", gap: 8 }}>
              <Search style={{ width: 16, height: 16, alignSelf: "center", opacity: 0.6 }} />
              <input className="tb-input" placeholder="Search by filename…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>

          {loading && <div className="tb-media-empty-state">Loading media…</div>}
          {error && <div className="tb-media-empty-state" style={{ color: "var(--tb-danger, #f87171)" }}>{error}</div>}

          {!loading && !error && items.length === 0 && (
            <div className="tb-media-empty-state">
              <ImageIcon style={{ width: 40, height: 40, opacity: 0.5, marginBottom: 12 }} />
              <p>No media found. Upload assets in the Media collection first.</p>
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
      </div>
    </div>
  );
}
