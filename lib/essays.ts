import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface EssayMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface Essay extends EssayMeta {
  content: string;
}

const essaysDir = path.join(process.cwd(), "content/essays");

export function getAllEssays(): EssayMeta[] {
  if (!fs.existsSync(essaysDir)) return [];

  const files = fs.readdirSync(essaysDir).filter((f) => f.endsWith(".mdx"));

  const essays: EssayMeta[] = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(essaysDir, file), "utf-8");
      const { data } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");

      return {
        slug,
        title: data.title || slug,
        date: data.date
          ? new Date(data.date).toISOString().slice(0, 10)
          : "",
        description: data.description || "",
        tags: data.tags || [],
      };
    })
    .sort((a, b) => (b.date > a.date ? 1 : -1));

  return essays;
}

export function getEssayBySlug(slug: string): Essay | null {
  const filePath = path.join(essaysDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || slug,
    date: data.date
      ? new Date(data.date).toISOString().slice(0, 10)
      : "",
    description: data.description || "",
    tags: data.tags || [],
    content,
  };
}

export function getRecentEssays(count: number = 5): EssayMeta[] {
  return getAllEssays().slice(0, count);
}
