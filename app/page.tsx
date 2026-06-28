import React from "react";
import { getRecentEssays } from "@/lib/essays";
import { getRecentPhotos } from "@/lib/photos";
import EssayCard from "@/components/EssayCard";
import MurmurSidebar from "@/components/MurmurSidebar";

export default function HomePage() {
  const recentEssays = getRecentEssays(3);
  const recentPhotos = getRecentPhotos(6);

  return (
    <div className="flex gap-8 max-w-6xl mx-auto px-6">
      {/* 主内容 */}
      <div className="flex-1 min-w-0 pt-24 pb-16">
        {/* Hero */}
        <section className="relative mb-16 text-center animate-float-up overflow-hidden">
          {/* 背景光晕 */}
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[var(--primary)]/5 blur-[80px]" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-[var(--accent)]/4 blur-[60px]" />
          </div>

          <h1 className="relative text-4xl md:text-5xl font-light tracking-widest text-gradient"
            style={{ textShadow: "0 0 60px rgba(74,158,255,0.2)" }}>
            雨落花庭
          </h1>
          <p className="relative mt-4 text-sm md:text-base text-[var(--muted)] font-light tracking-wider leading-relaxed">
            某些安静的时刻 · 一些文字 · 几张照片
          </p>
          <div className="relative mt-10 flex justify-center gap-6">
            <a
              href="/essays"
              className="px-6 py-2.5 rounded-full bg-[var(--primary)]/10 text-sm text-[var(--foreground)]/80 hover:text-[var(--foreground)] hover:bg-[var(--primary)]/20 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(74,158,255,0.15)] transition-all duration-300 ease-out"
            >
              看看随笔
            </a>
            <a
              href="/photos"
              className="px-6 py-2.5 rounded-full bg-[var(--primary)]/10 text-sm text-[var(--foreground)]/80 hover:text-[var(--foreground)] hover:bg-[var(--primary)]/20 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(74,158,255,0.15)] transition-all duration-300 ease-out"
            >
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
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {recentPhotos.map((photo, i) => (
                <a
                  key={i}
                  href="/photos"
                  className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[var(--card)] border border-[var(--border)]/30 hover:-translate-y-1 transition-all duration-500 ease-out card-glow group"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-3">
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
