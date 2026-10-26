#!/usr/bin/env python3
"""Assemble the single-file Creative Haider project brief.

Reads the source parts in src/ and writes ../index.html (plus a check copy of
the browser script for `node --check`). No third-party build tools required.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"


def read(name: str) -> str:
    return (SRC / name).read_text(encoding="utf-8").strip()


def main() -> int:
    logo = read("logo-payload.txt")
    data = read("data-model.js")
    css = read("style.css")
    body = read("body.html")
    js = (SRC / "app.js").read_text(encoding="utf-8")

    # Guard: every question key must be unique, or answers overwrite each other.
    keys = re.findall(r"^\['(\w+)'", data, flags=re.M)
    dupes = sorted({k for k in keys if keys.count(k) > 1})
    if dupes:
        print(f"ERROR: duplicate question keys: {dupes}", file=sys.stderr)
        return 1

    js = js.replace('"__LOGO__"', '"data:image/webp;base64,' + logo + '"')
    js = js.replace("/*__DATA_MODEL__*/", data)

    for placeholder in ("__LOGO__", "__DATA_MODEL__"):
        if placeholder in js:
            print(f"ERROR: placeholder {placeholder} was not replaced", file=sys.stderr)
            return 1

    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Project brief | Creative Haider</title>
<meta name="description" content="A short client project brief for Creative Haider. Tell us what you need and we will prepare a clear plan, timeline and quote.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#15171C">
<meta name="color-scheme" content="light">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
{body}
<script>
{js}
</script>
</body>
</html>
"""

    out = ROOT / "index.html"
    out.write_text(html, encoding="utf-8")

    check = ROOT / "_app.check.js"
    check.write_text(js, encoding="utf-8")

    print(f"index.html   {out.stat().st_size:,} bytes")
    print(f"script       {len(js):,} chars")
    print(f"css          {len(css):,} chars")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
