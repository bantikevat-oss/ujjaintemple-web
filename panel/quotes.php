<?php
/**
 * UjjainTemple.com — Quote builder (Aman, 2026-10-28).
 * The team builds a custom multi-day package here, then sends the customer the /q/?k=… link on
 * WhatsApp; the customer pays the advance on that page. Same login/session as the image panel.
 *
 * Every "included?" line must be answered (hotel, meals, tickets …) and the day count is computed
 * from the dates — the two gaps that made the 2026-10-28 hand-typed quote ambiguous.
 */

declare(strict_types=1);
require __DIR__ . '/common.php';
require panel_api('quote-lib.php');
require __DIR__ . '/cost-lib.php';

$err = []; $msg = null;
$edit = null;

/** Read and validate the form. Returns [quote fields, errors]. */
function read_form(): array {
  $e = [];
  $name  = trim(strip_tags((string)($_POST['name'] ?? '')));
  $phone = preg_replace('/[^0-9+]/', '', (string)($_POST['phone'] ?? ''));
  $digits = ltrim($phone, '+');
  if (mb_strlen($name) < 2) $e[] = 'Customer ka naam likho.';
  if (strlen($digits) < 10 || strlen($digits) > 15) $e[] = 'Mobile number sahi nahi hai (10 ank, ya +desh code).';
  if (strlen($digits) === 10) $phone = '+91' . $digits;

  $days = [];
  $dDates = $_POST['day_date'] ?? []; $dTitles = $_POST['day_title'] ?? []; $dDetails = $_POST['day_details'] ?? [];
  foreach ((array)$dDates as $i => $d) {
    $d = (string)$d; $ti = trim(strip_tags((string)($dTitles[$i] ?? ''))); $de = trim(strip_tags((string)($dDetails[$i] ?? '')));
    if ($d === '' && $ti === '' && $de === '') continue;
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $d)) { $e[] = 'Din ' . (count($days) + 1) . ': tareekh chuno.'; continue; }
    if ($ti === '') { $e[] = 'Din ' . (count($days) + 1) . ': us din ka kaam likho (jaise "Omkareshwar darshan").'; continue; }
    $days[] = ['date' => $d, 'title' => mb_substr($ti, 0, 120), 'details' => mb_substr($de, 0, 1200)];
  }
  if (!$days) $e[] = 'Kam se kam ek din ki yojana daalo.';
  for ($i = 1; $i < count($days); $i++) if ($days[$i]['date'] < $days[$i - 1]['date']) $e[] = 'Din ' . ($i + 1) . ' ki tareekh pichhle din se pehle hai.';
  if ($days && $days[0]['date'] < date('Y-m-d')) $e[] = 'Pehle din ki tareekh beet chuki hai.';

  $items = [];
  foreach (UT_QUOTE_ITEMS as $k => $label) {
    $v = (string)($_POST['item_' . $k] ?? '');
    if (!in_array($v, ['in', 'out', 'na'], true)) { $e[] = '"' . $label['hi'] . '" — shaamil hai ya nahi, chuno.'; continue; }
    $items[$k] = $v;
  }
  $lines = function ($s) { return array_values(array_filter(array_map(function ($x) { return mb_substr(trim(strip_tags($x)), 0, 120); }, preg_split('/\r?\n/', (string)$s)))); };

  $total = (int)($_POST['total'] ?? 0); $adv = (int)($_POST['advance'] ?? 0);
  if ($total < 500) $e[] = 'Kul kiraya likho (kam se kam ₹500).';
  // Advance is optional (Aman 2026-10-28: a quotation is sent before any money is asked for).
  // 0 / blank = no advance on the link; the team confirms by call and can add one later by editing.
  if ($adv < 0 || ($adv > 0 && ($adv < 100 || $adv > $total))) $e[] = 'Advance khaali chhodo, ya ₹100 se kul kiraye ke beech likho.';
  $valid = (string)($_POST['valid_until'] ?? '');
  if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $valid) || $valid < date('Y-m-d')) $e[] = 'Quote kab tak maanya hai — aaj ya aage ki tareekh chuno.';
  $title = trim(strip_tags((string)($_POST['title'] ?? '')));
  if (mb_strlen($title) < 4) $e[] = 'Yatra ka naam likho (jaise "Indore – Omkareshwar – Ujjain yatra").';

  return [[
    'customer'    => ['name' => mb_substr($name, 0, 60), 'phone' => $phone],
    'locale'      => ($_POST['locale'] ?? 'hi') === 'en' ? 'en' : 'hi',
    'title'       => mb_substr($title, 0, 120),
    'vehicle'     => mb_substr(trim(strip_tags((string)($_POST['vehicle'] ?? ''))), 0, 60),
    // Guests split into adults + children with ages, plus room and meal plan (Aman's package
    // format, 2026-10-28). pax stays as the total so older code and quotes keep working.
    'adults'      => $ad = max(0, min(60, (int)($_POST['adults'] ?? 0))),
    'children'    => $ch = max(0, min(30, (int)($_POST['children'] ?? 0))),
    'child_ages'  => $ch ? mb_substr(trim(strip_tags((string)($_POST['child_ages'] ?? ''))), 0, 60) : '',
    'pax'         => $ad + $ch,
    'tagline'     => mb_substr(trim(strip_tags((string)($_POST['tagline'] ?? ''))), 0, 80),
    'room'        => mb_substr(trim(strip_tags((string)($_POST['room'] ?? ''))), 0, 100),
    'meal_plan'   => isset(UT_QUOTE_MEALS[(string)($_POST['meal_plan'] ?? '')]) ? (string)$_POST['meal_plan'] : '',
    'days'        => $days,
    'items'       => $items,
    'extra_in'    => $lines($_POST['extra_in'] ?? ''),
    'extra_out'   => $lines($_POST['extra_out'] ?? ''),
    'total'       => $total,
    'advance'     => $adv,
    'valid_until' => $valid,
    'notes'       => mb_substr(trim(strip_tags((string)($_POST['notes'] ?? ''))), 0, 1000),
    // "Package banao" working (lagat, munafa, lines) — team only. /q/ and the WhatsApp text never print it.
    'calc'        => read_calc((string)($_POST['calc'] ?? '')),
  ], $e];
}

/** The builder's JSON from the hidden field: kept only if it parses and is small. */
function read_calc(string $raw) {
  if ($raw === '' || strlen($raw) > 30000) return null;
  $j = json_decode($raw, true);
  return is_array($j) && isset($j['state'], $j['lines'], $j['totals']) ? $j : null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  check_csrf();
  $act = (string)($_POST['do'] ?? '');
  $payments = ut_quote_payments();

  if ($act === 'save') {
    list($f, $err) = read_form();
    $id = (string)($_POST['id'] ?? '');
    $old = $id !== '' ? ut_quote_load($id) : null;
    if ($id !== '' && !$old) $err[] = 'Ye quote mila nahi.';
    if ($old && ut_quote_state($old, $payments) === 'paid') $err[] = 'Iska advance aa chuka hai — paid quote badla nahi ja sakta. Naya quote banao.';
    if (!$err) {
      $q = $old ?: ['id' => ut_quote_next_id(), 'token' => bin2hex(random_bytes(10)), 'created_at' => date('Y-m-d H:i:s'), 'status' => 'open'];
      $q = array_merge($q, $f);
      $q['status'] = 'open';
      if (ut_quote_save($q)) { header('Location: ?saved=' . urlencode($q['id'])); exit; }
      $err[] = 'Save nahi ho paya (server folder likhne layak nahi).';
    }
    $edit = array_merge(['id' => $id], $f);
  } elseif ($act === 'cancel') {
    $q = ut_quote_load((string)($_POST['id'] ?? ''));
    if ($q && ut_quote_state($q, $payments) !== 'paid') { $q['status'] = 'cancelled'; ut_quote_save($q); header('Location: ?cancelled=' . urlencode($q['id'])); exit; }
    $err[] = 'Ye quote cancel nahi ho sakta.';
  }
}

