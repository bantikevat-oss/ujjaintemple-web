/**
 * Service worker for the Simhastha 2028 Guide app (/app/ and /hi/app/).
 *
 * 🔴 Scope is "/" (the Hindi app lives under /hi/), but this worker must NEVER change
 * how the website behaves. Every request outside the app is left alone — no
 * respondWith, straight to the network as if no worker existed. A worker that cached
 * website HTML would keep serving old pages after a deploy (the stale-chunk white
 * screen the 09-12 deploy was careful to avoid).
 *
 * Only registered from app screens (src/app/pwa.ts); website visitors never get it.
 * Bump VERSION when this file's caching rules change.
 */
const VERSION = 'v1';
const PAGES = `ujt-app-pages-${VERSION}`;
const ASSETS = `ujt-app-assets-${VERSION}`;
const FEED = '/hi/simhastha-2028-news/feed.xml';

const TABS = ['', 'news/', 'calendar/', 'mandirs/', '84-mahadev/', 'plan/'];
const APP_PAGES = [...TABS.map((t) => `/hi/app/${t}`), ...TABS.map((t) => `/app/${t}`)];

const isAppPage = (p) => /^\/(hi\/)?app\//.test(p);
const isAsset = (p) => p.startsWith('/assets/') || p.startsWith('/images/mandirs/thumbs/') || p === '/favicon.svg' || p.startsWith('/images/app/');

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const pages = await caches.open(PAGES);
      const assets = await caches.open(ASSETS);
      // One page failing must not abort the install (addAll is all-or-nothing).
      await Promise.allSettled(
        APP_PAGES.map(async (url) => {
          const res = await fetch(url, { cache: 'no-cache' });
          if (!res.ok) return;
          await pages.put(url, res.clone());
          // Pull every hashed script/style the page references, so each tab opens offline.
          const html = await res.text();
          const refs = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
          await Promise.allSettled(refs.map(async (r) => {
            if (await assets.match(r)) return;
            const a = await fetch(r);
            if (a.ok) await assets.put(r, a);
          }));
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([PAGES, ASSETS]);
      for (const key of await caches.keys()) {
        if (key.startsWith('ujt-app-') && !keep.has(key)) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'warm' || !Array.isArray(event.data.urls)) return;
  event.waitUntil(
    caches.open(ASSETS).then((c) =>
      Promise.allSettled(
        event.data.urls
          .filter((u) => typeof u === 'string' && u.startsWith(`${self.location.origin}/assets/`))
          .map(async (u) => { if (!(await c.match(u))) await c.add(u); }),
      ),
    ),
  );
});

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res.ok) await cache.put(request, res.clone());
    return res;
  } catch {
    const hit = (await cache.match(request, { ignoreSearch: true })) || (fallbackUrl && (await cache.match(fallbackUrl)));
    return hit || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSETS);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) await cache.put(request, res.clone());
  return res;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate' && isAppPage(url.pathname)) {
    const home = url.pathname.startsWith('/hi/') ? '/hi/app/' : '/app/';
    event.respondWith(networkFirst(request, PAGES, home));
    return;
  }
  if (url.pathname === FEED) {
    event.respondWith(networkFirst(request, PAGES));
    return;
  }
  // Hashed assets are immutable, so cache-first is safe — but only once an app page
  // is in control, so the website's own asset loading is never routed through here.
  if (isAsset(url.pathname) && event.clientId) {
    event.respondWith(
      (async () => {
        const client = await self.clients.get(event.clientId);
        if (client && isAppPage(new URL(client.url).pathname)) return cacheFirst(request);
        return fetch(request);
      })(),
    );
  }
  // Everything else: untouched.
});

/* ── Push ────────────────────────────────────────────────────────────────────
   Pushes carry no payload. The server only signals "a new article is live"; the
   title comes from the feed, so a notification can never be stale or forged. */
const decode = (s) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

self.addEventListener('push', (event) => {
  event.waitUntil(
    (async () => {
      let title = 'सिंहस्थ 2028 — नया समाचार';
      let body = 'UjjainTemple.com पर नया लेख प्रकाशित हुआ है।';
      let link = '/hi/simhastha-2028-news/';
      try {
        const res = await fetch(FEED, { cache: 'no-store' });
        const xml = await res.text();
        const item = xml.match(/<item>([\s\S]*?)<\/item>/);
        if (item) {
          const t = item[1].match(/<title>([\s\S]*?)<\/title>/);
          const l = item[1].match(/<link>([\s\S]*?)<\/link>/);
          if (t) { body = decode(t[1]).trim(); title = 'सिंहस्थ 2028 समाचार'; }
          if (l) {
            const u = new URL(decode(l[1]).trim());
            if (u.origin === self.location.origin) link = u.pathname;
          }
        }
        (await caches.open(PAGES)).put(FEED, new Response(xml, { headers: { 'Content-Type': 'application/rss+xml' } }));
      } catch {
        /* Offline at push time — the generic text still gets them to the section. */
      }
      await self.registration.showNotification(title, {
        body,
        icon: '/images/app/icon-192.png',
        badge: '/images/app/badge-96.png',
        tag: 'simhastha-news',
        data: { link },
        lang: 'hi',
      });
    })(),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = event.notification.data?.link || '/hi/app/news/';
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const existing = all.find((c) => new URL(c.url).origin === self.location.origin);
      if (existing) {
        await existing.focus();
        return existing.navigate(link);
      }
      return self.clients.openWindow(link);
    })(),
  );
});
