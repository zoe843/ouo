import React from "react";
import { getRecentEssays } from "@/lib/essays";
import { getRecentPhotos } from "@/lib/photos";
import EssayCard from "@/components/EssayCard";
import MurmurSidebar from "@/components/MurmurSidebar";

/* ——— 雨滴装饰 SVG ——— */
const RainDrops = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-30"
    viewBox="0 0 1200 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* 雨丝 — 细长水滴 */}
    {[
      { x: 180, y: 40, d: 0.6 },
      { x: 620, y: 60, d: 0.3 },
      { x: 980, y: 30, d: 0.5 },
      { x: 100, y: 280, d: 0.4 },
      { x: 1080, y: 350, d: 0.35 },
    ].map((drop, i) => (
      <g key={`drop-${i}`} opacity={drop.d}>
        <path
          d="M0 0 C4 8 4 14 2 16 C0 18 -2 16 -2 16 C-2 16 -4 14 -4 8 C-4 4 0 0 0 0Z"
          fill="url(#drop-grad)"
          transform={`translate(${drop.x}, ${drop.y}) scale(2, 3)`}
        />
      </g>
    ))}
    {/* 散布的小圆点 */}
    {[
      { cx: 300, cy: 120, r: 1.2, o: 0.3 },
      { cx: 750, cy: 200, r: 1.5, o: 0.25 },
      { cx: 520, cy: 80, r: 1, o: 0.2 },
      { cx: 880, cy: 420, r: 1.3, o: 0.2 },
      { cx: 140, cy: 380, r: 1, o: 0.25 },
      { cx: 1050, cy: 160, r: 1.4, o: 0.2 },
      { cx: 430, cy: 450, r: 1.1, o: 0.15 },
    ].map((d, i) => (
      <circle
        key={`dot-${i}`}
        cx={d.cx}
        cy={d.cy}
        r={d.r}
        fill="var(--primary)"
        opacity={d.o}
      />
    ))}
    {/* 渐变定义 */}
    <defs>
      <linearGradient id="drop-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
      </linearGradient>
    </defs>
  </svg>
);

