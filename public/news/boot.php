<?php
/**
 * UjjainTemple.com — Simhastha news engine bootstrap.
 *
 * Loads config, opens the DB, and defines the guard constant every other file in
 * this directory checks. Nothing here may emit output.
 *
 * 🔴 Config lives ABOVE the webroot and is NEVER in the repo or in dist/:
 *     server : ~/domains/ujjaintemple.com/news-config.php
 *     local  : <repo>/news-config.php      (gitignored)
 * Both resolve to __DIR__/../../news-config.php, because the engine sits at
 * public_html/news/ on the server and public/news/ in the repo.
 *
 * Target runtime is PHP 7.4 (Hostinger). Do not use 8.0+ syntax or functions
 * (no match, no ?->, no str_contains/str_starts_with) — see LANDMINES.md.
 */

define('UJT_NEWS', true);

require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/http.php';
require_once __DIR__ . '/lib/slug.php';

function ujt_news_config()
{
    static $cfg = null;
    if ($cfg !== null) return $cfg;

    $path = getenv('UJT_NEWS_CONFIG');
    if (!$path || !is_file($path)) {
        $path = __DIR__ . '/../../news-config.php';
    }
    if (!is_file($path)) {
        ujt_fail(500, 'News section is not configured on this host.');
    }
    $cfg = require $path;
    if (!is_array($cfg) || empty($cfg['db']['name'])) {
        ujt_fail(500, 'News config is malformed.');
    }
    $cfg += ['site' => []];
    $cfg['site'] += [
        'base_url'     => 'https://ujjaintemple.com',
        'section_path' => '/hi/simhastha-2028-news/',
        'section_name' => 'सिंहस्थ 2028 समाचार',
        'publisher'    => 'UjjainTemple.com',
        'logo'         => 'https://ujjaintemple.com/images/og/default.webp',
        'phone'        => '+91 74007 24456',
        'uploads_dir'  => __DIR__ . '/../images/news',
        'uploads_url'  => '/images/news',
    ];
    return $cfg;
}

/**
 * Sections served by this one engine (2026-09-19). Each is a separate public URL
 * space over the same article table, split by `ujt_news_articles.section`:
 *   news — /hi/simhastha-2028-news/  BNA tenant 4, NewsArticle + Google News sitemap
 *   blog — /hi/blog/                 BNA blog tenant, evergreen BlogPosting, no news sitemap
 * The key comes from the rewrite (`sec=`) on public pages and from `section=` on
 * the API endpoint. Anything unknown falls back to 'news', which keeps every URL
 * and payload that existed before this change behaving exactly as it did.
 */
function ujt_sections()
{
    $c = ujt_news_config()['site'];
    return [
        'news' => ['path' => $c['section_path'], 'name' => $c['section_name']],
        'blog' => ['path' => '/hi/blog/',        'name' => 'उज्जैन यात्रा ब्लॉग'],
    ];
}

/** Current section key. Set once by the front controller or API, read everywhere. */
function ujt_section($set = null)
{
    static $key = 'news';
    if ($set !== null) {
        $key = array_key_exists((string) $set, ujt_sections()) ? (string) $set : 'news';
    }
    return $key;
}

/** Absolute public URL of the section index. */
function ujt_section_url($sec = null)
{
    $c = ujt_news_config();
    $all = ujt_sections();
    $key = $sec !== null && isset($all[$sec]) ? $sec : ujt_section();
    return rtrim($c['site']['base_url'], '/') . $all[$key]['path'];
}

/** Absolute public URL of one article. Single source of truth. */
function ujt_article_url($slug, $sec = null)
{
    return ujt_section_url($sec) . rawurlencode($slug) . '/';
}
