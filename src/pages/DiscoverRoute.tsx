import { useLocation } from 'react-router-dom';
import { I18nProvider, type Locale } from '../i18n';
import { Home } from './Home';
import { MandirIndex } from './mandirs/Index';
import { Mahadev84Page } from './Mahadev84';
import { DeityListPage } from './DeityList';
import { PujaLanding } from './PujaLanding';
import { ThingsToDo } from './ThingsToDo';

/**
 * Lazy chunk for the browsing side — home, the temple index, 84 Mahadev, the deity lists,
 * puja, things-to-do.
 *
 * Grouped apart from CommerceRoute because these answer a different question. A visitor
 * here is still deciding what to see; a visitor in the commerce chunk has decided and is
 * pricing it. Keeping the two apart means neither journey pays for the other's code, which
 * is the whole point — before this split every one of these pages shipped inside the single
 * `app` entry chunk and was downloaded by someone reading a temple's aarti timings.
 *
 * `Home` belongs here rather than staying eager. Leaving it in the entry chunk would have
 * meant every temple and transport page carried the homepage's code, and on this site the
 * landing pages are the temple and transport URLs, not `/` — the homepage is not where the
 * traffic arrives.
 *
 * `VerticalLanding` is deliberately NOT here: it takes nine props from a config object, so
 * there is nothing in the URL to rebuild them from, and at 8 KB it is the smallest page in
 * the codebase — not worth a wrapper that would have to duplicate its config.
 *
 * `DeityListPage` takes a slug, read from the pathname for the same reason as
 * pages/mandirs/DetailRoute.tsx: `lazy` hands back a Component, never props, and each
 * deity list is registered at a literal path whose last segment is its slug.
 */
function slugFromPath(pathname: string): string {
  return pathname.replace(/\/+$/, '').split('/').pop() ?? '';
}

const wrap = (locale: Locale, Page: React.FC) => () => (
  <I18nProvider locale={locale}>
    <Page />
  </I18nProvider>
);

function LocalisedDeityList({ locale }: { locale: Locale }) {
  const { pathname } = useLocation();
  return (
    <I18nProvider locale={locale}>
      <DeityListPage slug={slugFromPath(pathname)} />
    </I18nProvider>
  );
}

export const HomeEn = wrap('en', Home);
export const HomeHi = wrap('hi', Home);
export const MandirIndexEn = wrap('en', MandirIndex);
export const MandirIndexHi = wrap('hi', MandirIndex);
export const Mahadev84En = wrap('en', Mahadev84Page);
export const Mahadev84Hi = wrap('hi', Mahadev84Page);
export const PujaEn = wrap('en', PujaLanding);
export const PujaHi = wrap('hi', PujaLanding);
export const ThingsToDoEn = wrap('en', ThingsToDo);
export const ThingsToDoHi = wrap('hi', ThingsToDo);
export function DeityListEn() { return <LocalisedDeityList locale="en" />; }
export function DeityListHi() { return <LocalisedDeityList locale="hi" />; }
