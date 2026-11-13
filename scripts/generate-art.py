"""Generate the website's pixel art from Thea's own renderer.

Everything here comes from the app's procedural rig, so the site and the
desktop pet can never drift apart. Run from the website repo:

    ..\\Thea - the digital pet\\.venv\\Scripts\\python.exe scripts\\generate-art.py

Optional: --app "C:\\path\\to\\Thea - the digital pet"
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

SITE = Path(__file__).resolve().parent.parent
DEFAULT_APP = SITE.parent / "Thea - the digital pet"

parser = argparse.ArgumentParser()
parser.add_argument("--app", default=str(DEFAULT_APP))
args = parser.parse_args()

APP = Path(args.app).resolve()
sys.path.insert(0, str(APP))

from thea import rig  # noqa: E402
from thea.expressions import draw_face  # noqa: E402

ART = SITE / "public" / "art"
FACES = ART / "faces"
MOODS = ART / "moods"
FACES.mkdir(parents=True, exist_ok=True)
MOODS.mkdir(parents=True, exist_ok=True)


def frame(expr: str = "neutral", look=(0, 0), blink: bool = False, chew: float = 0.0):
    img = rig.render_body()
    draw_face(img, expr, t=0.0, look=look, blink=blink, chew=chew)
    return img


def save(img: np.ndarray, path: Path, scale: int, canvas: tuple[int, int, int] | None = None):
    """Nearest-neighbour upscale. canvas = (width, height, offset_y) in sprite px."""
    pil = Image.fromarray(img, "RGBA")
    if canvas:
        w, h, _ = canvas
        sheet = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        sheet.alpha_composite(pil, (0, 0))
        pil = sheet
    pil = pil.resize((pil.width * scale, pil.height * scale), Image.Resampling.NEAREST)
    pil.save(path)
    print(f"  {path.relative_to(SITE)}  {pil.width}x{pil.height}")


# --- Eight expressions -----------------------------------------------------
print("Faces")
faces = {
    "neutral": frame("neutral"),
    "sad": frame("sad"),
    "happy": frame("happy"),
    "surprised": frame("surprised"),
    "angry": frame("angry"),
    "eating": frame("eating", chew=0.8),
    "sing": frame("sing", chew=1.0),
    "sleep": frame("sleep"),
}
for name, img in faces.items():
    save(img, FACES / f"{name}.png", 10)

# --- Mood compositions -----------------------------------------------------
GLYPHS = {
    "heart": [".#.#.", "#####", "#####", ".###.", "..#.."],
    "sparkle": ["..#..", ".###.", "#####", ".###.", "..#.."],
    "note": ["..##.", "..#..", "..#..", "###..", "###.."],
    "bang": ["#", "#", "#", "."],
    "tear": ["#", "#"],
    "steam": ["##", "##"],
    "crumb": ["#"],
    "zzz": ["###", "..#", ".#.", "###"],
}
COLORS = {
    "heart": (0, 0, 0, 255),
    "sparkle": (0, 0, 0, 255),
    "note": (0, 0, 0, 255),
    "tear": (105, 105, 105, 255),
    "steam": (185, 185, 185, 255),
    "crumb": (105, 105, 105, 255),
    "zzz": (0, 0, 0, 255),
}


def compose(expr: str, particles, name: str, scale: int = 8):
    """60x60 sprite-space canvas, Thea placed at (10, 18)."""
    cw, ch, ox, oy = 60, 60, 10, 18
    sheet = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    sheet.alpha_composite(Image.fromarray(frame(expr), "RGBA"), (ox, oy))
    draw = ImageDraw.Draw(sheet)
    unit = 6
    for kind, x, y in particles:
        glyph = GLYPHS[kind]
        color = COLORS[kind]
        gx, gy = ox + x, oy + y
        for row, line in enumerate(glyph):
            for col, char in enumerate(line):
                if char == "#":
                    draw.rectangle(
                        [gx + col * unit, gy + row * unit,
                         gx + col * unit + unit - 1, gy + row * unit + unit - 1],
                        fill=color,
                    )
    out = sheet.resize((cw * scale, ch * scale), Image.Resampling.NEAREST)
    out.save(MOODS / f"{name}.png")
    print(f"  {(MOODS / f'{name}.png').relative_to(SITE)}  {out.width}x{out.height}")


print("Moods")
compose("happy", [("heart", 17, 1), ("heart", 27, 2), ("heart", 22, -6), ("sparkle", 8, 13), ("sparkle", 33, 17)], "delight")
compose("sad", [("tear", 14, 27), ("tear", 15, 31), ("crumb", 27, 35), ("crumb", 24, 37)], "hungry")
compose("sleep", [("zzz", 26, 8), ("zzz", 31, 2), ("zzz", 36, -4)], "sleepy")
compose("angry", [("steam", 9, 9), ("steam", 32, 7), ("steam", 11, 4), ("steam", 30, 2)], "cross")

# --- App icons -------------------------------------------------------------
print("Icons")
save(frame("neutral", blink=False), SITE / "app" / "icon.png", 2)  # 80px favicon
save(frame("neutral", blink=False), ART / "thea-320.png", 8)

apple = Image.new("RGB", (180, 180), (255, 255, 255))
pet = Image.fromarray(frame("neutral"), "RGBA").resize((160, 160), Image.Resampling.NEAREST)
apple.paste(pet, (10, 12), pet)
apple.save(SITE / "app" / "apple-icon.png")
print("  app/apple-icon.png  180x180")

# Big portrait for the OG card / social previews.
og_pet = Image.fromarray(frame("neutral"), "RGBA").resize((320, 320), Image.Resampling.NEAREST)
og_pet.save(ART / "thea-og.png")
print("  public/art/thea-og.png  320x320")

# --- Open Graph card (1200x630) -------------------------------------------
print("OG card")
FONT = SITE / "assets" / "fonts"
serif = ImageFont.truetype(str(FONT / "InstrumentSerif-Regular.ttf"), 124)
serif_italic = ImageFont.truetype(str(FONT / "InstrumentSerif-Italic.ttf"), 124)
mono = ImageFont.truetype(str(FONT / "GeistMono.ttf"), 17)
mono_small = ImageFont.truetype(str(FONT / "GeistMono.ttf"), 14)
sans = ImageFont.truetype(str(FONT / "Geist.ttf"), 24)

W, H = 1200, 630
INK = (10, 10, 11, 255)
PAPER = (244, 240, 230, 255)
MUTED = (157, 153, 143, 255)
LINE = (36, 35, 32, 255)
VERM = (255, 90, 54, 255)

og = Image.new("RGBA", (W, H), INK)
d = ImageDraw.Draw(og)
for x in range(0, W, 72):
    d.line([(x, 0), (x, H)], fill=(20, 20, 19, 255), width=1)
for y in range(0, H, 72):
    d.line([(0, y), (W, y)], fill=(20, 20, 19, 255), width=1)

# left column
d.text((72, 88), "THEA  ·  A PIXEL COMPANION FOR WINDOWS", font=mono, fill=MUTED)
d.text((66, 160), "A small life", font=serif_italic, fill=PAPER)
d.text((66, 286), "on your desktop.", font=serif, fill=PAPER)
d.text((72, 452), "She blinks, naps, follows your cursor and", font=sans, fill=PAPER)
d.text((72, 484), "never asks for an account. Free, offline,", font=sans, fill=PAPER)
d.text((72, 516), "and about the size of a shortcut.", font=sans, fill=PAPER)
d.ellipse([(72, 582), (80, 590)], fill=VERM)
d.text((92, 575), "WINDOWS 10 / 11  ·  VERSION 0.1.0", font=mono_small, fill=MUTED)

# right stage
sx, sy, sw, sh = 786, 96, 342, 438
d.rectangle([sx, sy, sx + sw, sy + sh], fill=PAPER)
for x in range(sx, sx + sw, 22):
    d.line([(x, sy), (x, sy + sh)], fill=(234, 229, 218, 255), width=1)
for y in range(sy, sy + sh, 22):
    d.line([(sx, y), (sx + sw, y)], fill=(234, 229, 218, 255), width=0)
og.alpha_composite(og_pet, (sx + (sw - 320) // 2, sy + 54))
d.rectangle([sx, sy + sh - 38, sx + sw, sy + sh], fill=INK)
d.text((sx + 16, sy + sh - 28), "thea", font=mono_small, fill=PAPER)
d.text((sx + sw - 74, sy + sh - 28), "23:41", font=mono_small, fill=(200, 196, 186, 255))
d.rectangle([sx, sy, sx + sw, sy + sh], outline=(10, 10, 11, 255), width=2)

# corner registration marks
for (cx, cy) in [(48, 48), (W - 48, 48), (48, H - 48), (W - 48, H - 48)]:
    d.line([(cx - 8, cy), (cx + 8, cy)], fill=LINE, width=1)
    d.line([(cx, cy - 8), (cx, cy + 8)], fill=LINE, width=1)

og.convert("RGB").save(SITE / "app" / "opengraph-image.png")
print("  app/opengraph-image.png  1200x630")

# --- Done ------------------------------------------------------------------
print("\nGenerated from", APP)
