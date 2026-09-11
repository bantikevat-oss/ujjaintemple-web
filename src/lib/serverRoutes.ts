/**
 * Paths that exist on the SERVER but not in the React route table.
 *
 * 🪤 The news section (`/hi/simhastha-2028-news/…`) is PHP-SSR off MySQL, so
 * vite-react-ssg never builds a route for it. A `<Link>` to such a path hands the
 * click to React Router, which finds nothing and renders the 404 page — while a
 * manual reload of the exact same URL is served by PHP and works. That is the
 * "first click 404s, refresh fixes it" bug reported 2026-09-11.
 *
 * Anything listed here must therefore be reached with a plain `<a href>` (full
 * page load), never with `<Link>`. `NotFound` also uses this list as a safety net
 * so that a link we missed self-corrects instead of showing a dead end.
 */
const SERVER_ROUTE_PREFIXES = [
  '/hi/simhastha-2028-news/',
  '/panel/',
];

export function isServerRoute(path: string): boolean {
  const p = path.split('?')[0].split('#')[0];
  return SERVER_ROUTE_PREFIXES.some((prefix) => p === prefix.replace(/\/$/, '') || p.startsWith(prefix));
}
