import { NextRequest } from "next/server";
import { proxyBookAsset } from "@/lib/books-proxy";

export const dynamic = "force-dynamic";

async function handle(request: NextRequest) {
  const url = new URL(request.url);
  if (!url.pathname.endsWith("/")) {
    const location = url.search ? `/books/${url.search}` : "/books/";
    return new Response(null, {
      status: 308,
      headers: { Location: location },
    });
  }
  return proxyBookAsset(request, "index.html");
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function HEAD(request: NextRequest) {
  return handle(request);
}
