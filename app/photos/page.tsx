import { getAllPhotos } from "@/lib/photos";
import PhotoGallery from "@/components/PhotoGallery";

export default function PhotosPage() {
  const photos = getAllPhotos();

  return (
    <div className="max-w-4xl mx-auto px-6 pt-20 pb-10">
      <div className="mb-12 animate-float-up">
        <div className="flex items-center gap-3">
          <span className="w-1 h-6 rounded-full bg-[var(--primary)]/60 inline-block" />
          <h1 className="text-3xl font-light tracking-wider text-[var(--foreground)]">
            照片
          </h1>
        </div>
        <p className="mt-3 pl-5 text-sm text-[var(--muted)] tracking-wide">
          用镜头记录下一些瞬间
        </p>
      </div>

      <PhotoGallery photos={photos} />
    </div>
  );
}
