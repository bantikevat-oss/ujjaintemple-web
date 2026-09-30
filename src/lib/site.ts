export const SITE = {
  domain: 'ujjaintemple.com',
  url: 'https://ujjaintemple.com',
  name: 'UjjainTemple',
  phone: '+91 89890 06759',
  phoneIntl: '+918989006759',
  phoneTel: 'tel:+918989006759',
  email: 'info@ujjaintemple.com',
  // 🔴 WhatsApp stays on the OLD number (Aman, 2026-10-01): the WhatsApp Business account
  // lives there. Calls moved to 8989006759 (matches the GBP); chats did not.
  whatsapp: 'https://wa.me/917400724456',
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
    youtube: 'https://youtube.com/@ujjaintemple',
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
