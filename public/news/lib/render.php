<?php
if (!defined('UJT_NEWS')) { http_response_code(403); exit('Forbidden'); }
require_once __DIR__ . '/sanitize.php';

const UJT_PER_PAGE = 12;

/** "5 सितंबर 2026" — month names are spelled out because a numeric date reads as US format. */
function ujt_hindi_date($sql_dt)
{
    static $m = [1=>'जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];
    $ts = strtotime((string) $sql_dt);
    if (!$ts) return '';
    return (int) date('j', $ts) . ' ' . $m[(int) date('n', $ts)] . ' ' . date('Y', $ts);
}

/**
 * Reading time in whole minutes — the byline signal that makes a page read as a
 * blog rather than a wire feed.
 *
 * 🪤 `str_word_count()` counts ZERO on Devanagari (it is byte/locale based), so
 * it cannot be used here; splitting on Unicode whitespace is what actually works.
 * 180 wpm is the conservative end for Hindi prose.
 */
function ujt_read_minutes($html)
{
    $text  = ujt_html_to_text((string) $html);
    $words = preg_split('/\s+/u', trim($text), -1, PREG_SPLIT_NO_EMPTY);
    $n     = $words ? count($words) : 0;
    return max(1, (int) ceil($n / 180));
}

/**
 * Same idea for a listing card, where the body was never fetched.
 *
 * Dividing raw HTML length by 1000 is deliberately conservative: the markup is
 * counted along with the prose, so the estimate errs low rather than promising a
 * longer read than the article delivers.
 */
function ujt_read_minutes_len($chars)
{
    return max(1, (int) round(((int) $chars) / 1000));
}

/**
 * CM-related articles already published in this section.
 *
 * Matched two ways on purpose: the dedicated category if it exists on this host
 * (it is seeded in sql/seed_categories.sql and has to be synced into BNA before
 * the agent can pick it), and a plain title/tag match so an article filed under
 * "सिंहस्थ तैयारी" that is in fact about the CM still surfaces here. Without the
 * second arm the block would stay empty on every host where the category has not
 * been synced yet — an empty heading is worse than no heading.
 */
function ujt_cm_articles($limit = 3)
{
    $like = '%मोहन यादव%';
    $like2 = '%मुख्यमंत्री%';
    return ujt_all(
        "SELECT a.slug, a.title, a.summary, a.published_at, a.featured_image, a.featured_image_alt,
                c.name AS cat_name
           FROM ujt_news_articles a
           LEFT JOIN ujt_news_categories c ON c.id = a.category_id
          WHERE a.status='published' AND a.language='hi'
            AND (c.slug = 'mukhyamantri-shasan'
                 OR a.title LIKE ? OR a.title LIKE ?
                 OR a.tags_json LIKE ? OR a.tags_json LIKE ?)
          ORDER BY a.published_at DESC, a.id DESC
          LIMIT " . (int) $limit,
        [$like, $like2, $like, $like2]
    );
}

/** Hand-curated, sourced CM announcements — see data/cm_simhastha.php. */
function ujt_cm_updates()
{
    static $rows = null;
    if ($rows === null) {
        $f = __DIR__ . '/../data/cm_simhastha.php';
        $rows = is_file($f) ? (require $f) : [];
    }
    return is_array($rows) ? $rows : [];
}

function ujt_render($template, $vars, $head)
{
    extract($vars, EXTR_SKIP);
    ob_start();
    require __DIR__ . '/../templates/' . $template . '.php';
    $body = ob_get_clean();
    header('Content-Type: text/html; charset=utf-8');
    require __DIR__ . '/../templates/layout.php';
    exit;
}

function ujt_publisher_node()
{
    $c = ujt_news_config()['site'];
    return [
        '@type' => 'Organization',
        'name'  => $c['publisher'],
        'url'   => rtrim($c['base_url'], '/') . '/',
        'logo'  => ['@type' => 'ImageObject', 'url' => $c['logo']],
    ];
}

function ujt_view_list($page)
{
    $c = ujt_news_config()['site'];
    $total = (int) ujt_one(
        "SELECT COUNT(*) n FROM ujt_news_articles WHERE status='published' AND language='hi'"
    )['n'];
    $pages  = max(1, (int) ceil($total / UJT_PER_PAGE));
    $page   = min($page, $pages);
    $offset = ($page - 1) * UJT_PER_PAGE;

    // LIMIT/OFFSET are ints we computed, never user strings — but they still cannot
    // be bound as params in MySQL prepared statements, so they are cast explicitly.
    $rows = ujt_all(
        "SELECT a.slug, a.title, a.summary, a.published_at,
                a.featured_image, a.featured_image_alt, c.name AS cat_name,
                CHAR_LENGTH(a.content_html) AS content_len
           FROM ujt_news_articles a
           LEFT JOIN ujt_news_categories c ON c.id = a.category_id
          WHERE a.status='published' AND a.language='hi'
          ORDER BY a.published_at DESC, a.id DESC
          LIMIT " . (int) UJT_PER_PAGE . " OFFSET " . (int) $offset
    );
    $cats = ujt_all('SELECT id, name, slug FROM ujt_news_categories ORDER BY sort_order, id');

    // मुख्यमंत्री block (Aman, 2026-09-11). Published CM articles first; the curated,
    // sourced list below them is what makes the section useful before the engine has
    // published any. Page 2+ skips it — it belongs on the section's front page only.
    $cm_articles = $page === 1 ? ujt_cm_articles(3) : [];
    $cm_updates  = $page === 1 ? ujt_cm_updates()   : [];

    $canonical = ujt_section_url() . ($page > 1 ? 'page/' . $page . '/' : '');
    $title = $page > 1
        ? "सिंहस्थ 2028 ब्लॉग — पृष्ठ $page | UjjainTemple"
        // "ब्लॉग" leads because Aman wants the section to read as a blog, but
        // "समाचार" stays in the tail — it is the word people actually search.
        : 'सिंहस्थ 2028 ब्लॉग और समाचार — उज्जैन मेला, स्नान और यात्रा की जानकारी';
    $desc = 'सिंहस्थ 2028 उज्जैन (27 मार्च – 27 मई 2028) पर लेख और ताज़ा जानकारी — शाही स्नान, '
          . 'अखाड़े, ट्रेन-बस, होटल, दर्शन व्यवस्था, और मुख्यमंत्री डॉ. मोहन यादव की घोषणाएँ।';

    $itemlist = ['@context' => 'https://schema.org', '@type' => 'ItemList', 'itemListElement' => []];
    foreach ($rows as $i => $r) {
        $itemlist['itemListElement'][] = [
            '@type' => 'ListItem', 'position' => $i + 1,
            'url' => ujt_article_url($r['slug']), 'name' => $r['title'],
        ];
    }

    ujt_render('listing',
        compact('rows', 'cats', 'page', 'pages', 'total', 'cm_articles', 'cm_updates'),
        [
            'title' => $title, 'description' => $desc, 'canonical' => $canonical,
            'og_image' => $c['logo'],
            // The listing is a card grid, not a reading column — it gets the wider
            // wrap. Article pages keep the 760px measure.
            'wide' => true,
            'robots' => $page > 1 ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1',
            'jsonld' => [
                ujt_breadcrumbs([['होम', '/hi/'], ['सिंहस्थ 2028', '/hi/simhastha-2028/'], ['ब्लॉग', $canonical]]),
                $itemlist,
                ujt_faq_node([
                    ['सिंहस्थ 2028 कब से कब तक है?',
                     'सिंहस्थ 2028 उज्जैन में 27 मार्च से 27 मई 2028 तक चलेगा। तीन शाही स्नान 9 अप्रैल, 23 अप्रैल और 8 मई 2028 को हैं। सात पर्व स्नान प्रस्तावित हैं, जिनकी तारीखें अभी घोषित नहीं हुई हैं।'],
                    ['इस ब्लॉग में किस तरह के लेख मिलेंगे?',
                     'मेला क्षेत्र और घाटों का निर्माण, स्नान तिथियों की पुष्टि, अखाड़ों की पेशवाई, विशेष ट्रेन और बस, पार्किंग और पैदल मार्ग, ठहरने की व्यवस्था, और मंदिरों की दर्शन व्यवस्था।'],
                    ['मुख्यमंत्री डॉ. मोहन यादव ने सिंहस्थ 2028 को लेकर क्या कहा है?',
                     'प्रकाशित मीडिया रिपोर्ट्स के अनुसार मुख्यमंत्री डॉ. मोहन यादव ने सिंहस्थ 2028 की तैयारियों की नियमित समीक्षा की है — इनमें शिप्रा पर 29 किलोमीटर घाट और 21 बैराज का भूमिपूजन, 945.20 करोड़ रुपये का 5.30 किलोमीटर एलिवेटेड कॉरिडोर, और विभागों को दीपावली 2027 तक काम पूरा करने के निर्देश शामिल हैं। इस पृष्ठ पर “मुख्यमंत्री और सिंहस्थ 2028” खंड में हर घोषणा स्रोत सहित दी गई है।'],
                ]),
            ],
        ]
    );
}

function ujt_view_article($slug)
{
    if ($slug === '') ujt_not_found();
    $a = ujt_one(
        "SELECT a.*, c.name AS cat_name
           FROM ujt_news_articles a
           LEFT JOIN ujt_news_categories c ON c.id = a.category_id
          WHERE a.slug = ? AND a.status='published' LIMIT 1",
        [$slug]
    );
    if (!$a) ujt_not_found();

    // Best-effort counter; a locked row here must never cost us the pageview.
    // 🔴 `updated_at` is ON UPDATE CURRENT_TIMESTAMP, so a bare counter bump would
    // restamp it on every single pageview — making it mean "last read" instead of
    // "last edited", and turning the sitemap's <lastmod> into a value that is always
    // "now". Assigning the column to itself suppresses the automatic update.
    try { ujt_q('UPDATE ujt_news_articles SET view_count = view_count + 1, updated_at = updated_at WHERE id = ?', [$a['id']]); }
    catch (Exception $e) { /* ignore */ }

    $related = ujt_all(
        "SELECT slug, title, summary FROM ujt_news_articles
          WHERE status='published' AND language='hi' AND id <> ?
          ORDER BY published_at DESC, id DESC LIMIT 4",
        [$a['id']]
    );

    $canonical = ujt_article_url($a['slug']);
    $desc  = $a['meta_description'] ?: ujt_clip($a['summary'], 160);
    $ogd   = $a['og_description'] ?: $desc;
    $img   = $a['og_image'] ?: $a['featured_image'];
    if ($img && strpos($img, '/') === 0) $img = rtrim(ujt_news_config()['site']['base_url'], '/') . $img;

    $body_text = ujt_html_to_text($a['content_html']);
    $news = [
        '@context'         => 'https://schema.org',
        '@type'            => 'NewsArticle',
        'headline'         => ujt_clip($a['title'], 110),
        'description'      => $desc,
        'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $canonical],
        'url'              => $canonical,
        'datePublished'    => date('c', strtotime($a['published_at'] ?: $a['created_at'])),
        'dateModified'     => date('c', strtotime($a['updated_at'] ?: ($a['published_at'] ?: $a['created_at']))),
        'inLanguage'       => 'hi-IN',
        'articleSection'   => $a['cat_name'] ?: 'सिंहस्थ 2028',
        'wordCount'        => str_word_count($body_text) ?: mb_strlen($body_text) / 5,
        'author'           => ['@type' => 'Organization', 'name' => 'UjjainTemple Editorial',
                               'url' => rtrim(ujt_news_config()['site']['base_url'], '/') . '/hi/about/'],
        'publisher'        => ujt_publisher_node(),
        'isAccessibleForFree' => true,
    ];
    if ($img) $news['image'] = [$img];
    if ($a['tags_json']) {
        $t = json_decode($a['tags_json'], true);
        if ($t) $news['keywords'] = implode(', ', $t);
    }

    ujt_render('article', compact('a', 'related'), [
        'title' => ujt_clip($a['meta_title'] ?: $a['title'], 70) . ' | UjjainTemple',
        'description' => $desc, 'og_description' => $ogd,
        'canonical' => $canonical, 'og_image' => $img, 'og_type' => 'article',
        'jsonld' => [
            $news,
            ujt_breadcrumbs([
                ['होम', '/hi/'], ['सिंहस्थ 2028', '/hi/simhastha-2028/'],
                ['समाचार', ujt_section_url()], [ujt_clip($a['title'], 60), $canonical],
            ]),
        ],
    ]);
}

function ujt_breadcrumbs($items)
{
    $base = rtrim(ujt_news_config()['site']['base_url'], '/');
    $out = ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => []];
    foreach ($items as $i => $it) {
        $url = $it[1];
        if (strpos($url, 'http') !== 0) $url = $base . $url;
        $out['itemListElement'][] = ['@type' => 'ListItem', 'position' => $i + 1,
                                     'name' => $it[0], 'item' => $url];
    }
    return $out;
}

