"""python3 preview/serve.py [--port 8000] [--open]"""
import argparse
import sys
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from preview.site import POST, dist_fields, resource


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        data = resource(self.path, dist_fields(loopback=True))
        if data is None:
            self.send_error(404)
            return
        content_type, body = data
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Serve offline Cnblogs captures on loopback')
    parser.add_argument('--port', type=int, default=8000)
    parser.add_argument('--open', action='store_true')
    args = parser.parse_args()
    with ThreadingHTTPServer(('127.0.0.1', args.port), Handler) as server:
        url = f'http://127.0.0.1:{server.server_port}{POST}'
        print(url, flush=True)
        if args.open:
            webbrowser.open(url)
        server.serve_forever()
