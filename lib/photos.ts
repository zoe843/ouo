export interface PhotoItem {
  url: string;
  title: string;
  date: string;
  tags: string[];
}

import photosData from "@/content/photos/photos.json";

export function getAllPhotos(): PhotoItem[] {
  return (photosData as PhotoItem[]).sort((a, b) =>
    b.date > a.date ? 1 : -1
  );
}

export function getRecentPhotos(count: number = 6): PhotoItem[] {
  return getAllPhotos().slice(0, count);
}
