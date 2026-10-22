# jupmush.com

Website of Jupiter Mushroom Association (목성버섯연합), served by GitHub Pages.

- Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui. Every page is its own Vite entry
  (`vite.config.ts`), so `dist/<path>/index.html` serves each URL on Pages:
  - `/` and `/ko/`: the studio home (`src/HomePage.tsx`), light, colors from the studio logo palette
    (`src/index.css`, `:root`).
  - `/games/night-of-vargold/` and `/ko/games/night-of-vargold/`: the game page (`src/VargoldPage.tsx`).
    Its night colors and paper art (`.theme-vargold`, `.paper-sheet`, `.paper-button`) follow
    `PaperVillage/docs/world-assets/style-guide.md`. Each future game gets its own page and theme;
    the header and footer stay the studio's.
  - `/privacy/`: the play data privacy policy (`PaperVillage/docs/play-data.md`), English only. The
    game links to this URL, so it stays put. Update it whenever the play data changes.
  - `/playdata/`: the play data admin page; keeps the earlier dark look (`.theme-navy`).
- Each HTML file holds its page's `lang`, title, description, Open Graph tags and `hreflang` links; the
  page script reads the language from `<html lang>` (`src/lib/lang.ts`).
- Page text lives in `src/content.ts`. The Night of Vargold text is the game's Steam store text
  (English and Korean, Steamworks, 2026-10-22). The free demo section is left out until the demo is
  out. The trailer and Steam buttons appear once `vargoldLinks` has their URLs; a trailer embed must
  carry the music credit from the Steam page.
- Fonts: Geist (Latin), Pretendard (Korean, dynamic subset) and Gaegu for the game page headings,
  all SIL OFL 1.1, bundled from npm. No analytics and no cookies (the privacy policy says so).
- `.github/workflows/deploy.yml` builds and deploys `dist/` on every push to `main`
  (Pages source: GitHub Actions).
- `public/CNAME` keeps the custom domain `jupmush.com`.

## Images

No images are drawn with code.

- `public/images/logo.png`: the studio pixel-art logo (48×64), provided by the user. Shown only at
  integer scales with `image-rendering: pixelated`; also the favicon.
- `public/images/games/night-of-vargold/`, resized to WebP from PaperVillage files made with an image
  generation tool (records next to the sources):
  - `hero.webp` (2400 wide), `card.webp`, `title.webp` (transparent margins trimmed) and
    `public/images/og.jpg`: `docs/world-assets/steam/2026-10-21/storybook-release/upload/`
    `library-hero.png`, `full-main.png`, `full-library-logo.png` and `full-header.png`.
  - `paper.webp`, `button-gold.webp` (half size): the game's UI paper,
    `Assets/PaperVillage/Resources/UI/Battle/PaperArt/settings-paper.png` and `button-gold.png`
    (record: `docs/world-assets/ui/paper-backgrounds-prompts.md`). The border-image slices in
    `src/index.css` count pixels of these WebP files.
  - `shots/en/`, `shots/ko/` (1600 wide): real play screenshots,
    `docs/world-assets/steam/screenshots-2026-10-22/`.

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
