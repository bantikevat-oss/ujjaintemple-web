<?php
/**
 * Mobile OTP for the cab fare gate (Aman, 2026-10-28: "pehle naam + number lo, OTP verify karo, phir rate dikhao").
 * PHP 7.4 (the Hostinger box) — no match(), no str_contains(), no named arguments.
 *
 *   POST action=send   phone           → SMS a 4-digit code      → {success, skip?}
 *   POST action=verify phone, otp      → check it                 → {success}
 *
 * SMS goes through BulkSMS India on a DLT-registered template. The block lives ONLY in the server config
 * above public_html (never in git):
 *   ~/domains/ujjaintemple.com/news-config.php → 'sms' => ['username','apikey','sender','peid','templateid','template']
 * 'template' is the exact DLT text with {OTP} where the code goes — DLT drops any SMS whose wording differs.
 * No block, a non-Indian number, or a provider failure → {success:true, skip:true}: the visitor still sees
 * fares and the lead is marked "not verified". The gate exists to collect the lead, never to lose it.
 */

require __DIR__ . '/booking-lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') ut_json(405, ['success' => false]);

const UT_OTP_TTL       = 600;   // code valid 10 min
const UT_OTP_TRIES     = 5;     // wrong guesses before the code dies
const UT_OTP_GAP       = 30;    // seconds between two sends to one number
const UT_OTP_PER_PHONE = 3;     // sends per number per 30 min
const UT_OTP_PER_IP    = 10;    // sends per IP per hour (SMS costs money — stop pumping)

$action = (string)($_POST['action'] ?? '');
$raw    = ut_clean($_POST['phone'] ?? '', 20);
$digits = preg_replace('/[^0-9]/', '', $raw);

// Indian mobile = 10 digits starting 6-9, optionally written with +91 / 91 / 0.
$mobile = '';
if (preg_match('/^(?:91|0)?([6-9][0-9]{9})$/', $digits, $m) && (strpos($raw, '+') !== 0 || strpos($digits, '91') === 0)) {
  $mobile = $m[1];
}
if ($digits === '' || strlen($digits) < 10 || strlen($digits) > 15) ut_json(400, ['success' => false, 'error' => 'phone']);

$cfg = ut_config();
$sms = $cfg['sms'] ?? null;
$dev = is_array($sms) && !empty($sms['dev']);   // local only: code goes to a log file, nothing is sent
$ready = $dev || (is_array($sms) && !empty($sms['username']) && !empty($sms['apikey']) && !empty($sms['sender'])
  && !empty($sms['templateid']) && !empty($sms['template']) && strpos($sms['template'], '{OTP}') !== false);

// Foreign numbers: BulkSMS India cannot reach them. No gateway configured: nothing to send.
if ($mobile === '' || !$ready) ut_json(200, ['success' => true, 'skip' => true, 'reason' => $mobile === '' ? 'intl' : 'off']);

/* One small JSON file per number, outside public_html when the box allows it. */
function ut_otp_dir() {
  $d = __DIR__ . '/../../ut-otp';
  if (!is_dir($d)) @mkdir($d, 0700, true);
  return (is_dir($d) && is_writable($d)) ? $d : sys_get_temp_dir();
}
function ut_otp_file($key) { return ut_otp_dir() . '/ut_otp_' . hash('sha256', $key) . '.json'; }
function ut_otp_read($key) {
  $j = json_decode((string) @file_get_contents(ut_otp_file($key)), true);
  return is_array($j) ? $j : [];
}
function ut_otp_write($key, array $data) { @file_put_contents(ut_otp_file($key), json_encode($data), LOCK_EX); }
function ut_otp_hash($mobile, $code) { return hash('sha256', $mobile . '|' . $code . '|' . __FILE__); }

$now = time();

