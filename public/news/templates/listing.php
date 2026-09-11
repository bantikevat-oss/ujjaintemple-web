<?php
if (!defined('UJT_NEWS')) { http_response_code(403); exit('Forbidden'); }
/**
 * @var array $rows @var array $cats @var int $page @var int $pages @var int $total
 * @var array $cm_articles @var array $cm_updates
 *
 * Presented as a BLOG, not a wire feed (Aman, 2026-09-11 — "ye news jaisa na lage,
 * isko blog jaisa dalo"): a lead post, an author byline and a reading time on every
 * card, tag pills instead of a dateline strip.
 *
 * What deliberately did NOT change with it: the URL, the NewsArticle markup and the
 * Google News sitemap. Those are what let a two-day-old post get crawled at all, and
 * they are invisible to a reader — the look is the thing Aman asked to change.
 */
$c = ujt_news_config()['site'];
$lead = $rows ? $rows[0] : null;
$rest = $rows ? array_slice($rows, 1) : [];
?>
<nav class="crumb"><a href="/hi/">होम</a> › <a href="/hi/simhastha-2028/">सिंहस्थ 2028</a> › ब्लॉग</nav>

<header class="blog-head">
  <p class="eyebrow">UjjainTemple ब्लॉग</p>
  <h1>सिंहस्थ 2028 ब्लॉग — उज्जैन मेला, स्नान और यात्रा</h1>
  <p class="byline">
    <span class="avatar" aria-hidden="true">UT</span>
    UjjainTemple संपादकीय
    <?php if ($total): ?><span class="dot">·</span> <?= (int) $total ?> लेख<?php endif; ?>
    <?php if ($lead && !empty($lead['published_at'])): ?>
      <span class="dot">·</span> अंतिम अपडेट <?= ujt_e(ujt_hindi_date($lead['published_at'])) ?>
    <?php endif; ?>
  </p>
</header>

<?php /* Answer-first: self-contained, 35-90 words, sits directly under the H1.
         NamedRank scores this block; more importantly an AI answer engine can lift
         it whole. Re-count the words if you edit it. */ ?>
<div class="lede">
  <p>सिंहस्थ 2028 उज्जैन में <strong>27 मार्च से 27 मई 2028</strong> तक चलेगा, और इसके
  <strong>तीन शाही स्नान 9 अप्रैल, 23 अप्रैल और 8 मई 2028</strong> को हैं। यह ब्लॉग उसी मेले से
  जुड़ी जानकारी रखता है — मेला क्षेत्र का निर्माण, स्नान और अखाड़ों की व्यवस्था, ट्रेन-बस-सड़क
  के इंतज़ाम, तथा होटल और धर्मशाला। हर लेख के साथ यह भी लिखा रहता है कि
  उसका असर आपकी यात्रा की योजना पर क्या पड़ता है।</p>
</div>

<?php if (!$rows): ?>
  <div class="empty">
    <p>अभी इस ब्लॉग में कोई लेख प्रकाशित नहीं हुआ है। तैयारी की पूरी जानकारी
    <a href="/hi/simhastha-2028/">सिंहस्थ 2028 पृष्ठ</a> पर उपलब्ध है।</p>
  </div>
