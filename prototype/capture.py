import os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
HTML_URI = (ROOT / "index.html").as_uri()
SHOTS = ROOT / "shots"
SHOTS.mkdir(exist_ok=True)

CASES = [
    ("post-latte-desktop.png", "post", "latte", 1440, 900),
    ("post-mocha-desktop.png", "post", "mocha", 1440, 900),
    ("home-latte-desktop.png", "home", "latte", 1440, 900),
    ("home-mocha-desktop.png", "home", "mocha", 1440, 900),
    ("post-mocha-mobile.png", "post", "mocha", 390, 844),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for filename, page_type, theme, width, height in CASES:
        page = browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=2)
        url = f"{HTML_URI}?page={page_type}&theme={theme}&clean=1"
        page.goto(url, wait_until="load")
        page.screenshot(path=str(SHOTS / filename), full_page=False)
        page.close()
        print(f"captured {filename}")
    browser.close()
