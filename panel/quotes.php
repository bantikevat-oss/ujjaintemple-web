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
$cfg = require __DIR__ . '/config.php';
// Live: public_html/panel + public_html/api. Local checkout: panel/ + public/api.
$lib = is_file(__DIR__ . '/../api/quote-lib.php') ? __DIR__ . '/../api/quote-lib.php' : __DIR__ . '/../public/api/quote-lib.php';
require $lib;

session_set_cookie_params(['lifetime' => $cfg['session_ttl'], 'httponly' => true, 'samesite' => 'Lax', 'secure' => true]);
session_start();
header('Cache-Control: no-store');

function h($s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function csrf(): string { if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16)); return $_SESSION['csrf']; }
function is_auth(): bool { return !empty($_SESSION['auth']) && ($_SESSION['auth_time'] ?? 0) > time() - 3600 * 6; }

if (!is_auth()) { header('Location: ./'); exit; }   // log in on the image panel first

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
    $days[] = ['date' => $d, 'title' => mb_substr($ti, 0, 120), 'details' => mb_substr($de, 0, 600)];
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
  if ($adv < 100 || $adv > $total) $e[] = 'Advance ₹100 se kul kiraye ke beech ho.';
  $valid = (string)($_POST['valid_until'] ?? '');
  if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $valid) || $valid < date('Y-m-d')) $e[] = 'Quote kab tak maanya hai — aaj ya aage ki tareekh chuno.';
  $title = trim(strip_tags((string)($_POST['title'] ?? '')));
  if (mb_strlen($title) < 4) $e[] = 'Yatra ka naam likho (jaise "Indore – Omkareshwar – Ujjain yatra").';

  return [[
    'customer'    => ['name' => mb_substr($name, 0, 60), 'phone' => $phone],
    'locale'      => ($_POST['locale'] ?? 'hi') === 'en' ? 'en' : 'hi',
    'title'       => mb_substr($title, 0, 120),
    'vehicle'     => mb_substr(trim(strip_tags((string)($_POST['vehicle'] ?? ''))), 0, 60),
    'pax'         => max(0, min(60, (int)($_POST['pax'] ?? 0))),
    'days'        => $days,
    'items'       => $items,
    'extra_in'    => $lines($_POST['extra_in'] ?? ''),
    'extra_out'   => $lines($_POST['extra_out'] ?? ''),
    'total'       => $total,
    'advance'     => $adv,
    'valid_until' => $valid,
    'notes'       => mb_substr(trim(strip_tags((string)($_POST['notes'] ?? ''))), 0, 1000),
  ], $e];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (!hash_equals($_SESSION['csrf'] ?? '', (string)($_POST['csrf'] ?? ''))) { http_response_code(419); exit('Bad CSRF token — refresh and retry.'); }
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

