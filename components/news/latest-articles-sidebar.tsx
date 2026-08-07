import Link from "next/link";
import Image from "next/image";
import { Newspaper, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PostCardData } from "@/lib/news";

export function LatestArticlesSidebar({ posts, currentSlug }: { posts: PostCardData[]; currentSlug?: string }) {
  if (posts.length === 0) return null;

  return (
    <aside aria-label="Latest articles">
      <div className="flex items-center justify-between">
        <h3 className="text-card-title font-semibold text-foreground">Latest articles</h3>
        <Link
          href="/news"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-600"
        >
          All <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <ul className="mt-5 space-y-5">
        {posts.map((post) => {
          if (currentSlug && post.slug === currentSlug) return null;
          return (
            <li key={post.id}>
              <Link
                href={`/news/${post.slug}`}
                className="group flex gap-4 rounded-2xl p-2 transition-colors hover:bg-muted/60"
              >
                <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary-50 to-secondary/10">
                  {post.image ? (
                    <Image
                      src={post.image.url}
                      alt={post.image.alt}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center">
                      <Newspaper className="h-6 w-6 text-accent/50" strokeWidth={1} aria-hidden="true" />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
                    {post.title}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {formatDate(post.publishDate)}
                    {post.category?.name ? ` · ${post.category.name}` : ""}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}