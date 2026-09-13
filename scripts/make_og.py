# -*- coding: utf-8 -*-
"""生成 og 分享图 public/og.jpg(1200x630)。

用法: ~/venv/Scripts/python.exe scripts/make_og.py

背景取 public/images/bg.webp cover-crop,叠站名与标语;
改了背景图或文案后重跑一次即可。app/layout.tsx 的 metadata 引用 /og.jpg。
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
BG = ROOT / "public" / "images" / "bg.webp"
OUT = ROOT / "public" / "og.jpg"

W, H = 1200, 630
TITLE = "雨落花庭"
SUBTITLE = "相寻梦里路，飞雨落花中"

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\msyhbd.ttc",  # 微软雅黑 Bold
    r"C:\Windows\Fonts\msyh.ttc",
    r"C:\Windows\Fonts\simhei.ttf",
]


def pick_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    raise SystemExit("没找到可用的中文字体(微软雅黑/黑体)")


def draw_tracked(draw: ImageDraw.ImageDraw, center_y: int, text: str,
                 font: ImageFont.FreeTypeFont, fill, tracking: int) -> None:
    """带字距地水平居中绘制。"""
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = (W - total) / 2
    for ch, w in zip(text, widths):
        draw.text((x, center_y), ch, font=font, fill=fill, anchor="lm")
        x += w + tracking


def main() -> None:
    bg = Image.open(BG).convert("RGB")
    # cover-crop 到 1200x630
    scale = max(W / bg.width, H / bg.height)
    bg = bg.resize((round(bg.width * scale), round(bg.height * scale)), Image.LANCZOS)
    left = (bg.width - W) // 2
    top = (bg.height - H) // 2
    img = bg.crop((left, top, left + W, top + H))

    # 压暗一点,保证文字对比度
    overlay = Image.new("RGBA", (W, H), (5, 12, 26, 120))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

    draw = ImageDraw.Draw(img)
    draw_tracked(draw, H // 2 - 40, TITLE, pick_font(128), (232, 240, 251), 28)
    draw_tracked(draw, H // 2 + 72, SUBTITLE, pick_font(34), (158, 182, 217), 10)

    img.save(OUT, "JPEG", quality=88, optimize=True)
    print(f"生成 {OUT} ({OUT.stat().st_size // 1024}KB)")


if __name__ == "__main__":
    main()
