import { getRecentMurmurs } from "@/lib/murmurs";
import MurmurCard from "./MurmurCard";

export default function MurmurSidebar() {
  const murmurs = getRecentMurmurs(6);

  if (murmurs.length === 0) return null;

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-sm font-light tracking-wider text-[var(--foreground)]/80">
          碎碎念
        </h2>
        <a
          href="/murmurs"
          className="text-[11px] text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
        >
          查看全部 →
        </a>
      </div>

      {/* 列表 */}
      <div className="rounded-lg bg-[var(--card)]/30 border border-[var(--border)]/20 backdrop-blur-sm">
        {murmurs.map((m, i) => (
          <div
            key={i}
            className="animate-float-up px-3"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <MurmurCard murmur={m} />
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <p className="mt-3 text-[10px] text-[var(--muted)]/40 text-center tracking-wide">
        编辑 content/murmurs.json 添加碎碎念
      </p>
    </aside>
  );
}
