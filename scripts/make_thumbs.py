# -*- coding: utf-8 -*-
"""照片管线:原图 → 展示版 webp + 缩略图。

用法: ~/venv/Scripts/python.exe scripts/make_thumbs.py

加新照片的流程:
  1. 原图(jpg/png/webp 均可)放进 photos-originals/
  2. 跑本脚本
  3. 新照片会自动追加进 content/photos/photos.json,
     title/tags 需要手动补;date 取 EXIF 拍摄时间,没有则用文件修改日期

产出(文件名同原图,勿手改):
  public/images/photos/<名>.webp        展示版,最长边 1600,质量 80(灯箱用)
  public/images/photos/thumbs/<名>.webp 缩略图,最长边 720,质量 70(网格用,
                                        lib/photos.ts 构建时自动探测引用)

已存在且比源图新的产物会跳过;想强制重做就删掉对应产物再跑。
"""
import json
from datetime import datetime
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ORIG_DIR = ROOT / "photos-originals"
PUB_DIR = ROOT / "public" / "images" / "photos"
THUMB_DIR = PUB_DIR / "thumbs"
PHOTOS_JSON = ROOT / "content" / "photos" / "photos.json"
SOURCE_EXT = {".jpg", ".jpeg", ".png", ".webp"}


def convert(src: Path, dst: Path, max_edge: int, quality: int) -> str:
    if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
        return "skip"
    with Image.open(src) as im:
        im = im.convert("RGB") if im.mode not in ("RGB", "RGBA") else im
        w, h = im.size
        scale = max_edge / max(w, h)
        if scale < 1:
            im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        im.save(dst, "WEBP", quality=quality, method=6)
    return "ok"


def shot_date(src: Path) -> str:
    """EXIF 拍摄时间优先,没有则退回文件修改日期。"""
    try:
        with Image.open(src) as im:
            ex = im._getexif() or {}
            raw = ex.get(36867) or ex.get(306)  # DateTimeOriginal / DateTime
        if raw:
            return datetime.strptime(raw[:10], "%Y:%m:%d").strftime("%Y-%m-%d")
    except Exception:
        pass
    return datetime.fromtimestamp(src.stat().st_mtime).strftime("%Y-%m-%d")


def append_new_entries(sources: dict, processed: list) -> None:
    """photos.json 里没有对应 url 的照片自动追加,保持按日期倒序。"""
    entries = json.loads(PHOTOS_JSON.read_text(encoding="utf-8"))
    known = {e["url"] for e in entries}
    added = []
    for stem in processed:
        url = f"/images/photos/{stem}.webp"
        if url in known:
            continue
        entry = {
            "url": url,
            "title": stem,
            "date": shot_date(sources[stem]),
            "tags": [],
        }
        entries.append(entry)
        added.append(entry)
    if not added:
        return
    entries.sort(key=lambda e: e["date"], reverse=True)
    PHOTOS_JSON.write_text(
        json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("\nphotos.json 自动追加了新条目(记得补 title / tags):")
    for e in added:
        print(f"  {e['url']}  date={e['date']}")


def main() -> None:
    THUMB_DIR.mkdir(exist_ok=True)
    # 源 = photos-originals/ 优先,public 里遗留的 jpg/png 兜底(thumbs/ 除外)
    sources: dict[str, Path] = {}
    for d in (ORIG_DIR, PUB_DIR):
        if d.is_dir():
            for p in sorted(d.iterdir()):
                if p.suffix.lower() in SOURCE_EXT and p.is_file():
                    sources.setdefault(p.stem, p)  # 先扫到的(originals)优先
    if not sources:
        print("没有找到照片。把原图放进 photos-originals/ 再跑本脚本。")
        return
    processed: list[str] = []
    for stem, src in sorted(sources.items()):
        r1 = convert(src, PUB_DIR / f"{stem}.webp", 1600, 80)
        r2 = convert(src, THUMB_DIR / f"{stem}.webp", 720, 70)
        s1 = (PUB_DIR / f"{stem}.webp").stat().st_size // 1024
        s2 = (THUMB_DIR / f"{stem}.webp").stat().st_size // 1024
        print(f"{stem}: 展示版[{r1}] {s1}KB  缩略图[{r2}] {s2}KB")
        processed.append(stem)
    if PHOTOS_JSON.exists():
        append_new_entries(sources, processed)


if __name__ == "__main__":
    main()
