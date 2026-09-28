import type { Metadata } from "next";
import { getAllMurmurs } from "@/lib/murmurs";
import MurmurCard from "@/components/MurmurCard";

export const metadata: Metadata = {
  title: "碎碎念",
  description: "一些转瞬即逝的想法，趁它们还没溜走",
  alternates: { canonical: "/murmurs" },
};

export default function MurmursPage() {
  const murmurs = getAllMurmurs();

  /* 按月份分组（datetime 形如 "2026-09-28 16:40:59"，已按时间倒序） */
  const groups: { month: string; label: string; items: typeof murmurs }[] = [];
  for (const m of murmurs) {
    const month = m.datetime.slice(0, 7); // YYYY-MM
    const last = groups[groups.length - 1];
    if (last && last.month === month) {
      last.items.push(m);
    } else {
      const [y, mo] = month.split("-");
      groups.push({
        month,
        label: `${y} 年 ${parseInt(mo, 10)} 月`,
        items: [m],
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-20 pb-10">
      <div className="mb-12 animate-float-up">
        <h1 className="font-serif text-3xl font-light tracking-wider text-[var(--foreground)]">
          碎碎念
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)] tracking-wide">
          一些转瞬即逝的想法，趁它们还没溜走 💭
        </p>
      </div>

      {murmurs.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-4xl">🫧</span>
          <p className="mt-4 text-sm text-[var(--muted)] tracking-wide">
            还没有碎碎念，先随便写点什么吧。
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((g, gi) => (
            <section key={g.month} className="animate-float-up" style={{ animationDelay: `${gi * 80}ms` }}>
              {/* 月份标题 */}
              <div className="flex items-center gap-3 mb-3 px-1">
                <span className="w-1 h-3.5 rounded-full bg-[var(--primary)]/50 inline-block" />
                <h2 className="text-sm font-light tracking-widest text-[var(--muted)]">
                  {g.label}
                </h2>
                <span className="flex-1 h-px bg-[var(--border)]/25" />
                <span className="text-xs text-[var(--muted)]/50">{g.items.length} 条</span>
              </div>
              {/* 该月的碎碎念 */}
              <div className="rounded-xl border border-[var(--border)]/30 bg-[var(--card)]/20 backdrop-blur-sm p-4">
                {g.items.map((murmur, i) => (
                  <div
                    key={i}
                    className="animate-float-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <MurmurCard murmur={murmur} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
