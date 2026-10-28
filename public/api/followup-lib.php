<?php
/**
 * Cab follow-up for the team (Aman, 2026-10-28): "call kiya to bola baad me batate hain".
 *
 * Whoever saw a fare (fare gate) or opened the payment and stopped (booking-order) gets, in the
 * lead mail, a one-tap WhatsApp to the CUSTOMER with a booking link that opens the widget with
 * their exact trip filled in: /cab-booking/?from=&to=&type=&date=&time=&v=. The customer pays the
 * ₹500 there — the same tested Razorpay path — instead of "baad me batate hain".
 * Pure helpers: no I/O. Every value is checked against a whitelist before it goes into a URL.
 */

const UT_FU_PLACES = ['ujjain', 'indore', 'idr', 'omkareshwar', 'ujjain-local', 'ujjain-fullday'];
const UT_FU_TYPES  = ['oneway', 'round', 'local'];
const UT_FU_CARS   = ['dzire', 'ertiga', 'innova'];

/** Booking page link with whatever parts of the trip are known and valid. */
function ut_fu_link(array $t, $hi) {
  $q = [];
  if (in_array($t['from'] ?? '', UT_FU_PLACES, true) && in_array($t['to'] ?? '', UT_FU_PLACES, true)
      && in_array($t['type'] ?? '', UT_FU_TYPES, true)) {
    $q['from'] = $t['from']; $q['to'] = $t['to']; $q['type'] = $t['type'];
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($t['date'] ?? '')) && $t['date'] > date('Y-m-d')) $q['date'] = $t['date'];
    if (preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', (string)($t['time'] ?? ''))) $q['time'] = $t['time'];
    if (in_array($t['vehicle'] ?? '', UT_FU_CARS, true)) $q['v'] = $t['vehicle'];
  }
  return 'https://ujjaintemple.com/' . ($hi ? 'hi/' : '') . 'cab-booking/' . ($q ? '?' . http_build_query($q) : '');
}

/** The message the team sends the customer — pure Hindi or pure English. */
function ut_fu_text($name, $trip, $link, $hi) {
  $name = trim((string)$name); $trip = trim((string)$trip);
  if ($hi) {
    return 'नमस्ते ' . $name . ' जी, UjjainTemple.com से बात कर रहे हैं। '
      . ($trip !== '' ? 'आपकी यात्रा (' . $trip . ') के लिए' : 'आपकी कैब के लिए')
      . ' तय किराया और ऑनलाइन बुकिंग इस लिंक पर है — ₹500 एडवांस देकर अभी बुकिंग पक्की करें: ' . $link;
  }
  return 'Hello ' . $name . ', this is UjjainTemple.com. '
    . ($trip !== '' ? 'Here is the fixed fare and online booking for your trip (' . $trip . ')' : 'Here is the fixed fare and online booking for your cab')
    . ' — confirm it now with a ₹500 advance: ' . $link;
}

/** Mail block: big "send the booking link" button + the link itself. */
function ut_fu_html($phone, $name, $trip, $link, $hi, $fares = '') {
  $d = preg_replace('/[^0-9]/', '', (string)$phone);
  $wa = strlen($d) === 10 ? '91' . $d : $d;
  $h = function ($v) { return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8'); };
  $out = '<div style="margin:14px 0 4px;padding:12px 14px;background:#fff7ed;border:1px solid #fdba74;border-radius:10px;font-family:Arial,sans-serif">';
  $out .= '<div style="font-size:13px;font-weight:700;color:#9a3412;margin-bottom:6px">📲 Booking pakki karwao — customer ko ye link bhejo</div>';
  if ($fares !== '') $out .= '<div style="font-size:13px;color:#374151;margin-bottom:8px">Fare dikhaya: <b>' . $h($fares) . '</b></div>';
  $out .= '<a href="https://wa.me/' . $h($wa) . '?text=' . rawurlencode(ut_fu_text($name, $trip, $link, $hi)) . '" '
        . 'style="display:inline-block;background:#25D366;color:#fff;padding:11px 18px;border-radius:7px;text-decoration:none;font-weight:700;font-size:14px">'
        . 'WhatsApp pe booking link bhejo</a>';
  $out .= '<div style="font-size:12px;color:#6b7280;margin-top:8px;word-break:break-all">' . $h($link) . '</div>';
  $out .= '<div style="font-size:12px;color:#6b7280;margin-top:4px">Call pe: "aapka fare tay hai — ₹500 ka link WhatsApp kar diya hai, wahi se booking pakki ho jaayegi."</div>';
  return $out . '</div>';
}
