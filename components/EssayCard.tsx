import Link from "next/link";
import type { EssayMeta } from "@/lib/essays";

export default function EssayCard({ essay }: { essay: EssayMeta }) {
  return (
    <Link href={`/essays/${essay.slug}`}>
      <article className="group p-6 rounded-xl bg-[var(--card)] border border-[var(--border)]/40 card-glow transition-all duration-500 ease-out hover:-translate-y-1">
        <h3 className="text-lg font-light tracking-wide text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300">
          {essay.title}
        </h3>
        <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted)] font-light">
          {essay.date && <time>{essay.date}</time>}
          {essay.tags.length > 0 && (
            <div className="flex gap-2">
              {essay.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--accent)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {essay.description && (
          <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
            {essay.description}
          </p>
        )}
      </article>
    </Link>
  );
}
