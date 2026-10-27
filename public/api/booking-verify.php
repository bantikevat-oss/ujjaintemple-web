<?php
/**
 * Step 2 of the ₹500 advance: verify Razorpay's signature (HMAC-SHA256 of
 * "order_id|payment_id" with the key secret), then mark the booking PAID, mail the team and
 * push the lead to the CRM. Idempotent: a second call for a paid order just answers success.
 *
 * Only the signature proves payment — never trust the browser's "success" alone.
 */
require __DIR__ . '/booking-lib.php';

header('Access-Control-Allow-Origin: https://ujjaintemple.com');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') ut_json(405, ['success' => false, 'error' => 'POST only']);

$orderId   = ut_clean($_POST['razorpay_order_id'] ?? '', 40);
$paymentId = ut_clean($_POST['razorpay_payment_id'] ?? '', 40);
$signature = ut_clean($_POST['razorpay_signature'] ?? '', 128);
if ($orderId === '' || $paymentId === '' || $signature === '') ut_json(400, ['success' => false, 'error' => 'missing']);

$rzp = ut_rzp();
if (!$rzp) ut_json(503, ['success' => false, 'error' => 'payments_off']);

$expected = hash_hmac('sha256', $orderId . '|' . $paymentId, $rzp['key_secret']);
if (!hash_equals($expected, $signature)) {
  error_log('booking-verify: bad signature for ' . $orderId);
  ut_json(400, ['success' => false, 'error' => 'signature']);
}

$rows = ut_book_rows_for_order($orderId);
if (!$rows) ut_json(404, ['success' => false, 'error' => 'unknown_order']);
$first = $rows[0];
foreach ($rows as $r) {
  if ($r['status'] === 'PAID') ut_json(200, ['success' => true, 'booking_id' => $first['booking_id'], 'repeat' => true]);
}

$b = $first;
$b['event_at']   = date('Y-m-d H:i:s');
$b['status']     = 'PAID';
$b['payment_id'] = $paymentId;
ut_book_append($b);

ut_booking_mail('✅ [BOOKED · ₹' . $b['advance'] . ' PAID] ' . $b['booking_id'] . ' — ' . $b['trip'] . ' · ' . $b['vehicle'] . ' · ' . $b['travel_date'] . ' ' . $b['pickup_time'],
  $b, 'Advance mil gaya. Gaadi + driver assign karke customer ko WhatsApp par details bhejein. Baaki ₹' . ((int)$b['fare'] - (int)$b['advance']) . ' driver ko cash/UPI.');

// CRM: same ingest as lead.php; the team moves it to WON after the trip.
$cfg = ut_config();
if (!empty($cfg['crm'])) {
  require_once __DIR__ . '/crm-push.php';
  crm_push($cfg['crm'], [
    'name'        => $b['name'],
    'phone'       => $b['phone'],
    'service'     => 'transport',
    'message'     => 'PAID ₹' . $b['advance'] . ' advance · ' . $b['booking_id'] . ' · ' . $b['trip'] . ' · ' . $b['vehicle'] . ' · ₹' . $b['fare'] . ' · ' . $b['travel_date'] . ' ' . $b['pickup_time'],
    'source_page' => $b['source'],
    'channel'     => 'booking',
    'travel_date' => $b['travel_date'],
    'city'        => 'Ujjain',
    'vertical'    => 'travel',
    'created_at'  => $b['event_at'],
  ]);
}

ut_json(200, ['success' => true, 'booking_id' => $b['booking_id']]);
