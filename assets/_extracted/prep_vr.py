"""Locate the 3 VR screenshots by numeric token and make ASCII previews."""
from PIL import Image
import glob
import os

DL = r"C:\Users\11921\Downloads"
PV = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_previews")

tokens = {
    "a": "20260522203314",
    "b": "20260522203404",
    "c": "20260522203530",
}

for key, tok in tokens.items():
    matches = glob.glob(os.path.join(DL, "*" + tok + "*"))
    if not matches:
        print(key, tok, "NOT FOUND")
        continue
    src = matches[0]
    im = Image.open(src).convert("RGB")
    out = os.path.join(PV, "_vr-" + key + ".jpg")
    im.save(out, "JPEG", quality=88)
    print(key, "->", os.path.basename(src), im.size)
