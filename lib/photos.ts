export interface PhotoItem {
  url: string;      // 原图,仅灯箱使用
  thumb?: string;   // 缩略图,网格卡片使用;缺失时回退原图
  title: string;
  date: string;
  tags: string[];
}

import fs from "fs";
import path from "path";
import photosData from "@/content/photos/photos.json";
import { BASE_PATH } from "@/lib/constants";

/* 约定:scripts/make_thumbs.py 生成的缩略图位于 thumbs/<同名>.webp,
   构建时存在即自动启用,json 里无须手写 thumb 字段 */
function autoThumb(url: string): string | undefined {
  const stem = path.basename(url, path.extname(url));
  const thumbFile = path.join(process.cwd(), "public", "images", "photos", "thumbs", `${stem}.webp`);
  return fs.existsSync(thumbFile)
    ? BASE_PATH + `/images/photos/thumbs/${stem}.webp`
    : undefined;
}

export function getAllPhotos(): PhotoItem[] {
  return (photosData as PhotoItem[]).map(p => ({
    ...p,
    url: BASE_PATH + p.url,
    thumb: p.thumb ? BASE_PATH + p.thumb : autoThumb(p.url),
  }));
}

export function getRecentPhotos(count: number = 6): PhotoItem[] {
  return getAllPhotos().slice(0, count);
}

/* 系列：同标题+同日期的照片归为一组 */
export interface PhotoSeries {
  key: string;        // `${title}__${date}`
  title: string;
  date: string;
  photos: PhotoItem[];
  tags: string[];     // 合并去重
}

export function getAllSeries(sort: "asc" | "desc" = "desc"): PhotoSeries[] {
  const all = getAllPhotos();
  const map = new Map<string, PhotoSeries>();

  for (const p of all) {
    const key = `${p.title}__${p.date}`;
    if (!map.has(key)) {
      map.set(key, { key, title: p.title, date: p.date, photos: [], tags: [] });
    }
    const s = map.get(key)!;
    s.photos.push(p);
    for (const t of p.tags) {
      if (!s.tags.includes(t)) s.tags.push(t);
    }
  }

  const series = Array.from(map.values());
  series.sort((a, b) => {
    const cmp = a.date > b.date ? 1 : a.date < b.date ? -1 : 0;
    return sort === "desc" ? -cmp : cmp;
  });
  return series;
}
