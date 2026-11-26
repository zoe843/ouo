import { NextRequest } from "next/server";
import { proxyBookAsset } from "@/lib/books-proxy";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await context.params;
  return proxyBookAsset(request, slug.join("/"));
}

export async function HEAD(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await context.params;
  return proxyBookAsset(request, slug.join("/"));
}
