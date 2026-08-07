import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { Flex } from "@/components/layout/flex";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

const articles = [
  {
    title: "How We Purify Every Drop: A Look Inside Our Facility",
    excerpt: "Take a behind-the-scenes look at our multi-stage filtration and quality control process.",
    date: "July 2026",
    category: "Water Production",
  },
  {
    title: "5 Ways to Keep Pastries Fresh Longer",
    excerpt: "Our bakery team shares practical tips for storing bread, cakes, and pastries at home.",
    date: "June 2026",
    category: "Bakeries",
  },
  {
    title: "AquaBest Expands Distribution to 3 New Cities",
    excerpt: "We're growing! Here's what our expansion means for availability near you.",
    date: "May 2026",
    category: "Company News",
  },
];

export function LatestArticles() {
  return (
    <Section background="muted" spacing="lg">
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
          <Reveal key={article.title} delay={index * 80}>
            <Link href="/news" className="hover-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white">
              <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 to-secondary/10">
                <Newspaper className="h-12 w-12 text-accent/60 transition-transform duration-500 group-hover:scale-110" strokeWidth={1} aria-hidden="true" />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-6">
                <span className="text-caption uppercase tracking-wide text-accent-700">{article.category}</span>
                <h3 className="text-card-title text-foreground transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="text-body flex-1">{article.excerpt}</p>
                <span className="text-caption mt-2">{article.date}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}
