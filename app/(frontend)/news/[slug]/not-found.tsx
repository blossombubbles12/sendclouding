import Link from "next/link";
import { Newspaper, ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getLatestPosts, toPostCardData } from "@/lib/news";
import { ArticleCard } from "@/components/news/article-card";
import { Grid } from "@/components/layout/grid";

export const revalidate = 60;

export default async function ArticleNotFound() {
  let latest: Awaited<ReturnType<typeof getLatestPosts>> = [];
  try {
    latest = await getLatestPosts(3);
  } catch {
    latest = [];
  }

  return (
    <section className="bg-white py-24">
      <Container>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Newspaper className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-accent-700">
            404 · Article not found
          </p>
          <h1 className="text-page-title mt-3 text-foreground">This story has moved or never existed</h1>
          <p className="text-body mt-4 max-w-md">
            The article you&apos;re looking for may have been unpublished, renamed, or the link is outdated.
            Browse our latest stories below instead.
          </p>
          <Button asChild className="mt-8">
            <Link href="/news">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Back to News
            </Link>
          </Button>
        </div>

        {latest.length > 0 && (
          <div className="mx-auto mt-16 max-w-6xl">
            <h2 className="text-section-heading mb-8 text-center">Latest articles</h2>
            <Grid cols={3} gap="lg">
              {latest.map((post) => (
                <ArticleCard key={post.id} article={toPostCardData(post)} />
              ))}
            </Grid>
          </div>
        )}
      </Container>
    </section>
  );
}