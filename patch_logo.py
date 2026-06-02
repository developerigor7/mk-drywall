# -*- coding: utf-8 -*-
"""Aplica logo oficial e regrava index.html em UTF-8 sem BOM."""
import importlib.util
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent

spec = importlib.util.spec_from_file_location("emit_utf8", ROOT / "emit_utf8.py")
emit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(emit)

html = emit.polish_index(emit.INDEX_HTML)

# Logo oficial
html = html.replace('href="assets/logo.svg"', 'href="assets/logo.png"')
html = html.replace('type="image/svg+xml"', 'type="image/png"')
if 'og:image' not in html:
    html = html.replace(
        '<meta name="theme-color"',
        '<meta property="og:image" content="assets/logo.png">\n  <meta name="theme-color"',
        1,
    )

html = re.sub(
    r'<img src="[^"]*logo[^"]*" alt="MK Drywall Solu[^"]*" width="200" height="[^"]*" loading="eager">',
    '<img src="assets/logo.png" alt="MK Drywall Solu\u00e7\u00f5es" width="200" height="auto" loading="eager">',
    html,
    count=1,
)

html = re.sub(
    r'<div class="hero__logo reveal">\s*<img[^>]+>',
    '<div class="hero__banner reveal">\n          <img src="assets/banner.png" alt="MK Drywall Solu\u00e7\u00f5es \u2014 Solu\u00e7\u00f5es Inteligentes em Constru\u00e7\u00e3o" width="420" height="auto" loading="eager">',
    html,
    count=1,
)
html = html.replace('class="hero__logo reveal"', 'class="hero__banner reveal"')

html = re.sub(
    r'<div class="footer__brand">\s*<img[^>]+>',
    '<div class="footer__brand">\n        <img src="assets/logo.png" alt="MK Drywall Solu\u00e7\u00f5es" width="200" height="auto" loading="lazy">',
    html,
    count=1,
)

emit.write_utf8_no_bom("index.html", html)
print("index.html atualizado com assets/logo.png (UTF-8 sem BOM)")
