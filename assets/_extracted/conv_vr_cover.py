"""Convert the VR project title-card image to the project cover."""
from PIL import Image
import os

src = r"C:\Users\11921\Downloads\ChatGPT Image 2026年5月22日 21_07_30.png"
out = r"D:\lizhuoyuan-porfolio\assets\projects\vr.webp"

im = Image.open(src).convert("RGB")
print("source:", im.size)

target_w = 1280
if im.size[0] > target_w:
    h = round(im.size[1] * target_w / im.size[0])
    im = im.resize((target_w, h), Image.LANCZOS)

im.save(out, "WEBP", quality=84, method=6)
print("saved:", out, "->", im.size, os.path.getsize(out) // 1024, "KB")
