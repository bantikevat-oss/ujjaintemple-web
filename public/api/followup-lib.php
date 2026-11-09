<?php
/**
 * Cab follow-up for the team (Aman, 2026-10-28: customers said "we will let you know later" on the call).
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

/**
 * Quote-on-call reply (2026-11-09): the widget no longer shows a fare, so the first WhatsApp to
 * the customer thanks them, repeats the trip and leaves the fare for the sender to type in.
 * Pure Hindi or pure English, in the visitor's page language.
 */
function ut_fu_quote_text($name, $trip, $hi) {
  $name = trim((string)$name); $trip = trim((string)$trip);
  if ($hi) {
    return 'नमस्ते ' . $name . ' जी, UjjainTemple.com पर कैब के लिए पूछताछ करने का धन्यवाद। '
      . ($trip !== '' ? 'आपकी यात्रा: ' . $trip . '। ' : '')
      . 'इस यात्रा के लिए गाड़ी और किराया इस प्रकार है: ';
  }
  return 'Hello ' . $name . ', thank you for your cab enquiry on UjjainTemple.com. '
    . ($trip !== '' ? 'Your trip: ' . $trip . '. ' : '')
    . 'Here are the car options and fares for this trip: ';
}

/**
 * Mail block. $quote = true (a quote-on-call enquiry from the widget): one-tap WhatsApp reply
 * with the trip filled in. Otherwise (payment opened and abandoned, reservation): the booking
 * link that opens the widget with the trip filled in.
 */
function ut_fu_html($phone, $name, $trip, $link, $hi, $fares = '', $quote = false) {
  $d = preg_replace('/[^0-9]/', '', (string)$phone);
  $wa = strlen($d) === 10 ? '91' . $d : $d;
  $h = function ($v) { return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8'); };
  $btn = 'display:inline-block;background:#25D366;color:#fff;padding:11px 18px;border-radius:7px;text-decoration:none;font-weight:700;font-size:14px';
  $out = '<div style="margin:14px 0 4px;padding:12px 14px;background:#fff7ed;border:1px solid #fdba74;border-radius:10px;font-family:Arial,sans-serif">';
  if ($quote) {
    $out .= '<div style="font-size:13px;font-weight:700;color:#9a3412;margin-bottom:6px">Next step: call the customer, or reply on WhatsApp with the fare</div>';
    // No rate card here (Aman, 2026-11-09): this mail also goes to the partner desk, which quotes its own fare.
    $out .= '<a href="https://wa.me/' . $h($wa) . '?text=' . rawurlencode(ut_fu_quote_text($name, $trip, $hi)) . '" style="' . $btn . '">Reply on WhatsApp</a>';
    $out .= '<div style="font-size:12px;color:#6b7280;margin-top:8px">The message opens with a greeting and the trip filled in — add the car and fare before sending.</div>';
    return $out . '</div>';
  }
  $out .= '<div style="font-size:13px;font-weight:700;color:#9a3412;margin-bottom:6px">Next step: send the customer this booking link</div>';
  if ($fares !== '') $out .= '<div style="font-size:13px;color:#374151;margin-bottom:8px">Fare shown: <b>' . $h($fares) . '</b></div>';
  $out .= '<a href="https://wa.me/' . $h($wa) . '?text=' . rawurlencode(ut_fu_text($name, $trip, $link, $hi)) . '" style="' . $btn . '">Send booking link on WhatsApp</a>';
  $out .= '<div style="font-size:12px;color:#6b7280;margin-top:8px;word-break:break-all">' . $h($link) . '</div>';
  $out .= '<div style="font-size:12px;color:#6b7280;margin-top:4px">On the call: "Your fare is fixed. The ₹500 advance link is on your WhatsApp — the booking is confirmed there."</div>';
  return $out . '</div>';
}
