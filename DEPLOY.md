# Deploying this private app

This repo is **private** (it holds real GST data), so GitHub Pages on the free
plan can't host it. Use Vercel, Netlify, or Cloudflare Pages instead — all can
deploy from a private repo for free. It's a static site (no build step).

## Option A — Vercel (simplest)

1. Go to <https://vercel.com> → sign up / log in **with GitHub**.
2. **Add New… → Project** → import `vinisha231/gst-rent-filing-helper`
   (authorize Vercel to see the private repo if asked).
3. Framework preset: **Other**. Build command: *(empty)*. Output dir: *(empty/root)*.
   `vercel.json` already sets the rest.
4. **Deploy.** You'll get a URL like `gst-rent-filing-helper.vercel.app`.

## Option B — Netlify

1. <https://app.netlify.com> → log in **with GitHub**.
2. **Add new site → Import an existing project** → pick this repo.
3. Build command: *(empty)*, Publish directory: `.` (already set in `netlify.toml`).
4. **Deploy.**

## Option C — Cloudflare Pages (free password/email gate)

1. <https://dash.cloudflare.com> → **Workers & Pages → Create → Pages** →
   connect this repo. Build command empty, output dir `/`.
2. To require a login before anyone can view it, add **Cloudflare Access**
   (Zero Trust → Access → Applications): create a self-hosted app for the Pages
   URL with an **email OTP** policy. Free for up to 50 users.

## Keeping it confidential

A plain Vercel/Netlify free URL is **public to anyone who has the link** (no
login). For real protection:

- **Cloudflare Access** (Option C) — free email-login gate.
- **Netlify** / **Vercel** site password — available on their paid tiers.
- Or just keep it **private + local**: open `index.html` directly on the
  machine that needs it; nothing is published at all.

The `X-Robots-Tag: noindex` header (already configured) keeps the site out of
Google regardless of host.
