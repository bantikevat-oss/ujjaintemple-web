import { useMemo, useState } from 'react';
import { MapPin, Search, Sparkles } from 'lucide-react';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { LeadForm } from '../components/global/LeadForm';
import { Breadcrumb } from '../components/global/Breadcrumb';
import { useI18n } from '../i18n';
import { mahadev84 } from '../data/mahadev84';
import { breadcrumbSchema } from '../lib/schemas';
import { SITE } from '../lib/site';

export function Mahadev84Page() {
  const { locale } = useI18n();
  const [query, setQuery] = useState('');

  const title = locale === 'hi'
    ? '84 महादेव उज्जैन — पूरी सूची, स्थान व दर्शन क्रम (चौरासी महादेव यात्रा)'
    : '84 Mahadev of Ujjain — Complete List, Locations & Darshan Order';
  const description = locale === 'hi'
    ? `उज्जैन के 84 महादेव मंदिरों की पूरी सूची — नाम, स्थान और यात्रा क्रम। अगस्तेश्वर से दुर्दरेश्वर तक चौरासी महादेव की प्राचीन परिक्रमा। यात्रा सहायता: ${SITE.phone}`
    : `Complete list of the 84 Mahadev (Chaurasi Mahadev) temples of Ujjain — names, locations and parikrama order. Plan your darshan: ${SITE.phone}`;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mahadev84;
    return mahadev84.filter(
      (m) =>
        m.hi.toLowerCase().includes(q) ||
        m.en.toLowerCase().includes(q) ||
        m.areaHi.toLowerCase().includes(q) ||
        m.areaEn.toLowerCase().includes(q) ||
        String(m.n) === q
    );
  }, [query]);

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        path="/84-mahadev-ujjain/"
        locale={locale}
        schemas={[breadcrumbSchema({ items: [
          { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
          { name: locale === 'hi' ? '84 महादेव' : '84 Mahadev', url: `${SITE.url}/84-mahadev-ujjain/` },
        ]})]}
      />
      <Layout>
        <Breadcrumb items={[{ label: locale === 'hi' ? '84 महादेव' : '84 Mahadev' }]} />

        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-b from-maroon-900 via-maroon-800 to-maroon-700 py-16 sm:py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-72 w-72 translate-x-1/2 rounded-full bg-saffron/10 blur-3xl" />
          </div>
          <div className="container-page relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                <Sparkles className="h-3.5 w-3.5" /> {locale === 'hi' ? '॥ चौरासी महादेव यात्रा ॥' : '✦ Chaurasi Mahadev Parikrama ✦'}
              </p>
              <h1 className={`mt-4 font-bold leading-tight text-cream ${locale === 'hi' ? 'font-sanskrit text-4xl sm:text-5xl md:text-6xl' : 'font-serif text-4xl sm:text-5xl md:text-6xl'}`}>
                {locale === 'hi' ? 'उज्जैन के 84 महादेव' : 'The 84 Mahadev of Ujjain'}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-cream/80 sm:text-lg">
                {locale === 'hi'
                  ? 'अवंतिका (उज्जैन) में शिव के 84 स्वरूप विराजमान हैं — इन चौरासी महादेव की परिक्रमा को अत्यंत पुण्यदायी माना जाता है। नीचे पूरी सूची, स्थान और क्रम दिया गया है।'
                  : 'Avantika (Ujjain) enshrines 84 forms of Lord Shiva — the parikrama of these Chaurasi Mahadev is held to be deeply meritorious. The complete list, locations and order are given below.'}
              </p>
              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gold/80">
                <span>{locale === 'hi' ? '84 प्राचीन शिवालय' : '84 ancient Shiva shrines'}</span>
                <span>·</span>
                <span>{locale === 'hi' ? 'क्षिप्रा तट · महाकाल वन' : 'Shipra banks · Mahakal Van'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTRO + SEARCH */}
        <section className="border-b border-cream-dark/60 bg-cream-dark/30">
          <div className="container-page py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
                {locale === 'hi'
                  ? 'मान्यता है कि जो श्रद्धालु सभी 84 महादेव के दर्शन कर लेता है, उसे संपूर्ण तीर्थ का पुण्य प्राप्त होता है। नाम या क्षेत्र से खोजें।'
                  : 'It is believed that a devotee who completes darshan of all 84 Mahadev attains the merit of a full pilgrimage. Search by name or area.'}
              </p>
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={locale === 'hi' ? 'महादेव या क्षेत्र खोजें…' : 'Search Mahadev or area…'}
                  aria-label={locale === 'hi' ? 'महादेव खोजें' : 'Search Mahadev'}
                  className="w-full rounded-full border border-cream-dark bg-white py-2.5 pl-9 pr-4 text-sm text-ink shadow-sm focus:border-maroon focus:outline-none focus:ring-2 focus:ring-maroon/20"
                />
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-mute">
              {filtered.length} / 84 {locale === 'hi' ? 'महादेव' : 'Mahadev'}
              {' · '}
              <a href={SITE.phoneTel} className="font-semibold text-maroon hover:underline">
                {locale === 'hi' ? 'यात्रा सहायता' : 'Trip help'}: {SITE.phone}
              </a>
            </p>
          </div>
        </section>

        {/* GRID */}
        <section className="container-page py-10 sm:py-14">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-cream-dark bg-cream-dark/30 p-10 text-center">
              <p className="text-base text-ink-soft">
                {locale === 'hi' ? 'कोई महादेव नहीं मिला।' : 'No Mahadev found.'}
              </p>
              <button onClick={() => setQuery('')} className="mt-3 text-sm font-semibold text-maroon underline">
                {locale === 'hi' ? 'सभी 84 देखें' : 'Show all 84'}
              </button>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m) => (
                <li
                  key={m.n}
                  className="group flex items-start gap-4 rounded-2xl border border-cream-dark bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-saffron/40 hover:shadow-lg"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-saffron to-maroon font-serif text-lg font-bold text-cream shadow-inner ring-2 ring-gold/40">
                    {m.n}
                  </span>
                  <div className="min-w-0">
                    <h3 className={`truncate font-bold text-ink ${locale === 'hi' ? 'font-sanskrit text-lg' : 'font-serif text-lg'}`}>
                      {locale === 'hi' ? m.hi : m.en}
                    </h3>
                    <p className="truncate text-xs text-ink-mute">
                      {locale === 'hi' ? m.en : m.hi}
                    </p>
                    <p className="mt-1.5 flex items-start gap-1 text-xs text-ink-soft">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-saffron-700" />
                      <span>{locale === 'hi' ? m.areaHi : m.areaEn}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Editor's note */}
          <aside className="mt-12 rounded-xl border-l-4 border-gold bg-cream-dark/40 p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-saffron-700">
              {locale === 'hi' ? 'सम्पादक की टिप्पणी' : "Editor’s Note"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
              {locale === 'hi'
                ? '84 महादेव की सूची एवं स्थान पारंपरिक स्रोतों से संकलित हैं। कुछ शिवालय गलियों में स्थित हैं — दर्शन क्रम व मार्गदर्शन के लिए स्थानीय सहायता लें। कोई सुधार हो तो व्हाट्सऐप पर बताएं: '
                : 'The list and locations of the 84 Mahadev are compiled from traditional sources. Some shrines lie within old lanes — take local help for the darshan order and directions. For corrections, message us on WhatsApp: '}
              <a href={SITE.whatsapp} className="font-bold text-maroon hover:underline" target="_blank" rel="noopener noreferrer">
                {SITE.phone}
              </a>
            </p>
          </aside>

          <div className="mx-auto mt-12 max-w-2xl">
            <LeadForm sourcePage="84-mahadev" defaultService="darshanPlan" />
          </div>
        </section>
      </Layout>
    </>
  );
}
