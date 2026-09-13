/**
 * Vrat · tyohar dates for Ujjain, 13 Sep 2026 → 30 Jun 2028 — the app's calendar tab.
 *
 * SOURCE: Drik Panchang, computed for Ujjain (geoname-id 1253914), read 2026-09-13:
 *   /calendars/hindu/hinducalendar.html  (2026, 2027, 2028)
 *   /vrats/ekadashidates.html            (2026, 2027, 2028)
 * Ekadashi carries the Smarta date; `vaishnavaNext` marks years where the same page
 * lists the Gauna/Vaishnava fast on the following day.
 *
 * 🪤 Why this is hand-curated and NOT computed: SugamPuja's festival engine was the
 * first attempt (2026-09-13). Checked against these pages it was wrong on 15+ dates
 * in 2027 alone — every sankranti a day late, Holika Dahan, Janmashtami, Akshaya
 * Tritiya, Maha Navami, Pitru Paksha — and it silently DROPPED any sunrise-rule tithi
 * that was kshaya (Devuthani Ekadashi 2026, Sharad Navratri 2027, Magh Purnima 2027).
 * A wrong date on a religious app is a credibility loss the reader can't see coming.
 * Until an engine matches a published panchang on every row, dates come from here.
 *
 * Deliberately left out: grahan (visibility needs its own check), Drik's
 * "Simhasta Kumbha @Ujjain" astronomical window (13 Apr–14 May 2028 — it differs from
 * the mela window reported in media and would confuse; Shahi Snan dates live in
 * simhastha-dates.ts), minor monthly vrats not verified row by row.
 *
 * Extending past June 2028: re-read the same two Drik pages for Ujjain, never copy
 * another city's list — Ekadashi can move a day between cities.
 */

export type ParvKind = 'parv' | 'ekadashi' | 'purnima' | 'amavasya' | 'sankranti';

export interface Parv {
  date: string; // YYYY-MM-DD, IST
  hi: string;
  en: string;
  kind: ParvKind;
  /** Drik lists the Vaishnava/Gauna fast on the next day. */
  vaishnavaNext?: true;
  /** Only where the Ujjain connection is plain public fact. Never a promise. */
  noteHi?: string;
  noteEn?: string;
}

