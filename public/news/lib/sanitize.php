<?php
if (!defined('UJT_NEWS')) { http_response_code(403); exit('Forbidden'); }

/**
 * Allow-list HTML sanitiser for agent-supplied article bodies.
 *
 * The agent is ours and the channel is authenticated, so this is defence in depth
 * rather than the primary control — but the body is stored once and rendered to
 * every visitor forever, so a single bad payload would be permanent. Anything not
 * on the list is unwrapped (children kept) rather than dropped, so a stray <div>
 * never costs us a paragraph of text.
 */

const UJT_ALLOWED_TAGS = [
    'p' => [], 'br' => [], 'strong' => [], 'b' => [], 'em' => [], 'i' => [],
    'h2' => [], 'h3' => [], 'h4' => [],
    'ul' => [], 'ol' => [], 'li' => [],
    'blockquote' => [], 'figure' => ['class'], 'figcaption' => [],
    'a' => ['href', 'title', 'rel', 'target'],
    'img' => ['src', 'alt', 'width', 'height', 'loading'],
    'table' => [], 'thead' => [], 'tbody' => [], 'tr' => [], 'th' => [], 'td' => [],
    'iframe' => ['src', 'title', 'allow', 'allowfullscreen', 'width', 'height', 'loading', 'frameborder'],
];

/** Only these hosts may appear in an <iframe src>. */
const UJT_IFRAME_HOSTS = ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'];

function ujt_sanitize_html($html)
{
    $html = trim((string) $html);
    if ($html === '') return '';

    $prev = libxml_use_internal_errors(true);
    $doc  = new DOMDocument('1.0', 'UTF-8');
    // The XML prolog is the reliable way to make DOMDocument treat bytes as UTF-8.
    $ok = $doc->loadHTML(
        '<?xml encoding="UTF-8"?><div id="ujt-root">' . $html . '</div>',
        LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NONET
    );
    libxml_clear_errors();
    libxml_use_internal_errors($prev);
    if (!$ok) return '';

    $root = $doc->getElementById('ujt-root');
    if (!$root) return '';

    ujt__clean_node($root);

    $out = '';
    foreach ($root->childNodes as $child) $out .= $doc->saveHTML($child);
    return trim($out);
}

function ujt__clean_node(DOMNode $node)
{
    // Snapshot: the list mutates as we unwrap/remove.
    $children = [];
    foreach ($node->childNodes as $c) $children[] = $c;

    foreach ($children as $child) {
        if ($child->nodeType === XML_TEXT_NODE) continue;

        if ($child->nodeType === XML_COMMENT_NODE) {
            $child->parentNode->removeChild($child);
            continue;
        }
        if ($child->nodeType !== XML_ELEMENT_NODE) {
            $child->parentNode->removeChild($child);
            continue;
        }

        $tag = strtolower($child->nodeName);

        // script/style carry no readable text worth saving — drop them whole.
        if ($tag === 'script' || $tag === 'style') {
            $child->parentNode->removeChild($child);
            continue;
        }

        if (!isset(UJT_ALLOWED_TAGS[$tag])) {
            ujt__clean_node($child);
            ujt__unwrap($child);
            continue;
        }

        $allowed = UJT_ALLOWED_TAGS[$tag];
        $attrs   = [];
        foreach ($child->attributes as $a) $attrs[] = $a->nodeName;
        foreach ($attrs as $name) {
            if (!in_array(strtolower($name), $allowed, true)) {
                $child->removeAttribute($name);
            }
        }

        if ($tag === 'a')      ujt__clean_anchor($child);
        if ($tag === 'img')    ujt__clean_img($child);
        if ($tag === 'iframe' && !ujt__iframe_ok($child)) {
            $child->parentNode->removeChild($child);
            continue;
        }

        ujt__clean_node($child);
    }
}

function ujt__unwrap(DOMElement $el)
{
    $parent = $el->parentNode;
    if (!$parent) return;
    while ($el->firstChild) $parent->insertBefore($el->firstChild, $el);
    $parent->removeChild($el);
}

function ujt__url_scheme_ok($url, $allow_relative = true)
{
    $url = trim((string) $url);
    if ($url === '') return false;
    if (preg_match('~^\s*(javascript|data|vbscript|file)\s*:~i', $url)) return false;
    if (preg_match('~^https?://~i', $url)) return true;
    return $allow_relative && (strpos($url, '/') === 0 || strpos($url, '#') === 0);
}

function ujt__clean_anchor(DOMElement $a)
{
    $href = $a->getAttribute('href');
    if (!ujt__url_scheme_ok($href)) { $a->removeAttribute('href'); return; }

    $host = parse_url($href, PHP_URL_HOST);
    $ours = ($host === null || $host === '' || substr($host, -17) === 'ujjaintemple.com');
    if (!$ours) {
        // Outbound links must not pass equity or open us to tabnabbing.
        $a->setAttribute('rel', 'nofollow noopener');
        $a->setAttribute('target', '_blank');
    } else {
        $a->removeAttribute('target');
        $a->removeAttribute('rel');
    }
}

function ujt__clean_img(DOMElement $img)
{
    if (!ujt__url_scheme_ok($img->getAttribute('src'))) {
        if ($img->parentNode) $img->parentNode->removeChild($img);
        return;
    }
    if ($img->getAttribute('alt') === '') $img->setAttribute('alt', '');
    $img->setAttribute('loading', 'lazy');
}

function ujt__iframe_ok(DOMElement $f)
{
    $src = $f->getAttribute('src');
    if (!preg_match('~^https://~i', $src)) return false;
    $host = strtolower((string) parse_url($src, PHP_URL_HOST));
    if (!in_array($host, UJT_IFRAME_HOSTS, true)) return false;
    $f->setAttribute('loading', 'lazy');
    return true;
}

/** Plain text from HTML — used for the auto summary + JSON-LD wordCount. */
function ujt_html_to_text($html)
{
    $t = preg_replace('~<(script|style)[^>]*>.*?</\1>~is', ' ', (string) $html);
    $t = preg_replace('~<[^>]+>~', ' ', $t);
    $t = html_entity_decode($t, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    return trim(preg_replace('/\s+/u', ' ', $t));
}
