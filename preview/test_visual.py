"""Acceptance matrix on the generated paste fields; optionally capture the current viewport."""
import struct
from pathlib import Path

import pytest
from playwright.sync_api import expect

from .site import POST

PAGES = {'home': '/sample/', 'post': POST, 'archive': '/sample/p/archive/2025/06', 'tags': '/sample/tag/'}
SIZES = ((1440, 900), (1920, 1080), (390, 844))
THEMES = {'latte': 'light', 'mocha': 'dark'}
BASELINE = Path(__file__).parent / 'screenshots'


def filename(name, theme, width, height):
    return f'{name}-{theme}-{width}x{height}.png'


def test_retained_matrix_has_24_png_viewports():
    files = {filename(name, theme, w, h): (w, h) for name in PAGES for theme in THEMES for w, h in SIZES}
    assert {p.name for p in BASELINE.glob('*.png')} == set(files)
    for file, size in files.items():
        with (BASELINE / file).open('rb') as image:
            assert image.read(16) == b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR'
            assert struct.unpack('>II', image.read(8)) == size


@pytest.mark.parametrize('name', PAGES)
@pytest.mark.parametrize('width,height', SIZES)
@pytest.mark.parametrize('theme,scheme', THEMES.items())
def test_release_viewport(site_page, request, name, width, height, theme, scheme):
    page = site_page(PAGES[name], viewport={'width': width, 'height': height},
                     device_scale_factor=1, color_scheme=scheme, reduced_motion='reduce')
    expect(page.locator('html')).to_have_attribute('data-theme', theme)
    expect(page.locator('#home')).to_have_css('opacity', '1')
    expect(page.locator('#sideBar')).to_be_hidden()
    expect(page.locator('#sideBar')).to_contain_text('随笔档案')
    if name == 'home':
        expect(page.locator('.ctp-post-row')).to_have_count(3)
        expect(page.get_by_role('navigation', name='分类筛选')).to_be_visible()
        expect(page.locator('.ctp-notice')).to_contain_text('本周整理纸页目录')
    elif name == 'post':
        expect(page.locator('.ctp-toc [aria-current="location"]')).to_have_count(1)
        expect(page.get_by_role('navigation', name='文章标签')).to_be_visible()
    elif name == 'archive':
        # Populate the later month even when it starts below this viewport.
        month = page.get_by_role('region', name='2025年5月')
        month.scroll_into_view_if_needed()
        expect(month.get_by_role('link', name='校对一份索引')).to_be_visible()
        page.evaluate('scrollTo(0, 0)')
    else:
        expect(page.locator('#MyTag1_dtTagList a')).to_have_count(2)
    page.evaluate('document.fonts.ready.then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))')
    assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth')
    dest = request.config.getoption('--screenshots')
    if dest is not None:
        target = Path(dest)
        target.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=target / filename(name, theme, width, height), animations='disabled')
    if width == 390:
        # Tab into a visible control; a focus state alone is not a visible ring.
        page.keyboard.press('Tab')
        focused = page.locator(':focus-visible')
        expect(focused).to_have_css('outline-style', 'solid')
        expect(focused).to_have_css('outline-width', '2px')
        for _ in range(4):
            if page.locator('.ctp-menu').evaluate('e => e === document.activeElement'):
                break
            page.keyboard.press('Tab')
        expect(page.locator('.ctp-menu')).to_be_focused()
        page.keyboard.press('Enter')
        drawer = page.get_by_role('dialog', name='站点导航')
        expect(drawer).to_be_visible()
        expect(drawer).to_have_css('animation-name', 'none')
        page.keyboard.press('Escape')
        expect(drawer).to_be_hidden()
        expect(page.locator('.ctp-menu')).to_be_focused()
