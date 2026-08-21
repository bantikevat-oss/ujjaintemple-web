# Self-hosted fonts — UjjainTemple.com

Added 2026-08-21. Before this, `globals.css` referenced these six files but they had
never been uploaded, so every page load fired six 404s and fell through to the system
fallback stack — the intended typefaces were reaching nobody.

| File | Family | Weight | Subset |
|---|---|---|---|
| `dmsans-variable.woff2` | DM Sans | 400–700 (variable) | latin |
| `cormorant-700.woff2` | Cormorant Garamond | 700 | latin |
| `notosans-devanagari-variable.woff2` | Noto Sans Devanagari | 400–700 (variable) | devanagari |
| `tiro-devanagari-400.woff2` | Tiro Devanagari Sanskrit | 400 | devanagari |

**Why only four files for six faces:** DM Sans and Noto Sans Devanagari are variable
fonts, and Google serves a **byte-identical** file for weight 400 and weight 700
(confirmed by md5, 2026-08-21). Downloading them as `-400` and `-700` made a Hindi
page fetch the same 118 KB twice. Each is now one `@font-face` with
`font-weight: 400 700`, and the browser instances the weight from the variable font.

Source: the woff2 builds served by `fonts.googleapis.com/css2` (Chrome UA), fetched
directly from `fonts.gstatic.com`. Only the subset each face is actually used for is
included — the `unicode-range` declarations in `globals.css` match these subsets.

**Licence:** all six are SIL Open Font License 1.1, which permits self-hosting and
redistribution as part of a website. Full text: https://openfontlicense.org

## To update
Re-fetch the CSS for the family from Google Fonts with a modern browser User-Agent,
pull the `url(...)` for the matching subset, and replace the file. Keep the filenames —
`globals.css` refers to them by name.

## Do not add preloads
`index.html` is shared by both locales. A `<link rel=preload>` here would pull the
Devanagari faces on English pages and DM Sans on Hindi pages, and would defeat the
`local()` source that lets Android devices skip the 118 KB Noto download.
