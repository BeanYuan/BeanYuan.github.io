"""Fix-up:
A) Witcher PROJECT cover -> the ship-deck (p-hero) scene.
B) Top hero background -> a fresh collage of the latest project covers.
"""
from PIL import Image
import os

BASE = os.path.dirname(os.path.abspath(__file__))            # assets/_extracted
ROOT = os.path.normpath(os.path.join(BASE, "..", ".."))      # project root


# --- A: ship-deck scene -> assets/projects/witcher.webp ---
slide = Image.open(
    os.path.join(BASE, "project-1", "project-1-p01-01-6482x2160.jpeg")
).convert("RGB")
ship = slide.crop((2125, 0, 4098, 1110)).resize((1280, 720), Image.LANCZOS)
witcher_out = os.path.join(ROOT, "assets", "projects", "witcher.webp")
ship.save(witcher_out, "WEBP", quality=84, method=6)
print("A) witcher.webp (project cover):", ship.size,
      os.path.getsize(witcher_out) // 1024, "KB")


# --- B: hero collage from the latest covers ---
def cover_crop(im, w, h):
    iw, ih = im.size
    s = max(w / iw, h / ih)
    nw, nh = round(iw * s), round(ih * s)
    im = im.resize((nw, nh), Image.LANCZOS)
    x, y = (nw - w) // 2, (nh - h) // 2
    return im.crop((x, y, x + w, y + h))


TW, TH, COLS, ROWS = 960, 560, 3, 2
canvas = Image.new("RGB", (TW * COLS, TH * ROWS), (14, 14, 16))
covers = [
    "assets/projects/turretcoop.webp",
    "assets/projects/witcher.webp",
    "assets/projects/demons-knights.webp",
    "assets/projects/flux.webp",
    "assets/projects/scrollscape.webp",
    "assets/projects/witcher-rpg.webp",
]
for i, rel in enumerate(covers):
    im = Image.open(os.path.join(ROOT, rel)).convert("RGB")
    tile = cover_crop(im, TW, TH)
    canvas.paste(tile, ((i % COLS) * TW, (i // COLS) * TH))

collage_out = os.path.join(ROOT, "assets", "hero", "hero-collage.webp")
canvas.save(collage_out, "WEBP", quality=82, method=6)
print("B) hero-collage.webp:", canvas.size,
      os.path.getsize(collage_out) // 1024, "KB")
