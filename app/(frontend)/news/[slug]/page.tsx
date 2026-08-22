import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Tag, User } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ArticleContent } from "@/components/news/article-content";
import { ArticleTableOfContents } from "@/components/news/article-toc";
import { ShareButtons } from "@/components/news/share-buttons";
import { LatestArticlesSidebar } from "@/components/news/latest-articles-sidebar";
import { RelatedArticles } from "@/components/news/related-articles";
import { PrevNextArticles } from "@/components/news/prev-next-articles";
import { CommentsPlaceholder } from "@/components/news/comments-placeholder";
import { Newsletter } from "@/components/shared/newsletter";
import { CTA } from "@/components/shared/cta";
import {
  getPostBySlug,
  getPostTags,
  getPostHeroImage,
  getPostExcerpt,
  getRelatedPosts,
  getLatestPosts,
  getPrevNextPosts,
  toPostCardData,
} from "@/lib/news";
import {
  contentToHtml,
  extractHeadings,
  estimateReadingTime,
  extractExcerpt,
  addHeadingIdsToHtml,
} from "@/lib/rich-text";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function absolutize(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${siteUrl}${url}`;
}

async function getArticle(slug: string) {
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return post;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArticle(slug);

  const title = post.seo?.metaTitle?.trim() || `${post.title} | Send Clouding`;
  const description =
    post.seo?.metaDescription?.trim() ||
    getPostExcerpt(post) ||
    extractExcerpt(post.content);
  const url = `${siteUrl}/news/${post.slug}`;
  const image = absolutize(post.seo?.ogImage?.url ?? post.heroImage?.url);
  const keywords = post.seo?.keywords || getPostTags(post).join(", ");

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      publishedTime: post.publishDate ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.author?.name ?? "Send Clouding"].filter(Boolean),
      siteName: "Send Clouding",
      ...(image ? { images: [{ url: image, alt: post.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getArticle(slug);

  const heroImage = getPostHeroImage(post);
  const tags = getPostTags(post);
  const readingTime = estimateReadingTime(post.content);
  const headings = extractHeadings(post.content);
  const rawHtml = addHeadingIdsToHtml(contentToHtml(post.content));

  const [{ prev, next }, related, latest] = await Promise.all([
    getPrevNextPosts(post),
    getRelatedPosts(post, 3),
    getLatestPosts(6),
  ]);

  const relatedCards = related.map(toPostCardData);
  const latestCards = latest.map(toPostCardData);
  const metaDescription =
    post.seo?.metaDescription ||
    getPostExcerpt(post) ||
    extractExcerpt(post.content);

  const articleUrl = `${siteUrl}/news/${post.slug}`;
  const structured = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: metaDescription,
    image: absolutize(post.heroImage?.url) ? [absolutize(post.heroImage?.url)] : undefined,
    datePublished: post.publishDate,
    dateModified: post.updatedAt,
    articleSection: post.category?.name,
    keywords: tags.join(", ") || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    author: { "@type": "Person", name: post.author?.name || "Send Clouding" },
    publisher: {
      "@type": "Organization",
      name: "Send Clouding",
      logo: { "@type": "ImageObject", url: absolutize(post.author?.avatar?.url) },
    },
  };

  return (
    <>
      <Section background="muted" spacing="md" className="pb-0">
        <Container>
          <div className="pt-12">
            <Breadcrumbs
              items={[
                { label: "News", href: "/news" },
                ...(post.category?.name ? [{ label: post.category.name, href: `/news?category=${post.category.slug}` }] : []),
                { label: post.title },
              ]}
            />
          </div>

          <header className="mx-auto mt-10 max-w-3xl text-center">
            {post.category && (
              <Link href={`/news?category=${post.category.slug}`}>
                <Badge variant="secondary" className="mb-6">{post.category.name}</Badge>
              </Link>
            )}
            <h1 className="text-page-title text-foreground">{post.title}</h1>
            {getPostExcerpt(post) && (
              <p className="text-body mx-auto mt-5 max-w-2xl">{getPostExcerpt(post)}</p>
            )}

            <div className="mt-8 flex flex-col items-center justify-center gap-5">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-caption">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-accent-600" aria-hidden="true" />
                  {formatDate(post.publishDate ?? post.createdAt ?? "")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className="text-base leading-none">·</span>
                  {readingTime} min read
                </span>
              </div>

              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.avatar?.url && (
                    <span className="relative h-12 w-12 overflow-hidden rounded-full bg-muted ring-2 ring-white">
                      <Image
                        src={post.author.avatar.url}
                        alt={post.author.avatar.alt ?? post.author.name ?? "Author"}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                  )}
                  <span className="text-left">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      <User className="h-4 w-4 text-primary" aria-hidden="true" />
                      {post.author.name}
                    </span>
                    {post.author.role && (
                      <span className="block text-xs text-muted-foreground">{post.author.role}</span>
                    )}
                  </span>
                </div>
              )}

              <ShareButtons url={articleUrl} title={post.title} />
            </div>
          </header>
        </Container>
      </Section>

      <Section background="muted" spacing="md" className="pt-8">
        <Container size="lg">
          <div className="relative aspect-[16/8] overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-50 to-secondary/10 shadow-lg">
            {heroImage ? (
              <Image
                src={heroImage.url}
                alt={heroImage.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center" />
            )}
          </div>
        </Container>
      </Section>

      <Section background="white" spacing="lg">
        <Container size="lg">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article className="min-w-0">
              {headings.length >= 2 && (
                <details className="mb-8 block rounded-2xl border border-border bg-white p-5 lg:hidden">
                  <summary className="cursor-pointer text-sm font-semibold text-foreground">
                    Table of contents
                  </summary>
                  <div className="mt-3">
                    <ArticleTableOfContents headings={headings} />
                  </div>
                </details>
              )}

              <ArticleContent html={rawHtml} gallery={post.gallery} />

              {tags.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Tag className="h-4 w-4" aria-hidden="true" />
                    Tags:
                  </span>
                  {tags.map((tag) => (
                    <Link key={tag} href={`/news?q=${encodeURIComponent(tag)}`}>
                      <Badge variant="muted" className="hover:bg-primary hover:text-white">{tag}</Badge>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-10 flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">Enjoyed this read?</p>
                <ShareButtons url={articleUrl} title={post.title} />
              </div>

              <CommentsPlaceholder />
              <PrevNextArticles prev={prev} next={next} />
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <div className="rounded-2xl border border-border bg-white p-6">
                  <ArticleTableOfContents headings={headings} />
                </div>
                <div className="rounded-2xl border border-border bg-white p-6">
                  <LatestArticlesSidebar posts={latestCards} currentSlug={post.slug} />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <RelatedArticles articles={relatedCards.slice(0, 3)} />
      <Newsletter />
      <CTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
      />
    </>
  );
}