<?php
/**
 * UjjainTemple.com — Image Manager Panel
 * Self-serve: browse all site images by section, replace / upload / delete.
 * Images are static assets → replacing a file at the same path updates the
 * live site instantly (no SSG rebuild needed).
 *
 * Security: password login, session, CSRF token, image-only + size validation,
 * path-traversal guard (realpath must stay inside images/), 2-step delete confirm.
 */

declare(strict_types=1);
$cfg = require __DIR__ . '/config.php';

session_set_cookie_params(['lifetime' => $cfg['session_ttl'], 'httponly' => true, 'samesite' => 'Lax', 'secure' => true]);
session_start();

// ---------- helpers ----------
function h(string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }
function csrf(): string { if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16)); return $_SESSION['csrf']; }
function check_csrf(): void { if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) { http_response_code(419); exit('Bad CSRF token — refresh and retry.'); } }
function is_auth(): bool { return !empty($_SESSION['auth']) && ($_SESSION['auth_time'] ?? 0) > time() - 3600 * 6; }

/** Resolve a user-supplied relative path safely inside images/. Returns absolute path or null. */
function safe_path(string $rel, string $root): ?string {
  $rel = str_replace(['..', "\0"], '', $rel);
  $rel = ltrim($rel, '/');
  $abs = realpath($root . '/' . $rel);
  if ($abs === false) {
    // may be a new file (upload) — resolve the parent dir instead
    $parent = realpath($root . '/' . dirname($rel));
    if ($parent === false || strpos($parent, $root) !== 0) return null;
    return $parent . '/' . basename($rel);
  }
  return (strpos($abs, $root) === 0) ? $abs : null;
}

$root = $cfg['images_dir'];
$msg = null; $err = null;

// ---------- image usage map (which image is used where + unused list) ----------
$usage = json_decode((string)@file_get_contents(__DIR__ . '/usage-map.json'), true) ?: [];
$usedMap = $usage['used'] ?? [];              // rel => [labels]
$unusedList = $usage['unused'] ?? [];         // [rel, ...]
$unusedSet = array_flip($unusedList);

