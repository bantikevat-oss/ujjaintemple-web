<?php
/**
 * UjjainTemple.com — Lead capture endpoint.
 * Receives POST from src/components/global/LeadForm.tsx
 *
 * Stores to /api/leads.csv on Hostinger origin + emails ByteFlow team.
 * Adjust EMAIL_TO and FROM_EMAIL in $cfg before deploy.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://ujjaintemple.com');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'error' => 'POST only']);
  exit;
}

$cfg = [
  'email_to'   => '16amanshivhare@gmail.com',
  'email_cc'   => 'leads@ujjaintemple.com',
  'from_email' => 'noreply@ujjaintemple.com',
  'csv_path'   => __DIR__ . '/leads.csv',
];

function clean($s) { return trim(strip_tags(substr((string)$s, 0, 500))); }

$name      = clean($_POST['name'] ?? '');
$phone     = clean($_POST['phone'] ?? '');
$service   = clean($_POST['service'] ?? '');
$message   = clean($_POST['message'] ?? '');
$src       = clean($_POST['sourcePage'] ?? '');
$locale    = clean($_POST['locale'] ?? '');

if (!$name || !$phone) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'name + phone required']);
  exit;
}

if (!preg_match('/^[0-9+\-\s]{10,15}$/', $phone)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'invalid phone']);
  exit;
}

// Append to CSV
$row = [date('Y-m-d H:i:s'), $name, $phone, $service, $src, $locale, $message, $_SERVER['REMOTE_ADDR'] ?? ''];
$fp = @fopen($cfg['csv_path'], 'a');
if ($fp) {
  if (filesize($cfg['csv_path']) === 0) {
    fputcsv($fp, ['timestamp', 'name', 'phone', 'service', 'source', 'locale', 'message', 'ip']);
  }
  fputcsv($fp, $row);
  fclose($fp);
}

// Email
$subject = "[UjjainTemple] New lead — $name ($service)";
$body  = "New lead from UjjainTemple.com\n\n";
$body .= "Name:     $name\n";
$body .= "Phone:    $phone\n";
$body .= "Service:  $service\n";
$body .= "Source:   $src\n";
$body .= "Locale:   $locale\n";
$body .= "Message:  $message\n\n";
$body .= "Time:     " . date('Y-m-d H:i:s') . "\n";
$body .= "IP:       " . ($_SERVER['REMOTE_ADDR'] ?? '') . "\n";

$headers  = "From: " . $cfg['from_email'] . "\r\n";
$headers .= "Cc: " . $cfg['email_cc'] . "\r\n";
$headers .= "Reply-To: " . $cfg['from_email'] . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

@mail($cfg['email_to'], $subject, $body, $headers);

echo json_encode(['success' => true]);
