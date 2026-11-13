import type { CSSProperties, ReactNode } from 'react';
import { openWhatsAppGate } from './WhatsAppGate';

/**
 * Replaces the old `tel:` CTAs (2026-11-13, calls off site-wide — see lib/noPhone.ts CALLS_OFF).
 * Opens the WhatsApp gate, which writes the lead (name + mobile + purpose) before WhatsApp opens,
 * so every enquiry arrives in writing. Same look as the button it replaces: pass its className/style.
 */
export function EnquireButton({ purpose, service, className, style, children, ariaLabel }: {
  purpose?: string;
  service?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      aria-label={ariaLabel}
      onClick={() => openWhatsAppGate({
        purpose,
        service,
        sourcePage: typeof window !== 'undefined' ? window.location.pathname : '',
      })}
    >
      {children}
    </button>
  );
}
