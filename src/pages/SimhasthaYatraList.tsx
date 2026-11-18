import { Link } from 'react-router-dom';
import { CalendarDays, BedDouble, Users } from 'lucide-react';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { SimhasthaYatraListForm } from '../components/global/SimhasthaYatraListForm';
import { useI18n } from '../i18n';
import { SITE } from '../lib/site';
import { breadcrumbSchema, faqSchema } from '../lib/schemas';
import { SHAHI_SNANS } from '../data/simhastha-dates';

/**
 * /simhastha-2028/simhastha-2028-yatra-list/ — the Simhastha 2028 Yatra List (2026-11-18).
 *
 * 🪤 Any path under /simhastha-2028/ that is not in the `.htaccess` whitelist is 301'd to the hub.
 * This slug was added there in the same commit — keep the two together.
 *
 * Copy rails: pure EN / pure HI · not the official registration (said twice) · no pass, darshan,
 * snan-access, priority or "reserved place" language · no unpublished dates (only SHAHI_SNANS) ·
 * no phone number (CALLS_OFF) · no free / offer words.
 */
const SLUG = 'simhastha-2028-yatra-list';

const snanList = (isHi: boolean) =>
  SHAHI_SNANS.map((s) => (isHi ? s.dateHi : s.dateEn)).join(isHi ? ', ' : ', ');

const COPY = {
  en: {
    title: 'Simhastha 2028 Yatra List — Stay & Travel Updates | UjjainTemple.com',
    description:
      'Join the Simhastha 2028 Yatra List: tell us your city, dates, group size, stay and budget, and get Ujjain stay and travel updates on WhatsApp.',
    eyebrow: 'Simhastha 2028 · Ujjain',
    h1: 'Simhastha 2028 Yatra List',
    sub: 'Join once. Get stay and travel updates for your Simhastha trip on WhatsApp.',
    points: [
      { t: 'Published date updates', b: 'When the mela administration publishes snan dates and travel arrangements, you get a short summary.' },
      { t: 'Stay and transport options', b: 'When hotels, dharamshalas, homestays and tent stays open for Simhastha dates, we share options that fit your budget.' },
      { t: 'Help for families and groups', b: 'Coming with family, a samiti or a group? Our travel desk helps plan the route, the stay and local transport.' },
    ],
    formTitle: 'Add your name to the list',
    faqTitle: 'Questions',
    faqs: (dates: string) => [
      { q: 'Is this the official Simhastha registration?', a: 'No. This is the UjjainTemple.com travel list for planning stay and transport. Any official registration or pass is issued only by the mela administration.' },
      { q: 'Do I pay anything to join?', a: 'No. Nothing is charged to join the list. If you later book a stay or a cab with us, the full price is sent in writing before any payment.' },
      { q: 'How will you contact me?', a: 'On WhatsApp or SMS, only about Simhastha 2028 travel. Reply STOP at any time and your number is removed from the list.' },
      { q: 'When are the Shahi Snans of Simhastha 2028?', a: `Published media reports give the Shahi Snan dates as ${dates}. Other parv snan dates will be announced by the mela administration.` },
    ],
    hub: 'Full Simhastha 2028 guide — dates, ghats, where to stay and how to reach',
    crumbs: ['Home', 'Simhastha 2028', 'Yatra List'],
  },
  hi: {
    title: 'सिंहस्थ 2028 यात्रा सूची — ठहरने और यात्रा की जानकारी | UjjainTemple.com',
    description:
      'सिंहस्थ 2028 यात्रा सूची में नाम जोड़ें: शहर, तारीख़, लोगों की संख्या, ठहरने का प्रकार और बजट बताइए, और उज्जैन में ठहरने व यात्रा की जानकारी WhatsApp पर पाइए।',
    eyebrow: 'सिंहस्थ 2028 · उज्जैन',
    h1: 'सिंहस्थ 2028 यात्रा सूची',
    sub: 'एक बार नाम जोड़िए — सिंहस्थ यात्रा में ठहरने और आने-जाने की जानकारी WhatsApp पर पाइए।',
    points: [
      { t: 'प्रकाशित तिथियों की जानकारी', b: 'मेला प्रशासन जब स्नान की तिथियाँ और यात्रा व्यवस्था प्रकाशित करेगा, आपको उसका छोटा सार भेजा जाएगा।' },
      { t: 'ठहरने और वाहन के विकल्प', b: 'सिंहस्थ की तारीख़ों के लिए होटल, धर्मशाला, होम स्टे और टेंट में ठहरने के विकल्प खुलने पर आपके बजट के अनुसार विकल्प भेजे जाएँगे।' },
      { t: 'परिवार और समूह के लिए सहायता', b: 'परिवार, समिति या समूह के साथ आ रहे हैं? हमारी ट्रैवल डेस्क मार्ग, ठहरने और स्थानीय वाहन की योजना बनाने में सहायता करती है।' },
    ],
    formTitle: 'सूची में अपना नाम जोड़ें',
    faqTitle: 'सामान्य प्रश्न',
    faqs: (dates: string) => [
      { q: 'क्या यह सिंहस्थ का आधिकारिक पंजीकरण है?', a: 'नहीं। यह UjjainTemple.com की यात्रा सूची है, जो ठहरने और आने-जाने की योजना के लिए है। कोई भी आधिकारिक पंजीकरण या पास केवल मेला प्रशासन जारी करता है।' },
      { q: 'क्या सूची में नाम जोड़ने का कोई शुल्क है?', a: 'नहीं। सूची में नाम जोड़ने का कोई शुल्क नहीं है। यदि बाद में आप हमारे माध्यम से ठहरने या कैब की बुकिंग करते हैं, तो पूरा दाम भुगतान से पहले लिखकर भेजा जाता है।' },
      { q: 'आप मुझसे कैसे संपर्क करेंगे?', a: 'केवल WhatsApp या SMS पर, और केवल सिंहस्थ 2028 की यात्रा के बारे में। STOP लिखकर भेजते ही आपका नंबर सूची से हटा दिया जाता है।' },
      { q: 'सिंहस्थ 2028 के शाही स्नान कब हैं?', a: `प्रकाशित समाचारों के अनुसार शाही स्नान की तिथियाँ ${dates} हैं। अन्य पर्व स्नान की तिथियाँ मेला प्रशासन घोषित करेगा।` },
    ],
    hub: 'सिंहस्थ 2028 की पूरी जानकारी — तिथियाँ, घाट, ठहरने की व्यवस्था और पहुँचने के मार्ग',
    crumbs: ['होम', 'सिंहस्थ 2028', 'यात्रा सूची'],
  },
};

