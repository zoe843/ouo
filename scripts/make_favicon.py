# -*- coding: utf-8 -*-
"""生成水滴 favicon（呼应站点雨滴意象，主色 --primary #4a9eff）"""
from PIL import Image, ImageDraw
import math

S = 256  # 先画大图再缩到各尺寸，边缘更平滑
img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

cx, r = S // 2, S * 0.30
cy = int(S * 0.60)          # 圆心
tip = (cx, int(S * 0.10))   # 上尖点

# 圆与从尖点出发的两条切线的交点角度
alpha = math.asin(r / (cy - tip[1]))
a1 = math.pi / 2 - alpha
a2 = math.pi / 2 + alpha
p1 = (cx + r * math.cos(-a1 + math.pi / 2) , 0, 0)  # placeholder
# 直接用参数方程算切点：切点在圆上，角度从竖直方向偏转 alpha
t1 = (cx - r * math.sin(alpha), cy - r * math.cos(alpha))
t2 = (cx + r * math.sin(alpha), cy - r * math.cos(alpha))

# 水滴主体 = 多边形(尖点-两切点) + 圆
d.polygon([tip, t1, t2], fill="#4a9eff")
d.ellipse([cx - r, cy - r, cx + r, cy + r], fill="#4a9eff")

# 底部加深色渐变感：叠一个下半圆深蓝
shade = Image.new("RGBA", (S, S), (0, 0, 0, 0))
ds = ImageDraw.Draw(shade)
ds.ellipse([cx - r, cy - r, cx + r, cy + r], fill="#2f6db8")
mask = Image.new("L", (S, S), 0)
dm = ImageDraw.Draw(mask)
dm.ellipse([cx - r, int(cy), cx + r, cy + r], fill=110)  # 只取下半、且半透明
img.paste(shade, (0, 0), mask)

# 左上高光
hl_r = r * 0.22
d.ellipse([cx - r * 0.45 - hl_r / 2, cy - r * 0.45 - hl_r / 2,
           cx - r * 0.45 + hl_r / 2, cy - r * 0.45 + hl_r / 2], fill=(255, 255, 255, 170))

out = img.resize((48, 48), Image.LANCZOS)
out.save(r"C:\Users\31170\feiyuluohua\app\favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
img.resize((64, 64), Image.LANCZOS).save(r"C:\Users\31170\AppData\Local\Temp\favicon_preview.png")
print("favicon.ico written")
