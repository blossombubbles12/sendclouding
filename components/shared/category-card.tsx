import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface CategoryCardData {
  name: string;
  count: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

export function CategoryCard({ category }: { category: CategoryCardData }) {
  const Icon = category.icon;

  return (
    <Link
      href={category.href}
      className="group hover-lift relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-6 sm:p-7"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary transition-all duration-300 group-hover:bg-secondary group-hover:text-white">
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <ArrowUpRight
          className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-secondary"
          aria-hidden="true"
        />
      </div>
      <div className="mt-8">
        <h3 className="text-card-title text-foreground">{category.name}</h3>
        <p className="text-caption mt-1">{category.count}</p>
      </div>
    </Link>
  );
}