// ---------- auth actions ----------
if (($_POST['do'] ?? '') === 'login') {
  check_csrf();
  $pw = (string)($_POST['password'] ?? '');
  if ($cfg['pass_hash'] !== '__UNSET__' && password_verify($pw, $cfg['pass_hash'])) {
    $_SESSION['auth'] = true; $_SESSION['auth_time'] = time();
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?')); exit;
  }
  usleep(600000); $err = 'Galat password.';
}
if (($_GET['do'] ?? '') === 'logout') { session_destroy(); header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?')); exit; }

// ---------- gated write actions ----------
if (is_auth() && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['do'])) {
  $act = $_POST['do'];
  if (in_array($act, ['replace','upload','delete','delete_unused'], true)) check_csrf();

  if ($act === 'replace' || $act === 'upload') {
    $target = safe_path((string)($_POST['target'] ?? ''), $root);
    if (!$target) { $err = 'Invalid target path.'; }
    elseif (empty($_FILES['file']['tmp_name']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) { $err = 'Upload fail — file missing ya bahut bada.'; }
    else {
      $ext = strtolower(pathinfo($act === 'upload' ? ($_FILES['file']['name'] ?? '') : $target, PATHINFO_EXTENSION));
      $srcExt = strtolower(pathinfo($_FILES['file']['name'] ?? '', PATHINFO_EXTENSION));
      if ($_FILES['file']['size'] > $cfg['max_upload']) { $err = 'File > 15MB.'; }
      elseif (!in_array($srcExt, $cfg['allowed'], true)) { $err = 'Sirf image files (jpg/png/webp/svg/avif).'; }
      else {
        // For replace: keep original filename+ext (references stay intact). Warn on ext mismatch but allow.
        if ($act === 'upload') {
          $target = safe_path(rtrim((string)$_POST['target'], '/') . '/' . basename($_FILES['file']['name']), $root);
          if (!$target) { $err = 'Invalid upload folder.'; }
        }
        if (!$err) {
          // basic image sanity for raster types
          if (in_array($srcExt, ['jpg','jpeg','png','webp','gif','avif'], true)) {
            $info = @getimagesize($_FILES['file']['tmp_name']);
            if ($info === false) { $err = 'File valid image nahi lag rahi.'; }
          }
          if (!$err) {
            if (@move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
              @chmod($target, 0644);
              $msg = ($act === 'replace' ? 'Replaced ✅ ' : 'Uploaded ✅ ') . h(str_replace($root, '', $target)) . ' — live in ~seconds (Ctrl+Shift+R to see).';
            } else { $err = 'Server pe write fail — folder permissions.'; }
          }
        }
      }
    }
  }

  if ($act === 'delete') {
    $target = safe_path((string)($_POST['target'] ?? ''), $root);
    if ($target && is_file($target) && ($_POST['confirm'] ?? '') === 'YES') {
      if (@unlink($target)) $msg = 'Deleted 🗑️ ' . h(str_replace($root, '', $target));
      else $err = 'Delete fail — permissions.';
    } else { $err = 'Delete confirm missing.'; }
  }

  // Bulk delete: remove every image flagged "not used on site" (from usage-map.json)
  if ($act === 'delete_unused') {
    if (($_POST['confirm'] ?? '') !== 'DELETE') { $err = 'Bulk delete confirm missing.'; }
    else {
      $done = 0; $fail = 0;
      foreach ($unusedList as $rel) {
        $target = safe_path((string)$rel, $root);
        if ($target && is_file($target)) { @unlink($target) ? $done++ : $fail++; }
      }
      $msg = "Bulk delete: {$done} unused image" . ($done === 1 ? '' : 's') . " removed" . ($fail ? " · {$fail} failed (permissions)" : '') . '.';
    }
  }
}

// ---------- scan images ----------
function scan_images(string $root): array {
  $out = [];
  if (!$root || !is_dir($root)) return $out;
  $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
  foreach ($it as $f) {
    if (!$f->isFile()) continue;
    $ext = strtolower($f->getExtension());
    if (!in_array($ext, ['jpg','jpeg','png','webp','svg','avif','gif','ico'], true)) continue;
    $rel = ltrim(str_replace($root, '', $f->getPathname()), '/');
    $section = explode('/', $rel)[0];
    if (strpos($rel, '/') === false) $section = 'root';
    $out[$section][] = ['rel' => $rel, 'size' => $f->getSize(), 'mtime' => $f->getMTime()];
  }
  foreach ($out as &$g) usort($g, fn($a,$b) => strcmp($a['rel'], $b['rel']));
  ksort($out);
  return $out;
}
$groups = is_auth() ? scan_images($root) : [];
$total = array_sum(array_map('count', $groups));
function fsize(int $b): string { return $b > 1048576 ? round($b/1048576,1).' MB' : round($b/1024).' KB'; }
$SITE = rtrim($cfg['site_url'], '/');
?>
<!doctype html>
<html lang="hi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>UjjainTemple — Image Panel</title>
<style>
  :root{--navy:#0f1f3d;--navy2:#17305c;--gold:#c99a3b;--gold2:#e0b45a;--cream:#faf6ee;--ink:#1c2431;--muted:#6b7686;--line:#e7ded0;--red:#b3341f;}
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;background:var(--cream);color:var(--ink)}
  a{color:var(--navy)}
  header.top{background:var(--navy);color:#fff;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:20}
  header.top b{font-size:17px;letter-spacing:.3px}
  header.top .gold{color:var(--gold)}
  header.top a.out{color:#fff;text-decoration:none;font-size:13px;border:1px solid rgba(255,255,255,.3);padding:6px 12px;border-radius:8px}
  .wrap{max-width:1180px;margin:0 auto;padding:20px}
  .flash{padding:12px 16px;border-radius:10px;margin:14px 0;font-size:14px}
  .flash.ok{background:#eef4ff;border:1px solid #b9cdf2;color:var(--navy)}
  .flash.err{background:#fbeae7;border:1px solid #eab5ab;color:var(--red)}
  .stat{color:var(--muted);font-size:13px;margin:6px 0 18px}
  .section{margin:26px 0}
  .section h2{font-size:15px;text-transform:uppercase;letter-spacing:1px;color:var(--navy);border-bottom:2px solid var(--gold);padding-bottom:6px;display:flex;justify-content:space-between}
  .section h2 span{color:var(--muted);font-weight:400;letter-spacing:0;text-transform:none}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:16px;margin-top:16px}
  .card{background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden;display:flex;flex-direction:column}
  .thumb{aspect-ratio:4/3;background:#f1ece1 url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>') center/cover;display:flex;align-items:center;justify-content:center;overflow:hidden}
  .thumb img{width:100%;height:100%;object-fit:cover;display:block}
  .meta{padding:9px 11px;font-size:12px;border-top:1px solid var(--line)}
  .meta .name{font-weight:600;word-break:break-all;line-height:1.3}
  .meta .sub{color:var(--muted);margin-top:3px;display:flex;justify-content:space-between}
  .usage{margin-top:6px;font-size:11px;line-height:1.35;display:flex;align-items:flex-start;gap:5px}
  .usage .dot{width:7px;height:7px;border-radius:50%;flex:0 0 auto;margin-top:4px}
  .usage.yes{color:var(--navy)} .usage.yes .dot{background:#1A56A0}
  .usage.no{color:var(--red);font-weight:600} .usage.no .dot{background:var(--red)}
  .row{display:flex;gap:6px;padding:0 11px 11px}
  .btn{flex:1;text-align:center;font-size:12px;padding:7px 4px;border-radius:8px;border:1px solid var(--line);background:#fff;cursor:pointer;font-weight:600}
  .btn.rep{background:var(--navy);color:#fff;border-color:var(--navy)}
  .btn.del{color:var(--red);border-color:#e6c2ba}
  .up-section{background:#fff;border:1px dashed var(--gold);border-radius:12px;padding:14px;margin-top:14px;font-size:13px}
  .up-section select,.up-section input[type=file]{margin:6px 6px 6px 0}
  /* login */
  .login{max-width:360px;margin:8vh auto;background:#fff;border:1px solid var(--line);border-radius:16px;padding:30px}
  .login h1{font-size:20px;color:var(--navy);margin:0 0 4px}
  .login p{color:var(--muted);font-size:13px;margin:0 0 18px}
  .login input{width:100%;padding:12px;border:1px solid var(--line);border-radius:10px;font-size:15px;margin-bottom:12px}
  .login button{width:100%;padding:12px;background:var(--navy);color:#fff;border:0;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer}
  .login .brand b{color:var(--gold)}
  dialog{border:0;border-radius:14px;padding:0;max-width:420px;width:92%}
  dialog .dhead{background:var(--navy);color:#fff;padding:14px 18px;font-weight:600}
  dialog .dbody{padding:18px}
  dialog .dbody p{font-size:14px;line-height:1.5}
  dialog input[type=file]{width:100%;margin:10px 0}
  dialog .dact{display:flex;gap:10px;margin-top:14px}
  dialog .dact button{flex:1;padding:10px;border-radius:9px;border:1px solid var(--line);background:#fff;cursor:pointer;font-weight:600}
  dialog .dact button.go{background:var(--navy);color:#fff;border-color:var(--navy)}
  dialog .dact button.godel{background:var(--red);color:#fff;border-color:var(--red)}
</style>
</head>
<body>
<?php if (!is_auth()): ?>
  <div class="login">
    <div class="brand" style="margin-bottom:14px"><b>UjjainTemple</b> · Image Panel</div>
    <h1>Login</h1>
    <p>Site images manage karne ke liye password daalo.</p>
    <?php if ($err): ?><div class="flash err"><?= h($err) ?></div><?php endif; ?>
    <?php if ($cfg['pass_hash'] === '__UNSET__'): ?><div class="flash err">Panel abhi setup nahi hua (secret.php missing).</div><?php endif; ?>
    <form method="post">
      <input type="hidden" name="do" value="login">
      <input type="hidden" name="csrf" value="<?= csrf() ?>">
      <input type="password" name="password" placeholder="Password" autofocus required>
      <button type="submit">Enter</button>
    </form>
  </div>
<?php else: ?>
  <header class="top">
    <b>Ujjain<span class="gold">Temple</span> · Image Panel</b>
    <a class="out" href="?do=logout">Logout</a>
  </header>
  <div class="wrap">
    <?php if ($msg): ?><div class="flash ok"><?= $msg ?></div><?php endif; ?>
    <?php if ($err): ?><div class="flash err"><?= h($err) ?></div><?php endif; ?>
    <div class="stat"><?= $total ?> images · <?= count($groups) ?> sections · <b style="color:var(--navy)"><?= count($unusedList) ?> unused</b> (site pe use nahi ho rahi) · replace karo → same path pe live turant update ho jayega</div>

    <?php if (count($unusedList) > 0): ?>
    <div class="up-section" style="border-color:var(--red);display:flex;flex-wrap:wrap;align-items:center;gap:12px;justify-content:space-between">
      <div>
        <b style="color:var(--red)">⚠️ <?= count($unusedList) ?> images site pe kahin use nahi ho rahi.</b>
        <span style="color:var(--muted)"> Ye purane / extra images hain — hata sakte ho.</span>
      </div>
      <div style="display:flex;gap:8px">
        <button type="button" class="btn" style="flex:0 0 auto" onclick="toggleUnused(this)">Sirf unused dikhao</button>
        <button type="button" class="btn del" style="flex:0 0 auto" onclick="delUnusedDlg.showModal()">Delete all <?= count($unusedList) ?> unused</button>
      </div>
    </div>
    <?php endif; ?>

    <div class="up-section">
      <form method="post" enctype="multipart/form-data" style="display:flex;flex-wrap:wrap;align-items:center;gap:6px">
        <input type="hidden" name="do" value="upload">
        <input type="hidden" name="csrf" value="<?= csrf() ?>">
        <b>Naya image upload:</b>
        <select name="target" required>
          <?php foreach (array_keys($groups) as $s): ?><option value="<?= h($s === 'root' ? '' : $s) ?>"><?= h($s) ?>/</option><?php endforeach; ?>
        </select>
        <input type="file" name="file" accept="image/*" required>
        <button class="btn rep" style="flex:0 0 auto;padding:8px 16px">Upload</button>
      </form>
    </div>

    <?php foreach ($groups as $section => $imgs): ?>
      <div class="section">
        <h2><?= h($section) ?> <span><?= count($imgs) ?> images</span></h2>
        <div class="grid">
          <?php foreach ($imgs as $im): $u = $SITE . '/images/' . $im['rel'];
            $isUnused = isset($unusedSet[$im['rel']]);
            $labels = $usedMap[$im['rel']] ?? []; ?>
            <div class="card" data-unused="<?= $isUnused ? '1' : '0' ?>">
              <div class="thumb"><img loading="lazy" src="<?= h($u) ?>?v=<?= $im['mtime'] ?>" alt=""></div>
              <div class="meta">
                <div class="name"><?= h(basename($im['rel'])) ?></div>
                <div class="sub"><span><?= h(dirname($im['rel'])) ?></span><span><?= fsize($im['size']) ?></span></div>
                <?php if ($isUnused): ?>
                  <div class="usage no"><span class="dot"></span>Site pe use nahi ho rahi</div>
                <?php elseif ($labels): ?>
                  <div class="usage yes"><span class="dot"></span><?= h('Used: ' . implode(' · ', $labels)) ?></div>
                <?php endif; ?>
              </div>
              <div class="row">
                <button class="btn rep" onclick="rep('<?= h($im['rel']) ?>')">Replace</button>
                <button class="btn del" onclick="del('<?= h($im['rel']) ?>')">Delete</button>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    <?php endforeach; ?>
  </div>

  <!-- Replace dialog -->
  <dialog id="repDlg">
    <div class="dhead">Image Replace karo</div>
    <div class="dbody">
      <form method="post" enctype="multipart/form-data">
        <input type="hidden" name="do" value="replace">
        <input type="hidden" name="csrf" value="<?= csrf() ?>">
        <input type="hidden" name="target" id="repTarget">
        <p>Ye image replace hogi:<br><b id="repName"></b><br><small>Same naam se save hogi taaki site pe reference na toote.</small></p>
        <input type="file" name="file" accept="image/*" required>
        <div class="dact">
          <button type="button" onclick="repDlg.close()">Cancel</button>
          <button type="submit" class="go">Replace</button>
        </div>
      </form>
    </div>
  </dialog>

  <!-- Delete dialog (2-step confirm) -->
  <dialog id="delDlg">
    <div class="dhead">Image Delete — pakka?</div>
    <div class="dbody">
      <form method="post" id="delForm">
        <input type="hidden" name="do" value="delete">
        <input type="hidden" name="csrf" value="<?= csrf() ?>">
        <input type="hidden" name="target" id="delTarget">
        <input type="hidden" name="confirm" value="">
        <p>⚠️ <b id="delName"></b> delete hogi. Ye <b>permanent</b> hai — recover nahi hogi, aur agar site kahin use kar rahi hai to wahan image toot jayegi.</p>
        <p><label><input type="checkbox" id="delChk"> Haan, mujhe pata hai — permanently delete karo</label></p>
        <div class="dact">
          <button type="button" onclick="delDlg.close()">Cancel</button>
          <button type="submit" class="godel" id="delGo" disabled>Delete</button>
        </div>
      </form>
    </div>
  </dialog>

  <!-- Bulk delete unused dialog (2-step confirm) -->
  <dialog id="delUnusedDlg">
    <div class="dhead">Saari unused images delete — pakka?</div>
    <div class="dbody">
      <form method="post" id="delUnusedForm">
        <input type="hidden" name="do" value="delete_unused">
        <input type="hidden" name="csrf" value="<?= csrf() ?>">
        <input type="hidden" name="confirm" value="">
        <p>⚠️ <b><?= count($unusedList) ?> images</b> jo site pe kahin use nahi ho rahi — sab <b>permanently delete</b> hongi. Recover nahi hongi.</p>
        <p><label><input type="checkbox" id="delUnusedChk"> Haan, saari unused images permanently delete karo</label></p>
        <div class="dact">
          <button type="button" onclick="delUnusedDlg.close()">Cancel</button>
          <button type="submit" class="godel" id="delUnusedGo" disabled>Delete all unused</button>
        </div>
      </form>
    </div>
  </dialog>

  <script>
    const repDlg=document.getElementById('repDlg'),delDlg=document.getElementById('delDlg');
    // Bulk-delete confirm wiring
    const duChk=document.getElementById('delUnusedChk');
    if(duChk){duChk.addEventListener('change',e=>{
      document.getElementById('delUnusedGo').disabled=!e.target.checked;
      document.querySelector('#delUnusedForm [name=confirm]').value=e.target.checked?'DELETE':'';});}
    // Filter: show only unused
    let onlyUnused=false;
    function toggleUnused(btn){onlyUnused=!onlyUnused;
      document.querySelectorAll('.card').forEach(c=>{c.style.display=(onlyUnused&&c.dataset.unused!=='1')?'none':'';});
      document.querySelectorAll('.section').forEach(s=>{const vis=[...s.querySelectorAll('.card')].some(c=>c.style.display!=='none');s.style.display=vis?'':'none';});
      btn.textContent=onlyUnused?'Sab dikhao':'Sirf unused dikhao';}
    function rep(rel){document.getElementById('repTarget').value=rel;document.getElementById('repName').textContent=rel;repDlg.showModal();}
    function del(rel){document.getElementById('delTarget').value=rel;document.getElementById('delName').textContent=rel;
      document.getElementById('delChk').checked=false;document.getElementById('delGo').disabled=true;
      document.querySelector('#delForm [name=confirm]').value='';delDlg.showModal();}
    document.getElementById('delChk').addEventListener('change',e=>{
      document.getElementById('delGo').disabled=!e.target.checked;
      document.querySelector('#delForm [name=confirm]').value=e.target.checked?'YES':'';});
  </script>
<?php endif; ?>
</body>
</html>
