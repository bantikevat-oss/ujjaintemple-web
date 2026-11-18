import { SITE } from './site';
import { SHAHI_SNANS, SNAN_SOURCE_HI, SNAN_SOURCE_EN } from '../data/simhastha-dates';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    /*
     * 🔴 'ReligiousOrganization' removed 2026-10-01. This is a travel and information
     * business; typing it as a religious organization is the machine-readable version of
     * the temple-authority claim the site's own rules forbid, and it is false. GSC reports
     * ZERO search appearances for this site, so nothing was earned by it and nothing is lost.
     */
    '@type': ['LocalBusiness', 'TravelAgency'],
    '@id': `${SITE.url}/#organization`,
    name: 'Ujjain Temple — Ujjain Mandir, Puja & Travel Guide',
    alternateName: ['Ujjain Temple', 'Ujjain Temple Guide', 'UjjainTemple.com', 'उज्जैन मंदिर गाइड'],
    url: SITE.url,
    logo: `${SITE.url}/favicon-512.png`,
    image: `${SITE.url}/og/default.webp`,
    telephone: SITE.phoneIntl,
    email: SITE.email,
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Bank Transfer',
    openingHours: 'Mo-Su 06:00-22:00',
    foundingDate: '2024',
    description:
      "Ujjain's trusted bilingual guide to famous temples, Simhastha Kumbh 2028, puja booking, hotels, taxi and tour packages. Approximate darshan timings, puja information, phone and WhatsApp support.",
    /*
     * 🔴 Fixed 2026-10-01. This block used to say streetAddress 'Mahakal Area' with
     * geo 23.1828/75.7682 and a hasMap pointing at Mahakaleshwar — i.e. it placed this
     * business inside the temple precinct. All three were false: the business is at
     * Mahasakti Nagar. streetAddress and geo are omitted rather than replaced, because
     * Aman's decision (2026-10-01) is not to publish the street address yet; an omitted
     * field is honest, an invented one is not. postalCode now matches the GBP (456010) —
     * it previously said 456001 while the profile said 456010.
     */
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
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
    // YouTube dropped 2026-10-24: youtube.com/@ujjaintemple is a hard 404 (no channel exists),
    // and a dead sameAs is a false claim about the entity.
    sameAs: [SITE.social.facebook, SITE.social.instagram],
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
    name: 'Ujjain Temple',
    alternateName: ['UjjainTemple', 'UjjainTemple.com'],
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
    // 🔴 Only the temple's own number, never ours (2026-11-12). The fallback to SITE.phoneIntl
    // told Google that our travel-desk number was the temple's phone on every temple page,
    // and people called it as the temple. No known temple number → no telephone field.
    ...(m.telephone ? { telephone: m.telephone } : {}),
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
    // No telephone (2026-11-13): this was OUR number written as each hotel's own phone — same
    // mistake as the temple schema fixed on 11-12. We don't publish hotels' numbers either.
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

/**
 * Simhastha 2028 as four linked Event nodes: the mela (27 Mar – 27 May 2028) and the three
 * Shahi Snans (09 Apr, 23 Apr, 08 May 2028), each its own top-level Event with `superEvent`
 * pointing at the mela — so a "shahi snan date" search can surface the snan itself.
 * Dates = published media only (data/simhastha-dates.ts). Returns an ARRAY: spread it.
 *
 * 2026-11-18 (S3) — removed from the old single node:
 *  · `offers` (our ₹2,500 tour package, "InStock") — an Offer on an Event reads as a TICKET to
 *    the event. Simhastha has no ticket and we do not sell entry to it; schema asserting that is
 *    the machine-readable version of a claim the site may not make.
 *  · `performer` "13 Akhadas" — not a performer; and `typicalAgeRange`, which said nothing.
 *  · English-only name/description on /hi/ — the Hindi hub now carries Hindi.
 */
