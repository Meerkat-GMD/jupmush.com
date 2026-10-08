# jupmush.com

Website of Jupiter Mushroom Association (목성버섯연합), served by GitHub Pages.

- One static page: `index.html` + `styles.css`, no build step.
- `images/` holds resized in-game screenshots of *The Night-Eating Wolf and the Paper Village*
  (source: `PaperVillage/docs/itch/screenshots/*-en.png`). No images are drawn with code.
- `CNAME` binds the custom domain `jupmush.com`.

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
