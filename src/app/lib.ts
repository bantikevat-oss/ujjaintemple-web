/**
 * Shared helpers for the Simhastha 2028 Guide app (the /app/ and /hi/app/ screens).
 *
 * The app is the website's own PWA, wrapped for Android as a TWA — same origin, same
 * build, same deploy. Everything here must be SSG-safe: no window/localStorage access
 * at module scope, and anything that depends on "today" or on stored state is read in
 * an effect so the build-time HTML and the first client render agree.
 */
import type { Locale } from '../i18n';

export const APP_TABS = ['', 'news/', 'calendar/', 'mandirs/', '84-mahadev/', 'plan/'] as const;
export type AppTab = (typeof APP_TABS)[number];

export const appPath = (locale: Locale, tab: AppTab = '') => `${locale === 'hi' ? '/hi' : ''}/app/${tab}`;

/** Today's date in Ujjain (YYYY-MM-DD), whatever the device timezone is. */
export function istToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now);
}

export function daysUntil(iso: string, today: string): number {
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
}

/** Calendar dates are plain days, so they are formatted in UTC to stop a shift across midnight. */
export function formatDate(
  iso: string,
  locale: Locale,
  opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', { ...opts, timeZone: 'UTC' });
}

/**
 * An all-day Google Calendar event. On Android this opens the Calendar app's
 * "new event" screen pre-filled; the user saves it, so nothing is added silently.
 */
export function googleCalendarLink(title: string, iso: string, details: string): string {
  const start = iso.replace(/-/g, '');
  const end = new Date(Date.parse(`${iso}T00:00:00Z`) + 86400000).toISOString().slice(0, 10).replace(/-/g, '');
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    details,
    location: 'Ujjain, Madhya Pradesh',
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

/** localStorage can be missing or throw (private mode, blocked site data) — never let that break a screen. */
export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStore(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage blocked — the state lives for this session only. */
  }
}

export type NewsItem = { title: string; link: string; iso: string; summary: string };

/** Same-origin RSS of the PHP news section. Articles are Hindi-only. */
export const NEWS_FEED = '/hi/simhastha-2028-news/feed.xml';
export const NEWS_SECTION = '/hi/simhastha-2028-news/';

/** Throws when the feed is unreachable, so screens can say so instead of showing "no news". */
export async function fetchNews(limit = 20): Promise<NewsItem[]> {
  const res = await fetch(NEWS_FEED, { headers: { Accept: 'application/rss+xml' } });
  if (!res.ok) throw new Error(`feed ${res.status}`);
  const xml = new DOMParser().parseFromString(await res.text(), 'application/xml');
  // A parse failure yields a <parsererror> document rather than throwing.
  if (xml.querySelector('parsererror')) throw new Error('feed parse');
  return Array.from(xml.querySelectorAll('item'))
    .slice(0, limit)
    .map((it) => {
      const d = new Date(it.querySelector('pubDate')?.textContent ?? '');
      return {
        title: it.querySelector('title')?.textContent?.trim() ?? '',
        link: it.querySelector('link')?.textContent?.trim() ?? '',
        summary: (it.querySelector('description')?.textContent ?? '').trim(),
        iso: Number.isNaN(d.getTime()) ? '' : istToday(d),
      };
    })
    .filter((n) => n.title && n.link);
}

export const MAPS_DIR = (lat: number, lng: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
export const MAPS_SEARCH = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
