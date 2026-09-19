<?php
if (!defined('UJT_NEWS')) { http_response_code(403); exit('Forbidden'); }
/**
 * Post grid shared by every section's listing: lead post, card grid, pager.
 * Moved verbatim out of listing.php (2026-09-19) when /hi/blog/ arrived, so the
 * news listing keeps the same markup and both sections stay in step.
 * @var array $rows @var int $page @var int $pages
 */
$lead = $rows[0];
$rest = array_slice($rows, 1);
?>

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
