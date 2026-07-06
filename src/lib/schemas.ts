import { SITE } from './site';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TravelAgency', 'ReligiousOrganization'],
    '@id': `${SITE.url}/#organization`,
    name: 'UjjainTemple — Ujjain Mandir, Puja & Travel Guide',
    alternateName: ['Ujjain Temple Guide', 'UjjainTemple.com', 'उज्जैन मंदिर गाइड'],
    url: SITE.url,
    logo: `${SITE.url}/favicon.svg`,
    image: `${SITE.url}/og/default.webp`,
    telephone: SITE.phoneIntl,
    email: SITE.email,
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Bank Transfer',
    openingHours: 'Mo-Su 06:00-22:00',
    foundingDate: '2024',
    description:
      "Ujjain's most trusted bilingual guide to 182+ temples, Simhastha Kumbh 2028, puja booking, hotels, and tour packages. Verified darshan timings, authentic pandit services, 24×7 support.",
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mahakal Area',
      addressLocality: 'Ujjain',
      addressRegion: 'Madhya Pradesh',
      postalCode: '456001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.1828,
      longitude: 75.7682,
    },
    hasMap: 'https://maps.google.com/?q=Ujjain+Mahakaleshwar+Temple',
    areaServed: [
      { '@type': 'City', name: 'Ujjain' },
      { '@type': 'State', name: 'Madhya Pradesh' },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE.phoneIntl,
        contactType: 'customer support',
        areaServed: 'IN',
        availableLanguage: ['Hindi', 'English'],
        hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '06:00', closes: '22:00' },
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: SITE.whatsapp,
        availableLanguage: ['Hindi', 'English'],
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1240',
      bestRating: '5',
      worstRating: '1',
    },
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.youtube],
    knowsAbout: [
      'Mahakaleshwar Jyotirlinga',
      'Ujjain Temples',
      'Simhastha Kumbh Mela 2028',
      'Puja Booking Ujjain',
      'Mangal Dosh Nivaran',
      'Kaal Sarp Dosh Puja',
      'Ujjain Tour Packages',
    ],
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
    '@type': ['Article', 'NewsArticle'],
    headline: a.headline,
    description: a.description,
    image: {
      '@type': 'ImageObject',
      url: a.image,
      width: 1200,
      height: 630,
    },
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    author: {
      '@type': 'Organization',
      name: 'UjjainTemple Editorial',
      url: SITE.url,
    },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': a.url },
    inLanguage: a.url.includes('/hi/') ? 'hi-IN' : 'en-IN',
    about: { '@type': 'Thing', name: 'Ujjain Temples & Pilgrimage' },
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
    name: 'Simhastha Mahakumbh 2028 — Ujjain Kumbh Mela',
    alternateName: ['Ujjain Kumbh 2028', 'Simhastha 2028', 'Ujjain Mahakumbh 2028'],
    startDate: '2028-04-09',
    endDate: '2028-05-08',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Shipra Ghat, Ujjain, Madhya Pradesh',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ujjain',
        addressRegion: 'Madhya Pradesh',
        postalCode: '456001',
        addressCountry: 'IN',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 23.1828, longitude: 75.7682 },
    },
    image: `${SITE.url}/og/default.webp`,
    description:
      'Simhastha Mahakumbh 2028 — once-in-12-years grand pilgrimage at the sacred banks of Shipra river in Ujjain. Shahi Snan dates, kalpvas, 13 akhada processions, and darshan at Mahakaleshwar Jyotirlinga.',
    organizer: { '@type': 'Organization', name: 'Madhya Pradesh Government', url: 'https://mp.gov.in' },
    performer: {
      '@type': 'PerformingGroup',
      name: '13 Akhadas — Naga Sadhus, Mahamandaleshwars & Saints',
    },
    offers: {
      '@type': 'Offer',
      name: 'Simhastha 2028 Tour Package',
      url: `${SITE.url}/tour-and-travel-ujjain/`,
      price: '2500',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-06-01',
    },
    keywords: 'Simhastha 2028, Ujjain Kumbh Mela, Shahi Snan, Kalpvas, Naga Sadhu, Akhada',
    typicalAgeRange: 'All ages',
    isAccessibleForFree: true,
  };
}

export function pujaServiceSchema() {
  const services = [
    { name: 'Mangal Dosh Nivaran Puja', description: 'Authentic Mangal Dosh puja at Mangalnath temple, Ujjain — the birth place of Mars (Mangal). Removes marriage and career obstacles.', price: '2100' },
    { name: 'Kaal Sarp Dosh Puja', description: 'Complete Kaal Sarp Dosh nivaran puja at Mahakaleshwar or Siddhwat Ujjain by certified pandits. All 12 types covered.', price: '5100' },
    { name: 'Rudrabhishek Puja', description: 'Rudrabhishek at Mahakaleshwar Jyotirlinga with Vedic mantras. Book online with authentic pandit Ji in Ujjain.', price: '1100' },
    { name: 'Navgrah Shanti Puja', description: 'Navgrah shanti puja at Mangalnath Mandir, Ujjain — the navgrah kshetra. Removes planetary doshas.', price: '3100' },
    { name: 'Pitru Dosh Nivaran Puja', description: 'Pitru dosh puja and tarpan at Siddhwat Ujjain — one of India\'s most sacred sites for ancestral rituals.', price: '2500' },
    { name: 'Mahakaleshwar Bhasma Aarti Darshan', description: 'Assisted Bhasma Aarti booking for Mahakaleshwar temple, Ujjain. Very limited slots — book in advance.', price: '600' },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Puja Services in Ujjain',
    description: 'Authentic puja booking services in Ujjain — Mangal Dosh, Kaal Sarp, Rudrabhishek, Navgrah, and more by certified pandits.',
    url: `${SITE.url}/puja-in-ujjain/`,
    numberOfItems: services.length,
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.name,
        description: s.description,
        provider: { '@id': `${SITE.url}/#organization` },
        areaServed: { '@type': 'City', name: 'Ujjain' },
        offers: {
          '@type': 'Offer',
          price: s.price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: `${SITE.url}/puja-in-ujjain/`,
        },
        serviceType: 'Religious Puja Service',
        category: 'Religion & Spirituality',
      },
    })),
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
