<?php
/**
 * Customer-facing quote page: /q/?k=<token>. Server-rendered (the SSG site has no route for it),
 * noindex, never cached. Laid out as a quotation document (2026-10-28): letterhead, quote no. +
 * dates, trip summary, day-wise plan, inclusions, price table, notes, terms — whatever the team
 * typed in the panel is tidied here (spaces, capital first letter, multi-line → bullet list).
 * "PDF डाउनलोड करें" builds an A4 PDF in the browser (html2canvas + jsPDF from /vendor/, loaded on
 * click): Hostinger has no Chrome, and PHP PDF libraries break Devanagari shaping. If that fails
 * it falls back to the browser's print → Save as PDF, which the print CSS below lays out.
 * "Pay ₹X and confirm" (Razorpay → api/quote-order.php → api/booking-verify.php) only when the
 * quote carries an advance. Language is the quote's own (pure Hindi or pure English, never mixed).
 */
require __DIR__ . '/../api/quote-lib.php';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('Content-Type: text/html; charset=utf-8');

$q = ut_quote_by_token((string)($_GET['k'] ?? ''));
$state = $q ? ut_quote_state($q) : 'missing';
// No advance on the quote (Aman 2026-10-28) = a plain quotation: no payment button, booking by call/WhatsApp.
$hasAdv = $q && (int)$q['advance'] > 0;
$hi = !$q || ($q['locale'] ?? 'hi') !== 'en';
$h = 'ut_h';
$t = function ($hiText, $enText) use ($hi) { return $hi ? $hiText : $enText; };

$PHONE = UT_QUOTE_CALL;
$TEL = 'tel:+918989006759';
$WA_NUM = UT_QUOTE_WA;
$WA = 'https://wa.me/918989006759';

/** A day's details: "Something:" lines become sub-headings, the rest bullet lists (one line = a paragraph). */
function ut_q_day($s) {
  $parts = ut_quote_parts($s);
  if (count($parts) === 1 && isset($parts[0]['li'])) return '<p class="de">' . ut_h($parts[0]['li']) . '</p>';
  $html = ''; $open = false;
  foreach ($parts as $p) {
    if (isset($p['h'])) { if ($open) { $html .= '</ul>'; $open = false; } $html .= '<div class="sh">' . ut_h($p['h']) . '</div>'; continue; }
    if (!$open) { $html .= '<ul class="pts de">'; $open = true; }
    // a line the team started with an emoji (🚉 🏨 🌙) already has its own bullet
    $html .= (preg_match('/^[\p{L}\p{N}]/u', $p['li']) ? '<li>' : '<li class="em">') . ut_h($p['li']) . '</li>';
  }
  return $open ? $html . '</ul>' : $html;
}
/** One line → paragraph, several → bullet list. */
function ut_q_text($s, $cls = '') {
  $ls = ut_q_lines($s);
  if (!$ls) return '';
  if (count($ls) === 1) return '<p class="' . $cls . '">' . ut_h($ls[0]) . '</p>';
  return '<ul class="pts ' . $cls . '"><li>' . implode('</li><li>', array_map('ut_h', $ls)) . '</li></ul>';
}

