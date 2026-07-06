import { BookCheck, CalendarCheck2, MessageSquareText, Newspaper } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SITE } from '../../lib/site';

/**
 * EditorialStandards — institutional human-voice trust block.
 * No personal face/story per Aman directive — voice comes from the standards themselves.
 * Used on homepage + about. Anchors E-E-A-T signal for SEO.
 */
export function EditorialStandards() {
  const { locale } = useI18n();
  const items = locale === 'hi' ? [
    {
      Icon: BookCheck,
      title: 'सत्यापन प्रक्रिया',
      body: 'प्रत्येक मन्दिर का दर्शन समय, फ़ोन एवं पता मन्दिर ट्रस्ट से सीधे अथवा अधिकृत स्रोतों से सत्यापित। पुरानी सूचना तुरन्त अद्यतन की जाती है।',
    },
    {
      Icon: Newspaper,
      title: 'प्रामाणिक स्रोत',
      body: 'दैनिक भास्कर · मध्य प्रदेश शासन प्रकाशन · मन्दिर ट्रस्ट दस्तावेज़ · भारतीय रेल अधिसूचना — हर तथ्य सन्दर्भ-सहित।',
    },
    {
      Icon: CalendarCheck2,
      title: 'त्रैमासिक पुनरीक्षण',
      body: 'मन्दिर समय, शुल्क एवं त्यौहार तिथियों का नियमित त्रैमासिक पुनरीक्षण — पुरानी सूचना तुरन्त सुधारी जाती है।',
    },
    {
      Icon: MessageSquareText,
      title: 'सहायता एवं सुधार',
      body: 'कोई जानकारी पुरानी अथवा अशुद्ध प्रतीत हो — व्हाट्सऐप पर सूचित करें। हम 48 घंटे में सुधार करते हैं।',
    },
  ] : [
    {
      Icon: BookCheck,
      title: 'Verification process',
      body: 'Every temple’s darshan time, phone and address verified directly with the temple trust or via authoritative sources. Stale information is updated promptly.',
    },
    {
      Icon: Newspaper,
      title: 'Trusted sources',
      body: 'Dainik Bhaskar · Govt of Madhya Pradesh publications · temple trust records · Indian Railways notifications — every fact carries a citation.',
    },
    {
      Icon: CalendarCheck2,
      title: 'Quarterly review',
      body: 'Temple timings, fees and festival dates are re-reviewed every quarter — stale information is corrected promptly.',
    },
    {
      Icon: MessageSquareText,
      title: 'Help us improve',
      body: 'If any information seems outdated or incorrect — flag it via WhatsApp. We act on corrections within 48 hours.',
    },
  ];

  return (
    <section className="bg-white">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">
              {locale === 'hi' ? 'सम्पादकीय मानक' : 'Editorial Standards'}
            </p>
            <h2 className={`mt-3 font-bold text-maroon leading-tight ${locale === 'hi' ? 'font-sanskrit text-3xl sm:text-4xl md:text-5xl' : 'font-serif text-3xl sm:text-4xl md:text-5xl'}`}>
              {locale === 'hi' ? 'सूचना — सत्यापित, स्रोतयुक्त, पुनरीक्षित' : 'Information — verified, sourced, reviewed'}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              {locale === 'hi'
                ? 'UjjainTemple ByteFlow टेक्नोलॉजीज़ प्रा. लि. द्वारा संचालित — DPIIT पंजीकृत, Startup India EIR योजना के अंतर्गत भारत सरकार से प्रथम अनुदान प्राप्त। 12 वर्षों के तीर्थयात्रा अनुभव के साथ।'
                : 'UjjainTemple is operated by ByteFlow Technologies Pvt Ltd — DPIIT-registered, first grant recipient under Govt of India’s Startup India EIR scheme, with 12 years of pilgrimage operations experience.'}
            </p>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-maroon underline-offset-4 hover:underline"
            >
              {locale === 'hi' ? 'सुधार सुझाएँ — व्हाट्सऐप' : 'Suggest a correction — WhatsApp'} →
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {items.map(({ Icon, title, body }, i) => (
              <div key={i} className="rounded-lg border border-cream-dark bg-cream-dark/30 p-5">
                <Icon className="h-5 w-5 text-gold-600" />
                <h3 className={`mt-3 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-lg' : 'font-serif text-base'}`}>
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
