import { getAllMurmurs } from "@/lib/murmurs";
import MurmurCard from "@/components/MurmurCard";

export default function MurmursPage() {
  const murmurs = getAllMurmurs();

  return (
    <div className="max-w-2xl mx-auto px-6 pt-20 pb-10">
      <div className="mb-12 animate-float-up">
        <h1 className="text-3xl font-light tracking-wider text-[var(--foreground)]">
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
        <div className="rounded-xl border border-[var(--border)]/30 bg-[var(--card)]/20 backdrop-blur-sm p-4">
          {murmurs.map((murmur, i) => (
            <div
              key={i}
              className="animate-float-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <MurmurCard murmur={murmur} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
