# Self-hosted fonts — UjjainTemple.com

Added 2026-08-21. Before this, `globals.css` referenced these six files but they had
never been uploaded, so every page load fired six 404s and fell through to the system
fallback stack — the intended typefaces were reaching nobody.

| File | Family | Weight | Subset |
|---|---|---|---|
| `dmsans-400.woff2` | DM Sans | 400 | latin |
| `dmsans-700.woff2` | DM Sans | 700 | latin |
| `cormorant-700.woff2` | Cormorant Garamond | 700 | latin |
| `notosans-devanagari-400.woff2` | Noto Sans Devanagari | 400 | devanagari |
| `notosans-devanagari-700.woff2` | Noto Sans Devanagari | 700 | devanagari |
| `tiro-devanagari-400.woff2` | Tiro Devanagari Sanskrit | 400 | devanagari |

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
