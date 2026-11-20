#!/usr/bin/env python3
"""Build the Guides section of ledgize.com.

Each guide is one file in _guides/ : a short header between two "---" lines,
then the article body as HTML. This script turns them into plain HTML pages:

  guides/index.html        the list of guides
  guides/<slug>.html       one page per guide
  guides/feed.xml          an RSS feed of published guides
  sitemap.xml              guide URLs, between the "guides" markers

The header and footer are copied from index.html and privacy.html, so a
change to the site's menu or footer reaches every guide on the next build.

Folders that start with "_" are not published by GitHub Pages, so the
sources in _guides/ and this script stay private.

Usage, from the repository root:
  python3 _tools/build_guides.py              published guides only
  python3 _tools/build_guides.py --drafts     include drafts (preview only)

Header fields for a guide:
  title, description, category, date (YYYY-MM-DD), updated (optional),
  draft (true or false)
The page address comes from the file name: _guides/my-guide.html becomes
/guides/my-guide.html
"""

import datetime as dt
import html
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_guides")
OUT = os.path.join(ROOT, "guides")
SITE = "https://www.ledgize.com"
BOOKING = "https://calendar.app.google/x4VN65FmpogkEirC7"
LINKEDIN = "https://www.linkedin.com/in/abdullahi-ali-21b149436"
CATEGORIES = [
    "Payouts & revenue",
    "Inventory & product costs",
    "Ads & margins",
    "Cash flow",
    "Sales tax",
]


def read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return f.read()


def block(text, start, end):
    i = text.index(start)
    j = text.index(end, i) + len(end)
    return text[i:j]


def absolute_links(fragment):
    """Make relative href/src values start at the site root."""

    def fix(m):
        attr, quote, value = m.group(1), m.group(2), m.group(3)
        if re.match(r"(https?:|mailto:|/|data:)", value):
            return m.group(0)
        if value == "#top":
            return f"{attr}={quote}/"
        if value.startswith("#"):
            return f"{attr}={quote}/{value}"
        return f"{attr}={quote}/{value}"

    return re.sub(r"\b(href|src)=([\"'])([^\"']+)", fix, fragment)


def site_parts():
    index = read("index.html")
    privacy = read("privacy.html")
    header = absolute_links(block(index, '<header class="site-header">', "</header>"))
    header = header.replace('href="/guides/"', 'href="/guides/" aria-current="page"')
    footer = absolute_links(block(privacy, '<footer class="site-footer">', "</footer>"))
    css_version = re.search(r"styles\.css\?v=(\d+)", index).group(1)
    js = re.search(r'<script src="js/script\.js\?v=\d+"></script>', privacy).group(0)
    js = js.replace('src="js/', 'src="/js/')
    analytics = re.search(r"<!-- Cloudflare Web Analytics -->.*?<!-- End Cloudflare Web Analytics -->", privacy).group(0)
    return header, footer, css_version, js, analytics


def parse(path):
    text = open(path, encoding="utf-8").read()
    m = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S)
    if not m:
        sys.exit(f"{path}: missing the header between --- lines")
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    for field in ("title", "description", "category", "date"):
        if not meta.get(field):
            sys.exit(f"{path}: missing '{field}'")
    if meta["category"] not in CATEGORIES:
        sys.exit(f"{path}: category must be one of {CATEGORIES}")
    meta["slug"] = os.path.splitext(os.path.basename(path))[0]
    meta["date"] = dt.date.fromisoformat(meta["date"])
    meta["updated"] = dt.date.fromisoformat(meta["updated"]) if meta.get("updated") else meta["date"]
    meta["draft"] = meta.get("draft", "false").lower() == "true"
    meta["body"] = m.group(2).strip()
    words = len(re.sub(r"<[^>]+>", " ", meta["body"]).split())
    meta["minutes"] = max(1, round(words / 220))
    return meta


def nice_date(d):
    return d.strftime("%B %-d, %Y")


def head(title, description, url, css_version, og_type, extra=""):
    t, d = html.escape(title), html.escape(description)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <title>{t}</title>
  <meta name="description" content="{d}" />
  <link rel="canonical" href="{url}" />
  <meta property="og:type" content="{og_type}" />
  <meta property="og:site_name" content="Ledgize" />
  <meta property="og:title" content="{t}" />
  <meta property="og:description" content="{d}" />
  <meta property="og:url" content="{url}" />
  <meta property="og:image" content="{SITE}/assets/og-image.png?v=4" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{t}" />
  <meta name="twitter:description" content="{d}" />
  <meta name="twitter:image" content="{SITE}/assets/og-image.png?v=4" />
  <link rel="alternate" type="application/rss+xml" title="Ledgize Guides" href="/guides/feed.xml" />
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/favicon-32.png?v=2" sizes="32x32" type="image/png">
  <link rel="icon" href="/assets/favicon-192.png" sizes="192x192" type="image/png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="shortcut icon" href="/favicon.ico?v=2" />
  <link rel="preload" href="/assets/fonts/source-serif4-600.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/assets/fonts/public-sans-400.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/css/styles.css?v={css_version}" />{extra}
