import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Layout } from '../../components/global/Layout';
import { SEOHead } from '../../components/global/SEOHead';
import { LeadForm } from '../../components/global/LeadForm';
import { MandirCard } from '../../components/mandir/MandirCard';
import { Breadcrumb } from '../../components/global/Breadcrumb';
import { useI18n } from '../../i18n';
import { mandirs } from '../../data/mandirs';
import { breadcrumbSchema } from '../../lib/schemas';
import { SITE } from '../../lib/site';

const PER_PAGE_OPTIONS = [12, 24, 48, 96];
const DEFAULT_PER_PAGE = 24;

const TEMPLE_TYPES = [
  { id: 'all',           hi: 'सभी',           en: 'All' },
  { id: 'Jyotirlinga',   hi: 'ज्योतिर्लिंग',  en: 'Jyotirlinga' },
  { id: 'Shakti Peeth',  hi: 'शक्ति पीठ',    en: 'Shakti Peeth' },
  { id: 'Shakti',        hi: 'शक्ति',          en: 'Shakti' },
  { id: 'Shiva',         hi: 'शिव',            en: 'Shiva' },
  { id: 'Navagraha',     hi: 'नवग्रह',         en: 'Navagraha' },
  { id: 'Ganesh',        hi: 'गणेश',           en: 'Ganesh' },
  { id: 'Bhairav',       hi: 'भैरव',           en: 'Bhairav' },
  { id: 'Krishna',       hi: 'कृष्ण',          en: 'Krishna' },
  { id: 'Ram',           hi: 'राम',            en: 'Ram' },
  { id: 'Jain',          hi: 'जैन',            en: 'Jain' },
  { id: 'Historical',    hi: 'ऐतिहासिक',       en: 'Historical' },
];

const SORT_OPTIONS = [
  { id: 'featured',  hi: 'चुनिंदा पहले',     en: 'Featured first' },
  { id: 'alphabetical', hi: 'वर्णानुक्रम',  en: 'Alphabetical' },
];

