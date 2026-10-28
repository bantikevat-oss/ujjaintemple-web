<?php
/**
 * Customer-facing quote page: /q/?k=<token>. Server-rendered (the SSG site has no route for it),
 * noindex, never cached. Shows the day-wise plan, what is and is not included, the price, and
 * "Pay ₹X and confirm" (Razorpay → api/quote-order.php → api/booking-verify.php).
 * Language is the quote's own (pure Hindi or pure English, never mixed).
 */
require __DIR__ . '/../api/quote-lib.php';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('Content-Type: text/html; charset=utf-8');

$q = ut_quote_by_token((string)($_GET['k'] ?? ''));
$state = $q ? ut_quote_state($q) : 'missing';
$hi = !$q || ($q['locale'] ?? 'hi') !== 'en';
$h = 'ut_h';
$t = function ($hiText, $enText) use ($hi) { return $hi ? $hiText : $enText; };

$PHONE = '+91 89890 06759';
$TEL = 'tel:+918989006759';
$WA = 'https://wa.me/917400724456';

function ut_q_date($iso, $hi) {
  $ts = strtotime($iso);
  if (!$ts) return $iso;
  $wdHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  $mHi = ['', 'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  if ($hi) return $wdHi[(int)date('w', $ts)] . ', ' . (int)date('j', $ts) . ' ' . $mHi[(int)date('n', $ts)] . ' ' . date('Y', $ts);
  return date('l, j F Y', $ts);
}

$days = $q['days'] ?? [];
$nDays = count($days);
$first = $days[0]['date'] ?? '';
$last = $nDays ? $days[$nDays - 1]['date'] : '';
// Day count comes from the dates themselves, so "2 days" can never be written over a 3-date plan.
$span = ($first && $last) ? (int) round((strtotime($last) - strtotime($first)) / 86400) + 1 : $nDays;
?>
<!doctype html>
<html lang="<?= $hi ? 'hi' : 'en' ?>">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= $q ? $h($t('यात्रा कोटेशन', 'Trip quote') . ' ' . $q['id'] . ' — UjjainTemple.com') : 'UjjainTemple.com' ?></title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>
  @font-face{font-family:"DM Sans";src:url(/fonts/dmsans-variable.woff2) format("woff2");font-weight:100 900;font-display:swap}
  @font-face{font-family:"Noto Sans Devanagari";src:url(/fonts/notosans-devanagari-variable.woff2) format("woff2");font-weight:100 900;font-display:swap}
  @font-face{font-family:"Cormorant Garamond";src:url(/fonts/cormorant-700.woff2) format("woff2");font-weight:700;font-display:swap}
  @font-face{font-family:"Tiro Devanagari Sanskrit";src:url(/fonts/tiro-devanagari-400.woff2) format("woff2");font-weight:400;font-display:swap}
  :root{--maroon:#8B1A1A;--maroon9:#5c1010;--saffron:#D4621A;--gold:#C9A84C;--cream:#FBF5EC;--cream2:#F3E9D8;--ink:#2a1d17;--soft:#5b4a40;--mute:#8a7a6e;--line:#e8dcc6}
  *{box-sizing:border-box}
  body{margin:0;background:var(--cream);color:var(--ink);font:16px/1.6 "DM Sans","Noto Sans Devanagari",system-ui,sans-serif}
  .wrap{max-width:760px;margin:0 auto;padding:0 16px 48px}
  header{background:var(--maroon);color:#fff}
  header .in{max-width:760px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px}
  header a.brand{color:#fff;text-decoration:none;display:flex;align-items:center;gap:10px;font:700 20px "Cormorant Garamond",serif}
  header a.brand img{width:34px;height:34px;background:#fff;border-radius:50%;padding:3px}
  header a.call{color:#fff;text-decoration:none;font-weight:700;font-size:14px;border:1px solid rgba(255,255,255,.45);border-radius:999px;padding:6px 14px;white-space:nowrap}
  .head{padding:28px 0 8px}
  .eyebrow{color:var(--mute);font-size:14px;font-weight:600}
  h1{margin:4px 0 6px;color:var(--maroon);font:400 32px/1.2 "Tiro Devanagari Sanskrit","Cormorant Garamond",serif}
  html[lang=en] h1{font:700 34px/1.15 "Cormorant Garamond",serif}
  .for{color:var(--soft)}
  .chips{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 4px;padding:0;list-style:none}
  .chips li{background:#fff;border:1px solid var(--line);border-radius:999px;padding:6px 14px;font-size:14px;font-weight:600}
  .card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:20px;margin-top:18px}
  .card h2{margin:0 0 14px;font-size:18px;color:var(--maroon)}
  .day{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;padding:14px 0;border-top:1px solid var(--line)}
  .day:first-of-type{border-top:0;padding-top:0}
  .badge{grid-row:span 3;width:44px;height:44px;border-radius:50%;background:var(--cream2);color:var(--maroon);display:flex;align-items:center;justify-content:center;font-weight:800}
  .day .d{font-size:13px;color:var(--mute);font-weight:600}
  .day .ti{font-weight:700}
  .day .de{color:var(--soft);font-size:15px;white-space:pre-line}
  .cols{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .cols ul{margin:0;padding:0;list-style:none}
  .cols li{padding:5px 0 5px 26px;position:relative;font-size:15px}
  .cols li:before{position:absolute;left:0;top:5px;width:18px;height:18px;border-radius:50%;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center}
  .yes li:before{content:"✓";background:var(--maroon);color:#fff}
  .no li:before{content:"✕";background:var(--cream2);color:var(--mute)}
  .cols h3{margin:0 0 6px;font-size:14px;color:var(--soft)}
  .price{display:grid;gap:8px}
  .price .r{display:flex;justify-content:space-between;gap:12px}
  .price .total{font-size:22px;font-weight:800;color:var(--maroon)}
  .price .adv{font-weight:700}
  .muted{color:var(--mute);font-size:14px}
  .pay{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;margin-top:18px;border:0;border-radius:14px;background:var(--saffron);color:#fff;font:800 18px "DM Sans","Noto Sans Devanagari",sans-serif;padding:16px;cursor:pointer;box-shadow:0 8px 24px rgba(212,98,26,.3)}
  .pay[disabled]{opacity:.7;cursor:wait}
  .err{color:#a11;font-weight:600;text-align:center;margin-top:10px}
  .state{text-align:center}
  .state .big{font:400 28px "Tiro Devanagari Sanskrit","Cormorant Garamond",serif;color:var(--maroon);margin:6px 0}
  html[lang=en] .state .big{font:700 30px "Cormorant Garamond",serif}
  .btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px}
  .btns a{text-decoration:none;font-weight:700;border-radius:12px;padding:11px 18px;border:2px solid var(--maroon);color:var(--maroon)}
  .btns a.solid{background:var(--maroon);color:#fff}
  footer{margin-top:30px;text-align:center;font-size:13px;color:var(--mute)}
  footer a{color:var(--maroon)}
  @media (max-width:560px){h1{font-size:27px}.cols{grid-template-columns:1fr}header a.call .num{display:none}}
</style>
</head>
<body>
<header><div class="in">
  <a class="brand" href="/<?= $hi ? 'hi/' : '' ?>"><img src="/favicon.svg" alt="" width="34" height="34">UjjainTemple</a>
  <a class="call" href="<?= $TEL ?>"><?= $h($t('कॉल करें', 'Call')) ?> <span class="num"><?= $h($PHONE) ?></span></a>
</div></header>

<main class="wrap">
<?php if (!$q || $state === 'cancelled'): ?>
  <div class="card state" style="margin-top:32px">
    <p class="big"><?= $h($t('यह कोटेशन उपलब्ध नहीं है', 'This quote is not available')) ?></p>
    <p class="muted"><?= $h($t('लिंक पुराना हो सकता है। नया कोटेशन पाने के लिए हमसे बात करें।', 'The link may be out of date. Talk to us for a fresh quote.')) ?></p>
    <div class="btns"><a class="solid" href="<?= $TEL ?>"><?= $h($t('कॉल करें', 'Call us')) ?></a><a href="<?= $WA ?>">WhatsApp</a></div>
  </div>
<?php else: ?>
  <section class="head">
    <div class="eyebrow"><?= $h($t('यात्रा कोटेशन', 'Trip quote')) ?> · <?= $h($q['id']) ?></div>
    <h1><?= $h($q['title']) ?></h1>
    <div class="for"><?= $h($t('इनके लिए:', 'Prepared for')) ?> <b><?= $h($q['customer']['name']) ?></b></div>
    <ul class="chips">
      <li><?= $h($first === $last ? ut_q_date($first, $hi) : ut_q_date($first, $hi) . ' → ' . ut_q_date($last, $hi)) ?></li>
      <li><?= $h($hi ? ($span . ' दिन' . ($span > 1 ? ' · ' . ($span - 1) . ' रात' : '')) : ($span . ' day' . ($span > 1 ? 's · ' . ($span - 1) . ' night' . ($span > 2 ? 's' : '') : ''))) ?></li>
      <?php if (!empty($q['vehicle'])): ?><li><?= $h($q['vehicle']) ?></li><?php endif; ?>
      <?php if (!empty($q['pax'])): ?><li><?= $h($q['pax'] . ' ' . $t('यात्री', ($q['pax'] > 1 ? 'travellers' : 'traveller'))) ?></li><?php endif; ?>
    </ul>
  </section>

  <?php if ($state === 'paid'): ?>
  <div class="card state">
    <p class="big"><?= $h($t('बुकिंग पक्की हो गई', 'Your booking is confirmed')) ?></p>
    <p class="muted"><?= $h($t('एडवांस मिल गया। यात्रा से पहले गाड़ी और ड्राइवर की जानकारी WhatsApp पर भेजी जाएगी।', 'Advance received. Car and driver details will be sent on WhatsApp before your trip.')) ?></p>
  </div>
  <?php elseif ($state === 'expired'): ?>
  <div class="card state">
    <p class="big"><?= $h($t('इस कोटेशन की वैधता ख़त्म हो गई', 'This quote has expired')) ?></p>
    <p class="muted"><?= $h($t('किराया बदल सकता है। ताज़ा कोटेशन के लिए हमसे बात करें।', 'Fares may have changed. Talk to us for an updated quote.')) ?></p>
    <div class="btns"><a class="solid" href="<?= $TEL ?>"><?= $h($t('कॉल करें', 'Call us')) ?></a><a href="<?= $WA ?>">WhatsApp</a></div>
  </div>
  <?php endif; ?>

  <section class="card">
    <h2><?= $h($t('दिन-वार योजना', 'Day-by-day plan')) ?></h2>
    <?php foreach ($days as $i => $d): ?>
    <div class="day">
      <span class="badge"><?= $i + 1 ?></span>
      <span class="d"><?= $h(ut_q_date($d['date'], $hi)) ?></span>
      <span class="ti"><?= $h($d['title']) ?></span>
      <?php if (!empty($d['details'])): ?><span class="de"><?= $h($d['details']) ?></span><?php endif; ?>
    </div>
    <?php endforeach; ?>
  </section>

  <section class="card">
    <h2><?= $h($t('किराये में क्या शामिल है', 'What the price covers')) ?></h2>
    <div class="cols">
      <div class="yes"><h3><?= $h($t('शामिल', 'Included')) ?></h3><ul>
        <?php foreach ($q['items'] as $key => $v) if ($v === 'in') echo '<li>' . $h(UT_QUOTE_ITEMS[$key][$hi ? 'hi' : 'en'] ?? $key) . '</li>'; ?>
        <?php foreach ($q['extra_in'] ?? [] as $x) echo '<li>' . $h($x) . '</li>'; ?>
      </ul></div>
      <div class="no"><h3><?= $h($t('शामिल नहीं', 'Not included')) ?></h3><ul>
        <?php foreach ($q['items'] as $key => $v) if ($v === 'out') echo '<li>' . $h(UT_QUOTE_ITEMS[$key][$hi ? 'hi' : 'en'] ?? $key) . '</li>'; ?>
        <?php foreach ($q['extra_out'] ?? [] as $x) echo '<li>' . $h($x) . '</li>'; ?>
      </ul></div>
    </div>
    <?php if (!empty($q['notes'])): ?><p class="muted" style="white-space:pre-line;margin:16px 0 0"><?= $h($q['notes']) ?></p><?php endif; ?>
  </section>

  <section class="card">
    <h2><?= $h($t('कुल किराया', 'Price')) ?></h2>
    <div class="price">
      <div class="r"><span><?= $h($t('पूरी यात्रा का तय किराया', 'Fixed price for the whole trip')) ?></span><span class="total"><?= ut_quote_inr($q['total']) ?></span></div>
      <div class="r adv"><span><?= $h($t('अभी एडवांस', 'Advance now')) ?></span><span><?= ut_quote_inr($q['advance']) ?></span></div>
      <div class="r"><span><?= $h($t('बाकी — यात्रा के दौरान नकद या UPI में', 'Balance — during the trip, cash or UPI')) ?></span><span><?= ut_quote_inr($q['total'] - $q['advance']) ?></span></div>
    </div>
    <?php if ($state === 'open'): ?>
      <button class="pay" id="pay" type="button">🔒 <?= $h($t(ut_quote_inr($q['advance']) . ' देकर बुकिंग पक्की करें', 'Pay ' . ut_quote_inr($q['advance']) . ' and confirm')) ?></button>
      <p class="err" id="err" role="alert" hidden></p>
      <p class="muted" style="text-align:center;margin:10px 0 0">
        <?= $h($t('Razorpay से सुरक्षित भुगतान (UPI, कार्ड, नेटबैंकिंग)', 'Secure payment by Razorpay (UPI, card, netbanking)')) ?>
        <?php if (!empty($q['valid_until'])): ?> · <?= $h($t('यह कोटेशन ' . ut_q_date($q['valid_until'], true) . ' तक मान्य', 'Valid until ' . ut_q_date($q['valid_until'], false))) ?><?php endif; ?>
      </p>
    <?php endif; ?>
    <p class="muted" style="margin:14px 0 0">
      <?= $h($t('यात्रा से 48 घंटे पहले तक रद्द करने पर पूरा एडवांस वापस।', 'Cancel up to 48 hours before the trip for a full refund of the advance.')) ?>
      <a href="/<?= $hi ? 'hi/' : '' ?>cancellation-refund-policy/" style="color:var(--maroon)"><?= $h($t('पूरी रिफ़ंड नीति', 'Full refund policy')) ?></a>
    </p>
  </section>

  <div class="btns" style="margin-top:22px">
    <a href="<?= $TEL ?>"><?= $h($t('सवाल है? कॉल करें', 'Questions? Call us')) ?></a>
    <a href="<?= $WA ?>?text=<?= rawurlencode($t('नमस्ते, कोटेशन ' . $q['id'] . ' के बारे में', 'Hello, about quote ' . $q['id'])) ?>">WhatsApp</a>
  </div>
<?php endif; ?>

  <footer>UjjainTemple.com · <a href="https://byteflowtech.in/">ByteFlow Technologies Pvt Ltd</a> · DPIIT-Registered Startup</footer>
</main>

<?php if ($q && $state === 'open'): ?>
<script>
(function () {
  var btn = document.getElementById('pay'), err = document.getElementById('err');
  var K = <?= json_encode($q['token']) ?>, HI = <?= $hi ? 'true' : 'false' ?>;
  var msg = function (hi, en) { err.textContent = HI ? hi : en; err.hidden = false; btn.disabled = false; };
  var loadRzp = function () {
    return new Promise(function (ok) {
      if (window.Razorpay) return ok(true);
      var s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = function () { ok(true); }; s.onerror = function () { ok(false); };
      document.body.appendChild(s);
    });
  };
  btn.addEventListener('click', function () {
    btn.disabled = true; err.hidden = true;
    var fd = new FormData(); fd.append('k', K);
    fetch('/api/quote-order.php', { method: 'POST', body: fd }).then(function (r) { return r.json(); }).then(function (o) {
      if (!o.success) {
        if (o.error === 'paid') { location.reload(); return; }
        return msg('अभी भुगतान शुरू नहीं हो सका — कृपया कॉल करें <?= $PHONE ?>', 'Could not start the payment — please call <?= $PHONE ?>');
      }
      return loadRzp().then(function (ok) {
        if (!ok || !window.Razorpay) return msg('भुगतान पेज नहीं खुला — दोबारा कोशिश करें', 'The payment window did not open — try again');
        var rzp = new window.Razorpay({
          key: o.key_id, order_id: o.order_id, amount: o.amount, currency: 'INR', name: 'UjjainTemple.com',
          description: (HI ? 'यात्रा एडवांस · ' : 'Trip advance · ') + o.booking_id,
          prefill: { name: <?= json_encode($q['customer']['name']) ?>, contact: <?= json_encode($q['customer']['phone']) ?> },
          notes: { booking_id: o.booking_id }, theme: { color: '#8B1A1A' },
          modal: { ondismiss: function () { msg('भुगतान पूरा नहीं हुआ — दोबारा कोशिश करें', 'Payment not completed — please try again'); } },
          handler: function (r) {
            var v = new FormData();
            Object.keys(r).forEach(function (k) { v.append(k, r[k]); });
            fetch('/api/booking-verify.php', { method: 'POST', body: v }).then(function (x) { return x.json(); }).then(function (out) {
              if (out.success) {
                if (window.gtag) window.gtag('event', 'purchase', { transaction_id: o.booking_id, value: o.amount / 100, currency: 'INR' });
                location.reload();
              } else msg('भुगतान की पुष्टि नहीं हुई — ' + o.booking_id + ' के साथ कॉल करें', 'Could not confirm the payment — call us with ' + o.booking_id);
            }).catch(function () { msg('भुगतान हो गया हो तो ' + o.booking_id + ' के साथ कॉल करें', 'If you were charged, call us with ' + o.booking_id); });
          }
        });
        rzp.on('payment.failed', function (e) { msg('भुगतान नहीं हुआ — दोबारा कोशिश करें', (e.error && e.error.description) || 'Payment failed — please try again'); });
        rzp.open();
      });
    }).catch(function () { msg('नेटवर्क की दिक़्क़त — दोबारा कोशिश करें', 'Network problem — please try again'); });
  });
})();
</script>
<?php endif; ?>
</body>
</html>
