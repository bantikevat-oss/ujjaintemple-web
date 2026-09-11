import { SITE } from './site';
import type { Locale } from '../i18n';

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function buildCanonical(path: string, locale: Locale): string {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  if (locale === 'en') return `${SITE.url}/${cleanPath}${cleanPath ? '/' : ''}`;
  return `${SITE.url}/hi/${cleanPath}${cleanPath ? '/' : ''}`;
}

export function buildHreflang(path: string): Array<{ hreflang: string; href: string }> {
  const cleanPath = path.replace(/^\/+|\/+$/g, '').replace(/^hi\//, '');
  return [
    { hreflang: 'en-IN', href: `${SITE.url}/${cleanPath}${cleanPath ? '/' : ''}` },
    { hreflang: 'hi-IN', href: `${SITE.url}/hi/${cleanPath}${cleanPath ? '/' : ''}` },
    { hreflang: 'x-default', href: `${SITE.url}/${cleanPath}${cleanPath ? '/' : ''}` },
  ];
}

/* ──────────────────────────────────────────────────────────────────────────────
   SERP fit — 2026-09-11
   ──────────────────────────────────────────────────────────────────────────────
   Measured before this change: 426 of 464 pages carried a <title> over 60
   characters, and the site's whole problem is CTR (168,235 impressions → 1,245
   clicks = 0.7% at average position 8.8). A title Google truncates or rewrites is
   a title we did not write.

   Two things ate the width. Every non-mandir page appended "| Ujjain Temple" —
   16 characters restating the domain the SERP already shows. And the mandir
   template promised four things ("Darshan Timings, Aarti, History & How to
   Reach") where the query family is overwhelmingly just timings.

   🔴 This clamp is deliberately NOT applied to pages earning ≥50 clicks/28d —
   the G2 protected-asset rule. Their titles are working; a rewrite without a
   baseline is a bet, not a fix. Re-read this list from GSC every run and never
   copy it forward blind.
   ────────────────────────────────────────────────────────────────────────────── */

export const TITLE_MAX = 60;

/** `${locale}:${path}` of every page at ≥50 clicks / 28d (GSC 2026-08-11→09-08). */
const TITLE_PROTECTED = new Set([
  'hi:/transport-in-ujjain/ujjain-to-omkareshwar-cab/', // 95 clicks
  'en:/84-mahadev-ujjain/',                             // 87 clicks
  'hi:/84-mahadev-ujjain/',                             // 66 clicks
  'hi:/mandirs/',                                       // 52 clicks
]);

export function isTitleProtected(path: string, locale: Locale): boolean {
  return TITLE_PROTECTED.has(`${locale}:${path}`);
}

/**
 * Trim a title to the SERP's width without ever mangling the subject.
 *
 * Order matters: the brand suffix goes first (it carries no query), then the
 * promise list is shortened from the RIGHT, so the leading promise — which is
 * the one matching the query family — is the last thing to go. The subject
 * before the em-dash is never cut: a half-written temple name costs more than a
 * long title.
 */
export function clampTitle(title: string, max = TITLE_MAX): string {
  let t = title.trim();
  if (t.length <= max) return t;

  // 1. Drop the pipe-delimited tail — on this site that is always a brand or a
  //    qualifier ("| Ujjain Temple", "| Ujjain Tour Packages", "| Taxi Fare"),
  //    and the SERP already prints the site name underneath. Only ever removed
  //    when the title is over budget, so a short title keeps whatever it has.
  while (t.length > max) {
    const trimmed = t.replace(/\s*[|｜]\s*[^|｜]{1,40}\s*$/, '').trim();
    if (trimmed === t || !trimmed) break;
    t = trimmed;
  }
  if (t.length <= max) return t;

  // 2. Shorten the promise list after the em-dash, one segment at a time.
  const dash = t.indexOf('—');
  if (dash > 0) {
    const head = t.slice(0, dash).trim();
    const parts = t.slice(dash + 1).split(/,|\s&\s|\sव\s|\sऔर\s/).map((s) => s.trim()).filter(Boolean);
    for (let keep = parts.length - 1; keep >= 1; keep--) {
      const candidate = `${head} — ${parts.slice(0, keep).join(', ')}`;
      if (candidate.length <= max) return candidate;
    }
    return head;
  }
  return t;
}

export const DESC_MAX = 165;

/**
 * Trim a description to whole sentences inside the SERP's width.
 *
 * Only ever cuts at a sentence end. If the first sentence alone is longer than
 * the budget there is no honest cut, so the string is returned untouched and
 * Google does its own truncation — which is strictly better than us authoring a
 * dangling half-clause (the defect this replaces: 266 of 464 pages).
 */
export function clampDescription(desc: string, max = DESC_MAX): string {
  const d = desc.trim();
  if (d.length <= max) return d;
  const cut = Math.max(d.lastIndexOf('\u0964', max), d.lastIndexOf('. ', max), d.lastIndexOf('.', max));
  if (cut <= 0) return d;
  return d.slice(0, cut + 1).trim();
}
