import { useState } from 'react';
import { useI18n } from '../../i18n';
import { Copy, Check } from 'lucide-react';

interface Props { url: string; title: string; }

export function ShareButtons({ url, title }: Props) {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);
  const enc = (s: string) => encodeURIComponent(s);

  const wa = `https://wa.me/?text=${enc(title + ' — ' + url)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
  const tw = `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-ink-soft">{locale === 'hi' ? 'शेयर:' : 'Share:'}</span>
      <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-full bg-cream-dark/40 px-3 py-1.5 text-xs font-semibold hover:bg-saffron hover:text-white">WhatsApp</a>
      <a href={fb} target="_blank" rel="noopener noreferrer" className="rounded-full bg-cream-dark/40 px-3 py-1.5 text-xs font-semibold hover:bg-saffron hover:text-white">Facebook</a>
      <a href={tw} target="_blank" rel="noopener noreferrer" className="rounded-full bg-cream-dark/40 px-3 py-1.5 text-xs font-semibold hover:bg-saffron hover:text-white">Twitter</a>
      <button onClick={copy} className="flex items-center gap-1 rounded-full bg-cream-dark/40 px-3 py-1.5 text-xs font-semibold hover:bg-saffron hover:text-white" aria-label="Copy link">
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? (locale === 'hi' ? 'कॉपी' : 'Copied') : (locale === 'hi' ? 'कॉपी' : 'Copy')}
      </button>
    </div>
  );
}
