#!/usr/bin/env node
/**
 * content-index-gen.mjs — build the SLIM mandir index.
 *
 * Why this exists (measured 2026-08-21):
 * `src/data/mandirs.ts` does an EAGER `import.meta.glob` over all 183 mandir JSONs,
 * so every full record — history, weeklyTiming, faqs, howToReach — ended up in a
 * `content` chunk that was `modulepreload`ed on EVERY page: 1.8 MB raw / 395 KB
 * gzipped, homepage included. The SSG has already baked the visible copy into each
 * page's HTML, so that payload buys nothing outside the temple detail pages.
 *
 * Of the 0.78 MB of mandir JSON, the list/card surfaces (home, /mandirs/,
 * things-to-do, the route table) touch only slug / name / shortIntro / photos /
 * isFeatured / templeType / nearbyMandirs — about 15%. The other 85% is read by
 * exactly one consumer, `pages/mandirs/Detail.tsx`.
 *
 * So: this script emits the 15% as one small JSON that the list surfaces import
 * eagerly, and the full records stay behind the lazily-loaded Detail route.
 *
 * The output IS committed to git so `npm run dev` works on a fresh clone; `npm run
 * build` regenerates it first so it can never drift from src/content/.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src/generated');
const mandirDir = join(root, 'src/content/mandirs');
const mandirOut = join(outDir, 'mandirs-index.json');
const articleDirs = ['simhastha', 'transport', 'tours', 'puja-info', 'blog'];
const articleOut = join(outDir, 'articles-index.json');

/** Keep this list in sync with what the list/card surfaces actually read.
 *  Adding a field here grows the payload on every page — check the consumer first. */
const LIST_FIELDS = [
  'slug',
  'name',
  'shortIntro',
  'photos',
  'isFeatured',
  'templeType',
  'nearbyMandirs',
  // read by MandirCard (the shared card used on home, /mandirs/, things-to-do)
  'deity',
  'locationArea',
  'darshanTimingSummary',
];

const files = readdirSync(mandirDir).filter((f) => f.endsWith('.json'));

/**
 * Walking distance from Mahakaleshwar, computed HERE rather than shipped as coordinates.
 *
 * The /mandirs/ hub groups temples by how far they are from Mahakaleshwar, because the
 * pilgrim question behind "ujjain mandir list" is which temples can be done on foot in one
 * morning — 114 of the 183 are inside a kilometre. Doing that in the component would mean
 * putting `geo` in LIST_FIELDS, i.e. two floats per temple on every page that touches the
 * index. One pre-computed number is smaller, and the haversine never reaches the browser.
 */
const EARTH_KM = 6371;
const rad = (d) => (d * Math.PI) / 180;
function haversineKm(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(h));
}

const fullRecords = files.map((f) => ({ f, full: JSON.parse(readFileSync(join(mandirDir, f), 'utf8')) }));
const mahakal = fullRecords.find((r) => r.full.slug === 'mahakaleshwar')?.full?.geo;
if (!mahakal) throw new Error('mahakaleshwar.json has no geo — the distance cut on /mandirs/ depends on it');

const records = fullRecords.map(({ f, full }) => {
  const slim = {};
  for (const k of LIST_FIELDS) {
    if (full[k] !== undefined) slim[k] = full[k];
  }
  if (!slim.slug) throw new Error(`${f}: missing "slug" — the index is keyed on it`);
  // Two decimals is ~10 m — finer than the coordinates deserve and finer than anyone walks.
  if (full.geo?.lat != null && full.geo?.lng != null) {
    slim.kmFromMahakal = Math.round(haversineKm(mahakal, full.geo) * 100) / 100;
  }
  return slim;
});

// Same ordering the old mandirs.ts applied, so no list on the site reshuffles:
// Mahakaleshwar pinned first, then featured, then alphabetical by English name.
records.sort((a, b) => {
  if (a.slug === 'mahakaleshwar') return -1;
  if (b.slug === 'mahakaleshwar') return 1;
  if (a.isFeatured && !b.isFeatured) return -1;
  if (!a.isFeatured && b.isFeatured) return 1;
  return a.name.en.localeCompare(b.name.en);
});

