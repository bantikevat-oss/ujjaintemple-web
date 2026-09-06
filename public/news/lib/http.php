<?php
if (!defined('UJT_NEWS')) { http_response_code(403); exit('Forbidden'); }

/** Emit JSON and stop. */
function ujt_json($data, $status = 200)
{
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * BNA treats a body carrying `error` (or success:false) as a failure regardless of
 * status, so the two must always agree — see tenant_session.php::bna_tenant_request_authed.
 */
function ujt_json_ok($data = [])   { ujt_json(['success' => true,  'data' => $data]); }
function ujt_json_err($msg, $code) { ujt_json(['success' => false, 'error' => $msg], $code); }

/** Non-JSON fatal (used before we know the caller wants JSON). */
function ujt_fail($status, $msg)
{
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: text/plain; charset=utf-8');
    }
    exit($msg);
}

/** Decoded JSON request body, or []. */
function ujt_body_json()
{
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) return [];
    $d = json_decode($raw, true);
    return is_array($d) ? $d : [];
}

function ujt_e($s) { return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

/** Trim to a byte-safe length without splitting a UTF-8 sequence. */
function ujt_clip($s, $len)
{
    $s = trim(preg_replace('/\s+/u', ' ', (string) $s));
    return mb_substr($s, 0, $len, 'UTF-8');
}

/**
 * Install once from any JSON endpoint. A PHP fatal that escapes as an HTML warning
 * page is worse than an error here: BNA json_decodes the body, gets null, and
 * records a meaningless "HTTP 200 from articles endpoint" failure.
 */
function ujt_json_error_mode()
{
    ini_set('display_errors', '0');
    set_exception_handler(function ($e) {
        error_log('[ujt-news] ' . $e->getMessage());
        if (!headers_sent()) { http_response_code(500); header('Content-Type: application/json; charset=utf-8'); }
        echo json_encode(['success' => false, 'error' => 'Internal error'], JSON_UNESCAPED_UNICODE);
    });
    // Deliberately NOT promoting warnings/notices/deprecations to exceptions: a
    // deprecation is not a reason to fail a publish. (PHP 7.4 is the target runtime
    // but a newer local PHP deprecates e.g. imagedestroy(), which briefly turned a
    // perfectly good upload into a 500 here.) Fatals are still caught below.
    set_error_handler(function ($no, $str, $file, $line) {
        error_log(sprintf('[ujt-news] PHP %d: %s at %s:%d', $no, $str, $file, $line));
        return true;
    }, E_ALL & ~E_ERROR & ~E_PARSE & ~E_CORE_ERROR & ~E_COMPILE_ERROR);
    register_shutdown_function(function () {
        $e = error_get_last();
        if ($e && in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
            error_log('[ujt-news] fatal: ' . $e['message']);
            if (!headers_sent()) { http_response_code(500); header('Content-Type: application/json; charset=utf-8'); }
            echo json_encode(['success' => false, 'error' => 'Internal error'], JSON_UNESCAPED_UNICODE);
        }
    });
}
