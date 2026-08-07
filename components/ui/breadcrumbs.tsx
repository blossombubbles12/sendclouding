import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
}

export function Breadcrumbs({ items, showHomeIcon = true, className, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("w-full", className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {showHomeIcon && (
          <li className="flex items-center gap-1.5">
            <Link href="/" className="flex items-center transition-colors hover:text-primary">
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
            {items.length > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
          </li>
        )}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(isLast && "font-medium text-foreground")} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