const ICONS = [CalendarDays, BedDouble, Users];

export function SimhasthaYatraList() {
  const { locale } = useI18n();
  const isHi = locale === 'hi';
  const c = COPY[locale];
  const base = isHi ? '/hi' : '';
  const path = `/simhastha-2028/${SLUG}/`;
  const faqs = c.faqs(snanList(isHi));
  const abs = (p: string) => `${SITE.url}${base}${p}`;

  return (
    <>
      <SEOHead
        title={c.title}
        description={c.description}
        path={path}
        locale={locale}
        schemas={[
          breadcrumbSchema({
            items: [
              { name: c.crumbs[0], url: abs('/') },
              { name: c.crumbs[1], url: abs('/simhastha-2028/') },
              { name: c.crumbs[2], url: abs(path) },
            ],
          }),
          faqSchema(faqs),
        ]}
      />
      <Layout>
        <section style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #3a0404 0%, #1a0202 100%)' }}>
          <div className="container-page py-14 sm:py-16 text-center">
            <p className={`font-bold text-gold/70 mb-3 ${isHi ? 'text-xs' : 'text-[10px] uppercase tracking-[0.3em]'}`}>{c.eyebrow}</p>
            <h1 className={`font-bold text-white ${isHi ? 'font-sanskrit' : 'font-serif'}`} style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.2rem)' }}>
              {c.h1}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-cream/80">{c.sub}</p>
          </div>
        </section>

        <section className="bg-cream py-10 sm:py-14">
          <div className="container-page max-w-4xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {c.points.map((p, i) => {
                const Icon = ICONS[i];
                return (
                  <div key={p.t} className="rounded-xl border border-gold/30 bg-white p-5">
                    <Icon className="h-6 w-6 text-maroon" />
                    <h2 className={`mt-3 font-bold text-maroon ${isHi ? 'font-sanskrit' : 'font-serif'}`}>{p.t}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.b}</p>
                  </div>
                );
              })}
            </div>

            <div id="join" className="mt-10">
              <h2 className={`mb-4 text-center font-bold text-maroon text-2xl sm:text-3xl ${isHi ? 'font-sanskrit' : 'font-serif'}`}>{c.formTitle}</h2>
              <SimhasthaYatraListForm sourcePage={`${base}${path}`} />
            </div>

            <div className="mt-12">
              <h2 className={`mb-4 font-bold text-maroon text-xl sm:text-2xl ${isHi ? 'font-sanskrit' : 'font-serif'}`}>{c.faqTitle}</h2>
              <div className="space-y-3">
                {faqs.map((f) => (
                  <details key={f.q} className="rounded-lg border border-gold/25 bg-white p-4">
                    <summary className="cursor-pointer font-semibold text-ink">{f.q}</summary>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <p className="mt-10 text-center">
              <Link to={`${base}/simhastha-2028/`} className="font-semibold text-maroon underline underline-offset-4">
                {c.hub}
              </Link>
            </p>
          </div>
        </section>
      </Layout>
    </>
  );
}
