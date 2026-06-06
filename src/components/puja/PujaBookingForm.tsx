import { useState, FormEvent } from 'react';
import { Sparkles, CalendarDays, User, PhoneCall } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SITE } from '../../lib/site';

interface Props {
  pujaName: { hi: string; en: string };
}

export function PujaBookingForm({ pujaName }: Props) {
  const { locale } = useI18n();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append('sourcePage', `puja-booking-${pujaName.en}`);
    data.append('service', 'puja');
    data.append('locale', locale);
    
    // Add puja name specifically into the message automatically
    const existingMessage = data.get('message') || '';
    const name = pujaName[locale];
    data.set('message', `[Puja Inquiry: ${name}]\n${existingMessage}`);

    try {
      const res = await fetch('/api/lead.php', { method: 'POST', body: data });
      if (!res.ok) throw new Error('submit failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <aside className="my-10 relative overflow-hidden rounded-2xl border-2 border-gold/60 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
      style={{ background: 'linear-gradient(160deg, #1a0404 0%, #2f0707 45%, #200505 100%)' }}>
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <span className="font-serif text-[12rem] leading-none text-gold">ॐ</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-900/40 via-transparent to-black/60 pointer-events-none" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_1.2fr] items-center">
        {/* Left Side: Copy & Info */}
        <div className="text-white">
          <div className="inline-flex items-center gap-2 border border-gold/40 bg-maroon-900/80 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-gold-light" />
            <span className="text-xs sm:text-sm font-semibold tracking-widest text-gold-light uppercase">
              {locale === 'hi' ? 'विशेषज्ञ पंडित बुकिंग' : 'Expert Pandit Booking'}
            </span>
          </div>
          
          <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-cream mb-4 leading-tight">
            {locale === 'hi' 
              ? `${pujaName.hi} विधिवत सम्पन्न कराएँ` 
              : `Book Authentic ${pujaName.en}`}
          </h3>
          
          <p className="text-cream/80 text-base sm:text-lg mb-8 leading-relaxed font-serif italic">
            {locale === 'hi' 
              ? 'उज्जैन के सिद्ध पीठ पर, अनुभवी ब्राह्मणों द्वारा शास्त्रोक्त विधि से पूर्ण अनुष्ठान। आज ही अपनी तिथि पक्की करें।'
              : 'Complete vedic rituals by experienced brahmins at sacred sites in Ujjain. Secure your date today.'}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-cream/90">
              <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center bg-gold/10">
                <span className="text-gold font-serif font-bold">1</span>
              </div>
              <span className="text-sm sm:text-base">{locale === 'hi' ? 'फॉर्म भरें या कॉल करें' : 'Fill form or Call us'}</span>
            </div>
            <div className="flex items-center gap-4 text-cream/90">
              <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center bg-gold/10">
                <span className="text-gold font-serif font-bold">2</span>
              </div>
              <span className="text-sm sm:text-base">{locale === 'hi' ? 'पंडित जी से निःशुल्क परामर्श' : 'Free consultation with Pandit Ji'}</span>
            </div>
            <div className="flex items-center gap-4 text-cream/90">
              <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center bg-gold/10">
                <span className="text-gold font-serif font-bold">3</span>
              </div>
              <span className="text-sm sm:text-base">{locale === 'hi' ? 'मुहूर्त अनुसार पूजा सम्पन्न' : 'Puja performed as per Muhurta'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8">
          {status === 'success' ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/50">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-gold mb-2">
                {locale === 'hi' ? 'आवेदन प्राप्त हुआ' : 'Request Received'}
              </h4>
              <p className="text-cream/90">
                {locale === 'hi' 
                  ? 'धन्यवाद! हमारे पंडित जी जल्द ही आपसे संपर्क करेंगे।' 
                  : 'Thank you! Our Pandit Ji will contact you shortly.'}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-cream/90 mb-1.5" htmlFor="pf-name">
                  {locale === 'hi' ? 'यजमान का नाम' : 'Yajaman Name'} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/60" />
                  <input id="pf-name" name="name" required type="text" 
                    className="w-full bg-black/20 border border-gold/30 rounded-lg py-2.5 pl-10 pr-4 text-cream placeholder-cream/30 focus:outline-none focus:border-gold focus:bg-black/40 transition-colors"
                    placeholder={locale === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cream/90 mb-1.5" htmlFor="pf-phone">
                  {locale === 'hi' ? 'WhatsApp नंबर' : 'WhatsApp Number'} *
                </label>
                <div className="relative">
                  <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/60" />
                  <input id="pf-phone" name="phone" required type="tel" pattern="[0-9]{10}"
                    className="w-full bg-black/20 border border-gold/30 rounded-lg py-2.5 pl-10 pr-4 text-cream placeholder-cream/30 focus:outline-none focus:border-gold focus:bg-black/40 transition-colors"
                    placeholder="10 digit mobile number" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cream/90 mb-1.5" htmlFor="pf-date">
                  {locale === 'hi' ? 'अनुमानित तिथि (वैकल्पिक)' : 'Expected Date (Optional)'}
                </label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/60" />
                  <input id="pf-date" name="message" type="text"
                    className="w-full bg-black/20 border border-gold/30 rounded-lg py-2.5 pl-10 pr-4 text-cream placeholder-cream/30 focus:outline-none focus:border-gold focus:bg-black/40 transition-colors"
                    placeholder={locale === 'hi' ? 'उदा. अगले हफ्ते' : 'e.g., Next week'} />
                </div>
              </div>

              <button type="submit" disabled={status === 'sending'} 
                className="w-full mt-2 font-bold text-maroon-900 py-3.5 rounded-lg text-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 flex justify-center"
                style={{ background: 'linear-gradient(135deg, #E0C374, #C9A84C)', boxShadow: '0 4px 15px rgba(201,168,76,0.3)' }}>
                {status === 'sending' 
                  ? (locale === 'hi' ? 'भेज रहे हैं...' : 'Sending...') 
                  : (locale === 'hi' ? 'पूजा के लिए कॉल बैक माँगें' : 'Request Call Back for Puja')}
              </button>
            </form>
          )}
        </div>
      </div>
    </aside>
  );
}
