import { getAllEssays, getEssayBySlug } from "@/lib/essays";

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
      const full = getEssayBySlug(e.slug); // 列表接口不带正文,单取一次
      return [
        "    <item>",
        `      <title>${escapeXml(e.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        e.description
          ? `      <description>${escapeXml(e.description)}</description>`
          : null,
        // 全文正文：CDATA 包 markdown 原文，主流阅读器可直接渲染
        full?.content
          ? `      <content:encoded><![CDATA[${full.content.replace(/\]\]>/g, "]]]]><![CDATA[>")}]]></content:encoded>`
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
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
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