$days = $q['days'] ?? [];
$nDays = count($days);
$first = $days[0]['date'] ?? '';
$last = $nDays ? $days[$nDays - 1]['date'] : '';
$issued = $q ? substr((string)($q['created_at'] ?? ''), 0, 10) : '';
$inItems = $outItems = [];
if ($q) {
  foreach ($q['items'] ?? [] as $key => $v) {
    $label = UT_QUOTE_ITEMS[$key][$hi ? 'hi' : 'en'] ?? $key;
    if ($v === 'in') $inItems[] = $label; elseif ($v === 'out') $outItems[] = $label;
  }
  foreach ($q['extra_in'] ?? [] as $x) if (($x = ut_q_clean($x)) !== '') $inItems[] = $x;
  foreach ($q['extra_out'] ?? [] as $x) if (($x = ut_q_clean($x)) !== '') $outItems[] = $x;
}
$durationText = $q ? ut_quote_duration($q, $hi) : '';
$pdfName = $q ? 'UjjainTemple-' . $q['id'] . '.pdf' : '';
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
  .wrap{max-width:820px;margin:0 auto;padding:0 16px 48px}
  header.site{background:var(--maroon);color:#fff}
  header.site .in{max-width:820px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px}
  header.site a.brand{color:#fff;text-decoration:none;display:flex;align-items:center;gap:10px;font:700 20px "Cormorant Garamond",serif}
  header.site a.brand img{width:34px;height:34px;background:#fff;border-radius:50%;padding:3px}
  header.site a.call{color:#fff;text-decoration:none;font-weight:700;font-size:14px;border:1px solid rgba(255,255,255,.45);border-radius:999px;padding:6px 14px;white-space:nowrap}

  /* ── the quotation document ── */
  .doc{background:#fff;border:1px solid var(--line);border-radius:16px;margin-top:22px;overflow:hidden;box-shadow:0 10px 30px rgba(92,16,16,.06)}
  .blk{background:#fff;padding:0 28px}
  .lh{display:flex;justify-content:space-between;gap:18px;padding:24px 28px 20px;border-bottom:4px solid var(--maroon);background:linear-gradient(180deg,#fff, #fffaf3)}
  .lh .who{display:flex;gap:12px;align-items:flex-start}
  .lh .who img{width:52px;height:52px;flex:none}
  .lh .nm{font:700 26px/1.1 "Cormorant Garamond",serif;color:var(--maroon)}
  .lh .ct{font-size:13px;color:var(--soft);line-height:1.55;margin-top:4px}
  .lh .doctype{text-align:right}
  .lh .doctype .k{font:400 26px/1.1 "Tiro Devanagari Sanskrit","Cormorant Garamond",serif;color:var(--maroon)}
  html[lang=en] .lh .doctype .k{font:700 26px/1.1 "Cormorant Garamond",serif;text-transform:uppercase}
  .meta{margin-top:8px;font-size:13px;color:var(--soft);display:grid;grid-template-columns:auto auto;gap:2px 10px;justify-content:end}
  .meta b{color:var(--ink);text-align:left}
  .stamp{display:inline-block;margin-top:8px;padding:3px 10px;border-radius:6px;font-size:13px;font-weight:800;border:2px solid currentColor}
  .stamp.paid{color:#1d5fa8}.stamp.expired{color:var(--mute)}
  .sec{padding-top:22px}
  .sec h2{margin:0 0 12px;font-size:13px;font-weight:800;color:var(--maroon);text-transform:uppercase;display:flex;align-items:center;gap:10px}
  html[lang=hi] .sec h2{text-transform:none;font-size:15px}
  .sec h2:after{content:"";flex:1;height:1px;background:var(--line)}
  .to{display:grid;grid-template-columns:1.1fr 1.4fr;gap:18px;align-items:start}
  .to .lbl{font-size:12px;font-weight:700;color:var(--mute)}
  .to .cust{font-size:18px;font-weight:800}
  .to .ph{color:var(--soft);font-size:14px}
  .trip{font:400 24px/1.25 "Tiro Devanagari Sanskrit","Cormorant Garamond",serif;color:var(--maroon);margin:2px 0 0}
  html[lang=en] .trip{font:700 26px/1.2 "Cormorant Garamond",serif}
  table.sum{width:100%;border-collapse:collapse;margin-top:16px;font-size:14.5px}
  table.sum td{border:1px solid var(--line);padding:9px 12px;vertical-align:top}
  table.sum td.k{background:var(--cream);color:var(--soft);font-weight:700;width:28%}
  .day{display:grid;grid-template-columns:96px 1fr;gap:14px;padding:14px 0;border-top:1px dashed var(--line)}
  .day.first{border-top:0;padding-top:0}
  .day .dn{align-self:start;background:var(--maroon);color:#fff;border-radius:10px;text-align:center;padding:6px 4px;line-height:1.2}
  .day .dn b{display:block;font-size:12px;font-weight:700;opacity:.85}
  .day .dn span{display:block;font-size:13px;font-weight:700;margin-top:2px}
  .day .ti{font-weight:800;font-size:16.5px}
  .day .dd{font-size:13px;color:var(--mute);font-weight:600}
  .day .de{color:var(--soft);font-size:15px;margin:4px 0 0}
  .day .sh{margin:10px 0 0;font-size:13.5px;font-weight:800;color:var(--saffron)}
  .tag{margin-top:4px;font-size:14px;font-weight:700;color:var(--soft)}
  ul.pts{margin:6px 0 0;padding:0;list-style:none}
  ul.pts li{position:relative;padding-left:18px;margin:3px 0}
  ul.pts li:before{content:"";position:absolute;left:3px;top:.62em;width:6px;height:6px;border-radius:50%;background:var(--saffron)}
  ul.pts li.em{padding-left:0} ul.pts li.em:before{display:none}
  .cols{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .cols .box{border:1px solid var(--line);border-radius:12px;padding:12px 14px}
  .cols h3{margin:0 0 6px;font-size:14px}
  .cols .yes h3{color:var(--maroon)} .cols .no h3{color:var(--mute)}
  .cols ul{margin:0;padding:0;list-style:none}
  .cols li{padding:4px 0 4px 26px;position:relative;font-size:15px}
  .cols li:before{position:absolute;left:0;top:6px;width:18px;height:18px;border-radius:50%;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center}
  .yes li:before{content:"✓";background:var(--maroon);color:#fff}
  .no li:before{content:"✕";background:var(--cream2);color:var(--mute)}
  .price .pr{display:flex;justify-content:space-between;gap:14px;padding:11px 14px;border-bottom:1px solid var(--line);font-size:15.5px}
  .price .pr .a{font-weight:700;white-space:nowrap}
  .price .pr.tot{background:var(--maroon);color:#fff;font-size:18px;font-weight:800;border:0;border-radius:10px}
  .price .pr.sub{color:var(--soft)}
  .note{background:var(--cream);border-left:4px solid var(--saffron);border-radius:8px;padding:12px 14px;color:var(--ink)}
  .note p{margin:0}
  ol.terms{margin:0;padding:0;list-style:none;counter-reset:t;font-size:14px;color:var(--soft)}
  ol.terms li{counter-increment:t;position:relative;padding-left:24px;margin:4px 0}
  ol.terms li:before{content:counter(t) ".";position:absolute;left:0;font-family:"DM Sans",sans-serif;font-weight:700;color:var(--maroon)}
  .sign{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;padding:26px 28px 24px;margin-top:22px;border-top:1px solid var(--line);font-size:13px;color:var(--mute)}
  .sign .thx{font:400 20px "Tiro Devanagari Sanskrit","Cormorant Garamond",serif;color:var(--maroon)}
  html[lang=en] .sign .thx{font:700 22px "Cormorant Garamond",serif}
  .sign a{color:var(--maroon)}

  /* ── actions (never in the PDF) ── */
  .actions{margin-top:18px;display:grid;gap:10px}
  .pay{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;border:0;border-radius:14px;background:var(--saffron);color:#fff;font:800 18px "DM Sans","Noto Sans Devanagari",sans-serif;padding:16px;cursor:pointer;box-shadow:0 8px 24px rgba(212,98,26,.3)}
  .pay[disabled]{opacity:.7;cursor:wait}
  .row3{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:10px}
  .row3 a,.row3 button{display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;font:700 15px "DM Sans","Noto Sans Devanagari",sans-serif;border-radius:12px;padding:12px 10px;border:2px solid var(--maroon);color:var(--maroon);background:#fff;cursor:pointer}
  .row3 .pdf{background:var(--maroon);color:#fff}
  .row3 .pdf[disabled]{opacity:.7;cursor:wait}
  .err{color:#a11;font-weight:600;text-align:center;margin:4px 0 0}
  .muted{color:var(--mute);font-size:14px}
  .center{text-align:center}
  .state{background:#fff;border:1px solid var(--line);border-radius:16px;padding:22px;margin-top:22px;text-align:center}
  .state .big{font:400 28px "Tiro Devanagari Sanskrit","Cormorant Garamond",serif;color:var(--maroon);margin:6px 0}
  html[lang=en] .state .big{font:700 30px "Cormorant Garamond",serif}
  .btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px}
  .btns a{text-decoration:none;font-weight:700;border-radius:12px;padding:11px 18px;border:2px solid var(--maroon);color:var(--maroon)}
  .btns a.solid{background:var(--maroon);color:#fff}
  footer.site{margin-top:30px;text-align:center;font-size:13px;color:var(--mute)}
  footer.site a{color:var(--maroon)}

  @media (max-width:640px){
    .blk{padding-left:16px;padding-right:16px}  /* not the shorthand — it would zero .sec's top gap */
    .lh{flex-direction:column;padding:18px 16px 16px}
    .lh .doctype{text-align:left}.meta{justify-content:start}
    .to,.cols{grid-template-columns:1fr}
    .day{grid-template-columns:74px 1fr;gap:10px}
    .sign{flex-direction:column;align-items:flex-start;padding:22px 16px}
    .row3{grid-template-columns:1fr 1fr}.row3 .pdf{grid-column:1 / -1}
    header.site a.call .num{display:none}
  }
  /* The PDF is always laid out at desktop width, whatever the phone. */
  .doc.pdfmode{width:794px;max-width:none;border-radius:0;box-shadow:none;border:0}
  /* Browser print → Save as PDF (fallback): the document alone, A4. */
  @page{size:A4;margin:12mm}
  @media print{
    body{background:#fff}
    header.site,.actions,.state,footer.site{display:none!important}
    .wrap{max-width:none;padding:0}
    .doc{border:0;box-shadow:none;margin:0;border-radius:0}
    .day,.cols .box,.price .pr,.note{break-inside:avoid}
    *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  }
</style>
</head>
<body>
<header class="site"><div class="in">
  <a class="brand" href="/<?= $hi ? 'hi/' : '' ?>"><img src="/favicon.svg" alt="" width="34" height="34">UjjainTemple</a>
  <a class="call" href="<?= $TEL ?>"><?= $h($t('कॉल करें', 'Call')) ?> <span class="num"><?= $h($PHONE) ?></span></a>
</div></header>

<main class="wrap">
<?php if (!$q || $state === 'cancelled'): ?>
  <div class="state" style="margin-top:32px">
    <p class="big"><?= $h($t('यह कोटेशन उपलब्ध नहीं है', 'This quote is not available')) ?></p>
    <p class="muted"><?= $h($t('लिंक पुराना हो सकता है। नया कोटेशन पाने के लिए हमसे बात करें।', 'The link may be out of date. Talk to us for a fresh quote.')) ?></p>
    <div class="btns"><a class="solid" href="<?= $TEL ?>"><?= $h($t('कॉल करें', 'Call us')) ?></a><a href="<?= $WA ?>">WhatsApp</a></div>
  </div>
<?php else: ?>
  <?php if ($state === 'paid'): ?>
  <div class="state">
    <p class="big"><?= $h($t('बुकिंग पक्की हो गई', 'Your booking is confirmed')) ?></p>
    <p class="muted"><?= $h($t('एडवांस मिल गया। यात्रा से पहले गाड़ी और ड्राइवर की जानकारी WhatsApp पर भेजी जाएगी।', 'Advance received. Car and driver details will be sent on WhatsApp before your trip.')) ?></p>
  </div>
  <?php elseif ($state === 'expired'): ?>
  <div class="state">
    <p class="big"><?= $h($t('इस कोटेशन की वैधता ख़त्म हो गई', 'This quote has expired')) ?></p>
    <p class="muted"><?= $h($t('किराया बदल सकता है। ताज़ा कोटेशन के लिए हमसे बात करें।', 'Fares may have changed. Talk to us for an updated quote.')) ?></p>
    <div class="btns"><a class="solid" href="<?= $TEL ?>"><?= $h($t('कॉल करें', 'Call us')) ?></a><a href="<?= $WA ?>">WhatsApp</a></div>
  </div>
  <?php endif; ?>

  <article class="doc" id="doc">
    <div class="lh pdf-blk">
      <div class="who">
        <img src="/favicon-192.png" alt="" width="52" height="52"><!-- PNG: html2canvas mangles this SVG in the PDF -->
        <div>
          <div class="nm">UjjainTemple.com</div>
          <div class="ct">
            <?= $h($t('कॉल', 'Call')) ?>: <?= $h($PHONE) ?> · WhatsApp: <?= $h($WA_NUM) ?><br>
            ujjaintemple.com · ByteFlow Technologies Pvt Ltd
          </div>
        </div>
      </div>
      <div class="doctype">
        <div class="k"><?= $h($t('यात्रा कोटेशन', 'Quotation')) ?></div>
        <div class="meta">
          <span><?= $h($t('कोटेशन नं.', 'Quote no.')) ?></span><b><?= $h($q['id']) ?></b>
          <?php if ($issued): ?><span><?= $h($t('जारी', 'Issued')) ?></span><b><?= $h(ut_q_short($issued, $hi)) ?></b><?php endif; ?>
          <?php if (!empty($q['valid_until'])): ?><span><?= $h($t('मान्य', 'Valid until')) ?></span><b><?= $h(ut_q_short($q['valid_until'], $hi)) ?><?= $hi ? ' तक' : '' ?></b><?php endif; ?>
        </div>
        <?php if ($state === 'paid'): ?><span class="stamp paid"><?= $h($t('बुकिंग पक्की', 'Confirmed')) ?></span><?php endif; ?>
        <?php if ($state === 'expired'): ?><span class="stamp expired"><?= $h($t('वैधता समाप्त', 'Expired')) ?></span><?php endif; ?>
      </div>
    </div>

    <section class="blk sec pdf-blk">
      <div class="to">
        <div>
          <div class="lbl"><?= $h($t('इनके लिए', 'Prepared for')) ?></div>
          <div class="cust"><?= $h(ut_q_clean($q['customer']['name'])) ?></div>
          <?php if (!empty($q['customer']['phone'])): ?><div class="ph"><?= $h(ut_q_phone($q['customer']['phone'])) ?></div><?php endif; ?>
        </div>
        <div>
          <div class="lbl"><?= $h($t('यात्रा', 'Trip')) ?></div>
          <p class="trip"><?= $h(ut_q_clean($q['title'])) ?></p>
          <div class="tag"><?= $h($durationText . (!empty($q['tagline']) ? ' · ' . ut_q_clean($q['tagline']) : '')) ?></div>
        </div>
      </div>
      <table class="sum">
        <tr><td class="k"><?= $h($t('यात्रा की तिथि', 'Travel dates')) ?></td><td><?= $h($first === $last ? ut_q_date($first, $hi) : ut_q_date($first, $hi) . ' — ' . ut_q_date($last, $hi)) ?></td></tr>
        <tr><td class="k"><?= $h($t('अवधि', 'Duration')) ?></td><td><?= $h($durationText) ?></td></tr>
        <?php if (!empty($q['vehicle'])): ?><tr><td class="k"><?= $h($t('गाड़ी', 'Vehicle')) ?></td><td><?= $h(ut_q_clean($q['vehicle'])) ?></td></tr><?php endif; ?>
        <?php if ($guests = ut_quote_guests($q, $hi)): ?><tr><td class="k"><?= $h($t('यात्री', 'Guests')) ?></td><td><?= $h($guests) ?></td></tr><?php endif; ?>
        <?php if (!empty($q['room'])): ?><tr><td class="k"><?= $h($t('कमरा', 'Room')) ?></td><td><?= $h(ut_q_clean($q['room'])) ?></td></tr><?php endif; ?>
        <?php if ($meal = ut_quote_meal($q, $hi)): ?><tr><td class="k"><?= $h($t('भोजन योजना', 'Meal plan')) ?></td><td><?= $h($meal) ?></td></tr><?php endif; ?>
      </table>
    </section>

    <section class="blk sec">
      <h2 class="pdf-blk"><?= $h($t('दिन-वार यात्रा योजना', 'Day-by-day plan')) ?></h2>
      <?php foreach ($days as $i => $d): ?>
      <div class="day pdf-blk<?= $i === 0 ? ' first' : '' ?>">
        <div class="dn"><b><?= $h($t('दिन', 'Day')) ?></b><span><?= $i + 1 ?></span></div>
        <div>
          <div class="dd"><?= $h(ut_q_date($d['date'], $hi)) ?></div>
          <div class="ti"><?= $h(ut_q_clean($d['title'])) ?></div>
          <?= ut_q_day($d['details'] ?? '') ?>
        </div>
      </div>
      <?php endforeach; ?>
    </section>

    <?php if ($inItems || $outItems): ?>
    <section class="blk sec pdf-blk">
      <h2><?= $h($t('किराये में क्या शामिल है', 'What the price covers')) ?></h2>
      <div class="cols">
        <div class="box yes"><h3><?= $h($t('शामिल', 'Included')) ?></h3><ul>
          <?php foreach ($inItems as $x) echo '<li>' . $h($x) . '</li>'; ?>
          <?php if (!$inItems) echo '<li>—</li>'; ?>
        </ul></div>
        <div class="box no"><h3><?= $h($t('शामिल नहीं', 'Not included')) ?></h3><ul>
          <?php foreach ($outItems as $x) echo '<li>' . $h($x) . '</li>'; ?>
          <?php if (!$outItems) echo '<li>—</li>'; ?>
        </ul></div>
      </div>
    </section>
    <?php endif; ?>

    <section class="blk sec pdf-blk">
      <h2><?= $h($t('किराया', 'Price')) ?></h2>
      <div class="price">
        <div class="pr tot"><span><?= $h($t('कुल पैकेज राशि', 'Total package cost')) ?></span><span class="a"><?= ut_quote_inr($q['total']) ?></span></div>
        <?php if ($hasAdv): ?>
        <div class="pr"><span><?= $h($t('बुकिंग के लिए एडवांस', 'Advance to confirm the booking')) ?></span><span class="a"><?= ut_quote_inr($q['advance']) ?></span></div>
        <div class="pr sub"><span><?= $h($t('बाकी — यात्रा के दौरान नकद या UPI में', 'Balance — during the trip, cash or UPI')) ?></span><span class="a"><?= ut_quote_inr($q['total'] - $q['advance']) ?></span></div>
        <?php endif; ?>
      </div>
    </section>

    <?php if ($noteLines = ut_q_lines($q['notes'] ?? '')): ?>
    <section class="blk sec pdf-blk">
      <h2><?= $h($t('विशेष टिप्पणी', 'Note')) ?></h2>
      <div class="note"><?= ut_q_text($q['notes']) ?></div>
    </section>
    <?php endif; ?>

    <section class="blk sec pdf-blk">
      <h2><?= $h($t('शर्तें', 'Terms')) ?></h2>
      <ol class="terms">
        <?php if (!empty($q['valid_until'])): ?><li><?= $h($t('यह कोटेशन ' . ut_q_date($q['valid_until'], true) . ' तक मान्य है।', 'This quote is valid until ' . ut_q_date($q['valid_until'], false) . '.')) ?></li><?php endif; ?>
        <li><?= $h($t('किराया ऊपर दी गई यात्रा योजना के लिए तय है।', 'The price is fixed for the plan above.')) ?></li>
        <?php if ($hasAdv): ?>
        <li><?= $h($t(ut_quote_inr($q['advance']) . ' एडवांस देने पर बुकिंग पक्की होती है; बाकी राशि यात्रा के दौरान नकद या UPI में।', 'The booking is confirmed on payment of the ' . ut_quote_inr($q['advance']) . ' advance; the balance is paid during the trip, in cash or by UPI.')) ?></li>
        <li><?= $h($t('यात्रा से 48 घंटे पहले तक रद्द करने पर पूरा एडवांस वापस।', 'Cancel up to 48 hours before the trip for a full refund of the advance.')) ?></li>
        <?php else: ?>
        <li><?= $h($t('बुकिंग पक्की करने के लिए ' . $PHONE . ' पर कॉल करें या ' . $WA_NUM . ' पर WhatsApp करें।', 'To book, call ' . $PHONE . ' or WhatsApp ' . $WA_NUM . '.')) ?></li>
        <?php endif; ?>
      </ol>
    </section>

    <div class="sign pdf-blk">
      <div>
        <div class="thx"><?= $h($t('UjjainTemple.com चुनने के लिए धन्यवाद', 'Thank you for choosing Ujjain Temple')) ?></div>
        <div><?= $h($t('आपकी यात्रा आरामदायक और यादगार बने — यही हमारा प्रयास है।', 'We look forward to making your journey comfortable and memorable.')) ?></div>
        <div style="margin-top:6px"><?= $h($t('बुकिंग व अन्य जानकारी', 'Bookings & enquiries')) ?>: <?= $h($t('कॉल', 'Call')) ?> <?= $h($PHONE) ?> · WhatsApp <?= $h($WA_NUM) ?></div>
      </div>
      <div style="text-align:right;white-space:nowrap">
        UjjainTemple.com<br><a href="https://byteflowtech.in/">ByteFlow Technologies Pvt Ltd</a><br>
        DPIIT-Registered Startup
      </div>
    </div>
  </article>

  <div class="actions">
    <?php if ($state === 'open' && $hasAdv): ?>
      <button class="pay" id="pay" type="button">🔒 <?= $h($t(ut_quote_inr($q['advance']) . ' देकर बुकिंग पक्की करें', 'Pay ' . ut_quote_inr($q['advance']) . ' and confirm')) ?></button>
      <p class="err" id="err" role="alert" hidden></p>
      <p class="muted center" style="margin:0"><?= $h($t('Razorpay से सुरक्षित भुगतान (UPI, कार्ड, नेटबैंकिंग)', 'Secure payment by Razorpay (UPI, card, netbanking)')) ?></p>
    <?php endif; ?>
    <div class="row3">
      <button class="pdf" id="pdf" type="button">⬇ <?= $h($t('PDF डाउनलोड करें', 'Download PDF')) ?></button>
      <a href="<?= $TEL ?>"><?= $h($t('कॉल करें', 'Call')) ?></a>
      <a href="<?= $WA ?>?text=<?= rawurlencode($t('नमस्ते, कोटेशन ' . $q['id'] . ' के बारे में', 'Hello, about quote ' . $q['id'])) ?>">WhatsApp</a>
    </div>
    <?php if ($hasAdv): ?><p class="muted center" style="margin:0"><a href="/<?= $hi ? 'hi/' : '' ?>cancellation-refund-policy/" style="color:var(--maroon)"><?= $h($t('पूरी रिफ़ंड नीति', 'Full refund policy')) ?></a></p><?php endif; ?>
  </div>
<?php endif; ?>

  <footer class="site">UjjainTemple.com · <a href="https://byteflowtech.in/">ByteFlow Technologies Pvt Ltd</a> · DPIIT-Registered Startup</footer>
</main>

<?php if ($q && $state !== 'cancelled'): ?>
<script>
/* PDF: the whole document is drawn once at desktop width (a phone gets the same layout), then
   cut into A4 pages only where a block ends — a day, a price row or a heading never splits.
   Anything going wrong falls back to the browser's print → Save as PDF. */
(function () {
  var btn = document.getElementById('pdf'); if (!btn) return;
  var HI = <?= $hi ? 'true' : 'false' ?>, NAME = <?= json_encode($pdfName) ?>, ID = <?= json_encode($q['id']) ?>;
  var label = btn.innerHTML;
  var load = function (src) {
    return new Promise(function (ok, no) {
      var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s);
    });
  };
  var done = function () { btn.disabled = false; btn.innerHTML = label; };
  btn.addEventListener('click', function () {
    btn.disabled = true; btn.textContent = HI ? 'PDF बन रही है…' : 'Preparing PDF…';
    var blocks = [], docW = 794;
    Promise.all([
      window.html2canvas ? 1 : load('/vendor/html2canvas-1.4.1.min.js'),
      window.jspdf ? 1 : load('/vendor/jspdf-2.5.2.umd.min.js'),
      document.fonts ? document.fonts.ready : 1
    ]).then(function () {
      return window.html2canvas(document.getElementById('doc'), {
        scale: 2, backgroundColor: '#ffffff', windowWidth: 1100, logging: false,
        onclone: function (cd) {
          var d = cd.getElementById('doc'); d.classList.add('pdfmode');
          var r0 = d.getBoundingClientRect(); docW = r0.width;
          Array.prototype.forEach.call(d.querySelectorAll('.pdf-blk'), function (el) {
            var r = el.getBoundingClientRect();
            blocks.push({ top: r.top - r0.top, bottom: r.bottom - r0.top, head: el.tagName === 'H2' });
          });
        }
      });
    }).then(function (canvas) {
      var pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      var M = 10, W = 190, H = 270;                  // mm: side margin, width, usable height
      var k = canvas.width / docW;                    // canvas px per css px
      var pageCss = H * docW / W;                     // css px that fit on one page
      var total = canvas.height / k, cuts = [], start = 0;
      blocks.forEach(function (b, i) {
        if (b.bottom - start <= pageCss) return;
        var at = b.top;
        if (i > 0 && blocks[i - 1].head) at = blocks[i - 1].top;   // keep a heading with its first item
        if (at <= start + 1) at = start + pageCss;                  // a single block taller than a page
        cuts.push([start, at]); start = at;
      });
      while (total - start > pageCss) { cuts.push([start, start + pageCss]); start += pageCss; }
      cuts.push([start, total]);
      cuts.forEach(function (c, i) {
        var sh = Math.round((c[1] - c[0]) * k); if (sh <= 0) return;
        var part = document.createElement('canvas'); part.width = canvas.width; part.height = sh;
        var g = part.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, part.width, sh);
        g.drawImage(canvas, 0, Math.round(c[0] * k), canvas.width, sh, 0, 0, canvas.width, sh);
        if (i > 0) pdf.addPage();
        pdf.addImage(part.toDataURL('image/jpeg', 0.92), 'JPEG', M, M, W, sh * W / canvas.width);
      });
      var n = pdf.getNumberOfPages();
      for (var p = 1; p <= n; p++) {
        pdf.setPage(p); pdf.setFontSize(8); pdf.setTextColor(140);
        pdf.text('UjjainTemple.com  -  ' + ID + '  -  ' + p + ' / ' + n, 105, 290, { align: 'center' });
      }
      pdf.save(NAME);
      done();
    }).catch(function () { done(); window.print(); });
  });
})();
</script>
<?php endif; ?>

<?php if ($q && $state === 'open' && $hasAdv): ?>
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
