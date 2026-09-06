<?php
if (!defined('UJT_NEWS')) { http_response_code(403); exit('Forbidden'); }

/**
 * Session + CSRF, shaped for BNA's `phpsession` transport profile.
 *
 * BNA logs in once (JSON {username,password}), scrapes EVERY Set-Cookie header off
 * the response, and replays them plus `X-CSRF-Token` on each write. So login must
 * return 200 + a session cookie + `data.csrf`, and writes must accept exactly that.
 * See news-agent/public/api/services/tenant_session.php.
 */

function ujt_session_start()
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name('ujt_news_sess');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'secure'   => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function ujt_login($username, $password)
{
    ujt_session_start();

    // Cheap per-session throttle. A real lockout table is overkill for one agent
    // account, but an unthrottled endpoint is an invitation.
    $tries = (int) ($_SESSION['login_tries'] ?? 0);
    if ($tries >= 8) return ['ok' => false, 'error' => 'Too many attempts. Try later.'];

    $u = ujt_one(
        'SELECT id, username, password_hash, role FROM ujt_news_users WHERE username = ? LIMIT 1',
        [(string) $username]
    );
    if (!$u || !password_verify((string) $password, $u['password_hash'])) {
        $_SESSION['login_tries'] = $tries + 1;
        usleep(300000);
        return ['ok' => false, 'error' => 'Invalid credentials'];
    }
    if (!in_array($u['role'], ['admin', 'editor'], true)) {
        return ['ok' => false, 'error' => 'User may not publish'];
    }

    session_regenerate_id(true);
    unset($_SESSION['login_tries']);
    $_SESSION['uid']   = (int) $u['id'];
    $_SESSION['uname'] = $u['username'];
    $_SESSION['role']  = $u['role'];
    $_SESSION['csrf']  = bin2hex(random_bytes(24));

    ujt_q('UPDATE ujt_news_users SET last_login_at = NOW() WHERE id = ?', [$u['id']]);

    return ['ok' => true, 'csrf' => $_SESSION['csrf'], 'user' => [
        'id' => (int) $u['id'], 'username' => $u['username'], 'role' => $u['role'],
    ]];
}

/** Guard for every write endpoint. Exits with JSON on failure. */
function ujt_require_auth()
{
    ujt_session_start();
    if (empty($_SESSION['uid'])) ujt_json_err('Not authenticated', 401);

    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $have = $_SESSION['csrf'] ?? '';
    if (!$have || !is_string($sent) || !hash_equals($have, $sent)) {
        ujt_json_err('CSRF token mismatch', 403);
    }
    return ['id' => (int) $_SESSION['uid'], 'username' => $_SESSION['uname'], 'role' => $_SESSION['role']];
}
