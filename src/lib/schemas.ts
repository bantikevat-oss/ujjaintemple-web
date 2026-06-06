import { SITE } from './site';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TravelAgency'],
    '@id': `${SITE.url}/#organization`,
    name: 'UjjainTemple — Ujjain Temple, Travel & Simhastha Guide',
    url: SITE.url,
    telephone: SITE.phoneIntl,
    email: SITE.email,
    priceRange: '₹₹',
    description:
      "Ujjain's authoritative bilingual guide to 35+ temples, Simhastha 2028, hotels, transport, and tours. Verified darshan timings, Hindi + English content, 24×7 trip planning assistance.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    areaServed: { '@type': 'City', name: 'Ujjain' },
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.youtube],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: 'UjjainTemple',
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: ['hi-IN', 'en-IN'],
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/search/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface MandirSchemaInput {
  slug: string;
  name: string;
  nameAlt?: string;
  description: string;
  image: string;
  url: string;
  address: string;
  geo: { lat: number; lng: number };
  hours?: string[];
  telephone?: string;
}

export function placeOfWorshipSchema(m: MandirSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': ['PlaceOfWorship', 'TouristAttraction'],
    '@id': `${m.url}#place`,
    name: m.name,
    alternateName: m.nameAlt,
    description: m.description,
    image: m.image,
    url: m.url,
    telephone: m.telephone ?? SITE.phoneIntl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: m.address,
      addressLocality: 'Ujjain',
      addressRegion: 'Madhya Pradesh',
      postalCode: '456001',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: m.geo.lat, longitude: m.geo.lng },
    openingHours: m.hours,
    isAccessibleForFree: true,
  };
}

export interface HotelSchemaInput {
  slug: string;
  name: string;
  description: string;
  image: string;
  url: string;
  area: string;
  priceRange: string;
  amenities: string[];
  geo: { lat: number; lng: number };
}

export function hotelSchema(h: HotelSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    '@id': `${h.url}#hotel`,
    name: h.name,
    description: h.description,
    image: h.image,
    url: h.url,
    telephone: SITE.phoneIntl,
    priceRange: h.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: h.area,
      addressLocality: 'Ujjain',
      addressRegion: 'Madhya Pradesh',
      postalCode: '456001',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: h.geo.lat, longitude: h.geo.lng },
    amenityFeature: h.amenities.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
  };
}

export interface ArticleSchemaInput {
  url: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
}

export function articleSchema(a: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.headline,
    description: a.description,
    image: a.image,
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    author: { '@type': 'Organization', name: 'UjjainTemple Editorial' },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': a.url },
  };
}

export interface BreadcrumbInput {
  items: Array<{ name: string; url: string }>;
}

export function breadcrumbSchema({ items }: BreadcrumbInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function simhastha2028EventSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Simhastha Mahakumbh 2028 Ujjain',
    startDate: '2028-04-29',
    endDate: '2028-05-27',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Ujjain, Madhya Pradesh',
      address: { '@type': 'PostalAddress', addressLocality: 'Ujjain', addressCountry: 'IN' },
    },
    description:
      'Simhastha Mahakumbh 2028 — once-in-12-years grand pilgrimage at the banks of Shipra river in Ujjain. Snan, kalpvas, akhada processions, and darshan at Mahakaleshwar.',
    organizer: { '@type': 'Organization', name: 'Madhya Pradesh Government' },
  };
}

export function itemListSchema(items: Array<{ name: string; url: string; description: string; image?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => {
      const item: any = {
        '@type': 'WebPage',
        url: it.url,
        name: it.name,
        description: it.description,
      };
      if (it.image) item.image = it.image;
      
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: item,
      };
    }),
  };
}