function wa_text(array $q): string {
  $hi = ($q['locale'] ?? 'hi') !== 'en';
  $first = $q['customer']['name'];
  return $hi
    ? "नमस्ते {$first} जी, आपकी यात्रा \"{$q['title']}\" का कोटेशन यहाँ है:\n" . ut_quote_url($q) . "\n\nकुल किराया " . ut_quote_inr($q['total']) . " · बुकिंग के लिए " . ut_quote_inr($q['advance']) . " एडवांस।\n— UjjainTemple.com"
    : "Hello {$first}, here is the quote for your trip \"{$q['title']}\":\n" . ut_quote_url($q) . "\n\nTotal " . ut_quote_inr($q['total']) . " · advance " . ut_quote_inr($q['advance']) . " to confirm.\n— UjjainTemple.com";
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
  @media (max-width:640px){.day{grid-template-columns:1fr}.day textarea{grid-column:auto}table,thead,tbody,tr,td,th{display:block}thead{display:none}td{border:0;padding:6px 12px}tr{border-bottom:1px solid var(--line);padding:8px 0}}
</style>
</head>
<body>
<header class="top">
  <b>UjjainTemple <span class="gold">Quotes</span></b>
  <nav><a href="./">Images</a><a href="./?do=logout">Logout</a></nav>
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
      <div><label>Yatri (log)</label><input name="pax" type="number" min="0" max="60" value="<?= h($e['pax'] ?? '') ?>"></div>
      <div><label>Customer ka page kis bhasha me</label><select name="locale">
        <option value="hi" <?= ($e['locale'] ?? 'hi') === 'hi' ? 'selected' : '' ?>>हिंदी</option>
        <option value="en" <?= ($e['locale'] ?? '') === 'en' ? 'selected' : '' ?>>English</option></select>
        <div class="hint">Yojana ka text bhi isi bhasha me likho.</div></div>
    </div></fieldset>

    <fieldset><legend>Yatra</legend><div class="g">
      <div style="grid-column:span 2"><label>Yatra ka naam *</label><input name="title" required maxlength="120" value="<?= h($e['title'] ?? '') ?>" placeholder="इंदौर – ओंकारेश्वर – उज्जैन यात्रा"></div>
      <div><label>Gaadi</label><input name="vehicle" list="cars" maxlength="60" value="<?= h($e['vehicle'] ?? '') ?>" placeholder="Swift Dzire"></div>
    </div>
    <datalist id="cars"><option value="Swift Dzire"><option value="Ertiga"><option value="Innova Crysta"><option value="Tempo Traveller"></datalist>
    <div id="days">
      <?php foreach ($days as $i => $d): ?>
      <div class="day">
        <div><span class="n">Din <?= $i + 1 ?></span><input type="date" name="day_date[]" value="<?= h($d['date']) ?>"></div>
        <input name="day_title[]" maxlength="120" value="<?= h($d['title']) ?>" placeholder="Us din kya hoga — jaise: इंदौर पिकअप, रात इंदौर में">
        <button type="button" class="b x rm" title="Ye din hatao">✕</button>
        <textarea name="day_details[]" maxlength="600" placeholder="Detail (optional): samay, pickup jagah, darshan, puja kab tak, train ka samay…"><?= h($d['details']) ?></textarea>
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
      <div><label>Advance (₹) *</label><input name="advance" id="advance" type="number" min="100" required value="<?= h($e['advance'] ?? '') ?>"><div class="hint" id="advHint">Sujhav: 20–25%</div></div>
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
        <td><?= ut_quote_inr($q['total']) ?><div class="sub">adv <?= ut_quote_inr($q['advance']) ?></div></td>
        <td><span class="st <?= $st ?>"><?= $st === 'paid' ? 'Paid' : ($st === 'open' ? 'Bheja / khula' : ($st === 'expired' ? 'Expired' : 'Cancelled')) ?></span></td>
        <td><div class="acts">
          <a class="b" href="<?= h('/q/?k=' . $q['token']) ?>" target="_blank" rel="noopener">Dekho</a>
          <?php if ($st === 'open'): ?>
            <button class="b cp" type="button" data-url="<?= h(ut_quote_url($q)) ?>">Link copy</button>
            <a class="b wa" target="_blank" rel="noopener" href="https://wa.me/<?= h(ltrim($q['customer']['phone'], '+')) ?>?text=<?= rawurlencode(wa_text($q)) ?>">WhatsApp</a>
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
      if (prev) { var d = new Date(prev + 'T00:00:00'); d.setDate(d.getDate() + 1); row.querySelector('input[type=date]').value = d.toISOString().slice(0, 10); }
      days.appendChild(row); renumber();
    });
    days.addEventListener('click', function (ev) {
      if (!ev.target.classList.contains('rm')) return;
      if (days.querySelectorAll('.day').length > 1) { ev.target.closest('.day').remove(); renumber(); }
    });
    var total = document.getElementById('total'), adv = document.getElementById('advance'), hint = document.getElementById('advHint');
    var upd = function () { var t = +total.value || 0; hint.textContent = t ? 'Sujhav: 20–25% = ₹' + Math.round(t * 0.2) + '–' + Math.round(t * 0.25) : 'Sujhav: 20–25%'; };
    total.addEventListener('input', upd); upd();
  }
  document.querySelectorAll('.cp').forEach(function (b) {
    b.addEventListener('click', function () {
      navigator.clipboard.writeText(b.dataset.url).then(function () { b.textContent = 'Copied ✓'; setTimeout(function () { b.textContent = 'Link copy'; }, 1500); });
    });
  });
})();
</script>
</body>
</html>
