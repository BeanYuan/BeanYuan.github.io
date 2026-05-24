"""Contact sheet of Demons & Knights texture assets."""
from PIL import Image, ImageDraw
import os

root = r"E:\Unity\Unity Project\Siege On Castle\Assets\Resources\Textures"
files = []
for dp, _, fs in os.walk(root):
    for fn in sorted(fs):
        if fn.lower().endswith((".png", ".gif")):
            files.append(os.path.join(dp, fn))
files.sort()

cols, cell, pad = 5, 240, 10
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * cell, rows * cell), (20, 16, 11))
d = ImageDraw.Draw(sheet)
for i, fp in enumerate(files):
    im = Image.open(fp).convert("RGBA")
    bg = Image.new("RGBA", im.size, (20, 16, 11, 255))
    bg.alpha_composite(im)
    im = bg.convert("RGB")
    im.thumbnail((cell - pad * 2, cell - pad * 2 - 16), Image.LANCZOS)
    x, y = (i % cols) * cell, (i // cols) * cell
    sheet.paste(im, (x + (cell - im.size[0]) // 2, y + pad))
    label = os.path.relpath(fp, root).replace(os.sep, "/")
    d.text((x + 6, y + cell - 14), label, fill=(200, 180, 140))

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_previews", "dk-sheet.jpg")
sheet.save(out, "JPEG", quality=88)
print("sheet", sheet.size, "->", out)
