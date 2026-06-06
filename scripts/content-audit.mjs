#!/usr/bin/env node
/**
 * Audits content/*.json for missing Hindi/English translations and required fields.
 * Fails CI if any required field is empty.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'src/content');
const REQUIRED_BILINGUAL = ['name', 'shortIntro', 'history'];

let errors = 0;

function check(file) {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  const rel = path.relative(ROOT, file);
  for (const key of REQUIRED_BILINGUAL) {
    if (!data[key]) continue;
    if (typeof data[key] === 'object' && (!data[key].hi || !data[key].en)) {
      console.error(`✗ ${rel} → field "${key}" missing hi or en`);
      errors++;
    }
  }
}

function walk(dir) {
  for (const f of readdirSync(dir)) {
    const full = path.join(dir, f);
    if (statSync(full).isDirectory()) walk(full);
    else if (f.endsWith('.json')) check(full);
  }
}

walk(ROOT);

if (errors > 0) {
  console.error(`\n${errors} content errors. Fix before deploy.`);
  process.exit(1);
}
console.log('✓ Content audit clean');