if ($action === 'send') {
  $rec   = ut_otp_read('m:' . $mobile);
  $sends = array_values(array_filter($rec['sends'] ?? [], function ($t) use ($now) { return $t > $now - 1800; }));
  if ($sends && end($sends) > $now - UT_OTP_GAP) ut_json(429, ['success' => false, 'error' => 'wait', 'wait' => UT_OTP_GAP - ($now - end($sends))]);
  if (count($sends) >= UT_OTP_PER_PHONE) ut_json(429, ['success' => false, 'error' => 'limit']);

  $ipKey = 'ip:' . ($_SERVER['REMOTE_ADDR'] ?? '');
  $ipRec = ut_otp_read($ipKey);
  $ipSends = array_values(array_filter($ipRec['sends'] ?? [], function ($t) use ($now) { return $t > $now - 3600; }));
  if (count($ipSends) >= UT_OTP_PER_IP) ut_json(429, ['success' => false, 'error' => 'limit']);

  $code = (string) random_int(1000, 9999);

  if ($dev) {
    @file_put_contents(sys_get_temp_dir() . '/ut-otp-dev.log', date('c') . " $mobile $code\n", FILE_APPEND);
    $sent = true;
  } else {
    $q = http_build_query([
      'username'   => $sms['username'],
      'message'    => str_replace('{OTP}', $code, $sms['template']),
      'sendername' => $sms['sender'],
      'smstype'    => 'TRANS',
      'numbers'    => $mobile,
      'apikey'     => $sms['apikey'],
      'peid'       => $sms['peid'] ?? '',
      'templateid' => $sms['templateid'],
    ]);
    $ch = curl_init(($sms['url'] ?? 'https://sms.bulksmsind.in/v2/sendSMS') . '?' . $q);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10, CURLOPT_HTTPHEADER => ['Accept: application/json']]);
    $body = (string) curl_exec($ch);
    $http = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    // BulkSMS answers a bare object, a one-element array, or plain text.
    $j = json_decode($body, true);
    if (is_array($j) && isset($j[0]) && is_array($j[0])) $j = $j[0];
    $status = strtolower((string)(is_array($j) ? ($j['status'] ?? '') : ''));
    $sent = $http === 200 && ($status === 'success' || stripos($body, 'success') !== false);
    if (!$sent) error_log('ut otp: bulksms ' . $http . ' ' . substr($body, 0, 200));
  }

  // Provider down → let the visitor through unverified rather than lose the enquiry.
  if (!$sent) ut_json(200, ['success' => true, 'skip' => true, 'reason' => 'sms_failed']);

  $sends[] = $now;
  ut_otp_write('m:' . $mobile, ['hash' => ut_otp_hash($mobile, $code), 'exp' => $now + UT_OTP_TTL, 'tries' => 0, 'sends' => $sends]);
  $ipSends[] = $now;
  ut_otp_write($ipKey, ['sends' => $ipSends]);
  ut_json(200, ['success' => true]);
}

if ($action === 'verify') {
  $code = preg_replace('/[^0-9]/', '', (string)($_POST['otp'] ?? ''));
  $rec  = ut_otp_read('m:' . $mobile);
  if (empty($rec['hash']) || ($rec['exp'] ?? 0) < $now) ut_json(400, ['success' => false, 'error' => 'expired']);
  if (($rec['tries'] ?? 0) >= UT_OTP_TRIES) ut_json(429, ['success' => false, 'error' => 'tries']);
  if (!hash_equals($rec['hash'], ut_otp_hash($mobile, $code))) {
    $rec['tries'] = ($rec['tries'] ?? 0) + 1;
    ut_otp_write('m:' . $mobile, $rec);
    ut_json(400, ['success' => false, 'error' => 'wrong', 'left' => max(0, UT_OTP_TRIES - $rec['tries'])]);
  }
  // Used once. Keep the send history so the per-number cap still holds.
  ut_otp_write('m:' . $mobile, ['sends' => $rec['sends'] ?? []]);
  ut_json(200, ['success' => true]);
}

ut_json(400, ['success' => false]);
