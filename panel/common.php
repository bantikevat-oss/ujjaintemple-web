<?php
/**
 * Shared bits for the logged-in panel pages (quotes.php, rates.php). Login itself happens on
 * index.php (e-mail OTP, password fallback); these pages only check the session.
 */

declare(strict_types=1);
$cfg = require __DIR__ . '/config.php';

/** Live: public_html/panel + public_html/api. Local checkout: panel/ + public/api. */
function panel_api(string $file): string {
  return is_file(__DIR__ . '/../api/' . $file) ? __DIR__ . '/../api/' . $file : __DIR__ . '/../public/api/' . $file;
}

session_set_cookie_params(['lifetime' => $cfg['session_ttl'], 'httponly' => true, 'samesite' => 'Lax', 'secure' => true]);
session_start();
header('Cache-Control: no-store');

function h($s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function csrf(): string { if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16)); return $_SESSION['csrf']; }
function is_auth(): bool { return !empty($_SESSION['auth']) && ($_SESSION['auth_time'] ?? 0) > time() - 3600 * 6; }
function check_csrf(): void {
  if (!hash_equals($_SESSION['csrf'] ?? '', (string)($_POST['csrf'] ?? ''))) { http_response_code(419); exit('Bad CSRF token — refresh and retry.'); }
}

if (!is_auth()) { header('Location: ./'); exit; }   // log in on index.php first

function panel_nav(string $here): string {
  $out = '';
  foreach (['./' => 'Images', 'quotes.php' => 'Quotes', 'lagat.php' => 'Lagat', 'rates.php' => 'Rates'] as $href => $label) {
    $out .= '<a href="' . $href . '"' . ($href === $here ? ' class="on"' : '') . '>' . $label . '</a>';
  }
  return $out . '<a href="./?do=logout">Logout</a>';
}
