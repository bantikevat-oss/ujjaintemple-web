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

/*
 * 🔴 Recipient and sender are NOT configured here. They live in the server-only
 * news-config.php 'mail' block (see smtp.php), because that file is outside public_html
 * and holds the SMTP password. The old email_to / email_cc / from_email keys were left
 * here after the switch to SMTP and were dead — editing them changed nothing, which is
 * exactly the kind of thing that wastes an hour later. Removed 2026-10-01.
 */
$cfg = [
  'csv_path' => __DIR__ . '/leads.csv',
];

function clean($s) { return trim(strip_tags(substr((string)$s, 0, 500))); }

$name      = clean($_POST['name'] ?? '');
$phone     = clean($_POST['phone'] ?? '');
$service   = clean($_POST['service'] ?? '');
$message   = clean($_POST['message'] ?? '');
$src       = clean($_POST['sourcePage'] ?? '');
$locale    = clean($_POST['locale'] ?? '');
$purpose   = clean($_POST['purpose'] ?? '');     // raw-lead filter (WhatsApp gate)
$channel   = clean($_POST['channel'] ?? 'form'); // 'form' | 'whatsapp' | 'app'
$travel    = clean($_POST['travelDate'] ?? '');  // yyyy-mm-dd, optional — the field that
                                                 // decides vehicle availability and price

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

/*
 * Abuse guard. Until 2026-10-01 this endpoint's @mail() silently failed, so spam was
 * invisible and free. Now every accepted POST sends a real SMTP mail through the shared
 * no-reply@byteflowtech.in mailbox, and repeated sends are what trips Hostinger's
 * account-wide abuse block — which would take mail down for the other properties on that
 * mailbox too.
 *
 * 🔴 The throttle therefore limits the MAIL, never the capture. This site is
 * mobile-dominant and Indian carriers run CGNAT, so one public IP can carry many genuine
 * visitors — rejecting on a per-IP count would drop real leads, and losing a lead is far
 * more expensive than receiving spam. So every accepted POST is always written to the
 * CSV; only the notification is suppressed once a threshold is crossed.
 */
$spam = trim((string)($_POST['website'] ?? '')) !== '';   // honeypot: humans never see this field
if ($spam) {
  echo json_encode(['success' => true]);                  // look successful; drop silently
  exit;
}

function ujt_over_cap($key, $cap) {
  $f = sys_get_temp_dir() . '/ujt_lead_' . hash('sha256', $key) . '.cnt';
  $n = (int) @file_get_contents($f);
  @file_put_contents($f, (string)($n + 1), LOCK_EX);
  return $n >= $cap;
}

$ip        = $_SERVER['REMOTE_ADDR'] ?? '';
$burst     = $ip !== '' && ujt_over_cap('ip:' . $ip . ':' . date('Y-m-d-H'), 20);  // one IP, one hour
$dayFlood  = ujt_over_cap('all:' . date('Y-m-d'), 150);                            // whole site, one day
$mail_ok   = !$burst && !$dayFlood;

/*
 * Append to CSV.
 *
 * 🔴 The header is only ever written for a brand-new file, so when `purpose`, `channel`
 * and `travel_date` were added on 2026-10-01 the LIVE file kept its original 8-column
 * header while this code began appending 11 fields. Nothing broke yet only because no
 * lead arrived between that deploy and 2026-10-02 — the first one would have landed as
 * an 11-field row under an 8-field header, and any positional reader (the lead.byteflowtech.in
 * ingest among them) would have silently mis-mapped every column after `ip`.
 *
 * Fixing it from here is the wrong place: rewriting a live data file from inside a web
 * request, concurrently with other writes, risks the 22 real leads sitting in it. So the
 * migration is an explicit, backed-up step in the deploy runbook
 * (scripts/migrate-leads-csv-header.sh) and this code only refuses to hide the problem.
 */
const LEAD_CSV_HEADER = ['timestamp', 'name', 'phone', 'service', 'source', 'locale', 'message', 'ip', 'purpose', 'channel', 'travel_date'];

