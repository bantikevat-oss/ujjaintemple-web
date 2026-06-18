import { Head } from 'vite-react-ssg';
import type { ReactNode } from 'react';
import { buildHreflang, type SeoMeta } from '../../lib/seo';
import { SITE } from '../../lib/site';

interface Props extends SeoMeta {
  schemas?: unknown[];
  children?: ReactNode;
}

// ── Locale-specific keyword sets ──────────────────────────────────────────
// Retargeted to high-traffic Ujjain temple + Simhastha 2028 clusters + business-intent (cab/hotel/tour/puja).
// VIP-darshan / Bhasma-Aarti-booking / live-darshan terms REMOVED (hard-rule: no temple-side darshan authorization).
const KEYWORDS_HI =
  'उज्जैन मंदिर, उज्जैन के प्रसिद्ध मंदिर, महाकालेश्वर ज्योतिर्लिंग उज्जैन, महाकाल मंदिर उज्जैन, महाकाल लोक कॉरिडोर, काल भैरव मंदिर उज्जैन, हरसिद्धि शक्तिपीठ उज्जैन, मंगलनाथ मंदिर उज्जैन, चिंतामन गणेश मंदिर उज्जैन, सांदीपनि आश्रम उज्जैन, राम घाट उज्जैन, उज्जैन दर्शन यात्रा, उज्जैन में घूमने की जगह, उज्जैन टूर पैकेज, महाकाल मंदिर के पास होटल, इंदौर से उज्जैन टैक्सी, उज्जैन दर्शन कैब, भोपाल से उज्जैन ट्रांसपोर्ट, सिंहस्थ 2028 उज्जैन, सिंहस्थ 2028 तिथि, उज्जैन कुम्भ मेला 2028, शाही स्नान 2028, उज्जैन महाकुंभ 2028, ऑनलाइन पूजा बुकिंग उज्जैन, काल सर्प दोष पूजा उज्जैन, मंगल दोष निवारण पूजा उज्जैन, उज्जैन में पंडित जी';

const KEYWORDS_EN =
  'Ujjain Temple, Famous Temples in Ujjain, Mahakaleshwar Jyotirlinga Ujjain, Mahakal Temple Ujjain, Mahakal Lok Corridor, Kal Bhairav Temple Ujjain, Harsiddhi Shaktipeeth Ujjain, Mangalnath Mandir Ujjain, Chintaman Ganesh Temple Ujjain, Sandipani Ashram Ujjain, Ram Ghat Ujjain, Ujjain Darshan, Places to Visit in Ujjain, Ujjain Tour Package, Hotels near Mahakal Temple, Indore to Ujjain Taxi, Ujjain Darshan Cab, Bhopal to Ujjain Transport, Simhastha 2028 Ujjain, Simhastha 2028 Dates, Ujjain Kumbh Mela 2028, Shahi Snan 2028, Ujjain Mahakumbh 2028, Online Puja Booking Ujjain, Kaal Sarp Dosh Puja Ujjain, Mangal Dosh Nivaran Puja Ujjain, Pandit in Ujjain';

export function SEOHead({ title, description, path, locale, image, type = 'website', publishedTime, modifiedTime, schemas = [], children }: Props) {
  const canonical = locale === 'hi' ? `${SITE.url}${path}` : `${SITE.url}/en${path}`;
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
      <meta property="og:site_name" content="UjjainTemple — Ujjain Mandir, Puja & Travel Guide" />

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
