import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

// Fallback image mapping for when local files are requested on serverless production
const SEED_FALLBACK_URLS: Record<string, string> = {
  "classic-mug.png": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
  "wall-canvas.png": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
  "die-cut-stickers.png": "https://images.unsplash.com/photo-1572375995501-4b0894dbe7d1?w=600&auto=format&fit=crop&q=80",
  "canvas-tote.png": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
  "classic-tee.png": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "media",
      where: {
        filename: {
          equals: filename,
        },
      },
      limit: 1,
    });

    if (result.docs.length > 0) {
      const doc = result.docs[0] as any;
      // If Vercel Blob or a real URL is populated, redirect to it!
      if (doc.url && doc.url.startsWith("http")) {
        return NextResponse.redirect(doc.url);
      }
    }
  } catch (error) {
    console.error("[Media Fallback API] Error finding doc:", error);
  }

  // Fallback to our Unsplash high-res seed mockups if the file is a seeded mockup filename
  if (SEED_FALLBACK_URLS[filename]) {
    return NextResponse.redirect(SEED_FALLBACK_URLS[filename]);
  }

  // Else, check if the file matches standard site graphics
  if (filename === "logo.jpg.png" || filename.startsWith("logo.jpg")) {
    return NextResponse.redirect(`${req.nextUrl.origin}/logo.jpg.png`);
  }

  return new Response("Not Found", { status: 404 });
}
