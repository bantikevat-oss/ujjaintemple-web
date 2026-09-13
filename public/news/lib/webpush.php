<?php
if (!defined('UJT_NEWS')) { http_response_code(403); exit('Forbidden'); }

/**
 * Web Push (VAPID, RFC 8292) for the Simhastha 2028 Guide app — NO payload.
 *
 * A push only says "something new is live". The app's service worker then fetches
 * the section feed and writes the notification itself (public/app-sw.js). That means
 * no RFC 8291 payload encryption here, no Firebase account, and a notification that
 * can never carry a stale or forged title.
 *
 * Config (news-config.php, above the webroot — never in git):
 *   'push' => [
 *     'private_pem' => "-----BEGIN EC PRIVATE KEY-----\n...",   // scripts/vapid-keygen.php
 *     'subject'     => 'mailto:info@ujjaintemple.com',
 *     'dev_origins' => [],   // extra allowed Origins for api/push.php (local testing only)
 *   ],
 *
 * PHP 7.4 target — no 8.0 syntax.
 */

/** Push services a real browser subscription can point at. Anything else is refused:
 *  the broadcast POSTs to every stored endpoint, so an open list would be an SSRF. */
function ujt_push_endpoint_allowed($endpoint)
{
    if (!is_string($endpoint) || strlen($endpoint) > 600) return false;
    $u = parse_url($endpoint);
    if (!$u || ($u['scheme'] ?? '') !== 'https' || empty($u['host']) || isset($u['port']) || isset($u['user'])) return false;
    $h = strtolower($u['host']);
    return $h === 'fcm.googleapis.com'
        || $h === 'web.push.apple.com'
        || (bool) preg_match('/^updates(-[a-z0-9]+)?\.push\.services\.mozilla\.com$/', $h)
        || (bool) preg_match('/^[a-z0-9-]+\.notify\.windows\.com$/', $h);
}

function ujt_push_config()
{
    $c = ujt_news_config();
    $p = isset($c['push']) && is_array($c['push']) ? $c['push'] : null;
    if (!$p || empty($p['private_pem'])) return null;
    return $p + ['subject' => 'mailto:info@ujjaintemple.com', 'dev_origins' => []];
}

function ujt_b64url($bin)
{
    return rtrim(strtr(base64_encode($bin), '+/', '-_'), '=');
}

/** Uncompressed P-256 public point, base64url — the browser's applicationServerKey. */
function ujt_push_public_key($pem)
{
    static $memo = [];
    if (isset($memo[$pem])) return $memo[$pem];
    $key = openssl_pkey_get_private($pem);
    if (!$key) throw new RuntimeException('VAPID private key unreadable');
    $d = openssl_pkey_get_details($key);
    if (empty($d['ec']['x']) || empty($d['ec']['y'])) throw new RuntimeException('VAPID key is not EC');
    $x = str_pad($d['ec']['x'], 32, "\0", STR_PAD_LEFT);
    $y = str_pad($d['ec']['y'], 32, "\0", STR_PAD_LEFT);
    return $memo[$pem] = ujt_b64url("\x04" . $x . $y);
}

/** openssl_sign() returns a DER ECDSA signature; JWS ES256 wants raw r||s (64 bytes). */
function ujt_ecdsa_der_to_raw($der)
{
    $pos = 2;
    if (ord($der[1]) & 0x80) $pos += ord($der[1]) & 0x7f;
    $out = '';
    for ($i = 0; $i < 2; $i++) {
        if (ord($der[$pos]) !== 0x02) throw new RuntimeException('bad ECDSA signature');
        $len = ord($der[$pos + 1]);
        $int = ltrim(substr($der, $pos + 2, $len), "\0");
        $out .= str_pad($int, 32, "\0", STR_PAD_LEFT);
        $pos += 2 + $len;
    }
    return $out;
}

/** `Authorization: vapid t=…, k=…` for one push service origin. */
function ujt_vapid_authorization($endpoint, $cfg)
{
    $u   = parse_url($endpoint);
    $aud = 'https://' . strtolower($u['host']);
    $h   = ujt_b64url(json_encode(['typ' => 'JWT', 'alg' => 'ES256']));
    $p   = ujt_b64url(json_encode(['aud' => $aud, 'exp' => time() + 12 * 3600, 'sub' => $cfg['subject']], JSON_UNESCAPED_SLASHES));
    $sig = '';
    if (!openssl_sign("$h.$p", $sig, $cfg['private_pem'], OPENSSL_ALGO_SHA256)) {
        throw new RuntimeException('VAPID signing failed');
    }
    return 'vapid t=' . "$h.$p." . ujt_b64url(ujt_ecdsa_der_to_raw($sig)) . ', k=' . ujt_push_public_key($cfg['private_pem']);
}

/**
 * Tickle every subscriber. Returns counts; never throws to the caller.
 * 404/410 = the browser unsubscribed → row deleted. Other failures count up and the
 * row is dropped after 10 in a row, so a dead endpoint cannot slow every broadcast.
 */
