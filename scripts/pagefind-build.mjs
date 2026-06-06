#!/usr/bin/env node
/**
 * Runs pagefind static index after vite-react-ssg build.
 */
import { execSync } from 'node:child_process';

try {
  execSync('npx pagefind --site dist --output-path dist/pagefind', { stdio: 'inherit' });
  console.log('✓ pagefind index built');
} catch (e) {
  console.warn('⚠ pagefind index failed:', e.message);
}
