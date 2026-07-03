import type { RouteRecord } from 'vite-react-ssg';
import { I18nProvider, type Locale } from './i18n';
import { Home } from './pages/Home';
import { MandirIndex } from './pages/mandirs/Index';
import { MandirDetail } from './pages/mandirs/Detail';
import { ArticleDetail } from './pages/articles/Detail';
import { VerticalLanding } from './pages/VerticalLanding';
import { SimhasthaLanding } from './pages/SimhasthaLanding';
import { TransportLanding } from './pages/TransportLanding';
import { PujaLanding } from './pages/PujaLanding';
import { TourLanding } from './pages/TourLanding';
import { ThingsToDo } from './pages/ThingsToDo';
import { TourPackageDetail } from './pages/TourPackageDetail';
import { CabBookingLanding } from './pages/CabBookingLanding';
import { HotelsIndex } from './pages/HotelsIndex';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFound } from './pages/NotFound';
import { mandirs } from './data/mandirs';
import { articlesByCategory } from './data/articles';

const withLocale = (locale: Locale, Component: React.FC) => (
  <I18nProvider locale={locale}><Component /></I18nProvider>
);

const withLocaleProps = <P extends object>(locale: Locale, Component: React.FC<P>, props: P) => (
  <I18nProvider locale={locale}><Component {...props} /></I18nProvider>
);

function buildLocaleRoutes(locale: Locale, basePath: string): RouteRecord[] {
  return [
    { path: `${basePath}`, element: withLocale(locale, Home) },

    // Mandirs
    { path: `${basePath}mandirs/`, element: withLocale(locale, MandirIndex) },
    ...mandirs.map((m) => ({
      path: `${basePath}mandirs/${m.slug}/`,
      element: withLocaleProps(locale, MandirDetail, { slug: m.slug }),
    })) as RouteRecord[],

    // Hotels
    { path: `${basePath}hotels/`, element: withLocale(locale, HotelsIndex) },

    // Things to Do — tourism pillar (top-funnel, links to all money hubs)
    { path: `${basePath}things-to-do-in-ujjain/`, element: withLocale(locale, ThingsToDo) },

    // About, Contact, Legal
    { path: `${basePath}about/`, element: withLocale(locale, AboutPage) },
    { path: `${basePath}contact/`, element: withLocale(locale, ContactPage) },
    { path: `${basePath}privacy-policy/`, element: withLocale(locale, PrivacyPage) },
    { path: `${basePath}terms/`, element: withLocale(locale, TermsPage) },

    // Simhastha
    {
      path: `${basePath}simhastha-2028/`,
      element: withLocale(locale, SimhasthaLanding),
    },
    ...articlesByCategory('simhastha').map((a) => ({
      path: `${basePath}simhastha-2028/${a.slug}/`,
      element: withLocaleProps(locale, ArticleDetail, { category: 'simhastha' as const, slug: a.slug }),
    })) as RouteRecord[],

    // Transport
    {
      path: `${basePath}transport-in-ujjain/`,
      element: withLocale(locale, TransportLanding),
    },
    ...articlesByCategory('transport').map((a) => ({
      path: `${basePath}transport-in-ujjain/${a.slug}/`,
      element: withLocaleProps(locale, ArticleDetail, { category: 'transport' as const, slug: a.slug }),
    })) as RouteRecord[],

    // Cab Booking
    {
      path: `${basePath}cab-booking/`,
      element: withLocale(locale, CabBookingLanding),
    },

    // Tours Landing
    {
      path: `${basePath}tour-and-travel-ujjain/`,
      element: withLocale(locale, TourLanding),
    },
    // Tour Packages (Specific Detailed Pages)
    {
      path: `${basePath}tour-and-travel-ujjain/ujjain-darshan-package/`,
      element: withLocaleProps(locale, TourPackageDetail, { slug: 'ujjain-darshan-package' }),
    },
    {
      path: `${basePath}tour-and-travel-ujjain/ujjain-omkareshwar-package/`,
      element: withLocaleProps(locale, TourPackageDetail, { slug: 'ujjain-omkareshwar-package' }),
    },
    {
      path: `${basePath}tour-and-travel-ujjain/ujjain-omkareshwar-maheshwar-mandu-4-days/`,
      element: withLocaleProps(locale, TourPackageDetail, { slug: 'ujjain-omkareshwar-maheshwar-mandu-4-days' }),
    },
    {
      path: `${basePath}tour-and-travel-ujjain/panch-jyotirlinga-5-days/`,
      element: withLocaleProps(locale, TourPackageDetail, { slug: 'panch-jyotirlinga-5-days' }),
    },
    {
      path: `${basePath}tour-and-travel-ujjain/ujjain-baglamukhi-2-days/`,
      element: withLocaleProps(locale, TourPackageDetail, { slug: 'ujjain-baglamukhi-2-days' }),
    },
    ...articlesByCategory('tour').map((a) => ({
      path: `${basePath}tour-and-travel-ujjain/${a.slug}/`,
      element: withLocaleProps(locale, ArticleDetail, { category: 'tour' as const, slug: a.slug }),
    })) as RouteRecord[],

    // Puja Info
    {
      path: `${basePath}puja-in-ujjain/`,
      element: withLocale(locale, PujaLanding),
    },
    ...articlesByCategory('puja-info').map((a) => ({
      path: `${basePath}puja-in-ujjain/${a.slug}/`,
      element: withLocaleProps(locale, ArticleDetail, { category: 'puja-info' as const, slug: a.slug }),
    })) as RouteRecord[],
  ];
}

export const routes: RouteRecord[] = [
  ...buildLocaleRoutes('hi', '/'),
  ...buildLocaleRoutes('en', '/en/'),
  { path: '*', element: withLocale('hi', NotFound) },
];
