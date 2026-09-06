import type { MetadataRoute } from "next";
import { getAllEssays } from "@/lib/essays";

export const dynamic = "force-static";

const BASE = "https://www.rainbloom.xin";

export default function sitemap(): MetadataRoute.Sitemap {
  const essayPages = getAllEssays().map((e) => ({
    url: `${BASE}/essays/${e.slug}`,
    lastModified: e.date ? new Date(e.date) : undefined,
  }));

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/essays`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/photos`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/murmurs`, changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.4 },
    ...essayPages.map((p) => ({ ...p, changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
