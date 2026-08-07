"use client";

import { useEffect } from "react";

export default function PayloadError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: "560px", width: "100%" }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ color: "#374151", marginTop: "0.5rem" }}>
          An error occurred while rendering this page. Check the server logs for details.
        </p>
        <pre
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#0b1220",
            color: "#e2e8f0",
            borderRadius: "0.5rem",
            fontSize: "0.85rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {error.message}
          {error.digest ? `\n\nDigest: ${error.digest}` : ""}
        </pre>
        <button
          onClick={reset}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1.25rem",
            border: "none",
            borderRadius: "0.5rem",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}