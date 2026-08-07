import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import type { LexicalContent } from "@/lib/news";

export interface ArticleHeading {
  id: string;
  text: string;
  level: number;
}

const WORDS_PER_MINUTE = 200;

export function contentToHtml(content: LexicalContent | null | undefined): string {
  if (!content || typeof content !== "object" || !("root" in content)) return "";
  try {
    return convertLexicalToHTML({
      data: content,
      disableIndent: true,
      disableContainer: true,
    });
  } catch {
    return "";
  }
}

export function contentToText(content: LexicalContent | null | undefined): string {
  if (!content || typeof content !== "object" || !("root" in content)) return "";
  try {
    return convertLexicalToPlaintext({ data: content });
  } catch {
    return "";
  }
}

export function extractHeadings(content: LexicalContent | null | undefined): ArticleHeading[] {
  if (!content || typeof content !== "object" || !("root" in content)) return [];

  const headings: ArticleHeading[] = [];
  const seen = new Set<string>();

  const walk = (nodes: unknown[] | undefined) => {
    if (!Array.isArray(nodes)) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const node of nodes as Record<string, any>[]) {
      if (node?.type === "heading") {
        const level = Number(String(node.tag ?? "h2").replace(/\D/g, "")) || 2;
        const text = (node.children ?? [])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((c: Record<string, any>) => c.text ?? "")
          .join("")
          .trim();
        if (text && !seen.has(text)) {
          seen.add(text);
          headings.push({ id: `section-${headings.length}`, text, level });
        }
      }
      if (Array.isArray(node?.children)) walk(node.children);
    }
  };

  walk(content.root?.children);
  return headings;
}

export function estimateReadingTime(content: LexicalContent | null | undefined): number {
  const text = contentToText(content);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 1;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function extractExcerpt(content: LexicalContent | null | undefined, length = 180): string {
  const text = contentToText(content);
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (collapsed.length <= length) return collapsed;
  return collapsed.slice(0, length).trim().replace(/[,.!?;:]+$/, "") + "…";
}

export function addHeadingIdsToHtml(html: string): string {
  let index = 0;
  return html.replace(/<(h[1-6])(\b[^>]*)?>/gi, (_match, tag: string, attrs: string) => {
    const id = `section-${index++}`;
    const existing = attrs && /id=/.test(attrs) ? attrs : ` id="${id}"`;
    return `<${tag}${existing}>`;
  });
}