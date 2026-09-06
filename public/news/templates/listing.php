<?php
if (!defined('UJT_NEWS')) { http_response_code(403); exit('Forbidden'); }
/** @var array $rows @var array $cats @var int $page @var int $pages @var int $total */
$c = ujt_news_config()['site'];
?>
<nav class="crumb"><a href="/hi/">होम</a> › <a href="/hi/simhastha-2028/">सिंहस्थ 2028</a> › समाचार</nav>

<h1>सिंहस्थ 2028 समाचार — उज्जैन</h1>

<?php /* Answer-first: self-contained, 35-90 words, sits directly under the H1.
         NamedRank scores this block; more importantly an AI answer engine can lift
         it whole. Re-count the words if you edit it. */ ?>
<div class="lede">
  <p>सिंहस्थ 2028 उज्जैन में <strong>27 मार्च से 27 मई 2028</strong> तक चलेगा, और इसके
  <strong>तीन शाही स्नान 9 अप्रैल, 23 अप्रैल और 8 मई 2028</strong> को हैं। यह पृष्ठ उसी मेले से
  जुड़ी ताज़ा जानकारी रखता है — मेला क्षेत्र का निर्माण, स्नान और अखाड़ों की व्यवस्था, ट्रेन-बस-सड़क
  के इंतज़ाम, होटल और धर्मशाला, तथा मंदिर-दर्शन की कतार। हर ख़बर के साथ यह भी लिखा रहता है कि
  उसका असर आपकी यात्रा की योजना पर क्या पड़ता है।</p>
</div>

<?php if (!$rows): ?>
  <div class="empty">
    <p>अभी इस खंड में कोई समाचार प्रकाशित नहीं हुआ है। तैयारी की पूरी जानकारी
    <a href="/hi/simhastha-2028/">सिंहस्थ 2028 पृष्ठ</a> पर उपलब्ध है।</p>
  </div>
<?php else: ?>
  <?php /* Blog grid. The whole card is one link target, but only the heading
           carries the anchor text — a thumbnail wrapped in its own bare <a> would
           hand Google a second, anchor-text-less link to the same URL. */ ?>
  <div class="grid">
    <?php foreach ($rows as $i => $r): ?>
      <?php
        $url = ujt_article_url($r['slug']);
        $img = trim((string) ($r['featured_image'] ?? ''));
        $alt = trim((string) ($r['featured_image_alt'] ?? '')) ?: $r['title'];
      ?>
      <article class="post">
        <?php if ($img !== ''): ?>
          <a class="thumb" href="<?= ujt_e($url) ?>" tabindex="-1" aria-hidden="true">
            <?php /* First row is above the fold on a wide screen; the rest are lazy. */ ?>
            <img src="<?= ujt_e($img) ?>" alt="<?= ujt_e($alt) ?>" width="640" height="400"
                 loading="<?= $i < 4 ? 'eager' : 'lazy' ?>" decoding="async">
          </a>
        <?php endif; ?>
        <div class="body">
          <h2><a href="<?= ujt_e($url) ?>"><?= ujt_e($r['title']) ?></a></h2>
          <p class="excerpt"><?= ujt_e(ujt_clip($r['summary'], 130)) ?></p>
          <p class="foot-row">
            <?php if (!empty($r['cat_name'])): ?><span class="tag"><?= ujt_e($r['cat_name']) ?></span><?php endif; ?>
            <?php if (!empty($r['published_at'])): ?>
              <time datetime="<?= ujt_e(date('c', strtotime($r['published_at']))) ?>"><?= ujt_e(ujt_hindi_date($r['published_at'])) ?></time>
            <?php endif; ?>
          </p>
        </div>
      </article>
    <?php endforeach; ?>
  </div>

  <?php if ($pages > 1): ?>
    <p class="meta">
      <?php if ($page > 1): ?><a href="<?= ujt_e(ujt_section_url() . ($page - 1 > 1 ? 'page/' . ($page - 1) . '/' : '')) ?>">← पिछला</a><?php endif; ?>
      &nbsp; पृष्ठ <?= (int) $page ?> / <?= (int) $pages ?> &nbsp;
      <?php if ($page < $pages): ?><a href="<?= ujt_e(ujt_section_url() . 'page/' . ($page + 1) . '/') ?>">अगला →</a><?php endif; ?>
    </p>
  <?php endif; ?>
<?php endif; ?>

<h2>सिंहस्थ 2028 कब से कब तक है?</h2>
<p>पूरा मेला 27 मार्च से 27 मई 2028 तक, यानी लगभग दो महीने चलेगा। तीन शाही स्नान 9 अप्रैल,
23 अप्रैल और 8 मई 2028 को होंगे। सात पर्व स्नान प्रस्तावित हैं, जिनकी तारीखें अभी घोषित नहीं हुई हैं।
पूरी तालिका <a href="/hi/simhastha-2028/">सिंहस्थ 2028 पृष्ठ</a> पर है।</p>

<h2>इस खंड में किस तरह की ख़बरें मिलेंगी?</h2>
<p>वही ख़बरें जो यात्रा की योजना बदलती हैं — मेला क्षेत्र और घाटों का निर्माण, स्नान तिथियों की
पुष्टि, अखाड़ों की पेशवाई, विशेष ट्रेन और बस, पार्किंग और पैदल मार्ग, ठहरने की व्यवस्था, और
महाकालेश्वर सहित मंदिरों की दर्शन व्यवस्था।</p>

<div class="cta">
  <p><strong>सिंहस्थ 2028 की यात्रा की योजना बना रहे हैं?</strong><br>
  होटल, कैब और दर्शन की व्यवस्था के लिए <a href="tel:+917400724456"><?= ujt_e($c['phone']) ?></a> पर कॉल करें,
  या <a href="/hi/simhastha-2028/simhastha-2028-accommodation/">ठहरने की गाइड</a> और
  <a href="/hi/simhastha-2028/simhastha-2028-transport-guide/">यात्रा गाइड</a> देखें।</p>
</div>
