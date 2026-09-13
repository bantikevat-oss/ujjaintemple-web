import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useI18n } from '../i18n';
import { disablePush, enablePush, getPushState, type PushState } from './pwa';

/**
 * Opt-in for "new Simhastha news" notifications. Permission is only ever requested
 * from this button — never on page load, which Android and Chrome both penalise and
 * which users rightly dismiss.
 */
export function NotifyToggle() {
  const { locale } = useI18n();
  const hi = locale === 'hi';
  const [state, setState] = useState<PushState | 'loading' | 'busy' | 'error'>('loading');

  useEffect(() => {
    getPushState().then(setState).catch(() => setState('unsupported'));
  }, []);

  if (state === 'loading' || state === 'unsupported') return null;

  const toggle = async () => {
    const wasOn = state === 'on';
    setState('busy');
    setState(wasOn ? await disablePush() : await enablePush());
  };

  if (state === 'denied') {
    return (
      <p className="rounded-lg bg-cream-dark/60 p-3 text-xs text-ink-soft">
        {hi
          ? 'सूचनाएँ बंद हैं। फ़ोन की Settings → Apps → इस ऐप → Notifications से चालू कर सकते हैं।'
          : 'Notifications are blocked. Turn them on from phone Settings → Apps → this app → Notifications.'}
      </p>
    );
  }

  const on = state === 'on';
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gold/40 bg-white p-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">
          {hi ? 'नई खबर आते ही सूचना' : 'Notify me of new articles'}
        </p>
        <p className="text-xs text-ink-mute">
          {state === 'error'
            ? hi ? 'अभी चालू नहीं हो पाया, थोड़ी देर बाद फिर कोशिश करें।' : 'Could not update just now — try again shortly.'
            : on
              ? hi ? 'चालू है' : 'On'
              : hi ? 'हर नई सिंहस्थ ख़बर पर एक सूचना' : 'One notification per new Simhastha article'}
        </p>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={state === 'busy'}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
          on ? 'border border-maroon/40 text-maroon hover:bg-maroon-50' : 'bg-maroon text-white hover:bg-maroon-600'
        }`}
      >
        {on ? <BellOff className="h-4 w-4" aria-hidden /> : <Bell className="h-4 w-4" aria-hidden />}
        {state === 'busy' ? '…' : on ? (hi ? 'बंद करें' : 'Turn off') : (hi ? 'चालू करें' : 'Turn on')}
      </button>
    </div>
  );
}
