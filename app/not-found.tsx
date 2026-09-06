import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "页面不存在",
};

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-28 text-center">
      {/* 大水滴 404 */}
      <div className="relative inline-block mb-8 animate-float-up">
        <svg
          width="120"
          height="140"
          viewBox="0 0 120 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M60 6 C60 6 14 62 14 92 a46 46 0 0 0 92 0 C106 62 60 6 60 6Z"
            fill="url(#drop-404)"
            stroke="var(--primary)"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="drop-404" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-light tracking-widest text-[var(--foreground)]">
          404
        </span>
      </div>

      <h1 className="text-2xl font-light tracking-wider text-[var(--foreground)] mb-3 animate-float-up" style={{ animationDelay: "80ms" }}>
        这滴雨落到了没有路的地方
      </h1>
      <p className="text-sm text-[var(--muted)] tracking-wide mb-10 animate-float-up" style={{ animationDelay: "160ms" }}>
        你要找的页面不存在，或者已经被风吹走了。
      </p>

      <div className="flex justify-center gap-4 animate-float-up" style={{ animationDelay: "240ms" }}>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--primary)]/12 text-sm text-[var(--foreground)]/85 hover:text-[var(--foreground)] hover:bg-[var(--primary)]/22 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(74,158,255,0.2)] transition-all duration-300 ease-out border border-[var(--primary)]/15"
        >
          回到首页
        </a>
        <a
          href="/essays"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-all duration-300 ease-out border border-[var(--border)]/40 hover:border-[var(--primary)]/30"
        >
          去看看随笔
        </a>
      </div>

      <p className="mt-14 text-xs text-[var(--muted)]/60 tracking-wider font-serif italic animate-float-up" style={{ animationDelay: "320ms" }}>
        相寻梦里路，飞雨落花中
      </p>
    </div>
  );
}
