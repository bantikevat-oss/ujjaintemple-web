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

export function getNearbyMandirs(mandir: Mandir): Mandir[] {
  return mandir.nearbyMandirs
    .map((slug) => mandirBySlug.get(slug))
    .filter((m): m is Mandir => Boolean(m));
}
