import { I18nProvider } from '../i18n';
import { SimhasthaLanding } from './SimhasthaLanding';

/**
 * Lazy route entry for the Simhastha 2028 landing page.
 *
 * `SimhasthaLanding.tsx` is this codebase's largest page component by a wide margin —
 * 1,044 lines / 80 KB of source, carrying the Shahi Snan table, the 13 akhadas, the
 * planning blocks and the FAQ. While `routes.tsx` imported it statically it sat in the
 * `app` entry chunk, so every visitor downloaded all of it: the person reading a temple's
 * aarti timings, the person pricing an Omkareshwar cab, everyone.
 *
 * That is a bad trade on the measured numbers. The Simhastha cluster is the site's
 * *worst*-converting section — 70 clicks on 16,395 impressions (0.43%) over the 28 days to
 * 2026-09-27, against a site average of 0.93%, and the landing itself runs at 0.16–0.21%.
 * The page that almost nobody clicks through to was the heaviest thing on the pages they
 * do click.
 *
 * Behind `lazy` it becomes its own async chunk that only the two Simhastha routes fetch.
 * Nothing about the page's own rendering changes: vite-react-ssg still pre-renders its
 * HTML at build time, so the content, the title and the schema are in the served markup
 * exactly as before — only hydration waits for the chunk.
 *
 * Same shape as `pages/mandirs/DetailRoute.tsx`: react-router's `lazy` can only hand back
 * a Component, so the locale is bound here at module scope rather than passed as a prop.
 */
export function SimhasthaEn() {
  return (
    <I18nProvider locale="en">
      <SimhasthaLanding />
    </I18nProvider>
  );
}

export function SimhasthaHi() {
  return (
    <I18nProvider locale="hi">
      <SimhasthaLanding />
    </I18nProvider>
  );
}
