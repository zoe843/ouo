import type { Metadata } from "next";
import { getAllMurmurs } from "@/lib/murmurs";
import MurmurArchive from "@/components/MurmurArchive";

export const metadata: Metadata = {
  title: "碎碎念",
  description: "一些转瞬即逝的想法，趁它们还没溜走",
  alternates: { canonical: "/murmurs" },
};

export default function MurmursPage() {
  const murmurs = getAllMurmurs();

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-14 sm:pt-20 pb-10">
      <header className="page-header animate-float-up">
        <div className="page-title-row">
          <span className="page-title-dot" aria-hidden="true" />
          <h1 className="page-title">碎碎念</h1>
        </div>
        <p className="page-subtitle">
          一些转瞬即逝的想法，趁它们还没溜走
        </p>
      </header>

      {murmurs.length === 0 ? (
        <div className="night-panel text-center py-20 px-6">
          <span className="text-4xl">🫧</span>
          <p className="mt-4 text-sm text-[var(--muted)] tracking-wide">
            还没有碎碎念，先随便写点什么吧。
          </p>
        </div>
      ) : (
        <MurmurArchive murmurs={murmurs} />
      )}
    </div>
  );
}
