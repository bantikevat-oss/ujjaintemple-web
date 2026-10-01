import type { RouteRecord } from 'vite-react-ssg';
import { I18nProvider, type Locale } from './i18n';
import { NotFound } from './pages/NotFound';
// Eager on purpose: 9 props from a config object, nothing in the URL to rebuild them
// from, and 8 KB — the smallest page here. See pages/DiscoverRoute.tsx.
import { VerticalLanding } from './pages/VerticalLanding';
import { mandirList } from './data/mandirs-index';
import { DEITY_LISTS } from './data/deity-lists';
import { articleListByCategory as articlesByCategory } from './data/articles-index';
import { APP_TABS } from './app/lib';

const withLocale = (locale: Locale, Component: React.FC) => (
  <I18nProvider locale={locale}><Component /></I18nProvider>
);

const withLocaleProps = <P extends object>(locale: Locale, Component: React.FC<P>, props: P) => (
  <I18nProvider locale={locale}><Component {...props} /></I18nProvider>
);

function buildLocaleRoutes(locale: Locale, basePath: string): RouteRecord[] {
  return [
    { path: `${basePath}`, lazy: async () => {
      const mod = await import('./pages/DiscoverRoute');
      return { Component: locale === 'hi' ? mod.HomeHi : mod.HomeEn };
    } },

    // Simhastha 2028 Guide app (PWA / Android TWA). `lazy` so no website page
    // carries the app's code or its offline temple data in its entry graph.
    ...APP_TABS.map((tab) => ({
      path: `${basePath}app/${tab}`,
      lazy: async () => {
        const mod = await import('./app/routes');
        return { Component: mod.APP_SCREENS[locale][tab] };
      },
    })) as RouteRecord[],

    // Mandirs
    { path: `${basePath}mandirs/`, lazy: async () => {
      const mod = await import('./pages/DiscoverRoute');
      return { Component: locale === 'hi' ? mod.MandirIndexHi : mod.MandirIndexEn };
    } },
    // 84 Mahadev of Ujjain — Chaurasi Mahadev list
    { path: `${basePath}84-mahadev-ujjain/`, lazy: async () => {
      const mod = await import('./pages/DiscoverRoute');
      return { Component: locale === 'hi' ? mod.Mahadev84Hi : mod.Mahadev84En };
    } },
    // Deity-group list pages. Root-level, like 84-mahadev: a /mandirs/<slug>/ path
    // would be swallowed by the temple Detail route below.
    ...DEITY_LISTS.map((g) => ({
      path: `${basePath}${g.slug}/`,
      lazy: async () => {
      const mod = await import('./pages/DiscoverRoute');
      return { Component: locale === 'hi' ? mod.DeityListHi : mod.DeityListEn };
    },
    })),
    // `lazy` (not `element`) on purpose — see pages/mandirs/DetailRoute.tsx. Detail.tsx
    // is the only consumer of the 1.4 MB full-record glob; importing it statically here
    // put that data in the entry graph and modulepreloaded it on every page.
    ...mandirList.map((m) => ({
      path: `${basePath}mandirs/${m.slug}/`,
      lazy: async () => {
        const mod = await import('./pages/mandirs/DetailRoute');
        return { Component: locale === 'hi' ? mod.MandirDetailHi : mod.MandirDetailEn };
      },
    })) as RouteRecord[],

    // Hotels
    { path: `${basePath}hotels/`, lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.HotelsHi : mod.HotelsEn };
    } },

    // Things to Do — tourism pillar (top-funnel, links to all money hubs)
    { path: `${basePath}things-to-do-in-ujjain/`, lazy: async () => {
      const mod = await import('./pages/DiscoverRoute');
      return { Component: locale === 'hi' ? mod.ThingsToDoHi : mod.ThingsToDoEn };
    } },

    // About, Contact, Legal
    // The four standing pages share one lazy chunk — see pages/LegalRoute.tsx.
    // Statically imported they rode in the entry chunk on every temple and transport
    // page, read by nobody who was there to book a cab.
    { path: `${basePath}about/`, lazy: async () => {
      const mod = await import('./pages/LegalRoute');
      return { Component: locale === 'hi' ? mod.AboutHi : mod.AboutEn };
    } },
    { path: `${basePath}contact/`, lazy: async () => {
      const mod = await import('./pages/LegalRoute');
      return { Component: locale === 'hi' ? mod.ContactHi : mod.ContactEn };
    } },
    { path: `${basePath}privacy-policy/`, lazy: async () => {
      const mod = await import('./pages/LegalRoute');
      return { Component: locale === 'hi' ? mod.PrivacyHi : mod.PrivacyEn };
    } },
    { path: `${basePath}terms/`, lazy: async () => {
      const mod = await import('./pages/LegalRoute');
      return { Component: locale === 'hi' ? mod.TermsHi : mod.TermsEn };
    } },

    // Simhastha
    // `lazy` — the largest page component in the codebase (1,044 lines) and the
    // worst-converting cluster on the site (0.43% CTR). See pages/SimhasthaRoute.tsx.
    {
      path: `${basePath}simhastha-2028/`,
      lazy: async () => {
        const mod = await import('./pages/SimhasthaRoute');
        return { Component: locale === 'hi' ? mod.SimhasthaHi : mod.SimhasthaEn };
      },
    },
    ...articlesByCategory('simhastha').map((a) => ({
      path: `${basePath}simhastha-2028/${a.slug}/`,
      lazy: async () => {
        const mod = await import('./pages/articles/DetailRoute');
        return { Component: locale === 'hi' ? mod.ArticleDetailHi : mod.ArticleDetailEn };
      },
    })) as RouteRecord[],

    // Transport
    {
      path: `${basePath}transport-in-ujjain/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.TransportHi : mod.TransportEn };
    },
    },
    ...articlesByCategory('transport').map((a) => ({
      path: `${basePath}transport-in-ujjain/${a.slug}/`,
      lazy: async () => {
        const mod = await import('./pages/articles/DetailRoute');
        return { Component: locale === 'hi' ? mod.ArticleDetailHi : mod.ArticleDetailEn };
      },
    })) as RouteRecord[],

    // Cab Booking
    {
      path: `${basePath}cab-booking/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.CabBookingHi : mod.CabBookingEn };
    },
    },

    // Tours Landing
    {
      path: `${basePath}tour-and-travel-ujjain/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.TourHi : mod.TourEn };
    },
    },
    // Tour Packages (Specific Detailed Pages)
    {
      path: `${basePath}tour-and-travel-ujjain/ujjain-darshan-package/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.TourPackageHi : mod.TourPackageEn };
    },
    },
    {
      path: `${basePath}tour-and-travel-ujjain/ujjain-omkareshwar-package/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.TourPackageHi : mod.TourPackageEn };
    },
    },
    {
      path: `${basePath}tour-and-travel-ujjain/ujjain-omkareshwar-maheshwar-mandu-4-days/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.TourPackageHi : mod.TourPackageEn };
    },
    },
    {
      path: `${basePath}tour-and-travel-ujjain/ujjain-group-tour-package/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.TourPackageHi : mod.TourPackageEn };
    },
    },
    {
      path: `${basePath}tour-and-travel-ujjain/84-mahadev-parikrama-package/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.TourPackageHi : mod.TourPackageEn };
    },
    },
    {
      path: `${basePath}tour-and-travel-ujjain/panch-jyotirlinga-5-days/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.TourPackageHi : mod.TourPackageEn };
    },
    },
    {
      path: `${basePath}tour-and-travel-ujjain/ujjain-baglamukhi-2-days/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.TourPackageHi : mod.TourPackageEn };
    },
    },
    {
      path: `${basePath}tour-and-travel-ujjain/ujjain-sightseeing-package/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.TourPackageHi : mod.TourPackageEn };
    },
    },
    {
      path: `${basePath}tour-and-travel-ujjain/ujjain-3-day-package/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.TourPackageHi : mod.TourPackageEn };
    },
    },
    {
      path: `${basePath}tour-and-travel-ujjain/ujjain-budget-tour-package/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.TourPackageHi : mod.TourPackageEn };
    },
    },
    {
      path: `${basePath}tour-and-travel-ujjain/ujjain-premium-tour-package/`,
      lazy: async () => {
      const mod = await import('./pages/CommerceRoute');
      return { Component: locale === 'hi' ? mod.TourPackageHi : mod.TourPackageEn };
    },
    },
    ...articlesByCategory('tour').map((a) => ({
      path: `${basePath}tour-and-travel-ujjain/${a.slug}/`,
      lazy: async () => {
        const mod = await import('./pages/articles/DetailRoute');
        return { Component: locale === 'hi' ? mod.ArticleDetailHi : mod.ArticleDetailEn };
      },
    })) as RouteRecord[],

    // Puja Info
    {
      path: `${basePath}puja-in-ujjain/`,
      lazy: async () => {
      const mod = await import('./pages/DiscoverRoute');
      return { Component: locale === 'hi' ? mod.PujaHi : mod.PujaEn };
    },
    },
    ...articlesByCategory('puja-info').map((a) => ({
      path: `${basePath}puja-in-ujjain/${a.slug}/`,
      lazy: async () => {
        const mod = await import('./pages/articles/DetailRoute');
        return { Component: locale === 'hi' ? mod.ArticleDetailHi : mod.ArticleDetailEn };
      },
    })) as RouteRecord[],
  ];
}

export const routes: RouteRecord[] = [
  ...buildLocaleRoutes('en', '/'),
  ...buildLocaleRoutes('hi', '/hi/'),
  { path: '*', element: withLocale('en', NotFound) },
];
