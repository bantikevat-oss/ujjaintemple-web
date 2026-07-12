export interface Bilingual {
  hi: string;
  en: string;
}

export interface Mandir {
  slug: string;
  name: Bilingual;
  deity: Bilingual;
  templeType: string;
  locationArea: string;
  isFeatured: boolean;
  establishedEra: Bilingual;
  architectureStyle?: string;
  shortIntro: Bilingual;
  history: Bilingual;
  darshanTimingSummary: Bilingual;
  weeklyTiming: { [day: string]: Bilingual };
  aartiTiming: Bilingual;
  specialOccasions?: Bilingual;
  entryFee: Bilingual;
  address: Bilingual;
  geo: { lat: number; lng: number };
  phone?: string;
  trust?: string;
  photos: string[];
  videoUrl?: string;
  prasadInfo?: Bilingual;
  howToReach: Bilingual;
  nearbyMandirs: string[];
  simhasthaRelevance?: Bilingual;
  faqs?: Array<{ question?: Bilingual; answer?: Bilingual; q?: Bilingual; a?: Bilingual }>;
  visitTips?: Bilingual;
  localBeliefs?: Bilingual;
  specialFacts?: Bilingual;
  crowdLevel?: 'low' | 'moderate' | 'high' | 'very-high';
  photographyAllowed?: boolean;
  parkingAvailable?: 'available' | 'limited' | 'shared' | 'none';
  lastVerified: string;
  primaryKeyword: Bilingual;
  seoTitle?: Bilingual;
  seoDescription?: Bilingual;
}

export interface Hotel {
  slug: string;
  name: Bilingual;
  category: 'budget' | 'mid' | 'luxury';
  area: string;
  distanceFromMahakal: string;
  amenities: string[];
  priceRange: string;
  description: Bilingual;
  photos: string[];
  geo: { lat: number; lng: number };
  primaryKeyword: Bilingual;
}

export interface Article {
  slug: string;
  category: 'simhastha' | 'transport' | 'tour' | 'puja-info' | 'blog';
  title: Bilingual;
  metaDescription: Bilingual;
  shortIntro: Bilingual;
  body: Bilingual;
  heroImage: string;
  publishDate: string;
  lastUpdated: string;
  relatedSlugs?: string[];
  forwardCta?: { url: string; anchor: Bilingual };
  faqs?: Array<{ question?: Bilingual; answer?: Bilingual; q?: Bilingual; a?: Bilingual }>;
  primaryKeyword: Bilingual;
  pujaDetails?: {
    duration: Bilingual;
    costRange?: string;
    mantra?: string;
    japaCount?: Bilingual;
    benefitCount?: number;
  };
  photos?: string[];
}
