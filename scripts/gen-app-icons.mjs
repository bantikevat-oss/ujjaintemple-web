#!/usr/bin/env node
/**
 * gen-app-icons.mjs — PNG icons for the Simhastha 2028 Guide app (PWA manifest,
 * notifications, Play listing).
 *
 * Drawn from the site's own favicon mark (maroon + gold star) so the app reads as
 * UjjainTemple, not as a new brand. No Devanagari in the artwork: sharp/librsvg
 * does not shape conjuncts reliably, and a broken glyph on an app icon is worse
 * than no text.
 *
 * Run after changing the mark: node scripts/gen-app-icons.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = 'public/images/app';
mkdirSync(OUT, { recursive: true });

const STAR = 'M32 12 L40 24 H48 L40 32 L44 44 L32 38 L20 44 L24 32 L16 24 H24 Z';

/** `inset` shrinks the artwork toward the centre — maskable icons need an 80% safe zone. */
const icon = ({ rounded, inset }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="g" cx="50%" cy="38%" r="70%">
      <stop offset="0" stop-color="#A52A2A"/>
      <stop offset="1" stop-color="#5E1010"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="url(#g)"/>
  <g transform="translate(256 256) scale(${inset}) translate(-256 -256)">
    <circle cx="256" cy="196" r="118" fill="#C9A84C" opacity="0.12"/>
    <g transform="translate(96 36) scale(5)">
      <path d="${STAR}" fill="#C9A84C"/>
      <circle cx="32" cy="32" r="4" fill="#FBF5EC"/>
    </g>
    <text x="256" y="420" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
      font-size="112" font-weight="700" letter-spacing="4" fill="#FBF5EC">2028</text>
  </g>
</svg>`;

const badge = `
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 64 64">
  <path d="${STAR}" fill="#FFFFFF"/>
</svg>`;

const jobs = [
  ['icon-512.png', icon({ rounded: true, inset: 1 }), 512],
  ['icon-192.png', icon({ rounded: true, inset: 1 }), 192],
  ['icon-maskable-512.png', icon({ rounded: false, inset: 0.78 }), 512],
  ['play-icon-512.png', icon({ rounded: false, inset: 1 }), 512],
  ['badge-96.png', badge, 96],
];

for (const [name, svg, size] of jobs) {
  await sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toFile(`${OUT}/${name}`);
  console.log(`✓ ${OUT}/${name}`);
}
