#!/usr/bin/env node
/**
 * Generates /dist/sitemap.xml after vite-react-ssg build.
 * Walks /dist for all index.html files → URLs.
 */
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

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
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map((u) => {
  const isHi = !u.startsWith('/en/');
  const cleanPath = isHi ? u : u.replace(/^\/en/, '');
  const hiUrl = SITE + cleanPath;
  const enUrl = SITE + '/en' + (cleanPath === '/' ? '' : cleanPath);
  let priority = '0.7';
  if (u === '/') priority = '1.0';
  else if (u.includes('mandirs/') && u !== '/mandirs/') priority = '0.9';
  else if (u.includes('simhastha-2028/')) priority = '0.9';
  else if (u.endsWith('mandirs/') || u.endsWith('hotels/')) priority = '0.8';
  return `  <url>
    <loc>${SITE}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="hi-IN" href="${hiUrl}"/>
    <xhtml:link rel="alternate" hreflang="en-IN" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${hiUrl}"/>
  </url>`;
}).join('\n')}
</urlset>
`;

writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`✓ sitemap.xml — ${urls.length} URLs`);
