<?php
if (!defined('UJT_NEWS')) { http_response_code(403); exit('Forbidden'); }
/**
 * @var array  $head   title, description, canonical, og_image, robots, jsonld[]
 * @var string $body   rendered inner HTML
 */
$c = ujt_news_config()['site'];
$base = rtrim($c['base_url'], '/');
?><!DOCTYPE html>
<html lang="hi-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= ujt_e($head['title']) ?></title>
<meta name="description" content="<?= ujt_e($head['description']) ?>">
<link rel="canonical" href="<?= ujt_e($head['canonical']) ?>">
<meta name="robots" content="<?= ujt_e($head['robots'] ?? 'index, follow, max-image-preview:large, max-snippet:-1') ?>">
<meta property="og:type" content="<?= ujt_e($head['og_type'] ?? 'website') ?>">
<meta property="og:title" content="<?= ujt_e($head['title']) ?>">
<meta property="og:description" content="<?= ujt_e($head['og_description'] ?? $head['description']) ?>">
<meta property="og:url" content="<?= ujt_e($head['canonical']) ?>">
<meta property="og:locale" content="hi_IN">
<meta property="og:site_name" content="<?= ujt_e($c['publisher']) ?>">
<?php if (!empty($head['og_image'])): ?>
<meta property="og:image" content="<?= ujt_e($head['og_image']) ?>">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= ujt_e($head['og_image']) ?>">
<?php else: ?>
<meta name="twitter:card" content="summary">
<?php endif; ?>
<meta name="twitter:title" content="<?= ujt_e($head['title']) ?>">
<meta name="twitter:description" content="<?= ujt_e($head['og_description'] ?? $head['description']) ?>">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<?php foreach (($head['jsonld'] ?? []) as $blob): ?>
<script type="application/ld+json"><?= json_encode($blob, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
<?php endforeach; ?>
<style>
/* Self-contained on purpose: the SSG bundle is content-hashed and its name changes
   on every build, so linking it from PHP would 404 after the next deploy. */
@font-face{font-family:'Noto Sans Devanagari';src:url('/fonts/notosans-devanagari-variable.woff2') format('woff2');font-weight:400 700;font-display:swap}
@font-face{font-family:'Tiro Devanagari Sanskrit';src:url('/fonts/tiro-devanagari-400.woff2') format('woff2');font-weight:400;font-display:swap}
:root{--saffron:#D4621A;--maroon:#8B1A1A;--gold:#C9A84C;--cream:#FBF5EC;--ink:#1A1A1A;--link:#1A56A0;--muted:#5b5b5b;--line:#e6dccb}
*{box-sizing:border-box}
body{margin:0;background:var(--cream);color:var(--ink);font-family:'Noto Sans Devanagari',system-ui,sans-serif;line-height:1.75;font-size:17px}
a{color:var(--link)}
h1,h2,h3{font-family:'Tiro Devanagari Sanskrit','Noto Sans Devanagari',serif;line-height:1.3;color:var(--maroon);margin:1.6rem 0 .7rem}
h1{font-size:2rem;margin-top:0}h2{font-size:1.4rem}h3{font-size:1.15rem}
.wrap{max-width:760px;margin:0 auto;padding:0 1.1rem}
.top{background:var(--maroon);color:#fff;padding:.7rem 0;font-size:.92rem}
.top a{color:#fff;text-decoration:none}.top .brand{font-weight:700}
.crumb{font-size:.85rem;color:var(--muted);padding:1rem 0 .2rem}
.crumb a{color:var(--muted)}
.lede{background:#fff;border-inline-start:4px solid var(--saffron);padding:1rem 1.1rem;margin:1.2rem 0;border-radius:0 8px 8px 0}
.meta{font-size:.87rem;color:var(--muted);margin:.3rem 0 1.2rem}
.hero{width:100%;height:auto;border-radius:10px;margin:1rem 0;display:block}
article :is(p,ul,ol){margin:0 0 1.05rem}
article img{max-width:100%;height:auto;border-radius:8px}
article table{width:100%;border-collapse:collapse;margin:1rem 0}
article :is(th,td){border:1px solid var(--line);padding:.5rem .6rem;text-align:start}
.tablewrap{overflow-x:auto}
.card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:1rem 1.1rem;margin:0 0 1rem}
.card h2,.card h3{margin-top:0;font-size:1.15rem}
.card p{margin:.35rem 0 0;color:var(--muted);font-size:.95rem}
.card a{text-decoration:none}
.tag{display:inline-block;background:var(--cream);border:1px solid var(--line);color:var(--muted);border-radius:99px;padding:.1rem .6rem;font-size:.78rem;margin-inline-end:.3rem}
.cta{background:var(--maroon);color:#fff;border-radius:10px;padding:1.1rem;margin:2rem 0}
.cta a{color:#fff;font-weight:700}
.foot{border-top:1px solid var(--line);margin-top:2.5rem;padding:1.4rem 0 2.5rem;font-size:.87rem;color:var(--muted)}
.empty{background:#fff;border:1px dashed var(--line);border-radius:10px;padding:1.6rem;text-align:center;color:var(--muted)}
@media(max-width:520px){body{font-size:16px}h1{font-size:1.55rem}}
</style>
</head>
<body>
<div class="top"><div class="wrap"><a href="/hi/" class="brand">UjjainTemple.com</a> &nbsp;·&nbsp; <a href="/hi/simhastha-2028/">सिंहस्थ 2028</a></div></div>
<div class="wrap">
<?= $body ?>
<div class="foot">
  <p><strong>UjjainTemple.com</strong> — उज्जैन के मंदिर, घाट और सिंहस्थ 2028 की जानकारी।
  यात्रा, ठहरने या पूजा में सहायता के लिए <a href="tel:+917400724456"><?= ujt_e($c['phone']) ?></a> पर कॉल करें।</p>
  <p>सिंहस्थ 2028 की तारीखें प्रकाशित मीडिया रिपोर्ट्स पर आधारित हैं, किसी शासकीय अधिसूचना पर नहीं।
  प्रशासन द्वारा इनमें बदलाव संभव है — यात्रा से पहले पुष्टि कर लें।
  यह वेबसाइट किसी मंदिर समिति या प्रशासन से संबद्ध नहीं है।</p>
  <p>© <?= date('Y') ?> <a href="https://byteflowtech.in/">ByteFlow Technologies Pvt Ltd</a></p>
</div>
</div>
</body>
</html>
