import { Head } from 'vite-react-ssg';
import type { ReactNode } from 'react';
import { buildHreflang, type SeoMeta } from '../../lib/seo';
import { SITE } from '../../lib/site';

interface Props extends SeoMeta {
  schemas?: unknown[];
  children?: ReactNode;
}

// ── Locale-specific keyword sets ──────────────────────────────────────────
// Priority order (Aman locked 2026-06-27): BRAND first ("Ujjain Temple", "Simhastha 2028") → MONEY (Hotel/Taxi-in-Ujjain,
// darshan packages, cab routes, puja services) → SECONDARY brand (specific mandir names).
// VIP-darshan / Bhasma-Aarti-booking / live-darshan terms REMOVED (hard-rule: no temple-side darshan authorization).
const KEYWORDS_HI =
  'उज्जैन के मंदिर, उज्जैन मंदिर, उज्जैन के प्रसिद्ध मंदिर, ujjain temple, सिंहस्थ 2028, सिंहस्थ 2028 उज्जैन, उज्जैन कुम्भ मेला 2028, शाही स्नान 2028, उज्जैन महाकुंभ 2028, simhastha 2028, उज्जैन में होटल, महाकाल मंदिर के पास होटल, उज्जैन में टैक्सी, उज्जैन कैब बुकिंग, इंदौर से उज्जैन टैक्सी, भोपाल से उज्जैन टैक्सी, उज्जैन दर्शन पैकेज, उज्जैन टूर एंड ट्रैवल, महाकाल दर्शन टूर, उज्जैन में पंडित जी, ऑनलाइन पूजा बुकिंग उज्जैन, काल सर्प दोष पूजा उज्जैन, मंगल दोष निवारण पूजा उज्जैन, नाग बलि पूजा उज्जैन, महाकालेश्वर ज्योतिर्लिंग उज्जैन, महाकाल मंदिर उज्जैन, महाकाल लोक कॉरिडोर, काल भैरव मंदिर उज्जैन, हरसिद्धि शक्तिपीठ उज्जैन, मंगलनाथ मंदिर उज्जैन, चिंतामन गणेश मंदिर उज्जैन, सांदीपनि आश्रम उज्जैन, राम घाट उज्जैन';

const KEYWORDS_EN =
  'Ujjain Temple, Ujjain Temples, Temples in Ujjain, Famous Temples in Ujjain, Simhastha 2028, Ujjain Simhastha 2028, Ujjain Kumbh Mela 2028, Shahi Snan 2028, Ujjain Mahakumbh 2028, Hotel in Ujjain, Hotels in Ujjain, Hotels near Mahakal Temple, Taxi in Ujjain, Cab in Ujjain, Ujjain Taxi Booking, Indore to Ujjain Taxi, Bhopal to Ujjain Taxi, Ujjain to Omkareshwar Cab, Ujjain Darshan Package, Tour and Travel in Ujjain, Mahakal Darshan Tour, Pandit for Puja in Ujjain, Online Puja Booking Ujjain, Kaal Sarp Dosh Puja Ujjain, Mangal Dosh Nivaran Puja Ujjain, Nag Bali Puja Ujjain, Mahakaleshwar Jyotirlinga Ujjain, Mahakal Temple Ujjain, Mahakal Lok Corridor, Kal Bhairav Temple Ujjain, Harsiddhi Shaktipeeth Ujjain, Mangalnath Mandir Ujjain, Chintaman Ganesh Temple Ujjain, Sandipani Ashram Ujjain, Ram Ghat Ujjain';

export function SEOHead({ title, description, path, locale, image, type = 'website', publishedTime, modifiedTime, schemas = [], children }: Props) {
  const canonical = locale === 'en' ? `${SITE.url}${path}` : `${SITE.url}/hi${path}`;
  const hreflangs = buildHreflang(path);
  const ogImage = image || `${SITE.url}/og/default.webp`;
  const keywords = locale === 'hi' ? KEYWORDS_HI : KEYWORDS_EN;

  return (
    <>
    <Head>
      <html lang={locale === 'hi' ? 'hi-IN' : 'en-IN'} />
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* ── Core SEO ────────────────────────────────────────────────────────── */}
      <meta name="keywords" content={keywords} />
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
