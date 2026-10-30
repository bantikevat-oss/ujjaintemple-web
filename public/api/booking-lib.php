<?php
/**
 * Shared helpers for the cab booking + Razorpay advance flow (2026-10-27).
 * PHP 7.4 (the Hostinger box) — no match(), no str_contains(), no named arguments.
 *
 * Keys live ONLY in the server config above public_html (never in git):
 *   ~/domains/ujjaintemple.com/news-config.php  →  'razorpay' => ['key_id' => 'rzp_live_…',
 *                                                                 'key_secret' => '…']
 * Without that block the endpoints answer 503 and the site falls back to WhatsApp booking.
 */

const UT_ADVANCE_PAISE = 50000;   // ₹500 flat advance (Aman, 2026-10-27). Balance to the driver.
const UT_BOOKINGS_CSV  = __DIR__ . '/bookings.csv';
const UT_BOOKINGS_HEAD = ['event_at', 'status', 'booking_id', 'order_id', 'payment_id', 'name', 'phone',
  'route', 'vehicle', 'fare', 'advance', 'trip', 'travel_date', 'pickup_time', 'pickup_note', 'locale', 'source', 'ip'];

date_default_timezone_set('Asia/Kolkata');   // box is UTC; every stamp here is read as IST
ini_set('display_errors', '0');
error_reporting(E_ALL);

function ut_json($code, $data) {
  http_response_code($code);
  header('Content-Type: application/json');
  echo json_encode($data);
  exit;
}

function ut_config() {
  $path = __DIR__ . '/../../news-config.php';
  if (!is_readable($path)) return null;
  $cfg = require $path;
  return is_array($cfg) ? $cfg : null;
}

function ut_rzp() {
  $cfg = ut_config();
  $r = $cfg['razorpay'] ?? null;
  if (!$r || empty($r['key_id']) || empty($r['key_secret'])) return null;
  return $r;
}

// Characters, not bytes: a Hindi trip line (3 bytes a letter) must never be cut mid-letter (2026-10-30).
function ut_clean($s, $max = 200) { return trim(strip_tags(mb_substr((string)$s, 0, $max, 'UTF-8'))); }

/** Append one event row; the file is append-only (a booking's later events are new rows). */
function ut_book_append(array $row) {
  $fp = @fopen(UT_BOOKINGS_CSV, 'a');
  if (!$fp) return false;
  flock($fp, LOCK_EX);
  if (filesize(UT_BOOKINGS_CSV) === 0) fputcsv($fp, UT_BOOKINGS_HEAD, ',', '"', '\\');
  $out = [];
  foreach (UT_BOOKINGS_HEAD as $k) $out[] = (string)($row[$k] ?? '');
  fputcsv($fp, $out, ',', '"', '\\');
  flock($fp, LOCK_UN);
  fclose($fp);
  return true;
}

/** All rows for one order id, oldest first. */
function ut_book_rows_for_order($orderId) {
  $rows = [];
  $fp = @fopen(UT_BOOKINGS_CSV, 'r');
  if (!$fp) return $rows;
  $head = fgetcsv($fp, 0, ',', '"', '\\');
  while (($r = fgetcsv($fp, 0, ',', '"', '\\')) !== false) {
    if (count($r) !== count($head)) continue;
    $a = array_combine($head, $r);
    if ($a['order_id'] === $orderId) $rows[] = $a;
  }
  fclose($fp);
  return $rows;
}

function ut_over_cap($key, $cap) {
  $f = sys_get_temp_dir() . '/ujt_book_' . hash('sha256', $key) . '.cnt';
  $n = (int) @file_get_contents($f);
  @file_put_contents($f, (string)($n + 1), LOCK_EX);
  return $n >= $cap;
}

/** Razorpay REST call. Returns [httpCode, decodedBody|null]. */
function ut_rzp_call($method, $path, $keyId, $keySecret, $body = null) {
  $ch = curl_init('https://api.razorpay.com/v1' . $path);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_USERPWD        => $keyId . ':' . $keySecret,
    CURLOPT_CUSTOMREQUEST  => $method,
    CURLOPT_TIMEOUT        => 20,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
  ]);
  if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
  $res  = curl_exec($ch);
  $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  if ($code === 0) {          // network blip (seen once on 2026-10-27): one retry before giving up
    usleep(400000);
    $res  = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  }
  curl_close($ch);
  return [$code, $res === false ? null : json_decode($res, true)];
}

function ut_h($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

function ut_booking_mail($subject, array $b, $extraLine = '', $extraHtml = '') {
  require_once __DIR__ . '/smtp.php';
  $rows = [
    'Booking ID' => $b['booking_id'], 'Naam' => $b['name'], 'Mobile' => $b['phone'],
    'Trip' => $b['trip'], 'Gaadi' => $b['vehicle'], 'Kiraya' => '₹' . $b['fare'],
    'Advance' => '₹' . $b['advance'], 'Tareekh' => $b['travel_date'] . ' ' . $b['pickup_time'],
    'Pickup note' => $b['pickup_note'], 'Page' => $b['source'], 'Razorpay order' => $b['order_id'],
    'Payment id' => $b['payment_id'] ?? '',
  ];
  $html = '<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
  foreach ($rows as $k => $v) {
    if ((string)$v === '') continue;
    $html .= '<tr><td style="color:#666">' . ut_h($k) . '</td><td><b>' . ut_h($v) . '</b></td></tr>';
  }
  $html .= '</table>';
  if ($extraLine !== '') $html = '<p style="font-family:Arial,sans-serif">' . ut_h($extraLine) . '</p>' . $html;
  if ($extraHtml !== '') $html .= $extraHtml;   // trusted, built by followup-lib.php
  return ujt_smtp_send($subject, $html, null, true);
}
