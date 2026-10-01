#!/usr/bin/env bash
# One-time migration: bring prod api/leads.csv from the original 8-column header to the
# 11-column one that api/lead.php has written since 2026-10-01 (purpose, channel,
# travel_date). Existing rows are padded with three empty fields so every row keeps the
# same width as the header.
#
# Idempotent: if the header is already 11 columns it exits without touching the file.
# Makes a timestamped backup first, writes to a temp file, and only then renames — so an
# interrupted run can never leave a half-written lead file.
#
# 🪤 Written in PHP, not Python: the Hostinger box has **no python3** (`command not found`,
# caught 2026-10-02 mid-deploy). It has PHP 7.4 CLI at /usr/bin/php, which is what actually
# serves this site. Anything meant to run on that box should assume PHP and nothing else.
#
# 🪤 Do NOT use `wc -l` to sanity-check the row count: lead messages contain embedded
# newlines, so the raw line count (47 for 22 leads on 2026-10-02) is not the row count.
# The PHP below parses the CSV properly.
#
# Usage:  ssh nirnayak 'bash -s' < scripts/migrate-leads-csv-header.sh
set -euo pipefail

CSV="$HOME/domains/ujjaintemple.com/public_html/api/leads.csv"
BAK="$HOME/backups/ujjaintemple/leads.csv.$(date +%Y%m%d-%H%M%S).bak"

[ -f "$CSV" ] || { echo "no leads.csv at $CSV — nothing to do"; exit 0; }
mkdir -p "$(dirname "$BAK")"
cp -p "$CSV" "$BAK"
echo "backup: $BAK"

php -r '
$path = $argv[1];
$want = ["timestamp","name","phone","service","source","locale","message","ip","purpose","channel","travel_date"];

$rows = [];
$fh = fopen($path, "r");
if (!$fh) { fwrite(STDERR, "cannot open $path\n"); exit(1); }
while (($r = fgetcsv($fh)) !== false) {
    if ($r === [null]) continue;              // blank line
    $rows[] = $r;
}
fclose($fh);

if (!$rows) { echo "empty file — nothing to do\n"; exit(0); }

// strip a UTF-8 BOM off the very first cell if one is there
$rows[0][0] = preg_replace("/^\xEF\xBB\xBF/", "", $rows[0][0]);

if ($rows[0] === $want) {
    printf("header already %d columns — nothing to do (%d leads)\n", count($want), count($rows) - 1);
    exit(0);
}

printf("header is %d columns, migrating to %d  (%d leads)\n", count($rows[0]), count($want), count($rows) - 1);

$out = [$want];
for ($i = 1; $i < count($rows); $i++) {
    $r = $rows[$i];
    if (count($r) < count($want)) $r = array_pad($r, count($want), "");
    else if (count($r) > count($want)) $r = array_slice($r, 0, count($want));
    $out[] = $r;
}

$tmp = tempnam(dirname($path), ".leads-");
$th = fopen($tmp, "w");
foreach ($out as $r) fputcsv($th, $r);
fclose($th);
chmod($tmp, 0644);
if (!rename($tmp, $path)) { @unlink($tmp); fwrite(STDERR, "rename failed\n"); exit(1); }

// read it back and prove it
$back = [];
$fh = fopen($path, "r");
while (($r = fgetcsv($fh)) !== false) { if ($r === [null]) continue; $back[] = $r; }
fclose($fh);
if (count($back) !== count($out)) { fwrite(STDERR, sprintf("row count changed: %d -> %d\n", count($out), count($back))); exit(1); }
foreach ($back as $r) if (count($r) !== count($want)) { fwrite(STDERR, "ragged row after migration\n"); exit(1); }
printf("OK — %d leads, every row %d columns\n", count($back) - 1, count($want));
' "$CSV"
