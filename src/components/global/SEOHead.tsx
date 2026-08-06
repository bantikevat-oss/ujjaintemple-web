import { Head } from 'vite-react-ssg';
import type { ReactNode } from 'react';
import { buildHreflang, type SeoMeta } from '../../lib/seo';
import { SITE } from '../../lib/site';

interface Props extends SeoMeta {
  schemas?: unknown[];
  children?: ReactNode;
}

export function SEOHead({ title, description, path, locale, image, type = 'website', publishedTime, modifiedTime, schemas = [], children }: Props) {
  const canonical = locale === 'en' ? `${SITE.url}${path}` : `${SITE.url}/hi${path}`;
  const hreflangs = buildHreflang(path);
  const ogImage = image || `${SITE.url}/og/default.webp`;

  return (
    <>
    <Head>
      {/* charset MUST be emitted first. react-helmet injects this block ahead of the
          static tags in index.html, which pushed the template's <meta charset> to
          ~byte 5000 — far past the 1024-byte window browsers scan, forcing an
          encoding guess and a parser restart on every page. */}
      <meta charSet="UTF-8" />
      <html lang={locale === 'hi' ? 'hi-IN' : 'en-IN'} />
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* ── Core SEO ────────────────────────────────────────────────────────── */}
      {/* <meta name="keywords"> intentionally removed: Google dropped support in 2009 and
          Bing treats stuffing as a negative signal. The same 812-char blob shipped on
          every page, made all 442 pages look topically identical, and delayed charset. */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="author" content="UjjainTemple Editorial — ByteFlow Technologies" />
      <meta name="theme-color" content="#8b1a1a" />
      <meta name="format-detection" content="telephone=yes" />

      {/* ── Geo tags — boosts local/map search ranking ──────────────────────── */}
      <meta name="geo.region" content="IN-MP" />
      <meta name="geo.placename" content="Ujjain, Madhya Pradesh, India" />
      <meta name="geo.position" content="23.1828;75.7682" />
      <meta name="ICBM" content="23.1828, 75.7682" />

      {/* ── Language & Content signals ───────────────────────────────────────── */}
      <meta httpEquiv="content-language" content={locale === 'hi' ? 'hi-IN' : 'en-IN'} />
      <meta name="language" content={locale === 'hi' ? 'Hindi' : 'English'} />

      {/* ── Canonical & Alternates ──────────────────────────────────────────── */}
      <link rel="canonical" href={canonical} />
      {hreflangs.map((h) => (
        <link key={h.hreflang} rel="alternate" hrefLang={h.hreflang} href={h.href} />
      ))}

      {/* ── Preconnect ──────────────────────────────────────────────────────── */}
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="dns-prefetch" href="https://maps.google.com" />

      {/* ── Open Graph ──────────────────────────────────────────────────────── */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/webp" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content={locale === 'hi' ? 'hi_IN' : 'en_IN'} />
      <meta property="og:locale:alternate" content={locale === 'hi' ? 'en_IN' : 'hi_IN'} />
      <meta property="og:site_name" content="Ujjain Temple — Ujjain Mandir, Puja & Travel Guide" />

      {/* ── Twitter / X Card ────────────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ujjaintemple" />
      <meta name="twitter:creator" content="@ujjaintemple" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* ── Article-specific ────────────────────────────────────────────────── */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === 'article' && <meta property="article:author" content="UjjainTemple Editorial" />}
      {type === 'article' && <meta property="article:publisher" content={SITE.social.facebook} />}
      {type === 'article' && <meta property="article:section" content="Religion & Spirituality" />}

      {children}
    </Head>
    {/* ── Structured data — render in BODY: vite-react-ssg <Head> strips ld+json during SSG (P0 fix 2026-06-18) ── */}
    {schemas.map((s, i) => (
      <script key={`ld-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
    ))}
    </>
  );
}
