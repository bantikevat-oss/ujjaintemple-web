<?php
/**
 * Date-wise cab fare overrides (Aman, 2026-10-28: "admin panel se kisi date ke liye gaadi ke rate
 * change kar pau"). PHP 7.4 — no match(), no str_contains(), no named arguments.
 *
 * The normal rate card stays in cab-rates.php (= src/data/rates.ts). An override replaces the fare
 * of one route, for one or more cars, between two dates (both included). Overrides live in one JSON
 * file above public_html, edited only from /panel/rates.php:
 *   ~/domains/ujjaintemple.com/ut-rate-overrides.json
 * When two overrides cover the same day, route and car, the one saved last wins.
 */

const UT_RATE_VEHICLES = ['dzire', 'ertiga', 'innova'];
const UT_RATE_ROUTES = [
  'omkareshwar-round'  => 'Omkareshwar round trip',
  'omkareshwar-oneway' => 'Omkareshwar one way',
  'ujjain-local'       => 'Ujjain local 8 hr / 80 km',
  'ujjain-fullday'     => 'Ujjain full day 12 hr / 120 km',
  'indore-airport'     => 'Indore airport',
];

function ut_rates_base() {
  static $base = null;
  if ($base === null) $base = require __DIR__ . '/cab-rates.php';
  return $base;
}

function ut_rates_file() { return __DIR__ . '/../../ut-rate-overrides.json'; }

function ut_rate_overrides() {
  $j = json_decode((string) @file_get_contents(ut_rates_file()), true);
  return is_array($j) ? $j : [];
}

function ut_rate_overrides_save(array $list) {
  return @file_put_contents(ut_rates_file(), json_encode(array_values($list), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX) !== false;
}

/** route => vehicle => fare, for every override that covers $date (later saves win). */
function ut_rate_overrides_on($date) {
  $out = [];
  if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)$date)) return $out;
  $list = ut_rate_overrides();
  usort($list, function ($a, $b) { return strcmp($a['created_at'] ?? '', $b['created_at'] ?? ''); });
  foreach ($list as $o) {
    if ($date < $o['from'] || $date > $o['to']) continue;
    foreach ($o['fares'] as $v => $f) $out[$o['route']][$v] = (int)$f;
  }
  return $out;
}

/** The fare to charge for a route + car on a travel date. null = not bookable at a fixed price. */
function ut_fare_for($route, $vehicle, $date) {
  $ov = ut_rate_overrides_on($date);
  if (isset($ov[$route][$vehicle])) return $ov[$route][$vehicle];
  $base = ut_rates_base();
  return $base[$route][$vehicle] ?? null;
}
