"""Compose the native captured HTML with the two Cnblogs customization fields."""
import mimetypes
import re
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ROOT / 'preview/fixtures'
POST = '/sample/p/1001'
PAGES = {
    '/': 'home.html', '/sample': 'home.html', '/sample/': 'home.html', POST: 'post.html',
    '/sample/p/1002': 'post-2.html', '/sample/p/1003.html': 'post-3.html', '/sample/p/1004': 'post-4.html',
    '/sample/tag': 'tags.html', '/sample/tag/': 'tags.html',
    '/sample/tag/排版/': 'tag-1.html', '/sample/tag/间距/': 'tag-2.html',
    '/sample/p/archive/2025/06': 'archive-june.html', '/sample/p/archive/2025/05': 'archive-may.html',
    '/sample/categories': 'categories.html', '/sample/post-categories': 'categories.html',
    '/sample/category/21.html': 'category-21.html', '/sample/category/22.html': 'category-22.html',
}
DIST = ROOT/'dist'
CDNS = ('cdn.jsdelivr.net', 'fastly.jsdelivr.net')


def dist_fields(*, inline=False, loopback=False):
    style = DIST/('fallback/样式-内联备份.css' if inline else 'paste/样式.min.css')
    head = (DIST/'paste/页首.html').read_text('utf-8')
    if loopback:
        # A manually opened page has no request interceptor. Alias only the
        # two CDN origins; keep the generated path, cache key and loader intact.
        for host in CDNS:
            head = head.replace('https://' + host + '/', '/_cdn/' + host + '/')
    return '<style>' + style.read_text('utf-8') + '</style>', head


def cdn_resource(host, path):
    if host not in CDNS or not re.fullmatch(r'/gh/[^/]+/[^/]+@[^/]+/dist/ctp-docs(?:\.min\.css|\.js)', path):
        return None
    file = DIST/path.rsplit('/', 1)[-1]
    return ('text/css' if file.suffix == '.css' else 'application/javascript'), file.read_bytes()


def render(filename, fields=None):
    style, head = fields or dist_fields()
    # The platform adds defer to literal external script tags in the page-top
    # field before parsing. Tags produced later by inline JS are not rewritten.
    head = re.sub(r'<script\b(?=[^>]*\ssrc\s*=)', '<script defer', head, flags=re.IGNORECASE)
    native_script = '<script defer src="/preview/fixtures/async.js"></script>'
    return ((FIXTURES / filename).read_text()
            .replace('<!-- CTP:CSS -->', style).replace('<!-- CTP:HEAD -->', head)
            .replace('</body>', native_script + '</body>'))


def resource(url, fields=None):
    request = urlsplit(url)
    path = unquote(request.path)
    if path.startswith('/_cdn/'):
        host, _, asset = path[len('/_cdn/'):].partition('/')
        return cdn_resource(host, '/' + asset)
    if path == '/sample/ajax/news':
        return 'text/html; charset=utf-8', (FIXTURES / 'news.html').read_bytes()
    if path in ('/sample/ajax/post-accessories', '/sample/ajax/comments-block') and parse_qs(request.query).get('postId') == ['1001']:
        return 'application/json', (FIXTURES / (path.rsplit('/', 1)[-1] + '.json')).read_bytes()
    if path == '/sample/ajax/sidebar-lists':
        return 'application/json', (FIXTURES / 'sidebar-lists.json').read_bytes()
    if path in PAGES:
        filename = PAGES[path]
        if filename == 'home.html' and parse_qs(request.query).get('page') == ['2']:
            filename = 'home-page2.html'
        return 'text/html; charset=utf-8', render(filename, fields).encode()
    file = (ROOT / path.lstrip('/')).resolve()
    if file.is_relative_to(ROOT) and path.startswith('/preview/fixtures/') and file.is_file():
        return mimetypes.guess_type(file.name)[0] or 'application/octet-stream', file.read_bytes()
    return None
