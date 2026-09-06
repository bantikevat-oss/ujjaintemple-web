<?php
/**
 * BNA categories endpoint.
 * Tenant config: categories_endpoint = /api/news-categories.php?action=list
 * Public on purpose — BNA prefers an unauthenticated fetch and only falls back to
 * a logged-in call (category_matcher.php). Nothing here is sensitive.
 */
require_once __DIR__ . '/../news/boot.php';

ujt_json_error_mode();
header('X-Robots-Tag: noindex, nofollow');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') ujt_json_err('GET only', 405);

$rows = ujt_all(
    'SELECT id, name, slug, description FROM ujt_news_categories ORDER BY sort_order, id'
);
$out = [];
foreach ($rows as $r) {
    $out[] = [
        'id'          => (int) $r['id'],
        'name'        => $r['name'],
        'slug'        => $r['slug'],
        'description' => $r['description'],
    ];
}
ujt_json_ok(['categories' => $out]);
