// Fails the build if the cab fares in src/data/rates.ts and public/api/cab-rates.php differ.
// The site shows the first; the server charges against the second (2026-10-27).
import { readFileSync } from 'node:fs';

const ts = readFileSync(new URL('../src/data/rates.ts', import.meta.url), 'utf8');
const php = readFileSync(new URL('../public/api/cab-rates.php', import.meta.url), 'utf8');

const fromTs = {};
for (const m of ts.matchAll(/'([a-z-]+)':\s*\{\s*id:[\s\S]*?fares:\s*\{([^}]*)\}/g)) {
  fromTs[m[1]] = Object.fromEntries([...m[2].matchAll(/(\w+):\s*(\d+|null)/g)].map((x) => [x[1], x[2]]));
}
const fromPhp = {};
for (const m of php.matchAll(/'([a-z-]+)'\s*=>\s*\[([^\]]*)\]/g)) {
  fromPhp[m[1]] = Object.fromEntries([...m[2].matchAll(/'(\w+)'\s*=>\s*(\d+|null)/g)].map((x) => [x[1], x[2]]));
}


const routes = Object.keys(fromTs).sort();
const bad = routes.filter((r) => JSON.stringify(fromTs[r]) !== JSON.stringify(fromPhp[r]))
  .concat(Object.keys(fromPhp).filter((r) => !fromTs[r]));
if (!routes.length || bad.length) {
  console.error('✗ cab rates differ between src/data/rates.ts and public/api/cab-rates.php:', bad.length ? bad : 'none parsed');
  console.error('  ts :', JSON.stringify(fromTs));
  console.error('  php:', JSON.stringify(fromPhp));
  process.exit(1);
}
console.log(`✓ cab rates in sync (${routes.length} routes)`);

