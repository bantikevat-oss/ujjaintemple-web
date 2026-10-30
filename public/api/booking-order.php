<?php
/**
 * Step 1 of the ₹500 advance: validate the trip, price it from the SERVER rate card, record the
 * booking, and create a Razorpay order for the fixed advance. The browser never sets an amount.
 *
 * Response: { success, booking_id, order_id, key_id, amount } or { success:false, error, fallback }.
 * `fallback: true` tells the widget to book over WhatsApp instead (payments not configured,
 * Razorpay down) — a booking is never lost because the gateway is unavailable.
 */
require __DIR__ . '/booking-lib.php';
require __DIR__ . '/rate-lib.php';

header('Access-Control-Allow-Origin: https://ujjaintemple.com');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') ut_json(405, ['success' => false, 'error' => 'POST only']);
if (trim((string)($_POST['website'] ?? '')) !== '') ut_json(200, ['success' => false, 'error' => 'blocked', 'fallback' => true]); // honeypot

$route   = ut_clean($_POST['route'] ?? '', 40);
$vehicle = ut_clean($_POST['vehicle'] ?? '', 20);
$name    = ut_clean($_POST['name'] ?? '', 60);
$phone   = preg_replace('/[^0-9+]/', '', (string)($_POST['phone'] ?? ''));
$date    = ut_clean($_POST['date'] ?? '', 10);
$time    = ut_clean($_POST['time'] ?? '', 5);
$trip    = ut_clean($_POST['trip'] ?? '', 160);
$note    = ut_clean($_POST['pickupNote'] ?? '', 160);
$locale  = ut_clean($_POST['locale'] ?? '', 4) === 'en' ? 'en' : 'hi';
$source  = ut_clean($_POST['source'] ?? '', 120);
$bkFrom  = ut_clean($_POST['from'] ?? '', 20);    // for the follow-up link only (followup-lib whitelists)
$bkTo    = ut_clean($_POST['to'] ?? '', 20);
$bkType  = ut_clean($_POST['type'] ?? '', 10);
$ip      = $_SERVER['REMOTE_ADDR'] ?? '';

// Validation — the same rules the widget applies, enforced again here.
$base = ut_rates_base();
if (!array_key_exists($vehicle, $base[$route] ?? []))              ut_json(400, ['success' => false, 'error' => 'route']);
if (mb_strlen($name) < 2)                                          ut_json(400, ['success' => false, 'error' => 'name']);
$digits = ltrim($phone, '+');
if (!preg_match('/^\+?[0-9]{10,15}$/', $phone) || strlen($digits) < 10) ut_json(400, ['success' => false, 'error' => 'phone']);
// No same-day bookings (Aman, 2026-10-27): tomorrow onward only.
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || $date <= date('Y-m-d')) ut_json(400, ['success' => false, 'error' => 'date']);
// Time is optional since 2026-10-30 (Aman: the driver fixes it on the phone); old booking links may still send one.
if ($time !== '' && !preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $time)) $time = '';
if (strlen($digits) === 10) $phone = '+91' . $digits;              // bare Indian mobile

// Fare for the travel date — a panel override (festival day etc.) beats the normal card.
$fare = ut_fare_for($route, $vehicle, $date);
if ($fare === null) ut_json(400, ['success' => false, 'error' => 'route']);
// The widget sends the fare it showed. If an override changed since the page loaded, stop and
// show the new fare rather than record one the customer never saw.
$shown = (int)($_POST['fare'] ?? 0);
if ($shown > 0 && $shown !== (int)$fare) ut_json(409, ['success' => false, 'error' => 'fare_changed', 'fare' => (int)$fare, 'fallback' => false]);

// Abuse guard: order creation is cheap to spam, so cap per IP.
if ($ip !== '' && ut_over_cap('order:' . $ip . ':' . date('Y-m-d-H'), 15)) {
  ut_json(429, ['success' => false, 'error' => 'busy', 'fallback' => true]);
}

$rzp = ut_rzp();
if (!$rzp) ut_json(503, ['success' => false, 'error' => 'payments_off', 'fallback' => true]);

$bookingId = 'UT' . date('ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));
list($code, $res) = ut_rzp_call('POST', '/orders', $rzp['key_id'], $rzp['key_secret'], [
  'amount'   => UT_ADVANCE_PAISE,
  'currency' => 'INR',
  'receipt'  => $bookingId,
  'notes'    => [
    'booking_id' => $bookingId,
    'trip'       => mb_substr($trip, 0, 250),
    'vehicle'    => $vehicle,
    'fare'       => (string)$fare,
    'travel'     => $date . ' ' . $time,
    'phone'      => $phone,
  ],
]);
if ($code !== 200 || empty($res['id'])) {
  error_log('booking-order: razorpay ' . $code . ' ' . json_encode($res));
  ut_json(502, ['success' => false, 'error' => 'gateway', 'fallback' => true]);
}

$b = [
  'event_at' => date('Y-m-d H:i:s'), 'status' => 'ORDER_CREATED', 'booking_id' => $bookingId,
  'order_id' => $res['id'], 'payment_id' => '', 'name' => $name, 'phone' => $phone,
  'route' => $route, 'vehicle' => $vehicle, 'fare' => $fare, 'advance' => UT_ADVANCE_PAISE / 100,
  'trip' => $trip, 'travel_date' => $date, 'pickup_time' => $time, 'pickup_note' => $note,
  'locale' => $locale, 'source' => $source, 'ip' => $ip,
];
ut_book_append($b);

// An abandoned checkout is the hottest lead there is — tell the team now, not only on payment.
if (!ut_over_cap('ordermail:' . date('Y-m-d'), 80)) {
  require_once __DIR__ . '/followup-lib.php';
  $fuHi = $locale !== 'en';
  $fuLink = ut_fu_link(['from' => $bkFrom, 'to' => $bkTo, 'type' => $bkType, 'date' => $date, 'time' => $time, 'vehicle' => $vehicle], $fuHi);
  ut_booking_mail('⏳ [PAYMENT PENDING] ' . $bookingId . ' — ' . $trip . ' · ' . $name,
    $b, 'Customer ne booking shuru ki, ₹500 advance abhi baaki hai. 15 min me paid mail na aaye to call karein.',
    ut_fu_html($phone, $name, $trip, $fuLink, $fuHi));
}

ut_json(200, [
  'success'    => true,
  'booking_id' => $bookingId,
  'order_id'   => $res['id'],
  'key_id'     => $rzp['key_id'],
  'amount'     => UT_ADVANCE_PAISE,
]);
