import { Bilingual } from '../lib/types';

/*
 * The selling layer of each package page — the facts a package searcher compares on
 * (Aman, 2026-11-03: "sari enq cheap sirf taxi ki aa rahi hai — package type ke keyword se
 * premium enq chahiye").
 *
 * GSC 90 days to 2026-11-01: package-intent queries 851 impressions vs 5,132 for cab/taxi,
 * and "ujjain tour package" itself 2 impressions at ~pos 12 — we are not on page 1 for it.
 * The pages showed a day plan and a form, nothing else: no duration, no stay, nothing saying
 * "hotel + car in one quote", and the 1-day package was titled "Taxi Tour Package".
 *
 * 🔴 Still no price — rates are confirmed on the call (Aman, 2026-10-16) — and no darshan
 * arrangement of any kind. The hotel classes are the ones "Package banao" prices in
 * (/panel/quotes.php: budget · standard · deluxe · premium).
 *
 * seoTitle is set only where the page earns little today. panch-jyotirlinga-5-days and
 * ujjain-baglamukhi-2-days rank 4–8 on their own titles, so theirs are left alone.
 */

export interface PackageSales {
  /** SERP title, query family first. Omit to keep the page's current title. */
  seoTitle?: Bilingual;
  metaDescription?: Bilingual;
  duration: Bilingual;
  stay: Bilingual;
  places: Bilingual;
  idealFor: Bilingual;
  faqs?: Array<{ q: Bilingual; a: Bilingual }>;
}

