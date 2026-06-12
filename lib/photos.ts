export interface PhotoItem {
  url: string;
  title: string;
  date: string;
  tags: string[];
}

import photosData from "@/content/photos/photos.json";
import { BASE_PATH } from "@/lib/constants";

export function getAllPhotos(): PhotoItem[] {
  return (photosData as PhotoItem[]).sort((a, b) =>
    b.date > a.date ? 1 : -1
  ).map(p => ({
    ...p,
    url: BASE_PATH + p.url,
  }));
}

export function getRecentPhotos(count: number = 6): PhotoItem[] {
  return getAllPhotos().slice(0, count);
}
