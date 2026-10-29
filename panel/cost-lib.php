<?php
/**
 * UjjainTemple.com — cost sheet for packages (Aman, 2026-10-29: "quote builder ko kya kya pricing
 * chahiye jisse vo khud hi package bana le, aur ek column ho apna markup kitna jodna hai").
 * PHP 7.4 — no match(), no str_contains(), no named arguments.
 *
 * Every row is a question the team answers once on /panel/lagat.php: the vendor's rate per car /
 * hotel class, and whether that rate is NET (what we pay) or SELL (already the customer price).
 * Aman 2026-10-29: "net rate me 30% add karna hai" — the markup is added ONCE, on the package total
 * of the net lines (rules → markup_pct, default 30). Sell-rate lines go in as they are.
 *
 * Answers live in one JSON file above public_html, never served:
 *   ~/domains/ujjaintemple.com/ut-costs.json
 * Not here on purpose: guide/sahayak (rejected 2026-10-16), darshan tickets, and anything that is
 * the temple's to give (VIP darshan, purohit, Mahakal puja) — site rule.
 */

/** unit => [qty label in the calculator, word shown after the price] */
const UT_COST_UNITS = [
  'trip'  => ['trip', '/ trip'],
  'day'   => ['din', '/ din'],
  'km'    => ['km', '/ km'],
  'hour'  => ['ghanta', '/ ghanta'],
  'night' => ['raat', '/ raat'],
  'room'  => ['kamra × raat', '/ kamra / raat'],
  'pax'   => ['vyakti', '/ vyakti'],
  'meal'  => ['vyakti × meal', '/ vyakti / meal'],
  'puja'  => ['puja', '/ puja'],
];

/**
 * Sections. cols = price columns (one input each). Row = [question, unit, seed costs?].
 * A row with unit 'set' is a plain answer (a number, no net/sell) used by the calculator itself.
 * Seeds = Aman's vendor sheet of 2026-10-28 (toll + parking included); they show until the team saves.
 */
