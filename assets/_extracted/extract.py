"""Extract embedded images from project PDFs for portfolio asset selection."""
import fitz  # pymupdf
import os
import hashlib
import html

PDFS = {
    "project-1": ("../../pdf/project-1.pdf", "Witcher 3 in Minecraft"),
    "project-2": ("../../pdf/project-2.pdf", "Demons & Knights"),
    "project-3": ("../../pdf/project-3.pdf", "Flux"),
}

# Skip anything smaller than this on both sides (icons, bullets, rules).
MIN_W, MIN_H = 240, 180

BASE = os.path.dirname(os.path.abspath(__file__))
report = []

for key, (rel, title) in PDFS.items():
    pdf_path = os.path.join(BASE, rel)
    out_dir = os.path.join(BASE, key)
    os.makedirs(out_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    seen_hash = set()
    kept = []
    idx = 0
    for pno in range(len(doc)):
        for img in doc.get_page_images(pno):
            xref = img[0]
            try:
                base = doc.extract_image(xref)
            except Exception:
                continue
            data = base["image"]
            w, h = base.get("width", 0), base.get("height", 0)
            ext = base.get("ext", "png")
            if w < MIN_W or h < MIN_H:
                continue
            digest = hashlib.md5(data).hexdigest()
            if digest in seen_hash:
                continue
            seen_hash.add(digest)
            idx += 1
            fn = f"{key}-p{pno + 1:02d}-{idx:02d}-{w}x{h}.{ext}"
            with open(os.path.join(out_dir, fn), "wb") as f:
                f.write(data)
            kept.append((fn, key, w, h, len(data)))
    doc.close()
    report.append((key, title, kept))
    print(f"{key} ({title}): {len(kept)} images kept -> {out_dir}")

# Build a preview contact sheet.
rows = []
for key, title, kept in report:
    rows.append(f"<h2>{html.escape(title)} <small>({key} - {len(kept)} images)</small></h2>")
    rows.append('<div class="grid">')
    for fn, k, w, h, size in sorted(kept):
        kb = size // 1024
        src = f"{k}/{fn}"
        rows.append(
            f'<figure><img src="{src}" loading="lazy">'
            f'<figcaption>{html.escape(fn)}<br>{w}x{h} - {kb} KB</figcaption></figure>'
        )
    rows.append("</div>")

total = sum(len(k) for _, _, k in report)
page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Extracted PDF images ({total})</title>
<style>
 body{{font-family:system-ui,sans-serif;background:#13201a;color:#eef;margin:0;padding:24px}}
 h1{{font-size:18px}} h2{{margin-top:32px;border-bottom:1px solid #345;padding-bottom:6px}}
 small{{color:#8aa;font-weight:400}}
 .grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}}
 figure{{margin:0;background:#0c1611;border:1px solid #2c4034;border-radius:8px;overflow:hidden}}
 img{{width:100%;height:160px;object-fit:contain;background:#000;display:block}}
 figcaption{{font-size:11px;color:#9bb;padding:6px 8px;word-break:break-all}}
</style></head><body>
<h1>Extracted PDF images - {total} total. Open this file in a browser to pick the ones you want.</h1>
{''.join(rows)}
</body></html>"""

with open(os.path.join(BASE, "preview.html"), "w", encoding="utf-8") as f:
    f.write(page)
print(f"\nTotal kept: {total}")
print(f"Preview: {os.path.join(BASE, 'preview.html')}")
