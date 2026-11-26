import type { NextRequest } from "next/server";

const NOVELS_ORIGIN = "https://zoe843.github.io/rainbloom-novels";
const SEGMENT_PATTERN = /^[a-zA-Z0-9._-]+$/;
const HASHED_ASSET_PATTERN = /^assets\/(?:bundle|style)\.[a-f0-9]{8}\.(?:js|css)$/;
const IMAGE_ASSET_PATTERN = /^assets\/.+\.(?:webp|svg|png|jpe?g|ico)$/i;

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

function isValidAssetPath(assetPath: string): boolean {
  if (!assetPath || assetPath.includes("\\")) return false;
  const segments = assetPath.split("/");
  return segments.every(
    (seg) => seg.length > 0 && seg !== "." && seg !== ".." && SEGMENT_PATTERN.test(seg),
  );
}

function fallbackContentType(assetPath: string): string {
  const dot = assetPath.lastIndexOf(".");
  if (dot === -1) return "application/octet-stream";
  return MIME_TYPES[assetPath.slice(dot).toLowerCase()] ?? "application/octet-stream";
}

function cacheHeadersFor(assetPath: string): { cacheControl: string; vercelCdnCacheControl: string } {
  if (HASHED_ASSET_PATTERN.test(assetPath)) {
    return {
      cacheControl: "public, max-age=31536000, immutable",
      vercelCdnCacheControl: "public, max-age=31536000, immutable",
    };
  }
  if (IMAGE_ASSET_PATTERN.test(assetPath)) {
    return {
      cacheControl: "public, max-age=86400, stale-while-revalidate=604800",
      vercelCdnCacheControl: "public, s-maxage=604800, stale-while-revalidate=2592000",
    };
  }
  return {
    cacheControl: "public, max-age=60, stale-while-revalidate=3600",
    vercelCdnCacheControl: "public, s-maxage=300, stale-while-revalidate=86400",
  };
}

/**
 * Proxy a bookshelf static asset from GitHub Pages with explicit Vercel Edge CDN caching headers.
 */
export async function proxyBookAsset(request: NextRequest, assetPath: string): Promise<Response> {
  if (!isValidAssetPath(assetPath)) {
    return new Response("Bad Request", { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${NOVELS_ORIGIN}/${assetPath}`, {
      method: request.method === "HEAD" ? "HEAD" : "GET",
      cache: "no-store",
    });
  } catch {
    return new Response("Bad Gateway", { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  if (upstream.status === 404) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=30",
        "Vercel-CDN-Cache-Control": "public, s-maxage=60",
      },
    });
  }

  if (!upstream.ok) {
    return new Response("Bad Gateway", { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  const body = request.method === "HEAD" ? null : await upstream.arrayBuffer();
  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") || fallbackContentType(assetPath));

  const etag = upstream.headers.get("etag");
  if (etag) headers.set("ETag", etag);
  const lastModified = upstream.headers.get("last-modified");
  if (lastModified) headers.set("Last-Modified", lastModified);

  const { cacheControl, vercelCdnCacheControl } = cacheHeadersFor(assetPath);
  headers.set("Cache-Control", cacheControl);
  headers.set("Vercel-CDN-Cache-Control", vercelCdnCacheControl);

  return new Response(body, { status: 200, headers });
}
