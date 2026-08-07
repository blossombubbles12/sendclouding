import { Newspaper } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { ArticleCard } from "@/components/news/article-card";
import { FeaturedArticle } from "@/components/news/featured-article";
import { NewsFilter } from "@/components/news/news-filter";
import { Pagination } from "@/components/news/pagination";
import { Newsletter } from "@/components/shared/newsletter";
import { CTA } from "@/components/shared/cta";
import {
  getPosts,
  getFeaturedPosts,
  getNewsCategories,
  toPostCardData,
  type PostCardData,
} from "@/lib/news";

export const revalidate = 60;

const PAGE_SIZE = 9;

async function loadFeatured(): Promise<PostCardData | null> {
  try {
    const featured = await getFeaturedPosts(1);
    return featured[0] ? toPostCardData(featured[0]) : null;
  } catch {
    return null;
  }
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const { q, category, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const search = q?.trim() ?? "";
  const activeCategory = category?.trim() || null;
  const showingFeatured = page === 1 && !search && !activeCategory;

  const [featured, categories, result] = await Promise.all([
    showingFeatured ? loadFeatured() : Promise.resolve(null),
    getNewsCategories(),
    getPosts({
      limit: PAGE_SIZE,
      page,
      category: activeCategory ?? undefined,
      search: search || undefined,
    }),
  ]);

  const gridPosts = result.posts
    .filter((post) => post.id !== featured?.id)
    .map(toPostCardData);

  const baseParams = new URLSearchParams();
  if (search) baseParams.set("q", search);
  if (activeCategory) baseParams.set("category", activeCategory);

  return (
    <>
      <Section background="muted" spacing="md" className="pb-0">
        <Container>
          <div className="pt-12">
            <Breadcrumbs items={[{ label: "News", href: "/news" }]} />
          </div>
          <div className="mt-10">
            <SectionHeading
              eyebrow="Newsroom"
              title="News & Articles"
              description="Insights, stories, and updates from AquaBest Brands — quality water, bakery, and everything in between."
            />
          </div>
        </Container>
      </Section>

      <Section background="white" spacing="lg">
        <Container>
          {featured && (
            <div className="mb-16">
              <FeaturedArticle article={featured} />
            </div>
          )}

          <NewsFilter
            q={search}
            categories={categories}
            activeCategory={activeCategory}
          />

          <div className="mt-12">
            <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-4">
              <h2 className="text-section-heading text-foreground">
                {result.totalDocs > 0 ? "Latest articles" : "Articles"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {result.totalDocs} {result.totalDocs === 1 ? "result" : "results"}
              </p>
            </div>

            {gridPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Newspaper className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">No articles found</h3>
                <p className="max-w-sm text-muted-foreground">
                  {search
                    ? "We couldn't find anything matching your search. Try a different keyword or category."
                    : "There are no published articles in this category yet — check back soon!"}
                </p>
                <Link
                  href="/news"
                  className="mt-2 inline-block font-medium text-primary underline-offset-4 hover:underline"
                >
                  Clear search &amp; filters
                </Link>
              </div>
            ) : (
              <Grid cols={3} gap="lg">
                {gridPosts.map((post) => (
                  <ArticleCard key={post.id} article={post} />
                ))}
              </Grid>
            )}
          </div>

          <div className="mt-14">
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              baseParams={baseParams.toString()}
            />
          </div>
        </Container>
      </Section>

      <Newsletter />
      <CTA />
    </>
  );
}