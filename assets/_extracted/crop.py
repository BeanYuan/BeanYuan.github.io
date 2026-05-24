"""Crop clean art regions out of the case-study slides into web-ready assets.

Slides are 6482x2160. Each has a pure-white text panel; the game art is a
contiguous band. We crop the art band, resize for web, save as WebP.
"""
from PIL import Image
import os

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(BASE, "..", ".."))

# (source slide, crop box L/T/R/B, output path, target width)
JOBS = [
    # Hero: dark/cinematic ship combat scene (project-1 p01) - top art band.
    ("project-1/project-1-p01-01-6482x2160.jpeg", (0, 0, 6482, 1110),
     "assets/hero/hero-witcher.webp", 2600),
    # project-1 card cover: snowy-mountain Witcher character (p08), 16:9 crop.
    ("project-1/project-1-p08-08-6482x2160.jpeg", (1800, 0, 4200, 1350),
     "assets/projects/witcher-rpg.webp", 1280),
    # project-2 card cover: Demons & Knights art (p01) - right art band.
    ("project-2/project-2-p01-01-6482x2160.jpeg", (1678, 0, 6482, 2160),
     "assets/projects/demons-knights.webp", 1280),
    # project-3 card cover: Flux pixel art (p01) - right art band.
    ("project-3/project-3-p01-01-6482x2160.jpeg", (1646, 0, 6482, 2160),
     "assets/projects/flux.webp", 1280),
]

for src_rel, box, out_rel, target_w in JOBS:
    src = os.path.join(BASE, src_rel)
    out = os.path.join(ROOT, out_rel)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im = Image.open(src).convert("RGB")
    crop = im.crop(box)
    w, h = crop.size
    if w > target_w:
        new_h = round(h * target_w / w)
        crop = crop.resize((target_w, new_h), Image.LANCZOS)
    crop.save(out, "WEBP", quality=82, method=6)
    kb = os.path.getsize(out) // 1024
    print(f"{out_rel}: {crop.size[0]}x{crop.size[1]}  {kb} KB")
