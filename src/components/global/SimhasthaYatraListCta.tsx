import { Link } from 'react-router-dom';
import { ArrowRight, ListChecks } from 'lucide-react';
import { useI18n } from '../../i18n';

/**
 * One-line pointer to the Simhastha 2028 Yatra List (2026-11-18) — used on the Simhastha hub
 * and the cluster articles. The news section (PHP) carries its own copy of this link in
 * public/news/templates/. `source` goes to GA4 so we can see which page fills the list.
 */
export function SimhasthaYatraListCta({ source }: { source: string }) {
  const { locale } = useI18n();
  const isHi = locale === 'hi';

  return (
    <Link
      to={`${isHi ? '/hi' : ''}/simhastha-2028/simhastha-2028-yatra-list/`}
      onClick={() => window.gtag?.('event', 'yatra_list_click', { source })}
      className="not-prose my-6 flex items-center gap-3 rounded-xl border-2 border-maroon bg-white px-4 py-3 text-ink no-underline shadow-sm transition hover:shadow-md"
    >
      <ListChecks className="h-5 w-5 flex-shrink-0 text-maroon" />
      <span className="flex-1 text-sm sm:text-base">
        <strong className="text-maroon">{isHi ? 'सिंहस्थ 2028 यात्रा सूची' : 'Simhastha 2028 Yatra List'}</strong>{' '}
        {isHi
          ? '— नाम जोड़िए, ठहरने और यात्रा की जानकारी WhatsApp पर पाइए'
          : '— join and get stay and travel updates on WhatsApp'}
      </span>
      <ArrowRight className="h-4 w-4 flex-shrink-0 text-maroon" />
    </Link>
  );
}
