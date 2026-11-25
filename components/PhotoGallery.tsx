"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { PhotoSeries } from "@/lib/photos";

const SERIES_PER_PAGE = 3;

export default function PhotoGallery({ series }: { series: PhotoSeries[] }) {
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [selected, setSelected] = useState<{
    seriesIdx: number;
    photoIdx: number;
  } | null>(null);
  const [page, setPage] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // 排序后
  const sorted =
    sort === "desc" ? series : [...series].reverse();

  // 分页
  const totalPages = Math.max(1, Math.ceil(sorted.length / SERIES_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const pageSeries = sorted.slice(
    safePage * SERIES_PER_PAGE,
    (safePage + 1) * SERIES_PER_PAGE
  );
  const totalPhotos = sorted.reduce((s, x) => s + x.photos.length, 0);

  // lightbox nav
  const flatPhotos = sorted.flatMap((s, si) =>
    s.photos.map((p, pi) => ({
      photo: p,
      seriesIdx: si,
      photoIdx: pi,
    }))
  );

  const open = (seriesIdx: number, photoIdx: number) =>
    setSelected({ seriesIdx, photoIdx });
  const close = () => setSelected(null);

  const goNext = useCallback(() => {
    if (selected === null) return;
    const flatIdx = flatPhotos.findIndex(
      (f) =>
        f.seriesIdx === selected.seriesIdx &&
        f.photoIdx === selected.photoIdx
    );
    const next = (flatIdx + 1) % flatPhotos.length;
    setSelected({
      seriesIdx: flatPhotos[next].seriesIdx,
      photoIdx: flatPhotos[next].photoIdx,
    });
  }, [selected, flatPhotos]);

  const goPrev = useCallback(() => {
    if (selected === null) return;
    const flatIdx = flatPhotos.findIndex(
      (f) =>
        f.seriesIdx === selected.seriesIdx &&
        f.photoIdx === selected.photoIdx
    );
    const prev =
      (flatIdx - 1 + flatPhotos.length) % flatPhotos.length;
    setSelected({
      seriesIdx: flatPhotos[prev].seriesIdx,
      photoIdx: flatPhotos[prev].photoIdx,
    });
  }, [selected, flatPhotos]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (selected === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [selected, goNext, goPrev]);

  // 灯箱打开时锁定背景滚动，关闭时恢复
  useEffect(() => {
    if (selected === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selected]);

  // 预加载当前照片相邻的原图，翻到下一张时秒开
  useEffect(() => {
    if (selected === null) return;
    const flatIdx = flatPhotos.findIndex(
      (f) =>
        f.seriesIdx === selected.seriesIdx &&
        f.photoIdx === selected.photoIdx
    );
    if (flatIdx < 0) return;
    for (const offset of [1, flatPhotos.length - 1]) {
      const neighbor = flatPhotos[(flatIdx + offset) % flatPhotos.length];
      if (neighbor) {
        const img = new Image();
        img.src = neighbor.photo.url;
      }
    }
  }, [selected, flatPhotos]);

  // 移动端左右滑动翻图
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || selected === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  return (
    <>
      {/* ——— 排序切换 ——— */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-xs text-[var(--muted)] tracking-wide">排序</span>
        <button
          onClick={() => { setSort("desc"); setPage(0); }}
          className={`px-3 py-1 rounded-full text-xs tracking-wide border transition-all duration-300 ${
            sort === "desc"
              ? "bg-[#9c4e46]/12 border-[#9c4e46]/35 text-[#823d36]"
              : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          最新在前
        </button>
        <button
          onClick={() => { setSort("asc"); setPage(0); }}
          className={`px-3 py-1 rounded-full text-xs tracking-wide border transition-all duration-300 ${
            sort === "asc"
              ? "bg-[#9c4e46]/12 border-[#9c4e46]/35 text-[#823d36]"
              : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          最早在前
        </button>
        <span className="text-xs text-[var(--muted)]/70 ml-auto tabular-nums">
          {sorted.length} 组 · {totalPhotos} 张
        </span>
      </div>

      {/* ——— 系列列表 ——— */}
      <div className="space-y-16">
        {pageSeries.map((s) => (
          <section key={s.key} className="animate-float-up">
            {/* 标题 — 居左 */}
            <h2 className="font-serif text-xl font-light tracking-wider text-[var(--foreground)] mb-1">
              {s.title}
            </h2>
            {/* 日期 */}
            <time className="text-xs text-[var(--muted)]/75 tracking-wide tabular-nums">
              {s.date.replaceAll("-", ".")}
              {s.tags.length > 0 && (
                <span className="ml-3 inline-flex gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-[#f0e9dc] border border-[#dfd6c7] text-[#6d6357] text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                </span>
              )}
            </time>

            {/* 照片网格 */}
            <div
              className={
                s.photos.length === 1
                  ? "grid grid-cols-1 max-w-md mt-4"
                  : "grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4"
              }
            >
              {s.photos.map((photo, pi) => {
                const realSi = sorted.indexOf(s);
                return (
                  <button
                    key={pi}
                    onClick={() => open(realSi, pi)}
                    className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-[#ece5d8] border border-[#dfd6c7] card-glow transition-all duration-500 ease-out hover:-translate-y-1"
                  >
                    <img
                      src={photo.thumb ?? photo.url}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-3">
                      <span className="photo-caption text-white text-xs tracking-wide font-light translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        {photo.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* ——— 分页 ——— */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16">
          <button
            onClick={() => setPage(Math.max(0, safePage - 1))}
            disabled={safePage === 0}
            className="px-3 py-1.5 text-xs rounded-full border border-[#dcd3c4] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#9c4e46]/45 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            ← 上一页
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 text-xs rounded-full transition-all duration-300 ${
                i === safePage
                  ? "bg-[#9c4e46]/12 border border-[#9c4e46]/35 text-[#823d36]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))}
            disabled={safePage === totalPages - 1}
            className="px-3 py-1.5 text-xs rounded-full border border-[#dcd3c4] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#9c4e46]/45 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            下一页 →
          </button>
        </div>
      )}

      {/* ——— Lightbox ——— */}
      {selected !== null && (() => {
        const cur = flatPhotos.find(
          (f) =>
            f.seriesIdx === selected.seriesIdx &&
            f.photoIdx === selected.photoIdx
        );
        const curIdx = cur ? flatPhotos.indexOf(cur) : 0;
        return (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={cur?.photo.title ?? "照片大图"}
            className="fixed inset-0 z-[100] bg-[#161411]/92 backdrop-blur-sm flex items-center justify-center"
            onClick={close}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button
              onClick={close}
              aria-label="关闭大图"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-[#221e1a]/80 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white/85 hover:text-white hover:bg-[#2f2924] text-lg font-light transition-colors z-10"
            >
              ✕
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="上一张"
              className="absolute left-3 sm:left-5 w-10 h-10 rounded-full bg-[#221e1a]/80 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white/85 hover:text-white hover:bg-[#2f2924] text-2xl leading-none font-light transition-colors z-10"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="下一张"
              className="absolute right-3 sm:right-5 w-10 h-10 rounded-full bg-[#221e1a]/80 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white/85 hover:text-white hover:bg-[#2f2924] text-2xl leading-none font-light transition-colors z-10"
            >
              ›
            </button>

            <div
              className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={cur?.photo.url ?? ""}
                alt={cur?.photo.title ?? ""}
                decoding="async"
                className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl"
              />
              <div className="flex flex-col items-center gap-1">
                <p className="text-white/85 text-sm font-light tracking-wide text-center px-4">
                  {cur?.photo.title}
                  {cur?.photo.date && (
                    <span className="text-white/50 ml-2 tabular-nums">
                      {cur.photo.date.replaceAll("-", ".")}
                    </span>
                  )}
                  <span className="text-white/50 ml-2 tabular-nums">
                    {curIdx + 1} / {flatPhotos.length}
                  </span>
                </p>
                {cur?.photo.exif && (
                  <p className="text-white/45 text-xs tracking-wider tabular-nums">
                    {cur.photo.exif}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
