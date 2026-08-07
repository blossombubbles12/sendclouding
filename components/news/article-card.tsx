import Link from "next/link";
import Image from "next/image";
import { Clock, CalendarDays, Newspaper, ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PostCardData } from "@/lib/news";

export function ArticleCard({
  article,
  eager = false,
}: {
  article: PostCardData;
  eager?: boolean;
}) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="hover-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary-50 to-secondary/10">
        {article.image ? (
          <Image
            src={article.image.url}
            alt={article.image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading={eager ? "eager" : "lazy"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Newspaper
              className="h-12 w-12 text-accent/60 transition-transform duration-500 group-hover:scale-110"
              strokeWidth={1}
              aria-hidden="true"
            />
          </div>
        )}

        {article.category && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-accent-700 backdrop-blur">
            {article.category.name}
          </span>
        )}

        <span className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/90 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-card-title text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-body flex-1 text-sm leading-relaxed">{article.excerpt}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-caption">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-accent-600" aria-hidden="true" />
            {formatDate(article.publishDate)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-accent-600" aria-hidden="true" />
            {article.readingTime} min read
          </span>
          {article.author?.name && (
            <span className="ml-auto inline-flex max-w-[45%] items-center gap-2">
              {article.author.avatar?.url && (
                <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={article.author.avatar.url}
                    alt={article.author.avatar.alt ?? article.author.name ?? "Author"}
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </span>
              )}
              <span className="truncate">{article.author.name}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}