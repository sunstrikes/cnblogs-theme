"""Compose the native captured HTML with the two Cnblogs customization fields."""
import mimetypes
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ROOT / 'preview/fixtures'
POST = '/sample/p/1001'
PAGES = {'/': 'post.html', POST: 'post.html'}
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
    path = urlsplit(url).path
    if path == '/sample/ajax/sidebar-lists':
        return 'application/json', (FIXTURES / 'sidebar-lists.json').read_bytes()
    if path in PAGES:
        return 'text/html; charset=utf-8', render(PAGES[path], fields).encode()
    file = (ROOT / path.lstrip('/')).resolve()
    if file.is_relative_to(ROOT) and path.startswith(('/src/', '/preview/fixtures/')) and file.is_file():
        return mimetypes.guess_type(file.name)[0] or 'application/octet-stream', file.read_bytes()
    return None
