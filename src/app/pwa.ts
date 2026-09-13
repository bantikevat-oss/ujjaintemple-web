/**
 * Service worker registration + notifications for the app screens.
 *
 * Two notification paths, one API for the screens:
 *
 *  - In a browser / installed PWA: standard Web Push with VAPID and NO payload — the
 *    server only says "something new" and the service worker fetches the news feed
 *    itself to write the notification (see public/app-sw.js).
 *  - Inside the Android app (Expo shell, ujjaintemple-app/App.tsx): an Android
 *    WebView has no Web Push, so the same calls go over the native bridge and the
 *    app registers an FCM token instead.
 *
 * Registration happens only from /app/ screens, so ordinary website visitors never get
 * a service worker. The worker itself ignores every non-app request.
 */

const SW_URL = '/app-sw.js';
const PUSH_API = '/api/push.php';

export type PushState = 'unsupported' | 'denied' | 'on' | 'off';

type NativeInfo = { platform: string; version: string; push: boolean };
type NativeReply = { id: number; state: PushState | 'error' };

declare global {
  interface Window {
    __UJT_NATIVE__?: NativeInfo;
    ReactNativeWebView?: { postMessage(message: string): void };
    __ujtNativeReply?: (reply: NativeReply) => void;
  }
}

const native = (): NativeInfo | null =>
  typeof window !== 'undefined' && window.ReactNativeWebView && window.__UJT_NATIVE__ ? window.__UJT_NATIVE__ : null;

let nativeSeq = 0;
const pending = new Map<number, (state: PushState | 'error') => void>();

function askNative(type: 'push:get' | 'push:enable' | 'push:disable'): Promise<PushState | 'error'> {
  const bridge = window.ReactNativeWebView;
  if (!bridge) return Promise.resolve('unsupported');
  window.__ujtNativeReply = (r) => {
    pending.get(r.id)?.(r.state);
    pending.delete(r.id);
  };
  const id = ++nativeSeq;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    bridge.postMessage(JSON.stringify({ id, type }));
    // The permission dialog can sit open a while; give up only after a minute.
    window.setTimeout(() => {
      if (pending.delete(id)) resolve('error');
    }, 60000);
  });
}

const swSupported = () =>
  typeof window !== 'undefined' && 'serviceWorker' in navigator && window.isSecureContext;

export function registerAppSW(): void {
  if (!swSupported()) return;
  navigator.serviceWorker
    .register(SW_URL, { scope: '/' })
    .then(() => navigator.serviceWorker.ready)
    .then((reg) => {
      // The first visit's JS/CSS was fetched before the worker existed, so hand it the
      // list — otherwise the very first offline launch would have HTML but no scripts.
      const urls = performance
        .getEntriesByType('resource')
        .map((e) => e.name)
        .filter((u) => u.startsWith(`${location.origin}/assets/`));
      reg.active?.postMessage({ type: 'warm', urls });
    })
    .catch(() => {
      /* No worker = no offline, the screens still work online. */
    });
}

const webPushSupported = () => swSupported() && 'PushManager' in window && 'Notification' in window;

export async function getPushState(): Promise<PushState> {
  const app = native();
  if (app) {
    if (!app.push) return 'unsupported';
    const s = await askNative('push:get');
    return s === 'error' ? 'off' : s;
  }
  if (!webPushSupported()) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  const reg = await navigator.serviceWorker.getRegistration('/');
  const sub = await reg?.pushManager.getSubscription();
  return sub ? 'on' : 'off';
}

function b64urlToBuffer(s: string): ArrayBuffer {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const raw = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes.buffer;
}

export async function enablePush(): Promise<PushState | 'error'> {
  if (native()) return askNative('push:enable');
  if (!webPushSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return permission === 'denied' ? 'denied' : 'off';

    registerAppSW();
    const reg = await navigator.serviceWorker.ready;
    const keyRes = await fetch(`${PUSH_API}?action=key`);
    if (!keyRes.ok) return 'error';
    const { data } = (await keyRes.json()) as { data?: { key?: string } };
    if (!data?.key) return 'error';

    const sub =
      (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64urlToBuffer(data.key) }));

    const res = await fetch(`${PUSH_API}?action=subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: sub.endpoint }),
    });
    return res.ok ? 'on' : 'error';
  } catch {
    return 'error';
  }
}

export async function disablePush(): Promise<PushState | 'error'> {
  if (native()) return askNative('push:disable');
  try {
    const reg = await navigator.serviceWorker.getRegistration('/');
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      await fetch(`${PUSH_API}?action=unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
      await sub.unsubscribe();
    }
    return 'off';
  } catch {
    return 'error';
  }
}
