import type { EssayMeta } from "@/lib/essays";

export default function EssayCard({ essay }: { essay: EssayMeta }) {
  return (
    <a href={`/essays/${essay.slug}`}>
      <article className="group relative p-6 rounded-xl border border-[var(--border)]/40 card-glow transition-all duration-500 ease-out hover:-translate-y-1 overflow-hidden">
        {/* 背景图层 */}
        <div className="absolute inset-0 bg-[url('/images/essay-bg.webp')] bg-cover bg-center opacity-45 group-hover:opacity-55 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-[var(--card)]/30" />

        {/* 左侧装饰线 */}
        <span className="absolute left-0 top-3 bottom-3 w-[2px] rounded-r-full bg-[var(--border)]/50 transition-all duration-300 ease-out group-hover:w-[3px] group-hover:bg-[var(--primary)]/60 z-[1]" />

        {/* 内容 */}
        <div className="relative z-[1] pl-4">
          {/* 标题 + 日期 */}
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lg font-light tracking-wide text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300">
              {essay.title}
            </h3>
            {essay.date && (
              <time className="shrink-0 text-xs text-[var(--muted)] font-light tabular-nums">
                {essay.date}
              </time>
            )}
          </div>

          {/* 描述 */}
          {essay.description && (
            <p className="mt-2 text-[15px] text-[var(--muted)] leading-relaxed line-clamp-2">
              {essay.description}
            </p>
          )}

          {/* 标签 */}
          {essay.tags.length > 0 && (
            <div className="flex gap-2 mt-3">
              {essay.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--accent)] text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </a>
  );
}
