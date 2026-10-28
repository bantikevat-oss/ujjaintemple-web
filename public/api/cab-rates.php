<?php
/**
 * Server copy of the cab rate card. MUST match src/data/rates.ts — scripts/check-rates.mjs
 * fails the build if the two disagree. Included by booking-order.php; never served directly
 * (.htaccess denies it).
 * null = not sold at a fixed price (quoted on call), so it cannot be booked online.
 */
return [
  'omkareshwar-round'  => ['dzire' => 3700, 'ertiga' => 4400, 'innova' => 6300],
  'omkareshwar-oneway' => ['dzire' => 3700, 'ertiga' => 4400, 'innova' => 6300],
  'ujjain-local'       => ['dzire' => 2100, 'ertiga' => 2500, 'innova' => 4000],
  'ujjain-fullday'     => ['dzire' => 2900, 'ertiga' => 3400, 'innova' => 5200],
  'indore-airport'     => ['dzire' => 1700, 'ertiga' => 1900, 'innova' => 2700],
];
