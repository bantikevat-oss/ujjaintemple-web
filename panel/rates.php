<?php
/**
 * UjjainTemple.com — date-wise cab fares (Aman, 2026-10-28).
 * Set a different fare for a route and car between two dates (festival days, Simhastha). The site's
 * booking widget asks api/fares.php for the chosen date and booking-order.php charges the same
 * number, so a change here is live at once — no rebuild. The normal card is still changed in code
 * (src/data/rates.ts + public/api/cab-rates.php).
 */

declare(strict_types=1);
require __DIR__ . '/common.php';
require panel_api('rate-lib.php');

$err = []; $msg = null;
$base = ut_rates_base();
$CARS = ['dzire' => 'Dzire', 'ertiga' => 'Ertiga', 'innova' => 'Innova'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  check_csrf();
  $act = (string)($_POST['do'] ?? '');
  $list = ut_rate_overrides();

  if ($act === 'add') {
    $from = (string)($_POST['from'] ?? ''); $to = (string)($_POST['to'] ?? '');
    $route = (string)($_POST['route'] ?? '');
    $note = mb_substr(trim(strip_tags((string)($_POST['note'] ?? ''))), 0, 80);
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $from) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $to)) $err[] = 'Dono tareekh chuno.';
    elseif ($to < $from) $err[] = '"Tak" ki tareekh "se" se pehle hai.';
    elseif ($to < date('Y-m-d')) $err[] = 'Ye tareekhen beet chuki hain.';
    if (!isset(UT_RATE_ROUTES[$route])) $err[] = 'Route chuno.';
    $fares = [];
    foreach ($CARS as $v => $label) {
      $raw = trim((string)($_POST['fare_' . $v] ?? ''));
      if ($raw === '') continue;
      $n = (int)$raw;
      if ($n < 500 || $n > 50000) { $err[] = $label . ': kiraya ₹500 se ₹50,000 ke beech ho.'; continue; }
      $fares[$v] = $n;
    }
    if (!$fares && !$err) $err[] = 'Kam se kam ek gaadi ka naya kiraya daalo (khaali = normal kiraya).';
    if (!$err) {
      $list[] = ['id' => bin2hex(random_bytes(4)), 'from' => $from, 'to' => $to, 'route' => $route, 'fares' => $fares,
        'note' => $note, 'created_at' => date('Y-m-d H:i:s'), 'by' => $_SESSION['who'] ?? 'password'];
      if (ut_rate_overrides_save($list)) { header('Location: ?saved=1'); exit; }
      $err[] = 'Save nahi ho paya (server file likhne layak nahi).';
    }
  } elseif ($act === 'delete') {
    $id = (string)($_POST['id'] ?? '');
    $left = array_values(array_filter($list, function ($o) use ($id) { return $o['id'] !== $id; }));
    if (count($left) === count($list)) $err[] = 'Ye rate mila nahi.';
    elseif (ut_rate_overrides_save($left)) { header('Location: ?deleted=1'); exit; }
  }
}
if (isset($_GET['saved'])) $msg = 'Naya kiraya save ho gaya — site pe usi waqt lagu.';
if (isset($_GET['deleted'])) $msg = 'Hata diya — un tareekhon pe ab normal kiraya lagega.';