if (isset($_GET['edit'])) $edit = ut_quote_load((string)$_GET['edit']);
if (isset($_GET['copy']) && ($src = ut_quote_load((string)$_GET['copy']))) {
  $edit = $src; unset($edit['id'], $edit['token']);   // duplicate → saves as a new quote
}
if (isset($_GET['saved'])) $msg = 'Quote ' . h($_GET['saved']) . ' save ho gaya — neeche se link copy karo ya WhatsApp pe bhejo.';
if (isset($_GET['cancelled'])) $msg = 'Quote ' . h($_GET['cancelled']) . ' cancel ho gaya. Iska link ab "uplabdh nahi" dikhayega.';

$showForm = $edit !== null || isset($_GET['new']) || $err;
$quotes = ut_quote_all();
$payments = ut_quote_payments();
$e = $edit ?: [];
$days = !empty($e['days']) ? $e['days'] : [['date' => '', 'title' => '', 'details' => '']];
$defaultValid = date('Y-m-d', strtotime('+3 days'));

// Package builder data (lagat.php answers). Sent to the page's script; the team sees cost + margin.
$pbData = ut_costs();
$pbCat = ut_cost_catalog($pbData);
$pbJs = [
  'cat'    => $pbCat,
  'plans'  => UT_COST_PLANS,
  'hotels' => UT_COST_HOTEL_ROWS,
  'cars'   => UT_COST_SECTIONS['cab']['cols'],
  'rooms'  => UT_COST_SECTIONS['hotel']['cols'],
  'set'    => [
    'markup_pct' => ut_cost_markup($pbData),
    'round_to'   => ut_cost_setting($pbData, 'rules', 'round_to') ?: 100,
    'min_profit' => ut_cost_setting($pbData, 'rules', 'min_profit') ?: 0,
    'gst_pct'    => ut_cost_setting($pbData, 'rules', 'gst_pct') ?: 0,
    'peak_pct'   => ut_cost_setting($pbData, 'hotel', 'peak_pct') ?: 0,
    'child_free_age' => ut_cost_setting($pbData, 'rules', 'child_free_age') ?? 5,
  ],
];