</head>
<body>

  <a href="#main-content" class="skip-link">Skip to main content</a>

"""


def tail(footer, js, analytics):
    return f"""
  {footer}

  {js}
  {analytics}
</body>
</html>
"""


def cta_box():
    return f"""<aside class="guide-cta">
          <p class="guide-cta-title">Not sure what your own books are hiding?</p>
          <p>The Free Books Health Check is a 30-minute call and a read-only review of your books. Within three business days of access, you get a one-page summary of what we found. No cost and no obligation.</p>
          <div class="guide-cta-actions">
            <a href="{BOOKING}" target="_blank" rel="noopener noreferrer" class="btn btn-on-navy">Book Your Free Books Health Check</a>
            <a href="/#sample" class="guide-cta-link">See a sample monthly package</a>
          </div>
        </aside>"""


def author_box():
    return f"""<aside class="guide-author">
          <img src="/assets/ali-founder.jpg" alt="Ali, founder of Ledgize" width="400" height="400" loading="lazy" class="guide-author-photo" />
          <div>
            <p class="guide-author-name">Written by Ali</p>
            <p class="guide-author-role">Founder of Ledgize. A2X-certified bookkeeper and QuickBooks Online ProAdvisor, working only with Shopify, Amazon and eBay sellers.</p>
            <p class="about-linkedin"><a href="{LINKEDIN}" target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a></p>
          </div>
        </aside>"""


def card(g):
    draft = ' <span class="guide-draft">Draft</span>' if g["draft"] else ""
    return f"""<article class="guide-card">
            <p class="guide-card-cat">{html.escape(g['category'])}{draft}</p>
            <h2 class="guide-card-title"><a href="/guides/{g['slug']}.html">{html.escape(g['title'])}</a></h2>
            <p class="guide-card-desc">{html.escape(g['description'])}</p>
            <p class="guide-card-meta">{nice_date(g['date'])} &#183; {g['minutes']} min read</p>
          </article>"""


def build_post(g, others, parts):
    header, footer, css_version, js, analytics = parts
    url = f"{SITE}/guides/{g['slug']}.html"
    ld = {
        "title": g["title"].replace('"', '\\"'),
        "desc": g["description"].replace('"', '\\"'),
    }
    schema = f"""
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{ld['title']}",
    "description": "{ld['desc']}",
    "datePublished": "{g['date'].isoformat()}",
    "dateModified": "{g['updated'].isoformat()}",
    "mainEntityOfPage": "{url}",
    "image": "{SITE}/assets/og-image.png?v=4",
    "author": {{ "@type": "Person", "name": "Ali", "url": "{LINKEDIN}" }},
    "publisher": {{ "@type": "Organization", "name": "Ledgize", "logo": {{ "@type": "ImageObject", "url": "{SITE}/assets/ledgize-logo-full-1200.png" }} }}
  }}
  </script>"""
    if g["draft"]:
        schema += '\n  <meta name="robots" content="noindex" />'
    updated = ""
    if g["updated"] != g["date"]:
        updated = f" &#183; Updated {nice_date(g['updated'])}"
    more = ""
    if others:
        cards = "\n          ".join(card(o) for o in others[:2])
        more = f"""
      <section class="guides-more">
        <div class="container">
          <h2 class="guides-more-title">More guides</h2>
          <div class="guides-grid">
          {cards}
          </div>
        </div>
      </section>"""
    page = head(f"{g['title']}: Ledgize Guides", g["description"], url, css_version, "article", schema)
    page += f"""  {header}

  <main id="main-content" tabindex="-1">
    <article class="guide">
      <div class="container guide-inner">
        <nav class="guide-crumbs" aria-label="Breadcrumb"><a href="/guides/">Guides</a> <span aria-hidden="true">/</span> {html.escape(g['category'])}</nav>
        <h1 class="guide-title">{html.escape(g['title'])}</h1>
        <p class="guide-dek">{html.escape(g['description'])}</p>
        <p class="guide-meta"><img src="/assets/ali-founder.jpg" alt="" width="400" height="400" class="guide-meta-photo" /> By Ali &#183; {nice_date(g['date'])}{updated} &#183; {g['minutes']} min read</p>

        <div class="guide-body">
{g['body']}
        </div>

        <p class="guide-disclaimer">This guide is general information, not tax, legal or accounting advice for your business. For anything about sales tax or filing, check with your CPA.</p>

        {author_box()}

        {cta_box()}
      </div>
    </article>{more}
  </main>
