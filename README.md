# Ledgize Website

Single-page marketing site for Ledgize, a firm helping Shopify, Amazon and eBay
sellers get clear, current visibility into true profit margins, backed by
executive-level financial advisory.

Static HTML/CSS/vanilla JS, no build step, no backend.

## Structure

```
index.html          — homepage, all sections
privacy.html         — privacy policy
terms.html           — terms & conditions
404.html             — custom not-found page (auto-served by GitHub Pages)
sitemap.xml          — search engine sitemap
robots.txt           — crawler rules
CNAME                — custom domain for GitHub Pages (ledgize.com)
css/styles.css        — design system (navy #1F3864 / gold #C9A24B, self-hosted fonts)
js/script.js          — mobile nav toggle
assets/favicon.svg, favicon.ico, favicon-*.png, apple-touch-icon.png — favicons
assets/og-image.png   — social share preview image (1200x630)
assets/fonts/         — self-hosted Public Sans + Source Serif 4 (static woff2, no Google Fonts CDN)
```

## Local preview

Open `index.html` directly in a browser, or serve the folder with any static
server, e.g.:

```
npx serve .
```

## Deployment (GitHub Pages)

1. Repo Settings → Pages → Source: `Deploy from a branch` → branch `main`, folder `/ (root)`.
2. Repo Settings → Pages → Custom domain: `ledgize.com` (the `CNAME` file in this repo already
   declares this; GitHub will verify it against DNS).
3. DNS at your registrar: point `ledgize.com` at GitHub Pages' A records, and `www` at
   `<your-github-username>.github.io` via CNAME. See GitHub's current IPs in their Pages docs
   before entering them, since they can change.
4. Once DNS verifies, check **Enforce HTTPS** in the same Pages settings screen. This is a manual
   step, not automatic.

## Analytics

Cloudflare Web Analytics (cookie-less, no consent banner needed) runs on all four pages via the
snippet just before `</body>`. The dashboard is in the Cloudflare account under Web Analytics.
The privacy policy's Analytics section describes it; update that section if the tool changes.

## Content notes

- Foundation and Growth show rough pricing ranges; Scale's pricing is withheld until it launches
  (see below). Each client's exact rate is set out in writing in their Health Check summary.
- Scale is not yet an active offering (opening in spring 2027). Its card shows an "Opening in spring 2027"
  label and a disabled button instead of a live CTA.
- The site serves Shopify, Amazon and eBay sellers; Xero support is paused.
- The About section is intentionally firm-branded ("our founder") rather than naming or
  photographing the founder, pending confirmation from the founder.
- `terms.html` names the registered business (Ledgize E-Commerce Financial Systems, a Kenyan
  sole proprietorship, BN-VZSEAWZK) and Kenyan governing law.
- The primary conversion path is a direct Google Calendar booking link (opens in a new tab). The old mailto
  contact form was removed as redundant; "Prefer email?" still links to `ali@ledgize.com`.
