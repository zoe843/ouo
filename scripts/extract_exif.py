# -*- coding: utf-8 -*-
"""从 photos-originals/<name>.jpg 提取拍摄参数,格式化后写回 content/photos/photos.json
的 exif 字段(无 EXIF 的图不加字段,前端自动降级)。新增照片后重跑即可。"""
from PIL import Image
from PIL.ExifTags import TAGS
import json, os

ROOT = r"C:\Users\31170\feiyuluohua"
JSON_PATH = os.path.join(ROOT, "content", "photos", "photos.json")
ORIG_DIR = os.path.join(ROOT, "photos-originals")

def fmt_exposure(v):
    if v >= 0.25:
        return f"{v:.1f}s"
    return f"1/{round(1/v)}s"

def extract(name):
    p = os.path.join(ORIG_DIR, name + ".jpg")
    if not os.path.exists(p):
        return None
    ex = Image.open(p).getexif()
    sub = ex.get_ifd(0x8769)  # EXIF IFD
    all_tags = {TAGS.get(k, k): v for d in (ex, sub) for k, v in d.items()}
    try:
        fn = float(all_tags["FNumber"])
        et = float(all_tags["ExposureTime"])
        iso = int(all_tags["ISOSpeedRatings"])
    except (KeyError, TypeError, ValueError):
        return None
    parts = [f"ƒ/{fn:.1f}", fmt_exposure(et), f"ISO {iso}"]
    fl = all_tags.get("FocalLengthIn35mmFilm") or all_tags.get("FocalLength")
    if fl:
        parts.append(f"{int(float(fl))}mm")
    return " · ".join(parts)

with open(JSON_PATH, encoding="utf-8") as f:
    photos = json.load(f)

changed = 0
for item in photos:
    stem = os.path.splitext(os.path.basename(item["url"]))[0]
    exif = extract(stem)
    if exif:
        if item.get("exif") != exif:
            item["exif"] = exif
            changed += 1
    else:
        item.pop("exif", None)

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(photos, f, ensure_ascii=False, indent=2)

print(f"updated {changed}/{len(photos)} entries")
for it in photos:
    print(f"  {os.path.basename(it['url'])}: {it.get('exif', '(none)')}")