export function simhastha2028EventSchema(locale: 'en' | 'hi' = 'en') {
  const hi = locale === 'hi';
  const page = `${SITE.url}${hi ? '/hi' : ''}/simhastha-2028/`;
  const image = [`${SITE.url}/images/simhastha/simhastha-hero.webp`, `${SITE.url}/images/simhastha/ramghat.webp`];
  const location = {
    '@type': 'Place',
    name: hi ? 'शिप्रा तट, उज्जैन, मध्य प्रदेश' : 'Shipra Ghat, Ujjain, Madhya Pradesh',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ujjain',
      addressRegion: 'Madhya Pradesh',
      postalCode: '456001',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 23.1828, longitude: 75.7682 },
  };
  const organizer = { '@type': 'Organization', name: 'Government of Madhya Pradesh', url: 'https://mp.gov.in' };
  const common = {
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location,
    image,
    organizer,
    isAccessibleForFree: true,
    inLanguage: hi ? 'hi-IN' : 'en-IN',
  };
  const melaId = `${page}#simhastha-2028`;
  const snans = SHAHI_SNANS.map((x) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${page}#shahi-snan-${x.num}`,
    name: hi ? `${x.nameHi} — उज्जैन सिंहस्थ 2028` : `${x.nameEn} — Ujjain Simhastha 2028`,
    description: hi
      ? `उज्जैन सिंहस्थ 2028 का ${x.nameHi}, ${x.dateHi} को शिप्रा तट पर। तिथि ${SNAN_SOURCE_HI} के अनुसार; प्रशासन द्वारा संशोधन संभव।`
      : `The ${x.nameEn} of Ujjain Simhastha 2028, on ${x.dateEn} on the Shipra in Ujjain. Date as per ${SNAN_SOURCE_EN}; it may be revised by the administration.`,
    startDate: x.iso,
    endDate: x.iso,
    url: `${page}#dates`,
    superEvent: { '@id': melaId },
    ...common,
  }));
  const mela = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': melaId,
    name: hi ? 'उज्जैन सिंहस्थ महाकुम्भ 2028' : 'Ujjain Simhastha Mahakumbh 2028',
    alternateName: hi
      ? ['सिंहस्थ 2028', 'उज्जैन कुम्भ 2028', 'Simhastha 2028']
      : ['Simhastha 2028', 'Ujjain Kumbh 2028', 'Ujjain Mahakumbh 2028', 'Singhasth 2028'],
    // Mela period, not the Shahi Snan window. Webdunia, Times Now Navbharat, Patrika and
    // ETV Bharat all report 27 Mar – 27 May 2028; the three Shahi Snans sit inside it.
    startDate: '2028-03-27',
    endDate: '2028-05-27',
    url: page,
    description: hi
      ? 'उज्जैन में शिप्रा तट पर हर 12 वर्ष में होने वाला सिंहस्थ महाकुम्भ — 27 मार्च से 27 मई 2028 तक। तीन शाही स्नान 09 अप्रैल, 23 अप्रैल और 08 मई 2028 को (प्रकाशित मीडिया रिपोर्ट्स के अनुसार)।'
      : 'The Simhastha Mahakumbh held on the Shipra in Ujjain once every 12 years — 27 March to 27 May 2028. Three Shahi Snans on 09 April, 23 April and 08 May 2028 (as per published media reports).',
    subEvent: snans.map((x) => ({ '@id': x['@id'] })),
    ...common,
  };
  return [mela, ...snans];
}

