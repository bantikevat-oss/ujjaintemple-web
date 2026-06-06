import { useI18n } from '../../i18n';
import { LeadForm } from './LeadForm';

interface GlobalLeadSectionProps {
  sourcePage: string;
  defaultService?: 'hotel' | 'cab' | 'tour' | 'simhastha' | 'transport';
}

export function GlobalLeadSection({ sourcePage, defaultService = 'tour' }: GlobalLeadSectionProps) {
  const { locale } = useI18n();

  return (
    <section className="bg-[#3E0F0A] py-16 sm:py-24 border-t-8 border-saffron relative overflow-hidden">
      <div className="container-page relative z-10">
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-center mb-12 text-white">
          {locale === 'hi' ? 'कॉल बैक का अनुरोध करें' : 'Request a Call Back'}
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Form Side */}
          <div className="shadow-2xl max-w-md mx-auto lg:max-w-full lg:mx-0 w-full">
            <LeadForm variant="card" defaultService={defaultService} sourcePage={sourcePage} />
          </div>

          {/* Text Side */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start pl-0 lg:pl-12">
            <h3 className="font-serif text-4xl sm:text-5xl font-bold text-[#D4AF37] mb-8 leading-tight">
              One Step<br/>Solution For
            </h3>
            <ul className="space-y-4 text-xl sm:text-2xl font-serif text-white inline-block text-left">
              <li className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)] flex-shrink-0" /> {locale === 'hi' ? 'ऑनलाइन पूजा' : 'Online Puja'}
              </li>
              <li className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)] flex-shrink-0" /> {locale === 'hi' ? 'यातायात (कैब)' : 'Transportation (Cab)'}
              </li>
              <li className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)] flex-shrink-0" /> {locale === 'hi' ? 'आवास (होटल)' : 'Accommodation'}
              </li>
              <li className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)] flex-shrink-0" /> {locale === 'hi' ? 'तीर्थ पुरोहित' : 'Tirth Purohit'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
