import type { Mandir } from '../lib/types';

const modules = import.meta.glob<{ default: Mandir }>('../content/mandirs/*.json', { eager: true });

export const mandirs: Mandir[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => {
    if (a.slug === 'mahakaleshwar') return -1;
    if (b.slug === 'mahakaleshwar') return 1;
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return a.name.en.localeCompare(b.name.en);
  });

export const mandirBySlug = new Map(mandirs.map((m) => [m.slug, m]));

export const featuredMandirs = mandirs.filter((m) => m.isFeatured);

const NEARBY_TARGET = 4;

/**
 * Temples to link to from a temple page.
 *
 * 🔴 Found 2026-09-11: `nearbyMandirs` is hand-curated and **114 of the 183
 * records have it empty**, so nearly two-thirds of the biggest page class on this
 * site rendered no onward temple links at all. On a site whose clicks come almost
 * entirely from the long tail of individual temples, that is the link graph
 * failing exactly where it is worth the most — and nothing surfaces it, because
 * the section simply does not render and the page still looks complete.
 *
 * The curated list always wins where it exists. Where it does not, the fallback
 * is geographic first — same `locationArea` is what "nearby" honestly means, and
 * it is the set a visitor can actually walk between — then topped up by deity so
 * a temple in a thinly-covered area still links somewhere relevant rather than
 * nowhere. Featured temples come first within each tier, which also means these
 * links point at pages worth reaching.
 */
export function getNearbyMandirs(mandir: Mandir): Mandir[] {
  const curated = mandir.nearbyMandirs
    .map((slug) => mandirBySlug.get(slug))
    .filter((m): m is Mandir => Boolean(m));
  if (curated.length) return curated;

  const chosen: Mandir[] = [];
  const take = (pool: Mandir[]) => {
    for (const m of pool) {
      if (chosen.length >= NEARBY_TARGET) return;
      if (m.slug === mandir.slug || chosen.some((c) => c.slug === m.slug)) continue;
      chosen.push(m);
    }
  };
  // `mandirs` is already sorted featured-first, so these stay in that order.
  take(mandirs.filter((m) => m.locationArea === mandir.locationArea));
  take(mandirs.filter((m) => m.templeType === mandir.templeType));
  return chosen;
}
