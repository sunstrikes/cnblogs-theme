"""Compose the native captured HTML with the two Cnblogs customization fields."""
import mimetypes
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
CSS = ('critical', 'tokens', 'layout', 'prose', 'pages')


def source_fields():
    # The platform embeds the critical field in the head: the new document's
    # view-transition opt-in must already exist when the first frame is revealed.
    critical = (ROOT / 'src/css/critical.css').read_text()
    style = '<style>\n' + critical + '\n</style>\n'
    style += ''.join(f'<link rel="stylesheet" href="/src/css/{name}.css">\n'
                     for name in CSS if name != 'critical' and (ROOT / f'src/css/{name}.css').is_file())
    modules = [p.relative_to(ROOT).as_posix() for part in ('core', 'data', 'ui')
               for p in sorted((ROOT / 'src/js' / part).glob('*.js'))]
    runtime = ''.join(f'<script defer src="/{p}"></script>\n' for p in modules)
    template = ROOT / 'src/templates/head-loader.html'
    head = template.read_text() if template.exists() else ''
    return style, head.replace('<!-- CTP:LOADER -->', runtime)


def render(filename, fields=None):
    style, head = fields or source_fields()
    native_script = '<script defer src="/preview/fixtures/async.js"></script>'
    return ((FIXTURES / filename).read_text()
            .replace('<!-- CTP:CSS -->', style).replace('<!-- CTP:HEAD -->', head)
            .replace('</body>', native_script + '</body>'))


def resource(url, fields=None):
    request = urlsplit(url)
    path = unquote(request.path)
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
    if file.is_relative_to(ROOT) and path.startswith(('/src/', '/preview/fixtures/')) and file.is_file():
        return mimetypes.guess_type(file.name)[0] or 'application/octet-stream', file.read_bytes()
    return None
