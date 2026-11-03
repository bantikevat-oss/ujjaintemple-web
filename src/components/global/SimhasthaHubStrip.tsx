import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useI18n } from '../../i18n';

/*
 * One line from every Simhastha article to the Simhastha hub (2026-11-03).
 *
 * GSC 28d to 10-31: for `ujjain simhastha` (664 impr), `simhastha` (220) and `सिंहस्थ` (985)
 * Google ranked the HISTORY article, EN and HI, at ~9.4 — while the hub /simhastha-2028/ sat
 * at 7.8 for the date queries. Two pages splitting one head term, both stuck at the bottom of
 * page 1. This strip gives the hub the same exact-match anchor from all 14 cluster articles,
 * high on the page, so the head term consolidates on one URL.
 */
export function SimhasthaHubStrip({ source }: { source: string }) {
  const { locale } = useI18n();
  const isHi = locale === 'hi';

  return (
    <Link
      to={`${isHi ? '/hi' : ''}/simhastha-2028/`}
      onClick={() => window.gtag?.('event', 'simhastha_hub_click', { source })}
      className="not-prose my-6 flex items-center gap-3 rounded-xl border border-gold bg-cream px-4 py-3 text-ink no-underline shadow-sm transition hover:border-maroon hover:shadow-md"
    >
      <CalendarDays className="h-5 w-5 flex-shrink-0 text-maroon" />
      <span className="flex-1 text-sm sm:text-base">
        <strong className="text-maroon">{isHi ? 'उज्जैन सिंहस्थ 2028' : 'Ujjain Simhastha 2028'}</strong>{' '}
        {isHi ? '— तिथियाँ, शाही स्नान, ठहरने और आने-जाने की पूरी जानकारी' : '— dates, Shahi Snan, where to stay and how to get there'}
      </span>
      <ArrowRight className="h-4 w-4 flex-shrink-0 text-maroon" />
    </Link>
  );
}
