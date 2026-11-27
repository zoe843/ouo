export interface FeaturedBook {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  updated: string;
  wordCount: number;
  tags: string[];
}

interface RawBook {
  id?: unknown;
  title?: unknown;
  subtitle?: unknown;
  status?: unknown;
  updated?: unknown;
  wordCount?: unknown;
  tags?: unknown;
  sample?: unknown;
}

const CATALOG_URL = "https://zoe843.github.io/rainbloom-novels/data/catalog.json";

const FALLBACK_BOOKS: FeaturedBook[] = [
  {
    id: "the-fourteenth-month",
    title: "十四月",
    subtitle: "九月一日清晨掌心凭空多出的半枚黄铜断扣，把高二少女浅井弥生拖进了一场跨越四百三十九天的静默回响。",
    status: "已完结",
    updated: "2026-11-27",
    wordCount: 281829,
    tags: ["日系轻文学", "都市悬疑", "长篇"],
  },
  {
    id: "white-rain-of-summer",
    title: "白雨止于盛夏",
    subtitle: "那场落于烈日之下的冰凉白雨，把十年前沉没的旧村与她的命一起锁在了水底。",
    status: "已完结",
    updated: "2026-11-25",
    wordCount: 172979,
    tags: ["日系轻文学", "盛夏悬疑", "长篇"],
  },
  {
    id: "long-tail",
    title: "长尾",
    subtitle: "四十年前他删掉的零分人类，在文明热寂之夜砸碎了完美的冰原。",
    status: "已完结",
    updated: "2026-11-24",
    wordCount: 32778,
    tags: ["人工智能", "大模型", "硬核科幻"],
  },
  {
    id: "submergence",
    title: "沉潜",
    subtitle: "一万两千年前，他们把整座大陆沉进四千米深海，只为躲避一场天空的暴怒。",
    status: "已完结",
    updated: "2026-11-24",
    wordCount: 16131,
    tags: ["硬核科幻", "地球物理", "中短篇"],
  },
];

function toFeaturedBook(raw: RawBook): FeaturedBook | null {
  if (
    typeof raw.id !== "string" ||
    typeof raw.title !== "string" ||
    typeof raw.subtitle !== "string" ||
    typeof raw.status !== "string" ||
    typeof raw.updated !== "string" ||
    typeof raw.wordCount !== "number"
  ) {
    return null;
  }
  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((t): t is string => typeof t === "string").slice(0, 3)
    : [];
  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle,
    status: raw.status,
    updated: raw.updated,
    wordCount: raw.wordCount,
    tags,
  };
}

/**
 * Fetch recent non-sample books from the bookshelf catalog at build time.
 * Falls back silently to bundled metadata when offline or unreachable.
 */
export async function getFeaturedBooks(limit = 3): Promise<FeaturedBook[]> {
  try {
    const response = await fetch(CATALOG_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return FALLBACK_BOOKS.slice(0, limit);
    const data = (await response.json()) as unknown;
    if (!Array.isArray(data)) return FALLBACK_BOOKS.slice(0, limit);

    const books = data
      .filter((item): item is RawBook => Boolean(item) && typeof item === "object" && !(item as RawBook).sample)
      .map(toFeaturedBook)
      .filter((book): book is FeaturedBook => book !== null)
      .sort((a, b) => b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title, "zh-CN"));

    return books.length > 0 ? books.slice(0, limit) : FALLBACK_BOOKS.slice(0, limit);
  } catch {
    return FALLBACK_BOOKS.slice(0, limit);
  }
}

export function formatWordCount(count: number): string {
  return count >= 10000 ? `${(count / 10000).toFixed(1)} 万字` : `${count.toLocaleString("zh-CN")} 字`;
}