<?php else: ?>

  <?php /* Lead post — the one thing that separates a blog index from a list of
           equal-weight headlines. Only the heading carries the anchor text; the
           image sits in its own aria-hidden link so Google is not handed a second,
           anchor-text-less link to the same URL. */ ?>
  <?php
    $lu   = ujt_article_url($lead['slug']);
    $limg = trim((string) ($lead['featured_image'] ?? ''));
  ?>
  <article class="lead-post">
    <?php if ($limg !== ''): ?>
      <a class="thumb" href="<?= ujt_e($lu) ?>" tabindex="-1" aria-hidden="true">
        <img src="<?= ujt_e($limg) ?>"
             alt="<?= ujt_e(trim((string) ($lead['featured_image_alt'] ?? '')) ?: $lead['title']) ?>"
             width="880" height="550" loading="eager" decoding="async">
      </a>
    <?php endif; ?>
    <div class="body">
      <p class="kicker">
        <?php if (!empty($lead['cat_name'])): ?><span class="tag tag-solid"><?= ujt_e($lead['cat_name']) ?></span><?php endif; ?>
        <span>नया लेख</span>
      </p>
      <h2><a href="<?= ujt_e($lu) ?>"><?= ujt_e($lead['title']) ?></a></h2>
      <p class="excerpt"><?= ujt_e(ujt_clip($lead['summary'], 240)) ?></p>
      <p class="foot-row">
        <span>UjjainTemple संपादकीय</span>
        <?php if (!empty($lead['published_at'])): ?>
          <span class="dot">·</span>
          <time datetime="<?= ujt_e(date('c', strtotime($lead['published_at']))) ?>"><?= ujt_e(ujt_hindi_date($lead['published_at'])) ?></time>
        <?php endif; ?>
        <span class="dot">·</span> <?= (int) ujt_read_minutes_len($lead['content_len'] ?? 0) ?> मिनट पढ़ें
      </p>
      <p class="more"><a href="<?= ujt_e($lu) ?>">पूरा लेख पढ़ें →</a></p>
    </div>
  </article>

  <?php if ($rest): ?>
    <h2 class="sec-head">और लेख</h2>
    <div class="grid">
      <?php foreach ($rest as $i => $r): ?>
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
                   loading="<?= $i < 3 ? 'eager' : 'lazy' ?>" decoding="async">
            </a>
          <?php endif; ?>
          <div class="body">
            <?php if (!empty($r['cat_name'])): ?>
              <p class="kicker"><span class="tag"><?= ujt_e($r['cat_name']) ?></span></p>
            <?php endif; ?>
            <h3><a href="<?= ujt_e($url) ?>"><?= ujt_e($r['title']) ?></a></h3>
            <p class="excerpt"><?= ujt_e(ujt_clip($r['summary'], 130)) ?></p>
            <p class="foot-row">
              <?php if (!empty($r['published_at'])): ?>
                <time datetime="<?= ujt_e(date('c', strtotime($r['published_at']))) ?>"><?= ujt_e(ujt_hindi_date($r['published_at'])) ?></time>
                <span class="dot">·</span>
              <?php endif; ?>
              <?= (int) ujt_read_minutes_len($r['content_len'] ?? 0) ?> मिनट पढ़ें
            </p>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>

  <?php if ($pages > 1): ?>
    <p class="pager">
      <?php if ($page > 1): ?><a href="<?= ujt_e(ujt_section_url() . ($page - 1 > 1 ? 'page/' . ($page - 1) . '/' : '')) ?>">← पिछला</a><?php endif; ?>
      <span>पृष्ठ <?= (int) $page ?> / <?= (int) $pages ?></span>
      <?php if ($page < $pages): ?><a href="<?= ujt_e(ujt_section_url() . 'page/' . ($page + 1) . '/') ?>">अगला →</a><?php endif; ?>
    </p>
  <?php endif; ?>
<?php endif; ?>

<?php /* ── मुख्यमंत्री खंड (Aman, 2026-09-11) ──
         Two sources, in this order: articles this section has published about the
         CM, then the hand-curated sourced list. Every curated row names its outlet
         and links out — we are reporting what was published, not speaking for the
         government, and the disclaimer under the block says exactly that. */ ?>
