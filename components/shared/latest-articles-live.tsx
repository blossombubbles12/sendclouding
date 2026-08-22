import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ArrowRight, Newspaper } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { Flex } from "@/components/layout/flex";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { formatDate } from "@/lib/utils";
import { getLatestPosts, toPostCardData, type PostCardData } from "@/lib/news";

export async function LatestArticlesLive() {
  let articles: PostCardData[] = [];
  try {
    articles = (await getLatestPosts(3)).map(toPostCardData);
  } catch {
    articles = [];
  }

  if (articles.length === 0) return null;

  return (
    <Section background="muted" spacing="lg" pattern="wave">
      <Flex justify="between" align="end" wrap className="mb-14 gap-6">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="From the Blog"
            title="Latest articles & updates"
            className="mx-0 max-w-xl items-start text-left"
          />
        </Reveal>
        <Reveal delay={100}>
          <Button variant="outline" asChild>
            <Link href="/news">
              View all articles <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </Flex>
      <Grid cols={3} gap="lg">
        {articles.map((article, index) => (
          <Reveal key={article.id} delay={index * 80}>
            <Link
              href={`/news/${article.slug}`}
              className="hover-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white"
            >
              <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 to-secondary/10">
                {article.image ? (
                  <Image
                    src={article.image.url}
                    alt={article.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <Newspaper
                    className="h-12 w-12 text-accent/60 transition-transform duration-500 group-hover:scale-110"
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-6">
                <span className="text-caption uppercase tracking-wide text-accent-700">
                  {article.category?.name ?? "Send Clouding News"}
                </span>
                <h3 className="text-card-title text-foreground transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="text-body flex-1 text-sm">{article.excerpt}</p>
                <span className="text-caption mt-2 inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-accent-600" aria-hidden="true" />
                  {formatDate(article.publishDate)} · {article.readingTime} min read
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}