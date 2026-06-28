"use client";

import { useState, useCallback, useEffect } from "react";
import type { PhotoSeries } from "@/lib/photos";

const SERIES_PER_PAGE = 3;

export default function PhotoGallery({ series }: { series: PhotoSeries[] }) {
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [selected, setSelected] = useState<{
    seriesIdx: number;
    photoIdx: number;
  } | null>(null);
  const [page, setPage] = useState(0);

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

  return (
    <>
      {/* ——— 排序切换 ——— */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-xs text-[var(--muted)] tracking-wide">排序</span>
        <button
          onClick={() => { setSort("desc"); setPage(0); }}
          className={`px-3 py-1 rounded-full text-xs tracking-wide transition-all duration-300 ${
            sort === "desc"
              ? "bg-[var(--primary)]/20 text-[var(--primary)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          最新在前
        </button>
        <button
          onClick={() => { setSort("asc"); setPage(0); }}
          className={`px-3 py-1 rounded-full text-xs tracking-wide transition-all duration-300 ${
            sort === "asc"
              ? "bg-[var(--primary)]/20 text-[var(--primary)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          最早在前
        </button>
        <span className="text-xs text-[var(--muted)]/60 ml-auto">
          {sorted.length} 组 · {totalPhotos} 张
        </span>
      </div>

      {/* ——— 系列列表 ——— */}
      <div className="space-y-16">
        {pageSeries.map((s, si) => (
          <section key={s.key} className="animate-float-up">
            {/* 标题 — 居左 */}
            <h2 className="text-xl font-light tracking-wider text-[var(--foreground)] mb-1">
              {s.title}
            </h2>
            {/* 日期 */}
            <time className="text-xs text-[var(--muted)]/70 tracking-wide">
              {s.date}
              {s.tags.length > 0 && (
                <span className="ml-3 inline-flex gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-[var(--primary)]/8 text-[var(--accent)] text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                </span>
              )}
            </time>

            {/* 照片网格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4">
              {s.photos.map((photo, pi) => {
                const realSi = sorted.indexOf(s);
                return (
                  <button
                    key={pi}
                    onClick={() => open(realSi, pi)}
                    className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-[var(--card)] border border-[var(--border)]/30 card-glow transition-all duration-500 ease-out hover:-translate-y-1"
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
            className="px-3 py-1.5 text-xs rounded-full border border-[var(--border)]/30 text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--primary)]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            ← 上一页
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 text-xs rounded-full transition-all duration-300 ${
                i === safePage
                  ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))}
            disabled={safePage === totalPages - 1}
            className="px-3 py-1.5 text-xs rounded-full border border-[var(--border)]/30 text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--primary)]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            下一页 →
          </button>
        </div>
      )}

      {/* ——— Lightbox ——— */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl font-light transition-colors z-10"
          >
            ✕
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 text-white/60 hover:text-white text-3xl font-light transition-colors"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 text-white/60 hover:text-white text-3xl font-light transition-colors"
          >
            ›
          </button>

          <div
            className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={flatPhotos.find(
                (f) =>
                  f.seriesIdx === selected.seriesIdx &&
                  f.photoIdx === selected.photoIdx
              )?.photo.url ?? ""}
              alt=""
              className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl"
            />
            {(() => {
              const cur = flatPhotos.find(
                (f) =>
                  f.seriesIdx === selected.seriesIdx &&
                  f.photoIdx === selected.photoIdx
              );
              const curIdx = flatPhotos.indexOf(cur!);
              return (
                <p className="text-white/80 text-sm font-light tracking-wide">
                  {cur?.photo.title}
                  <span className="text-white/40 ml-2">{cur?.photo.date}</span>
                  <span className="text-white/40 ml-2">
                    {curIdx + 1} / {flatPhotos.length}
                  </span>
                </p>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}
