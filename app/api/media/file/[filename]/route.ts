import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import fs from "fs";
import path from "path";

// Fallback image mapping for when local files are requested on serverless production
const SEED_FALLBACK_URLS: Record<string, string> = {
  "classic-mug.png": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
  "wall-canvas.png": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
  "die-cut-stickers.png": "https://images.unsplash.com/photo-1572375995501-4b0894dbe7d1?w=600&auto=format&fit=crop&q=80",
  "canvas-tote.png": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
  "classic-tee.png": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
};

// Known size suffixes from Media collection upload.imageSizes
const SIZE_SUFFIXES = ["-400x400", "-768x768", "-1920x1080", "-thumbnail", "-card", "-hero"];

function stripSizeSuffix(filename: string): string {
  for (const suffix of SIZE_SUFFIXES) {
    if (filename.endsWith(suffix + ".png") || filename.endsWith(suffix + ".jpg") || filename.endsWith(suffix + ".jpeg") || filename.endsWith(suffix + ".webp")) {
      return filename.slice(0, -suffix.length) + filename.slice(filename.lastIndexOf("."));
    }
  }
  return filename;
}

// MIME type mapping for common image formats
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".avif": "image/avif",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;

  // Prevent path traversal
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const payload = await getPayload({ config });

    // First, try exact filename match
    let result = await payload.find({
      collection: "media",
      where: { filename: { equals: filename } },
      limit: 1,
    });

    // If not found, try stripping size suffixes to find the parent document
    if (result.docs.length === 0) {
      const baseFilename = stripSizeSuffix(filename);
      if (baseFilename !== filename) {
        result = await payload.find({
          collection: "media",
          where: { filename: { equals: baseFilename } },
          limit: 1,
        });
      }
    }

    if (result.docs.length > 0) {
      const doc = result.docs[0] as any;

      // If Vercel Blob or a real URL is populated, redirect to it!
      if (doc.url && doc.url.startsWith("http")) {
        // For size variants, construct the CDN URL for that size
        if (filename !== doc.filename && doc.sizes) {
          const matchingSize = Object.values(doc.sizes).find((s: any) => s.filename === filename) as any;
          if (matchingSize?.url?.startsWith("http")) {
            return NextResponse.redirect(matchingSize.url);
          }
        }
        return NextResponse.redirect(doc.url);
      }

      // Local file - serve directly from filesystem
      // Determine the actual file path for the requested size
      let filePath = path.join(process.cwd(), "media", filename);
      const baseFilename = stripSizeSuffix(filename);
      if (filename !== baseFilename && doc.sizes) {
        // Find the matching size object
        const matchingSize = Object.values(doc.sizes).find((s: any) => s.filename === filename) as any;
        if (matchingSize?.url) {
          // Extract just the filename from the size URL
          const sizeUrl = matchingSize.url;
          const urlFilename = sizeUrl.split("/").pop();
          if (urlFilename) filePath = path.join(process.cwd(), "media", urlFilename);
        }
      }

      // Check if the file exists on disk
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const mimeType = getMimeType(filename);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }

      // File not found on disk - try the base filename as a fallback
      const baseFilePath = path.join(process.cwd(), "media", baseFilename);
      if (baseFilename !== filename && fs.existsSync(baseFilePath)) {
        const fileBuffer = fs.readFileSync(baseFilePath);
        const mimeType = getMimeType(baseFilename);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
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