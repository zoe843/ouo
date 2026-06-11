import { getAllEssays } from "@/lib/essays";
import EssayCard from "@/components/EssayCard";

export default function EssaysPage() {
  const essays = getAllEssays();

  return (
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-10">
      <div className="mb-12 animate-float-up">
        <h1 className="text-3xl font-light tracking-wider text-[var(--foreground)]">
          随笔
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)] tracking-wide">
          一些随手写下的文字
        </p>
      </div>

      {essays.length === 0 ? (
        <p className="text-center text-[var(--muted)] py-20 text-sm tracking-wide">
          还没有文章，过些日子再来吧。
        </p>
      ) : (
        <div className="space-y-6">
          {essays.map((essay, i) => (
            <div
              key={essay.slug}
              className="animate-float-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <EssayCard essay={essay} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
