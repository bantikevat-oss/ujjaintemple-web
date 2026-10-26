/**
 * Cab rate card — the ONE place fixed fares live (Aman, 2026-10-26).
 *
 * Every fare shown on the site (fare tables, the Pricing page, page copy that quotes a
 * number) reads from here, so two pages can never show two prices for the same trip.
 * These are business terms, not copy: change a number only on Aman's word.
 *
 * - All fares include toll, parking, fuel and the driver's charges.
 * - One-way = round trip minus ₹500 (Aman).
 * - Local 8 hr / 80 km: extra km = fare ÷ 80, extra hour = fare ÷ 8, per vehicle (Aman),
 *   rounded to a clean figure.
 * - Airport: Innova was not priced, so it is quoted on request.
 */

export type VehicleId = 'dzire' | 'ertiga' | 'innova';

type B = { hi: string; en: string };

export const VEHICLES: Record<VehicleId, { name: string; seats: number; kind: B }> = {
  dzire:  { name: 'Dzire',  seats: 4, kind: { hi: 'सेडान', en: 'Sedan' } },
  ertiga: { name: 'Ertiga', seats: 6, kind: { hi: 'SUV', en: 'SUV' } },
  innova: { name: 'Innova', seats: 7, kind: { hi: 'प्रीमियम SUV', en: 'Premium SUV' } },
};

export const VEHICLE_ORDER: VehicleId[] = ['dzire', 'ertiga', 'innova'];

export type RouteId = 'omkareshwar-round' | 'omkareshwar-oneway' | 'ujjain-local' | 'indore-airport';

export interface CabRoute {
  id: RouteId;
  title: B;
  detail: B;
  /** null = not offered at a fixed price; quoted on request. */
  fares: Record<VehicleId, number | null>;
  extra?: Record<VehicleId, { km: number; hour: number }>;
}

export const CAB_ROUTES: Record<RouteId, CabRoute> = {
  'omkareshwar-round': {
    id: 'omkareshwar-round',
    title: { hi: 'ओंकारेश्वर राउंड ट्रिप', en: 'Omkareshwar round trip' },
    detail: { hi: 'उज्जैन – ओंकारेश्वर – उज्जैन या इंदौर – ओंकारेश्वर – इंदौर', en: 'Ujjain – Omkareshwar – Ujjain, or Indore – Omkareshwar – Indore' },
    fares: { dzire: 3200, ertiga: 3800, innova: 4500 },
  },
  'omkareshwar-oneway': {
    id: 'omkareshwar-oneway',
    title: { hi: 'ओंकारेश्वर वन-वे', en: 'Omkareshwar one way' },
    detail: { hi: 'उज्जैन या इंदौर से ओंकारेश्वर ड्रॉप, या ओंकारेश्वर से उज्जैन / इंदौर', en: 'Drop from Ujjain or Indore to Omkareshwar, or Omkareshwar to Ujjain / Indore' },
    fares: { dzire: 2700, ertiga: 3300, innova: 4000 },
  },
  'ujjain-local': {
    id: 'ujjain-local',
    title: { hi: 'उज्जैन लोकल दर्शन', en: 'Ujjain local darshan' },
    detail: { hi: '8 घंटे / 80 किमी — उज्जैन के मंदिर और घाट', en: '8 hours / 80 km — Ujjain temples and ghats' },
    fares: { dzire: 2500, ertiga: 3000, innova: 4500 },
    extra: {
      dzire:  { km: 31, hour: 310 },
      ertiga: { km: 38, hour: 375 },
      innova: { km: 56, hour: 560 },
    },
  },
  'indore-airport': {
    id: 'indore-airport',
    title: { hi: 'इंदौर एयरपोर्ट ↔ उज्जैन', en: 'Indore Airport ↔ Ujjain' },
    detail: { hi: 'एयरपोर्ट पिकअप या ड्रॉप, एक तरफ़', en: 'Airport pickup or drop, one way' },
    fares: { dzire: 1700, ertiga: 2200, innova: null },
  },
};

export const FARE_INCLUDES: B = {
  hi: 'किराए में टोल, पार्किंग, फ्यूल और ड्राइवर का खर्च शामिल है — कोई छुपा चार्ज नहीं।',
  en: 'Fares include toll, parking, fuel and driver charges — no hidden charges.',
};

/** Transport article slug → the rate rows shown on that page. */
export const FARE_ROUTES_BY_SLUG: Record<string, RouteId[]> = {
  'ujjain-to-omkareshwar-cab': ['omkareshwar-round', 'omkareshwar-oneway'],
  'ujjain-local-sightseeing-cab': ['ujjain-local', 'omkareshwar-round', 'indore-airport'],
};

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/** Lowest fixed fare on a route — for "from ₹X" copy. */
export const fromFare = (id: RouteId) =>
  Math.min(...Object.values(CAB_ROUTES[id].fares).filter((f): f is number => f !== null));
