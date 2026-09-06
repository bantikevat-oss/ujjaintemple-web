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

/**
 * Extra non-HTML URLs that belong in the sitemap.
 *
 * The IndexNow key file is the important one: crawlers and auditors discover the key
 * from the sitemap (robots.txt almost never lists it), and without it the IndexNow
 * submissions we already make cannot be attributed to this host. The key file itself
 * is untracked and server-only — never regenerate it, reuse the same key forever.
 */
const EXTRA = [];
for (const f of readdirSync(ROOT)) {
  if (/^[0-9a-f]{8,64}\.txt$/i.test(f)) EXTRA.push('/' + f);
}
if (existsSync(path.join(ROOT, 'llms.txt'))) EXTRA.push('/llms.txt');

const extraXml = EXTRA.map((u) => `  <url>
    <loc>${SITE}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>`).join('\n');

const finalXml = extraXml
  ? xml.replace('</urlset>', extraXml + '\n</urlset>')
  : xml;

writeFileSync(path.join(ROOT, 'sitemap.xml'), finalXml);
console.log(`✓ sitemap.xml — ${urls.length} URLs` +
  (EXTRA.length ? ` + ${EXTRA.length} key/agent file(s): ${EXTRA.join(', ')}` : ''));

/**
 * /rss.xml at the conventional root path. The Simhastha news section has its own
 * feed, but a feed reader — and every "does this site publish?" check — looks here.
 * Content is the most recently changed pages by the same lastmod we just computed.
 */
const feedItems = urls
  .filter((u) => !u.startsWith('/hi/'))
  .map((u) => ({ u, d: lastmodFor(u) }))
  .sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0))
  .slice(0, 40);

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const titleFor = (u) => u === '/' ? 'Ujjain Temples & Simhastha 2028'
  : u.replace(/^\/|\/$/g, '').split('/').pop().replace(/-/g, ' ')
     .replace(/\b\w/g, (c) => c.toUpperCase());

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>UjjainTemple.com</title>
  <link>${SITE}/</link>
  <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
  <description>Ujjain temples, the 84 Mahadev circuit, and Simhastha 2028 (27 March - 27 May 2028).</description>
  <language>en-in</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${feedItems.map(({ u, d }) => `  <item>
    <title>${esc(titleFor(u))}</title>
    <link>${SITE}${u}</link>
    <guid isPermaLink="true">${SITE}${u}</guid>
    <pubDate>${new Date(d + 'T00:00:00Z').toUTCString()}</pubDate>
  </item>`).join('\n')}
</channel>
</rss>
`;
writeFileSync(path.join(ROOT, 'rss.xml'), rss);
console.log(`✓ rss.xml — ${feedItems.length} items`);
