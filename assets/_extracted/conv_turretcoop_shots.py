"""Convert the 4 TurretCoop gameplay screenshots to webp (narrative order)."""
from PIL import Image
import os

DL = r"C:\Users\11921\Downloads"
OUT = r"D:\lizhuoyuan-porfolio\assets\projects"

jobs = [
    ("QQ20260522-190341.png", "turretcoop-shot-1.webp"),               # combat
    ("QQ20260522-190418.png", "turretcoop-shot-2.webp"),               # tower parts
    ("ScreenShot_2026-05-22_190400_035.png", "turretcoop-shot-3.webp"),  # upgrades
    ("QQ20260522-190431.png", "turretcoop-shot-4.webp"),               # placement
]

for src_name, out_name in jobs:
    im = Image.open(os.path.join(DL, src_name)).convert("RGB")
    out = os.path.join(OUT, out_name)
    im.save(out, "WEBP", quality=85, method=6)
    print(out_name, im.size, os.path.getsize(out) // 1024, "KB")