$row = [date('Y-m-d H:i:s'), $name, $phone, $service, $src, $locale, $message, $_SERVER['REMOTE_ADDR'] ?? '', $purpose, $channel, $travel];
$fp = @fopen($cfg['csv_path'], 'a');
if ($fp) {
  if (filesize($cfg['csv_path']) === 0) {
    fputcsv($fp, LEAD_CSV_HEADER);
  } else {
    // Loud, once per write, and cheap: read only the first line and compare widths.
    $head = @fgetcsv(@fopen($cfg['csv_path'], 'r') ?: fopen('php://memory', 'r'));
    if (is_array($head) && count($head) !== count(LEAD_CSV_HEADER)) {
      error_log('ujt lead: leads.csv header has ' . count($head) . ' columns, rows now carry '
        . count(LEAD_CSV_HEADER) . ' — run scripts/migrate-leads-csv-header.sh before trusting a positional read');
    }
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

/*
 * The mail is the product here — Aman reads it on a phone and decides whether to call.
 * So: the number is one tap, the travel date says how urgent it is, and the tier is
 * visible before any scrolling. HTML because a plain-text block of "Name: / Phone:" is
 * where a real lead goes to hide.
 */
$tierColor = $tier === 'HOT' ? '#B8860B' : ($tier === 'COLD' ? '#6b7280' : '#7A1220');
$digits    = preg_replace('/[^0-9]/', '', $phone);
$waNum     = strlen($digits) === 10 ? '91' . $digits : $digits;

// "in 6 days" is the bit that decides what gets called first.
$whenLine = '—';
if ($travel !== '' && ($ts = strtotime($travel)) !== false) {
  $days = (int) floor(($ts - strtotime('today')) / 86400);
  $rel  = $days < 0 ? 'beet chuki' : ($days === 0 ? 'AAJ' : ($days === 1 ? 'KAL' : "$days din baad"));
  $whenLine = date('d M Y', $ts) . ' · <strong>' . $rel . '</strong>';
  if ($days >= 0 && $days <= 7) $subject = '⏰ ' . $subject;   // travelling within a week
}

$e = function ($v) { return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8'); };
$row = function ($k, $v) use ($e) {
  return '<tr><td style="padding:7px 14px 7px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">'
       . $e($k) . '</td><td style="padding:7px 0;color:#111827;font-size:14px">' . $v . '</td></tr>';
};

$body  = '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#f6f5f2;padding:18px">';
$body .= '<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e7e3da;border-radius:12px;overflow:hidden">';
$body .= '<div style="background:' . $tierColor . ';color:#fff;padding:13px 18px;font-size:14px;font-weight:700">'
       . $e($tier) . ' · ' . $e($plabel) . '</div>';
$body .= '<div style="padding:18px">';
$body .= '<div style="font-size:21px;font-weight:700;color:#111827;margin-bottom:3px">' . $e($name) . '</div>';
$body .= '<a href="tel:+' . $e($waNum) . '" style="font-size:20px;font-weight:700;color:#7A1220;text-decoration:none">'
       . $e($phone) . '</a>';
$body .= '<div style="margin:15px 0 5px">'
       . '<a href="tel:+' . $e($waNum) . '" style="display:inline-block;background:#7A1220;color:#fff;padding:11px 20px;border-radius:7px;text-decoration:none;font-weight:700;font-size:14px;margin-right:8px">Call</a>'
       . '<a href="https://wa.me/' . $e($waNum) . '" style="display:inline-block;background:#25D366;color:#fff;padding:11px 20px;border-radius:7px;text-decoration:none;font-weight:700;font-size:14px">WhatsApp</a>'
       . '</div>';
$body .= '<table style="width:100%;border-collapse:collapse;margin-top:14px;border-top:1px solid #eee">';
$body .= $row('Yatra date', $whenLine);
$body .= $row('Chahiye', $e($plabel));
$channelLabels = ['whatsapp' => 'WhatsApp button', 'app' => 'Android app', 'form' => 'Website form'];
$body .= $row('Aaya kahan se', $e($channelLabels[$channel] ?? 'Website form'));
$body .= $row('Page', '<a href="https://ujjaintemple.com' . $e($src) . '" style="color:#7A1220">' . $e($src ?: '—') . '</a>');
if ($message !== '') $body .= $row('Message', nl2br($e($message)));
$body .= $row('Time', date('d M Y, g:i A') . ' IST');
$body .= '</table></div>';
$body .= '<div style="background:#faf9f6;padding:10px 18px;color:#9ca3af;font-size:11px;border-top:1px solid #eee">'
       . 'UjjainTemple.com &nbsp;·&nbsp; leads.csv me bhi save ho chuki hai</div>';
$body .= '</div></div>';

require_once __DIR__ . '/smtp.php';
if ($mail_ok) {
  $sent = ujt_smtp_send($subject, $body, null, true);
  if (!$sent) error_log("ujt lead: SMTP send failed for $name / $phone");
} else {
  // Captured, deliberately not mailed. The row is in leads.csv either way.
  error_log("ujt lead: mail throttled (burst=" . (int)$burst . " dayFlood=" . (int)$dayFlood . ") for $phone");
}

/* ── mirror into the central CRM ──────────────────────────────────────────────
 * Last, deliberately. The lead is already in leads.csv and the owner mail has
 * already been attempted; this is a copy, and a copy must never be able to cost
 * us the original. crm_push() swallows everything and spools on failure.
 *
 * Credentials live in the same server-only news-config.php the SMTP block uses,
 * under a 'crm' key — never in this file, which is inside public_html.
 * 🔴 With no 'crm' block present this is a silent no-op, which is the correct
 * behaviour on a box that has not been configured yet.
 */
$crm_cfg_path = __DIR__ . '/../../news-config.php';
$crm_cfg = is_readable($crm_cfg_path) ? (include $crm_cfg_path) : null;
if (is_array($crm_cfg) && !empty($crm_cfg['crm']['key'])) {
  require_once __DIR__ . '/crm-push.php';
  crm_push($crm_cfg['crm'], [
    'name'        => $name,
    'phone'       => $phone,
    'service'     => $service,
    'message'     => $message,
    'source_page' => $src,
    'channel'     => $channel ?: 'form',
    'travel_date' => $travel ?: null,
    'city'        => 'Ujjain',
    'vertical'    => 'travel',
    'created_at'  => date('Y-m-d H:i:s'),
  ]);
}

echo json_encode(['success' => true]);
