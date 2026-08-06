import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import type { Mandir } from '../../lib/types';

// Compact list row used on the /mandirs/ hub for temples beyond each category's first few.
//
// Why this exists: the hub lists 183 temples. Rendering every one as a photo card put
// ~5,000 elements on the page, which a throttled mobile CPU takes ~4.5s to paint
// (Lighthouse mobile perf 68). A row is ~6 elements against a card's ~27, so the long
// tail costs a fraction of the DOM while keeping every temple link crawlable and
// keeping the page scannable — easier to read 183 names as a list than to scroll
// 183 photos.
interface Props {
  mandir: Mandir;
}

const AREA_HI: Record<string, string> = {
  'Mahakal Area': 'महाकाल क्षेत्र',
  'City Center': 'शहर केंद्र',
  'Shipra Bank': 'शिप्रा तट',
  'Rudrasagar': 'रुद्रसागर',
  'Freeganj': 'फ्रीगंज',
  'Bhairavgarh': 'भैरवगढ़',
  'Jawasiya': 'जवासिया',
  'Sandipani Area': 'सांदीपनि क्षेत्र',
  'Nanakheda': 'नानाखेड़ा',
  'Mahakal Vana': 'महाकाल वन',
  'Ankpat Road': 'अंकपात मार्ग',
};

export function MandirRow({ mandir }: Props) {
  const { locale } = useI18n();
  const prefix = locale === 'en' ? '' : '/hi';
  const area = locale === 'hi' ? AREA_HI[mandir.locationArea] || mandir.locationArea : mandir.locationArea;

  return (
    <Link
      to={`${prefix}/mandirs/${mandir.slug}/`}
      className="flex items-baseline justify-between gap-3 border-b border-cream-dark px-3 py-2.5 transition-colors hover:bg-cream-dark/50"
    >
      <span className={`font-semibold text-maroon ${locale === 'hi' ? 'font-sanskrit text-base' : 'text-sm'}`}>
        {mandir.name[locale]}
      </span>
      <span className="shrink-0 text-[11px] text-ink-soft">{area}</span>
    </Link>
  );
}
