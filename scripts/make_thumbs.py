# -*- coding: utf-8 -*-
"""照片管线:原图 → 展示版 webp + 缩略图。

用法: ~/venv/Scripts/python.exe scripts/make_thumbs.py

加新照片的流程:
  1. 原图(jpg/png/webp 均可)放进 photos-originals/
  2. 跑本脚本
  3. 编辑 content/photos/photos.json 加一条(只有这一步是手工的)

产出(文件名同原图,勿手改):
  public/images/photos/<名>.webp        展示版,最长边 1600,质量 80(灯箱用)
  public/images/photos/thumbs/<名>.webp 缩略图,最长边 720,质量 70(网格用,
                                        lib/photos.ts 构建时自动探测引用)

已存在且比源图新的产物会跳过;想强制重做就删掉对应产物再跑。
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ORIG_DIR = ROOT / "photos-originals"
PUB_DIR = ROOT / "public" / "images" / "photos"
THUMB_DIR = PUB_DIR / "thumbs"
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
    for stem, src in sorted(sources.items()):
        r1 = convert(src, PUB_DIR / f"{stem}.webp", 1600, 80)
        r2 = convert(src, THUMB_DIR / f"{stem}.webp", 720, 70)
        s1 = (PUB_DIR / f"{stem}.webp").stat().st_size // 1024
        s2 = (THUMB_DIR / f"{stem}.webp").stat().st_size // 1024
        print(f"{stem}: 展示版[{r1}] {s1}KB  缩略图[{r2}] {s2}KB")


if __name__ == "__main__":
    main()