export const UJJAIN_PARV: Parv[] = [
  // ── 2026 ───────────────────────────────────────────────────────────────
  { date: '2026-09-14', hi: 'गणेश चतुर्थी · हरतालिका तीज', en: 'Ganesh Chaturthi · Hartalika Teej', kind: 'parv' },
  { date: '2026-09-22', hi: 'पार्श्व एकादशी', en: 'Parsva Ekadashi', kind: 'ekadashi' },
  { date: '2026-09-25', hi: 'अनंत चतुर्दशी · गणेश विसर्जन', en: 'Anant Chaturdashi · Ganesh Visarjan', kind: 'parv' },
  { date: '2026-09-26', hi: 'भाद्रपद पूर्णिमा', en: 'Bhadrapada Purnima', kind: 'purnima' },
  { date: '2026-09-27', hi: 'पितृ पक्ष आरंभ', en: 'Pitru Paksha begins', kind: 'parv' },
  { date: '2026-10-06', hi: 'इंदिरा एकादशी', en: 'Indira Ekadashi', kind: 'ekadashi' },
  { date: '2026-10-10', hi: 'सर्वपितृ अमावस्या', en: 'Sarva Pitru Amavasya', kind: 'amavasya' },
  { date: '2026-10-11', hi: 'शारदीय नवरात्रि आरंभ', en: 'Sharad Navratri begins', kind: 'parv' },
  { date: '2026-10-19', hi: 'दुर्गा अष्टमी · महानवमी', en: 'Durga Ashtami · Maha Navami', kind: 'parv' },
  { date: '2026-10-20', hi: 'विजयादशमी · दशहरा', en: 'Vijayadashami · Dussehra', kind: 'parv' },
  { date: '2026-10-22', hi: 'पापांकुशा एकादशी', en: 'Papankusha Ekadashi', kind: 'ekadashi' },
  { date: '2026-10-25', hi: 'शरद पूर्णिमा', en: 'Sharad Purnima', kind: 'purnima' },
  { date: '2026-10-26', hi: 'आश्विन पूर्णिमा', en: 'Ashwina Purnima', kind: 'purnima' },
  { date: '2026-10-29', hi: 'करवा चौथ', en: 'Karva Chauth', kind: 'parv' },
  { date: '2026-11-05', hi: 'रमा एकादशी', en: 'Rama Ekadashi', kind: 'ekadashi' },
  { date: '2026-11-06', hi: 'धनतेरस', en: 'Dhanteras', kind: 'parv' },
  { date: '2026-11-08', hi: 'दीपावली · लक्ष्मी पूजन', en: 'Diwali · Lakshmi Puja', kind: 'parv' },
  { date: '2026-11-09', hi: 'गोवर्धन पूजा', en: 'Govardhan Puja', kind: 'parv' },
  { date: '2026-11-11', hi: 'भाई दूज', en: 'Bhai Dooj', kind: 'parv' },
  { date: '2026-11-15', hi: 'छठ पूजा', en: 'Chhath Puja', kind: 'parv' },
  { date: '2026-11-20', hi: 'देवउठनी एकादशी', en: 'Devutthana Ekadashi', kind: 'ekadashi', vaishnavaNext: true },
  { date: '2026-11-21', hi: 'तुलसी विवाह', en: 'Tulsi Vivah', kind: 'parv' },
  { date: '2026-11-24', hi: 'कार्तिक पूर्णिमा', en: 'Kartika Purnima', kind: 'purnima' },
  { date: '2026-12-01', hi: 'कालभैरव जयंती', en: 'Kalabhairav Jayanti', kind: 'parv',
    noteHi: 'उज्जैन में काल भैरव मंदिर का प्रमुख पर्व।', noteEn: 'A major day at the Kal Bhairav temple in Ujjain.' },
  { date: '2026-12-04', hi: 'उत्पन्ना एकादशी', en: 'Utpanna Ekadashi', kind: 'ekadashi' },
  { date: '2026-12-20', hi: 'मोक्षदा एकादशी · गीता जयंती', en: 'Mokshada Ekadashi · Gita Jayanti', kind: 'ekadashi' },
  { date: '2026-12-23', hi: 'मार्गशीर्ष पूर्णिमा · दत्तात्रेय जयंती', en: 'Margashirsha Purnima · Dattatreya Jayanti', kind: 'purnima' },

  // ── 2027 ───────────────────────────────────────────────────────────────
  { date: '2027-01-03', hi: 'सफला एकादशी', en: 'Saphala Ekadashi', kind: 'ekadashi' },
  { date: '2027-01-15', hi: 'मकर संक्रांति', en: 'Makar Sankranti', kind: 'sankranti' },
  { date: '2027-01-18', hi: 'पौष पुत्रदा एकादशी', en: 'Pausha Putrada Ekadashi', kind: 'ekadashi', vaishnavaNext: true },
  { date: '2027-01-22', hi: 'पौष पूर्णिमा', en: 'Pausha Purnima', kind: 'purnima' },
  { date: '2027-02-02', hi: 'षटतिला एकादशी', en: 'Shattila Ekadashi', kind: 'ekadashi' },
  { date: '2027-02-06', hi: 'मौनी अमावस्या', en: 'Mauni Amavasya', kind: 'amavasya' },
  { date: '2027-02-11', hi: 'वसंत पंचमी', en: 'Vasant Panchami', kind: 'parv' },
  { date: '2027-02-17', hi: 'जया एकादशी', en: 'Jaya Ekadashi', kind: 'ekadashi' },
  { date: '2027-02-20', hi: 'माघ पूर्णिमा', en: 'Magha Purnima', kind: 'purnima' },
  { date: '2027-03-04', hi: 'विजया एकादशी', en: 'Vijaya Ekadashi', kind: 'ekadashi' },
  { date: '2027-03-06', hi: 'महाशिवरात्रि', en: 'Maha Shivaratri', kind: 'parv',
    noteHi: 'महाकालेश्वर मंदिर का सबसे बड़ा वार्षिक उत्सव।', noteEn: 'The biggest annual festival at Mahakaleshwar.' },
  { date: '2027-03-08', hi: 'सोमवती अमावस्या', en: 'Somvati Amavasya', kind: 'amavasya' },
  { date: '2027-03-18', hi: 'आमलकी एकादशी', en: 'Amalaki Ekadashi', kind: 'ekadashi' },
  { date: '2027-03-21', hi: 'होलिका दहन', en: 'Holika Dahan', kind: 'parv' },
  { date: '2027-03-22', hi: 'होली · फाल्गुन पूर्णिमा', en: 'Holi · Phalguna Purnima', kind: 'parv' },
  { date: '2027-04-02', hi: 'पापमोचनी एकादशी', en: 'Papamochani Ekadashi', kind: 'ekadashi' },
  { date: '2027-04-07', hi: 'गुड़ी पड़वा · चैत्र नवरात्रि आरंभ', en: 'Gudi Padwa · Chaitra Navratri begins', kind: 'parv' },
  { date: '2027-04-15', hi: 'राम नवमी', en: 'Rama Navami', kind: 'parv' },
  { date: '2027-04-17', hi: 'कामदा एकादशी', en: 'Kamada Ekadashi', kind: 'ekadashi' },
  { date: '2027-04-20', hi: 'हनुमान जयंती · चैत्र पूर्णिमा', en: 'Hanuman Jayanti · Chaitra Purnima', kind: 'parv' },
  { date: '2027-05-02', hi: 'वरूथिनी एकादशी', en: 'Varuthini Ekadashi', kind: 'ekadashi' },
  { date: '2027-05-09', hi: 'अक्षय तृतीया', en: 'Akshaya Tritiya', kind: 'parv' },
  { date: '2027-05-16', hi: 'मोहिनी एकादशी', en: 'Mohini Ekadashi', kind: 'ekadashi' },
  { date: '2027-05-20', hi: 'बुद्ध पूर्णिमा · वैशाख पूर्णिमा', en: 'Buddha Purnima · Vaishakha Purnima', kind: 'purnima' },
  { date: '2027-06-01', hi: 'अपरा एकादशी', en: 'Apara Ekadashi', kind: 'ekadashi' },
  { date: '2027-06-04', hi: 'शनि जयंती · वट सावित्री व्रत', en: 'Shani Jayanti · Vat Savitri Vrat', kind: 'parv' },
  { date: '2027-06-13', hi: 'गंगा दशहरा', en: 'Ganga Dussehra', kind: 'parv' },
  { date: '2027-06-14', hi: 'निर्जला एकादशी', en: 'Nirjala Ekadashi', kind: 'ekadashi' },
  { date: '2027-06-18', hi: 'वट पूर्णिमा · ज्येष्ठ पूर्णिमा', en: 'Vat Purnima · Jyeshtha Purnima', kind: 'purnima' },
  { date: '2027-06-30', hi: 'योगिनी एकादशी', en: 'Yogini Ekadashi', kind: 'ekadashi' },
  { date: '2027-07-05', hi: 'जगन्नाथ रथ यात्रा', en: 'Jagannath Rath Yatra', kind: 'parv' },
  { date: '2027-07-14', hi: 'देवशयनी एकादशी', en: 'Devshayani Ekadashi', kind: 'ekadashi' },
  { date: '2027-07-18', hi: 'गुरु पूर्णिमा', en: 'Guru Purnima', kind: 'purnima' },
  { date: '2027-07-29', hi: 'कामिका एकादशी', en: 'Kamika Ekadashi', kind: 'ekadashi', vaishnavaNext: true },
  { date: '2027-08-02', hi: 'सोमवती अमावस्या', en: 'Somvati Amavasya', kind: 'amavasya' },
  { date: '2027-08-04', hi: 'हरियाली तीज', en: 'Hariyali Teej', kind: 'parv' },
  { date: '2027-08-06', hi: 'नाग पंचमी', en: 'Nag Panchami', kind: 'parv',
    noteHi: 'महाकालेश्वर मंदिर परिसर का नागचंद्रेश्वर मंदिर वर्ष में इसी दिन खुलता है।',
    noteEn: 'The Nagchandreshwar shrine in the Mahakaleshwar complex opens on this day each year.' },
  { date: '2027-08-12', hi: 'श्रावण पुत्रदा एकादशी', en: 'Shravana Putrada Ekadashi', kind: 'ekadashi' },
  { date: '2027-08-17', hi: 'रक्षाबंधन · श्रावण पूर्णिमा', en: 'Raksha Bandhan · Shravana Purnima', kind: 'parv' },
  { date: '2027-08-25', hi: 'कृष्ण जन्माष्टमी', en: 'Krishna Janmashtami', kind: 'parv' },
  { date: '2027-08-28', hi: 'अजा एकादशी', en: 'Aja Ekadashi', kind: 'ekadashi' },
  { date: '2027-09-03', hi: 'हरतालिका तीज', en: 'Hartalika Teej', kind: 'parv' },
  { date: '2027-09-04', hi: 'गणेश चतुर्थी', en: 'Ganesh Chaturthi', kind: 'parv' },
  { date: '2027-09-11', hi: 'पार्श्व एकादशी', en: 'Parsva Ekadashi', kind: 'ekadashi' },
  { date: '2027-09-14', hi: 'अनंत चतुर्दशी · गणेश विसर्जन', en: 'Anant Chaturdashi · Ganesh Visarjan', kind: 'parv' },
  { date: '2027-09-15', hi: 'भाद्रपद पूर्णिमा', en: 'Bhadrapada Purnima', kind: 'purnima' },
  { date: '2027-09-16', hi: 'पितृ पक्ष आरंभ', en: 'Pitru Paksha begins', kind: 'parv' },
  { date: '2027-09-26', hi: 'इंदिरा एकादशी', en: 'Indira Ekadashi', kind: 'ekadashi' },
  { date: '2027-09-29', hi: 'सर्वपितृ अमावस्या', en: 'Sarva Pitru Amavasya', kind: 'amavasya' },
  { date: '2027-09-30', hi: 'शारदीय नवरात्रि आरंभ', en: 'Sharad Navratri begins', kind: 'parv' },
  { date: '2027-10-07', hi: 'दुर्गा अष्टमी', en: 'Durga Ashtami', kind: 'parv' },
  { date: '2027-10-08', hi: 'महानवमी', en: 'Maha Navami', kind: 'parv' },
  { date: '2027-10-09', hi: 'विजयादशमी · दशहरा', en: 'Vijayadashami · Dussehra', kind: 'parv' },
  { date: '2027-10-11', hi: 'पापांकुशा एकादशी', en: 'Papankusha Ekadashi', kind: 'ekadashi' },
  { date: '2027-10-14', hi: 'शरद पूर्णिमा', en: 'Sharad Purnima', kind: 'purnima' },
  { date: '2027-10-15', hi: 'आश्विन पूर्णिमा', en: 'Ashwina Purnima', kind: 'purnima' },
  { date: '2027-10-18', hi: 'करवा चौथ', en: 'Karva Chauth', kind: 'parv' },
  { date: '2027-10-25', hi: 'रमा एकादशी', en: 'Rama Ekadashi', kind: 'ekadashi', vaishnavaNext: true },
  { date: '2027-10-27', hi: 'धनतेरस', en: 'Dhanteras', kind: 'parv' },
  { date: '2027-10-28', hi: 'नरक चतुर्दशी', en: 'Narak Chaturdashi', kind: 'parv' },
  { date: '2027-10-29', hi: 'दीपावली · लक्ष्मी पूजन', en: 'Diwali · Lakshmi Puja', kind: 'parv' },
  { date: '2027-10-30', hi: 'गोवर्धन पूजा', en: 'Govardhan Puja', kind: 'parv' },
  { date: '2027-10-31', hi: 'भाई दूज', en: 'Bhai Dooj', kind: 'parv' },
  { date: '2027-11-04', hi: 'छठ पूजा', en: 'Chhath Puja', kind: 'parv' },
  { date: '2027-11-10', hi: 'देवउठनी एकादशी', en: 'Devutthana Ekadashi', kind: 'ekadashi' },
  { date: '2027-11-11', hi: 'तुलसी विवाह', en: 'Tulsi Vivah', kind: 'parv' },
  { date: '2027-11-14', hi: 'कार्तिक पूर्णिमा', en: 'Kartika Purnima', kind: 'purnima' },
  { date: '2027-11-20', hi: 'कालभैरव जयंती', en: 'Kalabhairav Jayanti', kind: 'parv',
    noteHi: 'उज्जैन में काल भैरव मंदिर का प्रमुख पर्व।', noteEn: 'A major day at the Kal Bhairav temple in Ujjain.' },
  { date: '2027-11-24', hi: 'उत्पन्ना एकादशी', en: 'Utpanna Ekadashi', kind: 'ekadashi' },
  { date: '2027-12-09', hi: 'मोक्षदा एकादशी · गीता जयंती', en: 'Mokshada Ekadashi · Gita Jayanti', kind: 'ekadashi' },
  { date: '2027-12-13', hi: 'मार्गशीर्ष पूर्णिमा · दत्तात्रेय जयंती', en: 'Margashirsha Purnima · Dattatreya Jayanti', kind: 'purnima' },
  { date: '2027-12-23', hi: 'सफला एकादशी', en: 'Saphala Ekadashi', kind: 'ekadashi' },
  { date: '2027-12-27', hi: 'सोमवती अमावस्या', en: 'Somvati Amavasya', kind: 'amavasya' },

  // ── 2028 (to June) ─────────────────────────────────────────────────────
  { date: '2028-01-08', hi: 'पौष पुत्रदा एकादशी', en: 'Pausha Putrada Ekadashi', kind: 'ekadashi' },
  { date: '2028-01-12', hi: 'पौष पूर्णिमा', en: 'Pausha Purnima', kind: 'purnima' },
  { date: '2028-01-15', hi: 'मकर संक्रांति', en: 'Makar Sankranti', kind: 'sankranti' },
  { date: '2028-01-22', hi: 'षटतिला एकादशी', en: 'Shattila Ekadashi', kind: 'ekadashi' },
  { date: '2028-01-26', hi: 'मौनी अमावस्या', en: 'Mauni Amavasya', kind: 'amavasya' },
  { date: '2028-01-31', hi: 'वसंत पंचमी', en: 'Vasant Panchami', kind: 'parv' },
  { date: '2028-02-06', hi: 'जया एकादशी', en: 'Jaya Ekadashi', kind: 'ekadashi', vaishnavaNext: true },
  { date: '2028-02-10', hi: 'माघ पूर्णिमा', en: 'Magha Purnima', kind: 'purnima' },
  { date: '2028-02-20', hi: 'विजया एकादशी', en: 'Vijaya Ekadashi', kind: 'ekadashi', vaishnavaNext: true },
  { date: '2028-02-23', hi: 'महाशिवरात्रि', en: 'Maha Shivaratri', kind: 'parv',
    noteHi: 'महाकालेश्वर मंदिर का सबसे बड़ा वार्षिक उत्सव।', noteEn: 'The biggest annual festival at Mahakaleshwar.' },
  { date: '2028-03-07', hi: 'आमलकी एकादशी', en: 'Amalaki Ekadashi', kind: 'ekadashi' },
  { date: '2028-03-10', hi: 'होलिका दहन · फाल्गुन पूर्णिमा', en: 'Holika Dahan · Phalguna Purnima', kind: 'parv' },
  { date: '2028-03-11', hi: 'होली', en: 'Holi', kind: 'parv' },
  { date: '2028-03-21', hi: 'पापमोचनी एकादशी', en: 'Papamochani Ekadashi', kind: 'ekadashi' },
  { date: '2028-03-27', hi: 'गुड़ी पड़वा · चैत्र नवरात्रि आरंभ', en: 'Gudi Padwa · Chaitra Navratri begins', kind: 'parv' },
  { date: '2028-04-03', hi: 'राम नवमी', en: 'Rama Navami', kind: 'parv' },
  { date: '2028-04-05', hi: 'कामदा एकादशी', en: 'Kamada Ekadashi', kind: 'ekadashi', vaishnavaNext: true },
  { date: '2028-04-09', hi: 'हनुमान जयंती · चैत्र पूर्णिमा', en: 'Hanuman Jayanti · Chaitra Purnima', kind: 'parv' },
  { date: '2028-04-20', hi: 'वरूथिनी एकादशी', en: 'Varuthini Ekadashi', kind: 'ekadashi' },
  { date: '2028-04-24', hi: 'सोमवती अमावस्या', en: 'Somvati Amavasya', kind: 'amavasya' },
  { date: '2028-04-27', hi: 'अक्षय तृतीया', en: 'Akshaya Tritiya', kind: 'parv' },
  { date: '2028-05-05', hi: 'मोहिनी एकादशी', en: 'Mohini Ekadashi', kind: 'ekadashi' },
  { date: '2028-05-08', hi: 'बुद्ध पूर्णिमा · वैशाख पूर्णिमा', en: 'Buddha Purnima · Vaishakha Purnima', kind: 'purnima' },
  { date: '2028-05-20', hi: 'अपरा एकादशी', en: 'Apara Ekadashi', kind: 'ekadashi' },
  { date: '2028-05-24', hi: 'शनि जयंती · वट सावित्री व्रत', en: 'Shani Jayanti · Vat Savitri Vrat', kind: 'parv' },
  { date: '2028-06-02', hi: 'गंगा दशहरा', en: 'Ganga Dussehra', kind: 'parv' },
  { date: '2028-06-03', hi: 'निर्जला एकादशी', en: 'Nirjala Ekadashi', kind: 'ekadashi' },
  { date: '2028-06-06', hi: 'वट पूर्णिमा व्रत', en: 'Vat Purnima Vrat', kind: 'parv' },
  { date: '2028-06-07', hi: 'ज्येष्ठ पूर्णिमा', en: 'Jyeshtha Purnima', kind: 'purnima' },
  { date: '2028-06-18', hi: 'योगिनी एकादशी', en: 'Yogini Ekadashi', kind: 'ekadashi' },
  { date: '2028-06-24', hi: 'जगन्नाथ रथ यात्रा', en: 'Jagannath Rath Yatra', kind: 'parv' },
];
