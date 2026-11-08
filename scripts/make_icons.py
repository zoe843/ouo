# -*- coding: utf-8 -*-
"""按 make_favicon.py 的水滴画法生成 PWA / apple-touch-icon 所需的大尺寸图标。
输出到 public/icons/：icon-192.png、icon-512.png（透明底）、
icon-512-maskable.png（实底+安全边距，供 PWA maskable 用途）、
apple-touch-icon.png（180x180，iOS 不支持透明底，垫站点背景色）。
"""
from PIL import Image, ImageDraw
import math
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
BG = (12, 24, 36, 255)  # 站点 --background #0c1824


def draw_drop(size: int) -> Image.Image:
    """make_favicon.py 的水滴画法，按任意尺寸重绘（先大后小，边缘平滑）。"""
    S = size
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    cx, r = S // 2, S * 0.30
    cy = int(S * 0.60)
    tip = (cx, int(S * 0.10))

    alpha = math.asin(r / (cy - tip[1]))
    t1 = (cx - r * math.sin(alpha), cy - r * math.cos(alpha))
    t2 = (cx + r * math.sin(alpha), cy - r * math.cos(alpha))

    d.polygon([tip, t1, t2], fill="#4a9eff")
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill="#4a9eff")

    # 底部加深色渐变感
    shade = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    ds = ImageDraw.Draw(shade)
    ds.ellipse([cx - r, cy - r, cx + r, cy + r], fill="#2f6db8")
    mask = Image.new("L", (S, S), 0)
    dm = ImageDraw.Draw(mask)
    dm.ellipse([cx - r, int(cy), cx + r, cy + r], fill=110)
    img.paste(shade, (0, 0), mask)

    # 左上高光
    hl_r = r * 0.22
    d.ellipse([cx - r * 0.45 - hl_r / 2, cy - r * 0.45 - hl_r / 2,
               cx - r * 0.45 + hl_r / 2, cy - r * 0.45 + hl_r / 2],
              fill=(255, 255, 255, 170))
    return img


def on_solid_bg(img: Image.Image, bg=BG) -> Image.Image:
    """垫一层不透明底色（iOS apple-touch-icon / maskable 需要实底）。"""
    out = Image.new("RGBA", img.size, bg)
    out.paste(img, (0, 0), img)
    return out.convert("RGB")


os.makedirs(OUT_DIR, exist_ok=True)

big = draw_drop(1024)  # 先画大图再缩

big.resize((192, 192), Image.LANCZOS).save(os.path.join(OUT_DIR, "icon-192.png"))
big.resize((512, 512), Image.LANCZOS).save(os.path.join(OUT_DIR, "icon-512.png"))

# maskable：安全区要求内容落在中心 ~80% 内，缩小水滴并垫实底
pad = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
inner = big.resize((768, 768), Image.LANCZOS)
pad.paste(inner, ((1024 - 768) // 2, (1024 - 768) // 2), inner)
on_solid_bg(pad).resize((512, 512), Image.LANCZOS).save(
    os.path.join(OUT_DIR, "icon-512-maskable.png"))

on_solid_bg(big).resize((180, 180), Image.LANCZOS).save(
    os.path.join(OUT_DIR, "apple-touch-icon.png"))

print("icons written to public/icons/:", os.listdir(OUT_DIR))
