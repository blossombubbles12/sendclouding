import type { MetadataRoute } from "next";
import { getPublishedPostSlugs } from "@/lib/news";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const staticRoutes = [
  "",
  "/about",
  "/contact",
  "/facilities",
  "/careers",
  "/faq",
  "/privacy",
  "/terms",
  "/shipping",
  "/refund-policy",
  "/products",
  "/news",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: { slug: string; updatedAt: string }[] = [];
  try {
    posts = await getPublishedPostSlugs();
  } catch {
    posts = [];
  }

  const now = new Date();

  const statics: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const articles: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/news/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...statics, ...articles];
}