import type { Murmur } from "@/lib/murmurs";

function formatMurmurTime(datetime: string): string {
  const datePart = datetime.slice(0, 10).replaceAll("-", ".");
  const timePart = datetime.slice(11, 16);
  return timePart ? `${datePart} · ${timePart}` : datePart;
}

export default function MurmurCard({ murmur }: { murmur: Murmur }) {
  return (
    <article className="group relative py-4 px-2 border-b border-[#e6decf] last:border-b-0 transition-colors duration-200 hover:bg-[#f2ece0]/65 rounded-md">
      <div className="flex gap-3.5 items-start">
        <span className="text-lg flex-shrink-0 mt-0.5 select-none">{murmur.emoji}</span>
        <div className="flex-1 min-w-0">
          {murmur.title && (
            <h3 className="font-serif text-[15px] text-[#2a2621] mb-1">{murmur.title}</h3>
          )}
          <p className="text-sm text-[#3f3932] leading-[1.85] whitespace-pre-line break-words">
            {murmur.body}
          </p>
          <time
            dateTime={murmur.datetime.replace(" ", "T")}
            className="text-xs text-[var(--muted)]/75 mt-1.5 block tabular-nums tracking-wide"
          >
            {formatMurmurTime(murmur.datetime)}
          </time>
        </div>
      </div>
    </article>
  );
}