const UT_COST_SECTIONS = [
  'cab' => [
    'title'  => 'Gaadi — vendor ka rate (toll + parking sahit)',
    'hint'   => 'Jo vendor ko dete ho wo likho. Jo gaadi/route nahi milta, khaali chhodo.',
    'cols'   => ['dzire' => 'Dzire (4)', 'ertiga' => 'Ertiga (6)', 'innova' => 'Innova Crysta (7)', 'tempo' => 'Tempo Traveller (12)'],
    'rows'   => [
      'omk_round'    => ['Ujjain → Omkareshwar → Ujjain (ek din)', 'trip', ['dzire' => 3200, 'ertiga' => 3800, 'innova' => 5500]],
      'omk_oneway'   => ['Ujjain → Omkareshwar (sirf jaana)', 'trip'],
      'local_7'      => ['Ujjain local darshan — 7 ghante / 70 km', 'trip', ['dzire' => 1800, 'innova' => 3500]],
      'local_12'     => ['Ujjain full day — 12 ghante / 120 km', 'trip', ['dzire' => 2500, 'innova' => 4500]],
      'indore_pick'  => ['Indore airport / station → Ujjain (pickup)', 'trip'],
      'indore_drop'  => ['Ujjain → Indore airport / station (drop)', 'trip'],
      'indore_local' => ['Indore local darshan — 8 ghante / 80 km', 'trip'],
      'ujj_transfer' => ['Ujjain station / bus stand ↔ hotel (sirf chhodna ya lena)', 'trip'],
      'ind_omk_ujj'  => ['Indore pickup → Omkareshwar darshan → Ujjain (ek din)', 'trip'],
      'ujj_omk_ind'  => ['Ujjain → Omkareshwar darshan → Indore drop (ek din)', 'trip'],
      'omk_mah'      => ['Ujjain → Omkareshwar + Maheshwar → Ujjain (ek din)', 'trip'],
      'mandu'        => ['Ujjain → Mandu → Ujjain (ek din)', 'trip'],
      'nalkheda'     => ['Ujjain → Nalkheda (Baglamukhi) → Ujjain', 'trip'],
      'per_km'       => ['Outstation — per km rate', 'km', ['dzire' => 11, 'ertiga' => 12, 'innova' => 18]],
      'min_km'       => ['Outstation — kam se kam km per din', 'set'],
      'driver_night' => ['Driver bhatta — per raat (gaadi raat ruke to)', 'night'],
      'extra_km'     => ['Extra km — local package ke upar', 'km'],
      'extra_hr'     => ['Extra ghanta — local package ke upar', 'hour'],
    ],
  ],
  'hotel' => [
    'title'  => 'Hotel — hamara contract rate (taxes sahit)',
    'hint'   => 'Do logon ka kamra, ek raat ka. Jis shehar/class me hotel nahi hai, khaali chhodo.',
    'cols'   => ['budget' => 'Budget', 'standard' => 'Standard AC', 'deluxe' => 'Deluxe / mandir ke paas', 'premium' => 'Premium 4★+'],
    'rows'   => [
      'ujj_room'  => ['Ujjain — double room, sirf kamra (EP)', 'room'],
      'ujj_extra' => ['Ujjain — extra bed / gadda', 'night'],
      'omk_room'  => ['Omkareshwar — double room (EP)', 'room'],
      'omk_extra' => ['Omkareshwar — extra bed / gadda', 'night'],
      'ind_room'  => ['Indore — double room (EP)', 'room'],
      'mah_room'  => ['Maheshwar — double room (EP)', 'room'],
      'bf'        => ['Nashta (CP) — per vyakti', 'pax'],
      'meal'      => ['Lunch ya dinner (MAP) — per vyakti, ek meal', 'meal'],
      'peak_pct'  => ['Weekend / tyohaar pe kamre kitne % mehnge (Sat-Sun, Shravan, Navratri, Diwali)', 'set'],
    ],
  ],
  'puja' => [
    'title'  => 'Puja — apne pandit ji (dakshina + samagri)',
    'hint'   => 'Sirf apne pandit ji ki puja. Mahakal mandir ki puja / VIP darshan / purohit kabhi nahi — site rule.',
    'cols'   => ['cost' => 'Lagat'],
    'rows'   => [
      'kaalsarp' => ['Kaal Sarp Dosh puja', 'puja'],
      'mangal'   => ['Mangal Dosh puja (Bhat puja)', 'puja'],
      'pitru'    => ['Pitru Dosh / Tripindi shraddh', 'puja'],
    ],
  ],
  'other' => [
    'title'  => 'Doosre kharche',
    'hint'   => '',
    'cols'   => ['cost' => 'Lagat'],
    'rows'   => [
      'boat'  => ['Omkareshwar nauka vihar — per vyakti', 'pax'],
      'water' => ['Paani / welcome kit — per vyakti', 'pax'],
      'erick' => ['E-rickshaw (mandir ke aas-paas) — per trip', 'trip'],
    ],
  ],
  'rules' => [
    'title'  => 'Niyam — hisaab kaise bane',
    'hint'   => '',
    'cols'   => ['v' => 'Jawab'],
    'rows'   => [
      'markup_pct' => ['Net rate wali cheezon ke total pe kitna % jodna hai', 'set', ['v' => 30]],
      'round_to'   => ['Customer ka kul daam kis tak round karein (₹ — jaise 100)', 'set', ['v' => 100]],
      'min_profit' => ['Ek package pe kam se kam munafa (₹) — isse kam ho to warning', 'set'],
      'gst_pct'    => ['Customer daam pe GST % (0 = nahi jodna)', 'set'],
    ],
  ],
];

/**
 * Day plans the package builder offers. id => row (cab row it is priced from), end (city the group
 * sleeps in after it; null = they leave), omk (visits Omkareshwar → boat ride offered), and the
 * day heading + lines it writes into the quote, in both languages. Order = order in the picker.
 */
