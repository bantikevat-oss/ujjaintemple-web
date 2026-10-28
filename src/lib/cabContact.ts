/**
 * The cab widget's remembered contact (name + mobile, 30 days in localStorage), in its own tiny
 * module so the WhatsApp gate — mounted on every page — can hand a contact over without pulling
 * the whole booking widget into every page's bundle (2026-10-28).
 */
export const CONTACT_KEY = 'ut_cab_contact';
export const CONTACT_DAYS = 30;
export type Contact = { name: string; phone: string; at: number };
export const readContact = (): Contact | null => {
  try {
    const c = JSON.parse(localStorage.getItem(CONTACT_KEY) || 'null') as Contact | null;
    return c && c.name && c.phone && Date.now() - c.at < CONTACT_DAYS * 864e5 ? c : null;
  } catch { return null; }
};
export const saveContact = (c: Contact | null) => {
  try { if (c) localStorage.setItem(CONTACT_KEY, JSON.stringify(c)); else localStorage.removeItem(CONTACT_KEY); } catch { /* private mode */ }
};
export const CONTACT_EVT = 'ujt:cab-contact';
/** The WhatsApp gate hands over a name + mobile the visitor already typed, so the widget does not ask again. */
export function rememberCabContact(name: string, phone: string) {
  if (name.trim().length < 2 || phone.replace(/[^0-9]/g, '').length < 10) return;
  saveContact({ name: name.trim(), phone: phone.trim(), at: Date.now() });
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(CONTACT_EVT));
}
