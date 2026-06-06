# UjjainTemple.com

Ujjain's bilingual (Hindi + English) authoritative guide — 35+ mandirs, Simhastha 2028, hotels, transport, tour itineraries, puja info.

**Lead-gen primary:** +91 74007 24456 prominent on every page.

## Stack

- Vite 5 + React 18 + TypeScript
- TailwindCSS 3 (Saffron + Maroon + Gold + Cream palette — NO GREEN per global rule)
- `vite-react-ssg` for static site generation
- Self-hosted fonts (no Google Fonts CDN)
- Pagefind static search
- Hostinger origin + Cloudflare CDN

## Quick Start

```bash
npm install
npm run dev        # vite dev server at :5173
npm run build      # SSG build → /dist/
npm run preview    # serve /dist/ at :4173
```

## Project Structure

```
src/
├── components/         React components (global + per-vertical)
├── content/            JSON content per page (single source of truth)
├── data/               glob importers for content
├── lib/                seo, site config, schemas, types
├── locales/hi + en     i18n strings
├── pages/              route components
├── styles/             globals.css with Tailwind + custom layers
├── i18n.tsx            I18nProvider context
├── routes.tsx          vite-react-ssg route definitions
└── main.tsx            entry point
```

## Content Authoring

All content lives in `/src/content/<vertical>/<slug>.json`. Add a new mandir = add a JSON file matching `Mandir` type in `src/lib/types.ts`. Re-run `npm run build`.

For full requirements, see [`../REQUIREMENTS.md`](../REQUIREMENTS.md).
For deploy steps, see [`../ACTION-ITEMS.md`](../ACTION-ITEMS.md).

## Lead Form Endpoint

POST `/api/lead.php` receives lead submissions, stores to `leads.csv` on Hostinger, emails to ByteFlow team. CSV is blocked from public access via `.htaccess`.

## SEO

- Bilingual hreflang on every page
- JSON-LD per page type: PlaceOfWorship (mandir), Hotel, Article, Event, FAQPage, BreadcrumbList, LocalBusiness
- Self-hosted fonts to minimize TTFB
- GTM deferred 2.5s after load (Mangaldosh pattern)
- Sitemap auto-generated at `/sitemap.xml`

## Performance Targets

PageSpeed Insights:
- Mobile: ≥ 95
- Desktop: 100

Core Web Vitals:
- LCP < 1.2s mobile
- CLS < 0.05
- INP < 100ms

## License

Private — ByteFlow Technologies / Aman Shivhare.