const UT_LOCAL_HI = "उज्जैन दर्शन:\nमहाकालेश्वर ज्योतिर्लिंग\nहरसिद्धि माता मंदिर\nकाल भैरव मंदिर\nमंगलनाथ मंदिर\nसांदीपनि आश्रम\nगढ़कालिका माता मंदिर\nचिंतामन गणेश मंदिर\nराम घाट";
const UT_LOCAL_EN = "Ujjain darshan:\nMahakaleshwar Jyotirlinga\nHarsiddhi Mata Mandir\nKal Bhairav Mandir\nMangalnath Mandir\nSandipani Ashram\nGadkalika Mata Mandir\nChintaman Ganesh Mandir\nRam Ghat";
const UT_COST_PLANS = [
  'local_7'      => ['row' => 'local_7', 'end' => 'ujjain', 'omk' => false, 'team' => 'Ujjain local darshan (7 ghante)',
    'hi' => 'उज्जैन स्थानीय दर्शन', 'en' => 'Ujjain local darshan', 'dhi' => UT_LOCAL_HI, 'den' => UT_LOCAL_EN],
  'local_12'     => ['row' => 'local_12', 'end' => 'ujjain', 'omk' => false, 'team' => 'Ujjain full day (12 ghante)',
    'hi' => 'उज्जैन पूरे दिन दर्शन', 'en' => 'Ujjain full-day darshan', 'dhi' => UT_LOCAL_HI, 'den' => UT_LOCAL_EN],
  'omk_round'    => ['row' => 'omk_round', 'end' => 'ujjain', 'omk' => true, 'team' => 'Omkareshwar darshan, raat Ujjain',
    'hi' => 'ओंकारेश्वर दर्शन, रात उज्जैन में', 'en' => 'Omkareshwar darshan, night in Ujjain',
    'dhi' => "उज्जैन से ओंकारेश्वर (लगभग 140 किमी)\nओंकारेश्वर ज्योतिर्लिंग दर्शन\nममलेश्वर मंदिर\nशाम को उज्जैन वापसी", 'den' => "Ujjain to Omkareshwar (about 140 km)\nOmkareshwar Jyotirlinga darshan\nMamleshwar Mandir\nBack to Ujjain by evening"],
  'omk_mah'      => ['row' => 'omk_mah', 'end' => 'ujjain', 'omk' => true, 'team' => 'Omkareshwar + Maheshwar, raat Ujjain',
    'hi' => 'ओंकारेश्वर और महेश्वर दर्शन', 'en' => 'Omkareshwar and Maheshwar darshan',
    'dhi' => "ओंकारेश्वर ज्योतिर्लिंग दर्शन\nममलेश्वर मंदिर\nमहेश्वर घाट और अहिल्या किला\nरात उज्जैन वापसी", 'den' => "Omkareshwar Jyotirlinga darshan\nMamleshwar Mandir\nMaheshwar ghat and Ahilya Fort\nBack to Ujjain at night"],
  'omk_oneway'   => ['row' => 'omk_oneway', 'end' => 'omk', 'omk' => true, 'team' => 'Ujjain → Omkareshwar, raat Omkareshwar',
    'hi' => 'उज्जैन से ओंकारेश्वर, रात ओंकारेश्वर में', 'en' => 'Ujjain to Omkareshwar, night in Omkareshwar',
    'dhi' => "उज्जैन से ओंकारेश्वर\nहोटल चेक-इन\nओंकारेश्वर ज्योतिर्लिंग दर्शन", 'den' => "Ujjain to Omkareshwar\nHotel check-in\nOmkareshwar Jyotirlinga darshan"],
  'omk_back'     => ['row' => 'omk_oneway', 'end' => 'ujjain', 'omk' => false, 'team' => 'Omkareshwar → Ujjain, raat Ujjain',
    'hi' => 'ओंकारेश्वर से उज्जैन', 'en' => 'Omkareshwar to Ujjain',
    'dhi' => "ममलेश्वर मंदिर दर्शन\nओंकारेश्वर से उज्जैन\nहोटल चेक-इन", 'den' => "Mamleshwar Mandir darshan\nOmkareshwar to Ujjain\nHotel check-in"],
  'mandu'        => ['row' => 'mandu', 'end' => 'ujjain', 'omk' => false, 'team' => 'Mandu, raat Ujjain',
    'hi' => 'मांडू भ्रमण', 'en' => 'Mandu day trip',
    'dhi' => "उज्जैन से मांडू\nजहाज़ महल, रानी रूपमती मंडप\nशाम को उज्जैन वापसी", 'den' => "Ujjain to Mandu\nJahaz Mahal, Rani Roopmati Pavilion\nBack to Ujjain by evening"],
  'nalkheda'     => ['row' => 'nalkheda', 'end' => 'ujjain', 'omk' => false, 'team' => 'Nalkheda (Baglamukhi), raat Ujjain',
    'hi' => 'नलखेड़ा माँ बगलामुखी दर्शन', 'en' => 'Nalkheda Maa Baglamukhi darshan',
    'dhi' => "उज्जैन से नलखेड़ा\nमाँ बगलामुखी मंदिर दर्शन\nशाम को उज्जैन वापसी", 'den' => "Ujjain to Nalkheda\nMaa Baglamukhi Mandir darshan\nBack to Ujjain by evening"],
  'indore_local' => ['row' => 'indore_local', 'end' => 'indore', 'omk' => false, 'team' => 'Indore local darshan, raat Indore',
    'hi' => 'इंदौर स्थानीय दर्शन', 'en' => 'Indore local darshan',
    'dhi' => "खजराना गणेश मंदिर\nअन्नपूर्णा मंदिर\nराजवाड़ा", 'den' => "Khajrana Ganesh Mandir\nAnnapurna Mandir\nRajwada"],
  'ind_omk_ujj'  => ['row' => 'ind_omk_ujj', 'end' => 'ujjain', 'omk' => true, 'team' => 'Indore pickup → Omkareshwar → Ujjain',
    'hi' => 'इंदौर पिकअप, ओंकारेश्वर दर्शन, रात उज्जैन में', 'en' => 'Indore pickup, Omkareshwar darshan, night in Ujjain',
    'dhi' => "इंदौर एयरपोर्ट / स्टेशन से पिकअप\nओंकारेश्वर ज्योतिर्लिंग दर्शन\nशाम को उज्जैन, होटल चेक-इन", 'den' => "Pickup from Indore airport / station\nOmkareshwar Jyotirlinga darshan\nUjjain by evening, hotel check-in"],
  'ujj_omk_ind'  => ['row' => 'ujj_omk_ind', 'end' => null, 'omk' => true, 'team' => 'Ujjain → Omkareshwar → Indore drop',
    'hi' => 'ओंकारेश्वर दर्शन और इंदौर ड्रॉप', 'en' => 'Omkareshwar darshan and Indore drop',
    'dhi' => "होटल चेक-आउट\nओंकारेश्वर ज्योतिर्लिंग दर्शन\nइंदौर एयरपोर्ट / स्टेशन ड्रॉप", 'den' => "Hotel check-out\nOmkareshwar Jyotirlinga darshan\nDrop at Indore airport / station"],
  'indore_pick'  => ['row' => 'indore_pick', 'end' => 'ujjain', 'omk' => false, 'team' => 'Indore pickup → Ujjain',
    'hi' => 'इंदौर पिकअप, उज्जैन होटल चेक-इन', 'en' => 'Indore pickup, Ujjain hotel check-in',
    'dhi' => "इंदौर एयरपोर्ट / स्टेशन से पिकअप\nउज्जैन होटल चेक-इन", 'den' => "Pickup from Indore airport / station\nUjjain hotel check-in"],
  'indore_drop'  => ['row' => 'indore_drop', 'end' => null, 'omk' => false, 'team' => 'Ujjain → Indore drop',
    'hi' => 'इंदौर ड्रॉप', 'en' => 'Indore drop',
    'dhi' => "होटल चेक-आउट\nइंदौर एयरपोर्ट / स्टेशन ड्रॉप", 'den' => "Hotel check-out\nDrop at Indore airport / station"],
  'ujj_transfer' => ['row' => 'ujj_transfer', 'end' => 'ujjain', 'omk' => false, 'team' => 'Sirf station ↔ hotel (Ujjain)',
    'hi' => 'उज्जैन स्टेशन से होटल', 'en' => 'Ujjain station to hotel',
    'dhi' => "उज्जैन स्टेशन / बस स्टैंड से पिकअप\nहोटल चेक-इन", 'den' => "Pickup from Ujjain station / bus stand\nHotel check-in"],
];

