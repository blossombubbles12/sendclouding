import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { Flex } from "@/components/layout/flex";
import { SectionHeading } from "@/components/shared/section-heading";
import { ArticleCard } from "@/components/news/article-card";
import type { PostCardData } from "@/lib/news";

export function RelatedArticles({ articles }: { articles: PostCardData[] }) {
  if (articles.length === 0) return null;

  return (
    <Section background="muted" spacing="md">
      <div className="mx-auto max-w-7xl">
        <Flex justify="between" align="end" wrap className="mb-10 gap-4">
          <SectionHeading
            align="left"
            eyebrow="Keep Reading"
            title="Related articles"
            className="mx-0 items-start text-left"
          />
        </Flex>
        <Grid cols={3} gap="lg">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </Grid>
      </div>
    </Section>
  );
}