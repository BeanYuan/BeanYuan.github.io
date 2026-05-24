"""Crop a 16:9 hero background from the project-1 ship-deck scene (p-hero)."""
from PIL import Image
import os

BASE = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(BASE, "project-1", "project-1-p01-01-6482x2160.jpeg")
im = Image.open(src).convert("RGB")
print("source slide:", im.size)

# top art band is 0..1110 tall; take a 16:9 window holding both characters
box = (2125, 0, 4098, 1110)  # 1973 x 1110  (16:9)
crop = im.crop(box)
print("crop:", crop.size)

hero = crop.resize((2400, round(2400 * crop.size[1] / crop.size[0])), Image.LANCZOS)
out = os.path.join(BASE, "..", "hero", "hero.webp")
hero.save(out, "WEBP", quality=84, method=6)
print("hero.webp:", hero.size, os.path.getsize(out) // 1024, "KB")

pv = crop.resize((1400, round(1400 * crop.size[1] / crop.size[0])), Image.LANCZOS)
pv.save(os.path.join(BASE, "_previews", "_chk-hero.jpg"), "JPEG", quality=88)
print("preview saved")
