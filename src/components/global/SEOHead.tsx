import { Head } from 'vite-react-ssg';
import type { ReactNode } from 'react';
import { buildHreflang, type SeoMeta } from '../../lib/seo';
import { SITE } from '../../lib/site';

interface Props extends SeoMeta {
  schemas?: unknown[];
  children?: ReactNode;
}

export function SEOHead({ title, description, path, locale, image, type = 'website', publishedTime, modifiedTime, schemas = [], children }: Props) {
  const canonical = locale === 'hi' ? `${SITE.url}${path}` : `${SITE.url}/en${path}`;
  const hreflangs = buildHreflang(path);
  const ogImage = image || `${SITE.url}/og/default.webp`;

  return (
    <Head>
      <html lang={locale === 'hi' ? 'hi-IN' : 'en-IN'} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Mangal Dosh Nivaran Puja Ujjain, Kaal Sarp Dosh Puja Ujjain, Authentic Pandit in Ujjain, Online Puja Booking Ujjain, Rudrabhishek Puja Mahakaleshwar, Navgrah Shanti Puja Mangalnath, Pitru Dosh Nivaran Siddhwat, Ujjain Mahakaleshwar Darshan, Mahakaleshwar Bhasma Aarti Booking, Mahakaleshwar VIP Darshan, Mahakal Lok Corridor Guide, Kal Bhairav Temple Ujjain, Harsiddhi Mata Mandir Ujjain, Mangalnath Mandir Ujjain Puja, Mahakaleshwar Live Darshan, Ujjain Temple Tour Package, Omkareshwar to Ujjain Tour, Panch Jyotirlinga Tour Package, Ujjain 2 Days Itinerary, Best Places to Visit in Ujjain, Ujjain Travel Agency, Ujjain Darshan Cab Booking, Indore to Ujjain Taxi Service, Ujjain Local Sightseeing Cab, Bhopal to Ujjain Transport, Best Hotels near Mahakal Temple, Simhastha 2028 Ujjain, Ujjain Kumbh Mela 2028, Simhastha Shahi Snan Dates, Ujjain Kumbh Mela Accommodation" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#8b1a1a" />
      <meta name="format-detection" content="telephone=yes" />
      <link rel="canonical" href={canonical} />
      {/* Preconnect to map and font CDNs we use */}
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="dns-prefetch" href="https://maps.google.com" />
      {hreflangs.map((h) => (
        <link key={h.hreflang} rel="alternate" hrefLang={h.hreflang} href={h.href} />
      ))}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content={locale === 'hi' ? 'hi_IN' : 'en_IN'} />
      <meta property="og:site_name" content={SITE.name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      {children}
    </Head>
  );
}
