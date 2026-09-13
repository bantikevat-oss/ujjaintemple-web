<?php
/**
 * CLI: notify every subscriber (browser Web Push + Android FCM) about the latest
 * published Hindi article.
 *   php ~/domains/ujjaintemple.com/public_html/news/lib/push-send.php
 *
 * Normally not needed — api/news-articles.php notifies after each new published
 * article. Use this to re-send after an outage or to test delivery.
 * (Web access to news/lib/ is denied by .htaccess, and this also refuses non-CLI.)
 */
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/../boot.php';
require_once __DIR__ . '/webpush.php';

$latest = ujt_one(
    "SELECT slug, title FROM ujt_news_articles
      WHERE status = 'published' AND language = 'hi'
      ORDER BY published_at DESC, id DESC LIMIT 1"
);
if (!$latest) { fwrite(STDERR, "No published article to announce.\n"); exit(1); }

$r = ujt_push_notify_all(['title' => $latest['title'], 'url' => ujt_article_url($latest['slug'])], 120);
echo json_encode($r, JSON_UNESCAPED_UNICODE), "\n";