export function MandirIndex() {
  const { locale } = useI18n();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(DEFAULT_PER_PAGE);
  const gridRef = useRef<HTMLDivElement>(null);

  const title = locale === 'hi'
    ? `उज्जैन के ${mandirs.length}+ प्रमुख मन्दिर — सत्यापित दर्शन समय, इतिहास, फ़ोटो (2026 अद्यतन)`
    : `${mandirs.length}+ Major Temples of Ujjain — Verified Timings, History, Photos (2026 Updated)`;
  const description = locale === 'hi'
    ? `उज्जैन के सभी प्रमुख मन्दिरों की पूरी सूची — महाकालेश्वर, काल भैरव, मंगलनाथ, चिंतामण गणेश, हरसिद्धि माता। सत्यापित दर्शन समय, इतिहास, फ़ोटो। यात्रा सहायता: ${SITE.phone}`
    : `Complete list of all major Ujjain temples — Mahakaleshwar, Kal Bhairav, Mangalnath, Chintaman Ganesh, Harsiddhi Mata. Verified darshan timings, history, photos. Plan: ${SITE.phone}`;

  const filtered = useMemo(() => {
    let result = typeFilter === 'all' ? mandirs : mandirs.filter((m) => m.templeType === typeFilter);
    if (sortBy === 'alphabetical') {
      result = [...result].sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale === 'hi' ? 'hi-IN' : 'en'));
    } else {
      // featured first (default order already does this)
      result = [...result].sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
    }
    return result;
  }, [typeFilter, sortBy, locale]);

  // Reset to page 1 whenever filter/sort/per-page changes
  useEffect(() => { setPage(1); }, [typeFilter, sortBy, perPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(startIdx, startIdx + perPage);

  const goToPage = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Build a compact page range — always show first, last, current and neighbors
  const pageNumbers = useMemo<(number | 'ellipsis')[]>(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
    const sorted = [...pages].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b);
    const result: (number | 'ellipsis')[] = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) result.push('ellipsis');
      result.push(p);
    });
    return result;
  }, [totalPages, currentPage]);

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        path="/mandirs/"
        locale={locale}
        schemas={[breadcrumbSchema({ items: [
          { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
          { name: locale === 'hi' ? 'मन्दिर' : 'Temples', url: `${SITE.url}/mandirs/` },
        ]})]}
      />
      <Layout>
        <Breadcrumb items={[{ label: locale === 'hi' ? 'मन्दिर' : 'Temples' }]} />

        {/* HERO — rich maroon gradient */}
        <section className="relative overflow-hidden bg-gradient-to-b from-maroon-900 via-maroon-800 to-maroon-700 py-14 sm:py-20">
          {/* Decorative radial glows */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-64 w-64 translate-x-1/2 rounded-full bg-saffron/10 blur-3xl" />
          </div>
          <div className="container-page relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                {locale === 'hi' ? '॥ मन्दिर निर्देशिका ॥' : '✦ Temple Directory ✦'}
              </p>
              <h1 className={`mt-4 font-bold text-cream leading-tight ${locale === 'hi' ? 'font-sanskrit text-4xl sm:text-5xl md:text-6xl' : 'font-serif text-4xl sm:text-5xl md:text-6xl'}`}>
                {locale === 'hi' ? 'उज्जैन के प्रमुख मन्दिर' : 'Major Temples of Ujjain'}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-cream/80 sm:text-lg">
                {locale === 'hi'
                  ? `महाकालेश्वर से लेकर काल भैरव तक — उज्जैन के ${mandirs.length}+ प्रमुख मन्दिरों की सत्यापित जानकारी। दर्शन समय · इतिहास · फ़ोटो · दिशा-निर्देश।`
                  : `From Mahakaleshwar to Kal Bhairav — verified information on ${mandirs.length}+ major temples of Ujjain. Darshan timings · history · photos · directions.`}
              </p>
              <div className="mt-5 flex items-center justify-center gap-3 text-xs text-gold/80">
                <span>{locale === 'hi' ? 'स्थानीय स्रोतों से सत्यापित' : 'Verified from local sources'}</span>
                <span>·</span>
                <span>{locale === 'hi' ? 'अद्यतन 31 मई 2026' : 'Updated 31 May 2026'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* FILTER BAR — chips + sort, NOT search bar (editorial directory pattern) */}
        <section className="border-y border-cream-dark/60 bg-cream-dark/30">
          <div className="container-page py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Type chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-mute mr-1">
                  {locale === 'hi' ? 'प्रकार:' : 'Type:'}
                </span>
                {TEMPLE_TYPES.map((t) => {
                  const active = typeFilter === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTypeFilter(t.id)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${active ? 'bg-maroon text-cream' : 'bg-white text-ink-soft ring-1 ring-cream-dark hover:ring-maroon/30 hover:text-maroon'}`}
                      aria-pressed={active}
                    >
                      {t[locale]}
                    </button>
                  );
                })}
              </div>

              {/* Sort + Per-page */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-mute">
                    {locale === 'hi' ? 'क्रम:' : 'Sort:'}
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label={locale === 'hi' ? 'क्रमानुसार' : 'Sort by'}
                    className="rounded-md border border-cream-dark bg-white px-3 py-1.5 text-xs font-semibold text-ink focus:border-maroon focus:outline-none focus:ring-2 focus:ring-maroon/20"
                  >
                    {SORT_OPTIONS.map((s) => (
                      <option key={s.id} value={s.id}>{s[locale]}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-mute">
                    {locale === 'hi' ? 'प्रति पृष्ठ:' : 'Per page:'}
                  </span>
                  <select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    aria-label={locale === 'hi' ? 'प्रति पृष्ठ संख्या' : 'Items per page'}
                    className="rounded-md border border-cream-dark bg-white px-3 py-1.5 text-xs font-semibold text-ink focus:border-maroon focus:outline-none focus:ring-2 focus:ring-maroon/20"
                  >
                    {PER_PAGE_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Result count */}
            <p className="mt-3 text-xs text-ink-mute">
              {filtered.length} {locale === 'hi' ? `मन्दिर मिले${typeFilter !== 'all' ? ` (${TEMPLE_TYPES.find(t=>t.id===typeFilter)?.hi})` : ''}` : `temple${filtered.length !== 1 ? 's' : ''} found${typeFilter !== 'all' ? ` (${TEMPLE_TYPES.find(t=>t.id===typeFilter)?.en})` : ''}`}
              {totalPages > 1 && (
                <>{' · '}{locale === 'hi' ? `पृष्ठ ${currentPage}/${totalPages}` : `Page ${currentPage}/${totalPages}`}</>
              )}
              {' · '}
              <a href={SITE.phoneTel} className="font-semibold text-maroon hover:underline">
                {locale === 'hi' ? 'यात्रा सहायता' : 'Trip help'}: {SITE.phone}
              </a>
            </p>
          </div>
        </section>

        {/* GRID */}
        <section ref={gridRef} className="container-page py-10 sm:py-14 scroll-mt-24">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-cream-dark bg-cream-dark/30 p-10 text-center">
              <p className="text-base text-ink-soft">
                {locale === 'hi' ? 'इस श्रेणी में कोई मन्दिर नहीं मिला।' : 'No temples found in this category.'}
              </p>
              <button
                onClick={() => setTypeFilter('all')}
                className="mt-3 text-sm font-semibold text-maroon underline"
              >
                {locale === 'hi' ? 'सभी देखें' : 'Show all'}
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((m, idx) => (
                  <MandirCard key={m.slug} mandir={m} featured={m.isFeatured} index={idx} />
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <nav
                  aria-label={locale === 'hi' ? 'पृष्ठ नेविगेशन' : 'Pagination'}
                  className="mt-10 flex flex-col items-center gap-3 sm:mt-12"
                >
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label={locale === 'hi' ? 'पिछला पृष्ठ' : 'Previous page'}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-cream-dark bg-white text-ink-soft transition-colors hover:border-maroon hover:text-maroon disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-cream-dark disabled:hover:text-ink-soft sm:h-10 sm:w-10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {pageNumbers.map((p, i) =>
                      p === 'ellipsis' ? (
                        <span key={`e-${i}`} className="px-1 text-sm text-ink-mute">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => goToPage(p)}
                          aria-current={p === currentPage ? 'page' : undefined}
                          className={`inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md px-2 text-sm font-semibold transition-colors sm:h-10 sm:min-w-[2.5rem] ${
                            p === currentPage
                              ? 'bg-maroon text-cream'
                              : 'border border-cream-dark bg-white text-ink-soft hover:border-maroon hover:text-maroon'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label={locale === 'hi' ? 'अगला पृष्ठ' : 'Next page'}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-cream-dark bg-white text-ink-soft transition-colors hover:border-maroon hover:text-maroon disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-cream-dark disabled:hover:text-ink-soft sm:h-10 sm:w-10"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-ink-mute sm:text-xs">
                    {locale === 'hi'
                      ? `दिखा रहे हैं ${startIdx + 1}–${Math.min(startIdx + perPage, filtered.length)} / ${filtered.length}`
                      : `Showing ${startIdx + 1}–${Math.min(startIdx + perPage, filtered.length)} of ${filtered.length}`}
                  </p>
                </nav>
              )}
            </>
          )}

          {/* Editor's note — institutional human voice */}
          <aside className="mt-12 rounded-xl border-l-4 border-gold bg-cream-dark/40 p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-saffron-700">
              {locale === 'hi' ? 'सम्पादक की टिप्पणी' : "Editor’s Note"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
              {locale === 'hi'
                ? 'यहाँ सूचीबद्ध प्रत्येक मन्दिर का दर्शन समय एवं संपर्क जानकारी मन्दिर ट्रस्ट से सीधे अथवा अधिकृत स्रोतों से सत्यापित। यदि कोई जानकारी पुरानी प्रतीत हो — कृपया व्हाट्सऐप पर सूचित करें: '
                : 'Each temple’s darshan timing and contact info has been verified directly with the temple trust or via authoritative sources. If any information appears outdated, please flag it on WhatsApp: '}
              <a href={SITE.whatsapp} className="font-bold text-maroon hover:underline" target="_blank" rel="noopener noreferrer">
                {SITE.phone}
              </a>
            </p>
          </aside>

          <div className="mt-12 mx-auto max-w-2xl">
            <LeadForm sourcePage="mandirs-index" defaultService="darshanPlan" />
          </div>
        </section>
      </Layout>
    </>
  );
}