<?php if ($page === 1 && ($cm_articles || $cm_updates)): ?>
  <section id="mukhyamantri" class="cm">
    <h2>मुख्यमंत्री डॉ. मोहन यादव और सिंहस्थ 2028</h2>
    <p class="cm-intro">
      सिंहस्थ 2028 की तैयारियों की समीक्षा मुख्यमंत्री डॉ. मोहन यादव स्वयं करते रहे हैं।
      नीचे उनकी वे घोषणाएँ और निर्देश हैं जो प्रकाशित मीडिया रिपोर्ट्स में आए — और हर एक के
      साथ यह भी कि उसका असर आपकी उज्जैन यात्रा पर क्या पड़ता है।
    </p>

    <?php if ($cm_articles): ?>
      <div class="grid">
        <?php foreach ($cm_articles as $r): ?>
          <?php $url = ujt_article_url($r['slug']); ?>
          <article class="post">
            <div class="body">
              <p class="kicker"><span class="tag tag-solid">मुख्यमंत्री</span></p>
              <h3><a href="<?= ujt_e($url) ?>"><?= ujt_e($r['title']) ?></a></h3>
              <p class="excerpt"><?= ujt_e(ujt_clip($r['summary'], 130)) ?></p>
              <?php if (!empty($r['published_at'])): ?>
                <p class="foot-row">
                  <time datetime="<?= ujt_e(date('c', strtotime($r['published_at']))) ?>"><?= ujt_e(ujt_hindi_date($r['published_at'])) ?></time>
                </p>
              <?php endif; ?>
            </div>
          </article>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

    <?php if ($cm_updates): ?>
      <ol class="cm-list">
        <?php foreach ($cm_updates as $u): ?>
          <li>
            <p class="cm-date"><?= ujt_e(ujt_hindi_date($u['date'])) ?></p>
            <h3><?= ujt_e($u['title']) ?></h3>
            <p><?= ujt_e($u['detail']) ?></p>
            <p class="cm-impact"><strong>आपकी यात्रा पर असर:</strong> <?= ujt_e($u['impact']) ?></p>
            <p class="cm-src">स्रोत:
              <a href="<?= ujt_e($u['url']) ?>" rel="nofollow noopener" target="_blank"><?= ujt_e($u['source']) ?></a>
            </p>
          </li>
        <?php endforeach; ?>
      </ol>
    <?php endif; ?>

    <p class="cm-note">
      ऊपर दी गई जानकारी प्रकाशित मीडिया रिपोर्ट्स पर आधारित है, किसी शासकीय अधिसूचना पर नहीं।
      तिथियाँ, लागत और योजनाएँ प्रशासन द्वारा बदली जा सकती हैं। यह वेबसाइट शासन, मंदिर समिति
      या मेला प्राधिकरण से संबद्ध नहीं है।
    </p>
  </section>
<?php endif; ?>

<h2>सिंहस्थ 2028 कब से कब तक है?</h2>
<p>पूरा मेला 27 मार्च से 27 मई 2028 तक, यानी लगभग दो महीने चलेगा। तीन शाही स्नान 9 अप्रैल,
23 अप्रैल और 8 मई 2028 को होंगे। सात पर्व स्नान प्रस्तावित हैं, जिनकी तारीखें अभी घोषित नहीं हुई हैं।
पूरी तालिका <a href="/hi/simhastha-2028/">सिंहस्थ 2028 पृष्ठ</a> पर है।</p>

<h2>इस ब्लॉग में किस तरह के लेख मिलेंगे?</h2>
<p>वही जानकारी जो यात्रा की योजना बदलती है — मेला क्षेत्र और घाटों का निर्माण, स्नान तिथियों की
पुष्टि, अखाड़ों की पेशवाई, विशेष ट्रेन और बस, पार्किंग और पैदल मार्ग, ठहरने की व्यवस्था, और
महाकालेश्वर सहित मंदिरों की दर्शन व्यवस्था।</p>

<div class="cta">
  <p><strong>सिंहस्थ 2028 की यात्रा की योजना बना रहे हैं?</strong><br>
  होटल, कैब और दर्शन की व्यवस्था के लिए <a href="tel:+917400724456"><?= ujt_e($c['phone']) ?></a> पर कॉल करें,
  या <a href="/hi/simhastha-2028/simhastha-2028-accommodation/">ठहरने की गाइड</a> और
  <a href="/hi/simhastha-2028/simhastha-2028-transport-guide/">यात्रा गाइड</a> देखें।</p>
</div>
