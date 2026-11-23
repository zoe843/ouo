import type { Metadata } from "next";
import { getAllSeries } from "@/lib/photos";
import PhotoGallery from "@/components/PhotoGallery";

export const metadata: Metadata = {
  title: "照片",
  description: "用镜头记录下一些瞬间",
  alternates: { canonical: "/photos" },
};

export default function PhotosPage() {
  const series = getAllSeries();

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-6 pt-14 sm:pt-20 pb-10">
      <header className="page-header animate-float-up">
        <div className="page-title-row">
          <span className="page-title-dot" aria-hidden="true" />
          <h1 className="page-title">照片</h1>
        </div>
        <p className="page-subtitle">
          用镜头记录下一些瞬间
        </p>
      </header>

      <PhotoGallery series={series} />
    </div>
  );
}
