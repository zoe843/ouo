import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const search = request.nextUrl.search;
  const location = search ? `/books/${search}` : "/books/";
  return new Response(null, {
    status: 308,
    headers: { Location: location },
  });
}
