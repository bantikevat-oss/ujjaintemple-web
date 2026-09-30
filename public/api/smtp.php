<?php
/**
 * Minimal SMTP sender — ujjaintemple.com
 *
 * 🔴 Why this file exists: this Hostinger account has local sendmail DISABLED
 * ("550 Local sendmail disabled for u937373134"). `lead.php` used to call `@mail()`,
 * and the `@` swallowed the failure — so every lead since launch was written to
 * leads.csv and NEVER emailed to anyone. SMTP is the only working route off this box.
 *
 * Credentials live in the server-only config ABOVE public_html (mode 600), the same
 * file the news engine already uses:  ~/domains/ujjaintemple.com/news-config.php
 *
 *   'mail' => [
 *     'host' => 'smtp.hostinger.com',
 *     'port' => 465,                    // implicit TLS
 *     'user' => 'no-reply@byteflowtech.in',
 *     'pass' => '…',
 *     'from' => 'no-reply@byteflowtech.in',
 *     'to'   => '16amanshivhare@gmail.com',
 *   ],
 *
 * 🪤 Stop after 3 failed AUTHs — repeated failures trip Hostinger's abuse block.
 */

function ujt_mail_config(): ?array {
    $path = __DIR__ . '/../../news-config.php';
    if (!is_readable($path)) return null;
    $cfg = require $path;
    return (is_array($cfg) && !empty($cfg['mail']['host'])) ? $cfg['mail'] : null;
}

function ujt_smtp_send(string $subject, string $body, ?array $cfg = null): bool {
    $cfg = $cfg ?? ujt_mail_config();
    if (!$cfg) return false;

    $host = $cfg['host']; $port = (int)($cfg['port'] ?? 465);
    $user = $cfg['user']; $pass = $cfg['pass'];
    $from = $cfg['from'] ?? $user;
    $to   = $cfg['to']   ?? $user;

    $transport = ($port === 465) ? "ssl://$host" : $host;
    $fp = @stream_socket_client("$transport:$port", $errno, $errstr, 12);
    if (!$fp) { error_log("ujt_smtp: connect failed $errno $errstr"); return false; }
    stream_set_timeout($fp, 12);

    $read = function () use ($fp) {
        $out = '';
        while (($line = fgets($fp, 515)) !== false) {
            $out .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') break;
        }
        return $out;
    };
    $cmd = function (string $c, string $expect) use ($fp, $read) {
        fwrite($fp, $c . "\r\n");
        $r = $read();
        if (strncmp($r, $expect, strlen($expect)) !== 0) {
            error_log('ujt_smtp: expected ' . $expect . ' got ' . trim(substr($r, 0, 120)));
            return false;
        }
        return true;
    };

    $ok = true;
    $read(); // greeting
    $ok = $ok && $cmd('EHLO ujjaintemple.com', '250');
    $ok = $ok && $cmd('AUTH LOGIN', '334');
    $ok = $ok && $cmd(base64_encode($user), '334');
    $ok = $ok && $cmd(base64_encode($pass), '235');
    $ok = $ok && $cmd('MAIL FROM:<' . $from . '>', '250');
    $ok = $ok && $cmd('RCPT TO:<' . $to . '>', '250');
    $ok = $ok && $cmd('DATA', '354');

    if ($ok) {
        $headers  = 'From: UjjainTemple Leads <' . $from . ">\r\n";
        $headers .= 'To: <' . $to . ">\r\n";
        $headers .= 'Subject: =?UTF-8?B?' . base64_encode($subject) . "?=\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $headers .= "Content-Transfer-Encoding: base64\r\n";
        $headers .= 'Date: ' . date('r') . "\r\n";
        // Leading dots must be escaped, or SMTP reads them as end-of-data.
        $payload = $headers . "\r\n" . chunk_split(base64_encode($body), 76, "\r\n");
        $payload = preg_replace('/^\./m', '..', $payload);
        fwrite($fp, $payload . "\r\n.\r\n");
        $r = $read();
        $ok = strncmp($r, '250', 3) === 0;
        if (!$ok) error_log('ujt_smtp: DATA rejected ' . trim(substr($r, 0, 120)));
    }

    @fwrite($fp, "QUIT\r\n");
    @fclose($fp);
    return $ok;
}
