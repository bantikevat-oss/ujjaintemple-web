#!/usr/bin/env node
/**
 * check-parv.mjs — guard the hand-curated calendar in src/data/ujjain-parv.ts.
 *
 * The dates themselves can only be checked against the published panchang (see the
 * header of that file). This catches the mistakes a human makes while typing them:
 * unsorted or duplicate rows, impossible dates, Ekadashis that are not about a
 * fortnight apart, and words the site never uses (bheed, VIP, kataar, guarantees).
 *
 * Run: node scripts/check-parv.mjs   (also runs at the head of `npm run build`)
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'src/data/ujjain-parv.ts'), 'utf8');

const rows = [...src.matchAll(/\{\s*date:\s*'(\d{4}-\d{2}-\d{2})',\s*hi:\s*'([^']+)',\s*en:\s*'([^']+)',\s*kind:\s*'(\w+)'/g)]
  .map((m) => ({ date: m[1], hi: m[2], en: m[3], kind: m[4] }));

const fail = [];
if (rows.length < 100) fail.push(`parsed only ${rows.length} rows — the row regex no longer matches the file`);

const KINDS = new Set(['parv', 'ekadashi', 'purnima', 'amavasya', 'sankranti']);
const BANNED = ['भीड़', 'कतार', 'VIP', 'गारंटी', 'guarantee', 'crowd'];
const seen = new Set();

rows.forEach((r, i) => {
  const d = new Date(`${r.date}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== r.date) fail.push(`${r.date}: not a real date`);
  if (i > 0 && r.date < rows[i - 1].date) fail.push(`${r.date}: out of order after ${rows[i - 1].date}`);
  if (!KINDS.has(r.kind)) fail.push(`${r.date}: unknown kind "${r.kind}"`);
  const key = `${r.date}|${r.en}`;
  if (seen.has(key)) fail.push(`${r.date}: duplicate "${r.en}"`);
  seen.add(key);
  for (const w of BANNED) if (`${r.hi} ${r.en}`.includes(w)) fail.push(`${r.date}: banned word "${w}"`);
});

const noteText = [...src.matchAll(/note(?:Hi|En):\s*'([^']+)'/g)].map((m) => m[1]).join(' ');
for (const w of BANNED) if (noteText.includes(w)) fail.push(`note contains banned word "${w}"`);

const eka = rows.filter((r) => r.kind === 'ekadashi').map((r) => r.date);
for (let i = 1; i < eka.length; i++) {
  const gap = (Date.parse(eka[i]) - Date.parse(eka[i - 1])) / 86400000;
  if (gap < 11 || gap > 18) fail.push(`ekadashi gap ${gap}d between ${eka[i - 1]} and ${eka[i]}`);
}

if (fail.length) {
  console.error('✗ ujjain-parv.ts:\n  ' + fail.join('\n  '));
  process.exit(1);
}
console.log(`✓ ujjain-parv — ${rows.length} rows · ${eka.length} ekadashi · ${rows[0].date} → ${rows[rows.length - 1].date}`);
