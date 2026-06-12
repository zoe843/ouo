import { getEssayBySlug, getAllEssays } from "@/lib/essays";
import { notFound } from "next/navigation";
import MDXContent from "@/components/MDXContent";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllEssays().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) return { title: "未找到" };
  return {
    title: `${essay.title} - 雨落花庭`,
    description: essay.description,
  };
}

export default async function EssayPage({ params }: Props) {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);

  if (!essay) {
    notFound();
  }

  const essays = getAllEssays();
  const idx = essays.findIndex((e) => e.slug === slug);
  const prev = idx < essays.length - 1 ? essays[idx + 1] : null;
  const next = idx > 0 ? essays[idx - 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-10">
      <article className="animate-float-up">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-light tracking-wider text-[var(--foreground)]">
            {essay.title}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4 text-sm text-[var(--muted)] font-light">
            {essay.date && <time>{essay.date}</time>}
            {essay.tags.length > 0 && (
              <>
                <span className="text-[var(--border)]">·</span>
                <div className="flex gap-2">
                  {essay.tags.map((tag) => (
                    <span key={tag} className="text-[var(--accent)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        <div className="leading-relaxed">
          <MDXContent source={essay.content} />
        </div>
      </article>

      <nav className="mt-16 pt-8 border-t border-[var(--border)]/30 flex justify-between text-sm">
        {prev ? (
          <Link
            href={`/essays/${prev.slug}`}
            className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/essays/${next.slug}`}
            className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors text-right"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
