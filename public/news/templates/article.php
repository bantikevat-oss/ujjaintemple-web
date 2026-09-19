<?php
if (!defined('UJT_NEWS')) { http_response_code(403); exit('Forbidden'); }
/** @var array $a  @var array $related */
$c = ujt_news_config()['site'];
$tags = $a['tags_json'] ? (json_decode($a['tags_json'], true) ?: []) : [];
?>
<?php $is_blog = !empty($is_blog); ?>
<nav class="crumb">
  <a href="/hi/">होम</a> ›<?php if (!$is_blog): ?> <a href="/hi/simhastha-2028/">सिंहस्थ 2028</a> ›<?php endif; ?>
  <a href="<?= ujt_e(ujt_section_url()) ?>">ब्लॉग</a>
</nav>

<article>
  <?php if (!empty($a['cat_name'])): ?>
    <p class="kicker"><span class="tag tag-solid"><?= ujt_e($a['cat_name']) ?></span></p>
  <?php endif; ?>
  <h1><?= ujt_e($a['title']) ?></h1>

  <?php /* Blog byline, not a newsroom dateline (Aman, 2026-09-11). The author name
           matches the NewsArticle `author` in render.php — a visible byline that
           disagrees with the markup is worse than none. */ ?>
  <p class="byline">
    <span class="avatar" aria-hidden="true">UT</span>
    UjjainTemple संपादकीय
    <?php if (!empty($a['published_at'])): ?>
      <span class="dot">·</span>
      <time datetime="<?= ujt_e(date('c', strtotime($a['published_at']))) ?>"><?= ujt_e(ujt_hindi_date($a['published_at'])) ?></time>
    <?php endif; ?>
    <span class="dot">·</span> <?= (int) ujt_read_minutes($a['content_html']) ?> मिनट पढ़ें
  </p>

  <?php if (!empty($a['summary'])): ?>
    <div class="lede"><p><?= ujt_e($a['summary']) ?></p></div>
  <?php endif; ?>

  <?php if (!empty($a['featured_image'])): ?>
    <img class="hero" src="<?= ujt_e($a['featured_image']) ?>"
         alt="<?= ujt_e($a['featured_image_alt'] ?: $a['title']) ?>"
         width="1200" height="630" loading="eager" decoding="async">
  <?php endif; ?>

  <div class="tablewrap-host"><?= $a['content_html'] ?></div>

  <?php if ($tags): ?>
    <p class="tagrow"><?php foreach (array_slice($tags, 0, 8) as $t): ?><span class="tag"><?= ujt_e($t) ?></span><?php endforeach; ?></p>
  <?php endif; ?>
</article>

<?php if ($is_blog): ?>
<div class="cta">
  <p><strong>उज्जैन आने की योजना है?</strong><br>
  कैब, होटल और दर्शन यात्रा के लिए <a href="tel:+917400724456"><?= ujt_e($c['phone']) ?></a> पर कॉल करें,
  या <a href="/hi/cab-booking/">कैब बुकिंग</a>, <a href="/hi/hotels/">होटल</a> और
  <a href="/hi/tour-and-travel-ujjain/">टूर पैकेज</a> देखें।</p>
</div>
<?php else: ?>
<div class="cta">
  <p><strong>इसका आपकी सिंहस्थ यात्रा पर क्या असर है?</strong><br>
  सिंहस्थ 2028 उज्जैन में <strong>27 मार्च – 27 मई 2028</strong> तक है; शाही स्नान
  <strong>9 अप्रैल, 23 अप्रैल और 8 मई</strong> को। इन तिथियों के आसपास होटल, धर्मशाला और
  कैब सबसे पहले भरते हैं। योजना बनाने के लिए
  <a href="/hi/simhastha-2028/simhastha-2028-accommodation/">ठहरने की गाइड</a>,
  <a href="/hi/simhastha-2028/simhastha-2028-transport-guide/">यात्रा गाइड</a> देखें
  या <a href="tel:+917400724456"><?= ujt_e($c['phone']) ?></a> पर कॉल करें।</p>
</div>
<?php endif; ?>

<?php if ($related): ?>
  <h2 class="sec-head"><?= $is_blog ? 'ब्लॉग पर और लेख' : 'सिंहस्थ 2028 पर और लेख' ?></h2>
  <?php foreach ($related as $r): ?>
    <div class="card">
      <h3><a href="<?= ujt_e(ujt_article_url($r['slug'])) ?>"><?= ujt_e($r['title']) ?></a></h3>
      <p><?= ujt_e(ujt_clip($r['summary'], 150)) ?></p>
    </div>
  <?php endforeach; ?>
<?php endif; ?>

<p class="meta"><a href="<?= ujt_e(ujt_section_url()) ?>">← <?= $is_blog ? 'उज्जैन यात्रा ब्लॉग' : 'सिंहस्थ 2028 ब्लॉग' ?></a></p>
