import { useLocation } from 'react-router-dom';
import { I18nProvider, type Locale } from '../i18n';
import { TransportLanding } from './TransportLanding';
import { CabBookingLanding } from './CabBookingLanding';
import { TourLanding } from './TourLanding';
import { TourPackageDetail } from './TourPackageDetail';
import { HotelsIndex } from './HotelsIndex';

/**
 * Lazy chunk for the booking funnel — transport, cab, tours, the 11 package pages, hotels.
 *
 * Grouped deliberately. These are the pages a single visitor moves BETWEEN (a cab page to
 * a package page to hotels), so one shared chunk is one request for the whole journey
 * rather than one per step. They are also where the money is: of the 22 real leads to date,
 * 16 (73%) came from transport and tour pages, and `/hi/transport-in-ujjain/
 * ujjain-to-omkareshwar-cab/` alone earns 402 clicks and 18 leads per 28 days.
 *
 * Nothing about first paint changes — vite-react-ssg bakes each page's HTML at build time,
 * so the copy, the price table and the phone number are in the served markup and the
 * `tel:` links work with no JavaScript at all. Only the lead form's hydration waits on
 * this chunk, and it arrives in the same round trip the page was already making.
 *
 * `slugFromPath` instead of a prop: react-router's `lazy` can only return a Component, and
 * every package route is registered at a literal path whose last segment IS the slug
 * (`/tour-and-travel-ujjain/<slug>/`). Same reasoning as pages/mandirs/DetailRoute.tsx.
 */
function slugFromPath(pathname: string): string {
  return pathname.replace(/\/+$/, '').split('/').pop() ?? '';
}

const wrap = (locale: Locale, Page: React.FC) => () => (
  <I18nProvider locale={locale}>
    <Page />
  </I18nProvider>
);

function LocalisedPackage({ locale }: { locale: Locale }) {
  const { pathname } = useLocation();
  return (
    <I18nProvider locale={locale}>
      <TourPackageDetail slug={slugFromPath(pathname)} />
    </I18nProvider>
  );
}

export const TransportEn = wrap('en', TransportLanding);
export const TransportHi = wrap('hi', TransportLanding);
export const CabBookingEn = wrap('en', CabBookingLanding);
export const CabBookingHi = wrap('hi', CabBookingLanding);
export const TourEn = wrap('en', TourLanding);
export const TourHi = wrap('hi', TourLanding);
export const HotelsEn = wrap('en', HotelsIndex);
export const HotelsHi = wrap('hi', HotelsIndex);
export function TourPackageEn() { return <LocalisedPackage locale="en" />; }
export function TourPackageHi() { return <LocalisedPackage locale="hi" />; }
