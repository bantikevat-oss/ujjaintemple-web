// Generates 600px WebP card thumbnails for every temple photo.
//
// Why: the /mandirs/ hub renders 183 cards at ~390px wide, but the source photos are
// sized for the detail-page hero (1200px). Without thumbs the hub pulls ~13 MB of
// images and LCP blows past 10s. Thumbs bring it to ~3 MB.
//
// MandirCard points at /images/mandirs/thumbs/<base>.webp and falls back to the
// original photo, then to the SVG placeholder, so a missing thumb degrades safely.
//
// Run after adding or replacing any file in public/images/mandirs/:
//   node scripts/gen-thumbs.mjs

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'public/images/mandirs';
const OUT = path.join(SRC, 'thumbs');
const WIDTH = 600;
const HEIGHT = 400;
const QUALITY = 75;

fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

let made = 0;
let skipped = 0;
let bytes = 0;
const failed = [];

for (const file of files) {
  const base = file.replace(/\.[^.]+$/, '');
  const dest = path.join(OUT, `${base}.webp`);

  // Skip if the thumb is newer than its source.
  if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= fs.statSync(path.join(SRC, file)).mtimeMs) {
    skipped++;
    bytes += fs.statSync(dest).size;
    continue;
  }

  try {
    const buf = await sharp(path.join(SRC, file))
      .rotate()
      .resize({ width: WIDTH, height: HEIGHT, fit: 'cover', position: 'attention', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();
    fs.writeFileSync(dest, buf);
    made++;
    bytes += buf.length;
  } catch {
    // Some legacy files carry an image extension but hold HTML (failed downloads).
    // They are reported, not thrown on — the card falls back to the placeholder.
    failed.push(file);
  }
}

console.log(`✓ thumbs: ${made} generated, ${skipped} up-to-date — ${(bytes / 1048576).toFixed(2)} MB total`);
if (failed.length) console.warn(`  ⚠ not valid images, skipped: ${failed.join(', ')}`);
