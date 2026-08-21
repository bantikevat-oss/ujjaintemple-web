import { useLocation } from 'react-router-dom';
import { I18nProvider, type Locale } from '../../i18n';
import { MandirDetail } from './Detail';

/**
 * Lazy route entry for the 183 temple detail pages.
 *
 * `Detail.tsx` is the ONLY consumer of `data/mandirs`, which eagerly globs all 183
 * FULL records (1.4 MB of JSON). While `routes.tsx` imported it statically, that
 * data sat in the entry graph and Vite emitted the `content` chunk as a
 * `modulepreload` on EVERY page — 395 KB gzipped on the home page, the Simhastha
 * page, everywhere — even though the SSG had already baked each page's copy into
 * its HTML. Behind `lazy`, the chunk becomes an async import that only the temple
 * detail routes pull.
 *
 * The slug comes from the URL rather than a prop because react-router's `lazy` can
 * only hand back a Component, not props. Every one of these routes is registered
 * with a literal path (`/mandirs/<slug>/`, `/hi/mandirs/<slug>/`), so the last
 * segment IS the slug — there is no dynamic `:slug` segment to read via useParams.
 */
function slugFromPath(pathname: string): string {
  return pathname.replace(/\/+$/, '').split('/').pop() ?? '';
}

function LocalisedDetail({ locale }: { locale: Locale }) {
  const { pathname } = useLocation();
  return (
    <I18nProvider locale={locale}>
      <MandirDetail slug={slugFromPath(pathname)} />
    </I18nProvider>
  );
}

export function MandirDetailEn() {
  return <LocalisedDetail locale="en" />;
}

export function MandirDetailHi() {
  return <LocalisedDetail locale="hi" />;
}
