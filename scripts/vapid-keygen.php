<?php
/**
 * vapid-keygen.php — one-time VAPID key pair for app push notifications.
 *
 * Run ON THE SERVER (so the private key never leaves it), then paste the printed
 * 'push' block into ~/domains/ujjaintemple.com/news-config.php:
 *   php vapid-keygen.php
 *
 * 🔴 Generate once and keep it. A new key silently orphans every existing
 * subscription — browsers reject pushes signed by a key they did not subscribe with.
 */
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

$key = openssl_pkey_new(['curve_name' => 'prime256v1', 'private_key_type' => OPENSSL_KEYTYPE_EC]);
if (!$key) { fwrite(STDERR, "openssl could not create a P-256 key\n"); exit(1); }
openssl_pkey_export($key, $pem);
$d = openssl_pkey_get_details($key);
$pub = rtrim(strtr(base64_encode("\x04" . str_pad($d['ec']['x'], 32, "\0", STR_PAD_LEFT) . str_pad($d['ec']['y'], 32, "\0", STR_PAD_LEFT)), '+/', '-_'), '=');

echo "  'push' => [\n";
echo "    'private_pem' => " . var_export($pem, true) . ",\n";
echo "    'subject'     => 'mailto:info@ujjaintemple.com',\n";
echo "    'dev_origins' => [],\n";
echo "  ],\n";
fwrite(STDERR, "public key (for reference, derived at runtime): $pub\n");
