<?php
/**
 * UjjainTemple.com — Lead capture endpoint.
 * Receives POST from src/components/global/LeadForm.tsx
 *
 * Stores to /api/leads.csv on Hostinger origin + emails via SMTP (smtp.php).
 * Mail creds come from the server-only news-config.php ('mail' block), never from this file.
 */

/*
 * This endpoint returns JSON. Any PHP notice or deprecation printed into the body
 * corrupts that JSON and the browser's fetch() fails — so warnings go to the error
 * log, never to the response. (Caught locally on PHP 8.4: fputcsv's $escape
 * deprecation was printing into the body. Prod is 7.4 and would not have shown it,
 * which is exactly why it had to be closed here rather than noticed later.)
 */
ini_set('display_errors', '0');
error_reporting(E_ALL);

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
$purpose   = clean($_POST['purpose'] ?? '');     // raw-lead filter (WhatsApp gate)
$channel   = clean($_POST['channel'] ?? 'form'); // 'form' | 'whatsapp'

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
$row = [date('Y-m-d H:i:s'), $name, $phone, $service, $src, $locale, $message, $_SERVER['REMOTE_ADDR'] ?? '', $purpose, $channel];
$fp = @fopen($cfg['csv_path'], 'a');
if ($fp) {
  if (filesize($cfg['csv_path']) === 0) {
    fputcsv($fp, ['timestamp', 'name', 'phone', 'service', 'source', 'locale', 'message', 'ip', 'purpose', 'channel']);
  }
  fputcsv($fp, $row);
  fclose($fp);
}

// Email
/*
 * Lead scoring — the raw-lead filter Aman asked for on 2026-09-30.
 *
 * Measured 17d: mandir info-pages produce call/WhatsApp taps from people who want the
 * TEMPLE's number, not ours (shankaracharya-math alone was 6). Those arrive as purpose
 * 'info' and are marked COLD so they never look like a sales lead in the inbox.
 * A group enquiry is the one we most want to see instantly, so it leads the subject.
 */
$labels = [
  'cab'   => 'Cab/Taxi',  'tour'  => 'Tour package', 'group' => 'GROUP 10+',
  'hotel' => 'Hotel',     'puja'  => 'Puja',         'info'  => 'Info only',
];
$plabel = $labels[$purpose] ?? ($service ?: 'General');

if ($purpose === 'group')                    { $tier = 'HOT';  $mark = '[GROUP]'; }
elseif (in_array($purpose, ['cab','tour','hotel'], true)) { $tier = 'WARM'; $mark = '[LEAD]'; }
elseif ($purpose === 'info')                 { $tier = 'COLD'; $mark = '[INFO]'; }
else                                         { $tier = 'WARM'; $mark = '[LEAD]'; }

$subject = "$mark UjjainTemple — $name · $plabel";

$body  = "$tier lead from UjjainTemple.com\n";
$body .= str_repeat('-', 44) . "\n";
$body .= "Name:     $name\n";
$body .= "Phone:    $phone\n";
$body .= "Purpose:  $plabel\n";
$body .= "Channel:  $channel\n";
$body .= "Service:  $service\n";
$body .= "Source:   $src\n";
$body .= "Locale:   $locale\n";
if ($message !== '') $body .= "Message:  $message\n";
$body .= "Time:     " . date('Y-m-d H:i:s') . " IST\n";
$body .= "IP:       " . ($_SERVER['REMOTE_ADDR'] ?? '') . "\n";
$body .= str_repeat('-', 44) . "\n";
$body .= "Call back: tel:" . preg_replace('/[^0-9]/', '', $phone) . "\n";

/*
 * 🔴 NOT mail(). Local sendmail is disabled on this account (550 …contact support) and
 * the old @mail() call failed silently for every lead ever captured. SMTP or nothing.
 * The CSV write above already happened, so a mail failure never loses the lead.
 */
require_once __DIR__ . '/smtp.php';
$sent = ujt_smtp_send($subject, $body);
if (!$sent) error_log("ujt lead: SMTP send failed for $name / $phone");

echo json_encode(['success' => true]);
