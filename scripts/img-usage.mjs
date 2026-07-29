// Generates panel/usage-map.json — maps each /images/* file to friendly "used where"
// labels, and lists unused images. Run via `node scripts/img-usage.mjs`.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'public/images');
const exts = ['.jpg','.jpeg','.png','.webp','.svg','.avif','.gif','.ico'];
const walk = (d, out=[]) => { for (const f of readdirSync(d)) { const p=join(d,f); statSync(p).isDirectory()?walk(p,out):out.push(p); } return out; };

// Friendly label for a source file that references an image
function label(relFile) {
  const f = relFile.replace(/\\/g,'/');
  if (f.includes('data/mandirs')) return 'Temple pages (Mandir)';
  if (f.includes('data/packages')) return 'Tour packages';
  if (f.includes('data/articles') || f.includes('pages/articles')) return 'Articles / Blog';
  if (f.includes('Simhastha') || f.includes('simhastha')) return 'Simhastha 2028 page';
  if (f.includes('CabBooking') || f.includes('cab')) return 'Cab Booking page';
  if (f.includes('Hotel')) return 'Hotels page';
  if (f.includes('Tour')) return 'Tour & Travel pages';
  if (f.includes('Home') || f.includes('home')) return 'Home page';
  if (f.includes('Puja') || f.includes('puja')) return 'Puja pages';
  if (f.includes('Header') || f.includes('Footer') || f.includes('Layout') || f.includes('lib/') || f.includes('schemas') || f.includes('seo')) return 'Site-wide (logo / SEO / meta)';
  const base = f.split('/').pop().replace(/\.(tsx?|jsx?|json|html|mjs)$/,'');
  return base + ' page';
}

const imgs = walk(IMG).filter(f=>exts.includes(extname(f).toLowerCase())).map(f=>relative(IMG,f).replace(/\\/g,'/'));
const srcFiles = walk(join(ROOT,'src')).concat(walk(join(ROOT,'public')))
  .filter(f=>/\.(tsx?|jsx?|json|html|mjs|webmanifest)$/i.test(f) && !f.replace(/\\/g,'/').includes('/public/images/'));
const corpus = srcFiles.map(f=>({f:relative(ROOT,f), t:readFileSync(f,'utf8')}));

const used = {}, unused = [];
for (const img of imgs) {
  const base = img.split('/').pop();
  const hits = corpus.filter(c => c.t.includes(base) || c.t.includes('images/'+img));
  if (hits.length) used[img] = [...new Set(hits.map(c=>label(c.f)))].sort();
  else unused.push(img);
}
const out = { generated: new Date().toISOString().slice(0,10), total: imgs.length, usedCount: Object.keys(used).length, unusedCount: unused.length, used, unused: unused.sort() };
writeFileSync(join(ROOT,'panel/usage-map.json'), JSON.stringify(out,null,2));
console.log(`usage-map.json written: ${out.usedCount} used, ${out.unusedCount} unused (of ${out.total})`);
