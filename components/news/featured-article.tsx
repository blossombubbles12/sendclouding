import Link from "next/link";
import Image from "next/image";
import { Clock, CalendarDays, ArrowRight, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PostCardData } from "@/lib/news";
import { Button } from "@/components/ui/button";

export function FeaturedArticle({ article }: { article: PostCardData }) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-border bg-muted">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Link
          href={`/news/${article.slug}`}
          className="relative order-2 min-h-[260px] overflow-hidden lg:order-1 lg:min-h-[520px]"
        >
          {article.image ? (
            <Image
              src={article.image.url}
              alt={article.image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-50 to-secondary/10" />
          )}
        </Link>

        <div className="relative order-1 flex flex-col justify-center gap-5 p-7 sm:p-12 lg:order-2">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-highlight/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-highlight-700">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            Featured
          </span>

          {article.category && (
            <Link
              href={`/news?category=${article.category.slug}`}
              className="text-sm font-medium uppercase tracking-wide text-accent-600 transition-colors hover:text-accent"
            >
              {article.category.name}
            </Link>
          )}

          <h2 className="text-page-title text-foreground">
            <Link href={`/news/${article.slug}`} className="transition-colors group-hover:text-primary">
              {article.title}
            </Link>
          </h2>

          {article.excerpt && <p className="text-body max-w-xl">{article.excerpt}</p>}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-caption">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-accent-600" aria-hidden="true" />
              {formatDate(article.publishDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-accent-600" aria-hidden="true" />
              {article.readingTime} min read
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-4">
            {article.author?.avatar?.url && (
              <span className="relative h-11 w-11 overflow-hidden rounded-full bg-muted ring-2 ring-white">
                <Image
                  src={article.author.avatar.url}
                  alt={article.author.avatar.alt ?? article.author.name ?? "Author"}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
            )}
            {article.author?.name && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{article.author.name}</p>
                {article.author.role && (
                  <p className="text-xs text-muted-foreground">{article.author.role}</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-2">
            <Button asChild>
              <Link href={`/news/${article.slug}`}>
                Read Article <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}