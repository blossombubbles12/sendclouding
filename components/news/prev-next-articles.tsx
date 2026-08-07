import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PayloadPost } from "@/lib/news";
import { toPostCardData } from "@/lib/news";

export function PrevNextArticles({
  prev,
  next,
}: {
  prev?: PayloadPost | null;
  next?: PayloadPost | null;
}) {
  const prevCard = prev ? toPostCardData(prev) : null;
  const nextCard = next ? toPostCardData(next) : null;

  if (!prevCard && !nextCard) return null;

  return (
    <nav
      aria-label="Article navigation"
      className="mt-12 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2"
    >
      {prevCard ? (
        <Link
          href={`/news/${prevCard.slug}`}
          className="group flex h-full flex-col gap-2 rounded-2xl border border-border bg-white p-6 transition-colors hover:border-primary/30 hover:bg-primary-50/30"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ArrowLeft className="h-4 w-4 text-accent-600" aria-hidden="true" />
            Previous
          </span>
          <span className="text-card-title text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {prevCard.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}

      {nextCard ? (
        <Link
          href={`/news/${nextCard.slug}`}
          className="group flex items-start flex-col gap-2 rounded-2xl border border-border bg-white p-6 text-right transition-colors hover:border-primary/30 hover:bg-primary/30 sm:col-start-2"
        >
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Next
            <ArrowRight className="h-4 w-4 text-accent-600" aria-hidden="true" />
          </span>
          <span className="text-card-title text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {nextCard.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
    </nav>
  );
}