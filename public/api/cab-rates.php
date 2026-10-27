<?php
/**
 * Server copy of the cab rate card. MUST match src/data/rates.ts — scripts/check-rates.mjs
 * fails the build if the two disagree. Included by booking-order.php; never served directly
 * (.htaccess denies it).
 * null = not sold at a fixed price (quoted on call), so it cannot be booked online.
 */
return [
  'omkareshwar-round'  => ['dzire' => 3200, 'ertiga' => 3800, 'innova' => 4500],
  'omkareshwar-oneway' => ['dzire' => 2700, 'ertiga' => 3300, 'innova' => 4000],
  'ujjain-local'       => ['dzire' => 2500, 'ertiga' => 3000, 'innova' => 4500],
  'indore-airport'     => ['dzire' => 1700, 'ertiga' => 2200, 'innova' => null],
];
