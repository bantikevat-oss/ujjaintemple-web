export const SITE = {
  domain: 'ujjaintemple.com',
  url: 'https://ujjaintemple.com',
  name: 'UjjainTemple',
  phone: '+91 74007 24456',
  phoneIntl: '+917400724456',
  phoneTel: 'tel:+917400724456',
  email: 'info@ujjaintemple.com',
  whatsapp: 'https://wa.me/917400724456',
  address: {
    locality: 'Ujjain',
    region: 'Madhya Pradesh',
    postalCode: '456001',
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
