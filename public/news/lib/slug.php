<?php
if (!defined('UJT_NEWS')) { http_response_code(403); exit('Forbidden'); }

/**
 * URL-safe slug, deliberately ASCII-only.
 *
 * BNA already transliterates — its live slugs look like
 * "mahakal-mandir-vivad-panda-samiti-prabandh-samiti-hamla" — so restricting to
 * [a-z0-9-] costs nothing and removes the whole percent-encoding class of routing
 * bugs (Apache decodes the path before matching, PHP decodes again). The rewrite
 * pattern in .htaccess must stay in step with this character set.
 */
function ujt_slugify($s)
{
    $s = mb_strtolower(trim((string) $s), 'UTF-8');
    $s = preg_replace('~[^A-Za-z0-9]+~u', '-', $s);
    $s = preg_replace('~-{2,}~', '-', $s);
    $s = trim($s, '-');
    $s = substr($s, 0, 150);
    $s = trim($s, '-');
    return $s !== '' ? $s : ('samachar-' . date('Ymd-His'));
}

function ujt_unique_slug($slug, $ignore_id = 0)
{
    $base = ujt_slugify($slug);
    $try  = $base;
    for ($i = 2; $i <= 60; $i++) {
        $row = ujt_one(
            'SELECT id FROM ujt_news_articles WHERE slug = ? AND id <> ? LIMIT 1',
            [$try, (int) $ignore_id]
        );
        if (!$row) return $try;
        $try = $base . '-' . $i;
    }
    return $base . '-' . substr(bin2hex(random_bytes(3)), 0, 5);
}
