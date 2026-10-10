import Link from "next/link";
import type { EssayMeta } from "@/lib/essays";

export default function EssayCard({ essay }: { essay: EssayMeta }) {
  return (
    <Link prefetch={false} href={`/essays/${essay.slug}`} className="essay-entry">
      <article>
        <div className="essay-entry-heading">
          <h3>{essay.title}</h3>
          {essay.date && <time dateTime={essay.date}>{essay.date.replaceAll("-", ".")}</time>}
        </div>
        {essay.description && <p className="essay-entry-description">{essay.description}</p>}
        {essay.tags.length > 0 && (
          <div className="essay-entry-tags">
            {essay.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        )}
      </article>
    </Link>
  );
}
