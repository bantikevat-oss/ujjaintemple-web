<?php
/**
 * BNA login endpoint (phpsession profile).
 * Tenant config: login_endpoint = /api/news-auth.php?action=login
 *
 * BNA posts JSON {username,password}, then scrapes every Set-Cookie off the
 * response and replays them plus X-CSRF-Token on writes.
 */
require_once __DIR__ . '/../news/boot.php';
require_once __DIR__ . '/../news/lib/auth.php';

ujt_json_error_mode();
header('X-Robots-Tag: noindex, nofollow');

if (($_GET['action'] ?? 'login') !== 'login') ujt_json_err('Unknown action', 404);
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    ujt_json_err('POST only', 405);

$in = ujt_body_json();
if (!$in) $in = $_POST; // tolerate form-encoded

$username = trim((string) ($in['username'] ?? $in['email'] ?? ''));
$password = (string) ($in['password'] ?? '');
if ($username === '' || $password === '') ujt_json_err('username and password required', 400);

$r = ujt_login($username, $password);
if (empty($r['ok'])) ujt_json_err($r['error'], 401);

ujt_json_ok(['csrf' => $r['csrf'], 'user' => $r['user']]);