export function pujaServiceSchema() {
  const services = [
    { name: 'Mangal Dosh Nivaran Puja', description: 'Mangal Dosh nivaran puja in Ujjain, the city of Mangalnath. Performed with Vedic mantras as per tradition.', price: '2100' },
    { name: 'Kaal Sarp Dosh Puja', description: 'Kaal Sarp Dosh nivaran puja in Ujjain, performed with Vedic mantras as per tradition.', price: '5100' },
    { name: 'Rudrabhishek Puja', description: 'Rudrabhishek puja in Ujjain with Vedic mantras, performed as per tradition.', price: '1100' },
    { name: 'Navgrah Shanti Puja', description: 'Navgrah shanti puja in Ujjain, performed with Vedic mantras as per tradition.', price: '3100' },
    { name: 'Pitru Dosh Nivaran Puja', description: 'Pitru dosh puja and tarpan in Ujjain, performed as per tradition.', price: '2500' },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Puja Services in Ujjain',
    description: 'Puja services in Ujjain — Mangal Dosh, Kaal Sarp, Rudrabhishek, Navgrah Shanti and Pitru Dosh, performed as per tradition.',
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

/** Route pages (2026-11-03) pass their own name/description/url; /cab-booking/ uses the defaults. */
export function taxiServiceSchema(route?: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: route?.name ?? 'Ujjain Taxi Service — UjjainTemple Cab Booking',
    description: route?.description ?? 'Taxi service in Ujjain — cab booking for Mahakaleshwar darshan, local sightseeing, Omkareshwar, Indore airport and outstation trips. Fixed fares quoted upfront.',
    url: route?.url ?? `${SITE.url}/cab-booking/`,
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: [
      { '@type': 'City', name: 'Ujjain' },
      { '@type': 'City', name: 'Indore' },
      { '@type': 'City', name: 'Omkareshwar' },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      servicePhone: { '@type': 'ContactPoint', telephone: SITE.phoneIntl, contactType: 'reservations', availableLanguage: ['Hindi', 'English'] },
      serviceUrl: route?.url ?? `${SITE.url}/cab-booking/`,
    },
  };
}

/**
 * A tour package as a TouristTrip (2026-11-03). No `offers`: rates are given on the call, and
 * an Offer without a price would be a claim we do not print anywhere on the page.
 */
export function touristTripSchema(t: { name: string; description: string; url: string; image: string; touristType: string; days: string[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: t.name,
    description: t.description,
    url: t.url,
    image: t.image.startsWith('http') ? t.image : `${SITE.url}${t.image}`,
    touristType: t.touristType,
    provider: { '@id': `${SITE.url}/#organization` },
    itinerary: {
      '@type': 'ItemList',
      itemListElement: t.days.map((name, i) => ({ '@type': 'ListItem', position: i + 1, name })),
    },
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

/**
 * /about/ and /contact/ shipped with no JSON-LD at all — the 2026-09-07 AI-readiness
 * audit found them the only two sampled templates without any. They are the pages an
 * answer engine reads to decide who this business IS, so they are the worst two to
 * leave unmarked. Both point at the same Organization @id the rest of the site uses,
 * so the entity stays one node rather than several look-alikes.
 */
export function aboutPageSchema({ name, description, url }: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${url}#aboutpage`,
    name,
    description,
    url,
    inLanguage: url.includes('/hi/') ? 'hi-IN' : 'en-IN',
    isPartOf: { '@id': `${SITE.url}/#website` },
    about: { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export function contactPageSchema({ name, description, url }: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${url}#contactpage`,
    name,
    description,
    url,
    inLanguage: url.includes('/hi/') ? 'hi-IN' : 'en-IN',
    isPartOf: { '@id': `${SITE.url}/#website` },
    about: { '@id': `${SITE.url}/#organization` },
    mainEntity: { '@id': `${SITE.url}/#organization` },
  };
}

/**
 * Ujjain Guide Android app — SoftwareApplication.
 *
 * Added 2026-09-30. The Play listing went live and, as the `simhastha-2028` SERP shows,
 * a Play listing ranks in web results on its own (the government MPSeDC app holds #2
 * there). This schema ties the app to the site so the two reinforce each other rather
 * than competing as unrelated results.
 *
 * 🔴 No aggregateRating here — the app has no ratings yet and inventing them would be a
 * fabricated-review violation. Add it only when Play reports real ones.
 */
export function ujjainGuideAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ujjain Guide: Mandir & Yatra',
    applicationCategory: 'TravelApplication',
    operatingSystem: 'Android 7.0+',
    url: 'https://ujjaintemple.com/hi/app/',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.ujjaintemple.guide',
    installUrl: 'https://play.google.com/store/apps/details?id=com.ujjaintemple.guide',
    softwareVersion: '1.0.0',
    inLanguage: ['hi', 'en'],
    description:
      'उज्जैन के 183 मंदिर बिना इंटरनेट, 84 महादेव सूची, पर्व कैलेंडर, सिंहस्थ 2028 की तिथियाँ और यात्रा योजना — एक ऐप में।',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    publisher: {
      '@type': 'Organization',
      name: 'ByteFlow Technologies Pvt Ltd',
      url: 'https://byteflowtech.in',
    },
  };
}
