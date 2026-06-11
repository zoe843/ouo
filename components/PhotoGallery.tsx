"use client";

import { useState, useCallback, useEffect } from "react";
import type { PhotoItem } from "@/lib/photos";

export default function PhotoGallery({ photos }: { photos: PhotoItem[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  const open = (idx: number) => setSelected(idx);
  const close = () => setSelected(null);

  const goNext = useCallback(() => {
    if (selected === null) return;
    setSelected((selected + 1) % photos.length);
  }, [selected, photos.length]);

  const goPrev = useCallback(() => {
    if (selected === null) return;
    setSelected((selected - 1 + photos.length) % photos.length);
  }, [selected, photos.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selected === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, goNext, goPrev]);

  const getTags = () => {
    const all = new Set<string>();
    photos.forEach((p) => p.tags.forEach((t) => all.add(t)));
    return Array.from(all);
  };

  const [activeTag, setActiveTag] = useState<string | null>(null);
  const filtered = activeTag
    ? photos.filter((p) => p.tags.includes(activeTag))
    : photos;

  return (
    <>
      {/* Tag filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-3 py-1 rounded-full text-xs tracking-wide transition-all duration-300 ${
            activeTag === null
              ? "bg-[var(--primary)]/20 text-[var(--primary)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          全部
        </button>
        {getTags().map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1 rounded-full text-xs tracking-wide transition-all duration-300 ${
              activeTag === tag
                ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {filtered.map((photo, idx) => {
          // Find original index for lightbox
          const origIdx = photos.indexOf(photo);
          return (
            <button
              key={origIdx}
              onClick={() => open(origIdx)}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-[var(--card)] border border-[var(--border)]/30 card-glow transition-all duration-500 ease-out hover:-translate-y-1"
            >
              <img
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-white text-xs tracking-wide font-light">
                  {photo.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[var(--muted)] py-20 text-sm">
          这个分类下还没有照片。
        </p>
      )}

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
          onClick={close}
        >
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl font-light transition-colors z-10"
            aria-label="关闭"
          >
            ✕
          </button>

          {/* Prev / Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 text-white/60 hover:text-white text-3xl font-light transition-colors"
            aria-label="上一张"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 text-white/60 hover:text-white text-3xl font-light transition-colors"
            aria-label="下一张"
          >
            ›
          </button>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[selected].url}
              alt={photos[selected].title}
              className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl"
            />
            <p className="text-white/80 text-sm font-light tracking-wide">
              {photos[selected].title}
              <span className="text-white/40 ml-2">
                {photos[selected].date}
              </span>
              <span className="text-white/40 ml-2">
                {selected + 1} / {photos.length}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
