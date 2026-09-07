<?php
/**
 * Simhastha news — SSR front controller.
 *
 * Routes (rewritten in .htaccess, always with a trailing slash):
 *   /hi/simhastha-2028-news/                 → listing page 1
 *   /hi/simhastha-2028-news/page/<n>/        → listing page n
 *   /hi/simhastha-2028-news/<slug>/          → article
 *   /hi/simhastha-2028-news/feed.xml         → RSS
 *   /hi/simhastha-2028-news/news-sitemap.xml → Google News sitemap (48h window)
 *   /hi/simhastha-2028-news/sitemap.xml      → archive sitemap (every article)
 *
 * The section is deliberately PHP-SSR: the rest of the site is static SSG, and a
 * rebuild+rsync per published article would make daily publishing unusable.
 */
require_once __DIR__ . '/boot.php';
require_once __DIR__ . '/lib/render.php';

$view = isset($_GET['view']) ? (string) $_GET['view'] : 'list';
$slug = isset($_GET['slug']) ? (string) $_GET['slug'] : '';
$page = max(1, (int) ($_GET['p'] ?? 1));

switch ($view) {
    case 'article': ujt_view_article($slug); break;
    case 'feed':    ujt_view_feed();         break;
    case 'sitemap': ujt_view_news_sitemap();    break;
    case 'archive': ujt_view_archive_sitemap(); break;
    default:        ujt_view_list($page);    break;
}
