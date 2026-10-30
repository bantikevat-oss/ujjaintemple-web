/**
 * Cab rate card — the ONE place fixed fares live (Aman, 2026-10-26).
 *
 * Every fare shown on the site (fare tables, the Pricing page, page copy that quotes a
 * number) reads from here, so two pages can never show two prices for the same trip.
 * These are business terms, not copy: change a number only on Aman's word.
 *
 * 2026-10-28 — from the vendor's sheet + ~15%, rounded to ₹100 (Aman):
 *   vendor Omkareshwar round 3,200 / 3,800 / 5,500 (toll + parking included) → 3,700 / 4,400 / 6,300
 *   vendor local 7 hr 1,800 / — / 3,500 → 2,100 / 2,500 / 4,000; full day 2,500 / — / 4,500 → 2,900 / 3,400 / 5,200
 *   (Ertiga local was priced like Dzire on the sheet; Aman: scale it by the Omkareshwar ratio 3,800/3,200)
 *   vendor km 11 / 12 / 18 + toll → extra km 13 / 14 / 21; extra hour = 7-hr fare ÷ 7.
 *   One-way = same as round trip (Aman: keep one-way, same rate — a −₹500 drop would have been at cost).
 *   Airport (not on the sheet): ~120 km at the vendor km rate + 15% → 1,700 / 1,900 / 2,700.
 *   Local limits 7 hr / 70 km and full day 12 hr / 120 km are Claude's proposal, Aman OK'd.
 *
 * 2026-10-30 — local package 7 hr / 70 km → 8 hr / 80 km at the same fares (Aman: "kar do").
 *   Market sells 8 hr / 80 km at ₹1,500–2,200 for a sedan; ours gave less for the top of that range.
 *   🔴 Vendor's sheet only prices 7 hr (1,800) — confirm his 8 hr rate before deploy, else the
 *   Dzire margin is ~₹50–300 instead of ~₹300.
 * - All fares include toll, parking, fuel and the driver's charges.
 */

export type VehicleId = 'dzire' | 'ertiga' | 'innova';

type B = { hi: string; en: string };

export const VEHICLES: Record<VehicleId, { name: string; seats: number; kind: B }> = {
  dzire:  { name: 'Dzire',  seats: 4, kind: { hi: 'सेडान', en: 'Sedan' } },
  ertiga: { name: 'Ertiga', seats: 6, kind: { hi: 'SUV', en: 'SUV' } },
  innova: { name: 'Innova', seats: 7, kind: { hi: 'प्रीमियम SUV', en: 'Premium SUV' } },
};

export const VEHICLE_ORDER: VehicleId[] = ['dzire', 'ertiga', 'innova'];

export type RouteId = 'omkareshwar-round' | 'omkareshwar-oneway' | 'ujjain-local' | 'ujjain-fullday' | 'indore-airport';

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
    fares: { dzire: 3700, ertiga: 4400, innova: 6300 },
  },
  'omkareshwar-oneway': {
    id: 'omkareshwar-oneway',
    title: { hi: 'ओंकारेश्वर वन-वे', en: 'Omkareshwar one way' },
    detail: { hi: 'उज्जैन या इंदौर से ओंकारेश्वर ड्रॉप, या ओंकारेश्वर से उज्जैन / इंदौर', en: 'Drop from Ujjain or Indore to Omkareshwar, or Omkareshwar to Ujjain / Indore' },
    fares: { dzire: 3700, ertiga: 4400, innova: 6300 },
  },
  'ujjain-local': {
    id: 'ujjain-local',
    title: { hi: 'उज्जैन लोकल दर्शन — 8 घंटे', en: 'Ujjain local darshan — 8 hours' },
    detail: { hi: '8 घंटे / 80 किमी — उज्जैन के मंदिर और घाट', en: '8 hours / 80 km — Ujjain temples and ghats' },
    fares: { dzire: 2100, ertiga: 2500, innova: 4000 },
    extra: {
      dzire:  { km: 13, hour: 300 },
      ertiga: { km: 14, hour: 360 },
      innova: { km: 21, hour: 570 },
    },
  },
  'ujjain-fullday': {
    id: 'ujjain-fullday',
    title: { hi: 'उज्जैन लोकल दर्शन — पूरा दिन', en: 'Ujjain local darshan — full day' },
    detail: { hi: '12 घंटे / 120 किमी — उज्जैन के मंदिर और घाट', en: '12 hours / 120 km — Ujjain temples and ghats' },
    fares: { dzire: 2900, ertiga: 3400, innova: 5200 },
    extra: {
      dzire:  { km: 13, hour: 300 },
      ertiga: { km: 14, hour: 360 },
      innova: { km: 21, hour: 570 },
    },
  },
  'indore-airport': {
    id: 'indore-airport',
    title: { hi: 'इंदौर एयरपोर्ट ↔ उज्जैन', en: 'Indore Airport ↔ Ujjain' },
    detail: { hi: 'एयरपोर्ट पिकअप या ड्रॉप, एक तरफ़', en: 'Airport pickup or drop, one way' },
    fares: { dzire: 1700, ertiga: 1900, innova: 2700 },
  },
};