export default function HomePage() {
  const recentEssays = getRecentEssays(3);
  const recentPhotos = getRecentPhotos(6);

  return (
    <div className="flex gap-8 max-w-6xl mx-auto px-6">
      {/* 主内容 */}
      <div className="flex-1 min-w-0 pt-16 pb-16">
        {/* Hero */}
        <section className="relative py-16 md:py-24 text-center animate-float-up overflow-hidden">
          {/* 背景光晕 — 增强 */}
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[320px] rounded-full bg-[var(--primary)]/[0.04] blur-[120px]" />
            <div className="absolute top-1/2 left-0 w-40 h-40 rounded-full bg-[var(--accent)]/5 blur-[60px]" />
            <div className="absolute top-1/4 right-0 w-52 h-52 rounded-full bg-[var(--primary)]/4 blur-[80px]" />
          </div>

          {/* 雨丝 SVG 装饰 */}
          <RainDrops />

          {/* 标题 */}
          <div className="relative">
            <p className="text-xs tracking-[0.3em] text-[var(--muted)]/70 font-light mb-4 uppercase">
              ✦ 飞雨落花中 ✦
            </p>
            <h1
              className="text-5xl md:text-7xl font-light tracking-[0.25em] text-gradient leading-tight"
              style={{
                textShadow:
                  "0 0 80px rgba(74,158,255,0.25), 0 0 160px rgba(74,158,255,0.1)",
              }}
            >
              雨落花庭
            </h1>
            <p className="mt-6 text-sm md:text-base text-[var(--muted)] font-light tracking-wider leading-relaxed max-w-sm mx-auto">
              {/* subtitle removed */}
            </p>
          </div>

          {/* CTA */}
          <div className="relative mt-12 flex justify-center gap-5">
            <a
              href="/essays"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[var(--primary)]/12 text-sm text-[var(--foreground)]/85 hover:text-[var(--foreground)] hover:bg-[var(--primary)]/22 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(74,158,255,0.2)] transition-all duration-300 ease-out border border-[var(--primary)]/15"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              看看随笔
            </a>
            <a
              href="/photos"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[var(--primary)]/12 text-sm text-[var(--foreground)]/85 hover:text-[var(--foreground)] hover:bg-[var(--primary)]/22 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(74,158,255,0.2)] transition-all duration-300 ease-out border border-[var(--primary)]/15"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              翻翻照片
            </a>
          </div>
        </section>

        {/* Latest Essays */}
        {recentEssays.length > 0 && (
          <section className="mb-16 animate-float-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-4 rounded-full bg-[var(--primary)]/60 inline-block" />
              <h2 className="text-lg font-light tracking-wider text-[var(--foreground)]">
                最近随笔
              </h2>
              <span className="flex-1 h-px bg-[var(--border)]/30 ml-2" />
              <a
                href="/essays"
                className="text-xs text-[var(--muted)] hover:text-[var(--primary)] transition-colors border-b border-dashed border-[var(--muted)]/30 hover:border-[var(--primary)]/40"
              >
                查看全部 →
              </a>
            </div>
            <div className="space-y-4">
              {recentEssays.map((essay) => (
                <EssayCard key={essay.slug} essay={essay} />
              ))}
            </div>
          </section>
        )}

        {/* 装饰分隔 */}
        <div className="flex items-center gap-4 mb-16 animate-float-up" style={{ animationDelay: "150ms" }} aria-hidden="true">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)]/40 to-transparent" />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary)" opacity="0.3">
            <path d="M12 2l2.3 6.3 6.7.5-5.1 4.4 1.6 6.5L12 16.1l-5.5 3.6 1.6-6.5-5.1-4.4 6.7-.5z" />
          </svg>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)]/40 to-transparent" />
        </div>

        {/* Latest Photos */}
        {recentPhotos.length > 0 && (
          <section className="mb-16 animate-float-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-4 rounded-full bg-[var(--primary)]/60 inline-block" />
              <h2 className="text-lg font-light tracking-wider text-[var(--foreground)]">
                最近照片
              </h2>
              <span className="flex-1 h-px bg-[var(--border)]/30 ml-2" />
              <a
                href="/photos"
                className="text-xs text-[var(--muted)] hover:text-[var(--primary)] transition-colors border-b border-dashed border-[var(--muted)]/30 hover:border-[var(--primary)]/40"
              >
                查看更多 →
              </a>
            </div>
            {/* 杂志式网格：第一张横跨两列 + 余下四宫格，共两行 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {/* 首张 — 跨 2 列 */}
              {recentPhotos[0] && (
                <a
                  key={0}
                  href="/photos"
                  className="relative col-span-2 aspect-[4/3] rounded-lg overflow-hidden bg-[var(--card)] border border-[var(--border)]/30 hover:-translate-y-1 transition-all duration-500 ease-out card-glow group"
                >
                  <img
                    src={recentPhotos[0].url}
                    alt={recentPhotos[0].title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent flex items-end p-4">
                    <span className="text-white text-sm tracking-wide font-light translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                      {recentPhotos[0].title}
                    </span>
                  </div>
                </a>
              )}
              {/* 其余 — 2×2 四宫格 */}
              {recentPhotos.slice(1, 5).map((photo, i) => (
                <a
                  key={i + 1}
                  href="/photos"
                  className="relative aspect-square rounded-lg overflow-hidden bg-[var(--card)] border border-[var(--border)]/30 hover:-translate-y-1 transition-all duration-500 ease-out card-glow group"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent flex items-end p-3">
                    <span className="text-white text-xs tracking-wide font-light translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                      {photo.title}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 碎碎念侧边栏 */}
      <MurmurSidebar />
    </div>
  );
}
