<?php
/**
 * UjjainTemple.com — Image Panel config.
 * The password hash lives in secret.php, which is created ON THE SERVER
 * during deploy and is NEVER committed to git (see .gitignore + .htaccess deny).
 */
$secret = @include __DIR__ . '/secret.php';   // ['pass_hash' => '...']
return [
  'pass_hash'   => is_array($secret) ? ($secret['pass_hash'] ?? '__UNSET__') : '__UNSET__',
  'site_url'    => 'https://ujjaintemple.com',
  'images_dir'  => realpath(__DIR__ . '/../images'),
  'max_upload'  => 15 * 1024 * 1024, // 15 MB
  'allowed'     => ['jpg','jpeg','png','webp','svg','avif','gif','ico'],
  'session_ttl' => 3600 * 6, // 6 hours
];
