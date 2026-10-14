"""Bundle a source page into one self-contained HTML file.

Inlines local and CDN stylesheets/scripts, Fontshare fonts (woff2 only) and every
image (re-encoded as WebP through the Prismic / Vercel image CDNs) as data URIs.

Usage: python3 tools/build_embed.py index.src.html index.html
       python3 tools/build_embed.py opsi-b/index.src.html opsi-b/index.html
"""
import base64
import hashlib
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

CACHE = Path(__file__).resolve().parent / '.cache'
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
MAX_W = 1600


def fetch(url, accept='*/*'):
    """Download with a disk cache; returns (bytes, content-type)."""
    CACHE.mkdir(exist_ok=True)
    key = CACHE / hashlib.sha1(url.encode()).hexdigest()
    meta = key.with_suffix('.type')
    if key.exists() and meta.exists():
        return key.read_bytes(), meta.read_text()
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': accept})
    with urllib.request.urlopen(req, timeout=60) as r:
        data, ctype = r.read(), r.headers.get_content_type()
    key.write_bytes(data)
    meta.write_text(ctype)
    return data, ctype


def data_uri(data, ctype):
    return f'data:{ctype};base64,{base64.b64encode(data).decode()}'


def image_uri(url):
    """Re-encode an image as WebP at a sensible width and return a data URI."""
    url = url.replace('&amp;', '&')
    parts = urllib.parse.urlsplit(url)
    query = dict(urllib.parse.parse_qsl(parts.query))
    width = min(int(query.get('w', MAX_W)), MAX_W)

    if parts.netloc == 'images.prismic.io':
        src = f'https://images.prismic.io{parts.path}?auto=compress&fm=webp&q=72&w={width}'
    elif parts.netloc == 'hunthire.id' and parts.path.endswith('.png'):
        src = f'https://hunthire.id/_vercel/image?url={urllib.parse.quote(parts.path, safe="")}&w=2000&q=95'
    else:
        src = url
    data, ctype = fetch(src, accept='image/webp,image/*')
    return data_uri(data, ctype)


def fontshare_css(url):
    """Fetch Fontshare CSS and inline the woff2 file of each @font-face."""
    css, _ = fetch(url, accept='text/css')
    css = css.decode()

    def inline(m):
        block = m.group(0)
        woff2 = re.search(r"url\(['\"]?([^'\")]+\.woff2)['\"]?\)", block)
        if not woff2:
            return block
        font_url = urllib.parse.urljoin('https:', woff2.group(1))
        data, _ = fetch(font_url)
        src = f"src: url('{data_uri(data, 'font/woff2')}') format('woff2');"
        return re.sub(r'src:[^;]+;', src, block, count=1)

    return re.sub(r'@font-face\s*{[^}]+}', inline, css)


def read_text(href, base):
    if href.startswith(('http://', 'https://')):
        return fetch(href)[0].decode()
    return (base / href).read_text()


def inline_data_js(js):
    """data.js builds image URLs at runtime via img(path, w); bake them as data URIs."""
    def repl(m):
        w = m.group(2) or '900'
        return "'" + image_uri(f'https://images.prismic.io/hunthire/{m.group(1)}?w={w}') + "'"

    return re.sub(r"img\('([^']+)'(?:,\s*(\d+))?\)", repl, js)


def build(src_path, out_path):
    src = Path(src_path).resolve()
    base = src.parent
    html = src.read_text()

    html = re.sub(r'\s*<link rel="preconnect"[^>]*>', '', html)

    def style(m):
        href = m.group(1)
        css = fontshare_css(href) if 'fontshare.com' in href else read_text(href, base)
        return f'<style>\n{css}\n</style>'

    html = re.sub(r'<link rel="stylesheet" href="([^"]+)"\s*/?>', style, html)

    def script(m):
        href = m.group(1)
        js = read_text(href, base)
        if href.endswith('data.js'):
            js = inline_data_js(js)
        js = js.replace('</script', '<\\/script')
        return f'<script>\n{js}\n</script>'

    html = re.sub(r'<script src="([^"]+)"></script>', script, html)

    html = re.sub(r'src="(https://(?:images\.prismic\.io|hunthire\.id)/[^"]+)"', lambda m: f'src="{image_uri(m.group(1))}"', html)

    Path(out_path).write_text(html)
    left = re.findall(r'(?:src|href)="https?://[^"]+\.(?:js|css|png|jpe?g|webp)[^"]*"', html)
    print(f'{out_path}: {len(html) / 1024 / 1024:.2f} MB, external assets left: {len(left)}')


if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2])
