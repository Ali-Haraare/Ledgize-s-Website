# Ledgize Website

Single-page marketing site for Ledgize, a firm helping Shopify, Amazon, and eBay
sellers get real-time visibility into true profit margins, backed by
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
js/script.js          — mobile nav toggle + contact form validation/mailto handoff
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

The site ships with a commented-out Cloudflare Web Analytics snippet in `index.html`'s `<head>`.
It's cookie-less and collects no personal data, so no cookie-consent banner is needed for it.
To enable: create a free Cloudflare account, add `ledgize.com` under Analytics → Web Analytics,
copy the token into the snippet, and uncomment it.

## Content notes

- No pricing figures, client logos, or testimonials are published: per the site spec, none exist
  yet and pricing is confirmed on a call.
- The About section is intentionally firm-branded ("our founder") rather than naming or
  photographing the founder, pending confirmation from the founder.
- `terms.html` has a placeholder for the governing-law jurisdiction; fill this in once the
  business entity is formally registered.
- The contact form hands off to a `mailto:` link rather than a backend (no server, no database,
  per spec). It validates input and includes a honeypot field against basic bots, but actual
  message delivery still depends on the visitor's email client and on their sending the email.