export const FARE_INCLUDES: B = {
  hi: 'किराए में टोल, पार्किंग, फ्यूल और ड्राइवर का खर्च शामिल है — कोई छुपा चार्ज नहीं।',
  en: 'Fares include toll, parking, fuel and driver charges — no hidden charges.',
};


/* ── Booking widget: pickup → drop → trip type, resolved to one rate row ───────────────
   Only combinations Aman has priced are offered; anything else is not in the dropdowns. */

export type PlaceId = 'ujjain' | 'indore' | 'idr' | 'omkareshwar' | 'ujjain-local' | 'ujjain-fullday';
export type TripType = 'oneway' | 'round' | 'local';

export const PLACES: Record<PlaceId, B> = {
  ujjain:        { hi: 'उज्जैन', en: 'Ujjain' },
  indore:        { hi: 'इंदौर (शहर)', en: 'Indore (city)' },
  idr:           { hi: 'इंदौर एयरपोर्ट', en: 'Indore Airport' },
  omkareshwar:   { hi: 'ओंकारेश्वर', en: 'Omkareshwar' },
  'ujjain-local': { hi: '8 घंटे / 80 किमी', en: '8 hours / 80 km' },
  'ujjain-fullday': { hi: 'पूरा दिन — 12 घंटे / 120 किमी', en: 'Full day — 12 hours / 120 km' },
};

export const TRIP_TYPES: Record<TripType, B> = {
  oneway: { hi: 'वन-वे (सिर्फ़ छोड़ना)', en: 'One way (drop only)' },
  round:  { hi: 'राउंड ट्रिप (वापसी सहित)', en: 'Round trip (with return)' },
  local:  { hi: 'लोकल दर्शन', en: 'Local darshan' },
};

/** pickup → drop → the trip types offered and the rate row each one uses. */
export const ROUTE_MAP: Partial<Record<PlaceId, Partial<Record<PlaceId, Partial<Record<TripType, RouteId>>>>>> = {
  ujjain: {
    omkareshwar: { round: 'omkareshwar-round', oneway: 'omkareshwar-oneway' },
    'ujjain-local': { local: 'ujjain-local' },
    'ujjain-fullday': { local: 'ujjain-fullday' },
    idr: { oneway: 'indore-airport' },
  },
  indore: {
    omkareshwar: { round: 'omkareshwar-round', oneway: 'omkareshwar-oneway' },
  },
  idr: {
    ujjain: { oneway: 'indore-airport' },
  },
  omkareshwar: {
    ujjain: { oneway: 'omkareshwar-oneway' },
    indore: { oneway: 'omkareshwar-oneway' },
  },
};

export const PICKUPS = Object.keys(ROUTE_MAP) as PlaceId[];
export const dropsFor = (from: PlaceId) => Object.keys(ROUTE_MAP[from] ?? {}) as PlaceId[];
export const tripTypesFor = (from: PlaceId, to: PlaceId) =>
  Object.keys(ROUTE_MAP[from]?.[to] ?? {}) as TripType[];
export const routeFor = (from: PlaceId, to: PlaceId, type: TripType): RouteId | null =>
  ROUTE_MAP[from]?.[to]?.[type] ?? null;

/** Transport article slug → where the booking widget starts on that page. */
export const BOOKING_PRESET_BY_SLUG: Record<string, { from: PlaceId; to: PlaceId; type: TripType }> = {
  'ujjain-to-omkareshwar-cab': { from: 'ujjain', to: 'omkareshwar', type: 'round' },
  'ujjain-local-sightseeing-cab': { from: 'ujjain', to: 'ujjain-local', type: 'local' },
};

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/** Lowest fixed fare on a route — for "from ₹X" copy. */
export const fromFare = (id: RouteId) =>
  Math.min(...Object.values(CAB_ROUTES[id].fares).filter((f): f is number => f !== null));