function ujt_faq_node($qa)
{
    $out = ['@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => []];
    foreach ($qa as $p) {
        $out['mainEntity'][] = ['@type' => 'Question', 'name' => $p[0],
            'acceptedAnswer' => ['@type' => 'Answer', 'text' => $p[1]]];
    }
    return $out;
}

function ujt_not_found()
{
    http_response_code(404);
    header('Content-Type: text/html; charset=utf-8');
    $url = ujt_section_url();
    echo '<!DOCTYPE html><html lang="hi-IN"><head><meta charset="UTF-8">'
       . '<meta name="viewport" content="width=device-width,initial-scale=1">'
       . '<title>पृष्ठ नहीं मिला | UjjainTemple</title><meta name="robots" content="noindex">'
       . '</head><body style="font-family:system-ui;max-width:640px;margin:3rem auto;padding:0 1rem">'
       . '<h1>यह समाचार नहीं मिला</h1><p>हो सकता है यह हटा दिया गया हो।</p>'
       . '<p><a href="' . ujt_e($url) . '">सिंहस्थ 2028 समाचार</a> · '
       . '<a href="/hi/simhastha-2028/">सिंहस्थ 2028</a></p></body></html>';
    exit;
}

/** RSS 2.0 for the section. Also what BNA/IndexNow-style pingers can watch. */
function ujt_view_feed()
{
    $c    = ujt_news_config()['site'];
    $rows = ujt_all(
        "SELECT slug, title, summary, published_at FROM ujt_news_articles
          WHERE status='published' AND language='hi'
          ORDER BY published_at DESC, id DESC LIMIT 40"
    );
    header('Content-Type: application/rss+xml; charset=utf-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>' . "\n";
    printf("<title>%s</title>\n", ujt_e('सिंहस्थ 2028 समाचार — UjjainTemple.com'));
    printf("<link>%s</link>\n", ujt_e(ujt_section_url()));
    printf("<atom:link href=\"%s\" rel=\"self\" type=\"application/rss+xml\"/>\n",
        ujt_e(ujt_section_url() . 'feed.xml'));
    printf("<description>%s</description>\n",
        ujt_e('सिंहस्थ 2028 उज्जैन — मेला, स्नान, यात्रा और दर्शन की ताज़ा जानकारी'));
    echo "<language>hi-in</language>\n";
    foreach ($rows as $r) {
        $u = ujt_article_url($r['slug']);
        echo "<item>\n";
        printf("<title>%s</title>\n", ujt_e($r['title']));
        printf("<link>%s</link>\n", ujt_e($u));
        printf("<guid isPermaLink=\"true\">%s</guid>\n", ujt_e($u));
        if ($r['published_at']) {
            printf("<pubDate>%s</pubDate>\n", date(DATE_RSS, strtotime($r['published_at'])));
        }
        printf("<description>%s</description>\n", ujt_e(ujt_clip($r['summary'], 300)));
        echo "</item>\n";
    }
    echo "</channel></rss>";
    exit;
}

/**
 * Google News sitemap. The <news:> namespace is only valid for items published in
 * the last 48 hours — older URLs must be dropped, not merely sorted lower, or the
 * whole file gets rejected.
 */
/**
 * Archive sitemap — every published article, plus the section index and its
 * listing pages.
 *
 * This is NOT the Google News sitemap below it, and the two are not
 * interchangeable: the news sitemap is spec-bound to a 48-hour window, so an
 * article older than two days falls out of it and — because the site-wide
 * sitemap.xml is generated at BUILD time from dist/, where these PHP-SSR pages
 * do not exist — would otherwise sit in no sitemap at all.
 */
function ujt_view_archive_sitemap()
{
    $rows = ujt_all(
        "SELECT slug, published_at, updated_at FROM ujt_news_articles
          WHERE status='published' AND language='hi'
          ORDER BY published_at DESC, id DESC LIMIT 5000"
    );
    $total = (int) ujt_one(
        "SELECT COUNT(*) n FROM ujt_news_articles WHERE status='published' AND language='hi'"
    )['n'];
    $pages = max(1, (int) ceil($total / UJT_PER_PAGE));

    // W3C-datetime, and never a date in the future — a bogus lastmod gets the
    // whole file distrusted rather than just that one URL.
    $stamp = function ($v) {
        $t = $v ? strtotime($v) : 0;
        if (!$t || $t > time()) $t = time();
        return date('c', $t);
    };
    $newest = $rows ? $stamp($rows[0]['updated_at'] ?: $rows[0]['published_at']) : date('c');

    header('Content-Type: application/xml; charset=utf-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    printf("<url>\n<loc>%s</loc>\n<lastmod>%s</lastmod>\n<changefreq>daily</changefreq>\n<priority>0.8</priority>\n</url>\n",
        ujt_e(ujt_section_url()), $newest);

    for ($p = 2; $p <= $pages; $p++) {
        printf("<url>\n<loc>%spage/%d/</loc>\n<lastmod>%s</lastmod>\n<changefreq>daily</changefreq>\n<priority>0.4</priority>\n</url>\n",
            ujt_e(ujt_section_url()), $p, $newest);
    }

    foreach ($rows as $r) {
        printf("<url>\n<loc>%s</loc>\n<lastmod>%s</lastmod>\n<changefreq>monthly</changefreq>\n<priority>0.7</priority>\n</url>\n",
            ujt_e(ujt_article_url($r['slug'])),
            $stamp($r['updated_at'] ?: $r['published_at']));
    }

    echo '</urlset>';
    exit;
}

function ujt_view_news_sitemap()
{
    $rows = ujt_all(
        "SELECT slug, title, published_at FROM ujt_news_articles
          WHERE status='published' AND language='hi'
            AND published_at >= (NOW() - INTERVAL 48 HOUR)
          ORDER BY published_at DESC LIMIT 1000"
    );
    header('Content-Type: application/xml; charset=utf-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
       . 'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">' . "\n";
    foreach ($rows as $r) {
        echo "<url>\n";
        printf("<loc>%s</loc>\n", ujt_e(ujt_article_url($r['slug'])));
        echo "<news:news>\n<news:publication>\n";
        printf("<news:name>%s</news:name>\n", ujt_e('UjjainTemple.com'));
        echo "<news:language>hi</news:language>\n</news:publication>\n";
        printf("<news:publication_date>%s</news:publication_date>\n",
            date('c', strtotime($r['published_at'])));
        printf("<news:title>%s</news:title>\n", ujt_e($r['title']));
        echo "</news:news>\n</url>\n";
    }
    echo '</urlset>';
    exit;
}
