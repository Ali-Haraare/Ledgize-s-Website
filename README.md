# Ledgize Website

Single-page marketing site for Ledgize — a firm helping Shopify, Amazon, and eBay
sellers get real-time visibility into true profit margins, backed by
executive-level financial advisory.

Static HTML/CSS/vanilla JS, no build step, no backend.

## Structure

```
index.html        — all page sections
css/styles.css     — styles (navy #1F3864 / gold #C9A24B brand palette)
js/script.js       — mobile nav toggle + contact form mailto handoff
assets/favicon.svg — site favicon
```

## Local preview

Open `index.html` directly in a browser, or serve the folder with any static
server, e.g.:

```
npx serve .
```

## Deployment

Deploy as a static site to Netlify or Cloudflare Pages (no build command,
publish directory = repo root), then point the `ledgize.com` DNS record at
the host per its instructions.

## Content notes

- No pricing figures, client logos, or testimonials are published — per the
  site spec, none exist yet and pricing is confirmed on a call.
- The About section is intentionally firm-branded ("our founder") rather than
  naming/photographing the founder, pending confirmation from the founder.
