<?php
/**
 * Advance payment for a custom quote. The amount comes only from the stored quote — the browser
 * sends the link token and nothing else. Verification is the cab flow's booking-verify.php.
 *
 * Response: { success, booking_id, order_id, key_id, amount } or { success:false, error }.
 */
require __DIR__ . '/quote-lib.php';

header('Access-Control-Allow-Origin: https://ujjaintemple.com');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') ut_json(405, ['success' => false, 'error' => 'POST only']);

$q = ut_quote_by_token((string)($_POST['k'] ?? ''));
if (!$q) ut_json(404, ['success' => false, 'error' => 'quote']);
$state = ut_quote_state($q);
if ($state !== 'open') ut_json(409, ['success' => false, 'error' => $state]);
// A quotation without an advance has nothing to pay online (Razorpay also rejects a ₹0 order).
if ((int)$q['advance'] <= 0) ut_json(409, ['success' => false, 'error' => 'no_advance']);

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
if ($ip !== '' && ut_over_cap('qorder:' . $ip . ':' . date('Y-m-d-H'), 15)) ut_json(429, ['success' => false, 'error' => 'busy']);

$rzp = ut_rzp();
if (!$rzp) ut_json(503, ['success' => false, 'error' => 'payments_off']);

$advancePaise = (int)$q['advance'] * 100;
list($code, $res) = ut_rzp_call('POST', '/orders', $rzp['key_id'], $rzp['key_secret'], [
  'amount'   => $advancePaise,
  'currency' => 'INR',
  'receipt'  => $q['id'],
  'notes'    => [
    'booking_id' => $q['id'],
    'trip'       => mb_substr($q['title'], 0, 250),
    'total'      => (string)$q['total'],
    'travel'     => $q['days'][0]['date'] ?? '',
    'phone'      => $q['customer']['phone'],
  ],
]);
if ($code !== 200 || empty($res['id'])) {
  error_log('quote-order: razorpay ' . $code . ' ' . json_encode($res));
  ut_json(502, ['success' => false, 'error' => 'gateway']);
}

$b = [
  'event_at' => date('Y-m-d H:i:s'), 'status' => 'ORDER_CREATED', 'booking_id' => $q['id'],
  'order_id' => $res['id'], 'payment_id' => '', 'name' => $q['customer']['name'], 'phone' => $q['customer']['phone'],
  'route' => 'quote', 'vehicle' => $q['vehicle'], 'fare' => (int)$q['total'], 'advance' => (int)$q['advance'],
  'trip' => $q['title'], 'travel_date' => $q['days'][0]['date'] ?? '', 'pickup_time' => '',
  'pickup_note' => count($q['days']) . ' day plan', 'locale' => $q['locale'], 'source' => 'quote', 'ip' => $ip,
];
ut_book_append($b);

if (!ut_over_cap('ordermail:' . date('Y-m-d'), 80)) {
  ut_booking_mail('⏳ [QUOTE PAYMENT PENDING] ' . $q['id'] . ' — ' . $q['title'] . ' · ' . $q['customer']['name'],
    $b, 'Customer ne quote ka advance dena shuru kiya. 15 min me paid mail na aaye to call karein.');
}

ut_json(200, [
  'success'    => true,
  'booking_id' => $q['id'],
  'order_id'   => $res['id'],
  'key_id'     => $rzp['key_id'],
  'amount'     => $advancePaise,
]);
