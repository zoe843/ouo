import Link from "next/link";
import { getEssayBySlug, getAllEssays } from "@/lib/essays";
import { notFound } from "next/navigation";
import MDXContent from "@/components/MDXContent";
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
    title: essay.title,
    description: essay.description,
    alternates: { canonical: `/essays/${slug}` },
    openGraph: {
      type: "article",
      publishedTime: essay.date || undefined,
      tags: essay.tags,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: essay.title }],
    },
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

  const articleJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: essay.title,
    description: essay.description || undefined,
    datePublished: essay.date || undefined,
    inLanguage: "zh-CN",
    author: { "@type": "Person", name: "雨落花庭" },
    mainEntityOfPage: `https://www.rainbloom.xin/essays/${slug}`,
    keywords: essay.tags.length > 0 ? essay.tags.join(", ") : undefined,
  });

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-14 sm:pt-20 pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLd }}
      />
      <div className="night-panel px-6 py-8 sm:px-10 sm:py-10 animate-float-up">
        <article>
          <header className="mb-10 text-center">
            <h1 className="font-serif text-2xl sm:text-3xl font-light tracking-wider text-[#eceae4]">
              {essay.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-4 text-xs sm:text-sm text-[var(--muted)] font-light">
              {essay.date && (
                <time dateTime={essay.date} className="tabular-nums">
                  {essay.date.replaceAll("-", ".")}
                </time>
              )}
              {essay.date && essay.tags.length > 0 && (
                <span className="text-[var(--border)]" aria-hidden="true">·</span>
              )}
              {essay.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2.5">
                  {essay.tags.map((tag) => (
                    <span key={tag} className="text-[#b5a6b4]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          <div className="leading-relaxed">
            <MDXContent source={essay.content} />
          </div>
        </article>
      </div>

      <nav className="mt-12 pt-8 border-t border-[var(--border)]/30 flex justify-between gap-6 text-sm">
        {prev ? (
          <Link
            prefetch={false}
            href={`/essays/${prev.slug}`}
            className="text-[var(--muted)] hover:text-[#d9b8c4] transition-colors"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            prefetch={false}
            href={`/essays/${next.slug}`}
            className="text-[var(--muted)] hover:text-[#d9b8c4] transition-colors text-right"
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
