# -*- coding: utf-8 -*-
import importlib.util
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("emit_utf8", ROOT / "emit_utf8.py")
e = importlib.util.module_from_spec(spec)
spec.loader.exec_module(e)

html = e.polish_index(e.INDEX_HTML)
js = e.polish_js(e.SCRIPT_JS)
css = e.read_style_css()

e.write_utf8_no_bom("index.html", html)
e.write_utf8_no_bom("script.js", js)
e.write_utf8_no_bom("style.css", css)
print("OK: index.html, script.js, style.css (UTF-8 sem BOM)")
