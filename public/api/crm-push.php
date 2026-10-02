<?php
/**
 * ByteFlow Lead CRM — drop-in push client for PHP sites.
 *
 * For: ujjaintemple.com, panditg.in, byteflowtech.in — anything whose form
 * handler is a PHP file.
 *
 * Install:
 *   1. Copy this file next to the form handler (e.g. public_html/api/crm-push.php).
 *   2. Put the credentials in the site's existing server-only config, OUTSIDE
 *      the document root, under a 'crm' key:
 *
 *        'crm' => [
 *          'url'    => 'https://lead.byteflowtech.in/api/ingest',
 *          'source' => 'ujjaintemple',
 *          'key'    => '…',       // X-CRM-Key,  from /sources
 *          'secret' => '…',       // HMAC secret, from /sources
 *          'spool'  => __DIR__ . '/crm-spool',   // writable, outside public_html
 *        ],
 *
 *   3. In the form handler, AFTER the lead has been stored locally, call:
 *
 *        require_once __DIR__ . '/crm-push.php';
 *        crm_push($cfg['crm'], [
 *          'name' => $name, 'phone' => $phone, 'email' => $email,
 *          'service' => $service, 'message' => $message,
 *          'source_page' => $source, 'channel' => 'form',
 *          'created_at' => date('Y-m-d H:i:s'),
 *        ]);
 *
 * 🔴 Order matters. Store the lead locally FIRST and push SECOND, exactly the
 *    way panditg.in already writes to disk before it mails. The CRM being down
 *    must never be able to lose a lead that the site itself could have kept.
 *
 * 🔴 This call must never make the visitor wait or see an error. Timeouts are
 *    short, every failure is swallowed, and anything that did not go through is
 *    written to the spool for crm_push_drain() to retry.
 */

declare(strict_types=1);

if (!function_exists('crm_push')) {

/**
 * Fire a lead at the CRM. Returns true if the CRM accepted it right now;
 * false means it was spooled (or could not be spooled, which is logged).
 */
function crm_push(array $cfg, array $fields): bool
{
    if (empty($cfg['url']) || empty($cfg['source']) || empty($cfg['key'])) {
        error_log('[crm-push] not configured, skipping');
        return false;
    }

    // `created_at` is what makes retries idempotent on the CRM side — without
    // it a redelivered lead looks like a new one. Always send the site's own
    // timestamp, never let the CRM default it.
    $fields['created_at'] = $fields['created_at'] ?? date('Y-m-d H:i:s');

    $body = json_encode($fields, JSON_UNESCAPED_UNICODE);
    if ($body === false) { error_log('[crm-push] could not encode payload'); return false; }

    $r = crm_push_send($cfg, $body);
    if ($r === true) return true;

    // 🔴 Only TRANSIENT failures are worth queueing. crm_push_send() returns null
    // for a permanent rejection (bad key, malformed payload) — spooling those meant
    // a payload the CRM will never accept was retried twenty times and kept the
    // queue dirty. Found 2026-10-02 when an auth probe landed in the spool.
    if ($r === null) return false;

    crm_spool_write($cfg, $body);
    return false;
}

/**
 * One HTTP attempt. No retries here — the spool is the retry.
 * @return bool|null  true = accepted · false = transient, worth spooling ·
 *                    null = permanently rejected, must NOT be spooled
 */
function crm_push_send(array $cfg, string $body): ?bool
{
    $headers = [
        'Content-Type: application/json',
        'X-CRM-Source: ' . $cfg['source'],
        'X-CRM-Key: ' . $cfg['key'],
    ];
    if (!empty($cfg['secret'])) {
        $headers[] = 'X-CRM-Sign: ' . hash_hmac('sha256', $body, $cfg['secret']);
    }

    $ch = curl_init($cfg['url']);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $body,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_RETURNTRANSFER => true,
        // Deliberately tight: a visitor is waiting on the other side of this.
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_TIMEOUT        => 6,
    ]);
    $res  = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    // No curl_close(): it has been a no-op since PHP 8.0 and emits a Deprecated
    // notice on 8.5+ — which a host with display_errors on would print into the
    // response body. That is exactly how UjjainTemple's lead JSON got corrupted.

    if ($code >= 200 && $code < 300) return true;

    // 4xx other than 429 means the payload or the key is wrong — retrying will
    // not fix it, so log loudly rather than spooling forever.
    if ($code >= 400 && $code < 500 && $code !== 429) {
        error_log('[crm-push] rejected ' . $code . ': ' . substr((string)$res, 0, 200));
        return null;   // permanent — see crm_push()
    }

    error_log('[crm-push] transient failure ' . $code . ' ' . substr($err ?: (string)$res, 0, 120));
    return false;
}

/** Append a failed payload to the spool. One JSON object per line. */
function crm_spool_write(array $cfg, string $body): void
{
    $dir = $cfg['spool'] ?? null;
    if (!$dir) return;
    if (!is_dir($dir)) @mkdir($dir, 0700, true);
    $f = rtrim($dir, '/') . '/pending.jsonl';
    @file_put_contents($f, $body . "\n", FILE_APPEND | LOCK_EX);
}

/**
 * Retry everything in the spool. Call from cron, e.g. every 10 minutes:
 *
 *   php -r 'require "crm-push.php"; $c=require "../site-config.php";
 *           echo crm_push_drain($c["crm"]), " sent\n";'
 *
 * Rewrites the file with whatever still failed, so a permanently-bad row does
 * not block the rest — it is dropped after 20 attempts and logged.
 */
function crm_push_drain(array $cfg): int
{
    $dir = $cfg['spool'] ?? null;
    if (!$dir) return 0;
    $f = rtrim($dir, '/') . '/pending.jsonl';
    if (!is_readable($f)) return 0;

    $lines = file($f, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    if (!$lines) return 0;

    $sent = 0;
    $keep = [];
    foreach ($lines as $line) {
        $row = json_decode($line, true);
        if (!is_array($row)) continue;                  // unparseable, drop
        $tries = (int)($row['_tries'] ?? 0);
        if ($tries >= 20) {
            error_log('[crm-push] giving up on a spooled lead after 20 tries: ' . substr($line, 0, 160));
            continue;
        }
        unset($row['_tries']);
        $body = json_encode($row, JSON_UNESCAPED_UNICODE);
        $r = $body === false ? null : crm_push_send($cfg, $body);
        if ($r === true) { $sent++; continue; }
        if ($r === null) continue;            // permanently rejected — drop, do not re-queue
        $row['_tries'] = $tries + 1;
        $keep[] = json_encode($row, JSON_UNESCAPED_UNICODE);
    }

    @file_put_contents($f, $keep ? implode("\n", $keep) . "\n" : '', LOCK_EX);
    return $sent;
}

}
