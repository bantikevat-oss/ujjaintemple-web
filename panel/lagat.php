<?php
/**
 * UjjainTemple.com — Lagat (cost sheet) page (Aman, 2026-10-29: "har cheez ki pricing tum puchh lo").
 * Each row is a question for the team: the vendor's rate, and whether it is NET (we add the markup
 * on the package total — Niyam → markup %, default 30) or SELL (charged as it is). The quote form's
 * "Package banao" builder prices a whole trip from these answers. Rows + rules: cost-lib.php.
 */

declare(strict_types=1);
require __DIR__ . '/common.php';
require __DIR__ . '/cost-lib.php';

$err = []; $msg = null;
$num = function ($raw, $min, $max) {
  $raw = trim(str_replace([',', '₹', '%'], '', (string)$raw));
  if ($raw === '') return null;
  if (!is_numeric($raw) || (float)$raw < $min || (float)$raw > $max) return false;
  return (float)$raw + 0;
};

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  check_csrf();
  $data = ut_costs();
  $rows = [];
  foreach (UT_COST_SECTIONS as $sec => $s) {
    foreach ($s['rows'] as $key => $def) {
      $id = $sec . '.' . $key; $cost = [];
      foreach ($s['cols'] as $c => $clabel) {
        $v = $num($_POST['cost'][$id][$c] ?? '', 0, 500000);
        if ($v === false) { $err[] = '"' . $def[0] . '" — ' . $clabel . ': sirf ank likho.'; continue; }
        if ($v !== null) $cost[$c] = $v;
      }
      if ($id === 'rules.markup_pct' && isset($cost['v']) && $cost['v'] > 300) $err[] = 'Markup 0 se 300 % ke beech rakho.';
      $kind = ($_POST['kind'][$id] ?? 'net') === 'sell' ? 'sell' : 'net';
      $note = mb_substr(trim(strip_tags((string)($_POST['note'][$id] ?? ''))), 0, 80);
      $rows[$id] = ['cost' => $cost, 'kind' => $kind, 'note' => $note];
    }
  }
  if (!$err) {
    $save = ['rows' => $rows, 'updated_at' => date('Y-m-d H:i:s'), 'by' => $_SESSION['who'] ?? 'password'];
    if (ut_costs_save($save)) { header('Location: ?saved=1'); exit; }
    $err[] = 'Save nahi ho paya (server file likhne layak nahi).';
  }
}
if (isset($_GET['saved'])) $msg = 'Lagat save ho gayi — quote ka "Package banao" ab inhi rates se hisaab lagayega.';

