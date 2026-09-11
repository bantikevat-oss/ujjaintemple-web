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
/* The listing is a card grid; a 760px reading measure only ever fits two. */
.wrap.wide{max-width:1180px}
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
/* ── Blog grid: auto-fill so it lands on 4 / 3 / 2 / 1 columns by width, with
      no breakpoint list to keep in step with the container. ── */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:1.3rem;margin:1.6rem 0 2rem}
.post{background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
.post:hover{transform:translateY(-3px);box-shadow:0 8px 22px rgba(139,26,26,.10);border-color:var(--gold)}
.post .thumb{display:block;aspect-ratio:16/10;background:var(--cream);overflow:hidden}
.post .thumb img{width:100%;height:100%;object-fit:cover;display:block;border-radius:0}
.post .body{padding:.9rem 1rem 1.1rem;display:flex;flex-direction:column;flex:1}
/* Cards use h3 inside the listing (the page's own h2s are section headings) and
   h2 on any page that needs the card itself to be the heading — style both. */
.post :is(h2,h3){font-size:1.06rem;margin:.15rem 0 .4rem;line-height:1.4}
.post :is(h2,h3) a{color:var(--maroon);text-decoration:none}
.post:hover :is(h2,h3) a{color:var(--saffron)}
.post .excerpt{color:var(--muted);font-size:.9rem;line-height:1.65;margin:0 0 .8rem;flex:1}
.post .foot-row{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;font-size:.8rem;color:var(--muted);margin-top:auto}
/* ── Blog furniture (2026-09-11) ────────────────────────────────────────────
   Aman: "ye news jaisa na lage, isko blog jaisa dalo". What actually does that
   is the byline, the reading time, the lead post and the breathing room — not a
   new palette. Colours stay the site's saffron/maroon/gold/cream.
   No decorative green anywhere, per the sitewide rule. ── */
.blog-head{padding:.6rem 0 0}
.eyebrow{margin:0;font-size:.74rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--saffron)}
.blog-head h1{margin:.45rem 0 .5rem}
.byline{display:flex;flex-wrap:wrap;align-items:center;gap:.45rem;margin:.2rem 0 1rem;font-size:.9rem;color:var(--muted)}
.byline .avatar{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--maroon);color:#fff;font-size:.7rem;font-weight:700;letter-spacing:.04em;font-family:system-ui,sans-serif}
.byline time{color:inherit}
.dot{opacity:.55}
.kicker{display:flex;flex-wrap:wrap;align-items:center;gap:.45rem;margin:0 0 .45rem;font-size:.78rem;color:var(--muted)}
.tag-solid{background:var(--maroon);border-color:var(--maroon);color:#fff}
.sec-head{border-top:1px solid var(--line);padding-top:1.4rem;margin-top:2.2rem;font-size:1.25rem}
.tagrow{display:flex;flex-wrap:wrap;gap:.35rem;margin:1.6rem 0 0;padding-top:1rem;border-top:1px solid var(--line)}

/* Lead post — one wide card, image beside the text above 760px. */
.lead-post{display:grid;grid-template-columns:1fr;gap:0;background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;margin:1.4rem 0 .4rem}
.lead-post .thumb{display:block;aspect-ratio:16/10;background:var(--cream);overflow:hidden}
.lead-post .thumb img{width:100%;height:100%;object-fit:cover;display:block}
.lead-post .body{padding:1.2rem 1.3rem 1.4rem;display:flex;flex-direction:column}
.lead-post h2{margin:0 0 .5rem;font-size:1.5rem;line-height:1.35}
.lead-post h2 a{color:var(--maroon);text-decoration:none}
.lead-post:hover h2 a{color:var(--saffron)}
.lead-post .excerpt{color:var(--muted);margin:0 0 .8rem}
.lead-post .foot-row{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;font-size:.84rem;color:var(--muted);margin:0}
.lead-post .more{margin:.9rem 0 0}
.lead-post .more a{font-weight:700;text-decoration:none;color:var(--maroon)}
.lead-post .more a:hover{color:var(--saffron)}
@media(min-width:760px){
  .lead-post{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);align-items:stretch}
  .lead-post .thumb{aspect-ratio:auto;height:100%}
  .lead-post .body{padding:1.6rem 1.7rem}
  .lead-post h2{font-size:1.75rem}
}
.pager{display:flex;align-items:center;gap:1rem;justify-content:center;font-size:.9rem;color:var(--muted);margin:1.6rem 0 0}

/* ── मुख्यमंत्री block ── */
.cm{background:#fff;border:1px solid var(--line);border-inline-start:4px solid var(--maroon);border-radius:0 14px 14px 0;padding:1.3rem 1.4rem 1.5rem;margin:2.4rem 0}
.cm>h2{margin-top:0}
.cm-intro{color:var(--muted);margin:0 0 1rem}
.cm-list{list-style:none;margin:1.1rem 0 0;padding:0;border-inline-start:2px solid var(--gold);padding-inline-start:1.15rem}
.cm-list>li{position:relative;padding:0 0 1.4rem}
.cm-list>li:last-child{padding-bottom:0}
/* The node on the timeline rail. Offset is the rail width + its own radius. */
.cm-list>li::before{content:"";position:absolute;inset-inline-start:-1.51rem;top:.45rem;width:11px;height:11px;border-radius:50%;background:var(--saffron);box-shadow:0 0 0 3px #fff}
.cm-date{margin:0;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--saffron)}
.cm-list h3{margin:.2rem 0 .4rem;font-size:1.08rem}
.cm-list p{margin:0 0 .5rem}
.cm-impact{color:var(--ink);background:var(--cream);border-radius:8px;padding:.55rem .7rem;font-size:.93rem}
.cm-src{font-size:.84rem;color:var(--muted);margin:0}
.cm-note{font-size:.84rem;color:var(--muted);border-top:1px solid var(--line);margin:1.3rem 0 0;padding-top:.9rem}
@media(max-width:400px){.grid{grid-template-columns:1fr}}
@media(max-width:520px){body{font-size:16px}h1{font-size:1.55rem}}
</style>
</head>
<body>
<div class="top"><div class="wrap"><a href="/hi/" class="brand">UjjainTemple.com</a> &nbsp;·&nbsp; <a href="/hi/simhastha-2028/">सिंहस्थ 2028</a></div></div>
<div class="wrap<?= !empty($head['wide']) ? ' wide' : '' ?>">
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
<?php /* GA4 — same property as the SSG site (G-2E9XG3RLPS). This section is served
         by PHP and never sees index.html, so without this block every blog pageview
         would be invisible in Analytics while the rest of the site reported fine.
         Loaded on idle / first interaction, matching the main site's budget. */ ?>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-2E9XG3RLPS');
  (function () {
    var fired = false;
    function loadGtag() {
      if (fired) return; fired = true;
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=G-2E9XG3RLPS';
      document.head.appendChild(s);
    }
    window.addEventListener('scroll', loadGtag, { once: true, passive: true });
    window.addEventListener('click', loadGtag, { once: true });
    window.addEventListener('touchstart', loadGtag, { once: true, passive: true });
    if ('requestIdleCallback' in window) { requestIdleCallback(loadGtag, { timeout: 1200 }); }
    else { setTimeout(loadGtag, 1200); }
  })();
</script>
</body>
</html>
