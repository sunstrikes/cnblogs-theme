"""Exercise the unmodified paste fields with controlled responses at the CDN boundary."""
from urllib.parse import urlsplit

from playwright.sync_api import expect

PRIMARY = 'cdn.jsdelivr.net'
MIRROR = 'fastly.jsdelivr.net'
CSS = 'ctp-docs.min.css'
JS = 'ctp-docs.js'


def record(page, urls):
    page.on('request', lambda r: urls.append(urlsplit(r.url)))


def hosted(urls):
    return [(u.netloc, u.path.rsplit('/', 1)[-1]) for u in urls if u.netloc in (PRIMARY, MIRROR)]


def test_hosted_fields_keep_the_parser_shell_and_load_the_distributed_assets(site_page):
    urls = []
    page = site_page(before=lambda p: record(p, urls), color_scheme='dark',
        html=lambda h: h.replace('</div><div id="home">', '''<script>window.shell = [document.readyState,
          document.documentElement.dataset.theme, getComputedStyle(document.querySelector('.ctp-nav')).backgroundColor,
          getComputedStyle(document.documentElement).getPropertyValue('--ctp-field').trim()]</script></div><div id="home">''', 1))
    assert page.evaluate('shell') == ['loading', 'mocha', 'rgb(17, 17, 27)', '2']
    expect(page.get_by_role('navigation', name='文章目录')).to_be_visible()
    assert sorted(hosted(urls)) == sorted([(PRIMARY, CSS), (PRIMARY, JS)])
    assert not any('/src/' in u.path for u in urls)


def test_primary_outage_skips_host_until_one_hour_and_refreshes_hourly_keys(site_page):
    from datetime import datetime, timezone
    urls = []
    def instant(hour, minute):
        return datetime(2026, 1, 31, hour, minute, tzinfo=timezone.utc)
    def start(page):
        page.clock.set_fixed_time(instant(7, 42))
        record(page, urls)
    outage = {PRIMARY}
    page = site_page(before=start, cdn_status=lambda u: 503 if u.netloc in outage else 200)
    rail = page.get_by_role('navigation', name='文章目录')
    expect(rail).to_be_visible()
    expect(page.locator('#main')).to_have_css('display', 'grid')
    assert {(MIRROR, CSS), (MIRROR, JS)} <= set(hosted(urls))
    assert any(host == PRIMARY for host, asset in hosted(urls))
    assert {u.query for u in urls if u.netloc in (PRIMARY, MIRROR)} == {'d=2026013107'}
    outage.clear()
    for time, host, key in [(instant(8, 41), MIRROR, '2026013108'), (instant(8, 42), PRIMARY, '2026013108')]:
        urls.clear(); page.clock.set_fixed_time(time); page.reload()
        expect(rail).to_be_visible()
        assert sorted(hosted(urls)) == sorted([(host, CSS), (host, JS)])
        assert {u.query for u in urls if u.netloc in (PRIMARY, MIRROR)} == {'d=' + key}


def test_both_css_hosts_fail_but_the_bundle_restores_the_full_theme(site_page):
    urls = []
    page = site_page(before=lambda p: record(p, urls), color_scheme='dark',
                     cdn_status=lambda u: 503 if u.path.endswith('.css') else 200)
    assert {(PRIMARY, CSS), (MIRROR, CSS)} <= set(hosted(urls))
    expect(page.get_by_role('navigation', name='文章目录')).to_be_visible()
    expect(page.locator('#main')).to_have_css('display', 'grid')
    expect(page.locator('#cnblogs_post_body .hljs-keyword').first).to_have_css('color', 'rgb(203, 166, 247)')


def test_inline_backup_skips_all_stylesheet_requests_and_keeps_interactions(site_page):
    from .site import dist_fields
    urls = []
    page = site_page(fields=dist_fields(inline=True), before=lambda p: record(p, urls),
                     cdn_status=lambda u: 503 if u.path.endswith('.css') else 200)
    expect(page.get_by_role('navigation', name='文章目录')).to_be_visible()
    expect(page.locator('#main')).to_have_css('display', 'grid')
    assert page.locator('html').evaluate("e => getComputedStyle(e).getPropertyValue('--ctp-field').trim()") == '1'
    assert hosted(urls) == [(PRIMARY, JS)]


def test_total_cdn_outage_keeps_the_parser_shell_and_reveals_native_text(site_page):
    urls = []
    page = site_page(before=lambda p: record(p, urls), color_scheme='dark', cdn_status=lambda u: 503)
    assert {(PRIMARY, CSS), (PRIMARY, JS), (MIRROR, CSS), (MIRROR, JS)} == set(hosted(urls))
    expect(page.get_by_role('banner')).to_be_visible()
    expect(page.locator('html')).to_have_attribute('data-theme', 'mocha')
    expect(page.locator('#home')).to_have_css('opacity', '1', timeout=3000)
    expect(page.locator('#cnblogs_post_body')).to_contain_text('纸面实验')


def test_body_waits_for_full_styles_not_just_the_parser_shell(site_page):
    from .site import DIST
    pending = []
    page = site_page(wait_until='commit', before=lambda p: p.route('**/ctp-docs.min.css?*', lambda route: pending.append(route)))
    expect(page.locator('#sidebar_postarchive li a').first).to_be_attached()
    expect(page.locator('.ctp-toc li').first).to_be_attached()
    page.evaluate('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))')
    assert page.locator('#main').evaluate('e => getComputedStyle(e).display') == 'block'
    assert page.locator('#home').evaluate('e => getComputedStyle(e).opacity') == '0'
    pending[0].fulfill(content_type='text/css', body=(DIST / CSS).read_bytes())
    expect(page.locator('#main')).to_have_css('display','grid')
    expect(page.locator('#home')).to_have_css('opacity','1')