$data = ut_costs();
$mk = ut_cost_markup($data);
list($done, $all) = ut_cost_progress($data);
$fmt = function ($v) { return $v === null ? '' : rtrim(rtrim(number_format((float)$v, 2, '.', ''), '0'), '.'); };
?>
<!doctype html>
<html lang="hi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>UjjainTemple — Lagat</title>
<style>
  :root{--navy:#0f1f3d;--gold:#c99a3b;--cream:#faf6ee;--ink:#1c2431;--muted:#6b7686;--line:#e7ded0;--red:#b3341f;--maroon:#8B1A1A}
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;background:var(--cream);color:var(--ink)}
  header.top{background:var(--navy);color:#fff;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;position:sticky;top:0;z-index:20;flex-wrap:wrap}
  header.top b{font-size:17px} header.top .gold{color:var(--gold)}
  header.top nav a{color:#fff;text-decoration:none;font-size:13px;border:1px solid rgba(255,255,255,.3);padding:6px 12px;border-radius:8px;margin-left:6px}
  header.top nav a.on{background:var(--gold);border-color:var(--gold);color:var(--navy)}
  .wrap{max-width:1200px;margin:0 auto;padding:20px}
  .flash{padding:12px 16px;border-radius:10px;margin:14px 0;font-size:14px}
  .flash.ok{background:#eef4ff;border:1px solid #b9cdf2;color:var(--navy)}
  .flash.err{background:#fbeae7;border:1px solid #eab5ab;color:var(--red)}
  h1{font-size:20px;color:var(--navy);margin:18px 0 6px}
  .card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px;margin-bottom:18px;overflow-x:auto}
  .card h2{font-size:16px;color:var(--navy);margin:0 0 4px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center}
  .card h2 label{font-size:12px;color:var(--muted);font-weight:700;display:flex;gap:6px;align-items:center}
  .card h2 input{width:80px}
  table{width:100%;border-collapse:collapse;font-size:13px;min-width:760px}
  th,td{padding:7px 6px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
  th{font-size:11px;text-transform:uppercase;letter-spacing:.4px;color:var(--muted)}
  td.q{min-width:230px;font-weight:600} td.q .u{display:block;font-weight:400;color:var(--muted);font-size:12px}
  input{width:100%;padding:8px;border:1px solid var(--line);border-radius:8px;font:inherit;font-size:13px;background:#fff}
  input.c{max-width:110px} select.kind{padding:7px;border:1px solid var(--line);border-radius:8px;font:inherit;font-size:13px;background:#fff}
  input.seed{background:#fff8e6}
  .sell{font-size:12px;color:var(--maroon);font-weight:700;margin-top:3px;min-height:15px}
  .hint{font-size:12px;color:var(--muted);margin:2px 0 10px}
  .b{display:inline-block;font-size:14px;font-weight:600;padding:11px 18px;border-radius:9px;border:1px solid var(--line);background:#fff;color:var(--ink);cursor:pointer;text-decoration:none}
  .b.p{background:var(--navy);color:#fff;border-color:var(--navy)}
  .bar{position:sticky;bottom:0;background:var(--cream);padding:12px 0;display:flex;gap:12px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--line)}
  .prog{font-size:13px;color:var(--navy);font-weight:700}
  @media (max-width:640px){.wrap{padding:12px}}
</style>
</head>
<body>
<header class="top">
  <b>UjjainTemple <span class="gold">Lagat</span></b>
  <nav><?= panel_nav('lagat.php') ?></nav>
</header>
<div class="wrap">
  <?php if ($msg): ?><div class="flash ok"><?= h($msg) ?></div><?php endif; ?>
  <?php if ($err): ?><div class="flash err"><b>Save nahi hua:</b><br><?php foreach ($err as $x) echo h($x) . '<br>'; ?></div><?php endif; ?>

  <h1>Rate sheet — har sawal ka jawab do</h1>
  <p class="hint">Har line me vendor ka rate likho aur batao wo <b>Net</b> hai (jo hum dete hain) ya <b>Sell</b> (customer ka daam, jaisa hai waisa).
    <b>Net rate wali cheezon ke total pe <?= h($fmt($mk)) ?>% judta hai</b> — ye % neeche "Niyam" me badal sakte ho. Sell rate pe kuch nahi judta.
    Jo cheez nahi milti, khaali chhodo — wo package me nahi aayegi.
    <span style="background:#fff8e6;padding:0 4px">Peele dabbe</span> = Aman ki vendor sheet (28-10) se bhare hain, check karke Save karo.
    <?php if ($data['updated_at']): ?><br>Aakhri save: <?= h($data['updated_at']) ?> (<?= h($data['by']) ?>)<?php endif; ?></p>

  <form method="post" autocomplete="off" id="f">
    <input type="hidden" name="csrf" value="<?= h(csrf()) ?>">
    <?php foreach (UT_COST_SECTIONS as $sec => $s): ?>
    <div class="card" data-sec="<?= h($sec) ?>">
      <h2><?= h($s['title']) ?></h2>
      <?php if ($s['hint']): ?><p class="hint"><?= h($s['hint']) ?></p><?php endif; ?>
      <table>
        <thead><tr><th>Sawal</th><?php foreach ($s['cols'] as $c => $cl) echo '<th>' . h($cl) . ($sec === 'rules' ? '' : ' — rate ₹') . '</th>'; ?>
          <?php if ($sec !== 'rules'): ?><th>Rate kaisa hai</th><?php endif; ?><th>Vendor / note</th></tr></thead>
        <tbody>
        <?php foreach ($s['rows'] as $key => $def): $id = $sec . '.' . $key; $r = ut_cost_row($data, $sec, $key); $set = $def[1] === 'set'; ?>
          <tr data-row="<?= h($id) ?>">
            <td class="q"><?= h($def[0]) ?><span class="u"><?= $set ? 'sirf ank' : h('₹ ' . UT_COST_UNITS[$def[1]][1]) ?></span></td>
            <?php $ci = 0; foreach ($s['cols'] as $c => $cl): if ($set && $ci++ > 0) { echo '<td></td>'; continue; } ?>
              <td><input class="c<?= $r['seeded'] && $r['cost'][$c] !== null ? ' seed' : '' ?>" name="cost[<?= h($id) ?>][<?= h($c) ?>]" inputmode="decimal" value="<?= h($fmt($r['cost'][$c])) ?>">
                <?php if (!$set): ?><div class="sell"></div><?php endif; ?></td>
            <?php endforeach; ?>
            <?php if ($sec !== 'rules'): ?><td><?php if (!$set): ?><select class="kind" name="kind[<?= h($id) ?>]">
              <option value="net" <?= $r['kind'] === 'net' ? 'selected' : '' ?>>Net (+%)</option>
              <option value="sell" <?= $r['kind'] === 'sell' ? 'selected' : '' ?>>Sell (jaisa hai)</option></select><?php endif; ?></td><?php endif; ?>
            <td><input name="note[<?= h($id) ?>]" maxlength="80" value="<?= h($r['note']) ?>" placeholder="<?= $set ? '' : 'vendor ka naam' ?>"></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </div>
    <?php endforeach; ?>
    <div class="bar"><button class="b p" type="submit">Save — sab lagat</button>
      <span class="prog"><?= (int)$done ?> / <?= (int)$all ?> sawal ke jawab save hain</span>
      <a class="b" href="quotes.php?new=1">Quote banao →</a></div>
  </form>
</div>
<script>
(function () {
  var n = function (v) { v = String(v || '').replace(/[,₹%\s]/g, ''); return v === '' || isNaN(+v) ? null : +v; };
  var mkIn = document.querySelector('[name="cost[rules.markup_pct][v]"]');
  var upd = function () {
    var mk = mkIn && n(mkIn.value) !== null ? n(mkIn.value) : 30;
    document.querySelectorAll('tr[data-row]').forEach(function (tr) {
      var k = tr.querySelector('select.kind'), sell = k && k.value === 'sell';
      tr.querySelectorAll('input.c').forEach(function (c) {
        var out = c.parentNode.querySelector('.sell'); if (!out) return;
        var v = n(c.value);
        out.textContent = v === null ? '' : sell ? 'Customer ₹' + v.toLocaleString('en-IN') + ' (jaisa hai)'
          : 'Customer ≈ ₹' + Math.round(v * (1 + mk / 100)).toLocaleString('en-IN') + ' (+' + mk + '%)';
      });
    });
  };
  document.getElementById('f').addEventListener('change', upd);
  document.getElementById('f').addEventListener('input', function (e) { if (e.target.classList.contains('seed')) e.target.classList.remove('seed'); upd(); });
  upd();
})();
</script>
</body>
</html>
