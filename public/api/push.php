<?php
/**
 * Notification subscriptions for the Ujjain Guide app.
 *
 * Browser / PWA (Web Push, VAPID):
 *   GET  ?action=key              → { key }  (VAPID public key, base64url)
 *   POST ?action=subscribe        { endpoint }
 *   POST ?action=unsubscribe      { endpoint }
 *
 * Android app (FCM, ujjaintemple-app/src/push.ts):
 *   POST ?action=subscribe-fcm    { token }
 *   POST ?action=unsubscribe-fcm  { token }
 *
 * Stores the endpoint URL or FCM token only — no device, account or personal data.
 */
require_once __DIR__ . '/../news/boot.php';
require_once __DIR__ . '/../news/lib/webpush.php';

ujt_json_error_mode();
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$cfg    = ujt_push_config();

if ($action === 'key' && $method === 'GET') {
    if (!$cfg) ujt_json_err('Notifications are not available yet', 503);
    ujt_json_ok(['key' => ujt_push_public_key($cfg['private_pem'])]);
}

if ($method !== 'POST') ujt_json_err('POST only', 405);

$in = ujt_body_json();

/** Hashed IP + day: enough to cap one source at 20 new subscriptions a day, useless for anything else. */
function ujt_push_rate_ok($hash)
{
    $ipDay = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . date('Y-m-d'));
    $n = ujt_one('SELECT COUNT(*) AS n FROM ujt_push_subscriptions WHERE ip_day_hash = ?', [$ipDay]);
    if ($n && (int) $n['n'] >= 20 && !ujt_one('SELECT id FROM ujt_push_subscriptions WHERE endpoint_hash = ?', [$hash])) {
        ujt_json_err('Too many requests', 429);
    }
    return $ipDay;
}

// ── Android app (FCM) ──
// A native app sends no Origin header, so these cannot use the same-origin check
// below. That is acceptable: a token is only ever sent TO Google's fixed FCM API
// (never used as a URL), so a forged row can at worst cost one failed send before
// it is pruned — it cannot make this server call anywhere else.
if ($action === 'subscribe-fcm' || $action === 'unsubscribe-fcm') {
    $token = (string) ($in['token'] ?? '');
    if (!ujt_fcm_token_valid($token)) ujt_json_err('Invalid token', 422);
    $hash = hash('sha256', 'fcm|' . $token);
    if ($action === 'unsubscribe-fcm') {
        ujt_q('DELETE FROM ujt_push_subscriptions WHERE endpoint_hash = ?', [$hash]);
        ujt_json_ok(['subscribed' => false]);
    }
    $ipDay = ujt_push_rate_ok($hash);
    ujt_q(
        "INSERT INTO ujt_push_subscriptions (kind, endpoint_hash, endpoint, ip_day_hash) VALUES ('fcm', ?, ?, ?)
         ON DUPLICATE KEY UPDATE fail_count = 0",
        [$hash, $token, $ipDay]
    );
    ujt_json_ok(['subscribed' => true]);
}

// ── Browser / PWA (Web Push) ──
if (!$cfg) ujt_json_err('Notifications are not available yet', 503);

// Only the app's own pages may write here. Browsers always send Origin on a POST fetch.
$origin  = rtrim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''), '/');
$allowed = array_merge([rtrim(ujt_news_config()['site']['base_url'], '/')], (array) $cfg['dev_origins']);
if (!in_array($origin, $allowed, true)) ujt_json_err('Forbidden', 403);

$endpoint = (string) ($in['endpoint'] ?? '');
if (!ujt_push_endpoint_allowed($endpoint)) ujt_json_err('Invalid endpoint', 422);
$hash = hash('sha256', $endpoint);

if ($action === 'subscribe') {
    $ipDay = ujt_push_rate_ok($hash);
    ujt_q(
        "INSERT INTO ujt_push_subscriptions (kind, endpoint_hash, endpoint, ip_day_hash) VALUES ('webpush', ?, ?, ?)
         ON DUPLICATE KEY UPDATE fail_count = 0",
        [$hash, $endpoint, $ipDay]
    );
    ujt_json_ok(['subscribed' => true]);
}

if ($action === 'unsubscribe') {
    ujt_q('DELETE FROM ujt_push_subscriptions WHERE endpoint_hash = ?', [$hash]);
    ujt_json_ok(['subscribed' => false]);
}

ujt_json_err('Unknown action', 400);