/** Hotel city => [room row, extra-bed row]. */
const UT_COST_HOTEL_ROWS = ['ujjain' => ['ujj_room', 'ujj_extra'], 'omk' => ['omk_room', 'omk_extra'], 'indore' => ['ind_room', null]];

function ut_costs_file() { return __DIR__ . '/../../ut-costs.json'; }

function ut_costs() {
  $j = json_decode((string) @file_get_contents(ut_costs_file()), true);
  if (!is_array($j)) $j = [];
  return ['rows' => $j['rows'] ?? [], 'updated_at' => $j['updated_at'] ?? null, 'by' => $j['by'] ?? null];
}

function ut_costs_save(array $data) {
  return @file_put_contents(ut_costs_file(), json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX) !== false;
}

/** One row as answered: rate per column (null = blank), kind ('net' | 'sell'), note. */
function ut_cost_row(array $data, $sec, $key) {
  $def = UT_COST_SECTIONS[$sec]['rows'][$key];
  $saved = $data['rows'][$sec . '.' . $key] ?? null;
  $cost = [];
  foreach (UT_COST_SECTIONS[$sec]['cols'] as $c => $label) {
    if ($saved !== null) $cost[$c] = isset($saved['cost'][$c]) ? (float) $saved['cost'][$c] : null;
    else $cost[$c] = isset($def[2][$c]) ? (float) $def[2][$c] : null;
  }
  return [
    'label'  => $def[0],
    'unit'   => $def[1],
    'cost'   => $cost,
    'kind'   => ($saved['kind'] ?? 'net') === 'sell' ? 'sell' : 'net',
    'note'   => $saved['note'] ?? ($saved === null && !empty($def[2]) && $sec !== 'rules' ? 'Vendor sheet 28-10' : ''),
    'seeded' => $saved === null && !empty($def[2]),
  ];
}

