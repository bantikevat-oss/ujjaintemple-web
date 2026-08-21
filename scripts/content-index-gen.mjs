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

const records = files.map((f) => {
  const full = JSON.parse(readFileSync(join(mandirDir, f), 'utf8'));
  const slim = {};
  for (const k of LIST_FIELDS) {
    if (full[k] !== undefined) slim[k] = full[k];
  }
  if (!slim.slug) throw new Error(`${f}: missing "slug" — the index is keyed on it`);
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
