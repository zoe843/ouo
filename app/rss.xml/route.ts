import { getAllEssays } from "@/lib/essays";

export const dynamic = "force-static";

const BASE = "https://www.rainbloom.xin";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET(): Response {
  const essays = getAllEssays();

  const items = essays
    .map((e) => {
      const url = `${BASE}/essays/${e.slug}`;
      return [
        "    <item>",
        `      <title>${escapeXml(e.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        e.description
          ? `      <description>${escapeXml(e.description)}</description>`
          : null,
        e.date
          ? `      <pubDate>${new Date(e.date).toUTCString()}</pubDate>`
          : null,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>雨落花庭</title>
    <link>${BASE}</link>
    <description>一个存放随笔与照片的小站</description>
    <language>zh-CN</language>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
