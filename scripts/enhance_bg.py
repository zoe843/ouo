# -*- coding: utf-8 -*-
"""修饰全站背景 public/images/bg.webp。

用法: ~/venv/Scripts/python.exe scripts/enhance_bg.py

在原始散景底图(photos-originals/bg-raw.webp)上叠加:
  顶部柔光晕 / 斜雨丝 / 飘落花瓣 / 星光点 / 暗角
呼应"飞雨落花"主题,整体保持暗色调,不影响正文对比度。
改参数重跑前,先把 bg-raw.webp 恢复:cp photos-originals/bg-raw.webp public/images/bg.webp
"""
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "photos-originals" / "bg-raw.webp"
OUT = ROOT / "public" / "images" / "bg.webp"

random.seed(20260913)

PETAL_COLORS = [
    (250, 214, 226),  # 粉
    (255, 228, 236),  # 浅粉白
    (242, 198, 216),  # 深粉
]


def add_glow(img: Image.Image) -> Image.Image:
    """顶部偏右一盏柔光,左中一盏补光,把纯暗区提起来。"""
    W, H = img.size
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([W * 0.42, -H * 0.45, W * 0.98, H * 0.28], fill=(74, 158, 255, 58))
    d.ellipse([-W * 0.12, H * 0.18, W * 0.20, H * 0.62], fill=(91, 140, 189, 34))
    layer = layer.filter(ImageFilter.GaussianBlur(130))
    return Image.alpha_composite(img, layer)


def add_rain(img: Image.Image) -> Image.Image:
    W, H = img.size
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(30):
        x = random.uniform(-40, W)
        y = random.uniform(-60, H * 0.85)
        ln = random.uniform(70, 190)
        tilt = ln * random.uniform(0.14, 0.22)  # 微微斜的雨丝
        alpha = random.randint(26, 52)
        d.line([(x, y), (x + tilt, y + ln)], fill=(186, 214, 250, alpha),
               width=random.randint(1, 2))
    layer = layer.filter(ImageFilter.GaussianBlur(0.8))
    return Image.alpha_composite(img, layer)


def make_petal(size: int, color, alpha: int) -> Image.Image:
    """单片花瓣:斜椭圆 + 极淡高光,旋转后微糊,呈朦胧剪影。"""
    w, h = size, max(7, int(size * 0.52))
    tile = Image.new("RGBA", (w * 2, h * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(tile)
    d.ellipse([w // 2, h // 2, w // 2 + w, h // 2 + h], fill=color + (alpha,))
    d.ellipse([w // 2 + w // 4, h // 2 + h // 3,
               w // 2 + w * 3 // 4, h // 2 + h * 3 // 5],
              fill=(255, 244, 248, min(255, alpha + 18)))
    tile = tile.rotate(random.uniform(0, 180), expand=True)
    return tile.filter(ImageFilter.GaussianBlur(1.1))


def add_petals(img: Image.Image) -> Image.Image:
    W, H = img.size
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for _ in range(12):
        s = random.randint(13, 30)
        color = random.choice(PETAL_COLORS)
        alpha = random.randint(58, 92)
        petal = make_petal(s, color, alpha)
        # 60% 落在左右两侧边缘,避免正文字正中央
        if random.random() < 0.6:
            x = random.choice([
                random.uniform(0, W * 0.18),
                random.uniform(W * 0.82, W),
            ]) - s
        else:
            x = random.uniform(0, W) - s
        y = random.uniform(-s, H * 0.9)
        layer.alpha_composite(petal, (int(x), int(y)))
    layer = layer.filter(ImageFilter.GaussianBlur(0.5))
    return Image.alpha_composite(img, layer)


def add_sparkles(img: Image.Image) -> Image.Image:
    W, H = img.size
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(46):
        x = random.uniform(0, W)
        y = random.uniform(0, H)
        r = random.uniform(0.6, 1.6)
        alpha = random.randint(20, 64)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(210, 228, 255, alpha))
    return Image.alpha_composite(img, layer)


def add_vignette(img: Image.Image) -> Image.Image:
    W, H = img.size
    mask = Image.radial_gradient("L").resize((W, H))
    mask = mask.point(lambda v: int(v * 64 / 255))  # 边缘最多压暗 64/255
    edge = Image.new("RGBA", (W, H), (4, 10, 22, 255))
    return Image.composite(edge, img, mask)


def main() -> None:
    img = Image.open(RAW).convert("RGBA")
    img = add_glow(img)
    img = add_rain(img)
    img = add_petals(img)
    img = add_sparkles(img)
    img = add_vignette(img)
    out = img.convert("RGB")
    out.save(OUT, "WEBP", quality=82, method=6)
    print(f"生成 {OUT} ({OUT.stat().st_size // 1024}KB)")


if __name__ == "__main__":
    main()
