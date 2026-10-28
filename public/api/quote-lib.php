<?php
/**
 * Custom trip quotes (Aman, 2026-10-28): the team builds a multi-day package in /panel/quotes.php,
 * sends the customer a link (/q/?k=<token>), and the customer pays the advance there.
 * PHP 7.4 (the Hostinger box) — no match(), no str_contains(), no named arguments.
 *
 * One JSON file per quote, above public_html: ~/domains/ujjaintemple.com/ut-quotes/UTQ-1001.json.
 * Payment rides the cab-booking rails: quote-order.php appends an ORDER_CREATED row to bookings.csv
 * with booking_id = the quote id, and the existing booking-verify.php marks it PAID. A quote's paid
 * state is therefore read from bookings.csv, never stored twice.
 */

require_once __DIR__ . '/booking-lib.php';

/** Every line a quote must answer "included or not" for — an unanswered hotel line is a dispute later. */
const UT_QUOTE_ITEMS = [
  'toll'    => ['hi' => 'टोल टैक्स',                'en' => 'Toll tax'],
  'parking' => ['hi' => 'पार्किंग',                  'en' => 'Parking'],
  'driver'  => ['hi' => 'ड्राइवर का भत्ता व रात का खर्च', 'en' => 'Driver allowance and night charges'],
  'fuel'    => ['hi' => 'ईंधन',                     'en' => 'Fuel'],
  'hotel'   => ['hi' => 'होटल में ठहरना',             'en' => 'Hotel stay'],
  'meals'   => ['hi' => 'भोजन',                     'en' => 'Meals'],
  'puja'    => ['hi' => 'पूजा व सामग्री',             'en' => 'Puja and samagri'],
  'tickets' => ['hi' => 'प्रवेश / दर्शन टिकट',         'en' => 'Entry / darshan tickets'],
];

function ut_quote_dir() {
  $d = __DIR__ . '/../../ut-quotes';
  if (!is_dir($d)) @mkdir($d, 0700, true);
  return $d;
}

function ut_quote_valid_id($id) { return (bool) preg_match('/^UTQ-\d{4,6}$/', (string)$id); }

function ut_quote_load($id) {
  if (!ut_quote_valid_id($id)) return null;
  $q = json_decode((string) @file_get_contents(ut_quote_dir() . '/' . $id . '.json'), true);
  return is_array($q) ? $q : null;
}

function ut_quote_save(array $q) {
  if (!ut_quote_valid_id($q['id'] ?? '')) return false;
  $q['updated_at'] = date('Y-m-d H:i:s');
  return @file_put_contents(ut_quote_dir() . '/' . $q['id'] . '.json', json_encode($q, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX) !== false;
}

/** Next id: UTQ-1001, UTQ-1002 … (a lock file keeps two admins from getting the same number). */
function ut_quote_next_id() {
  $dir = ut_quote_dir();
  $lock = fopen($dir . '/.seq', 'c+');
  flock($lock, LOCK_EX);
  $n = (int) stream_get_contents($lock);
  if ($n < 1000) $n = 1000;
  $n++;
  ftruncate($lock, 0); rewind($lock); fwrite($lock, (string)$n);
  flock($lock, LOCK_UN); fclose($lock);
  return 'UTQ-' . $n;
}

/** The customer link carries an unguessable token, not the sequential id. */
function ut_quote_by_token($token) {
  if (!preg_match('/^[a-f0-9]{20}$/', (string)$token)) return null;
  foreach (glob(ut_quote_dir() . '/UTQ-*.json') ?: [] as $f) {
    $q = json_decode((string) @file_get_contents($f), true);
    if (is_array($q) && isset($q['token']) && hash_equals($q['token'], $token)) return $q;
  }
  return null;
}

function ut_quote_all() {
  $out = [];
  foreach (glob(ut_quote_dir() . '/UTQ-*.json') ?: [] as $f) {
    $q = json_decode((string) @file_get_contents($f), true);
    if (is_array($q)) $out[] = $q;
  }
  usort($out, function ($a, $b) { return strcmp($b['created_at'] ?? '', $a['created_at'] ?? ''); });
  return $out;
}

/** booking_id => latest status, from the shared bookings.csv. */
function ut_quote_payments() {
  $st = [];
  $fp = @fopen(UT_BOOKINGS_CSV, 'r');
  if (!$fp) return $st;
  $head = fgetcsv($fp, 0, ',', '"', '\\');
  while (($r = fgetcsv($fp, 0, ',', '"', '\\')) !== false) {
    if (!$head || count($r) !== count($head)) continue;
    $a = array_combine($head, $r);
    if (strpos($a['booking_id'], 'UTQ-') !== 0) continue;
    if (($st[$a['booking_id']] ?? '') !== 'PAID') $st[$a['booking_id']] = $a['status'];
  }
  fclose($fp);
  return $st;
}

/** open · paid · expired · cancelled */
function ut_quote_state(array $q, $payments = null) {
  if ($payments === null) $payments = ut_quote_payments();
  if (($payments[$q['id']] ?? '') === 'PAID') return 'paid';
  if (($q['status'] ?? '') === 'cancelled') return 'cancelled';
  if (($q['valid_until'] ?? '') !== '' && $q['valid_until'] < date('Y-m-d')) return 'expired';
  return 'open';
}

function ut_quote_inr($n) {
  $n = (int)$n;
  $s = (string)$n;
  if (strlen($s) > 3) {   // Indian grouping: 13,500 · 1,25,000
    $last = substr($s, -3);
    $rest = substr($s, 0, -3);
    $rest = preg_replace('/\B(?=(\d{2})+(?!\d))/', ',', $rest);
    $s = $rest . ',' . $last;
  }
  return '₹' . $s;
}

function ut_quote_url(array $q) { return 'https://ujjaintemple.com/q/?k=' . $q['token']; }