mkdirSync(outDir, { recursive: true });
writeFileSync(mandirOut, JSON.stringify(records), 'utf8');

const fullBytes = files.reduce((n, f) => n + readFileSync(join(mandirDir, f)).length, 0);
const slimBytes = readFileSync(mandirOut).length;
console.log(
  `✓ mandirs-index: ${records.length} records · ` +
    `${(slimBytes / 1024).toFixed(0)} KB (was ${(fullBytes / 1024).toFixed(0)} KB full, ` +
    `${((1 - slimBytes / fullBytes) * 100).toFixed(0)}% smaller)`
);


/* ── Articles ─────────────────────────────────────────────────────────────────
   Same story as the mandirs: of 284 KB of article JSON, `body` (71%) and `faqs`
   (16%) are read by exactly one consumer — pages/articles/Detail.tsx — while the
   seven landing pages only ever render a card. Card fields are 7% of the bytes. */
const ARTICLE_LIST_FIELDS = [
  'slug',
  'category',
  'title',
  'shortIntro',
  'heroImage',
  'publishDate',
  'relatedSlugs',
  'metaDescription', // TourLanding renders it on the card
  'primaryKeyword',  // TransportLanding uses it in copy
];

const articleRecords = [];
let articleFullBytes = 0;
for (const dir of articleDirs) {
  const abs = join(root, 'src/content', dir);
  let names = [];
  try {
    names = readdirSync(abs).filter((f) => f.endsWith('.json'));
  } catch {
    continue; // a category with no folder yet is fine
  }
  for (const f of names) {
    const raw = readFileSync(join(abs, f), 'utf8');
    articleFullBytes += Buffer.byteLength(raw);
    const full = JSON.parse(raw);
    const slim = {};
    for (const k of ARTICLE_LIST_FIELDS) {
      if (full[k] !== undefined) slim[k] = full[k];
    }
    if (!slim.slug || !slim.category) {
      throw new Error(`${dir}/${f}: needs both "slug" and "category" — the index is keyed on them`);
    }
    articleRecords.push(slim);
  }
}
writeFileSync(articleOut, JSON.stringify(articleRecords), 'utf8');
const articleSlimBytes = readFileSync(articleOut).length;
console.log(
  `✓ articles-index: ${articleRecords.length} records · ` +
    `${(articleSlimBytes / 1024).toFixed(0)} KB (was ${(articleFullBytes / 1024).toFixed(0)} KB full, ` +
    `${((1 - articleSlimBytes / articleFullBytes) * 100).toFixed(0)}% smaller)`
);


/* ── App temple guide ─────────────────────────────────────────────────────────
   The app's Temples tab must work offline, so it carries the fields a pilgrim
   needs standing outside a temple — timings, aarti, entry, address, map point —
   and nothing else. Imported only by src/app/pages/AppMandirs.tsx, which sits
   behind a lazy app route, so no website page ever downloads it. */
const APP_MANDIR_FIELDS = [
  'slug', 'name', 'deity', 'templeType', 'locationArea', 'isFeatured',
  'darshanTimingSummary', 'aartiTiming', 'entryFee', 'address', 'geo',
];
const appMandirOut = join(outDir, 'app-mandirs.json');
const appMandirs = records.map(({ slug }) => {
  const full = JSON.parse(readFileSync(join(mandirDir, `${slug}.json`), 'utf8'));
  const row = {};
  for (const k of APP_MANDIR_FIELDS) {
    if (full[k] !== undefined) row[k] = full[k];
  }
  // Card thumbs are generated by scripts/gen-thumbs.mjs under the photo's basename.
  const photo = Array.isArray(full.photos) ? full.photos[0] : null;
  row.thumb = photo ? `/images/mandirs/thumbs/${photo.split('/').pop().replace(/\.\w+$/, '')}.webp` : null;
  return row;
});
writeFileSync(appMandirOut, JSON.stringify(appMandirs), 'utf8');
console.log(`✓ app-mandirs: ${appMandirs.length} records · ${(readFileSync(appMandirOut).length / 1024).toFixed(0)} KB`);