function ujt_push_broadcast($budget_seconds = 25)
{
    $cfg = ujt_push_config();
    if (!$cfg) return ['sent' => 0, 'failed' => 0, 'pruned' => 0, 'note' => 'push not configured'];

    $rows  = ujt_all("SELECT id, endpoint FROM ujt_push_subscriptions WHERE kind = 'webpush' ORDER BY id");
    $start = microtime(true);
    $auth  = [];
    $ok = []; $bad = []; $gone = [];

    foreach (array_chunk($rows, 50) as $batch) {
        if (microtime(true) - $start > $budget_seconds) break;
        $mh = curl_multi_init();
        $handles = [];
        foreach ($batch as $r) {
            if (!ujt_push_endpoint_allowed($r['endpoint'])) { $gone[] = (int) $r['id']; continue; }
            $origin = strtolower(parse_url($r['endpoint'], PHP_URL_HOST));
            if (!isset($auth[$origin])) $auth[$origin] = ujt_vapid_authorization($r['endpoint'], $cfg);
            $ch = curl_init($r['endpoint']);
            curl_setopt_array($ch, [
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => '',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => false,
                CURLOPT_CONNECTTIMEOUT => 4,
                CURLOPT_TIMEOUT        => 8,
                CURLOPT_PROTOCOLS      => CURLPROTO_HTTPS,
                CURLOPT_HTTPHEADER     => [
                    'Authorization: ' . $auth[$origin],
                    'TTL: 86400',
                    'Urgency: normal',
                    'Content-Length: 0',
                ],
            ]);
            curl_multi_add_handle($mh, $ch);
            $handles[(int) $r['id']] = $ch;
        }
        do {
            $status = curl_multi_exec($mh, $running);
            if ($running) curl_multi_select($mh, 1.0);
        } while ($running && $status === CURLM_OK);

        foreach ($handles as $id => $ch) {
            $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($code >= 200 && $code < 300)      $ok[] = $id;
            elseif ($code === 404 || $code === 410) $gone[] = $id;
            else {
                $bad[] = $id;
                error_log(sprintf('[ujt-push] %d from subscription %d: %s', $code, $id, substr((string) curl_multi_getcontent($ch), 0, 200)));
            }
            curl_multi_remove_handle($mh, $ch);
            // Needed on the server's PHP 7.4; a deprecated no-op from 8.5 on.
            if (PHP_VERSION_ID < 80000) curl_close($ch);
        }
        curl_multi_close($mh);
    }

    $in = function ($ids) { return implode(',', array_map('intval', $ids)); };
    if ($ok)   ujt_q('UPDATE ujt_push_subscriptions SET last_ok_at = NOW(), fail_count = 0 WHERE id IN (' . $in($ok) . ')');
    if ($bad)  ujt_q('UPDATE ujt_push_subscriptions SET fail_count = fail_count + 1 WHERE id IN (' . $in($bad) . ')');
    if ($gone) ujt_q('DELETE FROM ujt_push_subscriptions WHERE id IN (' . $in($gone) . ')');
    ujt_q("DELETE FROM ujt_push_subscriptions WHERE kind = 'webpush' AND fail_count >= 10");

    return ['sent' => count($ok), 'failed' => count($bad), 'pruned' => count($gone), 'total' => count($rows)];
}

/* ── Android app: Firebase Cloud Messaging HTTP v1 ─────────────────────────────
   Same approach as SugamPuja's lib/jyotish/fcm.ts: talk to FCM directly with a
   service account, no Expo push service in between. Unlike Web Push, an FCM message
   carries its title — the app shell shows it without fetching anything.

   Config: 'push' => ['fcm_service_account' => '/home/<user>/domains/ujjaintemple.com/fcm-service-account.json']
   (a path ABOVE the webroot; the JSON is a Firebase service-account key, never in git). */

function ujt_fcm_token_valid($t)
{
    return is_string($t) && strlen($t) >= 100 && strlen($t) <= 400 && (bool) preg_match('/^[A-Za-z0-9_:\-]+$/', $t);
}

function ujt_fcm_service_account()
{
    $c    = ujt_news_config();
    $path = isset($c['push']['fcm_service_account']) ? (string) $c['push']['fcm_service_account'] : '';
    if ($path === '' || !is_file($path)) return null;
    $sa = json_decode((string) file_get_contents($path), true);
    return (is_array($sa) && !empty($sa['client_email']) && !empty($sa['private_key']) && !empty($sa['project_id'])) ? $sa : null;
}

