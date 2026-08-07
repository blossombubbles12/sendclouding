"use client";

import * as React from "react";
import { ListTree, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArticleHeading } from "@/lib/rich-text";

export function ArticleTableOfContents({ headings }: { headings: ArticleHeading[] }) {
  const [activeId, setActiveId] = React.useState<string>(headings[0]?.id ?? "");
  const linkRefs = React.useRef<Map<string, HTMLElement>>(new Map());

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  function handleClick(e: React.MouseEvent, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  }

  if (headings.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <FolderOpen className="h-4 w-4" aria-hidden="true" />
        No sections available yet
      </div>
    );
  }

  return (
    <nav aria-label="Table of contents" className="min-w-0">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <ListTree className="h-4 w-4 text-accent-600" aria-hidden="true" />
        In this article
      </p>
      <ul className="space-y-1 border-l border-border">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                ref={(el) => {
                  if (el) linkRefs.current.set(heading.id, el);
                  else linkRefs.current.delete(heading.id);
                }}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 text-sm transition-colors",
                  heading.level >= 3 ? "pl-7" : "pl-4",
                  isActive
                    ? "border-primary font-medium text-primary"
                    : "border-transparent text-muted-foreground hover:border-secondary/40 hover:text-foreground"
                )}
                onClick={(e) => handleClick(e, heading.id)}
                aria-current={isActive ? "true" : undefined}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}