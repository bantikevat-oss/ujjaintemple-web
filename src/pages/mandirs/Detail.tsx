import { Phone, MapPin, Clock, Bell, Camera, Car, Users, Lightbulb, Star, Info, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/global/Layout';
import { SEOHead } from '../../components/global/SEOHead';
import { LeadForm } from '../../components/global/LeadForm';
import { AppPromo } from '../../components/shared/AppPromo';
import { Breadcrumb } from '../../components/global/Breadcrumb';
import { MandalaDivider } from '../../components/global/MandalaDivider';
import { MandirCard } from '../../components/mandir/MandirCard';
import { PhotoGallery } from '../../components/mandir/PhotoGallery';
import { ShareButtons } from '../../components/shared/ShareButtons';
import { useI18n } from '../../i18n';
import { mandirBySlug, getNearbyMandirs } from '../../data/mandirs';
import { SITE } from '../../lib/site';
import { TITLE_MAX, isTitleNoRewrite } from '../../lib/seo';
import { placeOfWorshipSchema, breadcrumbSchema, faqSchema } from '../../lib/schemas';

interface DetailProps { slug: string; }

/**
 * "<temple> timings" is the biggest query family this site ranks for (pos 5–11 on
 * hundreds of impressions each) and it converted at ~0% CTR: every snippet *promised*
 * "darshan timings, aarti schedule" without ever showing a time, so the answer the
 * searcher wanted never appeared in the SERP. Lead the description with the actual
 * hours; the rest of the hand-written copy follows in whatever room is left.
 */
const META_MAX = 165;

/**
 * The 2026-08-14 pass put the real hours into the <meta description> and that was only
 * half the fix: Google renders a <title> very nearly verbatim but rewrites descriptions
 * most of the time, so on "<temple> timings" — still this site's biggest query family —
 * the answer was in the one element the SERP is free to throw away. Measured 2026-10-01
 * (GSC 08-30→09-27): 42 pages sit at position 5.0–9.0 with >=1000 impressions and their
 * CTR ranges from 3.83% down to 0.04% — a 96x spread at the SAME ranking, so the title
 * is the variable, not the position. The three best in that band all put a concrete
 * number in the title; the timing pages promised a category ("Timings, Aarti, History")
 * and showed no time.
 *
 * So compact the timing enough to sit in a title: "लगभग प्रातः 6:00 – रात्रि 9:00"
 * becomes "प्रातः 6–रात्रि 9". Minutes are kept only when they are not :00, because
 * "6:00" buys nothing over "6" and the pixels belong to the keyword.
 *
 * 🔴 The "लगभग"/"Approx." hedge is NOT dropped — it moves to the end of the title.
 * The locked content rule on this site is that no timing may be stated as exact, and a
 * title is the most prominent place that rule has to hold, not the first place to bend it.
 *
 * Returns null when the string is not a plain range (Mahakal Lok is "open all day",
 * Nagchandreshwar opens only on Nag Panchami). Those keep their existing title rather
 * than get a fabricated range.
 */
const HI_PART = 'प्रातः|सुबह|सायं|शाम|दोपहर|रात्रि|रात';

/**
 * The one timing string that is a bulk default rather than a researched fact.
 *
 * 117 of the 183 temples carry exactly this value, and 108 of those 117 were stamped
 * `lastVerified: 2026-05-31` — the single big import batch. The 66 temples with a
 * distinctive timing skew to the later 2026-06-03 batch, where someone was clearly
 * filling in real hours. So this is almost certainly "we did not know, put something
 * plausible", not "we checked and it is 6 to 9".
 *
 * It has been live in the <meta description> since 2026-08-14 and that is tolerable —
 * it is hedged with लगभग and sits in a sentence. Promoting it into the <title> is not:
 * the title is the one element Google renders close to verbatim, and this site's content
 * rules are explicit that an unverified specific does not get stated as fact.
 *
 * 🔧 Self-healing on purpose: the moment someone verifies a temple's real hours and edits
 * its JSON, the string stops matching this constant and that page's title gains its time
 * automatically. Nothing else to remember, no second list to keep in sync.
 *
 * Cost of this gate, measured 2026-10-02 against the 31 low-CTR target pages: four of them
 * lose the timed title (26 clicks / 7,448 impressions of a 1,196-click, 173,490-impression
 * opportunity). The other 14 mandir targets have real timings and keep theirs.
 *
 * Matched on the RANGE at the start of the string, not on the whole string: Ashta Bhairav
 * carries the same default with a qualifier appended ("… (हर मंदिर)"), and an exact-equality
 * test let that one page through. Anchoring to the range catches the qualified variants
 * while a genuinely different range — 5:30 to 10, 7 to 7 — simply does not match.
 */
const UNVERIFIED_DEFAULT_TIMING: Record<'hi' | 'en', RegExp> = {
  hi: /^लगभग\s+प्रातः\s*6:00\s*[–-]\s*रात्रि\s*9:00/,
  en: /^Approx\.\s*6:00\s*AM\s*[–-]\s*9:00\s*PM/i,
};

export function compactTiming(timing: string | undefined, locale: 'hi' | 'en'): string | null {
  const t = (timing ?? '').trim();
  if (!t) return null;

  if (locale === 'hi') {
    const m = t.match(
      new RegExp(`^लगभग\\s+(${HI_PART})\\s*(\\d{1,2}):(\\d{2})\\s*[–-]\\s*(${HI_PART})\\s*(\\d{1,2}):(\\d{2})`),
    );
    if (!m) return null;
    const part = (word: string, hour: string, min: string) => `${word} ${hour}${min === '00' ? '' : `:${min}`}`;
    return `${part(m[1], m[2], m[3])}–${part(m[4], m[5], m[6])}`;
  }

  const m = t.match(/^Approx\.\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return null;
  const part = (hour: string, min: string, mer: string) =>
    `${hour}${min === '00' ? '' : `:${min}`} ${mer.toUpperCase()}`;
  return `${part(m[1], m[2], m[3])}–${part(m[4], m[5], m[6])}`;
}

function leadWithTiming(name: string, timing: string, base: string, locale: 'hi' | 'en', facts?: { aarti?: string; entry?: string }) {
  const head = locale === 'hi'
    ? `${name} दर्शन समय: ${timing}। `
    : `${name} darshan timings: ${timing}. `;
  let tail = base.trim();
  // Hand-written seoDescriptions open with "<Temple name> — <detail>". The head already
  // names the temple, so drop that opener; the length guard keeps a genuine mid-sentence
  // dash from being mistaken for one.
  const dash = tail.search(/\s[—–-]\s/);
  if (dash > 0 && dash < 60) tail = tail.slice(dash + 3).trim();
  // Most of them then open the detail with the very thing the head just answered.
  tail = tail
    .replace(/darshan timings\s*(?:,|and)?\s*/gi, '')
    .replace(/दर्शन समय\s*(?:,|एवं|और)?\s*/g, '');
  // Trailing "Plan your visit: +91 …" gets truncated into a half phone number once the
  // timing takes the front of the snippet — worse than no number. The phone stays on the
  // page, in the CTAs and in the schema.
  tail = tail.replace(/\s*[^.।]*\+91[\d\s+]*[.।]?\s*$/, '').trim();
  if (locale === 'en' && tail) tail = tail.charAt(0).toUpperCase() + tail.slice(1);
  const room = META_MAX - head.length;
  if (room < 40) return head.trim();

  // 🔴 Never clip mid-sentence. The old `slice(…) + '…'` ended 266 of 464 snippets
  // on a dangling half-clause ("…is a rare temple dedicated to…") — in the SERP
  // that reads as a page that could not finish its own thought. Keep only whole
  // sentences.
  if (tail.length > room) {
    const cut = Math.max(tail.lastIndexOf('।', room), tail.lastIndexOf('.', room));
    tail = cut > 0 ? tail.slice(0, cut + 1).trim() : '';
  }

  // Nothing from the prose fits? Fall back to the structured facts rather than
  // shipping a 70-character snippet that leaves half the SERP width unused. Aarti
  // and entry are the next two things this query family asks after timings, they
  // are already on the page, and they are short enough to always fit.
  if (!tail && facts) {
    const bits = locale === 'hi'
      ? [facts.aarti && `आरती — ${facts.aarti}।`, facts.entry && `प्रवेश ${facts.entry}।`]
      : [facts.aarti && `Aarti — ${facts.aarti}.`, facts.entry && `${facts.entry}.`];
    tail = bits.filter(Boolean).join(' ').trim();
    if (tail.length > room) tail = (bits[0] || '').trim();
    if (tail.length > room) tail = '';
  }

  if (!tail) return head.trim();
  return head + tail;
}

/**
 * schema.org openingHours needs `Mo-Su 06:00-21:00`; the content JSON carries a human
 * string ("Approx. 6:00 AM – 9:00 PM", sometimes with a trailing note). Emitting the
 * human string made the property unparseable on all 183 temple pages, so normalise it
 * and simply omit the property when a timing does not fit the expected shape.
 */
function toSchemaHours(summary: string): string[] | undefined {
  const m = summary.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return undefined;
  const to24 = (h: string, min: string, mer: string) => {
    let hr = parseInt(h, 10) % 12;
    if (mer.toUpperCase() === 'PM') hr += 12;
    return `${String(hr).padStart(2, '0')}:${min}`;
  };
  return [`Mo-Su ${to24(m[1], m[2], m[3])}-${to24(m[4], m[5], m[6])}`];
}

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
  moderate: 'bg-cream-dark text-saffron-700',
  high: 'bg-orange-50 text-orange-700',
  'very-high': 'bg-cream-dark text-maroon',
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
  const canonical = locale === 'en' ? `${SITE.url}${path}` : `${SITE.url}/hi${path}`;
  // Many temple names already end in "Ujjain" ("Gopal Mandir Ujjain") — appending the
  // city unconditionally produced "Gopal Mandir Ujjain Ujjain". Only add it when absent.
  const nameHi = mandir.name.hi;
  const nameEn = mandir.name.en;
  const withCityHi = /उज्जैन/.test(nameHi) ? nameHi : `${nameHi} उज्जैन`;
  const withCityEn = /\bUjjain\b/i.test(nameEn) ? nameEn : `${nameEn} Ujjain`;
  // Phone number dropped from <title>: Google rewrites titles carrying one, and it
  // burns SERP pixel width that the keyword needs. It stays in the description + CTAs.
  // The generic suffix ("…, आरती, इतिहास व कैसे पहुँचें") cost ~30 characters and told
  // the searcher nothing they had not already typed. Spend those characters on the hours
  // instead; keep the exact-match head term ("<temple> उज्जैन") first, because that is
  // what ranks and none of this is worth a position.
  //
  // Two constraints shape the exact wording, both learned the hard way in this session:
  //
  // 1. The hedge goes BEFORE the number ("दर्शन लगभग 6–9", not "दर्शन 6–9 (लगभग)").
  //    A trailing "(लगभग)" is the first thing a truncating SERP drops, and a timing that
  //    loses its hedge is worse than one that never showed — it becomes an exact claim,
  //    which this site's content rules forbid.
  // 2. No comma in the suffix, and the whole thing must fit TITLE_MAX natively.
  //    clampTitle() shortens a comma-separated promise list from the right and, failing
  //    that, falls back to the subject alone — so an over-budget "…— दर्शन लगभग X, आरती"
  //    would have been clamped down to just the temple name and lost the timing entirely.
  //    Long names (the 84-Mahadev tail runs to 48 chars in English) therefore keep the
  //    generic title rather than get a half-rendered one.
  const generic = locale === 'hi'
    ? `${withCityHi} — दर्शन समय, आरती, इतिहास व कैसे पहुँचें`
    : `${withCityEn} — Darshan Timings, Aarti, History & How to Reach`;
  // G2: a page already earning ≥50 clicks/28d keeps the title it earns with. This change
  // is a hypothesis about CTR, and the pages with the most to lose are exactly the ones
  // where it must not be tested blind — they get measured first, rewritten later.
  const rawTiming = mandir.darshanTimingSummary[locale];
  const shortTiming =
    isTitleNoRewrite(path, locale) || UNVERIFIED_DEFAULT_TIMING[locale].test((rawTiming ?? '').trim())
      ? null
      : compactTiming(rawTiming, locale);
  const withTiming = shortTiming
    ? (locale === 'hi'
        ? `${withCityHi} — दर्शन लगभग ${shortTiming}`
        : `${withCityEn} — Darshan approx. ${shortTiming}`)
    : null;
  const title = mandir.seoTitle?.[locale]
    ?? (withTiming && withTiming.length <= TITLE_MAX ? withTiming : generic);
  const nameForMeta = locale === 'hi' ? withCityHi : withCityEn;
  const description = leadWithTiming(
    nameForMeta,
    mandir.darshanTimingSummary[locale],
    mandir.seoDescription?.[locale] ?? mandir.shortIntro[locale],
    locale,
    { aarti: mandir.aartiTiming?.[locale], entry: mandir.entryFee?.[locale] },
  );

  const nearby = getNearbyMandirs(mandir);
  const pujaSlugs = relatedPujaSlugs(mandir.slug, mandir.templeType).filter((s) => PUJA_LINKS[s]);

  const schemas = [
    placeOfWorshipSchema({
      slug: mandir.slug, name: mandir.name.en, nameAlt: mandir.name.hi,
      description: mandir.shortIntro.en,
      image: `${SITE.url}${mandir.photos[0] || '/images/og/default.webp'}`,
      url: canonical, address: mandir.address.en, geo: mandir.geo,
      hours: toSchemaHours(mandir.darshanTimingSummary.en), telephone: mandir.phone,
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

        {/* ── HERO (text-only — image moved into content below) ── */}
        {/*
          HERO — rebuilt 2026-10-02 (Aman: "ek dum premium, AI jaise na dikhe").
          What was here read as machine-made, and specifically so:
            · `bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-900` — a gradient
              that starts and ends on the SAME colour. It carried no information and no
              light direction; it was texture for its own sake.
            · two `blur-3xl` rounded blobs bled into the corners — the single most
              recognisable "generated layout" signature on the web right now.
            · `bg-white/15 backdrop-blur-sm` glass chips and `rounded-full` pills, which a
              print editor would never reach for to label a temple.
          Replaced with the devices a real editorial page uses: one flat ink field, a
          hairline rule, letter-spaced small caps for the standfirst, and type doing the
          hierarchy instead of boxes. Nothing here is decoration that could be deleted
          without losing meaning — that is the whole test.
        */}
        <header className="relative border-b border-gold/40 bg-maroon-900">
          <div className="container-page py-16 sm:py-20">
            <div className="max-w-3xl">
              {/* Standfirst: category · locality, as a line of small caps over a rule —
                  the same job the two chips did, without pretending to be buttons. */}
              <p className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-gold">
                <span className="h-px w-8 shrink-0 bg-gold/70" aria-hidden="true" />
                <span>{typeLabel}</span>
                <span className="text-gold/40" aria-hidden="true">·</span>
                <span className="text-cream/70">{areaLabel}</span>
              </p>
              {/*
                Weights are the real ones the woff2 files ship: Tiro Devanagari Sanskrit
                exists only at 400 and Cormorant Garamond only at 700, so the old shared
                `font-extrabold` was a browser-synthesised fake on both — smeared strokes
                on exactly the headline Hindi readers see first, and Hindi is ~90% of this
                site's traffic. A large Devanagari serif at its true 400 is also simply
                how this is set in print.
              */}
              <h1 className={`text-white mb-3 ${locale === 'hi' ? 'font-sanskrit font-normal text-4xl leading-[1.15] sm:text-5xl md:text-6xl' : 'font-serif font-bold text-3xl leading-[1.1] sm:text-5xl md:text-6xl'}`}>
                {mandir.name[locale]}
              </h1>
              <p className={`mb-6 text-cream/60 ${locale === 'hi' ? 'font-sanskrit text-xl' : 'font-serif text-xl italic'}`}>
                {mandir.deity[locale]}
              </p>
              <p className={`mb-8 max-w-[62ch] leading-relaxed text-cream/85 ${locale === 'hi' ? 'text-lg' : 'text-base sm:text-lg'}`}>
                {mandir.shortIntro[locale]}
              </p>
              {/* One icon, on the one action that is a phone call. The directions link is
                  a link and is allowed to look like one. */}
              <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                <a href={SITE.phoneTel} className="btn-call">
                  <Phone className="h-4 w-4" /> {locale === 'hi' ? 'यात्रा सहायता लें' : 'Get Trip Help'}
                </a>
                <a
                  href={`https://maps.google.com/?q=${mandir.geo.lat},${mandir.geo.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-cream/35 pb-0.5 text-sm font-semibold text-cream transition-colors hover:border-gold hover:text-gold"
                >
                  {locale === 'hi' ? 'रास्ता देखें' : 'Get Directions'}
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* ── QUICK FACTS BAR ── */}
        {(mandir.crowdLevel || mandir.photographyAllowed !== undefined || mandir.parkingAvailable) && (
          <section className="border-y border-cream-dark bg-cream-dark/30">
            <div className="container-page py-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {mandir.crowdLevel && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-maroon" />
                    <span className="font-semibold text-ink-soft">{locale === 'hi' ? 'श्रद्धालु' : 'Footfall'}:</span>
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

        {/* ── DARSHAN & AARTI TIMINGS — serves "timings" queries; data verified in content JSON ── */}
        <section className="container-page py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-label">{locale === 'hi' ? 'दर्शन एवं आरती समय' : 'Darshan & Aarti Timings'}</p>
          <h2 className={`mt-2 mb-5 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-xl sm:text-2xl'}`}>
            {locale === 'hi' ? `${mandir.name.hi} — दर्शन व आरती समय` : `${mandir.name.en} Timings`}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-cream-dark bg-white p-5 shadow-sm">
              <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-maroon" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">{locale === 'hi' ? 'दर्शन समय' : 'Darshan Hours'}</p>
                <p className="mt-1 text-base font-semibold text-ink">{mandir.darshanTimingSummary[locale]}</p>
                {mandir.entryFee && (
                  <p className="mt-2 text-sm text-ink-soft"><span className="font-semibold">{locale === 'hi' ? 'प्रवेश शुल्क: ' : 'Entry: '}</span>{mandir.entryFee[locale]}</p>
                )}
              </div>
            </div>
            {mandir.aartiTiming && (
              <div className="flex items-start gap-3 rounded-2xl border border-gold/40 bg-cream-dark p-5 shadow-sm">
                <Bell className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-600" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-label">{locale === 'hi' ? 'आरती समय' : 'Aarti Schedule'}</p>
                  <ul className="mt-2 space-y-1">
                    {mandir.aartiTiming[locale].split('·').map((a, i) => (
                      <li key={i} className="text-sm leading-relaxed text-ink-soft">{a.trim()}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <p className="mt-3 text-[11px] text-ink-mute">
            {locale === 'hi'
              ? `समय स्थानीय स्रोतों से सत्यापित (अंतिम अद्यतन ${mandir.lastVerified})। पर्व एवं विशेष अवसरों पर परिवर्तन संभव।`
              : `Timings verified from local sources (last updated ${mandir.lastVerified}). May change on festivals and special occasions.`}
          </p>
        </section>

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
              {/* Featured temple photo (moved from hero → content) */}
              {mandir.photos[0] && !mandir.photos[0].includes('placeholder') && (
                <figure className="mb-7 overflow-hidden rounded-2xl border border-cream-dark shadow-sm">
                  <img
                    src={mandir.photos[0]}
                    alt={mandir.name[locale]}
                    loading="lazy"
                    className="w-full aspect-[16/10] object-cover"
                  />
                  <figcaption className="bg-cream px-4 py-2.5 text-xs text-ink-mute">
                    {mandir.name[locale]} — {mandir.deity[locale]}
                  </figcaption>
                </figure>
              )}

              {/* History heading */}
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-label">
                {locale === 'hi' ? 'इतिहास एवं पौराणिक महत्व' : 'History & Significance'}
              </p>
              <h2 className={`mt-2 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-3xl sm:text-4xl' : 'font-serif text-2xl sm:text-3xl'}`}>
                {locale === 'hi' ? `${mandir.name.hi} का इतिहास` : `History of ${mandir.name.en}`}
              </h2>
              <div className="mt-4">
                <p className="text-base leading-[1.9] text-ink-soft sm:text-lg">{mandir.history[locale]}</p>
                {mandir.establishedEra && (
                  <div className="mt-5 flex gap-3 rounded-lg border-l-4 border-gold bg-cream-dark p-4">
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

        <AppPromo placement="mandir-detail" className="pb-10" />

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
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-label">{locale === 'hi' ? 'स्थान एवं यात्रा' : 'Location & Getting There'}</p>
            <h2 className={`mt-2 mb-5 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-xl sm:text-2xl'}`}>
              {locale === 'hi' ? 'पता एवं कैसे पहुँचें' : 'Address & How to Reach'}
            </h2>
            <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
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
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-label">{locale === 'hi' ? 'प्रसाद एवं अर्पण' : 'Prasad & Offerings'}</p>
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
                <div className="rounded-2xl border border-saffron/30 bg-cream-dark p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-saffron text-white">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-label">{locale === 'hi' ? 'यात्री सुझाव' : 'Visitor Tips'}</p>
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-label">{locale === 'hi' ? 'स्थानीय मान्यताएँ' : 'Local Traditions'}</p>
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-label">{locale === 'hi' ? 'सामान्य प्रश्न' : 'Frequently Asked'}</p>
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-label">{locale === 'hi' ? 'पूजा एवं अनुष्ठान' : 'Puja & Anushthan'}</p>
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
                  className="group flex items-start gap-3 rounded-2xl border border-gold/40 bg-gradient-to-br from-gold-50/60 to-cream p-5 transition-colors hover:border-maroon/40 hover:bg-cream-dark"
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

        {/* ── PLAN YOUR DARSHAN (internal links → cab + tour money pages) ── */}
        <section className="container-page pt-4 pb-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-label">{locale === 'hi' ? 'यात्रा योजना' : 'Plan Your Darshan'}</p>
          <h2 className={`mt-2 mb-5 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-xl sm:text-2xl'}`}>
            {locale === 'hi' ? `${mandir.name.hi} दर्शन के लिए टैक्सी व टूर पैकेज` : `Taxi & Tour Packages for ${mandir.name.en} Darshan`}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to={`${prefix}/cab-booking/`}
              className="group flex items-start gap-3 rounded-2xl border border-gold/40 bg-gradient-to-br from-gold-50/60 to-cream p-5 transition-colors hover:border-maroon/40 hover:bg-cream-dark"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-maroon-900 text-gold">🚕</span>
              <div className="flex-1">
                <h3 className={`flex items-center gap-1 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-lg' : 'font-serif text-base'}`}>
                  {locale === 'hi' ? 'उज्जैन टैक्सी सेवा' : 'Taxi Service in Ujjain'}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {locale === 'hi' ? 'लोकल दर्शन, ओंकारेश्वर व इंदौर एयरपोर्ट के लिए कैब बुकिंग — 24/7 उपलब्ध।' : 'Cab booking for local darshan, Omkareshwar and Indore airport — available 24/7.'}
                </p>
              </div>
            </Link>
            <Link
              to={`${prefix}/tour-and-travel-ujjain/`}
              className="group flex items-start gap-3 rounded-2xl border border-gold/40 bg-gradient-to-br from-gold-50/60 to-cream p-5 transition-colors hover:border-maroon/40 hover:bg-cream-dark"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-maroon-900 text-gold">🛕</span>
              <div className="flex-1">
                <h3 className={`flex items-center gap-1 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-lg' : 'font-serif text-base'}`}>
                  {locale === 'hi' ? 'उज्जैन टूर पैकेज' : 'Ujjain Tour Packages'}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {locale === 'hi' ? 'उज्जैन दर्शन पैकेज — मंदिर दर्शन, ठहरने व यात्रा की पूरी व्यवस्था एक जगह।' : 'Ujjain darshan packages — temple visits, stay and travel arranged end-to-end.'}
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* ── NEARBY TEMPLES ── */}
        {nearby.length > 0 && (
          <>
            <MandalaDivider />
            <section className="bg-cream py-8">
              <div className="container-page">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-label">{locale === 'hi' ? 'आसपास के मंदिर' : 'Explore Nearby'}</p>
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
