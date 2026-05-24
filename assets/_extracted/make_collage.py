"""Compose a hero background collage from the game cover images."""
from PIL import Image
import os

ROOT = r"D:\lizhuoyuan-porfolio"
ITCH = os.path.join(ROOT, "assets", "_extracted", "scrollscape-itch")

# 3 columns x 2 rows mosaic
TILE_W, TILE_H = 900, 550
COLS, ROWS = 3, 2
canvas = Image.new("RGB", (TILE_W * COLS, TILE_H * ROWS), (16, 13, 9))

# row-major order
sources = [
    os.path.join(ROOT, "assets", "projects", "witcher-rpg.webp"),
    os.path.join(ROOT, "assets", "projects", "demons-knights.webp"),
    os.path.join(ROOT, "assets", "projects", "scrollscape.webp"),
    os.path.join(ROOT, "assets", "projects", "flux.webp"),
    os.path.join(ROOT, "assets", "hero", "hero-witcher.webp"),
    os.path.join(ITCH, "shot-1.png"),
]


def cover_crop(im, w, h):
    iw, ih = im.size
    scale = max(w / iw, h / ih)
    nw, nh = round(iw * scale), round(ih * scale)
    im = im.resize((nw, nh), Image.LANCZOS)
    x, y = (nw - w) // 2, (nh - h) // 2
    return im.crop((x, y, x + w, y + h))


for i, src in enumerate(sources):
    im = Image.open(src).convert("RGB")
    tile = cover_crop(im, TILE_W, TILE_H)
    cx, cy = (i % COLS) * TILE_W, (i // COLS) * TILE_H
    canvas.paste(tile, (cx, cy))

out = os.path.join(ROOT, "assets", "hero", "hero-collage.webp")
canvas.save(out, "WEBP", quality=82, method=6)
print("collage", canvas.size, os.path.getsize(out) // 1024, "KB ->", out)
