from pathlib import Path

from PIL import Image, ImageChops


SOURCE = Path(
    r"C:\Users\yifan\AppData\Local\Temp\codex-clipboard-b55b7d71-65fa-4cf4-aa76-f4917870c32c.png"
)
OUTPUT = Path(__file__).resolve().parents[1] / "public" / "partners"

LOGOS = [
    ("vgen", (205, 0, 355, 112)),
    ("fractional-manager-italia", (420, 0, 545, 112)),
    ("adacta", (610, 0, 760, 112)),
    ("serendpt", (815, 0, 970, 112)),
    ("careerboost", (1030, 0, 1180, 112)),
    ("5jes", (0, 118, 145, 232)),
    ("bip", (205, 118, 350, 232)),
    ("joule", (405, 118, 550, 232)),
    ("working-for-wash", (610, 112, 760, 232)),
    ("nova", (815, 118, 965, 232)),
    ("deloitte", (1015, 118, 1170, 232)),
    ("fairplay", (1215, 118, 1372, 232)),
    ("stoic-money", (205, 260, 355, 343)),
    ("pasin-bags", (405, 260, 550, 343)),
    ("assoconsult", (610, 260, 760, 343)),
    ("astra-research", (815, 260, 960, 343)),
    ("avis", (1015, 260, 1170, 343)),
]


def alpha_from_white(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    rgb = rgba.convert("RGB")
    white = Image.new("RGB", rgb.size, "white")
    difference = ImageChops.difference(rgb, white)
    alpha = difference.convert("L").point(
        lambda value: 0 if value <= 3 else 255 if value >= 24 else int((value - 3) * 255 / 21)
    )
    rgba.putalpha(alpha)
    return rgba


def crop_logo(source: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    crop = source.crop(box).convert("RGB")
    white = Image.new("RGB", crop.size, "white")
    difference = ImageChops.difference(crop, white).convert("L")
    content_mask = difference.point(lambda value: 255 if value > 5 else 0)
    bounds = content_mask.getbbox()
    if bounds:
        crop = crop.crop(bounds)

    logo = alpha_from_white(crop)
    logo.thumbnail((220, 84), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (280, 112), (255, 255, 255, 0))
    x = (canvas.width - logo.width) // 2
    y = (canvas.height - logo.height) // 2
    canvas.alpha_composite(logo, (x, y))
    return canvas


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGB")
    for filename, box in LOGOS:
        crop_logo(source, box).save(OUTPUT / f"{filename}.png", optimize=True)


if __name__ == "__main__":
    main()
