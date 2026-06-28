import type { Murmur } from "@/lib/murmurs";

export default function MurmurCard({ murmur }: { murmur: Murmur }) {
  return (
    <article className="group relative py-3 px-1 border-b border-[var(--border)]/20 last:border-b-0 transition-all duration-300 hover:pl-2">
      <div className="flex gap-3">
        {/* emoji */}
        <span className="text-lg flex-shrink-0 mt-0.5 select-none">{murmur.emoji}</span>
        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[var(--foreground)]/85 leading-relaxed">
            {murmur.body}
          </p>
          <time className="text-[11px] text-[var(--muted)]/50 mt-1 block">
            {murmur.datetime}
          </time>
        </div>
      </div>
    </article>
  );
}
