import Image from "next/image";
import type { PostGalleryImage } from "@/lib/news";

export function ArticleContent({
  html,
  gallery,
}: {
  html: string;
  gallery?: PostGalleryImage[] | null;
}) {
  return (
    <div className="article-content min-w-0">
      {html ? (
        <div
          className="leading-relaxed text-foreground/90"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : null}

      {gallery && gallery.length > 0 ? (
        <div className="mt-12">
          <h3 className="text-section-heading mb-6 text-lg">Gallery</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {gallery.map((item, index) => {
              const image = item.image;
              if (!image?.url) return null;
              const alt = item.alt ?? image.alt ?? "Article image";
              const caption = item.caption ?? image.credit;
              return (
                <figure key={item.id ?? index} className="overflow-hidden rounded-2xl border border-border bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={image.url}
                      alt={alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  {caption && (
                    <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                      {caption}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}