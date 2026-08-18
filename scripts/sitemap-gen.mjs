#!/usr/bin/env node
/**
 * Generates /dist/sitemap.xml after vite-react-ssg build.
 * Walks /dist for all index.html files → URLs.
 */
import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(process.cwd(), 'dist');
const SITE = 'https://ujjaintemple.com';

function walk(dir, prefix = '') {
  const urls = [];
  for (const f of readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      urls.push(...walk(full, prefix + '/' + f));
    } else if (f === 'index.html') {
      urls.push(prefix + '/');
    }
  }
  return urls;
}

const urls = walk(ROOT).map((u) => u.replace(/\/+/g, '/'));

const today = new Date().toISOString().split('T')[0];

/**
 * ujt-014 (2026-08-18): REAL per-URL lastmod instead of stamping today's build date
 * on all 452 URLs. With one shared lastmod, the 166 pages the 08-06 restore brought
 * back looked identical to the 269 that had not changed, so Google got no
 * recrawl-priority signal from the sitemap at all.
 *
 * lastmod = last commit that touched the page's SOURCE (content JSON and/or its page
 * component), falling back to file mtime, then to the build date. Never fewer URLs,
 * never a crash when git is unavailable.
 */
const _lastmodCache = new Map();

function gitDate(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out ? out.split('T')[0] : null;
  } catch { return null; }
}

function mtimeDate(file) {
  try { return statSync(file).mtime.toISOString().split('T')[0]; } catch { return null; }
}

/**
 * Content JSON + page component that determine a route (English path; /hi mirrors it).
 * URL segments deliberately differ from content-dir names, so the mapping is explicit
 * rather than guessed — see src/data/articles.ts `articlePath` and src/routes.tsx.
 */
const SECTION_CONTENT_DIR = {
  'mandirs': 'mandirs',
  'simhastha-2028': 'simhastha',
  'transport-in-ujjain': 'transport',
  'tour-and-travel-ujjain': 'tours',
  'puja-in-ujjain': 'puja-info',
  'blog': 'blog',
};

/** Landing/static routes -> the component that renders them (src/routes.tsx). */
const ROUTE_COMPONENT = {
  '': 'Home.tsx',
  'mandirs': 'mandirs/Index.tsx',
  '84-mahadev-ujjain': 'Mahadev84.tsx',
  'hotels': 'HotelsIndex.tsx',
  'things-to-do-in-ujjain': 'ThingsToDo.tsx',
  'about': 'AboutPage.tsx',
  'contact': 'ContactPage.tsx',
  'privacy-policy': 'PrivacyPage.tsx',
  'terms': 'TermsPage.tsx',
  'simhastha-2028': 'SimhasthaLanding.tsx',
  'transport-in-ujjain': 'TransportLanding.tsx',
  'cab-booking': 'CabBookingLanding.tsx',
  'tour-and-travel-ujjain': 'TourLanding.tsx',
  'puja-in-ujjain': 'PujaLanding.tsx',
};

function sourcesFor(routePath) {
  const p = routePath.replace(/^\/hi/, '').replace(/\/$/, '');
  const out = [];
  const push = (f) => { if (f && existsSync(f)) out.push(f); };
  const seg = p.split('/').filter(Boolean);
  const section = seg[0] || '';

  if (seg.length <= 1) {
    const comp = ROUTE_COMPONENT[section];
    if (comp) push(path.join('src', 'pages', comp));
  } else {
    // Detail page: its own content JSON is the real source of truth.
    const dir = SECTION_CONTENT_DIR[section];
    if (dir) push(path.join('src', 'content', dir, seg[1] + '.json'));
    // Plus the component that renders that kind of detail page.
    if (section === 'mandirs') push(path.join('src', 'pages', 'mandirs', 'Detail.tsx'));
    else if (section === 'tour-and-travel-ujjain') {
      push(path.join('src', 'pages', 'TourPackageDetail.tsx'));
      push(path.join('src', 'data', 'packages.ts'));
      push(path.join('src', 'pages', 'articles', 'Detail.tsx'));
    } else push(path.join('src', 'pages', 'articles', 'Detail.tsx'));
  }
  return out;
}

function lastmodFor(routePath) {
  if (_lastmodCache.has(routePath)) return _lastmodCache.get(routePath);
  const stamps = sourcesFor(routePath)
    .map((f) => gitDate(f) || mtimeDate(f))
    .filter(Boolean)
    .sort();
  const value = stamps.length ? stamps[stamps.length - 1] : today;
  _lastmodCache.set(routePath, value);
  return value;
}
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map((u) => {
  const isEn = !u.startsWith('/hi/');
  const cleanPath = isEn ? u : u.replace(/^\/hi/, '');
  const enUrl = SITE + cleanPath;
  const hiUrl = SITE + '/hi' + (cleanPath === '/' ? '' : cleanPath);
  let priority = '0.7';
  if (u === '/') priority = '1.0';
  else if (u.includes('mandirs/') && u !== '/mandirs/') priority = '0.9';
  else if (u.includes('simhastha-2028/')) priority = '0.9';
  else if (u.endsWith('mandirs/') || u.endsWith('hotels/')) priority = '0.8';
  return `  <url>
    <loc>${SITE}${u}</loc>
    <lastmod>${lastmodFor(u)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="hi-IN" href="${hiUrl}"/>
    <xhtml:link rel="alternate" hreflang="en-IN" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>`;
}).join('\n')}
</urlset>
`;

writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`✓ sitemap.xml — ${urls.length} URLs`);
