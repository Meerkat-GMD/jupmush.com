# jupmush.com

Website of Jupiter Mushroom Association (목성버섯연합), served by GitHub Pages.

- Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui, styled after a Steam store game page
  (colors and layout only; no Steam logos or trademarks).
- Page text lives in `src/content.ts`; the English game description comes from
  `PaperVillage/docs/itch/store-page.md`.
- `.github/workflows/deploy.yml` builds and deploys `dist/` on every push to `main`
  (Pages source: GitHub Actions).
- `public/CNAME` keeps the custom domain `jupmush.com`.

## Images

No images are drawn with code.

- `public/images/shots/`, `public/images/thumbs/`: resized in-game screenshots
  (`PaperVillage/docs/itch/screenshots/*-en.png`).
- `public/images/capsule.jpg`, `public/images/og.jpg`: resized from
  `PaperVillage/docs/design/capsule/2026-10-08/capsule-concept-a-en-bottom-title.png`,
  made with an image generation tool (record: `generation-record-en-bottom-title.json`).

## Develop

```bash
npm install
npm run dev
npm run build
```

## DNS (Dynadot)

| Type  | Host  | Value                     |
|-------|-------|---------------------------|
| A     | @     | 185.199.108.153           |
| A     | @     | 185.199.109.153           |
| A     | @     | 185.199.110.153           |
| A     | @     | 185.199.111.153           |
| CNAME | www   | meerkat-gmd.github.io     |

Mail for `gmd1356@jupmush.com` uses Dynadot email forwarding (MX records), which does not
conflict with the records above.
