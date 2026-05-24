"""Convert the Demons & Knights cover key art and the rules diagram to webp."""
from PIL import Image
import os


def conv(src, out, target_w, quality):
    im = Image.open(src)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        bg.alpha_composite(im)
        im = bg.convert("RGB")
    else:
        im = im.convert("RGB")
    print("source:", os.path.basename(src), im.size)
    if im.size[0] > target_w:
        h = round(im.size[1] * target_w / im.size[0])
        im = im.resize((target_w, h), Image.LANCZOS)
    im.save(out, "WEBP", quality=quality, method=6)
    print("saved:", out, "->", im.size, os.path.getsize(out) // 1024, "KB")


conv(
    r"C:\Users\11921\Downloads\ChatGPT Image 2026年5月22日 16_51_19.png",
    r"D:\lizhuoyuan-porfolio\assets\projects\demons-knights.webp",
    1280, 82,
)
conv(
    r"C:\Users\11921\Downloads\TodQmD.png",
    r"D:\lizhuoyuan-porfolio\assets\projects\demons-knights-rules.webp",
    1100, 88,
)
