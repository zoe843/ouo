import type { Murmur } from "@/lib/murmurs";

export default function MurmurCard({ murmur }: { murmur: Murmur }) {
  // 生成一个基于 body 内容的摘要作为标题（取前几个字）
  const summary = murmur.body.slice(0, 12) + (murmur.body.length > 12 ? "..." : "");

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
          <div className="flex items-center gap-2 mt-1">
            <time className="text-[11px] text-[var(--muted)]/50">
              {formatRelativeTime(murmur.datetime)}
            </time>
            <span className="text-[11px] text-[var(--muted)]/40">·</span>
            <span className="text-[11px] text-[var(--muted)]/40 truncate">{summary}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

/** 将 ISO datetime 转为友好相对时间 */
function formatRelativeTime(datetime: string): string {
  const now = new Date();
  const d = new Date(datetime);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "刚刚";
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 7) return `${diffDay}天前`;

  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}月${day}日`;
}
