# Ledgize Website

Single-page marketing site for Ledgize, a firm helping Shopify and Amazon
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

The site ships with a commented-out GA4 snippet in `index.html`'s `<head>`, used only as a
fallback until a Plausible account exists (Plausible is the preferred, cookie-less option that
needs no consent banner). To enable the GA4 fallback: replace `G-XXXXXXXXXX` with a real
Measurement ID and uncomment the block. Note GA4 sets cookies, so going that route instead of
switching to Plausible means adding a cookie-consent banner.

## Content notes

- Foundation and Growth show rough pricing ranges; Scale's pricing is withheld until it launches
  (see below). Exact scope and investment are still confirmed on a call per tier's custom scoring.
- Scale is not yet an active offering (launching January 2027) — its card shows a "Launching"
  label and a disabled button instead of a live CTA.
- The site serves Shopify and Amazon sellers only; eBay support and Xero support are both paused.
- The About section is intentionally firm-branded ("our founder") rather than naming or
  photographing the founder, pending confirmation from the founder.
- `terms.html` has a placeholder for the governing-law jurisdiction; fill this in once the
  business entity is formally registered.
- The primary conversion path is a direct Calendly link (opens in a new tab). The old mailto
  contact form was removed as redundant; "Prefer email?" still links to `ali@ledgize.com`.