"""
    page += tail(footer, js, analytics)
    return page


def build_index(guides, parts):
    header, footer, css_version, js, analytics = parts
    url = f"{SITE}/guides/"
    title = "Guides: Ledgize"
    desc = "Plain-English guides for Shopify, Amazon and eBay sellers: what goes wrong in the books, why it happens, and what fixed looks like."
    cards = "\n          ".join(card(g) for g in guides) or '<p class="guides-empty">The first guides are on their way.</p>'
    page = head(title, desc, url, css_version, "website")
    page += f"""  {header}

  <main id="main-content" tabindex="-1">
    <section class="section guides-hero">
      <div class="container">
        <div class="kicker center">
          <span class="kicker-label">Guides</span>
        </div>
        <h1 class="section-title center">Plain-English fixes for the money problems sellers run into.</h1>
        <p class="section-lead center">Short guides for Shopify, Amazon and eBay sellers: what goes wrong in the books, why it happens, and what fixed looks like. Free to read, written by Ali, founder of Ledgize.</p>
        <div class="guides-grid guides-grid-index">
          {cards}
        </div>
        <p class="calc-promo"><strong>Free tool:</strong> <a href="/tools/margin-calculator.html">See what each of your channels really keeps with the true margin calculator</a></p>
        <div class="guides-index-cta">
          {cta_box()}
        </div>
      </div>
    </section>
  </main>
"""
    page += tail(footer, js, analytics)
    return page


def build_feed(guides):
    items = []
    for g in guides:
        link = f"{SITE}/guides/{g['slug']}.html"
        pub = dt.datetime.combine(g["date"], dt.time(12)).strftime("%a, %d %b %Y %H:%M:%S +0000")
        items.append(f"""    <item>
      <title>{html.escape(g['title'])}</title>
      <link>{link}</link>
      <guid>{link}</guid>
      <pubDate>{pub}</pubDate>
      <description>{html.escape(g['description'])}</description>
    </item>""")
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Ledgize Guides</title>
    <link>{SITE}/guides/</link>
    <description>Plain-English guides for Shopify, Amazon and eBay sellers.</description>
{chr(10).join(items)}
  </channel>
</rss>
"""


def update_sitemap(guides):
    path = os.path.join(ROOT, "sitemap.xml")
    s = open(path, encoding="utf-8").read()
    start, end = "  <!-- guides:start -->", "  <!-- guides:end -->"
    if start not in s:
        s = s.replace("</urlset>", f"{start}\n{end}\n</urlset>")
    entries = []
    if guides:
        newest = max(g["updated"] for g in guides)
        entries.append(f"""  <url>
    <loc>{SITE}/guides/</loc>
    <lastmod>{newest.isoformat()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>""")
        for g in guides:
            entries.append(f"""  <url>
    <loc>{SITE}/guides/{g['slug']}.html</loc>
    <lastmod>{g['updated'].isoformat()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>""")
    inner = "\n".join(entries)
    s = re.sub(re.escape(start) + r".*?" + re.escape(end), start + ("\n" + inner if inner else "") + "\n" + end, s, flags=re.S)
    open(path, "w", encoding="utf-8").write(s)


def build_calculator(parts):
    header, footer, css_version, js, analytics = parts
    header = header.replace(' aria-current="page"', "")
    url = f"{SITE}/tools/margin-calculator.html"
    title = "True margin calculator: Ledgize"
    desc = ("Free calculator for Shopify, Amazon and eBay sellers. Enter a month of sales, refunds, product cost, "
            "fees, fulfilment and ads, and see what each channel really keeps.")
    body = read("_tools/margin-calculator.body.html").rstrip()
    page = head(title, desc, url, css_version, "website")
    page += f"""  {header}

  <main id="main-content" tabindex="-1">
{body}
  </main>
"""
    page += tail(footer, js, analytics).replace(
        "\n  " + analytics, '\n  <script src="/js/margin-calculator.js?v=1"></script>\n  ' + analytics)
    return page


def main():
    drafts = "--drafts" in sys.argv
    parts = site_parts()
    all_guides = [parse(os.path.join(SRC, f)) for f in sorted(os.listdir(SRC)) if f.endswith(".html")]
    shown = [g for g in all_guides if drafts or not g["draft"]]
    shown.sort(key=lambda g: (g["date"], g["title"]), reverse=True)
    published = [g for g in shown if not g["draft"]]

    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):
        if f.endswith(".html") or f == "feed.xml":
            os.remove(os.path.join(OUT, f))
    for g in shown:
        others = [o for o in shown if o is not g]
        with open(os.path.join(OUT, f"{g['slug']}.html"), "w", encoding="utf-8") as f:
            f.write(build_post(g, others, parts))
    with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as f:
        f.write(build_index(shown, parts))
    with open(os.path.join(OUT, "feed.xml"), "w", encoding="utf-8") as f:
        f.write(build_feed(published))
    update_sitemap(published)
    os.makedirs(os.path.join(ROOT, "tools"), exist_ok=True)
    with open(os.path.join(ROOT, "tools", "margin-calculator.html"), "w", encoding="utf-8") as f:
        f.write(build_calculator(parts))
    print(f"Built {len(shown)} guide(s) ({len(published)} published, {len(shown) - len(published)} draft).")


if __name__ == "__main__":
    main()
