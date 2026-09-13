/**
 * Simhastha 2028 Shahi Snan dates — the ONE source for the landing page and the app.
 *
 * Sourced from published media reporting (Dainik Bhaskar as reference; Webdunia,
 * Times Now Navbharat, ETV Bharat, Patrika carry the same three dates; re-verified
 * 2026-08-12). Seven parv snans are also reported as proposed, but no outlet has
 * published their dates yet — so they are named, not dated.
 *
 * 🔴 Never add dates, weekdays or tithi labels from the confidential government
 * presentation, or from affiliate sites (simhastha.org.in) — see the project HANDOFF.
 */
export interface ShahiSnan {
  num: number;
  /** YYYY-MM-DD, IST — what countdowns and calendar reminders are computed from. */
  iso: string;
  dateHi: string;
  dateEn: string;
  nameHi: string;
  nameEn: string;
  noteHi: string;
  noteEn: string;
  highlight: boolean;
}

export const SHAHI_SNANS: ShahiSnan[] = [
  {
    num: 1,
    iso: '2028-04-09',
    dateHi: '09 अप्रैल 2028',   dateEn: '09 April 2028',
    nameHi: 'प्रथम शाही स्नान',   nameEn: 'First Shahi Snan',
    noteHi: 'पहला शाही स्नान — स्नान पर्व की शुरुआत', noteEn: 'First Shahi Snan — the bathing period opens',
    highlight: true,
  },
  {
    num: 2,
    iso: '2028-04-23',
    dateHi: '23 अप्रैल 2028',   dateEn: '23 April 2028',
    nameHi: 'द्वितीय शाही स्नान',   nameEn: 'Second Shahi Snan',
    noteHi: 'दूसरा शाही स्नान', noteEn: 'Second Shahi Snan',
    highlight: true,
  },
  {
    num: 3,
    iso: '2028-05-08',
    dateHi: '08 मई 2028',       dateEn: '08 May 2028',
    nameHi: 'तृतीय शाही स्नान',  nameEn: 'Third Shahi Snan',
    noteHi: 'तीसरा और आखिरी शाही स्नान — स्नान पर्व का समापन', noteEn: 'Third and final Shahi Snan — the bathing period closes',
    highlight: true,
  },
];

export const SNAN_SOURCE_HI = 'प्रकाशित मीडिया रिपोर्ट्स (दैनिक भास्कर सहित)';
export const SNAN_SOURCE_EN = 'published media reports, including Dainik Bhaskar';
