import type { Metadata } from "next";
import { getAllEssays } from "@/lib/essays";
import EssayCard from "@/components/EssayCard";

export const metadata: Metadata = {
  title: "随笔",
  description: "一些随手写下的文字",
  alternates: { canonical: "/essays" },
};

export default function EssaysPage() {
  const essays = getAllEssays();

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 pt-14 sm:pt-20 pb-10">
      <header className="page-header animate-float-up">
        <div className="page-title-row">
          <span className="page-title-dot" aria-hidden="true" />
          <h1 className="page-title">随笔</h1>
        </div>
        <p className="page-subtitle">
          一些随手写下的文字
        </p>
      </header>

      {essays.length === 0 ? (
        <p className="text-center text-[var(--muted)] py-20 text-sm tracking-wide">
          还没有文章，过些日子再来吧。
        </p>
      ) : (
        <div
          className="night-panel px-6 sm:px-8 py-2 [&>a:last-child]:border-b-0 animate-float-up"
          style={{ animationDelay: "60ms" }}
        >
          {essays.map((essay) => (
            <EssayCard key={essay.slug} essay={essay} />
          ))}
        </div>
      )}
    </div>
  );
}
