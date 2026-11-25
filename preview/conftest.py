"""Drive real documents, including parser-time scripts, without network or sockets."""
import os
from urllib.parse import urlsplit
from threading import Thread
from http.server import ThreadingHTTPServer
from .serve import Handler

import pytest
from playwright.sync_api import sync_playwright
from .site import POST, resource

ORIGIN = 'https://ctp.test'


@pytest.fixture(scope='session')
def browser():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=os.getenv('CTP_CHROMIUM') or None)
        yield browser
        browser.close()


@pytest.fixture
def site_page(browser):
    contexts = []

    def visit(path=POST, *, html=None, init=None, fields=None, routes=None, before=None, **options):
        """`html` transforms rendered HTML; routes maps paths to (MIME, body) responses."""
        options.setdefault('viewport', {'width': 1440, 'height': 900})
        ctx = browser.new_context(**options)
        contexts.append(ctx)
        if init:
            ctx.add_init_script(init)

        def respond(route):
            url = urlsplit(route.request.url)
            if url.netloc != 'ctp.test':
                route.abort()
                return
            key = url.path + ('?' + url.query if url.query else '')
            result = (routes or {}).get(key) or (routes or {}).get(url.path) or resource(route.request.url, fields)
            if result is None:
                route.fulfill(status=404, body='Missing local fixture')
                return
            mime, body = result
            if html and mime.startswith('text/html') and url.path == urlsplit(path).path:
                body = html(body.decode() if isinstance(body, bytes) else body)
            route.fulfill(content_type=mime, body=body)

        ctx.route('**/*', respond)
        page = ctx.new_page()
        page.set_default_timeout(3000)
        if before:
            before(page)
        page.goto(ORIGIN + path)
        return page

    yield visit
    for ctx in contexts:
        ctx.close()


@pytest.fixture
def local_site():
    """Use real transport for browser features suppressed by HTTP interception (VT)."""
    with ThreadingHTTPServer(('127.0.0.1', 0), Handler) as server:
        thread = Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            yield f'http://127.0.0.1:{server.server_port}'
        finally:
            server.shutdown()
            thread.join()
