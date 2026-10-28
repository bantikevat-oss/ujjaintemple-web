export const SITE = {
  domain: 'ujjaintemple.com',
  url: 'https://ujjaintemple.com',
  name: 'UjjainTemple',
  phone: '+91 89890 06759',
  phoneIntl: '+918989006759',
  phoneTel: 'tel:+918989006759',
  email: 'info@ujjaintemple.com',
  // One number for calls AND WhatsApp (Aman, 2026-10-28): 89890 06759 runs the WhatsApp Business
  // app. The old 74007 24456 is retired everywhere — do not bring it back.
  whatsapp: 'https://wa.me/918989006759',
  address: {
    locality: 'Ujjain',
    region: 'Madhya Pradesh',
    // 456010 matches the Google Business Profile. The site previously published 456001 in
    // schema on 376 pages while the GBP said 456010 — an unexplained contradiction between
    // a site and its own profile is a cheap reason for an engine to not resolve the entity
    // (SEO_KIT §7). Street address deliberately NOT published; footer still shows city only.
    postalCode: '456010',
    country: 'IN',
  },
  social: {
    facebook: 'https://facebook.com/ujjaintemple',
    instagram: 'https://instagram.com/ujjaintemple',
    // youtube: none — @ujjaintemple does not exist (404, checked 2026-10-24). Add it back only once a channel is live.
  },
  // Forward targets (ByteFlow asset network)
  forwards: {
    mangalDosh: 'https://www.mangaldoshnivaranpujaujjain.com/',
    kaalSarp: 'https://kaalsarpdoshpujaujjain.com/',
    panditg: 'https://panditg.in/',
    ujjainJankari: 'https://ujjainjankari.in/',
  },
};

export const utmForward = (target: string, campaign: string) => {
  const u = new URL(target);
  u.searchParams.set('utm_source', 'ujjaintemple');
  u.searchParams.set('utm_medium', 'referral');
  u.searchParams.set('utm_campaign', campaign);
  return u.toString();
};