function wa_text(array $q): string {
  $hi = ($q['locale'] ?? 'hi') !== 'en';
  $first = $q['customer']['name'];
  return $hi
    ? "नमस्ते {$first} जी, आपकी यात्रा \"{$q['title']}\" का कोटेशन यहाँ है:\n" . ut_quote_url($q) . "\n\nकुल किराया " . ut_quote_inr($q['total']) . ($q['advance'] > 0 ? " · बुकिंग के लिए " . ut_quote_inr($q['advance']) . " एडवांस।" : "। बुकिंग के लिए हमें कॉल या WhatsApp करें।") . "\n— UjjainTemple.com"
    : "Hello {$first}, here is the quote for your trip \"{$q['title']}\":\n" . ut_quote_url($q) . "\n\nTotal " . ut_quote_inr($q['total']) . ($q['advance'] > 0 ? " · advance " . ut_quote_inr($q['advance']) . " to confirm." : ". Call or WhatsApp us to book.") . "\n— UjjainTemple.com";
}
?>
<!doctype html>
<html lang="hi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>UjjainTemple — Quotes</title>
<style>
  :root{--navy:#0f1f3d;--gold:#c99a3b;--cream:#faf6ee;--ink:#1c2431;--muted:#6b7686;--line:#e7ded0;--red:#b3341f;--maroon:#8B1A1A}
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;background:var(--cream);color:var(--ink)}
  header.top{background:var(--navy);color:#fff;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;position:sticky;top:0;z-index:20}
  header.top b{font-size:17px} header.top .gold{color:var(--gold)}
  header.top nav a{color:#fff;text-decoration:none;font-size:13px;border:1px solid rgba(255,255,255,.3);padding:6px 12px;border-radius:8px;margin-left:6px}
  header.top nav a.on{background:var(--gold);border-color:var(--gold);color:var(--navy)}
  .wrap{max-width:1100px;margin:0 auto;padding:20px}
  .flash{padding:12px 16px;border-radius:10px;margin:14px 0;font-size:14px}
  .flash.ok{background:#eef4ff;border:1px solid #b9cdf2;color:var(--navy)}
  .flash.err{background:#fbeae7;border:1px solid #eab5ab;color:var(--red)}
  .flash.err li{margin:2px 0}
  .bar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:8px 0 14px}
  .bar h1{font-size:20px;margin:0;color:var(--navy)}
  .b{display:inline-block;font-size:13px;font-weight:600;padding:8px 12px;border-radius:8px;border:1px solid var(--line);background:#fff;color:var(--ink);text-decoration:none;cursor:pointer}
  .b.p{background:var(--navy);color:#fff;border-color:var(--navy)}
  .b.wa{background:#25D366;color:#fff;border-color:#25D366}
  .b.x{color:var(--red);border-color:#e6c2ba}
  table{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden;font-size:14px}
  th,td{padding:10px 12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
  th{font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);background:#fbf8f2}
  td .sub{color:var(--muted);font-size:12px}
  .st{font-size:11px;font-weight:700;padding:3px 8px;border-radius:999px;text-transform:uppercase}
  .st.open{background:#eef4ff;color:var(--navy)} .st.paid{background:var(--maroon);color:#fff} .st.expired,.st.cancelled{background:#eee;color:#666}
  .acts{display:flex;flex-wrap:wrap;gap:6px}
  form.q{background:#fff;border:1px solid var(--line);border-radius:14px;padding:20px;margin-bottom:22px}
  fieldset{border:0;border-top:2px solid var(--gold);margin:18px 0 0;padding:14px 0 0}
  legend{font-weight:700;color:var(--navy);padding-right:10px}
  .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
  label{display:block;font-size:12px;font-weight:700;color:var(--muted);margin-bottom:4px}
  input,select,textarea{width:100%;padding:10px;border:1px solid var(--line);border-radius:9px;font:inherit;font-size:14px;background:#fff}
  textarea{min-height:64px;resize:vertical}
  .day{display:grid;grid-template-columns:150px 1fr auto;gap:10px;align-items:start;padding:10px;border:1px solid var(--line);border-radius:10px;margin-top:10px}
  .day textarea{grid-column:2/3;min-height:48px}
  .day .n{font-weight:800;color:var(--navy)}
  .items{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}
  .items div{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid var(--line);border-radius:9px;padding:6px 10px}
  .items select{width:auto}
  .hint{font-size:12px;color:var(--muted);margin-top:4px}
  .save{margin-top:18px;display:flex;gap:10px}
  .ml{display:none;color:var(--muted);font-size:12px}
  @media (max-width:640px){.day{grid-template-columns:1fr}.day textarea{grid-column:auto}table,thead,tbody,tr,td,th{display:block}thead{display:none}td{border:0;padding:6px 12px}tr{border-bottom:1px solid var(--line);padding:8px 0}.ml{display:inline}}
</style>
</head>
<body>
<header class="top">
  <b>UjjainTemple <span class="gold">Quotes</span></b>
  <nav><?= panel_nav('quotes.php') ?></nav>
</header>
<div class="wrap">
  <?php if ($msg): ?><div class="flash ok"><?= $msg ?></div><?php endif; ?>
  <?php if ($err): ?><div class="flash err"><b>Save nahi hua:</b><ul><?php foreach ($err as $x) echo '<li>' . h($x) . '</li>'; ?></ul></div><?php endif; ?>

  <?php if ($showForm): ?>
  <form class="q" method="post" autocomplete="off">
    <input type="hidden" name="csrf" value="<?= h(csrf()) ?>">
    <input type="hidden" name="do" value="save">
    <input type="hidden" name="id" value="<?= h($e['id'] ?? '') ?>">
    <div class="bar"><h1><?= !empty($e['id']) ? 'Quote ' . h($e['id']) . ' badlo' : 'Naya quote' ?></h1><a class="b" href="?">← List</a></div>

    <fieldset><legend>Customer</legend><div class="g">
      <div><label>Naam *</label><input name="name" required maxlength="60" value="<?= h($e['customer']['name'] ?? '') ?>"></div>
      <div><label>Mobile *</label><input name="phone" required inputmode="tel" maxlength="18" value="<?= h($e['customer']['phone'] ?? '') ?>" placeholder="10 ank ya +desh code"></div>
      <div><label>Bade (adults)</label><input name="adults" type="number" min="0" max="60" value="<?= h($e['adults'] ?? (empty($e['children']) ? ($e['pax'] ?? '') : '')) ?>"></div>
      <div><label>Bachche</label><input name="children" type="number" min="0" max="30" value="<?= h($e['children'] ?? '') ?>"></div>
      <div><label>Bachchon ki umar</label><input name="child_ages" maxlength="60" value="<?= h($e['child_ages'] ?? '') ?>" placeholder="jaise: 11, 5"></div>
      <div><label>Customer ka page kis bhasha me</label><select name="locale">
        <option value="hi" <?= ($e['locale'] ?? 'hi') === 'hi' ? 'selected' : '' ?>>हिंदी</option>
        <option value="en" <?= ($e['locale'] ?? '') === 'en' ? 'selected' : '' ?>>English</option></select>
        <div class="hint">Yojana ka text bhi isi bhasha me likho.</div></div>
    </div></fieldset>

    <fieldset id="pb"><legend>Package banao — lagat se apne aap</legend>
      <?php if (!$pbCat): ?><div class="flash err" style="margin:0 0 10px">Abhi koi rate bhara nahi hai. Pehle <a href="lagat.php">Lagat</a> me vendor rate + markup bharo, phir yahan package apne aap banega.</div><?php endif; ?>
      <div class="hint" style="margin:0 0 10px">Log (upar), din-wise plan, gaadi aur hotel chuno → "Package banao". Lagat aur munafa sirf team ko dikhte hain; customer ko sirf kul daam jaata hai.</div>
      <div class="g">
        <div><label>Pehla din</label><input type="date" id="pbStart"></div>
        <div><label>Gaadi</label><select id="pbCar"><option value="auto">Apne aap (logon ke hisaab se)</option>
          <?php foreach (UT_COST_SECTIONS['cab']['cols'] as $c => $cl): ?><option value="<?= h($c) ?>"><?= h($cl) ?></option><?php endforeach; ?></select><div class="hint" id="pbCarHint"></div></div>
        <div><label>Hotel</label><select id="pbHotel"><option value="">Hotel nahi</option>
          <?php foreach (UT_COST_SECTIONS['hotel']['cols'] as $c => $cl): ?><option value="<?= h($c) ?>"><?= h($cl) ?></option><?php endforeach; ?></select></div>
        <div><label>Kamre · extra bed</label><div style="display:flex;gap:6px"><input type="number" id="pbRooms" min="0" max="30" placeholder="auto"><input type="number" id="pbExtra" min="0" max="30" placeholder="auto"></div><div class="hint" id="pbRoomHint">Khaali = bade logon se apne aap (2 per kamra)</div></div>
        <div><label>Meal plan</label><select id="pbMeal"><?php foreach (UT_QUOTE_MEALS as $mk => $ml): ?><option value="<?= h($mk) ?>"><?= h($ml['en']) ?></option><?php endforeach; ?></select></div>
        <div><label>Net rate pe % (is quote ke liye)</label><input type="number" id="pbMarkup" min="0" max="300" step="any" value="<?= h(rtrim(rtrim(number_format(ut_cost_markup($pbData), 2, '.', ''), '0'), '.')) ?>"><div class="hint">Default Lagat → Niyam se. Sell rate pe kuch nahi judta.</div></div>
        <div><label>&nbsp;</label><label style="display:flex;gap:8px;align-items:center;font-weight:600;color:var(--ink)"><input type="checkbox" id="pbPeak" style="width:auto"> Weekend / tyohaar rate</label></div>
      </div>
      <div style="margin-top:12px"><label>Hotel ka rate — is quote ke liye (₹ net, ek kamra / raat · extra bed)</label>
        <div class="g" id="pbHR">
          <?php foreach (['ujjain' => 'Ujjain', 'omk' => 'Omkareshwar', 'indore' => 'Indore', 'mah' => 'Maheshwar'] as $hc => $hl): ?>
          <div><span class="hint" style="margin:0"><?= h($hl) ?></span><div style="display:flex;gap:6px"><input type="number" min="0" step="any" class="pbHR" data-city="<?= h($hc) ?>" data-f="room" placeholder="kamra"><input type="number" min="0" step="any" class="pbHR" data-city="<?= h($hc) ?>" data-f="extra" placeholder="extra bed"></div></div>
          <?php endforeach; ?>
        </div>
        <div class="hint">Hotel se phone pe mila rate. Bhara → sirf chuni hui class ke liye Lagat ki jagah ye lagega. Khaali → Lagat.</div></div>
      <div id="pbDays" style="margin-top:12px"></div>
      <button type="button" class="b" id="pbAddDay" style="margin-top:8px">+ Din</button>
      <div class="g" style="margin-top:12px" id="pbExtras">
        <label style="display:flex;gap:8px;align-items:center;font-weight:600;color:var(--ink)"><input type="checkbox" id="pbBoat" style="width:auto" checked> Omkareshwar nauka vihar</label>
        <label style="display:flex;gap:8px;align-items:center;font-weight:600;color:var(--ink)"><input type="checkbox" id="pbWater" style="width:auto"> Paani / welcome kit</label>
        <?php foreach (UT_COST_SECTIONS['puja']['rows'] as $pk => $pdef): ?>
        <div><label><?= h($pdef[0]) ?></label><select class="pbPuja" data-puja="<?= h($pk) ?>"><option value="">Nahi</option>
          <?php foreach (UT_COST_SECTIONS['puja']['cols'] as $tc => $tl): ?><option value="<?= h($tc) ?>"><?= h($tl) ?></option><?php endforeach; ?></select></div>
        <?php endforeach; ?>
      </div>
      <div style="margin-top:12px"><label>Aur kharcha (jo Lagat me nahi — customer ki khaas maang)</label><div id="pbLines"></div>
        <button type="button" class="b" id="pbAddLine" style="margin-top:6px">+ Kharcha</button></div>
      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="b p" id="pbGo">Package banao</button><button type="button" class="b" id="pbApply" disabled>Quote me bharo ↓</button><button type="button" class="b" id="pbOptCopy" disabled>Options text copy</button></div>
      <div id="pbOut" style="margin-top:12px"></div>
      <div id="pbOpts" style="margin-top:12px"></div>
      <input type="hidden" name="calc" id="pbCalc" value="<?= h(!empty($e['calc']) ? json_encode($e['calc'], JSON_UNESCAPED_UNICODE) : '') ?>">
    </fieldset>

    <fieldset><legend>Yatra</legend><div class="g">
      <div style="grid-column:span 2"><label>Yatra ka naam *</label><input name="title" required maxlength="120" value="<?= h($e['title'] ?? '') ?>" placeholder="इंदौर – ओंकारेश्वर – उज्जैन यात्रा"></div>
      <div><label>Gaadi</label><input name="vehicle" list="cars" maxlength="60" value="<?= h($e['vehicle'] ?? '') ?>" placeholder="Swift Dzire"></div>
      <div><label>Package ka prakaar (optional)</label><input name="tagline" maxlength="80" value="<?= h($e['tagline'] ?? '') ?>" placeholder="Family Darshan Package"></div>
      <div><label>Kamra (hotel ho to)</label><input name="room" list="rooms" maxlength="100" value="<?= h($e['room'] ?? '') ?>" placeholder="Double Bed AC Room + 1 extra mattress"></div>
      <div><label>Meal plan (hotel ho to)</label><select name="meal_plan">
        <option value="">— nahi / lagu nahi —</option>
        <?php foreach (UT_QUOTE_MEALS as $mk => $ml): ?><option value="<?= h($mk) ?>" <?= ($e['meal_plan'] ?? '') === $mk ? 'selected' : '' ?>><?= h($ml['en']) ?></option><?php endforeach; ?>
      </select></div>
    </div>
    <datalist id="rooms"><option value="Double Bed AC Room"><option value="Double Bed AC Room + 1 extra mattress"><option value="Triple Bed AC Room"><option value="Family Room (4 bed)"></datalist>
    <datalist id="cars"><option value="Swift Dzire"><option value="Ertiga"><option value="Innova Crysta"><option value="Tempo Traveller"></datalist>
    <div id="days">
      <?php foreach ($days as $i => $d): ?>
      <div class="day">
        <div><span class="n">Din <?= $i + 1 ?></span><input type="date" name="day_date[]" value="<?= h($d['date']) ?>"></div>
        <input name="day_title[]" maxlength="120" value="<?= h($d['title']) ?>" placeholder="Us din kya hoga — jaise: इंदौर पिकअप, रात इंदौर में">
        <button type="button" class="b x rm" title="Ye din hatao">✕</button>
        <textarea name="day_details[]" maxlength="1200" placeholder="Har baat nayi line me. Heading ke aakhir me : lagao, uske neeche ki lines list banengi —&#10;Ujjain station se pickup&#10;Hotel check-in&#10;Ujjain local darshan:&#10;Mahakaleshwar Jyotirlinga&#10;Harsiddhi Mata Mandir"><?= h($d['details']) ?></textarea>
      </div>
      <?php endforeach; ?>
    </div>
    <button type="button" class="b" id="addDay" style="margin-top:10px">+ Ek din aur</button>
    <div class="hint">Din aur raat ki ginti tareekhon se apne aap banegi — "2 din" haath se mat likho.</div>
    </fieldset>

    <fieldset><legend>Kya shaamil hai — har line chuno *</legend>
      <div class="items">
      <?php foreach (UT_QUOTE_ITEMS as $k => $label): $v = $e['items'][$k] ?? ''; ?>
        <div><span><?= h($label['hi']) ?></span><select name="item_<?= $k ?>" required>
          <option value="" <?= $v === '' ? 'selected' : '' ?>>— chuno —</option>
          <option value="in" <?= $v === 'in' ? 'selected' : '' ?>>✓ Shaamil</option>
          <option value="out" <?= $v === 'out' ? 'selected' : '' ?>>✕ Shaamil nahi</option>
          <option value="na" <?= $v === 'na' ? 'selected' : '' ?>>Lagu nahi</option>
        </select></div>
      <?php endforeach; ?>
      </div>
      <div class="g" style="margin-top:12px">
        <div><label>Aur kya shaamil hai (har line alag)</label><textarea name="extra_in" placeholder="इंदौर स्टेशन ड्रॉप"><?= h(implode("\n", $e['extra_in'] ?? [])) ?></textarea></div>
        <div><label>Aur kya shaamil nahi (har line alag)</label><textarea name="extra_out" placeholder="निजी ख़र्च"><?= h(implode("\n", $e['extra_out'] ?? [])) ?></textarea></div>
      </div>
    </fieldset>

    <fieldset><legend>Daam</legend><div class="g">
      <div><label>Kul tay kiraya (₹) *</label><input name="total" id="total" type="number" min="500" required value="<?= h($e['total'] ?? '') ?>"></div>
      <div><label>Advance (₹) — optional</label><input name="advance" id="advance" type="number" min="0" placeholder="Abhi nahi to khaali chhodo" value="<?= h(!empty($e['advance']) ? $e['advance'] : '') ?>"><div class="hint" id="advHint">Khaali = abhi advance nahi · link pe payment button nahi aayega</div></div>
      <div><label>Quote kab tak maanya *</label><input name="valid_until" type="date" required value="<?= h($e['valid_until'] ?? $defaultValid) ?>"></div>
    </div>
    <div style="margin-top:12px"><label>Note customer ke liye (optional)</label><textarea name="notes" maxlength="1000" placeholder="जैसे: 24 तारीख़ की पूजा दोपहर 2 बजे तक पूरी होगी, ताकि 7:30 की ट्रेन आराम से मिले।"><?= h($e['notes'] ?? '') ?></textarea></div>
    </fieldset>

    <div class="save"><button class="b p" type="submit">Save quote</button><a class="b" href="?">Chhodo</a></div>
  </form>
  <?php endif; ?>

  <div class="bar"><h1>Quotes (<?= count($quotes) ?>)</h1><a class="b p" href="?new=1">+ Naya quote</a></div>
  <?php if (!$quotes): ?>
    <p style="color:var(--muted)">Abhi koi quote nahi. "+ Naya quote" se shuru karo.</p>
  <?php else: ?>
  <table>
    <thead><tr><th>Quote</th><th>Customer</th><th>Yatra</th><th>Daam</th><th>Status</th><th></th></tr></thead>
    <tbody>
    <?php foreach ($quotes as $q): $st = ut_quote_state($q, $payments); $d = $q['days']; ?>
      <tr>
        <td><b><?= h($q['id']) ?></b><div class="sub"><?= h(substr($q['created_at'], 0, 16)) ?></div></td>
        <td><?= h($q['customer']['name']) ?><div class="sub"><?= h($q['customer']['phone']) ?></div></td>
        <td><?= h($q['title']) ?><div class="sub"><?= h($d[0]['date'] . ($d[count($d) - 1]['date'] !== $d[0]['date'] ? ' → ' . $d[count($d) - 1]['date'] : '')) ?> · <?= count($d) ?> din-entry</div></td>
        <td><?= ut_quote_inr($q['total']) ?><div class="sub"><?= $q['advance'] > 0 ? 'adv ' . ut_quote_inr($q['advance']) : 'advance nahi' ?></div></td>
        <td><span class="st <?= $st ?>"><?= $st === 'paid' ? 'Paid' : ($st === 'open' ? 'Bheja / khula' : ($st === 'expired' ? 'Expired' : 'Cancelled')) ?></span></td>
        <td><div class="acts">
          <a class="b" href="<?= h('/q/?k=' . $q['token']) ?>" target="_blank" rel="noopener">Dekho</a>
          <?php if ($st === 'open'): ?>
            <button class="b cp" type="button" data-url="<?= h(ut_quote_url($q)) ?>">Link copy</button>
            <a class="b wa" target="_blank" rel="noopener" href="https://wa.me/<?= h(ltrim($q['customer']['phone'], '+')) ?>?text=<?= rawurlencode(wa_text($q)) ?>">WhatsApp</a>
            <button class="b cpt" type="button" data-text="<?= h(ut_quote_package_text($q)) ?>" title="Poora package (din-wise, daam, kya shaamil) WhatsApp format me copy">Package text copy</button>
          <?php endif; ?>
          <?php if ($st !== 'paid'): ?><a class="b" href="?edit=<?= h($q['id']) ?>">Badlo</a><?php endif; ?>
          <a class="b" href="?copy=<?= h($q['id']) ?>" title="Isi jaisa naya quote">Copy banao</a>
          <?php if ($st === 'open' || $st === 'expired'): ?>
            <form method="post" onsubmit="return confirm('Quote <?= h($q['id']) ?> cancel karein? Customer ka link band ho jaayega.')" style="display:inline">
              <input type="hidden" name="csrf" value="<?= h(csrf()) ?>"><input type="hidden" name="do" value="cancel"><input type="hidden" name="id" value="<?= h($q['id']) ?>">
              <button class="b x" type="submit">Cancel</button></form>
          <?php endif; ?>
        </div></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  <p class="hint" style="margin-top:10px">Paid hone par booking ka mail aata hai aur CRM me lead jaata hai (channel <i>booking</i>) — yatra ke baad CRM me WON karo.</p>
  <?php endif; ?>
</div>

<script>
(function () {
  var days = document.getElementById('days');
  if (days) {
    var renumber = function () { days.querySelectorAll('.day .n').forEach(function (n, i) { n.textContent = 'Din ' + (i + 1); }); };
    document.getElementById('addDay').addEventListener('click', function () {
      var rows = days.querySelectorAll('.day'), last = rows[rows.length - 1], row = last.cloneNode(true);
      row.querySelectorAll('input,textarea').forEach(function (x) { x.value = ''; });
      var prev = last.querySelector('input[type=date]').value;
      if (prev) { var d = new Date(prev + 'T00:00:00'); d.setDate(d.getDate() + 1); row.querySelector('input[type=date]').value = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-'); }
      days.appendChild(row); renumber();
    });
    days.addEventListener('click', function (ev) {
      if (!ev.target.classList.contains('rm')) return;
      if (days.querySelectorAll('.day').length > 1) { ev.target.closest('.day').remove(); renumber(); }
    });
    var total = document.getElementById('total'), adv = document.getElementById('advance'), hint = document.getElementById('advHint');
    var upd = function () {
      var t = +total.value || 0;
      hint.textContent = !(+adv.value) ? 'Khaali = abhi advance nahi · link pe payment button nahi aayega'
        : (t ? 'Sujhav: 20–25% = ₹' + Math.round(t * 0.2) + '–' + Math.round(t * 0.25) : 'Sujhav: 20–25%');
    };
    total.addEventListener('input', upd); adv.addEventListener('input', upd); upd();
  }
  document.querySelectorAll('.cpt').forEach(function (b) {
    b.addEventListener('click', function () {
      navigator.clipboard.writeText(b.dataset.text).then(function () { b.textContent = 'Copied ✓ — WhatsApp me paste karo'; setTimeout(function () { b.textContent = 'Package text copy'; }, 2500); });
    });
  });
  document.querySelectorAll('.cp').forEach(function (b) {
    b.addEventListener('click', function () {
      navigator.clipboard.writeText(b.dataset.url).then(function () { b.textContent = 'Copied ✓'; setTimeout(function () { b.textContent = 'Link copy'; }, 1500); });
    });
  });
})();
</script>
<?php if ($showForm): ?>
<script>
// Package builder: plan + people + car + hotel → priced lines from the Lagat sheet → fills the quote.
(function () {
  var D = <?= json_encode($pbJs, JSON_UNESCAPED_UNICODE) ?>;
  var $ = function (id) { return document.getElementById(id); };
  var f = document.querySelector('form.q'), E = f ? f.elements : null, daysBox = $('pbDays'), out = $('pbOut'), last = null;
  var inr = function (n) { return '₹' + Math.round(n).toLocaleString('en-IN'); };
  var CAR_NAMES = { dzire: 'Swift Dzire', ertiga: 'Ertiga', innova: 'Innova Crysta', tempo: 'Tempo Traveller' };
  var CAR_SEATS = [['dzire', 4], ['ertiga', 6], ['innova', 7], ['tempo', 12]];
  var CITY = { ujjain: ['उज्जैन', 'Ujjain'], omk: ['ओंकारेश्वर', 'Omkareshwar'], indore: ['इंदौर', 'Indore'], mah: ['महेश्वर', 'Maheshwar'] };
  var esc = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var planOpts = '<option value="">— kuch nahi —</option>' + Object.keys(D.plans).map(function (k) {
    return '<option value="' + k + '">' + D.plans[k].team + '</option>';
  }).join('');
  var addDay = function (p1, p2) {
    var row = document.createElement('div');
    row.className = 'pbday';
    row.style.cssText = 'display:grid;grid-template-columns:70px 1fr 1fr 34px;gap:8px;align-items:center;margin-top:6px';
    row.innerHTML = '<b class="n" style="color:var(--navy)"></b><select class="p1">' + planOpts + '</select><select class="p2">' + planOpts +
      '</select><button type="button" class="b x" title="Hatao">✕</button>';
    row.querySelector('.p1').value = p1 || ''; row.querySelector('.p2').value = p2 || '';
    row.querySelector('button').addEventListener('click', function () { if (daysBox.children.length > 1) { row.remove(); num(); } });
    daysBox.appendChild(row); num();
  };
  var num = function () { [].forEach.call(daysBox.children, function (r, i) { r.querySelector('.n').textContent = 'Din ' + (i + 1); }); };
  $('pbAddDay').addEventListener('click', function () { addDay(); });

  // Children by age (Aman 2026-10-30): below Niyam → child_free_age they pay for nothing but a car seat;
  // from that age on they count like an adult for bed, meals, boat and kit. Ages missing → counted as paying.
  var people = function () {
    var a = +E.adults.value || 0, c = +E.children.value || 0, free = +D.set.child_free_age || 0;
    var ages = (E.child_ages.value.match(/\d+/g) || []).map(Number), kidsFree = 0;
    for (var i = 0; i < c; i++) if (ages[i] !== undefined && ages[i] < free) kidsFree++;
    return { adults: a, children: c, pax: a + c, paying: a + c - kidsFree, kidsFree: kidsFree, noAge: Math.max(0, c - ages.length) };
  };
  var carFor = function (pax) { for (var i = 0; i < CAR_SEATS.length; i++) if (pax <= CAR_SEATS[i][1]) return CAR_SEATS[i][0]; return null; };
  // 2 per room; one extra bed per room at most — a second one means another room.
  var roomsFor = function (P) {
    var beds = P.paying, rooms = Math.max(1, Math.floor(P.adults / 2)), extra = Math.max(0, beds - 2 * rooms);
    while (extra > rooms) { rooms++; extra = Math.max(0, beds - 2 * rooms); }
    return [rooms, extra];
  };
  var hotelRate = function (city, f) {
    var x = document.querySelector('.pbHR[data-city="' + city + '"][data-f="' + f + '"]');
    return x && x.value !== '' ? +x.value : null;
  };
  var addLine = function (l) {
    var row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:2fr 70px 1fr 90px 34px;gap:8px;align-items:center;margin-top:6px';
    row.innerHTML = '<input class="l1" maxlength="80" placeholder="kya (jaise: doosri gaadi)"><input class="l2" type="number" min="1" value="1">' +
      '<input class="l3" type="number" min="0" step="any" placeholder="rate ₹"><select class="l4"><option value="net">Net</option><option value="sell">Sell</option></select><button type="button" class="b x" title="Hatao">✕</button>';
    if (l) { row.querySelector('.l1').value = l[0] || ''; row.querySelector('.l2').value = l[1] || 1; row.querySelector('.l3').value = l[2] === null || l[2] === undefined ? '' : l[2]; row.querySelector('.l4').value = l[3] === 'sell' ? 'sell' : 'net'; }
    row.querySelector('button').addEventListener('click', function () { row.remove(); });
    $('pbLines').appendChild(row);
  };
  $('pbAddLine').addEventListener('click', function () { addLine(); });
  var customLines = function () {
    return [].map.call($('pbLines').children, function (r) {
      return [r.querySelector('.l1').value.trim(), +r.querySelector('.l2').value || 1, r.querySelector('.l3').value === '' ? null : +r.querySelector('.l3').value, r.querySelector('.l4').value];
    }).filter(function (l) { return l[0] || l[2] !== null; });
  };

  // Prices the trip for one hotel class ('' = no hotel). No DOM writes: build() and the options table both call it.
  var price = function (hotel) {
    var P = people(), lines = [], warn = [], missingHotel = false;
    var car = $('pbCar').value === 'auto' ? carFor(P.pax || 1) : $('pbCar').value;
    if (!car) { warn.push('12 se zyada log: ek gaadi kaafi nahi — do quote line haath se jodo ya Tempo chuno.'); car = 'tempo'; }
    if (!P.pax) warn.push('Upar "Bade (adults)" bharo — hotel, khana, nauka inhi se ginte hain.');
    if (P.noAge) warn.push(P.noAge + ' bachche ki umar nahi likhi — use poora vyakti gina hai. "Bachchon ki umar" bharo.');
    var add = function (key, label, qty, peak, own) {
      if (!qty) return;
      if (own) { lines.push({ k: key, label: label + ' (is quote ka rate)', qty: qty, unit: own.unit, rate: own.rate, kind: 'net' }); return; }
      var c = D.cat[key], peakPct = peak ? +D.set.peak_pct || 0 : 0;
      if (!c) { lines.push({ k: key, label: label, qty: qty, rate: null, kind: null }); warn.push('"' + label + '" ka rate Lagat me nahi hai — total me nahi juda.'); if (/^hotel\./.test(key)) missingHotel = true; return; }
      lines.push({ k: key, label: c.label + (peakPct ? ' (+' + peakPct + '% tyohaar)' : ''), qty: qty, unit: c.qty, rate: Math.round(c.rate * (1 + peakPct / 100)), kind: c.kind });
    };

    var days = [].map.call(daysBox.children, function (r) { return [r.querySelector('.p1').value, r.querySelector('.p2').value].filter(Boolean); });
    var n = days.length, anyCab = false, omk = false, nights = {}, driverNights = 0, city = 'ujjain';
    days.forEach(function (plans, i) {
      plans.forEach(function (p) {
        var pl = D.plans[p]; anyCab = true; if (pl.omk) omk = true;
        add('cab.' + pl.row + '.' + car, pl.team, 1);
        city = pl.end;
      });
      if (i === n - 1) return;                        // last day: they go home, no hotel night
      if (city === null) { city = 'ujjain'; return; }  // dropped mid-trip (rare) — no night booked
      nights[city] = (nights[city] || 0) + 1;
      if (city !== 'ujjain' && days[i + 1].length) driverNights++;
    });
    if (!anyCab) warn.push('Kisi din ka plan nahi chuna — gaadi ka kharcha nahi juda.');
    if (driverNights) add('cab.driver_night.' + car, 'Driver bhatta', driverNights);

    var totalNights = 0, rooms = 0, extra = 0, auto = roomsFor(P), mine = hotel && hotel === $('pbHotel').value;
    if (hotel) {
      rooms = $('pbRooms').value !== '' ? +$('pbRooms').value : auto[0];
      extra = $('pbExtra').value !== '' ? +$('pbExtra').value : auto[1];
      var peak = $('pbPeak').checked;
      Object.keys(nights).forEach(function (c) {
        var r = D.hotels[c]; if (!r) return;
        // This quote's own hotel rate counts for the class picked in the form only; other classes stay on Lagat.
        var ownRoom = mine ? hotelRate(c, 'room') : null, ownExtra = mine ? hotelRate(c, 'extra') : null;
        add('hotel.' + r[0] + '.' + hotel, 'Hotel ' + CITY[c][1], rooms * nights[c], peak, ownRoom === null ? null : { rate: ownRoom, unit: 'kamra × raat' });
        if (extra) add(r[1] ? 'hotel.' + r[1] + '.' + hotel : 'hotel.none', 'Extra bed ' + CITY[c][1], extra * nights[c], peak, ownExtra === null ? null : { rate: ownExtra, unit: 'raat' });
        totalNights += nights[c];
      });
      if (!totalNights) warn.push('Hotel chuna hai par koi raat nahi bani (1 din ki yatra?) — hotel nahi juda.');
      var meal = $('pbMeal').value, mn = P.paying * totalNights;
      if (meal !== 'EP') add('hotel.bf.' + hotel, 'Nashta', mn);
      if (meal === 'MAP') add('hotel.meal.' + hotel, 'Lunch / dinner', mn);
      if (meal === 'AP') add('hotel.meal.' + hotel, 'Lunch + dinner', mn * 2);
    } else if (n > 1) warn.push('Hotel nahi chuna — ' + (n - 1) + ' raat ka kamra customer khud lega, quote me "shaamil nahi" likha jaayega.');
    if (omk && $('pbBoat').checked) add('other.boat.cost', 'Nauka vihar', P.paying);
    if ($('pbWater').checked) add('other.water.cost', 'Paani / welcome kit', P.paying);
    // Each puja has 3 categories (Basic / Standard / Premium — Aman 2026-10-29); the select holds the category.
    var pujas = [].filter.call(document.querySelectorAll('.pbPuja'), function (x) { return x.value; }).map(function (x) { return x.dataset.puja + '.' + x.value; });
    pujas.forEach(function (p) { add('puja.' + p, 'Puja ' + p.replace('.', ' · '), 1); });
    var custom = customLines();
    custom.forEach(function (l) {
      if (l[2] === null) { lines.push({ k: 'custom', label: l[0], qty: l[1], rate: null, kind: null }); warn.push('"' + l[0] + '" ka rate nahi bhara.'); return; }
      lines.push({ k: 'custom', label: l[0] || 'Aur kharcha', qty: l[1], unit: '', rate: l[2], kind: l[3] });
    });

    // Markup once, on the net lines' total (Aman 2026-10-29); sell-rate lines go in as they are.
    var net = 0, sellIn = 0, mk = $('pbMarkup').value === '' ? +D.set.markup_pct : +$('pbMarkup').value;
    lines.forEach(function (l) { if (l.rate !== null) { if (l.kind === 'sell') sellIn += l.rate * l.qty; else net += l.rate * l.qty; } });
    var sell = net * (1 + mk / 100) + sellIn, cost = net + sellIn;
    var gst = +D.set.gst_pct || 0, rt = +D.set.round_to || 100;
    var final = sell ? Math.ceil(sell * (1 + gst / 100) / rt) * rt : 0;
    var profit = final / (1 + gst / 100) - cost;
    if (final && D.set.min_profit && profit < D.set.min_profit) warn.push('Munafa ' + inr(profit) + ' — tay kam se kam ' + inr(D.set.min_profit) + ' se kam hai. Markup badhao ya daam haath se badlo.');
    return {
      P: P, car: car, auto: auto, missingHotel: missingHotel, warn: warn, lines: lines, custom: custom, pujas: pujas,
      totals: { net: Math.round(net), markup_pct: mk, sell_rate: Math.round(sellIn), cost: Math.round(cost), sell: Math.round(sell), gst_pct: gst, final: final, profit: Math.round(profit),
        per_person: P.paying ? Math.ceil(final / P.paying) : 0, paying: P.paying },
      meta: { anyCab: anyCab, omk: omk, nights: totalNights, rooms: rooms, extra: extra, pujas: pujas, days: days }
    };
  };

  var build = function () {
    var hotel = $('pbHotel').value, r = price(hotel);
    $('pbCarHint').textContent = $('pbCar').value === 'auto' ? 'Chuni: ' + D.cars[r.car] + ' (' + (r.P.pax || 1) + ' log)' : '';
    $('pbRoomHint').textContent = hotel ? 'Auto: ' + r.auto[0] + ' kamra · ' + r.auto[1] + ' extra bed' + (r.P.kidsFree ? ' · ' + r.P.kidsFree + ' chhota bachcha (' + D.set.child_free_age + ' saal se kam) — paisa nahi' : '') : 'Khaali = logon se apne aap (2 per kamra)';
    // Same trip in every hotel class (Lagat rates; the picked class also uses this quote's own hotel rate).
    var opts = r.meta.nights ? Object.keys(D.rooms).map(function (c) {
      var o = c === hotel ? r : price(c);
      return { cls: c, final: o.totals.final, per_person: o.totals.per_person, profit: o.totals.profit, missing: o.missingHotel };
    }) : [];
    last = {
      state: { start: $('pbStart').value, markup: $('pbMarkup').value, car: $('pbCar').value, carUsed: r.car, hotel: hotel, rooms: $('pbRooms').value, extra: $('pbExtra').value,
        meal: $('pbMeal').value, peak: $('pbPeak').checked, boat: $('pbBoat').checked, water: $('pbWater').checked, pujas: r.pujas,
        hotelRates: [].filter.call(document.querySelectorAll('.pbHR'), function (x) { return x.value !== ''; }).map(function (x) { return [x.dataset.city, x.dataset.f, +x.value]; }),
        custom: r.custom,
        days: [].map.call(daysBox.children, function (row) { return [row.querySelector('.p1').value, row.querySelector('.p2').value]; }) },
      lines: r.lines, totals: r.totals, meta: r.meta, P: r.P, options: opts
    };
    render(r.warn);
    $('pbApply').disabled = !r.totals.final;
    $('pbOptCopy').disabled = !opts.some(function (o) { return !o.missing && o.final; });
  };

  var render = function (warn) {
    var t = last.totals, h = '<table style="font-size:13px"><thead><tr><th>Cheez</th><th>Kitna</th><th>Rate</th><th>Net / Sell</th><th>Kul</th></tr></thead><tbody>';
    last.lines.forEach(function (l) {
      h += '<tr><td>' + esc(l.label) + '</td><td>' + l.qty + ' ' + (l.unit || '') + '</td><td>' + (l.rate === null ? '<b style="color:var(--red)">rate nahi</b>' : inr(l.rate)) +
        '</td><td>' + (l.kind === 'sell' ? 'Sell' : l.kind === 'net' ? 'Net' : '—') + '</td><td>' + (l.rate === null ? '—' : inr(l.rate * l.qty)) + '</td></tr>';
    });
    h += '</tbody></table><div style="margin-top:10px;font-size:14px;line-height:1.8">Net ' + inr(t.net) + ' + ' + t.markup_pct + '% = ' + inr(t.net * (1 + t.markup_pct / 100)) +
      (t.sell_rate ? ' · Sell rate cheezen ' + inr(t.sell_rate) : '') + (t.gst_pct ? ' · + GST ' + t.gst_pct + '%' : '') + ' · round ₹' + (+D.set.round_to || 100) +
      '<br><b style="color:var(--maroon);font-size:16px">Customer ka kul ' + inr(t.final) + '</b>' +
      (t.paying ? ' · <b>' + inr(t.per_person) + ' / vyakti</b> (' + t.paying + ' paying' + (last.P.kidsFree ? ' + ' + last.P.kidsFree + ' chhota bachcha' : '') + ')' : '') +
      ' · <b>Munafa ' + inr(t.profit) + (t.cost ? ' (' + Math.round(t.profit / t.cost * 100) + '%)' : '') + '</b></div>';
    if (warn.length) h += '<div class="flash err" style="margin-top:10px">' + warn.map(function (w) { return '• ' + esc(w); }).join('<br>') + '</div>';
    out.innerHTML = h;

    var o = '';
    if (last.options.length) {
      o = '<table style="font-size:13px"><thead><tr><th>Hotel class</th><th>Customer ka kul</th><th>Per vyakti</th><th>Munafa</th><th></th></tr></thead><tbody>';
      last.options.forEach(function (x) {
        var on = x.cls === last.state.hotel;
        o += '<tr' + (on ? ' style="background:#fff4e0"' : '') + '><td><b>' + esc(D.rooms[x.cls]) + '</b>' + (on ? ' ✓' : '') + '</td>' +
          (x.missing ? '<td colspan="3" style="color:var(--red)">Lagat me is class ka hotel rate nahi</td>' :
            '<td><span class="ml">Kul </span>' + inr(x.final) + '</td><td><span class="ml">Per vyakti </span>' + inr(x.per_person) + '</td><td><span class="ml">Munafa </span>' + inr(x.profit) + '</td>') +
          '<td>' + (on ? '' : '<button type="button" class="b pbPick" data-c="' + x.cls + '">Ye chuno</button>') + '</td></tr>';
      });
      o += '</tbody></table>';
    }
    $('pbOpts').innerHTML = o;
    [].forEach.call(document.querySelectorAll('.pbPick'), function (b) { b.addEventListener('click', function () { $('pbHotel').value = b.dataset.c; build(); }); });
    $('pbCalc').value = JSON.stringify({ state: last.state, lines: last.lines, totals: last.totals, options: last.options });
  };

  // Places in the trip, in order, for the title and the options message.
  var tripName = function (hi, days) {
    var L = hi ? 0 : 1, names = [CITY.ujjain[L]];
    days.forEach(function (ps) { ps.forEach(function (p) {
      if (D.plans[p].omk) names.push(CITY.omk[L]);
      if (p === 'omk_mah' || /^mah_/.test(p)) names.push(CITY.mah[L]);
      if (p === 'mandu') names.push(hi ? 'मांडू' : 'Mandu');
      if (p === 'nalkheda') names.push(hi ? 'नलखेड़ा' : 'Nalkheda');
      if (/indore/.test(p) || /_ind$/.test(p)) names.push(CITY.indore[L]);
    }); });
    return names.filter(function (x, i) { return names.indexOf(x) === i; }).join(' – ');
  };

  // WhatsApp message with every priced class — pure Hindi or pure English, as the quote's language.
  var CLS_HI = { budget: 'बजट होटल', standard: 'स्टैंडर्ड एसी होटल', deluxe: 'डीलक्स होटल', premium: 'प्रीमियम 4★+ होटल' };
  var CLS_EN = { budget: 'Budget hotel', standard: 'Standard AC hotel', deluxe: 'Deluxe hotel', premium: 'Premium 4★+ hotel' };
  var MEAL_HI = { EP: 'सिर्फ़ कमरा', CP: 'कमरा + नाश्ता', MAP: 'कमरा + नाश्ता + एक समय भोजन', AP: 'कमरा + तीनों समय भोजन' };
  var MEAL_EN = { EP: 'room only', CP: 'room + breakfast', MAP: 'room + breakfast + one meal', AP: 'room + all meals' };
  var optionsText = function () {
    var hi = E.locale.value !== 'en', m = last.meta, P = last.P, n = m.days.length, i = 0;
    var who = hi ? P.adults + ' वयस्क' + (P.children ? ', ' + P.children + (P.children === 1 ? ' बच्चा' : ' बच्चे') : '') : P.adults + ' adult' + (P.adults === 1 ? '' : 's') + (P.children ? ', ' + P.children + ' child' + (P.children === 1 ? '' : 'ren') : '');
    var t = (E.title.value.trim() || tripName(hi, m.days) + (hi ? ' यात्रा' : ' trip'));
    var s = hi ? '🙏 ' + t + '\n' + n + ' दिन / ' + m.nights + ' रात · ' + who + '\n' + 'गाड़ी: ' + CAR_NAMES[last.state.carUsed] + ' · भोजन: ' + MEAL_HI[last.state.meal] + '\n\nहोटल के अनुसार कुल राशि:\n'
               : '🙏 ' + t + '\n' + n + ' days / ' + m.nights + ' nights · ' + who + '\n' + 'Car: ' + CAR_NAMES[last.state.carUsed] + ' · Meals: ' + MEAL_EN[last.state.meal] + '\n\nTotal by hotel class:\n';
    last.options.forEach(function (x) {
      if (x.missing || !x.final) return;
      i++;
      s += hi ? i + '. ' + CLS_HI[x.cls] + ' — ' + inr(x.final) + ' (' + inr(x.per_person) + ' प्रति व्यक्ति)\n'
              : i + '. ' + CLS_EN[x.cls] + ' — ' + inr(x.final) + ' (' + inr(x.per_person) + ' per person)\n';
    });
    if (P.kidsFree) s += hi ? D.set.child_free_age + ' वर्ष से कम उम्र के बच्चों का कोई शुल्क नहीं।\n' : 'No charge for children under ' + D.set.child_free_age + '.\n';
    s += hi ? '\nदरें होटल में कमरे उपलब्ध होने पर पक्की होंगी। जो विकल्प पसंद हो बताइए, हम पूरा विवरण और बुकिंग लिंक भेज देंगे।'
            : '\nRates are confirmed once the hotel confirms rooms. Tell us the option you like and we will send the full plan and booking link.';
    return s;
  };
  $('pbOptCopy').addEventListener('click', function () {
    if (!last) return;
    var b = $('pbOptCopy'), txt = optionsText();
    b.dataset.text = txt;
    navigator.clipboard.writeText(txt).then(function () { b.textContent = 'Copied ✓ — WhatsApp me paste karo'; setTimeout(function () { b.textContent = 'Options text copy'; }, 2500); });
  });

  var apply = function () {
    if (!last) return;
    var hi = E.locale.value !== 'en', L = hi ? 0 : 1, m = last.meta, s = last.state;
    E.total.value = last.totals.final; E.total.dispatchEvent(new Event('input'));
    if (m.anyCab) E.vehicle.value = CAR_NAMES[s.carUsed];
    E.room.value = s.hotel ? D.rooms[s.hotel] + ' double room × ' + m.rooms + (m.extra ? ' + ' + m.extra + ' extra bed' : '') : '';
    E.meal_plan.value = s.hotel && m.nights ? s.meal : '';
    if (!E.title.value.trim()) E.title.value = tripName(hi, m.days) + (hi ? ' यात्रा' : ' trip');
    var set = function (k, v) { if (E['item_' + k]) E['item_' + k].value = v; };
    ['toll', 'parking', 'driver', 'fuel'].forEach(function (k) { set(k, m.anyCab ? 'in' : 'na'); });
    set('hotel', s.hotel && m.nights ? 'in' : (m.days.length > 1 ? 'out' : 'na'));
    set('meals', s.hotel && m.nights && s.meal !== 'EP' ? 'in' : 'out');
    set('puja', m.pujas.length ? 'in' : 'na');
    set('tickets', 'out');
    var extraIn = E.extra_in.value.split('\n').filter(Boolean);
    var addIn = function (x) { if (extraIn.indexOf(x) < 0) extraIn.push(x); };
    if (m.omk && s.boat) addIn(hi ? 'ओंकारेश्वर नौका विहार' : 'Omkareshwar boat ride');
    if (s.water) addIn(hi ? 'पानी / वेलकम किट' : 'Water / welcome kit');
    E.extra_in.value = extraIn.join('\n');

    // Day-wise plan → the itinerary rows below (asks before replacing typed text).
    var rows = document.querySelectorAll('#days .day'), typed = [].some.call(rows, function (r) { return r.querySelector('[name="day_title[]"]').value.trim(); });
    if (typed && !confirm('Neeche ki din-wise yojana is package se badal dein?')) return;
    var box = document.getElementById('days'), tpl = rows[0];
    rows.forEach(function (r, i) { if (i) r.remove(); });
    m.days.forEach(function (ps, i) {
      var r = i ? tpl.cloneNode(true) : tpl;
      if (i) box.appendChild(r);
      if (s.start) { var d = new Date(s.start + 'T00:00:00'); d.setDate(d.getDate() + i); r.querySelector('input[type=date]').value = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-'); }
      r.querySelector('[name="day_title[]"]').value = ps.length ? ps.map(function (p) { return D.plans[p][hi ? 'hi' : 'en']; }).join(' + ') : (hi ? 'विश्राम / निजी समय' : 'Free day');
      r.querySelector('[name="day_details[]"]').value = ps.map(function (p) { return D.plans[p][hi ? 'dhi' : 'den']; }).join('\n');
    });
    box.querySelectorAll('.day .n').forEach(function (x, i) { x.textContent = 'Din ' + (i + 1); });
    E.title.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  $('pbGo').addEventListener('click', build);
  $('pbApply').addEventListener('click', apply);

  // Restore an edited quote's builder, else start with one empty day.
  var saved = null; try { saved = JSON.parse($('pbCalc').value || 'null'); } catch (e) {}
  if (saved && saved.state) {
    var st = saved.state;
    $('pbStart').value = st.start || ''; if (st.markup !== undefined && st.markup !== '') $('pbMarkup').value = st.markup; $('pbCar').value = st.car || 'auto'; $('pbHotel').value = st.hotel || '';
    $('pbRooms').value = st.rooms || ''; $('pbExtra').value = st.extra || ''; $('pbMeal').value = st.meal || 'EP';
    $('pbPeak').checked = !!st.peak; $('pbBoat').checked = st.boat !== false; $('pbWater').checked = !!st.water;
    (st.hotelRates || []).forEach(function (x) { var i = document.querySelector('.pbHR[data-city="' + x[0] + '"][data-f="' + x[1] + '"]'); if (i) i.value = x[2]; });
    (st.custom || []).forEach(function (l) { addLine(l); });
    document.querySelectorAll('.pbPuja').forEach(function (x) {
      (st.pujas || []).forEach(function (p) { var a = p.split('.'); if (a[0] === x.dataset.puja && a[1]) x.value = a[1]; });
    });
    (st.days || [['', '']]).forEach(function (d) { addDay(d[0], d[1]); });
    build();
  } else {
    var firstDate = document.querySelector('#days input[type=date]');
    $('pbStart').value = firstDate && firstDate.value ? firstDate.value : '';
    addDay('local_7');
  }
})();
</script>
<?php endif; ?>
</body>
</html>
