"""Contact sheet of Scrollscape candidates: itch images + local backgrounds."""
from PIL import Image, ImageDraw
import os

BASE = os.path.dirname(os.path.abspath(__file__))
itch = os.path.join(BASE, "scrollscape-itch")
loc = r"D:\ScrollScape\Assets\Assets\Textures"

items = [
    ("itch cover", os.path.join(itch, "cover.png")),
    ("itch shot-1", os.path.join(itch, "shot-1.png")),
    ("itch shot-2", os.path.join(itch, "shot-2.png")),
    ("itch shot-3", os.path.join(itch, "shot-3.png")),
    ("itch shot-4", os.path.join(itch, "shot-4.png")),
    ("itch shot-5", os.path.join(itch, "shot-5.png")),
    ("itch shot-6", os.path.join(itch, "shot-6.png")),
    ("local background_1", os.path.join(loc, "background_1.png")),
    ("local background_2", os.path.join(loc, "background_2.png")),
    ("local Intro_1", os.path.join(loc, "Intro_1.png")),
    ("local Intro_broken", os.path.join(loc, "Intro_broken.png")),
]

cols, cw, ch, pad = 3, 440, 280, 8
rows = (len(items) + cols - 1) // cols
sheet = Image.new("RGB", (cols * cw, rows * ch), (18, 14, 10))
d = ImageDraw.Draw(sheet)
for i, (label, fp) in enumerate(items):
    x, y = (i % cols) * cw, (i // cols) * ch
    if not os.path.isfile(fp):
        d.text((x + 8, y + 8), label + "  (missing)", fill=(220, 120, 120))
        continue
    im = Image.open(fp).convert("RGB")
    im.thumbnail((cw - pad * 2, ch - pad * 2 - 18), Image.LANCZOS)
    sheet.paste(im, (x + (cw - im.size[0]) // 2, y + pad + 14))
    d.text((x + 8, y + 2), f"{label}  {Image.open(fp).size[0]}x{Image.open(fp).size[1]}",
           fill=(230, 205, 150))

out = os.path.join(BASE, "_previews", "scrollscape-sheet.jpg")
sheet.save(out, "JPEG", quality=86)
print("saved", sheet.size, "->", out)
