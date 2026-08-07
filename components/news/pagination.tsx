import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  baseParams,
}: {
  page: number;
  totalPages: number;
  baseParams: string;
}) {
  if (totalPages <= 1) return null;

  const pageUrl = (p: number) => {
    const params = new URLSearchParams(baseParams);
    if (p > 1) params.set("page", String(p));
    else params.delete("page");
    const qs = params.toString();
    return `/news${qs ? `?${qs}` : ""}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = new Set<number>([1, totalPages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= totalPages));

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      <Link
        href={pageUrl(page - 1)}
        aria-disabled={page <= 1}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors hover:border-primary/40 hover:text-primary",
          page <= 1 && "pointer-events-none opacity-40"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </Link>

      {pages.map((p) => {
        if (!visible.has(p)) {
          if (p === 2 || p === totalPages - 1) {
            return (
              <span key={`ellipsis-${p}`} className="px-1 text-sm text-muted-foreground">
                …
              </span>
            );
          }
          return null;
        }
        return (
          <Link
            key={p}
            href={pageUrl(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-colors",
              p === page
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-foreground hover:border-primary/40 hover:text-primary"
            )}
          >
            {p}
          </Link>
        );
      })}

      <Link
        href={pageUrl(page + 1)}
        aria-disabled={page >= totalPages}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors hover:border-primary/40 hover:text-primary",
          page >= totalPages && "pointer-events-none opacity-40"
        )}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </nav>
  );
}