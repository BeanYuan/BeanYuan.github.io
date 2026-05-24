"""Generate small JPEG previews of curated asset candidates for review."""
from PIL import Image
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_previews")
os.makedirs(OUT, exist_ok=True)

GERM = r"E:\Minecraft\Witcher客户端-1.0.4\.minecraft\GermCache"
UNITY = r"E:\Unity\Unity Project\Siege On Castle\Assets\Resources"

CANDIDATES = [
    ("w01-start",     os.path.join(GERM, r"textures\gui\ui\background\background_start.png")),
    ("w02-esc",       os.path.join(GERM, r"textures\gui\ui\background\background_esc.png")),
    ("w03-escbg",     os.path.join(GERM, r"textures\gui\ui\esc\background.png")),
    ("w04-tower1",    os.path.join(GERM, r"textures\gui\ui\background\tower_of_ervyn\bg_1.png")),
    ("w05-tower2",    os.path.join(GERM, r"textures\gui\ui\background\tower_of_ervyn\bg_2.png")),
    ("w06-tower3",    os.path.join(GERM, r"textures\gui\ui\background\tower_of_ervyn\bg_3.png")),
    ("w07-tower5",    os.path.join(GERM, r"textures\gui\ui\background\tower_of_ervyn\bg_5.png")),
    ("w08-costume2",  os.path.join(GERM, r"textures\gui\ui\background\costume\bg-2.png")),
    ("w09-loading",   os.path.join(GERM, r"textures\hud\ui\background\background_loading_2.png")),
    ("w10-lottery",   os.path.join(GERM, r"textures\gui\ui\background\background_lottery_chest.png")),
    ("u01-board",     os.path.join(UNITY, r"Textures\Background\Board.png")),
    ("u02-chest",     os.path.join(UNITY, r"Textures\Units\ChestClosed.png")),
]

MAXW = 1400
for name, path in CANDIDATES:
    if not os.path.isfile(path):
        print(f"  MISSING  {name}  {path}")
        continue
    im = Image.open(path).convert("RGB")
    w, h = im.size
    if w > MAXW:
        im = im.resize((MAXW, round(h * MAXW / w)), Image.LANCZOS)
    out = os.path.join(OUT, name + ".jpg")
    im.save(out, "JPEG", quality=86)
    print(f"  {name:14} {w}x{h:<6} -> {im.size[0]}x{im.size[1]}  {os.path.getsize(out)//1024} KB")
