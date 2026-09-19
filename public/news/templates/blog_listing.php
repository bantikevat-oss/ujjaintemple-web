<?php
if (!defined('UJT_NEWS')) { http_response_code(403); exit('Forbidden'); }
/**
 * /hi/blog/ — evergreen guides. Same post grid as the news section (_posts.php).
 * @var array $rows @var int $page @var int $pages @var int $total
 */
$c = ujt_news_config()['site'];
$lead = $rows ? $rows[0] : null;
?>
<nav class="crumb"><a href="/hi/">होम</a> › ब्लॉग</nav>

<header class="blog-head">
  <p class="eyebrow">UjjainTemple ब्लॉग</p>
  <h1>उज्जैन यात्रा ब्लॉग — मंदिर, दर्शन समय और मार्ग</h1>
  <p class="byline">
    <span class="avatar" aria-hidden="true">UT</span>
    UjjainTemple संपादकीय
    <?php if ($total): ?><span class="dot">·</span> <?= (int) $total ?> लेख<?php endif; ?>
    <?php if ($lead && !empty($lead['published_at'])): ?>
      <span class="dot">·</span> अंतिम अपडेट <?= ujt_e(ujt_hindi_date($lead['published_at'])) ?>
    <?php endif; ?>
  </p>
</header>

<?php /* Answer-first lede, 35-90 words, directly under the H1. Re-count if edited. */ ?>
<div class="lede">
  <p>यह ब्लॉग उज्जैन आने वाले यात्रियों के लिए है — किस मंदिर में दर्शन कब होते हैं, महाकालेश्वर से
  ओंकारेश्वर जैसे आसपास के तीर्थ कितनी दूर हैं और वहाँ कैसे पहुँचें, कहाँ ठहरें, और दो-तीन दिन की
  यात्रा की योजना कैसे बनाएँ। हर लेख में समय और दूरी वही दी जाती है जो इस साइट के मंदिर और
  यात्रा पृष्ठों पर है।</p>
</div>

<?php if (!$rows): ?>
  <div class="empty">
    <p>अभी इस ब्लॉग में कोई लेख प्रकाशित नहीं हुआ है। तब तक
    <a href="/hi/mandirs/">उज्जैन के मंदिर</a> और
    <a href="/hi/tour-and-travel-ujjain/">यात्रा पैकेज</a> देखें।</p>
  </div>
<?php else: ?>
  <?php require __DIR__ . '/_posts.php'; ?>
<?php endif; ?>

<div class="cta">
  <p><strong>उज्जैन यात्रा की योजना बना रहे हैं?</strong><br>
  कैब, होटल और दर्शन यात्रा के लिए <a href="tel:+917400724456"><?= ujt_e($c['phone']) ?></a> पर कॉल करें,
  या <a href="/hi/cab-booking/">कैब बुकिंग</a>, <a href="/hi/hotels/">होटल</a> और
  <a href="/hi/tour-and-travel-ujjain/">टूर पैकेज</a> देखें।</p>
</div>
