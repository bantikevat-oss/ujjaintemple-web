<?php
/**
 * BNA image upload — multipart, field name `image`, responds {url, ogImage}.
 *
 * 🔴 The path `/api/upload` is HARDCODED in BNA (card_localizer.php::
 * bna_upload_image_to_tenant) — it is not a configurable tenant field. This file
 * must stay at exactly this path or hero cards silently fall back to hotlinking
 * news.byteflowtech.in, which is what made Drishti's LCP 3.2s.
 *
 * 🪤 /api/upload has no file extension, so the site's trailing-slash rule in
 * .htaccess would 301 it — and a 301 on POST loses the body. The rewrite that
 * exempts it must stay ABOVE that rule.
 */
require_once __DIR__ . '/../news/boot.php';
require_once __DIR__ . '/../news/lib/auth.php';

ujt_json_error_mode();
header('X-Robots-Tag: noindex, nofollow');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') ujt_json_err('POST only', 405);
ujt_require_auth();

if (empty($_FILES['image']) || ($_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    ujt_json_err('image file is required', 400);
}

$f = $_FILES['image'];
if ($f['size'] > 8 * 1024 * 1024) ujt_json_err('Image larger than 8 MB', 413);
if (!is_uploaded_file($f['tmp_name'])) ujt_json_err('Bad upload', 400);

// Trust the bytes, never the filename or the client content-type.
$info = @getimagesize($f['tmp_name']);
if (!$info || empty($info[0])) ujt_json_err('Not a decodable image', 415);

$src = null;
switch ($info[2]) {
    case IMAGETYPE_JPEG: $src = @imagecreatefromjpeg($f['tmp_name']); break;
    case IMAGETYPE_PNG:  $src = @imagecreatefrompng($f['tmp_name']);  break;
    case IMAGETYPE_WEBP: $src = function_exists('imagecreatefromwebp')
                                ? @imagecreatefromwebp($f['tmp_name']) : null; break;
    default: ujt_json_err('Only JPEG, PNG or WebP', 415);
}
if (!$src) ujt_json_err('Image could not be decoded', 415);

$cfg = ujt_news_config()['site'];
$dir = rtrim($cfg['uploads_dir'], '/');
if (!is_dir($dir) && !@mkdir($dir, 0755, true)) ujt_json_err('Upload directory unavailable', 500);

$stamp = date('Ym');
$base  = $stamp . '-' . bin2hex(random_bytes(6));

// Re-encoding through GD is the point: it drops EXIF, colour profiles and anything
// hidden after the image data, so what we serve is only pixels.
$main_path = "$dir/$base.jpg";
if (!ujt_write_jpeg($src, $main_path, 1600, 92)) {
    imagedestroy($src);
    ujt_json_err('Could not write image', 500);
}

// 1200x630 social variant — WhatsApp/FB will not render a square card well.
$og_path = "$dir/$base-og.jpg";
$og_url  = ujt_write_og_card($src, $og_path) ? "{$cfg['uploads_url']}/$base-og.jpg" : null;

imagedestroy($src);

ujt_json_ok__upload([
    'url'     => "{$cfg['uploads_url']}/$base.jpg",
    'ogImage' => $og_url,
]);


/** BNA reads body['url'] at the TOP level, not under data. */
function ujt_json_ok__upload($payload)
{
    ujt_json(['success' => true] + $payload);
}

function ujt_write_jpeg($src, $path, $max_edge, $quality)
{
    $w = imagesx($src); $h = imagesy($src);
    $scale = min(1.0, $max_edge / max($w, $h));
    if ($scale >= 1.0) return imagejpeg($src, $path, $quality);

    $nw = (int) round($w * $scale); $nh = (int) round($h * $scale);
    $dst = imagecreatetruecolor($nw, $nh);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
    $ok = imagejpeg($dst, $path, $quality);
    imagedestroy($dst);
    return $ok;
}

/** Cover-crop to 1200x630 so no card is letterboxed. */
function ujt_write_og_card($src, $path)
{
    $W = 1200; $H = 630;
    $w = imagesx($src); $h = imagesy($src);
    if ($w < 1 || $h < 1) return false;

    $scale = max($W / $w, $H / $h);
    $sw = (int) round($W / $scale);
    $sh = (int) round($H / $scale);
    $sx = (int) round(($w - $sw) / 2);
    $sy = (int) round(($h - $sh) / 2);

    $dst = imagecreatetruecolor($W, $H);
    imagecopyresampled($dst, $src, 0, 0, $sx, $sy, $W, $H, $sw, $sh);
    $ok = imagejpeg($dst, $path, 88);
    imagedestroy($dst);
    return $ok;
}
