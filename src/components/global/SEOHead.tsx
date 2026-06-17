import { Head } from 'vite-react-ssg';
import type { ReactNode } from 'react';
import { buildHreflang, type SeoMeta } from '../../lib/seo';
import { SITE } from '../../lib/site';

interface Props extends SeoMeta {
  schemas?: unknown[];
  children?: ReactNode;
}

// ── Locale-specific keyword sets ──────────────────────────────────────────
const KEYWORDS_HI =
  'मंगल दोष निवारण पूजा उज्जैन, काल सर्प दोष पूजा उज्जैन, उज्जैन में पंडित जी, ऑनलाइन पूजा बुकिंग उज्जैन, रुद्राभिषेक पूजा महाकालेश्वर, नवग्रह शांति पूजा मंगलनाथ, पितृ दोष निवारण सिद्धवट, महाकालेश्वर दर्शन, महाकालेश्वर भस्म आरती बुकिंग, महाकालेश्वर वीआईपी दर्शन, महाकाल लोक कॉरिडोर, काल भैरव मंदिर उज्जैन, हरसिद्धि माता मंदिर उज्जैन, मंगलनाथ मंदिर उज्जैन पूजा, महाकालेश्वर लाइव दर्शन, उज्जैन मंदिर टूर पैकेज, ओंकारेश्वर उज्जैन टूर, पंच ज्योतिर्लिंग टूर पैकेज, उज्जैन 2 दिन यात्रा, उज्जैन में घूमने की जगह, उज्जैन ट्रैवल एजेंसी, उज्जैन दर्शन कैब बुकिंग, इंदौर से उज्जैन टैक्सी, उज्जैन लोकल साइटसीइंग कैब, भोपाल से उज्जैन ट्रांसपोर्ट, महाकाल मंदिर के पास होटल, सिंहस्थ 2028 उज्जैन, उज्जैन कुम्भ मेला 2028, सिंहस्थ शाही स्नान तिथियाँ, उज्जैन कुम्भ आवास बुकिंग';

const KEYWORDS_EN =
  'Mangal Dosh Nivaran Puja Ujjain, Kaal Sarp Dosh Puja Ujjain, Authentic Pandit in Ujjain, Online Puja Booking Ujjain, Rudrabhishek Puja Mahakaleshwar, Navgrah Shanti Puja Mangalnath, Pitru Dosh Nivaran Siddhwat, Ujjain Mahakaleshwar Darshan, Mahakaleshwar Bhasma Aarti Timings, Mahakal Lok Corridor Guide, Kal Bhairav Temple Ujjain, Harsiddhi Mata Mandir Ujjain, Mangalnath Mandir Ujjain Puja, Mahakaleshwar Live Darshan, Ujjain Temple Tour Package, Omkareshwar to Ujjain Tour, Panch Jyotirlinga Tour Package, Ujjain 2 Days Itinerary, Best Places to Visit in Ujjain, Ujjain Travel Agency, Ujjain Darshan Cab Booking, Indore to Ujjain Taxi Service, Ujjain Local Sightseeing Cab, Bhopal to Ujjain Transport, Best Hotels near Mahakal Temple, Simhastha 2028 Ujjain, Ujjain Kumbh Mela 2028, Simhastha Shahi Snan Dates, Ujjain Kumbh Mela Accommodation';

export function SEOHead({ title, description, path, locale, image, type = 'website', publishedTime, modifiedTime, schemas = [], children }: Props) {
  const canonical = locale === 'hi' ? `${SITE.url}${path}` : `${SITE.url}/en${path}`;
  const hreflangs = buildHreflang(path);
  const ogImage = image || `${SITE.url}/og/default.webp`;
  const keywords = locale === 'hi' ? KEYWORDS_HI : KEYWORDS_EN;

  return (
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

      {/* ── Structured data ─────────────────────────────────────────────────── */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      {children}
    </Head>
  );
}