/** OAuth2 access token for the FCM scope (JWT bearer grant, RS256). */
function ujt_fcm_access_token($sa)
{
    $now = time();
    $h = ujt_b64url(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $p = ujt_b64url(json_encode([
        'iss'   => $sa['client_email'],
        'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
        'aud'   => 'https://oauth2.googleapis.com/token',
        'iat'   => $now,
        'exp'   => $now + 3600,
    ], JSON_UNESCAPED_SLASHES));
    $sig = '';
    if (!openssl_sign("$h.$p", $sig, $sa['private_key'], OPENSSL_ALGO_SHA256)) {
        throw new RuntimeException('FCM service account signing failed');
    }
    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion'  => "$h.$p." . ujt_b64url($sig),
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
    ]);
    $body = (string) curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if (PHP_VERSION_ID < 80000) curl_close($ch);
    $d = json_decode($body, true);
    if ($code !== 200 || empty($d['access_token'])) {
        throw new RuntimeException('FCM token exchange failed: HTTP ' . $code . ' ' . substr($body, 0, 200));
    }
    return $d['access_token'];
}

/**
 * Send one notification per registered Android install.
 * $article = ['title' => …, 'url' => absolute article URL]
 * 404 (UNREGISTERED) deletes the row. Any other failure counts up; 10 in a row drops it.
 * A 400 is deliberately NOT treated as "token gone": FCM also answers 400 for a bad
 * payload, and pruning on it would wipe every subscriber after one coding mistake.
 */
function ujt_fcm_broadcast($article, $budget_seconds = 25)
{
    $sa = ujt_fcm_service_account();
    if (!$sa) return ['sent' => 0, 'failed' => 0, 'pruned' => 0, 'note' => 'fcm not configured'];
    $rows = ujt_all("SELECT id, endpoint FROM ujt_push_subscriptions WHERE kind = 'fcm' ORDER BY id");
    if (!$rows) return ['sent' => 0, 'failed' => 0, 'pruned' => 0, 'total' => 0];

    $access = ujt_fcm_access_token($sa);
    $url    = 'https://fcm.googleapis.com/v1/projects/' . rawurlencode($sa['project_id']) . '/messages:send';
    $path   = (string) parse_url((string) $article['url'], PHP_URL_PATH);
    $start  = microtime(true);
    $ok = []; $bad = []; $gone = [];

    foreach (array_chunk($rows, 50) as $batch) {
        if (microtime(true) - $start > $budget_seconds) break;
        $mh = curl_multi_init();
        $handles = [];
        foreach ($batch as $r) {
            $msg = ['message' => [
                'token'        => $r['endpoint'],
                'notification' => ['title' => 'सिंहस्थ 2028 समाचार', 'body' => ujt_clip($article['title'], 180)],
                'data'         => ['link' => $path ?: '/hi/app/news/'],
                'android'      => [
                    'priority'     => 'normal',
                    'ttl'          => '86400s',
                    'notification' => ['channel_id' => 'simhastha-news', 'color' => '#8B1A1A', 'tag' => 'simhastha-news'],
                ],
            ]];
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CONNECTTIMEOUT => 4,
                CURLOPT_TIMEOUT        => 8,
                CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $access, 'Content-Type: application/json; charset=utf-8'],
            ]);
            curl_multi_add_handle($mh, $ch);
            $handles[(int) $r['id']] = $ch;
        }
        do {
            $status = curl_multi_exec($mh, $running);
            if ($running) curl_multi_select($mh, 1.0);
        } while ($running && $status === CURLM_OK);

        foreach ($handles as $id => $ch) {
            $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($code === 200)      $ok[] = $id;
            elseif ($code === 404)  $gone[] = $id;
            else {
                $bad[] = $id;
                error_log(sprintf('[ujt-fcm] %d from subscription %d: %s', $code, $id, substr((string) curl_multi_getcontent($ch), 0, 300)));
            }
            curl_multi_remove_handle($mh, $ch);
            if (PHP_VERSION_ID < 80000) curl_close($ch);
        }
        curl_multi_close($mh);
    }

    $in = function ($ids) { return implode(',', array_map('intval', $ids)); };
    if ($ok)   ujt_q('UPDATE ujt_push_subscriptions SET last_ok_at = NOW(), fail_count = 0 WHERE id IN (' . $in($ok) . ')');
    if ($bad)  ujt_q('UPDATE ujt_push_subscriptions SET fail_count = fail_count + 1 WHERE id IN (' . $in($bad) . ')');
    if ($gone) ujt_q('DELETE FROM ujt_push_subscriptions WHERE id IN (' . $in($gone) . ')');
    ujt_q("DELETE FROM ujt_push_subscriptions WHERE kind = 'fcm' AND fail_count >= 10");

    return ['sent' => count($ok), 'failed' => count($bad), 'pruned' => count($gone), 'total' => count($rows)];
}

/** Everything a new article triggers. Each channel fails on its own. */
function ujt_push_notify_all($article, $budget_seconds = 25)
{
    $out = [];
    foreach (['webpush' => function () use ($budget_seconds) { return ujt_push_broadcast($budget_seconds); },
              'fcm'     => function () use ($article, $budget_seconds) { return ujt_fcm_broadcast($article, $budget_seconds); }] as $k => $fn) {
        try {
            $out[$k] = $fn();
        } catch (Throwable $e) {
            $out[$k] = ['error' => $e->getMessage()];
        }
    }
    return $out;
}
