/**
 * Deity-group list pages — the 84-Mahadev format applied to three more named sets.
 *
 * WHY THESE THREE, and why not more (GSC 2026-06-11 → 09-08):
 *   - Navagraha — 9 temples in the content, one per graha. A *complete, ordered,
 *     named* set, and `navagraha temple order list to visit` is literally the query.
 *     This is the closest thing the site has to another "84 Mahadev".
 *   - Bhairav — the biggest of the three by demand (1,598 impressions across 60
 *     queries), and `bhairav mandir ujjain` sits at pos 11.3 where no single detail
 *     page can answer a list question.
 *   - Ganesh — 480 impressions across 60 queries at pos 8-9 with **zero** clicks.
 *   Hanuman was considered and dropped: only 3 temples in the content, which is a
 *   stub, and a stub list page earns nothing (see D9 in SEO_KIT.md).
 *
 * 🔴 Every page's prose is hand-written per group, NOT templated from the group
 * name. Eleven city pages sharing one body is how a site earns the doorway-page
 * read (D4). If a fourth group is ever added, write it — do not generate it.
 *
 * 🔴 Content rules that apply here like everywhere on this site: no VIP-darshan or
 * queue claims, no temple-side authorisation, no guarantee language, no invented
 * history (eras stay general), and timings stay prefixed with "लगभग / Approx."
 * as they come from the mandir records.
 */

export interface DeityListGroup {
  /** Route slug, root-level like /84-mahadev-ujjain/ (a /mandirs/<x>/ path would
   *  collide with the temple Detail route). */
  slug: string;
  /** Temple slugs, in the order the page presents them. Hand-curated: the order
   *  carries meaning (graha order for Navagraha) and must never be re-sorted. */
  temples: string[];
  h1: { hi: string; en: string };
  title: { hi: string; en: string };
  description: { hi: string; en: string };
  /** Answer-first opener, 40-70 words, self-contained enough to be lifted whole. */
  lede: { hi: string; en: string };
  /** The section that makes the page worth a click over a plain list. */
  note: { heading: { hi: string; en: string }; body: { hi: string; en: string } };
  faqs: Array<{ q: { hi: string; en: string }; a: { hi: string; en: string } }>;
  /** Optional related puja page slug under /puja-in-ujjain/. */
  pujaSlug?: string;
}