export const PACKAGE_SALES: Record<string, PackageSales> = {
  'ujjain-darshan-package': {
    seoTitle: {
      hi: 'उज्जैन दर्शन टूर पैकेज — 1 दिन, निजी गाड़ी सहित',
      en: 'Ujjain Darshan Tour Package — 1 Day with Private Car',
    },
    metaDescription: {
      hi: '1 दिन का उज्जैन दर्शन टूर पैकेज — महाकालेश्वर, काल भैरव, हरसिद्धि, मंगलनाथ समेत प्रमुख मंदिर, ड्राइवर सहित निजी गाड़ी से। चाहें तो होटल भी जोड़ें।',
      en: '1-day Ujjain darshan tour package — Mahakaleshwar, Kal Bhairav, Harsiddhi, Mangalnath and more by private car with driver. Add a hotel night if needed.',
    },
    duration: { hi: '1 दिन', en: '1 day' },
    stay: { hi: 'रात रुकना हो तो होटल जोड़ें', en: 'Add a hotel night if you stay over' },
    places: {
      hi: 'महाकालेश्वर · हरसिद्धि · काल भैरव · संदीपनि आश्रम · राम घाट · मंगलनाथ · इस्कॉन',
      en: 'Mahakaleshwar · Harsiddhi · Kal Bhairav · Sandipani Ashram · Ram Ghat · Mangalnath · ISKCON',
    },
    idealFor: { hi: 'पहली बार उज्जैन, हाथ में एक दिन', en: 'A first visit with one day in hand' },
  },

  'ujjain-omkareshwar-package': {
    seoTitle: {
      hi: 'उज्जैन ओंकारेश्वर टूर पैकेज — 2 दिन, होटल + गाड़ी',
      en: 'Ujjain Omkareshwar Tour Package — 2 Days, Hotel + Car',
    },
    metaDescription: {
      hi: '2 दिन का उज्जैन ओंकारेश्वर टूर पैकेज — दो ज्योतिर्लिंग, आपकी चुनी श्रेणी के होटल में एक रात और ड्राइवर सहित निजी गाड़ी, सब एक ही रेट में।',
      en: '2-day Ujjain Omkareshwar tour package — two Jyotirlingas, a hotel night in the class you pick and a private car with driver, all in one quote.',
    },
    duration: { hi: '2 दिन / 1 रात', en: '2 days / 1 night' },
    stay: { hi: '1 रात — उज्जैन या ओंकारेश्वर में', en: '1 night — in Ujjain or Omkareshwar' },
    places: {
      hi: 'महाकालेश्वर · काल भैरव · हरसिद्धि · संदीपनि आश्रम · ओंकारेश्वर · ममलेश्वर',
      en: 'Mahakaleshwar · Kal Bhairav · Harsiddhi · Sandipani Ashram · Omkareshwar · Mamleshwar',
    },
    idealFor: { hi: 'परिवार, जो दो ज्योतिर्लिंग एक यात्रा में चाहते हैं', en: 'Families covering two Jyotirlingas in one trip' },
    faqs: [
      {
        q: { hi: 'उज्जैन से ओंकारेश्वर कितनी दूर है?', en: 'How far is Omkareshwar from Ujjain?' },
        a: {
          hi: 'लगभग 140 किमी — सड़क से एक तरफ़ लगभग 3 से 3.5 घंटे। इसलिए ओंकारेश्वर के लिए पूरा एक दिन रखा जाता है।',
          en: 'About 140 km — approx. 3 to 3.5 hours by road each way, so Omkareshwar gets a full day of its own.',
        },
      },
      {
        q: { hi: 'क्या रात ओंकारेश्वर में रुक सकते हैं?', en: 'Can we spend the night in Omkareshwar instead?' },
        a: {
          hi: 'हाँ। रात उज्जैन में रखें या ओंकारेश्वर में — फ़ॉर्म में बता दें, रेट उसी हिसाब से बनेगा।',
          en: 'Yes. The night can be in Ujjain or in Omkareshwar — mention it in the form and the rate is worked out that way.',
        },
      },
    ],
  },

  'ujjain-3-day-package': {
    seoTitle: {
      hi: 'उज्जैन 3 दिन का टूर पैकेज — होटल, गाड़ी और ओंकारेश्वर',
      en: 'Ujjain 3 Day Tour Package — Hotel, Car and Omkareshwar',
    },
    metaDescription: {
      hi: '3 दिन का उज्जैन टूर पैकेज — उज्जैन के मंदिर, ओंकारेश्वर ज्योतिर्लिंग, 2 रात होटल आपकी चुनी श्रेणी में और ड्राइवर सहित निजी गाड़ी। आराम की गति से।',
      en: '3-day Ujjain tour package — Ujjain temples, Omkareshwar Jyotirlinga, 2 hotel nights in the class you pick and a private car with driver, at an easy pace.',
    },
    duration: { hi: '3 दिन / 2 रात', en: '3 days / 2 nights' },
    stay: { hi: '2 रात — उज्जैन में', en: '2 nights — in Ujjain' },
    places: {
      hi: 'महाकालेश्वर · काल भैरव · हरसिद्धि · ओंकारेश्वर · मंगलनाथ · राम घाट',
      en: 'Mahakaleshwar · Kal Bhairav · Harsiddhi · Omkareshwar · Mangalnath · Ram Ghat',
    },
    idealFor: { hi: 'बुज़ुर्गों के साथ, बिना भागदौड़ की यात्रा', en: 'An unhurried trip with elders' },
  },

  'ujjain-omkareshwar-maheshwar-mandu-4-days': {
    seoTitle: {
      hi: 'उज्जैन ओंकारेश्वर महेश्वर मांडू टूर पैकेज — 4 दिन',
      en: 'Ujjain Omkareshwar Maheshwar Mandu Tour Package — 4 Days',
    },
    metaDescription: {
      hi: '4 दिन का उज्जैन, ओंकारेश्वर, महेश्वर और मांडू टूर पैकेज — 3 रात होटल आपकी चुनी श्रेणी में और पूरी यात्रा के लिए ड्राइवर सहित निजी गाड़ी।',
      en: '4-day Ujjain, Omkareshwar, Maheshwar and Mandu tour package — 3 hotel nights in the class you pick and a private car with driver for the whole route.',
    },
    duration: { hi: '4 दिन / 3 रात', en: '4 days / 3 nights' },
    stay: { hi: '3 रात — रूट के हिसाब से', en: '3 nights — along the route' },
    places: {
      hi: 'उज्जैन · ओंकारेश्वर · महेश्वर · मांडू',
      en: 'Ujjain · Omkareshwar · Maheshwar · Mandu',
    },
    idealFor: { hi: 'परिवार और समूह — पूरा मालवा-निमाड़ एक साथ', en: 'Families and groups doing the whole Malwa–Nimar circuit' },
  },

  'ujjain-premium-tour-package': {
    seoTitle: {
      hi: 'उज्जैन प्रीमियम टूर पैकेज — डीलक्स होटल, निजी SUV',
      en: 'Ujjain Premium Tour Package — Deluxe Hotel, Private SUV',
    },
    metaDescription: {
      hi: 'उज्जैन प्रीमियम टूर पैकेज — मंदिर के पास डीलक्स या प्रीमियम होटल, ड्राइवर सहित निजी SUV और आपकी गति से बनी दिन-वार योजना।',
      en: 'Ujjain premium tour package — a deluxe or premium hotel near the temple, a private SUV with driver and a day plan set to your pace.',
    },
    duration: { hi: '1 से 3 दिन, आपकी गति से', en: '1 to 3 days, at your pace' },
    stay: { hi: 'डीलक्स या प्रीमियम होटल', en: 'Deluxe or premium hotel' },
    places: {
      hi: 'महाकालेश्वर व महाकाल लोक · काल भैरव · हरसिद्धि · मंगलनाथ · राम घाट',
      en: 'Mahakaleshwar & Mahakal Lok · Kal Bhairav · Harsiddhi · Mangalnath · Ram Ghat',
    },
    idealFor: { hi: 'दंपति, वरिष्ठ नागरिक, विदेश से आए परिवार', en: 'Couples, senior citizens, families from abroad' },
  },

  'panch-jyotirlinga-5-days': {
    duration: { hi: '5 दिन / 4 रात', en: '5 days / 4 nights' },
    stay: { hi: '4 रात — रूट के हिसाब से', en: '4 nights — along the route' },
    places: {
      hi: 'महाकालेश्वर · ओंकारेश्वर · घृष्णेश्वर · त्र्यंबकेश्वर · भीमाशंकर',
      en: 'Mahakaleshwar · Omkareshwar · Grishneshwar · Trimbakeshwar · Bhimashankar',
    },
    idealFor: { hi: 'एक ही यात्रा में ज्योतिर्लिंग दर्शन', en: 'A Jyotirlinga yatra in one go' },
  },

  'ujjain-baglamukhi-2-days': {
    duration: { hi: '2 दिन / 1 रात', en: '2 days / 1 night' },
    stay: { hi: '1 रात — उज्जैन में', en: '1 night — in Ujjain' },
    places: {
      hi: 'महाकालेश्वर · काल भैरव · हरसिद्धि · माँ बगलामुखी, नलखेड़ा',
      en: 'Mahakaleshwar · Kal Bhairav · Harsiddhi · Maa Baglamukhi, Nalkheda',
    },
    idealFor: { hi: 'माँ बगलामुखी के भक्त', en: 'Devotees of Maa Baglamukhi' },
  },

  'ujjain-sightseeing-package': {
    duration: { hi: '1 दिन (लगभग 8 घंटे)', en: '1 day (approx. 8 hours)' },
    stay: { hi: 'रात रुकना हो तो होटल जोड़ें', en: 'Add a hotel night if you stay over' },
    places: {
      hi: 'महाकालेश्वर व महाकाल लोक · हरसिद्धि · काल भैरव · राम घाट · मंगलनाथ · वेध शाला',
      en: 'Mahakaleshwar & Mahakal Lok · Harsiddhi · Kal Bhairav · Ram Ghat · Mangalnath · Vedh Shala',
    },
    idealFor: { hi: 'एक दिन में पूरा शहर', en: 'The whole city in a day' },
  },

  'ujjain-budget-tour-package': {
    duration: { hi: '1 से 2 दिन', en: '1 to 2 days' },
    stay: { hi: 'बजट होटल या धर्मशाला', en: 'Budget hotel or dharamshala' },
    places: { hi: 'उज्जैन के सभी प्रमुख मंदिर', en: 'All major Ujjain temples' },
    idealFor: { hi: 'सादा ठहरना, पूरे दर्शन', en: 'Simple stay, complete darshan' },
  },

  '84-mahadev-parikrama-package': {
    duration: { hi: '2 दिन या अधिक', en: '2 days or more' },
    stay: { hi: 'उज्जैन में, आपकी चुनी श्रेणी', en: 'In Ujjain, in the class you pick' },
    places: { hi: 'शहर भर के चौरासी महादेव शिवालय', en: 'The 84 Mahadev shrines across the city' },
    idealFor: { hi: 'परिक्रमा करने वाले श्रद्धालु', en: 'Devotees doing the parikrama' },
  },

  'ujjain-group-tour-package': {
    duration: { hi: '1 से 3 दिन', en: '1 to 3 days' },
    stay: { hi: 'पूरे समूह के कमरे एक साथ', en: 'Rooms for the whole group together' },
    places: { hi: 'उज्जैन · ओंकारेश्वर (चाहें तो)', en: 'Ujjain · Omkareshwar (if wanted)' },
    idealFor: { hi: 'मंडल, समिति, संस्था', en: 'Mandals, samitis, institutions' },
  },
};

/** Order of the cards on /tour-and-travel-ujjain/ — the hotel-and-car trips first. */
export const PACKAGE_HUB_ORDER = [
  'ujjain-omkareshwar-package',
  'ujjain-3-day-package',
  'ujjain-omkareshwar-maheshwar-mandu-4-days',
  'ujjain-premium-tour-package',
  'panch-jyotirlinga-5-days',
  'ujjain-darshan-package',
  'ujjain-baglamukhi-2-days',
  'ujjain-sightseeing-package',
  '84-mahadev-parikrama-package',
  'ujjain-group-tour-package',
  'ujjain-budget-tour-package',
];
