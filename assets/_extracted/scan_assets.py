"""Scan game asset folders and report which images are usable for the website.

Distinguishes display-ready art (large) from engine textures/sprites (tiny).
"""
from PIL import Image
import os, sys

ROOTS = [
    ("Witcher / GermCache", r"E:\Minecraft\Witcher客户端-1.0.4\.minecraft\GermCache"),
    ("Demons & Knights / Unity", r"E:\Unity\Unity Project\Siege On Castle\Assets\Resources"),
]
EXTS = {".png", ".gif", ".jpg", ".jpeg", ".webp", ".bmp", ".tga"}

for label, root in ROOTS:
    print(f"\n{'=' * 70}\n{label}\n{root}\n{'=' * 70}")
    if not os.path.isdir(root):
        print("  !! directory not found")
        continue
    imgs = []
    errors = 0
    for dirpath, _, files in os.walk(root):
        if ".git" in dirpath:
            continue
        for fn in files:
            if os.path.splitext(fn)[1].lower() not in EXTS:
                continue
            fp = os.path.join(dirpath, fn)
            try:
                with Image.open(fp) as im:
                    w, h = im.size
                imgs.append((fp, w, h, os.path.getsize(fp)))
            except Exception:
                errors += 1
    total = len(imgs)
    buckets = {"tiny <128": 0, "128-255": 0, "256-511": 0, "512-1023": 0, ">=1024": 0}
    for _, w, h, _ in imgs:
        m = min(w, h)
        if m < 128:
            buckets["tiny <128"] += 1
        elif m < 256:
            buckets["128-255"] += 1
        elif m < 512:
            buckets["256-511"] += 1
        elif m < 1024:
            buckets["512-1023"] += 1
        else:
            buckets[">=1024"] += 1
    print(f"  images: {total}  (unreadable: {errors})")
    for k, v in buckets.items():
        print(f"    {k:>12}: {v}")

    # Display candidates: at least 256 on the short side.
    cands = [t for t in imgs if min(t[1], t[2]) >= 256]
    cands.sort(key=lambda t: t[1] * t[2], reverse=True)
    print(f"\n  -- display candidates (short side >= 256 px): {len(cands)} --")
    for fp, w, h, size in cands[:80]:
        rel = os.path.relpath(fp, root)
        print(f"    {w:>5}x{h:<5} {size // 1024:>5} KB  {rel}")
