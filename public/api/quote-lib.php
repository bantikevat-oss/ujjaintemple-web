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

// ── Presentation helpers, shared by the customer page /q/ and the panel's "Package text" (2026-10-28).
// Whatever the team typed is tidied here, so the page, the PDF and the WhatsApp text all agree.

/** Hotel meal plans as the trade writes them. */
/** Contact on every quote — one number for calls and WhatsApp (Aman 2026-10-28; same as src/lib/site.ts). */
const UT_QUOTE_CALL = '+91 89890 06759';
const UT_QUOTE_WA   = '+91 89890 06759';

const UT_QUOTE_MEALS = [
  'EP'  => ['hi' => 'EP — केवल कमरा',                 'en' => 'EP (Room only)'],
  'CP'  => ['hi' => 'CP — कमरा + नाश्ता',              'en' => 'CP (Room + breakfast)'],
  'MAP' => ['hi' => 'MAP — कमरा + नाश्ता + एक समय भोजन', 'en' => 'MAP (Room + breakfast + one meal)'],
  'AP'  => ['hi' => 'AP — कमरा + तीनों समय भोजन',        'en' => 'AP (Room + all meals)'],
];

function ut_q_date($iso, $hi) {
  $ts = strtotime($iso);
  if (!$ts) return $iso;
  $wdHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  $mHi = ['', 'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  if ($hi) return $wdHi[(int)date('w', $ts)] . ', ' . (int)date('j', $ts) . ' ' . $mHi[(int)date('n', $ts)] . ' ' . date('Y', $ts);
  return date('l, j F Y', $ts);
}
/** "29 अक्टूबर 2026" / "29 Oct 2026" — for the compact header fields. */
function ut_q_short($iso, $hi) {
  $ts = strtotime($iso);
  if (!$ts) return $iso;
  $mHi = ['', 'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  return $hi ? (int)date('j', $ts) . ' ' . $mHi[(int)date('n', $ts)] . ' ' . date('Y', $ts) : date('j M Y', $ts);
}
/** +919876543210 → +91 98765 43210 (other countries as typed). */
function ut_q_phone($p) {
  $p = (string)$p;
  return preg_match('/^\+91(\d{5})(\d{5})$/', $p, $m) ? '+91 ' . $m[1] . ' ' . $m[2] : $p;
}
/** Tidy one line the team typed: trim, single spaces, capital first letter for English. */
function ut_q_clean($s) {
  $s = trim(preg_replace('/\s+/u', ' ', (string)$s));
  return $s === '' ? '' : mb_strtoupper(mb_substr($s, 0, 1)) . mb_substr($s, 1);
}
/** Free text → list of tidy lines (bullet marks the team typed are dropped; we draw our own). */
function ut_q_lines($s) {
  $out = [];
  foreach (preg_split('/\r?\n/', (string)$s) as $l) {
    $l = ut_q_clean(preg_replace('/^\s*(?:[-*•·–>]|\d+[.)])\s*/u', '', $l));
    if ($l !== '') $out[] = $l;
  }
  return $out;
}
/** [days, nights] from the plan's own dates — "2 days" can never be written over a 3-date plan. */
function ut_quote_span(array $q) {
  $d = $q['days'] ?? [];
  if (!$d) return [0, 0];
  $a = strtotime($d[0]['date']); $b = strtotime($d[count($d) - 1]['date']);
  $n = ($a && $b) ? (int) round(($b - $a) / 86400) + 1 : count($d);
  return [$n, max(0, $n - 1)];
}
/** "2 दिन / 1 रात" · "2 Days / 1 Night" */
function ut_quote_duration(array $q, $hi) {
  list($d, $n) = ut_quote_span($q);
  if ($hi) return $d . ' दिन' . ($n ? ' / ' . $n . ' रात' : '');
  return $d . ' Day' . ($d > 1 ? 's' : '') . ($n ? ' / ' . $n . ' Night' . ($n > 1 ? 's' : '') : '');
}
/** "26–27 December 2026" style range. */
function ut_quote_range(array $q, $hi) {
  $d = $q['days'] ?? [];
  if (!$d) return '';
  $a = $d[0]['date']; $b = $d[count($d) - 1]['date'];
  if ($a === $b) return ut_q_short($a, $hi);
  $sa = ut_q_short($a, $hi); $sb = ut_q_short($b, $hi);
  if (substr($a, 0, 7) === substr($b, 0, 7)) return (int)substr($a, 8) . '–' . $sb;   // same month: 26–27 Dec 2026
  return $sa . ' – ' . $sb;
}
/** Child ages "11, 5" → [11, 5]. */
function ut_quote_ages(array $q) {
  preg_match_all('/\d{1,2}/', (string)($q['child_ages'] ?? ''), $m);
  return array_map('intval', $m[0]);
}
/** One line for the summary: "2 वयस्क · 2 बच्चे (11 व 5 वर्ष) · कुल 4". Old quotes only had pax. */
function ut_quote_guests(array $q, $hi) {
  $ad = (int)($q['adults'] ?? 0); $ch = (int)($q['children'] ?? 0);
  if (!$ad && !$ch) {
    $p = (int)($q['pax'] ?? 0);
    return $p ? ($hi ? $p . ' यात्री' : $p . ' traveller' . ($p > 1 ? 's' : '')) : '';
  }
  $ages = ut_quote_ages($q);
  $agesTxt = $ages ? ' (' . implode($hi ? ' व ' : ' & ', $ages) . ($hi ? ' वर्ष' : ' yrs') . ')' : '';
  $parts = [];
  if ($ad) $parts[] = $hi ? $ad . ' वयस्क' : $ad . ' adult' . ($ad > 1 ? 's' : '');
  if ($ch) $parts[] = ($hi ? $ch . ' बच्चे' : $ch . ' child' . ($ch > 1 ? 'ren' : '')) . $agesTxt;
  if ($ad && $ch) $parts[] = ($hi ? 'कुल ' : 'total ') . ($ad + $ch);
  return implode(' · ', $parts);
}
function ut_quote_meal(array $q, $hi) {
  $k = (string)($q['meal_plan'] ?? '');
  return $k !== '' && isset(UT_QUOTE_MEALS[$k]) ? UT_QUOTE_MEALS[$k][$hi ? 'hi' : 'en'] : '';
}
/**
 * A day's free text → parts: ['h' => 'Ujjain local darshan'] for a line ending in ":" (a sub-heading,
 * like "UJJAIN LOCAL DARSHAN:"), ['li' => …] for every other line. Bullet marks typed by the team
 * are dropped; emoji the team typed stay.
 */
function ut_quote_parts($s) {
  $out = [];
  foreach (ut_q_lines($s) as $l) {
    if (preg_match('/^(.{2,80}?)\s*:\s*$/u', $l, $m)) $out[] = ['h' => $m[1]];
    else $out[] = ['li' => $l];
  }
  return $out;
}
/** Latin text in capitals (Hindi has no case; left as is). */
function ut_quote_caps($s) { return preg_match('/\p{Devanagari}/u', $s) ? $s : mb_strtoupper($s); }

/**
 * The whole quote as one WhatsApp message, in the layout the team already sends by hand
 * (Aman's sample, 2026-10-28): header, dates, guests, car/room/meals, day blocks, price,
 * inclusions, link, contact, thanks. Pure Hindi or pure English, per the quote's language.
 */
function ut_quote_package_text(array $q) {
  $hi = ($q['locale'] ?? 'hi') !== 'en';
  $t = function ($a, $b) use ($hi) { return $hi ? $a : $b; };
  $bar = '━━━━━━━━━━━━━━━━━━';
  $bullet = function ($l) { return preg_match('/^[\p{L}\p{N}]/u', $l) ? '• ' . $l : $l; };   // keep a typed emoji as the bullet
  $L = [];
  $L[] = '🙏 ' . ut_quote_caps(ut_q_clean($q['title'])) . ' 🙏';
  $L[] = '✨ ' . ut_quote_duration($q, $hi) . (!empty($q['tagline']) ? ' | ' . ut_q_clean($q['tagline']) : '') . ' ✨';
  $L[] = '';
  $L[] = '📅 ' . $t('यात्रा की तिथि', 'Travel Dates') . ': ' . ut_quote_range($q, $hi);
  $ad = (int)($q['adults'] ?? 0); $ch = (int)($q['children'] ?? 0);
  if ($ad || $ch) {
    $L[] = '';
    $L[] = '👨‍👩‍👧‍👦 ' . $t('यात्री विवरण', 'GUEST DETAILS');
    if ($ad) $L[] = '• ' . $t('वयस्क', 'Adults') . ': ' . $ad;
    if ($ch) { $ages = ut_quote_ages($q); $L[] = '• ' . $t('बच्चे', 'Children') . ': ' . $ch . ($ages ? ' (' . implode($t(' व ', ' & '), $ages) . $t(' वर्ष', ' years') . ')' : ''); }
    $L[] = '• ' . $t('कुल यात्री', 'Total Guests') . ': ' . ($ad + $ch);
  } elseif (!empty($q['pax'])) {
    $L[] = '';
    $L[] = '👨‍👩‍👧‍👦 ' . $t('यात्री', 'Guests') . ': ' . (int)$q['pax'];
  }
  $kit = [];
  if (!empty($q['vehicle'])) $kit[] = '🚘 ' . $t('गाड़ी', 'Vehicle') . ': ' . ut_q_clean($q['vehicle']);
  if (!empty($q['room']))    $kit[] = '🏨 ' . $t('कमरा', 'Room') . ': ' . ut_q_clean($q['room']);
  if ($meal = ut_quote_meal($q, $hi)) $kit[] = '🍽️ ' . $t('भोजन योजना', 'Meal Plan') . ': ' . $meal;
  if ($kit) { $L[] = ''; foreach ($kit as $k) $L[] = $k; }
  foreach ($q['days'] ?? [] as $i => $d) {
    $L[] = ''; $L[] = $bar;
    $ts = strtotime($d['date']);
    $dm = $hi ? (int)date('j', $ts) . ' ' . ['', 'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'][(int)date('n', $ts)] : date('j F', $ts);
    $L[] = '📍 ' . $t('दिन ' . ($i + 1), 'DAY ' . ($i + 1)) . ' – ' . ut_quote_caps($dm);
    $L[] = ut_quote_caps(ut_q_clean($d['title']));
    $parts = ut_quote_parts($d['details'] ?? '');
    if ($parts) $L[] = '';
    $inList = false;
    foreach ($parts as $p) {
      if (isset($p['h'])) { $L[] = ''; $L[] = '🙏 ' . ut_quote_caps($p['h']) . ':'; $inList = true; continue; }
      $line = $bullet($p['li']);
      if ($inList && strpos($line, '• ') !== 0) { $L[] = ''; $inList = false; }   // an emoji line after a heading's list starts a new paragraph
      $L[] = $line;
    }
  }
  $L[] = ''; $L[] = $bar;
  $L[] = '💰 ' . $t('कुल पैकेज राशि', 'TOTAL PACKAGE COST') . ': ' . ut_quote_inr($q['total']) . '/-';
  if ((int)$q['advance'] > 0) $L[] = '🔒 ' . $t('बुकिंग के लिए एडवांस', 'Advance to confirm') . ': ' . ut_quote_inr($q['advance']) . '/-';
  $in = $out = [];
  foreach ($q['items'] ?? [] as $k => $v) {
    $lab = UT_QUOTE_ITEMS[$k][$hi ? 'hi' : 'en'] ?? $k;
    if ($v === 'in') $in[] = $lab; elseif ($v === 'out') $out[] = $lab;
  }
  foreach ($q['extra_in'] ?? [] as $x) if (($x = ut_q_clean($x)) !== '') $in[] = $x;
  foreach ($q['extra_out'] ?? [] as $x) if (($x = ut_q_clean($x)) !== '') $out[] = $x;
  if ($in)  { $L[] = ''; $L[] = '✅ ' . $t('पैकेज में शामिल', 'PACKAGE INCLUDES') . ':';  foreach ($in as $x)  $L[] = '• ' . $x; }
  if ($out) { $L[] = ''; $L[] = '❌ ' . $t('शामिल नहीं', 'NOT INCLUDED') . ':';      foreach ($out as $x) $L[] = '• ' . $x; }
  if ($notes = ut_q_lines($q['notes'] ?? '')) { $L[] = ''; $L[] = '📝 ' . $t('टिप्पणी', 'Note') . ':'; foreach ($notes as $x) $L[] = $bullet($x); }
  $L[] = ''; $L[] = $bar;
  $L[] = '📄 ' . $t('पूरा कोटेशन व PDF', 'Full quote & PDF') . ': ' . ut_quote_url($q);
  if (!empty($q['valid_until'])) $L[] = '⏳ ' . $t('मान्य', 'Valid till') . ': ' . ut_q_short($q['valid_until'], $hi);
  $L[] = '';
  $L[] = '🌐 ' . $t('वेबसाइट', 'Website') . ': www.ujjaintemple.com';
  $L[] = '';
  $L[] = '📞 ' . $t('बुकिंग व अन्य जानकारी के लिए', 'FOR BOOKINGS & OTHER ENQUIRIES');
  $L[] = $t('कॉल', 'Call') . ': ' . UT_QUOTE_CALL . ' · WhatsApp: ' . UT_QUOTE_WA;
  $L[] = '';
  $L[] = $t('🙏 UjjainTemple.com चुनने के लिए धन्यवाद!', '🙏 Thank you for choosing Ujjain Temple!');
  $L[] = $t('आपकी यात्रा आरामदायक और यादगार बने — यही हमारा प्रयास है।', 'We look forward to making your journey comfortable and memorable.');
  return implode("\n", $L);
}
