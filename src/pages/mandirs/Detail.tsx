import { Phone, MapPin, Clock, Sparkles, Camera, Car, Users, Lightbulb, Star, Info, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/global/Layout';
import { SEOHead } from '../../components/global/SEOHead';
import { LeadForm } from '../../components/global/LeadForm';
import { Breadcrumb } from '../../components/global/Breadcrumb';
import { MandalaDivider } from '../../components/global/MandalaDivider';
import { MandirCard } from '../../components/mandir/MandirCard';
import { PhotoGallery } from '../../components/mandir/PhotoGallery';
import { ShareButtons } from '../../components/shared/ShareButtons';
import { useI18n } from '../../i18n';
import { mandirBySlug, getNearbyMandirs } from '../../data/mandirs';
import { SITE } from '../../lib/site';
import { placeOfWorshipSchema, breadcrumbSchema, faqSchema } from '../../lib/schemas';

interface DetailProps { slug: string; }

const TEMPLE_TYPE_HI: Record<string, string> = {
  Jyotirlinga: 'ज्योतिर्लिंग',
  'Shakti Peeth': 'शक्ति पीठ',
  Shakti: 'शक्ति',
  Bhairav: 'भैरव',
  Ganesh: 'गणेश',
  Navagraha: 'नवग्रह',
  Shiva: 'शिव',
  Krishna: 'कृष्ण',
  Ram: 'राम',
  Historical: 'ऐतिहासिक',
  Jain: 'जैन',
};

const AREA_HI: Record<string, string> = {
  'Mahakal Area': 'महाकाल क्षेत्र',
  'Mahakal Vana': 'महाकाल वन',
  Bhairavgarh: 'भैरवगढ़',
  Rudrasagar: 'रुद्र सागर',
  Jawasiya: 'जवासिया',
  Freeganj: 'फ्रीगंज',
  Nanakheda: 'नानाखेड़ा',
  'Shipra Bank': 'शिप्रा तट',
  'Ankpat Road': 'अंकपात मार्ग',
  'Sandipani Area': 'सांदीपनि क्षेत्र',
  'City Center': 'मध्य उज्जैन',
};

const CROWD_HI: Record<string, string> = {
  low: 'कम', moderate: 'मध्यम', high: 'अधिक', 'very-high': 'अत्यधिक',
};
const CROWD_EN: Record<string, string> = {
  low: 'Low', moderate: 'Moderate', high: 'High', 'very-high': 'Very High',
};
const CROWD_COLOR: Record<string, string> = {
  low: 'bg-blue-50 text-blue-700',
  moderate: 'bg-saffron-50 text-saffron-700',
  high: 'bg-orange-50 text-orange-700',
  'very-high': 'bg-maroon-50 text-maroon',
};

// ── Related-puja internal-link map (SEO: passes authority to high-value puja money pages) ──
// Frames as puja/anushthan per hard-rule (no guaranteed-cure claims). Mangalnath → navgrah-shanti,
// NOT mangal-dosh (MDP apna site owns that keyword — avoid internal cannibalisation).
const PUJA_LINKS: Record<string, { hi: string; en: string; desc: { hi: string; en: string } }> = {
  'rudrabhishek-ujjain': { hi: 'रुद्राभिषेक पूजा', en: 'Rudrabhishek Puja', desc: { hi: 'महाकालेश्वर में शिव कृपा हेतु प्रामाणिक वैदिक अभिषेक।', en: 'Authentic Vedic abhishek at Mahakaleshwar for Shiva blessings.' } },
  'mahamrityunjaya-puja': { hi: 'महामृत्युंजय जाप', en: 'Mahamrityunjaya Jaap', desc: { hi: 'आरोग्य एवं दीर्घायु की कामना हेतु जाप अनुष्ठान।', en: 'Jaap anushthan for health and long life.' } },
  'kaal-sarp-dosh-nivaran': { hi: 'काल सर्प दोष पूजा', en: 'Kaal Sarp Dosh Puja', desc: { hi: 'उज्जैन में प्रामाणिक वैदिक विधि से काल सर्प दोष पूजा।', en: 'Kaal Sarp Dosh puja by authentic Vedic vidhi in Ujjain.' } },
  'pitru-dosh-nivaran': { hi: 'पितृ दोष निवारण', en: 'Pitru Dosh Nivaran', desc: { hi: 'पितृ शांति हेतु पूजा एवं तर्पण अनुष्ठान।', en: 'Puja and tarpan anushthan for Pitru shanti.' } },
  'navgrah-shanti': { hi: 'नवग्रह शांति पूजा', en: 'Navgrah Shanti Puja', desc: { hi: 'ग्रह दोष शांति हेतु नवग्रह पूजा।', en: 'Navgrah puja for planetary peace.' } },
};

function relatedPujaSlugs(slug: string, templeType: string): string[] {
  const bySlug: Record<string, string[]> = {
    mangalnath: ['navgrah-shanti', 'kaal-sarp-dosh-nivaran'],
    'kal-bhairav-ujjain': ['kaal-sarp-dosh-nivaran', 'pitru-dosh-nivaran'],
    'navgraha-mandir-ujjain': ['navgrah-shanti', 'kaal-sarp-dosh-nivaran'],
  };
  if (bySlug[slug]) return bySlug[slug];
  const byType: Record<string, string[]> = {
    Jyotirlinga: ['rudrabhishek-ujjain', 'mahamrityunjaya-puja'],
    Shiva: ['rudrabhishek-ujjain', 'mahamrityunjaya-puja'],
    Bhairav: ['kaal-sarp-dosh-nivaran', 'pitru-dosh-nivaran'],
    Navagraha: ['navgrah-shanti', 'kaal-sarp-dosh-nivaran'],
  };
  return byType[templeType] || [];
}

export function MandirDetail({ slug }: DetailProps) {
  const mandir = mandirBySlug.get(slug);
  const { locale } = useI18n();
  const prefix = locale === 'en' ? '' : '/hi';

  if (!mandir) return null;

  const path = `/mandirs/${mandir.slug}/`;
  const canonical = locale === 'hi' ? `${SITE.url}${path}` : `${SITE.url}/en${path}`;
  const title = locale === 'hi'
    ? `${mandir.name.hi} उज्जैन — दर्शन समय, इतिहास, कैसे पहुँचें | ${SITE.phone}`
    : `${mandir.name.en} Ujjain — Darshan Time, History, How to Reach | ${SITE.phone}`;
  const description = locale === 'hi'
    ? `${mandir.shortIntro.hi.substring(0, 150)}... यात्रा सहायता: ${SITE.phone}`
    : `${mandir.shortIntro.en.substring(0, 150)}... Plan darshan: ${SITE.phone}`;

  const nearby = getNearbyMandirs(mandir);
  const pujaSlugs = relatedPujaSlugs(mandir.slug, mandir.templeType).filter((s) => PUJA_LINKS[s]);

  const schemas = [
    placeOfWorshipSchema({
      slug: mandir.slug, name: mandir.name.en, nameAlt: mandir.name.hi,
      description: mandir.shortIntro.en,
      image: `${SITE.url}${mandir.photos[0] || '/images/og/default.webp'}`,
      url: canonical, address: mandir.address.en, geo: mandir.geo,
      hours: [`Mo-Su ${mandir.darshanTimingSummary.en}`], telephone: mandir.phone,
    }),
    breadcrumbSchema({ items: [
      { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
      { name: locale === 'hi' ? 'मंदिर' : 'Temples', url: `${SITE.url}/mandirs/` },
      { name: mandir.name[locale], url: canonical },
    ]}),
    ...(mandir.faqs ? [faqSchema(mandir.faqs.map((f) => ({ q: (f.question || f.q)![locale], a: (f.answer || f.a)![locale] })))] : []),
  ];

  const typeLabel = locale === 'hi' ? (TEMPLE_TYPE_HI[mandir.templeType] || mandir.templeType) : mandir.templeType;
  const areaLabel = locale === 'hi' ? (AREA_HI[mandir.locationArea] || mandir.locationArea) : mandir.locationArea;

  return (
    <>
      <SEOHead title={title} description={description} path={path} locale={locale} image={mandir.photos[0]} schemas={schemas} />
      <Layout>
        <Breadcrumb items={[
          { label: locale === 'hi' ? 'मंदिर' : 'Temples', href: `${prefix}/mandirs/` },
          { label: mandir.name[locale] },
        ]} />

        {/* ── HERO ── */}
        {mandir.photos[0] && !mandir.photos[0].includes('placeholder') ? (
          /* ── PHOTO HERO — full-bleed when a real image is available ── */
          <>
            <header className="relative flex flex-col justify-end overflow-hidden bg-maroon-950 border-b-4 border-gold" style={{ minHeight: '52vh' }}>
              <div className="absolute inset-0 z-0">
                <img
                  src={mandir.photos[0]}
                  alt={mandir.name[locale]}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/75 to-maroon-950/30" />
              </div>
              <div className="relative z-10 container-page pb-8 pt-32 sm:pb-12">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-gold text-maroon-900 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest shadow">{typeLabel}</span>
                  <span className="bg-white/20 backdrop-blur-sm text-white rounded-full px-3 py-1 text-[11px] font-semibold">{areaLabel}</span>
                </div>
                <h1 className={`font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-tight mb-1 ${locale === 'hi' ? 'font-sanskrit text-4xl sm:text-5xl md:text-6xl' : 'font-serif text-3xl sm:text-5xl md:text-6xl'}`}>
                  {mandir.name[locale]}
                </h1>
                <p className="text-gold text-sm sm:text-base font-semibold mb-5">{mandir.deity[locale]}</p>
                <div className="flex flex-wrap gap-3">
                  <a href={SITE.phoneTel} className="btn-call">
                    <Phone className="h-4 w-4" /> {locale === 'hi' ? 'यात्रा सहायता लें' : 'Get Trip Help'}
                  </a>
                  <a href={`https://maps.google.com/?q=${mandir.geo.lat},${mandir.geo.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                    <MapPin className="h-4 w-4" /> {locale === 'hi' ? 'रास्ता देखें' : 'Get Directions'}
                  </a>
                </div>
              </div>
            </header>

          </>
        ) : (
          /* ── TEXT-ONLY HERO fallback (no photo) ── */
          <section className="container-page py-8 sm:py-10">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-saffron-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-saffron-700">{typeLabel}</span>
                  <span className="rounded-full bg-cream-dark px-3 py-1 text-[11px] font-semibold text-ink-mute">{areaLabel}</span>
                </div>
                <h1 className={`mt-3 font-bold text-maroon leading-tight ${locale === 'hi' ? 'font-sanskrit text-4xl sm:text-5xl' : 'font-serif text-3xl sm:text-4xl md:text-5xl'}`}>
                  {mandir.name[locale]}
                </h1>
                <p className="mt-1 text-base font-medium text-ink-mute">{mandir.deity[locale]}</p>
                <p className={`mt-4 leading-relaxed text-ink-soft ${locale === 'hi' ? 'text-lg' : 'text-base sm:text-lg'}`}>
                  {mandir.shortIntro[locale]}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={SITE.phoneTel} className="btn-call">
                    <Phone className="h-4 w-4" /> {locale === 'hi' ? 'यात्रा सहायता लें' : 'Get Trip Help'}
                  </a>
                  <a href={`https://maps.google.com/?q=${mandir.geo.lat},${mandir.geo.lng}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    <MapPin className="h-4 w-4" /> {locale === 'hi' ? 'रास्ता देखें' : 'Get Directions'}
                  </a>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 rounded-lg bg-cream p-3">
                    <Clock className="h-5 w-5 flex-shrink-0 text-maroon" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-mute">{locale === 'hi' ? 'दर्शन समय' : 'Darshan'}</p>
                      <p className="text-sm font-bold text-ink">{mandir.darshanTimingSummary[locale]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-cream p-3">
                    <Sparkles className="h-5 w-5 flex-shrink-0 text-maroon" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-mute">{locale === 'hi' ? 'प्रवेश शुल्क' : 'Entry Fee'}</p>
                      <p className="text-sm font-bold text-ink">{mandir.entryFee[locale]}</p>
                    </div>
                  </div>
                </div>
              </div>
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <LeadForm defaultService="darshanPlan" sourcePage={`mandir/${mandir.slug}`} />
              </aside>
            </div>
          </section>
        )}

        {/* ── QUICK FACTS BAR ── */}
        {(mandir.crowdLevel || mandir.photographyAllowed !== undefined || mandir.parkingAvailable) && (
          <section className="border-y border-cream-dark bg-cream-dark/30">
            <div className="container-page py-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {mandir.crowdLevel && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-maroon" />
                    <span className="font-semibold text-ink-soft">{locale === 'hi' ? 'भीड़' : 'Crowd'}:</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${CROWD_COLOR[mandir.crowdLevel]}`}>
                      {locale === 'hi' ? CROWD_HI[mandir.crowdLevel] : CROWD_EN[mandir.crowdLevel]}
                    </span>
                  </div>
                )}
                {mandir.photographyAllowed !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <Camera className="h-4 w-4 text-maroon" />
                    <span className="font-semibold text-ink-soft">{locale === 'hi' ? 'फ़ोटो' : 'Photography'}:</span>
                    <span className={`text-xs font-bold ${mandir.photographyAllowed ? 'text-blue-700' : 'text-maroon'}`}>
                      {mandir.photographyAllowed ? (locale === 'hi' ? 'अनुमति' : 'Allowed') : (locale === 'hi' ? 'प्रतिबंधित' : 'Restricted')}
                    </span>
                  </div>
                )}
                {mandir.parkingAvailable && (
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="h-4 w-4 text-maroon" />
                    <span className="font-semibold text-ink-soft">{locale === 'hi' ? 'पार्किंग' : 'Parking'}:</span>
                    <span className="text-xs font-bold text-ink">
                      {locale === 'hi'
                        ? { available: 'उपलब्ध', limited: 'सीमित', shared: 'साझा', none: 'नहीं' }[mandir.parkingAvailable]
                        : { available: 'Available', limited: 'Limited', shared: 'Shared', none: 'None' }[mandir.parkingAvailable]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── PHOTOS — only extra photos (photos[1:]) to avoid duplicating hero image ── */}
        {mandir.photos.filter((p) => p && !p.includes('placeholder')).length > 1 && (
          <section className="container-page py-4">
            <h2 className="mb-3 font-serif text-xl font-bold text-maroon">{locale === 'hi' ? 'और फ़ोटो' : 'More Photos'}</h2>
            <PhotoGallery photos={mandir.photos.slice(1)} alt={mandir.name[locale]} />
          </section>
        )}

        {/* ── INTRO + HISTORY (blog-style, two columns with sticky form) ── */}
        <section className="container-page py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Intro paragraph as blog lead */}
              <p className={`leading-[1.9] text-ink first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-maroon first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1 ${locale === 'hi' ? 'text-lg' : 'text-base sm:text-lg'}`}>
                {mandir.shortIntro[locale]}
              </p>

              {/* History heading */}
              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">
                {locale === 'hi' ? 'इतिहास एवं पौराणिक महत्व' : 'History & Significance'}
              </p>
              <h2 className={`mt-2 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-3xl sm:text-4xl' : 'font-serif text-2xl sm:text-3xl'}`}>
                {locale === 'hi' ? `${mandir.name.hi} का इतिहास` : `History of ${mandir.name.en}`}
              </h2>
              <div className="mt-4">
                <p className="text-base leading-[1.9] text-ink-soft sm:text-lg">{mandir.history[locale]}</p>
                {mandir.establishedEra && (
                  <div className="mt-5 flex gap-3 rounded-lg border-l-4 border-gold bg-gold-50/60 p-4">
                    <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-600" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gold-700">{locale === 'hi' ? 'स्थापना काल' : 'Established Era'}</p>
                      <p className="mt-1 text-sm text-ink-soft">{mandir.establishedEra[locale]}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <LeadForm defaultService="darshanPlan" sourcePage={`mandir/${mandir.slug}`} />
            </aside>
          </div>
        </section>

        {/* ── SPECIAL OCCASIONS ── */}
        {mandir.specialOccasions && (
          <section className="bg-maroon-900 py-7">
            <div className="container-page">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{locale === 'hi' ? 'विशेष उत्सव एवं पर्व' : 'Special Occasions'}</p>
              <h2 className={`mt-2 font-bold text-cream ${locale === 'hi' ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-xl sm:text-2xl'}`}>
                {locale === 'hi' ? 'कब जाएँ — विशेष दिन' : 'Best Times to Visit'}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-cream/80">{mandir.specialOccasions[locale]}</p>
            </div>
          </section>
        )}


        {/* ── LOCATION & HOW TO REACH ── */}
        <section className="bg-cream-dark/30 py-7">
          <div className="container-page">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">{locale === 'hi' ? 'स्थान एवं यात्रा' : 'Location & Getting There'}</p>
            <h2 className={`mt-2 mb-5 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-xl sm:text-2xl'}`}>
              {locale === 'hi' ? 'पता एवं कैसे पहुँचें' : 'Address & How to Reach'}
            </h2>
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Address card */}
              <div className="flex items-start gap-4 rounded-2xl border border-cream-dark bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-maroon-900 text-gold">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-mute mb-1">{locale === 'hi' ? 'पता' : 'Address'}</p>
                  <p className="text-base font-semibold text-maroon leading-snug">{mandir.address[locale]}</p>
                  {mandir.phone && (
                    <p className="mt-1 text-sm text-ink-soft">
                      <span className="font-semibold">{locale === 'hi' ? 'फ़ोन: ' : 'Phone: '}</span>
                      <a href={`tel:${mandir.phone}`} className="text-maroon font-semibold hover:underline">{mandir.phone}</a>
                    </p>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${mandir.geo.lat},${mandir.geo.lng}&travelmode=driving`}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-maroon px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-maroon-900 transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {locale === 'hi' ? 'Google Maps पर खोलें' : 'Open in Google Maps'}
                  </a>
                </div>
              </div>
              {/* How to reach */}
              <div className="space-y-4">
                <p className="text-base leading-relaxed text-ink-soft">{mandir.howToReach[locale]}</p>
                {mandir.prasadInfo && (
                  <div className="flex gap-3 rounded-xl border border-cream-dark bg-white p-4">
                    <span className="flex-shrink-0 text-lg">🪔</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-saffron-700">{locale === 'hi' ? 'प्रसाद एवं अर्पण' : 'Prasad & Offerings'}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{mandir.prasadInfo[locale]}</p>
                    </div>
                  </div>
                )}
                {mandir.simhasthaRelevance && (
                  <div className="rounded-xl border border-gold/40 bg-gradient-to-r from-gold-50/60 to-cream p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-gold-700 mb-1">{locale === 'hi' ? '⭐ सिंहस्थ 2028' : '⭐ Simhastha 2028'}</p>
                    <p className="text-sm leading-relaxed text-ink-soft">{mandir.simhasthaRelevance[locale]}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── VISIT TIPS + LOCAL BELIEFS — combined ── */}
        {(mandir.visitTips || mandir.localBeliefs) && (
          <section className="container-page pt-5 pb-4">
            <div className="grid gap-6 lg:grid-cols-2">
              {mandir.visitTips && (
                <div className="rounded-2xl border border-saffron/30 bg-saffron-50 p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-saffron text-white">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-saffron-700">{locale === 'hi' ? 'यात्री सुझाव' : 'Visitor Tips'}</p>
                      <h3 className={`mt-1 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-xl' : 'font-serif text-lg'}`}>
                        {locale === 'hi' ? 'जानने योग्य बातें' : 'What You Should Know'}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">{mandir.visitTips[locale]}</p>
                    </div>
                  </div>
                </div>
              )}
              {mandir.localBeliefs && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">{locale === 'hi' ? 'स्थानीय मान्यताएँ' : 'Local Traditions'}</p>
                  <h2 className={`mt-2 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-xl sm:text-2xl'}`}>
                    {locale === 'hi' ? 'जनश्रुति एवं परंपरा' : 'Folk Beliefs & Traditions'}
                  </h2>
                  <p className="mt-3 text-base leading-[1.9] text-ink-soft">{mandir.localBeliefs[locale]}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── SPECIAL FACTS ── */}
        {mandir.specialFacts && (
          <section className="container-page pt-3 pb-4">
            <div className="relative overflow-hidden rounded-2xl bg-maroon-900 px-6 py-7 sm:px-8">
              <div className="absolute right-4 top-4 text-6xl font-bold text-white/5">★</div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{locale === 'hi' ? 'विशेष तथ्य' : 'Did You Know?'}</p>
              <p className="mt-3 text-base leading-relaxed text-cream/90 sm:text-lg">{mandir.specialFacts[locale]}</p>
            </div>
          </section>
        )}

        {/* ── FAQs ── */}
        {mandir.faqs && mandir.faqs.length > 0 && (
          <section className="container-page pt-4 pb-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">{locale === 'hi' ? 'सामान्य प्रश्न' : 'Frequently Asked'}</p>
            <h2 className={`mt-2 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-3xl sm:text-4xl' : 'font-serif text-2xl sm:text-3xl'}`}>
              {locale === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
            </h2>
            <div className="mt-5 max-w-3xl divide-y divide-gold/25 border-y border-gold/25">
              {mandir.faqs.map((f, i) => (
                <details key={i} className="group py-4">
                  <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                    <span className={`font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-lg' : 'font-serif text-base'}`}>{(f.question || f.q)![locale]}</span>
                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-600 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 pr-10 text-base leading-relaxed text-ink-soft">{(f.answer || f.a)![locale]}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── RELATED PUJA (internal links → high-value puja pages) ── */}
        {pujaSlugs.length > 0 && (
          <section className="container-page pt-4 pb-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">{locale === 'hi' ? 'पूजा एवं अनुष्ठान' : 'Puja & Anushthan'}</p>
            <h2 className={`mt-2 mb-2 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-xl sm:text-2xl'}`}>
              {locale === 'hi' ? `${mandir.name.hi} से जुड़ी पूजाएँ` : `Puja Related to ${mandir.name.en}`}
            </h2>
            <p className="mb-5 max-w-2xl text-sm leading-relaxed text-ink-soft">
              {locale === 'hi'
                ? 'उज्जैन के अनुभवी पंडितों द्वारा प्रामाणिक वैदिक विधि से पूजा एवं अनुष्ठान। बुकिंग सहायता हेतु सम्पर्क करें।'
                : 'Puja and anushthan by experienced Ujjain pandits following authentic Vedic vidhi. Contact us for booking help.'}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {pujaSlugs.map((s) => (
                <Link
                  key={s}
                  to={`${prefix}/puja-in-ujjain/${s}/`}
                  className="group flex items-start gap-3 rounded-2xl border border-gold/40 bg-gradient-to-br from-gold-50/60 to-cream p-5 transition-colors hover:border-maroon/40 hover:bg-gold-50"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-maroon-900 text-gold">🪔</span>
                  <div className="flex-1">
                    <h3 className={`flex items-center gap-1 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-lg' : 'font-serif text-base'}`}>
                      {PUJA_LINKS[s][locale]}
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{PUJA_LINKS[s].desc[locale]}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── NEARBY TEMPLES ── */}
        {nearby.length > 0 && (
          <>
            <MandalaDivider />
            <section className="bg-cream py-8">
              <div className="container-page">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">{locale === 'hi' ? 'आसपास के मंदिर' : 'Explore Nearby'}</p>
                <h2 className={`mt-2 mb-5 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-2xl sm:text-3xl'}`}>
                  {locale === 'hi' ? 'निकटतम मंदिर' : 'Nearby Temples'}
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {nearby.map((m) => <MandirCard key={m.slug} mandir={m} />)}
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── SHARE ── */}
        <section className="container-page py-4">
          <div className="flex flex-wrap items-center gap-3">
            <ShareButtons url={canonical} title={mandir.name[locale]} />
          </div>
        </section>
      </Layout>
    </>
  );
}
