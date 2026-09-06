<?php
/**
 * BNA article endpoint — create / update / delete.
 * Tenant config: articles_endpoint = /api/news-articles.php?action=create
 *
 * BNA derives the delete path by string-replacing `action=create` → `action=delete`
 * (publisher.php ~line 441), so the two actions MUST live on this one file and
 * differ only by that query param. Updates arrive as PUT with ?action=create.
 *
 * Field names are the phpsession payload from
 * news-agent/public/api/services/publisher.php::_bna_publish_phpsession().
 */
require_once __DIR__ . '/../news/boot.php';
require_once __DIR__ . '/../news/lib/auth.php';
require_once __DIR__ . '/../news/lib/sanitize.php';

ujt_json_error_mode();
header('X-Robots-Tag: noindex, nofollow');

$action = $_GET['action'] ?? 'create';
$method = $_SERVER['REQUEST_METHOD'];

ujt_require_auth();

if ($action === 'delete' || $method === 'DELETE') { ujt_news_delete(); }
if ($method === 'PUT')                           { ujt_news_save(true); }
if ($method === 'POST')                          { ujt_news_save(false); }
ujt_json_err('Unsupported method', 405);


function ujt_news_save($is_update)
{
    $in = ujt_body_json();
    if (!$in) ujt_json_err('JSON body required', 400);

    $title = ujt_clip($in['title'] ?? '', 300);
    if ($title === '') ujt_json_err('title is required', 422);

    $html = ujt_sanitize_html($in['content_html'] ?? ($in['content'] ?? ''));
    if (ujt_html_to_text($html) === '') ujt_json_err('content_html is empty after sanitising', 422);

    $id = (int) ($in['id'] ?? 0);
    if ($is_update && $id <= 0) ujt_json_err('id is required for update', 422);

    // Slug: the portal is the authority. BNA stores back whatever we return.
    $wanted = (string) ($in['slug'] ?? '');
    if ($wanted === '') $wanted = $title;
    $slug = ujt_unique_slug($wanted, $id);

    $summary = ujt_clip($in['summary'] ?? '', 1000);
    if ($summary === '') $summary = ujt_clip(ujt_html_to_text($html), 300);

    // meta_description is what search shows; og/social_description is the share hook.
    $meta_desc = ujt_clip($in['meta_description'] ?? $summary, 320);
    $og_desc   = ujt_clip($in['og_description'] ?? ($in['social_description'] ?? $meta_desc), 320);

    $cat = (int) ($in['category_id'] ?? 0);
    if ($cat > 0 && !ujt_one('SELECT id FROM ujt_news_categories WHERE id = ?', [$cat])) $cat = 0;
    if ($cat === 0) {
        $first = ujt_one('SELECT id FROM ujt_news_categories ORDER BY sort_order, id LIMIT 1');
        $cat = $first ? (int) $first['id'] : 0;
    }

    $extra = [];
    foreach ((array) ($in['additional_category_ids'] ?? []) as $x) {
        $x = (int) $x;
        if ($x > 0 && $x !== $cat) $extra[] = $x;
    }
    $tags = [];
    foreach ((array) ($in['tags'] ?? []) as $t) {
        $t = ujt_clip($t, 60);
        if ($t !== '') $tags[] = $t;
    }

    $status = (string) ($in['status'] ?? 'published');
    if (!in_array($status, ['published', 'draft', 'archived'], true)) $status = 'published';
    $lang = (string) ($in['language'] ?? 'hi');
    if (!in_array($lang, ['hi', 'en'], true)) $lang = 'hi';

    $img     = ujt_valid_image_url($in['featured_image'] ?? '');
    $og_img  = ujt_valid_image_url($in['og_image'] ?? $img);
    $img_alt = ujt_clip($in['featured_image_alt'] ?? $title, 300);

    $cols = [
        'slug'               => $slug,
        'title'              => $title,
        'summary'            => $summary,
        'content_html'       => $html,
        'meta_title'         => ujt_clip($in['meta_title'] ?? $title, 300),
        'meta_description'   => $meta_desc,
        'og_description'     => $og_desc,
        'featured_image'     => $img,
        'featured_image_alt' => $img_alt,
        'og_image'           => $og_img,
        'category_id'        => $cat ?: null,
        'extra_category_ids' => $extra ? implode(',', array_slice($extra, 0, 8)) : null,
        'tags_json'          => $tags ? json_encode($tags, JSON_UNESCAPED_UNICODE) : null,
        'language'           => $lang,
        'status'             => $status,
    ];

    if ($is_update) {
        // Existence is checked first: an UPDATE that sets identical values reports
        // 0 affected rows, which is not the same as "no such article".
        if (!ujt_one('SELECT id FROM ujt_news_articles WHERE id = ?', [$id])) {
            ujt_json_err('Article not found', 404);
        }
        $set = [];
        $vals = [];
        foreach ($cols as $k => $v) { $set[] = "$k = ?"; $vals[] = $v; }
        $vals[] = $id;
        ujt_q('UPDATE ujt_news_articles SET ' . implode(', ', $set) . ' WHERE id = ?', $vals);
    } else {
        $cols['published_at'] = ($status === 'published') ? date('Y-m-d H:i:s') : null;
        $names = array_keys($cols);
        $ph    = implode(', ', array_fill(0, count($names), '?'));
        ujt_q(
            'INSERT INTO ujt_news_articles (' . implode(', ', $names) . ") VALUES ($ph)",
            array_values($cols)
        );
        $id = (int) ujt_db()->lastInsertId();
    }

    ujt_json_ok(['article' => [
        'id'   => $id,
        'slug' => $slug,
        'url'  => ujt_article_url($slug),
    ]]);
}

function ujt_news_delete()
{
    $in = ujt_body_json();
    $id = (int) ($in['id'] ?? ($_GET['id'] ?? 0));
    if ($id <= 0) ujt_json_err('id is required', 422);

    $row = ujt_one('SELECT id FROM ujt_news_articles WHERE id = ?', [$id]);
    if (!$row) ujt_json_err('Article not found', 404);

    ujt_q('DELETE FROM ujt_news_articles WHERE id = ?', [$id]);
    ujt_json_ok(['deleted' => $id]);
}

/**
 * 🪤 The hero card is fetched by every visitor, so an attacker-supplied host would
 * make us hotlink anything. Only our own origin and the agent's are acceptable.
 */
function ujt_valid_image_url($u)
{
    $u = trim((string) $u);
    if ($u === '') return null;
    if (strpos($u, '/') === 0) return $u;                 // portal-local (upload.php)
    if (!preg_match('~^https://~i', $u)) return null;
    $host = strtolower((string) parse_url($u, PHP_URL_HOST));
    $ok = ['ujjaintemple.com', 'www.ujjaintemple.com', 'news.byteflowtech.in'];
    return in_array($host, $ok, true) ? $u : null;
}