$today = date('Y-m-d');
$list = ut_rate_overrides();
usort($list, function ($a, $b) { return strcmp($a['from'], $b['from']); });
$active = array_values(array_filter($list, function ($o) use ($today) { return $o['to'] >= $today; }));
$past = array_values(array_filter($list, function ($o) use ($today) { return $o['to'] < $today; }));
$inr = function ($n): string { return '₹' . number_format((int)$n, 0, '.', ','); };
$fmt = function (string $d): string { return date('j M Y (D)', strtotime($d)); };
?>
<!doctype html>
<html lang="hi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>UjjainTemple — Rates</title>
<style>
  :root{--navy:#0f1f3d;--gold:#c99a3b;--cream:#faf6ee;--ink:#1c2431;--muted:#6b7686;--line:#e7ded0;--red:#b3341f;--maroon:#8B1A1A}
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;background:var(--cream);color:var(--ink)}
  header.top{background:var(--navy);color:#fff;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;position:sticky;top:0;z-index:20;flex-wrap:wrap}
  header.top b{font-size:17px} header.top .gold{color:var(--gold)}
  header.top nav a{color:#fff;text-decoration:none;font-size:13px;border:1px solid rgba(255,255,255,.3);padding:6px 12px;border-radius:8px;margin-left:6px}
  header.top nav a.on{background:var(--gold);border-color:var(--gold);color:var(--navy)}
  .wrap{max-width:1000px;margin:0 auto;padding:20px}
  .flash{padding:12px 16px;border-radius:10px;margin:14px 0;font-size:14px}
  .flash.ok{background:#eef4ff;border:1px solid #b9cdf2;color:var(--navy)}
  .flash.err{background:#fbeae7;border:1px solid #eab5ab;color:var(--red)}
  h1{font-size:20px;color:var(--navy);margin:18px 0 10px}
  .card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px;margin-bottom:18px}
  table{width:100%;border-collapse:collapse;font-size:14px}
  th,td{padding:9px 10px;border-bottom:1px solid var(--line);text-align:left}
  th{font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)}
  td.n{text-align:right;font-variant-numeric:tabular-nums}
  .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
  label{display:block;font-size:12px;font-weight:700;color:var(--muted);margin-bottom:4px}
  input,select{width:100%;padding:10px;border:1px solid var(--line);border-radius:9px;font:inherit;font-size:14px;background:#fff}
  .hint{font-size:12px;color:var(--muted);margin-top:4px}
  .b{display:inline-block;font-size:13px;font-weight:600;padding:9px 14px;border-radius:8px;border:1px solid var(--line);background:#fff;color:var(--ink);cursor:pointer}
  .b.p{background:var(--navy);color:#fff;border-color:var(--navy)}
  .b.x{color:var(--red);border-color:#e6c2ba;padding:6px 10px}
  .new{color:var(--maroon);font-weight:700}
  .old{color:var(--muted);text-decoration:line-through;font-size:12px;margin-left:4px}
  @media (max-width:640px){.wrap{padding:14px}th,td{padding:7px 6px;font-size:13px}}
</style>
</head>
<body>
<header class="top">
  <b>UjjainTemple <span class="gold">Rates</span></b>
  <nav><?= panel_nav('rates.php') ?></nav>
</header>
<div class="wrap">
  <?php if ($msg): ?><div class="flash ok"><?= h($msg) ?></div><?php endif; ?>
  <?php if ($err): ?><div class="flash err"><?php foreach ($err as $x) echo h($x) . '<br>'; ?></div><?php endif; ?>

  <h1>Kisi tareekh ke liye naya kiraya</h1>
  <form class="card" method="post" autocomplete="off">
    <input type="hidden" name="csrf" value="<?= h(csrf()) ?>"><input type="hidden" name="do" value="add">
    <div class="g">
      <div><label>Se (tareekh) *</label><input type="date" name="from" required min="<?= $today ?>" value="<?= h($_POST['from'] ?? '') ?>"></div>
      <div><label>Tak (tareekh) *</label><input type="date" name="to" required min="<?= $today ?>" value="<?= h($_POST['to'] ?? '') ?>"><div class="hint">Ek hi din ho to dono me wahi tareekh.</div></div>
      <div style="grid-column:span 2"><label>Route *</label><select name="route" id="route" required>
        <option value="">— chuno —</option>
        <?php foreach (UT_RATE_ROUTES as $r => $label): ?><option value="<?= h($r) ?>" <?= ($_POST['route'] ?? '') === $r ? 'selected' : '' ?>><?= h($label) ?></option><?php endforeach; ?>
      </select></div>
    </div>
    <div class="g" style="margin-top:12px">
      <?php foreach ($CARS as $v => $label): ?>
      <div><label><?= h($label) ?> — naya kiraya (₹)</label><input type="number" name="fare_<?= $v ?>" min="500" max="50000" value="<?= h($_POST['fare_' . $v] ?? '') ?>"><div class="hint" data-base="<?= $v ?>">Khaali = normal kiraya</div></div>
      <?php endforeach; ?>
      <div><label>Kaaran (sirf aapke liye)</label><input name="note" maxlength="80" placeholder="Diwali / Simhastha shahi snan" value="<?= h($_POST['note'] ?? '') ?>"></div>
    </div>
    <div style="margin-top:14px"><button class="b p" type="submit">Save — site pe turant lagu</button></div>
    <p class="hint">Vendor ka rate check karke daam rakho (abhi normal kiraya = vendor + ~15%). Advance ₹500 hi rahega; baaki ka hisaab naye kiraye se.</p>
  </form>

  <h1>Lagu / aane wale special kiraye</h1>
  <div class="card">
  <?php if (!$active): ?><p class="hint" style="margin:0">Koi nahi — har tareekh pe normal kiraya chal raha hai.</p>
  <?php else: ?>
    <table><thead><tr><th>Tareekh</th><th>Route</th><?php foreach ($CARS as $label) echo '<th class="n">' . h($label) . '</th>'; ?><th></th></tr></thead><tbody>
    <?php foreach ($active as $o): ?>
      <tr>
        <td><?= h($o['from'] === $o['to'] ? $fmt($o['from']) : $fmt($o['from']) . ' → ' . $fmt($o['to'])) ?><?php if ($o['note'] !== ''): ?><div class="hint"><?= h($o['note']) ?></div><?php endif; ?></td>
        <td><?= h(UT_RATE_ROUTES[$o['route']] ?? $o['route']) ?></td>
        <?php foreach ($CARS as $v => $label): ?>
          <td class="n"><?php if (isset($o['fares'][$v])): ?><span class="new"><?= $inr($o['fares'][$v]) ?></span><span class="old"><?= $base[$o['route']][$v] !== null ? $inr($base[$o['route']][$v]) : '' ?></span><?php else: ?><span class="hint">normal</span><?php endif; ?></td>
        <?php endforeach; ?>
        <td><form method="post" onsubmit="return confirm('Ye special kiraya hatayein? In tareekhon pe normal kiraya lagega.')">
          <input type="hidden" name="csrf" value="<?= h(csrf()) ?>"><input type="hidden" name="do" value="delete"><input type="hidden" name="id" value="<?= h($o['id']) ?>">
          <button class="b x" type="submit">Hatao</button></form></td>
      </tr>
    <?php endforeach; ?>
    </tbody></table>
  <?php endif; ?>
  </div>

  <h1>Normal kiraya (har din)</h1>
  <div class="card">
    <table><thead><tr><th>Route</th><?php foreach ($CARS as $label) echo '<th class="n">' . h($label) . '</th>'; ?></tr></thead><tbody>
    <?php foreach (UT_RATE_ROUTES as $r => $label): ?>
      <tr><td><?= h($label) ?></td><?php foreach ($CARS as $v => $l) echo '<td class="n">' . ($base[$r][$v] !== null ? $inr($base[$r][$v]) : 'call') . '</td>'; ?></tr>
    <?php endforeach; ?>
    </tbody></table>
    <p class="hint">Normal kiraya code me hai (site ka /pricing/ page bhi isi se banta hai) — ise badalna ho to Claude ko bolo.</p>
  </div>
  <?php if ($past): ?><p class="hint"><?= count($past) ?> purane special kiraye (beet chuke) — ab lagu nahi.</p><?php endif; ?>
</div>
<script>
(function () {
  var base = <?= json_encode($base) ?>, sel = document.getElementById('route');
  var upd = function () {
    document.querySelectorAll('[data-base]').forEach(function (el) {
      var f = sel.value && base[sel.value] ? base[sel.value][el.dataset.base] : null;
      el.textContent = f ? 'Khaali = normal ₹' + f.toLocaleString('en-IN') : 'Khaali = normal kiraya';
    });
  };
  sel.addEventListener('change', upd); upd();
})();
</script>
</body>
</html>
