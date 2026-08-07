import { getPayloadClient } from "@/lib/data";
import { estimateReadingTime, extractExcerpt } from "@/lib/rich-text";

export interface PostImage {
  id?: string;
  url?: string;
  alt?: string;
  credit?: string;
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PostAuthor {
  name?: string;
  role?: string;
  avatar?: PostImage | null;
  bio?: string;
}

export interface PostGalleryImage {
  id?: string;
  image?: PostImage | null;
  alt?: string;
  caption?: string;
}

export interface PostSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: PostImage | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LexicalContent = any;

export interface PayloadPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: LexicalContent | null;
  heroImage?: PostImage | null;
  gallery?: PostGalleryImage[] | null;
  category?: PostCategory | null;
  tags?: ({ id?: string; tag?: string } | string)[] | null;
  author?: PostAuthor | null;
  publishDate?: string | null;
  featured?: boolean;
  status?: string;
  seo?: PostSEO | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostCardData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category?: PostCategory | null;
  author?: PostAuthor | null;
  publishDate: string;
  readingTime: number;
  image: { url: string; alt: string } | null;
  featured?: boolean;
}

export interface PostsResult {
  posts: PayloadPost[];
  totalDocs: number;
  totalPages: number;
  page: number;
}

export interface GetPostsOptions {
  limit?: number;
  page?: number;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
}

export function getPostTags(post: PayloadPost): string[] {
  if (!post.tags) return [];
  return post.tags.map((t) => (typeof t === "string" ? t : t.tag ?? "")).filter(Boolean);
}

export function getPostHeroImage(post: PayloadPost): { url: string; alt: string } | null {
  const image = post.heroImage;
  if (!image?.url) return null;
  return { url: image.url, alt: image.alt ?? post.title };
}

export function getPostExcerpt(post: PayloadPost): string {
  if (post.excerpt?.trim()) return post.excerpt.trim();
  return "";
}

export function getPostAuthorName(post: PayloadPost): string {
  return post.author?.name?.trim() || "AquaBest Brands";
}

export function toPostCardData(post: PayloadPost): PostCardData {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt:
      getPostExcerpt(post) || extractExcerpt(post.content),
    category: post.category ?? null,
    author: post.author ?? null,
    publishDate: post.publishDate ?? post.createdAt ?? new Date().toISOString(),
    readingTime: estimateReadingTime(post.content),
    image: getPostHeroImage(post),
    featured: post.featured,
  };
}

export async function getPosts({
  limit = 9,
  page = 1,
  category,
  tag,
  search,
  featured,
}: GetPostsOptions = {}): Promise<PostsResult> {
  const payload = await getPayloadClient();

  const where: Record<string, unknown> = {
    status: { equals: "published" },
    ...(featured !== undefined ? { featured: { equals: featured } } : {}),
    ...(category ? { "category.slug": { equals: category } } : {}),
    ...(tag ? { "tags.tag": { equals: tag } } : {}),
    ...(search
      ? {
          or: [{ title: { contains: search } }, { excerpt: { contains: search } }],
        }
      : {}),
  };

  const result = await payload.find({
    collection: "posts",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: where as any,
    limit,
    page,
    depth: 2,
    sort: "-publishDate",
  });

  return {
    posts: result.docs as unknown as PayloadPost[],
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page ?? 1,
  };
}

export async function getPostBySlug(slug: string): Promise<PayloadPost | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug }, status: { equals: "published" } },
    limit: 1,
    depth: 2,
  });
  return (result.docs[0] as unknown as PayloadPost) ?? null;
}

export async function getLatestPosts(limit = 6): Promise<PayloadPost[]> {
  const { posts } = await getPosts({ limit, page: 1 });
  return posts;
}

export async function getFeaturedPosts(limit = 1): Promise<PayloadPost[]> {
  const { posts } = await getPosts({ limit, page: 1, featured: true });
  return posts;
}

export async function getRelatedPosts(
  post: PayloadPost,
  limit = 3
): Promise<PayloadPost[]> {
  const payload = await getPayloadClient();

  const where: Record<string, unknown> = {
    status: { equals: "published" },
    id: { not_equals: post.id },
    ...(post.category?.slug
      ? { "category.slug": { equals: post.category.slug } }
      : {}),
  };

  const result = await payload.find({
    collection: "posts",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: where as any,
    limit,
    depth: 2,
    sort: "-publishDate",
  });

  const posts = result.docs as unknown as PayloadPost[];
  if (posts.length >= limit) return posts;

  // Fall back to the latest published articles when there aren't enough same-category posts.
  if (posts.length === 0) {
    const latest = await getLatestPosts(limit);
    return latest.filter((p) => p.id !== post.id).slice(0, limit);
  }

  const { posts: more } = await getPosts({ limit: limit * 2, page: 1 });
  const seen = new Set(posts.map((p) => p.id));
  seen.add(post.id);
  const fillers = more.filter((p) => !seen.has(p.id)).slice(0, limit - posts.length);
  return [...posts, ...fillers];
}

export interface PrevNextResult {
  prev?: PayloadPost | null;
  next?: PayloadPost | null;
}

export async function getPrevNextPosts(post: PayloadPost): Promise<PrevNextResult> {
  const payload = await getPayloadClient();
  const date = post.publishDate ?? post.createdAt;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const olderWhere: any = {
    status: { equals: "published" },
    publishDate: { lessThan: date },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newerWhere: any = {
    status: { equals: "published" },
    publishDate: { greaterThan: date },
  };

  const [older, newer] = await Promise.all([
    payload.find({
      collection: "posts",
      where: olderWhere,
      sort: "-publishDate",
      limit: 1,
      depth: 1,
    }),
    payload.find({
      collection: "posts",
      where: newerWhere,
      sort: "publishDate",
      limit: 1,
      depth: 1,
    }),
  ]);

  return {
    prev: (older.docs[0] as unknown as PayloadPost) ?? null,
    next: (newer.docs[0] as unknown as PayloadPost) ?? null,
  };
}

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export async function getNewsCategories(): Promise<CategoryWithCount[]> {
  const payload = await getPayloadClient();

  const [categories, posts] = await Promise.all([
    payload.find({
      collection: "categories",
      where: { status: { equals: "active" } },
      limit: 50,
      depth: 1,
      sort: "name",
    }),
    payload.find({
      collection: "posts",
      where: { status: { equals: "published" } },
      limit: 500,
      depth: 0,
    }),
  ]);

  const counts = new Map<string, number>();
  for (const post of posts.docs as unknown as PayloadPost[]) {
    const rel = post.category as unknown as { id?: string; slug?: string } | null;
    if (rel?.id) counts.set(rel.id, (counts.get(rel.id) ?? 0) + 1);
  }

  return (categories.docs as unknown as PostCategory[])
    .map((c) => ({ ...c, count: counts.get(c.id) ?? 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
}

export async function getNewsTags(): Promise<string[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: { status: { equals: "published" } },
    limit: 200,
    depth: 0,
  });

  const tagSet = new Set<string>();
  for (const post of result.docs as unknown as PayloadPost[]) {
    for (const tag of getPostTags(post)) tagSet.add(tag);
  }
  return Array.from(tagSet);
}

export async function getPublishedPostSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: { status: { equals: "published" } },
    limit: 500,
    depth: 0,
    select: {
      slug: true,
      updatedAt: true,
    },
  });
  return result.docs as unknown as { slug: string; updatedAt: string }[];
}
