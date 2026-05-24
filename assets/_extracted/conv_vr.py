"""Convert the 3 VR experiment screenshots to webp (calibration / task / report)."""
from PIL import Image
import glob
import os

DL = r"C:\Users\11921\Downloads"
OUT = r"D:\lizhuoyuan-porfolio\assets\projects"

jobs = [
    ("20260522203314", "vr-shot-1.webp"),  # arcane calibration
    ("20260522203404", "vr-shot-2.webp"),  # rune core lock task
    ("20260522203530", "vr-shot-3.webp"),  # performance report
]

for token, out_name in jobs:
    matches = glob.glob(os.path.join(DL, "*" + token + "*"))
    if not matches:
        print(token, "NOT FOUND")
        continue
    im = Image.open(matches[0]).convert("RGB")
    out = os.path.join(OUT, out_name)
    im.save(out, "WEBP", quality=88, method=6)
    print(out_name, im.size, os.path.getsize(out) // 1024, "KB")
