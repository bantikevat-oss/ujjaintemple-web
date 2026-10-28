<?php
/**
 * GET /api/fares.php?date=YYYY-MM-DD → { date, overrides: { route: { vehicle: fare } } }.
 * The booking widget asks this before showing fares, so a festival-day fare set in the panel shows
 * on the static site without a rebuild. Empty overrides = the normal rate card applies.
 */
require __DIR__ . '/rate-lib.php';

header('Content-Type: application/json');
header('Cache-Control: no-store');
$date = (string)($_GET['date'] ?? '');
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) { http_response_code(400); echo json_encode(['error' => 'date']); exit; }
echo json_encode(['date' => $date, 'overrides' => (object) ut_rate_overrides_on($date)]);
