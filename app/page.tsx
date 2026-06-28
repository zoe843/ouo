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
        <section className="text-center animate-float-up mb-16">
          <h1 className="text-3xl md:text-4xl font-light tracking-widest text-[var(--foreground)]">
            雨落花庭
          </h1>
          <div className="mt-8 flex justify-center gap-6">
            <a
              href="/essays"
              className="px-6 py-2 rounded-full border border-[var(--border)] text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-all duration-300"
            >
              看看随笔
            </a>
            <a
              href="/photos"
              className="px-6 py-2 rounded-full border border-[var(--border)] text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-all duration-300"
            >
              翻翻照片
            </a>
          </div>
        </section>

      {/* Latest Essays */}
      {recentEssays.length > 0 && (
        <section className="mb-16 animate-float-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light tracking-wider text-[var(--foreground)]">
              最近随笔
            </h2>
            <a
              href="/essays"
              className="text-xs text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light tracking-wider text-[var(--foreground)]">
              最近照片
            </h2>
            <a
              href="/photos"
              className="text-xs text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
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
