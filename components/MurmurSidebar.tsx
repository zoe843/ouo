import { getAllMurmurs } from "@/lib/murmurs";
import MurmurCard from "./MurmurCard";

export default function MurmurSidebar() {
  const murmurs = getAllMurmurs();

  if (murmurs.length === 0) return null;

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
      {/* 标题 */}
      <div className="mb-4 px-1">
        <h2 className="text-sm font-light tracking-wider text-[var(--foreground)]/80">
          碎碎念
        </h2>
      </div>

      {/* 全部列表 */}
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
    </aside>
  );
}