export const DEITY_LISTS: DeityListGroup[] = [
  {
    slug: 'navgrah-mandir-ujjain',
    temples: [
      'trivikram-mandir',        // Surya
      'somnath-mahadev-ujjain',  // Chandra
      'angarkeshwar-mahadev',    // Mangal
      'budhnath-mandir',         // Budh
      'brihaspati-mandir',       // Guru
      'shukreshwar-mahadev',     // Shukra
      'shaneshwar-mahadev',      // Shani
      'mangalnath',              // Mangal ki janmasthali
      'navgraha-mandir-ujjain',  // all nine together
    ],
    h1: {
      hi: 'उज्जैन के नवग्रह मंदिर — पूरी सूची और दर्शन क्रम',
      en: 'Navgrah Temples in Ujjain — Full List & Darshan Order',
    },
    title: {
      hi: 'नवग्रह मंदिर उज्जैन — सूची, दर्शन क्रम व समय',
      en: 'Navgrah Temples in Ujjain — List, Darshan Order & Timings',
    },
    description: {
      hi: 'उज्जैन के नवग्रह मंदिरों की सूची — सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र और शनि के अलग-अलग मंदिर, मंगलनाथ, तथा नवग्रह मंदिर। दर्शन क्रम, स्थान और लगभग समय।',
      en: 'The Navgrah temples of Ujjain — separate shrines for Surya, Chandra, Mangal, Budh, Guru, Shukra and Shani, plus Mangalnath. Darshan order, areas and timings.',
    },
    lede: {
      hi: 'उज्जैन उन गिने-चुने शहरों में है जहाँ नवग्रहों के लिए अलग-अलग मंदिर हैं — एक ही परिसर में नौ मूर्तियाँ नहीं, बल्कि शहर भर में फैले स्वतंत्र मंदिर। मंगल की जन्मस्थली मानी जाने वाली मंगलनाथ भी यहीं है। नीचे हर ग्रह का मंदिर, उसका क्षेत्र और लगभग दर्शन समय दिया गया है, ग्रह-क्रम में।',
      en: 'Ujjain is one of the few cities where the nine grahas have separate temples of their own — not nine idols in one hall, but independent shrines spread across the city, along with Mangalnath, traditionally regarded as the birthplace of Mangal. Below is each graha temple with its area and approximate darshan timing, in graha order.',
    },
    note: {
      heading: { hi: 'दर्शन किस क्रम में करें?', en: 'In what order should you visit?' },
      body: {
        hi: 'परंपरागत क्रम सूर्य से शनि तक चलता है और नीचे की सूची उसी क्रम में है। व्यावहारिक रूप से अधिकांश मंदिर महाकाल क्षेत्र में पास-पास हैं, जबकि शनेश्वर भैरवगढ़ में और शुक्रेश्वर फ्रीगंज में हैं — इसलिए एक दिन में करना हो तो महाकाल क्षेत्र पहले, फिर मंगलनाथ, और अंत में भैरवगढ़ व फ्रीगंज रखना ठीक बैठता है। क्रम को लेकर परिवारों और पंडितों की परंपराएँ अलग हो सकती हैं।',
        en: 'The traditional order runs from Surya to Shani and the list below follows it. Practically, most of these shrines sit close together in the Mahakal area, while Shaneshwar is in Bhairavgarh and Shukreshwar in Freeganj — so for a single day it works out to do the Mahakal-area temples first, then Mangalnath, and keep Bhairavgarh and Freeganj for the end. Families and pandits differ on the order, and that is normal.',
      },
    },
    faqs: [
      {
        q: { hi: 'उज्जैन में नवग्रह मंदिर कितने हैं?', en: 'How many Navgrah temples are there in Ujjain?' },
        a: {
          hi: 'उज्जैन में नौ ग्रहों के लिए अलग-अलग मंदिर हैं, और इनके अतिरिक्त एक नवग्रह मंदिर भी है जहाँ नौ ग्रह एक साथ हैं। मंगलनाथ को मंगल की जन्मस्थली माना जाता है। इस पृष्ठ पर सभी की सूची स्थान सहित दी गई है।',
          en: 'Ujjain has separate shrines for the nine grahas, and in addition a Navgraha Mandir where all nine are together. Mangalnath is traditionally regarded as the birthplace of Mangal. This page lists them all with their areas.',
        },
      },
      {
        q: { hi: 'क्या नवग्रह दर्शन एक दिन में हो सकता है?', en: 'Can the Navgrah darshan be done in one day?' },
        a: {
          hi: 'हाँ, एक दिन में संभव है क्योंकि अधिकांश मंदिर महाकाल क्षेत्र में हैं। शनेश्वर (भैरवगढ़) और शुक्रेश्वर (फ्रीगंज) थोड़ी दूरी पर हैं, इसलिए स्थानीय कैब या ऑटो से समय बचता है। त्योहार और शनिवार-अमावस्या पर अधिक समय रखें।',
          en: 'Yes — most of the shrines are in the Mahakal area, so a single day works. Shaneshwar (Bhairavgarh) and Shukreshwar (Freeganj) are further out, so a local cab or auto saves time. Allow longer on festival days and on Saturdays and Amavasya.',
        },
      },
    ],
    pujaSlug: 'navgrah-shanti',
  },

  {
    slug: 'bhairav-mandir-ujjain',
    temples: ['kal-bhairav-ujjain', 'vikrant-bhairav', 'batuk-bhairav-mandir', 'ashta-bhairav-mandir'],
    h1: {
      hi: 'उज्जैन के भैरव मंदिर — काल भैरव, विक्रांत भैरव, बटुक भैरव',
      en: 'Bhairav Temples in Ujjain — Kal Bhairav, Vikrant Bhairav, Batuk Bhairav',
    },
    title: {
      hi: 'भैरव मंदिर उज्जैन — सूची, दर्शन समय व स्थान',
      en: 'Bhairav Temples in Ujjain — List, Darshan Timings & Areas',
    },
    description: {
      hi: 'उज्जैन के भैरव मंदिरों की सूची — काल भैरव (भैरवगढ़), विक्रांत भैरव, बटुक भैरव और अष्ट भैरव। हर मंदिर का क्षेत्र, लगभग दर्शन समय और विस्तृत जानकारी।',
      en: 'The Bhairav temples of Ujjain — Kal Bhairav at Bhairavgarh, Vikrant Bhairav, Batuk Bhairav and Ashta Bhairav, with areas and darshan timings.',
    },
    lede: {
      hi: 'उज्जैन में भैरव उपासना की परंपरा बहुत पुरानी है — शहर का एक पूरा क्षेत्र ही भैरवगढ़ कहलाता है। सबसे प्रसिद्ध काल भैरव मंदिर है, और इसके साथ विक्रांत भैरव, बटुक भैरव तथा अष्ट भैरव की परंपरा भी यहाँ जीवित है। नीचे हर भैरव मंदिर का स्थान और लगभग दर्शन समय दिया गया है।',
      en: 'Bhairav worship in Ujjain is old enough that an entire quarter of the city is called Bhairavgarh. The best known is the Kal Bhairav temple, and alongside it the city keeps the Vikrant Bhairav, Batuk Bhairav and Ashta Bhairav traditions alive. Each Bhairav temple below carries its area and approximate darshan timing.',
    },
    note: {
      heading: { hi: 'अष्ट भैरव क्या हैं?', en: 'What are the Ashta Bhairav?' },
      body: {
        hi: 'भैरव परंपरा में आठ भैरव स्वरूपों की उपासना होती है, और उज्जैन में यह परंपरा अष्ट भैरव के रूप में मिलती है। शहर में काल भैरव इनमें सबसे प्रमुख हैं। यह ध्यान रखें कि अलग-अलग ग्रंथों और स्थानीय परंपराओं में आठ स्वरूपों के नाम और क्रम एक जैसे नहीं मिलते — इसलिए यहाँ वही मंदिर सूचीबद्ध हैं जो उज्जैन में मौजूद हैं, कोई काल्पनिक सूची नहीं।',
        en: 'The Bhairav tradition venerates eight forms, and in Ujjain that tradition survives as the Ashta Bhairav. Kal Bhairav is the foremost of them in this city. Note that different texts and local traditions do not agree on the names or the order of the eight — so what is listed here is the temples that actually exist in Ujjain, not a reconstructed list.',
      },
    },
    faqs: [
      {
        q: { hi: 'उज्जैन का सबसे प्रसिद्ध भैरव मंदिर कौन सा है?', en: 'Which is the most famous Bhairav temple in Ujjain?' },
        a: {
          hi: 'काल भैरव मंदिर, जो भैरवगढ़ क्षेत्र में है। यह उज्जैन के सबसे अधिक दर्शन किए जाने वाले मंदिरों में से एक है। इसके अतिरिक्त विक्रांत भैरव और बटुक भैरव मंदिर भी हैं।',
          en: 'The Kal Bhairav temple in the Bhairavgarh area — one of the most visited temples in Ujjain. Vikrant Bhairav and Batuk Bhairav are the other well-known Bhairav shrines in the city.',
        },
      },
      {
        q: { hi: 'काल भैरव मंदिर महाकालेश्वर से कितनी दूर है?', en: 'How far is Kal Bhairav from Mahakaleshwar?' },
        a: {
          hi: 'काल भैरव भैरवगढ़ क्षेत्र में है, जबकि महाकालेश्वर महाकाल क्षेत्र में — दोनों के बीच ऑटो या कैब से कुछ ही मिनट लगते हैं। अधिकांश स्थानीय दर्शन यात्राएँ दोनों को एक ही दिन में जोड़ती हैं।',
          en: 'Kal Bhairav is in Bhairavgarh and Mahakaleshwar in the Mahakal area — a few minutes apart by auto or cab. Most local darshan routes cover both on the same day.',
        },
      },
    ],
  },

  {
    slug: 'ganesh-mandir-ujjain',
    temples: ['bade-ganesh-ji', 'chintaman-ganesh', 'mahaganpati-mandir', 'riddhi-siddhi-ganesh', 'ekdant-ganesh-mandir'],
    h1: {
      hi: 'उज्जैन के गणेश मंदिर — बड़े गणेश, चिंतामन गणेश और अन्य',
      en: 'Ganesh Temples in Ujjain — Bade Ganesh, Chintaman Ganesh and More',
    },
    title: {
      hi: 'गणेश मंदिर उज्जैन — सूची, दर्शन समय व स्थान',
      en: 'Ganesh Temples in Ujjain — List, Darshan Timings & Areas',
    },
    description: {
      hi: 'उज्जैन के गणेश मंदिरों की सूची — महाकाल के पास बड़े गणेश, चिंतामन गणेश, महागणपति, रिद्धि-सिद्धि गणेश और एकदंत गणेश। क्षेत्र, लगभग दर्शन समय और पूरी जानकारी।',
      en: 'The Ganesh temples of Ujjain — Bade Ganesh near Mahakal, Chintaman Ganesh, Mahaganpati, Riddhi Siddhi and Ekdant Ganesh, with areas and timings.',
    },
    lede: {
      hi: 'महाकालेश्वर के दर्शन से पहले बड़े गणेश के दर्शन की परंपरा उज्जैन में आम है, और शहर में गणेश के कई प्रसिद्ध मंदिर हैं — चिंतामन गणेश, महागणपति, रिद्धि-सिद्धि गणेश और एकदंत गणेश। नीचे हर मंदिर का क्षेत्र और लगभग दर्शन समय दिया गया है ताकि दर्शन का क्रम पहले से तय किया जा सके।',
      en: 'Visiting Bade Ganesh before Mahakaleshwar is a common practice in Ujjain, and the city holds several well-known Ganesh temples besides it — Chintaman Ganesh, Mahaganpati, Riddhi Siddhi Ganesh and Ekdant Ganesh. Each one below carries its area and approximate darshan timing so the route can be planned in advance.',
    },
    note: {
      heading: { hi: 'चिंतामन गणेश और बड़े गणेश में क्या अंतर है?', en: 'Bade Ganesh and Chintaman Ganesh — what is the difference?' },
      body: {
        hi: 'बड़े गणेश मंदिर महाकाल क्षेत्र में, महाकालेश्वर के बिलकुल पास है — इसलिए अधिकांश यात्री दोनों एक साथ कर लेते हैं। चिंतामन गणेश शहर से बाहर जवासिया की ओर है और वहाँ अलग से जाना पड़ता है, इसलिए उसके लिए समय अलग से रखना पड़ता है। दोनों उज्जैन के सबसे प्राचीन गणेश स्थलों में गिने जाते हैं।',
        en: 'Bade Ganesh sits in the Mahakal area, right beside Mahakaleshwar, so most visitors take the two together. Chintaman Ganesh is out towards Jawasiya and needs a separate trip, so it needs its own slot in the day. Both are counted among the oldest Ganesh shrines in Ujjain.',
      },
    },
    faqs: [
      {
        q: { hi: 'महाकाल के पास कौन सा गणेश मंदिर है?', en: 'Which Ganesh temple is near Mahakal?' },
        a: {
          hi: 'बड़े गणेश मंदिर महाकाल क्षेत्र में महाकालेश्वर के पास ही है, और परंपरा के अनुसार कई श्रद्धालु महाकाल दर्शन से पहले यहाँ दर्शन करते हैं।',
          en: 'Bade Ganesh is in the Mahakal area, right next to Mahakaleshwar, and by tradition many devotees stop there before the Mahakal darshan.',
        },
      },
      {
        q: { hi: 'चिंतामन गणेश मंदिर उज्जैन से कितनी दूर है?', en: 'How far is Chintaman Ganesh from Ujjain city?' },
        a: {
          hi: 'चिंतामन गणेश शहर से बाहर जवासिया क्षेत्र की ओर है। ऑटो, कैब या स्थानीय बस से पहुँचा जा सकता है; बुधवार और गणेश चतुर्थी पर अधिक श्रद्धालु होते हैं, इसलिए अतिरिक्त समय रखें।',
          en: 'Chintaman Ganesh lies outside the city towards Jawasiya, reachable by auto, cab or local bus. Wednesdays and Ganesh Chaturthi draw more devotees, so allow extra time.',
        },
      },
    ],
  },
];

export function getDeityList(slug: string): DeityListGroup | undefined {
  return DEITY_LISTS.find((g) => g.slug === slug);
}