/** A plain answer from a 'set' row (rules, min km, peak %). */
function ut_cost_setting(array $data, $sec, $key) {
  $r = ut_cost_row($data, $sec, $key);
  return reset($r['cost']);
}

/** The % added on top of the net lines' total (rules → markup_pct; 30 until the team changes it). */
function ut_cost_markup(array $data) {
  $m = ut_cost_setting($data, 'rules', 'markup_pct');
  return $m === null ? 30.0 : (float) $m;
}

/**
 * Everything the quote calculator needs, flat: "sec.row.col" => [label, unit, rate, kind].
 * Only filled cells are offered; the markup is applied later, on the package total.
 */
function ut_cost_catalog(array $data) {
  $out = [];
  foreach (UT_COST_SECTIONS as $sec => $s) {
    foreach ($s['rows'] as $key => $def) {
      if ($def[1] === 'set') continue;
      $r = ut_cost_row($data, $sec, $key);
      foreach ($s['cols'] as $c => $clabel) {
        if ($r['cost'][$c] === null) continue;
        $out["$sec.$key.$c"] = [
          'label' => $r['label'] . (count($s['cols']) > 1 ? ' · ' . $clabel : ''),
          'unit' => $r['unit'], 'qty' => UT_COST_UNITS[$r['unit']][0], 'rate' => $r['cost'][$c], 'kind' => $r['kind'],
        ];
      }
    }
  }
  return $out;
}

/** [answered, total] — a row counts as answered once the team has saved a rate in any of its cells. */
function ut_cost_progress(array $data) {
  $done = 0; $all = 0;
  foreach (UT_COST_SECTIONS as $sec => $s) {
    foreach ($s['rows'] as $key => $def) {
      $all++;
      $r = ut_cost_row($data, $sec, $key);
      $has = count(array_filter($r['cost'], function ($v) { return $v !== null; })) > 0;
      if ($has && !$r['seeded']) $done++;
    }
  }
  return [$done, $all];
}
