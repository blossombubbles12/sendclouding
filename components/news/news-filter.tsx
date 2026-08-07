"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface NewsCategoryOption {
  slug: string;
  name: string;
  count: number;
}

export function NewsFilter({
  q,
  categories,
  activeCategory,
}: {
  q: string;
  categories: NewsCategoryOption[];
  activeCategory: string | null;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState(q);
  const [prevQ, setPrevQ] = React.useState(q);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  if (prevQ !== q) {
    setPrevQ(q);
    setValue(q);
  }

  React.useEffect(() => {
    if (value === q) return;
    if (timer.current) clearTimeout(timer.current);
    const normalized = value.trim();
    if (normalized === "" && q === "") return;
    timer.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (normalized) params.set("q", normalized);
      if (activeCategory) params.set("category", activeCategory);
      router.push(`/news${params.toString() ? `?${params.toString()}` : ""}`);
    }, 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search articles, topics, or keywords..."
          aria-label="Search articles"
          className="h-12 rounded-full bg-white pl-12 pr-12 shadow-sm"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              router.push(activeCategory ? `/news?category=${activeCategory}` : "/news");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/news"
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            !activeCategory && !q
              ? "border-primary bg-primary text-white"
              : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-primary"
          )}
        >
          All
        </Link>
        {categories.map((category) => {
          const active = activeCategory === category.slug && !q;
          const href = active ? "/news" : `/news?category=${category.slug}`;
          return (
            <Link
              key={category.slug}
              href={href}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-primary"
              )}
            >
              {category.name}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  active ? "bg-white/20 text-white" : "text-highlight-600"
                )}
              >
                {category.count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}